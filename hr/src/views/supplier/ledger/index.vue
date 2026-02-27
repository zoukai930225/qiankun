<template>
  <special-card>
    <el-tabs v-model="activityName" @tab-change="handleTabChange">
      <el-tab-pane
        v-for="tab in tabsOps"
        :key="tab.label"
        :name="tab.label"
        :label="tab.label"
        class="mt-5px"
      >
        <component :is="tab.component()" :ref="(ele: any) => (tab.template = ele)" />
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <component :is="currentTemplatePage" />
    </template>
  </special-card>
</template>
<script lang="ts" setup>
import { getPermission } from '@/utils'
import specialCard from '@/views/supplier/components/specialCard.vue'
import { TabPaneName } from 'element-plus'
import SupplierTab from './pages/supplier.vue'
import OrderHandlerTab from './pages/orderHandler.vue'

defineOptions({ name: 'SupplierLedger' })

const activityName = ref('')
const supplierRef = ref<InstanceType<typeof SupplierTab>>()
const orderHandlerRef = ref<InstanceType<typeof OrderHandlerTab>>()

const tabsOps = computed(() => {
  const permission = new Set(getPermission())
  const allTabs = [
    {
      label: `供应商分析`,
      template: supplierRef.value,
      component: () => SupplierTab,
      permission: ''
    },
    {
      label: `跟单分析`,
      template: orderHandlerRef.value,
      component: () => OrderHandlerTab,
      permission: ''
    }
  ]

  return allTabs.filter((ele) => permission.has(ele.permission) || !ele.permission)
})

const currentTemplatePage = computed(() => {
  const currentTemplate = tabsOps.value.find((ele) => ele.label === activityName.value)?.template
  return currentTemplate?.Pagination()
})

async function handleTabChange(name: TabPaneName) {
  await nextTick()
  const target = tabsOps.value.find((ele) => ele.label === name)
  target?.template?.ledgerChartsRef?.renderChart()
}

onMounted(() => {
  activityName.value = '供应商分析'
  tabsOps.value.forEach((ele) => {
    ele?.template?.handleQuery()
  })
})
</script>
<style lang="less" scoped></style>
