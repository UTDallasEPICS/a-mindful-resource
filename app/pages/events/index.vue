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

  const events: EventItem[] = [
    {
      id: 'bro-chill-oct-28',
      title: 'Bro Chill Community Circle',
      category: 'Bro Chill',
      date: 'October 28, 2026',
      time: '6:30–8:00 PM',
      location: 'West Dallas Multipurpose Center',
      description:
        'A welcoming space for men to connect, share experiences, and support one another.',
    },
  ]

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
  <div class="bg-cream text-ink min-h-screen">
    <!-- HERO -->
    <section class="bg-forest text-paper px-6 py-16 md:py-24">
      <UContainer>
        <div class="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p class="text-gold-light mb-4 text-sm font-semibold tracking-widest uppercase">
              Community & Connection
            </p>

            <h1 class="text-4xl leading-tight font-bold md:text-6xl">
              Events that bring people together.
            </h1>

            <p class="text-mist mt-6 max-w-xl text-lg leading-relaxed">
              Discover community circles, wellness gatherings, and opportunities to connect with A
              Mindful Resource.
            </p>

            <UButton to="#upcoming-events" color="secondary" size="lg" class="mt-8">
              Explore Upcoming Events
            </UButton>
          </div>

          <div class="border-forest-line bg-forest-deep overflow-hidden rounded-2xl border">
            <!-- Replace this placeholder with an approved community photo -->
            <div
              class="flex aspect-[4/3] flex-col items-center justify-center gap-4 p-8 text-center"
            >
              <UIcon name="i-lucide-users-round" class="text-gold-light size-16" />
              <p class="text-paper font-serif text-2xl font-bold">Community. Connection. Care.</p>
              <p class="text-mist max-w-xs text-sm leading-relaxed">
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
          <p class="text-gold-deep mb-3 text-sm font-semibold tracking-widest uppercase">
            What's Happening
          </p>

          <h2 class="text-forest-deep text-3xl font-bold md:text-4xl">Upcoming Events</h2>

          <p class="text-ink-muted mt-3 max-w-2xl">
            Find an upcoming gathering and take the next step toward connection.
          </p>
        </div>

        <div v-if="events.length" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <UCard
            v-for="event in events"
            :key="event.id"
            class="border-line bg-cream-light overflow-hidden border"
          >
            <div class="flex h-full flex-col gap-4">
              <!-- Optional event image -->
              <div v-if="event.image" class="bg-sage-light aspect-video overflow-hidden rounded-lg">
                <img
                  :src="event.image"
                  :alt="event.title"
                  class="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>

              <div
                v-else
                class="bg-sage-light flex aspect-video items-center justify-center rounded-lg"
              >
                <UIcon name="i-lucide-calendar-heart" class="text-forest size-12" />
              </div>

              <div>
                <UBadge color="primary" variant="subtle">
                  {{ event.category }}
                </UBadge>

                <h3 class="text-forest-deep mt-4 text-2xl font-bold">
                  {{ event.title }}
                </h3>

                <p class="text-ink-muted mt-3 leading-relaxed">
                  {{ event.description }}
                </p>
              </div>

              <div class="text-ink space-y-3 text-sm">
                <div class="flex items-start gap-2">
                  <UIcon name="i-lucide-calendar-days" class="text-forest mt-0.5 size-5 shrink-0" />
                  <span>{{ event.date }} · {{ event.time }}</span>
                </div>

                <div class="flex items-start gap-2">
                  <UIcon name="i-lucide-map-pin" class="text-forest mt-0.5 size-5 shrink-0" />
                  <span>{{ event.location }}</span>
                </div>
              </div>

              <div class="mt-auto flex flex-wrap gap-3 pt-3">
                <UButton to="/events/bro-chill" color="primary"> Learn More </UButton>

                <UButton
                  v-if="event.registrationUrl"
                  :to="event.registrationUrl"
                  target="_blank"
                  color="neutral"
                  variant="outline"
                >
                  RSVP
                </UButton>

                <UButton v-else to="/events/bro-chill#rsvp" color="neutral" variant="outline">
                  RSVP
                </UButton>
              </div>
            </div>
          </UCard>
        </div>

        <p v-else class="border-line bg-cream-light text-ink-muted rounded-xl border p-8">
          No upcoming events are currently listed. Check back soon.
        </p>
      </UContainer>
    </section>

    <!-- FEATURED BRO CHILL PROGRAM -->
    <section class="bg-sage-light px-6 py-16 md:py-20">
      <UContainer>
        <div class="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p class="text-gold-deep mb-3 text-sm font-semibold tracking-widest uppercase">
              Featured Program
            </p>

            <h2 class="text-forest-deep text-3xl font-bold md:text-5xl">Bro Chill</h2>

            <p class="text-ink mt-5 leading-relaxed">
              Bro Chill creates a welcoming space for men to have real conversations, build
              connections, and support their mental wellness.
            </p>

            <p class="text-ink-muted mt-4 leading-relaxed">
              Whether you want to attend a circle, help facilitate, or support the program through
              your organization, there is a way to get involved.
            </p>

            <UButton to="/events/bro-chill" color="primary" size="lg" class="mt-7">
              Explore Bro Chill
            </UButton>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <!-- Join -->
            <div class="border-line bg-cream-light rounded-xl border p-6">
              <UIcon name="i-lucide-calendar-heart" class="text-forest mb-4 size-7" />
              <h3 class="text-forest-deep text-xl font-bold">Join a Circle</h3>
              <p class="text-ink-muted mt-3 text-sm leading-relaxed">
                Attend a free community gathering.
              </p>
              <UButton to="/events/bro-chill#rsvp" color="primary" variant="outline" class="mt-5">
                RSVP
              </UButton>
            </div>

            <!-- Facilitate -->
            <div class="border-line bg-cream-light rounded-xl border p-6">
              <UIcon name="i-lucide-users" class="text-forest mb-4 size-7" />
              <h3 class="text-forest-deep text-xl font-bold">Facilitate</h3>
              <p class="text-ink-muted mt-3 text-sm leading-relaxed">
                Help lead conversations and support participants.
              </p>
              <UButton
                to="/events/bro-chill#facilitate"
                color="primary"
                variant="outline"
                class="mt-5"
              >
                Learn More
              </UButton>
            </div>

            <!-- Host -->
            <div class="border-line bg-cream-light rounded-xl border p-6">
              <UIcon name="i-lucide-building-2" class="text-forest mb-4 size-7" />
              <h3 class="text-forest-deep text-xl font-bold">Host a Series</h3>
              <p class="text-ink-muted mt-3 text-sm leading-relaxed">
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
            <div class="border-line bg-cream-light rounded-xl border p-6">
              <UIcon name="i-lucide-hand-heart" class="text-forest mb-4 size-7" />
              <h3 class="text-forest-deep text-xl font-bold">Sponsor</h3>
              <p class="text-ink-muted mt-3 text-sm leading-relaxed">
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
