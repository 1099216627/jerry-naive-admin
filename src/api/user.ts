import { http } from "@/utils/http";
import { AccountStatusEnum, GenderEnum } from "@/enums/common";
import { setObjToUrlParams } from "@/utils/url-utils";
import { IUserProfile } from "@/views/system/system-user/types/user-type";
export interface BasicResponseModel<T = any> {
  code: number;
  message: string;
  data: T;
}
export interface PaginationModel<T = any> {
  total: number;
  page: number;
  pages: number;
  size: number;
  list: T[];
}
export interface getAllUsersParams {
  page: number;
  limit?: number;
  username?: string;
  roleId?: number | null;
  gender?: GenderEnum | null;
  status?: AccountStatusEnum | null;
}
//登录
export function signInApi(data) {
  return http.request<BasicResponseModel>({
    url: "/api/v1/auth/signin",
    method: "post",
    data,
  });
}
//注册
export function signUpApi(data) {
  return http.request<BasicResponseModel>({
    url: "/api/v1/auth/signup",
    method: "post",
    data,
  });
}
//获取用户信息
export function getUserInfoApi() {
  return http.request<BasicResponseModel>({
    url: "/api/v1/auth/userinfo",
    method: "get",
  });
}

//更新用户信息
export function updateUserInfoApi(id: number, data) {
  return http.request<BasicResponseModel>(
    {
      url: `/api/v1/profile/${id}`,
      method: "put",
      data,
    },
    { isShowSuccessMessage: true }
  );
}
//获取用户列表
export function getAllUsersApi(query: getAllUsersParams) {
  return http.request<BasicResponseModel<PaginationModel<IUserProfile>>>({
    url: setObjToUrlParams("/api/v1/user", query),
    method: "get",
  });
}
//新建用户
export function createUserApi(data) {
  return http.request<BasicResponseModel>(
    {
      url: "/api/v1/user",
      method: "post",
      data,
    },
    { isShowSuccessMessage: true }
  );
}
//查询用户详情
export function getUserDetailApi(id: number) {
  return http.request<BasicResponseModel<IUserProfile>>({
    url: `/api/v1/user/${id}`,
    method: "get",
  });
}
//禁用用户
export function disableUserApi(id: number) {
  return http.request<BasicResponseModel>(
    {
      url: `/api/v1/user/disable/${id}`,
      method: "put",
    },
    { isShowSuccessMessage: true }
  );
}
//启用用户
export function enableUserApi(id: number) {
  return http.request<BasicResponseModel>(
    {
      url: `/api/v1/user/enable/${id}`,
      method: "put",
    },
    { isShowSuccessMessage: true }
  );
}
//删除用户
export function deleteUserApi(id: number) {
  return http.request<BasicResponseModel>(
    {
      url: `/api/v1/user/${id}`,
      method: "delete",
    },
    { isShowSuccessMessage: true }
  );
}
//恢复用户
export function recoverUserApi(id: number) {
  return http.request<BasicResponseModel>(
    {
      url: `/api/v1/user/recover/${id}`,
      method: "put",
    },
    { isShowSuccessMessage: true }
  );
}
//批量删除用户
export function batchDeleteUserApi(data:{ids:number[]}) {
  return http.request<BasicResponseModel>(
    {
      url: `/api/v1/user/batch`,
      method: "delete",
      data,
    },
    { isShowSuccessMessage: true }
  );
}

export function getUserListByIDsApi(ids: number[]) {
  const query = ids.join(",");
  return http.request<BasicResponseModel<IUserProfile[]>>({
    url: setObjToUrlParams("/api/v1/user/list", { ids: query }),
    method: "get",
  });
}