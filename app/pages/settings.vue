<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold">Personal Settings</h1>
    </div>

    <div class="border border-border divide-y divide-border mb-8">
      <div class="flex items-center justify-between p-4 hover:bg-zinc-900/50 transition-colors group">
        <div class="flex items-center gap-3">
          <Icon name="tabler:mail" size="20px" class="text-gray-400" />
          <div>
            <p class="font-medium group-hover:text-accent transition-colors">Email</p>
            <p class="text-sm text-gray-500">Your email can not be changed</p>
          </div>
        </div>
        <p class="select-all text-gray-500">{{ user?.email }}</p>
      </div>

      <NuxtLink :to="`/@${user?.username}`" class="flex items-center justify-between p-4 hover:bg-zinc-900/50 transition-colors group">
        <div class="flex items-center gap-3">
          <Icon name="tabler:user" size="20px" class="text-gray-400" />
          <div>
            <p class="font-medium group-hover:text-accent transition-colors">Profile</p>
            <p class="text-sm text-gray-500">Edit your public profile information</p>
          </div>
        </div>
        <Icon name="tabler:chevron-right" size="20px" class="text-gray-500" />
      </NuxtLink>

      <div class="flex items-center justify-between p-4 hover:bg-zinc-900/50 transition-colors">
        <div class="flex items-center gap-3">
          <Icon name="tabler:brand-slack" size="20px" class="text-gray-400" />
          <div>
            <p class="font-medium">Slack Notifications</p>
            <p class="text-sm text-gray-500">
              {{ slack ? "Connected" : "Receive notifications via Slack DM" }}
            </p>
          </div>
        </div>
        <button v-if="slack" :disabled="loading" class="text-red-400 hover:text-red-300 disabled:opacity-50 cursor-pointer" @click="disconnectSlack">Disconnect</button>
        <a v-else href="/api/auth/slack/connect" class="px-3 py-1.5 bg-accent text-black text-sm font-medium hover:bg-accent/90 transition-colors"> Connect Slack </a>
      </div>
      <div v-if="slackError" class="p-4 bg-red-500/10 border border-red-500/30 text-red-400">
        <p class="font-medium">Failed to connect Slack</p>
        <p class="text-sm">{{ slackError }}</p>
      </div>
    </div>

    <div class="mb-4">
      <h2 class="text-xl font-semibold">Notification Preferences</h2>
      <p class="text-gray-500 text-sm mt-1">Choose how you want to be notified</p>
    </div>

    <div class="border border-border">
      <table class="w-full">
        <thead>
          <tr class="border-b border-border text-left text-sm text-gray-400">
            <th class="p-4 font-medium">Notification</th>
            <th class="p-4 font-medium text-center w-24">Email</th>
            <th v-if="slack" class="p-4 font-medium text-center w-24">Slack</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          <tr v-for="n in notifTypes" :key="n.key" class="hover:bg-zinc-900/50 transition-colors">
            <td class="p-4">
              <p class="font-medium">{{ n.label }}</p>
              <p class="text-sm text-gray-500">{{ n.desc }}</p>
            </td>
            <td class="p-4 text-center">
              <div class="flex justify-center cursor-pointer" @click="toggle(n.key, 'email')">
                <div class="flex items-center justify-center w-6 h-6 border-2 transition-all" :class="prefs[n.key]?.email ? 'bg-white border-accent' : 'bg-black border-border'">
                  <Icon v-if="prefs[n.key]?.email" name="tabler:check" class="w-4 h-4 text-black" />
                </div>
              </div>
            </td>
            <td v-if="slack" class="p-4 text-center">
              <div class="flex justify-center cursor-pointer" @click="toggle(n.key, 'slack')">
                <div class="flex items-center justify-center w-6 h-6 border-2 transition-all" :class="prefs[n.key]?.slack ? 'bg-white border-accent' : 'bg-black border-border'">
                  <Icon v-if="prefs[n.key]?.slack" name="tabler:check" class="w-4 h-4 text-black" />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" });

const { user } = useUserSession();
const route = useRoute();

const notifTypes = [
  { key: "COMMENT_ADDED", label: "New comments", desc: "When someone comments on your report" },
  { key: "STATUS_CHANGED", label: "Status changes", desc: "When report status is updated" },
  { key: "SEVERITY_CHANGED", label: "Severity changes", desc: "When report severity is updated" },
  { key: "TITLE_CHANGED", label: "Title changes", desc: "When report title is updated" },
  { key: "PROGRAM_CHANGED", label: "Program changes", desc: "When report is moved to another program" },
  { key: "TRIAGE_JOINED", label: "Someone joins report", desc: "When a triager joins your report" },
  { key: "REPORT_SUBMITTED", label: "New reports", desc: "When a new report is submitted for a program you manage" },
  { key: "PROGRAM_INVITE", label: "Program invites", desc: "When invited to manage a program" },
];

const errorMsgs: Record<string, string> = {
  not_authenticated: "You need to be logged in.",
  not_configured: "Slack integration is not configured.",
  session_expired: "Your session expired. Please try again.",
  oauth_expired: "OAuth session expired. Please try again.",
  invalid_session: "Invalid OAuth session.",
  missing_state: "Missing state parameter.",
  invalid_state: "Invalid state parameter.",
  state_expired: "State expired. Please try again.",
  missing_code: "Missing authorization code.",
  token_exchange_failed: "Failed to exchange token with Slack.",
  network_error: "Network error connecting to Slack.",
  access_denied: "You denied access to Slack.",
};

// SSR fetch - no client flashes
const { data: slackData } = await useFetch<{ connected: boolean }>("/api/user/slack-status");
const { data: prefsData } = await useFetch<Record<string, Record<string, boolean>>>("/api/profile/notifications");

const slack = ref(slackData.value?.connected ?? false);
const prefs = ref(prefsData.value ?? Object.fromEntries(notifTypes.map((n) => [n.key, { email: true }])));
const loading = ref(false);

// Handle OAuth callback query params (client-side only)
const slackError = ref<string | null>(null);
if (import.meta.client) {
  if (route.query.slack === "connected") slack.value = true;
  else if (route.query.slack === "error") {
    const reason = route.query.reason as string;
    slackError.value = errorMsgs[reason] || reason || "Unknown error";
  }
}

async function toggle(type: string, channel: string) {
  const def = channel === "email";
  const current = prefs.value[type]?.[channel] ?? def;
  prefs.value[type] = { ...prefs.value[type], [channel]: !current };
  try {
    await $fetch("/api/profile/notifications", { method: "PATCH", body: { type, channel, enabled: !current } });
  } catch {
    prefs.value[type] = { ...prefs.value[type], [channel]: current };
  }
}

async function disconnectSlack() {
  loading.value = true;
  await $fetch("/api/auth/slack/disconnect", { method: "DELETE" });
  slack.value = false;
  loading.value = false;
}

useHead({ title: "Personal Settings" });
</script>
