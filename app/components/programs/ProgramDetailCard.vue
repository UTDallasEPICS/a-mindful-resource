<script setup lang="ts">
  import type { Program, ProgramSubOffering } from '../../data/programs'
  import ProgramSignupModal from './ProgramSignupModal.vue'
  import CareRequestModal from './CareRequestModal.vue'

  const props = defineProps<{
    program: Program
  }>()

  // Modal visibility state
  const isSignupModalOpen = ref(false)
  const isCareModalOpen = ref(false)
  const activeSubOffering = ref<ProgramSubOffering | null>(null)

  const isCareConnections = computed(() => props.program.slug === 'care-connections')

  const hasWebsite = computed(() => {
    return Boolean(props.program.href && /^https?:/.test(props.program.href))
  })

  function openSignupForMain() {
    activeSubOffering.value = null
    if (isCareConnections.value) {
      isCareModalOpen.value = true
    } else {
      isSignupModalOpen.value = true
    }
  }

  function openSignupForSub(sub: ProgramSubOffering) {
    activeSubOffering.value = sub
    // Per requirements: for now, subprograms display the generic modal
    isSignupModalOpen.value = true
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

        <!-- 2.a: "Visit Website" button in the top right of the program card header if program has website -->
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

    <!-- Footer: 2.b: Sign Up button in the same position as the former Email Us button -->
    <template #footer>
      <div class="flex justify-end">
        <UButton
          color="primary"
          :label="isCareConnections ? 'Request Support' : 'Sign Up'"
          icon="i-heroicons-arrow-right-20-solid"
          trailing
          @click="openSignupForMain"
        />
      </div>
    </template>
  </UCard>

  <!-- Modals -->
  <ProgramSignupModal
    v-model:open="isSignupModalOpen"
    :program="program"
    :sub-offering="activeSubOffering"
  />

  <CareRequestModal v-model:open="isCareModalOpen" :program="program" />
</template>
