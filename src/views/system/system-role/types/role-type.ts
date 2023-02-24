import { ICommon, Status } from "@/enums/common";
import { IMenu, IPermission } from "../../system-menu/types/menu-type";

export interface IRole extends ICommon {
  name: string;
  identification: string | null;
  status: Status;
  menus: IMenu[];
  permissions: IPermission[];
}
