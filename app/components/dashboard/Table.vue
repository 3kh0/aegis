<template>
  <div class="border border-border overflow-x-auto">
    <table class="w-full">
      <thead class="bg-surface-elevated">
        <tr>
          <th class="text-left px-4 py-3 text-sm font-medium text-gray-400">Title</th>
          <th v-if="showProgram" class="text-left px-4 py-3 text-sm font-medium text-gray-400">Program</th>
          <th class="text-left px-4 py-3 text-sm font-medium text-gray-400">Status</th>
          <th class="text-left px-4 py-3 text-sm font-medium text-gray-400">Severity</th>
          <th class="text-left px-4 py-3 text-sm font-medium text-gray-400">Submitted By</th>
          <th class="text-left px-4 py-3 text-sm font-medium text-gray-400">Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in reports" :key="r.id" class="border-t border-border hover:bg-surface-elevated transition-colors">
          <td class="px-4 py-3">
            <NuxtLink :to="`/reports/${r.id}`" class="font-medium hover:text-accent transition-colors">
              {{ r.title }}
            </NuxtLink>
            <p class="text-xs text-gray-500 mt-1">{{ r.id.slice(0, 8) }}</p>
          </td>
          <td v-if="showProgram" class="px-4 py-3">
            <NuxtLink v-if="r.program" :to="`/${r.program.slug}`" class="text-sm text-gray-400 hover:text-accent transition-colors">
              {{ r.program.title }}
            </NuxtLink>
          </td>
          <td class="px-4 py-3">
            <Badge type="status" :value="r.status" />
          </td>
          <td class="px-4 py-3">
            <Badge type="severity" :value="r.severity" />
          </td>
          <td class="px-4 py-3 text-sm text-gray-400">
            <NuxtLink :to="`/@${r.submittedBy.username}`" class="flex items-center whitespace-nowrap">
              {{ r.submittedBy.username }}
              <Icon v-if="r.submittedBy.verified" name="tabler:discount-check-filled" size="16" class="text-accent ml-1" title="This user has proven to submit high quality reports" />
            </NuxtLink>
          </td>
          <td class="px-4 py-3 text-sm text-gray-500">
            {{ date(r.createdAt) }}
          </td>
        </tr>
        <tr v-if="!reports.length">
          <td :colspan="showProgram ? 6 : 5" class="px-4 py-8 text-center text-gray-500">No reports found</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="pages > 1" class="flex items-center justify-between mt-4">
    <p class="text-sm text-gray-500">Page {{ page }} of {{ pages }} ({{ total }} reports)</p>
    <div class="flex gap-2">
      <button :disabled="page <= 1" class="px-3 py-1 border border-border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:border-accent transition-colors" @click="emit('page', page - 1)">Prev</button>
      <button :disabled="page >= pages" class="px-3 py-1 border border-border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:border-accent transition-colors" @click="emit('page', page + 1)">Next</button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Report {
  id: string;
  title: string;
  status: string;
  severity: string;
  createdAt: string;
  submittedBy: { email: string; username: string | null; verified?: boolean };
  program?: { slug: string; title: string };
}

defineProps<{
  reports: Report[];
  page: number;
  pages: number;
  total: number;
  showProgram?: boolean;
}>();

const emit = defineEmits<{
  page: [n: number];
}>();

const { date } = useFormat();
</script>
