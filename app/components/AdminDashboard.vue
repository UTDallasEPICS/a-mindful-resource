<script setup lang="ts">
  import { authClient } from '../utils/auth-client'

  interface AdminUser {
    id: string
    name: string | null
    email: string
    role: string
    emailVerified: boolean
    createdAt?: string | Date
  }

  const { data: users, pending, error, refresh } = await useFetch<AdminUser[]>('/api/users')

  async function handleLogout() {
    await authClient.signOut()
    await navigateTo('/auth', { external: true })
  }

  function getInitials(name?: string | null, email?: string): string {
    if (name && name.trim()) {
      const parts = name.trim().split(/\s+/)
      const first = parts[0]
      const last = parts[parts.length - 1]
      if (first && last && parts.length >= 2) {
        return (first.charAt(0) + last.charAt(0)).toUpperCase()
      }
      if (first) {
        return first.slice(0, 2).toUpperCase()
      }
    }
    if (email) {
      return email.slice(0, 2).toUpperCase()
    }
    return 'U'
  }

  function formatDate(val?: string | Date) {
    if (!val) return ''
    try {
      const d = new Date(val)
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    } catch {
      return ''
    }
  }
</script>

<template>
  <UContainer class="py-10">
    <div class="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h1 class="font-serif text-3xl font-bold tracking-tight text-forest-deep">
          Admin Dashboard
        </h1>
        <p class="mt-1 text-sm text-ink-muted">
          Manage your application users and site-wide permissions.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <UButton
          variant="outline"
          color="neutral"
          icon="i-heroicons-arrow-path-20-solid"
          size="sm"
          :loading="pending"
          label="Refresh"
          @click="() => refresh()"
        />
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

    <UCard class="w-full border border-line bg-cream-light shadow-sm">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-users-20-solid" class="h-5 w-5 text-forest" />
            <h2 class="font-serif text-lg font-semibold text-forest-deep">Registered Users</h2>
          </div>
          <UBadge variant="subtle" color="primary" size="md">
            {{ users?.length || 0 }} Users
          </UBadge>
        </div>
      </template>

      <!-- loading -->
      <div v-if="pending" class="space-y-4 py-2">
        <div v-for="i in 4" :key="i" class="flex items-center justify-between py-2">
          <div class="flex w-full items-center gap-3">
            <USkeleton class="h-10 w-10 rounded-full" />
            <div class="w-full max-w-[240px] space-y-2">
              <USkeleton class="h-4 w-full" />
              <USkeleton class="h-3 w-2/3" />
            </div>
          </div>
        </div>
      </div>

      <!-- error -->
      <div v-else-if="error" class="py-4">
        <UAlert
          icon="i-heroicons-exclamation-triangle-20-solid"
          color="error"
          variant="subtle"
          title="Error loading users"
          :description="error.message"
        />
      </div>

      <!-- user list -->
      <div v-else class="divide-y divide-line">
        <div
          v-for="u in users"
          :key="u.id"
          class="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-full border border-line bg-cream font-semibold text-xs text-forest-deep"
            >
              {{ getInitials(u.name, u.email) }}
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <p class="truncate font-medium text-forest-deep">{{ u.name || 'Unnamed User' }}</p>
                <UBadge
                  v-if="u.role === 'admin'"
                  size="xs"
                  variant="solid"
                  color="primary"
                  class="bg-gold-deep text-paper"
                >
                  Admin
                </UBadge>
              </div>
              <p class="truncate text-xs text-ink-muted">{{ u.email }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3 self-end sm:self-center">
            <span v-if="u.createdAt" class="hidden text-xs text-ink-muted lg:inline">
              Joined {{ formatDate(u.createdAt) }}
            </span>
            <UBadge :color="u.emailVerified ? 'success' : 'warning'" variant="subtle" size="sm">
              {{ u.emailVerified ? 'Verified' : 'Pending' }}
            </UBadge>
          </div>
        </div>

        <div v-if="users?.length === 0" class="py-8 text-center text-sm text-ink-muted">
          No registered users found.
        </div>
      </div>
    </UCard>
  </UContainer>
</template>
