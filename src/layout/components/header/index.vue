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
  <!-- 修改密码 -->
  <n-modal
    :show="showModal"
    preset="dialog"
    title="修改密码"
    :close-on-esc="false"
    :mask-closable="false"
    positive-text="确认"
    negative-text="取消"
    @positive-click="submitChangePassword"
    @negative-click="cancelChangePassword"
  >
<template #default>
  <n-form class='mt-5' ref="changePasswordForm" :model="changePasswordModal" label-placement="left" label-width="80" :rules="rules">
    <n-form-item label="旧密码" path="oldPassword">
      <n-input
        v-model:value="changePasswordModal.oldPassword"
        placeholder="请输入旧密码"
        type="password"
      ></n-input>
    </n-form-item>
    <n-form-item label="新密码" path="newPassword">
      <n-input
        v-model:value="changePasswordModal.newPassword"
        placeholder="请输入新密码"
        type="password"
        show-password-on="click"
      ></n-input>
    </n-form-item>
    <n-form-item label="确认密码" path="confirmPassword">
      <n-input
        v-model:value="changePasswordModal.confirmPassword"
        placeholder="请再次输入新密码"
        type="password"
        show-password-on="click"
      ></n-input>
      </n-form-item>
  </n-form>
</template>
  </n-modal>
</template>

<script setup lang="ts">
import AsideMenu from "@/layout/components/menu/index.vue";
import { useRouter, useRoute } from "vue-router";
import { FormInst, FormRules, useDialog, useMessage } from "naive-ui";
import BreadCrumbs from "@/components/bread-crumbs/index.vue";
import ProjectSetting from "@/layout/components/header/project-setting.vue";
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
import { computed, reactive, ref, unref } from "vue";
import FullScreen from "@/layout/components/header/full-screen.vue";
import { validatePassword } from "@/utils/validate";
import { ResultEnum } from "@/enums/httpEnum";
const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
  inverted: {
    type: Boolean,
  },
});
const validaConfirmPassword = (_: any, value: any, callback: any) => {
  if (value !== changePasswordModal.newPassword) {
    callback(new Error("两次输入密码不一致!"));
  } else {
    callback();
  }
}
const showModal = ref(false);
const changePasswordModal = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});
const rules = reactive({
  oldPassword: [
    {
      required: true,
      validator:validatePassword,
      trigger: "blur",
    },
  ],
  newPassword: [
    {
      required: true,
      validator:validatePassword,
      trigger: "blur",
    },
  ],
  confirmPassword: [
    {
      required: true,
      validator: validaConfirmPassword,
      trigger: "blur",
    },
  ],
}) as FormRules;
const changePasswordForm = ref<FormInst | null>(null);
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
// const getChangeStyle = computed(() => {
//   const { collapsed } = props;
//   const { minMenuWidth, menuWidth }: any = unref(getMenuSetting);
//   return {
//     left: collapsed ? `${minMenuWidth}px` : `${menuWidth}px`,
//     width: `calc(100% - ${collapsed ? `${minMenuWidth}px` : `${menuWidth}px`})`,
//   };
// });
const getMenuLocation = computed(() => {
  return "header";
});

// 刷新页面
const reloadPage = () => {
  router.push({
    path: "/redirect" + unref(route).fullPath,
  });
};
const doLogout = () => {
  dialog.warning({
    title: "提示",
    content: "确定退出登录吗？",
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: () => {
     userStore.signOut();
      message.success("退出登录成功");
      router.push({ path: "/login" });
    },
  });
};
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
    label:"修改密码",
    key:2
  },
  {
    label: "退出登录",
    key: 3,
  },
];
//修改密码
const changePassword = () => {
  showModal.value = true;
};
//取消修改密码
const cancelChangePassword = () => {
  showModal.value = false;
  changePasswordModal.oldPassword = "";
  changePasswordModal.newPassword = "";
  changePasswordModal.confirmPassword = "";
};
//提交修改密码
const submitChangePassword = () => {
  changePasswordForm.value?.validate(async errors => {
    if (errors) {
      message.error("请检查输入项");
    }
    const {oldPassword,newPassword} = changePasswordModal;
    const {code} = await userStore.updatePassword({oldPassword,newPassword})
    if(code === ResultEnum.SUCCESS){
      cancelChangePassword();
    }else{      
      return false;
    }
  })
};
//头像下拉菜单
const avatarSelect = (key) => {
  switch (key) {
    case 1:
      router.push({ name: "personal" });
      break;
    case 2:
      changePassword();
      break;
    case 3:
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
