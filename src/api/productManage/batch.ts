import { defHttp, simpleHttp } from '@/utils/http/axios'
import { SearchForm, ResponseBean } from './../model/baseModel'

export const getBatchLogList = (data: SearchForm) =>
  defHttp.post<ResponseBean<any>>({
    url: '/pm/batchLogs',
    data,
  })
export const addMatBatchDataSync = (params) =>
  defHttp.post<ResponseBean<any>>({
    url: `/pm/batch/sync/mat/${params.id}`,
  })
export const addProdBatchDataSync = (params) =>
  defHttp.post<ResponseBean<any>>({
    url: `/pm/batch/sync/prod/${params.id}`,
  })
