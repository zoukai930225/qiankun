import { defineStore } from 'pinia'

export const onNegativeReviewDashboardStore = defineStore('negativeReviewDashboard', {
  state: (): { storeList: any[] } => ({
    storeList: [] //店铺列表
  })
})
