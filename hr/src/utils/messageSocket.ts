
import { userMessageStore } from '@/store/modules/userMessage';
const useUserMessage = userMessageStore()

import { useAppStore } from '@/store/modules/app';
const appStore = useAppStore()

import { addData, cursorGetDataByIndex, deleteDate } from '@/architecture/precept/db';
import { generateUUID } from '@/utils'
import { cloneDeep } from 'lodash-es';

//用于消息链接的websocket
export default class MessageSocket {
  // 当前websocket的url
  url
  // 重连时间配置，超时时间配置
  // resetTime 重连时间  reLinkNumber 允许重连次数
  options = { resetTime: 60000, reLinkNumber: 5 }
  // websocket实例
  _websocket
  //重连次数
  _reLinkNumber
  //手动关闭 - 不触发重连
  _clinetClose
  //dbStatus - 数据库状态 true: 连接成功 false: 连接失败,dbLinkTime 数据库连接查询时间上限 5分钟
  dbOptions = { dbStatus: false, tableName: 'user_message_table', dbLinkTime: 1000 * 60 * 5 }
  //数据库连接查询时间
  _dbLinkTime
  //数据库定时器
  _dbLinkTimer

  _messageTableName

  _messageErrorTableName

  _userId

  constructor(userId: string, options = {}) {
    //192.168.88.79
    const test = '47.98.41.207'
    const local = '192.168.88.79'
    const BASE_URL = import.meta.env.VITE_ENV === 'production'
      ? '116.62.235.33'
      : import.meta.env.VITE_ENV == 'pre'
        ? '106.12.72.191'
        : test

    this.url = `ws://${BASE_URL}:7081/websocket/${userId}`
    this._reLinkNumber = 0
    this._dbLinkTime = 0
    this._messageTableName = `${this.dbOptions.tableName}`
    this._messageErrorTableName = `${this.dbOptions.tableName}_error`
    this._userId = userId
    useUserMessage.clearMessageNums()
    // this.initDb()
    this.options = { ...this.options, ...options }
  }
  // 判断返回数据是否json数据
  isJSON(str) {
    if (typeof str == 'string') {
      try {
        return JSON.parse(str)
      } catch (e) {
        return false
      }
    } else {
      return false
    }
  }
  // 关闭回调处理
  closeCallback(onMessageCallback?: (msg: string | object) => void) {
    if (this._reLinkNumber >= this.options.reLinkNumber || this._clinetClose) return
    this._reLinkNumber++;
    console.log('对应的重连操作', this._reLinkNumber)
    // 对应的重连操作
    this.close()
    const timer = setTimeout(() => {
      this.open(onMessageCallback)
      clearTimeout(timer)
    }, this.options.resetTime)
    // 若手动close，恢复初始状态

  }
  /**
     * 打开 WebSocket 连接并返回一个解析为 WebSocket 实例的 Promise。
     *
     * @param {function} openChange - WebSocket 连接打开时要调用的回调函数。
     * @param {function} onMessageCallback - 接收到消息时要调用的回调函数。
     * @return {Promise} 一个解析为 WebSocket 实例的 Promise。
     */
  open(onMessageCallback?: (msg: string | object) => void) {
    return new Promise((resolve, reject) => {
      if (this._websocket) {
        reject(new Error('WebSocket is already connected.'))
        return
      }

      this._websocket = new WebSocket(this.url)
      this._reLinkNumber = 0

      this._websocket.onopen = (e) => {
        useUserMessage.updateSocketStatus(true)
        resolve({ e, ws: this })
      }
      this._websocket.onerror = (e) => {
        // useUserMessage.updateSocketStatus(false)
        // this.closeCallback(onMessageCallback)
        // console.log('websocket error', e)
      }
      this._websocket.onclose = (e) => {
        // console.log('websocket close', e)
        useUserMessage.updateSocketStatus(false)
        //去除自动重连
        // this.closeCallback(onMessageCallback)
      }
      this._websocket.onmessage = (e) => {
        const msg = this.isJSON(e.data) ? JSON.parse(e.data) : e.data

        // 消息事件的回调
        if (onMessageCallback) {
          onMessageCallback(msg)
        }
        if (e.data === 'PING') {
          this.customSend()
        }

        if (this.isJSON(e.data) && msg?.messageData?.length) {
          this.updateTableData(msg)
          //数据库没打开，存到store中
          if (!this.dbOptions.dbStatus) {
            useUserMessage.setMessageList(this.dealMessageData(msg))
            useUserMessage.updateMessageNums()
          }
        }

        if (this.isJSON(e.data) && msg?.type === 'timeout') {

        }
      }

    })
  }
  close() {
    this._websocket && this._websocket.readyState === 1 && this._websocket.close()
    this._websocket = undefined
    useUserMessage.updateSocketStatus(false)
  }
  // 自定义消息发送 - 用于维持心跳
  customSend(content: string = 'PONG') {
    this._websocket &&
      this._websocket.readyState === 1 &&
      this._websocket.send(content)
  }
  resetAllStatus(clientClose: boolean = false) {
    if (this._dbLinkTimer) {
      clearInterval(this._dbLinkTimer)
      this._dbLinkTimer = null
    }
    this._clinetClose = clientClose
    this._reLinkNumber = 0
    this._dbLinkTime = 0
    this.dbOptions.dbStatus = false
    this.close()
  }
  clearDbLinkTimer() {
    if (this._dbLinkTimer) {
      clearInterval(this._dbLinkTimer)
      this._dbLinkTimer = null
    }
  }
  //初始化数据库
  initDb() {
    if (this.dbOptions.dbStatus || this._dbLinkTime > this.dbOptions.dbLinkTime) {
      this.clearDbLinkTimer()
      return
    }
    this.clearDbLinkTimer()
    this._dbLinkTimer = setInterval(() => {
      if (appStore.dbHelp) {
        this.dbOptions.dbStatus = true
        if (useUserMessage.getSocketStatus) {
          useUserMessage.updateMessageNums()
        }
        this.clearDbLinkTimer()
      }
    }, 500)
  }

  async updateTableData(msg) {
    if (!this.dbOptions.dbStatus) return
    const db = appStore.dbHelp;
    try {
      await this.clearOldData()
      const apis = [] as any[]
      if (msg?.messageData?.length > 0) {
        msg.messageData.forEach((item) => {
          apis.push(addData(db, this._messageTableName, Object.assign(item, { dateTime: msg.dateTime, userId: this._userId })))
        })
      }
      if (apis.length > 0) {
        try {
          await Promise.all(apis)
          useUserMessage.clearMessageList()
          useUserMessage.updateMessageNums()
        } catch (err) {
          addData(db, this._messageErrorTableName, { id: `${new Date().getTime()}_${generateUUID()}`, msg: JSON.stringify(err), type: '消息批量插入失败', originData: JSON.stringify(msg), userId: this._userId })
        }
      }

    } catch (err) {
      addData(db, this._messageErrorTableName, { id: `${new Date().getTime()}_${generateUUID()}`, msg: JSON.stringify(err), type: '清空表格失败', originData: '', userId: this._userId })
    }
  }
  //清除当前用户的历史消息
  async clearOldData() {
    const db = appStore.dbHelp;
    try {
      const res: any = await cursorGetDataByIndex(db, this._messageTableName, 'userId', this._userId)
      if (res.data?.length > 0) {
        const apis = [] as any[]
        if (res.data?.length > 0) {
          res.data.forEach((item) => {
            apis.push(deleteDate(db, this._messageTableName, item.id))
          })
          await Promise.all(apis)
        }
      }
    } catch (err) {
      addData(db, this._messageErrorTableName, { id: `${new Date().getTime()}_${generateUUID()}`, msg: JSON.stringify(err), type: 'clearOldData失败', originData: '', userId: this._userId })
    }
  }

  async deleteDataById(id: string) {
    const db = appStore.dbHelp;
    try {
      deleteDate(db, this._messageTableName, id)
    } catch (err) {
      addData(db, this._messageErrorTableName, { id: `${new Date().getTime()}_${generateUUID()}`, msg: JSON.stringify(err), type: '删除单条失败', originData: JSON.stringify({ id }), userId: this._userId })
    }
  }

  dealMessageData(msg) {
    const data: any[] = []
    if (msg?.messageData?.length) {
      msg.messageData.forEach((item) => {
        const val: any = cloneDeep(item)
        Object.assign(val, { dateTime: msg.dateTime, userId: this._userId })
        data.push(val)
      })
    }
    return data
  }
  //获取消息数据
  async getMessageData() {
    let data: any[] = []
    if (useUserMessage.socketStatus && this.dbOptions.dbStatus) {
      //从数据库获取消息
      try {
        const res: any = await cursorGetDataByIndex(appStore.dbHelp, this._messageTableName, 'userId', this._userId)
        console.log('getMessage 数据库返回', res)
        data = res?.data?.length ? res.data : []
      } catch (err) {
        addData(appStore.dbHelp, this._messageErrorTableName, { id: `${new Date().getTime()}_${generateUUID()}`, msg: JSON.stringify(err), type: '消息卡片数据库表格数据获取失败', originData: '', userId: this._userId })
      }
    } else {
      //从store获取消息
      data = useUserMessage.getNotifyMessage
    }
    return data
  }

  async deleteReadedData(id: string) {
    if (this.dbOptions.dbStatus) {
      await this.deleteDataById(id)
    } else {
      const data = useUserMessage.notifyMessage.filter((item) => item.id !== id)
      useUserMessage.setMessageList(data)
    }
  }
}

