// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { applicationStatuses, villageMember, user } from '../../server/db/schema'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { eq } from 'drizzle-orm'
import * as schema from '../../server/db/schema'

describe('admin village verifications & status lifecycle', () => {
  it('defines application statuses including pending, approved, and rejected', () => {
    expect(applicationStatuses).toContain('pending')
    expect(applicationStatuses).toContain('approved')
    expect(applicationStatuses).toContain('rejected')
  })

  it('allows approving and revoking member access in sqlite schema', () => {
    const sqlite = new Database(':memory:')

    // Create minimal schema for test
    sqlite.exec(`
      CREATE TABLE user (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        emailVerified INTEGER NOT NULL DEFAULT 0,
        image TEXT,
        role TEXT NOT NULL DEFAULT 'user',
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL
      );

      CREATE TABLE village_member (
        userId TEXT PRIMARY KEY REFERENCES user(id) ON DELETE CASCADE,
        phoneNumber TEXT,
        credentials TEXT,
        organization TEXT,
        city TEXT,
        preferredContactMethod TEXT,
        website TEXT,
        reasonForJoining TEXT,
        availability TEXT NOT NULL DEFAULT 'available',
        applicationStatus TEXT NOT NULL DEFAULT 'pending',
        reviewedBy TEXT REFERENCES user(id),
        reviewedAt INTEGER,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL
      );
    `)

    const testDb = drizzle(sqlite, { schema })

    const testAdminId = 'admin-123'
    const testApplicantId = 'applicant-456'

    // Insert admin and applicant
    testDb
      .insert(user)
      .values({
        id: testAdminId,
        name: 'Admin User',
        email: 'admin@test.com',
        role: 'admin',
      })
      .run()

    testDb
      .insert(user)
      .values({
        id: testApplicantId,
        name: 'Dr. Jane Wellness',
        email: 'jane@wellness.org',
        role: 'user',
      })
      .run()

    // 1. Applicant submits village application (pending)
    testDb
      .insert(villageMember)
      .values({
        userId: testApplicantId,
        credentials: 'LPC, NCC',
        organization: 'Jane Counseling LLC',
        city: 'Dallas',
        preferredContactMethod: 'email',
        availability: 'available',
        applicationStatus: 'pending',
      })
      .run()

    const initial = testDb
      .select()
      .from(villageMember)
      .where(eq(villageMember.userId, testApplicantId))
      .get()
    expect(initial?.applicationStatus).toBe('pending')
    expect(initial?.reviewedBy).toBeNull()

    // 2. Admin approves member
    const approvedAt = new Date()
    testDb
      .update(villageMember)
      .set({
        applicationStatus: 'approved',
        reviewedBy: testAdminId,
        reviewedAt: approvedAt,
        updatedAt: approvedAt,
      })
      .where(eq(villageMember.userId, testApplicantId))
      .run()

    const approved = testDb
      .select()
      .from(villageMember)
      .where(eq(villageMember.userId, testApplicantId))
      .get()
    expect(approved?.applicationStatus).toBe('approved')
    expect(approved?.reviewedBy).toBe(testAdminId)
    expect(approved?.reviewedAt).toBeDefined()

    // 3. Admin revokes member access
    const revokedAt = new Date()
    testDb
      .update(villageMember)
      .set({
        applicationStatus: 'rejected',
        reviewedBy: testAdminId,
        reviewedAt: revokedAt,
        updatedAt: revokedAt,
      })
      .where(eq(villageMember.userId, testApplicantId))
      .run()

    const revoked = testDb
      .select()
      .from(villageMember)
      .where(eq(villageMember.userId, testApplicantId))
      .get()
    expect(revoked?.applicationStatus).toBe('rejected')
    expect(revoked?.reviewedBy).toBe(testAdminId)

    sqlite.close()
  })
})
