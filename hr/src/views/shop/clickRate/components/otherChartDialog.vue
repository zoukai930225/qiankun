<template>
  <div>
    <Dialog class="trendDialog" :width="1028" :border-radius="14" v-model="dialogVisible" title="">
      <div class="row">
        <div class="filterBg">
          <div
            class="filterBg-zuhe"
            :style="{ background: filterMode === 0 ? '#E1E9FF' : '' }"
            @click="clickFilterMode(0)"
          >
            <img
              v-if="filterMode === 0"
              class="icon"
              src="@/assets/imgs/good/clickRate/chart_zuhe_he.png"
            />
            <img v-else class="icon" src="@/assets/imgs/good/clickRate/chart_zuhe.png" />

            <div class="title" :style="{ color: filterMode === 0 ? '#304C80' : '#666666' }"
              >组合指标</div
            >
          </div>
          <div
            class="filterBg-custom"
            :style="{ background: filterMode === 1 ? '#E1E9FF' : '' }"
            @click="clickFilterMode(1)"
          >
            <img
              v-if="filterMode === 1"
              class="icon"
              src="@/assets/imgs/good/clickRate/chart_custom_hl.png"
            />
            <img v-else class="icon" src="@/assets/imgs/good/clickRate/chart_custom.png" />
            <div class="title" :style="{ color: filterMode === 1 ? '#304C80' : '#666666' }"
              >全店洞察(达摩盘)指标数据</div
            >
          </div>
          <div
            class="filterBg-custom"
            :style="{ background: filterMode === 2 ? '#E1E9FF' : '' }"
            @click="clickFilterMode(2)"
          >
            <img
              v-if="filterMode === 2"
              class="icon"
              src="@/assets/imgs/good/clickRate/chart_custom_hl.png"
            />
            <img v-else class="icon" src="@/assets/imgs/good/clickRate/chart_custom.png" />
            <div class="title" :style="{ color: filterMode === 2 ? '#304C80' : '#666666' }"
              >商品排行指标数据</div
            >
          </div>
        </div>
      </div>
      <div class="chartWrap">
        <div class="zuheTitle" v-if="filterMode === 0">转换率+点击率+销售额+推广花费</div>
        <div class="rePurchaseSelect" v-if="filterMode === 1 || filterMode === 2">
          <el-select
            style="width: 200px"
            v-model="formData.metricValue"
            placeholder="请选择指数"
            @change="getList"
            clearable
          >
            <el-option
              v-for="item in getDifDictOptions(filterMode)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>

        <div class="filterSearchRow">
          <div class="title">日期</div>
          <div class="dateSelect">
            <el-date-picker
              @change="dateChange"
              v-model="formData.dateValue"
              value-format="YYYY-MM-DD"
              type="daterange"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
          /></div>
          <div class="goodsId">商品ID：{{ formData.goodsId }}</div>
        </div>
        <div class="staticsInfo" v-if="filterMode === 0">
          <ClickRateZuheChart
            style="margin-top: -30px"
            ref="clickRateZuheChartRef"
            :option="barOption"
            :option1="barOption1"
            :option2="lineOption1"
            :option3="lineOption2"
          />
        </div>
        <div class="staticsInfo" v-if="filterMode === 1">
          <ClickRateCustomChart
            style="margin-top: -30px"
            ref="lineChartRef"
            :option1="lineOption"
          />
        </div>
        <div class="staticsInfo" v-if="filterMode === 2">
          <ClickRateCustomChart
            style="margin-top: -30px"
            ref="line1ChartRef"
            :option1="lineOption"
          />
        </div>
      </div>
    </Dialog>
  </div>
</template>
<script lang="ts" setup>
import ClickRateCustomChart from '@/components/SWChart/good/clickRateCustomChart.vue'
import ClickRateZuheChart from '@/components/SWChart/good/clickRateZuheChart.vue'

import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'

import * as GoodsShopApi from '@/api/shop'

const lineChartRef = ref()
const line1ChartRef = ref()
const clickRateZuheChartRef = ref()
const lineOption = ref({
  xAxisData: [],
  yAxisData: [],
  isPercent: 0,
  tipsName: '',
  lineColor: '#0064ff'
})

const barOption = ref({
  xAxisData: [],
  yAxisData: [],
  tipsName: '推广花费',
  lineColor: '#3270FF'
})

const barOption1 = ref({
  xAxisData: [],
  yAxisData: [],
  tipsName: '销售额',
  lineColor: '#76BA4A'
})

const lineOption1 = ref({
  xAxisData: [],
  yAxisData: [],
  rate: true,
  tipsName: '点击率',
  lineColor: '#FF7D08'
})

const lineOption2 = ref({
  xAxisData: [],
  yAxisData: [],
  rate: true,
  tipsName: '转换率',
  lineColor: '#7E46DE'
})

const dialogVisible = ref(false) // 弹窗的是否展示
const filterMode = ref(0) // 0 组合指标 1 自定义
const formData = ref({
  goodsId: '',
  dateValue: [],
  metricValue: ''
})

/** 打开弹窗 */
const open = async (goodsId: string) => {
  dialogVisible.value = true
  formData.value.goodsId = goodsId || ''
  formData.value.metricValue = ''
  formData.value.dateValue = []
  filterMode.value = 0
  getList()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
// 时间选择时间
const dateChange = () => {
  getList()
}

const getDifDictOptions = (filterMode: number) => {
  switch (filterMode) {
    case 1:
      return getIntDictOptions(DICT_TYPE.METRIC_VALUE, true)
      break

    case 2:
      return getIntDictOptions(DICT_TYPE.PRODUCT_RANK_VALUE, true)
      break
  }
}

const getList = async () => {
  const param = {
    indicatorType:
      filterMode.value === 0 ? 'combo' : filterMode.value === 1 ? 'wideInsights' : 'productRank',
    goodsId: formData.value.goodsId,
    beginDate:
      formData.value.dateValue && formData.value.dateValue.length > 0
        ? formData.value.dateValue[0]
        : '',
    endDate:
      formData.value.dateValue && formData.value.dateValue.length > 1
        ? formData.value.dateValue[1]
        : '',
    metricValue: formData.value.metricValue || ''
  }
  const data = await GoodsShopApi.goodsClickRateGetMoreByGoodsId(param).catch(() => {})
  if (data) {
    nextTick(() => {
      if (filterMode.value === 0) {
        clickRateZuheChartRef.value.setChartOptions()
      } else if (filterMode.value === 1) {
        lineChartRef.value.setChartOptions()
      } else if (filterMode.value === 2) {
        line1ChartRef.value.setChartOptions()
      }
      handleReqData(data)
    })
  }
}

// 点击筛选模块
const clickFilterMode = (mode: number) => {
  filterMode.value = mode
  if (filterMode.value === 1) {
    formData.value.metricValue = 'free_search_click_rate'
  } else if (filterMode.value === 2) {
    formData.value.metricValue = 'free_search_payment_conversion_rate'
  }
  getList()
}

const handleReqData = (data: any[]) => {
  if (filterMode.value === 0) {
    // 组合
    // 花费
    const allDateArr = []
    const yAxisData1 = []
    data &&
      data.charge &&
      data.charge.forEach((item: any) => {
        if (item.date) {
          const dateArr = item.date.split('-')
          if (dateArr.length > 2) {
            const dateStr = `${dateArr[1]}/${dateArr[2]}`
            if (!allDateArr.includes(dateStr)) {
              allDateArr.push(dateStr)
            }
            yAxisData1.push(Number(item.value) || 0)
          }
        }
      })
    barOption.value.yAxisData = yAxisData1

    // 销售额
    const yAxisData2 = []
    data &&
      data.paymentAmount &&
      data.paymentAmount.forEach((item: any) => {
        if (item.date) {
          const dateArr = item.date.split('-')
          if (dateArr.length > 2) {
            const dateStr = `${dateArr[1]}/${dateArr[2]}`
            if (!allDateArr.includes(dateStr)) {
              allDateArr.push(dateStr)
            }
            yAxisData2.push(Number(item.value) || 0)
          }
        }
      })
    barOption1.value.yAxisData = yAxisData2

    // 点击率
    const yAxisData3 = []
    data &&
      data.freeSearchClickRate &&
      data.freeSearchClickRate.forEach((item: any) => {
        if (item.date) {
          const dateArr = item.date.split('-')
          if (dateArr.length > 2) {
            const dateStr = `${dateArr[1]}/${dateArr[2]}`
            if (!allDateArr.includes(dateStr)) {
              allDateArr.push(dateStr)
            }
            yAxisData3.push(Number(item.value) || 0)
          }
        }
      })
    lineOption1.value.yAxisData = yAxisData3

    // 转换率
    const yAxisData4 = []
    data &&
      data.payChangeRate &&
      data.payChangeRate.forEach((item: any) => {
        if (item.date) {
          const dateArr = item.date.split('-')
          if (dateArr.length > 2) {
            const dateStr = `${dateArr[1]}/${dateArr[2]}`
            if (!allDateArr.includes(dateStr)) {
              allDateArr.push(dateStr)
            }
            yAxisData4.push(Number(item.value) || 0)
          }
        }
      })
    lineOption2.value.yAxisData = yAxisData4

    barOption.value.xAxisData = allDateArr
    barOption1.value.xAxisData = allDateArr
    lineOption1.value.xAxisData = allDateArr
    lineOption2.value.xAxisData = allDateArr

    if (barOption.value.yAxisData.length === 0) {
      allDateArr.forEach((item) => {
        barOption.value.yAxisData.push(0)
      })
    }
    console.log('大姐夫索拉卡', barOption.value, allDateArr)

    nextTick(() => {
      clickRateZuheChartRef.value.setChartOptions()
    })
  } else if (filterMode.value === 1) {
    // 全店洞察(达摩盘)指标数据
    const xAxisData1 = []
    const yAxisData1 = []
    const isPercent = (data && data.isPercent) || 0
    data &&
      data.customize &&
      data.customize.forEach((item: any) => {
        if (item.date) {
          const dateArr = item.date.split('-')
          if (dateArr.length > 2) {
            xAxisData1.push(`${dateArr[1]}/${dateArr[2]}`)
            if (item.value) {
              yAxisData1.push(Number(item.value))
            } else {
              yAxisData1.push(0)
            }
          }
        }
      })
    lineOption.value.isPercent = isPercent
    lineOption.value.tipsName = getDictLabel(DICT_TYPE.METRIC_VALUE, formData.value.metricValue)
    lineOption.value.xAxisData = xAxisData1
    lineOption.value.yAxisData = yAxisData1

    nextTick(() => {
      lineChartRef.value.setChartOptions()
    })
  } else if (filterMode.value === 2) {
    // 商品排行指标数据
    const xAxisData1 = []
    const yAxisData1 = []
    const isPercent = (data && data.isPercent) || 0
    data &&
      data.customize &&
      data.customize.forEach((item: any) => {
        if (item.date) {
          const dateArr = item.date.split('-')
          if (dateArr.length > 2) {
            xAxisData1.push(`${dateArr[1]}/${dateArr[2]}`)
            if (item.value) {
              yAxisData1.push(Number(item.value))
            } else {
              yAxisData1.push(0)
            }
          }
        }
      })
    lineOption.value.isPercent = isPercent
    lineOption.value.tipsName = getDictLabel(
      DICT_TYPE.PRODUCT_RANK_VALUE,
      formData.value.metricValue
    )
    lineOption.value.xAxisData = xAxisData1
    lineOption.value.yAxisData = yAxisData1

    nextTick(() => {
      line1ChartRef.value.setChartOptions()
    })
  }
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
</script>

<style lang="scss" scoped>
:deep(.el-dialog) {
  padding: 0px;
  /* background: linear-gradient(226deg, #f2f3ff 0%, #ffffff 39%, #ffffff 87%, #f0f8ff 100%); */
  box-shadow: 10px 10px 24px 0px rgba(0, 0, 0, 0.07);
  background-image: url(@/assets/imgs/good/clickRate/click_bg.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
}

:deep(.el-dialog__header) {
  border-bottom: none;
  font-weight: 500;
  font-size: 16px;
  color: #333333;
  line-height: 22px;
}
:deep(.el-date-editor.el-input__wrapper) {
  width: 200px;
}
.row {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: -30px;
  margin-bottom: 30px;

  .filterBg {
    // width: 210px;
    // height: 32px;
    background: #f2f7ff;
    display: flex;
    flex-direction: row;
    border-radius: 20px;
    box-sizing: border-box;
    padding: 4px;
    box-sizing: border-box;

    &-zuhe {
      margin-left: 2px;
      margin-top: 2px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      width: 102px;
      height: 28px;
      border-radius: 20px;
      align-items: center;
      cursor: pointer;

      .icon {
        width: 10px;
        height: 10px;
      }
      .title {
        padding-left: 8px;
        font-size: 14px;
        color: #0064ff;
        line-height: 14px;
      }
    }
    &-custom {
      // margin-left: 2px;
      // margin-top: 2px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      cursor: pointer;
      // width: 102px;
      // height: 28px;
      padding: 4px 8px;
      border-radius: 20px;
      align-items: center;
      .icon {
        width: 10px;
        height: 10px;
      }
      .title {
        padding-left: 8px;
        font-size: 14px;
        color: #666666;
        line-height: 14px;
      }
    }
  }
}

.chartWrap {
  background-image: url(@/assets/imgs/good/clickRate/click_con.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  padding: 12px;
}
.zuheTitle {
  font-weight: 500;
  font-size: 16px;
  color: #333333;
  text-align: center;
  height: 32px;
}
.rePurchaseSelect {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.filterSearchRow {
  margin-top: 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  .title {
    font-size: 14px;
    color: #666666;
    line-height: 20px;
    padding-right: 12px;
  }
  .dateSelect {
    width: 200px;
  }
  .goodsId {
    margin-left: auto;
    padding-right: 20px;
    font-size: 14px;
    color: #333333;
    line-height: 20px;
  }
}
.staticsInfo {
  margin-top: 35px;
}
</style>
