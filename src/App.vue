<script setup lang="ts">
import Application from "@/components/application/index.vue";
import LockScreen from "@/components/lock-screen/index.vue";
import { computed, onMounted, onUnmounted } from "vue";
import { zhCN, dateZhCN, darkTheme } from "naive-ui";
import { useLockscreenStore } from "@/stores/modules/lockscreen";
import { useRoute } from "vue-router";
import { useDesignSettingStore } from "@/stores/modules/design";
import { lighten } from "@/utils";

const route = useRoute();
const useLockscreen = useLockscreenStore();
const designStore = useDesignSettingStore();
const isLock = computed(() => useLockscreen.isLock);
const lockTime = computed(() => useLockscreen.lockTime);

const getThemeOverrides = computed(() => {
  const appTheme = designStore.appTheme;
  const lightenStr = lighten(designStore.appTheme, 6);
  return {
    common: {
      primaryColor: appTheme,
      primaryColorHover: lightenStr,
      primaryColorPressed: lightenStr,
      primaryColorSuppl: appTheme,
    },
    LoadingBar: {
      colorLoading: appTheme,
    },
  };
});

const getDarkTheme = computed(() =>
  designStore.darkTheme ? darkTheme : undefined
);

let timer;

const timekeeping = () => {
  clearInterval(timer);
  if (route.name == "login" || isLock.value) return;
  // 设置不锁屏
  useLockscreen.setLock(false);
  // 重置锁屏时间
  useLockscreen.setLockTime();
  timer = setInterval(() => {
    // 锁屏倒计时递减
    useLockscreen.setLockTime(lockTime.value - 1);
    if (lockTime.value <= 0) {
      // 设置锁屏
      useLockscreen.setLock(true);
      return clearInterval(timer);
    }
  }, 1000);
};

//获取电脑主题
// const getSystemTheme = () => {
//   const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
//   designStore.setDarkTheme(isDark);
// };
// getSystemTheme();

onMounted(() => {
  document.addEventListener("mousedown", timekeeping);
});

onUnmounted(() => {
  document.removeEventListener("mousedown", timekeeping);
});
</script>

<template>
  <n-config-provider
    v-if="!isLock"
    :locale="zhCN"
    :theme="getDarkTheme"
    :theme-overrides="getThemeOverrides"
    :date-locale="dateZhCN"
  >
    <application>
      <router-view></router-view>
    </application>
  </n-config-provider>

  <transition v-if="isLock && route.name !== 'Login'" name="slide-up">
    <lock-screen></lock-screen>
  </transition>
</template>

<style lang="less">
@import "styles/index.less";
</style>
