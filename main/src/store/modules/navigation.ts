import { defineStore } from 'pinia'

export const useNavigationStore = defineStore('navigation', {
  state: () => ({
    navigationParams: {}
  }),
  actions: {
    setNavigationParams(params: any) {
      this.navigationParams = { ...params }
    },
    getNavigationParam(key: string) {
      return this.navigationParams[key]
    },
    clearNavigationParams() {
      this.navigationParams = {}
    }
  }
})