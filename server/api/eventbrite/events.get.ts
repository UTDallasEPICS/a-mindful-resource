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

export default defineEventHandler((): EventItem[] => {
  // Temporary mock data until AMRI provides Eventbrite credentials.
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
      // Replace with an actual Eventbrite registration URL.
    },
  ]
}) 
