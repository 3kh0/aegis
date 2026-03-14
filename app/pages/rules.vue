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

    <h2 class="text-white font-semibold text-lg">7. Payout Tiers</h2>
    <p>Payouts are based on demonstrated real world impact, not theoretical risk. All reports must include a valid proof of concept and clear impact analysis to qualify. The following section outlines the base payout for each vulnerability category. Find the row that matches your finding, that's your base payout before quality modifiers are applied.</p>
    <p><strong>Note:</strong> These tiers represent default payouts. Individual programs may define their own payout structures that override these defaults. If a program does not specify its own tiers, these will apply.</p>

    <h3 class="text-white font-semibold text-base mt-4">Critical</h3>
    <p>Critical vulnerabilities pose an immediate and severe threat to the confidentiality, integrity, or availability of production systems and user data at scale.</p>
    <ul class="list-disc list-inside space-y-2 ml-4">
      <li>
        <strong>Remote code execution - <span class="text-accent">$1,000</span>.</strong> Root or unprivileged shell on a production server. This includes command injection, deserialization attacks, or any vector that achieves arbitrary code execution on infrastructure we operate. Containerized RCE (within Docker or other containers) may qualify at a reduced payout depending on the level of access achieved and whether container escape is possible.
      </li>
      <li>
        <strong>Mass sensitive PII leak - <span class="text-accent">$750</span>.</strong> Unauthorized access to legal IDs, identity verification documents, physical addresses, or similarly sensitive personal information affecting 150 or more users. The data must be demonstrably accessible, theoretical access without a working proof of concept does not qualify. Partial access to sensitive fields (e.g., last four digits of an ID) may qualify at a reduced payout.
      </li>
      <li>
        <strong>Full admin takeover - <span class="text-accent">$500</span>.</strong> Authentication bypasses that grant full admin rights to a program's backend interface, or unrestricted read/write access to production databases. This includes bypassing MFA, forging admin sessions, or exploiting flaws in role-based access control that result in complete privilege escalation to the highest available role.
      </li>
    </ul>

    <h3 class="text-white font-semibold text-base mt-4">High</h3>
    <p>High severity vulnerabilities allow significant unauthorized access to user data or system functionality, but are more limited in scope or require additional conditions compared to critical issues.</p>
    <ul class="list-disc list-inside space-y-2 ml-4">
      <li>
        <strong>General PII leak - <span class="text-accent">$300</span>.</strong> Unauthorized access to emails, phone numbers, birthdays, or comparable personal information affecting 100 or more users. The leaked data must go beyond what is publicly available or intentionally shared by users. Enumeration of publicly visible profiles does not qualify.
      </li>
      <li>
        <strong>SQL injection - <span class="text-accent">$250</span>.</strong> Confirmed SQL injection against Postgres, Airtable, or any other data store with demonstrated data access. Your report must include the exact injection point, the payload used, and evidence of data retrieved. Blind SQL injection qualifies if you can demonstrate data exfiltration.
      </li>
      <li>
        <strong>Privilege escalation - <span class="text-accent">$200</span>.</strong> Escalating from a standard user role to non-standard elevated privileges, or accessing another user's account or session. This includes horizontal privilege escalation (accessing peer accounts) and vertical escalation (gaining higher roles). Authentication bypass that grants access to a single non-admin account also falls in this category.
      </li>
    </ul>

    <h3 class="text-white font-semibold text-base mt-4">Medium</h3>
    <p>Medium severity vulnerabilities have a real but more contained impact, typically affecting individual users or requiring specific conditions to exploit.</p>
    <ul class="list-disc list-inside space-y-2 ml-4">
      <li>
        <strong>Stored XSS - <span class="text-accent">$100</span>.</strong> Persistent script execution that runs in the context of other users' browsers. Your report must demonstrate impact beyond a simple alert box - show how the payload could be used to steal sessions, exfiltrate data, or perform actions on behalf of other users. XSS limited to the attacker's own session (self-XSS) does not qualify.
      </li>
      <li>
        <strong>IDOR - <span class="text-accent">$100</span>.</strong> Insecure direct object references that allow reading, modifying, or deleting another user's data by manipulating identifiers (e.g., changing a user ID or object ID in an API request). The affected data must be non-public. Access to your own data via alternate paths does not qualify.
      </li>
      <li>
        <strong>Limited PII leak - <span class="text-accent">$75</span>.</strong> Unauthorized access to personal data affecting fewer than 50 users. The same data sensitivity standards apply as the higher tiers, the data must not be publicly available or intentionally shared.
      </li>
    </ul>

    <h3 class="text-white font-semibold text-base mt-4">Low</h3>
    <p>Low severity vulnerabilities have minimal direct impact but may contribute to a broader attack chain or indicate security weaknesses worth addressing.</p>
    <ul class="list-disc list-inside space-y-2 ml-4">
      <li>
        <strong>Information disclosure - <span class="text-accent">$50</span>.</strong> Exposed configuration files, admin panels, internal paths, stack traces, debug endpoints, or verbose error messages that reveal implementation details. The disclosed information must be useful to an attacker in a way that even if the code is open source a advantage is gained, generic version numbers, or publicly documented endpoints do not qualify.
      </li>
      <li>
        <strong>Reflected XSS / CSRF - <span class="text-accent">$25</span>.</strong> Non-persistent client-side vulnerabilities with limited impact. Reflected XSS must execute in the context of another user via a crafted URL. CSRF must demonstrate a state-changing action (e.g., changing account settings) that can be triggered without the victim's knowledge. Login/logout CSRF does not qualify.
      </li>
      <li>
        <strong>Open redirect - <span class="text-accent">$15</span>.</strong> Unvalidated redirects that could be used in phishing attacks. The redirect must originate from a Hack Club domain and be exploitable without additional user interaction beyond clicking a link. Redirects that only work with user-controlled parameters already visible in the URL bar have reduced impact.
      </li>
    </ul>

    <p>Even if your finding doesn't fit neatly into the categories above, we may still consider it if it demonstrates a valid security issue with clear, real world impact. When in doubt, submit the report - we'd rather review an edge case than miss a legitimate vulnerability.</p>

    <h2 class="text-white font-semibold text-lg">8. Quality Modifiers</h2>
    <p>Your base payout is multiplied by a quality factor based on the overall quality of your report. A well-written report with clear reproduction steps helps us fix issues faster and earns you more. The quality assessment is made by the triaging security team member and is based on the following criteria:</p>
    <ul class="list-disc list-inside space-y-2 ml-4">
      <li><strong class="text-accent">1.25x - Exceptional.</strong> Clear and working proof of concept, detailed impact analysis explaining what an attacker could achieve, and a git diff or concrete remediation suggestion that fixes the vulnerability. The report is well-structured, easy to follow, and requires minimal back-and-forth from the security team.</li>
      <li><strong>1.0x - Standard.</strong> Working proof of concept with step-by-step reproduction instructions and a description of the impact. The report contains enough information for the security team to reproduce and understand the issue without significant additional effort.</li>
      <li><strong>0.8x - Low Quality.</strong> Incomplete report with a vague or missing proof of concept, unclear reproduction steps, or missing impact analysis. Reports that require significant back-and-forth to understand or reproduce fall into this category. We strongly encourage improving your report before submission to avoid this modifier.</li>
    </ul>
    <p><strong>Example:</strong> A confirmed SQL injection (base $250) submitted with a detailed PoC, full impact analysis, and a patch would earn 250 × 1.25 = <strong class="text-accent">$312.50</strong>. The same finding submitted with a vague description and no PoC would earn 250 × 0.8 = <strong>$200</strong>.</p>

    <h2 class="text-white font-semibold text-lg">9. Reporting Requirements</h2>
    <p>To be eligible for a payout, your report must include the following at a minimum:</p>
    <ul class="list-disc list-inside space-y-2 ml-4">
      <li><strong>Description:</strong> A clear summary of the vulnerability, including the affected component, endpoint, or system.</li>
      <li><strong>Proof of Concept:</strong> A working PoC that demonstrates the vulnerability. This can be a script, a series of HTTP requests, screenshots with timestamps, or a screen recording. The PoC must be reproducible by the security team.</li>
      <li><strong>Impact Statement:</strong> A description of what an attacker could achieve by exploiting the vulnerability and who is affected (e.g., all users, admins only, users of a specific program).</li>
    </ul>
    <p>Reports that are missing critical information may be returned to you for clarification or have a reduced payout. Duplicate reports are resolved in favor of first in best dressed.</p>

    <h2 class="text-white font-semibold text-lg">10. Out of Scope</h2>
    <p>Consider the attack scenario and real world impact before reporting. Programs not participating in this program are out of scope, you're welcome to report issues on non-participating programs, but payouts aren't guaranteed. The following are generally considered out of scope across all programs:</p>
    <ul class="list-disc list-inside space-y-2 ml-4">
      <li><strong>Scraping or enumeration:</strong> Scraping publicly available Slack information, account enumeration via login or signup forms, or any technique that only reveals whether an account exists.</li>
      <li><strong>Brute force attacks:</strong> Credential stuffing, password spraying, or any brute force attack against authentication endpoints.</li>
      <li><strong>Clickjacking without significant impact:</strong> Clickjacking on pages that do not perform sensitive actions. Clickjacking on login pages, settings pages, or pages that trigger state changes may qualify if impact is demonstrated.</li>
      <li><strong>Automated scanner outputs:</strong> Reports generated entirely by automated tools (e.g., Nessus, Burp Scanner, Nuclei) without manual verification or demonstrated real world impact.</li>
      <li><strong>Social engineering or phishing:</strong> Attacks that rely on tricking Hack Club staff or members into performing actions. This includes vishing, smishing, and pretexting.</li>
      <li><strong>Self-exploitation:</strong> Vulnerabilities that only affect the attacker's own account or require the victim to perform unusual actions (e.g., pasting attacker-supplied code into their browser console).</li>
      <li><strong>Denial of Service:</strong> Attacks causing resource exhaustion, including application-layer DoS, network flooding, or any attack designed to make a service unavailable rather than to access data.</li>
      <li><strong>Third-party service exploits:</strong> Vulnerabilities in Slack, GitHub, or other third-party services that Hack Club uses but does not control. Report these to the respective vendor.</li>
      <li><strong>Missing security headers:</strong> Reports about missing HTTP headers (e.g., X-Frame-Options, HSTS) without a demonstrated exploit chain.</li>
      <li><strong>SSL/TLS configuration:</strong> Weak cipher suites or certificate issues without demonstrated impact.</li>
      <li><strong>Rate limiting:</strong> Absence of rate limiting on non-sensitive endpoints without demonstrated abuse potential.</li>
    </ul>

    <h2 class="text-white font-semibold text-lg">11. AI Policy</h2>
    <p>We support AI as a tool to enhance your security research. AI-assisted reconnaissance, payload generation, and report drafting are all acceptable uses. However, submissions that rely solely on AI-generated output with no original testing, validation, or human analysis will be rejected.</p>
    <p>We value <strong class="text-white">technical expertise, real evidence, and original research</strong>. AI should support your work, not replace it. If we determine that a report was generated entirely by an AI tool without meaningful human review, it will be closed as informative and will not qualify for a payout.</p>

    <h2 class="text-white font-semibold text-lg">12. Contact</h2>
    <p>We are always open to questions or concerns. Please contact us at <a href="mailto:security@hackclub.com" class="underline">security@hackclub.com</a>.</p>

    <p class="text-gray-500 text-xs pt-4 border-t border-border">Last updated: Mar 2026</p>
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
