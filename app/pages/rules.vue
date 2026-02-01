<template>
  <div class="bg-surface border-l border-r border-border p-4 text-sm text-gray-300 space-y-4 max-w-4xl mx-auto">
    <h1 class="text-white font-semibold text-2xl text-center my-4 font-display">Hack Club Rules of Engagement</h1>

    <p>Hack Club is built on the principles of respect and trust, and we expect all members to follow these rules when responsibly disclosing security vulnerabilities. We also hold ourselves to the same standards, as respect is a two-way street.</p>

    <p>When we refer to "we" as a security team, we are referring to the Hack Club Security Team. "Aegis" is the name of our web platform, but can also refer to the team itself.</p>

    <h2 class="text-white font-semibold text-lg">1. You as a researcher</h2>
    <p>As a researcher, you are expected to follow these rules when responsibly disclosing security vulnerabilities.</p>
    <ul class="list-disc list-inside space-y-2 ml-4">
      <li><strong>Respect the rules.</strong> Operate within the rules set forth by each program, or speak up if in strong disagreement with the rules.</li>
      <li><strong>Respect privacy.</strong> Make a good faith effort not to access or destroy another user's data or other sensitive information.</li>
      <li><strong>Be patient.</strong> Make a good faith effort to clarify and support your reports upon request.</li>
      <li><strong>Do no harm.</strong> Act for the common good through the prompt reporting of all found vulnerabilities. Never willfully exploit others without their permission.</li>
    </ul>

    <h2 class="text-white font-semibold text-lg">2. We as a security team</h2>
    <p>We also hold ourselves to the equivalent standards.</p>
    <ul class="list-disc list-inside space-y-2 ml-4">
      <li><strong>Prioritize security.</strong> Make a good faith effort to resolve reported security issues in a prompt and transparent manner.</li>
      <li><strong>Respect finders.</strong> Give finders public recognition for their contributions.</li>
      <li><strong>Reward research.</strong> Financially incentivize security research when appropriate.</li>
      <li><strong>Do no harm.</strong> Not take unreasonable punitive actions against finders, like making legal threats or referring matters to law enforcement.</li>
    </ul>

    <h2 class="text-white font-semibold text-lg">3. Programs</h2>
    <p>Hack Club often has multiple programs running at the same time, each with their own rules and guidelines for how to handle security vulnerabilities. This document serves as a baseline for all programs and as the default rules for when a program has not defined its own.</p>
    <p><strong>Note:</strong> Programs are free to define their own rules and guidelines, and those rules and guidelines will take precedence over this document. In the event of a dispute of the program's rules and guidelines, the Hack Club Security Team will be the final arbiter.</p>

    <h2 class="text-white font-semibold text-lg">4. Safe Harbor</h2>
    <p>Safe Harbor means we support the protection of organizations and hackers engaged in Good Faith Security Research. “Good Faith Security Research” is accessing a computer solely for purposes of good-faith testing, investigation, and/or correction of a security flaw or vulnerability, where such activity is carried out in a manner designed to avoid any harm to individuals or the public, and where the information derived from the activity is used primarily to promote the security or safety of the class of devices, machines, or online services to which the accessed computer belongs, or those who use such devices, machines, or online services.</p>
    <p>This means that, for activity conducted while this program is active, we:</p>
    <ul class="list-disc list-inside space-y-2 ml-4">
      <li>Will not bring legal action against you or report you for Good Faith Security Research, including for bypassing technological measures we use to protect the applications in scope; and,</li>
      <li>Will take steps to make known that you conducted Good Faith Security Research if someone else brings legal action against you.</li>
    </ul>

    <h2 class="text-white font-semibold text-lg">5. Conflicts of Interest</h2>
    <p>Having a conflict of interest means that you have a personal stake in the program or have access to information that would be a unfair advantage to other researchers. You are ineligible for bounties if you:</p>
    <ul class="list-disc list-inside space-y-2 ml-4">
      <li>Are currently, or within the past 6 months have been, an employee, contractor, intern, or vendor of the program you are reporting to</li>
      <li>Are an immediate family member or cohabitant of any such person</li>
      <li>Found the bug due to insider access, rather than independent research that could be performed by anyone</li>
    </ul>
    <p>If you have any relationship with Hack Club or a program that could be perceived as a conflict, please disclose it in your report. Programs may define additional restrictions at their discretion.</p>

    <h2 class="text-white font-semibold text-lg">6. Payments</h2>
    <p>Some programs may offer bounties for security research, while others may not. It is up to the program to decide whether or not to offer bounties.</p>
    <p>If a program chooses to offer bounties, Aegis will handle the payment of bounties to the researcher. The researcher can choose to receive the bounty in the following ways:</p>
    <ul class="list-disc list-inside space-y-2 ml-4">
      <li>ACH transfer (limited to US residents)</li>
      <li>Mailed check (limited to US residents)</li>
      <li><a href="https://wise.com" target="_blank" class="underline">Wise transfer*</a></li>
      <li>Cryptocurrency**</li>
      <li>Donation to a nonprofit on your behalf</li>
      <li><a href="https://zelle.com" target="_blank" class="underline">Zelle</a></li>
    </ul>
    <p>* We offer Wise as an option for researchers abroad. Wise is a global partner that often supports local payment methods (e.g., UPI in India, Interac in Canada, Alipay and WeChat Pay in China, etc.) which can be cheaper than traditional bank transfers. We also support paying out to a Wise username. Wise charges transaction fees on all transfers; you are responsible for these fees. For example, if the Wise fee on a transfer is 1% and your bounty is $100, you will receive $99. Please confirm your payment method before submitting your report.</p>
    <p>** Cryptocurrency is offered via <a href="https://www.coinbase.com" target="_blank" class="underline">Coinbase</a> and <a href="https://www.kraken.com" target="_blank" class="underline">Kraken</a>. Only assets that are listed by these platforms will be available. All payouts done in USDC will be free minus any applicable gas fees (average gas fee is less than $0.10), while all other coins will be subject to a 1% trading fee charged by the exchange.</p>
    <p>Because we're based in the United States, we aren't able to pay bounties to residents or those who report vulnerabilities from a country against which the United States has trade restrictions or export sanctions as determined by the <a href="https://ofac.treasury.gov/" target="_blank" class="underline">U.S. Office of Foreign Assets Control (OFAC)</a>.</p>
    <p>All payouts are priced in U.S. dollars (USD). You are responsible for the tax consequences of any bounty you receive, as determined by your local tax laws.</p>

    <h2 class="text-white font-semibold text-lg">7. Contact</h2>
    <p>We are always open to questions or concerns. Please contact us at <a href="mailto:security@hackclub.com" class="underline">security@hackclub.com</a>.</p>

    <p class="text-gray-500 text-xs pt-4 border-t border-border">Last updated: Jan 2026</p>
  </div>
</template>

<script setup>
useHead({
  title: "Hack Club Rules of Engagement",
  meta: [
    {
      name: "description",
      content: "Hack Club Rules of Engagement",
    },
  ],
});
</script>
