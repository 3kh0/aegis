<template>
  <button class="w-full text-gray-400 text-sm italic hover:text-gray-300 transition-colors cursor-pointer" @click="n">
    {{ x }}
  </button>
</template>

<script setup lang="ts">
const q = ["A ship is safe in harbor, but that's not what ships are built for", "Knowledge is power, but sharing is responsibility", "Every vulnerability is a lesson waiting to be learned"];

const y = ref(Math.floor(Math.random() * q.length));
const x = computed(() => q[y.value]);

function n() {
  y.value = (y.value + 1) % q.length;
}
</script>
