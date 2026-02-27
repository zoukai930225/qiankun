<template>
  <flux-wrap>
    <template #header>
      <div class="header-wrap mb-16px">
        <section-title-header>客诉汇总看板</section-title-header>
      </div>
      <s-w-search-form
        ref="searchFormRef"
        :schema="searchSchema"
        :show-search-button="false"
        :show-reset-button="true"
        auto-search-on-change
        @search="onSearch"
        @reset="onReset"
      >
        <el-button type="primary" :loading="exportLoading" @click="exportData">
          <el-image :src="UploadIcon" class="mr-4px" />
          导出
        </el-button>
      </s-w-search-form>
    </template>

    <div ref="exportAreaRef" class="h-full">
      <s-table
        id="customer-complaint-summary-dashboard-table"
        ref="tableRef"
        :columns="tableColumns"
        :data="tableData"
        :show-pagination="false"
        header-align="center"
        align="center"
        :header-row-class-name="headerRowClassName"
        :span-method="spanMethod"
        :cell-class-name="cellClassName"
        :loading="loading"
      />
    </div>
  </flux-wrap>
</template>
<script lang="tsx" setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import type { FormSchema } from '@/types/form'
import { useMessage } from '@/hooks/web/useMessage'
import UploadIcon from '@/assets/svgs/upload.svg'
import type { TableColumn } from '@/components/SWTable/src/table'
import dayjs from 'dayjs'
import { getCustomerComplaintSummaryDashboard } from '@/api/customerService/customerComplaintSummaryDashboard'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { MultiTableExportUtil } from '@/utils/exportImg'

const message = useMessage()

const searchFormRef = ref()
const exportLoading = ref(false)
const exportAreaRef = ref<HTMLElement | null>(null)
const tableRef = ref<HTMLElement | null>(null)
const loading = ref(false)
const defaultMonthRange = [
  dayjs().startOf('month').format('YYYY-MM-DD'),
  dayjs().endOf('month').format('YYYY-MM-DD')
]

// 查询参数（根据后端入参随时扩展）
const queryParams = ref({
  feedbackDateStart: defaultMonthRange[0],
  feedbackDateEnd: defaultMonthRange[1]
})

// 复用表头标题，导出文件名同样使用该值
const bigHeaderTitle = computed(() => {
  const start = queryParams.value.feedbackDateStart || defaultMonthRange[0]
  const end = queryParams.value.feedbackDateEnd || defaultMonthRange[1]
  return `${start} ~ ${end} 客诉问题专项反馈解决表汇总明细`
})

const searchSchema: Array<FormSchema> = [
  {
    field: 'feedbackDate',
    label: '反馈日期',
    component: 'DatePicker',
    componentProps: {
      type: 'daterange',
      rangeSeparator: '至',
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间',
      valueFormat: 'YYYY-MM-DD',
      format: 'YYYY-MM-DD',
      clearable: false
    },
    value: defaultMonthRange
  }
]

// 仅为第二行（汇总/分组那行）表头添加特殊类名
const headerRowClassName = ({ rowIndex }: any) => {
  return rowIndex === 1 ? 'header-row-class-name summary-header-row' : 'header-row-class-name'
}

// 表头（分组表头示例，可按需增删改动）
const tableColumns = computed<TableColumn[]>(() => [
  {
    prop: 'bigHeader',
    customRenderHeader: () => {
      return (
        <div style="position: relative">
          <div style="position: absolute; top: 0; left: 0; display: flex;  gap: 20px;font-size: 14px;color: #666">
            <div style="display: flex; align-items: center;">
              <span style="display: inline-block; width: 16px; height: 16px; background-color: #FFB7B7;border: 1px solid #E5E5E5; box-sizing:border-box"></span>
              <span style="display: inline-block; margin-left: 10px;">第一名</span>
            </div>
            <div style="display: flex; align-items: center;">
              <span style="display: inline-block; width: 16px; height: 16px; background-color: #FABF8E;border: 1px solid #E5E5E5; box-sizing:border-box"></span>
              <span style="display: inline-block; margin-left: 10px;">第二名</span>
            </div>
            <div style="display: flex; align-items: center;">
              <span style="display: inline-block; width: 16px; height: 16px; background-color: #FCEFC3;border: 1px solid #E5E5E5; box-sizing:border-box"></span>
              <span style="display: inline-block; margin-left: 10px;">第三名</span>
            </div>
          </div>
          <div class="text-#333 text-16px font-500">{bigHeaderTitle.value}</div>
        </div>
      )
    },
    children: [
      {
        label: '汇总',
        prop: 'summaryGroup',
        children: [
          {
            label: '问题处理部门',
            prop: 'handleDept',
            minWidth: 130
          }
        ]
      },
      {
        label: '37',
        prop: '37',
        customRenderHeader: () => <div>{totalFeedback.value ?? '-'}</div>,
        children: [
          { prop: 'deptFeedbackQty', label: '部门反馈数量', minWidth: 130 },
          { prop: 'deptPercent', label: '占比', minWidth: 90 },
          { prop: 'category', label: '品类', minWidth: 250 },
          { prop: 'categoryCount', label: '品类计数', minWidth: 100 },
          { prop: 'categoryDeptRatio', label: '品类占各部门问题反馈占比', minWidth: 230 },
          { prop: 'problemType', label: '问题反馈类型', width: 180 },
          { prop: 'problemFeedbackQty', label: '问题反馈数', minWidth: 120 },
          { prop: 'typeDeptRatio', label: '反馈类型占各部门反馈类型占比', minWidth: 230 },
          { prop: 'status', label: '状态', minWidth: 86 },
          { prop: 'statusCount', label: '状态计数', width: 100 },
          { prop: 'deptCloseRate', label: '各部门完结率', width: 120 },
          { prop: 'completedDayNum', label: '24小时完成数', width: 180 },
          { prop: 'completedDayRate', label: '24小时完成率', width: 180 },
          { prop: 'deptCompletedDayNum', label: '24小时部门完成量', width: 220 },
          { prop: 'deptCompletedDayRate', label: '24小时部门完成率', width: 220 }
        ]
      }
    ]
  }
])

// 使用字典生成状态标签，避免硬编码
const STATUS_LABELS = computed(() => {
  const options = getIntDictOptions(DICT_TYPE.CS_PROBLEM_FEEDBACK_STATUS, true)
  const pick = (candidates: string[]): string => {
    for (const c of candidates) {
      const found = options.find((o) => o.label === c)
      if (found) return found.label
    }
    return candidates[0]
  }
  return {
    noStarted: pick(['待开始', '未开始']),
    inProgress: pick(['进行中']),
    completed: pick(['已完成'])
  }
})

// 表格数据由接口驱动，初始化为空
const tableData = ref<Array<Record<string, any>>>([])

// 总反馈数（用于分组表头“37”的位置）
const totalFeedback = ref<number | string>(0)

// 生成百分比字符串
function formatPercent(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === '') return '-'
  const num = typeof value === 'number' ? value : parseFloat(String(value))
  if (Number.isNaN(num)) return String(value)
  return `${Number(num.toFixed(2))}%`
}

// 清理导出文件名中的非法字符（Windows/macOS 通用）
function sanitizeFileName(name: string) {
  return String(name)
    .replace(/[\\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
}

// 根据接口结果拍平成行并生成合并信息
function buildRowsFromApi(data: any): Array<Record<string, any>> {
  const rows: Array<Record<string, any>> = []
  // 兼容直接返回 data 或 { data: {...} } 的情况
  const root =
    data && Array.isArray(data?.deptStatsList)
      ? data
      : data && Array.isArray(data?.data?.deptStatsList)
        ? data.data
        : data?.data || {}

  const deptList = Array.isArray(root?.deptStatsList) ? root.deptStatsList : []

  for (const dept of deptList) {
    const deptStartIndex = rows.length
    let deptRowCount = 0

    const categories = Array.isArray(dept.categoryStatsList) ? dept.categoryStatsList : []

    for (const cat of categories) {
      const catStartIndex = rows.length
      let catRowCount = 0
      const types = Array.isArray(cat.typeStatsList) ? cat.typeStatsList : []

      for (const t of types) {
        const typeStartIndex = rows.length
        let typeRowCount = 0

        const pushTypeStatusRow = (statusLabel: string, count: number) => {
          rows.push({
            handleDept: dept.deptName,
            deptFeedbackQty: dept.deptCount ?? 0,
            deptPercent: formatPercent(dept.deptRatio),
            category: cat.categoryName,
            categoryCount: cat.categoryCount ?? 0,
            categoryDeptRatio: formatPercent(cat.categoryRatio),
            problemType: t.typeName,
            problemFeedbackQty: t.typeCount ?? 0,
            typeDeptRatio: formatPercent(t.typeRatio),
            status: statusLabel,
            statusCount: count ?? 0,
            deptCloseRate: formatPercent(dept.completionRate),
            completedDayNum: t.completedDayNum ?? 0,
            completedDayRate: formatPercent(t.completedDayRate),
            deptCompletedDayNum: dept.deptCompletedDayNum ?? 0,
            deptCompletedDayRate: formatPercent(dept.deptCompletedDayRate)
          })
          typeRowCount++
        }

        if ((t.noStartedCount ?? 0) > 0)
          pushTypeStatusRow(STATUS_LABELS.value.noStarted, t.noStartedCount)
        if ((t.progressCount ?? 0) > 0)
          pushTypeStatusRow(STATUS_LABELS.value.inProgress, t.progressCount)
        if ((t.typeCompletedCount ?? 0) > 0)
          pushTypeStatusRow(STATUS_LABELS.value.completed, t.typeCompletedCount)

        // 若三种状态均为0，不渲染该类型
        if (typeRowCount > 0) {
          // 问题类型维度合并：problemType / problemFeedbackQty / typeDeptRatio
          for (let i = 0; i < typeRowCount; i++) {
            const r = rows[typeStartIndex + i]
            r._span = r._span || {}
            r._span.problemType = i === 0 ? typeRowCount : 0
            r._span.problemFeedbackQty = i === 0 ? typeRowCount : 0
            r._span.typeDeptRatio = i === 0 ? typeRowCount : 0
          }

          catRowCount += typeRowCount
        }
      }

      // 类目维度合并：category / categoryCount / categoryDeptRatio（仅在该品类有行时合并）
      for (let i = 0; i < catRowCount; i++) {
        const r = rows[catStartIndex + i]
        r._span = r._span || {}
        if (i === 0) {
          r._span.category = catRowCount
          r._span.categoryCount = catRowCount
          r._span.categoryDeptRatio = catRowCount
        } else {
          r._span.category = 0
          r._span.categoryCount = 0
          r._span.categoryDeptRatio = 0
        }
      }

      deptRowCount += catRowCount
    }

    // 部门维度合并：handleDept / deptFeedbackQty / deptPercent / deptCloseRate（仅在该部门有行时合并）
    for (let i = 0; i < deptRowCount; i++) {
      const r = rows[deptStartIndex + i]
      r._span = r._span || {}
      const keys = [
        'handleDept',
        'deptFeedbackQty',
        'deptPercent',
        'deptCloseRate',
        'deptCompletedDayNum',
        'deptCompletedDayRate'
      ]
      for (const k of keys) {
        r._span[k] = i === 0 ? deptRowCount : 0
      }
    }
  }
  console.log(rows, 'rows')
  return rows.sort((a, b) => b.deptFeedbackQty - a.deptFeedbackQty)
}

// 单元格合并规则（Element Plus span-method）
const spanMethod = ({ row, column }: any) => {
  const prop = column?.property
  if (!prop) return { rowspan: 1, colspan: 1 }
  const spanMap = row?._span || {}
  if (spanMap[prop] === 0) return { rowspan: 0, colspan: 0 }
  if (typeof spanMap[prop] === 'number') return { rowspan: spanMap[prop], colspan: 1 }
  return { rowspan: 1, colspan: 1 }
}

const onSearch = async (model: any) => {
  const range = Array.isArray(model?.feedbackDate) ? model.feedbackDate : []
  queryParams.value.feedbackDateStart = range[0] || ''
  queryParams.value.feedbackDateEnd = range[1] || ''
  // 这里可触发数据拉取
  await nextTick()
  getList()
}

const onReset = () => {
  queryParams.value.feedbackDateStart = ''
  queryParams.value.feedbackDateEnd = ''
}

const exportData = async () => {
  try {
    exportLoading.value = true
    await nextTick()
    // await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
    const host = exportAreaRef.value as HTMLElement | null
    if (!host) {
      message.error('未找到可导出的内容区域')
      return
    }

    const target = host

    await MultiTableExportUtil.exportPdf(target, {
      filename: `${sanitizeFileName(bigHeaderTitle.value)}.pdf`,
      format: 'auto',
      orientation: 'landscape',
      marginMm: 10,
      extraWidth: 40
    })
  } catch (e) {
    console.error(e)
    message.error('导出失败，请重试')
  } finally {
    exportLoading.value = false
  }
}

async function getList() {
  loading.value = true
  await nextTick()
  const data = await getCustomerComplaintSummaryDashboard(queryParams.value)
  tableData.value = buildRowsFromApi(data)
  // 读取总反馈数，用于分组表头展示
  try {
    const root =
      data && Array.isArray((data as any)?.deptStatsList)
        ? (data as any)
        : data && Array.isArray((data as any)?.data?.deptStatsList)
          ? (data as any).data
          : (data as any)?.data || {}
    const deptList = Array.isArray(root?.deptStatsList) ? root.deptStatsList : []
    let total = (root as any)?.totalFeedback
    if (total === undefined || total === null) {
      total = deptList.reduce((sum: number, d: any) => sum + (Number(d?.deptCount) || 0), 0)
    }
    totalFeedback.value = total ?? 0
  } catch (e) {
    totalFeedback.value = 0
  } finally {
    loading.value = false
  }
}
// 计算 deptFeedbackQty 的 top3 值（按值去重，相同值都高亮）
const top3DeptValues = computed(() => {
  return [...new Set(tableData.value.map((item) => item.deptFeedbackQty))]
    .sort((a, b) => b - a)
    .slice(0, 3)
})

// 计算其他字段的 top3
const top3RowValue = computed(() => {
  const result: Record<string, number[]> = {
    categoryCount: [],
    problemFeedbackQty: []
  }

  // 为每个字段找出按值排序后的前3名
  Object.keys(result).forEach((key) => {
    const indexedData = [...new Set(tableData.value.map((item) => Number(item[key])))]
    // 按值降序排序，取前3条
    result[key] = indexedData.sort((a, b) => b - a).slice(0, 3)
  })

  return result
})

const cellClassName = ({ row, column, rowIndex }: any) => {
  const prop = column.property
  const value = row[prop]
  // 处理 deptCloseRate 的警告样式
  if (prop === 'deptCloseRate' && Number((row[prop] as string)?.slice(0, -1)) < 100) {
    return 'deptCloseRate-warning'
  }

  // 特殊处理 deptFeedbackQty：按值高亮（因为会合并单元格）
  if (prop === 'deptFeedbackQty') {
    const top3Values = top3DeptValues.value
    const valueIndex = top3Values.indexOf(row[prop])
    if (valueIndex > -1) {
      return `${prop}-top-${valueIndex + 1}`
    }
  }

  // 处理其他字段的 top3 高亮：按行高亮前3条
  if (['categoryCount', 'problemFeedbackQty'].includes(prop)) {
    const top3 = top3RowValue.value[prop]
    const indexInTop3 = top3.indexOf(value)
    if (indexInTop3 > -1) {
      return `${prop}-top-${indexInTop3 + 1}`
    }
  } else {
    return ''
  }
}

onMounted(() => {
  getList()
})
</script>
<style scoped lang="scss">
:deep(.s-table-container) {
  .el-table {
    --el-table-border: 1px solid #d8dce5 !important;
    .header-row-class-name {
      > th {
        background-color: #fff !important;
        color: #333 !important;
      }
    }
    .summary-header-row {
      > th {
        background-color: #e9ebef !important;
      }
    }
    .deptFeedbackQty-top-1 {
      background-color: rgba(255, 183, 183, 0.6) !important;
    }
    .deptFeedbackQty-top-2 {
      background-color: rgba(255, 120, 7, 0.26) !important;
    }
    .deptFeedbackQty-top-3 {
      background-color: rgba(254, 250, 236, 1) !important;
    }
    .categoryCount-top-1 {
      background-color: rgba(255, 183, 183, 0.6) !important;
    }
    .categoryCount-top-2 {
      background-color: rgba(255, 120, 7, 0.26) !important;
    }
    .categoryCount-top-3 {
      background-color: rgba(254, 250, 236, 1) !important;
    }
    .problemFeedbackQty-top-1 {
      background-color: rgba(255, 183, 183, 0.6) !important;
    }
    .problemFeedbackQty-top-2 {
      background-color: rgba(255, 120, 7, 0.26) !important;
    }
    .problemFeedbackQty-top-3 {
      background-color: rgba(254, 250, 236, 1) !important;
    }
    .deptCloseRate-warning {
      color: #eb3737 !important;
    }
    // &.el-table--border th.el-table__cell {
    //   border-bottom: 1px solid #d8dce5 !important;
    // }
    // &.el-table--border .el-table__cell {
    //   border-right: 1px solid #d8dce5 !important;
    // }
    // td.el-table__cell {
    //   border-bottom: 1px solid #d8dce5 !important;
    // }
  }
}
</style>
