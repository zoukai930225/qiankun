<script setup lang="tsx">
import { reactive, ref, watch, onMounted, computed, nextTick } from 'vue'
import { FormSchema } from '@/types/form'
import GoodCard from './components/goodCard.vue'
import { ElPopover, ElIcon } from 'element-plus'
import dayjs from 'dayjs'
import { getNewestDay, getDyMarketList, getAllCategory } from '@/api/markrtData/dyMarket'
import { formatRangeWithUnifiedUnit, formatPercentRange } from '@/utils'
import { Top, Bottom } from '@element-plus/icons-vue'
import { senvenCloums } from './common'
// 搜索表单ref
const searchFormRef = ref()

// 当前选择的数据日期
const maxDataDate = ref('') // 最大数据统计日期（从接口获取后更新）

// 搜索表单数据
const searchForm = reactive({
  category: '女士内裤',
  dateType: '0',
  dataDate: [] as string[]
})

// 搜索表单配置
const searchSchema = ref<FormSchema[]>([
  {
    field: 'category',
    label: '类目',
    component: 'Select',
    componentProps: {
      placeholder: '请选择类目',
      clearable: true,
      options: []
    },
    value: '女士内裤'
  },
  {
    field: 'dateType',
    label: '数据维度',
    component: 'Select',
    componentProps: {
      clearable: false,
      placeholder: '请选择数据维度',
      options: [
        { label: '单日', value: '0' },
        { label: '7天', value: '7' },
        { label: '30天', value: '30' }
      ]
    },
    value: '0'
  },
  {
    field: 'dataDate',
    label: '统计时间',
    component: 'StatisticsDateRange',
    componentProps: {
      clearable: false,
      pickerType: 'date',
      diffField: 'dateType',
      placeholder: '选择时间',
      disabledDate: (time: Date) => {
        return maxDataDate.value ? time.getTime() > new Date(maxDataDate.value).getTime() : false
      }
    },
    value: ''
  }
])

// s-table 查询参数：由 searchForm 派生，包含 dateType、beginDate、category
// 多列排序状态（默认：排名 升序，排名跃升 降序）
type SortOrder = 'ascending' | 'descending'
type SortStateItem = { prop: string; order: SortOrder }
const sortStates = ref<SortStateItem[]>([{ prop: 'rankChange', order: 'descending' }])
const defaultSortStates: SortStateItem[] = [{ prop: 'rankChange', order: 'descending' }]

const requestParams = computed(() => {
  let endDate = ''
  if (searchForm.dataDate.length > 1) {
    endDate = searchForm.dataDate[1]
  }
  const orderMap: Record<SortOrder, string> = { ascending: 'asc', descending: 'desc' }
  const ranksState = sortStates.value.find((s) => s.prop === 'ranks')
  const rankChangeState = sortStates.value.find((s) => s.prop === 'rankChange')
  const ranksOrder = ranksState?.order
  const rankChangeOrder = rankChangeState?.order
  const currentTab = tabList.find((t) => t.name === activeName.value)
  const tabType = currentTab ? currentTab.value : tabList[0].value
  return {
    dateType: searchForm.dateType,
    beginDate: endDate,
    category: searchForm.category,
    tabType,
    rankSort: ranksOrder ? `ranks ${orderMap[ranksOrder]}` : '',
    rankChangeSort: rankChangeOrder ? `rank_change ${orderMap[rankChangeOrder]}` : ''
  }
})

// 搜索事件
const handleSearch = async (formData: any) => {
  Object.assign(searchForm, formData)
  await nextTick()
  tableRef.value?.refresh(true)
}

// 重置事件
const handleReset = async () => {
  // 重置到默认值
  Object.assign(searchForm, {
    category: '女士内裤',
    dateType: '0',
    dataDate: [maxDataDate.value, maxDataDate.value]
  })
  // 重置排序：排名 升序 + 排名跃升 降序
  sortStates.value = defaultSortStates.slice()

  tableRef.value?.resetSortToDefault()
}

// tabs（复用 tbMarket 的定义）
const tabList = [
  {
    title: '跃升50+',
    name: 'first',
    value: 1,
    titp: '该tab下展示，与上一统计周期相比，本统计周期排名跃升 ≥50 名的商品'
  },
  {
    title: '新晋前50',
    name: 'second',
    value: 2,
    titp: '该tab下展示，与上一统计周期相比，本统计周期新进入前50名的商品'
  },
  {
    title: '50再跃升10+',
    name: 'third',
    value: 3,
    titp: '该tab下展示，上一统计周期已经排名在前50，但本统计周期再次跃升10名以上的商品'
  },
  {
    title: '连续7日Top50',
    name: 'fourth',
    value: 4,
    titp: '该tab下展示连续7日排名都在Top50以内的商品，商品关键词、用户支付金额等指标取的统计日期的数据。'
  }
]
const activeName = ref(tabList[0].name)

async function handleTabClick() {
  // 这里可根据 activeName 刷新表格
  sortStates.value = defaultSortStates.slice()
  tableRef.value?.resetSortToDefault()
  await nextTick()
  tableRef.value?.refresh(true)
}

// s-table 相关
const tableRef = ref()

function toShop(url?: string) {
  if (!url) return
  window.open(url)
}

// 排序事件处理（多列排序）：直接使用 s-table 传入的 sorts
async function handleSortChange({ sorts }: any) {
  console.log('handleSortChange', sorts)
  const next = (Array.isArray(sorts) ? sorts : [])
    .filter((s) => s && s.prop && s.order)
    .map((s) => ({ prop: s.prop, order: s.order }))
  sortStates.value = next as SortStateItem[]
  await nextTick()
  tableRef.value?.refresh()
}

// 自定义表头：获取与设置排序
// 移除未使用的排序辅助函数（交由 s-table 内部处理）

// 统一使用公共工具：formatRangeWithUnifiedUnit、formatPercentRange

function addThousandsSeparatorsInString(input: string | number): string {
  const source = input == null ? '' : String(input)
  if (!source) return '-'
  return source.replace(/-?\d{4,}(?:\.\d+)?/g, (token) => {
    const [integerPart, decimalPart] = token.split('.')
    const negative = integerPart.startsWith('-')
    const absInteger = negative ? integerPart.slice(1) : integerPart
    const withCommas = absInteger.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return (negative ? '-' : '') + withCommas + (decimalPart ? '.' + decimalPart : '')
  })
}

// 列配置（基于 tbMarket 表格，使用 TSX customRender 简化渲染）
const allColumns = [
  {
    label: '排名',
    prop: 'ranks',
    width: 120,
    align: 'center',
    fixed: 'left',
    sortable: true
  },
  {
    label: '商品',
    prop: 'goodsId',
    minWidth: 200,
    customRender: ({ row }: any) => {
      return (
        <div class="flex items-center">
          <ElPopover placement="right" width={348} trigger="hover" showArrow={false} offset={20}>
            {{
              reference: () => (
                <div class="mr-8px">
                  <img class="w-42px h-42px rounded-4px" src={row.imageUrl} />
                </div>
              ),
              default: () => (
                <GoodCard
                  good={{
                    materialName: row.name || '-',
                    materialId: row.goodsId,
                    goodsImage: row.imageUrl,
                    channel: row.channel || '',
                    shopUrl: row.productDetailH5Url
                  }}
                />
              )
            }}
          </ElPopover>
          <div
            class="text-#0064ff text-14px leading-20px truncate cursor-pointer max-w-240px"
            onClick={() => toShop(row.productDetailH5Url)}
            title={row.name || '-'}
          >
            {row.name || '-'}
          </div>
        </div>
      )
    }
  },
  {
    label: '排名跃升',
    prop: 'rankChange',
    width: 120,
    align: 'center',
    sortable: true,
    defaultSort: 'desc',
    customRender: ({ row }: any) => {
      const changeNumber = Number(row.rankChange)
      const color = changeNumber > 0 ? '#F56C6C' : changeNumber < 0 ? '#67C23A' : '#909399'
      const Icon = changeNumber > 0 ? Top : changeNumber < 0 ? Bottom : null
      return (
        <span style={{ color, display: 'inline-flex', alignItems: 'center' }}>
          {Icon ? (
            <ElIcon style={{ marginRight: '4px' }}>
              <Icon />
            </ElIcon>
          ) : null}
          {Number.isFinite(changeNumber) ? Math.abs(changeNumber) : '-'}
        </span>
      )
    }
  },
  {
    label: '跃升轨迹',
    prop: 'rankTrack',
    width: 150,
    align: 'center'
  },
  {
    label: '商品关键词',
    prop: 'keyPointList',
    minWidth: 220,
    headerAlign: 'left',
    align: 'left',
    customRender: ({ row }: any) => {
      const list: string[] = String(row.keyPointList || '')
        .split(/[，,、\s]+/)
        .map((s) => s.trim())
        .filter(Boolean)
      if (!list.length) return <span>-</span>
      return (
        <div class="flex gap-8px flex-wrap">
          {list.map((item, index) => (
            <el-tag key={index} color="#EFF2FB">
              <span style={{ color: '#717DDF' }}>{item}</span>
            </el-tag>
          ))}
        </div>
      )
    }
  },
  {
    label: '店铺',
    prop: 'shopName',
    minWidth: 180,
    showOverflowTooltip: true,
    align: 'left',
    headerAlign: 'left',
    customRender: ({ row }: any) => {
      return (
        <div class="flex items-center cursor-pointer" onClick={() => toShop(row.shopUrl)}>
          {row.shopImage ? <img class="w-18px h-18px mr-8px" src={row.shopImage} /> : null}
          <div class="truncate flex-1">{row.shopTitle || row.shopName || '-'}</div>
        </div>
      )
    }
  },
  {
    label: '用户支付金额',
    prop: 'newPayCnt',
    minWidth: 160,
    align: 'center',
    customRender: ({ row }: any) => (
      <span>
        {addThousandsSeparatorsInString(
          formatRangeWithUnifiedUnit(row.newPayCnt, { inputUnit: 'fen' })
        )}
      </span>
    )
  },
  {
    label: '点击次数',
    prop: 'productClickCnt',
    minWidth: 150,
    align: 'center',
    customRender: ({ row }: any) => (
      <span>{addThousandsSeparatorsInString(formatRangeWithUnifiedUnit(row.productClickCnt))}</span>
    )
  },
  {
    label: '成交件数',
    prop: 'payComboCnt',
    minWidth: 150,
    align: 'center',
    customRender: ({ row }: any) => (
      <span>{addThousandsSeparatorsInString(formatRangeWithUnifiedUnit(row.payComboCnt))}</span>
    )
  },
  {
    label: '点击成交转换率',
    prop: 'productClickPayCntRatio',
    minWidth: 170,
    align: 'center',
    customRender: ({ row }: any) => <span>{formatPercentRange(row.productClickPayCntRatio)}</span>
  }
]
const columns = computed(() =>
  activeName.value === 'fourth' ? senvenCloums(toShop, addThousandsSeparatorsInString) : searchForm.dateType === '0' ? allColumns : allColumns.filter((c: any) => c.prop !== 'rankTrack')
)

// 组件初始化
async function getLatestDay() {
  try {
    const latest = await getNewestDay()
    if (latest) {
      const dateStr = dayjs(latest).format('YYYY-MM-DD')
      const dataDateSchema = searchSchema.value.find((item) => item.field === 'dataDate')
      if (dataDateSchema) dataDateSchema.value = dateStr
      searchForm.dataDate = [dateStr, dateStr]
      maxDataDate.value = dateStr
    }
  } catch (e) {
    console.log(e)
  }
}
onMounted(() => {
  // 初始化统计日期范围显示
  getLatestDay().then(() => {
    nextTick(() => {
      tableRef.value?.refresh(true)
    })
  })
  initSelectOptions()
})

// 选项初始化
const initSelectOptions = async () => {
  try {
    const res = await getAllCategory()

    const toOptions = (arr: string[]) =>
      (Array.isArray(arr) ? arr : []).map((s) => ({ label: s, value: s }))

    const categroyOptions = toOptions(res as unknown as string[])

    const categroySchema = searchSchema.value.find((s) => s.field === 'category')
    if (categroySchema) {
      categroySchema.componentProps = {
        ...(categroySchema.componentProps || {}),
        options: categroyOptions
      }
    }

  } catch (error) {
    console.error('初始化下拉选项失败', error)
  }
}
</script>

<template>
  <content-wrap>
    <s-w-search-form :schema="searchSchema" @search="handleSearch" @reset="handleReset" ref="searchFormRef"
      auto-search-on-change show-reset-button :show-search-button="false" />

    <!-- tabs（来自 tbMarket） -->
    <el-tabs v-model="activeName" class="mt-12px" @tab-click="handleTabClick">
      <el-tab-pane :label="item.title" :name="item.name" v-for="item in tabList" :key="item.name">
        <template #label>
          <div class="flex items-center">
            <div>{{ item.title }}</div>
            <el-popover :content="item.titp" :width="300">
              <template #reference>
                <div class="h-19px pl-5px flex items-center">
                  <el-icon color="#cccccc" size="14">
                    <QuestionFilled />
                  </el-icon>
                </div>
              </template>
            </el-popover>
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>

    <!-- 表格（使用 s-table 代替） -->
    <div class="mt-8px">
      <s-table ref="tableRef" stripe class="s-table" :columns="columns" :fetch="getDyMarketList"
        :fetch-params="requestParams" :auto-load="false" :sort-change="handleSortChange" :showPagination="true"
        :showOverflowTooltip="true" sortMultiple sortExclusive />
    </div>
  </content-wrap>
</template>

<style scoped>
.sort-header {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.sort-icons {
  display: inline-flex;
  flex-direction: column;
  margin-left: 4px;
  line-height: 10px;
}

.sort-icons :deep(.el-icon) {
  color: #c0c4cc;
  font-size: 12px;
}

.sort-icons :deep(.el-icon.active) {
  color: #409eff;
}
</style>
