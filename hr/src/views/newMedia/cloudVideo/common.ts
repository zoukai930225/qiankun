//渠道
export const channelList = [
  { id: 1, label: '逛逛 ', value: 1 },
  { id: 2, label: '超级短视频 ', value: 2 }
]

//作品状态
export const worksStatusList = [
  { id: 1, label: '待认领', value: 1 },
  { id: 2, label: '已认领', value: 2 },
  { id: 3, label: '已分配', value: 3 },
]

//图表下拉枚举 - 超级短视频
export const chartSuperList = [
  {
    id: 1, label: '花费', value: 'cdCost'
  },
  // {
  //   id: 2, label: '种草引导ROI', value: 'cdZhongcaoRoi'
  // },
  // {
  //   id: 3, label: '种草引导成交金额', value: 'cdZhongcaoAmount'
  // },
  {
    id: 4, label: '直接引导成交金额', value: 'cdDirectAmount'
  },
  {
    id: 5, label: '直接引导ROI', value: 'cdDirectAmountRoi'
  },
  {
    id: 6, label: '观看量', value: 'cdViewCount'
  },
  {
    id: 7, label: '新客触达成本', value: 'cdNewCustomerCost'
  },
  {
    id: 8, label: '新客触达数', value: 'cdNewCustomerCount'
  }
]


//图表下拉枚举 - 逛逛
export const chartGuangList = [
  {
    id: 1, label: '有效查看人数', value: 'ggValidViewPeople'
  },
  {
    id: 2, label: '有效查看次数', value: 'ggValidViewCount'
  },
  {
    id: 3, label: '新增粉丝数', value: 'ggNewFollowers'
  },
  {
    id: 4, label: '种草成交人数', value: 'ggZhongcaoPeopleCount'
  },
  {
    id: 5, label: '种草成交订单数', value: 'ggPurchaseOrders'
  },
  {
    id: 6, label: '种草成交金额', value: 'ggZhongcaoAmount'
  },
  {
    id: 7, label: '商品加购次数', value: 'ggCartAddCount'
  }
]

export const getLable = (list: any[], value: any) => {
  return list.find(item => item.value === value)?.label

}