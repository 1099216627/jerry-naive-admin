import { PageEnum } from '@/enums/pageEnum';
import { App } from "vue";
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { RedirectRoute, RootRoute } from "@/router/base";
import { createRouterGuards } from "./router-guard";

const modules = import.meta.globEager("./modules/**/*.ts");
const routeModuleList: RouteRecordRaw[] = [];

Object.keys(modules).forEach((key) => {
  // @ts-ignore
  const mod = modules[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
});

function sortRoute(a, b) {
  return (a.meta?.sort || 0) - (b.meta?.sort || 0);
}

routeModuleList.sort(sortRoute);

export const LoginRoute: RouteRecordRaw = {
  path: PageEnum.BASE_LOGIN,
  name: PageEnum.BASE_LOGIN_NAME,
  component: () => import("@/views/login/index.vue"),
  meta: {
    title: "登录",
  },
};

export const RegisterRoute: RouteRecordRaw = {
  path: PageEnum.BASE_REGISTER,
  name: PageEnum.BASE_REGISTER_NAME,
  component: () => import("@/views/register/index.vue"),
  meta: {
    title: "注册",
  },
};

//需要验证权限
export const asyncRoutes = [...routeModuleList];

//普通路由 无需验证权限
export const constantRouter: any[] = [LoginRoute, RedirectRoute, RootRoute,RegisterRoute];

const router = createRouter({
  history: createWebHashHistory(""),
  routes: constantRouter,
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

export function setupRouter(app: App) {
  app.use(router);
  // 创建路由守卫
  createRouterGuards(router);
}

export default router;
