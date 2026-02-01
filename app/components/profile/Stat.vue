<template>
  <div class="group border border-border p-6 transition-all duration-300">
    <div class="flex items-start justify-between mb-2">
      <span class="text-4xl font-bold font-display" :class="color">{{ value }}</span>
      <Icon :name="icon" size="28" class="text-gray-500" />
    </div>
    <span class="text-sm text-gray-400">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  value: number;
  label: string;
  icon: string;
  color?: string;
}>();
</script>
