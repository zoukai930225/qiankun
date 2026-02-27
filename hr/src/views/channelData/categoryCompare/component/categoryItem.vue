<template>
  <div class="categoryItem">
    <CategoryHeader :type="type" :store="store" />
    <el-table
      :border="true"
      :data="list"
      :stripe="true"
      :show-overflow-tooltip="false"
      class="SWCommonTable commonTable"
      v-horizontal-scroll="'always'"
      ref="TableRef"
    >
      <el-table-column
        v-for="(value, index) in headerList"
        :key="index"
        :label="value.name"
        :min-width="value.width"
      >
        <template #default="{ row }">
          <div
            class="row-center"
            :style="{
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              marginLeft: '-6px'
            }"
          >
            <div
              v-if="index === 0"
              :style="{
                color: list[row.index].categoryColor
              }"
              >{{ list[row.index].category }}</div
            >
            <div v-if="index > 0 && index < headerList.length - 2" class="row-center">
              <SWProgressLabel
                :value="list[row.index].value[index - 1]"
                :progress="Number(list[row.index].percentage[index - 1])"
                :columnWidth="getColumnWidth(index)"
                textColor="#333333"
                backgroundColor="#277BFF"
              />
            </div>
            <!-- 最后两项 -->
            <div
              v-if="(index == headerList.length - 2 || index == headerList.length - 1) && isHasData"
              class="row-center"
            >
              <SWProgressLabel
                v-if="!row.isTotal"
                :value="index == headerList.length - 2 ? row.compare : row.monthOnMonth"
                :progress="formatProgress(row, index)"
                :columnWidth="getColumnWidth(index)"
                :textColor="
                  (index == headerList.length - 2 ? row.compare : row.monthOnMonth).indexOf('-') ==
                  -1
                    ? '#EB3737'
                    : '#4fb431'
                "
                :backgroundColor="
                  (index == headerList.length - 2 ? row.compare : row.monthOnMonth).indexOf('-') ==
                  -1
                    ? '#EF5F5F'
                    : '#4fb431'
                "
              />
              <div v-if="row.isTotal" style="padding-left: 6px; font-weight: 600">
                {{ index == headerList.length - 2 ? row.compare : row.monthOnMonth }}
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

import CategoryHeader from './header.vue'
import SWProgressLabel from '@/components/SWBaseComponent/SWProgressLabel/index.vue'

const props = defineProps({
  type: propTypes.string.def('search'), // 类型 search 搜索流量 total 付费总和 sale 销售额 refundRatio 去退费比  refundRate 退费率 refund 退款
  store: propTypes.string.def('')
})

const headerList = ref<any>([])
const list = ref<any>([])
const isHasData = ref(true)
const tableColumns = ref([])
const TableRef = ref()
// 处理数据
const handleData = (data) => {
  headerList.value = []
  list.value = []
  totalMaxValue.value = 0
  totalMaxValueLast.value = 0
  headerList.value.push({ name: '类目', width: '70px',fixed: 'left'})
  data &&
    data.forEach((item, index) => {
      const dateArr = item.date.split('-')
      let dateStr = ''
      if (dateArr.length > 2) {
        dateStr = `${dateArr[1]}月${dateArr[2]}日`
        headerList.value.push({ name: dateStr, width: '100px' })
      } else {
        headerList.value.push({
          name: item.date,
          width: '100px'
        })
      }
    })
  if (data && data.length > 0) {
    isHasData.value = true
  } else {
    isHasData.value = false
  }

  handleCategoryDate(data)

  setTimeout(() => {
    if (TableRef.value && TableRef.value.$el) {
      tableColumns.value = TableRef.value.$el.querySelectorAll(
        '.el-table__header-wrapper colgroup col'
      )
    }
  }, 50)
}

const getColumnWidth = (index) => {
  if (tableColumns.value && tableColumns.value[index]) {
    //@ts-ignore
    return tableColumns.value[index].clientWidth
  }
  return 0
}

const totalMaxValue = ref(0)

const handleCategoryDate = (dataList) => {
  list.value = []
  list.value.push({
    index: 0,
    category: '女士内裤',
    categoryColor: '#08769A',
    value: getCategoryAllDateValue(dataList, '女士内裤'),
    compare: getLastOneCompareData(dataList, '女士内裤'),
    percentage: getCategoryAllDatePercent(dataList, '女士内裤'),
    monthOnMonth: getMonthOnMonth(dataList, '女士内裤')
  })
  list.value.push({
    index: 1,
    category: '男士内裤',
    categoryColor: '#168801',
    value: getCategoryAllDateValue(dataList, '男士内裤'),
    compare: getLastOneCompareData(dataList, '男士内裤'),
    percentage: getCategoryAllDatePercent(dataList, '男士内裤'),
    monthOnMonth: getMonthOnMonth(dataList, '男士内裤')
  })
  list.value.push({
    index: 2,
    category: '内衣',
    categoryColor: '#687B06',
    value: getCategoryAllDateValue(dataList, '内衣'),
    compare: getLastOneCompareData(dataList, '内衣'),
    percentage: getCategoryAllDatePercent(dataList, '内衣'),
    monthOnMonth: getMonthOnMonth(dataList, '内衣')
  })
  list.value.push({
    index: 3,
    category: '袜子',
    categoryColor: '#A38516',
    value: getCategoryAllDateValue(dataList, '袜子'),
    compare: getLastOneCompareData(dataList, '袜子'),
    percentage: getCategoryAllDatePercent(dataList, '袜子'),
    monthOnMonth: getMonthOnMonth(dataList, '袜子')
  })
  list.value.push({
    index: 4,
    category: '胸贴',
    categoryColor: '#35508D',
    value: getCategoryAllDateValue(dataList, '胸贴'),
    compare: getLastOneCompareData(dataList, '胸贴'),
    percentage: getCategoryAllDatePercent(dataList, '胸贴'),
    monthOnMonth: getMonthOnMonth(dataList, '胸贴')
  })
  list.value.push({
    index: 5,
    category: '季节品',
    categoryColor: '#80265A',
    value: getCategoryAllDateValue(dataList, '季节品'),
    compare: getLastOneCompareData(dataList, '季节品'),
    percentage: getCategoryAllDatePercent(dataList, '季节品'),
    monthOnMonth: getMonthOnMonth(dataList, '季节品')
  })
  list.value.push({
    index: 6,
    category: '合计',
    isTotal: true,
    categoryColor: '#333333',
    value: getCategoryAllDateValue(dataList, '合计'),
    compare: getLastOneCompareData(dataList, '合计'),
    percentage: getCategoryAllDatePercent(dataList, '合计'),
    monthOnMonth: getMonthOnMonth(dataList, '合计')
  })

  console.log('list', list.value)
}

const formatProgress = (row, index) => {
  if (index == headerList.value?.length - 2) {
    return totalMaxValue?.value ? Math.abs(row?.compare.split('%')[0]) / totalMaxValue?.value : 0
  } else {
    return totalMaxValueLast?.value
      ? Math.abs(row?.monthOnMonth.split('%')[0]) / totalMaxValueLast?.value
      : 0
  }
}

const getCategoryAllDateValue = (list, category) => {
  let values = [] as any
  for (let i = 0; i < list.length; i++) {
    const obj = list[i]
    values.push(getCategoryValue(obj.value, category))
  }
  return values || []
}

const getCategoryAllDatePercent = (list, category) => {
  let values = [] as any
  for (let i = 0; i < list.length; i++) {
    const obj = list[i]
    values.push(getPercentValue(obj.value, category))
  }
  return values || []
}

const totalMaxValueLast = ref(0)
// 环比
const getMonthOnMonth = (list, category) => {
  if (list.length === 0) return ''
  const lastObj = list[list.length - 1]
  const midValue = getCategoryValueMonthOnMonth(lastObj.value, category)
  // 寻找最大值
  if (category !== '合计') {
    let mid = midValue
    if (midValue.indexOf('%') != -1) {
      mid = midValue.split('%')[0]
    }
    if (mid && Math.abs(mid) >= totalMaxValueLast.value) {
      totalMaxValueLast.value = Math.abs(mid)
    }
  }
  return midValue
}

const getCategoryValueMonthOnMonth = (list, category) => {
  const item = list.find((item) => item.category === category)
  return item ? item.qoq || '' : ''
}

const getLastOneCompareData = (list, category) => {
  let value = ''
  if (list.length > 0) {
    const lastObj = list[list.length - 2]
    if (!lastObj) return value
    const categoryValue = getCategoryValue(lastObj.value, category)
    if (category !== '合计') {
      let mid = categoryValue
      if (categoryValue.indexOf('%') != -1) {
        mid = categoryValue.split('%')[0]
      }
      if (mid && Math.abs(Number(mid)) >= totalMaxValue.value) {
        totalMaxValue.value = Math.abs(Number(mid))
      }
    }
    value = categoryValue
  }
  return value
}

const getCategoryValue = (list, category) => {
  let value = ''
  list.forEach((item) => {
    if (item.category === category) {
      if (props.type === 'search') {
        value = item.searchVisitorsCount || ''
      } else if (props.type === 'total') {
        value = item.charge || ''
      } else if (props.type === 'sale') {
        value = item.paymentAmount || ''
      } else if (props.type === 'refundRatio') {
        value = item.refundRatio || ''
      } else if (props.type === 'refundRate') {
        value = item.refundRate || ''
      } else if (props.type === 'refund') {
        value = item.refund || ''
      }
    }
  })
  return value || ''
}

const getPercentValue = (list, category) => {
  let value = ''
  list.forEach((item) => {
    if (item.category === category) {
      value = item.percentage || ''
    }
  })
  return value || 0
}
defineExpose({ handleData }) // 提供 open 方法，用于打开弹窗
</script>

<style lang="scss" scoped>
.categoryItem {
  width: calc(100%);
}
.compareBg {
  //width: 64px;
  padding-left: 9px;
  padding-right: 9px;
  height: 28px;
  background: #ffb5b5;
  border-radius: 3px;
  font-weight: 600;
  font-size: 14px;
  color: #820000;
  line-height: 28px;
  text-align: center;
}
.compareTotal {
  // width: 64px;
  height: 28px;
  padding-left: 9px;
  padding-right: 9px;
  border-radius: 3px;
  font-weight: 600;
  font-size: 14px;
  color: #820000;
  line-height: 28px;
  text-align: center;
}
.compareDesc {
  color: #333333;
}
:deep(.el-table--default .cell) {
  padding-left: 12px;
  padding-right: 5px;
}
</style>
