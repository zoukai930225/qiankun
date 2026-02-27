<template>
  <div :style="{ display: 'none' }">
    <div id="print">
      <div class="print">
        <div class="logo">
          <img
            class="main-logo"
            src="https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/newProduct/66f6b054-d267-4e6e-bee4-e11936ea7561.svg"
            alt=""
          />
          <img
            class="sub-title"
            src="https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/newProduct/0992568b-e0d0-42db-a848-e2570aa94b0c.svg"
            alt=""
          />
        </div>
        <div class="content">
          <div class="row_1">
            <div class="title">发货清单</div>
            <div class="sub-title">
              <div class="sub-title-row">
                <span class="label">发货预约单号：</span>
                <span class="value">{{ printInfo.advancedShippingRequestOrderNo }}</span>
              </div>
              <div class="sub-title-row">
                <span class="label">发货日期：</span>
                <span class="value">{{ printInfo.deliveryDate }}</span>
              </div>
              <div class="sub-title-row">
                <span class="label">供应商名称：</span>
                <span class="value">{{ printInfo.supplierName }}</span>
              </div>
            </div>
          </div>

          <div class="row_2">
            <div class="row_2_title cell">采购单号</div>
            <div class="row_2_content cell">{{ printInfo.wdtPurchaseNo }}</div>
            <div class="row_2_title cell">预约到货日期</div>
            <div class="row_2_content cell">{{ printInfo.appointmentDate }}</div>
          </div>
          <div class="row_2">
            <div class="row_2_title cell">收货仓库</div>
            <div class="row_2_content cell">{{ printInfo.receivingWarehouseVo?.name }}</div>
            <div class="row_2_title cell">收货人</div>
            <div class="row_2_content cell">{{ printInfo.receivingWarehouseVo?.contacts }}</div>
          </div>
          <div class="row_2">
            <div class="row_2_title cell">联系电话</div>
            <div class="row_2_content cell">{{
              printInfo.receivingWarehouseVo?.contactNumber
            }}</div>
          </div>
          <div class="row_2">
            <div class="row_2_title cell">收货地址</div>
            <div class="row_2_content cell">{{ printInfo.receivingWarehouseVo?.address }}</div>
          </div>

          <div class="row_6">
            <div class="row_6_item row_6_itemitem_1 cell">货品编码</div>
            <div class="row_6_item row_6_itemitem_2 cell">货品名称</div>
            <div class="row_6_item row_6_itemitem_3 cell">商品编码</div>
            <div class="row_6_item row_6_itemitem_4 cell">规格名称</div>
            <div class="row_6_item row_6_itemitem_5 cell">规格码</div>
            <div class="row_6_item row_6_itemitem_6 cell">箱号</div>
            <div class="row_6_item row_6_itemitem_7 cell">每箱数</div>
            <div class="row_6_item row_6_itemitem_8 cell">总数</div>
            <div class="row_6_item row_6_itemitem_9 cell">收货数量</div>
          </div>
          <div class="row_7">
            <div class="row_7_item row_6_itemitem_1 cell">合计</div>
            <div class="row_7_item row_6_itemitem_2 cell"></div>
            <div class="row_7_item row_6_itemitem_3 cell"></div>
            <div class="row_7_item row_6_itemitem_4 cell"></div>
            <div class="row_7_item row_6_itemitem_5 cell"></div>
            <div class="row_7_item row_6_itemitem_6 cell"></div>
            <div class="row_7_item row_6_itemitem_7 cell"></div>
            <div class="row_7_item row_6_itemitem_8 cell">{{ total }}</div>
            <div class="row_7_item row_6_itemitem_9 cell"></div>
          </div>
          <div class="row_8" v-for="(item, index) in printInfo.packingList" :key="item.id">
            <div
              class="row_8_item row_6_itemitem_1 cell"
              :id="`${index}_goodsCode`"
              :style="row8Style(item, index, 'goodsCode')"
              >{{ item.goodsCode }}</div
            >
            <div class="row_8_item row_6_itemitem_2 cell">{{ item.goodsName }}</div>
            <div class="row_8_item row_6_itemitem_3 cell">{{ item.sku }}</div>
            <div class="row_8_item row_6_itemitem_4 cell">{{ item.formName }}</div>
            <div class="row_8_item row_6_itemitem_5 cell">{{ item.formCode }}</div>
            <div
              class="row_8_item row_6_itemitem_6 cell"
              :style="row8Style(item, index, 'boxNumber')"
            >
              {{ item.boxNumber }}
            </div>
            <div class="row_8_item row_6_itemitem_7 cell">{{ item.boxQuantity }}</div>
            <div class="row_8_item row_6_itemitem_8 cell">{{
              (item.endBoxNumber! - item.startBoxNumber! + 1) * item.boxQuantity!
            }}</div>
            <div class="row_8_item row_6_itemitem_9 cell"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CSSProperties } from 'vue'

const props = defineProps<{
  printInfo: Supplier.Product.PrintInfo
}>()

const total = computed(() => {
  return props.printInfo.packingList?.reduce(
    (arr, item) => arr + (item.endBoxNumber! - item.startBoxNumber! + 1) * item.boxQuantity!,
    0
  )
})

watch(
  () => props.printInfo,
  async () => {
    await nextTick()
    const cells = document.querySelectorAll('#print .row_8')
    cells.forEach((ele, index) => {
      if (index % 31 === 21) {
        ele.classList.add('page-break')
        ele.classList.add('border-top')
        ele.classList.add('first-row')
      }
    })
  }
)

// 常量定义 - 集中管理配置参数
const ROW_CONFIG = {
  fullPageRowNum: 31,
  noFullPageRowNum: 21,
  cellHeight: 51
}

/**
 * 计算当前行所在的页码索引
 * @param index 当前行索引
 * @returns 页码索引
 */
function getPageIndex(index: number): number {
  const { fullPageRowNum, noFullPageRowNum } = ROW_CONFIG
  return Math.floor((index + fullPageRowNum - noFullPageRowNum) / fullPageRowNum)
}

/**
 * 计算当前页的起始和结束索引
 * @param pageIndex 页码索引
 * @param listLength 列表总长度
 * @returns 包含起始和结束索引的对象
 */
function getPageRange(pageIndex: number, listLength: number): { start: number; end: number } {
  const { fullPageRowNum, noFullPageRowNum } = ROW_CONFIG

  const start = pageIndex > 0 ? pageIndex * fullPageRowNum - (fullPageRowNum - noFullPageRowNum) : 0

  const end = Math.min(
    (pageIndex + 1) * fullPageRowNum - (fullPageRowNum - noFullPageRowNum),
    listLength
  )

  return { start, end }
}

/**
 * 计算从当前索引开始的连续相同数据行数（不跨行）
 * @param packingList 数据列表
 * @param index 当前行索引
 * @param item 当前行数据
 * @param key 比较的键名
 * @returns 连续相同数据的行数（不跨行）
 */
function getSameCodeCount(packingList: any[], index: number, item: any, key: string): number {
  // 边界处理：索引超出范围则返回0
  if (index < 0 || index >= packingList.length) {
    return 0
  }

  let count = 0
  // 从当前索引开始向后遍历，只计算连续相同的行
  for (let i = index; i < packingList.length; i++) {
    if (packingList[i][key] === item[key]) {
      count++
    } else {
      // 遇到不同数据则停止计数（不跨行）
      break
    }
  }
  return count
}

/**
 * 判断当前行是否为页面中的第一行
 * @param index 当前行索引
 * @param pageIndex 页码索引
 * @returns 是否为页面第一行
 */
function isFirstRowOfPage(index: number, pageIndex: number): boolean {
  const { fullPageRowNum, noFullPageRowNum } = ROW_CONFIG
  return index + fullPageRowNum - noFullPageRowNum === fullPageRowNum * pageIndex || index === 0
}

/**
 * 计算行样式的主函数
 * @param item 当前行数据
 * @param index 当前行索引
 * @param key 比较的键名
 * @returns CSS样式对象
 */
function row8Style(item: any, index: number, key: string): CSSProperties {
  const { cellHeight, fullPageRowNum, noFullPageRowNum } = ROW_CONFIG
  const packingList = props.printInfo.packingList || []
  const listLength = packingList.length

  // 获取基础计算值
  const sameCode = getSameCodeCount(packingList, index, item, key)
  const pageIndex = getPageIndex(index)
  const isFirst = isFirstRowOfPage(index, pageIndex)
  const {
    // start: currentPageStartIndex,
    end: currentPageEndIndex
  } = getPageRange(pageIndex, listLength)

  // 计算分页相关参数
  const remainingRowsInPage = currentPageEndIndex - index
  const isBreak = sameCode > remainingRowsInPage
  const noBreackRows = pageIndex * fullPageRowNum + noFullPageRowNum - index

  // 获取前后行数据
  const prevRow = index > 0 ? packingList[index - 1] : null
  const nextRow = index < listLength - 1 ? packingList[index + 1] : null

  // 样式判断逻辑
  if (prevRow && prevRow[key] === item[key] && !isFirst) {
    // 当前行与前一行相同，并且不是页面中的第一个，不展示
    return { visibility: 'hidden' }
  } else if ((!nextRow || nextRow[key] !== item[key]) && !isFirst) {
    // 当前行是同组最后一行，并且不是页面中的第一个，清空样式
    return {}
  } else {
    // 计算高度
    let height = ''
    if (isFirst) {
      height = `${cellHeight * Math.min(sameCode, pageIndex ? fullPageRowNum : noFullPageRowNum)}px`
    } else {
      height = `${cellHeight * Math.min(isBreak ? noBreackRows : sameCode, pageIndex ? fullPageRowNum : noFullPageRowNum)}px`
    }
    return { height, visibility: 'visible' }
  }
}
</script>

<style lang="less" scoped>
@import url(../printStyle.css);
</style>
