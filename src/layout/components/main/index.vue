<template>
  <router-view>
    <template #default="{ Component, route }">
      <transition :name="getTransitionName" mode="out-in" appear>
        <keep-alive v-if="keepAliveComponents" :include="keepAliveComponents">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
        <component v-else :is="Component" :key="route.fullPath" />
      </transition>
    </template>
  </router-view>
</template>

<script setup lang="ts">
import { useAsyncRouteStore } from "@/stores/modules/async-route";
import { useSettingHook } from "@/hooks/settings/use-setting-hook";
import { computed, unref,watch } from "vue";
defineProps({
  notNeedKey: {
    type: Boolean,
    default: false,
  },
  animate: {
    type: Boolean,
    default: true,
  },
});
const { getIsPageAnimate, getPageAnimateType } = useSettingHook();
const asyncRouteStore = useAsyncRouteStore();
console.log(asyncRouteStore.keepAliveComponents,'asyncRouteStore.keepAliveComponents');

// 需要缓存的路由组件
const keepAliveComponents = computed(() => asyncRouteStore.keepAliveComponents);

watch(()=>keepAliveComponents.value,()=>{
  console.log(keepAliveComponents.value,'keepAliveComponents.value');
})

const getTransitionName = computed(() => {
  return unref(getIsPageAnimate) ? unref(getPageAnimateType) : "";
});
</script>

<style scoped></style>
