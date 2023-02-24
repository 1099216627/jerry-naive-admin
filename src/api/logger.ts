import { BasicResponseModel, PaginationModel } from './user';
import { http } from "@/utils/http"
import { setObjToUrlParams } from '@/utils/url-utils';
type GetLogListParams = {
  page: number;
  limit: number;
}
//获取日志
export const getLogListApi = (query: GetLogListParams) => {
  return http.request<BasicResponseModel<PaginationModel>>({
    url: setObjToUrlParams('/api/v1//log/list', query),
    method: "get",
  })
}
//删除全部日志
export const deleteAllLogApi = () => {
  return http.request<BasicResponseModel>({
    url: '/api/v1//log/all',
    method: "delete",
  })
}
//删除区间日志
export const deleteLogApi = (data: { start: number, end: number }) => {
  return http.request<BasicResponseModel>({
    url: '/api/v1//log',
    method: "delete",
    data
  })
}