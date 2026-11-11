<template>
  <div>
    <!-- Hero Section -->
    <UPageHero
      title="About A Mindful Resource Inc."
      description="A Mindful Resource Inc. exists because the system wasn't built for the people we love. So we built our own — trust-first, culturally aligned, and community-rooted."
      headline="Our Story"
      :ui="{
        root: 'bg-forest',
        headline: 'text-gold-light',
        title: 'text-paper',
        description: 'text-mist',
      }"
    />

    <!-- Founder Section -->
    <UPageSection
      title="Dominique Johnson"
      headline="About the founder"
      orientation="horizontal"
      :features="features"
      :links="links"
    >
      <NuxtImg
        src="/images/dominique-johnson-headshot.jpeg"
        alt="Dominique Johnson, founder of A Mindful Resource"
        width="600"
        height="600"
        sizes="100vw md:50vw lg:600px"
        format="webp"
        class="h-auto w-full rounded-lg"
      />
    </UPageSection>

    <!-- Timeline Section -->
    <UPageSection title="The Movement">
      <UChangelogVersions :versions="timeline" :indicator="false" />
    </UPageSection>

    <!-- Contact Section -->
    <UPageSection title="Get In Touch">
      <!-- Crisis contacts get their own card so every option is a working link -->
      <UPageCard
        title="In Crisis Right Now?"
        description="Free, confidential, 24/7."
        icon="i-heroicons-exclamation-circle"
        highlight
        highlight-color="error"
        class="mb-6"
      >
        <template #footer>
          <div class="flex flex-wrap gap-3">
            <UButton
              v-for="action in crisisActions"
              :key="action.label"
              v-bind="action"
              color="error"
              variant="soft"
            />
          </div>
        </template>
      </UPageCard>

      <UPageGrid>
        <UPageCard v-for="(card, index) in contact" :key="index" v-bind="card" />
      </UPageGrid>
    </UPageSection>
  </div>
</template>

<script lang="ts" setup>
  import type {
    PageFeatureProps,
    ButtonProps,
    ChangelogVersionProps,
    PageCardProps,
  } from '@nuxt/ui'

  useHead({
    title: 'About | A Mindful Resource',
    meta: [
      {
        name: 'description',
        content:
          'Learn about A Mindful Resource Inc., founder Dominique Johnson, and how to get in touch.',
      },
    ],
  })

  const features: PageFeatureProps[] = [
    {
      description:
        "Dominique Johnson is a registered nurse who spent years watching his community get failed by a mental health system that wasn't built for them. Long waitlists. Cultural mismatch. Cost. Stigma. And too often — a referral with no follow-through.",
    },
    {
      description:
        "He founded A Mindful Resource Inc. on a simple premise: trust comes before therapy. We don't hand people a phone number. We walk with them.",
    },
    {
      description:
        'Today, A Mindful Resource is a Dallas-based 501(c)(3) building the front door to mental wellness for Black and Brown communities — through peer programs, mobile outreach, navigation, and training.',
    },
  ]

  const links: ButtonProps[] = [
    {
      icon: 'i-simple-icons-linkedin',
      trailingIcon: 'i-heroicons-arrow-up-right',
      label: 'Connect with Dominique',
      to: 'https://www.linkedin.com/in/dominiqueamr',
      color: 'neutral',
      target: '_blank',
    },
  ]

  const timeline: ChangelogVersionProps[] = [
    {
      badge: '2023',
      title: 'The Vision',
      description:
        'Founded by Dominique Johnson, MSN, RN — a nurse who watched the system fail his own community.',
    },
    {
      badge: '2024',
      title: 'Care Before Crisis™ launched',
      description:
        'Built our first peer wellness circles. Trained the first cohort of community ambassadors.',
    },
    {
      badge: '2025',
      title: 'Wellness on Wheels',
      description: 'Mobile mental health outreach hits the streets of Dallas.',
    },
    {
      badge: '2026',
      title: 'The Movement Grows',
      description:
        '3,000+ individuals reached across South Dallas, West Dallas, Cedar Hill, and beyond.',
    },
  ]

  const crisisActions: ButtonProps[] = [
    { label: 'Call 988', icon: 'i-heroicons-phone', to: 'tel:988' },
    { label: 'Text 988', icon: 'i-heroicons-chat-bubble-left', to: 'sms:988' },
    {
      label: 'Text HOME to 741741',
      icon: 'i-heroicons-chat-bubble-left',
      to: 'sms:741741?&body=HOME',
    },
    {
      label: 'Chat online',
      icon: 'i-heroicons-computer-desktop',
      to: 'https://988lifeline.org/chat',
      target: '_blank',
    },
  ]

  const contact: PageCardProps[] = [
    {
      title: 'Phone',
      description: '(214) 506-0691',
      icon: 'i-heroicons-phone',
      to: 'tel:2145060691',
    },
    {
      title: 'Email',
      description: 'info@amindfulresource.org',
      icon: 'i-heroicons-envelope',
      to: 'mailto:info@amindfulresource.org',
    },
    {
      title: 'Instagram',
      description: '@amindfulresource',
      icon: 'i-simple-icons-instagram',
      to: 'https://www.instagram.com/amindfulresource',
      target: '_blank',
    },
    {
      title: 'Schedule a Call',
      description: 'Book a free call with Dominique',
      icon: 'i-heroicons-calendar',
      to: 'https://calendly.com/amindfulresource/30min',
      target: '_blank',
    },
  ]
</script>
