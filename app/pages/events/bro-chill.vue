<script setup lang="ts">
  const partnershipEmail = 'partnerships@amindfulresource.org' // Confirm with Dominique before deployment

  function inquiryLink(subject: string) {
    return `mailto:${partnershipEmail}?subject=${encodeURIComponent(subject)}`
  }

  const participationOptions = [
    {
      title: 'Join a Circle',
      description:
        'Attend a free Bro Chill gathering to connect, share experiences, and build community.',
      icon: 'i-lucide-calendar-heart',
      link: '#upcoming-circles',
      button: 'Find a Circle',
    },
    {
      title: 'Become a Facilitator',
      description:
        'Help lead meaningful conversations and create a welcoming environment for participants.',
      icon: 'i-lucide-users',
      // No facilitator application page yet; route interest to email.
      link: inquiryLink('Bro Chill: Facilitator interest'),
      button: 'Apply to Facilitate',
    },
    {
      title: 'Host a Series',
      description: 'Bring Bro Chill to your workplace, organization, or community.',
      icon: 'i-lucide-building-2',
      link: inquiryLink('Bro Chill: Hosting inquiry'),
      button: 'Inquire About Hosting',
    },
    {
      title: 'Sponsor a Circle',
      description: 'Support free community circles and help make meaningful connection accessible.',
      icon: 'i-lucide-hand-heart',
      link: inquiryLink('Bro Chill: Sponsorship inquiry'),
      button: 'Inquire About Sponsoring',
    },
  ]

  // Same source as the /events page, so both pages always agree.
  const { data: allEvents } = await useFetch<
    {
      id: string
      title: string
      category: string
      date: string
      time: string
      location: string
      registrationUrl?: string
    }[]
  >('/api/eventbrite/events', { default: () => [] })

  const upcomingCircles = computed(() =>
    (allEvents.value ?? [])
      .filter((e) => e.category === 'Bro Chill')
      .map((e) => ({
        id: e.id,
        title: e.title,
        date: `${e.date} · ${e.time}`,
        location: e.location,
        eventbriteUrl: e.registrationUrl,
      }))
  )

  useHead({
    title: 'Bro Chill | A Mindful Resource',
    meta: [
      {
        name: 'description',
        content:
          'Learn about Bro Chill community circles, RSVP for events, become a facilitator, or support the program.',
      },
    ],
  })
</script>

<template>
  <div class="min-h-screen bg-cream text-ink">
    <!-- HERO -->
    <section class="bg-forest px-6 py-16 text-paper md:py-24">
      <UContainer>
        <UButton
          to="/events"
          color="neutral"
          variant="ghost"
          icon="i-lucide-arrow-left"
          class="mb-8 text-mist"
        >
          Back to Events
        </UButton>

        <div class="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p class="mb-4 text-sm font-semibold tracking-widest text-gold-light uppercase">
              Men's Wellness & Community
            </p>

            <h1 class="text-5xl leading-tight font-bold md:text-6xl">Bro Chill</h1>

            <p class="mt-6 max-w-xl text-lg leading-relaxed text-mist">
              A welcoming space for men to connect, have honest conversations, and support one
              another without judgment.
            </p>

            <p class="mt-4 max-w-xl leading-relaxed text-mist">
              Not therapy first. Trust first. Come as you are.
            </p>

            <UButton to="#get-involved" color="secondary" size="lg" class="mt-8">
              Find Your Place in the Circle
            </UButton>
          </div>

          <div
            class="flex aspect-[4/3] items-center justify-center rounded-2xl border border-forest-line bg-forest-deep p-8"
          >
            <div class="text-center">
              <UIcon name="i-lucide-users-round" class="mx-auto mb-5 size-16 text-gold-light" />
              <p class="font-serif text-3xl font-bold text-paper">Real Conversations.</p>
              <p class="mt-2 font-serif text-3xl font-bold text-gold-light">Real Connection.</p>
              <p class="mt-5 text-sm text-mist">A Bro Chill community space</p>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- ABOUT -->
    <section class="px-6 py-16 md:py-20">
      <UContainer>
        <div class="mx-auto max-w-3xl text-center">
          <p class="mb-3 text-sm font-semibold tracking-widest text-gold-deep uppercase">
            About the Program
          </p>

          <h2 class="text-3xl font-bold text-forest-deep md:text-4xl">What is Bro Chill?</h2>

          <p class="mt-6 leading-8 text-ink">
            Bro Chill is a peer-led men's wellness program that provides a comfortable space for
            conversations about everyday life, family, relationships, identity, and mental wellness.
          </p>

          <p class="mt-4 leading-8 text-ink-muted">
            Through community circles and shared experiences, participants can connect with others,
            feel heard, and build supportive relationships.
          </p>
        </div>
      </UContainer>
    </section>

    <!-- FOUR WAYS TO PARTICIPATE -->
    <section id="get-involved" class="scroll-mt-20 bg-sage-light px-6 py-16 md:py-20">
      <UContainer>
        <div class="mb-10 text-center">
          <p class="mb-3 text-sm font-semibold tracking-widest text-gold-deep uppercase">
            Get Involved
          </p>

          <h2 class="text-3xl font-bold text-forest-deep md:text-4xl">
            Find your place in the circle.
          </h2>

          <p class="mx-auto mt-4 max-w-2xl text-ink-muted">
            Whether you want to attend, lead, host, or support a circle, there's a way to get
            involved.
          </p>
        </div>

        <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <UCard
            v-for="option in participationOptions"
            :key="option.title"
            class="flex h-full flex-col border border-line bg-cream-light"
            :ui="{ body: 'flex h-full flex-1 flex-col' }"
          >
            <div class="flex h-full flex-1 flex-col">
              <UIcon :name="option.icon" class="mb-5 size-9 text-forest" />

              <h3 class="text-xl font-bold text-forest-deep">
                {{ option.title }}
              </h3>

              <p class="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
                {{ option.description }}
              </p>

              <UButton :to="option.link" color="primary" variant="outline" block class="mt-6">
                {{ option.button }}
              </UButton>
            </div>
          </UCard>
        </div>
      </UContainer>
    </section>

    <!-- UPCOMING CIRCLES -->
    <section id="upcoming-circles" class="scroll-mt-20 px-6 py-16 md:py-20">
      <UContainer>
        <p class="mb-3 text-sm font-semibold tracking-widest text-gold-deep uppercase">Attend</p>

        <h2 class="text-3xl font-bold text-forest-deep md:text-4xl">Upcoming Bro Chill Circles</h2>

        <p class="mt-4 max-w-2xl text-ink-muted">
          Find an upcoming Bro Chill gathering and reserve your spot.
        </p>

        <!-- Display upcoming circles when available -->
        <div
          v-if="upcomingCircles.length > 0"
          class="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          <UCard
            v-for="circle in upcomingCircles"
            :key="circle.id"
            class="border border-line bg-cream-light"
          >
            <h3 class="text-xl font-bold text-forest-deep">
              {{ circle.title }}
            </h3>

            <div class="mt-4 space-y-2 text-sm text-ink-muted">
              <p class="flex items-center gap-2">
                <UIcon name="i-lucide-calendar-days" class="size-4" />
                {{ circle.date }}
              </p>

              <p class="flex items-center gap-2">
                <UIcon name="i-lucide-map-pin" class="size-4" />
                {{ circle.location }}
              </p>
            </div>

            <UButton
              v-if="circle.eventbriteUrl"
              :to="circle.eventbriteUrl"
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
              block
              class="mt-6"
            >
              RSVP on Eventbrite
            </UButton>
          </UCard>
        </div>

        <!-- Friendly empty state -->
        <div
          v-else
          class="mt-8 flex flex-col items-center rounded-2xl border border-line bg-cream-light px-6 py-12 text-center"
        >
          <div class="mb-5 flex size-16 items-center justify-center rounded-full bg-sage-light">
            <UIcon name="i-lucide-calendar-heart" class="size-8 text-forest" />
          </div>

          <h3 class="text-2xl font-bold text-forest-deep">No upcoming circles right now</h3>

          <p class="mt-3 max-w-md leading-relaxed text-ink-muted">
            We're planning more opportunities to connect. Check back soon for upcoming Bro Chill
            gatherings!
          </p>
        </div>
      </UContainer>
    </section>
  </div>
</template>
