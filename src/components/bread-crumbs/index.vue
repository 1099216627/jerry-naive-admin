<template>
  <n-breadcrumb v-if="show">
    <template v-for="routeItem in breadcrumbList" :key="routeItem.name">
      <n-breadcrumb-item v-if="routeItem.meta.title">
        <n-dropdown
          v-if="routeItem.children.length"
          :options="routeItem.children"
          @select="dropdownSelect"
        >
          <span class="link-text">
            <component
              v-if="showIcon && routeItem.meta.icon"
              :is="routeItem.meta.icon"
            />
            {{ routeItem.meta.title }}
          </span>
        </n-dropdown>
        <span class="link-text" v-else>
          <component
            v-if="showIcon && routeItem.meta.icon"
            :is="routeItem.meta.icon"
          />
          {{ routeItem.meta.title }}
        </span>
      </n-breadcrumb-item>
    </template>
  </n-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSettingHook } from "@/hooks/settings/use-setting-hook";
const { getCrumbsSetting } = useSettingHook();
const show = computed(() => getCrumbsSetting.value.show);
const showIcon = computed(() => getCrumbsSetting.value.showIcon);
const route = useRoute();
const router = useRouter();
const generator: any = (routerMap) => {
  return routerMap.map((item) => {
    const currentMenu = {
      ...item,
      label: item.meta.title,
      key: item.name,
      disabled: item.path === "/",
    };
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentMenu.children = generator(item.children, currentMenu);
    }
    return currentMenu;
  });
};

const dropdownSelect = (key) => {
  router.push({ name: key });
};

const breadcrumbList = computed(() => {
  return generator(route.matched);
});
</script>

<style scoped></style>
