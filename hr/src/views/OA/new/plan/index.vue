<template>
  <ex-screen>
    <query-scheme
      :scheme="scheme"
      v-model="searchData"
      name="Newplan"
      :show-expand="configList && configList.length > 0"
      :noReset="!configList || configList.length === 0"
    />
    <scheme-table
      :btn-list="btns"
      :handle-column="handleColumn"
      :screen="screen"
      name="Newplan"
      :column="column"
      :table-data="dataList"
      :list-name="'企划管理列表'"
    />
    <new-plan-details ref="detailsRef" />

    <!-- 审核 -->
    <audit-dialog v-model="dialogVisible" :selectItem="selectItem" @confirm="onSearch" />

    <!-- 新增 -->
    <add-dialog
      ref="addFormRef"
      :addType="addType"
      :fields="configList"
      @close="handleCloseDialog"
      @success="handleSuccess"
    />

    <!-- 回收 -->
    <business-recycle-dialog
      v-model="businessRecycleDialogVisible"
      ref="businessRecycleDialogRef"
      @confirm="onSearch"
    />

    <!-- 交接 -->
    <separated-employee-dialog ref="separatedEmployeeRef" @confirm="onSearch" />
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'Newplan' }
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type'
import NewPlanDetails from './details/index.vue'
import AddDialog from './components/addDialog.vue'
import AuditDialog from './components/auditDialog.vue'
import SeparatedEmployeeDialog from './components/separatedEmployeeDialog.vue'
import BusinessRecycleDialog from './components/businessRecycleDialog.vue'
import { useRole } from '@/hooks/common/useRole'
import { getIntDictOptions, getDictOptions, getDictLabel, DICT_TYPE } from '@/utils/dict'
import { usePage, SearchItem } from './page/config'
import { useDicList } from '@/views/OA/new/designGallery/hooks.js'
import request from '@/config/axios'
import { useUserStore } from '@/store/modules/user'
import { useNewProductStore } from '@/store/modules/newProduct'
const { dicList } = useDicList()
const router = useRouter()
const message = useMessage()
const detailsRef = ref<any>(),
  plateRef = ref(),
  boardRef = ref(),
  configList = ref<any[]>([]),
  listDic = ref([]),
  dialogVisible = ref(false),
  selectItem = ref({}),
  addType = ref('newGoods'),
  businessRecycleDialogVisible = ref(false),
  businessRecycleDialogRef = ref(),
  separatedEmployeeRef = ref()
const newProductInfo = useNewProductStore()
const userInfo = ref<any>({ isManagement: false, isHrbp: false })
const userStore = useUserStore()
watch(dicList, (newVal) => {
  // @ts-ignore
  listDic.value = newVal || []
})

const getDicList = (dictCode) => {
  // @ts-ignore
  const item = listDic.value.filter((item) => item?.id == dictCode)
  //@ts-ignore
  const dictList = getDictOptions(item?.[0]?.code).filter((item) => item?.code != 'ALL')
  return dictList
}

const getBackgroundColor = (fieldCode: string, planType: string) => {
  if (fieldCode === 'productType') {
    if (Number(planType || '') === 1) {
      return '#FFF4C8'
    }
  }
  if (Number(planType || '') === 0) {
    return '#B7EEF6'
  } else if (Number(planType || '') === 1) {
    return '#FFDCF0'
  } else if (Number(planType || '') === 2) {
    return '#D6EBD6'
  } else if (Number(planType || '') === 3) {
    return '#CCE0FF'
  }
  return '#B7EEF6'
}

const getPlanColor = (fieldCode: string, planType: string) => {
  if (fieldCode === 'productType') {
    if (Number(planType || '') === 1) {
      return '#CD8200'
    }
  }

  if (Number(planType || '') === 0) {
    return '#03A3B6'
  } else if (Number(planType || '') === 1) {
    return '#F35CAA'
  } else if (Number(planType || '') === 2) {
    return '#349B34'
  } else if (Number(planType || '') === 3) {
    return '#0064FF'
  }
  return '#03A3B6'
}

const geTypeName = (fieldCode: string, type: string) => {
  if (fieldCode === 'productType') {
    return getDictLabel(DICT_TYPE.NP_CATEGORY_PRODUCT_TYPE, Number(type || '')) || '-'
  }
  if (fieldCode === 'planProductType') {
    return getDictLabel(DICT_TYPE.NP_ENTERPRISE_PRODUCTTYPE, Number(type || '')) || '-'
  }
  if (fieldCode === 'status') {
    return getDictLabel(DICT_TYPE.NP_ENTERPRISE_STATUS, type) || '-'
  }
  if (fieldCode === 'planTemplate') {
    return getDictLabel(DICT_TYPE.NP_PLAN_TEMPLATE, type) || '-'
  }
  if (fieldCode === 'isCore') {
    return getDictLabel(DICT_TYPE.NP_PRODUCTGRADE, type) || '-'
  }
  return getDictLabel(DICT_TYPE.NP_ENTERPRISE_PLANTYPE, Number(type || '')) || '-'
}

const handlePlanProgress = (row: any) => {
  router.push({
    name: 'NodeDetail',
    params: {
      planId: row.id || ''
    },
    query: {
      planName: row.planName || ''
    }
  })
}

const tableMinWidth = (field: any) => {
  switch (field.code) {
    case 'customWarn':
      return 80
    case 'planName':
      return 300
    case 'planningTime':
      return 200
    case 'store':
      return 220
    case 'planOrderDate':
    case 'planListDate':
      return 140
    default:
      return field.type === 8 ? 140 : 125
  }
}

const changeTime = (val: any, key: string) => {
  if (val?.length) {
    searchData.value = { ...searchData.value, planListStartDate: val[0], planListEndDate: val[1] }
  } else {
    searchData.value = { ...searchData.value, planListStartDate: null, planListEndDate: null }
  }
}

const saveSelectPeople = async (row: any, fieldCode: string) => {
  row.editeCode = undefined
  row[`${fieldCode}`] =
    row[`${fieldCode}List`] && row[`${fieldCode}List`].map((item) => item.userId).join(',')
  onSearch()
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
} = usePage({
  userInfo: toRef(userInfo, 'value'),
  configList: toRef(configList, 'value'),
  getDicList,
  tableMinWidth,
  getBackgroundColor,
  getPlanColor,
  geTypeName,
  handlePlanProgress,
  permissions: userStore?.permissions,
  changeTime,
  saveSelectPeople
})

// const { getPermissionInfo, grabCheck } = useRole('人力行政');

// 处理请求数据
const setParamsData = (noPage: boolean = false) => {
  return noPage
    ? { ...searchData.value }
    : { ...searchData.value, page: page.value.page, size: page.value.size }
}

// 查询
const onSearch = () => {
  let params: any = { ...setParamsData() }
  let formattedYear = ''
  let formattedMonth = ''
  let formattedDate = ''
  if (params.year && !params.month) {
    const year = new Date(params.year).getFullYear()
    formattedYear = `${year}年` // '2021年'
    params.year = formattedYear
  }

  if (params.month && !params.year) {
    formattedMonth = `${params.month}月` //'2月
    params.month = formattedMonth
  }
  if (params.year && params.month) {
    const year = new Date(params.year).getFullYear()
    formattedYear = `${year}年`
    formattedMonth = `${params.month}月`
    formattedDate = formattedYear + formattedMonth // '20212月'
    params.planningTime = formattedDate
    params.year = undefined
    params.month = undefined
  }
  delete params.planListDate
  const personConfig = configList.value.filter((item: any) => item.type === 8)
  personConfig.map((pc: any) => {
    if (params[`${pc.code}List`]) {
      delete params[`${pc.code}List`]
    }
  })
  loading.value = true
  // request.post({ url: `/api/np/list`, data })
  request
    .post({ url: `/api/np/list`, data: params })
    .then((res: any) => {
      dataList.value = res.records?.length ? [...res.records] : []
      page.value = { ...page.value, total: res.total }
      handleIsShowWarnInfo()
    })
    .finally(() => {
      getStateInfo()
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
  ;['separatedEmployee'].includes(btn.fun) && separatedEmployeeRef?.value?.open()
  ;['board'].includes(btn.fun) && boardRef?.value?.openView()
  ;['solution', 'seal'].includes(btn.fun) && plateRef?.value?.openDialog(btn.fun)
}

const addFormRef = ref()
const handleAdd = () => {
  // dialogVisible.value = true
  addFormRef?.value?.open()
}

const handleCloseDialog = () => {
  addFormRef?.value?.close()
}

const handleSuccess = () => {
  page.value = { ...new PageItem() }
  onSearch()
}

const handleEdit = (row: any) => {
  addFormRef.value.open(row.id)
}

// 操作列回调
const viewDetails = async (type: string, item?: any, btn?: any) => {
  // 审核
  if (type === 'audit') {
    selectItem.value = { ...item }
    dialogVisible.value = true
    return
  }

  // 新增
  if (type === 'add') {
    handleAdd()
    return
  }

  // 编辑
  if (type === 'edit') {
    handleEdit(item)
    return
  }

  // 详情
  if (type === 'view') {
    addFormRef?.value?.open(item.id, true)
    return
  }

  // 设计图库
  if (type === 'design') {
    newProductInfo.planName = item.planName
    router.push({ name: 'DesignGallery' })
    return
  }

  // 回收
  if (type === 'recycle') {
    item.recycleType = 1
    businessRecycleDialogRef?.value?.open(item)
    return
  }

  if (type === 'delete') {
    // 删除二次确认
    await message.confirm('确认删除吗？')
    await request.get({ url: `/api/np/delete/${item.id}` })
    message.success('删除成功')
    resetForm()
    return
  }

  if (type === 'copy') {
    await message.confirm(
      '企划复制功能即：将此企划数据完全复制一份，新增为新的企划，不会影响原有企划的任何数据。是否确认复制？'
    )
    addFormRef?.value?.open(item.id, false, true)
    return
  }
  // detailsRef?.value?.openView(item, type, configList.value)
}

const warnConfig = {
  id: 0,
  name: '',
  listDisplay: true,
  state: 1,
  code: 'customWarn'
}

const handleIsShowWarnInfo = () => {
  if (dataList.value.length > 0 && configList.value.length > 0) {
    const isShowWarn = dataList.value.some((item) => item.newProgress === '1')
    if (configList.value[0].code === 'customWarn' && !isShowWarn) {
      configList.value.splice(0, 1)
    } else if (configList.value[0].code !== 'customWarn' && isShowWarn) {
      configList.value = [warnConfig, ...configList.value]
    }
  }
}

onMounted(async () => {
  loading.value = true
  const res =
    (await request.get({
      url: `/basicAttribute/queryByCode`,
      params: { code: 'Plan' }
    })) || []
  configList.value = res.filter((item: any) => item.state === 1)
  handleIsShowWarnInfo()
  dataList.value = []
  onSearch()
})

const customTrigger = (scope: any) => {
  const { planName } = scope
  router.push({
    name: 'Develop',
    query: {
      planName
    }
  })
}

setRouterInfo()

provide('NewplanForm', {
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
  customTrigger
})
</script>
<style lang="scss" scoped>
@use './page/styles.scss';
:deep(.seach-time .date-select .el-select__wrapper) {
  height: 32px !important;
}
:deep(.linkColor) {
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  color: #0064ff !important;
}
:deep(){
  .messageWarn {
    font-weight: 500;
    font-size: 12px;
    color: #ffffff;
    line-height: 21px;
    height: 21px;
    background: #ff0000;
    border-radius: 100px 6px 0px 100px;

    &-text {
      padding-left: 5px;
      padding-right: 0px;
    }
  }
}
</style>
