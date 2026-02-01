<template>
  <div class="min-h-screen bg-black text-white flex flex-col">
    <Nav />
    <main class="flex-1 flex items-center justify-center p-4">
      <div class="text-center max-w-md">
        <h1 class="font-display text-8xl font-bold text-accent mb-4">
          {{ error?.statusCode || 500 }}
        </h1>
        <p class="text-xl mb-2">
          {{ title }}
        </p>
        <p v-if="isDev && error?.message" class="text-sm text-gray-400 font-mono mb-8 wrap-break-word">
          {{ error.message }}
        </p>
        <div v-else class="mb-8" />
        <div class="flex gap-3 justify-center">
          <button class="px-3 py-1.5 bg-accent text-black font-medium transition-colors text-sm sm:text-base cursor-pointer" @click="handleError">Go Home</button>
          <button class="px-3 py-1.5 bg-surface-elevated border border-border text-accent font-medium hover:bg-border transition-colors cursor-pointer" @click="reload">Try Again</button>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app";
import * as Sentry from "@sentry/nuxt";

const props = defineProps<{ error: NuxtError }>();
const isDev = import.meta.dev;

if (props.error?.statusCode === 500) {
  const err = new Error(props.error.message || "Internal Server Error");
  err.name = props.error.statusMessage || "ServerError";
  Sentry.captureException(err, {
    extra: {
      statusCode: props.error.statusCode,
      url: props.error.url,
      stack: props.error.stack,
    },
  });
}

const title = computed(() => {
  const code = props.error?.statusCode;
  if (code === 404) return "Page not found";
  if (code === 403) return "Access denied";
  if (code === 401) return "Unauthorized";
  if (code === 500) return "Internal server error";
  return props.error?.statusMessage || "Something went wrong";
});

const handleError = () => clearError({ redirect: "/" });
const reload = () => window.location.reload();
</script>
