<template>
  <div>
    <NotProd />
    <div class="relative min-h-screen text-white flex flex-col">
      <BgRobin class="absolute inset-0 opacity-75 -z-10" />
      <nav class="border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50">
        <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <NuxtLink to="/" class="text-xl flex items-center gap-2 hover:scale-105 active:scale-[0.97] transition-transform group">
              <Icon name="tabler:meteor" class="w-6 h-6 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:translate-y-0.5 will-change-transform" />
              <span class="font-display font-bold">Aegis</span>
            </NuxtLink>
            <NuxtLink v-if="session?.user?.username" :to="`/@${session?.user?.username}`" class="hidden sm:flex text-gray-400 hover:text-white transition-colors items-center gap-2"> Hi, {{ session.user.username }}! </NuxtLink>
          </div>

          <!-- desktop -->
          <div class="hidden md:flex items-center gap-1">
            <template v-if="loggedIn">
              <NuxtLink to="/dashboard" class="auth-link">
                <Icon name="tabler:layout-grid" size="16px" />
                Dashboard
              </NuxtLink>
              <NuxtLink v-if="isGlobal" to="/admin" class="auth-link">
                <Icon name="tabler:hammer" size="16px" />
                Admin
              </NuxtLink>
              <button class="auth-link" @click="logout">
                <Icon name="tabler:arrow-left-from-arc" size="16px" />
                Logout
              </button>
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
                <NuxtLink v-if="isGlobal" to="/admin" class="mob-link text-gray-400" @click="mob = false">
                  <Icon name="tabler:hammer" size="18px" />
                  Admin
                </NuxtLink>

                <div class="border-t border-border my-2" />

                <NuxtLink :to="`/@${session?.user?.username}`" class="mob-link text-gray-400" @click="mob = false">
                  <Icon name="tabler:user" size="18px" />
                  Profile
                </NuxtLink>
                <button class="mob-link text-gray-400 w-full cursor-pointer" @click="logout">
                  <Icon name="tabler:arrow-left-from-arc" size="18px" />
                  Logout
                </button>
              </template>
              <NuxtLink v-else to="/auth/login" class="mob-link text-black bg-accent justify-center font-medium" @click="mob = false">
                Login
                <Icon name="tabler:arrow-right-to-arc" size="16px" />
              </NuxtLink>
            </div>
          </div>
        </Transition>
      </nav>
      <main class="flex-1 relative z-10">
        <slot />
      </main>
      <footer class="border border-border bg-surface/80 backdrop-blur-md fixed bottom-4 left-1/2 -translate-x-1/2 z-10 rounded-lg px-4 py-3">
        <div class="text-sm text-gray-400 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 lg:flex-nowrap">
          <a href="https://hackclub.com" target="_blank" class="hover:text-accent inline-flex items-center gap-1 transition whitespace-nowrap">
            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0C2.4 0 0 2.4 0 12s2.4 12 12 12s12-2.4 12-12S21.6 0 12 0m4.5 19.51h-3.31v-6.507c0-.975-.187-1.622-.834-1.622c-.712 0-1.575 1.003-1.575 2.625v5.503H7.5V4.97l3.29-.563v5.428c.713-.646 1.707-.928 2.72-.928c2.156 0 2.99 1.416 2.99 3.628z" /></svg>
            <span>Aegis by Hack Club</span>
          </a>
          <span class="hidden sm:inline">|</span>
          <a href="https://github.com/hackclub/aegis" target="_blank" class="hover:text-accent inline-flex items-center gap-1 transition whitespace-nowrap">
            <Icon name="tabler:brand-github" size="16px" />
            <span class="hidden sm:inline">hackclub/aegis</span>
          </a>
          <span class="hidden lg:inline">|</span>
          <NuxtLink to="/security" class="hover:text-accent inline-flex items-center gap-1 transition whitespace-nowrap">
            <Icon name="tabler:shield" size="16px" />
            <span class="hidden sm:inline">Security</span>
          </NuxtLink>
          <span class="hidden sm:inline">|</span>
          <NuxtLink to="/privacy" class="hover:text-accent inline-flex items-center gap-1 transition whitespace-nowrap">
            <Icon name="tabler:lock" size="16px" />
            <span class="hidden sm:inline">Privacy</span>
          </NuxtLink>
          <span class="hidden sm:inline">|</span>
          <NuxtLink to="/rules" class="hover:text-accent inline-flex items-center gap-1 transition whitespace-nowrap">
            <Icon name="tabler:file" size="16px" />
            <span class="hidden sm:inline">Rules</span>
          </NuxtLink>
          <span class="hidden sm:inline">|</span>
          <a href="https://hcb.hackclub.com/hack-club-security/transactions" target="_blank" class="hover:text-accent inline-flex items-center gap-1 transition whitespace-nowrap">
            <Icon name="tabler:building-bank" size="16px" />
            <span class="hidden sm:inline">Financials</span>
          </a>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
const { loggedIn, session, clear } = useUserSession();
const isGlobal = computed(() => session.value?.user?.role === "GLOBAL_ADMIN");
const mob = ref(false);

const route = useRoute();
watch(
  () => route.fullPath,
  () => {
    mob.value = false;
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

.auth-link {
  @apply text-gray-400 hover:text-white px-2.5 py-1.5 transition-colors flex items-center gap-2 cursor-pointer;
}
.mob-link {
  @apply flex items-center gap-3 px-3 py-3 hover:text-white hover:bg-surface-elevated transition-colors active:scale-[0.98] motion-reduce:active:scale-100;
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
  .slide-enter-active,
  .slide-leave-active,
  .spin-enter-active,
  .spin-leave-active {
    transition: none;
  }
}
</style>
