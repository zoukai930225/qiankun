<template>
  <ContentWrap isAutoHeight ref="contentWrapRef">
    <el-tabs v-model="activityName" @tab-change="handleTabChange">
      <el-tab-pane v-for="(tab, index) in tabsOps" :key="index" :name="+index" class="mt-5px">
        <template #label>
          <img class="mr8px" :src="tab.src[activityName === +index ? 0 : 1]" alt="" />{{
            tab.label
          }}</template
        >
        <component
          :is="tab.component()"
          :ref="(ele) => (tab.template = ele)"
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
import AllActiveSvg from '@/assets/svgs/supplier/all-active.svg'
import AllSvg from '@/assets/svgs/supplier/all.svg'
import MyPurchase from './pages/purchase.vue'
import pendingPurchase from './pages/pendingPurchase.vue'
import auditList from './pages/auditList.vue'
import { TabPaneName } from 'element-plus'
import { getWaitAllocateCountApi } from '@/api/supplier/purchase'
import { getPermission } from '@/utils'
import ContentWrap from '@/components/ContentWrap/src/ContentWrap.vue'

const route = useRoute()

defineOptions({ name: 'SupplierPurchaseIndex' })

const pendingNum = ref(0)
const activityName = ref(0)
const myPurchaseRef = ref()
const pendingRef = ref()
const auditListRef = ref()
const contentWrapRef = ref<InstanceType<typeof ContentWrap>>()
const tabsOps = computed(() => {
  const permission = new Set(getPermission())
  const allTabs: any = {
    0: {
      label: `待分配采购(${pendingNum.value})`,
      src: [AllOrderActiveSvg, AllOrderSvg],
      template: pendingRef.value,
      component: () => pendingPurchase,
      permission: 'SupplierPurchase:PendingPurchase'
    },
    1: {
      label: `采购需求单`,
      src: [MyOrderActiveSvg, MyOrderSvg],
      template: myPurchaseRef.value,
      component: () => MyPurchase,
      permission: 'SupplierPurchase:Purchase'
    },
    2: {
      label: `采购需求审核`,
      src: [AllActiveSvg, AllSvg],
      template: auditListRef.value,
      component: () => auditList,
      permission: 'SupplierPurchase:audit'
    }
  }

  return Object.fromEntries<any>(
    Object.entries(allTabs).filter(([_, value]: any) => permission.has(value.permission))
  )
})

const innerHeight = computed(() => contentWrapRef.value?.cardInnerHeigh || 0)

async function handleTabChange(name: TabPaneName) {
  await nextTick()
  tabsOps.value[name]?.template?.handleQuery()
}

/**获取待排产数量 */
async function getPendingNum() {
  try {
    const res = await getWaitAllocateCountApi()
    pendingNum.value = res
  } catch (error) {}
}

function checkPurchaseDetail() {
  if (route.query.id && route.query.tab === '1') {
    myPurchaseRef.value?.handleCheck({ id: route.query.id })
  }
}

onActivated(() => {
  activityName.value = route.query.tab
    ? +(route.query.tab as string)
    : +Object.keys(tabsOps.value)[0]

  if (route.query.customParameters) {
    const searchParams = JSON.parse(route.query.customParameters as string)
    activityName.value = Number(searchParams.tab)
  }
  handleTabChange(activityName.value)
  checkPurchaseDetail()
  getPendingNum()
})

onMounted(() => {
  activityName.value = route.query.tab
    ? +(route.query.tab as string)
    : +Object.keys(tabsOps.value)[0]

  handleTabChange(activityName.value)
  getPendingNum()
  checkPurchaseDetail()
})
</script>
<style lang="less" scoped>
@import url(../index.scss);

:deep(.el-pagination) {
  margin: 0;
  float: none;
}
</style>
