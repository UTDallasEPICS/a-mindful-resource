import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchEventbriteEvents } from '../server/utils/eventbrite'

const mockConfig = {
  eventbriteToken: '',
  eventbriteOrganizationId: '',
}

describe('Eventbrite API utility', () => {
  beforeEach(() => {
    mockConfig.eventbriteToken = ''
    mockConfig.eventbriteOrganizationId = ''

    vi.stubGlobal('useRuntimeConfig', () => mockConfig)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns an empty array when credentials are missing', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('$fetch', fetchMock)

    const events = await fetchEventbriteEvents()

    expect(events).toEqual([])
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('filters out past events and keeps upcoming events', async () => {
    mockConfig.eventbriteToken = 'test-token'
    mockConfig.eventbriteOrganizationId = 'test-org'

    const now = Date.now()

    const makeEvent = (id: string, start: number, end: number) => ({
      id,
      name: { text: `Event ${id}` },
      description: { text: 'Test event' },
      start: {
        local: new Date(start).toISOString(),
        utc: new Date(start).toISOString(),
      },
      end: {
        local: new Date(end).toISOString(),
        utc: new Date(end).toISOString(),
      },
      url: `https://www.eventbrite.com/e/${id}`,
      venue: { name: 'Test Venue' },
      logo: null,
    })

    const pastEvent = makeEvent('past', now - 7200000, now - 3600000)

    const upcomingEvent = makeEvent('upcoming', now + 3600000, now + 7200000)

    const fetchMock = vi.fn().mockResolvedValue({
      events: [pastEvent, upcomingEvent],
      pagination: {
        has_more_items: false,
        continuation: null,
      },
    })

    vi.stubGlobal('$fetch', fetchMock)

    const events = await fetchEventbriteEvents()

    expect(events).toHaveLength(1)
    expect(events[0]?.id).toBe('upcoming')
    expect(fetchMock).toHaveBeenCalledOnce()
  })
})
