<template>
  <section v-if="leaders?.length" class="mt-8">
    <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
      <Icon name="tabler:trophy" size="24" class="text-accent" />
      Top Hackers
    </h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <LeaderCard v-for="l in leaders" :key="l.rank" :rank="l.rank" :username="l.username" :count="l.count" :verified="l.verified" />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ leaders: { rank: number; username: string; count: number; verified?: boolean }[] }>();
</script>
