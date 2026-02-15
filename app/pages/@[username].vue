<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <Loading v-if="!deleted && status === 'pending'" />

    <template v-if="deleted">
      <ProfileHeader username="deleted" joined="January 1970" description="This user has been deleted and their profile is no longer available." class="mb-8" />
    </template>

    <template v-else-if="data">
      <ProfileHeader :username="data.user.username!" :verified="data.user.verified" :joined="joined" :description="data.user.description" :website="data.user.website" :github="data.user.github" :public-email="data.user.publicEmail" :own="own" :edit="edit" class="mb-8" @edit="edit = true" @cancel="edit = false" @saved="onSaved" />

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <ProfileStat :value="data.stats.total" label="Reports Submitted" icon="tabler:send" color="text-accent" />
        <ProfileStat :value="data.stats.resolved" label="Reports Resolved" icon="tabler:circle-check" color="text-green-400" />
        <ProfileStat :value="data.stats.programCount" label="Programs Targeted" icon="tabler:target-arrow" color="text-purple-400" />
      </div>

      <div v-if="data.programs.length">
        <div class="flex items-center justify-between text-sm text-gray-400 mb-3 px-2">
          <span>Program</span>
          <span>Valid / Closed</span>
        </div>

        <div class="border border-border divide-y divide-border cursor-pointer">
          <NuxtLink v-for="p in data.programs" :key="p.slug" :to="`/${p.slug}`" class="group flex items-center justify-between p-4 hover:bg-zinc-900/50 transition-colors cursor-pointer">
            <div class="flex items-center gap-3 cursor-pointer">
              <div class="w-10 h-10 flex items-center justify-center overflow-hidden shrink-0">
                <img v-if="p.icon" :src="p.icon" :alt="p.title" class="w-full h-full object-cover" />
                <Icon v-else name="tabler:cube" size="32px" class="text-white" />
              </div>
              <span class="font-medium group-hover:underline">{{ p.title }}</span>
            </div>
            <div class="text-lg font-display">
              <span class="text-white font-bold">{{ p.valid }}</span>
              <span class="text-gray-500">/{{ p.total }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const deleted = computed(() => route.params.username === "[deleted]");
const username = route.params.username as string;
const { user } = useUserSession();

const { data, status } = deleted.value ? { data: ref(null), status: ref("success" as const) } : await useFetch(`/api/users/${username}`);

if (!deleted.value && (status.value === "error" || !data.value)) {
  throw createError({ statusCode: 404, statusMessage: "User not found" });
}

const own = computed(() => user.value?.username === username);
const edit = ref(false);

const joined = computed(() => {
  if (!data.value?.user.createdAt) return "";
  return new Date(data.value.user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
});

function onSaved(d: { description?: string; website?: string; github?: string; publicEmail?: string }) {
  if (data.value) {
    data.value.user.description = d.description || null;
    data.value.user.website = d.website || null;
    data.value.user.github = d.github || null;
    data.value.user.publicEmail = d.publicEmail || null;
  }
  edit.value = false;
}

useHead({
  title: computed(() => (data.value ? `@${data.value.user.username}` : "Profile")),
  meta: [
    {
      name: "description",
      content: computed(() => data.value?.user.description || `Profile of @${username}`),
    },
  ],
});
</script>

<style scoped>
.animate-fade-in {
  animation: fade-in 0.4s ease-out both;
}
.delay-100 {
  animation-delay: 0.1s;
}
.delay-200 {
  animation-delay: 0.2s;
}
.delay-300 {
  animation-delay: 0.3s;
}
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
