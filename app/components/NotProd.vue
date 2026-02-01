<template>
  <div class="bg-surface">
    <div v-if="!cfg.live" class="bg-green-600/20 border border-green-600 text-white text-center py-2 text-sm font-bold">STAGING VERSION - Do NOT upload sensitive information - Real reports should not be submitted here</div>
  </div>
</template>

<script setup>
const cfg = useRuntimeConfig().public;
</script>
