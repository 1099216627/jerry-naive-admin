import { DataTableColumns, NButton } from "naive-ui"
import { h } from "vue"
import { IRole } from "./types/role-type"
import componentSetting from "@/settings/component-setting"
import { validateRoleName, validateSelectMenus } from "@/utils/validate"
export const createRoleColumns = (updateFn,distributionFn,deleteFn): DataTableColumns<IRole> => {
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
      title: '角色名称',
      key: 'name',
      align: 'center',
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: '拥有菜单',
      key: 'menus',
      align: 'center',
      ellipsis: {
        tooltip: false,
        lineClamp: 1,
        expandTrigger: 'click'
      },
      render(row) {
        return row.menus.map((item) => item.title).join(',')
      }
    },
    {
      title: '拥有权限',
      key: 'permissions',
      align: 'center',
      ellipsis: {
        tooltip: false,
        lineClamp: 1,
        expandTrigger: 'click'
      },
      render(row) {
        return row.permissions.map((item) => item.title).join(',')
      }
    },
    {
      title: '创建时间',
      key: 'createdAt',
      align: 'center',
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 250,
      fixed: 'right',
      render(row) {
       return h('div',{
        class:'flex justify-evenly'
       }, [
          h(NButton, {
            color:componentSetting.button.primaryColor,
            size: 'small',
            onClick: ()=>updateFn(row.id)
          }, () => '编辑'),
          h(NButton, {
            color:componentSetting.button.warningColor,
            size: 'small',
            onClick: () => distributionFn(row.id)
          }, () => '分配权限'),
          h(NButton, {
            color:componentSetting.button.dangerColor,
            size: 'small',
            onClick: () => deleteFn(row.id)
          }, () => '删除')
        ])
    }
  },
  ]
}


export const formRules = {
  name: [
    {
      required: true,
      validator:validateRoleName,
      trigger: ["input", "blur"],
    }
  ],
  menus: [
    {
      required: true,
      validator:validateSelectMenus,
      trigger: ["change", "blur"],
    }
  ]
}