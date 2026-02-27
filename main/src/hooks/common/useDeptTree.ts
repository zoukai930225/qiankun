/*
 * @Date: 2025-03-17 09:41:31
//获取部门树 用于部门级联选择器
 */
import { queryStoreTree } from '@/api/common'
import { onMounted, ref } from 'vue'
import { treeToArray } from '@/utils'

export function useDeptTree(paramData: any = {}) {
  const menuList = ref()
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const fetchDeptTree = async () => {
    loading.value = true
    try {
      const params = paramData ? paramData : { isPermission: 1, type: 'BI' }
      const res = await queryStoreTree(params)
      menuList.value = formatArr(res)
    } catch (err) {
      error.value = err as Error
    } finally {
      loading.value = false
    }
  }
  const formatArr = (arr) => {
    const migArr = arr.map((item) => {
      return {
        id: item.platFormId,
        name: item.platFormName,
        children: item.stores.map((it) => {
          return {
            id: it.storeCode,
            name: it.shopName,
            parentId: item.platformId
          }
        })
      }
    })
    return migArr
  }

  onMounted(() => {
    fetchDeptTree()
  })

  return {
    menuList,
    loading,
    error,
    fetchDeptTree
  }
}

export function useAllDeptTree() {
  const menuList = ref()
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const fetchDeptTree = async () => {
    loading.value = true
    try {
      const params = { isPermission: 0 }
      const res = await queryStoreTree(params)
      const all = treeToArray(res, 'platFormId', 'stores') || []
      if(all.some((item: any) => item.platFormId === 'ALL')) {
        menuList.value = [...formatArr(res)]
      } else {
        menuList.value = [{ id: 'ALL', name: '全渠道' }, ...formatArr(res)]
      }
    } catch (err) {
      error.value = err as Error
    } finally {
      loading.value = false
    }
  }
  const formatArr = (arr) => {
    const migArr = arr.map((item) => {
      return {
        id: item.platFormId,
        name: item.platFormName,
        children: item.stores.map((it) => {
          return {
            id: it.storeCode,
            name: it.shopName,
            parentId: item.platformId
          }
        })
      }
    })
    return migArr
  }

  onMounted(() => {
    fetchDeptTree()
  })

  return {
    menuList,
    loading,
    error,
    fetchDeptTree
  }
}
