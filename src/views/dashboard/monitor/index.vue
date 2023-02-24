<template>
  <n-grid :x-gap="12" :y-gap="8" cols="1 l:2" responsive="screen">
    <n-grid-item>
      <n-card title="学习资源" segmented :header-style="cardHeaderStyle">
        <n-grid :cols="3">
          <n-grid-item v-for="item in resourceList" :key="item.id">
            <resources-item :item="item"></resources-item>
          </n-grid-item>
        </n-grid>
      </n-card>
      <n-card
        class="mt-2"
        title="动态"
        segmented
        :header-style="cardHeaderStyle"
      >
        <dynamic-item v-for="item in dynamics" :key="item.id" :item="item"></dynamic-item>
      </n-card>
    </n-grid-item>
    <n-grid-item>
      <n-card title="快捷操作" segmented :header-style="cardHeaderStyle">
        <n-grid :cols="3">
          <n-grid-item v-for="item in quicks" :key="item.title">
            <n-card hoverable bordered class="h-20 cursor-pointer" @click="to(item.path)">
              <div class="flex justify-center items-center flex-col h-full">
                <img :src="item.icon" alt="" class="w-7 h-7" />
                <p class="mt-2">{{ item.title }}</p>
              </div>
            </n-card>
          </n-grid-item>
        </n-grid>
      </n-card>
      <n-card class="mt-2">
        <img src="~@/assets/images/Business.svg" alt="" />
      </n-card>
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import {  quicks ,dynamics} from "./config";
import ResourcesItem from "@/views/dashboard/monitor/components/resources-item.vue";
import DynamicItem from "@/views/dashboard/monitor/components/dynamic-item.vue";
import { getResourceListApi } from "@/api/resource";
import { CSSProperties, onMounted, reactive } from "vue";
import { IRessource } from "@/views/system/resources/types/resource-type";
import { ResultEnum } from "@/enums/httpEnum";
/**
 * 代码提交规范
 * 1. git remote add origin
 * 2. git pull origin master
 */

const getResourceList = async () => {
  const params = {
    page: 1,
    limit: 9,
  };
  const {code,data} = await getResourceListApi(params);
  if (code === ResultEnum.SUCCESS) {
    resourceList.splice(0, resourceList.length, ...data.list);
  }
};
const resourceList  = reactive<IRessource[]>([])
const router = useRouter();
const cardHeaderStyle:CSSProperties = {
  fontSize: "16px",
  fontWeight: "bold",
  height: "40px",
};
const to = (path: string) => {
  router.push(path);
};
onMounted(()=>{
  getResourceList()
})
</script>

<style scoped lang="less">
:deep(.n-card__content) {
  padding: 0 !important;
}
</style>
