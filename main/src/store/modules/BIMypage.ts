import { defineStore } from 'pinia'
import { getViewportOffset, isInContainer } from '@/utils/domUtils'

interface tipsType {
  visible: boolean,
  virtualRef: HTMLElement | String | Element,
  key: string,//唯一标识
}

export const useBIMypageStore = defineStore('BIMypage', {
  state: () => ({
    showProfitAndLoss: false, //我的页面显示盈利与亏损
    memberInfo: {
      avatarOrigin: '', //团队头像
      departmentName: '', //部门名称
      userId: '', //用户id
      memberName: '' //成员姓名
    },
    teamDetail: {
      storeNum: 0,  //管理店铺数
      visitorCount: '',  //访客数
      fkjz: '',  //访客价值
      fkcb: '',  //访客成本
      fklr: '',// 访客利润
    }, //我的项目页面的团队详情
    tooltips: {
      //页面鼠标事件
      MouseEvent: undefined,
      tips: new Map<string, Array<tipsType>>(),
      //表格 <表格名,ref>；表格名和tips中存储表格名一致
      tableRefs: new Map<string, HTMLElement | String | Element>(),
    }

  }),
  getters: {
    // 示例 getter，可根据需要添加更多
    getMemberInfo(state) {
      return state.memberInfo
    },
    getTeamDetail(state) {
      return state.teamDetail
    },
  },
  actions: {
    updateMouseEvent(event: any) {
      this.tooltips.MouseEvent = event
      this.handleMouseOver(event)
    },
    //tableName 保持唯一,当前 tip 所属表格名
    updateTips(tableName: string, virtualRef: HTMLElement | String | Element, key: string) {
      let data: Array<tipsType> = []
      if (this.tooltips.tips.has(tableName)) {
        data = this.tooltips.tips.get(tableName) as Array<tipsType>
        data = data.filter(item => {
          return item.key !== key
        })
      }
      data.push({ visible: true, virtualRef, key })
      this.tooltips.tips.set(tableName, data)
    },
    updateTableRefs(tableName: string, ref: HTMLElement | String | Element) {
      this.tooltips.tableRefs.set(tableName, ref)
    },
    //鼠标移动
    handleMouseOver(e: any) {
      const x = e.clientX   //当前鼠标的x轴
      const y = e.clientY    //当前鼠标所在的y轴
      this.tooltips.tableRefs.forEach((element: any, tableName) => {
        if (!element || !element.getBoundingClientRect || typeof element.getBoundingClientRect !== 'function') return
        const containerRect = element?.getBoundingClientRect()
        if (!(y < containerRect.bottom &&
          y > containerRect.top &&
          x > containerRect.left &&
          x < containerRect.right)) {
          if (this.tooltips.tips.has(tableName)) {
            const data = this.tooltips.tips.get(tableName) as Array<tipsType>
            data.forEach(item => {
              item.visible = false
            })
            this.tooltips.tips.set(tableName, data)
          }
        }
      });

    },
    closeAllTips() {
      this.tooltips.tips.forEach((data) => {
        data.map(item => {
          item.visible = false
        })
      })
    },
    clearAllTips() {
      this.tooltips.tips.clear()
      this.tooltips.tableRefs.clear()
    },
    closeByKey(tableName: string, key: string) {
      const data = this.tooltips.tips.get(tableName) as Array<tipsType>
      if (!Array.isArray(data)) return
      data.map(item => {
        if (item.key === key) {
          item.visible = false
        }
      })
    },
    closeByTableName(tableName: string) {
      if (this.tooltips.tips.has(tableName)) {
        this.tooltips.tips.delete(tableName)
      }
    }
  }

})
