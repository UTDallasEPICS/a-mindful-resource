<script setup lang="ts">
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

  const {
    data: events,
    status: eventsStatus,
    error: eventsError,
  } = await useFetch<EventItem[]>('/api/eventbrite/events', {
    default: () => [],
  })

  const partnershipEmail = 'partnerships@amindfulresource.org'

  function inquiryLink(subject: string) {
    return `mailto:${partnershipEmail}?subject=${encodeURIComponent(subject)}`
  }

  useHead({
    title: 'Events | A Mindful Resource',
    meta: [
      {
        name: 'description',
        content:
          'Explore community events, Bro Chill circles, and opportunities to get involved with A Mindful Resource.',
      },
    ],
  })
</script>

<template>
  <div class="min-h-screen bg-cream text-ink">
    <!-- HERO -->
    <section class="bg-forest px-6 py-16 text-paper md:py-24">
      <UContainer>
        <div class="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p class="mb-4 text-sm font-semibold tracking-widest text-gold-light uppercase">
              Community & Connection
            </p>

            <h1 class="text-4xl leading-tight font-bold md:text-6xl">
              Events that bring people together.
            </h1>

            <p class="mt-6 max-w-xl text-lg leading-relaxed text-mist">
              Discover community circles, wellness gatherings, and opportunities to connect with A
              Mindful Resource.
            </p>

            <UButton to="#upcoming-events" color="secondary" size="lg" class="mt-8">
              Explore Upcoming Events
            </UButton>
          </div>

          <div class="overflow-hidden rounded-2xl border border-forest-line bg-forest-deep">
            <!-- Replace this placeholder with an approved community photo -->
            <div
              class="flex aspect-[4/3] flex-col items-center justify-center gap-4 p-8 text-center"
            >
              <UIcon name="i-lucide-users-round" class="size-16 text-gold-light" />
              <p class="font-serif text-2xl font-bold text-paper">Community. Connection. Care.</p>
              <p class="max-w-xs text-sm leading-relaxed text-mist">
                A place to gather, connect, and grow together.
              </p>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- UPCOMING EVENTS -->
    <section id="upcoming-events" class="scroll-mt-20 px-6 py-16 md:py-20">
      <UContainer>
        <div class="mb-10">
          <p class="mb-3 text-sm font-semibold tracking-widest text-gold-deep uppercase">
            What's Happening
          </p>

          <h2 class="text-3xl font-bold text-forest-deep md:text-4xl">Upcoming Events</h2>

          <p class="mt-3 max-w-2xl text-ink-muted">
            Find an upcoming gathering and take the next step toward connection.
          </p>
        </div>

        <div v-if="eventsStatus === 'pending'" class="text-ink-muted">
          Loading upcoming events...
        </div>

        <p v-else-if="eventsError" class="text-ink-muted">
          Events are temporarily unavailable. Please check back soon.
        </p>

        <div v-else-if="events?.length" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <UCard
            v-for="event in events"
            :key="event.id"
            class="overflow-hidden border border-line bg-cream-light"
          >
            <div class="flex h-full flex-col gap-4">
              <!-- Optional event image -->
              <div v-if="event.image" class="aspect-video overflow-hidden rounded-lg bg-sage-light">
                <img
                  :src="event.image"
                  :alt="event.title"
                  class="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>

              <div
                v-else
                class="flex aspect-video items-center justify-center rounded-lg bg-sage-light"
              >
                <UIcon name="i-lucide-calendar-heart" class="size-12 text-forest" />
              </div>

              <div>
                <UBadge color="primary" variant="subtle">
                  {{ event.category }}
                </UBadge>

                <h3 class="mt-4 text-2xl font-bold text-forest-deep">
                  {{ event.title }}
                </h3>

                <p class="mt-3 leading-relaxed text-ink-muted">
                  {{ event.description }}
                </p>
              </div>

              <div class="space-y-3 text-sm text-ink">
                <div class="flex items-start gap-2">
                  <UIcon name="i-lucide-calendar-days" class="mt-0.5 size-5 shrink-0 text-forest" />
                  <span>{{ event.date }} · {{ event.time }}</span>
                </div>

                <div class="flex items-start gap-2">
                  <UIcon name="i-lucide-map-pin" class="mt-0.5 size-5 shrink-0 text-forest" />
                  <span>{{ event.location }}</span>
                </div>
              </div>

              <div class="mt-auto flex flex-wrap gap-3 pt-3">
                <UButton
                  v-if="event.category === 'Bro Chill'"
                  to="/events/bro-chill"
                  color="primary"
                >
                  Learn More
                </UButton>

                <UButton
                  v-if="event.registrationUrl"
                  :to="event.registrationUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="neutral"
                  variant="outline"
                >
                  RSVP
                </UButton>

                <UButton
                  v-else-if="event.category === 'Bro Chill'"
                  to="/events/bro-chill#upcoming-circles"
                  color="neutral"
                  variant="outline"
                >
                  RSVP
                </UButton>
              </div>
            </div>
          </UCard>
        </div>

        <p v-else class="rounded-xl border border-line bg-cream-light p-8 text-ink-muted">
          No upcoming events are currently listed. Check back soon.
        </p>
      </UContainer>
    </section>

    <!-- FEATURED BRO CHILL PROGRAM -->
    <section class="bg-sage-light px-6 py-16 md:py-20">
      <UContainer>
        <div class="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p class="mb-3 text-sm font-semibold tracking-widest text-gold-deep uppercase">
              Featured Program
            </p>

            <h2 class="text-3xl font-bold text-forest-deep md:text-5xl">Bro Chill</h2>

            <p class="mt-5 leading-relaxed text-ink">
              Bro Chill creates a welcoming space for men to have real conversations, build
              connections, and support their mental wellness.
            </p>

            <p class="mt-4 leading-relaxed text-ink-muted">
              Whether you want to attend a circle, help facilitate, or support the program through
              your organization, there is a way to get involved.
            </p>

            <UButton to="/events/bro-chill" color="primary" size="lg" class="mt-7">
              Explore Bro Chill
            </UButton>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <!-- Join -->
            <div class="rounded-xl border border-line bg-cream-light p-6">
              <UIcon name="i-lucide-calendar-heart" class="mb-4 size-7 text-forest" />
              <h3 class="text-xl font-bold text-forest-deep">Join a Circle</h3>
              <p class="mt-3 text-sm leading-relaxed text-ink-muted">
                Attend a free community gathering.
              </p>
              <UButton
                to="/events/bro-chill#upcoming-circles"
                color="primary"
                variant="outline"
                class="mt-5"
              >
                RSVP
              </UButton>
            </div>

            <!-- Facilitate -->
            <div class="rounded-xl border border-line bg-cream-light p-6">
              <UIcon name="i-lucide-users" class="mb-4 size-7 text-forest" />
              <h3 class="text-xl font-bold text-forest-deep">Facilitate</h3>
              <p class="mt-3 text-sm leading-relaxed text-ink-muted">
                Help lead conversations and support participants.
              </p>
              <UButton
                to="/events/bro-chill#get-involved"
                color="primary"
                variant="outline"
                class="mt-5"
              >
                Learn More
              </UButton>
            </div>

            <!-- Host -->
            <div class="rounded-xl border border-line bg-cream-light p-6">
              <UIcon name="i-lucide-building-2" class="mb-4 size-7 text-forest" />
              <h3 class="text-xl font-bold text-forest-deep">Host a Series</h3>
              <p class="mt-3 text-sm leading-relaxed text-ink-muted">
                Bring Bro Chill to your organization.
              </p>
              <UButton
                :to="inquiryLink('Bro Chill: Host a community series')"
                color="primary"
                variant="outline"
                class="mt-5"
              >
                Email About Hosting
              </UButton>
            </div>

            <!-- Sponsor -->
            <div class="rounded-xl border border-line bg-cream-light p-6">
              <UIcon name="i-lucide-hand-heart" class="mb-4 size-7 text-forest" />
              <h3 class="text-xl font-bold text-forest-deep">Sponsor</h3>
              <p class="mt-3 text-sm leading-relaxed text-ink-muted">
                Help keep community circles free.
              </p>
              <UButton
                :to="inquiryLink('Bro Chill: Sponsorship inquiry')"
                color="primary"
                variant="outline"
                class="mt-5"
              >
                Email About Sponsoring
              </UButton>
            </div>
          </div>
        </div>
      </UContainer>
    </section>
  </div>
</template>
