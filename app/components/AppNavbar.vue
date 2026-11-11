<script setup lang="ts">
  //site wide navBar
  interface NavLink {
    label: string
    to: string
  }

  const links: NavLink[] = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Programs', to: '/programs' },
    { label: 'Events', to: '/events' },
    { label: 'Resources', to: '/resources' },
    { label: 'The Village', to: '/the-village' },
  ]

  const donate: NavLink = { label: 'Donate', to: '/donate' }

  const route = useRoute()
  const isMenuOpen = ref(false)

  //home is only active on "/", other links stay active on their sub-pages too
  function isActive(to: string) {
    if (to === '/') return route.path === '/'
    return route.path === to || route.path.startsWith(`${to}/`)
  }

  //close the mobile menu after navigating.
  watch(
    () => route.fullPath,
    () => {
      isMenuOpen.value = false
    }
  )
</script>

<template>
  <header class="sticky top-0 z-50 bg-forest-deep shadow-md">
    <UContainer class="flex h-16 items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-3 font-serif text-xl font-bold text-paper">
        <img src="/logo.png" alt="" width="40" height="40" class="size-10 shrink-0" />
        A Mindful Resource
      </NuxtLink>

      <!-- desktop -->
      <nav aria-label="Main" class="hidden items-center gap-7 lg:flex">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          :aria-current="isActive(link.to) ? 'page' : undefined"
          class="text-sm transition-colors hover:text-gold-light"
          :class="isActive(link.to) ? 'font-semibold text-gold-light' : 'text-mist'"
        >
          {{ link.label }}
        </NuxtLink>

        <UButton
          :to="donate.to"
          color="secondary"
          class="ml-2 px-4 py-2 font-semibold"
          :label="donate.label"
        />
      </nav>

      <!-- mobile toggle -->
      <UButton
        class="text-paper hover:bg-forest-line lg:hidden"
        color="neutral"
        variant="ghost"
        :icon="isMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'"
        :aria-label="isMenuOpen ? 'Close menu' : 'Open menu'"
        :aria-expanded="isMenuOpen"
        aria-controls="mobile-nav"
        @click="isMenuOpen = !isMenuOpen"
      />
    </UContainer>

    <!-- mobile menu -->
    <nav
      v-show="isMenuOpen"
      id="mobile-nav"
      aria-label="Main"
      class="border-t border-forest-line bg-forest-deep lg:hidden"
    >
      <UContainer class="flex flex-col gap-1 py-3">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          :aria-current="isActive(link.to) ? 'page' : undefined"
          class="rounded-md px-2 py-2 transition-colors hover:bg-forest-line hover:text-gold-light"
          :class="isActive(link.to) ? 'font-semibold text-gold-light' : 'text-mist'"
        >
          {{ link.label }}
        </NuxtLink>

        <UButton
          :to="donate.to"
          color="secondary"
          block
          class="mt-2 font-semibold"
          :label="donate.label"
        />
      </UContainer>
    </nav>
  </header>
</template>
