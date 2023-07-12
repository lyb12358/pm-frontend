import { useUserStore } from '/@/store/modules/user'
import { RoleEnum } from '/@/enums/roleEnum'
import { intersection } from 'lodash-es'
import { isArray } from '/@/utils/is'

// User permissions related operations
export function usePermission() {
  const userStore = useUserStore()
  const permissionList: any = useUserStore().getPermissions
  //维护商品权限
  const maintainPermission = permissionList.operations
    .filter((item: any) => item.operationType == 'productStyle:permission')[0]
    .columnPermissions?.map((item) => {
      return Number(item.columnName)
    })
  //查看商品权限
  const viewPermissions = permissionList.operations
    .filter((item: any) => item.operationType == 'productCode:view')[0]
    .columnPermissions?.map((item) => {
      return item.columnName
    })
  /**
   * Determine whether there is permission
   */
  function hasPermission(value?: RoleEnum | RoleEnum[] | string | string[], def = true): boolean {
    // Visible by default
    if (!value) {
      return def
    }
    const allCodeList = userStore.getOperations as string[]
    if (!isArray(value)) {
      return allCodeList.includes(value)
    }
    return (intersection(value, allCodeList) as string[]).length > 0
  }
  /**
   * Determine whether there is a maintain permission
   *
   */
  function checkMaintainPermission(value) {
    return maintainPermission?.includes(value)
  }

  return { hasPermission, checkMaintainPermission, viewPermissions }
}
