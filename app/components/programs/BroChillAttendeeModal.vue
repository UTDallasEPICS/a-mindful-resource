<script setup lang="ts">
  import FormModalShell from '../forms/FormModalShell.vue'
  import FormTextInput from '../forms/FormTextInput.vue'
  import FormTextarea from '../forms/FormTextarea.vue'
  import FormSelect from '../forms/FormSelect.vue'
  import FormPillSelect from '../forms/FormPillSelect.vue'
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

  const ageOptions = [
    { label: '18–24', value: '18–24' },
    { label: '25–34', value: '25–34' },
    { label: '35–44', value: '35–44' },
    { label: '45–54', value: '45–54' },
    { label: '55+', value: '55+' },
  ]

  const sessionOptions = [
    {
      label: 'Upcoming Biweekly Thursday · 6:30 PM – 8:00 PM',
      value: 'Upcoming Biweekly Thursday · 6:30 PM – 8:00 PM',
    },
    {
      label: 'Next Month Biweekly Thursday · 6:30 PM – 8:00 PM',
      value: 'Next Month Biweekly Thursday · 6:30 PM – 8:00 PM',
    },
    {
      label: 'Notify me of future community circle dates',
      value: 'Notify me of future community circle dates',
    },
  ]

  const defaultSession =
    sessionOptions[0]?.value ?? 'Upcoming Biweekly Thursday · 6:30 PM – 8:00 PM'

  const firstTimeOptions = [
    { label: 'Yes, first time', value: 'Yes, first time' },
    { label: "I've been before", value: "I've been before" },
  ]

  const referralOptions = [
    { label: 'Social Media', value: 'Social Media' },
    { label: 'Friend / Word of Mouth', value: 'Friend / Word of Mouth' },
    { label: 'Community Partner', value: 'Community Partner' },
    { label: 'School / Campus', value: 'School / Campus' },
    { label: 'Church / Faith Leader', value: 'Church / Faith Leader' },
    { label: 'Flyer / In Person', value: 'Flyer / In Person' },
    { label: 'Other', value: 'Other' },
  ]

  const form = reactive({
    name: '',
    email: '',
    phone: '',
    ageRange: '25–34',
    session: defaultSession,
    firstTime: 'Yes, first time',
    referral: 'Friend / Word of Mouth',
    notes: '',
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
        form.ageRange = '25–34'
        form.session = defaultSession
        form.firstTime = 'Yes, first time'
        form.referral = 'Friend / Word of Mouth'
        form.notes = ''
      }
    }
  )

  function handleSubmit() {
    const subject = `[Bro Chill RSVP] ${form.name} - ${form.session}`
    const bodyLines = [
      `Program: Bro Chill™ Circle Registration`,
      `Session Requested: ${form.session}`,
      `----------------------------------------`,
      `Full Name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      `Age Range: ${form.ageRange}`,
      `First time attending: ${form.firstTime}`,
      `Referral Source: ${form.referral}`,
      `Anything to know:`,
      form.notes || '(None provided)',
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
    eyebrow="Join a Circle"
    title="Bro Chill™ RSVP"
    subtitle="Attend a free community gathering to connect, share, and build brotherhood."
    :is-submitted="isSubmitted"
    :destination-email="DESTINATION_EMAIL"
    @update:open="(val: boolean) => emit('update:open', val)"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <FormTextInput
        id="attendee-name"
        label="Full Name"
        v-model="form.name"
        required
        placeholder="Your full name"
      />

      <div class="grid gap-4 sm:grid-cols-2">
        <FormTextInput
          id="attendee-email"
          label="Email Address"
          type="email"
          v-model="form.email"
          required
          placeholder="you@example.com"
        />
        <FormTextInput
          id="attendee-phone"
          label="Phone Number"
          type="tel"
          v-model="form.phone"
          required
          placeholder="(555) 000-0000"
        />
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <FormSelect
          id="attendee-session"
          label="Pick a Session"
          v-model="form.session"
          :options="sessionOptions"
          required
        />
        <FormSelect
          id="attendee-age"
          label="Age Range"
          v-model="form.ageRange"
          :options="ageOptions"
          required
        />
      </div>

      <FormPillSelect
        label="First time at Bro Chill?"
        v-model="form.firstTime"
        :options="firstTimeOptions"
      />

      <FormSelect
        id="attendee-referral"
        label="How did you hear about Bro Chill?"
        v-model="form.referral"
        :options="referralOptions"
      />

      <FormTextarea
        id="attendee-notes"
        label="Anything you want us to know?"
        v-model="form.notes"
        placeholder="Drop a word on what you're carrying or hoping for..."
      />

      <div class="flex items-center justify-end gap-3 pt-3">
        <UButton color="neutral" variant="ghost" type="button" @click="emit('update:open', false)">
          Cancel
        </UButton>
        <UButton color="primary" type="submit"> RSVP for Circle </UButton>
      </div>
    </form>
  </FormModalShell>
</template>
