<template>
  <ElScrollbar class="payTotal">
    <div class="tab">
      <div
        class="tab-item"
        v-for="(value, index) in pddTabList"
        :key="index"
        :class="{ 'tab-item1': index === 0 }"
      >
        <div
          class="tab-item-text"
          :class="{ 'tab-item-text1': index === 0 }"
          :style="{ color: value.color }"
        >
          {{ value.text }}
        </div>
        <div v-if="index > 0" class="tab-item-bottom">
          <div class="tab-item-bottom-left">花费 </div>
          <div class="tab-item-bottom-right">销售金额 </div>
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
              {{ value.name }}
            </div>
          </div>
        </div>
        <div class="table-item" v-for="(value1, index1) in value.list" :key="index1">
          <div v-if="index < 1" class="table-item-left">
            <div>{{ getNormalValue(value1, 0) }}</div>
          </div>
          <div v-if="index < 1" class="table-item-right">
            <div>{{ getNormalValue(value1, 1) }}</div>
          </div>
          <div v-if="index >= 1" class="table-item-oneColumn">
            <div v-if="index === 1" :style="{ color: '#333' }">{{ value1 }}</div>
            <div v-if="index === 2" class="table-item-oneColumn-progress">
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
        </div>
      </div>
    </div>
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

import payTotal_icon_1 from '@/assets/imgs/channelData/payTotal/payTotal_icon_1.png'
import payTotal_icon_8 from '@/assets/imgs/channelData/payTotal/payTotal_icon_8.png'
import payTotal_icon_9 from '@/assets/imgs/channelData/payTotal/payTotal_icon_9.png'

const pddTabList = ref([
  {
    icon: tab_1,
    text: '各店铺付费总和',
    color: '#333333'
  },
  {
    icon: tab_2,
    text: 'Secretworld拼多多官方店',
    color: '#08769A'
  },
  {
    icon: tab_3,
    text: 'Secretworld拼多多内裤旗舰店',
    color: '#168801'
  },
  {
    icon: tab_4,
    text: 'SecretWorld拼多多旗舰店',
    color: '#687B06'
  }
])

const defaultValueList = [
  {
    name: '推广花费',
    icon: payTotal_icon_1,
    list: ['', '', '']
  },
  {
    name: '退款',
    icon: payTotal_icon_8,
    list: ['', '', '']
  },
  {
    name: '费用占比(去退)',
    icon: payTotal_icon_9,
    list: ['', '', '']
  }
]
const valueList = ref(defaultValueList)

const categoryConfig = {
  Secretworld拼多多官方店: 0,
  'SW-拼多多-Secret World内裤旗舰店': 1,
  Secretworld拼多多旗舰店: 2
}

const dataList = ref([])
const initTotalData = (list) => {
  dataList.value = list || []
  // 清空上次数据
  defaultValueList.forEach((item) => {
    item.list = ['', '', '']
  })
  valueList.value = defaultValueList
  list.forEach((item) => {
    const valueIndex = categoryConfig[item.storeName]
    if (valueIndex < valueList.value[0].list.length) {
      valueList.value[0].list[valueIndex] = item.tghf
        ? `${item.tghf.tghf || ''}-${item.tghf.xse || ''}`
        : ''
      valueList.value[1].list[valueIndex] = item.tkje || ''
      valueList.value[2].list[valueIndex] = item.percentageExpenses || ''
    }
  })
}

const getNormalValue = (value, index) => {
  const valueArr = value.split('-')
  if (index < valueArr.length) {
    return valueArr[index]
  }
}

const showFullPercentageExpenses = (percentageExpenses) => {
  if (percentageExpenses) {
    return `${(percentageExpenses * 100).toFixed(2)}%`
  }
  return ''
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
      width: 30%;
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

      &-item {
        position: relative;
        display: flex;
        flex-direction: row;
        width: 30%;
        height: 85px;
        border-left: 1px solid #ebeef5;
        border-top: 1px solid #ebeef5;

        &-first {
          width: 100%;
          height: 85px;
          display: flex;
          flex-direction: row;
          align-items: center;
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
          width: 30%;
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

          &-progress {
            height: 85px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
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
