<template>
  <ContentWrap isAutoHeight ref="contentWrapRef">
    <el-tabs v-model="activityName" @tab-change="handleTabChange">
      <el-tab-pane v-for="(tab, index) in tabsOps" :key="index" :name="+index">
        <template #label> <img class="mr8px" :src="tab.src" alt="" />{{ tab.label }}</template>

        <template #default>
          <info-bar ref="infoBarRef" />
          <component
            :is="tab.component()"
            :ref="(ele) => (tab.template.value = ele)"
            :innerHeight="innerHeight"
          />
        </template>
      </el-tab-pane>
    </el-tabs>
  </ContentWrap>
</template>
<script lang="ts" setup>
import MyOrderActiveSvg from '@/assets/svgs/supplier/my-order-active.svg'
import MyOrderSvg from '@/assets/svgs/supplier/my-order.svg'
import AllOrderActiveSvg from '@/assets/svgs/supplier/all-order-active.svg'
import AllOrderSvg from '@/assets/svgs/supplier/all-order.svg'
import AllActiveSvg from '@/assets/svgs/supplier/all-active.svg'
import AllSvg from '@/assets/svgs/supplier/all.svg'
import AuditListSvg from '@/assets/svgs/supplier/audit-list.svg'
import AuditListActiveSvg from '@/assets/svgs/supplier/audit-list-actived.svg'
import MyPurchase from './pages/myPurchase.vue'
import MyOrder from './pages/myOrder.vue'
import AllOrder from './pages/allOrder.vue'
import auditList from './pages/auditList.vue'
import infoBar from './components/infoBar.vue'
import { getPermission } from '@/utils'
import ContentWrap from '@/components/ContentWrap/src/ContentWrap.vue'

const route = useRoute()

defineOptions({ name: 'SupplierProductIndex' })

const activityName = ref(0)
const myPurchaseRef = ref()
const myOrderRef = ref()
const allOrderRef = ref()
const auditListRef = ref()
const infoBarRef = ref()
const contentWrapRef = ref<InstanceType<typeof ContentWrap>>()

const tabsOps = computed(() => {
  const permission = new Set(getPermission())
  const allTabs = {
    0: {
      label: `我的采购需求单(${infoBarRef.value?.[0].infoOps?.unfinishedPurchaseRequestOrderCount.num || 0})`,
      src: activityName.value === 0 ? MyOrderActiveSvg : MyOrderSvg,
      component: () => MyPurchase,
      template: myPurchaseRef,
      permission: 'SupplierProduct:MyPurchase'
    },
    1: {
      label: '我的采购生产订单',
      src: activityName.value === 1 ? AllOrderActiveSvg : AllOrderSvg,
      component: () => MyOrder,
      template: myOrderRef,
      permission: 'SupplierProduct:MyOrder'
    },
    2: {
      label: '全部采购生产订单',
      src: activityName.value === 2 ? AllActiveSvg : AllSvg,
      component: () => AllOrder,
      template: allOrderRef,
      permission: 'SupplierProduct:AllOrder'
    },
    3: {
      label: '采购生产审核',
      src: activityName.value === 3 ? AuditListActiveSvg : AuditListSvg,
      component: () => auditList,
      template: auditListRef,
      permission: 'SupplierProduct:audit'
    }
  }

  return Object.fromEntries<any>(
    Object.entries(allTabs).filter(([_, value]: any) => permission.has(value.permission))
  )
})

const innerHeight = computed(() => contentWrapRef.value?.cardInnerHeigh || 0)

async function handleTabChange(name: any) {
  nextTick(() => {
    myPurchaseRef.value?.handleCloseAssistant()
    myOrderRef.value?.handleCloseCooperatePopper()
    tabsOps.value[name].template.value?.handleQuery()
    infoBarRef.value?.[name].getDataBoard()
  })
}

onActivated(() => {
  if (route.query.tab as string) activityName.value = +(route.query.tab as string)
  if (route.query.customParameters) {
    const searchParams = JSON.parse(route.query.customParameters as string)
    activityName.value = Number(searchParams.tab)
  }
  handleTabChange(activityName.value)
})

onBeforeMount(() => {
  if (route.query.tab as string) activityName.value = +(route.query.tab as string)
})

onMounted(() => {
  handleTabChange(activityName.value)
  infoBarRef.value.forEach((ele) => ele.getDataBoard())
})
</script>
<style lang="less" scoped>
@import url(../index.scss);

:deep(.el-pagination) {
  margin: 0;
  float: none;
}
</style>
