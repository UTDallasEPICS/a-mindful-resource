<script setup lang="ts">
  import { PROGRAM_CATEGORIES, programs } from '../../data/programs'
  import type { ProgramCategory } from '../../data/programs'

  const route = useRoute()
  const router = useRouter()

  const initialSlug = typeof route.query.program === 'string' ? route.query.program : undefined
  const initialProgram = initialSlug ? programs.find((p) => p.slug === initialSlug) : null
  const selectedId = ref<string>(initialProgram ? initialProgram.id : programs[0]?.id || '')

  const selectedProgram = computed(() => {
    return programs.find((p) => p.id === selectedId.value) || programs[0]
  })

  function getProgramsByCategory(categoryName: ProgramCategory) {
    return programs.filter((program) => program.category === categoryName)
  }

  function selectProgram(id: string) {
    selectedId.value = id
    const program = programs.find((p) => p.id === id)
    if (program) {
      router.replace({
        query: {
          ...route.query,
          program: program.slug,
        },
      })
    }
  }

  watch(
    () => route.query.program,
    (newSlug) => {
      if (typeof newSlug === 'string') {
        const match = programs.find((p) => p.slug === newSlug)
        if (match && match.id !== selectedId.value) {
          selectedId.value = match.id
        }
      }
    }
  )
</script>

<template>
  <div class="hidden md:block">
    <div class="grid grid-cols-12 items-start gap-8">
      <!-- Left Column: Master List -->
      <nav class="col-span-5 space-y-6" aria-label="Programs navigation">
        <div v-for="category in PROGRAM_CATEGORIES" :key="category.slug" class="space-y-2">
          <h3 class="text-xs font-semibold tracking-wider text-gold-deep uppercase">
            {{ category.name }}
          </h3>
          <div class="space-y-1">
            <button
              v-for="program in getProgramsByCategory(category.name)"
              :key="program.id"
              type="button"
              :aria-current="selectedId === program.id ? 'true' : undefined"
              class="w-full rounded-md px-3 py-2 text-left text-sm transition-colors"
              :class="
                selectedId === program.id
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
        <UCard v-if="selectedProgram" class="min-h-[440px] border border-line bg-cream-light">
          <template #header>
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div class="space-y-1">
                <p class="text-xs font-semibold tracking-wider text-gold-deep uppercase">
                  {{ selectedProgram.category }}
                </p>
                <h2 class="text-2xl font-bold tracking-tight text-forest-deep">
                  {{ selectedProgram.name }}
                </h2>
                <p class="text-base text-forest">
                  {{ selectedProgram.tagline }}
                </p>
              </div>
              <UBadge v-if="selectedProgram.delivery" color="primary" variant="subtle" size="md">
                {{ selectedProgram.delivery }}
              </UBadge>
            </div>
          </template>

          <div class="space-y-4">
            <div>
              <h3 class="text-xs font-semibold tracking-wider text-ink-muted uppercase">Purpose</h3>
              <p class="mt-1 text-sm leading-relaxed text-ink">
                {{ selectedProgram.purpose }}
              </p>
            </div>

            <div>
              <h3 class="text-xs font-semibold tracking-wider text-ink-muted uppercase">
                Audience
              </h3>
              <p class="mt-1 text-sm text-ink">
                {{ selectedProgram.audience }}
              </p>
            </div>

            <div>
              <h3 class="text-xs font-semibold tracking-wider text-ink-muted uppercase">
                Next Step
              </h3>
              <p class="mt-1 text-sm font-medium text-gold-deep">
                {{ selectedProgram.nextStep }}
              </p>
            </div>
          </div>

          <template v-if="selectedProgram.href" #footer>
            <div class="flex justify-end">
              <UButton
                :to="selectedProgram.href"
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
      </div>
    </div>
  </div>
</template>
