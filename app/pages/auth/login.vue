<template>
  <div class="max-w-lg mx-auto px-4 py-16">
    <div class="bg-surface border border-border p-8">
      <h1 class="text-2xl mb-6 font-semibold text-center">Welcome to Aegis</h1>
      <p class="text-gray-400 text-center mb-6">Let's get you started</p>
      <form class="space-y-6" @submit.prevent="sendOtp">
        <div class="relative">
          <input id="email" v-model="email" type="email" required :disabled="busy" placeholder="Enter your email to receive a code" class="w-full px-4 py-3 pr-14 bg-surface border border-border focus:outline-none focus:border-accent transition-colors disabled:opacity-50 cursor-poi" />
          <button type="submit" :disabled="busy" class="absolute right-0 top-0 bottom-0 px-4 bg-accent text-black cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed transition-transform active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 flex items-center justify-center" aria-label="Submit email">
            <Spinner v-if="busy" size="20px" />
            <Icon v-else name="tabler:arrow-right" size="20px" />
          </button>
        </div>
      </form>

      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-border" />
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-surface-elevated text-gray-400">or</span>
        </div>
      </div>

      <button :disabled="hcBusy" class="w-full py-3 bg-[#ec3750] text-white font-semibold transition-transform active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 flex items-center justify-center gap-2 cursor-pointer hover:bg-[#d63147] disabled:opacity-75 disabled:cursor-not-allowed" @click="hcAuth">
        <Spinner v-if="hcBusy" size="20" class="animate-spin" />
        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0C2.4 0 0 2.4 0 12s2.4 12 12 12s12-2.4 12-12S21.6 0 12 0m4.5 19.51h-3.31v-6.507c0-.975-.187-1.622-.834-1.622c-.712 0-1.575 1.003-1.575 2.625v5.503H7.5V4.97l3.29-.563v5.428c.713-.646 1.707-.928 2.72-.928c2.156 0 2.99 1.416 2.99 3.628z" /></svg>
        Sign in with Hack Club Account
      </button>

      <p class="text-gray-400 text-sm text-center mt-4">By continuing, you agree to our <NuxtLink to="/privacy" class="underline">Privacy Policy</NuxtLink>.</p>

      <p v-if="err" class="mt-4 text-danger text-sm text-center">{{ err }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user } = useUserSession();
if (user.value) navigateTo("/dashboard");

const { busy, err, run } = useApi();

const email = ref("");
const hcBusy = ref(false);

async function sendOtp() {
  const route = useRoute();
  const res = await run(() =>
    $fetch("/api/auth/send-otp", {
      method: "POST",
      body: { email: email.value },
    }),
  );
  if (res) {
    const url = `/auth/verify?x=${encodeURIComponent(email.value)}`;
    const to = route.query.to;
    if (to) {
      navigateTo(`${url}&to=${encodeURIComponent(to as string)}`);
    } else {
      navigateTo(url);
    }
  }
}

function hcAuth() {
  const route = useRoute();
  hcBusy.value = true;
  let url = "/api/auth/hackclub";
  const to = route.query.to;
  if (to) {
    url += `?to=${encodeURIComponent(to as string)}`;
  }
  window.location.href = url;
}
</script>
