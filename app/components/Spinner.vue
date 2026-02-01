<template>
  <svg class="x" :width="size" :height="size" viewBox="0 0 24 24" fill="none">
    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.56 3.69a9 9 0 0 0-2.92 1.95M3.69 8.56A9 9 0 0 0 3 12m.69 3.44a9 9 0 0 0 1.95 2.92m2.92 1.95A9 9 0 0 0 12 21m3.44-.69a9 9 0 0 0 2.92-1.95m1.95-2.92A9 9 0 0 0 21 12m-.69-3.44a9 9 0 0 0-1.95-2.92m-2.92-1.95A9 9 0 0 0 12 3" />
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  size?: string;
}>();
</script>

<style scoped>
.x {
  animation: x 1s linear infinite;
}

@keyframes x {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
