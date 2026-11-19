<script setup lang="ts">
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

  const contactMethods = [
    { label: 'Email', value: 'Email' },
    { label: 'Phone Call', value: 'Phone Call' },
    { label: 'Text Message', value: 'Text Message' },
  ]

  const relationships = [
    { label: 'Myself', value: 'Myself' },
    { label: 'Family Member or Loved One', value: 'Family Member or Loved One' },
    { label: 'Client / Patient', value: 'Client / Patient' },
    { label: 'Other', value: 'Other' },
  ]

  const form = reactive({
    name: '',
    email: '',
    phone: '',
    contactPreference: 'Email',
    reachingOutFor: 'Myself',
    details: '',
    consent: false,
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
        form.contactPreference = 'Email'
        form.reachingOutFor = 'Myself'
        form.details = ''
        form.consent = false
      }
    }
  )

  function closeModal() {
    emit('update:open', false)
    emit('close')
  }

  function handleSubmit() {
    if (!form.consent) return

    const subject = `[AMRI Care Connections Request] Support Inquiry`
    const bodyLines = [
      `Program: Care Connections™`,
      `----------------------------------------`,
      `CRISIS NOTICE ACKNOWLEDGED: Yes (988/911 prompt reviewed)`,
      `Client Consent: Confirmed`,
      `----------------------------------------`,
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      `Preferred Contact Method: ${form.contactPreference}`,
      `Reaching out for: ${form.reachingOutFor}`,
      `How can Care Connections assist:`,
      form.details || '(None provided)',
    ]

    const mailtoUrl = `mailto:${DESTINATION_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(bodyLines.join('\n'))}`

    window.location.href = mailtoUrl
    isSubmitted.value = true
  }
</script>

<template>
  <UModal :open="open" @update:open="(val: boolean) => emit('update:open', val)">
    <template #content>
      <div class="max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <!-- Header -->
        <div class="flex items-start justify-between gap-4 border-b border-line pb-4">
          <div>
            <p class="text-xs font-semibold tracking-wider text-gold-deep uppercase">
              Care Navigation Request
            </p>
            <h3 class="text-xl font-bold text-forest-deep">Care Connections™</h3>
          </div>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            aria-label="Close dialog"
            @click="closeModal"
          />
        </div>

        <!-- Crisis Warning Alert -->
        <div class="mt-4 rounded-lg border border-red-300 bg-red-50 p-4 text-red-900">
          <div class="flex items-start gap-3">
            <UIcon
              name="i-heroicons-exclamation-triangle-20-solid"
              class="size-5 shrink-0 text-red-700"
            />
            <div class="text-xs leading-relaxed sm:text-sm">
              <span class="font-bold">Important Emergency Notice:</span>
              If you or someone you know is in immediate danger or experiencing a life-threatening
              crisis, please call or text <span class="font-bold underline">988</span> (Suicide &
              Crisis Lifeline) or call <span class="font-bold underline">911</span> immediately.
              AMRI does not provide immediate emergency response services.
            </div>
          </div>
        </div>

        <div v-if="isSubmitted" class="py-8 text-center">
          <div
            class="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-sage-light text-forest"
          >
            <UIcon name="i-heroicons-check-circle-20-solid" class="size-8" />
          </div>
          <h4 class="text-lg font-bold text-forest-deep">Request Drafted</h4>
          <p class="mt-2 text-sm text-ink-muted">
            Your confidential care inquiry was opened in your email client directed to
            <span class="font-medium text-forest-deep">{{ DESTINATION_EMAIL }}</span
            >. A Care Connections navigator will follow up with you.
          </p>
          <div class="mt-6">
            <UButton color="primary" @click="closeModal">Done</UButton>
          </div>
        </div>

        <form v-else @submit.prevent="handleSubmit" class="mt-5 space-y-4">
          <!-- Name -->
          <div>
            <label
              for="care-name"
              class="block text-xs font-semibold tracking-wider text-ink uppercase"
            >
              Your Name <span class="text-red-600">*</span>
            </label>
            <input
              id="care-name"
              v-model="form.name"
              type="text"
              required
              class="mt-1 block w-full rounded-md border border-line bg-cream px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-forest focus:outline-none"
              placeholder="Full name"
            />
          </div>

          <!-- Email & Phone Grid -->
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                for="care-email"
                class="block text-xs font-semibold tracking-wider text-ink uppercase"
              >
                Email Address <span class="text-red-600">*</span>
              </label>
              <input
                id="care-email"
                v-model="form.email"
                type="email"
                required
                class="mt-1 block w-full rounded-md border border-line bg-cream px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-forest focus:outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                for="care-phone"
                class="block text-xs font-semibold tracking-wider text-ink uppercase"
              >
                Phone Number <span class="text-red-600">*</span>
              </label>
              <input
                id="care-phone"
                v-model="form.phone"
                type="tel"
                required
                class="mt-1 block w-full rounded-md border border-line bg-cream px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-forest focus:outline-none"
                placeholder="(555) 000-0000"
              />
            </div>
          </div>

          <!-- Preferences -->
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                for="care-contact-method"
                class="block text-xs font-semibold tracking-wider text-ink uppercase"
              >
                Preferred Contact Method <span class="text-red-600">*</span>
              </label>
              <select
                id="care-contact-method"
                v-model="form.contactPreference"
                required
                class="mt-1 block w-full rounded-md border border-line bg-cream px-3 py-2 text-sm text-ink focus:border-forest focus:outline-none"
              >
                <option v-for="method in contactMethods" :key="method.value" :value="method.value">
                  {{ method.label }}
                </option>
              </select>
            </div>
            <div>
              <label
                for="care-reaching-out-for"
                class="block text-xs font-semibold tracking-wider text-ink uppercase"
              >
                I'm reaching out for <span class="text-red-600">*</span>
              </label>
              <select
                id="care-reaching-out-for"
                v-model="form.reachingOutFor"
                required
                class="mt-1 block w-full rounded-md border border-line bg-cream px-3 py-2 text-sm text-ink focus:border-forest focus:outline-none"
              >
                <option v-for="item in relationships" :key="item.value" :value="item.value">
                  {{ item.label }}
                </option>
              </select>
            </div>
          </div>

          <!-- Details -->
          <div>
            <label
              for="care-details"
              class="block text-xs font-semibold tracking-wider text-ink uppercase"
            >
              How can Care Connections assist you?
            </label>
            <textarea
              id="care-details"
              v-model="form.details"
              rows="3"
              class="mt-1 block w-full rounded-md border border-line bg-cream px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-forest focus:outline-none"
              placeholder="Please share what type of support, guidance, or community resources you are seeking."
            ></textarea>
          </div>

          <!-- Consent Checkbox -->
          <div class="rounded-md border border-line bg-cream p-3">
            <label class="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                v-model="form.consent"
                required
                class="mt-1 size-4 rounded border-line text-forest focus:ring-forest"
              />
              <span class="text-xs leading-relaxed text-ink">
                <span class="font-semibold text-forest-deep">Consent & Acknowledgment:</span>
                I understand that A Mindful Resource Inc. (AMRI) provides community navigation and
                peer support, not licensed clinical treatment or emergency services. I give consent
                for an AMRI navigator to contact me.
                <span class="text-red-600">*</span>
              </span>
            </label>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-2">
            <UButton color="neutral" variant="ghost" type="button" @click="closeModal">
              Cancel
            </UButton>
            <UButton color="secondary" type="submit" :disabled="!form.consent">
              Submit Care Request
            </UButton>
          </div>
        </form>
      </div>
    </template>
  </UModal>
</template>
