<template>
  <div class="price-manage-drawer">
    <s-w-search-form
      :schema="searchSchema"
      :show-search-button="true"
      auto-search-on-change
      @search="onSearch"
      @reset="onReset"
    >
      <el-button type="primary" @click="onAdd">新增阶梯单价</el-button>
    </s-w-search-form>

    <s-table
      :columns="columns"
      :fetch="getZtoPriceConfigPageList"
      :fetch-params="fetchParams"
      ref="tableRef"
    >
      <template #operation="{ row }">
        <el-button link type="primary" @click="onEdit(row)">编辑</el-button>
        <el-button link type="danger" @click="onDelete(row)">作废</el-button>
      </template>
    </s-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineAsyncComponent, nextTick, inject, onMounted } from 'vue'
import type { FormSchema } from '@/types/form'
import type { TableColumn } from '@/components/SWTable/src/table'
import type { ComponentOptions } from '@/types/components'
import type { Ref } from 'vue'
import { useDialog } from '@/hooks/web/useDialog'
import { useMessage } from '@/hooks/web/useMessage'
import { getZtoPriceConfigPageList, batchDelZtoPriceConfig } from '@/api/finance/zto'

const { openDialog } = useDialog()
const message = useMessage()

const defaultMonth = inject<string>('defaultMonth', '')
// 注入父级提供的分组下拉数据
const groupList = inject<Ref<ComponentOptions[]>>('groupList', ref<ComponentOptions[]>([]))

const searchSchema = ref<FormSchema[]>([
  {
    field: 'groupType',
    label: '分组名称',
    component: 'Select',
    componentProps: {
      placeholder: '请选择分组',
      options: [] as ComponentOptions[],
      filterable: true
    }
  },
  {
    field: 'dataBelong',
    label: '月份',
    component: 'DatePicker',
    componentProps: {
      type: 'month',
      valueFormat: 'YYYY-MM',
      format: 'YYYY-MM',
      placeholder: '请选择月份'
    },
    value: defaultMonth
  }
])

const columns: TableColumn[] = [
  { prop: 'groupType', label: '分组', minWidth: 100 },
  { prop: 'waybillDistributionOutlet', label: '运单发放网点', minWidth: 140 },
  { prop: 'dataBelong', label: '月份', minWidth: 100 },
  {
    prop: 'intervalBegin',
    label: '阶梯区间',
    minWidth: 160,
    customRender: ({ row }: any) => {
      const begin = row?.intervalBegin
      const end = row?.intervalEnd
      if (begin === undefined && end === undefined) return row?.ladderRange || '-'
      const left = begin !== undefined ? `>${begin}` : ''
      const right = end !== undefined ? `且≤${end}` : ''
      const text = `${left}${right}`
      return text || '-'
    }
  },
  { prop: 'price', label: '阶梯单价', minWidth: 100 },
  { prop: 'operation', label: '操作', width: 120 }
]

const fetchParams = ref<Record<string, any>>({ dataBelong: defaultMonth })
const tableRef = ref()

const onSearch = async (form: any) => {
  fetchParams.value = { ...form }
  await nextTick()
  tableRef.value?.refresh?.(true)
}
const onReset = () => {
  fetchParams.value = { dataBelong: defaultMonth }
}

const onAdd = async () => {
  await openDialog({
    title: '新增阶梯单价',
    width: 560,
    content: defineAsyncComponent(() => import('./priceEdit.vue')),
    props: { mode: 'create' },
    showConfirmFooter: true,
    confirmText: '确定',
    cancelText: '取消',
    onSuccess: async () => {
      await nextTick()
      tableRef.value?.refresh?.(true)
    }
  })
}
const onEdit = async (row: any) => {
  await openDialog({
    title: '编辑阶梯单价',
    width: 560,
    content: defineAsyncComponent(() => import('./priceEdit.vue')),
    props: { mode: 'edit', initData: row },
    showConfirmFooter: true,
    confirmText: '保存',
    cancelText: '取消',
    onSuccess: async () => {
      await nextTick()
      tableRef.value?.refresh?.(true)
    }
  })
}
const onDelete = async (row: any) => {
  try {
    await message.confirm('确认作废该配置？', '作废确认')
  } catch (e) {
    return
  }
  try {
    await batchDelZtoPriceConfig({ ids: [row.id] })
    message.success('已作废')
    await nextTick()
    tableRef.value?.refresh?.(true)
  } catch (error) {
    message.error('作废失败')
  }
}
const init = () => {
  const schema = searchSchema.value.find((it) => it.field === 'groupType')
  if (schema && schema.componentProps) {
    schema.componentProps.options = groupList.value
    // 触发浅对比更新
    schema.componentProps = { ...schema.componentProps }
  }
  const dataBelongSchema = searchSchema.value.find((it) => it.field === 'dataBelong')
  if (dataBelongSchema && dataBelongSchema.componentProps) {
    dataBelongSchema.componentProps.value = defaultMonth
  }
}
onMounted(() => {
  init()
})
</script>

<style scoped lang="scss">
.price-manage-drawer {
  padding: 10px 4px;
}
</style>
