import { defineStore } from 'pinia'
import { getToDoMessageCount } from '@/api/system/notice/index'

interface UserMessageState {
  drawerVisible: boolean;
  messageCount: number;
  activeName: 'wait' | 'done' | '',
  notifyVisible: boolean;
  notifyMessage: any[];
  messageList: any[];
  socketStatus: boolean;
  messageNums: number;
  drawerParams: any;
}


export const userMessageStore = defineStore('userMessage', {
  state: (): UserMessageState => ({
    //抽屉显示
    drawerVisible: false,
    messageCount: 0,
    activeName: '',
    //通知弹窗
    notifyVisible: false,
    notifyMessage: [],
    messageList: [],
    socketStatus: false,
    messageNums: 0,
    //右下角打开弹框时传递的参数
    drawerParams: null
  }),
  getters: {
    getVisible(state) {
      return state.drawerVisible
    },
    getCount(state) {
      return state.messageCount
    },
    getTabActiveName(state) {
      return state.activeName
    },
    getNotifyVisible(state) {
      return state.notifyVisible
    },
    getNotifyMessage(state) {
      return state.notifyMessage
    },
    getMessageList(state) {
      return state.messageList
    },
    getSocketStatus(state) {
      return state.socketStatus
    },
    getMessageNums(state) {
      return state.messageNums
    },
    getDrawerParams(state) {
      return state.drawerParams
    }
  },
  actions: {
    openVisible() {
      this.drawerVisible = true
      this.getMessageCount()
    },
    closeVisible() {
      this.drawerVisible = false
      this.activeName = ''
    },
    updateTabActiveName(activeName: 'wait' | 'done') {
      this.activeName = activeName
    },
    //获取消息数量
    async getMessageCount() {
      try {
        const data = await getToDoMessageCount();
        this.messageCount = data || 0;
      } catch (err) { }
    },
    updateMessageCount(count: number) {
      this.messageCount = count
    },
    //显示通知弹窗
    showNotify() {
      this.notifyVisible = true
    },
    //关闭通知弹窗
    closeNotify() {
      this.notifyVisible = false
    },
    updateSocketStatus(status: boolean) {
      this.socketStatus = status
    },
    updateMessageNums() {
      this.messageNums++
    },
    clearMessageNums() {
      this.messageNums = 0
    },
    setMessageList(messageList: any[]) {
      this.notifyMessage = messageList
      this.messageList = [...messageList, ...this.messageList].slice(0,4);
    },
    setMessageData(list: any[] = []) {
      this.messageList = list
    },
    clearMessageList() {
      this.notifyMessage = []
    },
    upDateDrawerParams(params: any) {
      this.drawerParams = params
    },
    clearAllMessge() {
      this.clearMessageList()
      this.clearMessageNums()
      this.upDateDrawerParams(null)
    }
  },
})