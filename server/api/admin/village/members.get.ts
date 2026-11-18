import { db } from '../../../utils/db'
import { villageMember } from '../../../db/schema'
import { desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  if (event.context.user?.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Admin access required',
    })
  }

  const members = await db.query.villageMember.findMany({
    orderBy: [desc(villageMember.createdAt)],
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          createdAt: true,
        },
      },
      reviewer: {
        columns: {
          id: true,
          name: true,
          email: true,
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
    name: m.user?.name ?? 'Unknown',
    email: m.user?.email ?? '',
    userRole: m.user?.role ?? 'user',
    userCreatedAt: m.user?.createdAt,
    hasImage: m.user?.image != null,
    phoneNumber: m.phoneNumber,
    credentials: m.credentials,
    organization: m.organization,
    city: m.city,
    preferredContactMethod: m.preferredContactMethod,
    website: m.website,
    reasonForJoining: m.reasonForJoining,
    availability: m.availability,
    applicationStatus: m.applicationStatus,
    reviewedBy: m.reviewedBy,
    reviewerName: m.reviewer?.name ?? null,
    reviewedAt: m.reviewedAt,
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
    roles: m.roles.map((r) => r.role),
  }))
})

