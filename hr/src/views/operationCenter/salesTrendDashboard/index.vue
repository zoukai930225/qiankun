<template>
  <flux-wrap ref="pageContainer" id="operation-center-sales-trend-dashboard">
    <template #header>
      <s-w-search-form :schema="schema" @search="onSearch" @reset="onReset" auto-search-on-change
        :show-expand="false" />
    </template>
    <section class="sales-trend-dashboard" v-loading="loading">
      <!-- 新品/老品切换标签 -->
      <div class="product-tabs position-relative">
        <el-tabs v-model="activeTab" @tab-change="onTabChange">
          <el-tab-pane name="new">
            <template #label>
              <div class="tab-label">
                <span>新品</span>
                <el-tooltip content="上架时间在30天内的商品" placement="top">
                  <el-icon size="13" color="#aaaaaa" class="question-icon">
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane name="old">
            <template #label>
              <div class="tab-label">
                <span>老品</span>
                <el-tooltip content="上一个月的月销量大于10000的商品，且上架时间大于30天的" placement="top">
                  <el-icon size="13" color="#aaaaaa" class="question-icon">
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-tab-pane>
        </el-tabs>
        <!-- <div class="extra-info">
          <div class="extra-info-item mr-20px">
            <span class="extra-info-item-label">数据统计日期：</span>
            <span class="extra-info-item-value">{{ newestDate || '-' }}</span>
          </div>
          <div class="extra-info-item flex items-baseline">
            <span class="extra-info-item-label mr-4px">梯队等级</span>
            <el-tooltip v-model="showTooltip" placement="bottom" effect="dark" class="bg-black/75"
              style="background: rgba(0, 0, 0, 0.75)" :append-to="pageContainer">
              <template #content>
                <div class="legend-tooltip w-240px text-14px p-4px">
                  <div v-for="(item, index) in echelonTooltipItems" :key="index"
                    class="tooltip-row flex items-center justify-between"
                    :class="{ 'mb-10px': index !== echelonTooltipItems.length - 1 }">
                    <div>
                      <i class="inline-block w-10px h-10px rounded-full mr-4px"
                        :style="{ backgroundColor: item.color }"></i>
                      <span class="label">{{ item.label }}</span>
                    </div>
                    <div>
                      <span class="desc">{{ item.text }}</span>
                    </div>
                  </div>
                </div>
              </template>
              <el-icon size="13" color="#aaaaaa" class="question-icon">
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </div>
        </div> -->
      </div>
      <ul class="product-list">
        <template v-if="list.length">
          <li class="product-item" v-for="item in list" :key="item.goodsId || item.id || item.goodsName">
            <div>
              <primary-card :item="item" :is-new="activeTab === 'new'" />
            </div>
            <!-- <div
              class="clickable"
              @click="
                () =>
                  openTrendCard({ title: '近30日销量走势', legendName: '销量', item, code: '1' })
              "
            >
              <mini-trend-chart
                mode="single"
                title="近30日销量走势"
                name1="销量"
                :x-data="xOf(item, 'saleList')"
                :y-data="yOf(item, 'saleList')"
                :totals="[formatIntegerTotal(pv(item).sale)]"
              />
            </div> -->
            <div class="clickable" @click="
              () => openTrendCard({ title: '支付件数', legendName: '支付件数', item, code: '2' })
            ">
              <mini-trend-chart mode="single" title="支付件数" name1="支付件数" :x-data="xOf(item, 'payCountList')"
                :y-data="yOf(item, 'payCountList')" :totals="[formatIntegerTotal(pv(item).payCount)]" />
            </div>
            <div class="clickable" @click="
              () =>
                openTrendCard({
                  title: '搜索访客转化率',
                  legendName: '搜索访客数',
                  item,
                  legendName2: '搜索支付转化率',
                  code: '3'
                })
            ">
              <mini-trend-chart mode="double" title="搜索访客转化率" name1="搜索访客数" name2="搜索支付转化率"
                :x-data="xOf(item, 'searchVisitorCountList')" :y-data="yOf(item, 'searchVisitorCountList')"
                :y2-data="yPercentOf(item, 'searchPayRateList')" :totals="[
                  formatIntegerTotal(pv(item).searchVisitorCount),
                  formatPercentWithSuffix(pv(item).searchPayRate)
                ]" :y2-is-percent="true" />
            </div>
            <div class="clickable" @click="
              () =>
                openTrendCard({
                  title: '付费访客转化率',
                  legendName: '付费访客数',
                  item,
                  legendName2: '付费支付转化率',
                  code: '4'
                })
            ">
              <mini-trend-chart mode="double" title="付费访客转化率" name1="付费访客数" name2="付费支付转化率"
                :x-data="xOf(item, 'payVisitorCountList')" :y-data="yOf(item, 'payVisitorCountList')"
                :y2-data="yPercentOf(item, 'payRateList')" :totals="[
                  formatIntegerTotal(pv(item).payVisitorCount),
                  formatPercentWithSuffix(pv(item).payRate)
                ]" :y2-is-percent="true" />
            </div>
            <div class="clickable" @click="
              () => openTrendCard({ title: '付费占比', legendName: '付费占比', item, code: '5' })
            ">
              <mini-trend-chart mode="single" title="付费占比" name1="付费占比" :x-data="xOf(item, 'refundRateList')"
                :y-data="yPercentTimes100Of(item, 'refundRateList')"
                :totals="[formatPercentTimes100WithSuffix(pv(item).refundRate)]" :y1-is-percent="true" />
            </div>
          </li>
        </template>
        <template v-else>
          <Empty />
        </template>
      </ul>
    </section>
    <template #footer>
      <div>
        <pagination :total="total" v-model:page="queryParams.page" v-model:limit="queryParams.size"
          :page-sizes="[10, 20, 25, 30, 50, 100]" @pagination="onPagination" />
      </div>
    </template>
  </flux-wrap>
</template>
<script lang="tsx" setup>
import { ref, reactive, defineAsyncComponent, onMounted, nextTick } from 'vue'
import { QuestionFilled } from '@element-plus/icons-vue'
import type { FormSchema } from '@/types/form'
import { FluxWrap } from '@/components/ContentWrap'
import Pagination from '@/components/SWTable/src/SPagination.vue'
import PrimaryCard from './components/primaryCard.vue'
import MiniTrendChart from './components/miniTrendChart.vue'
import { useDialog } from '@/hooks/web/useDialog'
import { getLastDate, getProductPageList } from '@/api/operationCenter/salesTrendDashboard'
import dayjs from 'dayjs'
import Empty from '@/components/SWTable/src/empty.vue'
import { ElTooltip, ElIcon } from 'element-plus'
import { queryStoreTree } from '@/api/common'

// 页面容器引用
const pageContainer = ref<HTMLElement>()

// 当前激活的标签
const activeTab = ref('new')

const showTooltip = ref(true)
const list = ref<any[]>([])

// 最新统计日期
const newestDate = ref<string>('')

function getDates(list: Array<{ statDate?: string }> | undefined): string[] {
  return (list || []).map((d) => (d?.statDate || '').slice(5))
}
// 统一的数值清洗：去除千分位分隔符、空格等
function toNumber(val: string | number | null | undefined): number {
  if (val == null) return 0
  if (typeof val === 'number') return Number.isFinite(val) ? val : 0
  const cleaned = String(val).replace(/[，,\s\u00A0\u202F]/g, '')
  const n = Number(cleaned)
  return Number.isNaN(n) ? 0 : n
}
function getValues(list: Array<{ value?: string | number }> | undefined): number[] {
  return (list || []).map((d: any) => toNumber(d?.value))
}
function getPercentValues(list: Array<{ value?: string | number | null }> | undefined): number[] {
  return (list || []).map((d: any) => {
    const raw = d?.value
    const str =
      raw == null
        ? ''
        : String(raw)
          .replace('%', '')
          .replace(/[，,\s\u00A0\u202F]/g, '')
    const n = Number(str)
    return Number.isNaN(n) ? 0 : n
  })
}

function getPercentTimes100Values(
  list: Array<{ value?: string | number | null }> | undefined
): number[] {
  return (list || []).map((d: any) => {
    const raw = d?.value
    const rawStr = raw == null ? '' : String(raw)
    const cleaned = rawStr.replace('%', '').replace(/[，,\s\u00A0\u202F]/g, '')
    const n = Number(cleaned)
    if (Number.isNaN(n)) return 0
    const hasPercent = rawStr.includes('%')
    const shouldTimes100 = !hasPercent && Math.abs(n) <= 1
    return shouldTimes100 ? n * 100 : n
  })
}
// 销量总计：去除小数部分
function formatIntegerTotal(val: string | number | null | undefined): number {
  const n = toNumber(val)
  return Math.trunc(n)
}

function pv(it: any): any {
  return (it && (it as any).productValueVO) || {}
}
function xOf(it: any, key: string): string[] {
  return getDates((pv(it) as any)[key] as any)
}
function yOf(it: any, key: string): number[] {
  return getValues((pv(it) as any)[key] as any)
}
function yPercentOf(it: any, key: string): number[] {
  return getPercentValues((pv(it) as any)[key] as any)
}
function yPercentTimes100Of(it: any, key: string): number[] {
  return getPercentTimes100Values((pv(it) as any)[key] as any)
}
// 分页相关
const total = ref(0)
const queryParams = reactive({ page: 1, size: 10, keyword: '', level: '', isNew: true, store: undefined as string[] | undefined, statTime: '' as string })
// 店铺选项
const storeOptions = ref<any[]>([])
// 等待一次完整渲染帧，确保 loading 蒙层有机会绘制
const waitForPaint = async () => {
  await nextTick()
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
}
// 将选择的店铺值转换为仅包含子级店铺的逗号分隔字符串
function toLeafStoreCodesString(val: any): string | undefined {
  if (val == null) return undefined
  const arr = Array.isArray(val) ? val : [val]
  // 兼容 emitPath=true 的情况，取路径最后一段
  const normalized = arr
    .map((v: any) => (Array.isArray(v) ? v[v.length - 1] : v))
    .filter((v: any) => typeof v === 'string' && v)
  if (!normalized.length) return undefined
  // 顶层平台代码集合（如 TaoBao、Tmall）
  const parentCodes = new Set(
    (storeOptions.value || [])
      .map((p: any) => p && p.storeCode)
      .filter((c: any) => typeof c === 'string' && c)
  )
  // 过滤掉顶层平台，只保留子级门店的 storeCode
  const leafCodes = normalized.filter((code: string) => !parentCodes.has(code))
  // 如果用户只选了顶层（极端配置下可能发生），则退化为使用 normalized
  const finalCodes = leafCodes.length ? leafCodes : normalized
  return finalCodes.length ? finalCodes.join(',') : undefined
}
const loading = ref(false)
const getList = async () => {
  loading.value = true
  await waitForPaint()
  try {
    const params: any = {
      page: queryParams.page,
      size: queryParams.size,
      keyword: queryParams.keyword,
      level: queryParams.level ? Number(queryParams.level) : undefined,
      isNew: queryParams.isNew,
      statTime: queryParams.statTime || newestDate.value,
      store: toLeafStoreCodesString(queryParams.store)
    }
    const data: any = await getProductPageList(params).catch(() => { })
    if (data) {
      list.value = data.records || []
      total.value = data.total || 0
    }
  } finally {
    loading.value = false
  }
}
const onPagination = (e: { page: number; limit: number }) => {
  queryParams.page = e?.page ?? 1
  queryParams.size = e?.limit ?? queryParams.size
  getList()
}

// 梯队等级 Tooltip 列表（按产品定义可调整）
type EchelonTooltipItem = { label: string; color: string; text: string }
const echelonTooltipItems: EchelonTooltipItem[] = [
  { label: 'A级', color: '#20C25F', text: '20000≥月销量>10000' },
  { label: 'S级', color: '#0064FF', text: '30000≥月销量>20000' },
  { label: 'S+级', color: '#9737EB', text: '50000≥月销量>30000' },
  { label: 'SS+级', color: '#FF9221', text: '100000≥月销量>50000' },
  { label: 'SSS+级', color: '#EA0000', text: '月销量>100000' }
]

// 梯队等级选项（level 入参：1->A, 2->S, 3->S+, 4->SS+, 5->SSS+）
const echelonOptions = [
  { label: 'A', value: '1' },
  { label: 'S', value: '2' },
  { label: 'S+', value: '3' },
  { label: 'SS+', value: '4' },
  { label: 'SSS+', value: '5' }
]

// 搜索表单 schema
const schema = ref<FormSchema[]>([
  {
    field: 'store',
    label: '店铺',
    component: 'Cascader',
    labelWidth: 'auto',
    componentProps: {
      options: storeOptions.value,
      collapseTags: true,
      props: { multiple: true, value: 'storeCode', label: 'shopName', children: 'stores', emitPath: false },
      clearable: true,
      filterable: true,
      placeholder: '请选择店铺',
      onChange: (val: any) => {
        queryParams.store = Array.isArray(val) ? (val.length ? val : undefined) : (val || undefined)
      },
      onClear: () => {
        queryParams.store = undefined
      }
    },
    value: []
  },
  {
    field: 'keyword',
    label: '商品',
    component: 'Input',
    labelWidth: 'auto',
    componentProps: {
      placeholder: '商品ID/名称/货品编码'
    },
    value: ''
  },
  {
    field: 'level',
    label: '梯队等级',
    component: 'Select',
    componentProps: {
      placeholder: '请选择梯队等级',
      options: echelonOptions
    },
    class: 'level',
    value: '',
    renderLabel: (_item, _model) => (
      <div class="flex items-center">
        <div>梯队等级</div>
        <ElTooltip
          appendTo="body"
          placement="bottom"
          effect="dark"
          class="bg-black/75"
        >
          {{
            content: () => (
              <div class="legend-tooltip w-240px text-14px p-4px">
                {echelonTooltipItems.map((item, index) => (
                  <div
                    key={index}
                    class={`tooltip-row flex items-center justify-between ${index !== echelonTooltipItems.length - 1 ? 'mb-10px' : ''
                      }`}
                  >
                    <div>
                      <i
                        class="inline-block w-10px h-10px rounded-full mr-4px"
                        style={{ backgroundColor: item.color }}
                      ></i>
                      <span class="label" style={{ color: '#fff', fontWeight: 600, marginRight: '16px' }}>
                        {item.label}
                      </span>
                    </div>
                    <div>
                      <span class="desc" style={{ color: '#fff' }}>{item.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            ),
            default: () => (
              <div>
                <ElIcon size={13} color="#aaaaaa" class="question-icon ml-4px">
                  <QuestionFilled />
                </ElIcon>
              </div>
            )
          }}
        </ElTooltip>
      </div>
    )
  },
  {
    field: 'statTime',
    label: '统计时间',
    component: 'StatisticsDateRange',
    componentProps: {
      pickerType: 'date',
      clearable: false,
      initValue: newestDate.value,
      disabledDate: (time: Date) => {
        const nd = newestDate.value
        if (!nd) return false
        return dayjs(time).isAfter(dayjs(nd))
      }
    },
    value: []
  }
])

// 事件
const onSearch = (formModel: Record<string, any>) => {
  queryParams.keyword = formModel.keyword || ''
  queryParams.level = formModel.level || ''
  queryParams.store = Array.isArray(formModel.store)
    ? (formModel.store.length ? formModel.store : undefined)
    : (formModel.store || undefined)
  // 统计日期为单点日期组件，对外值为数组，取最后一个为当日
  if (Array.isArray(formModel.statTime)) {
    const last = formModel.statTime[formModel.statTime.length - 1]
    queryParams.statTime = last || ''
  } else {
    queryParams.statTime = formModel.statTime || ''
  }
  queryParams.page = 1
  getList()
}

const onReset = () => {
  queryParams.page = 1
  queryParams.size = 10
  // queryParams.store = undefined
  // queryParams.statTime = ''
  // queryParams.keyword = ''
  // queryParams.level = ''
  // getList()
}

// 标签切换事件
const onTabChange = (tabName: string) => {
  queryParams.isNew = tabName === 'new'
  queryParams.page = 1
  getList()
}

// 打开趋势弹框
const { openDialog } = useDialog()
const TrendDialog = defineAsyncComponent(() => import('./components/trendDialog.vue'))

onMounted(async () => {
  try {
    const d: any = await getLastDate().catch(() => '')
    newestDate.value = typeof d === 'string' ? d : ''
    // 设置统计时间控件默认值为 newestDate
    const statField = schema.value.find((it) => it.field === 'statTime')
    if (statField && statField.componentProps) {
      ; (statField.componentProps as any).initValue = newestDate.value
    }
    // 加载店铺树
    const res: any = await queryStoreTree({ isPermission: 2 }).catch(() => [])
    if (Array.isArray(res)) {
      // 兼容接口字段：若顶层有 platFormId/platFormName，转换为 storeCode/shopName
      const normalize = (nodes: any[]): any[] => {
        return (nodes || []).map((n) => {
          const node: any = { ...n }
          if ('platFormId' in node) node.storeCode = node.platFormId
          if ('platFormName' in node) node.shopName = node.platFormName
          if (Array.isArray(node.stores)) node.stores = normalize(node.stores)
          if (Array.isArray(node.children)) node.stores = normalize(node.children)
          return node
        })
      }
      const normalized = normalize(res)
      // 仅保留淘宝、天猫
      storeOptions.value = normalized.filter((p: any) => ['TaoBao', 'Tmall'].includes(p.storeCode))
      // 确保搜索表单的级联选项在加载后刷新
      const storeField = schema.value.find((it) => it.field === 'store')
      if (storeField && storeField.componentProps) {
        ; (storeField.componentProps as any).options = storeOptions.value
      }
    }
  } finally {
    await getList()
  }
})

function addDaysFromDateStr(dateStr: string, deltaDays: number): string {
  if (!dateStr) return ''
  const d = dayjs(dateStr)
  if (!d.isValid()) return ''
  return d.add(deltaDays, 'day').format('YYYY-MM-DD')
}

function openTrendCard({
  title,
  legendName,
  item,
  code,
  legendName2
}: {
  title: string
  legendName: string
  item: any
  code?: string | number
  legendName2?: string
}) {
  openDialog({
    title,
    width: '1060px',
    content: TrendDialog,
    props: {
      legendName,
      legendName2,
      productId: item?.goodsId || item?.id || item?.name || '',
      code,
      defaultEndDate: newestDate.value,
      defaultStartDate: newestDate.value ? addDaysFromDateStr(newestDate.value, -29) : ''
    },
    showConfirmFooter: false
  })
}

// 数字转百分号字符串：仅追加 %，不做乘以 100
function formatPercentWithSuffix(val: string | number | null | undefined): string {
  const str = val == null ? '' : String(val)
  // 如果已经带有 % 则直接规范化返回
  if (str.includes('%')) {
    const cleaned = str.replace(/\s/g, '')
    return cleaned
  }
  const n = toNumber(str)
  if (!Number.isFinite(n)) return '-'
  return `${n}%`
}

// 数字/字符串 -> 百分比字符串：必要时乘以 100 再追加 %
function formatPercentTimes100WithSuffix(val: string | number | null | undefined): string {
  const rawStr = val == null ? '' : String(val)
  const hasPercent = rawStr.includes('%')
  const cleaned = rawStr.replace('%', '').replace(/[，,\s\u00A0\u202F]/g, '')
  const n = Number(cleaned)
  if (Number.isNaN(n)) return '-'
  const shouldTimes100 = !hasPercent && Math.abs(n) <= 1
  const v = shouldTimes100 ? n * 100 : n
  // 保留最多两位小数并去掉多余的 0
  const strNum = (Math.round(v * 100) / 100).toString()
  return `${strNum}%`
}
</script>
<style scoped lang="scss">
* {
  box-sizing: border-box;
}

.sales-trend-dashboard {
  & {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .product-tabs {
    .tab-label {
      display: flex;
      align-items: center;
      gap: 4px;

      .question-icon {
        font-size: 12px;
        color: #909399;
      }
    }
  }

  .extra-info {
    position: absolute;
    right: 0;
    top: 14px;
    color: #333;
    display: flex;
    font-size: 14px;
    align-items: center;

    .date {
      margin-right: 6px;
    }
  }

  /* Tooltip 内容样式（使用 :deep 以支持传送到 body 的内容） */
  :deep(.legend-tooltip) {
    min-width: 320px;
  }

  :deep(.legend-tooltip .tooltip-row) {
    display: flex;
    align-items: center;
    line-height: 26px;
    white-space: nowrap;
  }

  :deep(.legend-tooltip .dot) {
    width: 10px;
    height: 10px;
    display: inline-block;
    border-radius: 50%;
    margin-right: 8px;
  }

  :deep(.legend-tooltip .label) {
    font-weight: 600;
    margin-right: 16px;
    color: #fff;
  }

  :deep(.legend-tooltip .desc) {
    color: #fff;
  }

  .product-list {
    list-style: none;
    padding-top: 4px;
    padding-right: 4px;
    margin: 0;
    margin-bottom: 20px;
    flex: 1;
    height: 0;
    overflow-x: visible;
    overflow-y: auto;

    .product-item {
      display: flex;
      gap: 10px;
      height: 178px;
      justify-content: space-between;
      position: relative;
      overflow: visible;

      &:not(:first-child) {
        margin-top: 20px;
      }

      >div {
        width: 208px;
        border-radius: 4px;
        border: 1px solid #e5e5e5;
        flex-shrink: 0;
        // min-width: 150px;
      }

      >div:nth-child(1) {
        min-width: 540px;
        flex: 1;
        width: 0;
      }

      // hover 效果：除了第一个 div，其余卡片 hover 时提升 z 轴并显示阴影
      >div:not(:first-child) {
        position: relative;
        background-color: #fff;
        transition:
          transform 0.2s ease,
          box-shadow 0.2s ease,
          border-color 0.2s ease;
        will-change: transform, box-shadow;
        transform: translateZ(0);
        cursor: pointer;
      }

      >div:not(:first-child):hover {
        z-index: 5;
        transform: translateY(-4px);
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
      }
    }
  }
}

::deep(.flux-footer) {
  box-shadow: 10px -5px 10px 0px rgba(0, 0, 0, 0.03);
}


:deep(.sw-search) {
  .el-form {
    .el-form-item.level {
      .el-form-item__label {
        width: auto !important;
      }
    }

    .el-cascader__tags {

      .el-tag {
        max-width: 70%;
      }

      .el-cascader__search-input {
        position: absolute;
        top: -8px;
      }
    }


    // .el-form-item__label {
    //   pointer-events: auto !important;
    // }
  }
}
</style>
