<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold">All Reports</h1>
        <p class="text-gray-400 mt-1">Search and manage reports across all programs</p>
      </div>
      <a href="/api/admin/reports/export" class="px-4 py-2 border border-border text-gray-400 hover:text-white hover:border-accent transition-colors flex items-center gap-2">
        <Icon name="tabler:download" size="18px" />
        Export
      </a>
    </div>

    <Loading v-if="statsPending" />

    <template v-else-if="stats">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <DashboardStat icon="tabler:file-text" label="Total Reports" :value="stats.reports" />
        <DashboardStat icon="tabler:clock" label="Last 7 Days" :value="stats.recent" />
        <DashboardStat icon="tabler:alert-circle" label="Open" :value="openCount" />
        <DashboardStat icon="tabler:check" label="Resolved" :value="stats.status.RESOLVED || 0" />
      </div>
    </template>

    <div class="mb-6">
      <DashboardFilters
        :status="filters.status"
        :severity="filters.severity"
        :program="filters.program"
        :programs="programs || []"
        :q="filters.q"
        @status="
          filters.status = $event;
          filters.page = 1;
        "
        @severity="
          filters.severity = $event;
          filters.page = 1;
        "
        @program="
          filters.program = $event;
          filters.page = 1;
        "
        @search="onSearch"
      />
    </div>

    <Loading v-if="reportsPending" />

    <DashboardTable v-else-if="data" :reports="data.reports" :page="data.page" :pages="data.pages" :total="data.total" show-program @page="filters.page = $event" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "global-admin",
});

interface Stats {
  reports: number;
  status: Record<string, number>;
  severity: Record<string, number>;
  recent: number;
}

interface Program {
  id: string;
  title: string;
}

const { data: stats, pending: statsPending } = await useFetch<Stats>("/api/admin/reports/stats");

const { data: programs } = await useFetch<Program[]>("/api/programs", {
  transform: (d) => d.map((p) => ({ id: p.id, title: p.title })),
});

const openCount = computed(() => {
  if (!stats.value) return 0;
  const s = stats.value.status;
  return (s.NEW || 0) + (s.TRIAGED || 0) + (s.NEEDS_MORE_INFO || 0);
});

const filters = reactive({
  status: "",
  severity: "",
  program: "",
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
  program: filters.program || undefined,
  q: filters.q || undefined,
  page: filters.page,
}));

const { data, pending: reportsPending } = await useFetch("/api/admin/reports", {
  query,
  watch: [query],
});
</script>
