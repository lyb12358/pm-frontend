import { defHttp, simpleHttp } from '@/utils/http/axios'
import { SearchForm, ResponseBean } from './../model/baseModel'
import { UploadApiResult } from '../sys/model/uploadModel'
import { UploadFileParams } from '/#/axios'
import { useGlobSetting } from '/@/hooks/setting'

const { apiUrl } = useGlobSetting()

export const getBatchLogList = (data: SearchForm) =>
  defHttp.post<ResponseBean<any>>({
    url: '/pm/batchLogs',
    data,
  })
export const matBatchDataSync = (id) =>
  simpleHttp.post<ResponseBean<any>>({
    url: `/pm/batch/sync/mat/${id}`,
  })
export const prodBatchDataSync = (id) =>
  simpleHttp.post<ResponseBean<any>>({
    url: `/pm/batch/sync/prod/${id}`,
  })

//upload

export function addBatchProdCode(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: apiUrl + '/pm/prodCode/batch',
      onUploadProgress,
    },
    params,
  )
}
export function addBatchProdStyle(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: apiUrl + '/pm/prodStyle/batch',
      onUploadProgress,
    },
    params,
  )
}
export function addBatchMat(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: apiUrl + '/pm/mat/batch',
      onUploadProgress,
    },
    params,
  )
}

//modify

export function modifyBatchProdCode(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: apiUrl + '/pm/prodCode/batch/modify',
      onUploadProgress,
    },
    params,
  )
}
export function modifyBatchProdStyle(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: apiUrl + '/pm/prodStyle/batch/modify',
      onUploadProgress,
    },
    params,
  )
}
export function modifyBatchMat(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: apiUrl + '/pm/mat/batch/modify',
      onUploadProgress,
    },
    params,
  )
}
