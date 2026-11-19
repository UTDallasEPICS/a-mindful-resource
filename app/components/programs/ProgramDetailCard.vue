<script setup lang="ts">
  import type { Program, ProgramActionForm, ProgramSubOffering } from '../../data/programs'
  import ProgramSignupModal from './ProgramSignupModal.vue'
  import CareRequestModal from './CareRequestModal.vue'
  import BroChillAttendeeModal from './BroChillAttendeeModal.vue'
  import BroChillFacilitatorModal from './BroChillFacilitatorModal.vue'
  import BroChillCheckinModal from './BroChillCheckinModal.vue'

  const props = defineProps<{
    program: Program
  }>()

  // Modal visibility states
  const isGenericSignupOpen = ref(false)
  const isCareModalOpen = ref(false)
  const isBroChillAttendeeOpen = ref(false)
  const isBroChillFacilitatorOpen = ref(false)
  const isBroChillCheckinOpen = ref(false)

  const activeSubOffering = ref<ProgramSubOffering | null>(null)

  const hasWebsite = computed(() => {
    return Boolean(props.program.href && /^https?:/.test(props.program.href))
  })

  // Dynamic actions configured for this program (or sensible defaults)
  const availableActions = computed<ProgramActionForm[]>(() => {
    if (props.program.actions && props.program.actions.length > 0) {
      return props.program.actions
    }
    if (props.program.slug === 'care-connections') {
      return [
        {
          id: 'care-request',
          label: 'Request Support',
          type: 'care_request',
          variant: 'primary',
        },
      ]
    }
    return [
      {
        id: 'signup',
        label: 'Sign Up',
        type: 'generic',
        variant: 'primary',
      },
    ]
  })

  function handleActionClick(action: ProgramActionForm) {
    activeSubOffering.value = null
    switch (action.type) {
      case 'bro_chill_attendee':
        isBroChillAttendeeOpen.value = true
        break
      case 'bro_chill_facilitator':
        isBroChillFacilitatorOpen.value = true
        break
      case 'bro_chill_checkin':
        isBroChillCheckinOpen.value = true
        break
      case 'care_request':
        isCareModalOpen.value = true
        break
      case 'generic':
      default:
        isGenericSignupOpen.value = true
        break
    }
  }

  function openSignupForSub(sub: ProgramSubOffering) {
    activeSubOffering.value = sub
    // Sub-offerings open the generic sign-up modal
    isGenericSignupOpen.value = true
  }

  const details = computed(() =>
    [
      { label: 'Purpose', text: props.program.purpose },
      { label: 'Audience', text: props.program.audience },
      { label: 'Delivery', text: props.program.delivery },
    ].filter((d) => d.text)
  )
</script>

<template>
  <UCard class="border border-line bg-cream-light">
    <!-- Header with Program Info and optional top-right "Visit Website" button -->
    <template #header>
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div class="space-y-1">
          <p class="text-xs font-semibold tracking-wider text-gold-deep uppercase">
            {{ program.category }}
          </p>
          <h3 class="text-2xl font-bold tracking-tight text-forest-deep">
            {{ program.name }}
          </h3>
          <p class="text-base text-forest">
            {{ program.tagline }}
          </p>
        </div>

        <!-- Top-right "Visit Website" button if program has website -->
        <div v-if="hasWebsite" class="shrink-0">
          <UButton
            :to="program.href"
            target="_blank"
            rel="noopener noreferrer"
            color="neutral"
            variant="outline"
            size="sm"
            label="Visit Website"
            icon="i-heroicons-arrow-top-right-on-square-20-solid"
            trailing
          />
        </div>
      </div>
    </template>

    <div class="space-y-5">
      <div v-for="detail in details" :key="detail.label">
        <h4 class="text-xs font-semibold tracking-wider text-ink-muted uppercase">
          {{ detail.label }}
        </h4>
        <p class="mt-1 text-sm leading-relaxed text-ink">
          {{ detail.text }}
        </p>
      </div>

      <!-- Sub-offerings list -->
      <div
        v-if="program.subOfferings && program.subOfferings.length > 0"
        class="border-t border-line pt-4"
      >
        <h4 class="mb-3 text-xs font-semibold tracking-wider text-ink-muted uppercase">
          Key Offerings & Initiatives
        </h4>
        <div class="space-y-3">
          <div
            v-for="sub in program.subOfferings"
            :key="sub.name"
            class="rounded-lg border border-line bg-cream p-4"
          >
            <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h5 class="text-sm font-semibold text-forest-deep">
                  {{ sub.name }}
                </h5>
                <p class="mt-1 text-sm leading-relaxed text-ink-muted">
                  {{ sub.description }}
                </p>
              </div>
              <div class="mt-2 shrink-0 sm:mt-0 sm:ml-4">
                <UButton
                  color="secondary"
                  variant="solid"
                  size="xs"
                  :label="sub.ctaLabel || 'Learn More'"
                  icon="i-heroicons-arrow-right-20-solid"
                  trailing
                  @click="openSignupForSub(sub)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 class="text-xs font-semibold tracking-wider text-ink-muted uppercase">Next Step</h4>
        <p class="mt-1 text-sm font-medium text-gold-deep">
          {{ program.nextStep }}
        </p>
      </div>
    </div>

    <!-- Footer: Action buttons -->
    <template #footer>
      <div class="flex flex-wrap items-center justify-end gap-3">
        <UButton
          v-for="action in availableActions"
          :key="action.id"
          :color="action.variant === 'secondary' ? 'secondary' : 'primary'"
          :variant="action.variant === 'outline' ? 'outline' : 'solid'"
          :label="action.label"
          icon="i-heroicons-arrow-right-20-solid"
          trailing
          @click="handleActionClick(action)"
        />
      </div>
    </template>
  </UCard>

  <!-- Modals -->
  <ProgramSignupModal
    v-model:open="isGenericSignupOpen"
    :program="program"
    :sub-offering="activeSubOffering"
  />

  <CareRequestModal v-model:open="isCareModalOpen" :program="program" />

  <BroChillAttendeeModal v-model:open="isBroChillAttendeeOpen" :program="program" />

  <BroChillFacilitatorModal v-model:open="isBroChillFacilitatorOpen" :program="program" />

  <BroChillCheckinModal v-model:open="isBroChillCheckinOpen" :program="program" />
</template>
