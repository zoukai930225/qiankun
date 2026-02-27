<template>
  <ElScrollbar class="payTotal">
    <div class="tab">
      <div class="tab-item" v-for="(value, index) in taobaoTabList" :key="index">
        <img class="tab-item-img" :class="{ 'tab-item-img1': index === 0 }" :src="value.icon" />
        <div class="tab-item-text" :style="{ color: value.color }">{{ value.text }}</div>
      </div>
    </div>
    <div class="tableBg">
      <div class="table" v-for="(value, index) in valueList" :key="index">
        <div class="table-item">
          <div class="table-item-first">
            <div
              class="table-item-first-value"
              :class="value.name === '总花费' ? 'table-item-first-value-total' : ''"
            >
              {{ value.name }}</div
            >
            <img class="table-item-first-img" :src="value.icon" />
          </div>
        </div>
        <div class="table-item" v-for="(value1, index1) in value.list" :key="index1">
          <div v-if="index !== 5 && index !== 8" class="table-item-normal">{{ value1 }}</div>
          <div v-else class="table-item-normal">
            <div class="table-item-normal-progress" v-if="index === 5 && value1">
              <SWProgressLabel
                :value="value1"
                :progress="allChargePercent(value1)"
                :fontSize="22"
                textColor="#0064FF"
                backgroundColor="#277BFF"
              />
            </div>
            <div class="table-item-normal-progress" v-if="index === 8 && value1">
              <SWProgressLabel
                :value="showFullPercentageExpenses(value1)"
                :progress="percentageExpensesPercent(value1)"
                :fontSize="20"
                textColor="#EB3737"
                backgroundColor="#EF5F5F"
              />
            </div>
          </div>
        </div> </div
    ></div>
  </ElScrollbar>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

import SWProgressLabel from '@/components/SWBaseComponent/SWProgressLabel/index.vue'

const props = defineProps({
  store: propTypes.string.def('') // 店铺
})

import tab_1 from '@/assets/imgs/channelData/payTotal/tab_1.png'
import tab_2 from '@/assets/imgs/channelData/payTotal/tab_2.png'
import tab_3 from '@/assets/imgs/channelData/payTotal/tab_3.png'
import tab_4 from '@/assets/imgs/channelData/payTotal/tab_4.png'
import tab_5 from '@/assets/imgs/channelData/payTotal/tab_5.png'
import tab_6 from '@/assets/imgs/channelData/payTotal/tab_6.png'
import tab_7 from '@/assets/imgs/channelData/payTotal/tab_7.png'

import payTotal_icon_1 from '@/assets/imgs/channelData/payTotal/payTotal_icon_1.png'
import payTotal_icon_2 from '@/assets/imgs/channelData/payTotal/payTotal_icon_2.png'
import payTotal_icon_3 from '@/assets/imgs/channelData/payTotal/payTotal_icon_3.png'
import payTotal_icon_4 from '@/assets/imgs/channelData/payTotal/payTotal_icon_4.png'
import payTotal_icon_5 from '@/assets/imgs/channelData/payTotal/payTotal_icon_5.png'
import payTotal_icon_6 from '@/assets/imgs/channelData/payTotal/payTotal_icon_6.png'
import payTotal_icon_7 from '@/assets/imgs/channelData/payTotal/payTotal_icon_7.png'
import payTotal_icon_8 from '@/assets/imgs/channelData/payTotal/payTotal_icon_8.png'
import payTotal_icon_9 from '@/assets/imgs/channelData/payTotal/payTotal_icon_9.png'

const taobaoTabList = ref([
  {
    icon: tab_1,
    text: '各品类付费总和',
    color: '#333333'
  },
  {
    icon: tab_2,
    text: '女士内裤',
    color: '#08769A'
  },
  {
    icon: tab_3,
    text: '男士内裤',
    color: '#168801'
  },
  {
    icon: tab_4,
    text: '内衣',
    color: '#687B06'
  },
  {
    icon: tab_5,
    text: '袜子',
    color: '#A38516'
  },
  {
    icon: tab_6,
    text: '胸贴',
    color: '#35508D'
  },
  {
    icon: tab_7,
    text: '季节品',
    color: '#80265A'
  }
])
const defaultValueList = [
  {
    name: '关键词推广',
    icon: payTotal_icon_1,
    list: ['', '', '', '', '', '']
  },
  {
    name: '人群推广',
    icon: payTotal_icon_2,
    list: ['', '', '', '', '', '']
  },
  {
    name: '货品运营',
    icon: payTotal_icon_3,
    list: ['', '', '', '', '', '']
  },
  {
    name: '全站推广',
    icon: payTotal_icon_4,
    list: ['', '', '', '', '', '']
  },
  {
    name: '活动加速',
    icon: payTotal_icon_5,
    list: ['', '', '', '', '', '']
  },
  {
    name: '总花费',
    icon: payTotal_icon_6,
    list: ['', '', '', '', '', '']
  },
  {
    name: '销售金额',
    icon: payTotal_icon_7,
    list: ['', '', '', '', '', '']
  },
  {
    name: '退款',
    icon: payTotal_icon_8,
    list: ['', '', '', '', '', '']
  },
  {
    name: '费用占比(去退)',
    icon: payTotal_icon_9,
    list: ['', '', '', '', '', '']
  }
]
const valueList = ref(defaultValueList)

const categoryConfig = {
  女士内裤: 0,
  男士内裤: 1,
  内衣: 2,
  袜子: 3,
  胸贴: 4,
  季节品: 5
}

const dataList = ref([])
const initTotalData = (list) => {
  dataList.value = list || []
  valueList.value = defaultValueList
  list.forEach((item) => {
    const valueIndex = categoryConfig[item.category]
    if (valueIndex < valueList.value[0].list.length) {
      valueList.value[0].list[valueIndex] = item.gjcCharge
      valueList.value[1].list[valueIndex] = item.rqCharge
      valueList.value[2].list[valueIndex] = item.hpCharge
      valueList.value[3].list[valueIndex] = item.qzCharge
      valueList.value[4].list[valueIndex] = item.hdCharge
      valueList.value[5].list[valueIndex] = item.allCharge
      valueList.value[6].list[valueIndex] = item.paymentAmount
      valueList.value[7].list[valueIndex] = item.returnAmount
      valueList.value[8].list[valueIndex] = item.percentageExpenses
    }
  })
}

const showFullPercentageExpenses = (percentageExpenses) => {
  return `${(percentageExpenses * 100).toFixed(2)}%`
}

// 总花费占比
const allChargePercent = (currentValue) => {
  let maxValue = 0
  dataList.value.forEach((item: any) => {
    if (Number(item.allCharge) > maxValue) {
      maxValue = item.allCharge
    }
  })
  if (maxValue > 0 && currentValue && Number(currentValue) > 0) {
    return Number((Number(currentValue) / maxValue).toFixed(2))
  }
  return 0
}

// 费用占比(去退)占比
const percentageExpensesPercent = (currentValue) => {
  let maxValue = 0
  dataList.value.forEach((item: any) => {
    if (Number(item.percentageExpenses) > maxValue) {
      maxValue = item.percentageExpenses
    }
  })

  if (maxValue > 0 && currentValue && Number(currentValue) > 0) {
    return Number((Number(currentValue) / maxValue).toFixed(2))
  }
  return 0
}

defineExpose({ initTotalData })
</script>

<style lang="scss" scoped>
.payTotal {
  background: #f4f7fe;
  .tab {
    display: flex;
    flex-direction: row;
    min-width: calc(224 * 7px + 14 * 6px);
    justify-content: space-between;
    height: 142px;
    box-shadow: 0px 2px 6px 0px rgba(52, 52, 52, 0.03);
    &-item {
      position: relative;
      width: 224px;
      height: 128px;
      &-img {
        position: absolute;
        width: 224px;
        height: 128px;
      }
      &-img1 {
        margin-left: -15px;
        margin-top: -12px;
        width: 253px;
        height: 152px;
      }
      &-text {
        position: relative;
        font-size: 22px;
        line-height: 128px;
        font-weight: 500;
        width: 224px;
        height: 128px;
        text-align: center;
      }
    }
  }
  .tableBg {
    position: relative;
    .table {
      position: relative;
      display: flex;
      flex-direction: row;
      height: 60px;
      background: #ffffff;
      min-width: calc(224 * 7px + 14 * 6px);
      box-shadow: 0px 4px 6px 3px rgba(52, 52, 52, 0.05);
      border-radius: 2px;
      margin-bottom: 16px;
      justify-content: space-between;

      &-item {
        position: relative;
        width: 224px;
        height: 128px;
        &-first {
          width: 224px;
          height: 60px;
          display: flex;
          flex-direction: row;
          align-items: center;
          &-value {
            margin-left: auto;
            font-size: 18px;
            color: #666666;
            line-height: 20px;
            font-weight: 500;
            // 总花费
            &-total {
              font-size: 22px;
              color: #333333;
              font-weight: 700;
            }
          }

          &-img {
            margin-left: 12px;
            width: 16px;
            height: 16px;
            margin-right: 16px;
          }
        }
        &-normal {
          width: 224px;
          height: 60px;
          text-align: center;
          font-size: 20px;
          color: #333333;
          line-height: 60px;
          font-weight: 500;
          position: relative;

          &-progress {
            height: 60px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }
  }
}
</style>
