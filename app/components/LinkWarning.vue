<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80" @click.self="close">
      <div class="bg-surface border border-border p-6 max-w-lg w-full mx-4">
        <div class="flex items-center gap-2 text-yellow-400 mb-4">
          <Icon name="tabler:alert-triangle" size="24px" />
          <h2 class="text-lg font-bold">External Link Warning</h2>
        </div>

        <p class="text-gray-400 mb-4">You just clicked a link that will take you to a different website. Please verify the link below before continuing:</p>

        <div class="bg-surface-elevated p-3 mb-4 break-all text-sm font-mono" :class="blocked ? 'text-red-400' : 'text-accent'">
          {{ url }}
        </div>

        <p v-if="blocked" class="flex items-center gap-1 text-red-400 text-sm mb-4">
          <Icon name="tabler:barrier-block-filled" size="18px" />
          This link appears to be dangerous. We have blocked it to protect you.
        </p>

        <div class="flex gap-3 justify-end">
          <button class="px-4 py-2 border border-border hover:bg-surface-elevated transition-colors cursor-pointer" @click="close">Close</button>
          <a v-if="!blocked" :href="url" target="_blank" rel="noopener noreferrer" class="px-4 py-2 bg-accent text-black font-medium hover:bg-accent/90 transition-colors" @click="close"> Continue </a>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const show = ref(false);
const url = ref("");
const blocked = ref(false);

function open(href: string) {
  url.value = href;
  blocked.value = ["javascript:", "data:", "vbscript:"].some((p) => href.toLowerCase().trim().startsWith(p));
  show.value = true;
}

function close() {
  show.value = false;
}

defineExpose({ open });
</script>
