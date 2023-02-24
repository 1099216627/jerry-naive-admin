<template>
  <div class="layout-header">
    <div
      class="layout-header-left"
      v-if="
        state.navMode === 'horizontal' ||
        (state.navMode === 'horizontal-mix' && mixMenu)
      "
    >
      <!--      水平模式顶部logo-->
      <div class="logo" v-if="state.navMode === 'horizontal'">
        <img :src="websiteConfig.logo" alt="" />
        <h2 v-show="!collapsed" class="title">{{ websiteConfig.title }}</h2>
      </div>
      <aside-menu
        v-model:collapsed="isCollapsed"
        v-model:location="getMenuLocation"
        :inverted="getInverted"
        mode="horizontal"
      ></aside-menu>
    </div>
    <!--左侧菜单-->
    <div class="layout-header-left" v-else>
      <!-- 菜单收起 -->
      <div
        class="ml-1 layout-header-trigger layout-header-trigger-min"
        @click="() => $emit('update:collapsed', !collapsed)"
      >
        <n-icon size="18" v-if="collapsed">
          <MenuUnfoldOutlined />
        </n-icon>
        <n-icon size="18" v-else>
          <MenuFoldOutlined />
        </n-icon>
      </div>
      <!-- 刷新 -->
      <div
        class="mr-1 layout-header-trigger layout-header-trigger-min"
        v-if="state.headerSetting.isReload"
        @click="reloadPage"
      >
        <n-icon size="18">
          <ReloadOutlined />
        </n-icon>
      </div>
      <!-- 面包屑 -->
      <bread-crumbs></bread-crumbs>
    </div>
    <div class="layout-header-right">
      <!--      github-->
      <div class="layout-header-trigger layout-header-trigger-min">
        <n-tooltip placement="bottom">
          <template #trigger>
            <n-icon size="18">
              <github-filled @click="goGithub"></github-filled>
            </n-icon>
          </template>
          <span>GitHub</span>
        </n-tooltip>
      </div>
      <!--      lock-->
      <div class="layout-header-trigger layout-header-trigger-min">
        <n-tooltip placement="bottom">
          <template #trigger>
            <n-icon size="18">
              <lock-outlined @click="lockScreen"></lock-outlined>
            </n-icon>
          </template>
          <span>锁屏</span>
        </n-tooltip>
      </div>
      <!--切换全屏-->
      <div class="layout-header-trigger layout-header-trigger-min">
        <n-tooltip placement="bottom">
          <template #trigger>
            <n-icon size="18">
              <full-screen></full-screen>
            </n-icon>
          </template>
          <span>全屏</span>
        </n-tooltip>
      </div>
      <!-- 个人中心 -->
      <div class="layout-header-trigger layout-header-trigger-min">
        <n-dropdown
          trigger="hover"
          @select="avatarSelect"
          :options="avatarOptions"
        >
          <div class="avatar">
            <n-avatar round :src="userStore.getInfo.profile.avatar">
              <template #icon>
                <UserOutlined />
              </template>
            </n-avatar>
          </div>
        </n-dropdown>
      </div>
      <!--设置-->
      <div
        class="layout-header-trigger layout-header-trigger-min"
        @click="openSetting"
      >
        <n-tooltip placement="bottom-end">
          <template #trigger>
            <n-icon size="18" style="font-weight: bold">
              <SettingOutlined />
            </n-icon>
          </template>
          <span>项目配置</span>
        </n-tooltip>
      </div>
    </div>
  </div>
  <!--项目配置-->
  <project-setting ref="drawerSetting"></project-setting>
</template>

<script setup lang="ts">
import AsideMenu from "@/layout/components/menu/index.vue";
import { useRouter, useRoute } from "vue-router";
import { NDialogProvider, useDialog, useMessage } from "naive-ui";
import BreadCrumbs from "@/components/bread-crumbs/index.vue";
import ProjectSetting from "@/layout/components/header/project-setting.vue";
import { TABS_ROUTES } from "@/stores/mutation-types";
import {
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReloadOutlined,
  UserOutlined,
  GithubFilled,
  LockOutlined,
} from "@vicons/antd";
import { useUserStore } from "@/stores/modules/user";
import { useLockscreenStore } from "@/stores/modules/lockscreen";
import { useSettingHook } from "@/hooks/settings/use-setting-hook";
import { websiteConfig } from "@/config/website.config";
import { computed, reactive, ref, unref, watch, watchEffect } from "vue";
import FullScreen from "@/layout/components/header/full-screen.vue";
import { storeToRefs } from "pinia";
const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
  inverted: {
    type: Boolean,
  },
});
const isCollapsed = ref(props.collapsed);
const userStore = useUserStore();
const useLockscreen = useLockscreenStore();
const message = useMessage();
const dialog = useDialog();
const router = useRouter();
const route = useRoute();
const { getNavMode, getNavTheme, getHeaderSetting, getMenuSetting } =
  useSettingHook();
const drawerSetting = ref();
const state = reactive({
  navMode: getNavMode,
  navTheme: getNavTheme,
  headerSetting: getHeaderSetting,
});
const getInverted = computed(() => {
  const navTheme = unref(getNavTheme);
  return ["light", "header-dark"].includes(navTheme)
    ? props.inverted
    : !props.inverted;
});
const mixMenu = computed(() => {
  return unref(getMenuSetting).mixMenu;
});
const getChangeStyle = computed(() => {
  const { collapsed } = props;
  const { minMenuWidth, menuWidth }: any = unref(getMenuSetting);
  return {
    left: collapsed ? `${minMenuWidth}px` : `${menuWidth}px`,
    width: `calc(100% - ${collapsed ? `${minMenuWidth}px` : `${menuWidth}px`})`,
  };
});
const getMenuLocation = computed(() => {
  return "header";
});

// 刷新页面
const reloadPage = () => {
  router.push({
    path: "/redirect" + unref(route).fullPath,
  });
};
const doLogout = () => {};
const goGithub = () => {
  window.open("https://github.com/jekip/naive-ui-admin");
};
const lockScreen = () => {
  useLockscreen.setLock(true);
};
const avatarOptions = [
  {
    label: "个人设置",
    key: 1,
  },
  {
    label: "退出登录",
    key: 2,
  },
];
//头像下拉菜单
const avatarSelect = (key) => {
  switch (key) {
    case 1:
      router.push({ name: "personal" });
      break;
    case 2:
      doLogout();
      break;
  }
};
function openSetting() {
  const { openDrawer } = drawerSetting.value;
  openDrawer();
}
</script>

<style lang="less" scoped>
.layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  height: @header-height;
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
  transition: all 0.2s ease-in-out;
  width: 100%;
  z-index: 11;

  &-left {
    display: flex;
    align-items: center;

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 64px;
      line-height: 64px;
      overflow: hidden;
      white-space: nowrap;
      padding-left: 10px;

      img {
        width: auto;
        height: 32px;
        margin-right: 10px;
      }

      .title {
        margin: 0;
      }
    }

    ::v-deep(.ant-breadcrumb span:last-child .link-text) {
      color: #515a6e;
    }

    .n-breadcrumb {
      display: inline-block;
    }

    &-menu {
      color: var(--text-color);
    }
  }

  &-right {
    display: flex;
    align-items: center;
    margin-right: 20px;

    .avatar {
      display: flex;
      align-items: center;
      height: 64px;
    }

    > * {
      cursor: pointer;
    }
  }

  &-trigger {
    display: inline-block;
    width: 64px;
    height: 64px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    .n-icon {
      display: flex;
      align-items: center;
      height: 64px;
      line-height: 64px;
    }

    &:hover {
      background: hsla(0, 0%, 100%, 0.08);
    }

    .anticon {
      font-size: 16px;
      color: #515a6e;
    }
  }

  &-trigger-min {
    width: auto;
    padding: 0 12px;
  }
}

.layout-header-light {
  background: #fff;
  color: #515a6e;

  .n-icon {
    color: #515a6e;
  }

  .layout-header-left {
    ::v-deep(
        .n-breadcrumb .n-breadcrumb-item:last-child .n-breadcrumb-item__link
      ) {
      color: #515a6e;
    }
  }

  .layout-header-trigger {
    &:hover {
      background: #f8f8f9;
    }
  }
}

.layout-header-fix {
  position: fixed;
  top: 0;
  right: 0;
  left: 200px;
  z-index: 11;
}

//::v-deep(.menu-router-link) {
//  color: #515a6e;
//
//  &:hover {
//    color: #1890ff;
//  }
//}
</style>
