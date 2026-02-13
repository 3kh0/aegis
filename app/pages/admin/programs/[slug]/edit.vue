<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Editing {{ form.title }}</h1>

    <Loading v-if="loading" />

    <div v-else class="border border-border p-6">
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
            <Icon v-else name="tabler:check" size="18px" />
            Save Changes
          </button>
          <NuxtLink :to="`/admin/programs/${slug}`" class="px-6 py-2 border border-border text-gray-400 hover:text-white transition-colors">Cancel</NuxtLink>
        </div>
      </form>
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
</script>
