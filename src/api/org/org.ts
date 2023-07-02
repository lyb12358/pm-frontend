import { defHttp } from '@/utils/http/axios'
import { ResponseBean } from '../model/baseModel'

export const getComOptions = () =>
  defHttp.get<ResponseBean<any>>({
    url: '/pm/com/options',
  })
