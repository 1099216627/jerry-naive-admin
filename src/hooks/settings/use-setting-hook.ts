import { computed } from "vue";
import { useSettingStoreWithout } from "@/stores/modules/setting";
import { useDesignSettingStore } from "@/stores/modules/design";

export function useSettingHook() {
  const projectStore = useSettingStoreWithout();

  const getNavMode = computed(() => projectStore.navMode);

  const getNavTheme = computed(() => projectStore.navTheme);

  const getIsMobile = computed(() => projectStore.isMobile);

  const getHeaderSetting = computed(() => projectStore.headerSetting);

  const getMultiTabsSetting = computed(() => projectStore.multiTabsSetting);

  const getMenuSetting = computed(() => projectStore.menuSetting);

  const getCrumbsSetting = computed(() => projectStore.crumbsSetting);

  const getPermissionMode = computed(() => projectStore.permissionMode);

  const getShowFooter = computed(() => projectStore.showFooter);

  const getIsPageAnimate = computed(() => projectStore.isPageAnimate);

  const getPageAnimateType = computed(() => projectStore.pageAnimateType);

  return {
    getNavMode,
    getNavTheme,
    getIsMobile,
    getHeaderSetting,
    getMultiTabsSetting,
    getMenuSetting,
    getCrumbsSetting,
    getPermissionMode,
    getShowFooter,
    getIsPageAnimate,
    getPageAnimateType,
  };
}
export function useDesignSetting() {
  const designStore = useDesignSettingStore();

  const getDarkTheme = computed(() => designStore.darkTheme);

  const getAppTheme = computed(() => designStore.appTheme);

  const getAppThemeList = computed(() => designStore.appThemeList);

  return {
    getDarkTheme,
    getAppTheme,
    getAppThemeList,
  };
}
