<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div v-if="html" class="prose text-gray-300 prose-invert max-w-none" @click="onLink" v-html="html" />
  <div v-else class="text-gray-400 text-center py-8">No additional information available for this report.</div>
  <LinkWarning ref="warn" />
</template>

<script setup lang="ts">
import { Marked } from "marked";

const md = new Marked({ async: false });
md.use({
  renderer: {
    html: (t) => t.raw.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
  },
});

const p = defineProps<{
  content?: string | null;
}>();

const html = computed(() => {
  if (!p.content) return "";
  return md.parse(p.content) as string;
});

const { warn, onLink } = useLinkGuard();
</script>

<style scoped>
@reference "@/css/main.css";

.prose {
  @apply text-gray-300;
}

.prose :deep(h1),
.prose :deep(h2),
.prose :deep(h3),
.prose :deep(h4) {
  @apply text-white font-bold mt-6 mb-3;
}

.prose :deep(h1) {
  @apply text-2xl;
}

.prose :deep(h2) {
  @apply text-xl;
}

.prose :deep(h3) {
  @apply text-lg;
}

.prose :deep(p) {
  @apply mb-4;
}

.prose :deep(ul),
.prose :deep(ol) {
  @apply mb-4 pl-6;
}

.prose :deep(li) {
  @apply mb-2;
}

.prose :deep(ul) {
  @apply list-disc;
}

.prose :deep(ol) {
  @apply list-decimal;
}

.prose :deep(a) {
  @apply text-accent underline;
}

.prose :deep(code) {
  @apply bg-surface-elevated px-1 py-0.5 text-sm;
}

.prose :deep(pre) {
  @apply bg-surface-elevated p-4 overflow-x-auto mb-4;
}

.prose :deep(pre code) {
  @apply bg-transparent p-0;
}

.prose :deep(blockquote) {
  @apply border-l-4 border-border pl-4 italic text-gray-400 my-4;
}
</style>
