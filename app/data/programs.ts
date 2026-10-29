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
      'Accessible community initiatives, digital wellness tools, and mobile outreach welcoming all community members.',
  },
  {
    name: 'Care Navigation & Support',
    slug: 'care-navigation-support',
    description:
      'Helping individuals and families navigate culturally aligned mental health providers and community resources.',
  },
  {
    name: 'Training & Education',
    slug: 'training-education',
    description:
      'Practical, culturally responsive education, workshops, and certifications in mental health and community wellness.',
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
    'A Mindful Resource Inc. creates trusted pathways to mental wellness through community connection, practical education, early awareness, and care navigation. Our Care Before Crisis™ approach meets people where they live, learn, work, and gather. Not therapy first. Trust first.',
}

export const programs: Program[] = [
  // 1. Men's Wellness
  {
    id: 'bro-chill',
    name: 'Bro Chill™',
    category: "Men's Wellness",
    tagline:
      'A culturally responsive wellness space for honest conversation and community connection.',
    audience: 'Men, with particular attention to Black men and men facing barriers to support.',
    delivery:
      'Facilitated community gatherings and partner-hosted circles. Institutional offerings can include a six-week series; display community dates separately when confirmed.',
    purpose:
      'A culturally responsive wellness space where men can have honest conversations, build community, practice coping skills, and connect with additional support.',
    nextStep: 'Explore Bro Chill at brochill.org or contact AMRI about hosting a circle.',
    slug: 'bro-chill',
    href: 'https://brochill.org',
  },

  // 2. Youth & Families
  {
    id: 'real-talk-real-skills',
    name: 'Real Talk. Real Skills.™ — Youth Emotional First Aid',
    category: 'Youth & Families',
    tagline: 'Youth emotional first aid helping young people manage stress and support friends.',
    audience: 'Middle and high school students, with family and school involvement.',
    delivery:
      'School- and community-based cohorts. The school offering includes 12 weekly sessions, with scheduling coordinated through the host.',
    purpose:
      'Helps young people name their emotions, manage stress, support a friend, and reach a trusted adult before challenges escalate.',
    nextStep: 'Bring This Program to Your School or contact AMRI about participation.',
    slug: 'real-talk-real-skills',
  },
  {
    id: 'bro-rise',
    name: 'BRO RISE™',
    category: 'Youth & Families',
    tagline: 'Mentorship and leadership development for boys and young men.',
    audience: 'Boys and young men.',
    delivery:
      'Partner-coordinated cohorts; format and enrollment dates should be confirmed for each offering.',
    purpose:
      'Builds emotional intelligence, leadership, healthy relationships, and a sense of belonging through mentorship and practical experiences.',
    nextStep: 'Ask About a Cohort or inquire about a school or community partnership.',
    slug: 'bro-rise',
  },

  // 3. Community Wellness
  {
    id: 'how-u-feel',
    name: 'How U Feel™',
    category: 'Community Wellness',
    tagline: 'A digital wellness check-in tool to explore how you feel and find next steps.',
    audience: 'People seeking a starting point for understanding their emotional well-being.',
    delivery:
      'Online, with opportunities to introduce the tool during community and partner events.',
    purpose:
      'A digital wellness check-in tool that encourages people to notice how they are feeling and explore resources and next steps.',
    nextStep: 'Check In at howufeel.org',
    slug: 'how-u-feel',
    href: 'https://howufeel.org',
  },
  {
    id: 'wellness-on-wheels',
    name: 'Wellness on Wheels™',
    category: 'Community Wellness',
    tagline: 'Mobile wellness outreach bringing education, check-ins, and care to communities.',
    audience: 'Neighborhoods and communities facing barriers to accessing wellness resources.',
    delivery:
      'Mobile, partner-based outreach. Public scheduling and booking availability pending confirmation.',
    purpose:
      'AMRI’s mobile outreach initiative brings wellness education, check-ins, and resource connections into community settings.',
    nextStep: 'Ask About Community Outreach.',
    slug: 'wellness-on-wheels',
  },

  // 4. Care Navigation & Support
  {
    id: 'care-connections',
    name: 'Care Connections™',
    category: 'Care Navigation & Support',
    tagline:
      'Personalized navigation connecting you with culturally aligned providers and resources.',
    audience: 'Individuals and families seeking help finding appropriate support.',
    delivery: 'Individual navigation and follow-up, coordinated with AMRI.',
    purpose:
      'Helps people navigate culturally aligned mental health providers and community resources, making the next step toward care easier to understand.',
    nextStep: 'Request Help Finding Support (direct inquiries to info@amindfulresource.org).',
    slug: 'care-connections',
    href: 'mailto:info@amindfulresource.org',
  },

  // 5. Training & Education
  {
    id: 'care-before-crisis',
    name: 'Care Before Crisis™ — Mental Health 101 & Community Wellness Training',
    category: 'Training & Education',
    tagline: 'Practical education strengthening mental health awareness and reducing stigma.',
    audience: 'Community members, employers, campuses, faith communities, and organizations.',
    delivery:
      'In-person, virtual, or partner-hosted workshops; session length depends on the selected format.',
    purpose:
      'Practical, culturally responsive education that strengthens mental health awareness, reduces stigma, and helps people recognize distress and connect with support.',
    nextStep: 'Request a Workshop through info@amindfulresource.org',
    slug: 'care-before-crisis',
    href: 'mailto:info@amindfulresource.org',
  },
  {
    id: 'real-talk-real-response',
    name: 'Real Talk. Real Response.™',
    category: 'Training & Education',
    tagline: 'Overdose awareness and response education equipped with life-saving skills.',
    audience: 'Community members, caregivers, educators, workplaces, and organizations.',
    delivery:
      'Typically a 60–90-minute training coordinated with the host. Naloxone kits are subject to availability.',
    purpose:
      'Overdose awareness and response education that equips participants to recognize an overdose and respond using naloxone and other immediate response skills.',
    nextStep: 'Request Overdose Response Training or inquire about upcoming community sessions.',
    slug: 'real-talk-real-response',
  },
  {
    id: 'real-talk-real-support',
    name: 'REAL TALK. REAL SUPPORT.™ — Community Wellness Champion Certification',
    category: 'Training & Education',
    tagline: 'Emotional first aid certification using AMRI’s CHECK IN™ framework.',
    audience: 'Community leaders, volunteers, peer supporters, and people others turn to for help.',
    delivery: 'Approximately one full day or two half days, coordinated with the host.',
    purpose:
      'Emotional first aid training that teaches supportive listening, safety awareness, resource connection, and navigation using AMRI’s CHECK IN™ framework.',
    nextStep:
      'Ask About Wellness Champion Training (AMRI program certificate, not professional licensure).',
    slug: 'real-talk-real-support',
  },
]
