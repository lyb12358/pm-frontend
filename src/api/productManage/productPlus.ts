import { defHttp, simpleHttp } from '@/utils/http/axios'
import { SearchForm, ResponseBean } from './../model/baseModel'

export const codeExport = (data: SearchForm) =>
  simpleHttp.post<ResponseBean<any>>({
    url: '/excel/prodCodes',
    data,
    responseType: 'blob',
  })

export const specDownload = (id) =>
  simpleHttp.get<ResponseBean<any>>({
    url: `/whiteApi/specs/${id}`,
    responseType: 'blob',
  })

export const importModelDownload = (name) =>
  simpleHttp.get<ResponseBean<any>>({
    url: `/importModel/${name}`,
    responseType: 'blob',
  })

export const recordDetailImage = (params) =>
  simpleHttp.post<ResponseBean<any>>({
    url: '/product/detailImage',
    params,
  })
