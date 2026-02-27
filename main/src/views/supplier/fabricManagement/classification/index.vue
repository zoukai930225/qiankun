<template>
  <ContentWrap>
    <!-- <flux-wrap> -->
      <!-- <template #header> -->
        <s-w-search-form :schema="schema" @search="onSearch" auto-search-on-change>
          <el-button type="primary" @click="onBatchImport">
            <el-image class="mr-5px" :src="MulPlus" />
            批量导入
          </el-button>
          <el-button type="primary" @click="onAdd">
            <el-icon :size="12" class="mr-5px"><Plus /></el-icon>
            新增
          </el-button>
        </s-w-search-form>
      <!-- </template> -->
      <s-table
        border
        ref="tableRef"
        :columns="columns"
        :fetch="getFabricClassificationPage"
        :fetch-params="queryParams"
        row-key="id"
        pagination-teleport="#supplier-fabric-management-classification-footer"
      />
      <!-- <template #footer> -->
        <div id="supplier-fabric-management-classification-footer"></div>
      <!-- </template> -->
    <!-- </flux-wrap> -->
  </ContentWrap>
</template>
<script lang="tsx" setup>
import { FormSchema } from '@/types/form'
import { useRenderLabelSelectInput } from '@/components/Form/src/components/useRenderLabelSelectInput'
import { TableColumn } from '@/components/SWTable/src/table'
import { cloneDeep } from 'lodash-es'
import { useMessage } from '@/hooks/web/useMessage'
import { nextTick, ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import MulPlus from '@/assets/svgs/mulPlus.svg'
import { useDialog } from '@/hooks/web/useDialog'
import AddCategory from './components/addCategory.vue'
import BatchImport from './components/batchImport.vue'
import {
  getFabricClassificationPage,
  deleteFabricClassification,
  getFabricClassificationDetail
} from '@/api/supplier/fabricManagement/classification'
import exclamationMark from '@/assets/svgs/exclamationMark.svg'
import defaultAvatar from '@/assets/svgs/defaultAvatar.svg'

// 可配置项
const trigger = 'click' as 'click' | 'hover'
const clearOnSwitch = true
const options = [
  { label: '分类名称', field: 'supplierName', placeholder: '请输入分类名称', active: true },
  { label: '操作人', field: 'contactName', placeholder: '请输入操作人' }
]

const { LabelSelectInput } = useRenderLabelSelectInput()

// 记录当前选择的标签字段，并映射为后端所需的 type
const selectedField = ref<string>('supplierName')
const fieldToType: Record<string, number> = {
  supplierName: 1,
  contactName: 2
}

// 查询参数（与 s-table 对接）
const queryParams = ref<any>({
  type: 1
})

const schema: FormSchema[] = [
  {
    field: '',
    component: 'LabelSelectInput',
    customRender: (item, model) => (
      <LabelSelectInput
        ref={item.field}
        model={model}
        trigger={trigger}
        clearOnSwitch={clearOnSwitch}
        options={options}
        labelWidth={90}
        {...{
          'onUpdate:selectedField': (field: string) => {
            selectedField.value = field
            queryParams.value = {
              ...queryParams.value,
              type: fieldToType[field] || 1
            }
          }
        }}
      />
    )
  },
  {
    field: 'operateTime',
    label: '操作时间',
    component: 'DatePicker',
    componentProps: {
      type: 'daterange',
      rangeSeparator: '至',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      valueFormat: 'YYYY-MM-DD',
      format: 'YYYY-MM-DD'
    },
    itemWidth: 300
  }
]

const message = useMessage()
const { openDialog } = useDialog()
const tableRef = ref()

// 表格列配置
const columns: TableColumn[] = [
  {
    prop: 'name',
    label: '分类名称',
    minWidth: 180,
    fixed: 'left',
    align: 'left',
    headerAlign: 'left'
  },
  {
    prop: 'personRosterName',
    label: '操作人',
    minWidth: 120,
    align: 'left',
    headerAlign: 'left',
    customRender: ({ row }) => {
      return row.personRosterName ? (
        <div class="flex items-center gap-4px">
          <el-image class="w-20px h-20px rounded-full" src={row.avatarOrigin || defaultAvatar} />
          <span>{row.personRosterName}</span>
        </div>
      ) : (
        '-'
      )
    }
  },
  { prop: 'updatedAt', label: '更新时间', minWidth: 180, align: 'left', headerAlign: 'left' },
  {
    prop: 'actions',
    label: '操作',
    width: 160,
    fixed: 'right',
    align: 'left',
    showOverflowTooltip: false,
    headerAlign: 'left',
    customRender: ({ row }) => (
      <div class="actions left">
        <el-button link type="primary" onClick={() => onEdit(row)}>
          编辑
        </el-button>
        <el-button link type="danger" onClick={() => onDelete(row)}>
          删除
        </el-button>
      </div>
    )
  }
]

const onSearch = async (val: any) => {
  const model = cloneDeep(val || {})
  const [operationTimeBegin, operationTimeEnd] = Array.isArray(model.operateTime)
    ? model.operateTime
    : []

  const hasOperator = !!model.contactName
  const searchKey = hasOperator ? model.contactName : model.supplierName || ''
  const type = fieldToType[selectedField.value] || queryParams.value.type || 1

  const nextParams: any = {
    type,
    searchKey,
    operationTimeBegin,
    operationTimeEnd
  }

  queryParams.value = nextParams
  // 触发表格刷新并重置到第一页
  await nextTick()
  tableRef.value?.refresh?.(true)
}

const onBatchImport = async () => {
  await openDialog({
    title: '批量导入',
    width: '720px',
    content: BatchImport,
    cancelText: '取消',
    // 子组件在上传成功时调用 onImported -> 刷新列表与提示
    props: {
      onImported: () => {
        message.success('导入成功')
        tableRef.value?.refresh?.(true)
      }
    },
    // 上传成功后自动关闭，无需确认按钮
    showConfirmFooter: false,
    header: () => {
      return (
        <div class="flex gap-20px items-center">
          <h3 class="text-16px text-#333 font-500">批量导入</h3>
          <div class="flex items-center gap-4px">
            <img class="w-12px h-12px" src={exclamationMark} />
            <span class="text-12px text-#333">
              下载最新模板进行数据导入，否则可能出现导入失败的情况
            </span>
          </div>
        </div>
      )
    }
  })
}
const onAdd = async () => {
  await openDialog({
    title: '新增',
    width: '520px',
    content: AddCategory,
    confirmText: '确定',
    cancelText: '取消',
    onSuccess: () => {
      message.success('新增成功')
      tableRef.value?.refresh?.(true)
    }
  })
}
const onEdit = async (row: any) => {
  await openDialog({
    title: '编辑',
    width: '520px',
    content: AddCategory,
    props: { id: row?.id, name: row?.name },
    confirmText: '保存',
    cancelText: '取消',
    onSuccess: () => {
      message.success('编辑成功')
      tableRef.value?.refresh?.(false)
    }
  })
}
const onDelete = async (row: any) => {
  let confirmContent = '是否确认删除？'
  try {
    const detail: any = await getFabricClassificationDetail(String(row?.id))
    const hasLinkedCenters = Array.isArray(detail?.centers) && detail.centers.length > 0
    if (hasLinkedCenters) {
      confirmContent =
        '删除当前数据将同步清除“面料中心”中的关联信息，此操作不可恢复，是否确认删除？'
    }
  } catch {}
  try {
    await message.delConfirm(confirmContent, '删除确认')
    await deleteFabricClassification(String(row?.id))
    message.success('删除成功')
    tableRef.value?.refresh?.(false)
  } catch {}
}
</script>
<style scoped lang="scss">
:deep() {
  .el-table__row {
    .el-table__cell {
      padding: 14px 0 !important;
    }
  }
}
</style>
