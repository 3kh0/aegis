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

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

      <div class="space-y-6">
        <div class="border border-border p-6">
          <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
            <Icon name="tabler:users" size="20px" />
            Program Members
          </h2>
          <p class="text-sm text-gray-400 mb-4">Members can manage reports and settings for this program.</p>

          <div class="flex gap-2 mb-4">
            <input v-model="newMember" type="text" placeholder="Email or username" class="flex-1 px-3 py-2 bg-transparent border border-border text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors text-sm" @keyup.enter="addMember()" />
            <button type="button" :disabled="memberBusy || !newMember.trim()" class="px-3 py-2 bg-accent text-black font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50 text-sm" @click="addMember()">
              <Icon v-if="memberBusy" name="tabler:loader-2" size="16px" class="animate-spin" />
              <Icon v-else name="tabler:plus" size="16px" />
              Add
            </button>
          </div>

          <div v-if="confirmNew" class="border border-warning/50 bg-warning/10 p-3 mb-4 text-sm">
            <p class="text-warning mb-2 flex items-center">
              <Icon name="tabler:alert-triangle" size="16px" class="mr-1" />
              <span
                >No account exists for <strong>{{ pendingEmail }}</strong></span
              >
            </p>
            <p class="text-white mb-3">This means we will send them a email to sign up. Double check to make sure this is the correct email.</p>
            <div class="flex gap-2">
              <button type="button" :disabled="memberBusy" class="px-3 py-1.5 bg-warning text-black font-medium text-sm" @click="confirmAddNew">Invite anyway</button>
              <button type="button" :disabled="memberBusy" class="px-3 py-1.5 border border-border text-gray-400 text-sm" @click="cancelAddNew">Cancel</button>
            </div>
          </div>

          <div v-if="memberErr" class="text-danger text-sm mb-4">{{ memberErr }}</div>

          <Loading v-if="membersPending" />

          <div v-else-if="!members?.length" class="text-gray-500 text-sm">No members yet.</div>

          <div v-else class="space-y-2">
            <div v-for="m in members" :key="m.id" class="flex items-center justify-between p-3 border border-border">
              <div class="min-w-0">
                <p class="font-medium truncate">{{ m.username || m.email }}</p>
                <p v-if="m.username" class="text-gray-500 text-xs truncate">{{ m.email }}</p>
              </div>
              <button type="button" class="text-gray-400 hover:text-danger transition-colors shrink-0 ml-2" @click="delMember(m.id)">
                <Icon name="tabler:x" size="18px" />
              </button>
            </div>
          </div>
        </div>
      </div>
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

const { data: members, pending: membersPending, refresh: refreshMembers } = await useFetch<Member[]>(() => `/api/programs/${slug.value}/members`);

const newMember = ref("");
const memberBusy = ref(false);
const memberErr = ref("");
const confirmNew = ref(false);
const pendingEmail = ref("");

async function addMember(force = false) {
  const q = newMember.value.trim();
  if (!q) return;

  memberBusy.value = true;
  memberErr.value = "";
  confirmNew.value = false;

  try {
    await $fetch(`/api/programs/${slug.value}/members`, {
      method: "POST",
      body: { emailOrUsername: q, force },
    });
    newMember.value = "";
    pendingEmail.value = "";
    await refreshMembers();
  } catch (e: unknown) {
    const err = e as { data?: { data?: { needsConfirm?: boolean }; message?: string } };
    if (err.data?.data?.needsConfirm) {
      confirmNew.value = true;
      pendingEmail.value = q;
      memberErr.value = "";
    } else {
      memberErr.value = err.data?.message || "Failed to add member";
    }
  } finally {
    memberBusy.value = false;
  }
}

function confirmAddNew() {
  addMember(true);
}

function cancelAddNew() {
  confirmNew.value = false;
  pendingEmail.value = "";
}

async function delMember(id: string) {
  try {
    const res = await $fetch<{ ok: boolean; demoted: boolean }>(`/api/programs/${slug.value}/members/${id}`, { method: "DELETE" });
    if (res.demoted && id === user.value?.id) {
      await fetchSession();
      return navigateTo("/dashboard");
    }
    await refreshMembers();
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } };
    memberErr.value = err.data?.message || "Failed to remove member";
  }
}
</script>
