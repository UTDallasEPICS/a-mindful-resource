<script setup lang="ts">
  defineProps<{
    open: boolean
    title: string
    eyebrow?: string
    subtitle?: string
    isSubmitted?: boolean
    currentStep?: number
    totalSteps?: number
    destinationEmail?: string
  }>()

  const emit = defineEmits<{
    (e: 'update:open', value: boolean): void
    (e: 'close'): void
  }>()

  function handleClose() {
    emit('update:open', false)
    emit('close')
  }
</script>

<template>
  <UModal :open="open" @update:open="(val: boolean) => emit('update:open', val)">
    <template #content>
      <div class="max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <!-- Header -->
        <div class="flex items-start justify-between gap-4 border-b border-line pb-4">
          <div class="space-y-1">
            <p v-if="eyebrow" class="text-xs font-semibold tracking-wider text-gold-deep uppercase">
              {{ eyebrow }}
            </p>
            <h3 class="text-xl font-bold text-forest-deep sm:text-2xl">
              {{ title }}
            </h3>
            <p v-if="subtitle" class="text-sm font-medium text-forest">
              {{ subtitle }}
            </p>
            <p v-if="totalSteps && totalSteps > 1" class="text-xs text-ink-muted">
              Step {{ currentStep || 1 }} of {{ totalSteps }}
            </p>
          </div>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            aria-label="Close dialog"
            @click="handleClose"
          />
        </div>

        <!-- Success Confirmation View -->
        <div v-if="isSubmitted" class="py-8 text-center">
          <div
            class="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-sage-light text-forest"
          >
            <UIcon name="i-heroicons-check-circle-20-solid" class="size-8" />
          </div>
          <h4 class="text-lg font-bold text-forest-deep">Draft Created!</h4>
          <p class="mt-2 text-sm text-ink-muted">
            Your inquiry was drafted in your email application directed to
            <span class="font-medium text-forest-deep">{{
              destinationEmail || 'brianjayayo@gmail.com'
            }}</span
            >.
          </p>
          <div class="mt-6">
            <UButton color="primary" @click="handleClose">Done</UButton>
          </div>
        </div>

        <!-- Form Body -->
        <div v-else class="mt-5">
          <slot />
        </div>
      </div>
    </template>
  </UModal>
</template>
