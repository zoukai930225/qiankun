import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserDrawerStore = defineStore('userDrawer', () => {
  const isOpen = ref(false)
  const title = ref('个人信息')
  const loading = ref(false)

  // 用户数据
  const userBasicInfo = ref({
    userName: '',
    userId: '',
    avatarOrigin: '',
    employeeNo: '',
    departmentName: '',
    jobName: '',
    company: ''
  })

  // 固定资产列表
  const fixedAssetList = ref<any[]>([])

  // 权限店铺列表
  const permitStoreList = ref<any[]>([])

  // 权限角色列表
  const permitRoleList = ref<any[]>([])

  // 打开抽屉方法
  const open = async (data: {
    title?: string
    userBasicInfo: any
    fixedAssetList: any
    permitStoreList: any
    permitRoleList: any
  }) => {
    if (data.title) {
      title.value = data.title
    }
    userBasicInfo.value = data.userBasicInfo || {}
    fixedAssetList.value = data.fixedAssetList || []
    permitStoreList.value = data.permitStoreList || []
    permitRoleList.value = data.permitRoleList || []

    isOpen.value = true
  }

  // 关闭抽屉方法
  const close = () => {
    isOpen.value = false
  }

  // 设置加载状态
  const setLoading = (value: boolean) => {
    loading.value = value
  }

  return {
    isOpen,
    title,
    loading,
    userBasicInfo,
    fixedAssetList,
    permitStoreList,
    permitRoleList,
    open,
    close,
    setLoading
  }
})
