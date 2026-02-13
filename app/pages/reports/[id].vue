<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <Loading v-if="status === 'pending'" />

    <template v-else-if="report">
      <div v-if="report.needsBreakGlass" class="border border-border p-8 text-center">
        <div class="w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="tabler:lock-check" size="32" class="text-warning" />
        </div>
        <h1 class="text-xl font-bold font-display mb-2 max-w-lg mx-auto">{{ report.title }}</h1>
        <p class="text-gray-400 mb-2">
          Submitted by
          <span class="text-white inline-flex items-center">{{ report.submittedBy?.username || "Unknown" }}<Icon v-if="report.submittedBy?.verified" name="tabler:discount-check-filled" size="16" class="text-accent ml-1" title="This user has proven to submit high quality reports" /></span>
          {{ ago(report.createdAt) }}
        </p>
        <div class="my-8 max-w-md mx-auto">
          <p class="text-gray-400 text-sm">All security reports are private by default. In order to view the full report, you must break the glass. Breaking the glass will be visible to all users. There is no way to undo this action.</p>
        </div>
        <button :disabled="joining" class="px-6 py-3 bg-warning hover:bg-warning/80 text-black font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mx-auto" @click="breakGlass">
          <Spinner v-if="joining" size="24px" class="inline" />
          <Icon v-else name="tabler:hammer" size="24px" class="inline" />
          {{ joining ? "Joining..." : "Break the Glass & View Report" }}
        </button>
      </div>

      <div v-else-if="report.disclosed" class="space-y-8">
        <div class="bg-surface border border-border p-4 flex items-center gap-3">
          <Icon name="tabler:world" size="24" class="text-accent shrink-0" />
          <div>
            <p class="font-medium">This report has been publicly disclosed</p>
            <p class="text-sm text-gray-400">{{ report.disclosureType === "FULL" ? "The team opted for a full disclosure. This means that all contents of the report are visible, including description, comments, and attachments." : "The team opted for a summarized disclosure. This means that only summaries provided by the program and reporter are visible. This helps protect sensitive information while still providing transparency." }}</p>
          </div>
        </div>

        <div class="bg-surface border border-border p-6">
          <div class="flex items-start justify-between gap-4 mb-4">
            <h1 class="text-2xl font-bold font-display">{{ report.title }}</h1>
            <div class="flex gap-2">
              <Badge type="severity" :value="report.severity" />
              <Badge type="status" :value="report.status" />
            </div>
          </div>

          <template v-if="report.disclosureType === 'FULL'">
            <ReportMarkdown :content="report.description" />
            <div v-if="report.attachments?.length" class="mt-6 pt-4 border-t border-border">
              <h3 class="text-sm font-medium text-gray-400 mb-3">Files</h3>
              <div :class="['grid gap-2', report.attachments.length > 1 ? 'grid-cols-2' : '']">
                <a v-for="f in report.attachments" :key="f.url" :href="f.url" target="_blank" class="flex items-center gap-3 px-4 py-3 bg-surface-elevated border border-border hover:border-accent transition-colors group">
                  <Icon :name="fileIcon(f.name)" size="20" class="text-gray-400 group-hover:text-accent shrink-0" />
                  <span class="flex-1 truncate">{{ trimName(f.name) }}</span>
                  <span class="text-xs text-gray-500">{{ fmtSize(f.size) }}</span>
                  <Icon name="tabler:download" size="16" class="text-gray-400 group-hover:text-white shrink-0" />
                </a>
              </div>
            </div>
          </template>

          <template v-else>
            <div v-if="report.adminSummary" class="mb-4">
              <h3 class="text-sm font-medium text-gray-400 mb-2">Summary from the {{ report.program?.title || "Program" }} team</h3>
              <ReportMarkdown :content="report.adminSummary" />
            </div>
            <div v-if="report.reporterSummary">
              <h3 class="text-sm font-medium text-gray-400 mb-2">Summary from the reporter, <NuxtLink :to="`/@${report.submittedBy?.username}`" class="text-accent hover:underline">{{ report.submittedBy?.username || "Unknown" }}</NuxtLink></h3>
              <ReportMarkdown :content="report.reporterSummary" />
            </div>
            <p v-if="!report.adminSummary && !report.reporterSummary" class="text-gray-500 italic">No summaries have been provided yet... One should come along soon.</p>
          </template>

          <div class="mt-6 pt-4 border-t border-border text-sm text-gray-400 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>
              <Icon name="tabler:clock" size="16px" class="inline mr-1 align-text-bottom" />
              {{ localTime(report.createdAt) }}
            </span>
            <span v-if="report.program" class="inline-flex items-center gap-1">
              <Icon name="tabler:target" size="16px" class="shrink-0" />
              <NuxtLink :to="`/${report.program.slug}`" class="text-accent hover:underline">{{ report.program.title }}</NuxtLink>
            </span>
          </div>
        </div>

        <template v-if="report.disclosureType === 'FULL' && report.activities?.length">
          <h2 class="text-lg font-semibold font-display mb-6">Activity</h2>
          <div class="relative">
            <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
            <div class="space-y-6">
              <div v-for="a in report.activities" :id="a.id" :key="a.id" class="relative pl-12">
                <div class="bg-white absolute left-1 w-8 h-8 flex rounded-full items-center justify-center -translate-x-0.5">
                  <Icon :name="actIcon(a.type)" size="20px" class="text-black" />
                </div>
                <div class="bg-surface border border-border p-4">
                  <div class="flex items-center gap-1 flex-wrap text-sm">
                    <span class="font-medium">{{ a.author.username }}</span>
                    <span class="text-gray-500">
                      <span v-if="a.type === 'STATUS_CHANGED'"> changed status to <Badge type="status" :value="a.newValue || ''" /> </span>
                      <span v-else-if="a.type === 'SEVERITY_CHANGED'"> updated severity to <Badge type="severity" :value="a.newValue || ''" /> </span>
                      <span v-else>{{ actDesc(a) }}</span>
                      <span class="mx-1">•</span>
                      {{ ago(a.createdAt) }}
                    </span>
                  </div>
                  <div v-if="a.content && a.type === 'COMMENT'" class="mt-3">
                    <ReportMarkdown :content="a.content" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <template v-else>
        <div class="bg-surface border border-border p-6 mb-8">
          <div class="flex items-start justify-between gap-4 mb-4">
            <div class="flex-1">
              <form v-if="editingTitle" class="flex items-center gap-2" @submit.prevent="saveTitle">
                <input v-model="newTitle" type="text" class="flex-1 text-2xl font-bold font-display bg-surface border-b border-accent focus:outline-none py-1" :placeholder="report.title" @keydown.escape="editingTitle = false" />
                <button type="submit" :disabled="!newTitle.trim() || newTitle === report.title" class="p-1 text-accent hover:text-white disabled:opacity-50 cursor-pointer" aria-label="Accept new title">
                  <Icon name="tabler:check" size="24px" />
                </button>
              </form>
              <h1 v-else class="text-2xl font-bold font-display cursor-pointer hover:underline decoration-accent underline-offset-4" aria-label="Click to change the title of this report" @click="startEditTitle">{{ report.title }}</h1>
            </div>
            <div class="flex gap-2">
              <div v-if="report.access?.canChangeSeverity" class="relative">
                <button :class="[sevCls(report.severity), 'px-2 py-1 rounded text-xs font-medium flex items-center cursor-pointer gap-1']" @click="sevOpen = !sevOpen">
                  {{ report.severity }}
                  <Icon name="tabler:chevron-down" size="16px" class="inline" />
                </button>
                <div v-if="sevOpen" class="absolute right-0 mt-1 bg-surface-elevated border border-border shadow-lg z-10 min-w-32">
                  <button v-for="s in SEVS" :key="s" :class="[sevCls(s), 'w-full text-left px-3 py-2 text-sm hover:bg-surface first:rounded-t-lg last:rounded-b-lg']" @click="setSev(s)">
                    {{ s }}
                  </button>
                </div>
              </div>
              <Badge v-else type="severity" :value="report.severity" />

              <div v-if="report.access?.canChangeStatus" class="relative">
                <button :class="[statCls(report.status), 'px-2 py-1 rounded text-xs font-medium flex items-center cursor-pointer gap-1']" @click="statOpen = !statOpen">
                  {{ statLabel(report.status) }}
                  <Icon name="tabler:chevron-down" size="16px" class="inline" />
                </button>
                <div v-if="statOpen" class="absolute right-0 mt-1 bg-surface-elevated border border-border shadow-lg z-10 min-w-40">
                  <button v-for="s in STATS" :key="s" :class="[statCls(s), 'w-full text-left px-3 py-2 text-sm hover:bg-surface first:rounded-t-lg last:rounded-b-lg']" @click="setStat(s)">
                    {{ statLabel(s) }}
                  </button>
                </div>
              </div>
              <Badge v-else type="status" :value="report.status" />

              <span v-if="report.disclosureType === 'FULL'" class="px-2 py-1 rounded text-xs font-medium bg-accent/20 text-accent flex items-center gap-1">
                <Icon name="tabler:world" size="14" /> Publicly Disclosed
              </span>
              <span v-else-if="report.disclosureType === 'SUMMARIZED'" class="px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-400 flex items-center gap-1">
                <Icon name="tabler:file-text" size="14" /> Summary Disclosed
              </span>
              <button v-else-if="report.access?.canDisclose" class="px-2 py-1 rounded text-xs font-medium bg-surface-elevated text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors" @click="disclosureOpen = true">
                <Icon name="tabler:world" size="14" /> Disclose
              </button>
            </div>
          </div>

          <ReportMarkdown :content="report.description" />

          <div v-if="report.attachments?.length" class="mt-6 pt-4 border-t border-border">
            <h3 class="text-sm font-medium text-gray-400 mb-3">Files</h3>
            <div :class="['grid gap-2', report.attachments.length > 1 ? 'grid-cols-2' : '']">
              <a v-for="f in report.attachments" :key="f.url" :href="f.url" target="_blank" class="flex items-center gap-3 px-4 py-3 bg-surface-elevated border border-border hover:border-accent transition-colors group">
                <Icon :name="fileIcon(f.name)" size="20" class="text-gray-400 group-hover:text-accent shrink-0" />
                <span class="flex-1 truncate">{{ trimName(f.name) }}</span>
                <span class="text-xs text-gray-500">{{ fmtSize(f.size) }}</span>
                <Icon name="tabler:download" size="16" class="text-gray-400 group-hover:text-white shrink-0" />
              </a>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-border text-sm text-gray-400 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>
              <Icon name="tabler:clock" size="16px" class="inline mr-1 align-text-bottom" />
              {{ localTime(report.createdAt) }}
            </span>
            <span v-if="report.program" class="inline-flex items-center gap-1">
              <Icon name="tabler:target" size="16px" class="shrink-0" />
              <NuxtLink :to="`/${report.program.slug}`" class="text-accent hover:underline">{{ report.program.title }}</NuxtLink>
              <button v-if="report.access?.canReassignProgram" class="text-gray-500 hover:text-white cursor-pointer flex items-center" title="Reassign to different program" @click="openReassign">
                <Icon name="tabler:switch-horizontal" size="16px" />
              </button>
            </span>
            <span v-else-if="report.access?.canReassignProgram" class="inline-flex items-center gap-1">
              <Icon name="tabler:target" size="16px" class="shrink-0" />
              <span class="text-gray-500">Unlisted</span>
              <button class="text-gray-500 hover:text-white cursor-pointer flex items-center" title="Reassign to a program" @click="openReassign">
                <Icon name="tabler:switch-horizontal" size="16px" />
              </button>
            </span>
            <span v-if="report.participants?.length" class="inline-flex items-center flex-wrap">
              <Icon name="tabler:users" size="16px" class="inline mr-1 align-text-bottom" />
              <template v-for="(p, i) in report.participants" :key="p.userId">
                <span class="inline-flex items-center"
                  ><NuxtLink :to="`/@${p.username}`" class="text-accent hover:underline">{{ p.username }}</NuxtLink
                  ><Icon v-if="p.verified" name="tabler:discount-check-filled" size="16" class="text-accent ml-1" title="This user has proven to submit high quality reports"
                /></span>
                <span v-if="i < report.participants.length - 1">, </span>
              </template>
            </span>
          </div>
        </div>

        <div v-if="reassignOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="reassignOpen = false">
          <div class="bg-surface border border-border p-6 max-w-md w-full mx-4">
            <h3 class="text-lg font-bold font-display mb-4">Reassign Report</h3>
            <p class="text-gray-400 text-sm mb-4">Report got filed to the wrong place? Reassign it to the correct program below:</p>
            <div v-if="loadingPrograms" class="flex justify-center py-4 h-8">
              <Spinner />
            </div>
            <div v-else class="space-y-2 max-h-64 overflow-y-auto">
              <button :class="['w-full text-left px-3 py-2 border transition-colors cursor-pointer', isSelected('') ? 'border-accent bg-accent/10' : 'border-border hover:border-gray-600']" @click="selectedProgram = ''">
                <span class="text-gray-400">Unlisted (no program)</span>
              </button>
              <button v-for="p in programs" :key="p.id" :class="['w-full text-left px-3 py-2 border transition-colors cursor-pointer', isSelected(p.id) ? 'border-accent bg-accent/10' : 'border-border hover:border-gray-600']" @click="selectedProgram = p.id">
                {{ p.title }}
              </button>
            </div>
            <div class="flex justify-end gap-2 mt-6">
              <button class="px-4 py-2 text-gray-400 hover:text-white cursor-pointer" @click="reassignOpen = false">Cancel</button>
              <button :disabled="reassigning" class="px-4 py-2 bg-accent text-black font-medium disabled:opacity-50 cursor-pointer flex items-center gap-2" @click="reassign">
                <Spinner v-if="reassigning" class="h-4 w-4" />
                {{ reassigning ? "Saving..." : "Reassign" }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="disclosureOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="disclosureOpen = false">
          <div class="bg-surface border border-border p-6 max-w-md w-full mx-4">
            <h3 class="text-lg font-bold font-display mb-4">Public disclosure</h3>
            <p class="text-gray-400 text-sm mb-4">Public disclosure is a huge part of security. It is how we and others learn from our mistakes and improve. Choose how this report should be disclosed to the public:</p>
            <div class="space-y-3 mb-6">
              <button :class="['w-full text-left p-4 border transition-colors cursor-pointer', disclosureType === 'SUMMARIZED' ? 'border-accent bg-accent/10' : 'border-border hover:border-gray-600']" @click="disclosureType = 'SUMMARIZED'">
                <div class="font-medium flex items-center gap-2"><Icon name="tabler:file-text" size="18" /> Summarized Disclosure</div>
                <p class="text-sm text-gray-400 mt-1">Both parties or only one can provide a written summary. The report description, comments, and attachments remain private.</p>
              </button>
              <button :class="['w-full text-left p-4 border transition-colors cursor-pointer', disclosureType === 'FULL' ? 'border-warning bg-warning/10' : 'border-border hover:border-gray-600']" @click="disclosureType = 'FULL'">
                <div class="font-medium flex items-center gap-2"><Icon name="tabler:world" size="18" /> Full Disclosure</div>
                <p class="text-sm text-warning mt-1">All the contents of this report will be publicly visible, the description, comments, and attachments. Consider summarized disclosure instead when the report is genuine and may contain sensitive information.</p>
              </button>
            </div>
            <div class="flex justify-end gap-2">
              <button class="px-4 py-2 text-gray-400 hover:text-white cursor-pointer" @click="disclosureOpen = false">Cancel</button>
              <button :disabled="disclosing" class="px-4 py-2 bg-accent text-black font-medium disabled:opacity-50 cursor-pointer flex items-center gap-2" @click="disclose">
                <Spinner v-if="disclosing" class="h-4 w-4" />
                {{ disclosing ? "Disclosing..." : "Confirm Disclosure" }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="report.disclosureType === 'SUMMARIZED' && (report.access?.isOwner || report.access?.isProgramAdmin || report.access?.isGlobalAdmin)" class="bg-surface border border-border p-6 mb-8">
          <h3 class="text-lg font-bold font-display mb-4">Disclosure Summary</h3>
          <p class="text-gray-400 text-sm mb-4">{{ report.access?.isOwner ? "Write your public summary of this report as the reporter." : "Write the program's public summary for this disclosed report." }}</p>
          <div v-if="(report.access?.isOwner ? report.reporterSummary : report.adminSummary)" class="mb-4 p-4 bg-surface-elevated border border-border">
            <h4 class="text-sm font-medium text-gray-400 mb-2">Current Summary</h4>
            <ReportMarkdown :content="(report.access?.isOwner ? report.reporterSummary : report.adminSummary)!" />
          </div>
          <textarea v-model="summaryText" rows="4" placeholder="Write your summary for all to see... Markdown is supported!" class="w-full px-4 py-3 bg-surface border border-border text-sm font-mono focus:outline-none focus:border-accent transition-colors resize-y mb-4" />
          <div class="flex justify-end">
            <button :disabled="!summaryText.trim() || savingSummary" class="flex items-center gap-2 px-4 py-2 bg-accent disabled:opacity-50 text-black font-medium transition-colors" @click="saveSummary">
              <Spinner v-if="savingSummary" class="h-4 w-4" />
              {{ savingSummary ? "Saving..." : "Save Summary" }}
            </button>
          </div>
        </div>

        <div class="mt-6">
          <h2 class="text-lg font-semibold font-display mb-6">Activity</h2>
          <div class="relative">
            <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

            <div class="space-y-6">
              <div v-for="a in report.activities" :id="a.id" :key="a.id" class="relative pl-12">
                <div class="bg-white absolute left-1 w-8 h-8 flex rounded-full items-center justify-center -translate-x-0.5">
                  <Icon :name="actIcon(a.type)" size="20px" class="text-black" />
                </div>
                <div class="bg-surface border border-border p-4">
                  <div class="flex items-center gap-1 flex-wrap text-sm">
                    <NuxtLink :to="`/@${a.author.username}`" class="font-medium leading-tight flex items-center h-6">{{ a.author.username }}</NuxtLink>
                    <span v-if="a.author.isGlobalAdmin" class="flex items-center h-6" aria-label="This is a global admin!" title="This is a global admin!"><Icon name="tabler:bolt-filled" size="16px" class="text-cyan-400" /></span>
                    <span v-else-if="a.author.isAdmin" class="flex items-center h-6" aria-label="This is a program admin!" title="This is a program admin!"><Icon name="tabler:bolt-filled" size="16px" class="text-yellow-500" /></span>
                    <span class="text-gray-500 leading-tight flex items-center h-6">
                      <span v-if="a.type === 'STATUS_CHANGED'"> changed status to <Badge type="status" :value="a.newValue || ''" /> </span>
                      <span v-else-if="a.type === 'SEVERITY_CHANGED'"> updated severity to <Badge type="severity" :value="a.newValue || ''" /> </span>
                      <span v-else-if="a.type === 'TITLE_CHANGED'">
                        changed title to <span class="font-medium text-white">{{ a.newValue }}</span>
                      </span>
                      <span v-else-if="a.type === 'PROGRAM_CHANGED'">
                        reassigned this report from <span class="font-medium text-white">{{ a.oldValue }}</span> to <span class="font-medium text-white">{{ a.newValue }}</span>
                      </span>
                      <span v-else>{{ actDesc(a) }}</span>
                      <span class="mx-1">•</span>
                      {{ ago(a.createdAt) }}
                    </span>
                  </div>

                  <div v-if="a.content && a.type === 'COMMENT'" class="mt-3">
                    <ReportMarkdown :content="a.content" />
                  </div>
                  <p v-else-if="a.content" class="text-white whitespace-pre-wrap mt-3">
                    {{ a.content }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form class="mt-6 pt-6 border-t border-border" @submit.prevent="comment">
            <textarea v-model="msg" rows="3" placeholder="Add a comment... Markdown is supported!" class="w-full px-4 py-3 bg-surface border border-border text-sm font-mono focus:outline-none focus:border-accent transition-colors resize-y mb-4" />
            <div class="flex justify-end">
              <button type="submit" :disabled="!msg.trim() || busy" class="flex items-center gap-2 px-4 py-2 bg-accent disabled:opacity-50 text-black font-medium transition-colors">
                <Spinner v-if="busy" class="h-4 w-4" />
                <span>{{ busy ? "Posting..." : "Comment" }}</span>
              </button>
            </div>
          </form>
        </div>
      </template>
    </template>

    <div v-else class="text-center py-16 text-red-500">Report not found</div>
  </div>
</template>

<script setup lang="ts">
import { fmtSize, icon as fileIcon } from "~~/shared/fileTypes";

definePageMeta({});

interface Activity {
  id: string;
  type: string;
  content?: string | null;
  oldValue?: string | null;
  newValue?: string | null;
  createdAt: string;
  author: {
    username?: string | null;
    isOP?: boolean;
    isAdmin?: boolean;
    isGlobalAdmin?: boolean;
  };
}

interface Participant {
  userId: string;
  username?: string | null;
  verified?: boolean;
}

interface Program {
  id: string;
  title: string;
  slug: string;
}

interface FileInfo {
  url: string;
  name: string;
  size: number;
}

interface Report {
  id: string;
  title: string;
  description?: string;
  severity: string;
  status: string;
  createdAt: string;
  needsBreakGlass?: boolean;
  disclosed?: boolean;
  disclosureType?: string;
  disclosedAt?: string;
  adminSummary?: string;
  reporterSummary?: string;
  submittedBy?: { username?: string | null; verified?: boolean };
  program?: { slug: string; title: string };
  participants?: Participant[];
  activities?: Activity[];
  attachments?: FileInfo[];
  access?: {
    canView: boolean;
    canViewDetails: boolean;
    canTriage: boolean;
    canChangeStatus: boolean;
    canChangeSeverity: boolean;
    canReassignProgram: boolean;
    canDisclose: boolean;
    isOwner: boolean;
    isTriage: boolean;
    needsBreakGlass: boolean;
  };
}

const route = useRoute();
const { ago, statLabel } = useFormat();
const { sevCls, statCls } = useStyle();
const { busy, run } = useApi();

const { data: report, status, refresh } = await useFetch<Report>(`/api/reports/${route.params.id}`);

const msg = ref("");
const joining = ref(false);
const sevOpen = ref(false);
const statOpen = ref(false);
const editingTitle = ref(false);
const newTitle = ref("");
const reassignOpen = ref(false);
const reassigning = ref(false);
const loadingPrograms = ref(false);
const programs = ref<Program[]>([]);
const selectedProgram = ref<string>("");

function isSelected(id: string) {
  return selectedProgram.value === id;
}
const disclosureOpen = ref(false);
const disclosureType = ref<"FULL" | "SUMMARIZED">("SUMMARIZED");
const disclosing = ref(false);
const summaryText = ref("");
const savingSummary = ref(false);

const actIcons = {
  SUBMITTED: "tabler:send",
  COMMENT: "tabler:message-2",
  STATUS_CHANGED: "tabler:status-change",
  SEVERITY_CHANGED: "tabler:refresh-alert",
  TITLE_CHANGED: "tabler:edit",
  TRIAGE_JOINED: "tabler:arrow-up-to-arc",
  AUTHOR_JOINED: "tabler:arrow-up-to-arc",
  PROGRAM_CHANGED: "tabler:switch-horizontal",
  DISCLOSURE_SET: "tabler:world",
} as const;

const SEVS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
const STATS = ["NEW", "TRIAGED", "NEEDS_MORE_INFO", "RESOLVED", "INFORMATIVE", "DUPLICATE", "SPAM"] as const;

function localTime(d: string) {
  return new Date(d).toLocaleString(undefined, {
    dateStyle: "long",
    timeStyle: "short",
  });
}

function trimName(name: string, max = 32): string {
  if (name.length <= max) return name;
  const dot = name.lastIndexOf(".");
  const ext = dot > 0 ? name.slice(dot) : "";
  const base = dot > 0 ? name.slice(0, dot) : name;
  const keep = max - ext.length - 3;
  if (keep < 4) return name.slice(0, max - 3) + "..." + ext;
  const half = Math.floor(keep / 2);
  return base.slice(0, half) + "..." + base.slice(-half) + ext;
}

async function breakGlass() {
  joining.value = true;
  try {
    await $fetch(`/api/reports/${route.params.id}/join`, { method: "POST" });
    await refresh();
  } finally {
    joining.value = false;
  }
}

async function comment() {
  if (!msg.value.trim()) return;
  await run(async () => {
    await $fetch(`/api/reports/${route.params.id}/activities`, {
      method: "POST",
      body: { type: "COMMENT", content: msg.value },
    });
    msg.value = "";
    await refresh();
  });
}

async function setSev(v: string) {
  sevOpen.value = false;
  await $fetch(`/api/reports/${route.params.id}/activities`, {
    method: "POST",
    body: { type: "SEVERITY_CHANGED", value: v },
  });
  await refresh();
}

async function setStat(v: string) {
  statOpen.value = false;
  await $fetch(`/api/reports/${route.params.id}/activities`, {
    method: "POST",
    body: { type: "STATUS_CHANGED", value: v },
  });
  await refresh();
}

function startEditTitle() {
  newTitle.value = report.value?.title || "";
  editingTitle.value = true;
}

async function saveTitle() {
  if (!newTitle.value.trim() || newTitle.value === report.value?.title) return;
  await run(async () => {
    await $fetch(`/api/reports/${route.params.id}/activities`, {
      method: "POST",
      body: { type: "TITLE_CHANGED", value: newTitle.value },
    });
    editingTitle.value = false;
    await refresh();
  });
}

function actIcon(t: string) {
  return (actIcons as Record<string, string>)[t] || "tabler:bolt";
}

function actDesc(a: { type: string; newValue?: string | null }) {
  const desc: Record<string, string> = {
    SUBMITTED: "submitted this report",
    COMMENT: "posted a comment",
    TRIAGE_JOINED: "joined the report",
    AUTHOR_JOINED: "joined the report",
    DISCLOSURE_SET: "publicly disclosed this report",
  };
  return desc[a.type] || "";
}

async function openReassign() {
  reassignOpen.value = true;
  loadingPrograms.value = true;
  try {
    programs.value = await $fetch<Program[]>("/api/programs");
    const curr = report.value?.program;
    selectedProgram.value = curr ? programs.value.find((p) => p.slug === curr.slug)?.id || "" : "";
  } finally {
    loadingPrograms.value = false;
  }
}

async function reassign() {
  reassigning.value = true;
  try {
    await $fetch(`/api/reports/${route.params.id}/program`, {
      method: "PATCH",
      body: { programId: selectedProgram.value || null },
    });
    reassignOpen.value = false;
    await refresh();
  } finally {
    reassigning.value = false;
  }
}

async function disclose() {
  disclosing.value = true;
  try {
    await $fetch(`/api/reports/${route.params.id}/disclosure`, {
      method: "PATCH",
      body: { type: disclosureType.value },
    });
    disclosureOpen.value = false;
    await refresh();
  } finally {
    disclosing.value = false;
  }
}

async function saveSummary() {
  if (!summaryText.value.trim()) return;
  savingSummary.value = true;
  try {
    await $fetch(`/api/reports/${route.params.id}/disclosure-summary`, {
      method: "PATCH",
      body: { summary: summaryText.value },
    });
    await refresh();
  } finally {
    savingSummary.value = false;
  }
}

useHead({
  title: computed(() => report.value?.title || "Report"),
  meta: [
    {
      name: "description",
      content: "Report details",
    },
  ],
});
</script>
