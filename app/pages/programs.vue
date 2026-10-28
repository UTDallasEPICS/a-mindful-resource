<script setup lang="ts">
  import ProgramExplorer from '../components/programs/ProgramExplorer.vue'
  import { PROGRAM_CATEGORIES, programs, programsPageContent } from '../data/programs'
  import type { ProgramCategory } from '../data/programs'

  useHead({
    title: 'Programs | A Mindful Resource',
  })

  function getProgramsByCategory(categoryName: ProgramCategory) {
    return programs.filter((program) => program.category === categoryName)
  }
</script>

<template>
  <UContainer class="py-10">
    <!-- Page Header -->
    <header class="mb-12 max-w-3xl">
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

    <!-- Desktop Master-Detail Explorer (md and wider) -->
    <ProgramExplorer class="mb-16" />

    <!-- Category Sections (Stage 3 will remove this grid) -->
    <div class="space-y-16">
      <section
        v-for="category in PROGRAM_CATEGORIES"
        :key="category.slug"
        :id="category.slug"
        :aria-labelledby="`category-${category.slug}`"
        class="border-t border-line pt-10 first:border-t-0 first:pt-0"
      >
        <div class="mb-6 max-w-2xl">
          <h2
            :id="`category-${category.slug}`"
            class="text-2xl font-bold tracking-tight text-forest-deep"
          >
            {{ category.name }}
          </h2>
          <p class="mt-1 text-base text-ink-muted">
            {{ category.description }}
          </p>
        </div>

        <!-- Programs Grid -->
        <div class="grid gap-6 md:grid-cols-2">
          <UCard
            v-for="program in getProgramsByCategory(category.name)"
            :key="program.id"
            class="border border-line bg-cream-light"
          >
            <template #header>
              <div class="flex items-start justify-between gap-3">
                <h3 class="text-lg font-bold text-forest-deep">
                  {{ program.name }}
                </h3>
                <UBadge v-if="program.delivery" color="primary" variant="subtle" size="sm">
                  {{ program.delivery }}
                </UBadge>
              </div>
            </template>

            <div class="space-y-3">
              <p class="text-sm leading-relaxed text-ink-muted">
                {{ program.purpose }}
              </p>
              <p v-if="program.audience" class="text-sm text-ink-muted">
                <span class="font-medium text-ink">Audience:</span> {{ program.audience }}
              </p>
            </div>

            <template v-if="program.nextStep" #footer>
              <div class="flex items-center justify-between text-sm">
                <span class="font-medium text-gold-deep">{{ program.nextStep }}</span>
              </div>
            </template>
          </UCard>
        </div>
      </section>
    </div>
  </UContainer>
</template>
