import { defHttp, simpleHttp } from '@/utils/http/axios'
import { SearchForm, ResponseBean } from './../model/baseModel'

export const getProdCodeList = (data: SearchForm) =>
  defHttp.post<ResponseBean<any>>({
    url: '/prodCodes',
    data,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })
export const getProdCodeById = (id) =>
  simpleHttp.get<ResponseBean<any>>({
    url: `/prodCode/id/${id}`,
  })
export const addProdCode = (data, thirdFlag) =>
  simpleHttp.post<ResponseBean<any>>({
    url: `/prodCode/${thirdFlag}`,
    data,
  })
export const updateProdCode = (data, thirdFlag) =>
  simpleHttp.put<ResponseBean<any>>({
    url: `/prodCode/${thirdFlag}`,
    data,
  })
export const switchBind = (oldId, newId, codeId) =>
  simpleHttp.put<ResponseBean<any>>({
    url: `/prodCode/styleId/${oldId}/${newId}/${codeId}`,
  })
//计数
export const codeCount = () =>
  defHttp.get<ResponseBean<any>>({
    url: '/prodCode/count',
  })
