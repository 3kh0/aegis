<template>
  <NuxtErrorBoundary @error="onError">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </NuxtErrorBoundary>
</template>
<script setup lang="ts">
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const router = useRouter();
const { loggedIn, fetch: fetchSession } = useUserSession();

const onError = (err: unknown) => {
  showError(err as Error);
};

router.beforeEach(() => {
  NProgress.start();
});

router.afterEach(() => {
  NProgress.done();
});

onMounted(async () => {
  if (!loggedIn.value) return;

  const l = localStorage.getItem("aegis-session");
  const e = !l || Date.now() - Number(l) > 24 * 60 * 60 * 1000;

  if (e) {
    const w = loggedIn.value;
    await fetchSession();
    if (w && loggedIn.value) {
      localStorage.setItem("aegis-session", String(Date.now()));
    }
  }
});
</script>
