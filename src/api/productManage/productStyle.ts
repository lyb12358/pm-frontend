import { defHttp, simpleHttp } from '@/utils/http/axios'
import { SearchForm, ResponseBean } from './../model/baseModel'

export const getProdStyleList = (data: SearchForm) =>
  defHttp.post<ResponseBean<any>>({
    url: '/pm/prodStyles',
    data,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })
export const getProdStyleOptions = (data) =>
  defHttp.post<Recordable<any>>({
    url: '/pm/prodStyles/options',
    data,
  })
export const getProdStyleById = (id) =>
  simpleHttp.get<ResponseBean<any>>({
    url: `/pm/prodStyle/id/${id}`,
  })
export const getProdStyleByProdStyle = (prodStyle) =>
  simpleHttp.get<ResponseBean<any>>({
    url: `/pm/prodStyle/prodStyle/${prodStyle}`,
  })
export const addProdStyle = (data) =>
  simpleHttp.post<ResponseBean<any>>({
    url: '/pm/prodStyle',
    data,
  })
export const updateProdStyle = (data) =>
  simpleHttp.put<ResponseBean<any>>({
    url: '/pm/prodStyle',
    data,
  })
export const deleteProdStyle = (id) =>
  simpleHttp.delete<ResponseBean<any>>({
    url: `/pm/prodStyle/${id}`,
  })
//计数
export const styleCount = () =>
  simpleHttp.get<ResponseBean<any>>({
    url: '/pm/prodStyle/count',
  })
