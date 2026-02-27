<template>
  <ContentWrap isAutoHeight ref="contentWrapRef">
    <el-tabs v-model="activityName" @tab-change="handleTabChange">
      <el-tab-pane v-for="(tab, index) in tabsOps" :key="index" :name="index">
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
    <div class="flex justify-end mt-20px">
      <el-button @click="handleBack">返回</el-button>
    </div>
  </ContentWrap>
</template>
<script lang="ts" setup>
import MyOrderActiveSvg from '@/assets/svgs/supplier/my-order-active.svg'
import MyOrderSvg from '@/assets/svgs/supplier/my-order.svg'
import AllActiveSvg from '@/assets/svgs/supplier/all-active.svg'
import AllSvg from '@/assets/svgs/supplier/all.svg'
import MyPurchase from '@/views/supplier/purchase/pages/purchase.vue'
import AllOrder from '@/views/supplier/product/pages/allOrder.vue'
import { useTagsView } from '@/hooks/web/useTagsView'
import ContentWrap from '@/components/ContentWrap/src/ContentWrap.vue'

const route = useRoute()
const router = useRouter()
const tagsViewStore = useTagsView()

defineOptions({ name: 'SupplierPurchaseApplicationProgress' })

const activityName = ref(0)
const myPurchaseRef = ref()
const allOrderRef = ref()
const contentWrapRef = ref<InstanceType<typeof ContentWrap>>()

const tabsOps = computed(() => {
  const allTabs = [
    {
      label: `采购需求单`,
      src: activityName.value === 0 ? MyOrderActiveSvg : MyOrderSvg,
      component: () => MyPurchase,
      template: myPurchaseRef
    },
    {
      label: '采购生产单',
      src: activityName.value === 2 ? AllActiveSvg : AllSvg,
      component: () => AllOrder,
      template: allOrderRef
    }
  ]

  return allTabs
})

const innerHeight = computed(() => contentWrapRef.value?.cardInnerHeigh || 0)

async function handleTabChange(name: any) {
  nextTick(() => {
    tabsOps.value[name].template.value?.handleQuery()
  })
}

function checkPurchaseDetail() {
  if (route.query.id && route.query.tab === '1') {
    myPurchaseRef.value?.handleCheck({ id: route.query.id })
  }
}

async function handleBack() {
  tagsViewStore.closeCurrent()
  router.push({ name: 'SupplierPurchaseApplication' })
}

onMounted(() => {
  handleTabChange(activityName.value)
  checkPurchaseDetail()
})
</script>
<style lang="less" scoped>
@import url(../index.scss);

.tab-content {
  display: flex;
  width: calc(400% + 80px);
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
