//这是一个打印机状态的pinia
import { defineStore } from 'pinia'

export const printerData = defineStore('printerData', {
  state: (): {
    printerList: any
    printerState: Boolean
    printerSocket: string
    msgInfo: any
    printerClass: any
  } => {
    return {
      printerList: [], //打印机列表
      printerState: false, //打印机状态
      printerSocket: 'ws://127.0.0.1:37989',
      msgInfo: {
        capStatus: 0, // 0 闭合 1 开启
        power: 0 //电量登记 0-4
      },
      printerClass: null //打印机实例
    }
  },
  persist: {
    storage: localStorage //持久化
  }
})
