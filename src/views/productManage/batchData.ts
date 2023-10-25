import { FormProps } from '@/components/Table'
import { BasicColumn } from '@/components/Table/src/types/table'
import { dateUtil } from '@/utils/dateUtil'
import { FormSchema } from '@/components/Form/index'

//batch
export function getBatchColumns(): BasicColumn[] {
  return [
    { dataIndex: 'userName', title: '用户', key: 'userName' },
    {
      dataIndex: 'batchType',
      title: '类型',
      key: 'batchType',
      format: (text) => {
        if (Number(text) == 1) {
          return '添加款式'
        } else if (Number(text) == 2) {
          return '添加编号'
        } else if (Number(text) == 3) {
          return '添加物料/辅料'
        } else if (Number(text) == 4) {
          return '修改款式'
        } else if (Number(text) == 5) {
          return '修改编号'
        } else if (Number(text) == 6) {
          return '修改物料/辅料'
        } else {
          return '未知'
        }
      },
    },
    { dataIndex: 'batchNum', title: '数量', key: 'batchNum' },
    {
      dataIndex: 'gmtCreate',
      title: '操作时间',
      key: 'gmtCreate',
      format: (text) => {
        return dateUtil(text).format('YYYY-MM-DD HH:mm:ss')
      },
    },
    { dataIndex: 'isSync', title: '是否同步', key: 'isSync' },
  ]
}
