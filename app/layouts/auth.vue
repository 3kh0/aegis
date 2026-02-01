<template>
  <div>
    <NotProd />
    <div class="relative min-h-screen text-white flex flex-col">
      <BgRobin class="absolute inset-0 opacity-75 -z-10" />
      <nav class="border-b border-border bg-surface relative z-10">
        <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <NuxtLink to="/" class="text-xl flex items-center gap-2 hover:scale-105 transition-transform group">
              <Icon name="tabler:meteor" class="w-6 h-6 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:translate-y-0.5" />
              <span class="font-display font-bold">Aegis</span>
            </NuxtLink>
            <NuxtLink v-if="session?.user?.username" :to="`/@${session?.user?.username}`" class="text-gray-400 hover:text-white transition-colors flex items-center gap-2"> Hi, {{ session.user.username }}! </NuxtLink>
          </div>
          <div class="flex items-center gap-4">
            <template v-if="loggedIn">
              <NuxtLink to="/dashboard" class="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                <Icon name="tabler:layout-grid" size="16px" />
                Dashboard
              </NuxtLink>
              <button class="text-gray-400 hover:text-white transition-colors flex items-center gap-2 cursor-pointer" @click="logout">
                <Icon name="tabler:arrow-left-from-arc" size="16px" />
                Logout
              </button>
              <NuxtLink v-if="isAdmin" to="/admin" class="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                <Icon name="tabler:hammer" size="16px" />
                Admin
              </NuxtLink>
            </template>
            <template v-else>
              <NuxtLink to="/auth/login" class="px-2 py-0.5 bg-accent text-black transition-colors flex items-center gap-2">
                Login
                <Icon name="tabler:arrow-right-to-arc" size="16px" />
              </NuxtLink>
            </template>
          </div>
        </div>
      </nav>
      <main class="flex-1 relative z-10">
        <slot />
      </main>
      <footer class="border border-border bg-surface fixed bottom-4 left-1/2 -translate-x-1/2 z-10 rounded-lg px-4 py-3">
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

<script setup>
const { loggedIn, session, clear } = useUserSession();

const isAdmin = computed(() => {
  const role = session.value?.user?.role;
  return role === "ADMIN" || role === "SUPER_ADMIN";
});

async function logout() {
  await clear();
  navigateTo("/");
}
</script>
