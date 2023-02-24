<template>
  <n-layout class="layout" :position="fixedMenu" has-sider>
    <n-layout-sider
      v-if="
        !isMobile &&
        isMixMenuNoneSub &&
        (navMode === 'vertical' || navMode === 'horizontal-mix')
      "
      show-trigger="arrow-circle"
      @collapse="isCollapsed = true"
      :position="fixedMenu"
      @expand="isCollapsed = false"
      :collapsed="isCollapsed"
      collapse-mode="width"
      :collapsed-width="64"
      :width="leftMenuWidth"
      :native-scrollbar="false"
      :inverted="inverted"
      class="layout-sider"
    >
      <logo :collapsed="isCollapsed"></logo>
      <aside-menu
        v-model:collapsed="isCollapsed"
        v-model:location="getMenuLocation"
      ></aside-menu>
    </n-layout-sider>

    <n-drawer
      v-model:show="showSideDrawder"
      :width="menuWidth"
      :placement="'left'"
      class="layout-side-drawer"
    >
      <logo :collapsed="isCollapsed"></logo>
      <aside-menu @clickMenuItem="isCollapsed = false"></aside-menu>
    </n-drawer>

    <n-layout :inverted="inverted">
      <n-layout-header :inverted="getHeaderInverted" :position="fixedHeader">
        <page-header v-model:collapsed="isCollapsed" :inverted="inverted" />
      </n-layout-header>

      <n-layout-content
        class="layout-content"
        :class="{ 'layout-default-background': getDarkTheme === false }"
      >
        <div
          class="layout-content-main"
          :class="{
            'layout-content-main-fix': fixedMulti,
            'fluid-header': fixedHeader === 'static',
          }"
        >
          <tags-view
            v-if="isMultiTabs"
            v-model:collapsed="isCollapsed"
          ></tags-view>
          <div
            class="main-view"
            :class="{
              'main-view-fix': fixedMulti,
              noMultiTabs: !isMultiTabs,
              'mt-3': !isMultiTabs,
            }"
          >
            <main-view></main-view>
          </div>
        </div>
      </n-layout-content>
      <n-back-top :right="100" />
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, unref } from "vue";
import { useRoute } from "vue-router";
import {
  useSettingHook,
  useDesignSetting,
} from "@/hooks/settings/use-setting-hook";
import { useSettingStoreWithout } from "@/stores/modules/setting";
import Logo from "./components/logo/index.vue";
import AsideMenu from "./components/menu/index.vue";
import PageHeader from "./components/header/index.vue";
import TagsView from "./components/tags-view/index.vue";
import MainView from "./components/main/index.vue";
const settingStore = useSettingStoreWithout();
const { getDarkTheme } = useDesignSetting();

const {
  getNavMode,
  getNavTheme,
  getHeaderSetting,
  getMenuSetting,
  getMultiTabsSetting,
} = useSettingHook();
let isCollapsed = ref(false);
const navMode = getNavMode;
const { mobileWidth, menuWidth } = unref(getMenuSetting);
//是否是移动端
const isMobile = computed<boolean>({
  get: () => settingStore.getIsMobile,
  set: (val) => settingStore.setIsMobile(val),
});
//是否固定头部
const fixedHeader = computed(() => {
  const { fixed } = unref(getHeaderSetting);
  return fixed ? "absolute" : "static";
});
//是否是混合菜单
const isMixMenuNoneSub = computed(() => {
  const mixMenu = settingStore.menuSetting.mixMenu;
  const currentRoute = useRoute();
  if (unref(navMode) != "horizontal-mix") return true;
  return !(
    unref(navMode) === "horizontal-mix" &&
    mixMenu &&
    currentRoute.meta.isRoot
  );
});
//是否固定菜单
const fixedMenu = computed(() => {
  const { fixed } = unref(getHeaderSetting);
  return fixed ? "absolute" : "static";
});
//是否多标签
const isMultiTabs = computed(() => {
  return unref(getMultiTabsSetting).show;
});
//左侧菜单宽度
const leftMenuWidth = computed(() => {
  if (unref(isMobile)) {
    return unref(mobileWidth);
  }
  return unref(menuWidth);
});
//是否反色
const inverted = computed(() => {
  return ["dark", "header-dark"].includes(unref(getNavTheme));
});
const fixedMulti = computed(() => {
  return unref(getMultiTabsSetting).fixed;
});
const getHeaderInverted = computed(() => {
  const navTheme = unref(getNavTheme);
  return ["light", "header-dark"].includes(navTheme)
    ? unref(inverted)
    : !unref(inverted);
});
const getMenuLocation = computed(() => {
  return "left";
});
// 控制显示或隐藏移动端侧边栏
const showSideDrawder = computed({
  get: () => isMobile.value && isCollapsed.value,
  set: (val) => (isCollapsed.value = val),
});
//判断是否触发移动端模式
const checkMobileMode = () => {
  if (document.body.clientWidth <= mobileWidth) {
    isMobile.value = true;
  } else {
    isMobile.value = false;
  }
  isCollapsed.value = false;
};
const watchWidth = () => {
  const Width = document.body.clientWidth;
  if (Width <= 950) {
    isCollapsed.value = true;
  } else isCollapsed.value = false;
  checkMobileMode();
};
onMounted(() => {
  checkMobileMode();
  window.addEventListener("resize", watchWidth);
});
</script>

<style lang="less">
.layout-side-drawer {
  background-color: rgb(0, 20, 40);

  .layout-sider {
    min-height: 100vh;
    box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
    position: relative;
    z-index: 13;
    transition: all 0.2s ease-in-out;
  }
}
</style>
<style lang="less" scoped>
.layout {
  display: flex;
  flex-direction: row;
  flex: auto;

  &-default-background {
    background: #f5f7f9;
  }

  .layout-sider {
    min-height: 100vh;
    box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
    position: relative;
    z-index: 13;
    transition: all 0.2s ease-in-out;
  }

  .layout-sider-fix {
    position: fixed;
    top: 0;
    left: 0;
  }

  .ant-layout {
    overflow: hidden;
  }

  .layout-right-fix {
    overflow-x: hidden;
    padding-left: 200px;
    min-height: 100vh;
    transition: all 0.2s ease-in-out;
  }

  .layout-content {
    flex: auto;
    min-height: 100vh;
  }

  .n-layout-header.n-layout-header--absolute-positioned {
    z-index: 11;
  }

  .n-layout-footer {
    background: none;
  }
}

.layout-content-main {
  margin: 0 10px 10px;
  position: relative;
  padding-top: 64px;
}

.layout-content-main-fix {
  padding-top: 64px;
}

.fluid-header {
  padding-top: 0;
}

.main-view-fix {
  padding-top: 44px;
}

.noMultiTabs {
  padding-top: 0;
}
</style>
