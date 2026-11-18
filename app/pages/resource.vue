<template>
  <div class="bg-cream text-ink min-h-screen">
    <section class="bg-forest flex min-h-[420px] flex-col justify-between pt-20 pb-0 text-center">
      <div class="mx-auto max-w-7xl px-4">
        <p class="text-gold-light text-xs font-semibold tracking-widest">RESOURCE HUB</p>
        <h1 class="text-paper mt-4 text-5xl">Find support that fits your needs.</h1>
        <p class="text-mist mx-auto mt-6 max-w-2xl">
          Explore mental health and wellness resources, search local services, or use the map to
          discover support near you.
        </p>
      </div>
      <div class="bg-red-700 px-4 py-2 text-xs font-semibold text-white">
        <div class="flex items-center justify-center gap-1.5 text-center">
          <!-- Phone Icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          <span>In crisis?</span>
          <a href="tel:988" class="font-bold underline hover:text-red-100">Call or text 988</a>
          <span class="mx-1">|</span>
          <a href="sms:741741?body=HOME" class="font-bold underline hover:text-red-100"
            >Text HOME to 741741</a
          >
        </div>
      </div>
    </section>

    <!-- DIRECTORY SEARCH -->
    <div class="mx-auto mt-20 max-w-7xl px-4">
      <h2 class="text-gold-deep text-4xl">Browse the directory</h2>
      <section class="bg-cream-light border-line mt-6 rounded-2xl border p-8">
        <h3 class="text-forest-deep text-2xl">Search the directory</h3>
        <p class="text-ink-muted mt-1 text-sm">
          Search by organization, service, specialty, or keyword.
        </p>
        <div class="mt-5 flex gap-3">
          <UInput
            v-model="keyword"
            placeholder="Search resources..."
            class="flex-1"
            :ui="fieldUi"
          />
          <UButton class="bg-forest text-paper hover:bg-forest-deep">Search</UButton>
        </div>
        <div class="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <UInput v-model="zip" placeholder="ZIP code" :ui="fieldUi" />
          <USelect v-model="specialty" :items="specialties" :ui="fieldUi" />
          <USelect v-model="insurance" :items="insuranceOptions" :ui="fieldUi" />
          <USelect v-model="careType" :items="careTypes" :ui="fieldUi" />
        </div>

        <div class="border-line mt-5 border-t pt-4">
          <button
            type="button"
            class="text-forest-deep hover:text-gold-deep flex w-full items-center justify-between gap-3 text-left text-sm font-semibold transition-colors"
            :aria-expanded="moreOpen"
            aria-controls="more-options"
            @click="moreOpen = !moreOpen"
          >
            <span class="flex items-center gap-2">
              More options
              <span
                v-if="selected.length"
                class="bg-forest text-paper rounded-full px-2 py-0.5 text-xs"
              >
                {{ selected.length }} selected
              </span>
            </span>
            <svg
              class="size-5 transition-transform duration-200"
              :class="moreOpen ? 'rotate-180' : ''"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M5 8l5 5 5-5" />
            </svg>
          </button>
          <div v-show="moreOpen" id="more-options" class="mt-4">
            <div class="flex items-baseline justify-between gap-2">
              <p class="text-forest-deep text-sm font-semibold">
                What's going on? <span class="text-ink-muted font-normal">(pick all that fit)</span>
              </p>
              <button
                v-if="selected.length"
                type="button"
                class="text-gold-deep hover:text-forest-deep text-xs font-semibold"
                @click="selected = []"
              >
                Clear all
              </button>
            </div>

            <div class="mt-3 flex flex-wrap gap-2">
              <button
                v-for="option in concerns"
                :key="option"
                type="button"
                :aria-pressed="selected.includes(option)"
                class="rounded-full border px-4 py-2 text-sm transition-colors"
                :class="
                  selected.includes(option)
                    ? 'border-forest bg-forest text-paper'
                    : 'border-line bg-cream text-ink hover:bg-sage-light'
                "
                @click="toggle(option)"
              >
                {{ option }}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- RESOURCE CARDS FLEX CONTAINER -->
    <section class="mx-auto mt-10 max-w-7xl px-4 pb-16">
      <p class="text-ink-muted text-sm">Showing {{ paged.length }} of {{ resources.length }}</p>

      <!-- Bulletproof Flex layout locking cards to max 3 per row -->
      <div class="mt-4 flex flex-wrap justify-center gap-6">
        <article
          v-for="item in paged"
          :key="item.id"
          class="bg-cream-light border-line flex w-full flex-col rounded-2xl border p-6 shadow-sm md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
        >
          <div>
            <span
              class="bg-sage-light text-forest-deep inline-block rounded-full px-3 py-1 text-xs font-semibold"
            >
              {{ item.category }}
            </span>
          </div>

          <h3 class="text-forest-deep mt-3 font-serif text-xl">{{ item.name }}</h3>
          <p class="text-ink mt-2 text-sm leading-relaxed">{{ item.description }}</p>

          <dl class="text-ink-muted mt-4 space-y-2 text-sm">
            <p><span class="text-ink font-semibold">Who it's for:</span> {{ item.audience }}</p>
            <p><span class="text-ink font-semibold">Cost:</span> {{ item.cost }}</p>

            <!-- Phone number (only shows if item.phoneNumber exists) -->
            <div v-if="item.phoneNumber" class="pt-1">
              <a
                :href="`tel:${item.phoneNumber.replace(/\D/g, '')}`"
                class="text-forest-deep hover:text-gold-deep inline-flex items-center gap-1.5 text-sm font-semibold"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                {{ item.phoneNumber }}
              </a>
            </div>

            <!-- Website Link -->
            <div v-if="item.website" class="pt-1">
              <a
                :href="item.website"
                target="_blank"
                rel="noopener noreferrer"
                class="text-forest-deep hover:text-gold-deep inline-flex max-w-full items-center gap-1.5 truncate text-sm font-semibold underline"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                {{ item.website.replace('https://', '').replace('www.', '') }}
              </a>
            </div>
          </dl>

          <div class="bg-sage-light mt-4 rounded-lg p-3">
            <p class="text-gold-deep text-xs font-semibold tracking-widest uppercase">
              Good fit if...
            </p>
            <p class="text-ink mt-1 text-sm">{{ item.goodFit }}</p>
          </div>

          <div class="mt-auto flex gap-2 pt-5">
            <UButton :to="item.website" target="_blank" variant="outline" color="primary" size="sm">
              Website
            </UButton>
          </div>
        </article>
      </div>

      <div v-if="resources.length > perPage" class="mt-8 flex justify-center">
        <UPagination v-model:page="page" :total="resources.length" :items-per-page="perPage" />
      </div>
    </section>

    <!-- LEARN: Guide / Wellness Tool tabs -->
    <section class="mx-auto max-w-7xl px-4 pt-12">
      <h2 class="text-forest-deep text-3xl">Learn and care for yourself</h2>
      <p class="text-ink-muted mt-2">Read a guide, or try a wellness tool.</p>

      <nav class="border-line mt-8 flex border-b" role="tablist">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          role="tab"
          :aria-selected="activeTab === tab.id"
          class="-mb-px flex-1 cursor-pointer border-b-[3px] py-3 text-center text-sm transition-colors"
          :class="
            activeTab === tab.id
              ? 'border-forest text-forest-deep font-semibold'
              : 'text-ink-muted hover:text-forest-deep border-transparent font-medium'
          "
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </nav>
    </section>

    <!-- GUIDE TAB -->
    <div v-if="activeTab === 'guide'">
      <section class="mx-auto max-w-7xl px-4 pt-10 pb-20">
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <article
            v-for="guide in guides"
            :key="guide.title"
            class="bg-cream-light border-line border-l-forest flex flex-col rounded-2xl border border-l-4 p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <p class="text-gold-deep text-xs font-semibold tracking-widest uppercase">
              {{ guide.category }}
            </p>
            <h3 class="text-forest-deep mt-2 text-lg leading-snug">{{ guide.title }}</h3>
            <p class="text-ink-muted mt-2 text-sm leading-relaxed">{{ guide.description }}</p>

            <div class="mt-auto pt-5">
              <UButton
                v-if="guide.href"
                :to="guide.href"
                external
                color="primary"
                variant="outline"
                size="sm"
              >
                Read the guide
              </UButton>
            </div>
          </article>
        </div>
      </section>
    </div>

    <!-- WELLNESS TOOL TAB -->
    <div v-else>
      <div class="mx-auto max-w-7xl space-y-12 px-4 pt-10 pb-20">
        <!-- Coping strategies -->
        <section>
          <h2 class="text-forest-deep mb-4 text-xl">Coping strategies</h2>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <article v-for="tip in coping" :key="tip.title" :class="cardClass">
              <h3 :class="cardTitle">{{ tip.title }}</h3>
              <p class="text-ink-muted mt-2 text-sm leading-relaxed">{{ tip.text }}</p>
            </article>

            <!-- Breathing timer -->
            <article :class="cardClass">
              <h3 :class="cardTitle">Breathing timer</h3>
              <p class="text-forest mt-2 font-serif text-4xl font-bold" aria-live="polite">
                {{ count }}
              </p>
              <UButton color="primary" class="mt-3" :disabled="breathing" @click="startBreath">
                {{ breathing ? 'Breathe...' : 'Start 4-count breath' }}
              </UButton>
            </article>
          </div>
        </section>

        <!-- Self care toolkit -->
        <section>
          <h2 class="text-forest-deep mb-4 text-xl">Self care toolkit</h2>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <article :class="cardClass">
              <h3 :class="cardTitle">Daily checklist</h3>
              <ul class="mt-3 space-y-2">
                <li v-for="(item, i) in checklist" :key="item.label">
                  <UCheckbox v-model="checklist[i]!.done" :label="item.label" />
                </li>
              </ul>
              <p class="text-ink-muted mt-3 text-xs">
                {{ doneCount }} of {{ checklist.length }} done
              </p>
            </article>

            <article :class="cardClass">
              <h3 :class="cardTitle">Mood check-in</h3>
              <div class="mt-3 flex flex-wrap gap-2">
                <button
                  v-for="(mood, i) in moods"
                  :key="i"
                  type="button"
                  class="size-11 rounded-full border text-xl transition"
                  :class="
                    selectedMood === i
                      ? 'border-forest bg-sage-light ring-forest ring-2'
                      : 'border-line bg-cream hover:bg-sage-light'
                  "
                  :aria-pressed="selectedMood === i"
                  @click="selectedMood = i"
                >
                  {{ mood }}
                </button>
              </div>
              <p v-if="selectedMood !== null" class="text-ink-muted mt-3 text-sm">
                Thank you for being honest. Consider reaching out to someone you trust.
              </p>
            </article>
          </div>
        </section>

        <!-- Mental Health 101 -->
        <section>
          <h2 class="text-forest-deep mb-4 text-xl">Mental Health 101</h2>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <article v-for="item in basics" :key="item.title" :class="cardClass">
              <h3 :class="cardTitle">{{ item.title }}</h3>
              <p class="text-ink-muted mt-2 text-sm leading-relaxed">{{ item.text }}</p>
            </article>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const tabs = [
    { id: 'guide', label: 'Guide' },
    { id: 'tool', label: 'Wellness Tool' },
  ]

  const activeTab = ref('guide')

  const keyword = ref('')
  const zip = ref('')
  const specialty = ref('Any specialty')
  const insurance = ref('Any insurance')
  const careType = ref('Any care type')

  const fieldUi = { base: 'bg-cream ring-line text-ink placeholder:text-ink-muted' }

  const moreOpen = ref(false)
  const selected = ref<string[]>([])

  function toggle(option: string) {
    selected.value = selected.value.includes(option)
      ? selected.value.filter((item) => item !== option)
      : [...selected.value, option]
  }

  const perPage = 6 // Set to 6 to display 2 clean rows of 3 columns
  const page = ref(1)

  const specialties = [
    'Any specialty',
    'Anxiety',
    'Trauma',
    'Couples counseling',
    'LGBTQ+',
    'Youth',
  ]

  const insuranceOptions = ['Any insurance', 'Insurance accepted', 'Low cost']
  const careTypes = ['Any care type', 'In person', 'Virtual']

  const concerns = [
    'I’m overwhelmed and need someone to talk to',
    'Anxiety, stress, or panic',
    'Depression or low moods',
    'Grief or loss',
    'Family, marriage, or relationships',
    'Parenting or supporting my child',
    'Trauma or past experiences',
    'Substance use, for me or a loved one',
    'Faith-rooted counseling',
    'Not sure yet, just need help finding care',
  ]

  const resources = [
    {
      id: 1,
      category: 'For Black Men',
      name: 'Therapy for Black Men',
      description:
        'A directory connecting Black men with culturally competent therapists who understand the unique challenges facing Black men. Real talk, real support.',
      audience: 'Black men seeking therapy with someone who gets it',
      cost: 'Varies by therapist — many accept insurance',
      goodFit:
        "You want a therapist who understands the Black male experience and won't judge you for seeking help.",
      website: 'https://www.therapyforblackmen.com',
    },
    {
      id: 2,
      category: 'For Black Men',
      name: 'Black Men Heal',
      description:
        'Provides free mental health treatment to Black men. Up to 8 free therapy sessions — no insurance needed, no excuses needed.',
      audience: 'Black men who need therapy but cost is a barrier',
      cost: 'Free (up to 8 sessions)',
      goodFit: "You've been thinking about therapy but cost has been holding you back.",
      website: 'https://blackmenheal.org',
    },
    {
      id: 3,
      category: 'Community & Support',
      name: 'The Confess Project',
      description:
        'Training barbers as mental health advocates in their communities. Because sometimes the barbershop is the safest space to open up.',
      audience: 'Black men and boys who find community in barbershops',
      cost: 'Free',
      goodFit:
        "You want to talk about what's on your mind in a space that already feels like home.",
      website: 'https://theconfessprojectofamerica.org/',
    },
    {
      id: 4,
      category: 'For Black Men',
      name: "Brother, You're on My Mind (NAMI)",
      description:
        'A faith-based outreach program addressing mental health in the African American community, particularly for men. Conversations rooted in trust.',
      audience: 'Black men in faith communities who want support',
      cost: 'Free',
      goodFit:
        "You're connected to a faith community and want mental health support that respects your spiritual life.",
      website: 'https://www.nami.org',
    },
    {
      id: 5,
      category: 'Peer Support',
      name: 'Bro Chill™ (AMRI)',
      description:
        'A peer-led mental wellness experience for Black and Brown men. Real conversations, real connection, and real growth.',
      audience: 'Black and Brown men looking for brotherhood and mental wellness',
      cost: 'Free',
      goodFit: 'You want a space where you can breathe, talk, and grow with other men who get it.',
      phoneNumber: '(214) 506-0691',
      website: 'https://www.amindfulresourceinc.org/programs/bro-chill',
    },
    {
      id: 6,
      category: 'Therapy & Counseling',
      name: 'Henry Health',
      description:
        'Connecting Black men with Black male therapists. Because representation matters in the therapy room too.',
      audience: 'Black men who want a Black male therapist',
      cost: 'Accepts insurance — many options available',
      goodFit: 'You want a therapist who looks like you and has walked a similar path.',
      website: 'https://henryhealth.com',
    },
    {
      id: 7,
      category: 'Crisis Support',
      name: 'Man Therapy',
      description:
        'A mental health resource designed specifically for men, using humor and straight talk to break through stigma.',
      audience: 'Men looking for straightforward mental health tools',
      cost: 'Free',
      goodFit: 'You want practical, down-to-earth tools to check in on your well-being.',
      website: 'https://mantherapy.org',
    },
    {
      id: 8,
      category: 'Youth Services',
      name: 'The Steve Fund',
      description:
        'Focused on the mental health of young people of color. Programs, crisis support, and resources designed for the next generation.',
      audience: 'Young people of color (ages 15-25)',
      cost: 'Free',
      goodFit: 'You want resources built specifically by and for youth of color.',
      website: 'https://www.stevefund.org',
    },
    {
      id: 9,
      category: 'For Youth',
      subCategory: 'Therapy & Counseling',
      name: 'Teen Health Connection',
      description:
        'Providing adolescent-focused healthcare including mental health counseling, support groups, and wellness education for teens in Dallas.',
      audience: 'Teens (ages 12-18) in the Dallas area needing mental health support',
      cost: ': Sliding scale — accepts most insurance',
      goodFit:
        "You're a teen looking for a safe space to talk about what you're going through, or a parent seeking support for your teen.",
      website: 'https://www.teenhealthconnection.org/',
    },
  ]

  const paged = computed(() => resources.slice((page.value - 1) * perPage, page.value * perPage))

  const guides = [
    {
      category: 'Families',
      title: 'Caregiver Guide: Autism & Disabilities',
      description:
        'For parents and caregivers of children on the autism spectrum or with disabilities.',
      href: '/guides/caregiver-guide-autism-disabilities.html',
    },
    {
      category: 'Recovery',
      title: 'Substance Use and Mental Health',
      description: 'Understanding the connection between substance use and mental wellness.',
      href: '/guides/substance-use-and-mental-health.html',
    },
    {
      category: 'Faith',
      title: 'Faith and Mental Health',
      description: 'Bridging spiritual practice and mental wellness.',
      href: '/guides/faith-mental-health.html',
    },
    {
      category: 'Youth',
      title: "Understanding Today's Youth",
      description: 'What young people are navigating, and how adults can show up.',
      href: '/guides/understanding-todays-youth.html',
    },
    {
      category: 'Therapy',
      title: 'Getting Started with Therapy',
      description: 'How to find a therapist and make the most of your first sessions.',
      href: '/guides/getting-started-with-therapy.html',
    },
    {
      category: 'Caregivers',
      title: 'Tools & Resources for Caregivers',
      description: 'Practical tools and self-care for those caring for loved ones.',
      href: '/guides/tools-and-resources-for-caregivers.html',
    },
    {
      category: 'Workplace',
      title: 'Workplace Mental Health',
      description: 'Protecting your mental wellness at work, for employees and leaders.',
      href: '/guides/workplace-mental-health.html',
    },
  ]

  const cardClass =
    'bg-cream-light border-line rounded-2xl border p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md'
  const cardTitle = 'text-forest-deep text-base font-semibold'

  const coping = [
    {
      title: '5-4-3-2-1 Grounding',
      text: 'Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.',
    },
    {
      title: 'Box breathing (4-4-4-4)',
      text: 'Inhale 4, hold 4, exhale 4, hold 4. Repeat for a few minutes.',
    },
    { title: 'Reach out', text: 'Text or call one person you trust and tell them how you are.' },
  ]

  const basics = [
    {
      title: 'What is mental health?',
      text: 'Our emotional, psychological and social well-being. It affects how we think, feel and act.',
    },
    {
      title: 'Common signs to notice',
      text: 'Changes in sleep, appetite, energy, mood or interest in things you enjoy.',
    },
    {
      title: 'When to seek help',
      text: 'If symptoms last more than a couple of weeks or get in the way of daily life, consider talking to a professional.',
    },
    { title: 'Myths', text: 'Therapy is not only for crisis, and asking for help is a strength.' },
  ]

  const count = ref(4)
  const breathing = ref(false)
  let timer: ReturnType<typeof setInterval> | undefined

  const startBreath = () => {
    breathing.value = true
    count.value = 4
    timer = setInterval(() => {
      if (count.value > 1) {
        count.value--
      } else {
        clearInterval(timer)
        breathing.value = false
        count.value = 4
      }
    }, 1000)
  }
  onUnmounted(() => clearInterval(timer))

  const checklist = ref([
    { label: 'Drink water', done: false },
    { label: 'Move your body', done: false },
    { label: 'Eat something nourishing', done: false },
    { label: 'Connect with someone', done: false },
    { label: 'Rest or step away from screens', done: false },
  ])
  const doneCount = computed(() => checklist.value.filter((i) => i.done).length)

  const moods = ['😞', '😕', '😐', '🙂', '😄']
  const selectedMood = ref<number | null>(null)
</script>
