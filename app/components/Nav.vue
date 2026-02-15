<template>
  <nav class="border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
      <NuxtLink to="/" class="text-xl flex items-center gap-2 hover:scale-105 active:scale-[0.97] transition-transform group">
        <Icon name="tabler:meteor" class="w-6 h-6 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:translate-y-0.5 will-change-transform" />
        <span class="font-display font-bold">Aegis</span>
      </NuxtLink>

      <!--desk -->
      <div class="hidden md:flex items-center gap-1">
        <template v-if="loggedIn">
          <NuxtLink to="/dashboard" class="nav-link">
            <Icon name="tabler:layout-grid" size="16px" />
            Dashboard
          </NuxtLink>

          <div v-if="showPrograms" ref="ddRef" class="relative">
            <button class="nav-link" @click="dd = !dd">
              <Icon name="tabler:building" size="16px" />
              My Programs
              <Icon name="tabler:chevron-down" size="14px" class="transition-transform duration-200" :class="dd && 'rotate-180'" />
            </button>
            <Transition name="pop">
              <div v-if="dd" class="absolute right-0 top-full mt-2 w-56 bg-surface border border-border shadow-xl shadow-black/20 z-50 origin-top-right will-change-transform">
                <div v-if="!programs.length" class="p-4 text-gray-500 text-sm">No programs assigned</div>
                <NuxtLink v-for="p in programs" v-else :key="p.id" :to="`/admin/programs/${p.slug}`" class="dd-item" @click="dd = false">
                  <img v-if="p.iconUrl" :src="p.iconUrl" width="20" height="20" class="w-5 h-5 object-contain" />
                  <Icon v-else name="tabler:building" size="20px" class="text-gray-500 shrink-0" />
                  <span class="truncate">{{ p.title }}</span>
                </NuxtLink>
              </div>
            </Transition>
          </div>

          <NuxtLink v-if="isGlobal" to="/admin" class="nav-link">
            <Icon name="tabler:hammer" size="16px" />
            Admin
          </NuxtLink>

          <div class="w-px h-5 bg-border mx-1" />

          <div ref="userRef" class="relative">
            <button class="nav-link" @click="userDD = !userDD">
              <Icon name="tabler:user-circle" size="20px" />
              {{ session?.user?.username }}
              <Icon name="tabler:chevron-down" size="14px" class="transition-transform duration-200" :class="userDD && 'rotate-180'" />
            </button>
            <Transition name="pop">
              <div v-if="userDD" class="absolute right-0 top-full mt-2 w-48 bg-surface border border-border shadow-xl shadow-black/20 z-50 origin-top-right will-change-transform">
                <NuxtLink :to="`/@${session?.user?.username}`" class="dd-item" @click="userDD = false">
                  <Icon name="tabler:user" size="18px" class="text-gray-500" />
                  Profile
                </NuxtLink>
                <NuxtLink to="/settings" class="dd-item" @click="userDD = false">
                  <Icon name="tabler:settings" size="18px" class="text-gray-500" />
                  Settings
                </NuxtLink>
                <button class="dd-item w-full text-left cursor-pointer" @click="logout">
                  <Icon name="tabler:arrow-left-from-arc" size="18px" class="text-gray-500" />
                  Logout
                </button>
              </div>
            </Transition>
          </div>
        </template>
        <NuxtLink v-else to="/auth/login" class="px-3 py-1.5 bg-accent text-black font-medium transition-transform active:scale-[0.97] motion-reduce:active:scale-100 flex items-center gap-2">
          Login
          <Icon name="tabler:arrow-right-to-arc" size="16px" />
        </NuxtLink>
      </div>

      <!-- mobile -->
      <button class="md:hidden relative w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer" aria-label="Toggle menu" @click="mob = !mob">
        <Transition name="spin" mode="out-in">
          <Icon v-if="mob" key="x" name="tabler:x" size="24px" />
          <Icon v-else key="m" name="tabler:menu-2" size="24px" />
        </Transition>
      </button>
    </div>

    <Transition name="slide">
      <div v-if="mob" class="md:hidden border-t border-border bg-surface overflow-hidden">
        <div class="px-4 py-3 flex flex-col gap-0.5">
          <template v-if="loggedIn">
            <NuxtLink to="/dashboard" class="mob-link text-gray-400" @click="mob = false">
              <Icon name="tabler:layout-grid" size="18px" />
              Dashboard
            </NuxtLink>

            <template v-if="showPrograms">
              <button class="mob-link text-gray-400 w-full cursor-pointer" @click="mobSub = !mobSub">
                <Icon name="tabler:building" size="18px" />
                My Programs
                <Icon name="tabler:chevron-down" size="14px" class="ml-auto transition-transform duration-200" :class="mobSub && 'rotate-180'" />
              </button>
              <Transition name="fade">
                <div v-if="mobSub" class="pl-4 flex flex-col gap-0.5">
                  <div v-if="!programs.length" class="py-2 px-3 text-gray-500 text-sm">No programs assigned</div>
                  <NuxtLink v-for="p in programs" :key="p.id" :to="`/admin/programs/${p.slug}`" class="mob-link text-gray-400" @click="mob = false">
                    <img v-if="p.iconUrl" :src="p.iconUrl" width="20" height="20" class="w-5 h-5 object-contain" />
                    <Icon v-else name="tabler:building" size="18px" class="text-gray-500 shrink-0" />
                    <span class="truncate">{{ p.title }}</span>
                  </NuxtLink>
                </div>
              </Transition>
            </template>

            <NuxtLink v-if="isGlobal" to="/admin" class="mob-link text-gray-400" @click="mob = false">
              <Icon name="tabler:hammer" size="18px" />
              Admin
            </NuxtLink>

            <div class="border-t border-border my-2" />

            <NuxtLink :to="`/@${session?.user?.username}`" class="mob-link text-gray-400" @click="mob = false">
              <Icon name="tabler:user" size="18px" />
              Profile
            </NuxtLink>
            <NuxtLink to="/settings" class="mob-link text-gray-400" @click="mob = false">
              <Icon name="tabler:settings" size="18px" />
              Settings
            </NuxtLink>
            <button class="mob-link text-gray-400 w-full cursor-pointer" @click="logout">
              <Icon name="tabler:arrow-left-from-arc" size="18px" />
              Logout
            </button>
          </template>
          <NuxtLink v-else to="/auth/login" class="mob-link bg-accent text-black justify-center font-medium" @click="mob = false">
            Login
            <Icon name="tabler:arrow-right-to-arc" size="16px" />
          </NuxtLink>
        </div>
      </div>
    </Transition>
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

const dd = ref(false);
const ddRef = ref<HTMLElement | null>(null);
const userDD = ref(false);
const userRef = ref<HTMLElement | null>(null);
const mob = ref(false);
const mobSub = ref(false);

const { data: programs } = await useFetch<NavProgram[]>("/api/users/me/programs", { default: () => [] });
const showPrograms = computed(() => isGlobal.value || (programs.value?.length ?? 0) > 0);

function outside(e: MouseEvent) {
  const t = e.target as Node;
  if (ddRef.value && !ddRef.value.contains(t)) dd.value = false;
  if (userRef.value && !userRef.value.contains(t)) userDD.value = false;
}

onMounted(() => document.addEventListener("click", outside));
onUnmounted(() => document.removeEventListener("click", outside));

const route = useRoute();
watch(
  () => route.fullPath,
  () => {
    mob.value = false;
    mobSub.value = false;
  },
);

async function logout() {
  await clear();
  mob.value = false;
  navigateTo("/");
}
</script>

<style scoped>
@reference "@/css/main.css";

.nav-link {
  @apply text-gray-400 hover:text-white px-2.5 py-1.5 transition-colors flex items-center gap-2 cursor-pointer;
}
.dd-item {
  @apply flex items-center h-11 gap-3 px-4 hover:bg-surface-elevated transition-colors;
}
.mob-link {
  @apply flex items-center gap-3 px-3 py-3 hover:text-white hover:bg-surface-elevated transition-colors active:scale-[0.98] motion-reduce:active:scale-100;
}

.pop-enter-active {
  transition:
    opacity 150ms cubic-bezier(0.215, 0.61, 0.355, 1),
    transform 150ms cubic-bezier(0.215, 0.61, 0.355, 1);
}
.pop-leave-active {
  transition:
    opacity 120ms cubic-bezier(0.215, 0.61, 0.355, 1),
    transform 120ms cubic-bezier(0.215, 0.61, 0.355, 1);
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.97) translateY(-4px);
}

.slide-enter-active {
  transition:
    opacity 200ms cubic-bezier(0.215, 0.61, 0.355, 1),
    max-height 200ms cubic-bezier(0.215, 0.61, 0.355, 1);
  max-height: 500px;
}
.slide-leave-active {
  transition:
    opacity 150ms cubic-bezier(0.215, 0.61, 0.355, 1),
    max-height 150ms cubic-bezier(0.215, 0.61, 0.355, 1);
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
}

.fade-enter-active {
  transition: opacity 150ms cubic-bezier(0.215, 0.61, 0.355, 1);
}
.fade-leave-active {
  transition: opacity 120ms cubic-bezier(0.215, 0.61, 0.355, 1);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.spin-enter-active,
.spin-leave-active {
  transition:
    opacity 100ms ease,
    transform 100ms ease;
}
.spin-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.8);
}
.spin-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.8);
}

@media (prefers-reduced-motion: reduce) {
  .pop-enter-active,
  .pop-leave-active,
  .slide-enter-active,
  .slide-leave-active,
  .fade-enter-active,
  .fade-leave-active,
  .spin-enter-active,
  .spin-leave-active {
    transition: none;
  }
}
</style>
