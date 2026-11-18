import { z } from 'zod'

// Validate individual events returned by Eventbrite.
const eventbriteEventSchema = z.object({
  id: z.string(),
  name: z.object({
    text: z.string().nullish(),
  }),
  description: z
    .object({
      text: z.string().nullish(),
    })
    .nullish(),
  start: z.object({
    local: z.string(),
    utc: z.string().datetime({ offset: true }),
  }),
  end: z.object({
    local: z.string(),
    utc: z.string().datetime({ offset: true }),
  }),
  url: z.url(),
  venue: z
    .object({
      name: z.string().nullish(),
    })
    .nullish(),
  logo: z
    .object({
      url: z.string().nullish(),
    })
    .nullish(),
})

// Validate the complete API response.
const eventbriteResponseSchema = z.object({
  events: z.array(eventbriteEventSchema),
  pagination: z.object({
    has_more_items: z.boolean(),
    continuation: z.string().nullish(),
  }),
})

// Derive the TypeScript type directly from the schema.
// This prevents mismatches between validation and types.
export type EventbriteEvent = z.infer<typeof eventbriteEventSchema>

export async function fetchEventbriteEvents(): Promise<EventbriteEvent[]> {
  const config = useRuntimeConfig()

  // No credentials configured.
  if (!config.eventbriteToken || !config.eventbriteOrganizationId) {
    return []
  }

  const allEvents: EventbriteEvent[] = []
  let continuation: string | undefined

  try {
    // Retrieve up to 10 pages of Eventbrite events.
    for (let page = 0; page < 10; page++) {
      const rawResponse = await $fetch<unknown>(
        `https://www.eventbriteapi.com/v3/organizations/${config.eventbriteOrganizationId}/events/`,
        {
          headers: {
            Authorization: `Bearer ${config.eventbriteToken}`,
          },
          query: {
            status: 'live',
            order_by: 'start_asc',
            expand: 'venue',
            ...(continuation ? { continuation } : {}),
          },
          timeout: 10000,
          retry: 0,
        }
      )

      // Reject unexpected or malformed API responses.
      const response = eventbriteResponseSchema.parse(rawResponse)

      allEvents.push(...response.events)

      // Stop when no additional pages are available.
      if (!response.pagination.has_more_items || !response.pagination.continuation) {
        break
      }

      continuation = response.pagination.continuation
    }

    // Filter out events that have already ended.
    const now = Date.now()

    return allEvents
      .filter((event) => {
        return new Date(event.end.utc).getTime() > now
      })
      .sort((a, b) => {
        return new Date(a.start.utc).getTime() - new Date(b.start.utc).getTime()
      })
  } catch {
    // Do not expose credentials, headers, or raw API responses.
    console.error('[Eventbrite] Failed to retrieve or validate events')

    throw createError({
      statusCode: 502,
      statusMessage: 'Unable to retrieve events from Eventbrite',
    })
  }
}
