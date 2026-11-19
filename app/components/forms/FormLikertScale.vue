<script setup lang="ts">
  defineProps<{
    prompt: string
    modelValue: number | null
    minLabel?: string
    maxLabel?: string
    required?: boolean
  }>()

  defineEmits<{
    (e: 'update:modelValue', value: number): void
  }>()

  const scaleValues = [1, 2, 3, 4, 5]
</script>

<template>
  <div class="space-y-2">
    <p class="text-sm font-medium text-ink">
      {{ prompt }}
      <span v-if="required" class="text-red-600">*</span>
    </p>

    <!-- Rating Buttons (1 to 5) -->
    <div class="grid grid-cols-5 gap-2 sm:gap-3">
      <button
        v-for="val in scaleValues"
        :key="val"
        type="button"
        class="flex h-11 items-center justify-center rounded-xl border text-sm font-bold transition-all"
        :class="
          modelValue === val
            ? 'border-forest bg-forest text-paper shadow-sm'
            : 'border-line bg-cream text-ink hover:border-forest hover:bg-cream-light'
        "
        @click="$emit('update:modelValue', val)"
      >
        {{ val }}
      </button>
    </div>

    <!-- Anchor Labels (e.g. Not at all ... Definitely) -->
    <div class="flex justify-between px-1 text-[11px] text-ink-muted">
      <span>{{ minLabel || 'Not at all' }}</span>
      <span>{{ maxLabel || 'Definitely' }}</span>
    </div>
  </div>
</template>
