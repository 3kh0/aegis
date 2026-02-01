<template>
  <div class="max-w-lg mx-auto px-4 py-16">
    <div class="bg-surface border border-border p-8">
      <h1 class="text-2xl mb-6 font-semibold text-center">Sign In to Aegis</h1>
      <p class="text-gray-400 text-center mb-6">We sent a code to {{ email }}.</p>
      <form class="space-y-4 text-center" @submit.prevent="verify">
        <div>
          <input id="code" v-model="code" type="text" required maxlength="6" placeholder="000000" :disabled="busy" class="w-full px-4 py-3 font-mono bg-surface border border-border focus:outline-none focus:border-accent transition-colors text-center text-2xl tracking-widest disabled:opacity-50" />
        </div>

        <button type="submit" :disabled="busy || code.length !== 6" class="w-full py-3 bg-accent text-black disabled:opacity-75 disabled:cursor-not-allowed font-medium transition-transform active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 flex items-center justify-center gap-2 cursor-pointer">
          <Spinner v-if="busy" size="24px" />
          {{ busy ? "" : "Continue" }}
        </button>
        <NuxtLink to="/auth/login" class="text-gray-400 hover:text-white text-sm transition-colors">Wrong email?</NuxtLink>
      </form>

      <p v-if="err" class="mt-4 text-danger text-sm text-center">{{ err }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { user, fetch: fetchSession } = useUserSession();
const { busy, err, run } = useApi();

if (user.value) navigateTo("/dashboard");

const email = computed(() => (route.query.x as string) || "");
const code = ref((route.query.c as string) || "");
const token = computed(() => (route.query.t as string) || "");
const to = computed(() => (route.query.to as string) || "");

async function verify() {
  const body: Record<string, string> = token.value ? { token: token.value } : { email: email.value, code: code.value };

  const res = await run(() => $fetch<{ success: boolean; needsUsername: boolean }>("/api/auth/verify-otp", { method: "POST", body }));

  if (res) {
    await fetchSession();
    if (res.needsUsername) {
      const url = "/auth/welcome";
      navigateTo(to.value ? `${url}?to=${encodeURIComponent(to.value)}` : url);
    } else {
      navigateTo(to.value || "/dashboard");
    }
  }
}

onMounted(async () => {
  if (token.value && email.value && code.value) await verify();
});
</script>
