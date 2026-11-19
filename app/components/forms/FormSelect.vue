<script setup lang="ts">
  defineProps<{
    id: string
    label: string
    modelValue: string
    options: { label: string; value: string }[]
    required?: boolean
    placeholder?: string
    helpText?: string
  }>()

  defineEmits<{
    (e: 'update:modelValue', value: string): void
  }>()
</script>

<template>
  <div>
    <label :for="id" class="block text-xs font-semibold tracking-wider text-ink uppercase">
      {{ label }}
      <span v-if="required" class="text-red-600">*</span>
    </label>
    <p v-if="helpText" class="mt-0.5 text-xs text-ink-muted">
      {{ helpText }}
    </p>
    <select
      :id="id"
      :value="modelValue"
      :required="required"
      class="mt-1 block w-full rounded-md border border-line bg-cream px-3 py-2 text-sm text-ink focus:border-forest focus:outline-none"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-if="placeholder" value="" disabled>
        {{ placeholder }}
      </option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>
