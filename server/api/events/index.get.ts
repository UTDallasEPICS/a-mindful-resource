import { db } from '../../utils/db'
import { events } from '../../db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const publishedEvents = await db
    .select({
      id: events.id,
      title: events.title,
      description: events.description,
      date: events.date,
      location: events.location,
      status: events.status,
      eventbriteUrl: events.eventbriteUrl,
    })
    .from(events)
    .where(eq(events.status, 'Published'))

  return publishedEvents
})
