<template>
  <div class="min-h-[calc(100vh-144px)] flex items-center justify-center px-4">
    <div class="max-w-6xl w-full mx-auto py-16">
      <div class="text-center mb-16 max-w-2xl mx-auto">
        <img src="~/assets/hcb.webp" alt="HCB" class="w-32 h-32 mb-8 mx-auto drop-shadow-[0_0_4px_#ffced2]" />
        <h1 class="text-5xl font-bold mb-6">Security at HCB</h1>
        <p class="text-xl text-gray-400 mb-8">Found a bug in HCB? Great! Unfortunately, Aegis does not triage HCB's security issues. Please report them directly to HCB's security team.</p>
        <a href="https://hcb.hackclub.com/security" target="_blank" class="inline-flex items-center px-6 py-3 bg-accent text-black font-medium transition-colors">
          <Icon name="tabler:external-link" size="16" class="mr-2" />
          hcb.hackclub.com/security
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: "Security at HCB",
  meta: [
    {
      name: "description",
      content: "Security at HCB",
    },
  ],
});
</script>
