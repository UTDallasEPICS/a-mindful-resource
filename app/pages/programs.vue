<script setup lang="ts">
  import ProgramAccordion from '../components/programs/ProgramAccordion.vue'
  import ProgramExplorer from '../components/programs/ProgramExplorer.vue'
  import { programsPageContent } from '../data/programs'

  useHead({
    title: 'Programs | A Mindful Resource',
  })
</script>

<template>
  <UContainer class="py-10">
    <!-- Page Header -->
    <header class="mb-10 max-w-3xl">
      <p class="text-sm font-semibold tracking-wider text-gold-deep uppercase">
        {{ programsPageContent.eyebrow }}
      </p>
      <h1 class="mt-2 text-3xl font-bold tracking-tight text-forest-deep sm:text-4xl">
        {{ programsPageContent.title }}
      </h1>
      <p class="mt-3 text-lg leading-relaxed text-ink-muted">
        {{ programsPageContent.intro }}
      </p>
    </header>

    <!-- Desktop Master-Detail Explorer (md and above) -->
    <ProgramExplorer />

    <!-- Mobile Accordion (below md) -->
    <ProgramAccordion />
  </UContainer>
</template>
