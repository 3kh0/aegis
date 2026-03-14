<template>
  <div class="max-w-6xl mx-auto px-4 py-16">
    <div class="min-h-[40vh] sm:min-h-[50vh] lg:min-h-[60vh] flex items-center justify-center py-12 md:py-0">
      <div class="text-center px-4">
        <h1 class="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-display mb-4 md:mb-6">Aegis</h1>
        <p class="text-base sm:text-md md:text-lg text-gray-400 max-w-lg mx-auto mb-6 md:mb-8 font-mono">Responsibly disclose vulnerabilities on Hack Club programs for bounties</p>
        <div class="flex gap-3 sm:gap-4 justify-center">
          <NuxtLink to="/programs" class="px-3 py-1.5 bg-accent text-black font-medium text-sm sm:text-base transition-transform active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"> View Programs </NuxtLink>
          <NuxtLink v-if="loggedIn" to="/dashboard" class="px-3 py-1.5 bg-surface-elevated hover:bg-border font-medium border border-border text-sm sm:text-base transition-transform active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"> Dashboard </NuxtLink>
          <NuxtLink v-else to="/auth/login" class="px-3 py-1.5 bg-surface-elevated hover:bg-border font-medium border border-border text-sm sm:text-base transition-transform active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"> Log in </NuxtLink>
        </div>
      </div>
    </div>
    <div>
      <h2 class="text-2xl sm:text-3xl font-bold mb-3 md:mb-4">Participating Programs</h2>
      <p class="text-sm sm:text-base text-gray-400 mb-6 md:mb-8 font-mono leading-relaxed">All Hack Club programs unless specified are under this security program. Here are some of our best programs to hack on:</p>
      <div class="mb-6 md:mb-8">
        <ProgramGrid />
      </div>
      <p class="text-sm sm:text-base text-gray-400 mb-6 md:mb-8 font-mono leading-relaxed">We have more than 100+ programs in total, you can view all of them on the <NuxtLink to="/programs" class="text-accent underline">programs page</NuxtLink>.</p>
      <h2 class="text-2xl sm:text-3xl font-bold mb-3 md:mb-4">Payout Tiers</h2>
      <p class="text-sm sm:text-base text-gray-400 mb-6 md:mb-8 font-mono leading-relaxed">As a thank you for helping us keep Hack Club secure, we are offering bounties for finding vulnerabilities in our systems. Payouts are based on demonstrated real world impact, not theoretical risk. All reports must include a valid proof of concept and clear impact analysis to qualify. Find the row that matches your finding, that's your base payout.</p>

      <div class="overflow-x-auto mb-6 md:mb-8">
        <table class="w-full text-sm font-mono border border-border">
          <thead>
            <tr class="bg-surface-elevated">
              <th class="text-left p-3 border-b border-border text-gray-400">Impact</th>
              <th class="text-left p-3 border-b border-border text-gray-400">What qualifies</th>
              <th class="text-right p-3 border-b border-border text-gray-400">Base payout</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-border">
              <td class="p-3 text-white font-bold align-top" colspan="3">Critical</td>
            </tr>
            <tr class="border-b border-border">
              <td class="p-3 pl-6 text-gray-300 align-top">Remote code execution</td>
              <td class="p-3 text-gray-400 align-top">Root or unprivileged shell on a production server (outside Docker)</td>
              <td class="p-3 text-right text-accent font-bold align-top">$1,000</td>
            </tr>
            <tr class="border-b border-border">
              <td class="p-3 pl-6 text-gray-300 align-top">Mass sensitive PII leak</td>
              <td class="p-3 text-gray-400 align-top">Legal IDs, identity verification documents, or physical addresses affecting 150+ users</td>
              <td class="p-3 text-right text-accent font-bold align-top">$750</td>
            </tr>
            <tr class="border-b border-border">
              <td class="p-3 pl-6 text-gray-300 align-top">Full admin takeover</td>
              <td class="p-3 text-gray-400 align-top">Bypasses granting extensive admin access, or unrestricted database read/write</td>
              <td class="p-3 text-right text-accent font-bold align-top">$500</td>
            </tr>
            <tr class="border-b border-border">
              <td class="p-3 text-white font-bold align-top" colspan="3">High</td>
            </tr>
            <tr class="border-b border-border">
              <td class="p-3 pl-6 text-gray-300 align-top">General PII leak</td>
              <td class="p-3 text-gray-400 align-top">Emails, phone numbers, or birthdays affecting 100+ users</td>
              <td class="p-3 text-right text-accent font-bold align-top">$300</td>
            </tr>
            <tr class="border-b border-border">
              <td class="p-3 pl-6 text-gray-300 align-top">SQL injection</td>
              <td class="p-3 text-gray-400 align-top">Confirmed injection against Postgres or Airtable with demonstrated data access</td>
              <td class="p-3 text-right text-accent font-bold align-top">$250</td>
            </tr>
            <tr class="border-b border-border">
              <td class="p-3 pl-6 text-gray-300 align-top">Privilege escalation</td>
              <td class="p-3 text-gray-400 align-top">Escalating to non-standard elevated privileges, or accessing another user's account</td>
              <td class="p-3 text-right text-accent font-bold align-top">$200</td>
            </tr>
            <tr class="border-b border-border">
              <td class="p-3 text-white font-bold align-top" colspan="3">Medium</td>
            </tr>
            <tr class="border-b border-border">
              <td class="p-3 pl-6 text-gray-300 align-top">Stored XSS</td>
              <td class="p-3 text-gray-400 align-top">Persistent script execution with demonstrated impact on other users</td>
              <td class="p-3 text-right text-accent font-bold align-top">$100</td>
            </tr>
            <tr class="border-b border-border">
              <td class="p-3 pl-6 text-gray-300 align-top">IDOR</td>
              <td class="p-3 text-gray-400 align-top">Direct object reference exposing or modifying another user's data</td>
              <td class="p-3 text-right text-accent font-bold align-top">$100</td>
            </tr>
            <tr class="border-b border-border">
              <td class="p-3 pl-6 text-gray-300 align-top">Limited PII leak</td>
              <td class="p-3 text-gray-400 align-top">Personal data affecting fewer than 50 users</td>
              <td class="p-3 text-right text-accent font-bold align-top">$75</td>
            </tr>
            <tr class="border-b border-border">
              <td class="p-3 text-white font-bold align-top" colspan="3">Low</td>
            </tr>
            <tr class="border-b border-border">
              <td class="p-3 pl-6 text-gray-300 align-top">Information disclosure</td>
              <td class="p-3 text-gray-400 align-top">Exposed config files, admin panels, internal paths, or stack traces</td>
              <td class="p-3 text-right text-accent font-bold align-top">$50</td>
            </tr>
            <tr class="border-b border-border">
              <td class="p-3 pl-6 text-gray-300 align-top">Reflected XSS / CSRF</td>
              <td class="p-3 text-gray-400 align-top">Non-persistent client-side vulnerabilities with limited impact</td>
              <td class="p-3 text-right text-accent font-bold align-top">$25</td>
            </tr>
            <tr class="border-b border-border">
                <td class="p-3 pl-6 text-gray-300 align-top">Open redirect</td>
                <td class="p-3 text-gray-400 align-top">Unvalidated redirects that could be used in phishing attacks</td>
                <td class="p-3 text-right text-accent font-bold align-top">$15</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="text-sm sm:text-base text-gray-400 mb-6 md:mb-8 font-mono leading-relaxed">Even if your report doesn't fit into the categories above, we may still consider it if it demonstrates a valid security issue with clear impact.</p>

      <h3 class="text-xl sm:text-2xl font-bold mb-3 md:mb-4">Quality Modifiers</h3>
      <p class="text-sm sm:text-base text-gray-400 mb-4 font-mono leading-relaxed">Your base payout is multiplied by a quality factor. A well-written report with clear reproduction steps helps us fix issues faster and earns you more.</p>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 md:mb-8">
        <div class="bg-surface-elevated border border-border p-4">
          <p class="text-lg font-bold text-accent mb-1">1.25x - Exceptional</p>
          <p class="text-sm text-gray-400 font-mono">Clear PoC, detailed impact analysis, and a git diff that fixes the vulnerability</p>
        </div>
        <div class="bg-surface-elevated border border-border p-4">
          <p class="text-lg font-bold text-white mb-1">1.0x - Standard</p>
          <p class="text-sm text-gray-400 font-mono">Working PoC with reproduction steps and impact description</p>
        </div>
        <div class="bg-surface-elevated border border-border p-4">
          <p class="text-lg font-bold text-white mb-1">0.8x - Low Quality</p>
          <p class="text-sm text-gray-400 font-mono">Incomplete report, vague or no PoC, or missing impact analysis</p>
        </div>
      </div>
      <h2 class="text-2xl sm:text-3xl font-bold mb-3 md:mb-4">Out of Scope</h2>
      <p class="text-sm sm:text-base text-gray-400 mb-4 md:mb-6 font-mono leading-relaxed">Consider the attack scenario and real world impact before reporting. Programs not participating in this program are out of scope, you're welcome to report issues, but payouts aren't guaranteed. The following are generally out of scope:</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 md:mb-8">
        <div class="bg-surface-elevated border border-border p-4">
          <p class="text-sm text-gray-400 font-mono">Scraping public Slack information or account enumeration</p>
        </div>
        <div class="bg-surface-elevated border border-border p-4">
          <p class="text-sm text-gray-400 font-mono">Brute force attacks</p>
        </div>
        <div class="bg-surface-elevated border border-border p-4">
          <p class="text-sm text-gray-400 font-mono">Clickjacking without significant impact</p>
        </div>
        <div class="bg-surface-elevated border border-border p-4">
          <p class="text-sm text-gray-400 font-mono">Automated scanner outputs without real world impact</p>
        </div>
        <div class="bg-surface-elevated border border-border p-4">
          <p class="text-sm text-gray-400 font-mono">Social engineering or phishing attacks</p>
        </div>
        <div class="bg-surface-elevated border border-border p-4">
          <p class="text-sm text-gray-400 font-mono">Self-exploitation requiring user interaction</p>
        </div>
        <div class="bg-surface-elevated border border-border p-4">
          <p class="text-sm text-gray-400 font-mono">Denial of Service causing resource exhaustion</p>
        </div>
        <div class="bg-surface-elevated border border-border p-4">
          <p class="text-sm text-gray-400 font-mono">Exploits related to Slack or other third-party services outside our control</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 md:mb-8">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold mb-3 md:mb-4">Our AI Policy</h2>
          <p class="text-sm sm:text-base text-gray-400 font-mono leading-relaxed mb-3">We support AI as a tool to improve your research, but submissions that rely solely on AI with no original testing or validation will be rejected.</p>
          <p class="text-sm sm:text-base text-gray-400 font-mono leading-relaxed">We value <span class="text-white">technical expertise, real evidence, and original research</span>. AI should support your work, not replace it.</p>
        </div>
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold mb-3 md:mb-4">Full Rules</h2>
          <p class="text-sm sm:text-base text-gray-400 font-mono leading-relaxed mb-4">This page serves as a quick overview. Read the complete program rules before submitting a report. Thank you for your interest, and we look forward to your submissions!</p>
          <NuxtLink to="/rules" class="inline-block px-4 py-2 bg-surface-elevated hover:bg-border border border-border font-mono text-sm transition-transform active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100">Read Full Rules →</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { loggedIn } = useUserSession();

useHead({
  title: "Aegis - Hack Club Bug Bounty Platform",
  meta: [
    {
      name: "description",
      content: "A security platform for Hack Club programs",
    },
    {
      property: "og:title",
      content: "Aegis - Hack Club Bug Bounty Platform",
    },
    {
      property: "og:description",
      content: "A security platform for Hack Club programs",
    },
    {
      property: "og:image",
      content: "/favicon.png",
    },
  ],
});
</script>
