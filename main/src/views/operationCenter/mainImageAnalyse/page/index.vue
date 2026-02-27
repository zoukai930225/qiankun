<template>
  <ex-screen>
    <query-scheme
      :scheme="scheme"
      v-model="searchData"
      name="MainImageAnalyse"
      :show-expand="false"
    />
    <scheme-table
      :table-props="{ selectable }"
      ref="tableRef"
      :btn-list="btns"
      :handle-column="handleColumn"
      :screen="screen"
      name="MainImageAnalyse"
      :column="column"
      :table-data="dataList"
      :list-name="'主图分析列表'"
      is-selection
      :is-index="false"
    />
    <edit-analyse-drawer ref="formRef" @success="handleDrawerSuccess" />
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'MainImageAnalysePage' }
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type'
import editAnalyseDrawer from '../details/index.vue'
import { useRole } from '@/hooks/common/useRole'
import * as mainImageApi from '@/api/oa/new/mainImageAnalyse'
import { usePage, SearchItem } from './config'
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()

const message = useMessage()
const route = useRoute()

const tableRef = ref<any>()
const formRef = ref<any>()

const openForm = (type: string, id?: string, part?: string) => {
  formRef.value?.open(type, id, part)
}

const selectRows = computed(() => tableRef.value?.selectRows)

const { getPermissionInfo, getRole, grabCheck } = useRole('运营')
const operatorRole = computed(() => getRole('主图运营') || '')
const isMainImgOperator = ref(false)
const isMainImgVisual = ref(false)
const canSnapshotRelease = ref(false)
const handleSectionOpen = (part: string, row: any) => {
  if (!row?.id) return
  openForm('view', row.id, part)
}
const hasPermission = (row: any) => {
  const currentUserId = userStore.user.userNo
  // if(isMainImgOperator.value){
  //   return row.operatorList.map((user:any)=>user.userId).includes(currentUserId)
  // } else{
  //   return false
  // }
  return row.operatorList.map((user: any) => user?.userId || '').includes(currentUserId)
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
  setRouterInfo,
  refreshScreenState,
  selectable
} = usePage({
  selectRows,
  openSection: handleSectionOpen,
  operatorRole: operatorRole,
  canSnapshotRelease: canSnapshotRelease,
  isMainImgVisual: isMainImgVisual,
  isMainImgOperator: isMainImgOperator,
  hasPermission
})

const setParamsData = (noPage: boolean = false) => {
  const params: any = { ...searchData.value }
  if (Array.isArray(params.store)) {
    params.store = params.store.join(',')
  }
  if (params.store === null) {
    delete params.store
  }
  if (params.operator === null) {
    delete params.operator
  }
  if (!params.id) {
    delete params.id
  }
  if (Array.isArray(params.isUnblock) && params.isUnblock.length) {
    params.isUnblockText = params.isUnblock.join(',')
  }
  delete params.isUnblock
  return noPage
    ? params
    : {
        ...params,
        page: page.value.page,
        size: page.value.size
      }
}

const getList = async () => {
  loading.value = true
  const params = setParamsData()
  try {
    const res: any = await mainImageApi.getNewProductMainImageList(params).catch(() => ({}))
    const records = res?.records ?? []
    dataList.value = records.map((item: any) => ({
      ...item,
      operator:
        Array.isArray(item?.operatorList) && item.operatorList[0]?.userId
          ? item.operatorList.map((user: any) => user?.userId || '').join(',')
          : '',
      operatorList:
        Array.isArray(item?.operatorList) && item.operatorList[0]?.userId ? item.operatorList : [],
      mainImageUrl: item?.mainImageInfo?.fileUrl || '',
      imgUrl: item?.imgUrl || '',
      productFeaturesQuantity: item?.productFeaturesQuantity ?? 0,
      competitorAnalysisQuantity: item?.competitorAnalysisQuantity ?? 0,
      mainImageSellingPointsQuantity: item?.mainImageSellingPointsQuantity ?? 0
    }))
    page.value = { ...page.value, total: res?.total ?? 0 }
    await refreshScreenState(params)
  } finally {
    loading.value = false
    if (searchData.value.id) {
      delete searchData.value.id
    }
  }
}

const onSearch = () => {
  getList()
}

const resetForm = () => {
  page.value = { ...new PageItem() }
  searchData.value = { ...new SearchItem() }
  onSearch()
}

const handleDelete = async (id: string) => {
  try {
    await message.confirm('确定是否删除该条数据？')
    await mainImageApi.deleteNewProductMainImageList({ id }).catch(() => {})
    message.success('删除成功')
    getList()
  } catch (error) {}
}

const confirmSnapShot = async (row: any) => {
  try {
    await message.confirm('是否确认快照？')
    const params = {
      mainId: row.id,
      imgUrl: row.imgUrl,
      userIds: row.operator
    }
    await mainImageApi.confirmMainImageSnapshot(params).catch(() => {})
    message.success('确认成功')
    getList()
  } catch (error) {}
}

const handleSnapshotRelease = async () => {
  if (!selectRows.value?.length) {
    return message.warning('请先选择需要解封的记录')
  }
  try {
    await message.confirm('确定对所选数据执行解封操作？')
    const ids = selectRows.value.map((item: any) => item.id).filter((id: string) => !!id)
    if (!ids.length) return
    await mainImageApi.batchUnsealing({ idList: ids, isUnblock: 1 }).catch(() => {})
    message.success('解封成功')
    getList()
  } catch (error) {}
}

const onButtonClick = (btn: BtnItem) => {
  if (btn.fun === 'create') {
    openForm('create', '', '')
    return
  }
  if (btn.fun === 'snapshotRelease') {
    handleSnapshotRelease()
  }
}

const viewDetails = (type: string, item?: any) => {
  switch (type) {
    case 'view':
      openForm('view', item?.id)
      break
    case 'edit':
      openForm('updateAll', item?.id)
      break
    case 'confirm':
      confirmSnapShot(item)
      break
    case 'delete':
      handleDelete(item?.id)
      break
    default:
      break
  }
}

const handleDrawerSuccess = (needRefresh: boolean) => {
  if (needRefresh) {
    getList()
  }
}

onMounted(() => {
  getPermissionInfo(() => {
    if (route.query?.id) {
      searchData.value.id = route.query.id as string
    }
    isMainImgOperator.value = grabCheck('主图运营')
    isMainImgVisual.value = grabCheck('主图视觉')
    canSnapshotRelease.value = grabCheck('主图分析快照解封')
    getList()
  })
})

if (route.query?.id) {
  const newUrl = window.location.href.replace(/\?.*$/, '')
  history.replaceState({}, '', newUrl)
}

setRouterInfo()
provide('roles', { getRole })
provide('MainImageAnalyseForm', {
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
@use './styles.scss';
</style>
