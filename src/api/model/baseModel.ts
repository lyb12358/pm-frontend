export interface BasicPageParams {
  page: number
  pageSize: number
}

export interface BasicFetchResult<T> {
  items: T[]
  total: number
}
//new
export interface SearchForm {
  page?: number
  row?: number
  prodCode?: string
  prodName?: string
  prodStyle?: string
  styleName?: string
  styleId?: number
  typeName?: string
  attrName?: string
  bigType?: number
  middleType?: number
  smallType?: number
  bigName?: string
  middleName?: string
  smallName?: string
  prodFamily?: number
  prodType?: number
  comId?: number
  matCode?: string
  matName?: string
  gmtCreateStart?: Date
  gmtCreateEnd?: Date
  gmtModifiedStart?: Date
  gmtModifiedEnd?: Date
}

export interface ResponseBean<T> {
  //返回值会被直接提取data，这样可以使用filter等方法而不会报ts错误
  [x: string]: any
  data: T
  msg: string
  code: number
}
