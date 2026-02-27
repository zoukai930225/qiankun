<template>
  <ex-screen>
    <query-scheme
      :scheme="scheme"
      v-model="searchData"
      name="SupplierEvaluation"
      :show-expand="false"
    />
    <scheme-table
      :btn-list="btns"
      :handle-column="handleColumn"
      :screen="screen"
      name="SupplierEvaluation"
      :column="column"
      :table-data="dataList"
      :list-name="'供应商评定列表'"
    />
    <SupplierEvaluationDetails ref="detailsRef" />
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'SupplierEvaluation' }
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type'
import SupplierEvaluationDetails from '../details/index.vue'
import { useRole } from '@/hooks/common/useRole'
import { getIntDictOptions } from '@/utils/dict'
import { usePage, SearchItem } from './config'
import request from '@/config/axios'

const detailsRef = ref<any>()

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
  let params: any = {
    ...searchData.value,
    inspectionTimeBegin: searchData.value.inspectionDate?.length
      ? searchData.value.inspectionDate[0]
      : '',
    inspectionTimeEnd: searchData.value.inspectionDate?.length
      ? searchData.value.inspectionDate[1]
      : ''
  }
  if (!noPage) {
    params = { ...params, page: page.value.page, size: page.value.size }
  }
  return params
}

// 查询
const onSearch = () => {
  const params: any = setParamsData()
  loading.value = true
  request
    .post({ url: `/api/whIncomingInspectionInfo/selectSupplierPage`, data: params })
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
const onButtonClick = (btn: BtnItem) => {}

// 操作列回调
const viewDetails = (type: string, item?: any, btn?: any) => {
  detailsRef?.value?.openView(item, type)
}

onMounted(() => {
  dataList.value = []
  onSearch()
})

setRouterInfo()

provide('SupplierEvaluationForm', {
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
