<template>
  <div>
    <!-- Hero Section -->
    <UPageHero
      title="About A Mindful Resource Inc."
      description="A Mindful Resource Inc. exists because the system wasn't built for the people we love. So we built our own — trust-first, culturally aligned, and community-rooted."
      headline="Our Story"
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
        alt="Dominique Johnson Headshot Picture"
        class="w-full rounded-lg"
      />
    </UPageSection>

    <!-- Timeline Section -->
    <UPageSection title="The Movement">
      <UChangelogVersions :versions="timeline" :indicator="false" />
    </UPageSection>

    <!-- Contact Section -->
    <UPageSection title="Get In Touch">
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

  const features = ref<PageFeatureProps[]>([
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
  ])

  const links = ref<ButtonProps[]>([
    {
      icon: 'i-simple-icons-linkedin',
      trailingIcon: 'i-heroicons-arrow-up-right',
      label: 'Connect with Dominique',
      to: 'https://www.linkedin.com/in/dominiqueamr',
      color: 'neutral',
      target: '_blank',
    },
  ])

  const timeline = ref<ChangelogVersionProps[]>([
    {
      title: '2023 - The Vision',
      description:
        'Founded by Dominique Johnson, MSN, RN — a nurse who watched the system fail his own community.',
    },
    {
      title: '2024 - Care Before Crisis™ launched',
      description:
        'Built our first peer wellness circles. Trained the first cohort of community ambassadors.',
    },
    {
      title: '2025 - Wellness on Wheels',
      description: 'Mobile mental health outreach hits the streets of Dallas.',
    },
    {
      title: '2026 - The Movement Grows',
      description:
        '3,000+ individuals reached across South Dallas, West Dallas, Cedar Hill, and beyond.',
    },
  ])

  const contact = ref<PageCardProps[]>([
    {
      title: 'In Crisis Right Now?',
      description: 'Call or text 988 - free, confidential, 24/7. Or text HOME to 741741.',
      icon: 'i-heroicons-exclamation-circle',
      to: 'tel:988',
      highlight: true,
      highlightColor: 'error',
      spotlight: true,
      spotlightColor: 'error',
    },
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
    },
    {
      title: 'Schedule a Call',
      description: 'Book a free call with Dominique',
      icon: 'i-heroicons-calendar',
      to: 'https://calendly.com/amindfulresource/30min',
      target: '_blank',
    },
  ])
</script>

<style></style>
