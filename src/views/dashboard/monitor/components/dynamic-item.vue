<template>
  <div class="p-6 flex items-center border-bottom">
    <img class="w-10 h-10 rounded-full" :src="GithubIcon" alt="" />
    <div class="ml-5 flex items-center">
      <n-ellipsis class="text-md font-bold">
        {{ item.content }}
      </n-ellipsis>
      <n-ellipsis class="text-xs text-gray-500">{{ item.time }}</n-ellipsis>
    </div>
  </div>
</template>

<script setup lang="ts">
import GithubIcon from "@/assets/icons/github.svg";
type Props = {
  item: {
    id: number;
    time: string;
    content: string;
  };
};
defineProps<Props>();
</script>

<style scoped lang="less">
.border-bottom {
  border-bottom: 1px solid #e8e8e8;
}
</style>
