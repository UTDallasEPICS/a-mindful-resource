export const CATEGORIES = {
  mensWellness: {
    name: "Men's Wellness",
    slug: 'mens-wellness',
    description:
      'Dedicated spaces and supportive circles for men to focus on mental health, personal growth, and authentic peer connection.',
  },
  youthFamilies: {
    name: 'Youth & Families',
    slug: 'youth-families',
    description:
      'Empowering children, teens, and caregivers with emotional literacy, resilience practices, and collaborative support.',
  },
  communityWellness: {
    name: 'Community Wellness',
    slug: 'community-wellness',
    description:
      'Accessible community initiatives, digital wellness tools, and mobile outreach welcoming all community members.',
  },
  careNavigation: {
    name: 'Care Navigation & Support',
    slug: 'care-navigation-support',
    description:
      'Helping individuals and families navigate culturally aligned mental health providers and community resources.',
  },
  trainingEducation: {
    name: 'Training & Education',
    slug: 'training-education',
    description:
      'Practical, culturally responsive education, workshops, and certifications in mental health and community wellness.',
  },
} as const

export type CategoryKey = keyof typeof CATEGORIES
export const PROGRAM_CATEGORIES = Object.values(CATEGORIES)

export type ProgramCategory = (typeof PROGRAM_CATEGORIES)[number]['name']

export type ProgramPublicationStatus = 'published' | 'under_review' | 'unpublished'

export type ProgramFormType =
  'generic' | 'care_request' | 'bro_chill_attendee' | 'bro_chill_facilitator' | 'bro_chill_checkin'

export interface ProgramActionForm {
  id: string
  label: string
  type: ProgramFormType
  variant?: 'primary' | 'secondary' | 'outline'
}

export interface ProgramSubOffering {
  name: string
  description: string
  ctaLabel?: string
  ctaLink?: string
}

export interface Program {
  name: string
  category: ProgramCategory
  tagline: string
  audience: string
  delivery: string
  purpose: string
  nextStep: string
  slug: string
  href?: string
  status: ProgramPublicationStatus
  actions?: ProgramActionForm[]
  subOfferings?: ProgramSubOffering[]
}

interface ProgramDefinition extends Omit<Program, 'category' | 'status'> {
  categoryKey: CategoryKey
  status?: ProgramPublicationStatus
}

export const programsPageContent = {
  title: 'Programs',
  eyebrow: 'Our Offerings',
  intro:
    'A Mindful Resource Inc. creates trusted pathways to mental wellness through community connection, practical education, early awareness, and care navigation. Our Care Before Crisis™ approach meets people where they live, learn, work, and gather. Not therapy first. Trust first.',
}

export const rawPrograms: ProgramDefinition[] = [
  // 1. Men's Wellness
  {
    name: 'Bro Chill™',
    categoryKey: 'mensWellness',
    tagline:
      'A culturally responsive wellness space for honest conversation and community connection.',
    audience: 'Men, with particular attention to Black men and men facing barriers to support.',
    delivery:
      'Facilitated community gatherings and partner-hosted circles. Schools and organizations can also book a six-week series.',
    purpose:
      'A culturally responsive wellness space where men can have honest conversations, build community, practice coping skills, and connect with additional support.',
    nextStep: 'Explore Bro Chill at brochill.org or contact AMRI about hosting a circle.',
    slug: 'bro-chill',
    href: 'https://brochill.org',
    status: 'published',
    actions: [
      {
        id: 'bro-chill-attendee',
        label: 'Join Circle (RSVP)',
        type: 'bro_chill_attendee',
        variant: 'primary',
      },
      {
        id: 'bro-chill-facilitator',
        label: 'Apply to Facilitate',
        type: 'bro_chill_facilitator',
        variant: 'outline',
      },
      {
        id: 'bro-chill-checkin',
        label: 'Circle Check-In',
        type: 'bro_chill_checkin',
        variant: 'outline',
      },
    ],
  },

  // 2. Youth & Families
  {
    name: 'Real Talk. Real Skills.™',
    categoryKey: 'youthFamilies',
    tagline: 'Youth emotional first aid helping young people manage stress and support friends.',
    audience: 'Middle and high school students, with family and school involvement.',
    delivery:
      'School- and community-based cohorts. The school offering includes 12 weekly sessions, with scheduling coordinated through the host.',
    purpose:
      'Helps young people name their emotions, manage stress, support a friend, and reach a trusted adult before challenges escalate.',
    nextStep: 'Bring This Program to Your School or contact AMRI about participation.',
    slug: 'real-talk-real-skills',
    status: 'published',
  },
  {
    name: 'BRO RISE™',
    categoryKey: 'youthFamilies',
    tagline: 'Mentorship and leadership development for boys and young men.',
    audience: 'Boys and young men.',
    delivery:
      'Cohorts run with school and community partners. Contact us for format and enrollment dates.',
    purpose:
      'Builds emotional intelligence, leadership, healthy relationships, and a sense of belonging through mentorship and practical experiences.',
    nextStep: 'Ask About a Cohort or inquire about a school or community partnership.',
    slug: 'bro-rise',
    status: 'published',
  },

  // 3. Community Wellness
  {
    name: 'How U Feel™',
    categoryKey: 'communityWellness',
    tagline: 'A digital wellness check-in tool to explore how you feel and find next steps.',
    audience: 'People seeking a starting point for understanding their emotional well-being.',
    delivery:
      'Online, with opportunities to introduce the tool during community and partner events.',
    purpose:
      'A digital wellness check-in tool that encourages people to notice how they are feeling and explore resources and next steps.',
    nextStep: 'Check In at howufeel.org',
    slug: 'how-u-feel',
    href: 'https://howufeel.org',
    status: 'published',
  },
  {
    name: 'Wellness on Wheels™',
    categoryKey: 'communityWellness',
    tagline: 'Mobile wellness outreach bringing education, check-ins, and care to communities.',
    audience: 'Neighborhoods and communities facing barriers to accessing wellness resources.',
    delivery:
      'Mobile outreach at partner sites and community events. Contact us to request a visit.',
    purpose:
      'AMRI’s mobile outreach initiative brings wellness education, check-ins, and resource connections into community settings.',
    nextStep: 'Ask About Community Outreach.',
    slug: 'wellness-on-wheels',
    status: 'published',
  },

  // 4. Care Navigation & Support
  {
    name: 'Care Connections™',
    categoryKey: 'careNavigation',
    tagline:
      'Personalized navigation connecting you with culturally aligned providers and resources.',
    audience: 'Individuals and families seeking help finding appropriate support.',
    delivery: 'Individual navigation and follow-up, coordinated with AMRI.',
    purpose:
      'Helps people navigate culturally aligned mental health providers and community resources, making the next step toward care easier to understand.',
    nextStep: 'Request Help Finding Support.',
    slug: 'care-connections',
    status: 'published',
    actions: [
      {
        id: 'care-connections-request',
        label: 'Request Support',
        type: 'care_request',
        variant: 'primary',
      },
    ],
    subOfferings: [
      {
        name: 'Recovery Navigation',
        description:
          'Dedicated guidance for individuals and loved ones navigating substance use and behavioral health recovery resources.',
        ctaLabel: 'Connect with a Recovery Navigator',
        ctaLink: 'mailto:info@amindfulresource.org?subject=Recovery%20Navigation',
      },
      {
        name: 'Narcan Saves Lives',
        description:
          'Overdose prevention education, access to naloxone (Narcan) kits, and immediate response resources for community members.',
        ctaLabel: 'Request Narcan & Training',
        ctaLink: 'mailto:info@amindfulresource.org?subject=Narcan%20Saves%20Lives',
      },
    ],
  },
  {
    name: 'Recovery Ready Communities™',
    categoryKey: 'careNavigation',
    tagline: 'Empowering community ecosystems to support long-term recovery and healing.',
    audience: 'Neighborhood networks, community coalitions, and local service providers.',
    delivery: 'Community-led technical assistance, coalition building, and strategy sessions.',
    purpose:
      'Prepares community spaces, businesses, and neighborhood leaders to create welcoming, recovery-supportive environments that reduce harm and remove barriers to long-term wellness.',
    nextStep: 'Inquire about Recovery Ready Communities initiatives.',
    slug: 'recovery-ready-communities',
    status: 'under_review',
  },

  // 5. Training & Education
  {
    name: 'Care Before Crisis™ Mental Health 101 & Community Wellness Training',
    categoryKey: 'trainingEducation',
    tagline: 'Practical education strengthening mental health awareness and reducing stigma.',
    audience: 'Community members, employers, campuses, faith communities, and organizations.',
    delivery:
      'In-person, virtual, or partner-hosted workshops; session length depends on the selected format.',
    purpose:
      'Practical, culturally responsive education that strengthens mental health awareness, reduces stigma, and helps people recognize distress and connect with support.',
    nextStep: 'Request a Workshop.',
    slug: 'care-before-crisis',
    status: 'published',
  },
  {
    name: 'Real Talk. Real Response.™',
    categoryKey: 'trainingEducation',
    tagline: 'Overdose awareness and response education equipped with life-saving skills.',
    audience: 'Community members, caregivers, educators, workplaces, and organizations.',
    delivery:
      'Typically a 60–90-minute training coordinated with the host. Naloxone kits are subject to availability.',
    purpose:
      'Overdose awareness and response education that equips participants to recognize an overdose and respond using naloxone and other immediate response skills.',
    nextStep: 'Request Overdose Response Training or inquire about upcoming community sessions.',
    slug: 'real-talk-real-response',
    status: 'published',
  },
  {
    name: 'REAL TALK. REAL SUPPORT.™ — Community Wellness Champion Certification',
    categoryKey: 'trainingEducation',
    tagline: 'Emotional first aid certification using AMRI’s CHECK IN™ framework.',
    audience: 'Community leaders, volunteers, peer supporters, and people others turn to for help.',
    delivery: 'Approximately one full day or two half days, coordinated with the host.',
    purpose:
      'Emotional first aid training that teaches supportive listening, safety awareness, resource connection, and navigation using AMRI’s CHECK IN™ framework.',
    nextStep:
      'Ask About Wellness Champion Training (AMRI program certificate, not professional licensure).',
    slug: 'real-talk-real-support',
    status: 'under_review',
  },
  {
    name: 'First 5 Minutes™',
    categoryKey: 'trainingEducation',
    tagline: 'Critical first-response skills for de-escalation and emotional stabilization.',
    audience: 'Frontline staff, educators, faith leaders, and community members.',
    delivery: 'Interactive simulation-based workshops and skill-building modules.',
    purpose:
      'Equips non-clinical community responders with the confidence and practical tools needed during the crucial initial minutes of an emotional crisis or intense distress.',
    nextStep: 'Learn more about First 5 Minutes workshops.',
    slug: 'first-5-minutes',
    status: 'under_review',
  },
  {
    name: 'The Village First™',
    categoryKey: 'trainingEducation',
    tagline: 'Adult emotional first aid equipping caring adults to support youth in distress.',
    audience: 'Parents, caregivers, educators, coaches, mentors, and youth-serving adults.',
    delivery: 'Interactive cohort workshops and institutional training series.',
    purpose:
      'Equips the vital circle of adults around young people with the LEAF™ response framework to recognize emotional distress, provide supportive listening, and connect youth to help before challenges escalate.',
    nextStep:
      'Inquire about bringing The Village First™ to your school, organization, or community.',
    slug: 'village-first',
    status: 'under_review',
  },
]

// All programs defined in the system
export const allPrograms: Program[] = rawPrograms.map((p) => {
  const { categoryKey, status = 'published', ...rest } = p
  return {
    ...rest,
    status,
    category: CATEGORIES[categoryKey].name,
  }
})

// Only published programs render in public views
export const programs: Program[] = allPrograms.filter((p) => p.status === 'published')
