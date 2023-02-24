import { DataTableColumns } from 'naive-ui';
import { h } from 'vue';
import { ILog } from "./types/log-model";

export const createLogColumns = ():DataTableColumns<ILog> => {
  return [
    {
      title: "#",
      align: "center",
      key: "index",
      width: 60,
      render(_, index) {
        return h("span", index + 1);
      },
    },
    {
      title: "接口名称",
      key: "name",
      align: "center",
      ellipsis: {
        tooltip: true,
      }
    },
    {
      title: "请求方式",
      key: "method",
      align: "center",
      ellipsis: {
        tooltip: true,
      }
    },
    {
      title: "状态码",
      key: "code",
      align: "center",
    },
    {
      title: "请求路径",
      key: "path",
      align: "center",
      ellipsis: {
        tooltip: true,
      }
    },
    {
      title: "请求时长(ms)",
      key: "time",
      align: "center",
      ellipsis: {
        tooltip: true,
      }
    },
    {
      title: "ip",
      key: "ip",
      align: "center",
      ellipsis: {
        tooltip: true,
      }
    },
    {
      title: "创建时间",
      key: "createdAt",
      align: "center",
      ellipsis: {
        tooltip: true,
      }
    },
    {
      title: "请求用户",
      key: "user",
      align: "center",
      render: (row) => {
        return h("span", row.user?.username);
      }
    },
  ]
}