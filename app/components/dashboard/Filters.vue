<template>
  <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
    <div class="flex border border-border overflow-x-auto scrollbar-hidden">
      <button v-for="s in statuses" :key="s.value" :class="['px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap', status === s.value ? 'bg-accent text-black' : 'text-gray-400 hover:text-white']" @click="emit('status', s.value)">
        {{ s.label }}
      </button>
    </div>

    <select v-model="sev" class="px-3 py-2 h-9 bg-transparent border border-border text-white focus:outline-none focus:border-accent" @change="emit('severity', sev)">
      <option value="">All Severities</option>
      <option v-for="sv in severities" :key="sv" :value="sv">{{ sv }}</option>
    </select>

    <select v-if="programs?.length" v-model="prog" class="px-3 py-2 h-9 bg-transparent border border-border text-sm text-white focus:outline-none focus:border-accent" @change="emit('program', prog)">
      <option value="">All Programs</option>
      <option v-for="p in programs" :key="p.id" :value="p.id">{{ p.title }}</option>
    </select>
  </div>
  <div class="relative flex-1 mt-4 h-9">
    <Icon name="tabler:search" size="18px" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
    <input :value="q" type="text" placeholder="Search reports..." class="w-full pl-10 pr-4 h-9 bg-transparent border border-border text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors" @input="emit('search', ($event.target as HTMLInputElement).value)" />
  </div>
</template>

<script setup lang="ts">
interface Program {
  id: string;
  title: string;
}

const props = defineProps<{
  status?: string;
  severity?: string;
  program?: string;
  programs?: Program[];
  q?: string;
}>();

const emit = defineEmits<{
  status: [v: string];
  severity: [v: string];
  program: [v: string];
  search: [v: string];
}>();

const sev = ref(props.severity || "");
const prog = ref(props.program || "");

const statuses = [
  { value: "", label: "All" },
  { value: "NEW", label: "New" },
  { value: "TRIAGED", label: "Triaged" },
  { value: "NEEDS_MORE_INFO", label: "Needs Info" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "INFORMATIVE", label: "Informative" },
  { value: "DUPLICATE", label: "Duplicate" },
  { value: "SPAM", label: "Spam" },
];

const severities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
</script>
