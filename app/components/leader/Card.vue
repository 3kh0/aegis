<template>
  <NuxtLink :to="`/@${username}`" class="group block border border-border bg-surface p-4 transition-all hover:border-accent/50 hover:bg-surface-elevated" :class="top3Cls">
    <div class="flex items-center gap-3">
      <div class="relative shrink-0">
        <div class="w-10 h-10 flex items-center justify-center font-bold text-lg" :class="rankCls">
          {{ rank }}
        </div>
        <Icon v-if="rank === 1" name="tabler:trophy-filled" size="14" class="absolute -top-1 -right-1 text-yellow-400" />
      </div>
      <div class="min-w-0 flex-1">
        <div class="font-medium text-white group-hover:text-accent transition-colors flex items-center gap-1">@{{ username }}<Icon v-if="verified" name="tabler:discount-check-filled" size="16" class="text-accent" title="This user has proven to submit high quality reports" /></div>
        <div class="text-sm text-gray-400">{{ count }} valid {{ count === 1 ? "report" : "reports" }}</div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const p = defineProps<{
  rank: number;
  username: string;
  count: number;
  verified?: boolean;
}>();

const rankCls = computed(() => {
  if (p.rank === 1) return "bg-yellow-500/20 text-yellow-400";
  if (p.rank === 2) return "bg-gray-400/20 text-gray-300";
  if (p.rank === 3) return "bg-amber-600/20 text-amber-500";
  return "bg-zinc-800 text-gray-400";
});

const top3Cls = computed(() => {
  if (p.rank === 1) return "ring-1 ring-yellow-500/30";
  if (p.rank === 2) return "ring-1 ring-gray-400/30";
  if (p.rank === 3) return "ring-1 ring-amber-600/30";
  return "";
});
</script>
