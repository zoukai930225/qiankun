<template>
  <div class="categoryItem">
    <CategoryHeader :type="type" />
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
            <div v-if="index > 0 && index < headerList.length - 2">
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
  console.log('传过来的数据', data)
  headerList.value = []
  list.value = []
  totalMaxValue.value = 0
  totalMaxValueLast.value = 0
  headerList.value.push({ name: '店铺', width: '90px' })
  data &&
    data.forEach((item, index) => {
      const dateArr = item.date.split('-')
      let dateStr = ''
      if (dateArr.length > 2) {
        dateStr = `${dateArr[1]}月${dateArr[2]}日`
        headerList.value.push({ name: dateStr, width: '90px' })
      } else {
        headerList.value.push({
          name: item.date,
          width: '90px'
        })
      }
    })
  if (data && data.length > 0) {
    isHasData.value = true
  } else {
    isHasData.value = false
  }
  console.log('data: ', data)

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

// 动态获取所有店铺名称
const getAllCategoryNames = (dataList) => {
  const categoryNames = new Set()

  // 从dataList中获取所有店铺名称
  dataList.forEach((item) => {
    if (item.value && Array.isArray(item.value)) {
      item.value.forEach((valueItem) => {
        if (valueItem.category) {
          categoryNames.add(valueItem.category)
        }
      })
    }
  })

  // 将店铺名称排序，'合计'放在最后
  return Array.from(categoryNames).sort((a, b) => {
    if (a === '合计') return 1
    if (b === '合计') return -1
    return a.localeCompare(b)
  })
}

// 动态处理分类数据
const handleCategoryDate = (dataList) => {
  const categoryNames = getAllCategoryNames(dataList)
  const colors = ['#08769A', '#168801', '#687B06', '#A38516', '#35508D', '#80265A', '#333333']

  list.value.length = 0 // 清空数组

  categoryNames.forEach((category, index) => {
    const isTotal = category === '合计'
    const colorIndex = isTotal ? colors.length - 1 : index % (colors.length - 1)

    list.value.push({
      index: index,
      category: category,
      isTotal: isTotal,
      categoryColor: colors[colorIndex],
      value: getCategoryAllDateValue(dataList, category),
      compare: getLastOneCompareData(dataList, category),
      percentage: getCategoryAllDatePercent(dataList, category),
      monthOnMonth: getMonthOnMonth(dataList, category)
    })
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
  if (!list) return ''

  const item = list.find((d) => d.category === category)

  if (item) {
    // 优先检查 item 对象自身是否有 qoq 属性，这是最直接的判断方式
    if (item.qoq !== undefined) {
      value = item.qoq
    }
    // 如果没有 qoq，再根据 props.type 去寻找对应的字段
    else {
      switch (props.type) {
        case 'search':
          value = item.searchVisitorsCount || ''
          break
        case 'total':
          value = item.charge || ''
          break
        case 'sale':
          value = item.paymentAmount || ''
          break
        case 'refundRatio':
          value = item.refundRatio || ''
          break
        case 'refundRate':
          value = item.refundRate || ''
          break
        case 'refund':
          value = item.refund || ''
          break
        default:
          value = ''
      }
    }
  }

  // 注意：对于数字0，`value || ''` 会错误地转为空字符串，需要判断
  return value !== undefined && value !== null ? String(value) : ''
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
