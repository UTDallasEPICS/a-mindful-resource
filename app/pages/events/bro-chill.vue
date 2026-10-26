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
      link: '/events/bro-chill/facilitator',
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

  // Temporary data until the Events API is connected.
  // Only published, future Bro Chill events should appear here.
  const upcomingCircles: {
    id: string
    title: string
    date: string
    location: string
    eventbriteUrl: string
  }[] = []

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
  <div class="bg-cream text-ink min-h-screen">
    <!-- HERO -->
    <section class="bg-forest text-paper px-6 py-16 md:py-24">
      <UContainer>
        <UButton
          to="/events"
          color="neutral"
          variant="ghost"
          icon="i-lucide-arrow-left"
          class="text-mist mb-8"
        >
          Back to Events
        </UButton>

        <div class="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p class="text-gold-light mb-4 text-sm font-semibold tracking-widest uppercase">
              Men's Wellness & Community
            </p>

            <h1 class="text-5xl leading-tight font-bold md:text-6xl">Bro Chill</h1>

            <p class="text-mist mt-6 max-w-xl text-lg leading-relaxed">
              A welcoming space for men to connect, have honest conversations, and support one
              another without judgment.
            </p>

            <p class="text-mist mt-4 max-w-xl leading-relaxed">
              Not therapy first. Trust first. Come as you are.
            </p>

            <UButton to="#get-involved" color="secondary" size="lg" class="mt-8">
              Find Your Place in the Circle
            </UButton>
          </div>

          <div
            class="border-forest-line bg-forest-deep flex aspect-[4/3] items-center justify-center rounded-2xl border p-8"
          >
            <div class="text-center">
              <UIcon name="i-lucide-users-round" class="text-gold-light mx-auto mb-5 size-16" />
              <p class="text-paper font-serif text-3xl font-bold">Real Conversations.</p>
              <p class="text-gold-light mt-2 font-serif text-3xl font-bold">Real Connection.</p>
              <p class="text-mist mt-5 text-sm">A Bro Chill community space</p>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- ABOUT -->
    <section class="px-6 py-16 md:py-20">
      <UContainer>
        <div class="mx-auto max-w-3xl text-center">
          <p class="text-gold-deep mb-3 text-sm font-semibold tracking-widest uppercase">
            About the Program
          </p>

          <h2 class="text-forest-deep text-3xl font-bold md:text-4xl">What is Bro Chill?</h2>

          <p class="text-ink mt-6 leading-8">
            Bro Chill is a peer-led men's wellness program that provides a comfortable space for
            conversations about everyday life, family, relationships, identity, and mental wellness.
          </p>

          <p class="text-ink-muted mt-4 leading-8">
            Through community circles and shared experiences, participants can connect with others,
            feel heard, and build supportive relationships.
          </p>
        </div>
      </UContainer>
    </section>

    <!-- FOUR WAYS TO PARTICIPATE -->
    <section id="get-involved" class="bg-sage-light scroll-mt-20 px-6 py-16 md:py-20">
      <UContainer>
        <div class="mb-10 text-center">
          <p class="text-gold-deep mb-3 text-sm font-semibold tracking-widest uppercase">
            Get Involved
          </p>

          <h2 class="text-forest-deep text-3xl font-bold md:text-4xl">
            Find your place in the circle.
          </h2>

          <p class="text-ink-muted mx-auto mt-4 max-w-2xl">
            Whether you want to attend, lead, host, or support a circle, there's a way to get
            involved.
          </p>
        </div>

        <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <UCard
            v-for="option in participationOptions"
            :key="option.title"
            class="border-line bg-cream-light flex h-full flex-col border"
            :ui="{ body: 'flex h-full flex-1 flex-col' }"
          >
            <div class="flex h-full flex-1 flex-col">
              <UIcon :name="option.icon" class="text-forest mb-5 size-9" />

              <h3 class="text-forest-deep text-xl font-bold">
                {{ option.title }}
              </h3>

              <p class="text-ink-muted mt-3 flex-1 text-sm leading-relaxed">
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
        <p class="text-gold-deep mb-3 text-sm font-semibold tracking-widest uppercase">Attend</p>

        <h2 class="text-forest-deep text-3xl font-bold md:text-4xl">Upcoming Bro Chill Circles</h2>

        <p class="text-ink-muted mt-4 max-w-2xl">
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
            class="border-line bg-cream-light border"
          >
            <h3 class="text-forest-deep text-xl font-bold">
              {{ circle.title }}
            </h3>

            <div class="text-ink-muted mt-4 space-y-2 text-sm">
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
          class="border-line bg-cream-light mt-8 flex flex-col items-center rounded-2xl border px-6 py-12 text-center"
        >
          <div class="bg-sage-light mb-5 flex size-16 items-center justify-center rounded-full">
            <UIcon name="i-lucide-calendar-heart" class="text-forest size-8" />
          </div>

          <h3 class="text-forest-deep text-2xl font-bold">No upcoming circles right now</h3>

          <p class="text-ink-muted mt-3 max-w-md leading-relaxed">
            We're planning more opportunities to connect. Check back soon for upcoming Bro Chill
            gatherings!
          </p>
        </div>
      </UContainer>
    </section>
  </div>
</template>
