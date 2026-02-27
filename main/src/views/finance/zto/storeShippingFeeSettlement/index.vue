<template>
  <flux-wrap>
    <template #header>
      <s-w-search-form
        :expand-threshold="3"
        :schema="searchSchema"
        @search="onSearch"
        @reset="onReset"
        auto-search-on-change
      >
        <el-button type="primary" @click="onPriceManage"> 阶梯单价管理 </el-button>
        <el-button type="primary" @click="onMonthlySettle"> 月度汇算 </el-button>
        <el-button type="primary" @click="onExport"> 导出 </el-button>
      </s-w-search-form>
    </template>

    <s-table
      ref="tableRef"
      :columns="tableColumns"
      :fetch="getZtoPriceStatList"
      :fetch-params="fetchParams"
      pagination-teleport="#store-shipping-fee-footer"
      :afterFetch="handleAfterFetch"
      border
    />

    <template #footer>
      <div id="store-shipping-fee-footer"></div>
    </template>
  </flux-wrap>
</template>
<script lang="tsx" setup>
import { ref, nextTick, defineAsyncComponent, onMounted, provide } from 'vue'
import type { FormSchema } from '@/types/form'
import type { TableColumn } from '@/components/SWTable/src/table'
import type { ComponentOptions } from '@/types/components'
import dayjs from 'dayjs'
import { useDrawer } from '@/hooks/web/useDrawer'
import {
  getGroupTypeList,
  getStoreAllList,
  getZtoPriceStatList,
  exportZtoPriceStatList
} from '@/api/finance/zto'
import { downloadFileFromResponse } from '@/utils/file'
import TableColumnTotal from '@/views/finance/ytoBill/ytoStoreFee/components/tableColumnTotal.vue'
import { cloneDeep } from 'lodash-es'

const defaultMonth = dayjs().subtract(1, 'month').format('YYYY-MM')
const groupList = ref<ComponentOptions[]>([])
const storeList = ref<ComponentOptions[]>([])

provide('groupList', groupList)
provide('storeList', storeList)
provide('defaultMonth', defaultMonth)
// 搜索项

const searchSchema = ref<FormSchema[]>([
  {
    field: 'groupType',
    label: '分组',
    component: 'Select',
    componentProps: {
      placeholder: '请选择分组',
      options: [] as ComponentOptions[],
      filterable: true
    }
  },
  {
    field: 'store',
    label: '店铺',
    component: 'Select',
    componentProps: {
      placeholder: '请选择店铺',
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
      placeholder: '请选择月份',
      clearable: false,
    },
    value: defaultMonth
  }
])

// 表头
const tableColumns: TableColumn[] = [
  {
    prop: 'groupType', label: '分组', minWidth: 120,
    align: 'left',
    headerAlign: 'left',
    customRender: ({ row }) => {
      if (row.isSumline) {
        return <TableColumnTotal onDataExchange={totalDataExchange} defaultIndex={totalSelectIndex.value} />
      } else {
        return row.groupType
      }
    }
  },
  { prop: 'store', label: '匹配店铺', minWidth: 180, align: 'left', headerAlign: 'left' },
  { prop: 'dataBelong', label: '月份', minWidth: 120 },
  { prop: 'countTracking', label: '总运单数', minWidth: 120 },
  { prop: 'sumPrice', label: '总费用', minWidth: 120 }
]

const totalSelectIndex = ref(0)
let all = null
let current = null
const list = ref<any[]>([])
const handleAfterFetch = (data: any) => {
  all = null
  current = null
  let dataList: any = []
  data.map((item: any) => {
    if (item.dataBelong.includes('总计')) {
      item.isSumline = true
      const val = cloneDeep(item)
      val.dataBelong = ''
      if (item.dataBelong === '总计：全部页') {
        all = val
      } else {
        current = val
      }
    } else {
      dataList.push(item)
    }
  })
  if (totalSelectIndex.value === 0 && all) {
    dataList.push(all)
  }
  if (totalSelectIndex.value === 1 && current) {
    dataList.push(current)
  }
  list.value = dataList
  return dataList
}

const totalDataExchange = (index) => {
  console.log(index)
  totalSelectIndex.value = index
  if (list.value.length > 0) {
    if (index === 0 && all) {
      // 全部汇总
      list.value[list.value.length - 1] = all
    } else if (index === 1 && current) {
      // 当前页汇总
      list.value[list.value.length - 1] = current
    }
  }
  tableRef.value?.setProps?.({ data: list.value })
}

// 查询参数
const tableRef = ref()
const fetchParams = ref<Record<string, any>>({ dataBelong: defaultMonth })

// 事件
const onSearch = async (form: any) => {
  fetchParams.value = { ...form }
  await nextTick()
  tableRef.value?.refresh?.(true)
}

const onReset = () => {
  fetchParams.value = { dataBelong: defaultMonth }
}

// 在 setup 顶层获取 drawer 实例，确保可继承父级应用上下文（全局组件可用）
const { openDrawer } = useDrawer()

const onPriceManage = () => {
  openDrawer({
    title: '阶梯单价管理',
    width: 1030,
    content: defineAsyncComponent(() => import('./components/priceManageDrawer.vue')),
    showConfirmFooter: false
  })
}
const onMonthlySettle = () => {
  openDrawer({
    title: '月度汇算',
    width: 880,
    content: defineAsyncComponent(() => import('./components/monthlySettleDrawer.vue')),
    showConfirmFooter: false
  })
}
const onExport = async () => {
  try {
    const params = { ...fetchParams.value }
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
    )
    const response = await exportZtoPriceStatList(filteredParams)
    const fileName = `店铺运费汇算_${(filteredParams as any).dataBelong?.replace?.('-', '') || defaultMonth.replace('-', '')}.xlsx`
    downloadFileFromResponse(response, fileName)
  } catch (e) {
    console.error('导出失败', e)
  }
}

// （已接入真实接口：getZtoPriceStatList）

async function getGroup() {
  const res = await getGroupTypeList()
  if (Array.isArray(res)) {
    groupList.value = res.map((v) => ({ label: v, value: v }))
    // 同步到 schema 的下拉项
    const schema = searchSchema.value.find((it) => it.field === 'groupType')
    if (schema && schema.componentProps) {
      schema.componentProps.options = groupList.value
      // 触发响应式更新（某些封装组件依赖 props 浅对比）
      schema.componentProps = { ...schema.componentProps }
    }
  }
}
async function getStore() {
  const res = await getStoreAllList()
  if (Array.isArray(res)) {
    storeList.value = res.map((v) => ({ label: v, value: v }))
    // 同步到 schema 的下拉项
    const schema = searchSchema.value.find((it) => it.field === 'store')
    if (schema && schema.componentProps) {
      schema.componentProps.options = storeList.value
      // 触发响应式更新（某些封装组件依赖 props 浅对比）
      schema.componentProps = { ...schema.componentProps }
    }
  }
}

async function init() {
  await getGroup()
  await getStore()
}

onMounted(() => {
  init()
})
</script>
<style scoped lang="scss">
.content-wrap {
  padding: 20px;
}
</style>
