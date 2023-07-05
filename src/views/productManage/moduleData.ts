import { FormProps } from '@/components/Table'
import { BasicColumn } from '@/components/Table/src/types/table'
import { getComOptions } from '@/api/org/org'
import { dateUtil } from '@/utils/dateUtil'
import { FormSchema } from '@/components/Form/index'
import type { RuleObject } from 'ant-design-vue/lib/form/interface'
import { DescItem } from '@/components/Description/index'

//code
export function getProdCodeColumns(): BasicColumn[] {
  return [
    { dataIndex: 'prodCode', title: '商品编号', key: 'prodCode' },
    {
      dataIndex: 'codeThumbnail',
      title: '简图',
      key: 'codeThumbnail',
      helpMessage: [
        '优先展示编号图片，没有编号图片则展示款式图片',
        '点击图片可以放大预览',
        '这只是缩略图',
        '要下载原图请点击对应按钮',
      ],
    },
    { dataIndex: 'prodName', title: '商品名称', key: 'prodName' },
    { dataIndex: 'catName', title: '品类', key: 'catName' },
    { dataIndex: 'prodStyle', title: '款号', key: 'prodStyle' },
    { dataIndex: 'familyName', title: '商品归属', key: 'familyName', defaultHidden: true },
    { dataIndex: 'typeName', title: '商品类别', key: 'typeName' },
    { dataIndex: 'bigName', title: '大类', key: 'bigName', defaultHidden: true },
    { dataIndex: 'middleName', title: '中类', key: 'middleName' },
    { dataIndex: 'smallName', title: '小类', key: 'smallName' },
    { dataIndex: 'attrName', title: '属性', key: 'attrName', defaultHidden: true },
    { dataIndex: 'comName', title: '品牌', key: 'comName', defaultHidden: true },
    { dataIndex: 'speName', title: '规格', key: 'speName' },
    { dataIndex: 'colorName', title: '花色', key: 'colorName', defaultHidden: true },
    { dataIndex: 'retailPrice', title: '零售价', key: 'retailPrice' },
    { dataIndex: 'supplyPrice', title: '供应价', key: 'supplyPrice' },
    { dataIndex: 'costPrice', title: '成本价', key: 'costPrice' },
    { dataIndex: 'numModel', title: '件数', key: 'numModel', defaultHidden: true },
    { dataIndex: 'netWeight', title: '克重', key: 'netWeight', defaultHidden: true },
    { dataIndex: 'boxNum', title: '装箱数', key: 'boxNum', defaultHidden: true },
    { dataIndex: 'boxModel', title: '装箱规格', key: 'boxModel', defaultHidden: true },
    { dataIndex: 'boxVolume', title: '装箱体积', key: 'boxVolume', defaultHidden: true },
    { dataIndex: 'boxWeight', title: '箱重量', key: 'boxWeight', defaultHidden: true },
    { dataIndex: 'boxWarn', title: '散货预警量', key: 'boxWarn', defaultHidden: true },
    { dataIndex: 'isRemind', title: '库存提醒', key: 'isRemind', defaultHidden: true },
    { dataIndex: 'isSecurity', title: '是否防伪码', key: 'isSecurity', defaultHidden: true },
    { dataIndex: 'isRate', title: '计算周转率', key: 'isRate', defaultHidden: true },
    { dataIndex: 'prodCycle', title: '生产周期(天)', key: 'prodCycle', defaultHidden: true },
    { dataIndex: 'yearName', title: '年份', key: 'yearName', defaultHidden: true },
    { dataIndex: 'seasonName', title: '季节', key: 'seasonName', defaultHidden: true },
    { dataIndex: 'unitName', title: '单位', key: 'unitName', defaultHidden: true },
    { dataIndex: 'prodMat', title: '材质', key: 'prodMat', defaultHidden: true },
    { dataIndex: 'levelName', title: '档次', key: 'levelName', defaultHidden: true },
    { dataIndex: 'designerName', title: '设计师', key: 'designerName', defaultHidden: true },
    { dataIndex: 'codeIsSync', title: '是否同步', key: 'codeIsSync', defaultHidden: true },
    { dataIndex: 'code69', title: '69码', key: 'code69', defaultHidden: true },
    { dataIndex: 'grossWeight', title: '单品毛重', key: 'grossWeight', defaultHidden: true },
    { dataIndex: 'singleWeight', title: '单品净重', key: 'singleWeight', defaultHidden: true },
    { dataIndex: 'pakMat', title: '包装材质', key: 'pakMat', defaultHidden: true },
    { dataIndex: 'pakSize', title: '单品包装尺寸', key: 'pakSize', defaultHidden: true },
    {
      dataIndex: 'gmtCreate',
      title: '创建时间',
      key: 'gmtCreate',
      defaultHidden: true,
      format: (text) => {
        return dateUtil(text).format('YYYY-MM-DD HH:mm:ss')
      },
    },
    {
      dataIndex: 'gmtModified',
      title: '修改时间',
      key: 'gmtModified',
      defaultHidden: true,
      format: (text) => {
        return dateUtil(text).format('YYYY-MM-DD HH:mm:ss')
      },
    },
  ]
}
export function getProdCodeFormConfig(): Partial<FormProps> {
  return {
    //compact: true,
    autoSubmitOnEnter: true,
    labelWidth: 80,
    baseColProps: {
      span: 6,
    },
    fieldMapToTime: [
      ['gmtCreate', ['gmtCreateStart', 'gmtCreateEnd']],
      ['gmtModified', ['gmtModifiedStart', 'gmtModifiedEnd']],
    ],
    schemas: [
      {
        field: `prodCode`,
        label: `编号`,
        component: 'Input',
      },
      {
        field: `prodName`,
        label: `名称`,
        component: 'Input',
      },
      {
        field: `prodClass`,
        label: `类别`,
        component: 'Cascader',
        componentProps: {
          changeOnSelect: true,
        },
      },
      {
        field: `prodStyle`,
        label: `款号`,
        component: 'Input',
      },
      {
        field: `comId`,
        label: `品牌`,
        component: 'ApiSelect',
        componentProps: {
          api: getComOptions,
        },
      },
      {
        field: `gmtCreate`,
        label: `添加时间`,
        component: 'RangePicker',
      },
      {
        field: `gmtModified`,
        label: `修改时间`,
        component: 'RangePicker',
      },
    ],
  }
}
//code modal schema
export const codeModalSchemas: FormSchema[] = [
  {
    field: 'id',
    component: 'Input',
    label: 'id',
    show: false,
  },
  {
    field: 'styleId',
    component: 'Input',
    label: '款号',
    show: false,
  },
  {
    field: 'prodCode',
    component: 'Input',
    label: '编号',
    rules: [{ max: 20, required: true, message: '编号是必填项,且不超过20位' }],
  },
  {
    field: 'prodName',
    component: 'Input',
    label: '名称',
    rules: [{ max: 30, required: true, message: '名称是必填项,且不超过30位' }],
  },
  {
    field: 'prodCat',
    component: 'Select',
    label: '品类',
    componentProps: {
      showSearch: true,
      optionFilterProp: 'label',
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'prodSpe',
    component: 'Select',
    label: '规格',
    componentProps: {
      showSearch: true,
      optionFilterProp: 'label',
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'smallType',
    component: 'Select',
    label: '小类',
    componentProps: {
      showSearch: true,
      optionFilterProp: 'label',
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'prodMat',
    component: 'Input',
    label: '材质',
    rules: [{ max: 100, message: '材质不能过长' }],
  },
  {
    field: 'retailPrice',
    component: 'InputNumber',
    label: '零售价',
    rules: [{ type: 'number', min: 0, max: 999999, required: true, message: '请填写有效值' }],
    componentProps: { min: 0, max: 999999, precision: 2 },
  },
  {
    field: 'supplyPrice',
    component: 'InputNumber',
    label: '供应价',
    rules: [{ type: 'number', min: 0, max: 999999, required: true, message: '请填写有效值' }],
    componentProps: { min: 0, max: 999999, precision: 2 },
  },
  {
    field: 'costPrice',
    component: 'InputNumber',
    label: '成本价',
    rules: [{ type: 'number', min: 0, max: 999999, required: true, message: '请填写有效值' }],
    componentProps: { min: 0, max: 999999, precision: 2 },
  },
  {
    field: 'costPrice2',
    component: 'InputNumber',
    label: '成本价2',
    rules: [{ type: 'number', min: 0, max: 999999, message: '请填写有效值' }],
    componentProps: { min: 0, max: 999999, precision: 2 },
  },
  {
    field: 'costPrice3',
    component: 'InputNumber',
    label: '成本价3',
    rules: [{ type: 'number', min: 0, max: 999999, message: '请填写有效值' }],
    componentProps: { min: 0, max: 999999, precision: 2 },
  },
  {
    field: 'costPrice4',
    component: 'InputNumber',
    label: '成本价4',
    rules: [{ type: 'number', min: 0, max: 999999, message: '请填写有效值' }],
    componentProps: { min: 0, max: 999999, precision: 2 },
  },
  {
    field: 'prodColor',
    component: 'Select',
    label: '花色',
    componentProps: {
      showSearch: true,
      optionFilterProp: 'label',
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'numModel',
    component: 'InputNumber',
    label: '件数',
    componentProps: { min: 0, max: 999999, precision: 0 },
  },
  {
    field: 'netWeight',
    component: 'Input',
    label: '克重',
  },
  {
    field: 'boxNum',
    component: 'InputNumber',
    label: '装箱数',
    componentProps: { min: 0, max: 999999, precision: 0 },
  },
  {
    field: 'boxModel',
    component: 'Input',
    label: '装箱规格',
  },
  {
    field: 'boxVolume',
    component: 'InputNumber',
    label: '箱体积',
    componentProps: { min: 0, max: 999999 },
  },
  {
    field: 'boxWeight',
    component: 'InputNumber',
    label: '箱重量',
    componentProps: { min: 0, max: 999999 },
  },
  {
    field: 'boxWarn',
    component: 'InputNumber',
    label: '散货预警量',
    componentProps: { min: 0, max: 999999, precision: 0 },
  },
  {
    field: 'prodCycle',
    component: 'InputNumber',
    label: '生产周期',
    componentProps: { min: 0, max: 999999, precision: 0 },
  },
  {
    field: 'isRemind',
    component: 'Switch',
    label: '是否库存提醒',
    defaultValue: false,
  },
  {
    field: 'isSecurity',
    component: 'Switch',
    label: '是否有防伪码',
    defaultValue: false,
  },
  {
    field: 'isRate',
    component: 'Switch',
    label: '是否计算周转率',
    defaultValue: false,
  },
  {
    field: 'code69',
    component: 'Input',
    label: '69码',
  },
  {
    field: 'grossWeight',
    component: 'InputNumber',
    label: '单品毛重',
    componentProps: { min: 0, max: 999999, precision: 0 },
  },
  {
    field: 'singleWeight',
    component: 'InputNumber',
    label: '单品净重',
    componentProps: { min: 0, max: 999999, precision: 0 },
  },
  {
    field: 'pakMat',
    component: 'Input',
    label: '包装材质',
  },
  {
    field: 'pakSize',
    component: 'Input',
    label: '单品包装尺寸',
  },
  {
    field: 'remark',
    component: 'InputTextArea',
    colProps: {
      span: 24,
    },
    label: '备注',
  },
  {
    field: 'isThird',
    component: 'Switch',
    label: '是否生成三等品',
    defaultValue: false,
  },
]
//style
export function getProdStyleColumns(): BasicColumn[] {
  return [
    { dataIndex: 'prodStyle', title: '款号', key: 'prodStyle' },
    {
      dataIndex: 'thumbnail',
      title: '简图',
      key: 'thumbnail',
      helpMessage: ['点击图片可以放大预览', '这只是缩略图', '要下载原图请点击对应按钮'],
    },
    { dataIndex: 'styleName', title: '款名', key: 'styleName' },
    { dataIndex: 'familyName', title: '商品归属', key: 'familyName' },
    { dataIndex: 'typeName', title: '商品类别', key: 'typeName' },
    { dataIndex: 'bigName', title: '大类', key: 'bigName' },
    { dataIndex: 'middleName', title: '中类', key: 'middleName' },
    { dataIndex: 'attrName', title: '属性', key: 'attrName' },
    { dataIndex: 'comName', title: '品牌', key: 'comName' },
    { dataIndex: 'yearName', title: '年份', key: 'yearName', defaultHidden: true },
    { dataIndex: 'seasonName', title: '季节', key: 'seasonName', defaultHidden: true },
    { dataIndex: 'unitName', title: '单位', key: 'unitName', defaultHidden: true },
    { dataIndex: 'levelName', title: '档次', key: 'levelName', defaultHidden: true },
    { dataIndex: 'designerName', title: '设计师', key: 'designerName', defaultHidden: true },
    { dataIndex: 'styleIsSync', title: '是否同步', key: 'styleIsSync', defaultHidden: true },
    { dataIndex: 'gmtCreate', title: '创建时间', key: 'gmtCreate', defaultHidden: true },
    { dataIndex: 'gmtModified', title: '修改时间', key: 'gmtModified', defaultHidden: true },
    { dataIndex: 'syncProtype', title: '集团同步类别', key: 'syncProtype', defaultHidden: true },
  ]
}
export function getProdStyleFormConfig(): Partial<FormProps> {
  return {
    //compact: true,
    autoSubmitOnEnter: true,
    labelWidth: 80,
    baseColProps: {
      span: 6,
    },
    fieldMapToTime: [
      ['gmtCreate', ['gmtCreateStart', 'gmtCreateEnd']],
      ['gmtModified', ['gmtModifiedStart', 'gmtModifiedEnd']],
    ],
    schemas: [
      {
        field: `prodstyle`,
        label: `款号`,
        component: 'Input',
      },
      {
        field: `styleName`,
        label: `款名`,
        component: 'Input',
      },
      {
        field: `prodClass`,
        label: `类别`,
        component: 'Cascader',
        componentProps: {
          changeOnSelect: true,
        },
      },
      {
        field: `comId`,
        label: `品牌`,
        component: 'ApiSelect',
        componentProps: {
          api: getComOptions,
        },
      },
      {
        field: `gmtCreate`,
        label: `添加时间`,
        component: 'RangePicker',
      },
      {
        field: `gmtModified`,
        label: `修改时间`,
        component: 'RangePicker',
      },
    ],
  }
}
//style modal schema
export const styleModalSchemas: FormSchema[] = [
  {
    field: 'id',
    component: 'Input',
    label: 'id',
    show: false,
  },
  {
    field: 'prodStyle',
    component: 'Input',
    label: '款号',
    rules: [{ min: 6, max: 10, required: true, message: '款号是必填项,6位到10位' }],
  },
  {
    field: 'styleName',
    component: 'Input',
    label: '款名',
    rules: [{ max: 30, required: true, message: '款名是必填项,且不超过30位' }],
  },
  {
    field: `comId`,
    label: `品牌`,
    component: 'ApiSelect',
    componentProps: {
      showSearch: true,
      optionFilterProp: 'label',
      getPopupContainer: () => document.body,
      api: getComOptions,
    },
    rules: [{ required: true, message: '品牌必选', type: 'number' }],
  },
  {
    field: `prodClass`,
    label: `类别`,
    component: 'Cascader',
    componentProps: {
      changeOnSelect: true,
    },
    rules: [{ required: true, validator: checkStyleClass }],
  },
  {
    field: 'prodAttr',
    component: 'Select',
    label: '属性',
    componentProps: {
      showSearch: true,
      optionFilterProp: 'label',
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'prodYear',
    component: 'Select',
    label: '年份',
    componentProps: {
      showSearch: true,
      optionFilterProp: 'label',
      getPopupContainer: () => document.body,
    },
    rules: [{ required: true, message: '年份必选', type: 'number' }],
  },
  {
    field: 'prodSeason',
    component: 'Select',
    label: '季节',
    componentProps: {
      showSearch: true,
      optionFilterProp: 'label',
      getPopupContainer: () => document.body,
    },
    rules: [{ required: true, message: '季节必选', type: 'number' }],
  },
  {
    field: 'prodUnit',
    component: 'Select',
    label: '单位',
    componentProps: {
      showSearch: true,
      optionFilterProp: 'label',
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'prodLevel',
    component: 'Select',
    label: '档次',
    componentProps: {
      showSearch: true,
      optionFilterProp: 'label',
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'designer',
    component: 'Select',
    label: '设计师',
    componentProps: {
      showSearch: true,
      optionFilterProp: 'label',
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'syncProtype',
    component: 'Select',
    label: '集团同步类别',
    componentProps: {
      showSearch: true,
      optionFilterProp: 'label',
      getPopupContainer: () => document.body,
      options: [
        {
          label: '套件',
          value: '套件',
        },
        {
          label: '被芯',
          value: '被芯',
        },
        {
          label: '枕芯',
          value: '枕芯',
        },
        {
          label: '床垫',
          value: '床垫',
        },
        {
          label: '夏季品',
          value: '夏季品',
        },
        {
          label: '家居用品',
          value: '家居用品',
        },
        {
          label: '其他',
          value: '其他',
        },
      ],
    },
    rules: [{ required: true, message: '必选项', type: 'string' }],
  },
  {
    field: 'prodDesc',
    component: 'InputTextArea',
    colProps: {
      span: 24,
    },
    label: '商品描述(FAB)',
  },
]
//custom rule
async function checkStyleClass(rule: RuleObject, value: Array<number>) {
  if (!value) {
    return Promise.reject('此项必选！')
  }
  if (value.length < 3) {
    return Promise.reject('归属、类别、大类缺一不可！')
  } else {
    return Promise.resolve()
  }
}
//style desc schema
export const styleDescSchema: DescItem[] = [
  {
    field: 'prodStyle',
    label: '款号',
  },
  {
    field: 'styleName',
    label: '款名',
  },
  {
    field: 'familyName',
    label: '归属',
  },
  {
    field: 'typeName',
    label: '类别',
  },
  {
    field: 'attrName',
    label: '属性',
  },
  {
    field: 'bigName',
    label: '大类',
  },
  {
    field: 'middleName',
    label: '中类',
  },
  {
    field: 'comName',
    label: '品牌',
  },
]

//mat
export function getMaterialColumns(): BasicColumn[] {
  return [
    { dataIndex: 'matCode', title: '编号', key: 'matCode' },
    {
      dataIndex: 'thumbnail',
      title: '简图',
      key: 'thumbnail',
      helpMessage: ['点击图片可以放大预览', '这只是缩略图', '要下载原图请点击对应按钮'],
    },
    { dataIndex: 'matName', title: '名称', key: 'matName' },
    { dataIndex: 'comName', title: '品牌', key: 'comName', defaultHidden: true },
    { dataIndex: 'familyName', title: '归属', key: 'familyName' },
    { dataIndex: 'typeName', title: '类别', key: 'typeName' },
    { dataIndex: 'bigName', title: '大类', key: 'bigName' },
    { dataIndex: 'middleName', title: '中类', key: 'middleName' },
    { dataIndex: 'smallName', title: '小类', key: 'smallName' },
    { dataIndex: 'catName', title: '品类', key: 'catName', defaultHidden: true },
    { dataIndex: 'speName', title: '规格', key: 'speName', defaultHidden: true },
    { dataIndex: 'retailPrice', title: '零售价', key: 'retailPrice', defaultHidden: true },
    { dataIndex: 'supplyPrice', title: '供应价', key: 'supplyPrice', defaultHidden: true },
    { dataIndex: 'costPrice', title: '成本价', key: 'costPrice', defaultHidden: true },
    { dataIndex: 'attrName', title: '属性', key: 'attrName', defaultHidden: true },
    { dataIndex: 'yearName', title: '年份', key: 'yearName', defaultHidden: true },
    { dataIndex: 'colorName', title: '花色', key: 'colorName', defaultHidden: true },
    { dataIndex: 'unitName', title: '单位', key: 'unitName', defaultHidden: true },
    { dataIndex: 'numModel', title: '件数', key: 'numModel', defaultHidden: true },
    { dataIndex: 'boxWarn', title: '散货预警量', key: 'boxWarn', defaultHidden: true },
    { dataIndex: 'boxNum', title: '装箱数', key: 'boxNum' },
    { dataIndex: 'boxVolume', title: '箱体积', key: 'boxVolume' },
    { dataIndex: 'boxWeight', title: '箱重量', key: 'boxWeight', defaultHidden: true },
    { dataIndex: 'isSync', title: '是否同步', key: 'isSync', defaultHidden: true },
    { dataIndex: 'collectTime', title: '取件时间', key: 'collectTime', defaultHidden: true },
    { dataIndex: 'vipPrice', title: '会员价', key: 'vipPrice', defaultHidden: true },
    { dataIndex: 'point', title: '积分价', key: 'point', defaultHidden: true },
    { dataIndex: 'gmtCreate', title: '创建时间', key: 'gmtCreate', defaultHidden: true },
    { dataIndex: 'gmtModified', title: '修改时间', key: 'gmtModified', defaultHidden: true },
  ]
}
export function getMaterialFormConfig(): Partial<FormProps> {
  return {
    //compact: true,
    autoSubmitOnEnter: true,
    labelWidth: 80,
    baseColProps: {
      span: 6,
    },
    fieldMapToTime: [
      ['gmtCreate', ['gmtCreateStart', 'gmtCreateEnd']],
      ['gmtModified', ['gmtModifiedStart', 'gmtModifiedEnd']],
    ],
    schemas: [
      {
        field: `matCode`,
        label: `编号`,
        component: 'Input',
      },
      {
        field: `matName`,
        label: `名称`,
        component: 'Input',
      },
      {
        field: `prodClass`,
        label: `分类`,
        component: 'Cascader',
        componentProps: {
          changeOnSelect: true,
        },
      },
      {
        field: `comId`,
        label: `品牌`,
        component: 'ApiSelect',
        componentProps: {
          api: getComOptions,
        },
      },
      {
        field: `gmtCreate`,
        label: `添加时间`,
        component: 'RangePicker',
      },
      {
        field: `gmtModified`,
        label: `修改时间`,
        component: 'RangePicker',
      },
    ],
  }
}
//mat modal schema
export const matModalSchemas: FormSchema[] = [
  {
    field: 'id',
    component: 'Input',
    label: 'id',
    show: false,
  },
  {
    field: 'matCode',
    component: 'Input',
    label: '物料编号',
    rules: [{ max: 15, required: true, message: '物料编号是必填项,且不超过15位' }],
  },
  {
    field: 'matName',
    component: 'Input',
    label: '名称',
    rules: [{ max: 20, required: true, message: '名称是必填项,且不超过20位' }],
  },
  {
    field: `comId`,
    label: `品牌`,
    component: 'ApiSelect',
    componentProps: {
      showSearch: true,
      optionFilterProp: 'label',
      getPopupContainer: () => document.body,
      api: getComOptions,
    },
    rules: [{ required: true, message: '品牌必选', type: 'number' }],
  },
  {
    field: `prodClass`,
    label: `分类`,
    component: 'Cascader',
    componentProps: {
      changeOnSelect: true,
    },
    rules: [{ required: true, validator: checkMatClass }],
  },
  {
    field: 'matCat',
    component: 'Select',
    label: '品类',
    componentProps: {
      showSearch: true,
      optionFilterProp: 'label',
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'matSpe',
    component: 'Select',
    label: '规格',
    componentProps: {
      showSearch: true,
      optionFilterProp: 'label',
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'matAttr',
    component: 'Select',
    label: '属性',
    componentProps: {
      showSearch: true,
      optionFilterProp: 'label',
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'retailPrice',
    component: 'InputNumber',
    label: '零售价',
    rules: [{ type: 'number', min: 0, max: 999999, required: true, message: '请填写有效值' }],
    defaultValue: 0,
    componentProps: { min: 0, max: 999999, precision: 2 },
  },
  {
    field: 'supplyPrice',
    component: 'InputNumber',
    label: '供应价',
    rules: [{ type: 'number', min: 0, max: 999999, required: true, message: '请填写有效值' }],
    defaultValue: 0,
    componentProps: { min: 0, max: 999999, precision: 2 },
  },
  {
    field: 'costPrice',
    component: 'InputNumber',
    label: '成本价',
    rules: [{ type: 'number', min: 0, max: 999999, required: true, message: '请填写有效值' }],
    defaultValue: 0,
    componentProps: { min: 0, max: 999999, precision: 2 },
  },
  {
    field: 'matYear',
    component: 'Select',
    label: '年份',
    componentProps: {
      showSearch: true,
      optionFilterProp: 'label',
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'matUnit',
    component: 'Select',
    label: '单位',
    componentProps: {
      showSearch: true,
      optionFilterProp: 'label',
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'matColor',
    component: 'Select',
    label: '花色',
    componentProps: {
      showSearch: true,
      optionFilterProp: 'label',
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'numModel',
    component: 'InputNumber',
    label: '件数',
    componentProps: { min: 0, max: 999999, precision: 0 },
  },
  {
    field: 'boxWarn',
    component: 'InputNumber',
    label: '散货预警量',
    componentProps: { min: 0, max: 999999, precision: 0 },
  },
  {
    field: 'boxNum',
    component: 'InputNumber',
    label: '装箱数',
    componentProps: { min: 0, max: 999999, precision: 0 },
  },
  {
    field: 'boxVolume',
    component: 'InputNumber',
    label: '箱体积',
    componentProps: { min: 0, max: 999999 },
  },
  {
    field: 'boxWeight',
    component: 'InputNumber',
    label: '箱重量',
    componentProps: { min: 0, max: 999999 },
  },
  {
    field: 'collectTime',
    component: 'InputNumber',
    label: '取件时间',
    componentProps: { min: 0, max: 999999, precision: 0 },
  },
  {
    field: 'vipPrice',
    component: 'InputNumber',
    label: '会员价',
    componentProps: { min: 0, max: 999999, precision: 2 },
  },
  {
    field: 'point',
    component: 'InputNumber',
    label: '积分价',
    componentProps: { min: 0, max: 999999, precision: 2 },
  },
]
//custom rule
async function checkMatClass(rule: RuleObject, value: Array<number>) {
  if (!value) {
    return Promise.reject('此项必选！')
  }
  if (value.length < 3) {
    return Promise.reject('归属、类别、大类缺一不可！')
  } else {
    return Promise.resolve()
  }
}
