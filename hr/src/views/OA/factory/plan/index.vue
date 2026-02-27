<template>
  <ex-screen>
    <query-scheme :scheme="scheme" v-model="searchData" name="Factoryplan" show-expand />
    <!-- 节点进度流程图 -->
    <div
      v-if="currentRow.fsTaskId"
      v-loading="nodeProgressLoading"
      style="border: 1px solid #dde2e9; margin-bottom: 20px;margin-top: 15px;"
    >
      <flow-charts ref="flowRef" />
    </div>
    <scheme-table
      ref="tableRef"
      :btn-list="btns"
      :handle-column="handleColumn"
      :screen="screen"
      :show-screen="false"
      name="Factoryplan"
      :column="column"
      :table-data="dataList"
      :list-name="'产品计划列表'"
      :table-props="{
        'highlight-current-row': true,
        'row-key': 'id'
      }"
    />
    <factory-plan-details ref="detailsRef" />

    <!-- 回收 -->
    <RecycleDialog ref="recycleDialogRef"></RecycleDialog>
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'Factoryplan' }
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type'
import FactoryPlanDetails from './details/index.vue'
import { useRole } from '@/hooks/common/useRole'
import { getIntDictOptions } from '@/utils/dict'
import { usePage, SearchItem, DataItem } from './page/config'
import FlowCharts from './components/flow.vue'
import request from '@/config/axios'
import RecycleDialog from './components/recycleDialog.vue'
import { treeToArray, redrawTree } from '@/utils'

const router = useRouter()
const detailsRef = ref<any>(),
  plateRef = ref(),
  boardRef = ref(),
  currentRow = ref(new DataItem()),
  nodeProgressLoading = ref(false),
  tableRef = ref(),
  recycleDialogRef = ref()

const userInfo = ref<any>({ isManagement: false, isHrbp: false })

const {
  dataList,
  page,
  loading,
  scheme,
  btns,
  searchData,
  column,
  screen,
  stateInfo,
  statistics,
  handleColumn,
  setRouterInfo
} = usePage({ userInfo: toRef(userInfo, 'value'), dicInfo: getIntDictOptions('fs_node_name') })

// const { getPermissionInfo, grabCheck } = useRole('人力行政');

// 处理请求数据
const setParamsData = (noPage: boolean = false) => {
  return noPage
    ? { ...searchData.value }
    : { ...searchData.value, page: page.value.page, size: page.value.size }
}

// 查询
const onSearch = () => {
  const params: any = { ...setParamsData() }
  params.purchaseUserId = params.purchaseUserId?.map((item: any) => item.userId).join(',')
  params.chosenSupplierStaffId = params.chosenSupplierStaffId?.length
    ? params.chosenSupplierStaffId[0].userId
    : ''
  params.patternMakerId = params.patternMakerId?.length ? params.patternMakerId[0].userId : ''
  params.fabricDesigner = params.fabricDesigner?.length ? params.fabricDesigner[0].userId : ''
  // params.designerId = params.designerId?.length ? params.designerId[0].userId : ''
  loading.value = true
  request
    .get({
      url: `/workflow-api/api/workflow/business/factorySecondary/supplierFlow/productPlan/pageList`,
      params
    })
    .then((res: any) => {
      dataList.value = res.records?.length ? [...res.records] : []
      page.value = { ...page.value, total: res.total }
      if (dataList?.value?.length) {
        tableRef?.value?.setCurrentRow(dataList.value[0])
      } else {
        currentRow.value = new DataItem()
        tableRef?.value?.setCurrentRow()
        flowRef?.value?.destroyGraph()
      }
      // dataList?.value?.length && tableRef?.value?.setCurrentRow(dataList.value[0])
    })
    .finally(() => {
      // getStateInfo()
      loading.value = false
    })
}

// 重置
const resetForm = () => {
  page.value = { ...new PageItem() }
  searchData.value = { ...new SearchItem() }
  onSearch()
}

// 状态筛选查询（无状态筛选可删除）
const getStateInfo = () => {
  // const params: any = setParamsData();
  // request.post({ url: `/api/employeeMonthlyAssessment/statistics`, data: params }).then((res: any) => {
  //   res && (stateInfo.value = { ...res });
  // });
}

// 按钮回调
const onButtonClick = (btn: BtnItem) => {
  ;['board'].includes(btn.fun) && boardRef?.value?.openView()
  ;['solution', 'seal'].includes(btn.fun) && plateRef?.value?.openDialog(btn.fun)
}

// 操作列回调
const viewDetails = (type: string, item?: any, btn?: any) => {
  const { fsTaskId, supplierId } = item
  // 进度维护
  if (type === 'progress') {
    router.push({
      name: 'FactoryProductProgress',
      query: {
        supplierId
      },
      params: {
        id: fsTaskId
      }
    })
    return
  }

  // 回收
  if (type === 'recycle') {
    recycleDialogRef?.value?.openDialog(item, type)
    return
  }
  detailsRef?.value?.openView(item, type)
}

// // 跳转带id查询
// const route = useRoute()
// if (route.query?.fsTaskId) {
//   const newUrl = window.location.href.replace(/\?.*$/, '')
//   history.replaceState({}, '', newUrl)
// }

onMounted(() => {
  dataList.value = []
  // if (route.query?.fsTaskId) {
  //   searchData.value.fsTaskId = route.query?.fsTaskId
  //   searchData.value.supplierId = route.query?.supplierId
  //   onSearch()
  //   delete searchData.value.fsTaskId
  //   delete searchData.value.supplierId
  // } else {
  onSearch()
  // }
})

setRouterInfo()

const flowRef = ref()
const onCurrentChange = async (row: any) => {
  currentRow.value = row
  const { fsTaskId, supplierId } = row
  nodeProgressLoading.value = true
  try {
    const data = await request.get({
      url: `/workflow-api/api/workflow/business/factorySecondary/supplierFlow/productPlan/progressDashboard`,
      params: { fsTaskId, supplierId }
    })
    const list: any = treeToArray([data], 'taskDefinitionKey', 'nextProgress')
    // lengthways
    flowRef?.value?.initCharts([data], list, {
      mode: 'horizontal',
      site: { x: 70, y: 105 },
      size: { width: 66, height: 66 },
      space: { x: 200, y: 72 },
      corner: {
        top: { addX: 182, reduceX: 25, addY: 32, reduceY: 35 },
        bottom: { addX: 95, reduceX: 87, addY: 36, reduceY: 85 }
      },
      args: {
        dx: 15,
        dy: 30
      }
    })
  } finally {
    nodeProgressLoading.value = false
  }
}

provide('FactoryplanForm', {
  searchData,
  dataList,
  page,
  loading,
  stateInfo,
  statistics,
  setParamsData,
  resetForm,
  onSearch,
  onButtonClick,
  viewDetails,
  onCurrentChange
})
</script>
<style lang="scss" scoped>
@use './page/styles.scss';
:deep(.el-table__body tr.current-row > td.el-table__cell) {
  background-color: #ecf5ff;
}
</style>
