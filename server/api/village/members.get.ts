import { db } from '../../utils/db'
import { villageMember } from '../../db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const members = await db.query.villageMember.findMany({
    where: eq(villageMember.applicationStatus, 'approved'),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      roles: {
        columns: {
          role: true,
        },
      },
    },
  })

  return members.map((m) => ({
    userId: m.userId,
    name: m.user.name,
    email: m.user.email,
    phoneNumber: m.phoneNumber,
    hasImage: m.user.image != null,
    credentials: m.credentials,
    organization: m.organization,
    city: m.city,
    preferredContactMethod: m.preferredContactMethod,
    website: m.website,
    availability: m.availability,
    roles: m.roles.map((r) => r.role),
  }))
})
