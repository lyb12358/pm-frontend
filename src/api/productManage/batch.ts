import { defHttp, simpleHttp } from '@/utils/http/axios'
import { SearchForm, ResponseBean } from './../model/baseModel'

export const getProdStyleList = (data: SearchForm) =>
  defHttp.post<ResponseBean<any>>({
    url: '/prodStyles',
    data,
  })
export const getBatchLogList = (data: SearchForm) =>
  defHttp.post<ResponseBean<any>>({
    url: '/batchLogs',
    data,
  })
export const addMatBatchDataSync = (params) =>
  defHttp.post<ResponseBean<any>>({
    url: `/batch/sync/mat/${params.id}`,
  })
export const addProdBatchDataSync = (params) =>
  defHttp.post<ResponseBean<any>>({
    url: `/batch/sync/prod/${params.id}`,
  })
