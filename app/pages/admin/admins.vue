<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold">Program Admins</h1>
      <p class="text-gray-400 mt-1">Assign users to manage specific programs</p>
    </div>

    <div class="border border-border p-6 mb-8">
      <h2 class="text-xl font-semibold mb-6">Add Program Admin</h2>

      <form class="space-y-4" @submit.prevent="add">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-gray-400 mb-1">User (email or username)</label>
            <input v-model="form.user" type="text" required placeholder="user@example.com" class="w-full px-4 py-2 bg-transparent border border-border text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors" />
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-1">Program</label>
            <select v-model="form.programId" required class="w-full px-4 py-2 bg-transparent border border-border text-white focus:outline-none focus:border-accent transition-colors">
              <option value="" disabled>Select a program</option>
              <option v-for="p in programs" :key="p.id" :value="p.id">{{ p.title }}</option>
            </select>
          </div>
        </div>

        <div v-if="err" class="text-danger text-sm">{{ err }}</div>

        <button type="submit" :disabled="busy" class="px-6 py-2 bg-accent text-black font-medium transition-colors flex items-center gap-2 disabled:opacity-50">
          <Icon v-if="busy" name="tabler:loader-2" size="18px" class="animate-spin" />
          <Icon v-else name="tabler:plus" size="18px" />
          Add Admin
        </button>
      </form>
    </div>

    <div class="border border-border p-6">
      <h2 class="text-xl font-semibold mb-6">Current Program Admins</h2>

      <Loading v-if="loading" />

      <div v-else-if="!admins.length" class="text-gray-500">No program admins assigned yet.</div>

      <div v-else class="space-y-4">
        <div v-for="a in admins" :key="a.id" class="border border-border p-4">
          <div class="flex items-center justify-between mb-3">
            <div>
              <p class="font-medium">{{ a.username || a.email }}</p>
              <p v-if="a.username" class="text-sm text-gray-500">{{ a.email }}</p>
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            <div v-for="p in a.programs" :key="p.id" class="flex items-center gap-2 bg-surface-elevated px-3 py-1 text-sm">
              <span>{{ p.title }}</span>
              <button class="text-gray-400 hover:text-danger transition-colors" @click="remove(a.id, p.id)">
                <Icon name="tabler:x" size="14px" />
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
  middleware: "global-admin",
});

interface Program {
  id: string;
  title: string;
}

interface Admin {
  id: string;
  email: string;
  username: string | null;
  programs: Program[];
}

const { busy, err, run } = useApi();

const form = reactive({ user: "", programId: "" });
const admins = ref<Admin[]>([]);
const loading = ref(true);

const { data: programs } = await useFetch<Program[]>("/api/programs");
const { data: adminsData, refresh: load } = await useFetch<Admin[]>("/api/admin/program-admins");

watch(
  adminsData,
  (v) => {
    admins.value = v ?? [];
    loading.value = false;
  },
  { immediate: true },
);

async function add() {
  const res = await run(() =>
    $fetch("/api/admin/program-admins", {
      method: "POST",
      body: { emailOrUsername: form.user, programId: form.programId },
    }),
  );

  if (res) {
    form.user = "";
    form.programId = "";
    await load();
  }
}

async function remove(userId: string, programId: string) {
  await $fetch(`/api/admin/program-admins/${userId}/${programId}`, { method: "DELETE" });
  await load();
}
</script>
