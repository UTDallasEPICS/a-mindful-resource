<script setup lang="ts">
  import ProgramDetailCard from './ProgramDetailCard.vue'
  import { usePrograms } from '../../composables/usePrograms'

  const { categories, selectedId, selectedProgram, selectProgram, getProgramsByCategory } =
    usePrograms()

  // Only one category section open at a time; starts collapsed on mobile (null)
  const openCategorySlug = ref<string | null>(null)

  // Deep links / programmatic selection opens the matching category section
  watch(
    () => selectedProgram.value,
    (program) => {
      if (program) {
        const cat = categories.find((c) => c.name === program.category)
        if (cat) {
          openCategorySlug.value = cat.slug
        }
      }
    },
    { immediate: true }
  )

  function toggleCategory(slug: string) {
    if (openCategorySlug.value === slug) {
      openCategorySlug.value = null
    } else {
      openCategorySlug.value = slug
    }
  }

  function toggleProgram(id: string) {
    if (selectedId.value === id) {
      selectProgram(null)
    } else {
      selectProgram(id)
    }
  }
</script>

<template>
  <div class="md:hidden">
    <div class="space-y-4">
      <div
        v-for="category in categories"
        :key="category.slug"
        class="overflow-hidden rounded-lg border border-line bg-cream-light"
      >
        <!-- Category Section Header Button -->
        <button
          type="button"
          :id="`category-header-${category.slug}`"
          :aria-expanded="openCategorySlug === category.slug ? 'true' : 'false'"
          :aria-controls="`category-panel-${category.slug}`"
          class="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-cream"
          @click="toggleCategory(category.slug)"
        >
          <div class="pr-3">
            <h2 class="text-lg font-bold text-forest-deep">
              {{ category.name }}
            </h2>
          </div>
          <UIcon
            name="i-heroicons-chevron-down-20-solid"
            class="h-5 w-5 shrink-0 text-ink-muted transition-transform duration-200"
            :class="{ 'rotate-180': openCategorySlug === category.slug }"
          />
        </button>

        <!-- Category Section Panel -->
        <div
          v-show="openCategorySlug === category.slug"
          :id="`category-panel-${category.slug}`"
          role="region"
          :aria-labelledby="`category-header-${category.slug}`"
          class="border-t border-line p-4 pt-3"
        >
          <p class="mb-4 text-sm leading-relaxed text-ink-muted">
            {{ category.description }}
          </p>

          <!-- Program Buttons List -->
          <div class="space-y-3">
            <div
              v-for="program in getProgramsByCategory(category.name)"
              :key="program.id"
              class="space-y-3"
            >
              <button
                type="button"
                :id="`program-btn-${program.id}`"
                :aria-expanded="selectedId === program.id ? 'true' : 'false'"
                :aria-controls="`program-detail-${program.id}`"
                class="flex w-full items-center justify-between rounded-md border p-3 text-left text-sm transition-colors"
                :class="
                  selectedId === program.id
                    ? 'border-forest bg-forest font-semibold text-paper shadow-xs'
                    : 'border-line bg-cream text-ink hover:bg-cream-light hover:text-forest-deep'
                "
                @click="toggleProgram(program.id)"
              >
                <span>{{ program.name }}</span>
                <UBadge
                  v-if="program.delivery"
                  :color="selectedId === program.id ? 'neutral' : 'primary'"
                  variant="subtle"
                  size="xs"
                >
                  {{ program.delivery }}
                </UBadge>
              </button>

              <!-- Inline Program Detail Card directly below program button -->
              <div
                v-if="selectedId === program.id"
                :id="`program-detail-${program.id}`"
                class="pt-1"
              >
                <ProgramDetailCard :program="program" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
