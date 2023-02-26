<template>
  <div>
    <n-alert class="mt-2 mb-2" type="warning">
      当前页所有数据均为模拟数据，不涉及任何真实业务。
    </n-alert>
    <n-grid
      :x-gap="12"
      :y-gap="8"
      cols="1 s:2 m:3 l:4 xl:4 2xl:4"
      responsive="screen"
    >
      <n-grid-item v-for="item in cardConfig" :key="item.key">
        <statistical-item :item="item"></statistical-item>
      </n-grid-item>
    </n-grid>
    <n-grid
      class="mt-2"
      :x-gap="12"
      :y-gap="8"
      responsive="screen"
      cols="1 l:2 xl:2 2xl:2"
    >
      <n-grid-item>
        <base-echarts title="访问量" :options="visitsOptions"></base-echarts>
      </n-grid-item>
      <n-grid-item>
        <base-echarts title="区域排行" :options="areaOptions"></base-echarts>
      </n-grid-item>
      <n-grid-item>
        <base-echarts title="销售额" :options="saleOptions"></base-echarts>
      </n-grid-item>
      <n-grid-item>
        <base-echarts title="访问来源" :options="accessOptions"></base-echarts>
      </n-grid-item>
    </n-grid>
  </div>
</template>
<script lang='ts'>
 export default {
    name:"console"
 }
</script>
<script setup lang="ts">
import StatisticalItem from "@/views/dashboard/console/components/statistical-item.vue";
import BaseEcharts from "@/components/base-echarts/index.vue";
import {
  cardConfig,
  visitsOptions,
  areaOptions,
  saleOptions,
  accessOptions,
} from "@/views/dashboard/console/config";
</script>

<style scoped></style>
