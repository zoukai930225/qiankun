<template>
  <ex-screen>
    <query-scheme :scheme="scheme" v-model="searchData" name="Negativereviewstatistics" :show-expand="false" />
    <!-- <scheme-table :btn-list="btns" :handle-column="handleColumn" :screen="screen" name="Negativereviewstatistics"
      :column="column" :table-data="dataList" :list-name="'中差评数量情况列表'"/>
    <negativeReviewStatistics-details ref="detailsRef" /> -->
    <div class="flex justify-between align-center pb16px">
      <div style="line-height: 32px;color: #3d3d3d;font-weight: bold;">中差评数量情况列表</div>
      <el-button type="primary" @click="exportData">导出</el-button>
    </div>
    <el-table
      class="SWCommonTable"
      :header-cell-style="{
        backgroundColor: '#fff',
        color:'#666',
        height: '45px'
      }"
      :data="dataList"

      :show-overflow-tooltip="false"
      v-loading="loading"
      v-horizontal-scroll="'always'"
      :row-class-name="tableRowClassName"
      :row-style="{
        height: '52px'
      }"
      border
    >
      <el-table-column prop="goodsCode" label="商品编码" align="left" header-align="left" fixed="left" width="120px" show-overflow-tooltip>
        <template #default="{ row }">
          <span v-if="row.goodsCode !== '合计'" class="linkText" @click="handleClick(row)">{{ row.goodsCode }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="leftDateRangeDisplay" align="center" min-width="220px">
        <el-table-column prop="count" label="计数(中差评)" align="left" header-align="left" min-width="120px">
          <template #default="{ row }">
            <div :class="row.goodsCode === '合计' ? 'summary-count' : ''">
              {{ row.count || 0 }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="yesterdayPercentage"
          label="占比"
          align="left"
          header-align="left"
          class-name="tight-padding"
          min-width="100px"
        >
          <template #default="{ row }">
            <div :class="['percentage',Number(row.yesterdayPercentage) < 0 ? 'red' : '']">
              <div
                v-if="row.goodsCode !== '合计'"
                class="percentage-progress-label"
                :style="{ width: progressLabelWidth(formatPercent(row.yesterdayPercentage,false,true)) }"
              ></div>
              <div class="percentage-text">
                {{ formatPercent(row.yesterdayPercentage,true,true) }}
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column :label="rightDateRangeDisplay" align="center" min-width="220px">
        <el-table-column prop="beforeCount" label="计数(中差评)" align="left" header-align="left" min-width="120px">
          <template #default="{ row }">
            <div :class="row.goodsCode === '合计' ? 'summary-count' : ''">
              {{ row.beforeCount || 0 }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="beforePercentage"
          label="占比"
          align="left"
          header-align="left"
          class-name="tight-padding"
          min-width="100px"
        >
          <template #default="{ row }">
            <div :class="['percentage',Number(row.beforePercentage) < 0 ? 'red' : '']">
              <div
                v-if="row.goodsCode !== '合计'"
                class="percentage-progress-label"
                :style="{ width: progressLabelWidth(formatPercent(row.beforePercentage,false,true)) }"
              ></div>
              <div class="percentage-text">
                {{ formatPercent(row.beforePercentage,true,true) }}
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        prop="chainRatio"
        label="环比"
        align="left"
        header-align="left"
        class-name="tight-padding"
        min-width="100px"
      >
        <template #default="{ row }">
          <div :class="['percentage',Number(row.chainRatio) < 0 ? 'red' : '']">
            <div
              v-if="row.goodsCode !== '合计'"
              class="percentage-progress-label"
              :style="{ width: progressLabelWidth(formatPercent(row.chainRatio)) }"
            >
            </div>
            <div class="percentage-text"> {{ formatPercent(row.chainRatio,true) }} </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
          prop="bnTotalSum"
          label="班牛客诉量"
          align="left"
          header-align="left"
          min-width="100px"
        >
          <template #default="{ row }">
            <div :class="row.goodsCode === '合计' ? 'summary-count' : ''">
              {{ row.goodsCode === '合计'
                  ? row.bnTotalSum || 0
                  : row.customerComplaintCountOfBN || 0
              }}
            </div>
          </template>
      </el-table-column>
      <el-table-column
          prop="paymentQuantity"
          label="付款量"
          align="left"
          header-align="left"
        >
          <template #default="{ row }">
            <div :class="row.goodsCode === '合计' ? 'summary-count' : ''">
              {{ row.paymentQuantity || 0}}
            </div>
          </template>
      </el-table-column>
      <el-table-column prop="actualSalesQuantity" label="实际销售量" align="left" header-align="left" min-width="100px">
        <template #default="{ row }">
          <div :class="row.goodsCode === '合计' ? 'summary-count' : ''">
            {{ row.actualSalesQuantity || 0  }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="goodCount" label="好评数" align="left" header-align="left">
        <template #default="{ row }">
          <div :class="row.goodsCode === '合计' ? 'summary-count' : ''">
            {{ row.goodCount || 0 }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="validCount" label="有效评价数" align="left" header-align="left" min-width="100px">
        <template #default="{ row }">
          <div :class="row.goodsCode === '合计' ? 'summary-count' : ''">
            {{ row.validCount || 0 }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="goodsBadReviewRate"
        label="货品中差评率"
        align="left"
        class-name="tight-padding"
        header-align="left"
        min-width="130px"
      >
        <template #header>
          <div class="flex items-center">
            <span>货品中差评率</span>
            <el-tooltip
              effect="dark"
              placement="top"
              content="货品中差评率=中差评数量/实际销售量*100%"
            >
              <el-icon class="header-help"><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <template #default="{ row }">
          <div :class="['percentage',Number(row.goodsBadReviewRate) < 0 ? 'red' : '']">
            <div
              v-if="row.goodsCode !== '合计'"
              class="percentage-progress-label"
              :style="{
                width: progressLabelWidth(formatPercent(row.goodsBadReviewRate,false,true))
              }"
            ></div>
            <div class="percentage-text">
              {{row.goodsCode !== '合计' ? formatPercent(row.goodsBadReviewRate,true,true) : formatPercent(row.goodsBadReviewRateRes,true,true)}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="goodsComplaintRate"
        label="货品客诉率"
        align="left"
        class-name="tight-padding"
        header-align="left"
        min-width="120px"
      >
        <template #header>
          <div class="flex items-center">
            <span>货品客诉率</span>
            <el-tooltip
              effect="dark"
              placement="top"
              content="货品客诉率=(中差评数量+客诉数量)订单去重/实际销售量*100%"
            >
              <el-icon class="header-help"><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <template #default="{ row }">
          <div :class="['percentage',Number(row.goodsComplaintRate) < 0 ? 'red' : '']">
            <div
              v-if="row.goodsCode !== '合计'"
              class="percentage-progress-label"
              :style="{
                width: progressLabelWidth(formatPercent(row.goodsComplaintRate,false,true))
              }"
            ></div>
            <div class="percentage-text">
              {{row.goodsCode !== '合计' ? formatPercent(row.goodsComplaintRate,true,true) : formatPercent(row.goodsComplaintRateRes,true,true)}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="goodRate"
        label="好评率"
        align="left"
        class-name="tight-padding"
        header-align="left"
        min-width="100px"
      >
        <template #header>
          <div class="flex items-center">
            <span>好评率</span>
            <el-tooltip
              effect="dark"
              placement="top"
              content="好评率=实际销售量-计数（中差评）/实际销售量 *100%(A B开头的编码/3 C开头的/5 )"
            >
              <el-icon class="header-help"><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <template #default="{ row }">
          <div :class="['percentage',Number(row.goodRate) < 0 ? 'red' : '']">
            <div
              v-if="row.goodsCode !== '合计'"
              class="percentage-progress-label"
              :style="{
                width: progressLabelWidth(formatPercent(row.goodRate,false,true))
              }"
            ></div>
            <div class="percentage-text">
              {{formatPercent(row.goodRate,true,true)}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="goodPercentage"
        label="好评占比"
        align="left"
        class-name="tight-padding"
        header-align="left"
        min-width="100px"
      >
        <template #header>
          <div class="flex items-center">
            <span>好评占比</span>
            <el-tooltip
              effect="dark"
              placement="top"
              content="好评占比=好评数/有效评价数*100%"
            >
              <el-icon class="header-help"><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <template #default="{ row }">
          <div :class="['percentage',Number(row.goodPercentage) < 0 ? 'red' : '']">
            <div
              v-if="row.goodsCode !== '合计'"
              class="percentage-progress-label"
              :style="{
                width: progressLabelWidth(formatPercent(row.goodPercentage,false,true))
              }"
            ></div>
            <div class="percentage-text">
              {{formatPercent(row.goodPercentage,true,true)}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="goodsReturnRate"
        label="货品退货率"
        align="left"
        class-name="tight-padding"
        header-align="left"
        min-width="120px"
      >
        <template #header>
          <div class="flex items-center">
            <span>货品退货率</span>
            <el-tooltip
              effect="dark"
              placement="top"
              content="货品退货率=付款量-实际销售量/付款量*100%"
            >
              <el-icon class="header-help"><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <template #default="{ row }">
          <div :class="['percentage',Number(row.goodsReturnRate) < 0 ? 'red' : '']">
            <div
              v-if="row.goodsCode !== '合计'"
              class="percentage-progress-label"
              :style="{
                width: progressLabelWidth(formatPercent(row.goodsReturnRate,false,true))
              }"
            ></div>
            <div class="percentage-text">
              {{formatPercent(row.goodsReturnRate,true,true)}}
            </div>
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <img class="mt50px" src="@/assets/imgs/empty/empty1.png" alt="" />
        <div class="mb24px">暂无相关内容</div>
      </template>
    </el-table>
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'Negativereviewstatistics' };
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type';
// import NegativereviewstatisticsDetails from "../details/index.vue";
// import { useRole } from "@/hooks/common/useRole";
// import { getIntDictOptions } from '@/utils/dict';
import { usePage, SearchItem } from "./config";
import request from '@/config/axios';
import * as negativeReviewDashboardApi from '@/api/negativeReviewDashboard'
import { onNegativeReviewDashboardStore } from '@/store/modules/negativeReviewDashboard'
import download from '@/utils/download';
const router = useRouter()
const negativeReviewDashboardStore = onNegativeReviewDashboardStore()
class StoreItem {
  storeCode: string = ''
  storeName: string = ''
}

const storeList = ref<StoreItem[]>([])
const getStoreList = async () => {
  const res = await negativeReviewDashboardApi.getNegativeReviewShopList()
  storeList.value = res || []
  // storeList.value.unshift({ storeCode: 'ALL', storeName: '全部' })
  negativeReviewDashboardStore.storeList = storeList.value
}

const detailsRef = ref<any>(), plateRef = ref(), boardRef = ref();

const userInfo = ref<any>({ isManagement: false, isHrbp: false });

const { dataList, page, loading, scheme, btns, searchData, column, screen, stateInfo, statistics, handleColumn, setRouterInfo } = usePage({ userInfo: toRef(userInfo, 'value'), storeList: toRef(storeList, 'value') });

// const { getPermissionInfo, grabCheck } = useRole('人力行政');

// 处理请求数据
const setParamsData = (noPage: boolean = false) => {
  const { dateRange, stores, ...rest } = searchData.value
  if (dateRange && dateRange.length > 0) {
    rest.startTime = dateRange[0]
    rest.endTime = dateRange[1]
  }
  rest.store = []
  const storeMapping = stores?.map((item: any) => ({ storeCode: item.storeCode,mappingNames: item.mapping.map((mapping: any) => mapping.mappingName) }))
  storeMapping?.forEach((item: any) => {
    rest.store.push(item.storeCode,...item.mappingNames)
  })

  return noPage ? { ...rest } : { ...rest };
};

const tableRowClassName = ({ row }) => {
  console.log('a', row)
  return row.goodsCode === '合计' ? 'summary-row' : ''
}

const summaryRow = ref<any>({})
const leftDateRangeDisplay = ref('') //左边展示的时间范围
const rightDateRangeDisplay = ref('') //右边展示的时间范围
// 查询对比时间
const getComparisonTime = async (param:any) => {
  const params = {
    startTime: param.startTime,
    endTime: param.endTime
  }
  const res = await negativeReviewDashboardApi.getComparisonTime(params).catch(() => {})
  if (res) {
    console.log('---', res)
    leftDateRangeDisplay.value = `${param.startTime} ~ ${param.endTime}`
    rightDateRangeDisplay.value = `${res.beforeStartDate} ~ ${res.beforeEndDate}`
    console.log('rightDateRangeDisplay', rightDateRangeDisplay.value)
  }
}

// 查询
const onSearch = () => {
  const params: any = setParamsData();
  loading.value = true;
  getComparisonTime(params)
  request.post({ url: `/api/evaluationBoard/numberInfoNew`, data:params }).then((res: any) => {
    // dataList.value = res.records?.length ? [...res.records] : [];
    if(res){
      const rawList = res.numberInfoList || []
      const mappedList = rawList.map((item: any) => {
        const newItem: any = { ...item }
        if (newItem.customerComplaintCountOfBN === undefined) {
          newItem.customerComplaintCountOfBN = newItem.banniuComplaintCount ?? 0
        }
        if (newItem.wdtCount === undefined) {
          newItem.wdtCount = newItem.wangdiantongSalesCount ?? 0
        }
        if (newItem.goodsBadReviewRate === undefined) {
          newItem.goodsBadReviewRate = newItem.productMidNegativeReviewRate ?? 0
        }
        if (newItem.goodsComplaintRate === undefined) {
          newItem.goodsComplaintRate = newItem.productComplaintRate ?? 0
        }
        return newItem
      })

      const totalWdt = Number.isFinite(Number(res.wdtTotalSum))
        ? Number(res.wdtTotalSum)
        : mappedList.reduce((sum: number, r: any) => sum + (Number(r.wdtCount) || 0), 0)
      const totalBn = Number.isFinite(Number(res.bnTotalSum))
        ? Number(res.bnTotalSum)
        : mappedList.reduce(
            (sum: number, r: any) => sum + (Number(r.customerComplaintCountOfBN) || 0),
            0
          )
      const weightedAvg = (valueKey: string, weightKey: string) => {
        const totalWeight = mappedList.reduce(
          (sum: number, r: any) => sum + (Number(r[weightKey]) || 0),
          0
        )
        if (!totalWeight) return 0
        const totalVal = mappedList.reduce(
          (sum: number, r: any) => sum + (Number(r[valueKey]) || 0) * (Number(r[weightKey]) || 0),
          0
        )
        return totalVal / totalWeight
      }
      const totalGoodsComplaintRate =
        (res.goodsComplaintRateRes ?? null) != null
          ? res.goodsComplaintRateRes
          : weightedAvg('goodsComplaintRate', 'wdtCount')
      const totalGoodsBadReviewRate =
        ( res.goodsBadReviewRateRes ?? null) != null
          ? res.goodsBadReviewRateRes
          : weightedAvg('goodsBadReviewRate', 'wdtCount')

      // 中差评数量情况有合计栏，其他类型没有
      summaryRow.value = {
        goodsCode: '合计',
        count: res.count || 0,
        beforeCount: res.beforeCount || 0,
        yesterdayPercentage: res.yesterdayPercentage || 0,
        beforePercentage: res.beforePercentage || 0,
        chainRatio: res.chainRatio || 0,
        // wdtTotalSum: totalWdt,
        bnTotalSum: totalBn,
        // goodsComplaintRateRes: totalGoodsComplaintRate,
        // goodsBadReviewRateRes: totalGoodsBadReviewRate,
        goodCount: res.goodCount || 0,
        validCount: res.validCount || 0,
        goodPercentage: res.goodPercentage || 0,
        goodRate: res.goodRate || 0,
        goodsReturnRate: res.goodsReturnRate || 0,
        paymentQuantity: res.paymentQuantity || 0,
        actualSalesQuantity: res.actualSalesQuantity || 0,
        goodsBadReviewRateRes:res.goodsBadReviewRateRes || 0,
        goodsComplaintRateRes:res.goodsComplaintRateRes || 0,
      }

      dataList.value = [summaryRow.value, ...mappedList]
    }
    page.value = { ...page.value, total: res.total };
  }).finally(() => {
    getStateInfo();
    loading.value = false;
  });
};
// 导出数据
const exportData = () => {
  const params: any = setParamsData();
  request.downloadPost({ url: `/api/evaluationBoard/numberInfoExportNew`, data: params }).then((res: any) => {
    if (res) {
      // window.open(res)
      download.excel(res, `${params.startTime}至${params.endTime}评价数据统计.xlsx`)
    }
  })
}

// 点击商品编码跳转详情页
const handleClick = (row: any) => {
  if (row.goodsCode === '合计') return
  console.log('row', row)
  const params: any = setParamsData();
  router.push({ name: 'NegativeReviewDashboard', query: { goodsParam: row.goodsCode, startTime: params.startTime, endTime: params.endTime,isNegativeReview: '1' } })
}



// 重置
const resetForm = () => {
  page.value = { ...new PageItem() };
  searchData.value = { ...new SearchItem() };
  onSearch();
};

// 状态筛选查询（无状态筛选可删除）
const getStateInfo = () => {
  // const params: any = setParamsData();
  // request.post({ url: `/api/employeeMonthlyAssessment/statistics`, data: params }).then((res: any) => {
  //   res && (stateInfo.value = { ...res });
  // });
};

// 按钮回调
const onButtonClick = (btn: BtnItem) => {
  ['board'].includes(btn.fun) && boardRef?.value?.openView();
  ['solution', 'seal'].includes(btn.fun) && plateRef?.value?.openDialog(btn.fun);
};

// 操作列回调
const viewDetails = (type: string, item?: any, btn?: any) => {
  detailsRef?.value?.openView(item, type);
};


// 保留两位小数并可选加%
function formatPercent(percent: string, withSymbol = false,needPlus = false) {
  if (!percent) return withSymbol ? '0.00%' : '0.00'
  const num = !needPlus? parseFloat(String(percent).replace('%', '')) : parseFloat(String(percent).replace('%', '')) * 100
  const fixed = isNaN(num) ? '0.00' : num.toFixed(2)
  return withSymbol ? `${fixed}%` : fixed
}

// 进度条宽度
function progressLabelWidth(percent: string) {
  // 这里 percent 已经是去掉%的数字字符串

  return `${Math.abs(Number(percent))}%`
}

onMounted(() => {
  dataList.value = [];
  getStoreList()
  onSearch();
});

setRouterInfo();

provide('NegativereviewstatisticsForm', { searchData, dataList, page, loading, stateInfo, statistics, setParamsData, resetForm, onSearch, onButtonClick, viewDetails });

</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
