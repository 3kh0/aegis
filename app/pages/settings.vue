<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold">Personal Settings</h1>
    </div>

    <div class="border border-border divide-y divide-border my-4">
      <div class="p-4 hover:bg-zinc-900/50 transition-colors group">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <Icon name="tabler:mail" size="20px" class="text-gray-400" />
            <div>
              <p class="font-medium group-hover:text-accent transition-colors">Email</p>
              <p class="text-sm text-gray-500">All notifications are sent here</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <p class="select-all text-gray-500">{{ user?.email }}</p>
            <button class="text-accent hover:text-accent/80 text-sm cursor-pointer" @click="showEmailChange = !showEmailChange">
              {{ showEmailChange ? "Cancel" : "Change" }}
            </button>
          </div>
        </div>
        <div v-if="showEmailChange" class="mt-4 pl-8">
          <form class="flex gap-2" @submit.prevent="changeEmail">
            <input v-model="newEmail" type="email" required placeholder="my_new@email.com" class="flex-1 px-3 py-2 bg-black border border-border focus:outline-none focus:border-accent transition-colors" :disabled="emailLoading" />
            <button type="submit" :disabled="emailLoading || !newEmail" class="px-4 py-2 bg-accent text-black font-medium hover:bg-accent/90 disabled:opacity-50 cursor-pointer">
              <Spinner v-if="emailLoading" size="16px" />
              <span v-else>Verify</span>
            </button>
          </form>
          <p v-if="emailError" class="text-red-400 text-sm mt-2">{{ emailError }}</p>
          <p v-if="emailSuccess" class="text-green-400 text-sm mt-2">Verification email sent! Check your inbox.</p>
        </div>
      </div>
      <div v-if="ecError" class="p-4 bg-red-500/10 border border-red-500/30 text-red-400">
        {{ ecError }}
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
        <a v-else href="/api/auth/slack/connect" class="px-3 py-1.5 bg-accent text-black text-sm font-medium hover:bg-accent/90 transition-colors">Connect</a>
      </div>
      <div v-if="slackError" class="p-4 bg-red-500/10 border border-red-500/30 text-red-400">
        <p class="font-medium">Failed to connect Slack</p>
        <p class="text-sm">{{ slackError }}</p>
      </div>

      <div class="flex items-center justify-between p-4 hover:bg-zinc-900/50 transition-colors">
        <div class="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 24 24" class="text-gray-400 m-0.5"><path fill="currentColor" d="M12 0C2.4 0 0 2.4 0 12s2.4 12 12 12s12-2.4 12-12S21.6 0 12 0m4.5 19.51h-3.31v-6.507c0-.975-.187-1.622-.834-1.622c-.712 0-1.575 1.003-1.575 2.625v5.503H7.5V4.97l3.29-.563v5.428c.713-.646 1.707-.928 2.72-.928c2.156 0 2.99 1.416 2.99 3.628z" /></svg>
          <div>
            <p class="font-medium">Sign in with Hack Club</p>
            <p class="text-sm text-gray-500">
              <template v-if="hca"
                >Linked account: <span class="select-all">{{ hackClubId }}</span></template
              >
              <template v-else>Ditch email codes for a faster sign-in experience</template>
            </p>
          </div>
        </div>
        <button v-if="hca" :disabled="hcaLoading" class="text-red-400 hover:text-red-300 disabled:opacity-50 cursor-pointer" @click="disconnectHCA">Disconnect</button>
        <a v-else href="/api/auth/hackclub?to=/settings" class="px-3 py-1.5 bg-accent text-black text-sm font-medium hover:bg-accent/90 transition-colors">Connect</a>
      </div>
    </div>

    <div class="my-4">
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

    <div class="my-4">
      <h2 class="text-xl font-semibold text-red-400">Danger Zone</h2>
      <p class="text-gray-500 text-sm mt-1">Woah. I hope you know what are you doing.</p>
    </div>

    <div class="border border-red-500/30 p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="font-medium text-red-400">Delete Account</p>
          <p class="text-sm text-gray-500">This will permanently delete your account and all associated data. Reports you've submitted will be kept but anonymized. There is no way to recover your account after deletion.</p>
        </div>
        <button class="px-4 py-2 bg-red-500 text-white font-medium hover:bg-red-600 transition-colors cursor-pointer shrink-0" @click="deleteModal = true">Delete Account</button>
      </div>
    </div>

    <div v-if="deleteModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="deleteModal = false">
      <div class="bg-surface border border-red-500 p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-bold text-red-400 font-display mb-2">Delete your account?</h3>
        <p class="text-gray-400 text-sm mb-4">This action is permanent and cannot be undone. Your profile, notification preferences, and program memberships will be deleted. Reports you've submitted will remain but will show as submitted by a deleted user.</p>
        <p class="text-gray-400 text-sm mb-4">Type <span class="text-white text-xs py-1 px-2 bg-surface-elevated font-mono">delete my account</span> to confirm:</p>
        <input v-model="deleteConfirm" type="text" placeholder="delete my account" class="w-full px-3 py-2 bg-black border border-border focus:outline-none focus:border-red-500 transition-colors mb-4" />
        <div class="flex justify-end gap-2">
          <button
            class="px-4 py-2 text-gray-400 hover:text-white cursor-pointer"
            @click="
              deleteModal = false;
              deleteConfirm = '';
            "
          >
            Cancel
          </button>
          <button :disabled="deleteConfirm !== 'delete my account' || deleting" class="px-4 py-2 bg-red-500 text-white font-medium hover:bg-red-600 disabled:opacity-50 cursor-pointer flex items-center gap-2" @click="deleteAccount">
            <Spinner v-if="deleting" size="16px" />
            {{ deleting ? "Deleting..." : "Delete Account" }}
          </button>
        </div>
      </div>
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
const { data: hcaData } = await useFetch<{ connected: boolean; hackClubId: string | null }>("/api/user/hca-status");
const { data: prefsData } = await useFetch<Record<string, Record<string, boolean>>>("/api/profile/notifications");

const slack = ref(slackData.value?.connected ?? false);
const hca = ref(hcaData.value?.connected ?? false);
const hackClubId = ref(hcaData.value?.hackClubId ?? null);
const hcaLoading = ref(false);
const prefs = ref(prefsData.value ?? Object.fromEntries(notifTypes.map((n) => [n.key, { email: true }])));
const loading = ref(false);

const showEmailChange = ref(false);
const newEmail = ref("");
const emailLoading = ref(false);
const emailError = ref<string | null>(null);
const emailSuccess = ref(false);

async function changeEmail() {
  emailLoading.value = true;
  emailError.value = null;
  emailSuccess.value = false;
  try {
    await $fetch("/api/profile/email", { method: "POST", body: { email: newEmail.value } });
    emailSuccess.value = true;
    newEmail.value = "";
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } };
    emailError.value = err.data?.message || "Failed to send verification email";
  } finally {
    emailLoading.value = false;
  }
}

// Handle OAuth callback query params (client-side only)
const slackError = ref<string | null>(null);
const ecError = ref<string | null>(null);
if (import.meta.client) {
  if (route.query.slack === "connected") slack.value = true;
  else if (route.query.slack === "error") {
    const reason = route.query.reason as string;
    slackError.value = errorMsgs[reason] || reason || "Unknown error";
  }

  if (route.query.ec === "invalid") {
    ecError.value = "Invalid link. Please try again";
  } else if (route.query.ec === "expired") {
    ecError.value = "This link has expired. Please try again.";
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

async function disconnectHCA() {
  hcaLoading.value = true;
  await $fetch("/api/auth/hackclub/disconnect", { method: "DELETE" });
  hca.value = false;
  hackClubId.value = null;
  hcaLoading.value = false;
}

const deleteModal = ref(false);
const deleteConfirm = ref("");
const deleting = ref(false);

async function deleteAccount() {
  if (deleteConfirm.value !== "delete my account") return;
  deleting.value = true;
  try {
    await $fetch("/api/user/account", { method: "DELETE" });
    await useUserSession().clear();
    await navigateTo("/");
  } catch {
    deleting.value = false;
  }
}

useHead({ title: "Personal Settings" });
</script>
