<template>
  <content-wrap class="shop-daily-consumption">
    <div>
      <div class="flex justify-between items-center">
        <el-form>
          <el-form-item label="日期">
            <el-date-picker
              value-format="YYYY-MM-DD"
              format="YYYY-MM-DD"
              v-model="date"
              type="date"
              placeholder="选择日期"
              :clearable="false"
              @change="fetchData"
              :disabled-date="disabledDate"
            />
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="exportImg" :loading="exportLoading">导出图片</el-button>
      </div>
    </div>

    <div class="shop-daily-consumption-table">
      <div>
        <h3 class="title">数据总览（{{ date }}）</h3>
        <s-table
          ref="overallTableRef"
          :columns="overallColumns"
          :data="overallData"
          :show-pagination="false"
          :span-method="overallSpanMethod"
          :header-cell-class-name="overallHeaderCellClassName"
          :cell-class-name="overallCellClassName"
        />
      </div>
      <div class="mt-16px">
        <div>
          <h3 class="title">店铺列表（{{ date }}）</h3>
        </div>

        <s-table
          ref="shopTableRef"
          :columns="shopColumns"
          :data="shopData"
          :show-pagination="false"
          :span-method="shopSpanMethod"
          :header-cell-class-name="shopHeaderCellClassName"
          :cell-class-name="shopCellClassName"
        />
      </div>
    </div>
  </content-wrap>
</template>

<script lang="tsx" setup>
import { ref, onMounted } from 'vue'
import { STable } from '@/components/SWTable'
import dayjs from 'dayjs'
import { MultiTableExportUtil } from '@/utils/exportImg'
import { debounce } from 'lodash-es'
import { getDouyinStoreList, getLatestDate } from '@/api/channelData'

// 数据总览表格列定义
const overallColumns = [
  {
    label: '总GMV(含补贴)',
    prop: 'storeGmv',
    minWidth: 130,
    headerAlign: 'center',
    colSpan: 4
  },
  {
    label: '总消耗',
    prop: 'storeCost',
    minWidth: 100,
    headerAlign: 'center',
    colSpan: 0
  },
  {
    label: '总退款',
    prop: 'storeRefund',
    minWidth: 100,
    headerAlign: 'center',
    colSpan: 0
  },
  {
    label: '付费占比(去退)',
    prop: 'storeRate',
    minWidth: 130,
    headerAlign: 'center',
    colSpan: 0
  },
  {
    label: '渠道',
    prop: 'channel',
    minWidth: 100
  },
  {
    label: '总成交金额(含补贴)',
    prop: 'totalTransAmount',
    minWidth: 160
  },
  {
    label: '退款金额',
    prop: 'refundAmount',
    minWidth: 100
  },
  {
    label: '总消耗(含佣金)',
    prop: 'totalCostWithCommission',
    minWidth: 130
  },
  {
    label: '渠道付费占比(去退)',
    prop: 'channelPaidRatio',
    minWidth: 160
  }
]

// 店铺列表表格列定义
const shopColumns = [
  {
    label: '店铺',
    prop: 'storeName',
    minWidth: 240
  },
  {
    label: '全店GMV(含补贴)',
    prop: 'storeGmv',
    width: 150
  },
  {
    label: '全店退款(退款时间)',
    prop: 'storeRefund',
    width: 160
  },
  {
    label: '全店广告消耗',
    prop: 'storeCost',
    width: 130
  },
  {
    label: '全店付费占比(去退)',
    prop: 'storeRate',
    width: 160
  },
  {
    label: '渠道',
    prop: 'channel',
    width: 150
  },
  {
    label: '消耗',
    prop: 'totalCostWithCommission',
    width: 100
  },
  {
    label: 'ROI',
    prop: 'roi',
    width: 80
  },
  {
    label: '佣金预估',
    prop: 'commission',
    width: 100
  },
  {
    label: '渠道广告成交金额',
    prop: 'gmv',
    width: 160
  },
  {
    label: '渠道总成交金额(含补贴)',
    prop: 'totalTransAmount',
    width: 180
  },
  {
    label: '渠道退款',
    prop: 'refundAmount',
    width: 100
  },
  {
    label: '渠道付费占比(去退)',
    prop: 'channelPaidRatio',
    width: 160
  }
]

// 总览表格表头样式类名
const overallHeaderCellClassName = ({ columnIndex }: { columnIndex: number }) => {
  if (columnIndex <= 3) {
    return 'overview-gmv-header'
  } else {
    return 'overview-channel-header'
  }
}

// 总览表格单元格样式类名
const overallCellClassName = ({ columnIndex }: { columnIndex: number }) => {
  const classes: string[] = []
  // 背景色逻辑
  if (columnIndex <= 3) {
    classes.push('overview-gmv-cell')
  } else {
    classes.push('overview-channel-cell')
  }

  // 字体颜色逻辑
  // 蓝色: 1(总消耗), 7(总消耗(含佣金))
  if ([1, 7].includes(columnIndex)) {
    classes.push('cell-text-blue')
  }
  // 红色: 3(付费占比), 8(渠道付费占比)
  if ([3, 8].includes(columnIndex)) {
    classes.push('cell-text-red')
  }

  return classes.join(' ')
}

// 店铺表格表头样式类名
const shopHeaderCellClassName = ({ columnIndex }: { columnIndex: number }) => {
  if (columnIndex <= 4) {
    return 'shop-info-header'
  } else if (columnIndex >= 5 && columnIndex <= 7) {
    return 'shop-ad-header'
  } else {
    return 'shop-commission-header'
  }
}

// 店铺表格单元格样式类名
const shopCellClassName = ({ columnIndex }: { columnIndex: number }) => {
  const classes: string[] = []
  // 背景色逻辑
  if (columnIndex <= 4) {
    classes.push('shop-info-cell')
  } else if (columnIndex >= 5 && columnIndex <= 7) {
    classes.push('shop-ad-cell')
  } else {
    classes.push('shop-commission-cell')
  }

  // 字体颜色逻辑
  // 蓝色: 3(全店广告消耗), 6(消耗)
  if ([3, 6].includes(columnIndex)) {
    classes.push('cell-text-blue')
  }
  // 红色: 4(全店付费占比), 7(ROI), 12(渠道付费占比)
  if ([4, 7, 12].includes(columnIndex)) {
    classes.push('cell-text-red')
  }

  return classes.join(' ')
}

// 定义类型
interface OverallDataItem {
  totalGMV: number
  totalCost: number
  totalRefund: number
  paidRatio: string
  channel: string
  totalTransAmount: number
  refundAmount: number
  totalCostWithCommission: number
  channelPaidRatio: string
}

interface ShopDataItem {
  store: string
  shopId?: string // 用于标识同一个店铺的记录
  shopName: string
  shopGMV: number
  shopRefund: number
  shopAdCost: number
  shopPaidRatio: string
  channel: string
  cost: number
  roi: number | string
  estimatedCommission: number
  channelAdTransAmount: number
  channelTotalTransAmount: number
  channelRefund: number
  channelPaidRatio: string
}

const date = ref('')
const lastDate = ref('')
const disabledDate = (time: Date) => {
  if (!date.value) return false
  return dayjs(time).isAfter(dayjs(lastDate.value), 'day')
}
const overallData = ref<OverallDataItem[]>([])
const shopData = ref<ShopDataItem[]>([])
const exportLoading = ref(false)

// 合并单元格的方法 - 数据总览
const overallSpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  // 对前4列进行合并
  if (columnIndex < 4) {
    if (rowIndex === 0) {
      return {
        rowspan: overallData.value.length,
        colspan: 1
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  }
}

// 合并单元格的方法 - 店铺列表
const shopSpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  // 对前5列进行合并
  if (columnIndex < 5) {
    const data = shopData.value

    // 查找当前行所在店铺的名称
    const store = data[rowIndex].store

    // 当前行是否为该店铺的第一行
    let isFirstRowOfShop = true
    for (let i = 0; i < rowIndex; i++) {
      if (data[i].store === store) {
        isFirstRowOfShop = false
        break
      }
    }

    // 如果是店铺的第一行，计算该店铺有多少行
    if (isFirstRowOfShop) {
      let rowCount = 1
      for (let i = rowIndex + 1; i < data.length; i++) {
        if (data[i].store === store) {
          rowCount++
        } else {
          break
        }
      }

      return {
        rowspan: rowCount,
        colspan: 1
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  }
}

/**
 * @description 将原始数据拆分为三种渠道类型的数据
 * @param {Array} totalData 原始数据
 * @returns {Array} 拆分后的数据
 */
function transformData(totalData: any[]): any[] {
  if (!totalData || !totalData.length) return []

  const result: any[] = []

  totalData.forEach((item) => {
    // secretworld服装旗舰店 达人合作 渠道广告成交金额 如果为0 就取 渠道总成交金额(含补贴)
    let count = ''
    if (item.store === 'swDouyinApparel') {
      if (item.daRenGmv === '0' || !item.daRenGmv) {
        count = item.daRenGmvSubsidy
      }
    }
    // 添加商品卡数据
    result.push({
      ...item,
      channel: '商品卡+自营挂车',
      totalTransAmount: item.carGmvSubsidy, // 总成交金额(含补贴)
      refundAmount: item.carRefund, // 退款金额
      totalCostWithCommission: item.carCost, // 总消耗(含佣金)
      channelPaidRatio: item.carRate,
      roi: item.carRoi,
      gmv: item.carGmv
    })
    // 添加达人合作数据
    result.push({
      ...item,
      channel: '达人合作',
      totalTransAmount: item.daRenGmvSubsidy,
      refundAmount: item.daRenRefund,
      totalCostWithCommission: item.daRenCost, // 达人成本+达人佣金
      channelPaidRatio: item.daRenRate,
      roi: item.daRenRoi,
      gmv: item.daRenGmv || count,
      commission: item.daRenMasterCommission
    })

    // 添加直播数据
    result.push({
      ...item,
      channel: '直播',
      totalTransAmount: item.liveBroadGmvSubsidy,
      refundAmount: item.liveBroadRefund,
      totalCostWithCommission: item.liveBroadCost,
      channelPaidRatio: item.liveBroadRate,
      roi: item.liveBroadRoi,
      gmv: item.liveBroadGmv
    })
  })
  return result
}

// 模拟数据
const mockOverallData = () => {
  return [
    {
      totalGMV: 295360,
      totalCost: 84328,
      totalRefund: 22365,
      paidRatio: '30.89%',
      channel: '商品卡',
      totalTransAmount: 120250,
      refundAmount: 8331,
      totalCostWithCommission: 29562,
      channelPaidRatio: '26.41%'
    },
    {
      totalGMV: 295360,
      totalCost: 84328,
      totalRefund: 22365,
      paidRatio: '30.89%',
      channel: '达人合作',
      totalTransAmount: 75456,
      refundAmount: 4393,
      totalCostWithCommission: 19306,
      channelPaidRatio: '27.17%'
    },
    {
      totalGMV: 295360,
      totalCost: 84328,
      totalRefund: 22365,
      paidRatio: '30.89%',
      channel: '直播',
      totalTransAmount: 99654,
      refundAmount: 6545,
      totalCostWithCommission: 35460,
      channelPaidRatio: '38.08%'
    }
  ]
}

const mockShopData = () => {
  return [
    // secretworld官方旗舰店 - 商品卡
    {
      shopId: 'shop1',
      shopName: 'secretworld官方旗舰店',
      shopGMV: 64884,
      shopRefund: 6038,
      shopAdCost: 17999,
      shopPaidRatio: '30.90%',
      channel: '商品卡',
      cost: 6243,
      roi: 3.43,
      estimatedCommission: 0,
      channelAdTransAmount: 21410,
      channelTotalTransAmount: 29502,
      channelRefund: 3060,
      channelPaidRatio: '26.92%'
    },
    // secretworld官方旗舰店 - 达人合作
    {
      shopId: 'shop1',
      shopName: 'secretworld官方旗舰店',
      shopGMV: 64884,
      shopRefund: 6038,
      shopAdCost: 17999,
      shopPaidRatio: '30.90%',
      channel: '达人合作',
      cost: 5134,
      roi: 3.23,
      estimatedCommission: 0,
      channelAdTransAmount: 16607,
      channelTotalTransAmount: 19373,
      channelRefund: 2193,
      channelPaidRatio: '29.85%'
    },
    // secretworld官方旗舰店 - 直播
    {
      shopId: 'shop1',
      shopName: 'secretworld官方旗舰店',
      shopGMV: 64884,
      shopRefund: 6038,
      shopAdCost: 17999,
      shopPaidRatio: '30.90%',
      channel: '直播',
      cost: 6622,
      roi: 2.88,
      estimatedCommission: 0,
      channelAdTransAmount: 19074,
      channelTotalTransAmount: 19250,
      channelRefund: 2182,
      channelPaidRatio: '35.73%'
    },
    // secretworld服饰旗舰店 - 商品卡
    {
      shopId: 'shop2',
      shopName: 'secretworld服饰旗舰店',
      shopGMV: 71141,
      shopRefund: 12631,
      shopAdCost: 19818,
      shopPaidRatio: '33.87%',
      channel: '商品卡',
      cost: 8041,
      roi: 3.42,
      estimatedCommission: 0,
      channelAdTransAmount: 27539,
      channelTotalTransAmount: 31771,
      channelRefund: 5051,
      channelPaidRatio: '30.78%'
    },
    // secretworld服饰旗舰店 - 达人合作
    {
      shopId: 'shop2',
      shopName: 'secretworld服饰旗舰店',
      shopGMV: 71141,
      shopRefund: 12631,
      shopAdCost: 19818,
      shopPaidRatio: '33.87%',
      channel: '达人合作',
      cost: 4109,
      roi: 3.31,
      estimatedCommission: 0,
      channelAdTransAmount: 13603,
      channelTotalTransAmount: 16783,
      channelRefund: 26271,
      channelPaidRatio: '43.08%'
    },
    // secretworld服饰旗舰店 - 直播
    {
      shopId: 'shop2',
      shopName: 'secretworld服饰旗舰店',
      shopGMV: 71141,
      shopRefund: 12631,
      shopAdCost: 19818,
      shopPaidRatio: '33.87%',
      channel: '直播',
      cost: 7668,
      roi: 2.6,
      estimatedCommission: 0,
      channelAdTransAmount: 20375,
      channelTotalTransAmount: 22037,
      channelRefund: 4378,
      channelPaidRatio: '42.00%'
    },
    // secretworld眼装旗舰店 - 商品卡
    {
      shopId: 'shop3',
      shopName: 'secretworld眼装旗舰店',
      shopGMV: 11655,
      shopRefund: 7011,
      shopAdCost: 4347,
      shopPaidRatio: '93.60%',
      channel: '商品卡',
      cost: 497,
      roi: 3.42,
      estimatedCommission: 0,
      channelAdTransAmount: 1700,
      channelTotalTransAmount: 2099,
      channelRefund: 491,
      channelPaidRatio: '30.91%'
    },
    // secretworld眼装旗舰店 - 达人合作
    {
      shopId: 'shop3',
      shopName: 'secretworld眼装旗舰店',
      shopGMV: 11655,
      shopRefund: 7011,
      shopAdCost: 4347,
      shopPaidRatio: '93.60%',
      channel: '达人合作',
      cost: 0,
      roi: '#DIV/0!',
      estimatedCommission: 410,
      channelAdTransAmount: 1022,
      channelTotalTransAmount: 1022,
      channelRefund: 107,
      channelPaidRatio: '27.06%'
    },
    // secretworld眼装旗舰店 - 直播
    {
      shopId: 'shop3',
      shopName: 'secretworld眼装旗舰店',
      shopGMV: 11655,
      shopRefund: 7011,
      shopAdCost: 4347,
      shopPaidRatio: '93.60%',
      channel: '直播',
      cost: 3440,
      roi: 2.32,
      estimatedCommission: 0,
      channelAdTransAmount: 7971,
      channelTotalTransAmount: 7934,
      channelRefund: 1672,
      channelPaidRatio: '54.93%'
    }
  ]
}

const overallTableRef = ref()
const shopTableRef = ref()
async function getStoreList() {
  try {
    overallTableRef.value.setLoading(true)
    shopTableRef.value.setLoading(true)
    // 获取最新有数据的日期
    if (!lastDate.value) {
      const latestDate = await getLatestDate()
      date.value = latestDate
      lastDate.value = latestDate
    }
    const { data, totalData } = await getDouyinStoreList({
      dataDate: date.value
    })
    if (
      Object.prototype.toString.call(totalData) === '[object Object]' &&
      Object.keys(totalData).length > 0
    ) {
      overallData.value = transformData(Array.of(totalData))
    } else {
      overallData.value = []
    }
    shopData.value = transformData(data)
  } catch (error) {
    console.log(error)
  } finally {
    overallTableRef.value.setLoading(false)
    shopTableRef.value.setLoading(false)
  }
  console.log(shopData.value)
}

// 获取数据
const fetchData = () => {
  // 实际项目中这里应该调用API获取数据
  // overallData.value = mockOverallData()
  // shopData.value = mockShopData()
  getStoreList()
}

// 实际的导出函数
const doExportImg = async () => {
  if (exportLoading.value) return // 如果已经在导出中，则直接返回
  exportLoading.value = true
  // 使用了setTimeout创建宏任务，这样可以确保loading状态在开始执行图片导出之前能够被渲染出来。
  // 浏览器会先完成UI更新周期，然后再执行setTimeout中的回调函数。延迟为50，这也能让浏览器有机会完成DOM渲染。
  setTimeout(async () => {
    try {
      // 获取表格容器
      const overallTableContainer = document.querySelector(
        '.shop-daily-consumption-table > div:first-child'
      ) as HTMLElement
      const shopTableContainer = document.querySelector(
        '.shop-daily-consumption-table > div:nth-child(2)'
      ) as HTMLElement

      if (!overallTableContainer || !shopTableContainer) {
        console.error('找不到表格元素')
        return
      }

      // 调用工具类导出图片
      await MultiTableExportUtil.exportElements([overallTableContainer, shopTableContainer], {
        filename: `店铺每日消耗_${date.value}.png`,
        defaultWidths: [1200, 1800]
      })
    } catch (error) {
      console.error('导出图片失败:', error)
    } finally {
      exportLoading.value = false
    }
  }, 100)
}

// 添加防抖的导出函数
const exportImg = debounce(doExportImg, 300)

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.shop-daily-consumption {
  // padding: 16px;
}
.shop-daily-consumption-table {
  padding: 16px 0;
}
.title {
  font-size: 16px;
  line-height: 24px;
  color: #3d3d3d;
  font-weight: bold;
  margin-bottom: 16px;
}

:deep(.el-form-item) {
  margin-bottom: 0;
}

// 表头和单元格样式
:deep(.s-table) {
  // 重置表格样式
  // .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
  //   background-color: rgba(245, 247, 250, 0.6) !important;
  // }

  // .el-table__row--striped td.el-table__cell {
  //   background-color: rgba(250, 250, 250, 0.4) !important;
  // }

  // // 表头样式
  // .el-table__header-wrapper {
  //   th.el-table__cell {
  //     height: 48px;
  //     font-weight: bold;
  //     color: #606266;
  //   }
  // }

  // // 表格单元格样式
  // .el-table__row td {
  //   padding: 8px 0;
  // }

  // // 总览表格样式
  // // 总GMV到付费占比
  // .overview-gmv-header {
  //   background: linear-gradient(
  //     180deg,
  //     rgba(218, 245, 213, 0.33) 0%,
  //     rgba(255, 255, 255, 0.33) 100%
  //   ) !important;
  // }

  // // 渠道到渠道付费占比
  // .overview-channel-header {
  //   background: linear-gradient(
  //     180deg,
  //     rgba(216, 243, 252, 0.33) 0%,
  //     rgba(247, 253, 254, 0.33) 100%
  //   ) !important;
  // }

  // // 总GMV到付费占比的单元格
  // .overview-gmv-cell {
  //   background: linear-gradient(180deg, rgba(218, 245, 213, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%);
  // }

  // // 渠道到渠道付费占比的单元格
  // .overview-channel-cell {
  //   background: linear-gradient(180deg, rgba(216, 243, 252, 0.1) 0%, rgba(247, 253, 254, 0.1) 100%);
  // }

  // // 店铺列表表格样式
  // // 店铺到全店付费占比
  // .shop-info-header {
  //   background: linear-gradient(
  //     180deg,
  //     rgba(218, 245, 213, 0.33) 0%,
  //     rgba(255, 255, 255, 0.33) 100%
  //   ) !important;
  // }

  // // 渠道到ROI
  // .shop-ad-header {
  //   background: linear-gradient(
  //     180deg,
  //     rgba(216, 243, 252, 0.33) 0%,
  //     rgba(247, 253, 254, 0.33) 100%
  //   ) !important;
  // }

  // // 佣金预估到渠道付费占比
  // .shop-commission-header {
  //   background: linear-gradient(
  //     180deg,
  //     rgba(185, 206, 253, 0.33) 0%,
  //     rgba(255, 255, 255, 0.33) 100%
  //   ) !important;
  // }

  // // 店铺到全店付费占比的单元格
  // .shop-info-cell {
  //   background: linear-gradient(180deg, rgba(218, 245, 213, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%);
  // }

  // // 渠道到ROI的单元格
  // .shop-ad-cell {
  //   background: linear-gradient(180deg, rgba(216, 243, 252, 0.1) 0%, rgba(247, 253, 254, 0.1) 100%);
  // }

  // // 佣金预估到渠道付费占比的单元格
  // .shop-commission-cell {
  //   background: linear-gradient(180deg, rgba(185, 206, 253, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%);
  // }

  // 新增：字体颜色样式
  .cell-text-blue {
    color: var(--el-color-primary) !important;
  }

  .cell-text-red {
    color: #f56c6c !important;
  }
}
</style>
