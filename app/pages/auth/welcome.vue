<template>
  <div class="max-w-lg mx-auto px-4 py-16">
    <div class="bg-surface border border-border p-8">
      <h1 class="text-2xl mb-6 font-bold text-center">Welcome to Aegis</h1>
      <p class="text-gray-400 text-center mb-6">Let's get you started</p>

      <form class="space-y-6" @submit.prevent="submit">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-400 mb-2">Choose a Username</label>
          <input id="username" v-model="name" type="text" required minlength="3" maxlength="20" pattern="[a-zA-Z0-9_]+" placeholder="your_username" :disabled="busy" class="w-full px-4 py-3 text-gray-400 bg-surface border border-border focus:outline-none focus:border-accent transition-colors disabled:opacity-50" />
          <p class="mt-1 text-xs text-gray-400">3-20 characters, letters, numbers, and underscores only</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">Our lawyers have asked us to make you agree to the following documents:</label>
          <ul class="list-disc list-inside text-sm ml-2">
            <li><a href="/rules" target="_blank" class="text-accent underline">Rules of Engagement</a></li>
            <li><a href="/privacy" target="_blank" class="text-accent underline">Privacy Policy</a></li>
          </ul>
        </div>

        <div class="flex items-center gap-3 cursor-pointer select-none" @click="!busy && (ok = !ok)">
          <div class="flex items-center justify-center w-6 h-6 border-2 transition-all" :class="ok ? 'bg-white border-accent' : 'bg-black border-border'">
            <Icon v-if="ok" name="tabler:check" class="w-4 h-4 text-black" />
          </div>
          <label for="agree" class="text-sm cursor-pointer" :class="ok ? 'text-white font-semibold' : 'text-gray-400'">I have read and agree to the rules and privacy policy</label>
        </div>

        <button type="submit" :disabled="busy || name.length < 3 || !ok" class="w-full py-3 bg-accent text-black disabled:opacity-75 disabled:cursor-not-allowed font-medium transition-transform active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 flex items-center justify-center gap-2 cursor-pointer">
          <Spinner v-if="busy" size="24px" />
          {{ busy ? "" : "Get Started" }}
        </button>
      </form>

      <p v-if="err" class="mt-4 text-danger text-sm text-center">{{ err }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const { user, fetch: refresh } = useUserSession();
const { busy, err, run } = useApi();

if (user.value?.username) navigateTo("/dashboard");

const route = useRoute();
const name = ref("");
const ok = ref(false);

async function submit() {
  const res = await run(() =>
    $fetch("/api/auth/set-username", {
      method: "POST",
      body: { username: name.value },
    }),
  );
  if (res) {
    await refresh();
    const to = route.query.to as string;
    navigateTo(to || "/dashboard");
  }
}
</script>
