<template>
  <nav class="border-b border-border bg-surface">
    <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <NuxtLink to="/" class="text-xl flex items-center gap-2 hover:scale-105 transition-transform group">
          <Icon name="tabler:meteor" class="w-6 h-6 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:translate-y-0.5" />
          <span class="font-display font-bold">Aegis</span>
        </NuxtLink>
      </div>
      <div class="flex items-center gap-4">
        <template v-if="loggedIn">
          <NuxtLink to="/dashboard" class="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
            <Icon name="tabler:layout-grid" size="16px" />
            Dashboard
          </NuxtLink>
          <div v-if="showPrograms" ref="dropdown" class="relative">
            <button class="text-gray-400 hover:text-white transition-colors flex items-center gap-2" @click="open = !open">
              <Icon name="tabler:building" size="16px" />
              My Programs
              <Icon :name="open ? 'tabler:chevron-up' : 'tabler:chevron-down'" size="14px" />
            </button>
            <div v-if="open" class="absolute right-0 top-full mt-2 w-56 bg-surface border border-border shadow-lg z-50">
              <div v-if="!programs.length" class="p-4 text-gray-500 text-sm">No programs assigned</div>
              <template v-else>
                <NuxtLink v-for="p in programs" :key="p.id" :to="`/admin/programs/${p.slug}`" class="flex items-center h-12 gap-3 px-4 py-3 hover:bg-surface-elevated transition-colors" @click="open = false">
                  <img v-if="p.iconUrl" :src="p.iconUrl" class="w-5 h-5 object-contain" />
                  <Icon v-else name="tabler:building" size="20px" class="text-gray-500" />
                  <span class="truncate">{{ p.title }}</span>
                </NuxtLink>
              </template>
            </div>
          </div>
          <NuxtLink v-if="isGlobal" to="/admin" class="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
            <Icon name="tabler:hammer" size="16px" />
            Admin
          </NuxtLink>
          <div ref="userDropdown" class="relative">
            <button class="text-gray-400 hover:text-white transition-colors flex items-center gap-2" @click="userOpen = !userOpen">
              <Icon name="tabler:user-circle" size="20px" />
              {{ session?.user?.username }}
              <Icon :name="userOpen ? 'tabler:chevron-up' : 'tabler:chevron-down'" size="14px" />
            </button>
            <div v-if="userOpen" class="absolute right-0 top-full mt-2 w-48 bg-surface border border-border shadow-lg z-50">
              <NuxtLink :to="`/@${session?.user?.username}`" class="flex items-center h-12 gap-3 px-4 py-3 hover:bg-surface-elevated transition-colors" @click="userOpen = false">
                <Icon name="tabler:user" size="20px" class="h-5 w-5 text-gray-500" />
                Profile
              </NuxtLink>
              <NuxtLink to="/settings" class="flex items-center h-12 gap-3 px-4 py-3 hover:bg-surface-elevated transition-colors" @click="userOpen = false">
                <Icon name="tabler:settings" size="20px" class="h-5 w-5 text-gray-500" />
                Settings
              </NuxtLink>
              <button class="w-full flex items-center h-12 gap-3 px-4 py-3 hover:bg-surface-elevated transition-colors text-left cursor-pointer" @click="logout">
                <Icon name="tabler:arrow-left-from-arc" size="20px" class="h-5 w-5 text-gray-500" />
                Logout
              </button>
            </div>
          </div>
        </template>
        <template v-else>
          <NuxtLink to="/auth/login" class="px-2 py-0.5 bg-accent text-black transition-transform active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 flex items-center gap-2">
            Login
            <Icon name="tabler:arrow-right-to-arc" size="16px" />
          </NuxtLink>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
interface NavProgram {
  id: string;
  title: string;
  slug: string;
  iconUrl: string | null;
}

const { loggedIn, session, clear } = useUserSession();

const role = computed(() => session.value?.user?.role);
const isGlobal = computed(() => role.value === "GLOBAL_ADMIN");

const open = ref(false);
const dropdown = ref<HTMLElement | null>(null);
const userOpen = ref(false);
const userDropdown = ref<HTMLElement | null>(null);

const { data: programs } = await useFetch<NavProgram[]>("/api/users/me/programs", {
  default: () => [],
});
const showPrograms = computed(() => isGlobal.value || (programs.value?.length ?? 0) > 0);

async function logout() {
  await clear();
  navigateTo("/");
}
</script>
