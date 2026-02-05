import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  css: ["~/css/main.css"],
  vite: {
    plugins: [
      tailwindcss(),
      {
        apply: "build", // https://github.com/tailwindlabs/tailwindcss/discussions/16119
        name: "vite-plugin-ignore-sourcemap-warnings",
        configResolved(config) {
          const x = config.build.rollupOptions.onwarn;
          config.build.rollupOptions.onwarn = (warning, warn) => {
            if (warning.code === "SOURCEMAP_BROKEN" && warning.plugin === "@tailwindcss/vite:generate:build") {
              return;
            }
            if (x) {
              x(warning, warn);
            } else {
              warn(warning);
            }
          };
        },
      },
    ],
  },

  modules: ["@nuxt/eslint", "@nuxt/fonts", "@nuxt/icon", "nuxt-auth-utils", "@sentry/nuxt/module"],

  app: {
    head: {
      title: "Aegis - Hack Club Bug Bounty Platform",
      meta: [
        {
          name: "description",
          content: "Submit bug reports on Hack Club programs",
        },
        {
          property: "og:title",
          content: "Aegis - Hack Club Bug Bounty Platform",
        },
        {
          property: "og:description",
          content: "Submit bug reports on Hack Club programs",
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          name: "twitter:card",
          content: "summary",
        },
        {
          name: "twitter:title",
          content: "Aegis - Hack Club Bug Bounty Platform",
        },
        {
          name: "twitter:description",
          content: "Submit bug reports on Hack Club programs",
        },
      ],
      htmlAttrs: {
        lang: "en",
      },
    },
  },

  runtimeConfig: {
    resendApiKey: process.env.NUXT_RESEND_API_KEY,
    emailFrom: "Aegis <outbin@outbound.3kh0.net>",
    siteUrl: "http://localhost:3000",
    sessionPassword: process.env.NUXT_SESSION_PASSWORD,
    hackclub: {
      clientId: process.env.NUXT_HACKCLUB_CLIENT_ID,
      clientSecret: process.env.NUXT_HACKCLUB_CLIENT_SECRET,
    },
    slack: {
      clientId: String(process.env.NUXT_SLACK_CLIENT_ID || ""),
      clientSecret: String(process.env.NUXT_SLACK_CLIENT_SECRET || ""),
      botToken: String(process.env.NUXT_SLACK_BOT_TOKEN || ""),
    },
    r2: {
      accountId: process.env.NUXT_R2_ACCOUNT_ID,
      accessKeyId: process.env.NUXT_R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.NUXT_R2_SECRET_ACCESS_KEY,
      bucketName: process.env.NUXT_R2_BUCKET_NAME,
      encryptionKey: process.env.NUXT_R2_ENCRYPTION_KEY,
    },
    public: {
      live: process.env.IN_BETA === "true",
      sentry: {
        dsn: process.env.SENTRY_DSN,
      },
    },
  },

  nitro: {
    externals: {
      traceInclude: ["./server/generated/prisma"],
    },
    experimental: {
      database: true,
    },
  },

  sentry: {
    org: "hack-club",
    project: "aegis-web",
    autoInjectServerSentry: "top-level-import",
  },

  sourcemap: {
    client: "hidden",
  },

  routeRules: {
    "/": { appLayout: "landing" },
    "/auth/**": { appLayout: "auth" },
    "/*/report": { appLayout: false },
    "/other/report": { appLayout: false },
  },
});
