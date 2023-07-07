import { defHttp, simpleHttp } from '@/utils/http/axios'
import { SearchForm, ResponseBean } from '../model/baseModel'

export const getAnalysisList = (data: SearchForm) =>
  defHttp.post<ResponseBean<any>>({
    url: '/pm/analyses',
    data,
  })
