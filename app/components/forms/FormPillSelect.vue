<script setup lang="ts">
  defineProps<{
    label?: string
    modelValue: string
    options: { label: string; value: string }[]
    required?: boolean
    helpText?: string
  }>()

  defineEmits<{
    (e: 'update:modelValue', value: string): void
  }>()
</script>

<template>
  <div class="space-y-1.5">
    <div v-if="label" class="flex items-center justify-between">
      <span class="block text-xs font-semibold tracking-wider text-ink uppercase">
        {{ label }}
        <span v-if="required" class="text-red-600">*</span>
      </span>
    </div>
    <p v-if="helpText" class="text-xs text-ink-muted">
      {{ helpText }}
    </p>
    <div class="flex flex-wrap gap-2 pt-1">
      <button
        v-for="opt in options"
        :key="opt.value"
        type="button"
        class="rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors"
        :class="
          modelValue === opt.value
            ? 'border-forest bg-forest font-semibold text-paper shadow-xs'
            : 'border-line bg-cream text-ink hover:border-forest hover:bg-cream-light'
        "
        @click="$emit('update:modelValue', opt.value)"
      >
        {{ opt.label }}
      </button>
    </div>
  </div>
</template>
