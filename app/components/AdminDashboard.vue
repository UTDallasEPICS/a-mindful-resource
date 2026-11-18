<script setup lang="ts">
  import { authClient } from '../utils/auth-client'
  import AdminTabBar from './admin/AdminTabBar.vue'
  import AdminVillageVerificationsTab from './admin/AdminVillageVerificationsTab.vue'

  interface VillageMemberSummary {
    userId: string
    applicationStatus: string
  }

  const route = useRoute()
  const router = useRouter()
  const session = authClient.useSession()

  // Tab navigation state synced with URL query (?tab=...)
  type TabType =
    'dashboard' | 'events' | 'programs' | 'village-verifications' | 'resource-verifications'

  function normalizeTab(rawTab?: string | null): TabType {
    if (!rawTab) return 'village-verifications'
    const clean = rawTab.toLowerCase().trim()
    if (clean === 'dashboard' || clean === 'home' || clean === 'dashboard(home)') return 'dashboard'
    if (clean === 'events' || clean === 'event') return 'events'
    if (clean === 'programs' || clean === 'program') return 'programs'
    if (
      clean === 'village-verifications' ||
      clean === 'village' ||
      clean === 'village_verifications' ||
      clean === 'village-verification' ||
      clean === 'village verificatioins'
    )
      return 'village-verifications'
    if (
      clean === 'resource-verifications' ||
      clean === 'resources' ||
      clean === 'resource_verifications' ||
      clean === 'resource-verification' ||
      clean === 'resource verifications'
    )
      return 'resource-verifications'
    return 'village-verifications'
  }

  const activeTab = ref<TabType>(normalizeTab(route.query.tab as string | undefined))

  watch(
    () => route.query.tab,
    (newTab) => {
      const normalized = normalizeTab(newTab as string | undefined)
      if (activeTab.value !== normalized) {
        activeTab.value = normalized
      }
    }
  )

  watch(activeTab, (newTab) => {
    if (route.query.tab !== newTab) {
      router.replace({
        query: {
          ...route.query,
          tab: newTab,
        },
      })
    }
  })

  // Village members data to derive pending badge count
  const { data: villageMembers } = await useFetch<VillageMemberSummary[]>(
    '/api/admin/village/members'
  )

  const pendingVillageCount = computed(
    () => villageMembers.value?.filter((m) => m.applicationStatus === 'pending').length || 0
  )

  async function handleLogout() {
    await authClient.signOut()
    await navigateTo('/auth', { external: true })
  }
</script>

<template>
  <div>
    <!-- Top Admin Header & Tab Bar -->
    <div class="border-b border-line bg-cream shadow-2xs">
      <UContainer class="pt-8 pb-4">
        <div class="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div class="flex items-center gap-2">
              <UBadge
                size="xs"
                variant="solid"
                color="primary"
                class="bg-gold-deep font-semibold text-paper"
              >
                Admin Portal
              </UBadge>
              <span class="text-xs text-ink-muted">
                Signed in as {{ session?.data?.user?.email }}
              </span>
            </div>
            <h1 class="mt-1 font-serif text-3xl font-bold tracking-tight text-forest-deep">
              Admin Workspace
            </h1>
            <p class="mt-0.5 text-sm text-ink-muted">
              Manage platform users, verify village members, and coordinate programs & events.
            </p>
          </div>

          <div class="flex items-center gap-3">
            <UButton
              color="error"
              variant="soft"
              size="sm"
              icon="i-heroicons-arrow-right-on-rectangle-20-solid"
              label="Logout"
              @click="handleLogout"
            />
          </div>
        </div>
      </UContainer>

      <!-- The requested Admin Tab Bar (keeps all 5 tabs in place) -->
      <AdminTabBar v-model="activeTab" :pending-village-count="pendingVillageCount" />
    </div>

    <!-- Active Tab Content Area -->
    <UContainer class="py-8">
      <!-- Village Verifications Tab -->
      <AdminVillageVerificationsTab v-if="activeTab === 'village-verifications'" />

      <!-- Note: Other tabs (Dashboard, Events, Programs, Resource Verifications) are owned by other team members -->
    </UContainer>
  </div>
</template>
