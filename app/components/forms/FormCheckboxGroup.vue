<script setup lang="ts">
  const props = defineProps<{
    label: string
    modelValue: string[]
    options: { label: string; value: string }[]
    required?: boolean
    helpText?: string
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string[]): void
  }>()

  function toggle(value: string) {
    const next = [...props.modelValue]
    const idx = next.indexOf(value)
    if (idx === -1) {
      next.push(value)
    } else {
      next.splice(idx, 1)
    }
    emit('update:modelValue', next)
  }
</script>

<template>
  <fieldset class="space-y-2">
    <legend class="block text-xs font-semibold tracking-wider text-ink uppercase">
      {{ label }}
      <span v-if="required" class="text-red-600">*</span>
    </legend>
    <p v-if="helpText" class="text-xs text-ink-muted">
      {{ helpText }}
    </p>
    <div class="space-y-2 pt-1">
      <label
        v-for="opt in options"
        :key="opt.value"
        class="flex cursor-pointer items-start gap-2.5 rounded-md border border-line bg-cream p-2.5 text-sm text-ink transition-colors hover:border-forest"
      >
        <input
          type="checkbox"
          :value="opt.value"
          :checked="modelValue.includes(opt.value)"
          class="mt-0.5 size-4 rounded border-line text-forest focus:ring-forest"
          @change="toggle(opt.value)"
        />
        <span>{{ opt.label }}</span>
      </label>
    </div>
  </fieldset>
</template>
