<script setup lang="ts">
  import { z } from 'zod'

  definePageMeta({
    alias: ['/the-village'],
  })

  interface VillageMember {
    userId: string
    name: string
    email: string
    phoneNumber: string | null
    hasImage: boolean
    credentials: string | null
    organization: string | null
    city: string | null
    preferredContactMethod: string | null
    website: string | null
    availability: string
    roles: string[]
  }

  interface VillageStatusResponse {
    authenticated: boolean
    role: string | null
    isMember: boolean
    applicationStatus: 'none' | 'pending' | 'approved' | 'rejected'
    member: {
      phoneNumber: string | null
      credentials: string | null
      organization: string | null
      city: string | null
      preferredContactMethod: string | null
      website: string | null
      availability: string
      reasonForJoining: string | null
      roles: string[]
    } | null
  }

  const toast = useToast()

  // 1. Fetch current user's village membership status
  const { data: statusData, refresh: refreshStatus } =
    await useFetch<VillageStatusResponse>('/api/village/status')

  const isAuthenticated = computed(() => statusData.value?.authenticated ?? false)
  const isMember = computed(() => statusData.value?.isMember ?? false)
  const applicationStatus = computed(() => statusData.value?.applicationStatus ?? 'none')

  // 2. Member Directory data (only fetched/used when isMember is true)
  const { data: members, status: directoryFetchStatus } = await useFetch<VillageMember[]>(
    '/api/village/members',
    {
      immediate: isMember.value,
    }
  )

  const selectedMember = ref<VillageMember | null>(null)
  const showProfile = ref(false)

  function openProfile(member: VillageMember) {
    selectedMember.value = member
    showProfile.value = true
  }

  function initials(name: string): string {
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const roleLabels: Record<string, string> = {
    clinician: 'Clinician',
    wellness: 'Wellness Provider',
    coach: 'Coach',
    faith_leader: 'Faith Leader',
  }

  function roleLabel(role: string): string {
    return roleLabels[role] ?? role
  }

  // 3. Application Form state
  const isSubmitting = ref(false)
  const showReapplyForm = ref(false)

  const availableRoles = [
    { value: 'clinician', label: 'Clinician (Therapist, Psychologist, Psychiatrist)' },
    { value: 'wellness', label: 'Wellness Provider (Nutrition, Fitness, Holistic)' },
    { value: 'coach', label: 'Coach (Life, Career, Executive)' },
    { value: 'faith_leader', label: 'Faith Leader (Pastor, Chaplain, Spiritual Director)' },
  ]

  const formState = reactive({
    roles: [] as string[],
    credentials: '',
    organization: '',
    city: '',
    phoneNumber: '',
    preferredContactMethod: 'email' as 'email' | 'phone',
    website: '',
    availability: 'available' as 'available' | 'unavailable',
    reasonForJoining: '',
  })

  // Pre-fill existing data if re-applying or viewing
  watchEffect(() => {
    if (statusData.value?.member) {
      const m = statusData.value.member
      formState.roles = m.roles || []
      formState.credentials = m.credentials || ''
      formState.organization = m.organization || ''
      formState.city = m.city || ''
      formState.phoneNumber = m.phoneNumber || ''
      formState.preferredContactMethod = (m.preferredContactMethod as 'email' | 'phone') || 'email'
      formState.website = m.website || ''
      formState.availability = (m.availability as 'available' | 'unavailable') || 'available'
      formState.reasonForJoining = m.reasonForJoining || ''
    }
  })

  function toggleRole(roleVal: string) {
    const idx = formState.roles.indexOf(roleVal)
    if (idx >= 0) {
      formState.roles.splice(idx, 1)
    } else {
      formState.roles.push(roleVal)
    }
  }

  const applicationSchema = z.object({
    roles: z.array(z.string()).min(1, 'Please select at least one professional role'),
    credentials: z.string().optional(),
    organization: z.string().optional(),
    city: z.string().optional(),
    phoneNumber: z.string().optional(),
    preferredContactMethod: z.enum(['email', 'phone']),
    website: z.string().optional(),
    availability: z.enum(['available', 'unavailable']),
    reasonForJoining: z.string().optional(),
  })

  async function handleApply() {
    if (formState.roles.length === 0) {
      toast.add({
        title: 'Role Required',
        description: 'Please select at least one professional role to join The Village.',
        color: 'error',
      })
      return
    }

    isSubmitting.value = true
    try {
      await $fetch('/api/village/apply', {
        method: 'POST',
        body: {
          roles: formState.roles,
          credentials: formState.credentials,
          organization: formState.organization,
          city: formState.city,
          phoneNumber: formState.phoneNumber,
          preferredContactMethod: formState.preferredContactMethod,
          website: formState.website,
          availability: formState.availability,
          reasonForJoining: formState.reasonForJoining,
        },
      })

      toast.add({
        title: 'Application Submitted!',
        description: 'Your application has been received and is pending review by our vetting committee.',
        color: 'success',
      })

      showReapplyForm.value = false
      await refreshStatus()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit application'
      toast.add({
        title: 'Submission Failed',
        description: msg,
        color: 'error',
      })
    } finally {
      isSubmitting.value = false
    }
  }

  // Value cards from the approved mockup
  const valueCards = [
    {
      icon: 'i-lucide-user-check',
      title: 'Vetted membership',
      description: 'Every member is reviewed and credentialed before joining the directory.',
    },
    {
      icon: 'i-lucide-heart-handshake',
      title: 'Peer referrals',
      description:
        'Send and receive professional referrals — never client-identifying information.',
    },
    {
      icon: 'i-lucide-sparkles',
      title: 'Shared resources',
      description: 'Tools, training, and meeting info available only to approved members.',
    },
    {
      icon: 'i-lucide-shield-check',
      title: 'Private by design',
      description:
        'Separate from our public Care Connections directory. Members-only access.',
    },
  ]
</script>

<template>
  <div class="min-h-screen bg-cream text-ink">
    <!-- ========================================== -->
    <!-- VIEW A: APPROVED VILLAGE MEMBER DIRECTORY -->
    <!-- ========================================== -->
    <template v-if="isMember">
      <!-- hero banner -->
      <section class="bg-forest px-6 py-16 text-center">
        <p class="mb-2 text-sm font-semibold tracking-widest text-gold-light uppercase">
          The Village
        </p>
        <h1 class="font-serif text-4xl font-bold text-paper md:text-5xl">Member directory.</h1>
        <p class="mx-auto mt-4 max-w-xl text-mist">
          Connect with approved members of The Village.
        </p>
      </section>

      <!-- member count -->
      <UContainer class="py-8">
        <p v-if="members?.length" class="mb-6 text-sm text-ink-muted">
          Showing {{ members.length }} member{{ members.length === 1 ? '' : 's' }}
        </p>

        <!-- loading -->
        <div v-if="directoryFetchStatus === 'pending'" class="flex justify-center py-20">
          <span class="text-2xl text-forest animate-spin">⟳</span>
        </div>

        <!-- empty -->
        <div
          v-else-if="!members?.length"
          class="rounded-xl border border-line bg-cream-light px-6 py-20 text-center"
        >
          <p class="text-lg text-ink-muted">No members found.</p>
        </div>

        <!-- card grid -->
        <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="member in members"
            :key="member.userId"
            class="flex flex-col rounded-xl border border-line bg-cream-light p-5 shadow-xs"
          >
            <!-- avatar + name -->
            <div class="mb-3 flex items-center gap-3">
              <div
                class="flex size-12 shrink-0 items-center justify-center rounded-full bg-forest text-sm font-bold text-paper"
              >
                {{ initials(member.name) }}
              </div>
              <div class="min-w-0">
                <p class="truncate font-serif text-lg font-semibold text-forest-deep">
                  {{ member.name }}
                </p>
                <p v-if="member.credentials" class="truncate text-xs text-ink-muted">
                  {{ member.credentials }}
                </p>
              </div>
            </div>

            <!-- roles -->
            <div class="mb-3 flex flex-wrap gap-1.5">
              <span
                v-for="role in member.roles"
                :key="role"
                class="rounded-full bg-sage-light px-2.5 py-0.5 text-xs font-medium text-forest-deep"
              >
                {{ roleLabel(role) }}
              </span>
            </div>

            <!-- city + availability -->
            <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
              <span v-if="member.city" class="flex items-center gap-1">
                ⦿
                {{ member.city }}
              </span>
              <span class="flex items-center gap-1">
                <span
                  class="inline-block size-2 rounded-full"
                  :class="
                    member.availability === 'available' ? 'bg-forest' : 'bg-ink-muted opacity-50'
                  "
                />
                {{ member.availability === 'available' ? 'Accepting referrals' : 'Not available' }}
              </span>
            </div>

            <!-- view profile button -->
            <div class="mt-auto pt-4">
              <UButton
                size="sm"
                color="primary"
                variant="outline"
                block
                @click="openProfile(member)"
              >
                View Profile
              </UButton>
            </div>
          </div>
        </div>
      </UContainer>

      <!-- profile modal -->
      <UModal v-model:open="showProfile">
        <template #content>
          <div
            v-if="selectedMember"
            class="max-h-[85vh] overflow-y-auto rounded-xl bg-cream-light p-6"
          >
            <!-- close button -->
            <div class="mb-4 flex justify-end">
              <UButton
                icon="i-lucide-x"
                color="neutral"
                variant="ghost"
                size="sm"
                @click="showProfile = false"
              />
            </div>

            <!-- header -->
            <div class="mb-6 flex flex-col items-center text-center">
              <div
                class="mb-3 flex size-20 items-center justify-center rounded-full bg-forest text-2xl font-bold text-paper"
              >
                {{ initials(selectedMember.name) }}
              </div>
              <h2 class="font-serif text-2xl font-bold text-forest-deep">{{ selectedMember.name }}</h2>
              <p v-if="selectedMember.credentials" class="mt-1 text-sm text-ink-muted">
                {{ selectedMember.credentials }}
              </p>

              <!-- roles -->
              <div class="mt-3 flex flex-wrap justify-center gap-1.5">
                <span
                  v-for="role in selectedMember.roles"
                  :key="role"
                  class="rounded-full bg-sage-light px-3 py-1 text-xs font-medium text-forest-deep"
                >
                  {{ roleLabel(role) }}
                </span>
              </div>

              <!-- meta row -->
              <div
                class="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-ink-muted"
              >
                <span v-if="selectedMember.city" class="flex items-center gap-1">
                  ⦿
                  {{ selectedMember.city }}
                </span>
                <span class="flex items-center gap-1">
                  <span
                    class="inline-block size-2 rounded-full"
                    :class="
                      selectedMember.availability === 'available'
                        ? 'bg-forest'
                        : 'bg-ink-muted opacity-50'
                    "
                  />
                  {{
                    selectedMember.availability === 'available'
                      ? 'Accepting referrals'
                      : 'Not available'
                  }}
                </span>
              </div>
            </div>

            <hr class="border-line" />

            <!-- details -->
            <div class="mt-6 space-y-5">
              <div v-if="selectedMember.organization">
                <p class="text-xs font-semibold tracking-wide text-ink-muted uppercase">
                  Organization
                </p>
                <p class="mt-1 font-medium">{{ selectedMember.organization }}</p>
              </div>

              <div>
                <p class="text-xs font-semibold tracking-wide text-ink-muted uppercase">
                  Preferred Contact
                </p>
                <p
                  v-if="
                    selectedMember.preferredContactMethod === 'phone' && selectedMember.phoneNumber
                  "
                  class="mt-1"
                >
                  {{ selectedMember.phoneNumber }}
                </p>
                <p v-else class="mt-1">
                  {{ selectedMember.email }}
                </p>
              </div>

              <div v-if="selectedMember.website">
                <p class="text-xs font-semibold tracking-wide text-ink-muted uppercase">
                  Website
                </p>
                <a
                  :href="selectedMember.website"
                  target="_blank"
                  rel="noopener"
                  class="mt-1 inline-flex items-center gap-1 text-gold-deep underline hover:text-forest"
                >
                  {{ selectedMember.website }} ↗
                </a>
              </div>
            </div>
          </div>
        </template>
      </UModal>
    </template>

    <!-- ========================================== -->
    <!-- VIEW B: APPLY TO JOIN (NON-MEMBERS / GUESTS) -->
    <!-- ========================================== -->
    <template v-else>
      <!-- hero banner with exact village text -->
      <section class="bg-forest px-6 py-20 text-center">
        <p class="mb-3 text-sm font-semibold tracking-widest text-gold-light uppercase">
          The Village
        </p>
        <h1 class="font-serif text-4xl font-bold tracking-tight text-paper sm:text-5xl md:text-6xl">
          See a brother, help a brother.
        </h1>
        <p class="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
          A private, vetted network of Black male mental health professionals — plus allied
          wellness providers, faith leaders, and coaches — collaborating, sharing resources, and
          referring to one another.
        </p>
      </section>

      <!-- 4 feature cards from the approved mockup -->
      <UContainer class="py-14">
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="card in valueCards"
            :key="card.title"
            class="flex flex-col rounded-2xl border border-line bg-cream-light p-6 shadow-xs transition-shadow hover:shadow-sm"
          >
            <div class="mb-4 flex size-12 items-center justify-center rounded-xl bg-sage-light/60">
              <UIcon :name="card.icon" class="size-6 text-forest-deep" />
            </div>
            <h3 class="font-serif text-xl font-bold text-forest-deep">
              {{ card.title }}
            </h3>
            <p class="mt-2 text-sm leading-relaxed text-ink-muted">
              {{ card.description }}
            </p>
          </div>
        </div>

        <!-- dynamic action / application section -->
        <div class="mt-14">
          <!-- 1. GUEST: NOT LOGGED IN -->
          <div
            v-if="!isAuthenticated"
            class="mx-auto max-w-2xl rounded-2xl border border-line bg-cream-light p-8 text-center shadow-sm sm:p-10"
          >
            <div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-sage-light">
              <UIcon name="i-lucide-user-plus" class="size-7 text-forest-deep" />
            </div>
            <h2 class="font-serif text-2xl font-bold text-forest-deep sm:text-3xl">
              Apply to join The Village
            </h2>
            <p class="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink-muted">
              To submit your credentialing information and request membership, please sign in or create an account on the site.
            </p>
            <div class="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <UButton
                to="/auth?redirect=/village"
                color="secondary"
                size="lg"
                class="px-8 font-semibold"
                label="Log In to Apply"
              />
              <UButton
                to="/auth?mode=signup&redirect=/village"
                variant="outline"
                color="neutral"
                size="lg"
                class="px-8 font-semibold ring-mist-muted"
                label="Create an Account"
              />
            </div>
          </div>

          <!-- 2. LOGGED IN: APPLICATION IS PENDING REVIEW -->
          <div
            v-else-if="applicationStatus === 'pending'"
            class="mx-auto max-w-2xl rounded-2xl border border-gold-deep/30 bg-gold-light/15 p-8 text-center shadow-xs sm:p-10"
          >
            <div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-gold-light/40">
              <UIcon name="i-lucide-clock" class="size-7 text-gold-deep" />
            </div>
            <h2 class="font-serif text-2xl font-bold text-forest-deep sm:text-3xl">
              Application Under Review
            </h2>
            <p class="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink">
              Thank you for applying to The Village! Our advisory committee is currently reviewing your credentials and professional information. You will be granted full directory access once your application is approved.
            </p>

            <div
              v-if="statusData?.member"
              class="mt-6 rounded-xl border border-gold-deep/20 bg-cream-light p-4 text-left text-xs text-ink-muted"
            >
              <p class="font-semibold text-forest-deep">Submitted Information:</p>
              <div class="mt-2 grid grid-cols-2 gap-2">
                <div>
                  <span class="font-medium text-ink">Roles:</span>
                  {{ statusData.member.roles.map(roleLabel).join(', ') }}
                </div>
                <div v-if="statusData.member.city">
                  <span class="font-medium text-ink">City:</span> {{ statusData.member.city }}
                </div>
                <div v-if="statusData.member.organization">
                  <span class="font-medium text-ink">Organization:</span>
                  {{ statusData.member.organization }}
                </div>
                <div v-if="statusData.member.credentials">
                  <span class="font-medium text-ink">Credentials:</span>
                  {{ statusData.member.credentials }}
                </div>
              </div>
            </div>
          </div>

          <!-- 3. LOGGED IN: APPLICATION REJECTED -->
          <div
            v-else-if="applicationStatus === 'rejected' && !showReapplyForm"
            class="mx-auto max-w-2xl rounded-2xl border border-line bg-cream-light p-8 text-center shadow-xs sm:p-10"
          >
            <div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-sage-light">
              <UIcon name="i-lucide-info" class="size-7 text-forest-deep" />
            </div>
            <h2 class="font-serif text-2xl font-bold text-forest-deep sm:text-3xl">
              Application Update
            </h2>
            <p class="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink-muted">
              Your application was not approved for directory access at this time. If you have updated credentials or wish to submit additional details for consideration, you may submit an updated request.
            </p>
            <div class="mt-6">
              <UButton
                color="primary"
                size="md"
                class="font-semibold"
                label="Submit Updated Application"
                @click="showReapplyForm = true"
              />
            </div>
          </div>

          <!-- 4. LOGGED IN: NEW APPLICATION FORM (OR REAPPLYING) -->
          <div
            v-else
            class="mx-auto max-w-3xl rounded-2xl border border-line bg-cream-light p-6 shadow-sm sm:p-10"
          >
            <div class="mb-8 border-b border-line pb-6">
              <h2 class="font-serif text-2xl font-bold text-forest-deep sm:text-3xl">
                Village Membership Application
              </h2>
              <p class="mt-2 text-sm text-ink-muted">
                Membership in The Village is reserved for vetted Black male mental health professionals, wellness providers, coaches, and faith leaders. Please provide your professional credentials and practice details below.
              </p>
            </div>

            <UForm :schema="applicationSchema" :state="formState" class="space-y-6" @submit="handleApply">
              <!-- Roles selection -->
              <div>
                <label class="block text-sm font-semibold text-forest-deep">
                  Professional Roles <span class="text-xs text-ink-muted">(Select at least one)</span>
                </label>
                <div class="mt-3 grid gap-3 sm:grid-cols-2">
                  <button
                    v-for="role in availableRoles"
                    :key="role.value"
                    type="button"
                    class="flex items-start gap-3 rounded-xl border p-3.5 text-left transition-colors"
                    :class="
                      formState.roles.includes(role.value)
                        ? 'border-forest bg-sage-light/40 text-forest-deep'
                        : 'border-line bg-cream hover:border-forest/50'
                    "
                    @click="toggleRole(role.value)"
                  >
                    <div
                      class="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border"
                      :class="
                        formState.roles.includes(role.value)
                          ? 'border-forest bg-forest text-paper'
                          : 'border-line bg-cream-light'
                      "
                    >
                      <UIcon
                        v-if="formState.roles.includes(role.value)"
                        name="i-lucide-check"
                        class="size-3"
                      />
                    </div>
                    <span class="text-xs font-medium leading-snug">{{ role.label }}</span>
                  </button>
                </div>
              </div>

              <!-- 2-column details -->
              <div class="grid gap-4 sm:grid-cols-2">
                <UFormField label="Credentials / Licenses" name="credentials" hint="e.g. LPC, LMFT, LCSW, MD, PhD, LMT">
                  <UInput
                    v-model="formState.credentials"
                    placeholder="LPC, PhD"
                    class="w-full"
                  />
                </UFormField>

                <UFormField label="Organization / Practice" name="organization">
                  <UInput
                    v-model="formState.organization"
                    placeholder="Practice or Clinic name"
                    class="w-full"
                  />
                </UFormField>

                <UFormField label="City / Region" name="city">
                  <UInput
                    v-model="formState.city"
                    placeholder="Dallas, TX"
                    class="w-full"
                  />
                </UFormField>

                <UFormField label="Phone Number" name="phoneNumber">
                  <UInput
                    v-model="formState.phoneNumber"
                    type="tel"
                    placeholder="(214) 555-0100"
                    class="w-full"
                  />
                </UFormField>

                <UFormField label="Professional Website" name="website">
                  <UInput
                    v-model="formState.website"
                    type="url"
                    placeholder="https://example.com"
                    class="w-full"
                  />
                </UFormField>

                <UFormField label="Preferred Contact Method" name="preferredContactMethod">
                  <select
                    v-model="formState.preferredContactMethod"
                    class="w-full rounded-md border border-line bg-cream-light px-3 py-2 text-sm text-ink focus:border-forest focus:outline-none"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                  </select>
                </UFormField>
              </div>

              <div class="grid gap-4 sm:grid-cols-2">
                <UFormField label="Referral Availability" name="availability">
                  <select
                    v-model="formState.availability"
                    class="w-full rounded-md border border-line bg-cream-light px-3 py-2 text-sm text-ink focus:border-forest focus:outline-none"
                  >
                    <option value="available">Accepting Referrals</option>
                    <option value="unavailable">Not Currently Accepting</option>
                  </select>
                </UFormField>
              </div>

              <UFormField
                label="Statement of Interest / Focus"
                name="reasonForJoining"
                hint="Tell us about your practice, background, and what you hope to contribute or gain from The Village"
              >
                <textarea
                  v-model="formState.reasonForJoining"
                  rows="3"
                  class="w-full rounded-md border border-line bg-cream-light p-3 text-sm text-ink focus:border-forest focus:outline-none"
                  placeholder="Share a brief statement about your practice, clinical background, and community focus..."
                />
              </UFormField>

              <div class="pt-2">
                <UButton
                  type="submit"
                  color="secondary"
                  size="lg"
                  block
                  :loading="isSubmitting"
                  class="font-semibold"
                  label="Submit Membership Application"
                />
              </div>
            </UForm>
          </div>
        </div>
      </UContainer>
    </template>
  </div>
</template>
