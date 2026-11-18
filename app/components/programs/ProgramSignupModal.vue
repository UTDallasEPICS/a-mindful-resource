<script setup lang="ts">
  import type { Program, ProgramSubOffering } from '../../data/programs'

  const props = defineProps<{
    open: boolean
    program: Program
    subOffering?: ProgramSubOffering | null
  }>()

  const emit = defineEmits<{
    (e: 'update:open', value: boolean): void
    (e: 'close'): void
  }>()

  const DESTINATION_EMAIL = 'brianjayayo@gmail.com'

  const roles = [
    { label: 'Participant', value: 'Participant' },
    { label: 'Guardian', value: 'Guardian' },
    { label: 'School', value: 'School' },
    { label: 'Organization / Church / Team', value: 'Organization / Church / Team' },
    { label: 'Other', value: 'Other' },
  ]

  const form = reactive({
    name: '',
    email: '',
    phone: '',
    role: 'Participant',
    notes: '',
  })

  const isSubmitted = ref(false)

  // Reset form when modal opens
  watch(
    () => props.open,
    (isOpen) => {
      if (isOpen) {
        isSubmitted.value = false
        form.name = ''
        form.email = ''
        form.phone = ''
        form.role = 'Participant'
        form.notes = ''
      }
    }
  )

  function closeModal() {
    emit('update:open', false)
    emit('close')
  }

  function handleSubmit() {
    const offeringTitle = props.subOffering
      ? `${props.program.name} - ${props.subOffering.name}`
      : props.program.name

    const subject = `[AMRI Sign-Up] ${offeringTitle}`
    const bodyLines = [
      `Program: ${offeringTitle}`,
      `Category: ${props.program.category}`,
      `----------------------------------------`,
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      `Reaching out as: ${form.role}`,
      `Tell us about you:`,
      form.notes || '(None provided)',
    ]

    const mailtoUrl = `mailto:${DESTINATION_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(bodyLines.join('\n'))}`

    // Trigger user mail client
    window.location.href = mailtoUrl
    isSubmitted.value = true
  }
</script>

<template>
  <UModal :open="open" @update:open="(val: boolean) => emit('update:open', val)">
    <template #content>
      <div class="p-6 sm:p-8">
        <div class="flex items-start justify-between gap-4 border-b border-line pb-4">
          <div>
            <p class="text-xs font-semibold tracking-wider text-gold-deep uppercase">
              Sign Up / Inquire
            </p>
            <h3 class="text-xl font-bold text-forest-deep">
              {{ program.name }}
            </h3>
            <p v-if="subOffering" class="text-sm font-medium text-forest">
              {{ subOffering.name }}
            </p>
          </div>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            aria-label="Close dialog"
            @click="closeModal"
          />
        </div>

        <div v-if="isSubmitted" class="py-8 text-center">
          <div
            class="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-sage-light text-forest"
          >
            <UIcon name="i-heroicons-check-circle-20-solid" class="size-8" />
          </div>
          <h4 class="text-lg font-bold text-forest-deep">Ready to Send!</h4>
          <p class="mt-2 text-sm text-ink-muted">
            Your inquiry draft was opened in your email application directed to
            <span class="font-medium text-forest-deep">{{ DESTINATION_EMAIL }}</span
            >.
          </p>
          <div class="mt-6">
            <UButton color="primary" @click="closeModal">Done</UButton>
          </div>
        </div>

        <form v-else @submit.prevent="handleSubmit" class="mt-6 space-y-4">
          <!-- Name -->
          <div>
            <label
              for="signup-name"
              class="block text-xs font-semibold tracking-wider text-ink uppercase"
            >
              Name <span class="text-red-600">*</span>
            </label>
            <input
              id="signup-name"
              v-model="form.name"
              type="text"
              required
              class="mt-1 block w-full rounded-md border border-line bg-cream px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-forest focus:outline-none"
              placeholder="Your full name"
            />
          </div>

          <!-- Email -->
          <div>
            <label
              for="signup-email"
              class="block text-xs font-semibold tracking-wider text-ink uppercase"
            >
              Email <span class="text-red-600">*</span>
            </label>
            <input
              id="signup-email"
              v-model="form.email"
              type="email"
              required
              class="mt-1 block w-full rounded-md border border-line bg-cream px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-forest focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          <!-- Phone -->
          <div>
            <label
              for="signup-phone"
              class="block text-xs font-semibold tracking-wider text-ink uppercase"
            >
              Phone <span class="text-red-600">*</span>
            </label>
            <input
              id="signup-phone"
              v-model="form.phone"
              type="tel"
              required
              class="mt-1 block w-full rounded-md border border-line bg-cream px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-forest focus:outline-none"
              placeholder="(555) 000-0000"
            />
          </div>

          <!-- Role -->
          <div>
            <label
              for="signup-role"
              class="block text-xs font-semibold tracking-wider text-ink uppercase"
            >
              I'm reaching out as <span class="text-red-600">*</span>
            </label>
            <select
              id="signup-role"
              v-model="form.role"
              required
              class="mt-1 block w-full rounded-md border border-line bg-cream px-3 py-2 text-sm text-ink focus:border-forest focus:outline-none"
            >
              <option v-for="role in roles" :key="role.value" :value="role.value">
                {{ role.label }}
              </option>
            </select>
          </div>

          <!-- Notes -->
          <div>
            <label
              for="signup-notes"
              class="block text-xs font-semibold tracking-wider text-ink uppercase"
            >
              Tell us a little about you
            </label>
            <textarea
              id="signup-notes"
              v-model="form.notes"
              rows="3"
              class="mt-1 block w-full rounded-md border border-line bg-cream px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-forest focus:outline-none"
              placeholder="Tell us what you are hoping to get out of this program or any questions you have."
            ></textarea>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-3">
            <UButton color="neutral" variant="ghost" type="button" @click="closeModal">
              Cancel
            </UButton>
            <UButton color="primary" type="submit"> Submit Sign-Up </UButton>
          </div>
        </form>
      </div>
    </template>
  </UModal>
</template>
