<script setup lang="ts">
  import type { Program } from '../../data/programs'

  const props = defineProps<{
    program: Program
  }>()

  const contactEmail = 'info@amindfulresource.org'

  // Every program gets an actionable link: its own site if it has one,
  // otherwise an email to AMRI with the program name as the subject.
  const action = computed(() => {
    const href = props.program.href
    if (href && /^https?:/.test(href)) {
      return { to: href, label: 'Visit website', external: true }
    }
    return {
      to: `mailto:${contactEmail}?subject=${encodeURIComponent(props.program.name)}`,
      label: 'Email us',
      external: false,
    }
  })

  const details = computed(() =>
    [
      { label: 'Purpose', text: props.program.purpose },
      { label: 'Audience', text: props.program.audience },
      { label: 'Delivery', text: props.program.delivery },
    ].filter((d) => d.text)
  )

  function isExternalLink(link?: string) {
    return Boolean(link && /^https?:/.test(link))
  }
</script>

<template>
  <UCard class="border border-line bg-cream-light">
    <template #header>
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

      <!-- Sub-offerings (if available) -->
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
              <div v-if="sub.ctaLabel && sub.ctaLink" class="mt-2 shrink-0 sm:mt-0 sm:ml-4">
                <UButton
                  :to="sub.ctaLink"
                  :target="isExternalLink(sub.ctaLink) ? '_blank' : undefined"
                  :rel="isExternalLink(sub.ctaLink) ? 'noopener noreferrer' : undefined"
                  color="secondary"
                  variant="solid"
                  size="xs"
                  :label="sub.ctaLabel"
                  :icon="
                    isExternalLink(sub.ctaLink)
                      ? 'i-heroicons-arrow-top-right-on-square-20-solid'
                      : 'i-heroicons-envelope-20-solid'
                  "
                  trailing
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

    <template #footer>
      <div class="flex justify-end">
        <UButton
          :to="action.to"
          :target="action.external ? '_blank' : undefined"
          :rel="action.external ? 'noopener noreferrer' : undefined"
          color="primary"
          :label="action.label"
          :icon="
            action.external
              ? 'i-heroicons-arrow-top-right-on-square-20-solid'
              : 'i-heroicons-envelope-20-solid'
          "
          trailing
        />
      </div>
    </template>
  </UCard>
</template>
