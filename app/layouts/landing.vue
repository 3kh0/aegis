<template>
  <div class="relative min-h-screen text-white flex flex-col">
    <NotProd />
    <canvas v-if="!reduced" ref="canvas" class="absolute top-10 left-0 w-full max-h-screen -z-10" />
    <Nav class="relative z-50" />
    <main class="flex-1 relative z-10 flex items-center justify-center">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
const canvas = ref(null);
const reduced = ref(false);

class Dot {
  x;
  y;
  z;
  xProject = 0;
  yProject = 0;
  sizeProjection = 0;

  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  project(sin, cos, centerZ, fov, cx, cy) {
    const rotX = cos * this.x + sin * (this.z - centerZ);
    const rotZ = -sin * this.x + cos * (this.z - centerZ) + centerZ;
    this.sizeProjection = fov / (fov - rotZ);
    this.xProject = rotX * this.sizeProjection + cx;
    this.yProject = this.y * this.sizeProjection + cy;
  }

  draw(ctx, sin, cos, centerZ, fov, cx, cy, radius) {
    this.project(sin, cos, centerZ, fov, cx, cy);
    ctx.beginPath();
    ctx.arc(this.xProject, this.yProject, radius * this.sizeProjection, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
}

onMounted(() => {
  reduced.value = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced.value) return;

  const el = canvas.value;
  if (!el) return;

  const ctx = el.getContext("2d");
  if (!ctx) return;

  let w = el.clientWidth;
  let h = el.clientHeight;
  let dots = [];
  let animId;

  const resize = () => {
    w = el.clientWidth;
    h = Math.max(600, Math.min(el.clientWidth, window.innerHeight));
    el.style.height = `${h}px`;
    const dpr = window.devicePixelRatio > 1 ? 2 : 1;
    el.width = w * dpr;
    el.height = h * dpr;
    ctx.scale(dpr, dpr);
    createDots();
  };

  const createDots = () => {
    dots = [];
    const r = Math.min(w, h) * 0.7;
    const centerZ = -r;
    for (let i = 0; i < 1000; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(Math.random() * 2 - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + centerZ;
      dots.push(new Dot(x, y, z));
    }
  };

  const render = (t) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";

    const r = Math.min(w, h) * 0.7;
    const centerZ = -r;
    const fov = w * 0.8;
    const cx = w / 2;
    const cy = Math.min(h / 2, r);
    const rot = t * 0.0004;
    const sin = Math.sin(rot);
    const cos = Math.cos(rot);

    for (const d of dots) {
      d.draw(ctx, sin, cos, centerZ, fov, cx, cy, 4);
    }

    animId = requestAnimationFrame(render);
  };

  resize();
  window.addEventListener("resize", resize);
  animId = requestAnimationFrame(render);

  onUnmounted(() => {
    cancelAnimationFrame(animId);
    window.removeEventListener("resize", resize);
  });
});
</script>
