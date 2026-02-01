<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <div class="mb-6">
      <h1 class="text-3xl font-bold">Open Programs</h1>
      <p class="text-gray-400">Hack Club is wide organization, and we have a lot of programs that are open for testing. Find a new program to hack on!</p>
    </div>

    <div class="relative mb-6">
      <Icon name="tabler:search" size="18px" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
      <input v-model="q" type="text" placeholder="Search programs..." class="w-full pl-10 pr-4 py-2 bg-transparent border border-border text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors" />
    </div>

    <Loading v-if="status === 'pending'" />

    <template v-else>
      <div v-if="empty" class="text-center py-12 border border-border text-gray-400 mb-6">
        <Icon name="tabler:zoom-question" size="48px" class="mx-auto mb-4" />
        <p class="mb-2">No matching programs found for "{{ q }}"</p>
        <p class="mb-4 max-w-lg mx-auto">Not to worry, you can still report it and we will make sure it gets to the right people.</p>
        <NuxtLink to="/other/report" class="inline-flex items-center gap-2 px-4 py-2 text-white border border-border font-medium hover:bg-surface transition-colors cursor-pointer">
          <Icon name="tabler:send" size="18px" />
          Report for an unlisted program
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ProgramCard v-for="p in items" :key="p.slug" :program="p" />
        <ProgramCard v-if="!empty" :program="hcb" />
        <ProgramCard v-if="!empty" :program="other" unlisted />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const { data: d, status } = await useFetch("/api/programs");

const q = ref("");

const items = computed(() => {
  if (!d.value) return [];
  if (!q.value) return d.value;

  const x = q.value.toLowerCase();
  return d.value.filter((p) => p.title.toLowerCase().includes(x) || p.description.toLowerCase().includes(x));
});

const empty = computed(() => q.value && items.value.length === 0);

const other = {
  slug: "other",
  title: "Not listed / Other",
  description: "Report a vulnerability for a program not listed here.",
};

const hcb = {
  slug: "hcb",
  title: "HCB",
  description: "Hack Club's fiscal sponsorship platform",
  iconUrl: "~/assets/hcb.webp",
};

useHead({
  title: "Aegis - Programs",
  meta: [
    {
      name: "description",
      content: "Browse available programs and submit vulnerability reports",
    },
  ],
});
</script>
