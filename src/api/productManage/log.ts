import { defHttp, simpleHttp } from '@/utils/http/axios'
import { ResponseBean } from '../model/baseModel'

export const getProdLogList = (type, id) =>
  simpleHttp.get<ResponseBean<any>>({
    url: `/pm/prodLogs/${type}/${id}`,
  })
