import { h } from "vue";
import { NIcon } from "naive-ui";
import { isObject } from "@/utils/is";
import { PageEnum } from "@/enums/pageEnum";

export function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

export function flatToTree(data: any[], id = "id", pid = "pid") {
  const result: any[] = [];
  const hash = {};
  data.forEach((_, index) => {
    hash[data[index][id]] = data[index];
  });
  data.forEach((item) => {
    const hashVP = hash[item[pid]];
    if (hashVP) {
      !hashVP.children && (hashVP.children = []);
      hashVP.children.push(item);
    } else {
      result.push(item);
    }
  });
  return result;
}
export function deepClone(obj) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  const result = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = deepClone(obj[key]);
    }
  }
  return result;
}
export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string;
  for (key in target) {
    src[key] = isObject(src[key])
      ? deepMerge(src[key], target[key])
      : (src[key] = target[key]);
  }
  return src;
}
function addLight(color: string, amount: number) {
  const cc = parseInt(color, 16) + amount;
  const c = cc > 255 ? 255 : cc;
  return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`;
}
export function lighten(color: string, amount: number) {
  color = color.indexOf("#") >= 0 ? color.substring(1, color.length) : color;
  amount = Math.trunc((255 * amount) / 100);
  return `#${addLight(color.substring(0, 2), amount)}${addLight(
    color.substring(2, 4),
    amount
  )}${addLight(color.substring(4, 6), amount)}`;
}

/**
 * 递归组装菜单格式
 */
export function generatorMenu(routerMap: Array<any>) {
  return filterRouter(routerMap).map((item) => {
    const isRoot = isRootRouter(item);
    const info = isRoot ? item.children[0] : item;
    const currentMenu = {
      ...info,
      ...info.meta,
      label: info.meta?.title,
      key: info.name,
      icon: isRoot ? item.meta?.icon : info.meta?.icon,
    };
    // 是否有子菜单，并递归处理
    if (info.children && info.children.length > 0) {
      // Recursion
      currentMenu.children = generatorMenu(info.children);
    }
    return currentMenu;
  });
}

/**
 * 混合菜单
 * */
export function generatorMenuMix(
  routerMap: Array<any>,
  routerName: string,
  location: string
) {
  const cloneRouterMap = deepClone(routerMap);
  const newRouter = filterRouter(cloneRouterMap);
  if (location === "header") {
    const firstRouter: any[] = [];
    newRouter.forEach((item) => {
      const isRoot = isRootRouter(item);
      const info = isRoot ? item.children[0] : item;
      info.children = undefined;
      const currentMenu = {
        ...info,
        ...info.meta,
        label: info.meta?.title,
        key: info.name,
      };
      firstRouter.push(currentMenu);
    });
    return firstRouter;
  } else {
    return getChildrenRouter(
      newRouter.filter((item) => item.name === routerName)
    );
  }
}
/**
 * 递归组装子菜单
 * */
export function getChildrenRouter(routerMap: Array<any>) {
  return filterRouter(routerMap).map((item) => {
    const isRoot = isRootRouter(item);
    const info = isRoot ? item.children[0] : item;
    const currentMenu = {
      ...info,
      ...info.meta,
      label: info.meta?.title,
      key: info.name,
    };
    // 是否有子菜单，并递归处理
    if (info.children && info.children.length > 0) {
      // Recursion
      currentMenu.children = getChildrenRouter(info.children);
    }
    return currentMenu;
  });
}
/**
 * 排除Router
 * */
export function filterRouter(routerMap: Array<any>) {
  return routerMap.filter((item) => {
    return (
      (item.meta?.hidden || false) != true &&
      !["/:path(.*)*", "/", PageEnum.REDIRECT, PageEnum.BASE_LOGIN].includes(
        item.path
      )
    );
  });
}
/**
 * 判断根路由 Router
 * */
export function isRootRouter(item) {
  return (
    item.meta?.alwaysShow != true &&
    item?.children?.filter((item) => !item?.meta?.hidden)?.length === 1
  );
}