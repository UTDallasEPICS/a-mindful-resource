<script setup lang="ts">
  export interface TabOption {
    id: string
    label: string
    icon: string
    badge?: number
  }

  const props = defineProps<{
    modelValue: string
    pendingVillageCount?: number
    pendingResourceCount?: number
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
  }>()

  const tabs = computed<TabOption[]>(() => [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'i-heroicons-squares-2x2-20-solid',
    },
    {
      id: 'events',
      label: 'Events',
      icon: 'i-heroicons-calendar-days-20-solid',
    },
    {
      id: 'programs',
      label: 'Programs',
      icon: 'i-heroicons-academic-cap-20-solid',
    },
    {
      id: 'village-verifications',
      label: 'Village Verifications',
      icon: 'i-heroicons-user-group-20-solid',
      badge: props.pendingVillageCount,
    },
    {
      id: 'resource-verifications',
      label: 'Resource Verifications',
      icon: 'i-heroicons-document-check-20-solid',
      badge: props.pendingResourceCount,
    },
  ])

  function selectTab(id: string) {
    emit('update:modelValue', id)
  }
</script>

<template>
  <nav
    class="sticky top-0 z-20 w-full border-b border-line bg-cream-light/80 backdrop-blur-sm"
    aria-label="Admin Navigation Tabs"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="no-scrollbar flex items-center space-x-1 overflow-x-auto py-2.5 sm:space-x-2">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          :aria-current="modelValue === tab.id ? 'page' : undefined"
          class="group relative inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-all duration-150 sm:text-sm"
          :class="[
            modelValue === tab.id
              ? 'bg-forest text-paper shadow-sm'
              : 'text-ink-muted hover:bg-sage-light/40 hover:text-forest-deep',
          ]"
          @click="selectTab(tab.id)"
        >
          <UIcon
            :name="tab.icon"
            class="h-4 w-4 shrink-0 transition-transform group-hover:scale-105"
            :class="[
              modelValue === tab.id ? 'text-gold-light' : 'text-sage group-hover:text-forest',
            ]"
          />
          <span>{{ tab.label }}</span>

          <!-- Badge for pending counts -->
          <span
            v-if="tab.badge && tab.badge > 0"
            class="inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold"
            :class="[
              modelValue === tab.id
                ? 'bg-gold-deep text-paper'
                : 'bg-gold-light/40 text-forest-deep',
            ]"
          >
            {{ tab.badge }}
          </span>
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
