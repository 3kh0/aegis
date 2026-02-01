<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold">Manage Programs</h1>
        <p class="text-gray-400 mt-1">Create and manage bug bounty programs</p>
      </div>
    </div>

    <div class="border border-border p-6 mb-8">
      <h2 class="text-xl font-semibold mb-6">{{ editing ? "Edit Program" : "Create New Program" }}</h2>

      <form class="space-y-4" @submit.prevent="save">
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
            <Icon v-else-if="editing" name="tabler:check" size="18px" />
            <Icon v-else name="tabler:plus" size="18px" />
            {{ editing ? "Save Changes" : "Create Program" }}
          </button>
          <button v-if="editing" type="button" class="px-6 py-2 border border-border text-gray-400 hover:text-white transition-colors" @click="reset">Cancel</button>
        </div>
      </form>
    </div>

    <div class="border border-border p-6">
      <h2 class="text-xl font-semibold mb-6">All Programs</h2>

      <Loading v-if="status === 'pending'" />

      <div v-else-if="!list?.length" class="text-gray-400">No programs yet.</div>

      <div v-else class="space-y-3">
        <div v-for="p in list" :key="p.id" class="flex items-center justify-between p-4 border border-border">
          <div class="flex items-center gap-4">
            <div v-if="p.iconUrl" class="w-10 h-10 shrink-0">
              <img :src="p.iconUrl" :alt="p.title" class="w-full h-full object-contain" />
            </div>
            <div v-else class="w-10 h-10 shrink-0 bg-surface-elevated flex items-center justify-center">
              <Icon name="tabler:building" size="20px" class="text-gray-500" />
            </div>
            <div>
              <p class="font-medium">{{ p.title }}</p>
              <p class="text-sm text-gray-500">/{{ p.slug }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button class="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm" @click="edit(p)">
              <Icon name="tabler:edit" size="16px" />
              Edit
            </button>
            <NuxtLink :to="`/admin/programs/${p.slug}`" class="text-accent hover:underline text-sm flex items-center gap-1">
              <Icon name="tabler:settings" size="16px" />
              Manage
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "admin",
});

interface Program {
  id: string;
  title: string;
  slug: string;
  iconUrl: string | null;
  description: string;
}

interface ProgramDetail extends Program {
  website: string | null;
  content: string | null;
}

const { busy, err, run } = useApi();

const form = reactive({
  title: "",
  slug: "",
  iconUrl: "",
  description: "",
  website: "",
  content: "",
});

const editing = ref<string | null>(null);
const slug = ref<string | null>(null);

const { data: list, status, refresh } = await useFetch<Program[]>("/api/programs");

function reset() {
  form.title = "";
  form.slug = "";
  form.iconUrl = "";
  form.description = "";
  form.website = "";
  form.content = "";
  editing.value = null;
  slug.value = null;
}

async function edit(p: Program) {
  const full = await $fetch<ProgramDetail>(`/api/programs/${p.slug}`);

  form.title = full.title;
  form.slug = full.slug;
  form.iconUrl = full.iconUrl || "";
  form.description = full.description;
  form.website = full.website || "";
  form.content = full.content || "";
  editing.value = full.id;
  slug.value = full.slug;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function save() {
  const res = await run(async () => {
    if (editing.value && slug.value) {
      return $fetch(`/api/programs/${slug.value}`, { method: "PUT", body: form });
    }
    return $fetch("/api/programs", { method: "POST", body: form });
  });

  if (res) {
    reset();
    await refresh();
  }
}
</script>
