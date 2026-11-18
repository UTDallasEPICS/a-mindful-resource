import { db } from '../../../utils/db'
import { villageMember, applicationStatuses } from '../../../db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const verifySchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  status: z.enum(applicationStatuses),
})

export default defineEventHandler(async (event) => {
  if (event.context.user?.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Admin access required',
    })
  }

  const body = await readBody(event)
  const parsed = verifySchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parsed.error.issues[0]?.message || 'Invalid payload',
    })
  }

  const { userId, status } = parsed.data

  const existing = await db.query.villageMember.findFirst({
    where: eq(villageMember.userId, userId),
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Village member record not found',
    })
  }

  const now = new Date()
  await db
    .update(villageMember)
    .set({
      applicationStatus: status,
      reviewedBy: event.context.user.id,
      reviewedAt: now,
      updatedAt: now,
    })
    .where(eq(villageMember.userId, userId))

  return {
    success: true,
    userId,
    status,
    reviewedBy: event.context.user.id,
    reviewedAt: now,
  }
})

