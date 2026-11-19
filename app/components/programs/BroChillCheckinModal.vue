<script setup lang="ts">
  import FormModalShell from '../forms/FormModalShell.vue'
  import FormTextInput from '../forms/FormTextInput.vue'
  import FormTextarea from '../forms/FormTextarea.vue'
  import FormSelect from '../forms/FormSelect.vue'
  import FormPillSelect from '../forms/FormPillSelect.vue'
  import FormLikertScale from '../forms/FormLikertScale.vue'
  import type { Program } from '../../data/programs'

  const props = defineProps<{
    open: boolean
    program: Program
  }>()

  const emit = defineEmits<{
    (e: 'update:open', value: boolean): void
    (e: 'close'): void
  }>()

  const DESTINATION_EMAIL = 'brianjayayo@gmail.com'

  const firstTimePills = [
    { label: 'Yes, first time', value: 'Yes, first time' },
    { label: "I've been before", value: "I've been before" },
  ]

  // Exact dropdown options from user instructions
  const whyComeOptions = [
    {
      label: 'Need community / brotherhood',
      value: 'Need community / brotherhood',
    },
    {
      label: 'Working through something heavy',
      value: 'Working through something heavy',
    },
    {
      label: 'Curious - first time pulling up',
      value: 'Curious - first time pulling up',
    },
    { label: 'Regular - this is my circle', value: 'Regular - this is my circle' },
    { label: 'A brother invited me', value: 'A brother invited me' },
    {
      label: 'Looking for mental health support',
      value: 'Looking for mental health support',
    },
    {
      label: 'Just want to listen tonight',
      value: 'Just want to listen tonight',
    },
    { label: 'Other', value: 'Other' },
  ]

  const howFoundOptions = [
    { label: 'Select...', value: '' },
    { label: 'Social media (Instagram/Facebook)', value: 'Social media' },
    { label: 'Friend or family member', value: 'Friend or family member' },
    { label: 'Community partner or flier', value: 'Community partner' },
    { label: 'Online search / Website', value: 'Website' },
    { label: 'Other', value: 'Other' },
  ]

  const carryingDurationPills = [
    { label: 'Less than a month', value: 'Less than a month' },
    { label: 'A few months', value: 'A few months' },
    { label: 'About a year', value: 'About a year' },
    { label: 'A few years', value: 'A few years' },
    { label: 'Five years or more', value: 'Five years or more' },
    { label: 'As long as I can remember', value: 'As long as I can remember' },
    { label: 'Rather not say', value: 'Rather not say' },
  ]

  const threeChoicePills = [
    { label: 'Yes', value: 'Yes' },
    { label: 'Not right now', value: 'Not right now' },
    { label: 'Maybe', value: 'Maybe' },
  ]

  const sessionOptions = [
    {
      label: 'Tonight’s Circle (Biweekly Thursday · 6:30 PM)',
      value: 'Tonight’s Circle',
    },
    {
      label: 'General Session Check-In',
      value: 'General Session Check-In',
    },
  ]

  const defaultSession =
    sessionOptions[0]?.value ?? 'Tonight’s Circle (Biweekly Thursday · 6:30 PM)'

  const form = reactive({
    name: '',
    email: '',
    phone: '',
    session: defaultSession,
    firstTime: 'Yes, first time',
    whyCome: 'Need community / brotherhood',
    howFound: '',
    carryingDuration: 'A few months',

    // Likert 1-5 scale (pre-circle check-in from screenshot)
    q1Stress: 3,
    q2CalmDown: 3,
    q3HonestSpace: 3,
    q4CallBrothers: 3,
    q5ReachSupport: 3,

    // Follow-up & care need indicators
    checkOnYou: 'Maybe',
    healthInsurance: 'Yes',
    mindTonight: '',
  })

  const isSubmitted = ref(false)

  watch(
    () => props.open,
    (isOpen) => {
      if (isOpen) {
        isSubmitted.value = false
        form.name = ''
        form.email = ''
        form.phone = ''
        form.session = defaultSession
        form.firstTime = 'Yes, first time'
        form.whyCome = 'Need community / brotherhood'
        form.howFound = ''
        form.carryingDuration = 'A few months'
        form.q1Stress = 3
        form.q2CalmDown = 3
        form.q3HonestSpace = 3
        form.q4CallBrothers = 3
        form.q5ReachSupport = 3
        form.checkOnYou = 'Maybe'
        form.healthInsurance = 'Yes'
        form.mindTonight = ''
      }
    }
  )

  function handleSubmit() {
    const today = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

    const subject = `[Bro Chill Check-In] ${form.name} - ${today}`
    const bodyLines = [
      `Bro Chill Session Check-In (${today})`,
      `Session: ${form.session}`,
      `----------------------------------------`,
      `IDENTIFICATION`,
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      `First time at Bro Chill: ${form.firstTime}`,
      `Why did you come tonight: ${form.whyCome}`,
      `How did you find out: ${form.howFound || 'N/A'}`,
      `How long carrying: ${form.carryingDuration}`,
      `----------------------------------------`,
      `PRE-CIRCLE CHECK-IN (1-5 SCALE)`,
      `1. Handle stress carrying right now: ${form.q1Stress}/5`,
      `2. Know what to do when things get heavy: ${form.q2CalmDown}/5`,
      `3. Have a space where I can be honest: ${form.q3HonestSpace}/5`,
      `4. Have brothers I could call on: ${form.q4CallBrothers}/5`,
      `5. If needed real support, would reach out: ${form.q5ReachSupport}/5`,
      `----------------------------------------`,
      `INDICATORS & CLOSING`,
      `Want someone to check on you this week: ${form.checkOnYou}`,
      `Covered on health insurance right now: ${form.healthInsurance}`,
      `What's on your mind going into tonight:`,
      form.mindTonight || '(None provided)',
    ]

    const mailtoUrl = `mailto:${DESTINATION_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(bodyLines.join('\n'))}`

    window.location.href = mailtoUrl
    isSubmitted.value = true
  }
</script>

<template>
  <FormModalShell
    :open="open"
    eyebrow="Session Arrival"
    title="Bro Chill™ Circle Check-In"
    subtitle="Let us know you're in the room and check in before we open the circle."
    :is-submitted="isSubmitted"
    :destination-email="DESTINATION_EMAIL"
    @update:open="(val: boolean) => emit('update:open', val)"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Section 1: Identification & Context -->
      <div class="space-y-4">
        <FormTextInput
          id="checkin-name"
          label="Your Name"
          v-model="form.name"
          required
          placeholder="First and last name"
        />

        <div class="grid gap-4 sm:grid-cols-2">
          <FormTextInput
            id="checkin-email"
            label="Email Address"
            type="email"
            v-model="form.email"
            required
            placeholder="you@example.com"
          />
          <FormTextInput
            id="checkin-phone"
            label="Phone Number"
            type="tel"
            v-model="form.phone"
            required
            placeholder="(555) 000-0000"
          />
        </div>

        <FormPillSelect
          label="First time at Bro Chill?"
          v-model="form.firstTime"
          :options="firstTimePills"
        />

        <FormSelect
          id="checkin-why"
          label="Why did you come tonight? (Optional)"
          v-model="form.whyCome"
          :options="whyComeOptions"
        />

        <FormSelect
          id="checkin-howfound"
          label="How did you find out about Bro Chill? (Optional)"
          v-model="form.howFound"
          :options="howFoundOptions"
          placeholder="Select..."
        />

        <FormPillSelect
          label="How long have you been carrying what brought you here tonight? (Optional)"
          v-model="form.carryingDuration"
          :options="carryingDurationPills"
          help-text="Totally optional. No wrong answer."
        />
      </div>

      <!-- Section 2: Likert Scale Survey from Screenshot -->
      <div class="space-y-5 rounded-2xl border border-line bg-cream p-4 sm:p-5">
        <div>
          <div class="flex items-center gap-2">
            <h4 class="text-sm font-bold text-forest-deep sm:text-base">
              Before we start — where you at tonight?
            </h4>
            <span class="text-xs font-semibold text-ink-muted uppercase">Optional</span>
          </div>
          <p class="mt-1 text-xs leading-relaxed text-ink-muted">
            Five quick ones. No right answer, no wrong one. We ask again at the end to see what
            shifted.
          </p>
        </div>

        <div class="space-y-4 pt-1">
          <FormLikertScale
            prompt="I can handle the stress I'm carrying right now."
            v-model="form.q1Stress"
          />
          <FormLikertScale
            prompt="I know what to do to bring myself down when things get heavy."
            v-model="form.q2CalmDown"
          />
          <FormLikertScale
            prompt="I have a space where I can be honest about how I'm really doing."
            v-model="form.q3HonestSpace"
          />
          <FormLikertScale
            prompt="I have brothers I could call on if I needed to."
            v-model="form.q4CallBrothers"
          />
          <FormLikertScale
            prompt="If I needed real support, I would reach out and get it."
            v-model="form.q5ReachSupport"
          />
        </div>
      </div>

      <!-- Section 3: Follow-up & Care Need Indicators -->
      <div class="space-y-4">
        <p class="text-xs leading-relaxed text-ink-muted">
          A few more things, only if you want to. This helps us show up for you right.
        </p>

        <FormPillSelect
          label="Want somebody to check on you this week? (Optional)"
          v-model="form.checkOnYou"
          :options="threeChoicePills"
        />

        <FormPillSelect
          label="You covered on health insurance right now? (Optional)"
          v-model="form.healthInsurance"
          :options="threeChoicePills"
        />

        <FormTextarea
          id="checkin-mind"
          label="What's on your mind going into tonight? (Optional)"
          v-model="form.mindTonight"
          placeholder="Optional — drop a few words on what you're carrying in or hoping for."
        />
      </div>

      <!-- Submit Button -->
      <div class="flex items-center justify-end gap-3 pt-3">
        <UButton color="neutral" variant="ghost" type="button" @click="emit('update:open', false)">
          Cancel
        </UButton>
        <UButton color="primary" type="submit"> Check In for Circle </UButton>
      </div>
    </form>
  </FormModalShell>
</template>
