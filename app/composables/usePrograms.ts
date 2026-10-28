import { PROGRAM_CATEGORIES, programs } from '../data/programs'
import type { Program, ProgramCategory } from '../data/programs'

export function usePrograms() {
  const route = useRoute()
  const router = useRouter()

  // Shared selection state, initialized from ?program=<slug> if present and valid
  const selectedId = useState<string | null>('programs_selected_id', () => {
    const slug = typeof route.query.program === 'string' ? route.query.program : undefined
    const match = slug ? programs.find((p) => p.slug === slug) : null
    return match ? match.id : null
  })

  // Watch URL query to keep selection in sync with browser navigation (back/forward)
  watch(
    () => route.query.program,
    (newSlug) => {
      if (typeof newSlug === 'string') {
        const match = programs.find((p) => p.slug === newSlug)
        selectedId.value = match ? match.id : null
      } else {
        selectedId.value = null
      }
    }
  )

  function selectProgram(id: string | null) {
    selectedId.value = id
    if (id) {
      const match = programs.find((p) => p.id === id)
      if (match) {
        router.replace({
          query: {
            ...route.query,
            program: match.slug,
          },
        })
      }
    } else {
      const nextQuery = { ...route.query }
      delete nextQuery.program
      router.replace({ query: nextQuery })
    }
  }

  function getProgramsByCategory(categoryName: ProgramCategory): Program[] {
    return programs.filter((p) => p.category === categoryName)
  }

  const selectedProgram = computed(() => {
    if (!selectedId.value) return null
    return programs.find((p) => p.id === selectedId.value) || null
  })

  // Desktop always displays an active program, falling back to the first program if none is specified
  const desktopSelectedProgram = computed(() => {
    return selectedProgram.value || programs[0]
  })

  const desktopSelectedId = computed(() => {
    return selectedId.value || programs[0]?.id || ''
  })

  return {
    categories: PROGRAM_CATEGORIES,
    programs,
    selectedId,
    selectedProgram,
    desktopSelectedProgram,
    desktopSelectedId,
    selectProgram,
    getProgramsByCategory,
  }
}
