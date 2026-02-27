<template>
  <ex-screen>
    <query-scheme
      :scheme="scheme"
      v-model="queryParams"
      name="KeyGoodsComparison"
      :show-expand="false"
      :show-divider="false"
    />
    <div class="top-border"></div>
    <div class="row-center mb15px mt15px" style="justify-content: space-between">
      <div class="table-title">{{ title }}</div>
      <el-button type="primary" @click="openGoodsDrawer">商品管理</el-button>
    </div>
    <!-- 列表 -->

    <el-table
      :header-cell-style="appStore.headerCellStyle"
      v-loading="loading"
      :data="list"
      border
      :show-overflow-tooltip="false"
      row-class-name="commonTableRow1"
      class="SWCommonTable"
      cell-class-name="self-table-cell"
      v-horizontal-scroll="'always'"
      ref="tableRef"
      :tooltip-options="{ popperClass: 'refund-tips' }"
      @scroll="handleScroll"
    >
      <el-table-column label="商品信息" prop="storeName" min-width="484" fixed align="center">
        <template v-slot="{ row }">
          <div class="row-center" style="justify-content: center">
            <shopCard :row="row" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="退款率" align="center">
        <el-table-column
          v-for="(item, index) in cloumsDates"
          :key="'one_' + index"
          :label="item + '月'"
          align="center"
          :min-width="200"
        >
          <template v-slot="{ row }">
            <div class="row-center" style="justify-content: space-between">
              <div class="title-text">总退款率</div>
              <div class="text-value"
                >{{ detailFormatValue('precentage', 'tkRate', row, item) }}
              </div>
            </div>
            <div class="row-center" style="justify-content: space-between">
              <div class="title-text">未发货退款率</div>
              <div class="text-value"
                >{{ detailFormatValue('precentage', 'wfhtkRate', row, item) }}
              </div>
            </div>
          </template>
        </el-table-column>
        <span v-if="cloumsDates?.length === 0">-</span>
      </el-table-column>
      <el-table-column label="渠道退款率" align="center">
        <el-table-column
          v-for="(item, index) in cloumsDates"
          :key="'two_' + index"
          :label="item + '月'"
          align="center"
          :min-width="200"
          class-name="no-padding-cell"
        >
          <template v-slot="{ row }">
            <div class="row-center line-center">
              <div class="title-text">未发货退款率</div>
              <div class="text-value"
                >{{ detailFormatValue('precentage', 'zyWfhtkRate', row, item) }}
              </div>
            </div>
            <div class="row-center line-center slid-bottom">
              <div class="title-text">自营直播</div>
              <div class="text-value"
                >{{ detailFormatValue('precentage', 'zyTkRate', row, item) }}
              </div>
            </div>

            <div class="row-center line-center">
              <div class="title-text">未发货退款率</div>
              <div class="text-value"
                >{{ detailFormatValue('precentage', 'hzWfhtkRate', row, item) }}
              </div>
            </div>
            <div class="row-center line-center slid-bottom">
              <div class="title-text">达人合作</div>
              <div class="text-value"
                >{{ detailFormatValue('precentage', 'hzTkRate', row, item) }}
              </div>
            </div>

            <div class="row-center line-center">
              <div class="title-text">未发货退款率</div>
              <div class="text-value"
                >{{ detailFormatValue('precentage', 'spkWfhtkRate', row, item) }}
              </div>
            </div>
            <div class="row-center line-center">
              <div class="title-text">商品卡挂车</div>
              <div class="text-value"
                >{{ detailFormatValue('precentage', 'spkTkRate', row, item) }}
              </div>
            </div>
          </template>
        </el-table-column>
        <span v-if="cloumsDates?.length === 0">-</span>
      </el-table-column>
      <el-table-column label="成交" align="center">
        <el-table-column
          v-for="(item, index) in cloumsDates"
          :key="'three_' + index"
          :label="item + '月'"
          align="center"
          :min-width="200"
        >
          <template v-slot="{ row }">
            <div class="row-center" style="justify-content: space-between">
              <div class="title-text">GMV</div>
              <div class="text-value">{{ detailFormatValue('number', 'gmv', row, item) }}</div>
            </div>
            <div class="row-center" style="justify-content: space-between">
              <div class="title-text">销售单数</div>
              <div class="text-value">{{ detailFormatValue('number', 'dl', row, item) }}</div>
            </div>

            <div class="row-center" style="justify-content: space-between">
              <div class="title-text">客单价</div>
              <div class="text-value">{{ detailFormatValue('number', 'kdj', row, item) }}</div>
            </div>
          </template>
        </el-table-column>
        <span v-if="cloumsDates?.length === 0">-</span>
      </el-table-column>
      <el-table-column label="销售渠道占比" align="center">
        <el-table-column
          v-for="(item, index) in cloumsDates"
          :key="'four_' + index"
          :label="item + '月'"
          align="center"
          :min-width="200"
        >
          <template v-slot="{ row }">
            <div class="row-center" style="justify-content: space-between">
              <div class="title-text">自营直播</div>
              <div class="text-value"
                >{{ detailFormatValue('precentage', 'zySaleRate', row, item) }}
              </div>
            </div>
            <div class="row-center" style="justify-content: space-between">
              <div class="title-text">达人合作</div>
              <div class="text-value"
                >{{ detailFormatValue('precentage', 'hzSaleRate', row, item) }}
              </div>
            </div>

            <div class="row-center" style="justify-content: space-between">
              <div class="title-text">商品卡挂车</div>
              <div class="text-value"
                >{{ detailFormatValue('precentage', 'spkSaleRate', row, item) }}
              </div>
            </div>
          </template>
        </el-table-column>
        <span v-if="cloumsDates?.length === 0">-</span>
      </el-table-column>
      <el-table-column label="年龄分布" align="center">
        <el-table-column
          v-for="(item, index) in cloumsDates"
          :key="index"
          :label="item + '月'"
          align="center"
          :min-width="268"
        >
          <template v-slot="{ row }">
            <agePieChart :data="getChartData(row, item)" v-if="showTableMore" />
          </template>
        </el-table-column>
        <span v-if="cloumsDates?.length === 0">-</span>
      </el-table-column>
      <el-table-column label="人群分布" align="center">
        <el-table-column
          v-for="(item, index) in cloumsDates"
          :key="index"
          :label="item + '月'"
          :min-width="420"
          align="center"
        >
          <template v-slot="{ row }">
            <div class="row-center" v-if="showTableMore">
              <peopleLineChart
                :data="getChartData(row, item)"
                :width="JSON.stringify(getChartData(row, item)) !== '{}' ? 270 : 398"
              />
              <div class="people-box" v-if="JSON.stringify(getChartData(row, item)) !== '{}'">
                <div class="title mt10px">人群占比</div>
                <div class="row-center mt12px" style="justify-content: space-between">
                  <div class="title">Z世代</div>
                  <div class="info">{{ dealPeoplesData(row, 'crowdZ', item) }}</div>
                </div>
                <div class="row-center mt12px" style="justify-content: space-between">
                  <div class="title">小镇青年</div>
                  <div class="info">{{ dealPeoplesData(row, 'crowdXzqn', item) }}</div>
                </div>
                <div class="row-center mt12px" style="justify-content: space-between">
                  <div class="title">新锐白领</div>
                  <div class="info">{{ dealPeoplesData(row, 'crowdXrbl', item) }}</div>
                </div>
                <div class="row-center mt12px" style="justify-content: space-between">
                  <div class="title">精致妈妈</div>
                  <div class="info">{{ dealPeoplesData(row, 'crowdJzmm', item) }}</div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <span v-if="cloumsDates?.length === 0">-</span>
      </el-table-column>

      <template #empty>
        <div class="flex-column" style="align-items: center">
          <img class="empty-table" src="@/assets/imgs/promotion/empty.png" alt="" />
          <span>暂无数据</span>
        </div>
      </template>
    </el-table>
    <shopDrawer
      ref="shopDrawerRef"
      @update="(row: any) => shopEditDialogRef.open('edit', row)"
      @add="shopEditDialogRef.open('add')"
      @refresh="getList"
    />
    <shopEditDialog ref="shopEditDialogRef" @success="handleSuccess" />
  </ex-screen>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { cloneDeep } from 'lodash-es'
import * as douyinRefundGoodsManageApi from '@/api/channelData/douyinRefundGoodsManage'
import dayjs from 'dayjs'
import shopCard from './copmponents/shopCard.vue'
import { numberFormateShow } from '@/utils/formatter'
import agePieChart from './copmponents/agePieChart.vue'
import peopleLineChart from './copmponents/peopleLineChart.vue'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
import shopDrawer from './copmponents/shopDrawer.vue'
import shopEditDialog from './copmponents/shopEditDialog.vue'
import { tableHeadFixed } from '@/utils/tableHeadFixed'
import dynamicSearch from './copmponents/dynamicSearch.vue'
import StoreTreeCascader from '@/components/StoreTreeCascader/src/StoreTreeCascader.vue'

const searchConfig = [
  { label: '商品ID', value: 'goodsId' },
  { label: '商品名称', value: 'goodsName' },
  { label: '货品编码', value: 'goodsCode' }
]

tableHeadFixed(10)

const queryParams = ref<any>({
  store: undefined,
  goodsSearch: undefined,
  goodsCode: undefined,
  goodsType: 'women_pant', //分类
  times: []
})

const lastTimes = ref<any>()

const handleDisabledDate = (date: any) => {
  return dayjs(date).isAfter(dayjs(lastTimes.value || new Date()))
}

//默认过去六月
const getDefaultTimes = () => {
  return [
    dayjs(lastTimes.value).subtract(2, 'month').format('YYYY-MM'),
    lastTimes.value ? dayjs(lastTimes.value).format('YYYY-MM') : dayjs().format('YYYY-MM')
  ]
}

const getLastTimes = async () => {
  try {
    loading.value = true
    const data = await douyinRefundGoodsManageApi.getLastDate()
    lastTimes.value = data || new Date()
    queryParams.value.times = getDefaultTimes()
    getList()
  } catch (e) {
    loading.value = false
  } finally {
  }
}

const dealParams = (needPage: boolean = false) => {
  const params: any = cloneDeep(queryParams.value)
  Object.keys(params).forEach((key) => {
    if (params[key] === '' || params[key] === null) {
      delete params[key]
    }
  })
  if (params.times?.length === 2 && params.times[0] && params.times[1]) {
    params.dataDateStart = dayjs(params.times[0]).format('YYYY-MM')
    params.dataDateEnd = dayjs(params.times[1]).format('YYYY-MM')
  }
  delete params.times

  // 商品搜索（商品ID/名称/货品编码）
  if (params.goodsSearch?.field && params.goodsSearch?.value) {
    const { field, value } = params.goodsSearch
    params[field] = value
  }
  delete params.goodsSearch

  if (!needPage) {
    delete params.page
    delete params.size
  }
  return params
}

const resetQuery = () => {
  queryParams.value = {
    store: undefined,
    goodsSearch: undefined,
    goodsCode: undefined,
    goodsType: 'women_pant',
    times: getDefaultTimes()
  }
  getList()
}

const scheme = computed(() => [
  {
    field: 'store',
    label: '店铺',
    width: 260,
    labelWidth: 66,
    isCustom: true,
    componentProps: {
      platformFilter: ['Douyin']
    },
    customRender: () => StoreTreeCascader
  },
  {
    field: 'goodsSearch',
    label: '商品',
    width: 260,
    labelWidth: 66,
    isCustom: true,
    componentProps: {
      placeholder: '请输入商品ID/名称/货品编码',
      options: searchConfig
    },
    customRender: () => dynamicSearch
  },
  {
    field: 'goodsType',
    label: '分类',
    width: 220,
    labelWidth: 66,
    component: 'Select',
    options: getIntDictOptions(DICT_TYPE.DY_REFUND_PRODUCT_TYPE, true),
    componentProps: {
      placeholder: '请选择',
      filterable: true,
      clearable: false
    }
  },
  //   {
  //     field: 'goodsCode',
  //     label: '商品编码',
  //     width: 220,
  //     labelWidth: 66,
  //     component: 'Input',
  //     componentProps: {
  //       placeholder: '请输入商品编码',
  //       clearable: true
  //     }
  //   },
  {
    field: 'times',
    label: '数据月份',
    width: 220,
    labelWidth: 66,
    component: 'DatePicker',
    componentProps: {
      type: 'monthrange',
      rangeSeparator: '-',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      format: 'YYYY-MM',
      valueFormat: 'YYYY-MM',
      clearable: false,
      disabledDate: handleDisabledDate
    }
  }
])

const cloumsDates = ref<any>([])
const tableRef = ref<any>()
const list = ref<any[]>([])
const loading = ref(false)
const getList = async () => {
  loading.value = true
  showTableMore.value = false
  try {
    const data = await douyinRefundGoodsManageApi.getGoodsStaticList(dealParams())
    if (data?.length) {
      list.value = data
    } else {
      list.value = []
    }
    cloumsDates.value = dealCloumns(list.value)
  } finally {
    loading.value = false
    tableRef.value?.setScrollTop(0)
    tableRef.value?.setScrollLeft(0)
    console.log('数据返回')
    setTimeout(() => {
      showTableMore.value = true
    }, 1000)
  }
}

// el-table @scroll 占位（否则模板会报未定义）
const handleScroll = () => {}

//动态处理表头 - 以月份最多的为准
const dealCloumns = (data: any[]) => {
  if (data?.length === 0) return []
  const cloumns = new Set<any>([])
  data.forEach((item: any) => {
    item.monthStatVOList?.map((each) => {
      cloumns.add(each.dataDate)
    })
  })

  const reData: any[] = [...cloumns]
  reData.sort((a: any, b: any) => {
    return dayjs(b).isAfter(dayjs(a)) ? -1 : 1
  })

  return reData
}

const detailFormatValue = (type: 'precentage' | 'number', key: string, row: any, item: any) => {
  const val = row.monthStatVOList?.find((val: any) => val.dataDate === item) || null
  if (
    !val ||
    (val && (val[key] === null || val[key] === '')) ||
    !row.monthStatVOList ||
    !Array.isArray(row.monthStatVOList) ||
    row.monthStatVOList?.length === 0
  )
    return '-'

  switch (type) {
    case 'precentage':
      return val[key] + '%'
    case 'number':
      return numberFormateShow(val[key]) || 0
  }
}

const getChartData = (row: any, item: any) => {
  return row.monthStatVOList?.find((val: any) => val.dataDate === item) || {}
}

const formatPrcentageData = (data: any) => {
  if (data === null || data === '') return '-'
  if (!/^-?\d+(\.\d+)?$/.test(data) || (typeof data === 'string' && data.includes('%'))) return data
  let value = data + 0

  if (value < 1) {
    value = Number(value * 100).toFixed(2)
  }
  const numAttr = value.toString().split('.')
  if (numAttr.length > 1) {
    return Number(numAttr[1].slice(0, 2)) > 0
      ? `${numAttr[0]}.${numAttr[1].slice(0, 2)}%`
      : `${numAttr[0]}%`
  }

  return `${value}%`
}

const dealPeoplesData = (row: any, key: string, item: any) => {
  const val = row.monthStatVOList?.find((val: any) => val.dataDate === item) || null
  if (val) {
    return formatPrcentageData(val[key])
  }
  return '-'
}

const shopDrawerRef = ref()

const openGoodsDrawer = () => {
  shopDrawerRef.value?.open()
}

const shopEditDialogRef = ref()

const handleSuccess = () => {
  shopDrawerRef.value?.getList()
  getList()
}
const route = useRoute()
const title = ref<any>('')

onMounted(() => {
  title.value = route.meta.title
  getLastTimes()
})

const page = ref<any>({ page: 1 })
const onSearch = () => {
  getList()
}
const resetForm = () => {
  resetQuery()
}
provide('KeyGoodsComparisonForm', { page, onSearch, resetForm })

//---------- 简单优化图表导致的卡顿问题 -------------
const showTableMore = ref(false)
</script>

<style lang="scss" scoped>
.upload-time {
  :deep(.el-range-editor.el-input__wrapper) {
    padding: 0;
  }

  :deep(.el-date-editor) {
    width: 220px;
  }
}

.rule-form {
  & {
    --el-input-inner-height: 30px;
  }

  :deep(.el-form-item__label) {
    padding: 0 10px 0 0;
  }

  .each-form {
    margin-right: 20px;
    margin-bottom: 20px;
  }

  :deep(.SWFilterExpandAll-middle-text) {
    color: #666666;
  }

  :deep(.SWFilterExpandAll) {
    margin-bottom: 15px;
  }

  :deep(.el-input) {
    width: 220px !important;
  }

  :deep(.el-input__wrapper) {
    height: 30px;
    padding: 0 11px;
    box-shadow: none;
    border: 1px solid #e5e5e5;

    &:hover {
      box-shadow: none;
      border-color: #0064ff;
    }

    .is-focus {
      box-shadow: none;
      border-color: #0064ff;
    }
  }

  :deep(.el-input__inner) {
    height: 30px;
    line-height: 30px;
  }
}

.right-20 {
  margin-right: 20px !important;
}

.width-220 {
  width: 220px !important;
}

:deep(.refund-tips) {
  max-width: 335px;
}

.top-border {
  width: 100%;
  height: 1px;
  background-color: #e5e5e5;
}

.table-title {
  font-size: 16px;
  font-weight: 500;
  line-height: normal;
  color: #333333;
}

.text-value {
  font-size: 14px;
  font-weight: 500;
  color: #333333;
}

.title-text {
  font-size: 14px;
  color: #666666;
}

.SWCommonTable {
  .row-center + .row-center {
    margin-top: 9px;
  }
}

.people-box {
  width: calc(100% - 272px);
  height: 157px;
  padding-left: 10px;

  .title {
    line-height: 20px;
    font-size: 14px;
    color: #666666;
    text-align: left;
  }

  .info {
    font-weight: 500;
    line-height: 20px;
    font-size: 14px;
    color: #333333;
  }
}

.line-center {
  justify-content: space-between;
  padding: 0 12px;
}

.slid-bottom {
  padding-bottom: 10px;
  border-bottom: 1px dashed #d8d8d8;
}

:deep(.self-table-cell.no-padding-cell) {
  .cell {
    padding: 0;
  }
}

.new-btn-font {
  font-size: 14px;
}

:deep(.g-query) {
  .el-date-editor,
  .el-select,
  .el-cascader {
    width: 220px !important ;
    box-sizing: border-box;
  }
  .el-cascader__tags {
    right: 80px;
  }
}
:deep(.el-cascader__search-input) {
  display: inline-block !important;
  min-width: 0 !important;
}
</style>
