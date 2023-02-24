import { renderIcon } from "@/utils";
import {
  BookOutlined,
  ConsoleSqlOutlined,
  DashboardOutlined,
  MenuOutlined,
  MonitorOutlined,
  SettingTwotone,
  UserAddOutlined,
  UserSwitchOutlined,
  FolderOpenOutlined
} from "@vicons/antd";

//前端路由图标映射表
export const constantRouterIcon = {
  //菜单图标
  DashboardOutlined: renderIcon(DashboardOutlined),
  ConsoleSqlOutlined: renderIcon(ConsoleSqlOutlined),
  MonitorOutlined: renderIcon(MonitorOutlined),
  SettingTwotone: renderIcon(SettingTwotone),
  UserAddOutlined: renderIcon(UserAddOutlined),
  UserSwitchOutlined: renderIcon(UserSwitchOutlined),
  MenuOutlined: renderIcon(MenuOutlined),
  BookOutlined: renderIcon(BookOutlined),
  FolderOpenOutlined: renderIcon(FolderOpenOutlined),
};
