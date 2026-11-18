import { fetchEventbriteEvents } from '../../utils/eventbrite'

type EventItem = {
  id: string
  title: string
  category: string
  date: string
  time: string
  location: string
  description: string
  image?: string
  registrationUrl?: string
}

export default defineEventHandler(async (): Promise<EventItem[]> => {
  const config = useRuntimeConfig()

  // Until AMRI provides credentials, use mock data in development only.
  if (!config.eventbriteToken || !config.eventbriteOrganizationId) {
    if (!import.meta.dev) {
      return []
    }

    return [
      {
        id: 'mock-bro-chill-1',
        title: 'Bro Chill Community Circle',
        category: 'Bro Chill',
        date: 'December 10, 2026',
        time: '6:30–8:00 PM',
        location: 'West Dallas Multipurpose Center',
        description:
          'A welcoming space for men to connect, share experiences, and support one another.',
      },
    ]
  }

  // Retrieve real events when Eventbrite credentials are configured.
  const eventbriteEvents = await fetchEventbriteEvents()

  return eventbriteEvents.map((event): EventItem => {
    // Eventbrite local timestamps represent the event's local time.
    const start = event.start.local
    const end = event.end.local

    const formatDate = (value: string) => {
      const [year = 0, month = 1, day = 1] = value.slice(0, 10).split('-').map(Number)

      return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(new Date(Date.UTC(year, month - 1, day)))
    }

    const formatTime = (value: string) => {
      const [hours = 0, minutes = 0] = value.slice(11, 16).split(':').map(Number)

      const period = hours >= 12 ? 'PM' : 'AM'
      const displayHour = hours % 12 || 12

      return `${displayHour}:${String(minutes).padStart(2, '0')} ${period}`
    }

    return {
      id: event.id,
      title: event.name.text || 'Untitled Event',
      category: 'Community Event',
      date: formatDate(start),
      time: `${formatTime(start)} – ${formatTime(end)}`,
      location: event.venue?.name || 'Location to be announced',
      description: event.description?.text || '',
      image: event.logo?.url,
      registrationUrl: event.url,
    }
  })
})
