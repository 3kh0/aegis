<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <label class="block text-sm font-medium text-gray-400">Attachments</label>
      <span v-if="files.length" class="text-xs text-gray-500">{{ files.length }} file{{ files.length > 1 ? "s" : "" }} · {{ fmtSize(total) }}</span>
    </div>
    <p class="text-xs text-gray-500">Screenshots, videos, or PoC files (max 10MB each)</p>

    <div class="border-2 border-dashed border-border hover:border-accent/25 transition-colors p-6 text-center cursor-pointer" :class="{ 'border-accent bg-accent/5': drag }" @click="$refs.inp.click()" @dragover.prevent="drag = true" @dragleave.prevent="drag = false" @drop.prevent="drop">
      <input ref="inp" type="file" multiple :accept="ACCEPT" class="hidden" @change="sel" />
      <Icon name="tabler:upload" size="32px" class="text-gray-500 mx-auto mb-2" />
      <p class="text-gray-400 text-sm">Drop files here or click to upload</p>
    </div>

    <div v-if="busy" class="flex items-center gap-3 border border-border p-3">
      <div class="w-12 h-12 shrink-0 flex items-center justify-center bg-surface">
        <Spinner size="24px" class="text-gray-300" />
      </div>
      <p class="text-sm text-gray-300 truncate animate-pulse">Uploading...</p>
    </div>

    <div v-if="err" class="text-danger text-sm">{{ err }}</div>

    <div v-if="files.length" class="space-y-2">
      <div v-for="(f, i) in files" :key="f.url" class="flex items-center gap-3 border border-border p-3">
        <div class="w-12 h-12 shrink-0 flex items-center justify-center overflow-hidden bg-surface">
          <img v-if="isImg(f.url)" :src="f.url" class="w-full h-full object-cover" />
          <video v-else-if="isVid(f.url)" :src="f.url" class="w-full h-full object-cover" muted autoplay loop />
          <Icon v-else :name="icon(f.url)" size="24px" class="text-gray-500" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-300 truncate">{{ f.name }}</p>
          <p class="text-xs text-gray-500">{{ fmtSize(f.size) }}</p>
        </div>
        <button type="button" class="text-gray-500 hover:text-danger transition-colors shrink-0 cursor-pointer" @click="del(i)">
          <Icon name="tabler:x" size="18px" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ACCEPT, MAX_SIZE, isImg, isVid, fmtSize, icon } from "~~/shared/fileTypes";

interface File {
  url: string;
  name: string;
  size: number;
}

const props = defineProps<{ modelValue: File[] }>();
const emit = defineEmits<{ "update:modelValue": [File[]] }>();

const files = computed({ get: () => props.modelValue, set: (v) => emit("update:modelValue", v) });
const total = computed(() => files.value.reduce((s, f) => s + f.size, 0));

const drag = ref(false);
const busy = ref(false);
const err = ref("");

const sel = (e: Event) => {
  const t = e.target as HTMLInputElement;
  if (t.files) up(Array.from(t.files));
  t.value = "";
};

const drop = (e: DragEvent) => {
  drag.value = false;
  if (e.dataTransfer?.files) up(Array.from(e.dataTransfer.files));
};

async function up(list: globalThis.File[]) {
  if (!list.length) return;
  busy.value = true;
  err.value = "";

  try {
    const added: File[] = [];
    for (const f of list) {
      if (f.size > MAX_SIZE) {
        err.value = `File ${f.name} exceeds 10MB limit`;
        continue;
      }
      const fd = new FormData();
      fd.append("file", f);
      const res = await $fetch<{ url: string }>("/api/upload", { method: "POST", body: fd });
      added.push({ url: res.url, name: f.name, size: f.size });
    }
    files.value = [...files.value, ...added];
  } catch (e: unknown) {
    const x = e as { data?: { message?: string }; message?: string };
    err.value = x.data?.message || x.message || "Upload failed";
  } finally {
    busy.value = false;
  }
}

async function del(i: number) {
  const f = files.value[i];
  try {
    await $fetch("/api/upload", { method: "DELETE", body: { key: f.url } });
  } catch {
    /* ignore delete fails */
  }
  files.value = files.value.filter((_, x) => x !== i);
}
</script>
