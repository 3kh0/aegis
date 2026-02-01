<template>
  <div class="text-center py-16">
    <div class="flex items-center justify-center mx-auto mb-6">
      <Icon :name="icon" size="48px" />
    </div>
    <p class="text-white mb-4">
      <slot />
    </p>
    <slot name="action" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string;
}>();
</script>
