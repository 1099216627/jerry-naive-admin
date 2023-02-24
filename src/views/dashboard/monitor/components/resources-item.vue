<template>
  <n-card hoverable bordered class="p-5" style="height: 150px">
    <div class="flex items-center">
      <img
        style="width: 30px; height: 30px"
        class="rounded-full"
        :src="item.cover"
        alt=""
      />
      <n-ellipsis
        class="ml-4 text-lg cursor-pointer"
        @click.capture="handleClick(item.url)"
        >{{ item.name }}</n-ellipsis
      >
    </div>
    <n-ellipsis :line-clamp="3" class="text-xs text-gray-500 leading-5 pt-2">
      {{ item.description }}
    </n-ellipsis>
  </n-card>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { useMessage } from "naive-ui";
import { IRessource } from "@/views/system/resources/types/resource-type";
const message = useMessage();
defineProps({
  item: {
    type: Object as PropType<IRessource>,
    required: true,
  },
});
const handleClick = (url: string) => {
  if (!url) {
    message.warning("暂未开放");
    return;
  }
  window.open(url, "_blank");
};
</script>

<style scoped></style>
