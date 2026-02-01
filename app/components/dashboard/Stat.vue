<template>
  <div class="border border-border p-6">
    <div class="flex items-center gap-3 mb-2">
      <div class="w-10 h-10 bg-surface-elevated flex items-center justify-center">
        <Icon :name="icon" size="20px" class="text-gray-400" />
      </div>
      <span class="text-gray-400 text-sm">{{ label }}</span>
    </div>
    <p class="text-3xl font-bold font-display">{{ value }}</p>
    <p v-if="sub" class="text-sm text-gray-500 mt-1">{{ sub }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string;
  label: string;
  value: string | number;
  sub?: string;
}>();
</script>
