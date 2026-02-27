<template>
  <flux-wrap class="quality-inspection-board" v-loading="loading" use-scroll-bar>
    <div class="pr-20px">
      <section>
        <section-title-header>
          <span style="font-size: 16px;">质检/实时质检数据统计</span>
          <template #right>
            <div class="max-w-100% overflow-hidden">
              <TimeFilter v-model="dateRange" :layout="layout" :swift-options="timeSwiftOptions"
                :default-value="defaultOption" :default-date="defaultRange" :is-tooltip="false" :is-show-time="true"
                show-str="统计时间" @change="handleTimeChange" :show-arrow="false" />
            </div>
          </template>
        </section-title-header>
        <!-- <el-divider /> -->
        <StatisticsPanel :items="statisticItems" :loading="loading" @item-click="handleStatisticClick" class="mt8px"/>
      </section>

      <section class="mt-20px">
        <section-title-header><span style="font-size: 16px;">质检/实时质检数据风险统计</span></section-title-header>
        <div class="risk-section mt-16px">
          <RiskDonutChart title="质检问题风险程度" :data="qualityRiskData" :loading="loading" :show-count="true" />
          <RiskDonutChart title="实时质检问题风险程度" :data="realTimeRiskData" :loading="loading" :show-count="true" />
        </div>
      </section>

      <section class="mt-16px">
        <section-title-header><span style="font-size: 16px;">客服问题统计</span></section-title-header>
        <!-- <el-divider /> -->
        <el-tabs v-model="curTab" class="mt-4px" @tab-change="getStatisticData">
          <el-tab-pane label="质检问题" name="1"/>
          <el-tab-pane label="实时质检问题" name="2"/>
        </el-tabs>
        <div class="customer-statistics">
          <div class="customer-statistics__panel">
            <!-- <div class="customer-statistics__panel-title">质检问题</div> -->
             <el-card shadow="never" class="statisticCard">
              <template #header>
                <div class="cardHeader">
                  <el-form-item label="旺旺名(客服)" class="!mb0px">
                    <el-select v-model="statisticParams.customerName" style="width: 220px;" @change="getStatisticData" clearable>
                      <el-option v-for="cus in customerConfigList" :label="cus.label" :value="cus.value"/>
                    </el-select>
                  </el-form-item>
                  <div class="showMore" @click="openMore('1')" v-if="customerServiceList.length >8">
                    <span>查看更多</span>
                    <el-icon><ArrowRight /></el-icon>
                  </div>
                </div>
              </template>
              <!-- <s-table class="customer-statistics__table" :columns="customerProblemColumns" :data="curTab === 'quality' ?qualityCustomerData:realTimeCustomerData"
              :showPagination="false" :showLoading="false" :loading="loading" align="left" header-align="left" stripe maxHeight="400"/> -->
              <el-table border style="width: 100%;" max-height="410" :header-cell-style="{ color: '#666', backgroundColor: '#F2F6FC' }" :data="customerServiceLatestList">
                <el-table-column label="旺旺名(客服)" prop="customerName"></el-table-column>
                <el-table-column label="问题数量" prop="problemCount">
                  <template #default="{ row }">
                    <el-link v-if="Number(row.problemCount) !== 0" @click="goToList('cs',row,'')" underline="never" type="primary">{{ row.problemCount }}</el-link>
                    <span v-else>{{ row.problemCount }}</span>
                  </template>
                </el-table-column>
                <template #empty>
                  <img style="width: 220px;height: 220px;margin-top:20px" src="@/assets/imgs/empty/empty1.png" alt="" />
                  <div class="">暂无相关内容</div>
                </template>
              </el-table>
             </el-card>
            
          </div>
          <div class="customer-statistics__panel">
            <!-- <div class="customer-statistics__panel-title">实时质检问题</div> -->
             <el-card shadow="never" class="statisticCard">
              <template #header>
                <div class="cardHeader">
                  <el-form-item label="对接人" class="!mb0px">
                    <SelectUser :role="getRole('质检问题处理人')" v-model="statisticParams.dockingPersonId" @change="getStatisticData" :multiple="false"/>
                  </el-form-item>
                  <div class="showMore" @click="openMore('2')" v-if="dockingPersonList.length > 8">
                    <span>查看更多</span>
                    <el-icon><ArrowRight /></el-icon>
                  </div>
                </div>
              </template>
              <!-- <s-table class="customer-statistics__table" :columns="directorProblemColumns" :data="realTimeCustomerData"
              :showPagination="false" :showLoading="false" :loading="loading" align="left" header-align="left" stripe /> -->
              <el-table border style="width: 100%;"  max-height="410" :header-cell-style="{ color: '#666', backgroundColor: '#F2F6FC' }" :data="dockingPersonLatestList">
                <el-table-column label="对接人" prop="dockingPersonName">
                  <template #default="{ row }">
                    <lineAvatar :user="{ name:row.dockingPersonName,avatarOrigin:row.dockingPersonAvatar}"/>
                  </template>
                </el-table-column>
                <el-table-column label="问题数量" prop="problemCount">
                  <template #default="{ row }">
                    <el-link v-if="Number(row.problemCount) !== 0" @click="goToList('handler',row,'')" underline="never" type="primary">{{ row.problemCount }}</el-link>
                    <span v-else>{{ row.problemCount }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="已完成数量" prop="completedCount">
                  <template #default="{ row }">
                    <el-link v-if="Number(row.completedCount) !== 0" @click="goToList('handler',row,'1')" underline="never" type="primary">{{ row.completedCount }}</el-link>
                    <span v-else>{{ row.completedCount }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="未完成数量" prop="uncompletedCount">
                  <template #default="{ row }">
                    <el-link v-if="Number(row.uncompletedCount) !== 0" @click="goToList('handler',row,'0')" underline="never" type="primary">{{ row.uncompletedCount }}</el-link>
                    <span v-else>{{ row.uncompletedCount }}</span>
                  </template>
                </el-table-column>
                <template #empty>
                  <img style="width: 220px;height: 220px;margin-top:20px" src="@/assets/imgs/empty/empty1.png" alt="" />
                  <div class="">暂无相关内容</div>
                </template>
              </el-table>
             </el-card>
          </div>
        </div>
      </section>
    </div>
  </flux-wrap>

  <!-- 查看更多弹出页面 -->
  <SWDialog
    show-title-line
    v-model="listDialogShow"
    title="客服问题统计"
    width="700"
  >
  <el-table border class="mt10px" max-height="600" :header-cell-style="{ color: '#666', backgroundColor: '#F2F6FC' }" v-if="listType === '1'" :data="customerServiceList">
    <el-table-column label="旺旺名(客服)" prop="customerName"></el-table-column>
    <el-table-column label="问题数量" prop="problemCount">
      <template #default="{ row }">
        <el-link v-if="Number(row.problemCount) !== 0" @click="goToList('cs',row,'')" underline="never" type="primary">{{ row.problemCount }}</el-link>
        <span v-else>{{ row.problemCount }}</span>
      </template>
    </el-table-column>
    <template #empty>
      <img class="mt30px" src="@/assets/imgs/empty/empty1.png" alt="" />
      <div class="mb2x4p">暂无相关内容</div>
    </template>
  </el-table>
  <el-table border class="mt10px" max-height="600" :header-cell-style="{ color: '#666', backgroundColor: '#F2F6FC' }" v-if="listType === '2'" :data="dockingPersonList">
    <el-table-column label="对接人" prop="dockingPersonName">
      <template #default="{ row }">
        <lineAvatar :user="{ name:row.dockingPersonName,avatarOrigin:row.dockingPersonAvatar}"/>
      </template>
    </el-table-column>
    <el-table-column label="问题数量" prop="problemCount">
      <template #default="{ row }">
        <el-link @click="goToList('handler',row,'')" underline="never" type="primary" v-if="Number(row.problemCount) !== 0">{{ row.problemCount }}</el-link>
         <span v-else>{{ row.problemCount }}</span>
      </template>
    </el-table-column>
    <el-table-column label="已完成数量" prop="completedCount">
      <template #default="{ row }">
        <el-link v-if="Number(row.completedCount) !== 0" @click="goToList('handler',row,'1')" underline="never" type="primary">{{ row.completedCount }}</el-link>
        <span v-else>{{ row.completedCount }}</span>
      </template>
    </el-table-column>
    <el-table-column label="未完成数量" prop="uncompletedCount">
      <template #default="{ row }">
        <el-link v-if="Number(row.uncompletedCount) !== 0" @click="goToList('handler',row,'0')" underline="never" type="primary">{{ row.uncompletedCount }}</el-link>
        <span v-else>{{ row.uncompletedCount }}</span>
      </template>
    </el-table-column>
    
    <template #empty>
      <img class="mt30px" src="@/assets/imgs/empty/empty1.png" alt="" />
      <div class="mb24px">暂无相关内容</div>
    </template>
  </el-table>
  </SWDialog>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import TimeFilter from '~/time/timeFilter.vue'
import StatisticsPanel from './components/statisticsPanel.vue'
import RiskDonutChart from './components/riskDonutChart.vue'
import {
  getQualityInspectionStatistics,
  type QualityInspectionStatisticsParams,
  type QualityInspectionStatisticsRes,
  type RiskStatisticServerItem,
  type CustomerProblemStatisticItem
} from '@/api/customerService/qualityInspectionBoard'
import { useMessage } from '@/hooks/web/useMessage'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import type { TableColumn } from '@/components/SWTable/src/table'
import request from '@/config/axios';
import SelectUser from '@/components/common/user/selectUser.vue'
import lineAvatar from '@/components/template/table/components/lineAvatar.vue'
import { useRole } from '@/hooks/common/useRole'
const { getPermissionInfo, grabCheck,getRole} = useRole('客服');

const message = useMessage()
const router = useRouter()

const loading = ref(false)
const dateRange = ref<string | [string, string] | null>(null)
const statistics = ref<QualityInspectionStatisticsRes>({})

const today = dayjs().format('YYYY-MM-DD')
const defaultRange = ref<string | [string, string]>(today)

const defaultOption = '日'
const layout = '日,自定义'

const timeSwiftOptions = [
  {
    label: '7天',
    tips: '最近7天数据',
    isComponents: false,
    timeOffset: { type: 'day', mode: 'subtract', offset: 6 },
    params: { preset: 'last7Days' }
  }
]

const statisticItems = computed(() => [
  {
    key: 'totalCount',
    label: '质检问题登记量',
    value: statistics.value?.totalCount ?? 0
  },
  {
    key: 'completedCount',
    label: '质检问题完成量',
    value: statistics.value?.completedCount ?? 0
  },
  {
    key: 'uncompletedCount',
    label: '质检问题未完成量',
    value: statistics.value?.uncompletedCount ?? 0
  },
  {
    key: 'totalCountReal',
    label: '实时质检问题登记量',
    value: statistics.value?.totalCountReal ?? 0
  },
  {
    key: 'completedCountReal',
    label: '实时质检问题完成量',
    value: statistics.value?.completedCountReal ?? 0
  },
  {
    key: 'uncompletedCountReal',
    label: '实时质检问题未完成量',
    value: statistics.value?.uncompletedCountReal ?? 0
  }
])

const buildParams = (range: [string, string]): QualityInspectionStatisticsParams => {
  const [startDate, endDate] = range
  const isSingleDay = startDate === endDate
  const params: QualityInspectionStatisticsParams = {
    type: isSingleDay ? 1 : 2,
    dataDateStart: startDate
  }
  if (!isSingleDay) {
    params.dataDateEnd = endDate
  } else {
    params.dataDateEnd = startDate
  }
  return params
}

const fetchStatistics = async (range: [string, string]) => {
  loading.value = true
  try {
    const res = await getQualityInspectionStatistics(buildParams(range))
    const content =
      res && typeof res === 'object' && 'data' in (res as Record<string, any>)
        ? ((res as Record<string, any>).data as QualityInspectionStatisticsRes)
        : (res as QualityInspectionStatisticsRes)

    statistics.value = (content || {}) as QualityInspectionStatisticsRes
  } catch (error) {
    console.error('[qualityInspectionBoard] get statistics error:', error)
    message.error('获取统计数据失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const riskLevelOptions = computed(() => getIntDictOptions(DICT_TYPE.PROBLEM_RISK_LEVEL, true) || [])

const riskLevelMap = computed<Record<string, string>>(() => {
  const map: Record<string, string> = {}
  riskLevelOptions.value.forEach((item: any) => {
    if (item?.value !== undefined) {
      map[String(item.value).toLowerCase()] = item.label
      map[String(item.value)] = item.label
    }
  })
  return map
})

const riskColorMap: Record<string, string> = {
  '1': '#F33C51',
  '2': '#FE9719',
  '3': '#06C21B',
  low: '#06C21B',
  middle: '#FE9719',
  mid: '#FE9719',
  medium: '#FE9719',
  high: '#F33C51'
}

const riskLabelColorMap: Record<string, string> = {
  低风险: '#06C21B',
  中风险: '#FE9719',
  高风险: '#F33C51'
}

interface RiskChartItem {
  name: string
  value: number
  color?: string
}

interface CustomerProblemItem {
  customerName: string
  problemCount: number
}

const parseCount = (value: unknown) => {
  const num = Number(value)
  return Number.isFinite(num) ? num : 0
}

const normalizeRiskList = (
  list?: Array<RiskStatisticServerItem | string>,
  options: { fallbackToPercentage?: boolean } = {}
): RiskChartItem[] => {
  if (!Array.isArray(list)) return []
  return list
    .map((item) => {
      if (typeof item === 'string') {
        const [levelKeyRaw, countRaw] = item.split(':')
        const key = (levelKeyRaw || '').trim()
        const count = parseCount(countRaw)
        const name = riskLevelMap.value[key.toLowerCase()] || riskLevelMap.value[key] || key || '-'
        const color =
          riskColorMap[key.toLowerCase()] || riskColorMap[key] || riskLabelColorMap[name]
        return { name, value: count, color }
      }
      const levelKey = String(item?.problemRiskLevel ?? '').trim()
      const baseValue =
        item?.levelCount !== undefined && item?.levelCount !== null && item?.levelCount !== ''
          ? item?.levelCount
          : options.fallbackToPercentage
            ? item?.percentage
            : 0
      const value = parseCount(baseValue)
      const normalizedKey = levelKey.toLowerCase()
      const name =
        riskLevelMap.value[normalizedKey] || riskLevelMap.value[levelKey] || levelKey || '-'
      const color =
        item?.color ||
        riskColorMap[normalizedKey] ||
        riskColorMap[levelKey] ||
        riskLabelColorMap[name]
      return { name, value, color }
    })
    .filter((entry) => entry.value >= 0)
}

const normalizeCustomerList = (
  list?: Array<CustomerProblemStatisticItem | string>
): CustomerProblemItem[] => {
  if (!Array.isArray(list)) return []
  return list
    .map((item, index) => {
      if (typeof item === 'string') {
        const [nameRaw, countRaw] = item.split(':')
        const customerName = (nameRaw || `客服${index + 1}`).trim()
        return {
          customerName: customerName === '' ? `客服${index + 1}` : customerName,
          problemCount: parseCount(countRaw)
        }
      }

      const customerName = String(item?.customerName ?? '').trim()
      const fallbackName = customerName || `客服${index + 1}`
      const problemCount = parseCount(item?.problemCount)

      return {
        customerName: fallbackName,
        problemCount
      }
    })
    .filter((entry) => entry.problemCount >= 0)
}

const curTab = ref('1')
const customerProblemColumns: TableColumn[] = [
  {
    prop: 'customerName',
    label: '旺旺名（客服）',
    // minWidth: 160,
    align: 'left',
    headerAlign: 'left'
  },
  {
    prop: 'problemCount',
    label: '问题数量',
    // minWidth: 100,
    // width: 200,
    align: 'left',
    headerAlign: 'left'
  }
]


const handleTimeChange = (value: any) => {
  console.log('value', value)
  if (!value) return
  const range = Array.isArray(value) ? value : [value, value]
  if (!range[0] || !range[1]) return
  dateRange.value = value
  fetchStatistics([range[0], range[1]] as [string, string])
  getStatisticData()
}

const normalizeRange = (source: string | [string, string]): [string, string] =>
  Array.isArray(source) ? [source[0], source[1]] : [source, source]

const resolveCurrentRange = (): [string, string] => {
  const source = (dateRange.value ?? defaultRange.value) as string | [string, string]
  return normalizeRange(source)
}

const normalizeDateValue = (value: string) => (value ? dayjs(value).format('YYYY-MM-DD') : '')

const handleStatisticClick = (_item: unknown, index: number) => {
  const [startDate, endDate] = resolveCurrentRange()
  const beginDate = normalizeDateValue(startDate)
  const finishDate = normalizeDateValue(endDate)
  if (!beginDate || !finishDate) return

  if (index <= 2) {
    const query: Record<string, string> = {
      selectClass: '1',
      registerTimeBegin: beginDate,
      registerTimeEnd: finishDate
    }
    if (index === 1) {
      query.warehouseIssueComplete = '1'
    } else if (index === 2) {
      query.warehouseIssueComplete = '0'
    }
    router.push({
      name: 'QIProblemRegistration',
      query
    })
    return
  }

  const query: Record<string, string> = {
    selectClass: '1',
    inspectionTimeBegin: beginDate,
    inspectionTimeEnd: finishDate
  }
  if (index === 4) {
    query.warehouseIssueComplete = '1'
  } else if (index === 5) {
    query.warehouseIssueComplete = '0'
  }

  router.push({
    name: 'RealTimeQIProblemRegistration',
    query
  })
}

// 客服人员分组配置列表
const customerConfigList = ref<any>([])
const getCusList = async()=>{
  request.get({ url:"/api/personnelGroup/getGroup"}).then((res:any)=>{
    customerConfigList.value = res.map((rs:any)=>({
      ...rs,
      label:rs.customerName,
      value:rs.customerName
    }))
  })
}
const listDialogShow = ref(false)
const listType = ref('1')

const openMore = (type:string)=>{
  listType.value = type
  listDialogShow.value = true
}
const statisticParams = ref<any>({
  queryType:curTab.value,
  dataDateStart:'',
  dataDateEnd:'',
  type:null,
  customerName:'',
  dockingPersonId:''
})
const customerServiceList = ref([]),dockingPersonList = ref([]),customerServiceLatestList = ref([]),dockingPersonLatestList = ref([])
const getStatisticData = ()=>{
  const data = { ...statisticParams.value,queryType:curTab.value}
  const [startDate, endDate] = resolveCurrentRange()
  const isSingleDay = startDate === endDate
  data.type = isSingleDay ? 1 : 2,
  data.dataDateStart = startDate
  if (!isSingleDay) {
    data.dataDateEnd = endDate
  } else {
    data.dataDateEnd = startDate
  }
  request.post({ url:`/api/csQualityInspection/csStatisticsData`,data }).then((res:any)=>{
    customerServiceList.value = res.customerService
    customerServiceLatestList.value = res.customerService.slice(0,8)
    dockingPersonList.value = res.dockingPerson
    dockingPersonLatestList.value = res.dockingPerson.slice(0,8)
  })
}
// 跳转
const goToList = (type,row,isComplete)=>{
  const [startDate, endDate] = resolveCurrentRange()
  const beginDate = normalizeDateValue(startDate)
  const finishDate = normalizeDateValue(endDate)
  if (!beginDate || !finishDate) return
  
  if(curTab.value === '1'){
    //质检问题
    const customerName = type === 'cs'? row.customerName : undefined
    const warehouseIssueComplete = isComplete? Number(isComplete) : undefined
    const handleId = type === 'handler'? row.dockingPersonId: undefined
    const query = {
      selectClass: '1',
      registerTimeBegin: beginDate,
      registerTimeEnd: finishDate,
      customerName,
      warehouseIssueComplete,
      handleId
    }
    router.push({
      name: 'QIProblemRegistration',
      query
    })
    return

  }else{
    //实时质检
    const customerName = type === 'cs'? row.customerName : undefined
    const warehouseIssueComplete = isComplete? Number(isComplete) : undefined
    const handleId = type === 'handler'? row.dockingPersonId: undefined
    const query = {
      selectClass: '1',
      inspectionTimeBegin: beginDate,
      inspectionTimeEnd: finishDate,
      customerName,
      warehouseIssueComplete,
      handleId
    }
    router.push({
      name: 'RealTimeQIProblemRegistration',
      query
    })
  }
}

onMounted(() => {
  getPermissionInfo(()=>{
    getCusList()
    const normalized = normalizeRange(defaultRange.value)
    dateRange.value = defaultRange.value
    fetchStatistics(normalized)
    getStatisticData()
  })
 
})

const qualityRiskData = computed(() =>
  normalizeRiskList(statistics.value?.mapProblemRiskLevelList as any, {
    fallbackToPercentage: true
  })
)

const realTimeRiskData = computed(() =>
  normalizeRiskList(statistics.value?.mapProblemRiskLevelRealList as any)
)

const qualityCustomerData = computed(() =>
  normalizeCustomerList(statistics.value?.mapCustomerNameList as any)
)

const realTimeCustomerData = computed(() =>
  normalizeCustomerList(statistics.value?.mapCustomerNameRealList as any)
)
</script>

<style scoped lang="scss">
.quality-inspection-board {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

:deep(.el-divider) {
  margin: 12px 0;

  &:first-child {
    margin-top: 0;
  }
}

.risk-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 22px;
}

.customer-statistics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 22px;
  max-height: 560px;
  &__panel {
    // background: #fbfcfd;
    // border: 1px solid #dde2e9;
    // border-radius: 4px;
    // padding: 16px;
    display: flex;
    // flex-direction: column;
    // gap: 12px;
    // height: 100%;
    

    :deep(.statisticCard){
      width: 100%;
      .el-card__header{
        padding: 0;
      }
      .el-card__body{
        // max-height: 402px;
        // min-height: 402px;
        box-sizing: border-box;
      }
      .cardHeader{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 20px;
        background: #FBFCFD;
      }
      .showMore{
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #0064ff;
        cursor: pointer;
        &:hover{
          opacity: .6;
        }
      }
    }
  }

  &__panel-title {
    font-size: 14px;
    font-weight: 500;
    color: #333;
  }

  &__table {
    // flex: 1;
  }
}

:deep(.s-table) {
  .el-table__inner-wrapper {
    &::before {
      height: 0;
    }
  }
}

.flux-wrap {
  > :deep(.el-card__body) {
    padding: 12px 0 20px 20px;
  }
}

// .section-title-header-wrap {
//   align-items: flex-start;
// }</style>
