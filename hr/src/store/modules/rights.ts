import { getGoodsCategory } from '@/api/bi/channel'
import { getQueryChannels } from '@/api/tagMng'
import { getDictLabel } from '@/utils/dict'
import { defineStore } from 'pinia'

export const useRightsStore = defineStore('rights', () => {
  const storeOptions = ref<RightsManage.CascaderOption[]>([])
  const channel = ref('')
  const categoryOptions = ref<RightsManage.CascaderOption[]>([])

  async function getStoreOptions() {
    try {
      const res = await getQueryChannels()
      storeOptions.value = res
        .map((item) => {
          return {
            value: item.platformId,
            label: getDictLabel(DICT_TYPE.SYSTEM_PARAM_CHANNEL, item.platformId)
          }
        })
        .filter((item, index) => res.findIndex((ele) => ele.platformId === item.value) === index)
        .map((item) => {
          const children = res.filter((ele) => ele.platformId === item.value)
          item.children = children.map((ele) => ({
            value: ele.storeCode,
            label: ele.shopName
          }))
          return item
        })
    } catch (error) {}
  }

  async function getCategoryOptions() {
    try {
      const res = await getGoodsCategory({
        channel: '',
        store: ''
      })

      categoryOptions.value = transformTree(res)
    } catch (error) {}
  }

  function transformTree(data: any[]) {
    return data?.map((item) => {
      return {
        value: item.categoryName,
        label: item.categoryName,
        children: transformTree(item.children) || null
      }
    })
  }

  return {
    storeOptions,
    categoryOptions,
    channel,
    getStoreOptions,
    getCategoryOptions
  }
})
