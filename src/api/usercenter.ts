import { defHttp, simpleHttp } from '@/utils/http/axios'
import { SearchForm, ResponseBean } from './model/baseModel'

export const getUsercenterLogout = () =>
  defHttp.post<any>({
    url: '/beyond-usercenter/logout',
  })

export const getUserInfo = (data) =>
  defHttp.post<any>({
    url: '/beyond-usercenter/common/getUserInfo',
    data,
  })

export const getMenuList = (data) =>
  defHttp.post<any>({
    url: '/beyond-usercenter/common/getMenusByBrand',
    data,
  })

export const getAuth = () =>
  defHttp.post<any>({
    url: '/beyond-usercenter/common/auth',
  })
