<script setup lang="ts">
  defineProps<{
    id: string
    label: string
    modelValue: string
    required?: boolean
    placeholder?: string
    rows?: number
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
    <textarea
      :id="id"
      :value="modelValue"
      :rows="rows || 3"
      :required="required"
      :placeholder="placeholder"
      class="mt-1 block w-full rounded-md border border-line bg-cream px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-forest focus:outline-none"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    ></textarea>
  </div>
</template>
