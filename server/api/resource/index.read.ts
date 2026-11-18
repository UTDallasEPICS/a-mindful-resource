import { db } from '../../utils/db'
import { events } from '../../db/schema'
import { like, or } from 'drizzle-orm'
import type { InferSelectModel } from 'drizzle-orm'

// Define the resource/event type based on your Drizzle schema
type EventResource = InferSelectModel<typeof events>

// Mock fallback data so your directory search works immediately before database seeding
const MOCK_RESOURCES = [
  {
    id: '1',
    title: 'Caregiver Guide: Autism & Disabilities',
    category: 'Families',
    description:
      'For parents and caregivers raising children with autism and other disabilities, written with our community in mind.',
    location: 'Online / Community',
  },
  {
    id: '2',
    title: 'A Guide for Anyone Carrying Pain — or Loving Someone Who Is',
    category: 'Mental Health & Substance Use',
    description:
      'Understanding the link between substance use and mental health with compassion, not shame, and real paths to healing.',
    location: 'National / Online',
  },
  {
    id: '3',
    title: 'A Guide for Believers, Families & Faith Leaders',
    category: 'Faith & Community',
    description:
      'Honoring the strength of our faith while making room for mental health care — because both can be true.',
    location: 'Local Churches / Online',
  },
  {
    id: '4',
    title: 'A Guide for Parents, Mentors & Village',
    category: 'Youth',
    description:
      'Understanding what today’s young people are facing and how to show up for them, long before it becomes a crisis.',
    location: 'Community Centers',
  },
  {
    id: '5',
    title: 'A Guide for First-Timers & the Therapy-Curious',
    category: 'Therapy & Care',
    description:
      'What therapy really is, how to find the right person, and how to make it affordable — demystified.',
    location: 'Online',
  },
  {
    id: '6',
    title: 'A Guide for the Ones Who Hold Everyone Else',
    category: 'Caregivers',
    description:
      'Tools, support, and permission to care for yourself while you care for someone you love.',
    location: 'Support Groups',
  },
]

export async function readResources(query?: string) {
  try {
    let results: EventResource[] = []

    // Attempt to query the database using Drizzle
    if (db) {
      if (query) {
        results = await db
          .select()
          .from(events)
          .where(
            or(
              like(events.title, `%${query}%`),
              like(events.description, `%${query}%`),
              like(events.location, `%${query}%`)
            )
          )
      } else {
        results = await db.select().from(events)
      }
    }

    // If the database is empty or returns nothing, fall back to mock data
    if (!results || results.length === 0) {
      if (query) {
        const lowerQ = query.toLowerCase()
        return MOCK_RESOURCES.filter(
          (item) =>
            item.title.toLowerCase().includes(lowerQ) ||
            item.description.toLowerCase().includes(lowerQ) ||
            item.category.toLowerCase().includes(lowerQ)
        )
      }
      return MOCK_RESOURCES
    }

    return results
  } catch (error) {
    console.warn('Database query failed or table not found, falling back to mock resources:', error)

    // Fallback filtering on mock data if database throws any errors
    if (query) {
      const lowerQ = query.toLowerCase()
      return MOCK_RESOURCES.filter(
        (item) =>
          item.title.toLowerCase().includes(lowerQ) ||
          item.description.toLowerCase().includes(lowerQ) ||
          item.category.toLowerCase().includes(lowerQ)
      )
    }
    return MOCK_RESOURCES
  }
}
