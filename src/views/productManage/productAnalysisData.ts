import { FormProps } from '@/components/Table'
import { BasicColumn } from '@/components/Table/src/types/table'
import { dateUtil } from '@/utils/dateUtil'
import { FormSchema } from '@/components/Form/index'

//batch
export function getAnalysisColumns(): BasicColumn[] {
  return [
    { dataIndex: 'id', title: 'id', key: 'id' },
    { dataIndex: 'name', title: '分析名称', key: 'name' },
    { dataIndex: 'depth', title: '级别', key: 'depth' },
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
      format: (text) => {
        return dateUtil(text).format('YYYY-MM-DD HH:mm:ss')
      },
    },
  ]
}
