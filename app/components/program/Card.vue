<template>
  <NuxtLink :to="unlisted ? '/other/report' : program.slug" class="border border-border p-6 hover:border-accent transition-colors group flex flex-col">
    <div class="flex items-start gap-4">
      <div v-if="src" class="w-12 h-12 shrink-0">
        <img :src="src" :alt="program.title" class="w-full h-full object-contain" />
      </div>
      <div v-else class="w-12 h-12 shrink-0 bg-surface-elevated flex items-center justify-center rounded-lg">
        <Icon :name="i" size="28px" class="text-gray-500" />
      </div>
      <div class="flex-1 min-w-0">
        <h2 class="text-lg font-semibold font-display group-hover:text-accent transition-colors truncate">
          {{ program.title }}
        </h2>
        <p class="text-gray-400 text-sm mt-1 line-clamp-2">{{ program.description }}</p>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import hcbImg from "~/assets/hcb.webp";

interface Program {
  slug: string;
  title: string;
  description: string;
  iconUrl?: string | null;
}

const props = defineProps<{
  program: Program;
  unlisted?: boolean;
}>();

const i = computed(() => (props.unlisted ? "tabler:zoom-question" : "tabler:cube"));

const src = computed(() => {
  if (props.program?.slug === "hcb") return hcbImg;
  return props.program?.iconUrl || null;
});
</script>
