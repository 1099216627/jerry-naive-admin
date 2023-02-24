import GitHubIcon from "@/assets/icons/github.svg";
import GiteeIcon from "@/assets/icons/gitee.svg";
import NestJsIcon from "@/assets/icons/nest.svg";
import VueIcon from "@/assets/icons/vue.svg";
import TypeOrmIcon from "@/assets/icons/typeorm.svg";
import AntDesignIcon from "@/assets/icons/antDesign.svg";
import ReactIcon from "@/assets/icons/react.svg";
import ElementIcon from "@/assets/icons/element.svg";
import DashboardIcon from "@/assets/icons/dashboard.svg";
import MenuIcon from "@/assets/icons/menu.svg";
import RoleIcon from "@/assets/icons/role.svg";
import UserIcon from "@/assets/icons/user.svg";
import ResourceIcon from "@/assets/icons/resource.svg";
export interface IProject {
  title: string;
  description: string;
  icon: string;
  url: string;
}
export const resources: IProject[] = [
  {
    title: "GitHub",
    icon: GitHubIcon,
    description: "是一个面向开源及私有软件项目的托管平台。",
    url: "",
  },
  {
    title: "Gitee",
    icon: GiteeIcon,
    description: "是一个面向开源及私有软件项目的托管平台。",
    url: "",
  },
  {
    title: "NestJS",
    icon: NestJsIcon,
    description:
      "是一个用于构建高效、可扩展的 Node.js 服务器端应用程序的框架。",
    url: "",
  },
  {
    title: "TypeORM",
    icon: TypeOrmIcon,
    description:
      "是一个使用 TypeScript 编写的 ORM，支持 MySQL、PostgreSQL、MariaDB、SQLite、Microsoft SQL Server、Oracle、WebSQL、CockroachDB、Amazon Redshift、Microsoft Azure SQL Database、SAP Hana、MongoDB 等数据库。",
    url: "",
  },
  {
    title: "Vue",
    icon: VueIcon,
    description: "是一套用于构建用户界面的渐进式框架。",
    url: "",
  },
  {
    title: "React",
    icon: ReactIcon,
    description: "是一个用于构建用户界面的 JavaScript 库。",
    url: "",
  },
  {
    title: "Ant Design",
    icon: AntDesignIcon,
    description: "是一个企业级 UI 设计语言和 React 实现。",
    url: "",
  },
  {
    title: "Element",
    icon: ElementIcon,
    description:
      "是一套为开发者、设计师和产品经理准备的基于 Vue 2.0 的桌面端组件库。",
    url: "",
  },
  {
    title: "Vue Element Admin",
    icon: VueIcon,
    description: "是一个基于 Vue 和 Element 的后台集成解决方案。",
    url: "",
  },
];

export const dynamics = [
  {
    id: 1,
    content: "加入了项目",
    time: "2020-01-01",
  },
  {
    id: 2,
    content: "加入了项目",
    time: "2020-01-01",
  },
  {
    id: 3,
    content: "加入了项目",
    time: "2020-01-01",
  },
  {
    id: 4,
    content: "加入了项目",
    time: "2020-01-01",
  },
  {
    id: 5,
    content: "加入了项目",
    time: "2020-01-01",
  },
];

export const quicks = [
  {
    title: "主控台",
    path: "/dashboard/console",
    icon: DashboardIcon,
  },
  {
    title: "用户管理",
    path: "/system/user-manage",
    icon: UserIcon,
  },
  {
    title: "角色管理",
    path: "/system/role-manage",
    icon: RoleIcon,
  },
  {
    title: "菜单管理",
    path: "/system/menu-manage",
    icon: MenuIcon,
  },
  {
    title: "日志管理",
    path: "/system/log-manage",
    icon: DashboardIcon,
  },
  {
    title: "资源管理",
    path: "/system/resources",
    icon: ResourceIcon,
  },
];
