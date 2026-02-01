<template>
  <div class="text-center py-16 text-white x" aria-live="polite">Loading...</div>
</template>

<style scoped>
.x {
  animation: x 1s infinite;
  animation-timing-function: ease-in-out;
}

@keyframes x {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
