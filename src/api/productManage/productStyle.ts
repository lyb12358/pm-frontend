import { defHttp, simpleHttp } from '@/utils/http/axios'
import { SearchForm, ResponseBean } from './../model/baseModel'

export const getProdStyleList = (data: SearchForm) =>
  defHttp.post<ResponseBean<any>>({
    url: '/prodStyles',
    data,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })
export const getProdStyleOptions = (data) =>
  defHttp.post<ResponseBean<any>>({
    url: '/prodStyles/options',
    data,
  })
export const getProdStyleById = (id) =>
  simpleHttp.get<ResponseBean<any>>({
    url: `/prodStyle/id/${id}`,
  })
export const addProdStyle = (data) =>
  simpleHttp.post<ResponseBean<any>>({
    url: '/prodStyle',
    data,
  })
export const updateProdStyle = (data) =>
  simpleHttp.put<ResponseBean<any>>({
    url: '/prodStyle',
    data,
  })
export const deleteProdStyle = (id) =>
  simpleHttp.delete<ResponseBean<any>>({
    url: `/prodStyle/${id}`,
  })
//计数
export const styleCount = () =>
  defHttp.get<ResponseBean<any>>({
    url: '/prodStyle/count',
  })
