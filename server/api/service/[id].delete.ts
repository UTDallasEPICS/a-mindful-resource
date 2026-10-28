import { eq } from 'drizzle-orm'
import { services } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  // TODO: Add auth
  const serviceID = getRouterParam(event, 'id')

  if (!serviceID) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'A valid UUID is required.',
    })
  }

  const [provider] = await db.delete(services).where(eq(services.id, serviceID)).returning()

  if (!provider) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Service not found',
      message: `No service exists with ID ${serviceID}`,
    })
  }

  setResponseStatus(event, 204)
})
