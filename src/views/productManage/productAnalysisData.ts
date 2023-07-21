import { FormProps } from '@/components/Table'
import { BasicColumn } from '@/components/Table/src/types/table'
import { dateUtil } from '@/utils/dateUtil'
import { FormSchema } from '@/components/Form/index'

//analysis
export function getAnalysisColumns(): BasicColumn[] {
  return [
    { dataIndex: 'id', title: 'id', key: 'id' },
    { dataIndex: 'name', title: '分析名称', key: 'name' },
    {
      dataIndex: 'depth',
      title: '级别',
      key: 'depth',
      format: (text) => {
        switch (Number(text)) {
          case 1:
            return '归属'
          case 2:
            return '类别'
          case 3:
            return '大类'
          case 4:
            return '中类'
          case 5:
            return '小类'
          default:
            return '未知'
        }
      },
    },
    { dataIndex: 'userName', title: '创建人', key: 'userName' },
    { dataIndex: 'remark', title: '备注', key: 'remark' },
    {
      dataIndex: 'gmtCreate',
      title: '创建时间',
      key: 'gmtCreate',
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
    { dataIndex: 'op', title: '操作', key: 'op' },
  ]
}

//analysis modal schema
export const analysisModalSchemas: FormSchema[] = [
  {
    field: 'id',
    component: 'Input',
    label: 'id',
    show: false,
  },
  {
    field: 'name',
    component: 'Input',
    label: '名称',
    rules: [{ max: 20, required: true, message: '名称是必填项,且不超过30位' }],
  },
  {
    field: 'depth',
    component: 'Select',
    label: '分析级别',
    componentProps: {
      showSearch: true,
      optionFilterProp: 'label',
      getPopupContainer: () => document.body,
      options: [
        {
          label: '归属',
          value: 1,
        },
        {
          label: '类别',
          value: 2,
        },
        {
          label: '大类',
          value: 3,
        },
        {
          label: '中类',
          value: 4,
        },
        {
          label: '小类',
          value: 5,
        },
      ],
    },
    rules: [{ required: true, message: '必选项', type: 'number' }],
  },
  {
    field: 'remark',
    component: 'InputTextArea',
    label: '备注',
  },
]
