import { h } from "vue";
import { AccountStatusEnum, GenderEnum } from "@/enums/common";
import { DataTableColumns, NButton } from "naive-ui";
import {
  validateGender,
  validateNickname,
  validatePassword,
  validateRoleSelect,
  validateUsername,
} from "@/utils/validate";
import componentSetting from "@/settings/component-setting";
import { IUserProfile } from "./types/user-type";
import { EConfigType, IConfigItem } from "@/components/conditional-panel/props";

export const createUserColumns = (updateFunction: Function, openDialogFunction: Function): DataTableColumns<IUserProfile> => {
  return [
    {
      type: 'selection',
      disabled: (row) => row.status === AccountStatusEnum.DELETE,
    },
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
      title: "用户名",
      key: "username",
      align: "center",
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: "昵称",
      key: "profile.nickname",
      align: "center",
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: "所属角色",
      key: "role.name",
      align: "center",
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: "状态",
      key: "status",
      align: "center",
      render(row) {
        return h("span", row.status === AccountStatusEnum.NORMAL ? "启用" : row.status === AccountStatusEnum.DISABLE ? "禁用" : "删除");
      },
    },
    {
      title: "创建时间",
      key: "createAt",
      align: "center",
    },
    {
      title: "性别",
      key: 'gender',
      align: "center",
      render(row) {
        return h("span", row.profile.gender === GenderEnum.MALE ? "男" : "女");
      },
    },
    {
      title: "操作",
      align: "center",
      key: "action",
      fixed: "right",
      width: 200,
      render(row) {
        //渲染多个按钮
        return h(
          "div",
          {
            class: "flex justify-evenly",
          },
          [
            h(
              NButton,
              {
                color: componentSetting.button.successColor,
                size: "small",
                onClick: () => updateFunction(true, row.id),
              },
              {
                default: () => "编辑",
              }
            ),
            (row.status !== AccountStatusEnum.DELETE && (row.status === AccountStatusEnum.NORMAL ? h(
              NButton,
              {
                color: componentSetting.button.warningColor,
                size: "small",
                onClick: () => openDialogFunction('禁用用户', `是否确认禁用${row.profile.nickname}用户？`, row.id, 'disable'),
              },
              {
                default: () => "禁用",
              }
            ) :
              h(
                NButton,
                {
                  color: componentSetting.button.defaultColor,
                  size: "small",
                  onClick: () => openDialogFunction('启用用户', `是否确认启用${row.profile.nickname}用户？`, row.id, 'enable'),
                },
                {
                  default: () => "启用",
                }
              ))),
            (
              row.status === AccountStatusEnum.DELETE ? h(
                NButton,
                {
                  color: componentSetting.button.secondaryColor,
                  size: "small",
                  onClick: () => openDialogFunction('恢复用户', `是否确认恢复${row.profile.nickname}用户？`, row.id, 'recover'),
                },
                {
                  default: () => "恢复",
                }
              ) : h(
                NButton,
                {
                  color: componentSetting.button.dangerColor,
                  size: "small",
                  onClick: () => openDialogFunction('删除用户', `是否确认删除${row.profile.nickname}用户？`, row.id, 'delete'),
                },
                {
                  default: () => "删除",
                }
              ),
            )
          ]
        );
      },
    },
  ];
};

export const rules = {
  username: [
    {
      required: true,
      validator: validateUsername,
      trigger: ["input", "blur"],
    },
  ],
  password: [
    {
      required: true,
      validator: validatePassword,
      trigger: ["input", "blur"],
    },
  ],
  nickname: [
    {
      required: true,
      validator: validateNickname,
      trigger: ["input", "blur"],
    },
  ],
  roleId: [
    {
      required: true,
      validator: validateRoleSelect,
      trigger: ["blur", "change"],
    },
  ],
  gender: [
    {
      required: true,
      validator: validateGender,
      trigger: ["input", "blur"],
    },
  ],
  avatar: [
    {
      required: true,
      message: "请上传头像",
      trigger: ["input", "blur"],
    },
  ],
};

export const genderOptions = [
  { label: "男", value: GenderEnum.MALE },
  { label: "女", value: GenderEnum.FEMALE },
];


export const conditionPanelConfig = (roleOptions):IConfigItem[] => {
  return [
    {
      title: "性别",
      type: EConfigType.Radio,
      filed:'gender',
      key:"gender",
      defaultValue:null,
      options:[
        {
          value: GenderEnum.MALE,
          label: "男"
        },
        {
          value: GenderEnum.FEMALE,
          label: "女"
        },
      ]
    },
    {
      title: "状态",
      type: EConfigType.Select,
      key:"status",
      filed:'status',
      defaultValue:null,
      options:[
        {
          value: AccountStatusEnum.NORMAL,
          label: "启用"
        },
        {
          value: AccountStatusEnum.DISABLE,
          label: "禁用"
        },
        {
          value: AccountStatusEnum.DELETE,
          label: "删除"
        },
      ]
    },
    {
      title: "角色",
      type: EConfigType.Select,
      key:"role",
      filed:'roleId',
      defaultValue:null,
      options:roleOptions
    }
  ]
} 