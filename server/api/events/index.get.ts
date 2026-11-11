import { db } from '../../utils/db'
import { events } from '../../db/schema'
import { and, asc, eq, gte } from 'drizzle-orm'

export default defineEventHandler(async () => {
  // Only published events that have not happened yet, soonest first.
  return db
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
    .where(and(eq(events.status, 'Published'), gte(events.date, new Date())))
    .orderBy(asc(events.date))
})
