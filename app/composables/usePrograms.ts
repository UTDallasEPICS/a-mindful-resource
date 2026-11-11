import { PROGRAM_CATEGORIES, programs } from '../data/programs'
import type { Program, ProgramCategory } from '../data/programs'

export function usePrograms() {
  const route = useRoute()
  const router = useRouter()

  // The URL (?program=<slug>) is the only source of truth for the selection.
  // Deriving it means back/forward, deep links, and returning to /programs
  // without a query always show the right state, and no watcher is needed.
  const selectedSlug = computed<string | null>(() => {
    const slug = route.query.program
    return typeof slug === 'string' && programs.some((p) => p.slug === slug) ? slug : null
  })

  const selectedProgram = computed<Program | null>(
    () => programs.find((p) => p.slug === selectedSlug.value) ?? null
  )

  // Desktop always shows a program, falling back to the first one.
  const desktopSelectedProgram = computed<Program | undefined>(
    () => selectedProgram.value ?? programs[0]
  )

  function selectProgram(slug: string | null) {
    const query = { ...route.query }
    if (slug) {
      query.program = slug
    } else {
      delete query.program
    }
    router.replace({ query })
  }

  function getProgramsByCategory(categoryName: ProgramCategory): Program[] {
    return programs.filter((p) => p.category === categoryName)
  }

  return {
    categories: PROGRAM_CATEGORIES,
    selectedSlug,
    selectedProgram,
    desktopSelectedProgram,
    selectProgram,
    getProgramsByCategory,
  }
}
