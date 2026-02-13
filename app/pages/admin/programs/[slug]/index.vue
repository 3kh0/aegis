<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-4">
        <img v-if="program?.iconUrl" :src="program.iconUrl" class="w-12 h-12 object-contain" />
        <div v-else class="w-12 h-12 bg-surface-elevated flex items-center justify-center">
          <Icon name="tabler:building" size="24px" class="text-gray-500" />
        </div>
        <div>
          <h1 class="text-3xl font-bold">{{ program?.title }}</h1>
          <p class="text-gray-400 mt-1">Program Dashboard</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink :to="`/admin/programs/${slug}/edit`" class="px-4 py-2 border border-border text-gray-400 hover:text-white hover:border-accent transition-colors flex items-center gap-2">
          <Icon name="tabler:edit" size="18px" />
          Edit
        </NuxtLink>
        <NuxtLink :to="`/${slug}`" class="px-4 py-2 border border-border text-gray-400 hover:text-white hover:border-accent transition-colors flex items-center gap-2">
          <Icon name="tabler:external-link" size="18px" />
          View Public Page
        </NuxtLink>
        <a :href="`/api/programs/${slug}/reports/export`" class="px-4 py-2 border border-border text-gray-400 hover:text-white hover:border-accent transition-colors flex items-center gap-2">
          <Icon name="tabler:download" size="18px" />
          Export
        </a>
      </div>
    </div>

    <div class="lg:col-span-2 space-y-6">
      <Loading v-if="statsPending" />

      <template v-else-if="stats">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <DashboardStat icon="tabler:file-text" label="Total Reports" :value="stats.total" />
          <DashboardStat icon="tabler:clock" label="Last 7 Days" :value="stats.recent" />
          <DashboardStat icon="tabler:alert-circle" label="Open" :value="openCount" />
          <DashboardStat icon="tabler:check" label="Resolved" :value="stats.status.RESOLVED || 0" />
        </div>
      </template>

      <div>
        <DashboardFilters
          :status="filters.status"
          :severity="filters.severity"
          :q="filters.q"
          @status="
            filters.status = $event;
            filters.page = 1;
          "
          @severity="
            filters.severity = $event;
            filters.page = 1;
          "
          @search="onSearch"
        />
      </div>

      <Loading v-if="reportsPending" />

      <DashboardTable v-else-if="data" :reports="data.reports" :page="data.page" :pages="data.pages" :total="data.total" @page="filters.page = $event" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "program-access",
});

const route = useRoute();
const slug = computed(() => route.params.slug as string);
const { user, fetch: fetchSession } = useUserSession();

interface Program {
  id: string;
  title: string;
  iconUrl: string | null;
}

interface Stats {
  total: number;
  recent: number;
  status: Record<string, number>;
  severity: Record<string, number>;
}

interface Member {
  id: string;
  email: string;
  username: string | null;
  joinedAt?: string;
}

const { data: program } = await useFetch<Program>(`/api/programs/${slug.value}`);

const { data: stats, pending: statsPending } = await useFetch<Stats>(() => `/api/programs/${slug.value}/stats`);

const openCount = computed(() => {
  if (!stats.value) return 0;
  const s = stats.value.status;
  return (s.NEW || 0) + (s.TRIAGED || 0) + (s.NEEDS_MORE_INFO || 0);
});

const filters = reactive({
  status: "",
  severity: "",
  q: "",
  page: 1,
});

let searchTimeout: ReturnType<typeof setTimeout>;
function onSearch(v: string) {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    filters.q = v;
    filters.page = 1;
  }, 300);
}

const query = computed(() => ({
  status: filters.status || undefined,
  severity: filters.severity || undefined,
  q: filters.q || undefined,
  page: filters.page,
}));

const { data, pending: reportsPending } = await useFetch(() => `/api/programs/${slug.value}/reports`, {
  query,
  watch: [query],
});
</script>
