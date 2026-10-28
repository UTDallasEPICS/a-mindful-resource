export const PROGRAM_CATEGORIES = [
  {
    name: "Men's Wellness",
    slug: 'mens-wellness',
    description:
      'Dedicated spaces and supportive circles for men to focus on mental health, personal growth, and authentic peer connection.',
  },
  {
    name: 'Youth & Families',
    slug: 'youth-families',
    description:
      'Empowering children, teens, and caregivers with emotional literacy, resilience practices, and collaborative support.',
  },
  {
    name: 'Community Wellness',
    slug: 'community-wellness',
    description:
      'Inclusive holistic health gatherings, sound healing, and educational wellness events welcoming all community members.',
  },
  {
    name: 'Recovery & Support',
    slug: 'recovery-support',
    description:
      'Compassionate, non-judgmental guidance and recovery circles fostering sustainable healing, hope, and connection.',
  },
  {
    name: 'Training & Education',
    slug: 'training-education',
    description:
      'Skill-building seminars, professional development, and community certifications in mental health and mindfulness.',
  },
] as const

export type ProgramCategory = (typeof PROGRAM_CATEGORIES)[number]['name']

export interface Program {
  id: string
  name: string
  category: ProgramCategory
  tagline: string
  audience: string
  delivery: string
  purpose: string
  nextStep: string
  slug: string
  href?: string
}

export const programsPageContent = {
  title: 'Programs',
  eyebrow: 'Our Offerings',
  intro:
    'Dedicated to cultivating wellness, emotional resilience, and community connection through accessible and inclusive programming.',
}

export const programs: Program[] = [
  // Men's Wellness
  {
    id: 'placeholder-1',
    name: 'Placeholder Program 1',
    category: "Men's Wellness",
    tagline: 'Building connection, community, and mental wellness for men.',
    audience: 'Adult men seeking connection and mutual support',
    delivery: 'In-person weekly group meetings',
    purpose:
      'Placeholder purpose describing peer support, open dialogue, and shared strategies for emotional well-being.',
    nextStep: 'Register online or attend open orientation',
    slug: 'placeholder-program-1',
    href: 'https://example.com/programs/placeholder-1',
  },
  {
    id: 'placeholder-2',
    name: 'Placeholder Program 2',
    category: "Men's Wellness",
    tagline: 'Active mindfulness and stress reduction in the outdoors.',
    audience: 'Men of all ages and fitness levels',
    delivery: 'Bi-weekly outdoor sessions',
    purpose:
      'Placeholder purpose describing guided mindfulness walks and outdoor stress-reduction activities.',
    nextStep: 'Contact program coordinator to join the next session',
    slug: 'placeholder-program-2',
    href: 'https://example.com/programs/placeholder-2',
  },

  // Youth & Families
  {
    id: 'placeholder-3',
    name: 'Placeholder Program 3',
    category: 'Youth & Families',
    tagline: 'Cultivating inner strength, resilience, and emotional agility.',
    audience: 'Teens ages 13–18',
    delivery: 'Interactive monthly workshops',
    purpose:
      'Placeholder purpose describing youth emotional resilience, life skills, and healthy coping mechanisms.',
    nextStep: 'Parent or guardian registration form',
    slug: 'placeholder-program-3',
    href: 'https://example.com/programs/placeholder-3',
  },
  {
    id: 'placeholder-4',
    name: 'Placeholder Program 4',
    category: 'Youth & Families',
    tagline: 'Fostering calm communication and harmony in everyday family life.',
    audience: 'Parents, caregivers, and children',
    delivery: 'Bi-weekly family gatherings',
    purpose:
      'Placeholder purpose describing mindful communication routines and supportive family relationships.',
    nextStep: 'Sign up for the upcoming family cohort',
    slug: 'placeholder-program-4',
  },

  // Community Wellness
  {
    id: 'placeholder-5',
    name: 'Placeholder Program 5',
    category: 'Community Wellness',
    tagline: 'Weekly sound baths and mindfulness gatherings open to all.',
    audience: 'All community members',
    delivery: 'Weekly drop-in sessions',
    purpose:
      'Placeholder purpose describing restorative sound baths, meditation, and inclusive stress relief.',
    nextStep: 'Drop in; no prior registration required',
    slug: 'placeholder-program-5',
    href: 'https://example.com/programs/placeholder-5',
  },
  {
    id: 'placeholder-6',
    name: 'Placeholder Program 6',
    category: 'Community Wellness',
    tagline: 'Bringing holistic resources and care days directly to neighbors.',
    audience: 'Neighborhood residents and families',
    delivery: 'Quarterly community events',
    purpose:
      'Placeholder purpose describing wellness fairs, free holistic health screenings, and partner resources.',
    nextStep: 'View community event calendar and RSVP',
    slug: 'placeholder-program-6',
  },

  // Recovery & Support
  {
    id: 'placeholder-7',
    name: 'Placeholder Program 7',
    category: 'Recovery & Support',
    tagline: 'Mindful peer companionship for sustained recovery and transitions.',
    audience: 'Individuals navigating addiction recovery and transitions',
    delivery: 'Weekly peer support circles',
    purpose:
      'Placeholder purpose describing non-judgmental peer recovery, mindfulness, and mutual accountability.',
    nextStep: 'Confidential inquiry or direct drop-in',
    slug: 'placeholder-program-7',
    href: 'https://example.com/programs/placeholder-7',
  },
  {
    id: 'placeholder-8',
    name: 'Placeholder Program 8',
    category: 'Recovery & Support',
    tagline: 'A gentle circle honoring grief and loss with deep empathy.',
    audience: 'Individuals experiencing grief, loss, or major life changes',
    delivery: 'Bi-weekly guided group',
    purpose:
      'Placeholder purpose describing compassionate companioning through grief in a gentle community environment.',
    nextStep: 'Connect with facilitator for group intake',
    slug: 'placeholder-program-8',
  },

  // Training & Education
  {
    id: 'placeholder-9',
    name: 'Placeholder Program 9',
    category: 'Training & Education',
    tagline: 'Practical mental health first response skills for community members.',
    audience: 'Community members, teachers, and frontline workers',
    delivery: 'Certified bi-monthly training',
    purpose:
      'Placeholder purpose describing practical education on identifying, understanding, and responding to mental health signs.',
    nextStep: 'Enroll in next accredited certification cohort',
    slug: 'placeholder-program-9',
    href: 'https://example.com/programs/placeholder-9',
  },
  {
    id: 'placeholder-10',
    name: 'Placeholder Program 10',
    category: 'Training & Education',
    tagline: 'Empowering community facilitators with trauma-informed mindfulness.',
    audience: 'Educators, leaders, and community organizers',
    delivery: 'Multi-week hybrid seminar',
    purpose:
      'Placeholder purpose describing trauma-informed leadership, mindful workplace practices, and facilitation skills.',
    nextStep: 'Submit application for upcoming training series',
    slug: 'placeholder-program-10',
    href: 'https://example.com/programs/placeholder-10',
  },
]
