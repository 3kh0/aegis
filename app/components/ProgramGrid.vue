<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
    <NuxtLink v-for="p in programs" :key="p.title" :to="`/${p.slug}`" class="group relative overflow-hidden rounded-xl border border-border p-6 text-white transition-transform hover:scale-102 block">
      <img :src="p.bgImg" alt="program background" class="absolute inset-0 object-cover w-full h-full z-0" />
      <div class="absolute inset-0 bg-black/80 group-hover:bg-black/60 transition-colors z-10" />
      <div class="relative z-20">
        <div class="flex items-center gap-3 mb-4">
          <img :src="p.icon" :alt="p.title" class="w-10 h-10 rounded" />
          <h3 class="text-xl font-display font-bold">{{ p.title }}</h3>
        </div>
        <p class="text-sm text-white/80 leading-relaxed">{{ p.desc }}</p>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const programs = [
  {
    slug: "campfire",
    icon: "https://cdn.hackclub.com/019c1a5b-8890-798a-b45b-f0716e8841ec/campfire-square.png",
    title: "Campfire",
    desc: "A worldwide game jam happening in 200+ cities on February 28th & March 1st. Find an event in your city!",
    bgImg: "https://cdn.hackclub.com/019c1a5b-ba5f-7788-9e7b-6031518095bb/campfire.png",
  },
  {
    slug: "shipwrecked",
    icon: "https://cdn.hackclub.com/019c1a5c-9133-7dd8-a21f-91840ff41099/2026_02_01_0ln_Kleki.png",
    title: "Shipwrecked",
    desc: "Shipwrecked is a game jam where you build a game in 48 hours.",
    bgImg: "https://cdn.hackclub.com/019c1a5d-841d-7558-97f9-89402e831f58/2026_02_01_0lo_Kleki.png",
  },
  {
    slug: "slack",
    icon: "https://cdn.hackclub.com/019c1a5e-1a3f-78bf-b317-d341398b7c5b/image.png",
    title: "Hack Club Slack",
    desc: "Join the Slack to find the community for your favorite programming language, ask for advice, or just hang out.",
    bgImg: "https://cdn.hackclub.com/019c1a5e-a76f-7b1a-8a9b-0db3bc1f9d13/ddsad.png",
  },
  {
    slug: "blueprint",
    icon: "https://cdn.hackclub.com/019c1a5f-6a2a-78c1-9e14-0d67623edf91/icon.png",
    title: "Blueprint",
    desc: "Build cool hardware projects (or learn how to) and get up to $400 to make them real!",
    bgImg: "https://cdn.hackclub.com/019c1a60-75a5-7de7-a49d-62c62fb06f32/2026_02_01_0ls_Kleki.png",
  },
  {
    slug: "clubs",
    icon: "https://assets.hackclub.com/icon-rounded.png",
    title: "Hack Clubs",
    desc: "Don't run your coding club alone. Make it a Hack Club and get free meeting content, stickers, and digital tools.",
    bgImg: "https://cdn.hackclub.com/019c1a61-3c88-745c-9460-f72839879c6f/2026_02_01_0ls_Kleki.png",
  },
  {
    slug: "boba",
    icon: "https://cdn.hackclub.com/019c1a61-d3ae-7f48-911d-d897225b1e7f/2026_02_01_0lt_Kleki.png",
    title: "Boba Drops",
    desc: "Build your first website to get a free boba tea, or run a workshop to help others build theirs!",
    bgImg: "https://cdn.hackclub.com/019c1a62-3de9-7498-a2c8-32515c55ef0f/2026_02_01_0lu_Kleki.png",
  },
];
</script>
