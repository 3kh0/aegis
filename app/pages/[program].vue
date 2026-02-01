<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <Loading v-if="status === 'pending'" />

    <template v-else-if="data">
      <div class="mb-8">
        <NuxtLink to="/programs" class="text-gray-400 hover:text-white transition-colors flex items-center gap-1 mb-4">
          <Icon name="tabler:arrow-left" size="18px" />
          Back to programs
        </NuxtLink>

        <div class="flex items-start gap-6">
          <div v-if="data.iconUrl" class="w-16 h-16 shrink-0">
            <img :src="data.iconUrl" :alt="data.title" class="w-full h-full object-contain" />
          </div>
          <div v-else class="w-16 h-16 shrink-0 bg-surface-elevated flex items-center justify-center">
            <Icon name="tabler:building" size="32px" class="text-gray-500" />
          </div>
          <div class="flex-1">
            <h1 class="text-3xl font-bold">{{ data.title }}</h1>
            <p class="text-gray-400 mt-2">{{ data.description }}</p>
            <div v-if="data.website" class="mt-3">
              <a :href="data.website" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline flex items-center gap-1">
                <Icon name="tabler:external-link" size="16px" />
                {{ data.website }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="border border-border p-6">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-if="data.content" ref="content" class="prose prose-invert max-w-none" @click="onLink" v-html="html" />
        <div v-else class="text-center py-8">This program has not provided any additional information related to their security scopes. Please use the <NuxtLink to="/rules" class="underline">global rules</NuxtLink> for your security research.</div>
      </div>

      <LinkWarning ref="warn" />

      <LeaderGrid :leaders="data.leaders" />

      <div class="mt-8 flex justify-center">
        <NuxtLink :to="`/${slug}/report`" class="px-6 py-3 bg-accent text-black font-medium transition-colors flex items-center gap-2 hover:bg-accent/90">
          <Icon name="tabler:send" size="18px" />
          Report Vulnerability
        </NuxtLink>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Marked } from "marked";

const md = new Marked({ async: false });
md.use({
  renderer: {
    html: (t) => t.raw.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
  },
});

const route = useRoute();
const slug = route.params.program as string;

const { data, status } = await useFetch(`/api/programs/${slug}`);

if (status.value === "error" || !data.value) {
  throw createError({ statusCode: 404, statusMessage: "Page not found" });
}

const html = computed(() => {
  if (!data.value?.content) return "";
  return md.parse(data.value.content) as string;
});

const { warn, onLink } = useLinkGuard();

useHead({
  title: computed(() => data.value?.title || "Program"),
  meta: [
    {
      name: "description",
      content: computed(() => data.value?.description || ""),
    },
    {
      property: "og:title",
      content: computed(() => data.value?.title || "Program"),
    },
    {
      property: "og:description",
      content: computed(() => data.value?.description || ""),
    },
    {
      property: "og:image",
      content: computed(() => data.value?.iconUrl || ""),
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      name: "twitter:card",
      content: "summary",
    },
    {
      name: "twitter:title",
      content: computed(() => data.value?.title || "Program"),
    },
    {
      name: "twitter:description",
      content: computed(() => data.value?.description || ""),
    },
    {
      name: "twitter:image",
      content: computed(() => data.value?.iconUrl || ""),
    },
  ],
});
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
