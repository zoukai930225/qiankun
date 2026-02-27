<template>
  <ex-screen>
    <query-scheme :scheme="scheme" v-model="searchData" name="Factorydevelop" />
    <scheme-table
      :btn-list="btns"
      :handle-column="handleColumn"
      :screen="screen"
      name="Factorydevelop"
      :column="column"
      :table-data="dataList"
      :list-name="'开发任务列表'"
    />
    <factory-develop-details ref="detailsRef" />

    <!-- 匹配供应商  -->
    <supplierDrawer ref="supplierDrawerRef" @success="onSearch" />

    <!-- 审核 -->
    <AuditDialog v-model="dialogVisible" :selectItem="selectItem" @confirm="onSearch" />

    <!-- 回收 -->
    <RecycleDialog ref="recycleDialogRef"></RecycleDialog>

    <!-- 打样进度 -->
    <develop-progress ref="progressRef" />
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'Factorydevelop' }
</script>

<script lang="tsx" setup>
import DevelopProgress from './components/progress.vue'
import { PageItem, BtnItem } from '@/components/template/config/type'
import FactoryDevelopDetails from './details/index.vue'
import { useRole } from '@/hooks/common/useRole'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { usePage, SearchItem } from './page/config'
import AuditDialog from './components/auditDialog.vue'
import RecycleDialog from './components/recycleDialog.vue'
import supplierDrawer from './components/pickSupplierDrawer.vue'

import request from '@/config/axios'
import { useUserStore } from '@/store/modules/user'
const message = useMessage()

const userStore = useUserStore()

const { permissionList, roleList, getPermissionInfo, grabCheck } = useRole('工厂二开')

const reasonDic = getIntDictOptions(DICT_TYPE.SECCONDARY_DEVELOPMENT_REASON, true)

const detailsRef = ref<any>(),
  plateRef = ref(),
  boardRef = ref(),
  recycleDialogRef = ref()

const userInfo = ref<any>({ isManagement: false, isHrbp: false })

const patternMakerSave = (list: any, row: any, url: string, name: string) => {
  let data: any = { fsTaskId: row.id }
  data[name] = list.map((li: any) => li.userId)
  request
    .post({
      url: `/workflow-api/api/workflow/business/factorySecondary/devTask/${url}/assign`,
      data
    })
    .then((res: any) => {
      res && message.success('操作成功')
    })
    .finally(() => {
      onSearch()
    })
}

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
} = usePage({ userInfo: toRef(userInfo, 'value'), patternMakerSave, grabCheck, reasonDic })

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
  if (params.handle) {
    params.startTime = params.handle[0]
    params.endTime = params.handle[1]
  }
  params.patternMakerId = params.patternMakerId?.map((item: any) => item.userId).join(',')
  params.chosenSupplierStaffId = params.chosenSupplierStaffId
    ?.map((item: any) => item.userId)
    .join(',')
  params.fabricDesignerId = params.fabricDesignerId
    ?.map((item: any) => item.userId)
    .join(',')
  delete params.handle
  delete params.pageSize
  loading.value = true
  request
    .get({ url: `/workflow-api/api/workflow/business/factorySecondary/devTask/list`, params })
    .then((res: any) => {
      dataList.value = res.records?.length ? [...res.records] : []
      page.value = { ...page.value, total: res.total }
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

const deleteLine = () => {}

const progressRef = ref()
// 操作列回调
const viewDetails = async (type: string, item?: any, btn?: any) => {
  // 审核
  if (type === 'audit') {
    selectItem.value = item
    dialogVisible.value = true
    return
  }
  // 供应商信息
  if (type === 'supplier') {
    const _type = !item.chosenSupplierStaffList
      .map((si: any) => si.userId)
      .join(',')
      .includes(userStore.user.id)
      ? 'supplierInfo'
      : type
    supplierDrawerRef.value.open(_type, item.id)
    return
  }

  // 打样进度
  if (type === 'progress') {
    progressRef.value?.open(item)
    return
  }

  // 删除
  if (type === 'delete') {
    await message.confirm('确认删除这条数据吗？')
    await request.get({
      url: `/workflow-api/api/workflow/business/factorySecondary/devTask/delete/${item.id}`
    })
    message.success('删除成功！')
    onSearch()
    return
  }

  if (type === 'recycle') {
    recycleDialogRef?.value?.openDialog(item, type)
    return
  }

  detailsRef?.value?.openView(item, type)
}

const dialogVisible = ref(false)
const selectItem = ref({})
const recycleDialogVisible = ref(false)
const supplierDrawerRef = ref()


onMounted(() => {
  getPermissionInfo(() => {
    dataList.value = []
    onSearch()
  })
})

setRouterInfo()

provide('FactorydevelopForm', {
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
  viewDetails
})
</script>
<style lang="scss" scoped>
@use './page/styles.scss';
</style>
