import { getGoodsCategory } from '@/api/bi/channel'
import { getQueryChannels } from '@/api/tagMng'
import { getDictLabel } from '@/utils/dict'
import { defineStore } from 'pinia'

export const useNewProductStore = defineStore('rights', () => {
  const planName = ref<string>('')

  return {
    planName
  }
})
