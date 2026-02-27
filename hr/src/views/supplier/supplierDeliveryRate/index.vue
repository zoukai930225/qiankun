<template>
  <ContentWrap isAutoHeight ref="contentWrapRef">
    <!-- tab -->
    <el-tabs v-model="activitedName" @tab-change="handleTabChange">
      <el-tab-pane
        v-for="(TAB, key) in tabConfig"
        :name="Number(key)"
        :label="TAB.label"
        :key="key"
      >
        <template #default>
          <component
            :is="TAB.component()"
            :innerHeight="innerHeight"
            :ref="(ele: any) => (TAB.template = ele)"
          />
        </template>
      </el-tab-pane>
    </el-tabs>
  </ContentWrap>

  <detail-drawer v-bind="{ ...detailDrawerProp }" v-model="detailDrawerProp.modelValue" />
</template>
<script lang="tsx" setup>
import { TAB_KEYS } from './options'
import ContentWrap from '@/components/ContentWrap/src/ContentWrap.vue'
import Category from './pages/category.vue'
import Goods from './pages/goods.vue'
import Supplier from './pages/supplier.vue'
import Po from './pages/po.vue'
import { getPermission } from '@/utils'
const detailDrawer = defineAsyncComponent(() => import('./components/detailDrawer.vue'))

defineOptions({ name: 'SupplierDeliveryRate' })

const permissionSet = new Set(getPermission())

const categoryRef = ref<InstanceType<typeof Category>>()
const goodsRef = ref<InstanceType<typeof Goods>>()
const supplierRef = ref<InstanceType<typeof Supplier>>()
const contentWrapRef = ref<InstanceType<typeof ContentWrap>>()
const PoRef = ref<InstanceType<typeof Po>>()
const TAB_CONFIG: Record<
  TAB_KEYS,
  { label: string; component: any; template: any; permission: string }
> = {
  [TAB_KEYS.CATEGORY]: {
    label: '品类',
    component: () => Category,
    template: categoryRef.value,
    permission: 'SupplierDeliveryRate:Category'
  },
  [TAB_KEYS.GOODS]: {
    label: '货品',
    component: () => Goods,
    template: goodsRef.value,
    permission: 'SupplierDeliveryRate:Goods'
  },
  [TAB_KEYS.SUPPLIER]: {
    label: '供应商',
    component: () => Supplier,
    template: supplierRef.value,
    permission: 'SupplierDeliveryRate:Supplier'
  },
  [TAB_KEYS.PO]: {
    label: '生产单',
    component: () => Po,
    template: PoRef.value,
    permission: 'SupplierDeliveryRate:Po'
  }
}

const tabConfig = computed(() => {
  return Object.fromEntries(
    Object.entries(TAB_CONFIG).filter(([_, value]) => permissionSet.has(value.permission))
  )
})

const activitedName = ref<TAB_KEYS>(TAB_KEYS.CATEGORY)

const detailDrawerProp = ref<any>({ modelValue: false })

const innerHeight = computed(() => contentWrapRef.value?.cardInnerHeigh || 0)

function handleTabChange() {
  TAB_CONFIG[activitedName.value].template?.getList()
}

onMounted(() => {
  handleTabChange()
})
</script>
<style lang="less" scoped>
@import url(../index.scss);
</style>
