<template>
  <!-- Inspired by https://robinhood.com/login -->
  <svg v-if="!reduced" id="scene" viewBox="250 350 500 500" preserveAspectRatio="xMidYMid slice" style="position: fixed; inset: 0; width: 100%; height: 100%; background: #000; contain: layout style paint" />
</template>

<script setup>
const reduced = ref(false);

onMounted(() => {
  reduced.value = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced.value) return;
  const scene = document.getElementById("scene");
  const cx = 500,
    cy = 500;
  const squash = 0.6;
  const rings = [
    { r: 600, count: 50 },
    { r: 500, count: 45 },
    { r: 400, count: 40 },
    { r: 350, count: 35 },
    { r: 275, count: 30 },
    { r: 225, count: 25 },
    { r: 175, count: 25 },
    { r: 125, count: 25 },
    { r: 75, count: 25 },
  ];

  const dashes = [];
  const frag = document.createDocumentFragment();

  rings.forEach(({ r, count }) => {
    for (let i = 0; i < count; i++) {
      const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
      p.setAttribute("d", "M0.5 80 V100");
      p.setAttribute("stroke", "#fff");
      p.setAttribute("stroke-width", "1.5");
      p.setAttribute("stroke-linecap", "round");
      frag.appendChild(p);
      dashes.push({ el: p, r, base: (i / count) * Math.PI * 2 });
    }
  });
  scene.appendChild(frag);

  const speed = 0.00008;
  const t0 = performance.now();

  function frame(now) {
    const globalAngle = (now - t0) * speed;
    dashes.forEach(({ el, r, base }) => {
      // r available here
      const a = base + globalAngle;
      const x = cx + r * Math.cos(a);
      const y = cy + r * Math.sin(a) * squash;
      el.setAttribute("transform", `matrix(1 0 0 1 ${x} ${y})`);
    });
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
});
</script>
