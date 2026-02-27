import { getCategoryList } from '@/api/oa/buyer/productReference'
import { onMounted, ref } from 'vue'

export function useCategoryTree() {
  const categoryList = ref([])
  const casProps = {
    label: 'categoryName', value: 'categoryCode', children: 'subCategories', checkStrictly: true, emitPath: false,  // 只返回选中节点的值，不返回完整路径
  }
  const getCategoryTree = async () => {
    const res = await getCategoryList()
    categoryList.value = res || []
    console.log(categoryList.value, 'categoryList')
  }
  return {
    categoryList,
    getCategoryTree,
    casProps
  }
}