<template>
  <ex-screen ref="screenRef">
    <el-tabs v-model="activeTab" @tab-change="handleTabChange" class="bonus-tabs">
      <el-tab-pane label="挂车组" :name="GroupType.GC" />
      <el-tab-pane label="站内组" :name="GroupType.ZN" />
      <el-tab-pane label="千川组" :name="GroupType.QC" />
    </el-tabs>

    <query-scheme
      :scheme="scheme"
      v-model="searchData"
      name="BonusAllocation"
      :show-expand="false"
    />

    <scheme-table
      :btn-list="btns"
      :handle-column="handleColumn"
      :screen="screen"
      name="BonusAllocation"
      :column="column"
      :table-data="dataList"
      :list-name="listName"
    />

    <bonus-allocation-details ref="detailsRef" :group-type="activeTab" />
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'BonusAllocation' }
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type'
import BonusAllocationDetails from '../details/index.vue'
import { usePage, SearchItem, GroupType } from './config'
import request from '@/config/axios'

const message = useMessage()
const groupOptions = ref<any[]>([])
const detailsRef = ref<any>()
// 当前激活的tab
const activeTab = ref<GroupType>(GroupType.GC)

const {
  gcDataList,
  qcDataList,
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
} = usePage({ activeTab, groupOptions })

// 列表名称
const listName = computed(() => {
  const count = dataList.value.length
  return `${activeTab.value === GroupType.GC ? '挂车组' : activeTab.value === GroupType.ZN ? '站内组' : '千川'}奖金配置（共${count}条）`
})

// 处理请求数据
const setParamsData = (noPage: boolean = false) => {
  return noPage
    ? { ...searchData.value, groupType: activeTab.value }
    : {
        ...searchData.value,
        pageNum: page.value.page,
        pageSize: page.value.size
      }
}

// 查询
const onSearch = () => {
  const params: any = setParamsData()
  loading.value = true

  const url =
    activeTab.value === GroupType.QC
      ? `/api/nmQcBonusConfig/list`
      : `/api/nmTrailerBonusConfig/list`
  // if (activeTab.value !== GroupType.QC) {
  //   params.groupType = activeTab.value === GroupType.GC ? '1' : '0'
  // }
  request
    .post({ url, data: params })
    .then((res: any) => {
      if (activeTab.value === GroupType.GC || activeTab.value === GroupType.ZN) {
        gcDataList.value = res.records?.length ? res.records : []
      } else {
        qcDataList.value = res.records?.length ? res.records : []
      }
      page.value = { ...page.value, total: res.total || dataList.value.length }
    })
    .finally(() => {
      loading.value = false
    })
}

// 重置
const resetForm = () => {
  page.value = { ...new PageItem() }
  searchData.value = { ...new SearchItem(), groupId: groupOptions.value[0].value }
  onSearch()
}

// Tab切换
const handleTabChange = async () => {
  // 切换tab时重置搜索条件并重新查询
  await getGroupOptions()
  searchData.value = {
    ...new SearchItem(),
    groupId: groupOptions.value[0].value,
    month: searchData.value.month
  }
  page.value = { ...new PageItem() }
  onSearch()
}

// 按钮回调
const onButtonClick = (_btn: BtnItem) => {
  // 可以根据需要添加其他按钮操作
}

// 操作列回调
const viewDetails = async (type: string, item?: any) => {
  if (type === 'delete') {
    // await message.confirm('是否确认删除该奖金配置?')
    // const id = item.id
    // deleteSysCategoryManager([id]).then(()=>{
    //   message.success('删除成功')
    //   onSearch();
    // })
  } else {
    detailsRef?.value?.openView(item, type)
  }
}
const getGroupOptions = async () => {
  const res = await request.post({
    url: '/api/nmBonusDict/getGroup',
    data: {
      type: '1',
      groupType:
        activeTab.value === GroupType.GC ? '1' : activeTab.value === GroupType.ZN ? '0' : '2',
      page: 1,
      pageSize: 9999
    }
  })
  groupOptions.value = res?.map((item: any) => ({ label: item.groupName, value: item.groupId }))
  searchData.value.groupId = groupOptions.value[0].value
}

onMounted(async () => {
  await getGroupOptions()
  onSearch()
})

setRouterInfo()

provide('BonusAllocationForm', {
  searchData,
  gcDataList,
  qcDataList,
  dataList,
  page,
  loading,
  stateInfo,
  statistics,
  activeTab,
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
