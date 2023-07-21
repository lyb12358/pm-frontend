import { defHttp, simpleHttp } from '@/utils/http/axios'
import { SearchForm, ResponseBean } from '../model/baseModel'

export const getAnalysisList = (data: SearchForm) =>
  defHttp.post<ResponseBean<any>>({
    url: '/pm/analyses',
    data,
  })
export const addAnalysis = (data) =>
  simpleHttp.post<ResponseBean<any>>({
    url: '/pm/analysis',
    data,
  })
export const updateAnalysis = (data) =>
  simpleHttp.put<ResponseBean<any>>({
    url: '/pm/analysis',
    data,
  })
export const getAnalysisDetailListByParent = (id) =>
  simpleHttp.get<ResponseBean<any>>({
    url: `/pm/analysisDetails/list/${id}`,
  })
export const addAnalysisDetail = (data) =>
  simpleHttp.post<ResponseBean<any>>({
    url: '/pm/analysisDetail',
    data,
  })
export const updateAnalysisDetail = (data) =>
  simpleHttp.put<ResponseBean<any>>({
    url: '/pm/analysisDetail',
    data,
  })
export const deleteAnalysisDetail = (id) =>
  simpleHttp.delete<ResponseBean<any>>({
    url: `/pm/analysisDetail/${id}`,
  })
