<template>
  <ex-screen>
    <el-tabs v-model="activeTab" @tab-change="handleTabChange" class="bonus-tabs">
      <el-tab-pane label="挂车组" :name="GroupType.GC" />
      <el-tab-pane label="站内组" :name="GroupType.ZN" />
      <el-tab-pane label="千川组" :name="GroupType.QC" />
    </el-tabs>
    <template v-if="activeTab === GroupType.GC || activeTab === GroupType.ZN">
      <query-scheme :scheme="scheme" v-model="searchData" name="GcBonusList" :show-expand="true" />
      <scheme-table
        :btn-list="btns"
        :handle-column="handleColumn"
        :screen="screen"
        name="GcBonusList"
        :column="column"
        :table-data="dataList"
        :list-name="listName"
      />
      <GcBonusList-details ref="detailsRef" />
    </template>
    <template v-if="activeTab === GroupType.QC">
      <QcBonusList />
    </template>
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'GcBonusList' }
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type'
import GcBonusListDetails from '../details/index.vue'
import { usePage, SearchItem, GroupType } from './config'
import QcBonusList from '../../qcBonusList/page/index.vue'
import request from '@/config/axios'
import router from '@/router'
import { useRouteInfo } from '@/hooks/common/useRouteInfo'
import { useRole } from '@/hooks/common/useRole'
const { permissionList, getPermissionInfo, grabCheck } = useRole('新媒体')

const { getRouteInfo } = useRouteInfo()
const message = useMessage()
const detailsRef = ref<any>(),
  boardRef = ref(),
  activeTab = ref(GroupType.GC)
const groupOptions = ref<any[]>([])
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
} = usePage({ groupOptions, roles: toRef(permissionList, 'value'), grabCheck: grabCheck })

// const { getPermissionInfo, grabCheck } = useRole('人力行政');
const listName = computed(() => {
  return activeTab.value === GroupType.GC ? '挂车组奖金列表' : '站内组奖金列表'
})
// 处理tab切换
const handleTabChange = async (value: string) => {
  activeTab.value = value as GroupType
  await getGroupOptions()
  resetForm()
}

// 处理请求数据
const setParamsData = (noPage: boolean = false) => {
  return {
    ...searchData.value,
    pageNum: page.value.page,
    pageSize: page.value.size,
    groupType: activeTab.value === GroupType.GC ? '1' : '0',
    monthStart: searchData.value.month?.[0],
    monthEnd: searchData.value.month?.[1],
    publishDateStart: searchData.value.publishDate?.[0],
    publishDateEnd: searchData.value.publishDate?.[1]
  }
}

// 查询
const onSearch = () => {
  const params: any = setParamsData()
  delete params.month
  loading.value = true
  request
    .post({ url: `/api/nmTrailerBonus/list`, data: params })
    .then((res: any) => {
      // 处理后端返回的数据，组装人员信息用于展示
      dataList.value = res.records?.length ? res.records : []
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
    request.post({ url: '/api/nmTrailerBonus/delete', data: { id: item.id } }).then(() => {
      message.success('删除成功')
      onSearch()
    })
  } else {
    detailsRef?.value?.openView(item, type, activeTab.value)
  }
}
const getGroupOptions = async () => {
  const res = await request.post({
    url: '/api/nmBonusDict/getGroup',
    data: {
      type: '2',
      groupType: activeTab.value === GroupType.GC ? '1' : '0',
      page: 1,
      pageSize: 9999
    }
  })
  groupOptions.value = res.map((item: any) => ({
    label: item.groupName,
    value: item.groupId
  }))
}
onMounted(async () => {
  await getGroupOptions()
  await getPermissionInfo()
  dataList.value = []
  onSearch()
})

setRouterInfo()

provide('GcBonusListForm', {
  searchData,
  dataList,
  page,
  loading,
  stateInfo,
  statistics,
  groupOptions,
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
