export interface ProgramItem {
  id: string
  title: string
  description: string
  format?: string
  schedule?: string
}

export interface ProgramCategory {
  id: string
  title: string
  description: string
  programs: ProgramItem[]
}

export interface ProgramsPageData {
  title: string
  eyebrow: string
  intro: string
  categories: ProgramCategory[]
}

export const programsData: ProgramsPageData = {
  title: 'Programs',
  eyebrow: 'Our Offerings',
  intro:
    'Dedicated to cultivating wellness, emotional resilience, and community connection through accessible and inclusive programming.',
  categories: [
    {
      id: 'mens-wellness',
      title: "Men's Wellness",
      description:
        'Dedicated spaces and supportive circles for men to focus on mental health, personal growth, and authentic peer connection.',
      programs: [
        {
          id: 'mens-peer-support',
          title: "Men's Peer Support Circles",
          description:
            'A confidential weekly group providing a safe space for open dialogue, shared experiences, and mutual encouragement.',
          format: 'In-person & Virtual',
          schedule: 'Weekly on Thursdays',
        },
        {
          id: 'mens-mindfulness-movement',
          title: 'Mindfulness & Movement',
          description:
            'Guided outdoor group walks and active mindfulness exercises designed to reduce stress and foster camaraderie.',
          format: 'In-person',
          schedule: 'Bi-weekly on Saturdays',
        },
      ],
    },
    {
      id: 'youth-families',
      title: 'Youth & Families',
      description:
        'Empowering children, teens, and caregivers with emotional literacy, resilience practices, and collaborative support.',
      programs: [
        {
          id: 'youth-resilience-workshops',
          title: 'Youth Resilience Workshops',
          description:
            'Interactive group sessions helping young people navigate life challenges, develop healthy coping tools, and build confidence.',
          format: 'In-person',
          schedule: 'Monthly Series',
        },
        {
          id: 'family-mindfulness-connection',
          title: 'Family Mindfulness & Connection',
          description:
            'Engaging workshops for parents, caregivers, and youth to cultivate calm, mindful communication, and stronger family bonds.',
          format: 'In-person',
          schedule: 'Monthly on Sundays',
        },
      ],
    },
    {
      id: 'community-wellness',
      title: 'Community Wellness',
      description:
        'Inclusive holistic health gatherings, sound healing, and educational wellness events welcoming all community members.',
      programs: [
        {
          id: 'community-meditation-sound',
          title: 'Community Meditation & Sound Baths',
          description:
            'Restorative sound baths and guided meditation sessions open to neighbors of all backgrounds and experience levels.',
          format: 'In-person',
          schedule: 'Weekly on Tuesdays',
        },
        {
          id: 'community-care-days',
          title: 'Community Care & Wellness Fairs',
          description:
            'Neighborhood gatherings featuring holistic wellness resources, gentle movement, and local health partner support.',
          format: 'In-person',
          schedule: 'Quarterly',
        },
      ],
    },
    {
      id: 'recovery-support',
      title: 'Recovery & Support',
      description:
        'Compassionate, non-judgmental guidance and recovery circles fostering sustainable healing, hope, and connection.',
      programs: [
        {
          id: 'mindful-recovery-circles',
          title: 'Mindful Recovery Circles',
          description:
            'Integrative peer support incorporating mindfulness, nervous system regulation, and mutual encouragement for sustained recovery.',
          format: 'In-person & Virtual',
          schedule: 'Weekly on Wednesdays',
        },
        {
          id: 'grief-healing-groups',
          title: 'Grief & Healing Circles',
          description:
            'A gentle, compassionate circle honoring personal grief and life transitions alongside understanding peers.',
          format: 'In-person',
          schedule: 'Bi-weekly on Mondays',
        },
      ],
    },
    {
      id: 'training-education',
      title: 'Training & Education',
      description:
        'Skill-building seminars, professional development, and community certifications in mental health and mindfulness.',
      programs: [
        {
          id: 'mental-health-first-aid',
          title: 'Community Mental Health First Aid',
          description:
            'Accredited training equipping participants with practical tools to identify, understand, and respond to mental health challenges.',
          format: 'In-person & Virtual',
          schedule: 'Bi-monthly Cohorts',
        },
        {
          id: 'mindful-leadership-training',
          title: 'Mindful Leadership & Facilitation',
          description:
            'Specialized workshops for educators, team leaders, and community organizers to bring mindful practices into their workplaces.',
          format: 'Hybrid',
          schedule: 'Spring & Fall Series',
        },
      ],
    },
  ],
}

export const programCategories = programsData.categories
