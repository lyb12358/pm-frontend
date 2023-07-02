import { defHttp, simpleHttp } from '@/utils/http/axios'
import { SearchForm, ResponseBean } from './../model/baseModel'

export const getProdCodeList = (data: SearchForm) =>
  defHttp.post<ResponseBean<any>>({
    url: '/pm/prodCodes',
    data,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })
export const getProdCodeById = (id) =>
  simpleHttp.get<ResponseBean<any>>({
    url: `/pm/prodCode/id/${id}`,
  })
export const addProdCode = (data, thirdFlag) =>
  simpleHttp.post<ResponseBean<any>>({
    url: `/pm/prodCode/${thirdFlag}`,
    data,
  })
export const updateProdCode = (data, thirdFlag) =>
  simpleHttp.put<ResponseBean<any>>({
    url: `/pm/prodCode/${thirdFlag}`,
    data,
  })
export const switchBind = (oldId, newId, codeId) =>
  simpleHttp.put<ResponseBean<any>>({
    url: `/pm/prodCodes/styleId/${oldId}/${newId}/${codeId}`,
  })
//计数
export const codeCount = () =>
  defHttp.get<ResponseBean<any>>({
    url: '/pm/prodCode/count',
  })
