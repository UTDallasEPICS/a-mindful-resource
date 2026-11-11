<script setup lang="ts">
  import { authClient } from '../utils/auth-client'

  // site wide navBar
  interface NavLink {
    label: string
    to: string
  }

  const baseLinks: NavLink[] = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Programs', to: '/programs' },
    { label: 'Events', to: '/events' },
    { label: 'Resources', to: '/resources' },
    { label: 'The Village', to: '/village' },
  ]

  const session = authClient.useSession()

  const navLinks = computed(() => {
    const user = session.value?.data?.user as { role?: string } | undefined
    if (user?.role === 'admin') {
      return [...baseLinks, { label: 'Admin', to: '/admin' }]
    }
    return baseLinks
  })

  const donate: NavLink = { label: 'Donate', to: '/donate' }

  const route = useRoute()
  const isMenuOpen = ref(false)

  async function handleLogout() {
    await authClient.signOut()
    await navigateTo('/auth', { external: true })
  }

  // home is only active on "/", other links stay active on their sub-pages too
  function isActive(to: string) {
    if (to === '/') return route.path === '/'
    if (to === '/admin') {
      return route.path === '/admin' || route.path.startsWith('/admin/')
    }
    if (to === '/village') {
      return (
        route.path === '/village' ||
        route.path.startsWith('/village/') ||
        route.path === '/the-village' ||
        route.path.startsWith('/the-village/')
      )
    }
    return route.path === to || route.path.startsWith(`${to}/`)
  }

  // close the mobile menu after navigating.
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
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          :aria-current="isActive(link.to) ? 'page' : undefined"
          class="text-sm transition-colors hover:text-gold-light"
          :class="isActive(link.to) ? 'font-semibold text-gold-light' : 'text-mist'"
        >
          {{ link.label }}
        </NuxtLink>

        <!-- login / user action -->
        <template v-if="session?.data">
          <UButton
            variant="ghost"
            color="neutral"
            size="sm"
            class="text-mist hover:text-paper"
            label="Log Out"
            @click="handleLogout"
          />
        </template>
        <template v-else>
          <UButton
            to="/auth"
            size="sm"
            class="bg-forest-line text-paper border border-forest-line hover:bg-paper hover:text-forest-deep hover:border-paper transition-colors font-medium"
            label="Log In"
          />
        </template>

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
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          :aria-current="isActive(link.to) ? 'page' : undefined"
          class="rounded-md px-2 py-2 transition-colors hover:bg-forest-line hover:text-gold-light"
          :class="isActive(link.to) ? 'font-semibold text-gold-light' : 'text-mist'"
        >
          {{ link.label }}
        </NuxtLink>

        <!-- mobile login / user -->
        <div class="mt-2 border-t border-forest-line pt-2">
          <div v-if="session?.data" class="flex flex-col gap-2 px-2">
            <UButton
              variant="ghost"
              color="neutral"
              block
              size="sm"
              class="justify-start text-mist hover:text-paper"
              label="Log Out"
              @click="handleLogout"
            />
          </div>
          <UButton
            v-else
            to="/auth"
            block
            class="bg-forest-line text-paper border border-forest-line hover:bg-paper hover:text-forest-deep hover:border-paper transition-colors font-medium"
            label="Log In"
          />
        </div>

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
