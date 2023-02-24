import { setObjToUrlParams } from '@/utils/url-utils';
import { PaginationModel } from '@/api/user';
import { BasicResponseModel } from '@/api/user';
import { http } from '@/utils/http';
type createResoureParams = {
  name: string;
  url: string;
  description: string;
  cover: string;
}

type getResourceListParams = {
  page: number;
  limit?: number;
  name?: string;
}
//新建资源
export const createResourceApi = (data: createResoureParams) => {
  return http.request<BasicResponseModel>({
    url: '/api/v1/resources',
    method: 'post',
    data
  },{
    isShowSuccessMessage: true,
  })
}
//获取资源列表
export const getResourceListApi = (data: getResourceListParams) => {
  return http.request<BasicResponseModel<PaginationModel>>({
    url: setObjToUrlParams('/api/v1/resources', data),
    method: 'get',
    data
  })
}
//更新资源
export const updateResourceApi = (id:number,data: createResoureParams) => {
  return http.request<BasicResponseModel>({
    url: `/api/v1/resources/${id}`,
    method: 'put',
    data
  },{
    isShowSuccessMessage: true
  })
}
//删除资源
export const deleteResourceApi = (id:number) => {
  return http.request<BasicResponseModel>({
    url: `/api/v1/resources/${id}`,
    method: 'delete',
  },{
    isShowSuccessMessage: true
  })
}