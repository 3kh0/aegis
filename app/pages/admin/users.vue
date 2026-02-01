<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold">User Management</h1>
      <p class="text-gray-400 mt-1">Search users and manage roles & verification</p>
    </div>

    <div class="border border-border p-6 mb-8">
      <form class="flex gap-4" @submit.prevent="search">
        <input v-model="q" type="text" placeholder="Search by email or username..." class="flex-1 px-4 py-2 bg-transparent border border-border text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors" />
        <button type="submit" :disabled="busy || !q.trim()" class="px-6 py-2 bg-accent text-black font-medium transition-colors flex items-center gap-2 disabled:opacity-50">
          <Icon v-if="busy" name="tabler:loader-2" size="18px" class="animate-spin" />
          <Icon v-else name="tabler:search" size="18px" />
          Search
        </button>
      </form>
    </div>

    <div v-if="err" class="text-danger mb-4">{{ err }}</div>

    <div v-if="searched" class="border border-border p-6">
      <h2 class="text-xl font-semibold mb-6">Results</h2>

      <div v-if="!users.length" class="text-gray-500">No users found.</div>

      <div v-else class="space-y-4">
        <div v-for="u in users" :key="u.id" class="border border-border p-4">
          <div class="flex items-center justify-between mb-3">
            <div>
              <NuxtLink :to="`/@${u.username}`" class="font-medium underline">@{{ u.username }}</NuxtLink>
              <p class="text-sm text-gray-500">{{ u.email }}</p>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="u.verified" class="text-xs bg-green-900/50 text-green-400 px-2 py-1">Verified</span>
              <span v-else class="text-xs border border-border text-gray-400 px-2 py-1">Unverified</span>
              <span class="text-xs bg-surface-elevated px-2 py-1">{{ u.role }}</span>
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <button v-if="!u.verified" class="px-3 py-1 text-sm border border-border hover:border-accent transition-colors cursor-pointer" :disabled="updating === u.id" @click="setVerified(u, true)">
              <Icon v-if="updating === u.id" name="tabler:loader-2" size="14px" class="animate-spin" />
              <span v-else>Verify</span>
            </button>
            <button v-if="u.verified" class="px-3 py-1 text-sm border border-border hover:border-danger text-danger transition-colors cursor-pointer" :disabled="updating === u.id" @click="setVerified(u, false)">
              <Icon v-if="updating === u.id" name="tabler:loader-2" size="14px" class="animate-spin" />
              <span v-else>Unverify</span>
            </button>
            <button v-if="u.role !== 'GLOBAL_ADMIN'" class="px-3 py-1 text-sm border border-border hover:border-accent transition-colors cursor-pointer" :disabled="updating === u.id" @click="promote(u)">
              <Icon v-if="updating === u.id" name="tabler:loader-2" size="14px" class="animate-spin" />
              <span v-else>Promote to Global Admin</span>
            </button>
            <button v-if="u.role === 'GLOBAL_ADMIN'" class="px-3 py-1 text-sm border border-border hover:border-danger text-danger transition-colors cursor-pointer" :disabled="updating === u.id" @click="demote(u)">
              <Icon v-if="updating === u.id" name="tabler:loader-2" size="14px" class="animate-spin" />
              <span v-else>Remove Global Admin</span>
            </button>
            <button v-if="u.role !== 'GLOBAL_ADMIN' && !isBlocked(u)" class="px-3 py-1 text-sm border border-border hover:border-danger text-danger transition-colors cursor-pointer" :disabled="updating === u.id" @click="openBlock(u)">Block</button>
            <button v-if="isBlocked(u)" class="px-3 py-1 text-sm border border-border hover:border-accent transition-colors cursor-pointer" :disabled="updating === u.id" @click="unblock(u)">Unblock</button>
          </div>
          <div v-if="isBlocked(u)" class="mt-2 text-sm text-danger">Blocked until {{ new Date(u.blockedUntil!).toLocaleDateString() }} — {{ u.blockReason }}</div>
        </div>
      </div>
    </div>

    <div v-if="blockTarget" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="blockTarget = null">
      <div class="bg-surface border border-border p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Block @{{ blockTarget.username }}</h3>
        <div class="space-y-4">
          <div>
            <label class="text-sm text-gray-400 block mb-1">Duration (days)</label>
            <input v-model.number="blockDays" type="number" min="1" max="365" class="w-full px-3 py-2 bg-transparent border border-border text-white" />
          </div>
          <div>
            <label class="text-sm text-gray-400 block mb-1">Reason</label>
            <textarea v-model="blockReasonInput" rows="3" class="w-full px-3 py-2 bg-transparent border border-border text-white resize-none"></textarea>
          </div>
          <div class="flex gap-2 justify-end">
            <button class="px-4 py-2 border border-border hover:border-accent transition-colors" @click="blockTarget = null">Cancel</button>
            <button class="px-4 py-2 bg-danger text-white" :disabled="!blockDays || !blockReasonInput.trim()" @click="block">Block User</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "global-admin",
});

interface User {
  id: string;
  email: string;
  username: string | null;
  role: "USER" | "PROGRAM_ADMIN" | "GLOBAL_ADMIN";
  verified: boolean;
  blockedUntil: string | null;
  blockReason: string | null;
}

const { busy, err, run } = useApi();

const q = ref("");
const users = ref<User[]>([]);
const searched = ref(false);
const updating = ref<string | null>(null);
const blockTarget = ref<User | null>(null);
const blockDays = ref(7);
const blockReasonInput = ref("");

async function search() {
  const res = await run(() => $fetch<User[]>("/api/admin/users/search", { query: { q: q.value } }));
  if (res) {
    users.value = res;
    searched.value = true;
  }
}

async function setVerified(u: User, v: boolean) {
  updating.value = u.id;
  try {
    const res = await $fetch<User>(`/api/admin/users/${u.id}`, { method: "PATCH", body: { verified: v } });
    Object.assign(u, res);
  } finally {
    updating.value = null;
  }
}

async function promote(u: User) {
  updating.value = u.id;
  try {
    const res = await $fetch<User>(`/api/admin/users/${u.id}`, { method: "PATCH", body: { role: "GLOBAL_ADMIN" } });
    Object.assign(u, res);
  } finally {
    updating.value = null;
  }
}

async function demote(u: User) {
  updating.value = u.id;
  try {
    const res = await $fetch<User>(`/api/admin/users/${u.id}`, { method: "PATCH", body: { role: "USER" } });
    Object.assign(u, res);
  } finally {
    updating.value = null;
  }
}

const isBlocked = (u: User) => u.blockedUntil && new Date(u.blockedUntil) > new Date();

function openBlock(u: User) {
  blockTarget.value = u;
  blockDays.value = 7;
  blockReasonInput.value = "";
}

async function block() {
  const u = blockTarget.value;
  if (!u) return;
  updating.value = u.id;
  try {
    const res = await $fetch<{ blockedUntil: string; reason: string }>(`/api/admin/users/${u.id}/block`, {
      method: "POST",
      body: { duration: blockDays.value, reason: blockReasonInput.value },
    });
    u.blockedUntil = res.blockedUntil;
    u.blockReason = res.reason;
    blockTarget.value = null;
  } finally {
    updating.value = null;
  }
}

async function unblock(u: User) {
  updating.value = u.id;
  try {
    await $fetch(`/api/admin/users/${u.id}/block`, { method: "DELETE" });
    u.blockedUntil = null;
    u.blockReason = null;
  } finally {
    updating.value = null;
  }
}
</script>
