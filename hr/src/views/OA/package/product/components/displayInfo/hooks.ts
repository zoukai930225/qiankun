/*
 * @Date: 2025-01-07 11:22:44
 */
import { getCategoryNameList } from '@/api/shop/InventoryLow/index.js'

// 获取分类列表
export function useCategoryList() {
  const categoryList = ref([])

  const initSelectData = async () => {
    const params = {
      type: 'NP'
    }
    const res = await getCategoryNameList(params)
    categoryList.value = res || []
  }

  onMounted(() => {
    initSelectData()
  })

  return {
    categoryList,
    initSelectData
  }
}
