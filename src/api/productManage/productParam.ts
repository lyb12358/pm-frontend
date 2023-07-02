import { defHttp, simpleHttp } from '@/utils/http/axios'
import { ResponseBean } from '../model/baseModel'
//cat
export const getProdCatOptions = () =>
  defHttp.get<ResponseBean<any>>({
    url: '/pm/prodCats/options',
  })
export const getProdCatOptionsByParent = (id) =>
  defHttp.get<ResponseBean<any>>({
    url: `/pm/prodCats/catType/${id}`,
  })
export const getProdCatListByParent = (id) =>
  defHttp.get<ResponseBean<any>>({
    url: `/pm/prodCats/list/${id}`,
  })
export const addProdCat = (data) =>
  simpleHttp.post<ResponseBean<any>>({
    url: '/pm/prodCat',
    data,
  })
export const updateProdCat = (data) =>
  simpleHttp.put<ResponseBean<any>>({
    url: '/pm/prodCat',
    data,
  })
//class
export const getProdClassTree = () =>
  defHttp.get<ResponseBean<any>>({
    url: '/pm/prodClasses/tree',
  })
export const getMatClassTree = () =>
  defHttp.get<ResponseBean<any>>({
    url: '/pm/matClasses/tree',
  })
export const getProdClassTreeOnMiddleType = () =>
  defHttp.get<ResponseBean<any>>({
    url: '/pm/prodClasses/tree/middleType',
  })
export const getProdClassTreeOnBigType = () =>
  defHttp.get<ResponseBean<any>>({
    url: '/pm/prodClasses/tree/bigType',
  })
export const getProdClassOptionsByParent = (id) =>
  defHttp.get<ResponseBean<any>>({
    url: `/pm/prodClasses/classType/${id}`,
  })
export const addProdClass = (data) =>
  simpleHttp.post<ResponseBean<any>>({
    url: '/pm/prodCat',
    data,
  })
export const updateProdClass = (data) =>
  simpleHttp.put<ResponseBean<any>>({
    url: '/pm/prodCat',
    data,
  })

//param
export const getProdParamOptions = () =>
  defHttp.get<ResponseBean<any>>({
    url: '/pm/prodParams/options',
  })
export const getProdParamTree = () =>
  defHttp.get<ResponseBean<any>>({
    url: '/pm/prodParams/tree',
  })
export const getProdParamOptionsByParent = (id) =>
  defHttp.get<ResponseBean<any>>({
    url: `/pm/prodCats/paramType/${id}`,
  })
export const getProdParamListByParent = (id) =>
  defHttp.get<ResponseBean<any>>({
    url: `/pm/prodParams/list/${id}`,
  })
export const addProdParam = (data) =>
  simpleHttp.post<ResponseBean<any>>({
    url: '/pm/prodParam',
    data,
  })
export const updateProdParam = (data) =>
  simpleHttp.put<ResponseBean<any>>({
    url: '/pm/prodParam',
    data,
  })
//Spe
export const getProdSpeOptions = () =>
  defHttp.get<ResponseBean<any>>({
    url: '/pm/prodSpes/options',
  })
export const getProdSpeOptionsByParent = (id) =>
  defHttp.get<ResponseBean<any>>({
    url: `/pm/prodSpes/speType/${id}`,
  })
export const getProdSpeListByParent = (id) =>
  defHttp.get<ResponseBean<any>>({
    url: `/pm/prodSpes/list/${id}`,
  })
export const addProdSpe = (data) =>
  simpleHttp.post<ResponseBean<any>>({
    url: '/pm/prodSpe',
    data,
  })
export const updateProdSpe = (data) =>
  simpleHttp.put<ResponseBean<any>>({
    url: '/pm/prodSpe',
    data,
  })
