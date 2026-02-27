<!--
 * @Date: 2025-01-03 16:22:21
-->
<template>
  <div class="contant-wapper">
    <div class="content-bottom">
      <TabsList ref="tabsListRef" :form1="refreshForm" :ids="(ids as any)" @add-dialog-close="addDialogClose" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
const router = useRouter()
import TabsList from './components/tabsList.vue'

const ids = computed(() => router?.currentRoute?.value?.query?.ids || '');

defineOptions({ name: 'PackageDesignGallery' })

const tabsListRef = ref()
const planName = ref('') // 企划名称
const planId = ref('') // 企划ID
const developId = ref('') // 开发任务ID
const refreshForm = ref({
  page: 1,
  size: 10,
  year: undefined,
  planName: undefined,
  enterprisePlanId: undefined,
})

onMounted(async () => {
  handleRouteParam()
})

onActivated(() => {
  handleRouteParam()
})

const handleRouteParam = () => {
  planName.value = route.query.planName || ('' as any)
  planId.value = route.query.planId || ('' as any)
  developId.value = route.query.developId || ('' as any)

  if (developId.value) {
    autoOpenAddDialog()
  }
}

// 自动打开新增弹框
const autoOpenAddDialog = () => {
  tabsListRef.value?.autoOpenAddDialog(planId.value, developId.value)
}

const addDialogClose = () => {
  if (developId.value) {
    router.push({ query: {} })
  }
}

if (ids) {
  const newUrl = window.location.href.replace(/\?.*$/, '') // 获取当前路径，并去除参数
  history.replaceState({}, '', newUrl)
}
</script>

<style lang="scss" scoped>
.flex-row {
  display: flex;
  flex-direction: row;
}

.top-item {
  flex: 1;
  min-height: 394px;
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-sizing: border-box;
}

.top-left {
  margin-right: 20px;
}

.content-top {
  margin-bottom: 16px;
}

.content-bottom {
  width: 100%;
  min-height: 200px;
  background: #ffffff;
  border-radius: 8px;
}

:deep(.el-select__wrapper) {
  background: #ffffff !important;
}
</style>
