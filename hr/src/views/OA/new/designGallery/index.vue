<!--
 * @Date: 2025-01-03 16:22:21
-->
<template>
  <div class="contant-wapper">
    <!-- <div class="content-top flex-row">
      <div class="top-left top-item">
        <TableInfo ref="tableInfoRef" @refresh="refresh" />
      </div>
      <div class="top-right top-item">
        <BarChartInfo :form="refreshForm" />
      </div>
    </div> -->
    <div class="content-bottom">
      <TabsList ref="tabsListRef" :configList="configList" :form1="refreshForm" :ids="(ids as any)"
        @add-dialog-close="addDialogClose" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
const router = useRouter()
import { getBasicAttribute } from '@/api/oa/new/plan/index'
import BarChartInfo from './components/barChartInfo.vue'
import TableInfo from './components/tableInfo.vue'
import TabsList from './components/tabsList.vue'
import { useNewProductStore } from '@/store/modules/newProduct'

const ids = route.query.ids || undefined;

defineOptions({ name: 'DesignGallery' })

const newProductInfo = useNewProductStore()

const configList = ref([]) // 配置列表
const tableInfoRef = ref()
const tabsListRef = ref()
const planName = ref('') // 企划名称
const planId = ref('') // 企划ID
const developId = ref('') // 开发任务ID
const refreshForm = ref({
  page: 1,
  size: 10,
  year: undefined,
  planName: undefined,
  enterprisePlanId: undefined
})

onMounted(async () => {
  await getConfig()
  handleRouteParam()
})

onActivated(() => {
  handleRouteParam()
})

const handleRouteParam = () => {
  planName.value = newProductInfo.planName
  planId.value = route.query.planId || ('' as any)
  developId.value = route.query.developId || ('' as any)

  if (developId.value) {
    tableInfoRef.value?.initPlanList()
    const designPictureCon = Number(route.query.designPictureCon || '')
    if (designPictureCon === 0) {
      autoOpenAddDialog()
    }
  } else {
    if (planName.value) {
      // tableInfoRef.value?.fillPlanName(planName.value)
    } else {
      tableInfoRef.value?.initPlanList()
    }
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

const refresh = async (value) => {
  refreshForm.value = JSON.parse(JSON.stringify(value))
  console.log(' refreshForm.value', refreshForm.value)
}

// 获取配置
const getConfig = async () => {
  const params = {
    code: 'DesignGallery'
  }
  const res = await getBasicAttribute(params)
  configList.value = res || []

  console.log('配置信息', configList.value)
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
</style>
