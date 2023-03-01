/**
 * 路由守卫
 */
import type { RouteRecordRaw } from "vue-router";
import { isNavigationFailure, Router } from "vue-router";
import { useUserStoreWithout } from "@/stores/modules/user";
import { useAsyncRouteStoreWidthOut } from "@/stores/modules/async-route";
import { ACCESS_TOKEN } from "@/stores/mutation-types";
import { storage } from "@/utils/storage";
import { PageEnum } from "@/enums/pageEnum";
import { ErrorPageRoute } from "@/router/base";
import { getUserMenusApi } from "@/api/menu";
import { useLockscreenStore } from "@/stores/modules/lockscreen";

const LOGIN_PATH = PageEnum.BASE_LOGIN;
const REGISTER_PATH = PageEnum.BASE_REGISTER;

const whitePathList = [LOGIN_PATH,REGISTER_PATH]; // no redirect whitelist

export function createRouterGuards(router: Router) {
  const userStore = useUserStoreWithout();
  const asyncRouteStore = useAsyncRouteStoreWidthOut();
  const lockscreenStore = useLockscreenStore();
  router.beforeEach(async (to, from, next) => {
    const Loading = window["$loading"] || null;
    Loading && Loading.start();
    if (from.path === LOGIN_PATH && to.name === "errorPage") {
      next(PageEnum.BASE_HOME);
      return;
    }

    if (to.path === LOGIN_PATH) {
      lockscreenStore.setLock(false);
    }
    console.log(to.path, "to.path",whitePathList.includes(to.path as PageEnum));
    //存在于白名单中，直接进入
    if (whitePathList.includes(to.path as PageEnum)) {
      next();
      return;
    }

    const token = storage.get(ACCESS_TOKEN);

    if (!token) {
      //您可以在没有权限的情况下访问。您需要将路由meta.ignoreAuth设置为true
      if (to.meta.ignoreAuth) {
        next();
        return;
      }
      // redirect login page
      const redirectData: {
        path: string;
        replace: boolean;
        query?: Recordable<string>;
      } = {
        path: LOGIN_PATH,
        replace: true,
      };
      if (to.path) {
        redirectData.query = {
          ...redirectData.query,
          redirect: to.path,
        };
      }
      next(redirectData);
      return;
    }

    if (asyncRouteStore.getIsDynamicAddedRoute) {
      next();
      return;
    }

    await userStore.getUserInfo();
    const { data } = await getUserMenusApi();
    if (!data) {
      next(PageEnum.BASE_LOGIN);
      return;
    }

    const routes = await asyncRouteStore.generateRoutes(data);
    // 动态添加可访问路由表
    routes.forEach((route) => {
      router.addRoute(route as unknown as RouteRecordRaw);
    });
    //添加404
    const isErrorPage = router
      .getRoutes()
      .findIndex((item) => item.name === ErrorPageRoute.name);
    if (isErrorPage === -1) {
      router.addRoute(ErrorPageRoute as unknown as RouteRecordRaw);
    }

    const redirectPath = (from.query.redirect || to.path) as string;
    const redirect = decodeURIComponent(redirectPath);
    const nextData =
      to.path === redirect ? { ...to, replace: true } : { path: redirect };
    asyncRouteStore.setDynamicAddedRoute(true);
    next(nextData);
    Loading && Loading.finish();
  });

  router.afterEach((to, _, failure) => {
    document.title = (to?.meta?.title as string) || document.title;
    if (isNavigationFailure(failure)) {
      //console.log('failed navigation', failure)
    }
    const asyncRouteStore = useAsyncRouteStoreWidthOut();
    // 在这里设置需要缓存的组件名称
    const keepAliveComponents = asyncRouteStore.keepAliveComponents;
    const currentComName: any = to.matched.find(
      (item) => item.name == to.name
    )?.name;
    if (
      currentComName &&
      !keepAliveComponents.includes(currentComName) &&
      to.meta?.cache
    ) {
      // 需要缓存的组件
      keepAliveComponents.push(currentComName);
    } else if (!to.meta?.cache || to.name == "Redirect") {
      // 不需要缓存的组件
      const index = asyncRouteStore.keepAliveComponents.findIndex(
        (name) => name == currentComName
      );
      if (index != -1) {
        keepAliveComponents.splice(index, 1);
      }
    }
    asyncRouteStore.setKeepAliveComponents(keepAliveComponents);
    const Loading = window["$loading"] || null;
    Loading && Loading.finish();
  });

  router.onError((error) => {
    console.log(error, "路由错误");
  });
}
