import { queryPermissionListByType } from '@/api/common'
import { useUserStore } from '@/store/modules/user'

export const useRole = (roleGroup: string) => {
  const userStore = useUserStore()

  const permissionList = ref<Array<any>>([]),
    roleList = ref<Array<any>>([])

  const getPermissionInfo = async (call?: Function | undefined) => {
    const user: any = (userStore.user as any)?.permissionIds || []
    const res = await queryPermissionListByType(roleGroup)
    if (res?.length) {
      roleList.value = res
      permissionList.value = res.filter((rs: any) => user.includes(rs.id))
      call?.()
    }
  }

  const grabCheck = (role: string) => {
    const permissionStr: any = permissionList.value.map((ps: any) => ps.name)
    return permissionStr.includes(role)
  }

  const grabChecks = (role: string) => {
    const permissionStr: string = permissionList.value.map((ps: any) => ps.name).join(',')
    return permissionStr.includes(role)
  }

  const getRole = (name: string) => {
    const tar: any = roleList.value.find((rs: any) => rs.name === name)
    return tar?.id || ''
  }

  return { permissionList, roleList, getPermissionInfo, getRole, grabCheck, grabChecks }
}
