import { FormItemRule } from "naive-ui";
import { GenderEnum } from "@/enums/common";
import { isVoid } from "@/utils/is";
import { log } from "console";
export const validateUsername = (_: FormItemRule, value: string) => {
  if (!value) {
    return new Error("请输入用户名");
  } else if (value.length < 6 || value.length > 20) {
    return new Error("用户名长度为6-20位");
  } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
    return "用户名只能包含字母、数字和下划线";
  }
  return true;
};

export const validateRoleSelect = (_: FormItemRule, value: string) => {
  if (isVoid(value)) {
    return new Error("请选择角色");
  }
  return true;
};

export const validatePassword = (_: FormItemRule, value: string) => {
  if (!value) {
    return new Error("请输入密码");
  } else if (value.length < 6 || value.length > 20) {
    return new Error("密码长度为6-20位");
  } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
    return "密码只能包含字母、数字和下划线";
  }
  return true;
};

export const validateNickname = (_: FormItemRule, value: string) => {
  if (!value) {
    return new Error("昵称不能为空");
  } else if (value.length > 20) {
    return new Error("昵称不能超过20个字符");
  }
  return true;
};

export const validateGender = (_: FormItemRule, value: GenderEnum) => {
  if (!value) {
    return new Error("性别不能为空");
  }
  if (!Object.values(GenderEnum).includes(value)) {
    return new Error("性别不正确");
  }
  return true;
};


export const validateSelectMenus = (_: FormItemRule, value: string[]) => {    
  if (!value || value.length === 0) {
    return new Error("请选择菜单");
  }
  return true;
}

export const validateRoleName = (_: FormItemRule, value: string) => {
  if (!value) {
    return new Error("角色名称不能为空");
  } else if (value.length > 20) {
    return new Error("角色名称不能超过20个字符");
  }
  return true;
}

export const validateResourceName = (_: FormItemRule, value: string) => {
  if (!value) {
    return new Error("资源名称不能为空");
  } else if (value.length > 20) {
    return new Error("资源名称不能超过50个字符");
  }
  return true;
}
