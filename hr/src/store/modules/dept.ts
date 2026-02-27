import { store } from '@/store'
import { defineStore } from 'pinia'
import { getAccessToken, removeToken } from '@/utils/auth'
import { CACHE_KEY, useCache, deleteUserCache } from '@/hooks/web/useCache'
import { getInfo, loginOut } from '@/api/login'
import * as DeptApi from '@/api/system/dept'
import * as BonusPointApi from '@/api/otr/bonusPoint'
const { wsCache } = useCache()

export interface DepartmentState {
  departmentData: any[]
  isDepartmentDataLoaded: boolean
  designerList: any[]
  isDesignerListLoaded: boolean
}

export const useDepartmentStore = defineStore('coomonData', {
  state: (): DepartmentState => ({
    departmentData: [],
    designerList: [],
    isDepartmentDataLoaded: false,
    isDesignerListLoaded: false
  }),

  actions: {
    // 请求部门数据
    async getDepartmentDataAction() {
      const data = await DeptApi.getDeptPage({})
      this.departmentData = data || []
      this.isDepartmentDataLoaded = true // 设置标志，表示数据已加载
    },
    // 请求人员列表
    async getDesignerList() {
      // console.log('调用这个方法啦');
      const res = await BonusPointApi.getDesignerList('')
      this.designerList = res || []
      this.isDesignerListLoaded = true
    }
  }
})

export const useDepartmentStoreWithOut = () => {
  return useDepartmentStore(store)
}
