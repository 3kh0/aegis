<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <div v-if="block?.blocked" class="p-4 mb-6 bg-danger/25 border border-danger text-danger">
      <p class="font-medium">You are currently blocked from submitting reports. Please review our <NuxtLink to="/rules" class="underline">rules</NuxtLink> to prevent this from happening again. You will be able to submit new reports once your block expires.</p>
      <p class="text-sm mt-1">Block expires on {{ new Date(block.blockedUntil).toLocaleDateString() }} — Reason: {{ block.reason }}</p>
    </div>

    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold">Dashboard</h1>
        <p class="text-gray-400 mt-1">See your reports all in one place</p>
      </div>
      <NuxtLink to="/programs" class="px-4 py-2 bg-accent text-black font-medium transition-colors flex items-center gap-2" :aria-disabled="block?.blocked" :tabindex="block?.blocked ? -1 : 0" :class="{ 'opacity-50 pointer-events-none cursor-not-allowed': block?.blocked }">
        <Icon name="tabler:send" size="18px" class="inline-block" />
        <span>New Report</span>
      </NuxtLink>
    </div>

    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
      <div class="flex border border-border">
        <button :class="['px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2', tab === 'open' ? 'bg-accent text-black' : 'text-gray-400 hover:text-white']" @click="tab = 'open'">
          <Icon name="tabler:folder-open" size="18px" />
          Open
        </button>
        <button :class="['px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2', tab === 'closed' ? 'bg-accent text-black' : 'text-gray-400 hover:text-white']" @click="tab = 'closed'">
          <Icon name="tabler:folder-check" size="18px" />
          Resolved
        </button>
      </div>

      <div class="relative flex-1">
        <Icon name="tabler:search" size="18px" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input v-model="q" type="text" placeholder="Search all reports..." class="w-full pl-10 pr-4 py-2 bg-transparent border border-border text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors" />
      </div>
    </div>

    <Loading v-if="status === 'pending'" />

    <Empty v-else-if="items.length === 0" icon="tabler:sailboat">
      No reports found.<br />Find hackable targets in the <NuxtLink to="/programs" class="underline">programs list</NuxtLink>.
      <template #action>
        <div class="mb-4 text-sm max-w-xs mx-auto">
          <Quote class="text-center" />
        </div>
      </template>
    </Empty>

    <div v-else class="space-y-4">
      <div v-for="r in items" :key="r.id" class="border border-border p-6">
        <NuxtLink :to="`/reports/${r.id}`" class="flex items-start justify-between gap-4 group">
          <div class="flex-1">
            <h3 class="text-lg font-semibold font-display mb-2 group-hover:text-accent transition-colors">
              {{ r.title }}
            </h3>
            <div class="flex flex-wrap items-center gap-4 text-sm">
              <Badge type="severity" :value="r.severity" />
              <Badge type="status" :value="r.status" />
              <span class="text-gray-500 flex items-center gap-1">
                <Icon name="tabler:calendar-event" size="18px" />
                {{ date(r.createdAt) }}
              </span>
              <span class="text-gray-500 flex items-center gap-1">
                <Icon name="tabler:user" size="18px" />
                {{ r.submittedBy.username }}
              </span>
              <span v-if="r.program" class="text-gray-500 flex items-center gap-1">
                <Icon name="tabler:cube" size="18px" />
                {{ r.program.title }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const { user } = useUserSession();
if (!user.value?.username) {
  navigateTo("/auth/welcome");
}

const { date } = useFormat();

const { data: list, status } = await useFetch("/api/reports");
const { data: block } = await useFetch("/api/me/block");

const tab = ref<"open" | "closed">("open");
const q = ref("");

const items = computed(() => {
  if (!list.value) return [];

  return list.value.filter((r) => {
    const openStatuses = ["NEW", "TRIAGED", "NEEDS_MORE_INFO"];
    const open = openStatuses.includes(r.status);
    const match = tab.value === "open" ? open : !open;
    const search = q.value === "" || r.title.toLowerCase().includes(q.value.toLowerCase());
    return match && search;
  });
});
</script>
