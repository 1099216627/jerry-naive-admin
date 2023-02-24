import { IRessource } from './types/resource-type';
import { validateResourceName } from "@/utils/validate"
import { DataTableColumns, FormRules, NImage, NButton, useMessage } from "naive-ui"
import { h } from 'vue';
import { isHttpUrl } from '@/utils/is';
import componentSetting from '@/settings/component-setting';
export const createFormRules = (): FormRules => {
  return {
    name: [
      { required: true, validator: validateResourceName, trigger: ['blur', 'input'] },
    ],
    url: [
      { required: true, message: "请输入资源链接", trigger: ['blur', 'input'] },
    ],
    description: [
      { required: true, message: "请输入资源描述", trigger: ['blur', 'input'] },
    ],
    cover: [
      { required: true, message: "请输入资源封面", trigger: ['blur', 'input'] },
    ],
  }
}
export const createResourceColumns = (onOk,onCancel): DataTableColumns<IRessource> => {
  const message = useMessage()
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
      title: "资源名称",
      key: "name",
      align: "center",
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: "资源链接",
      key: "url",
      align: "center",
      ellipsis: {
        tooltip: true
      },
      render(row) {
        return h(NButton, {
          text: true,
          class: "text-blue-500 hover:text-blue-600 hover:underline",
          onClick() {
            if (!isHttpUrl(row.url)) {
              message.error('资源链接不合法')
              return
            }
            window.open(row.url)
          }
        }, () => row.url)
      }
    },
    {
      title: "资源描述",
      key: "description",
      align: "center",
      ellipsis: {
        tooltip: false,
        lineClamp: 1,
        expandTrigger: 'click'
      },
    },
    {
      title: "资源封面",
      key: "cover",
      align: "center",
      render(row) {
        return h(NImage, {
          src: row.cover,
          imgProps: {
            width: 50,
          }
        })
      }
    },
    {
      title: "创建时间",
      key: "createdAt",
      align: "center",
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: "操作",
      key: "action",
      align: "center",
      width: 150,
      render(row) {
        return h('div', {
          class: "flex justify-evenly"
        }, [
          h(NButton, {
            color: componentSetting.button.primaryColor,
            size: 'small',
            onClick:()=>onOk(row.id)
          }, '编辑'),
          h(NButton, {
            color: componentSetting.button.dangerColor,
            size: 'small',
            onClick:()=>onCancel(row.id)
          }, '删除')
        ])
      }
    },
  ]
}