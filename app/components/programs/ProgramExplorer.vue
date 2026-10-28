<script setup lang="ts">
  import ProgramDetailCard from './ProgramDetailCard.vue'
  import { usePrograms } from '../../composables/usePrograms'

  const {
    categories,
    desktopSelectedId,
    desktopSelectedProgram,
    selectProgram,
    getProgramsByCategory,
  } = usePrograms()
</script>

<template>
  <div class="hidden md:block">
    <div class="grid grid-cols-12 items-start gap-8">
      <!-- Left Column: Master List -->
      <nav class="col-span-5 space-y-6" aria-label="Programs navigation">
        <div v-for="category in categories" :key="category.slug" class="space-y-2">
          <h3 class="text-xs font-semibold tracking-wider text-gold-deep uppercase">
            {{ category.name }}
          </h3>
          <div class="space-y-1">
            <button
              v-for="program in getProgramsByCategory(category.name)"
              :key="program.id"
              type="button"
              :aria-current="desktopSelectedId === program.id ? 'true' : undefined"
              class="w-full rounded-md px-3 py-2 text-left text-sm transition-colors"
              :class="
                desktopSelectedId === program.id
                  ? 'bg-forest font-semibold text-paper shadow-xs'
                  : 'text-ink hover:bg-cream-light hover:text-forest-deep'
              "
              @click="selectProgram(program.id)"
            >
              {{ program.name }}
            </button>
          </div>
        </div>
      </nav>

      <!-- Right Column: Detail Card -->
      <div class="sticky top-24 col-span-7">
        <ProgramDetailCard
          v-if="desktopSelectedProgram"
          :program="desktopSelectedProgram"
          class="min-h-[440px]"
        />
      </div>
    </div>
  </div>
</template>
