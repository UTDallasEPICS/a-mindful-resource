import { db } from '../../utils/db'
import { villageMember } from '../../db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = event.context.user

  if (!user) {
    return {
      authenticated: false,
      role: null,
      isMember: false,
      applicationStatus: 'none' as const,
      member: null,
    }
  }

  const member = await db.query.villageMember.findFirst({
    where: eq(villageMember.userId, user.id),
    with: {
      roles: {
        columns: {
          role: true,
        },
      },
    },
  })

  const userRole = (user as unknown as { role?: string }).role ?? 'user'
  const isApproved = member?.applicationStatus === 'approved'
  // Admins or approved village members have member access to the directory
  const isMember = isApproved || userRole === 'admin'

  return {
    authenticated: true,
    role: userRole,
    isMember,
    applicationStatus: member ? member.applicationStatus : ('none' as const),
    member: member
      ? {
          phoneNumber: member.phoneNumber,
          credentials: member.credentials,
          organization: member.organization,
          city: member.city,
          preferredContactMethod: member.preferredContactMethod,
          website: member.website,
          availability: member.availability,
          reasonForJoining: member.reasonForJoining,
          roles: member.roles.map((r) => r.role),
        }
      : null,
  }
})

