<template>
  <content-wrap>
    <section>
      <s-w-search-form
        ref="searchFormRef"
        :key="currentTab"
        :schema="currentTab === '0' ? overallSchema : singleSchema"
        @search="onSearch"
        @reset="onReset"
        default-expand-all
        :expand-threshold="3"
        label-width="80px"
        auto-search-on-change
      >
        <el-button v-if="currentTab === '1'" type="primary" @click="onExport">导出</el-button>
      </s-w-search-form>

      <!-- 已移除 TimeFilter -->
    </section>
    <el-divider />
    <section class="flex items-center justify-start">
      <el-radio-group v-model="currentTab" @change="onTabChange">
        <el-radio-button value="0">整体概览</el-radio-button>
        <el-radio-button value="1">单条分析</el-radio-button>
      </el-radio-group>
      <div
        v-if="currentTab === '0'"
        class="flex items-center justify-center py-[7px] px-[12px] bg-[#F3F8FF] rounded-[4px] ml-18px"
      >
        <el-icon color="#2F8DF5" size="12">
          <warning-filled />
        </el-icon>
        <span class="ml-12px font-size-12px">仅月度有数据</span>
      </div>
    </section>
    <section class="mt-20px flex-1">
      <component ref="currentComponentRef" :is="currentComponent" :auto-load="false" />
    </section>
  </content-wrap>
</template>
<script lang="ts" setup>
import { ref, computed, defineAsyncComponent, provide, nextTick, onMounted, watch } from 'vue'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { WarningFilled } from '@element-plus/icons-vue'
import { FormSchema } from '@/types/form'
import dayjs from 'dayjs'
import { getNewestDay, getZtNewestDay, exportSingle } from '@/api/visualCenter/headerImagevVideo'
import { downloadFileFromResponse } from '@/utils/file'

const currentTab = ref('1')
const searchFormRef = ref()
const currentComponentRef = ref()
const dateTypeOptions = [
  { label: '单日', value: 0 },
  // { label: '7天', value: 7 },
  { label: '30天', value: 30 }
]
const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
// 最新可用日期（单条分析）
const newestAvailableDate = ref<string | null>(null)
// 最新月份基准日期（整体概览，使用月度口径）
const newestOverviewDate = ref<string | null>(null)
// const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')

const DEFAULT_STORE_CODE = 'swTaobao'
const DEFAULT_DATA_DIMENSION = 30

const currentComponent = computed(() => {
  const Overall = defineAsyncComponent(() => import('./components/overall/index.vue'))
  const Single = defineAsyncComponent(() => import('./components/single/index.vue'))
  return currentTab.value === '0' ? Overall : Single
})

const searchForm = ref({
  storeCode: DEFAULT_STORE_CODE,
  content: '',
  publishDate: [],
  // 单条分析：数据维度与统计日期（默认30天）
  dateType: DEFAULT_DATA_DIMENSION,
  dataDate: [],
  statisticsDateRange: ''
})

const searchParams = computed<any>(() => {
  const { publishDate, dataDate } = searchForm.value
  let beginDate = ''
  let endDate = ''
  let beginContentPublishTime = ''
  let endContentPublishTime = ''
  if (publishDate?.length > 0) {
    beginContentPublishTime = publishDate[0]
    endContentPublishTime = publishDate[1]
  }
  if (Array.isArray(dataDate) && dataDate.length > 0) {
    const isMonth = (s: string) => /^\d{4}-\d{2}$/.test(s)
    if (isMonth(dataDate[0])) {
      const startMonth = dataDate[0]
      const endMonth = dataDate[1] ?? dataDate[0]
      beginDate = dayjs(`${startMonth}-01`).startOf('month').format('YYYY-MM-DD')
      endDate = dayjs(`${endMonth}-01`).endOf('month').format('YYYY-MM-DD')
    } else {
      beginDate = dataDate[0]
      endDate = dataDate[1]
    }
  }
  if (currentTab.value === '0') {
    return {
      storeCode: searchForm.value.storeCode,
      beginDate,
      endDate,
      dateType: 2
    }
  }
  return {
    storeCode: searchForm.value.storeCode,
    content: searchForm.value.content,
    dateType: searchForm.value.dateType,
    beginDate,
    endDate,
    beginContentPublishTime,
    endContentPublishTime
  }
})

provide('searchParams', searchParams)

function refreshChild() {
  if (currentComponentRef.value && typeof currentComponentRef.value.refresh === 'function') {
    currentComponentRef.value.refresh()
    return
  }
  const stop = watch(
    () => currentComponentRef.value,
    (val) => {
      if (val && typeof val.refresh === 'function') {
        stop()
        val.refresh()
      }
    }
  )
}

const overallSchema = ref<FormSchema[]>([
  {
    field: 'storeCode',
    label: '渠道',
    component: 'Select',
    componentProps: {
      options: getIntDictOptions(DICT_TYPE.VC_HEADERVIDEO_STORECODE, true),
      clearable: false
    },
    value: DEFAULT_STORE_CODE
  },
  // 新增：整体概览统计日期（月份选择），展示一号到月底
  {
    field: 'dataDate',
    label: '统计时间',
    component: 'StatisticsDateRange',
    componentProps: {
      pickerType: 'month',
      valueFormat: 'YYYY-MM',
      prefix: '统计时间',
      clearable: false,
      placeholder: '选择月份',
      disabledDate: (time: Date) => {
        if (!newestOverviewDate.value) return false
        const candidateMonth = dayjs(time).startOf('month')
        const newestMonth = dayjs(newestOverviewDate.value).startOf('month')
        return candidateMonth.isAfter(newestMonth)
      }
    },
    value: ''
  }
])

const singleSchema = ref<FormSchema[]>([
  {
    field: 'content',
    label: '内容',
    component: 'Input',
    componentProps: {
      placeholder: '请输入内容ID/名称'
      // onChange: async (val: any) => {
      //   searchForm.value = { ...searchForm.value, content: val }
      //   await nextTick()
      //   onSearch(searchForm.value)
      // },
      // onkeydown: async (event: any) => {
      //   if ((event as any)?.key === 'Enter') {
      //     searchForm.value = {
      //       ...searchForm.value,
      //       content: searchFormRef.value?.formModel?.content
      //     }
      //     await nextTick()
      //     onSearch(searchForm.value)
      //   }
      // }
    }
  },
  {
    ...overallSchema.value[0]
  },
  {
    field: 'publishDate',
    label: '发布日期',
    component: 'DatePicker',
    componentProps: {
      type: 'daterange',
      rangeSeparator: '至',
      valueFormat: 'YYYY-MM-DD',
      format: 'YYYY-MM-DD'
    },
    formItemProps: {
      labelWidth: '80px'
    },
    value: []
  },
  // 数据维度（单日/30天）
  {
    field: 'dateType',
    label: '数据维度',
    component: 'Select',
    componentProps: {
      options: dateTypeOptions,
      clearable: false
    },
    value: DEFAULT_DATA_DIMENSION
  },
  // 统计日期（使用自定义 StatisticsDateRange 以展示统计区间与日期选择）
  {
    field: 'dataDate',
    label: '统计时间',
    component: 'StatisticsDateRange',
    componentProps: {
      diffField: 'dateType',
      pickerType: 'date',
      clearable: false,
      placeholder: '选择日期',
      disabledDate: (time: Date) => {
        const cutoff = newestAvailableDate.value
          ? new Date(new Date(newestAvailableDate.value).setHours(0, 0, 0, 0)).getTime()
          : new Date(new Date().setHours(0, 0, 0, 0)).getTime()
        return time.getTime() > cutoff
      }
    },
    value: newestAvailableDate.value
  }
])

async function onSearch(val: any) {
  searchForm.value = val
  console.log('onSearch', val)
  await nextTick()
  refreshChild()
}

function buildDefaultSearchForm(dataDate: string) {
  return {
    storeCode: DEFAULT_STORE_CODE,
    content: '',
    publishDate: [],
    dataDimension: DEFAULT_DATA_DIMENSION,
    dataDate,
    statisticsDateRange: ''
  }
}

async function onExport() {
  try {
    const params = { ...searchParams.value }
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
    )
    const response = await exportSingle(filteredParams)
    const defaultName = `单条分析导出_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`
    downloadFileFromResponse(response, defaultName)
  } catch (e) {
    console.error('导出失败', e)
  }
}

async function onReset() {}

async function onTabChange(val: any) {
  searchFormRef.value?.resetFields()
  searchForm.value = searchFormRef.value?.getFormModel?.()
  console.log('onTabChange', searchForm.value)
  await nextTick()
  refreshChild()
}

async function fetchNewestDay() {
  // 单条分析最新日
  const newestSingle = await getNewestDay({})
  newestAvailableDate.value = newestSingle || yesterday

  const dataDateSchema = singleSchema.value.find((item) => item.field === 'dataDate')
  if (dataDateSchema) {
    dataDateSchema.value = newestAvailableDate.value
  }

  const newestOverview = await getZtNewestDay({})
  newestOverviewDate.value = newestOverview || yesterday

  const statsMonthSchema = overallSchema.value.find((item) => item.field === 'dataDate')
  if (statsMonthSchema) {
    statsMonthSchema.value = newestOverviewDate.value
  }
}

onMounted(async () => {
  await fetchNewestDay()
  searchFormRef.value?.search()
})
</script>
<style scoped lang="scss">
.content-wrap {
  margin-bottom: 0px !important;
  height: calc(100vh - 117px);
  overflow: auto;

  :deep(.el-card__body) {
  }
}

:deep(.el-divider--horizontal) {
  margin: 0 0 20px;
}

:deep(.el-form) {
  .el-form-item {
    margin-bottom: 16px;
  }
}
</style>
