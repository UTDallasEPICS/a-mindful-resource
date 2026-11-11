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

    <div class="space-y-4">
      <div v-for="detail in details" :key="detail.label">
        <h4 class="text-xs font-semibold tracking-wider text-ink-muted uppercase">
          {{ detail.label }}
        </h4>
        <p class="mt-1 text-sm leading-relaxed text-ink">
          {{ detail.text }}
        </p>
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
