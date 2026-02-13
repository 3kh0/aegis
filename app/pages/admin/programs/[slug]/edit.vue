<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Editing {{ form.title }}</h1>

    <Loading v-if="loading" />

    <div v-else>
      <form class="space-y-4 border border-border p-6 mb-6" @submit.prevent="save">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-gray-400 mb-1">Title *</label>
            <input v-model="form.title" type="text" required placeholder="Acme Corp" class="w-full px-4 py-2 bg-transparent border border-border text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors" />
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-1">Slug *</label>
            <input v-model="form.slug" type="text" required placeholder="acme-corp" pattern="[a-z0-9\-]+" class="w-full px-4 py-2 bg-transparent border border-border text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors" />
            <p class="text-xs text-gray-500 mt-1">URL path: /{{ form.slug || "slug" }}</p>
          </div>
        </div>

        <div>
          <label class="block text-sm text-gray-400 mb-1">Short Description *</label>
          <input v-model="form.description" type="text" required maxlength="500" placeholder="A brief description of the program" class="w-full px-4 py-2 bg-transparent border border-border text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-gray-400 mb-1">Icon URL</label>
            <input v-model="form.iconUrl" type="url" placeholder="https://example.com/icon.png" class="w-full px-4 py-2 bg-transparent border border-border text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors" />
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-1">Website</label>
            <input v-model="form.website" type="url" placeholder="https://example.com" class="w-full px-4 py-2 bg-transparent border border-border text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors" />
          </div>
        </div>

        <div>
          <label class="block text-sm text-gray-400 mb-1">Content (Markdown)</label>
          <textarea v-model="form.content" rows="8" placeholder="## Scope&#10;&#10;List your in-scope assets here...&#10;&#10;## Rules&#10;&#10;- No automated scanning&#10;- Report responsibly" class="w-full px-4 py-2 bg-transparent border border-border text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors resize-y" />
        </div>

        <div v-if="err" class="text-danger text-sm">{{ err }}</div>

        <div class="flex items-center gap-4">
          <button type="submit" :disabled="busy" class="px-6 py-2 bg-accent text-black font-medium transition-colors flex items-center gap-2 disabled:opacity-50">
            <Icon v-if="busy" name="tabler:loader-2" size="18px" class="animate-spin" />
            <Icon v-else name="tabler:check" size="18px" />
            Save Changes
          </button>
          <NuxtLink :to="`/admin/programs/${slug}`" class="px-6 py-2 border border-border text-gray-400 hover:text-white transition-colors">Cancel</NuxtLink>
        </div>
      </form>

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

          <Loading v-if="mpending" />

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

const { busy, err, run } = useApi();
const loading = ref(true);

const form = reactive({
  title: "",
  slug: "",
  iconUrl: "",
  description: "",
  website: "",
  content: "",
});

onMounted(async () => {
  try {
    const data = await $fetch<{
      title: string;
      iconUrl: string | null;
      description: string;
      website: string | null;
      content: string | null;
    }>(`/api/programs/${slug.value}`);

    form.title = data.title;
    form.slug = slug.value;
    form.iconUrl = data.iconUrl || "";
    form.description = data.description;
    form.website = data.website || "";
    form.content = data.content || "";
  } finally {
    loading.value = false;
  }
});

async function save() {
  const res = await run(() =>
    $fetch<{ slug: string }>(`/api/programs/${slug.value}`, {
      method: "PUT",
      body: form,
    }),
  );

  if (res) {
    navigateTo(`/admin/programs/${res.slug}`);
  }
}

const { data: members, pending: mpending, refresh } = await useFetch<Member[]>(() => `/api/programs/${slug.value}/members`);

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
    await refresh();
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
    await refresh();
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } };
    memberErr.value = err.data?.message || "Failed to remove member";
  }
}
</script>
