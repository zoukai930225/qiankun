import { cloneDeep } from 'lodash-es'
import { defineStore } from 'pinia'
import * as channelApi from '@/api/bi/v1/channel'
import { getAllDeptTree } from '@/api/system/dept'
import { queryGoodsOverviewBiMaxDate, queryTag } from '@/api/bi/goods'
// 定义 exportParams 的接口类型
interface ExportParams {
  year: any
  prevYear: any
  type: any
  channel: any
  store: any
  reqParams: any
  dateSelect: any[]
  dateType: string
  oldDataType: string
  channelQuery: any
  //当前用户权限下的渠道列表
  channelList: any
  catrgoryList: any[]
  //当前用户权限下的部门列表
  departmentList: any[]
  //渠道总览跳转获得渠道数
  totalChannel: any[]
  //渠道总览跳转获得店铺数组
  totalStores: any[]
  showFilter: any
  maxDate: string
  tagList: any[]
  storeListPremisson: any[]
  biMaxMonth: string;
  storeList: any[];
  allCatrgoryList: any[];
}

// 定义 Pinia store
export const useExportParams = defineStore('export-params', {
  state: (): ExportParams =>
    ({
      year: undefined,
      prevYear: undefined,
      type: undefined,
      channel: undefined,
      store: undefined,
      reqParams: undefined,
      //头部时间选择器时间
      dateSelect: [],
      dateType: '',
      //原数据类型，兼容旧接口
      oldDataType: '',
      channelQuery: {
        store: '',
        channel: ''
      },
      channelList: null,
      catrgoryList: [],
      departmentList: [],
      totalChannel: [],
      totalStores: [],
      showFilter: {},
      maxDate: '',
      tagList: [],
      storeListPremisson: [],
      biMaxMonth: '',
      storeList: [],
      allCatrgoryList: []
    }) as any,
  getters: {
    // 示例 getter，可根据需要添加更多
    getYear(state) {
      return state.year
    },
    getDateSelect(state) {
      return state.dateSelect
    },
    getDateType(state) {
      return state.dateType
    },
    getOldDateType(state) {
      return state.oldDataType
    },
    getDateTypeName(state) {
      let name = ''
      switch (Number(state.dateType)) {
        case 0:
          name = '日'
          break
        case 1:
          name = '周'
          break
        case 2:
          name = '月'
          break
        case 3:
          name = '自定义'
          break
        case 7:
          name = '7天'
          break
        case 30:
          name = '30天'
          break
      }
      return name
    },
    getChannelQuery(state) {
      return state.channelQuery
    },
    getTotalChannel(state) {
      return state.totalChannel
    },
    getTotalStores(state) {
      return state.totalStores
    },
    getFilterShow(state) {
      return state.showFilter
    },
    getMaxDate(state) {
      return state.maxDate
    },
    getMaxMonth(state) {
      return state.biMaxMonth
    },
  },
  actions: {
    // 示例 action，用于更新 state
    updateParams(newParams: ExportParams) {
      this.year = newParams.year
      this.prevYear = newParams.prevYear
      this.type = newParams.type
      this.reqParams = cloneDeep(newParams)
    },
    updateDateType(dateType: string) {
      this.dateType = dateType
      if (['7', '30', '0', '3'].includes(dateType)) {
        this.oldDataType = '1'
      } else {
        switch (Number(dateType)) {
          case 1:
            this.oldDataType = '2'
            break
          case 2:
            this.oldDataType = '3'
            break
          default:
            this.oldDataType = '1'
        }
      }
    },
    updateDateSelect(timeSelect: any[]) {
      this.dateSelect = timeSelect
    },
    updateChannelQuery(key: string, value: any) {
      this.channelQuery[key] = value
    },
    async getChannelList() {
      if (this.channelList) {
        return this.channelList
      }

      try {
        const res = await channelApi.getBiQuery()
        this.channelList = res
        return res
      } catch (e) {
        return this.channelList
      }
    },
    async getCategoryList() {
      if (Array.isArray(this.catrgoryList) && this.catrgoryList.length > 0) {
        return this.catrgoryList
      }

      try {
        const res = await channelApi.getChannelCategory()
        this.catrgoryList = res
        return res
      } catch (e) {
        return this.catrgoryList
      }
    },
    async getCategoryAllList() {
      if (Array.isArray(this.allCatrgoryList) && this.allCatrgoryList.length > 0) {
        return this.allCatrgoryList
      }

      try {
        const res = await channelApi.getChannelCategory({ hasPermission: 0 })
        this.allCatrgoryList = res
        return res
      } catch (e) {
        return this.allCatrgoryList
      }
    },
    //部门
    async getDepartmentList() {
      if (Array.isArray(this.departmentList) && this.departmentList.length > 0) {
        return this.departmentList
      }

      try {
        const res = await getAllDeptTree()
        this.departmentList = res
        return res
      } catch (e) {
        return this.departmentList
      }
    },
    updateTotalChannel(totalChannel: any[]) {
      this.totalChannel = totalChannel
    },
    updateTotalStores(totalStores: any[]) {
      this.totalStores = totalStores
    },
    updateFilterShow(filCode: string, show: boolean) {
      if (!Object.keys(this.showFilter).includes(filCode)) {
        this.showFilter[filCode] = show
      }
      if (show) {
        Object.keys(this.showFilter).forEach((key) => {
          if (key === filCode) {
            this.showFilter[key] = show
          } else {
            this.showFilter[key] = show ? false : true
          }
        })
      }
    },
    updateMaxDate(maxDate: string) {
      this.maxDate = maxDate
    },
    // 获取商品总览最大日期
    async getGoodsOverviewMaxDate() {
      // 如果已经有值，直接返回
      if (this.maxDate) {
        return this.maxDate
      }

      try {
        const { biMaxDate, biMaxMonth } = await queryGoodsOverviewBiMaxDate()
        if (biMaxDate) {
          this.maxDate = biMaxDate
          this.biMaxMonth = biMaxMonth
          return biMaxDate
        } else {
          this.maxDate = ''
          this.biMaxMonth = ''
          return ''
        }
      } catch (error) {
        console.error('getGoodsOverviewMaxDate error', error)
        this.maxDate = ''
        this.biMaxMonth = ''
        return ''
      }
    },
    async getTagList() {
      if (this.tagList?.length > 0) {
        return this.tagList
      }

      try {
        const res = await queryTag({ page: 1, size: 9999, tagCategory: 'goods' })
        if (res?.records?.length) {
          this.tagList = res.records
        } else {
          this.tagList = []
        }
        return this.tagList
      } catch (e) {
        return this.tagList
      }
    },
    //权限店铺
    async getStorePremissonList() {
      if (this.storeListPremisson?.length > 0) {
        return this.storeListPremisson
      }

      try {
        const res = await channelApi.getChannelStore()
        this.storeListPremisson = res
        return res
      } catch (e) {
        return this.storeListPremisson
      }
    },
    //所有店铺
    async getStoreList() {
      if (this.storeList?.length > 0) {
        return this.storeList
      }

      try {
        const res = await channelApi.getAllChannelStore()
        this.storeList = res
        return res
      } catch (e) {
        return this.storeList
      }
    },
  }
})
