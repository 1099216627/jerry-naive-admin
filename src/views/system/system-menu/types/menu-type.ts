import { BooleanEnum, ICommon } from "@/enums/common";

export interface IMenu extends ICommon {
  affix: BooleanEnum,
  cache: BooleanEnum,
  component: string,
  hidden: BooleanEnum,
  path: string,
  pid: BooleanEnum | null,
  sort: BooleanEnum,
  link: BooleanEnum,
  icon: string,
  title: string,
  redirect: string | null,
  name: string,
  key: string,
}

export interface IPermission extends ICommon {
  title: string,
  controller: string,
  action: string,
  key: string,
}