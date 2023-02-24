import { constantRouterIcon } from "./router-icons";
import { RouteRecordRaw } from "vue-router";
import { Layout, ParentLayout } from "@/router/constant";
import type { AppRouteRecordRaw } from "@/router/types";
import { MenuRaw } from "@/router/types";
import { flatToTree } from "@/utils";

const Iframe = () => import("@/views/iframe/index.vue");
const LayoutMap = new Map<string, () => Promise<typeof import("*.vue")>>();

LayoutMap.set("LAYOUT", Layout);
LayoutMap.set("IFRAME", Iframe);
let viewsModules: Record<string, () => Promise<Recordable>> = import.meta.glob(
  "../views/**/*.{vue,tsx}"
);

/**
 * 格式化 后端 结构信息并递归生成层级路由表 后端返回格式为{MenuRaw[]}
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const routerGenerator = (routerMap): any[] => {
  const menuTreeList = flatToTree(routerMap);
  //转换为路由表结构
  return generator(menuTreeList);
};

export function generator(routerMap): AppRouteRecordRaw[] {
  return routerMap.map((item) => {
    const component =
      item.component === "LAYOUT"
        ? Layout
        : dynamicImport(viewsModules, item.component);
    const children = item.children ? generator(item.children) : undefined;
    const route: AppRouteRecordRaw = {
      path: item.path,
      name: item.name,
      meta: {
        title: item.title,
        icon: constantRouterIcon[item.icon],
        hidden: item.hidden,
        affix: item.affix,
        cache: item.cache,
        sort: item.sort,
        link: item.link,
      },
      component: component,
      children: children,
    };
    if (item.redirect) {
      route["redirect"] = item.redirect;
    }
    return route;
  });
}
/**
 * 动态生成菜单
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = (
  routesRaw: MenuRaw[]
): RouteRecordRaw[] => {
  return routerGenerator(routesRaw);
};

/**
 * 查找views中对应的组件文件
 * */
export const asyncImportRoute = (
  routes: AppRouteRecordRaw[] | undefined
): void => {
  viewsModules = viewsModules || import.meta.glob("../views/**/*.{vue,tsx}");
  if (!routes) return;
  routes.forEach((item) => {
    if (!item.component && item.meta?.frameSrc) {
      item.component = "IFRAME";
    }
    const { component, name } = item;
    const { children } = item;
    if (component) {
      const layoutFound = LayoutMap.get(component as string);
      if (layoutFound) {
        item.component = layoutFound;
      } else {
        item.component = dynamicImport(viewsModules, component as string);
      }
    } else if (name) {
      item.component = ParentLayout;
    }
    children && asyncImportRoute(children);
  });
};

/**
 * 动态导入
 * */
export const dynamicImport = (
  viewsModules: Record<string, () => Promise<Recordable>>,
  component: string
) => {
  const keys = Object.keys(viewsModules);
  const matchKeys = keys.filter((key) => {
    let k = key.replace("../views", "");
    const lastIndex = k.lastIndexOf(".");
    k = k.substring(0, lastIndex);
    return k === component;
  });
  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0];
    return viewsModules[matchKey];
  }
  if (matchKeys?.length > 1) {
    console.warn(
      "Please do not create `.vue` and `.TSX` files with the same file name in the same hierarchical directory under the views folder. This will cause dynamic introduction failure"
    );
    return;
  }
};
