<script setup lang="ts">
  import FormModalShell from '../forms/FormModalShell.vue'
  import FormTextInput from '../forms/FormTextInput.vue'
  import FormTextarea from '../forms/FormTextarea.vue'
  import FormSelect from '../forms/FormSelect.vue'
  import FormCheckboxGroup from '../forms/FormCheckboxGroup.vue'
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

  const currentStep = ref(1)
  const totalSteps = 3

  const contactMethods = [
    { label: 'Email', value: 'Email' },
    { label: 'Phone Call', value: 'Phone Call' },
    { label: 'Text Message', value: 'Text Message' },
  ]

  const yesNoPills = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ]

  const roleOptions = [
    { label: 'Co-Facilitator', value: 'Co-Facilitator' },
    { label: 'Lead Facilitator', value: 'Lead Facilitator' },
    { label: 'Hike & Heal Guide', value: 'Hike & Heal Guide' },
    { label: 'Youth Mentor for BRO RISE', value: 'Youth Mentor for BRO RISE' },
    {
      label: 'Behind the Scenes Support (setup, meals, check-in)',
      value: 'Behind the Scenes Support',
    },
  ]

  const backgroundOptions = [
    {
      label: 'Educator / School Counselor',
      value: 'Educator / School Counselor',
    },
    {
      label: 'Mental Health Professional / Therapist / Social Worker',
      value: 'Mental Health Professional / Therapist / Social Worker',
    },
    {
      label: 'Healthcare / Medical Professional',
      value: 'Healthcare / Medical Professional',
    },
    {
      label: 'First Responder / Military / Veteran',
      value: 'First Responder / Military / Veteran',
    },
    {
      label: 'Faith Leader / Pastoral Counselor',
      value: 'Faith Leader / Pastoral Counselor',
    },
    { label: 'Life / Wellness Coach', value: 'Life / Wellness Coach' },
    {
      label: 'Community Organizer / Non-Profit Staff',
      value: 'Community Organizer / Non-Profit Staff',
    },
    { label: 'Youth Mentor / Sports Coach', value: 'Youth Mentor / Sports Coach' },
    { label: 'Other', value: 'Other' },
  ]

  const form = reactive({
    // Step 1
    name: '',
    email: '',
    phone: '',
    cityZip: '',
    isEighteenOrOlder: 'Yes',
    contactMethod: 'Email',
    attendedBroChill: 'No',
    howHeard: '',
    selectedRoles: [] as string[],

    // Step 2
    experience: '',
    professionalBackgrounds: [] as string[],
    credentials: '',
    trainings: '',
    portfolioLink: '',
    whyFacilitate: '',
    scenarioResponse: '',
    safeSpaceDefinition: '',

    // Step 3
    availableBiweekly: 'Yes',
    availableHikes: 'Yes',
    hoursPerMonth: '4-6 hours',
    startDate: '',
    references: '',
    agreeNotTherapy: false,
    agreeConfidentiality: false,
    agreeBackgroundCheck: false,
    agreeAccurate: false,
    additionalNotes: '',
  })

  const isSubmitted = ref(false)

  watch(
    () => props.open,
    (isOpen) => {
      if (isOpen) {
        currentStep.value = 1
        isSubmitted.value = false
      }
    }
  )

  function nextStep() {
    if (currentStep.value < totalSteps) {
      currentStep.value++
    }
  }

  function prevStep() {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }

  function handleSubmit() {
    if (
      !form.agreeNotTherapy ||
      !form.agreeConfidentiality ||
      !form.agreeBackgroundCheck ||
      !form.agreeAccurate
    ) {
      return
    }

    const subject = `[Bro Chill Facilitator Application] ${form.name}`
    const bodyLines = [
      `Bro Chill Facilitator Application`,
      `----------------------------------------`,
      `STEP 1: BASICS`,
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      `City/ZIP: ${form.cityZip}`,
      `18 or older: ${form.isEighteenOrOlder}`,
      `Preferred Contact: ${form.contactMethod}`,
      `Attended Bro Chill: ${form.attendedBroChill}`,
      `Referral: ${form.howHeard || 'N/A'}`,
      `Roles of interest: ${form.selectedRoles.join(', ') || 'None'}`,
      `----------------------------------------`,
      `STEP 2: EXPERIENCE & PHILOSOPHY`,
      `Experience: ${form.experience || 'N/A'}`,
      `Backgrounds: ${form.professionalBackgrounds.join(', ') || 'None'}`,
      `Credentials/Licenses: ${form.credentials || 'N/A'}`,
      `Trainings Completed: ${form.trainings || 'N/A'}`,
      `LinkedIn/Link: ${form.portfolioLink || 'N/A'}`,
      `Why facilitate: ${form.whyFacilitate}`,
      `Scenario (doesn't see the point): ${form.scenarioResponse}`,
      `Safe space definition: ${form.safeSpaceDefinition}`,
      `----------------------------------------`,
      `STEP 3: AVAILABILITY & CONSENT`,
      `Available biweekly 6:30PM: ${form.availableBiweekly}`,
      `Available Hike & Heals: ${form.availableHikes}`,
      `Hours/month: ${form.hoursPerMonth}`,
      `Start Date: ${form.startDate || 'ASAP'}`,
      `References: ${form.references || 'N/A'}`,
      `Protocol & 988 Agreement: Confirmed`,
      `Confidentiality Agreement: Confirmed`,
      `Background Check Consent: Confirmed`,
      `Accurate Info Certification: Confirmed`,
      `Additional Notes: ${form.additionalNotes || 'N/A'}`,
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
    eyebrow="Leadership & Facilitation"
    title="Bro Chill™ Facilitator Application"
    subtitle="Help lead meaningful conversations, hold space, and build healthy community for men."
    :current-step="currentStep"
    :total-steps="totalSteps"
    :is-submitted="isSubmitted"
    :destination-email="DESTINATION_EMAIL"
    @update:open="(val: boolean) => emit('update:open', val)"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-5">
      <!-- STEP 1: Contact & Roles -->
      <div v-show="currentStep === 1" class="space-y-4">
        <h4 class="text-sm font-bold text-forest-deep">Step 1: Contact & General Information</h4>

        <FormTextInput
          id="fac-name"
          label="Full Name"
          v-model="form.name"
          required
          placeholder="First and last name"
        />

        <div class="grid gap-4 sm:grid-cols-2">
          <FormTextInput
            id="fac-email"
            label="Email Address"
            type="email"
            v-model="form.email"
            required
            placeholder="you@example.com"
          />
          <FormTextInput
            id="fac-phone"
            label="Phone Number"
            type="tel"
            v-model="form.phone"
            required
            placeholder="(555) 000-0000"
          />
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <FormTextInput
            id="fac-cityzip"
            label="City & ZIP Code"
            v-model="form.cityZip"
            required
            placeholder="e.g. Dallas, TX 75201"
          />
          <FormSelect
            id="fac-contactmethod"
            label="Preferred Contact Method"
            v-model="form.contactMethod"
            :options="contactMethods"
          />
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <FormPillSelect
            label="Are you 18 or older?"
            v-model="form.isEighteenOrOlder"
            :options="yesNoPills"
            required
          />
          <FormPillSelect
            label="Have you ever attended a Bro Chill circle?"
            v-model="form.attendedBroChill"
            :options="yesNoPills"
          />
        </div>

        <FormTextInput
          id="fac-howheard"
          label="How did you hear about Bro Chill?"
          v-model="form.howHeard"
          placeholder="Social media, partner organization, friend..."
        />

        <FormCheckboxGroup
          label="Which roles interest you?"
          v-model="form.selectedRoles"
          :options="roleOptions"
          help-text="Select all that apply."
        />

        <div class="flex justify-end pt-3">
          <UButton
            color="primary"
            type="button"
            :disabled="!form.name || !form.email || !form.phone || !form.cityZip"
            @click="nextStep"
          >
            Continue to Experience &rarr;
          </UButton>
        </div>
      </div>

      <!-- STEP 2: Experience & Philosophy -->
      <div v-show="currentStep === 2" class="space-y-4">
        <h4 class="text-sm font-bold text-forest-deep">
          Step 2: Experience & Facilitation Philosophy
        </h4>

        <FormCheckboxGroup
          label="Professional Background Checklist"
          v-model="form.professionalBackgrounds"
          :options="backgroundOptions"
          help-text="Select all backgrounds that reflect your experience."
        />

        <FormTextInput
          id="fac-credentials"
          label="Credentials / Licenses"
          v-model="form.credentials"
          placeholder="e.g., LPC, LMFT, LCSW, MD, Certified Coach, or N/A"
          help-text="Free-text field for any applicable degrees, licenses, or certifications."
        />

        <FormTextInput
          id="fac-trainings"
          label="Relevant Trainings Completed"
          v-model="form.trainings"
          placeholder="e.g., CPR / First Aid, Mental Health First Aid, Trauma-Informed Care"
          help-text="List any relevant workshops or response certifications."
        />

        <FormTextInput
          id="fac-link"
          label="LinkedIn, Website, or Professional Profile"
          v-model="form.portfolioLink"
          placeholder="https://linkedin.com/in/..."
        />

        <FormTextarea
          id="fac-experience"
          label="Relevant Experience Overview"
          v-model="form.experience"
          placeholder="Tell us briefly about your experience mentoring, facilitating, or holding space for groups."
        />

        <FormTextarea
          id="fac-why"
          label="Why do you want to facilitate with Bro Chill?"
          v-model="form.whyFacilitate"
          required
          placeholder="Share your personal motivation and heart for this community."
        />

        <FormTextarea
          id="fac-scenario"
          label='Scenario Question: A brother in the circle says he "doesn&apos;t see the point anymore." What do you do?'
          v-model="form.scenarioResponse"
          required
          placeholder="Walk us through your approach, de-escalation, and protocol response."
        />

        <FormTextarea
          id="fac-safespace"
          label="What does a safe space for men look like to you?"
          v-model="form.safeSpaceDefinition"
          required
          placeholder="Describe the environment and dynamic you strive to cultivate."
        />

        <div class="flex justify-between pt-3">
          <UButton color="neutral" variant="ghost" type="button" @click="prevStep">
            &larr; Back
          </UButton>
          <UButton
            color="primary"
            type="button"
            :disabled="!form.whyFacilitate || !form.scenarioResponse || !form.safeSpaceDefinition"
            @click="nextStep"
          >
            Continue to Availability &rarr;
          </UButton>
        </div>
      </div>

      <!-- STEP 3: Availability & Agreements -->
      <div v-show="currentStep === 3" class="space-y-4">
        <h4 class="text-sm font-bold text-forest-deep">
          Step 3: Availability, References & Protocol Agreement
        </h4>

        <div class="grid gap-4 sm:grid-cols-2">
          <FormPillSelect
            label="Available for biweekly circles (6:30 PM)?"
            v-model="form.availableBiweekly"
            :options="yesNoPills"
            required
          />
          <FormPillSelect
            label="Available for Hike & Heal weekend sessions?"
            v-model="form.availableHikes"
            :options="yesNoPills"
            required
          />
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <FormTextInput
            id="fac-hours"
            label="Hours per month you'd like to give"
            v-model="form.hoursPerMonth"
            placeholder="e.g. 4-6 hours"
          />
          <FormTextInput
            id="fac-start"
            label="Earliest start date"
            v-model="form.startDate"
            placeholder="e.g. Immediately, Next month"
          />
        </div>

        <FormTextarea
          id="fac-references"
          label="Two References (Name, Relationship, Contact Info)"
          v-model="form.references"
          placeholder="1. Name, Relationship, Phone/Email&#10;2. Name, Relationship, Phone/Email"
        />

        <!-- Protocol Checkboxes -->
        <div class="space-y-2.5 rounded-lg border border-line bg-cream p-4">
          <p class="text-xs font-bold tracking-wider text-forest-deep uppercase">
            Required Agreements & Consents
          </p>

          <label class="flex cursor-pointer items-start gap-2.5">
            <input
              type="checkbox"
              v-model="form.agreeNotTherapy"
              required
              class="mt-1 size-4 rounded border-line text-forest focus:ring-forest"
            />
            <span class="text-xs leading-relaxed text-ink">
              <span class="font-semibold">Peer Support Model & Emergency Protocol:</span>
              I understand that Bro Chill provides culturally responsive peer support and is NOT
              licensed clinical therapy. I agree to follow AMRI's escalation protocols including 988
              and 911 when safety is a concern. *
            </span>
          </label>

          <label class="flex cursor-pointer items-start gap-2.5">
            <input
              type="checkbox"
              v-model="form.agreeConfidentiality"
              required
              class="mt-1 size-4 rounded border-line text-forest focus:ring-forest"
            />
            <span class="text-xs leading-relaxed text-ink">
              <span class="font-semibold">Circle Confidentiality:</span>
              I agree to protect the privacy and confidentiality of all attendees, with exceptions
              strictly limited to imminent risk of harm. *
            </span>
          </label>

          <label class="flex cursor-pointer items-start gap-2.5">
            <input
              type="checkbox"
              v-model="form.agreeBackgroundCheck"
              required
              class="mt-1 size-4 rounded border-line text-forest focus:ring-forest"
            />
            <span class="text-xs leading-relaxed text-ink">
              <span class="font-semibold">Background Screening:</span>
              I consent to a background check to ensure community safety. *
            </span>
          </label>

          <label class="flex cursor-pointer items-start gap-2.5">
            <input
              type="checkbox"
              v-model="form.agreeAccurate"
              required
              class="mt-1 size-4 rounded border-line text-forest focus:ring-forest"
            />
            <span class="text-xs leading-relaxed text-ink">
              <span class="font-semibold">Accuracy of Information:</span>
              I certify that all information submitted in this application is true and accurate. *
            </span>
          </label>
        </div>

        <FormTextarea
          id="fac-notes"
          label="Anything else you'd like us to know?"
          v-model="form.additionalNotes"
          placeholder="Any accommodations, questions, or additional notes..."
        />

        <div class="flex justify-between pt-3">
          <UButton color="neutral" variant="ghost" type="button" @click="prevStep">
            &larr; Back
          </UButton>
          <UButton
            color="secondary"
            type="submit"
            :disabled="
              !form.agreeNotTherapy ||
              !form.agreeConfidentiality ||
              !form.agreeBackgroundCheck ||
              !form.agreeAccurate
            "
          >
            Submit Application
          </UButton>
        </div>
      </div>
    </form>
  </FormModalShell>
</template>
