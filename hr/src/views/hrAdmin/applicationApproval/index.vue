<template>
  <flux-wrap>
    <template #header>
      <s-w-search-form
        ref="searchFormRef"
        :schema="searchSchema"
        :expand-threshold="4"
        show-expand
        label-width="68px"
        auto-search-on-change
        default-expand-all
        @search="onSearch"
        @reset="onReset"
      >
        <hover-split-dropdown v-if="grabCheck('固定资产审核')" :items="actionItems" @select="onActionSelect" />
      </s-w-search-form>
    </template>
    <s-table
      ref="tableRef"
      :columns="columns"
      :fetch="getApplicationApprovalList"
      :fetch-params="queryParams"
      :reserve-index="true"
      row-key="id"
      pagination-teleport="#hr-admin-application-approval-footer"
      :onSelectionChange="onSelectionChange"
      stripe
    />
    <template #footer>
      <div id="hr-admin-application-approval-footer"></div>
    </template>
  </flux-wrap>
</template>
<script lang="tsx" setup>
import { ref, onMounted, nextTick } from 'vue'
import { FormSchema } from '@/types/form'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { useMessage } from '@/hooks/web/useMessage'
import {
  getApplicationApprovalList,
  getApplicationApprovalById,
  shApplicationApproval
} from '@/api/hrAdmin/applicationApproval'
import hoverSplitDropdown from '@/components/Button/hoverSplitDropdown'
import useDrawer from '@/hooks/web/useDrawer'
import { defineAsyncComponent } from 'vue'
import { checkPermi } from '@/utils/permission'
import { useDialog } from '@/hooks/web/useDialog'
import dayjs from 'dayjs'
import { useRole } from "@/hooks/common/useRole";
const { getPermissionInfo, grabCheck, getRole} = useRole('人力行政');
const message = useMessage()
const approvalPermi = 'applicationApproval:approval'
const canApprove = checkPermi([approvalPermi])

const { openDrawer } = useDrawer()
const { openDialog } = useDialog()
const ApprovalDrawer = defineAsyncComponent(() => import('./components/approval.vue'))
const ApprovalUser = defineAsyncComponent(() => import('./components/approvalUser.vue'))
const RejectReason = defineAsyncComponent(() => import('./components/rejectReason.vue'))

const searchFormRef = ref()
const tableRef = ref()
const selectedRows = ref<any[]>([])
// 状态选项（审批，数值型）
const applyStatusOptions = [
  { label: '待审核', value: 0 },
  { label: '已通过', value: 1 },
  { label: '已拒绝', value: 2 }
]

const applyTypeOptions = getIntDictOptions(DICT_TYPE.ASSET_APPLY_TYPE, true)

// 申请时间默认近15天（含当天）
const defaultApplyStart = dayjs().subtract(14, 'day').format('YYYY-MM-DD')
const defaultApplyEnd = dayjs().format('YYYY-MM-DD')

const searchSchema = ref<FormSchema[]>([
  {
    field: 'pname',
    label: '品名',
    component: 'Input',
    componentProps: {
      placeholder: '请输入品名',
      clearable: true
    }
  },
  {
    field: 'sqr',
    label: '申请人',
    component: 'Input',
    componentProps: {
      placeholder: '请输入申请人',
      clearable: true
    }
  },
  {
    field: 'sqlx',
    label: '申请类型',
    component: 'Select',
    componentProps: {
      placeholder: '请选择申请类型',
      clearable: true,
      options: applyTypeOptions
    }
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      placeholder: '请选择状态',
      clearable: true,
      options: applyStatusOptions
    }
  },
  {
    field: 'applyTime',
    label: '申请时间',
    component: 'DatePicker',
    componentProps: {
      type: 'daterange',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      clearable: true,
      valueFormat: 'YYYY-MM-DD',
      format: 'YYYY-MM-DD',
      disabledDate: (time: Date) => time.getTime() > dayjs().endOf('day').valueOf()
    },
    value: [defaultApplyStart, defaultApplyEnd]
  },
  {
    field: 'returnTime',
    label: '归还时间',
    component: 'DatePicker',
    componentProps: {
      type: 'daterange',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      clearable: true,
      valueFormat: 'YYYY-MM-DD',
      format: 'YYYY-MM-DD'
    }
  },
  {
    field: 'approvalTime',
    label: '审核时间',
    component: 'DatePicker',
    componentProps: {
      type: 'daterange',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      clearable: true,
      valueFormat: 'YYYY-MM-DD',
      format: 'YYYY-MM-DD'
    }
  }
])

// 查询参数（与接口对齐）
const queryParams = ref({
  pname: undefined as string | undefined, // 品名
  sqr: undefined as string | undefined, // 申请人
  sqlx: undefined as string | undefined, // 申请类型（1领用 2借用 3归还）
  status: undefined as number | undefined, // 状态 0待审核 1通过 2拒绝
  sqstks: defaultApplyStart as string | undefined, // 申请时间开始
  sqjssj: defaultApplyEnd as string | undefined, // 申请时间结束
  yhhsjks: undefined as string | undefined, // 归还时间开始
  yhhsjjs: undefined as string | undefined, // 归还时间结束
  shsjks: undefined as string | undefined, // 审核时间开始
  shsjjs: undefined as string | undefined // 审核时间结束
})

const refreshTable = async () => {
  clearTableSelection()
  await nextTick()
  tableRef.value?.refresh?.(true)
}

const onSearch = (model: any) => {
  const { applyTime, returnTime, approvalTime, ...rest } = model || {}
  const [sqstks, sqjssj] = Array.isArray(applyTime) ? applyTime : []
  const [yhhsjks, yhhsjjs] = Array.isArray(returnTime) ? returnTime : []
  const [shsjks, shsjjs] = Array.isArray(approvalTime) ? approvalTime : []
  queryParams.value = {
    ...queryParams.value,
    ...rest,
    sqstks,
    sqjssj,
    yhhsjks,
    yhhsjjs,
    shsjks,
    shsjjs
  }

  refreshTable()
}

const onReset = () => {
  queryParams.value = {
    pname: undefined,
    sqr: undefined,
    sqlx: undefined,
    status: undefined,
    sqstks: defaultApplyStart,
    sqjssj: defaultApplyEnd,
    yhhsjks: undefined,
    yhhsjjs: undefined,
    shsjks: undefined,
    shsjjs: undefined
  }
  // refreshTable()
}

const onSelectionChange = (rows: any[]) => {
  console.log(rows, 'rows')
  selectedRows.value = Array.isArray(rows) ? rows : []
  updateActionItemsDisabled()
}

const actionItems = ref<any[]>([
  { label: '批量通过', value: 'batchApprove', permission: approvalPermi, active: true },
  { label: '批量拒绝', value: 'batchReject', permission: approvalPermi }
])

const updateActionItemsDisabled = () => {
  const hasSelection = selectedRows.value.length > 0
  for (const item of actionItems.value) {
    if (item.value === 'batchApprove' || item.value === 'batchReject') {
      item.disabled = !hasSelection
    }
  }
}

const clearTableSelection = () => {
  try {
    tableRef.value?.getTableRef()?.clearSelection?.()
  } catch (e) {}
  selectedRows.value = []
  updateActionItemsDisabled()
}

const isSameApplyType = (rows: any[]) => {
  if (!Array.isArray(rows) || rows.length === 0) return true
  const first = String(rows[0]?.sqlx ?? '')
  return rows.every((r) => String(r?.sqlx ?? '') === first)
}

const onActionSelect = (item: any) => {
  console.log(item, 'item')
  if (item === 'batchApprove') {
    const rows = selectedRows.value
    if (!rows.length) return message.warning('请先勾选需要通过的申请')
    if (!isSameApplyType(rows)) return message.warning('所选申请类型不一致，请分批操作')
    openDrawer({
      title: '批量通过',
      size: 600,
      content: ApprovalDrawer,
      props: { mode: 'batch', records: rows },
      confirmText: '确定',
      cancelText: '取消',
      onSuccess: () => {
        message.success('批量通过成功')
        refreshTable()
        clearTableSelection()
      }
    })
    return
  }
  if (item === 'batchReject') {
    const rows = selectedRows.value
    if (!rows.length) return message.warning('请先勾选需要拒绝的申请')
    if (!isSameApplyType(rows)) return message.warning('所选申请类型不一致，请分批操作')
    openDialog({
      title: '拒绝原因',
      width: '560px',
      content: RejectReason,
      props: { mode: 'batch', records: rows },
      confirmText: '确定',
      cancelText: '取消',
      onSuccess: () => {
        message.success('批量拒绝成功')
        clearTableSelection()
        refreshTable()
      }
    })
    return
  }
}

// 映射标签
const translateCompany = (row: any) => {
  if (row?.companyName) return row.companyName
  const Company = getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_DYNAMIC_COMPANY).find(
    (option) => option.value === row.company
  )
  return Company ? Company.label : row.company
}
const translateApplyType = (value: any) => {
  const opt = applyTypeOptions.find((it) => it.value === value)
  return opt ? opt.label : value || '-'
}
const getApplyTypeColor = (value: any) => {
  const v = String(value)
  if (v === '1') return '#0064FF' // 领用
  if (v === '2') return '#DB6A0F' // 借用
  if (v === '3') return '#349B34' // 归还
  return '#C0C4CC'
}
const translateAssetType = (value: any) => {
  const list = getIntDictOptions(DICT_TYPE.FIXED_ASSET_TYPE, true)
  const opt = list.find((it) => it.value === value)
  return opt ? opt.label : value || '-'
}
const getStatusLabel = (value: any) => {
  const v = typeof value === 'string' ? Number(value) : value
  if (v === 0) return '待审核'
  if (v === 1) return '已通过'
  if (v === 2) return '已拒绝'
  return '-'
}

// 操作
const handleApprove = async (row: any) => {
  openDrawer({
    title: '审核通过',
    size: 600,
    content: ApprovalDrawer,
    props: { mode: 'single', records: [row] },
    confirmText: '确定',
    cancelText: '取消',
    onSuccess: () => {
      message.success('操作成功')
      clearTableSelection()
      refreshTable()
    }
  })
}
const handleReject = async (row: any) => {
  openDialog({
    title: '拒绝原因',
    width: '560px',
    content: RejectReason,
    props: { mode: 'single', records: [row] },
    confirmText: '确定',
    cancelText: '取消',
    onSuccess: () => {
      message.success('操作成功')
      clearTableSelection()
      refreshTable()
    }
  })
}
const handleDetail = (row: any) => {
  openDrawer({
    title: '申请详情',
    size: 600,
    content: ApprovalDrawer,
    props: { mode: 'detail', records: [row] },
    showConfirmFooter: false
  })
}

// 表头列
const columns = ref<any[]>([
  {
    type: 'selection',
    width: 55,
    fixed: 'left',
    reserveSelection: true,
    selectable: (row: any) => Number(row.status) === 0
  },
  {
    prop: 'userName',
    label: '申请人',
    minWidth: 100,
    fixed: 'left',
    customRender: ({ row }) => {
      return (
        <div class="flex items-center">
          <el-avatar class="mr-4px" fit="cover" size={18} src={row.tx} />
          <div>{row.userName}</div>
        </div>
      )
    }
  },
  {
    prop: 'contractCompanyName',
    label: '所属公司',
    minWidth: 200,
    headerAlign: 'left',
    align: 'left',
    customRender: ({ row }) => translateCompany(row)
  },
  {
    prop: 'departmentName',
    label: '所属部门',
    minWidth: 120,
    customRender: ({ row }) => <div>{row.departmentName}</div>,
    align: 'left',
    headerAlign: 'left'
  },
  {
    prop: 'zclx',
    label: '资产类型',
    minWidth: 120,
    customRender: ({ row }) => translateAssetType(row.zclx),
    align: 'left',
    headerAlign: 'left'
  },
  { prop: 'areaName', label: '区域', minWidth: 120, align: 'left', headerAlign: 'left' },
  { prop: 'pname', label: '品名', minWidth: 160, align: 'left', headerAlign: 'left' },
  { prop: 'num', label: '申请数量', minWidth: 100, align: 'left', headerAlign: 'left' },
  {
    prop: 'sqlx',
    label: '申请类型',
    minWidth: 120,
    customRender: ({ row }) => {
      const label = translateApplyType(row.sqlx)
      const color = getApplyTypeColor(row.sqlx)
      return (
        <div class="flex items-center">
          <span
            style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: color,
              marginRight: '10px'
            }}
          />
          <span>{label}</span>
        </div>
      )
    },
    align: 'left',
    headerAlign: 'left'
  },
  { prop: 'sqsj', label: '申请时间', minWidth: 180, align: 'left', headerAlign: 'left' },
  { prop: 'yghsj', label: '归还时间', minWidth: 180, align: 'left', headerAlign: 'left' },
  { prop: 'shsj', label: '审核时间', minWidth: 180, align: 'left', headerAlign: 'left' },
  {
    prop: 'status',
    label: '状态',
    align: 'left',
    headerAlign: 'left',
    minWidth: 100,
    customRender: ({ row }) => {
      const text = getStatusLabel(row.status)
      if (!text || text === '-') return '-'
      const bg =
        text === '已通过'
          ? 'rgba(52, 155, 52, 0.2)'
          : text === '待审核'
            ? '#F7DECB'
            : 'rgba(255, 0, 0, 0.2)'
      const color = text === '已通过' ? '#349B34' : text === '待审核' ? '#DB6A0F' : '#FF0000'
      return (
        <div
          style={{
            display: 'inline-block',
            fontSize: '14px',
            padding: '4px 16px',
            textAlign: 'center',
            borderRadius: '158px',
            background: bg,
            minWidth: '74px',
            color
          }}
        >
          {text}
        </div>
      )
    }
  },
  { prop: 'sqrbz', label: '备注', minWidth: 120, align: 'left', headerAlign: 'left' },
  {
    prop: 'operation',
    label: '操作',
    fixed: 'right',
    headerAlign: 'left',
    align: 'left',
    width: 120,
    showOverflowTooltip: false,
    customRender: ({ row }) => {
      const beApproved = Number(row.status) === 0
      const hasPermission = canApprove && beApproved
      return (
        <div class="actions left">
          {grabCheck('固定资产审核') && beApproved
            ? [
                <el-button type="primary" link onClick={() => handleApprove(row)}>
                  通过
                </el-button>,
                <el-button type="danger" link onClick={() => handleReject(row)}>
                  拒绝
                </el-button>
              ]
            : null}
          {!beApproved ? (
            <el-button type="primary" link onClick={() => handleDetail(row)}>
              查看详情
            </el-button>
          ) : null}
        </div>
      )
    }
  }
])

onMounted(() => {
  getPermissionInfo(() => {})
  updateActionItemsDisabled()
})
</script>
<style scoped lang="scss">
::deep(.s-pagination) {
  margin-top: unset;
}
:deep(.sw-search) {
  .el-form {
    .el-form-item {
      margin-right: 16px;
    }
    .el-select,
    .el-date-editor,
    .el-input {
      width: 235px;
      box-sizing: border-box;
    }
  }
}
</style>
