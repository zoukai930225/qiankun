import { getProductCategoryList } from '@/api/supplier/productInfo'
import { defineStore } from 'pinia'

export const productInfoStore = defineStore('productInfo', () => {
  const supplierList = ref<any[]>([])
  const peopleList = ref<any[]>([])
  const categoryOptions = ref<any[]>([])
  const flattenCategory = computed(() => flattenCategoryMap(categoryOptions.value))

  async function getCategoryOptions() {
    try {
      const res = await getProductCategoryList()
      categoryOptions.value = res ?? []
    } catch (error) {}
  }

  function flattenCategoryMap(categories: any[]) {
    const result: { [key: string]: string } = {}

    function processCategory(category: any, parentPath: string = '') {
      const currentPath = parentPath
        ? `${parentPath}/${category.categoryName}`
        : category.categoryName

      result[category.categoryCode] = currentPath

      if (category.subCategories && category.subCategories.length > 0) {
        category.subCategories.forEach((subCategory: any) => {
          processCategory(subCategory, currentPath)
        })
      }
    }

    categories.forEach((topCategory) => {
      processCategory(topCategory)
    })

    return result
  }

  return {
    supplierList,
    peopleList,
    categoryOptions,
    getCategoryOptions,
    flattenCategory
  }
})
