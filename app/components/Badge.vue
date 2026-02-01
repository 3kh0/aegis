<template>
  <span :class="[cls, 'px-2 py-1 rounded text-xs font-medium']">
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup lang="ts">
const { sevCls, statCls } = useStyle();
const { statLabel } = useFormat();

const props = defineProps<{
  type: "severity" | "status";
  value: string;
}>();

const cls = computed(() => (props.type === "severity" ? sevCls(props.value) : statCls(props.value)));

const label = computed(() => (props.type === "severity" ? props.value : statLabel(props.value)));
</script>
