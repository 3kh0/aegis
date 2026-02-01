<template>
  <div class="min-h-screen flex flex-col lg:flex-row">
    <aside class="lg:w-96 xl:w-md lg:h-screen lg:sticky lg:top-0 border-b lg:border-b-0 lg:border-r border-border bg-surface p-6 lg:overflow-y-auto">
      <div class="flex items-start gap-4 mb-6 pb-6 border-b border-border">
        <div class="w-12 h-12 shrink-0 bg-surface-elevated flex items-center justify-center rounded-lg">
          <Icon name="tabler:help-hexagon" size="28px" class="text-accent" />
        </div>
        <div>
          <h2 class="text-lg font-semibold font-display">Other / Unlisted Program</h2>
          <p class="text-gray-400 text-sm mt-1">Report vulnerabilities not matching listed programs</p>
        </div>
      </div>

      <div class="space-y-4 text-sm text-gray-400">
        <h3 class="font-medium text-white mb-2 flex items-center gap-2">
          <Icon name="tabler:info-triangle" size="18" />
          A few things to keep in mind
        </h3>
        <ul class="space-y-2 list-disc list-inside">
          <li><strong>This form is only for programs that are not listed on our platform.</strong> If you are unsure, please check <NuxtLink to="/programs" class="underline">our list of programs</NuxtLink>.</li>
          <li><strong>Details are extremely important!</strong> Please be as detailed as possible in the program/asset affected and the vulnerability details.</li>
          <li><strong>You are in the wild west!</strong> This means there is no guarantee of a payout, however, we will do our best to help you.</li>
          <li><strong>Respect the rules!</strong> You are held to our <NuxtLink to="/rules" class="underline">Rules of Engagement</NuxtLink> when submitting this report.</li>
        </ul>
      </div>
    </aside>

    <main class="flex-1 px-4 lg:px-8 py-8 max-w-4xl mx-auto w-full">
      <NuxtLink to="/programs" class="text-gray-400 hover:text-white transition-colors flex items-center gap-1 mb-6">
        <Icon name="tabler:arrow-left" size="18px" />
        Back to programs
      </NuxtLink>

      <div v-if="block?.blocked" class="p-4 mb-6 bg-danger/25 border border-danger text-danger">
        <p class="font-medium">You are currently blocked from submitting reports. Please review our <NuxtLink to="/rules" class="underline">rules</NuxtLink> to prevent this from happening again. You will be able to submit new reports once your block expires.</p>
        <p class="text-sm mt-1">Block expires on {{ new Date(block.blockedUntil).toLocaleDateString() }} — Reason: {{ block.reason }}</p>
      </div>

      <div v-if="!block?.blocked" class="mb-8">
        <h1 class="text-2xl font-bold">Report to Unlisted Program</h1>
        <p class="text-gray-400 mt-1">Submit a vulnerability for a program not on our platform</p>
      </div>

      <ReportForm v-if="!block?.blocked" is-unlisted @submitted="submit" />
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const { data: block } = await useFetch<{ blocked: boolean; blockedUntil: string; reason: string }>("/api/me/block");

useHead({
  title: "Report to Unlisted Program",
});

function submit(r: { id: string }) {
  navigateTo(`/reports/${r.id}`);
}
</script>
