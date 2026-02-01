<template>
  <div class="relative border border-border bg-linear-to-br from-zinc-900 to-black p-8 sm:p-12">
    <button v-if="own && !edit" class="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-accent transition-colors cursor-pointer" @click="emit('edit')">
      <Icon name="tabler:pencil" size="20" />
    </button>

    <div class="flex items-center gap-0 mb-4">
      <Icon name="tabler:at" size="32" class="text-accent" />
      <h1 class="text-3xl sm:text-4xl font-bold font-display">{{ username }}</h1>
      <Icon v-if="verified" name="tabler:discount-check-filled" size="28" class="text-accent ml-2" title="This user has proven to submit high quality reports" />
    </div>

    <template v-if="!edit">
      <div class="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
        <span class="flex items-center gap-1.5">
          <Icon name="tabler:calendar-plus" size="18" />
          Joined {{ joined }}
        </span>
        <a v-if="website" :href="website" target="_blank" rel="noopener" class="flex items-center gap-1.5 hover:text-accent transition-colors">
          <Icon name="tabler:link" size="18" />
          {{ website }}
        </a>
        <a v-if="github" :href="`https://github.com/${github}`" target="_blank" rel="noopener" class="flex items-center gap-1.5 hover:text-accent transition-colors">
          <Icon name="tabler:brand-github" size="18" />
          {{ github }}
        </a>
        <a v-if="publicEmail" :href="`mailto:${publicEmail}`" class="flex items-center gap-1.5 hover:text-accent transition-colors">
          <Icon name="tabler:mail" size="18" />
          {{ publicEmail }}
        </a>
      </div>

      <p v-if="description" class="text-gray-300 max-w-2xl leading-relaxed">{{ description }}</p>
    </template>

    <form v-else class="space-y-4" @submit.prevent="save">
      <div>
        <label class="block text-sm text-gray-400 mb-1">Description</label>
        <textarea v-model="form.description" maxlength="300" rows="3" class="w-full bg-zinc-900 border border-border px-3 py-2 focus:border-accent focus:outline-none resize-none" placeholder="Tell us about yourself..." />
        <span class="text-xs text-gray-500">{{ form.description?.length || 0 }}/300</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-400 mb-1">Website</label>
          <input v-model="form.website" type="url" class="w-full bg-zinc-900 border border-border px-3 py-2 focus:border-accent focus:outline-none" placeholder="https://example.com" />
        </div>
        <div>
          <label class="block text-sm text-gray-400 mb-1">GitHub</label>
          <input v-model="form.github" type="text" class="w-full bg-zinc-900 border border-border px-3 py-2 focus:border-accent focus:outline-none" placeholder="samyk" />
        </div>
        <div>
          <label class="block text-sm text-gray-400 mb-1">Public Email</label>
          <input v-model="form.publicEmail" type="email" class="w-full bg-zinc-900 border border-border px-3 py-2 focus:border-accent focus:outline-none" placeholder="you@cool.com" />
        </div>
      </div>

      <div class="flex items-center gap-3 pt-2">
        <button type="button" class="px-4 py-2 border border-border text-gray-400 hover:text-white hover:border-gray-500 transition-colors cursor-pointer" @click="emit('cancel')">Cancel</button>
        <button type="submit" :disabled="saving" class="px-4 py-2 bg-accent text-black font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer">Save</button>
        <span v-if="saved" class="text-sm text-green-400">Saved!</span>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const p = defineProps<{
  username: string;
  verified: boolean;
  joined: string;
  description?: string | null;
  website?: string | null;
  github?: string | null;
  publicEmail?: string | null;
  own?: boolean;
  edit?: boolean;
}>();

const emit = defineEmits<{
  edit: [];
  cancel: [];
  saved: [data: { description?: string; website?: string; github?: string; publicEmail?: string }];
}>();

const form = reactive({
  description: p.description || "",
  website: p.website || "",
  github: p.github || "",
  publicEmail: p.publicEmail || "",
});

const saving = ref(false);
const saved = ref(false);

watch(
  () => p.edit,
  (v) => {
    if (v) {
      form.description = p.description || "";
      form.website = p.website || "";
      form.github = p.github || "";
      form.publicEmail = p.publicEmail || "";
      saved.value = false;
    }
  },
);

async function save() {
  saving.value = true;
  try {
    await $fetch("/api/profile", { method: "PATCH", body: form });
    saved.value = true;
    emit("saved", { ...form });
    setTimeout(() => (saved.value = false), 2000);
  } catch (e) {
    console.error(e);
  } finally {
    saving.value = false;
  }
}
</script>
