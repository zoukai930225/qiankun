<template>
  <ex-screen>
    <query-scheme :scheme="scheme" v-model="searchData" name="TagManage" :show-expand="false" />
    <scheme-table
      :btn-list="btns"
      :handle-column="handleColumn"
      :screen="screen"
      name="TagManage"
      :column="column"
      :table-data="dataList"
      :list-name="'标签管理列表'"
    />
    <tag-manage-details ref="detailsRef" />
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'TagManage' }
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type'
import TagManageDetails from '../details/index.vue'
import { usePage, SearchItem } from './config'
import * as TagMngApi from '@/api/tagMng'

const detailsRef = ref<any>()
const message = useMessage()
const { t } = useI18n()

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
} = usePage()

const setParamsData = (noPage: boolean = false) => {
  const params: any = { ...searchData.value }
  return noPage ? params : { ...params, page: page.value.page, size: page.value.size }
}

const onSearch = async () => {
  const params: any = setParamsData()
  loading.value = true
  try {
    const data = await TagMngApi.getTagList(params)
    if (data) {
      dataList.value = data.records || []
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

const onButtonClick = (_btn: BtnItem) => {}

const viewDetails = async (type: string, item?: any) => {
  if (type === 'delete' && item?.id) {
    try {
      await message.delConfirm()
      await TagMngApi.deleteTag(item.id)
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

provide('TagManageForm', {
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

:deep(.tag-symbol-wrap) {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
}

:deep(.tag-symbol-item) {
  min-width: 30px;
  padding: 2px 6px;
  border-radius: 4px;
  color: #fff;
  font-size: 12px;
  text-align: center;
}
</style>
