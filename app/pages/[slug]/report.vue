<template>
  <div class="min-h-screen flex flex-col lg:flex-row">
    <Loading v-if="status === 'pending'" class="flex-1" />

    <Empty v-else-if="error" icon="tabler:alert-triangle" class="flex-1 flex items-center justify-center">
      Program not found
      <template #action>
        <NuxtLink to="/programs" class="text-accent hover:underline">Back to programs</NuxtLink>
      </template>
    </Empty>

    <template v-else-if="data">
      <aside class="lg:w-96 xl:w-md lg:h-screen lg:sticky lg:top-0 border-b lg:border-b-0 lg:border-r border-border bg-surface">
        <div class="lg:hidden p-4 border-b border-border">
          <button type="button" class="flex items-center justify-between w-full text-left" @click="showPolicy = !showPolicy">
            <span class="font-medium">{{ showPolicy ? "Hide" : "Show" }} Program Policy</span>
            <Icon :name="showPolicy ? 'tabler:chevron-up' : 'tabler:chevron-down'" size="20px" />
          </button>
        </div>
        <div :class="{ hidden: !showPolicy, 'lg:block': true }" class="max-h-96 lg:max-h-none overflow-y-auto lg:h-full">
          <ReportPolicySidebar :program="data" />
        </div>
      </aside>

      <main class="flex-1 px-4 lg:px-8 py-8 max-w-4xl mx-auto w-full">
        <div v-if="block?.blocked" class="p-4 mb-6 bg-danger/25 border border-danger text-danger">
          <p class="font-medium">You are currently blocked from submitting reports. Please review our <NuxtLink to="/rules" class="underline">rules</NuxtLink> to prevent this from happening again. You will be able to submit new reports once your block expires.</p>
          <p class="text-sm mt-1">Block expires on {{ new Date(block.blockedUntil).toLocaleDateString() }} — Reason: {{ block.reason }}</p>
        </div>

        <div v-if="!block?.blocked" class="mb-8">
          <h1 class="text-2xl font-bold">Submit Vulnerability Report</h1>
          <p class="text-gray-400 mt-1">You're about to submit a report to {{ data.title }}. Provide as much information as possible about the potential issue you have discovered. The more information you provide, the quicker {{ data.title }} will be able to validate the issue.</p>
        </div>

        <ReportForm v-if="!block?.blocked" :program-id="data.id" @submitted="onSubmit" />
      </main>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const route = useRoute();
const slug = route.params.slug as string;

const showPolicy = ref(true);

const { data, status, error } = await useFetch(`/api/programs/${slug}`);
const { data: block } = await useFetch<{ blocked: boolean; blockedUntil: string; reason: string }>("/api/me/block");

useHead({
  title: computed(() => (data.value ? `Report to ${data.value.title}` : "Report Vulnerability")),
});

function onSubmit(report: { id: string }) {
  navigateTo(`/reports/${report.id}`);
}
</script>
