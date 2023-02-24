<template>
  <n-card :title="title">
    <div ref="chartRef" :style="{ height, width }"></div>
  </n-card>
</template>

<script setup lang="ts">
import { onMounted, Ref, ref } from "vue";
import { useEcharts } from "@/hooks/web/use-echarts";
const props = defineProps({
  height: {
    type: String,
    default: "300px",
  },
  width: {
    type: String,
    default: "100%",
  },
  title: {
    type: String,
    default: "访问量",
  },
  options: {
    type: Object,
    default: () => ({}),
  },
});

const chartRef = ref<HTMLDivElement | null>(null);
const { setOptions } = useEcharts(chartRef as Ref<HTMLDivElement>);
onMounted(() => {
  setOptions(props.options);
});
</script>

<style scoped></style>
