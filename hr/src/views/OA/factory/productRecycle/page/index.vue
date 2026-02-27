<template>
  <ex-screen>
    <query-scheme
      :scheme="scheme"
      v-model="searchData"
      name="Factoryproductrecycle"
      show-expand
    />
    <scheme-table
      :btn-list="btns"
      :handle-column="handleColumn"
      :screen="screen"
      name="Factoryproductrecycle"
      :column="column"
      :table-data="dataList"
      :list-name="'回收产品列表'"
    />
    <factoryProductRecycle-details ref="detailsRef" />
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'Factoryproductrecycle' }
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type'
import FactoryProductRecycleDetails from '../details/index.vue'
import { useRole } from '@/hooks/common/useRole'
import { getIntDictOptions } from '@/utils/dict'
import { usePage, SearchItem } from './config'
import request from '@/config/axios'
import { useUserStore } from '@/store/modules/user'
const message = useMessage()
const router = useRouter()
const detailsRef = ref<any>(),
  plateRef = ref(),
  boardRef = ref()
const userStore = useUserStore()

// const userInfo = ref<any>({ isManagement: false, isHrbp: false })

const getDictLabels = (dicts: any, value: string, separator: string = ',') => {
  if (!value) return '-'
  const arr = value.split(separator)
  if (!arr || arr.length === 0) return '-'
  return arr
    .map((item: any) => {
      const tar = dicts.find((dict: any) => dict.value === item)
      return (tar && tar.label) || item
    })
    .join()
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
  permissions: userStore?.permissions || [],
  dicInfo: getIntDictOptions('fs_node_name'),
  resonDict: getIntDictOptions('fs_recycled_reason'),
  getDictLabels
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
  const params: any = { ...setParamsData() }
  if (params.recycleTime && params.recycleTime.length > 0) {
    params.recycleTimeStart = params.recycleTime[0]
    params.recycleTimeEnd = params.recycleTime[1]
  }
  delete params.recycleTime
  loading.value = true
  request
    .get({
      url: `/workflow-api/api/workflow/business/factorySecondary/recycledProduct/list`,
      params
    })
    .then((res: any) => {
      dataList.value = res.records?.length ? [...res.records] : []
      page.value = { ...page.value, total: res.total }
    })
    .finally(() => {
      // getStateInfo()
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
  ;['board'].includes(btn.fun) && boardRef?.value?.openView()
  ;['solution', 'seal'].includes(btn.fun) && plateRef?.value?.openDialog(btn.fun)
}

// 操作列回调
const viewDetails = async (type: string, item?: any, btn?: any) => {
  const { supplierId, id, fsTaskId } = item
  if (type === 'view') {
    if (!supplierId) {
      message.notifyWarning('未匹配供应商')
      return
    }
    router.push({
      name: 'FactoryProductProgress',
      query: {
        supplierId
      },
      params: {
        id: fsTaskId
      }
    })
    return
  }

  // 删除
  if (type === 'delete') {
    await message.confirm('是否确定删除？')
    await request.get({
      url: `/workflow-api/api/workflow/business/factorySecondary/recycledProduct/delete/${id}`
    })
    message.success('删除成功！')
    onSearch()
    return
  }

  // 重新恢复
  if (type === 'recover') {
    try {
      await message.confirm('重新恢复后，当前流程将重新回到回收时所在的流程节点，是否确认恢复？')
      loading.value = true
      await request.get({
        url: `/workflow-api/api/workflow/business/factorySecondary/recycledProduct/supplier/recover/${id}`
      })
      message.success('操作成功！')
      onSearch()
    } finally {
      loading.value = false
    }
    return
  }
  detailsRef?.value?.openView(item, type)
}

onMounted(() => {
  dataList.value = []
  onSearch()
})

setRouterInfo()

provide('FactoryproductrecycleForm', {
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
