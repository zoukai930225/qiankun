<template>
  <ex-screen class="storageProblemFeedback">
    <query-scheme :scheme="scheme" v-model="searchData" name="Storageproblemfeedback" :show-expand="false" />
    <scheme-table :btn-list="btns" :handle-column="handleColumn" :screen="screen" name="Storageproblemfeedback"
      :column="column" :table-data="dataList" :list-name="'问题反馈列表'" />
    <problemFeedback-details ref="detailsRef" />
    <staffing ref="staffingRef" />
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'Storageproblemfeedback' }
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type'
import ProblemFeedbackDetails from '../details/index.vue'
import { useRole } from '@/hooks/common/useRole'
import { getIntDictOptions } from '@/utils/dict'
import { usePage, SearchItem } from './config'
import request from '@/config/axios'
import Staffing from '../components/staffing.vue'

const detailsRef = ref<any>(),
  staffingRef = ref(),
  boardRef = ref()

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
} = usePage({ userInfo: toRef(userInfo, 'value') })

// const { getPermissionInfo, grabCheck } = useRole('人力行政');

// 处理请求数据
const setParamsData = (noPage: boolean = false) => {
  if (noPage) {
    return {
      ...searchData.value,
      createdTimeBegin: searchData.value.data?.length ? searchData.value.data[0] : '',
      createdTimeEnd: searchData.value.data?.length ? searchData.value.data[1] : ''
    }
  } else {
    return {
      ...searchData.value,
      createdTimeBegin: searchData.value.data?.length ? searchData.value.data[0] : '',
      createdTimeEnd: searchData.value.data?.length ? searchData.value.data[1] : '',
      page: page.value.page,
      size: page.value.size
    }
  }
}

// 查询
const onSearch = () => {
  const params: any = setParamsData()
  loading.value = true
  request
    .post({ url: `/api/whUserFeedbackProblemInfo/page`, data: params })
    .then((res: any) => {
      dataList.value = res.records?.length ? [...res.records] : []
      page.value = { ...page.value, total: res.total }
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
  ;['setManager'].includes(btn.fun) && staffingRef?.value?.openView(btn.fun)
}

// 操作列回调
const viewDetails = (type: string, item?: any, btn?: any) => {
  detailsRef?.value?.openView(item, type)
}

onMounted(() => {
  dataList.value = []
  onSearch()
})

setRouterInfo()

provide('StorageproblemfeedbackForm', {
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
