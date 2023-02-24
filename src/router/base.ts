import type { AppRouteRecordRaw } from "./types";
import { ErrorPage, RedirectName, Layout } from "@/router/constant";
import { RouteRecordRaw } from "vue-router";
import { PageEnum } from "@/enums/pageEnum";

export const RootRoute: RouteRecordRaw = {
  path: "/",
  name: "Root",
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: "Root",
  },
};
export const ErrorPageRoute: AppRouteRecordRaw = {
  path: "/:path(.*)*",
  name: "ErrorPageSon",
  component: ErrorPage,
  meta: {
    title: "ErrorPage",
    hideBreadcrumb: true,
  },
};

export const RedirectRoute: AppRouteRecordRaw = {
  path: "/redirect",
  name: RedirectName,
  component: Layout,
  meta: {
    title: RedirectName,
    hideBreadcrumb: true,
  },
  children: [
    {
      path: "/redirect/:path(.*)",
      name: RedirectName,
      component: () => import("@/views/redirect/index.vue"),
      meta: {
        title: RedirectName,
        hideBreadcrumb: true,
      },
    },
  ],
};
