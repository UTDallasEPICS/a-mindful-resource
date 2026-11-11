import { db } from '../../utils/db'
import { user } from '../../db/schema'

export default defineEventHandler(async (event) => {
  if (event.context.user?.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Admin access required',
    })
  }

  const users = await db
    .select({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    })
    .from(user)

  return users
})

