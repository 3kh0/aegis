<template>
  <aside class="p-6 overflow-y-auto h-full">
    <div class="flex items-start gap-4 mb-6 pb-6 border-b border-border">
      <div v-if="program.iconUrl" class="w-12 h-12 shrink-0">
        <img :src="program.iconUrl" :alt="program.title" class="w-full h-full object-contain" />
      </div>
      <div v-else class="w-12 h-12 shrink-0 bg-surface-elevated flex items-center justify-center rounded-lg">
        <Icon name="tabler:building" size="28px" class="text-gray-500" />
      </div>
      <div class="flex-1 min-w-0">
        <h2 class="text-lg font-semibold font-display">{{ program.title }}</h2>
        <p class="text-gray-400 text-sm mt-1">{{ program.description }}</p>
        <a v-if="program.website" :href="program.website" target="_blank" rel="noopener" class="text-accent text-sm hover:underline flex items-center gap-1 mt-2">
          <Icon name="tabler:external-link" size="14px" />
          {{ program.website }}
        </a>
      </div>
    </div>

    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-if="program.content" class="prose prose-sm prose-invert max-w-none" @click="onLink" v-html="html" />
    <div v-else class="text-gray-500 text-sm">This program has not provided any additional information related to their security scopes. Please use the <NuxtLink to="/rules" class="underline">global rules</NuxtLink> for your security research.</div>

    <LinkWarning ref="warn" />
  </aside>
</template>

<script setup lang="ts">
import { Marked } from "marked";

const md = new Marked({ async: false });
md.use({
  renderer: {
    html: (t) => t.raw.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
  },
});

interface Program {
  title: string;
  description: string;
  iconUrl?: string | null;
  website?: string | null;
  content?: string | null;
}

const props = defineProps<{
  program: Program;
}>();

const html = computed(() => {
  if (!props.program.content) return "";
  return md.parse(props.program.content) as string;
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
  @apply text-white font-bold mt-4 mb-2;
}
.prose :deep(h1) {
  @apply text-xl;
}
.prose :deep(h2) {
  @apply text-lg;
}
.prose :deep(h3) {
  @apply text-base;
}
.prose :deep(p) {
  @apply mb-3 text-sm;
}
.prose :deep(ul),
.prose :deep(ol) {
  @apply mb-3 pl-5 text-sm;
}
.prose :deep(li) {
  @apply mb-1;
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
  @apply bg-surface-elevated px-1 py-0.5 text-xs;
}
.prose :deep(pre) {
  @apply bg-surface-elevated p-3 overflow-x-auto mb-3 text-xs;
}
.prose :deep(pre code) {
  @apply bg-transparent p-0;
}
.prose :deep(blockquote) {
  @apply border-l-4 border-border pl-3 italic text-gray-400 my-3 text-sm;
}
</style>
