// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { userRoles, villageRoles, contactMethods, villageAvailabilities } from '../../server/db/schema'

describe('village schema & roles configuration', () => {
  it('defines user roles as only user and admin (village removed as user type)', () => {
    expect(userRoles).toContain('user')
    expect(userRoles).toContain('admin')
    // Village is a membership, not a user login type
    expect(userRoles).not.toContain('village')
  })

  it('defines valid village professional roles', () => {
    expect(villageRoles).toContain('clinician')
    expect(villageRoles).toContain('wellness')
    expect(villageRoles).toContain('coach')
    expect(villageRoles).toContain('faith_leader')
  })

  it('defines contact methods and availability states', () => {
    expect(contactMethods).toEqual(['email', 'phone'])
    expect(villageAvailabilities).toEqual(['available', 'unavailable'])
  })
})

