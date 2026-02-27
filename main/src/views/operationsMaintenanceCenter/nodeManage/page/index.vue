<template>
  <ex-screen>
    <query-scheme :scheme="scheme" v-model="searchData" name="NodeManage" :show-expand="false" />
    <scheme-table
      :btn-list="btns"
      :handle-column="handleColumn"
      :screen="screen"
      name="NodeManage"
      :column="column"
      :table-data="dataList"
      :list-name="'节点管理列表'"
    />
    <node-manage-details ref="detailsRef" />
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'NodeManage' }
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type'
import NodeManageDetails from '../details/index.vue'
import { usePage, SearchItem } from './config'
import * as NodeManageAccountApi from '@/api/rpaManage/nodeManage'

const detailsRef = ref<any>()
const message = useMessage()
const { t } = useI18n()
const syncLoading = ref(false)

const togglePassword = (row: any) => {
  row.showPassword = !row.showPassword
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
} = usePage({ syncLoading, togglePassword })

const setParamsData = (noPage: boolean = false) => {
  const params: any = { ...searchData.value }
  return noPage ? params : { ...params, page: page.value.page, size: page.value.size }
}

const onSearch = async () => {
  const params: any = setParamsData()
  loading.value = true
  try {
    const data = await NodeManageAccountApi.getNodeManageList(params)
    if (data) {
      dataList.value = (data.data || []).map((item: any) => ({ ...item, showPassword: false }))
      page.value = { ...page.value, total: data.total }
    }
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  page.value = { ...new PageItem() }
  searchData.value = { ...new SearchItem() }
  onSearch()
}

const onButtonClick = async (btn: BtnItem) => {
  if (btn.fun === 'syncData') {
    try {
      syncLoading.value = true
      await NodeManageAccountApi.refreshNodeManage()
      message.success('同步成功')
      onSearch()
    } finally {
      syncLoading.value = false
    }
  }
}

const viewDetails = async (type: string, item?: any) => {
  if (type === 'delete' && item?.id) {
    try {
      await message.delConfirm()
      await NodeManageAccountApi.deleteNodeManage(item.id)
      message.success(t('common.delSuccess'))
      onSearch()
    } catch {
      //
    }
    return
  }
  detailsRef.value?.openView(item, type)
}

onMounted(() => {
  dataList.value = []
  onSearch()
})

setRouterInfo()

provide('NodeManageForm', {
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

:deep(.icon-view-password) {
  cursor: pointer;
  margin-left: 8px;
  vertical-align: middle;
  width: 16px;
  height: 16px;
}

:deep(.password-cell) {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
</style>
