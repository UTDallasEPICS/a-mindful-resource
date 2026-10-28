<script setup lang="ts">
  import { programsData } from '../data/programs'

  useHead({
    title: 'Programs | A Mindful Resource',
  })
</script>

<template>
  <UContainer class="py-10">
    <!-- Page Header -->
    <header class="mb-12 max-w-3xl">
      <p class="text-sm font-semibold tracking-wider text-gold-deep uppercase">
        {{ programsData.eyebrow }}
      </p>
      <h1 class="mt-2 text-3xl font-bold tracking-tight text-forest-deep sm:text-4xl">
        {{ programsData.title }}
      </h1>
      <p class="mt-3 text-lg leading-relaxed text-ink-muted">
        {{ programsData.intro }}
      </p>
    </header>

    <!-- Category Placeholder Sections -->
    <div class="space-y-16">
      <section
        v-for="category in programsData.categories"
        :key="category.id"
        :id="category.id"
        :aria-labelledby="`category-${category.id}`"
        class="border-t border-line pt-10 first:border-t-0 first:pt-0"
      >
        <div class="mb-6 max-w-2xl">
          <h2
            :id="`category-${category.id}`"
            class="text-2xl font-bold tracking-tight text-forest-deep"
          >
            {{ category.title }}
          </h2>
          <p class="mt-1 text-base text-ink-muted">
            {{ category.description }}
          </p>
        </div>

        <!-- Placeholder Programs Grid -->
        <div class="grid gap-6 md:grid-cols-2">
          <UCard
            v-for="program in category.programs"
            :key="program.id"
            class="border border-line bg-cream-light"
          >
            <template #header>
              <div class="flex items-start justify-between gap-3">
                <h3 class="text-lg font-bold text-forest-deep">
                  {{ program.title }}
                </h3>
                <UBadge v-if="program.format" color="primary" variant="subtle" size="sm">
                  {{ program.format }}
                </UBadge>
              </div>
            </template>

            <p class="text-sm leading-relaxed text-ink-muted">
              {{ program.description }}
            </p>

            <template v-if="program.schedule" #footer>
              <div class="flex items-center justify-between text-xs text-ink-muted">
                <span class="font-medium text-gold-deep">{{ program.schedule }}</span>
              </div>
            </template>
          </UCard>
        </div>
      </section>
    </div>
  </UContainer>
</template>
