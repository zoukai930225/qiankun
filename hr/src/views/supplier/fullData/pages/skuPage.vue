<template>
  <table-box v-bind="{ thresholdValue: 0, maxViewHeight: innerHeight - 60 }">
    <template #prePart>
      <el-row :gutter="24">
        <el-col :span="19" class="!flex-1">
          <el-form :model="queryParams" ref="queryFormRef" :label-width="90">
            <el-row :gutter="14">
              <slot :params="queryParams" :handleQuery="handleQuery">
                <el-col :span="6">
                  <el-form-item label-width="20">
                    <sku-goods-no-select
                      v-model:params="queryParams"
                      @change-type="handleQuery"
                      @change-value="handleQuery"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="货品品类" prop="category">
                    <scroll-select
                      v-model="queryParams.category"
                      :api="getCategorySelectorApi"
                      select-key="categoryName"
                      itemLabelKey="categoryName"
                      itemValueKey="categoryCode"
                      page-key="pageNum"
                      size-key="pageSize"
                      clearable
                      @change="handleQuery"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="统计日期">
                    <el-date-picker
                      v-model="queryParams.date"
                      value-format="YYYY-MM-DD"
                      format="YYYY-MM-DD"
                      placeholder="请选择统计日期"
                      :clearable="false"
                      @change="handleQuery"
                    />
                  </el-form-item>
                </el-col>
              </slot>
            </el-row>
          </el-form>
        </el-col>
        <el-col :span="5" class="!flex justify-end min-w-350px">
          <el-button type="primary" :loading="syncLoading" @click="handleSyncData">
            <span>同步数据</span>
            <el-tooltip
              content="系统每半小时会自动同步在厂、在途、待分配数据，点击同步数据可立即触发。每次触发后需等待一段时间页面数据才会更新"
              placement="top"
            >
              <Icon icon="bi:question-circle" :size="14" class="ml-4px" />
            </el-tooltip>
          </el-button>

          <el-button :loading="exportLoading" type="primary" @click="handleExport">
            <Icon v-if="!exportLoading" icon="ep:download" />
            <span>导出</span>
          </el-button>

          <el-button @click="handleQuery" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="resetQuery" class="commonResetBtn" :style="{ marginLeft: '0px' }">
            重置
          </el-button>
        </el-col>
      </el-row>
    </template>

    <special-table :data="tableData" :options="tableOptions" :loading="loading" border>
      <template
        v-for="slotName in sortKeys"
        :key="slotName.label"
        #[`${slotName}_header`]="{ column }"
      >
        <span>{{ column.label }}</span>

        <filter-popper
          v-model:query-params="queryParams"
          :slot-name="slotName!"
          @handle-query="handleQuery"
        />
      </template>
    </special-table>

    <div class="w100% flex mt-20px justify-end">
      <!-- 分页 -->
      <Pagination
        class="!my-0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
  </table-box>
</template>
<script lang="ts" setup>
import tableBox from '../../components/tableBox.vue'
import specialTable from '../../components/table.vue'
import { SKUTable, sortColumns, sortKeys } from '../options'
import {
  fullDataSyncApi,
  orderStatisticsFullDataExportApi,
  orderStatisticsPageFullDataApi
} from '@/api/supplier/fullData'
import skuGoodsNoSelect from '@/views/supplier/components/sku&goodsNoSelect.vue'
import { formatDate } from '@/utils/formatTime'
import { getCategorySelectorApi } from '@/api/supplier/supplierData'
import filterPopper from '../../ledger/components/filterPopper.vue'
import { cloneDeep } from 'lodash-es'
import download from '@/utils/download'

defineOptions({ name: 'SupplierFullDataSKU' })

const message = useMessage()

const props = withDefaults(
  defineProps<{
    innerHeight?: number
    dimension: string
    tableOptions?: TableOption
  }>(),
  {
    innerHeight: 0,
    tableOptions: () => SKUTable
  }
)

const queryParams = ref<Supplier.FullData.Request>({
  pageNum: 1,
  pageSize: 10,
  date: formatDate(new Date(), 'YYYY-MM-DD'),
  ...sortColumns
})
const tableData = ref<any[]>([])
const total = ref(0)
const loading = ref(false)
// 1. 请求控制器：用于中断前一次未完成的请求
const abortController = ref<AbortController | null>(null)
// 2. 请求版本号：标记最新请求，仅处理最新版本的响应
const requestId = ref(0)

function getParams() {
  queryParams.value.orders = []
  queryParams.value.filters = queryParams.value.orders || []

  const ordersMap = new Map(queryParams.value.orders?.map((ele) => [ele.columl, ele]))
  const filtersMap = new Map(queryParams.value.filters?.map((ele) => [ele.columl, ele]))

  Object.keys(sortColumns).forEach((key) => {
    if (queryParams.value[key]?.sort) {
      ordersMap.set(key, {
        column: key,
        order: queryParams.value[key]?.sort === 1 ? 'asc' : 'desc'
      })
    } else {
      ordersMap.delete(key)
    }

    if (
      queryParams.value[key]?.rangeEnd ||
      queryParams.value[key]?.rangeEnd === 0 ||
      queryParams.value[key]?.rangeStart ||
      queryParams.value[key]?.rangeStart === 0
    ) {
      filtersMap.set(key, {
        column: key,
        ge: queryParams.value[key]?.rangeStart,
        le: queryParams.value[key]?.rangeEnd
      })
    } else {
      filtersMap.delete(key)
    }
  })

  const params = cloneDeep(
    Object.assign(queryParams.value, {
      goodsNos: queryParams.value?.goodsCode
        ? (queryParams.value?.goodsCode as string)?.split(',')
        : undefined,
      skus: queryParams.value?.sku ? (queryParams.value?.sku as string)?.split(',') : undefined,
      categories: queryParams.value?.category
        ? (queryParams.value?.category as string)?.split(',')
        : undefined,
      orders: Array.from(ordersMap.values()),
      filters: Array.from(filtersMap.values())
    })
  )

  sortKeys.filter((key) => delete params[key])
  delete params.goodsCode
  delete params.sku

  return params
}

async function getList() {
  loading.value = true
  if (abortController.value) {
    abortController.value.abort('新请求触发，中断旧请求')
  }
  abortController.value = new AbortController()
  const currentRequestId = ++requestId.value

  try {
    const res = await orderStatisticsPageFullDataApi(getParams(), abortController.value.signal)
    if (currentRequestId !== requestId.value) return
    tableData.value = res.records.length ? [res.records?.[0]?.total, ...res.records] : []
    total.value = res.total
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

async function resetQuery() {
  Object.assign(
    queryParams.value,
    Object.fromEntries(Object.entries(queryParams.value).map(([key]) => [key, undefined])),
    {
      pageNum: 1,
      pageSize: 10,
      dimension: props.dimension,
      date: formatDate(new Date(), 'YYYY-MM-DD'),
      ...Object.fromEntries(Object.keys(sortColumns).map((key) => [key, { sort: null }]))
    }
  )
  getList()
}

const exportLoading = ref(false)
async function handleExport() {
  if (exportLoading.value) return
  exportLoading.value = true
  try {
    await orderStatisticsFullDataExportApi(getParams())
    message.info('文件下载中，请前往下载中心查看！')
  } catch (error) {
  } finally {
    exportLoading.value = false
  }
}

const syncLoading = ref(false)
async function handleSyncData() {
  if (syncLoading.value) return
  syncLoading.value = true
  try {
    const res = await fullDataSyncApi()
    if (res && res.success) {
      message.error('同步数据成功！')
      handleQuery()
    }
  } catch (error) {
  } finally {
    syncLoading.value = false
  }
}

onBeforeMount(() => {
  queryParams.value.dimension = props.dimension
  handleQuery()
})

defineExpose({ getList })
</script>
<style lang="less" scoped>
@import url(../../index.scss);
</style>
