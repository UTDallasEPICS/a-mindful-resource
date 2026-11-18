type EventbriteText = {
  text?: string | null
}

export type EventbriteEvent = {
  id: string
  name: EventbriteText
  description?: EventbriteText
  start: {
    local: string
    utc: string
  }
  end: {
    local: string
    utc: string
  }
  url: string
  venue?: {
    name?: string
  } | null
  logo?: {
    url?: string
  } | null
}

type EventbriteResponse = {
  events: EventbriteEvent[]
  pagination: {
    has_more_items: boolean
    continuation?: string
  }
}

export async function fetchEventbriteEvents(): Promise<EventbriteEvent[]> {
  const config = useRuntimeConfig()

  if (!config.eventbriteToken || !config.eventbriteOrganizationId) {
    return []
  }

  const allEvents: EventbriteEvent[] = []
  let continuation: string | undefined

  // Retrieve up to 10 pages of Eventbrite events.
  for (let page = 0; page < 10; page++) {
    const response = await $fetch<EventbriteResponse>(
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
      }
    )

    allEvents.push(...response.events)

    if (!response.pagination.has_more_items || !response.pagination.continuation) {
      break
    }

    continuation = response.pagination.continuation
  }

  // Only display events that have not ended.
  const now = Date.now()

  return allEvents
    .filter((event) => {
      return new Date(event.end.utc).getTime() > now
    })
    .sort((a, b) => {
      return new Date(a.start.utc).getTime() - new Date(b.start.utc).getTime()
    })
}
