import { http } from "@/utils/http";
import { BasicResponseModel, PaginationModel } from "@/api/user";
import { setObjToUrlParams } from "@/utils/url-utils";

export interface GetAllRolesParams {
  page: number;
  size?: number;
  name?: string;
}
export type CreateRoleModel = {
  name: string;
  menus: string[];
}
// 查询角色列表
export const findRoleListApi = (params: GetAllRolesParams) => {
  return http.request<BasicResponseModel<PaginationModel>>({
    url: setObjToUrlParams('/api/v1/role', params),
    method: "get",
  })
}
// 查询所有角色
export const findAllRolesApi = () => {
  return http.request<BasicResponseModel>({
    url: "/api/v1/role/all",
    method: "get",
  });
};
// 创建角色
export const createRoleApi = (data: CreateRoleModel) => {
  return http.request<BasicResponseModel>({
    url: "/api/v1/role",
    method: "post",
    data,
  },{
    isShowSuccessMessage: true,
  });
}
// 分配权限
export const distributionRoleApi = (id: number, data: {permissions:string[]}) => {
  return http.request<BasicResponseModel>({
    url: `/api/v1/role/${id}/permission`,
    method: "put",
    data,
  },{
    isShowSuccessMessage: true,
  });
}
//更新角色
export const updateRoleApi = (id: number, data: CreateRoleModel) => {
  return http.request<BasicResponseModel>({
    url: `/api/v1/role/${id}`,
    method: "put",
    data,
  },{
    isShowSuccessMessage: true,
  });
}
// 删除角色
export const deleteRoleApi = (id: number) => {
  return http.request<BasicResponseModel>({
    url: `/api/v1/role/${id}`,
    method: "delete",
  },{
    isShowSuccessMessage: true,
  });
}