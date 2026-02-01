<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold">Admin Dashboard</h1>
      <p class="text-gray-400 mt-1">Platform overview and management</p>
    </div>

    <Loading v-if="pending" />

    <template v-else-if="stats">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardStat icon="tabler:file-text" label="Total Reports" :value="stats.reports" />
        <DashboardStat icon="tabler:building" label="Programs" :value="stats.programs" />
        <DashboardStat icon="tabler:users" label="Users" :value="stats.users" />
        <DashboardStat icon="tabler:alert-circle" label="Open Reports" :value="openCount" sub="NEW + TRIAGED + NEEDS_MORE_INFO" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="border border-border p-6">
          <h2 class="text-lg font-semibold mb-4">Reports by Status</h2>
          <div class="space-y-3">
            <div v-for="(count, status) in stats.status" :key="status" class="flex items-center justify-between">
              <Badge type="status" :value="status" />
              <span class="text-gray-400">{{ count }}</span>
            </div>
            <div v-if="!Object.keys(stats.status).length" class="text-gray-500 text-sm">No reports yet</div>
          </div>
        </div>

        <div class="border border-border p-6">
          <h2 class="text-lg font-semibold mb-4">Reports by Severity</h2>
          <div class="space-y-3">
            <div v-for="(count, sev) in stats.severity" :key="sev" class="flex items-center justify-between">
              <Badge type="severity" :value="sev" />
              <span class="text-gray-400">{{ count }}</span>
            </div>
            <div v-if="!Object.keys(stats.severity).length" class="text-gray-500 text-sm">No reports yet</div>
          </div>
        </div>
      </div>
    </template>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <NuxtLink v-for="a in actions" :key="a.to" :to="a.to" class="border border-border p-6 hover:border-accent transition-colors group">
        <div class="flex items-center gap-4 mb-3">
          <div class="w-12 h-12 bg-surface-elevated flex items-center justify-center">
            <Icon :name="a.icon" size="24px" class="text-gray-400 group-hover:text-accent transition-colors" />
          </div>
        </div>
        <h3 class="text-lg font-semibold font-display group-hover:text-accent transition-colors">
          {{ a.title }}
        </h3>
        <p class="text-gray-400 text-sm mt-1">{{ a.desc }}</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "global-admin",
});

interface Stats {
  programs: number;
  users: number;
  reports: number;
  status: Record<string, number>;
  severity: Record<string, number>;
}

const { data: stats, pending } = await useFetch<Stats>("/api/admin/stats");

const openCount = computed(() => {
  if (!stats.value) return 0;
  const s = stats.value.status;
  return (s.NEW || 0) + (s.TRIAGED || 0) + (s.NEEDS_MORE_INFO || 0);
});

const actions = [
  {
    title: "Reports",
    desc: "Search and manage all reports",
    icon: "tabler:file-text",
    to: "/admin/reports",
  },
  {
    title: "Programs",
    desc: "Create and manage bug bounty programs",
    icon: "tabler:building",
    to: "/admin/programs",
  },
  {
    title: "Program Admins",
    desc: "Assign users as program administrators",
    icon: "tabler:users",
    to: "/admin/admins",
  },
  {
    title: "User Management",
    desc: "Search users, verify accounts, and manage roles",
    icon: "tabler:user-cog",
    to: "/admin/users",
  },
];
</script>
