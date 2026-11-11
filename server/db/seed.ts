import 'dotenv/config'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'
import { hashPassword } from 'better-auth/crypto'

const connectionString = process.env.DATABASE_URL!.replace('file:', '')
const sqlite = new Database(connectionString)
const db = drizzle(sqlite, { schema })

const villageMembers = [
  {
    name: 'Corby Ryan Jackson',
    email: 'corby@reflexivetruths.com',
    phoneNumber: '214-555-0101',
    credentials: 'LPC, LCPC, LPCC, CMHC',
    organization: 'Reflexive Truths PLLC',
    city: 'Dallas',
    preferredContactMethod: 'phone' as const,
    website: 'https://reflexivetruths.com',
    availability: 'available' as const,
    roles: ['clinician'] as const,
  },
  {
    name: 'Dominique Johnson',
    email: 'dominique.j@example.com',
    phoneNumber: '469-555-0102',
    credentials: 'RN',
    organization: null,
    city: 'Dallas',
    preferredContactMethod: 'email' as const,
    website: null,
    availability: 'available' as const,
    roles: ['clinician'] as const,
  },
  {
    name: 'Donald "DJ" Walker',
    email: 'dj.walker@example.com',
    phoneNumber: '972-555-0103',
    credentials: 'PHD',
    organization: null,
    city: 'Dallas',
    preferredContactMethod: 'email' as const,
    website: null,
    availability: 'available' as const,
    roles: ['clinician'] as const,
  },
  {
    name: 'Jamarri Aikins',
    email: 'jamarri.a@example.com',
    phoneNumber: '214-555-0104',
    credentials: 'PH.D.',
    organization: null,
    city: 'Dallas',
    preferredContactMethod: 'email' as const,
    website: null,
    availability: 'available' as const,
    roles: ['clinician'] as const,
  },
  {
    name: 'Keith Clark',
    email: 'keith.c@example.com',
    phoneNumber: null,
    credentials: 'LMT 111749',
    organization: null,
    city: 'Dallas',
    preferredContactMethod: 'email' as const,
    website: null,
    availability: 'available' as const,
    roles: ['wellness'] as const,
  },
  {
    name: 'Neelesh Polireddy',
    email: 'neelesh.p@example.com',
    phoneNumber: '469-555-0106',
    credentials: null,
    organization: 'North Texas Wellness Collective',
    city: 'Plano',
    preferredContactMethod: 'email' as const,
    website: 'https://ntwc.example.com',
    availability: 'available' as const,
    roles: ['wellness'] as const,
  },
  {
    name: 'Angela Martinez',
    email: 'angela.m@example.com',
    phoneNumber: '817-555-0107',
    credentials: 'M.Div',
    organization: 'Grace Community Church',
    city: 'Fort Worth',
    preferredContactMethod: 'phone' as const,
    website: null,
    availability: 'unavailable' as const,
    roles: ['faith_leader', 'coach'] as const,
  },
]

async function main() {
  console.log('Start seeding...')

  const defaultPasswordHash = await hashPassword('password123')

  //keep the original seeded user
  let seededUserId: string
  const existingUser = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.email, 'seeded-user@email.com'),
  })

  if (!existingUser) {
    const [created] = await db
      .insert(schema.user)
      .values({
        email: 'seeded-user@email.com',
        name: 'Sample Seeded User',
        role: 'user',
      })
      .returning()
    seededUserId = created!.id
    console.log({ user: created })
  } else {
    seededUserId = existingUser.id
    console.log({ user: existingUser })
  }

  const existingUserAccount = await db.query.account.findFirst({
    where: (acc, { eq }) => eq(acc.userId, seededUserId),
  })
  if (!existingUserAccount) {
    await db.insert(schema.account).values({
      accountId: seededUserId,
      providerId: 'credential',
      userId: seededUserId,
      password: defaultPasswordHash,
    })
    console.log('Created credential account for seeded-user@email.com')
  }

  //seed an admin user
  let adminUserId: string
  const existingAdmin = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.email, 'admin@example.com'),
  })

  if (!existingAdmin) {
    const [createdAdmin] = await db
      .insert(schema.user)
      .values({
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
      })
      .returning()
    adminUserId = createdAdmin!.id
    console.log({ admin: createdAdmin })
  } else {
    adminUserId = existingAdmin.id
  }

  const existingAdminAccount = await db.query.account.findFirst({
    where: (acc, { eq }) => eq(acc.userId, adminUserId),
  })
  if (!existingAdminAccount) {
    await db.insert(schema.account).values({
      accountId: adminUserId,
      providerId: 'credential',
      userId: adminUserId,
      password: defaultPasswordHash,
    })
    console.log('Created credential account for admin@example.com')
  }

  //seed village members
  for (const m of villageMembers) {
    const existing = await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.email, m.email),
    })

    let userId: string

    if (existing) {
      userId = existing.id
      console.log(`User "${m.name}" already exists (${userId}), skipping user insert.`)
    } else {
      const [created] = await db
        .insert(schema.user)
        .values({
          name: m.name,
          email: m.email,
          role: 'user',
        })
        .returning()
      userId = created!.id
      console.log(`Created user "${m.name}" (${userId})`)
    }

    //upsert village_member (sqlite doesn't have ON CONFLICT for non-unique, so check first)
    const existingMember = await db.query.villageMember.findFirst({
      where: (vm, { eq }) => eq(vm.userId, userId),
    })

    if (!existingMember) {
      await db.insert(schema.villageMember).values({
        userId,
        phoneNumber: m.phoneNumber,
        credentials: m.credentials,
        organization: m.organization,
        city: m.city,
        preferredContactMethod: m.preferredContactMethod,
        website: m.website,
        availability: m.availability,
        applicationStatus: 'approved',
      })
      console.log(`  → village_member created`)
    } else {
      console.log(`  → village_member already exists, skipping.`)
    }

    //insert roles
    for (const role of m.roles) {
      const existingRole = await db.query.villageMemberRole.findFirst({
        where: (vmr, { and, eq }) => and(eq(vmr.userId, userId), eq(vmr.role, role)),
      })
      if (!existingRole) {
        await db.insert(schema.villageMemberRole).values({ userId, role })
        console.log(`  → role "${role}" added`)
      }
    }
  }

  console.log('Seeding finished.')
}

main()
  .then(() => {
    sqlite.close()
  })
  .catch((e) => {
    console.error(e)
    sqlite.close()
    process.exit(1)
  })
