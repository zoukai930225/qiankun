import { store } from '@/store'
import { defineStore } from 'pinia'
import { getAccessToken, removeToken } from '@/utils/auth'
import { CACHE_KEY, useCache, deleteUserCache } from '@/hooks/web/useCache'
import { getInfo, loginOut } from '@/api/login'
import MessageSocket from '@/utils/messageSocket';
const { wsCache } = useCache()
import { userMessageStore } from '@/store/modules/userMessage'
const useUserMessageStore = userMessageStore()
interface UserVO {
  id: string
  userNo: string | number
  company: string | number
  isAdmin: number
  avatar: string
  avatarUrl: string
  nickname: string
  username: string
  realName: string
  store: string
  storeName: string
  deptId: number
  departmentName: string
  jobName: string
  supplierFlag: 0 | 1
  departmentId: string
  phone: string
}

interface UserInfoVO {
  // USER 缓存
  permissions: string[]
  roles: string[]
  isSetUser: boolean
  user: UserVO,
  messagSocket: any
  version: Array<any>
}

export const useUserStore = defineStore('admin-user', {
  state: (): UserInfoVO => ({
    version: [],
    permissions: [],
    roles: [],
    isSetUser: false,
    user: {
      id: '',
      userNo: '',
      company: '',
      isAdmin: 0,
      avatar: '',
      avatarUrl: '',
      nickname: '',
      realName: '',
      username: '',
      store: '',
      storeName: '',
      deptId: 0,
      departmentName: '',
      jobName: '',
      supplierFlag: 0,
      departmentId: '',
      phone: ''
    },
    messagSocket: null
  }),
  getters: {
    getPermissions(): string[] {
      return this.permissions
    },
    getRoles(): string[] {
      return this.roles
    },
    getIsSetUser(): boolean {
      return this.isSetUser
    },
    getUser(): UserVO {
      return this.user
    },
    getVersion(): any {
      return this.version
    }
  },
  actions: {
    async setUserInfoAction() {
      if (!getAccessToken()) {
        this.resetState()
        return null
      }
      let userInfo = await getInfo().catch(() => { })
      if (!userInfo) {
        userInfo = wsCache.get(CACHE_KEY.USER)
      }
      // else {
      //   console.log('userInfo', userInfo.user)
      // }
      this.permissions = []
      if (userInfo && userInfo.menus) {
        this.getPermissionsList(userInfo.menus)
      }
      // this.permissions = userInfo.permissions
      userInfo.permissions = this.permissions
      this.roles = userInfo.roles
      this.user = userInfo.user
      this.isSetUser = true
      wsCache.set(CACHE_KEY.USER, userInfo)
      this.filterButtonMenus(userInfo.menus)
      wsCache.set(CACHE_KEY.ROLE_ROUTERS, userInfo.menus)
      this.initMessageSocket()
      useUserMessageStore.getMessageCount()
    },

    // 获取所有权限标识信息
    getPermissionsList(menus) {
      menus.forEach((item) => {
        if (item.permission) {
          this.permissions.push(item.permission)
        }
        if (item.children && item.children.length > 0) {
          this.getPermissionsList(item.children)
        }
      })
    },
    // 过滤按钮菜单
    filterButtonMenus(menus) {
      menus.forEach((item) => {
        if (item.children && item.children.length > 0 && item.children[0].type === 3) {
          item.children = null
        }
        if (item.children && item.children.length > 0) {
          this.filterButtonMenus(item.children)
        }
      })
    },
    async setUserAvatarAction(avatar: string) {
      const userInfo = wsCache.get(CACHE_KEY.USER)
      // NOTE: 是否需要像`setUserInfoAction`一样判断`userInfo != null`
      this.user.avatar = avatar
      userInfo.user.avatar = avatar
      wsCache.set(CACHE_KEY.USER, userInfo)
    },
    async setUserNicknameAction(nickname: string) {
      const userInfo = wsCache.get(CACHE_KEY.USER)
      // NOTE: 是否需要像`setUserInfoAction`一样判断`userInfo != null`
      this.user.nickname = nickname
      userInfo.user.nickname = nickname
      wsCache.set(CACHE_KEY.USER, userInfo)
    },
    setVersion(list: Array<any> = []) {
      this.version = list;
    },
    async loginOut() {
      await loginOut()
      removeToken()
      deleteUserCache() // 删除用户缓存
      this.resetState()
      this.messagSocket?.resetAllStatus(true)
      useUserMessageStore.clearAllMessge()
    },
    resetState() {
      this.permissions = []
      this.roles = []
      this.isSetUser = false
      this.user = {
        id: '',
        userNo: '',
        company: '',
        isAdmin: 0,
        avatar: '',
        avatarUrl: '',
        nickname: '',
        realName: '',
        username: '',
        store: '',
        storeName: '',
        deptId: 0,
        departmentName: '',
        jobName: '',
        supplierFlag: 0,
        departmentId: '',
        phone: ''
      }
      this.version = []
    },
    initMessageSocket() {
      if (this.messagSocket) {
        this.messagSocket.resetAllStatus(true)
      }
      //创建消息连接websocket
      const messagSocket = new MessageSocket(this.user.id)
      messagSocket.open()
      this.messagSocket = messagSocket
    }
  }
})

export const useUserStoreWithOut = () => {
  return useUserStore(store)
}
