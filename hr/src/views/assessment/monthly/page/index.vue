<template>
  <ex-screen>
    <query-scheme :scheme="scheme" v-model="searchData" name="MonthAssessment" show-expand />
    <scheme-table
      :btn-list="btns"
      :handle-column="handleColumn"
      :screen="screen"
      name="MonthAssessment"
      :column="column"
      :table-data="dataList"
      :list-name="'月度考核列表'"
    />
    <month-assessment-details ref="detailsRef" :dic-info="dicInfo" />
    <month-assessment-plate ref="plateRef" :options="options" />
    <month-assessment-board ref="boardRef" :options="options" :user-info="userInfo" />
    <month-assessment-records ref="recordsRef"></month-assessment-records>
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'MonthAssessment' }
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type'
import MonthAssessmentPlate from '../components/plate.vue'
import MonthAssessmentBoard from '../components/board.vue'
import MonthAssessmentDetails from '../details/index.vue'
import MonthAssessmentRecords from '../components/records.vue'
import { usePage, SearchItem } from '../config/config'
import { useRole } from '@/hooks/common/useRole'
import { getIntDictOptions } from '@/utils/dict'
import request from '@/config/axios'
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()

const detailsRef = ref<any>(),
  plateRef = ref(),
  boardRef = ref(),
  recordsRef = ref()

const userInfo = ref<any>({ isManagement: false, isHrbp: false }),
  options = ref<Array<any>>([]),
  dicInfo = ref<Array<any>>([])

const onButtonClick = (btn: BtnItem) => {
  ;['board'].includes(btn.fun) && boardRef?.value?.openDrawer()
  ;['solution', 'seal'].includes(btn.fun) && plateRef?.value?.openDialog(btn.fun)
  ;['quickEdit'].includes(btn.fun) &&
    detailsRef?.value?.openDrawer({}, 'quickEdit', directSubs.value)
}

const {
  dataList,
  directSubs,
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
  options: toRef(options, 'value'),
  dicInfo: toRef(dicInfo, 'value'),
  onButtonClick
})

const { getPermissionInfo, grabCheck } = useRole('人力行政')

const initDic = () => {
  const list: any = getIntDictOptions('monthly_assessment', true)
  const colors: any = [
    { value: '1', color: '#EB3737', background: 'rgba(235, 55, 55, 0.2)' },
    { value: '9', color: '#349B34', background: 'rgba(52, 155, 52, 0.2)' },
    { value: '7', color: '#0064FF', background: 'rgba(0, 100, 255, 0.2)' },
    { value: '5', color: '#CD8200', background: '#FFF4C8' }
  ]
  dicInfo.value = list.map((li: any) => {
    const tar: any = colors.find((ci: any) => ci.value === li.value)
    return tar?.color ? { ...li, ...tar } : li
  })
}

const departmentInit = () => {
  request.get({ url: `/api/employeeMonthlyAssessment/getAllOneDepartment` }).then((res: any) => {
    options.value = (res || []).map((rs: any) => ({
      name: rs.name,
      id: rs.id,
      value: rs.id,
      label: rs.name,
      children: rs.children
    }))
  })
}

const initUser = async (fun: Function = () => {}) => {
  await getUpstageInfo()
  await getHrInfo()
  fun()
}

const getUpstageInfo = async () => {
  await getPermissionInfo(() => {
    userInfo.value = { ...userInfo.value, isManagement: grabCheck('月度考核-管理员') }
    !!userInfo.value.isManagement && departmentInit()
  })
}

const getHrInfo = async () => {
  await request.get({ url: `/api/employeeMonthlyAssessment/isHrbp` }).then((res: any) => {
    userInfo.value = { ...userInfo.value, isHrbp: res || false }
  })
}

const setParamsData = (noPage: boolean = false) => {
  return noPage
    ? { ...searchData.value }
    : { ...searchData.value, page: page.value.page, pageSize: page.value.size }
}

const onSearch = () => {
  const params: any = { ...setParamsData() }
  if (!userInfo.value.isHrbp) {
    params.userId = params.isSub ? userStore?.user?.userNo : ''
  }
  if (params.firstDepartIds) {
    const firstDepartIds = params.firstDepartIds.map((item: any) => item[item.length - 1]).join()
    params.firstDepartIds = firstDepartIds ? firstDepartIds.split(',') : null
  }
  delete params.isSub
  loading.value = true
  request
    .post({ url: `/api/employeeMonthlyAssessment/pageList`, data: params })
    .then((res: any) => {
      dataList.value = res.records?.length ? [...res.records] : []
      page.value = { ...page.value, total: res.total }
    })
    .finally(() => {
      getStateInfo()
      getDirectSubs(0)
      loading.value = false
    })
}

const resetForm = () => {
  page.value = { ...new PageItem() }
  searchData.value = { ...new SearchItem() }
  searchData.value.isSub = !userInfo.value?.isHrbp
  onSearch()
}

const getStateInfo = () => {
  const params: any = setParamsData()
  if (!userInfo.value.isHrbp) {
    params.userId = params.isSub ? userStore?.user?.userNo : ''
  }
  if (params.firstDepartIds) {
    const firstDepartIds = params.firstDepartIds.map((item: any) => item[item.length - 1]).join()
    params.firstDepartIds = firstDepartIds ? firstDepartIds.split(',') : null
  }
  delete params.isSub
  delete params.sftb
  request
    .post({ url: `/api/employeeMonthlyAssessment/statistics`, data: params })
    .then((res: any) => {
      res && (stateInfo.value = { ...res })
    })
}

const getDirectSubs = (type: number) => {
  const paramsData: any = setParamsData()
  const params = {
    month: paramsData.khzq
  }
  request.get({ url: `/api/employeeMonthlyAssessment/getDirectSubs`, params }).then((res: any) => {
    res && (directSubs.value = res)
  })
}

const viewDetails = (type: string, item?: any, btn?: any) => {
  if (type === 'record') {
    recordsRef?.value?.openView(item, type, dicInfo.value)
    return
  }
  detailsRef?.value?.openDrawer(item, type)
}

onMounted(() => {
  initDic()
  initUser(() => {
    dataList.value = []
    searchData.value.isSub = !userInfo.value?.isHrbp
    onSearch()
  })
})

setRouterInfo()

provide('MonthAssessmentRecordDialog', { dicInfo: toRef(dicInfo, 'value') })

provide('MonthAssessmentForm', {
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
<style lang="scss" scoped></style>
