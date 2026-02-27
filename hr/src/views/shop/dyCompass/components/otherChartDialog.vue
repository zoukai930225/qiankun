<template>
  <div>
    <Dialog class="trendDialog" :width="1028" :border-radius="14" v-model="dialogVisible" title="">
      <div class="row">
        <div class="filterBg">
          <!-- <div
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
          </div> -->
          <div class="filterBg-custom" :style="{ background: filterMode === 1 ? '#E1E9FF' : '' }">
            <img
              v-if="filterMode === 1"
              class="icon"
              src="@/assets/imgs/good/clickRate/chart_custom_hl.png"
            />
            <img v-else class="icon" src="@/assets/imgs/good/clickRate/chart_custom.png" />
            <div class="title" :style="{ color: filterMode === 1 ? '#304C80' : '#666666' }"
              >抖音电商罗盘</div
            >
          </div>
          <!-- <div
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
          </div> -->
        </div>
      </div>
      <div class="chartWrap">
        <div class="zuheTitle" v-if="filterMode === 0">转换率+点击率+销售额+推广花费</div>
        <div class="rePurchaseSelect" v-if="filterMode === 1 || filterMode === 2">
          <el-select
            style="width: 200px; margin-left: auto"
            v-model="formData.fieldCode"
            placeholder="请选择指数"
            @change="getList"
            clearable
          >
            <el-option
              v-for="item in filedOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
          <el-button
            style="margin-left: auto; margin-right: 15px"
            type="primary"
            :loading="exporting"
            @click="exportClick"
          >
            导出
          </el-button>
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
            />
          </div>
          <div class="goodsId">商品ID：{{ formData.goodsId }}</div>
        </div>
        <div class="staticsInfo" v-if="filterMode === 1">
          <DyCompassClickChart style="margin-top: -30px" ref="lineChartRef" :option1="lineOption" />
        </div>
      </div>
    </Dialog>
  </div>
</template>
<script lang="ts" setup>
// import DyCompassClickChart from '@/components/SWChart/good/dyCompassClickChart.vue'
import DyCompassClickChart from '@/components/SWChart/good/clickRateCustomChart.vue'
import download from '@/utils/download'
import * as DateUtil from '@/utils/formatTime'

import * as GoodDyCompassApi from '@/api/shop/dyCompass'
const message = useMessage() // 消息弹窗

const lineChartRef = ref()
const lineOption = ref({
  xAxisData: [],
  yAxisData: [],
  isPercent: 0,
  tipsName: '',
  lineColor: '#0064ff'
})

const dialogVisible = ref(false) // 弹窗的是否展示
const filterMode = ref(1) // 0 组合指标 1 自定义
const formData = ref({
  goodsId: '',
  dateValue: [],
  fieldCode: ''
})

/** 打开弹窗 */
const open = async (goodsId: string, statisticalDate: any) => {
  dialogVisible.value = true
  formData.value.goodsId = goodsId || ''
  formData.value.dateValue = statisticalDate || []
  filterMode.value = 1
  formData.value.fieldCode = ''
  getFieldList()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
// 时间选择时间
const dateChange = () => {
  getList()
}

const filedOptions = ref<any[]>([])
// 获取指标字段信息
const getFieldList = async () => {
  const data = await GoodDyCompassApi.dyCommerceCompassFields().catch(() => [])
  filedOptions.value = data || []
  if (filedOptions.value.length > 0) {
    formData.value.fieldCode = filedOptions.value[0].code
    getList()
  }
}

const getList = async () => {
  const param = {
    goodsId: formData.value.goodsId,
    startTime:
      formData.value.dateValue && formData.value.dateValue.length > 0
        ? formData.value.dateValue[0]
        : '',
    endTime:
      formData.value.dateValue && formData.value.dateValue.length > 1
        ? formData.value.dateValue[1]
        : '',
    fieldCode: formData.value.fieldCode || ''
  }
  const data = await GoodDyCompassApi.dyCommerceCompassViewOther(param).catch(() => {})
  if (data) {
    nextTick(() => {
      if (filterMode.value === 1) {
        lineChartRef.value.setChartOptions()
      }
      handleReqData(data)
    })
  }
}

const getFiledName = (code: string) => {
  const filed = filedOptions.value && filedOptions.value.find((item) => item.code === code)
  return (filed && filed.name) || ''
}

const handleReqData = (data: any[]) => {
  if (filterMode.value === 1) {
    // 抖音电商罗盘指标数据
    const xAxisData1 = []
    const yAxisData1 = []
    let isPercent = 0
    data &&
      data.forEach((item: any) => {
        if (item.date) {
          const dateArr = item.date.split('-')
          if (dateArr.length > 2) {
            xAxisData1.push(`${dateArr[1]}/${dateArr[2]}`)
            if (item.value) {
              if (item.isPercent) {
                isPercent = 1
              }
              yAxisData1.push(Number(item.value))
            } else {
              yAxisData1.push(0)
            }
          }
        }
      })
    lineOption.value.isPercent = isPercent
    lineOption.value.tipsName = getFiledName(formData.value.fieldCode)
    lineOption.value.xAxisData = xAxisData1
    lineOption.value.yAxisData = yAxisData1

    nextTick(() => {
      lineChartRef.value.setChartOptions()
    })
  }
}

const exporting = ref(false) // 导出状态

// 导出按钮
const exportClick = async () => {
  try {
    exporting.value = true
    const param = {
      type: 1,
      goodsId: formData.value.goodsId,
      startDate:
        formData.value.dateValue && formData.value.dateValue.length > 0
          ? formData.value.dateValue[0]
          : undefined,
      endDate:
        formData.value.dateValue && formData.value.dateValue.length > 1
          ? formData.value.dateValue[1]
          : undefined
    }
    const data = await GoodDyCompassApi.dyCommerceCompassLineExport(param)
    if (data) {
      let excelFileName = ''
      if (param.startDate) {
        excelFileName = `${formData.value.goodsId}_${param.startDate}_${param.endDate}指标数据统计.xls`
      } else {
        let lastDay = DateUtil.getLastDay()[0] || ''
        lastDay = lastDay && lastDay.split(' ')[0]
        let getLast30Days = DateUtil.getLast30Days()[0] || ''
        getLast30Days = getLast30Days && getLast30Days.split(' ')[0]

        excelFileName = `${formData.value.goodsId}_${getLast30Days}_${lastDay}指标数据统计.xls`
      }
      download.excel(data, excelFileName)
      message.success('导出成功')
    } else {
      message.error('导出失败')
    }
  } catch (error) {
    message.error('导出失败')
  } finally {
    exporting.value = false
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
    // background: #f2f7ff;
    background: #e1e9ff;

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
  align-items: center;
  //justify-content: center;
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
