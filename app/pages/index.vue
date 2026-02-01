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
      <p class="text-base sm:text-md md:text-lg text-gray-400 mb-6 md:mb-8 font-mono">All Hack Club programs are under this security program. Here are some of our best programs to hack on:</p>
      <div class="mb-6 md:mb-8">
        <ProgramGrid />
      </div>
      <p class="text-base sm:text-md md:text-lg text-gray-400 mb-6 md:mb-8 font-mono">We have more than 100+ programs in total, you can view all of them on the <NuxtLink to="/programs" class="text-accent underline">programs page</NuxtLink>.</p>
      <h2 class="text-2xl sm:text-3xl font-bold mb-3 md:mb-4">Payout Tiers</h2>
      <p class="text-base sm:text-md md:text-lg text-gray-400 mb-8 font-mono">As a thank you for helping us keep Hack Club secure, we are offering bounties for finding vulnerabilities in our systems. The payouts are based on the severity of the vulnerability and the impact it has on our users.</p>
      <h2 class="text-2xl sm:text-3xl font-bold mb-3 md:mb-4">Out of Scope</h2>
      <p class="text-base sm:text-md md:text-lg text-gray-400 mb-2 md:mb-4 font-mono">When reporting vulnerabilities, please consider possible attack scenario, and potential impact. Also note that any program not participating in this program is out of scope. While you are welcome to report issues regarding them, you are not guaranteed a payout. The following issues are generally considered to be out of scope (not a complete list):</p>
      <ul class="text-base sm:text-md md:text-lg list-disc pl-6 text-gray-400 mb-6 md:mb-8 font-mono">
        <li>Scraping public Slack information or account enumeration</li>
        <li>Brute force attacks</li>
        <li>Clickjacking without significant impact</li>
        <li>Automated scanner outputs without real-world impact</li>
        <li>Social engineering or phishing attacks</li>
        <li>Self-exploitation requiring user interaction</li>
        <li>Denial of Service causing resource exhaustion</li>
        <li>Exploits related to the Slack or other third-party services that are out of our control</li>
      </ul>
      <h2 class="text-2xl sm:text-3xl font-bold mb-3 md:mb-4">Our AI Policy</h2>
      <p class="text-base sm:text-md md:text-lg text-gray-400 mb-8 font-mono">Bounty programs all around have seen AI-generated submissions that lack any real-world impact. While we support the use of AI as a tool to help improve your report, submissions that rely solely on AI, with no original researcher input, testing, or validation will be rejected and not considered for bounties. We value technical expertise, real evidence and original research. AI should support your research, not replace it.</p>
      <h2 class="text-2xl sm:text-3xl font-bold mb-3 md:mb-4">Full Rules</h2>
      <p class="text-base sm:text-md md:text-lg text-gray-400 mb-8 font-mono">This page is just a quick overview of our bounty program. The full rules can be found on the <NuxtLink to="/rules" class="underline">rules page</NuxtLink>. Please read the full rules before submitting a report. Thank you for your interest, and we look forward to your submissions!</p>
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
