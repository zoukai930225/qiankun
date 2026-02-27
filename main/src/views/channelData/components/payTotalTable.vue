<template>
  <ElScrollbar class="payTotal">
    <div class="tab">
      <div
        class="tab-item"
        v-for="(value, index) in taobaoTabList"
        :key="index"
        :class="{ 'tab-item1': index === 0 }"
      >
        <!-- <img class="tab-item-img" :class="{ 'tab-item-img1': index === 0 }" :src="value.icon" /> -->
        <div
          class="tab-item-text"
          :class="{ 'tab-item-text1': index === 0 }"
          :style="{ color: value.color }"
        >
          {{ value.text }}
        </div>
        <div v-if="index > 0" class="tab-item-bottom">
          <div class="tab-item-bottom-left">花费 </div>
          <div class="tab-item-bottom-right">支付金额 </div>
        </div>
      </div>
    </div>
    <div class="tableBg">
      <div
        class="table"
        v-for="(value, index) in valueList"
        :key="index"
        :style="{ background: index % 2 === 0 ? '' : '' }"
      >
        <div class="table-item table-item1">
          <div class="table-item-first">
            <div
              class="table-item-first-value"
              :class="value.name === '总花费' ? 'table-item-first-value-total' : ''"
            >
              {{ value.name }}</div
            >
            <!-- <img class="table-item-first-img" :src="value.icon" /> -->
          </div>
        </div>
        <div class="table-item" v-for="(value1, index1) in value.list" :key="index1">
          <div v-if="index <= 6" class="table-item-left">
            <div :style="{ color: index === 6 ? '#0064FF' : '' }">{{
              getNormalValue(value1, 0)
            }}</div>
          </div>
          <div
            v-if="index <= 6"
            class="table-item-right"
            :class="{ 'table-item-rightNoTopBorder': index <= 6 && index > 0 }"
          >
            <div v-if="index === 3" :style="{ color: index === 6 ? '#0064FF' : '' }">{{
              getNormalValue(value1, 1)
            }}</div>
            <div v-else :style="{ color: index === 6 ? '#0064FF' : '' }"></div>
          </div>

          <div v-if="index > 6" class="table-item-oneColumn">
            <!-- 总计 -->
            <!-- <div v-if="index === 6 && value1" class="table-item-oneColumn-progress">
              <SWProgressLabel
                :value="value1"
                :progress="allChargePercent(value1)"
                :fontSize="18"
                textColor="#0064FF"
                backgroundColor="#277BFF"
              />
            </div> -->
            <div v-if="index === 7" :style="{ color: '#333333' }">{{ value1 }}</div>
            <div v-if="index === 8" class="table-item-oneColumn-progress">
              <!-- 费用占比(去退)-->
              <SWProgressLabel
                :showProgress="true"
                :value="showFullPercentageExpenses(value1)"
                :progress="percentageExpensesPercent(value1)"
                :fontSize="18"
                :textColor="Number(value1) > 0 ? '#EB3737' : '#4fb431'"
                backgroundColor=""
              />
            </div>
          </div>
        </div> </div
    ></div>
  </ElScrollbar>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

import SWProgressLabel from './progressLabel.vue'

defineProps({
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
    name: '短视频推广',
    icon: payTotal_icon_5,
    list: ['', '', '', '', '', '']
  },
  {
    name: '总计',
    icon: payTotal_icon_6,
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
  // 清空上次数据
  defaultValueList.forEach((item) => {
    item.list = ['', '', '', '', '', '']
  })
  valueList.value = defaultValueList
  list.forEach((item) => {
    const valueIndex = categoryConfig[item.category]
    if (valueIndex < valueList.value[0].list.length) {
      valueList.value[0].list[valueIndex] = item.gjcPromotion
        ? `${item.gjcPromotion.charge || ''}-${item.gjcPromotion.payment || ''}`
        : ''
      valueList.value[1].list[valueIndex] = item.rqPromotion
        ? `${item.rqPromotion.charge || ''}-${item.rqPromotion.payment || ''}`
        : ''
      valueList.value[2].list[valueIndex] = item.hpPromotion
        ? `${item.hpPromotion.charge || ''}-${item.hpPromotion.payment || ''}`
        : ''
      valueList.value[3].list[valueIndex] = item.qzPromotion
        ? `${item.qzPromotion.charge || ''}-${item.allPayment || ''}`
        : ''
      valueList.value[4].list[valueIndex] = item.hdPromotion
        ? `${item.hdPromotion.charge || ''}-${item.hdPromotion.payment || ''}`
        : ''
      valueList.value[5].list[valueIndex] = item.shortVideoPromotion
        ? `${item.shortVideoPromotion.charge || ''}-${item.shortVideoPromotion.payment || ''}`
        : ''
      valueList.value[6].list[valueIndex] = item.total
        ? `${item.total.charge || ''}-${item.total.payment || ''}`
        : ''
      valueList.value[7].list[valueIndex] = item.returnAmount
      valueList.value[8].list[valueIndex] = item.percentageExpenses
    }
  })
}

const getNormalValue = (value, index) => {
  const valueArr = value.split('-')
  if (index < valueArr.length) {
    return valueArr[index]
  } else {
    return ''
  }
}

const showFullPercentageExpenses = (percentageExpenses) => {
  if (percentageExpenses) {
    return `${(percentageExpenses * 100).toFixed(2)}%`
  }
  return ''
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
    return (Number(currentValue) / maxValue).toFixed(2)
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
    width: 100%;
    // justify-content: space-between;
    height: 99px;
    box-shadow: 0px 2px 6px 0px rgba(52, 52, 52, 0.03);
    &-item {
      position: relative;
      width: 15%;
      height: 99px;
      // border: 0.5px solid #e5e1e1;
      border-top: 1px solid #e5e1e1;
      border-right: 1px solid #e5e1e1;
      &:nth-child(2) {
        background: linear-gradient(
          180deg,
          rgba(216, 243, 252, 0.33) 0%,
          rgba(247, 253, 254, 0.33) 100%
        );
      }
      &:nth-child(3) {
        background: linear-gradient(
          180deg,
          rgba(218, 245, 213, 0.33) 0%,
          rgba(255, 255, 255, 0.33) 100%
        );
      }
      &:nth-child(4) {
        background: linear-gradient(
          180deg,
          rgba(250, 241, 208, 0.33) 0%,
          rgba(255, 255, 255, 0.33) 100%
        );
      }
      &:nth-child(5) {
        background: linear-gradient(
          180deg,
          rgba(217, 217, 217, 0.33) 0%,
          rgba(255, 255, 255, 0.33) 100%
        );
      }
      &:nth-child(6) {
        background: linear-gradient(
          180deg,
          rgba(185, 206, 253, 0.33) 0%,
          rgba(255, 255, 255, 0.33) 100%
        );
      }
      &:nth-child(7) {
        background: linear-gradient(
          180deg,
          rgba(254, 221, 240, 0.33) 0%,
          rgba(255, 255, 255, 0.33) 100%
        );
        border-right: none;
      }
      &-text {
        position: relative;
        line-height: 128px;
        font-weight: 600;
        // width: 15%;
        padding-top: 20px;

        font-size: 18px;
        color: #333333;
        line-height: 20px;
        text-align: center;
      }
      &-text1 {
        padding-top: 0px;
        // width: 10%;
        line-height: 99px;
      }

      &-bottom {
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 20px;
        font-size: 18px;
        color: #666666;
        line-height: 20px;
        font-weight: 600;
        div {
          width: 50%;
          text-align: center;
        }
      }
    }
    &-item1 {
      position: relative;
      width: 10%;
      height: 99px;
      border-left: 1px solid #ebeef5;
      background: #fcfafb;
    }
  }
  .tableBg {
    position: relative;
    .table {
      position: relative;
      display: flex;
      flex-direction: row;
      height: 85px;
      background: #ffffff;
      width: 100%;

      // box-shadow: 0px 4px 6px 3px rgba(52, 52, 52, 0.05);
      border-radius: 2px;
      // margin-bottom: 16px;
      // justify-content: space-between;

      &-itemNoTopBorder {
        border-top: none !important;
      }

      &-item {
        position: relative;
        display: flex;
        flex-direction: row;
        width: 15%;
        height: 85px;
        border-left: 1px solid #ebeef5;
        // border-top: 1px solid #ebeef5;

        &-first {
          width: 100%;
          height: 85px;
          display: flex;
          flex-direction: row;
          align-items: center;
          border-top: 1px solid #ebeef5;
          &-value {
            // margin-left: auto;
            width: calc(100%);
            text-align: center;
            font-size: 18px;
            color: #666666;
            line-height: 85px;
            font-weight: 600;

            // &-total {
            //   font-size: 22px;
            //   color: #333333;
            //   font-weight: 700;
            // }
          }
          &-img {
            margin-left: 12px;
            width: 16px;
            height: 16px;
            margin-right: 16px;
          }
        }
        &-normal {
          width: 15%;
          height: 85px;
          text-align: center;
          font-size: 20px;
          color: #333333;
          line-height: 60px;
          font-weight: 500;
          position: relative;
          &-progress {
            height: 85px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
        }
        &-left {
          font-size: 18px;
          color: #333333;
          line-height: 20px;
          font-weight: 600;
          width: 50%;
          height: 85px;
          line-height: 85px;
          text-align: center;
          border-right: 1px solid #ebeef5;
          border-top: 1px solid #ebeef5;
        }

        &-right {
          font-size: 18px;
          color: #333333;
          line-height: 20px;
          font-weight: 600;
          width: 50%;
          height: 85px;
          line-height: 85px;
          text-align: center;
          border-top: 1px solid #ebeef5;
        }
        &-rightNoTopBorder {
          border-top: none !important;
          // border-bottom: none !important;
        }
        &-oneColumn {
          width: 100%;
          height: 85px;
          text-align: center;
          font-size: 18px;
          font-weight: 600;
          color: #333333;
          line-height: 85px;
          text-align: center;
          border-top: 1px solid #ebeef5;
          &-progress {
            height: 85px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
        }
        &-twoColumn {
          width: 100%;
          height: 85px;
          text-align: center;
          font-size: 18px;
          font-weight: 600;
          color: #333333;
          line-height: 85px;
          text-align: center;

          &-progress {
          }
        }
      }
      &-item1 {
        height: 85px;
        width: 10%;
      }

      &:last-child {
        border-bottom: 1px solid #ebeef5;
      }
    }
  }
}
</style>
