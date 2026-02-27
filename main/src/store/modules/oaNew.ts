import { getNPCategoryNameList } from '@/api/common'
import { defineStore } from 'pinia'

export const useDashboard = defineStore('useDashboard', () => {
  const categoryList = ref<{ code: string; name: string }[]>([])
  async function getCategoryList() {
    try {
      const res = await getNPCategoryNameList()
      categoryList.value = res
    } catch (error) {}
  }

  return {
    categoryList,
    getCategoryList
  }
})
