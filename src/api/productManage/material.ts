import { defHttp, simpleHttp } from '@/utils/http/axios'
import { SearchForm, ResponseBean } from './../model/baseModel'

export const getMaterialList = (data: SearchForm) =>
  defHttp.post<ResponseBean<any>>({
    url: '/pm/mats',
    data,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })
export const getMatById = (params) =>
  defHttp.get<ResponseBean<any>>({
    url: `/pm/mat/id/${params.id}`,
  })
export const addMat = (data) =>
  simpleHttp.post<ResponseBean<any>>({
    url: '/pm/mat',
    data,
  })
export const updateMat = (data) =>
  simpleHttp.put<ResponseBean<any>>({
    url: '/pm/mat',
    data,
  })
//计数
export const matCount = () =>
  defHttp.get<ResponseBean<any>>({
    url: '/pm/mat/count',
  })
