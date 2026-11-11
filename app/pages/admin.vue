<script setup lang="ts">
  import { authClient } from '../utils/auth-client'

  const session = authClient.useSession()
  const router = useRouter()

  const isAdmin = computed(() => {
    const user = session.value?.data?.user as { role?: string } | undefined
    return user?.role === 'admin'
  })

  const isPending = computed(() => session.value?.isPending ?? false)

  watch(
    () => [isPending.value, session.value?.data],
    ([pending, data]) => {
      if (!pending && !data) {
        router.push('/auth?redirect=/admin')
      }
    },
    { immediate: true }
  )
</script>

<template>
  <div>
    <div v-if="isPending" class="flex min-h-[50vh] items-center justify-center">
      <UIcon name="i-heroicons-arrow-path-20-solid" class="h-8 w-8 animate-spin text-forest" />
    </div>

    <template v-else>
      <AdminDashboard v-if="isAdmin" />

      <UContainer v-else class="py-16 text-center">
        <div class="mx-auto max-w-md rounded-2xl border border-line bg-cream-light p-8 shadow-sm">
          <UIcon name="i-heroicons-shield-exclamation-20-solid" class="mx-auto h-12 w-12 text-gold-deep" />
          <h1 class="mt-4 font-serif text-2xl font-bold text-forest-deep">Access Restricted</h1>
          <p class="mt-2 text-sm text-ink-muted">
            The Admin Dashboard is only accessible to users with an administrator account.
          </p>
          <div class="mt-6 flex justify-center gap-3">
            <UButton to="/" color="primary" label="Go to Homepage" />
          </div>
        </div>
      </UContainer>
    </template>
  </div>
</template>
