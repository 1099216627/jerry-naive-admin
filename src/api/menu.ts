import { http } from "@/utils/http";
import { BasicResponseModel } from "@/api/user";

export function getUserMenusApi() {
  return http.request<BasicResponseModel>({
    url: "/api/v1/menu/user",
    method: "get",
  });
}


export function getMenusApi() {
  return http.request<BasicResponseModel>({
    url: "/api/v1/menu",
    method: "get",
  });
}

export function getPermissionsApi() {
  return http.request<BasicResponseModel>({
    url: "/api/v1/menu/permissions",
    method: "get",
  });
}