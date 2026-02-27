<template>
  <query-scheme :scheme="scheme" v-model="searchData" name="QcBonusList" :show-expand="false" />
  <scheme-table
    :btn-list="btns"
    :handle-column="handleColumn"
    :screen="screen"
    name="QcBonusList"
    :column="column"
    :table-data="dataList"
    :list-name="'千川组奖金列表'"
  />
  <QcBonusList-details ref="detailsRef" />
</template>

<script lang="tsx">
export default { name: 'QcBonusList' }
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type'
import QcBonusListDetails from '../details/index.vue'
import { usePage, SearchItem } from './config'
import request from '@/config/axios'
import router from '@/router'
import { useRouteInfo } from '@/hooks/common/useRouteInfo'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { useRole } from '@/hooks/common/useRole'
import dayjs from 'dayjs'
const { permissionList, getPermissionInfo, grabCheck } = useRole('新媒体')
const { getRouteInfo } = useRouteInfo()
const message = useMessage()

const detailsRef = ref<any>(),
  groupOptions = ref<any[]>([]),
  projectOptions = ref<any[]>([]),
  configInfoList = ref<any[]>([])

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
  groupOptions,
  configInfoList,
  roles: toRef(permissionList, 'value'),
  grabCheck: grabCheck
})

// const { getPermissionInfo, grabCheck } = useRole('人力行政');

// 处理请求数据
const setParamsData = (noPage: boolean = false) => {
  return {
    ...searchData.value,
    pageNum: page.value.page,
    pageSize: page.value.size,
    monthStart: searchData.value.month?.[0],
    monthEnd: searchData.value.month?.[1]
  }
}

// 查询
const onSearch = () => {
  const params: any = setParamsData()
  delete params.month
  loading.value = true
  getRulesList()
  request
    .post({ url: `/api/nmQcBonus/list`, data: params })
    .then((res: any) => {
      // 处理后端返回的数据，组装人员信息用于展示
      dataList.value = res.records
      page.value = { ...page.value, total: res.total }
    })
    .finally(() => {
      loading.value = false
    })
}

// 重置
const resetForm = () => {
  page.value = { ...new PageItem() }
  searchData.value = { ...new SearchItem() }
  onSearch()
}

// 按钮回调
const onButtonClick = (btn: BtnItem) => {
  if (btn.fun === 'board') {
    router.push({ path: getRouteInfo('NewMediaBonusBoard') })
  }
  // ;['board'].includes(btn.fun) && boardRef?.value?.openView()
  // ;['solution', 'seal'].includes(btn.fun) && plateRef?.value?.openDialog(btn.fun)
}

// 操作列回调
const viewDetails = async (type: string, item?: any) => {
  if (type === 'delete') {
    await message.confirm('是否确认删除此数据?')
    await request.post({ url: '/api/nmQcBonus/delete', data: { id: item.id } })
    message.success('删除成功')
    onSearch()
  } else {
    detailsRef?.value?.openView(item, type)
  }
}
const getGroupOptions = async () => {
  const res = await request.post({
    url: '/api/nmBonusDict/getGroup',
    data: {
      type: '2',
      groupType: '2',
      page: 1,
      pageSize: 9999
    }
  })
  groupOptions.value = res.map((item: any) => ({
    label: item.groupName,
    value: item.groupId
  }))
}
const getProjectOptions = async () => {
  const res = await getIntDictOptions(DICT_TYPE.CONTENT_BONUS_CALCULATION_PROJECT, true)
  projectOptions.value = res
}
const getRulesList = async () => {
  const res = await request.post({
    url: `/api/nmQcBonusConfig/editInfo`,
    data: {
      groupId: groupOptions.value[0].value,
      month: searchData.value.month?.[1] || dayjs().format('YYYY-MM'),
      owningProjectId: projectOptions.value[0].value
    }
  })
  configInfoList.value = res.configInfoList
}
onMounted(async () => {
  await getGroupOptions()
  await getProjectOptions()
  await getPermissionInfo()
  dataList.value = []
  onSearch()
})

setRouterInfo()

provide('QcBonusListForm', {
  searchData,
  dataList,
  page,
  loading,
  stateInfo,
  statistics,
  groupOptions,
  projectOptions,
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
