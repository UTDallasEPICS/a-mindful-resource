<script setup lang="ts">
  import type { Program } from '../../data/programs'

  defineProps<{
    program: Program
  }>()
</script>

<template>
  <UCard class="border border-line bg-cream-light">
    <template #header>
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div class="space-y-1">
          <p class="text-xs font-semibold tracking-wider text-gold-deep uppercase">
            {{ program.category }}
          </p>
          <h2 class="text-2xl font-bold tracking-tight text-forest-deep">
            {{ program.name }}
          </h2>
          <p class="text-base text-forest">
            {{ program.tagline }}
          </p>
        </div>
        <UBadge v-if="program.delivery" color="primary" variant="subtle" size="md">
          {{ program.delivery }}
        </UBadge>
      </div>
    </template>

    <div class="space-y-4">
      <div>
        <h3 class="text-xs font-semibold tracking-wider text-ink-muted uppercase">Purpose</h3>
        <p class="mt-1 text-sm leading-relaxed text-ink">
          {{ program.purpose }}
        </p>
      </div>

      <div>
        <h3 class="text-xs font-semibold tracking-wider text-ink-muted uppercase">Audience</h3>
        <p class="mt-1 text-sm text-ink">
          {{ program.audience }}
        </p>
      </div>

      <div>
        <h3 class="text-xs font-semibold tracking-wider text-ink-muted uppercase">Next Step</h3>
        <p class="mt-1 text-sm font-medium text-gold-deep">
          {{ program.nextStep }}
        </p>
      </div>
    </div>

    <template v-if="program.href" #footer>
      <div class="flex justify-end">
        <UButton
          :to="program.href"
          target="_blank"
          rel="noopener noreferrer"
          color="primary"
          label="Learn more"
          icon="i-heroicons-arrow-top-right-on-square-20-solid"
          trailing
        />
      </div>
    </template>
  </UCard>
</template>
