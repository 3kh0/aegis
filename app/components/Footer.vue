<template>
  <footer class="border-t border-border bg-surface">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <p class="text-sm text-gray-400 flex flex-wrap items-center gap-2">
        <a href="https://hackclub.com" target="_blank" class="hover:text-accent inline-flex items-center gap-1 transition">
          <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0C2.4 0 0 2.4 0 12s2.4 12 12 12s12-2.4 12-12S21.6 0 12 0m4.5 19.51h-3.31v-6.507c0-.975-.187-1.622-.834-1.622c-.712 0-1.575 1.003-1.575 2.625v5.503H7.5V4.97l3.29-.563v5.428c.713-.646 1.707-.928 2.72-.928c2.156 0 2.99 1.416 2.99 3.628z" /></svg>
          Aegis is a project by Hack Club
        </a>
        <span>|</span>
        <a href="https://github.com/hackclub/aegis" target="_blank" class="hover:text-accent inline-flex items-center gap-1 transition">
          <Icon name="tabler:brand-github" size="16px" />
          hackclub/aegis
        </a>
        <span>|</span>
        <NuxtLink to="/security" class="hover:text-accent inline-flex items-center gap-1 transition">
          <Icon name="tabler:shield" size="16px" />
          Security
        </NuxtLink>
        <span>|</span>
        <NuxtLink to="/privacy" class="hover:text-accent inline-flex items-center gap-1 transition">
          <Icon name="tabler:lock" size="16px" />
          Privacy
        </NuxtLink>
        <span>|</span>
        <NuxtLink to="/rules" class="hover:text-accent inline-flex items-center gap-1 transition">
          <Icon name="tabler:file" size="16px" />
          Rules
        </NuxtLink>
        <span>|</span>
        <a href="https://hcb.hackclub.com/hack-club-security/transactions" target="_blank" class="hover:text-accent inline-flex items-center gap-1 transition">
          <Icon name="tabler:building-bank" size="16px" />
          Financials
        </a>
      </p>
    </div>
  </footer>
</template>
