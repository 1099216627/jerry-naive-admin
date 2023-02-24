<template>
  <n-card class="statistical-item">
    <div class="flex justify-between items-center">
      <div>
        <img class="ml-1" :src="item.icon" alt="" />
        <p class="pt-2.5 m-0">{{ item.title }}</p>
      </div>
      <p class="m-0 justify-end flex items-center h-1/2">{{ item.unit }}</p>
    </div>
    <div class="flex justify-between items-center">
      <h1 class="m-0">
        <n-number-animation :from="0" :to="item.value" ></n-number-animation>
      </h1>
      <n-tag type="success" round v-if="item.up">{{ item.percentage }}%</n-tag>
      <n-tag type="error" round v-else> {{ item.percentage }}% </n-tag>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { CardItem } from "@/views/dashboard/console/config";
import { PropType } from "vue";

defineProps({
  item: {
    type: Object as PropType<CardItem>,
    required: true,
  },
});
</script>
