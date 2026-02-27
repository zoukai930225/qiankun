import { defineStore } from 'pinia'

export const useRpaDashboardStore = defineStore('rpaDashboard', {
  state: () => ({
    resUserList: [], //查询条件中负责人的下拉选项
    typeList: [], //查询条件中应用类型下拉选项
    nodeList: [] //查询条件中节点下拉选项
  })
})
