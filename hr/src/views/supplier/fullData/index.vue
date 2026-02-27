<template>
  <ContentWrap isAutoHeight ref="contentWrapRef">
    <el-tabs v-model="activityName" @tab-change="handleTabChange">
      <el-tab-pane v-for="(tab, index) in tabsOps" :key="index" :name="index" class="mt-5px">
        <template #label>
          <!-- <img class="mr8px" :src="tab.src[activityName === +index ? 0 : 1]" alt="" /> -->
          {{ tab.label }}
        </template>
        <component
          :is="tab.component()"
          :ref="(ele: any) => (tab.template = ele)"
          :innerHeight="innerHeight"
          :dimension="index"
        />
      </el-tab-pane>
    </el-tabs>
  </ContentWrap>
</template>
<script lang="ts" setup>
import { TabPaneName } from 'element-plus'
import skuPage from './pages/skuPage.vue'
import goodsPage from './pages/goodsPage.vue'
import categoryPage from './pages/categoryPage.vue'
import { getPermission } from '@/utils'
import ContentWrap from '@/components/ContentWrap/src/ContentWrap.vue'

defineOptions({ name: 'SupplierFullData' })

const activityName = ref('')
const skuPageRef = ref<InstanceType<typeof skuPage>>()
const goodsPageRef = ref<InstanceType<typeof goodsPage>>()
const categoryPageRef = ref<InstanceType<typeof categoryPage>>()
const contentWrapRef = ref<InstanceType<typeof ContentWrap>>()

const innerHeight = computed(() => contentWrapRef.value?.cardInnerHeigh || 0)

const tabsOps = computed(() => {
  const permission = new Set(getPermission())
  const allTabs = {
    sku: {
      label: 'SKU数据',
      template: skuPageRef.value,
      component: () => skuPage,
      permission: ''
    },
    goods: {
      label: `货品数据`,
      template: goodsPageRef.value,
      component: () => goodsPage,
      permission: ''
    },
    category: {
      label: `货品品类数据`,
      template: categoryPageRef.value,
      component: () => categoryPage,
      permission: ''
    }
  }

  return Object.fromEntries(
    Object.entries(allTabs).filter(
      ([_, value]) => permission.has(value.permission) || !value.permission
    )
  )
})

async function handleTabChange(name: TabPaneName) {
  await nextTick()
  tabsOps.value[name]?.template?.getList()
}

onBeforeMount(() => {
  activityName.value = Object.keys(tabsOps.value)[0]
  handleTabChange(activityName.value)
})

onActivated(() => {
  handleTabChange(activityName.value)
})
</script>
<style lang="less" scoped></style>
