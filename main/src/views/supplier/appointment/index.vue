<template>
  <ContentWrap isAutoHeight ref="contentWrapRef">
    <el-tabs v-model="activityName" @tab-change="handleTabChange">
      <el-tab-pane v-for="(tab, index) in tabsOps" :key="index" :name="index">
        <template #label> <img class="mr8px" :src="tab.src" alt="" />{{ tab.label }}</template>

        <component
          :is="tab.component()"
          :ref="(ele: any) => (tab.template = ele)"
          :innerHeight="innerHeight"
        />
      </el-tab-pane>
    </el-tabs>
  </ContentWrap>
</template>
<script lang="ts" setup>
import MyOrderActiveSvg from '@/assets/svgs/supplier/my-order-active.svg'
import MyOrderSvg from '@/assets/svgs/supplier/my-order.svg'
import AllOrderActiveSvg from '@/assets/svgs/supplier/all-order-active.svg'
import AllOrderSvg from '@/assets/svgs/supplier/all-order.svg'
import Order from './pages/order.vue'
import Appoint from './pages/appoint.vue'
import { TabPaneName } from 'element-plus'
import { useSupplierAppointment } from '@/store/modules/supplier'
import ContentWrap from '@/components/ContentWrap/src/ContentWrap.vue'
import { getPermission } from '@/utils'

defineOptions({ name: 'SupplierAppointmentIndex' })

const route = useRoute()
const appointment = useSupplierAppointment()

const activityName = ref(0)
const orderRef = ref<InstanceType<typeof Order>>()
const appointRef = ref<InstanceType<typeof Appoint>>()
const contentWrapRef = ref<InstanceType<typeof ContentWrap>>()

const innerHeight = computed(() => contentWrapRef.value?.cardInnerHeigh || 0)

const tabsOps = computed(() => {
  const permission = new Set(getPermission())

  return Object.values({
    0: {
      label: '采购生产订单',
      src: activityName.value === 0 ? MyOrderActiveSvg : MyOrderSvg,
      component: () => Order,
      template: orderRef.value,
      permission: 'SupplierAppointmentIndex:Order'
    },
    1: {
      label: '预约发货',
      src: activityName.value === 1 ? AllOrderActiveSvg : AllOrderSvg,
      component: () => Appoint,
      template: appointRef.value,
      permission: 'SupplierAppointmentIndex:Appoint'
    }
  }).filter((ele) => permission.has(ele.permission))
})

async function handleTabChange(name: TabPaneName) {
  await nextTick()
  tabsOps.value[name].template?.handleQuery()
}

onBeforeMount(() => {
  if (route.query.tab) activityName.value = +route.query.tab
  appointment.supplierIdOptions.length === 0 && appointment.getSupplierIdOptions()
})

onActivated(() => {
  handleTabChange(activityName.value)
  appointment.supplierIdOptions.length === 0 && appointment.getSupplierIdOptions()
})
</script>
<style lang="less" scoped>
@import url(../index.scss);

.tab-content {
  display: flex;
  width: calc(200% + 40px);
  transition: all 0.2s;
}
.el-card {
  min-width: 1300px;
}

:deep(.el-pagination) {
  margin: 0;
  // margin-bottom: 0;
  float: none;
}
</style>
