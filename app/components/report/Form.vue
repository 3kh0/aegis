<template>
  <form class="space-y-8" @submit.prevent="onSubmit">
    <section class="space-y-4">
      <h3 class="text-lg font-semibold flex items-center gap-2">
        <Icon name="tabler:info-circle" size="20" class="text-accent" />
        Basic Information
      </h3>

      <div>
        <label for="title" class="block text-sm font-medium text-gray-400 mb-2"> Title <span class="text-danger">*</span> </label>
        <input id="title" v-model="form.title" type="text" required placeholder="A clear and concise title includes the type of vulnerability and the impacted area." class="w-full px-4 py-3 bg-surface border border-border focus:outline-none focus:border-accent transition-colors" :class="{ 'border-danger': errors.title }" />
        <p v-if="errors.title" class="text-danger text-sm mt-1">{{ errors.title }}</p>
      </div>

      <div>
        <label for="severity" class="block text-sm font-medium text-gray-400 mb-2"> Severity <span class="text-danger">*</span> </label>
        <select id="severity" v-model="form.severity" required class="w-full px-4 py-3 bg-surface border border-border focus:outline-none focus:border-accent transition-colors">
          <option value="" disabled>Select severity level</option>
          <option v-for="(info, key) in severityInfo" :key="key" :value="key">{{ info.label }} - {{ info.desc }}</option>
        </select>
        <p class="text-xs text-gray-500 mt-1">Based on potential impact and exploitability</p>
      </div>
    </section>

    <section v-if="isUnlisted" class="space-y-4">
      <h3 class="text-lg font-semibold flex items-center gap-2">
        <Icon name="tabler:building" size="20" class="text-accent" />
        Target Information
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="targetName" class="block text-sm font-medium text-gray-400 mb-2"> Company / Program Name <span class="text-danger">*</span> </label>
          <input id="targetName" v-model="form.targetName" type="text" :required="isUnlisted" placeholder="e.g., Example Corp" class="w-full px-4 py-3 bg-surface border border-border focus:outline-none focus:border-accent transition-colors" />
        </div>

        <div>
          <label for="targetUrl" class="block text-sm font-medium text-gray-400 mb-2"> Target URL / Asset <span class="text-danger">*</span> </label>
          <input id="targetUrl" v-model="form.targetUrl" type="text" :required="isUnlisted" placeholder="e.g., https://example.com" class="w-full px-4 py-3 bg-surface border border-border focus:outline-none focus:border-accent transition-colors" />
        </div>
      </div>
    </section>

    <section class="space-y-4">
      <h3 class="text-lg font-semibold flex items-center gap-2">
        <Icon name="tabler:file-description" size="20" class="text-accent" />
        Proof of Concept
      </h3>

      <div>
        <label for="description" class="block text-sm font-medium text-gray-400 mb-2"> What is the vulnerability? In clear steps, how do you reproduce it? <span class="text-danger">*</span> </label>
        <textarea id="description" v-model="form.description" required rows="8" placeholder="Provide detailed steps to reproduce:&#10;1. Navigate to...&#10;2. Click on...&#10;3. Observe that...&#10;&#10;Include any payload, headers, or code used." class="w-full px-4 py-3 bg-surface border border-border focus:outline-none focus:border-accent transition-colors resize-none font-mono text-sm" :class="{ 'border-danger': errors.description }" />
        <div class="flex justify-between text-xs mt-1">
          <p v-if="errors.description" class="text-danger">{{ errors.description }}</p>
          <p class="text-gray-500 ml-auto">Markdown supported</p>
        </div>
      </div>
      <ReportFileUpload v-model="form.attachments" />
    </section>

    <div class="border-t border-border pt-6 space-y-4">
      <div v-if="err" class="p-4 bg-danger/10 border border-danger text-danger text-sm">
        {{ err }}
      </div>

      <button type="submit" :disabled="busy" class="w-full py-3 bg-accent text-black disabled:opacity-75 disabled:cursor-not-allowed font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer group">
        <Spinner v-if="busy" size="20" />
        <Icon v-else name="tabler:send" size="20" class="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        {{ busy ? "Submitting..." : "Submit Report" }}
      </button>

      <p class="text-gray-500 text-xs text-center">
        By submitting this report, you agree to the
        <NuxtLink to="/rules" class="underline">Rules of Engagement</NuxtLink>
        and our
        <NuxtLink to="/privacy" class="underline">Privacy Policy</NuxtLink>.
      </p>
    </div>
  </form>
</template>

<script setup lang="ts">
import { severityInfo } from "~/composables/useReportForm";

const props = defineProps<{
  programId?: string | null;
  isUnlisted?: boolean;
}>();

const emit = defineEmits<{
  submitted: [report: { id: string }];
}>();

const { form, errors, busy, err, submit } = useReportForm(props.programId, props.isUnlisted || false);

async function onSubmit() {
  const res = await submit();
  if (res) emit("submitted", res);
}
</script>
