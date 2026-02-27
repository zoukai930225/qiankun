<template>
  <ex-screen>
    <query-scheme :scheme="scheme" v-model="searchData" :name="pageName" :show-expand="false" />
    <scheme-table
      :btn-list="btns"
      :handle-column="handleColumn"
      :screen="screen"
      :name="pageName"
      :column="column"
      :table-data="dataList"
      list-name="抽查配置列表"
    />
    <RandomPlanDetails ref="detailsRef" />
    <!-- <el-button type="primary" @click="handlePreview">打印预览</el-button>
    <el-button type="primary" @click="handleExport"> 导出 </el-button> -->
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'RandomInspectionPlanConfigurationPage' }
</script>

<script lang="tsx" setup>
import { useDialog } from '@/hooks/web/useDialog'
import { useLoadingStore } from '@/store/modules/loading'
import {
  exportQualityPreview,
  fetchQualityPreviewReport
} from '../../quality/components/preview/export'
import { PageItem } from '@/components/template/config/type'
import RandomPlanDetails from '../details/index.vue'
import { usePage, SearchItem } from '../config/config'
import { useMessage } from '@/hooks/web/useMessage'
import {
  deleteRandomInspectionPlan,
  getRandomInspectionPlanOptions,
  getRandomInspectionPlanPage
} from '@/api/supplier/qcManagement/randomInspectionPlanConfiguration'
import { useRole } from '@/hooks/common/useRole'

const { openDialog } = useDialog()
const loadingStore = useLoadingStore()
const vueInstance = getCurrentInstance()

const { getPermissionInfo, grabCheck, getRole } = useRole('供应链')

const detailsRef = ref<InstanceType<typeof RandomPlanDetails> | null>(null)
const pageName = 'RandomInspectionPlanConfiguration'

const userInfo = ref<Record<string, any>>({})

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
  planOptions
} = usePage({ userInfo: toRef(userInfo, 'value') })

const message = useMessage()

// 处理请求数据
const setParamsData = (noPage: boolean = false) => {
  const params: Record<string, any> = {}
  const configId = searchData.value.configId
  if (configId !== undefined && configId !== null && configId !== '') {
    params.id = configId
  }
  const rangeValue = searchData.value.rangeValue
  if (rangeValue !== undefined && rangeValue !== null) {
    params.rangeValue = rangeValue
  }
  const baseParams = noPage
    ? params
    : {
        ...params,
        page: page.value.page,
        size: page.value.size
      }
  return baseParams
}

const normalizeRangeValue = (value: any) => {
  if (value === null || value === undefined) return ''
  return value
}

const buildRangeLabel = (start?: any, end?: any) => {
  const startVal = normalizeRangeValue(start)
  const endVal = normalizeRangeValue(end)
  if (startVal === '' && endVal === '') return ''
  const startText = startVal === '' ? '' : `${startVal}`
  const endText = endVal === '' ? '' : `${endVal}`
  return `${startText}${startText && endText ? ' - ' : ''}${endText}`
}

const formatRecords = (records: Array<Record<string, any>> = []) => {
  return records.map((item: Record<string, any>) => {
    const initialValue = item.initialValue
    const endValue = item.endValue
    const rangeLabel = item.batchRangeName
    return {
      id: item.id,
      initialValue,
      endValue,
      rangeLabel,
      sampleSize: item.sampleSize,
      onePointFiveAc: item.onePointFiveAc,
      onePointFiveRe: item.onePointFiveRe,
      twoPointFiveAc: item.twoPointFiveAc,
      twoPointFiveRe: item.twoPointFiveRe
    }
  })
}

// 查询
const onSearch = async () => {
  loading.value = true
  try {
    const params: any = setParamsData()
    const res: any = await getRandomInspectionPlanPage(params)
    const records = res?.records || res?.list || res?.rows || []
    const formatted = formatRecords(records)
    dataList.value = formatted
    page.value = {
      ...page.value,
      total: res?.total ?? res?.page?.total ?? res?.totalCount ?? records.length
    }
    setPlanOptions(records)
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 重置
const resetForm = () => {
  page.value = { ...new PageItem() }
  searchData.value = { ...new SearchItem() }
  planOptions.value = []
  onSearch()
}

const setPlanOptions = (records: Array<Record<string, any>> = []) => {
  const optionMap = new Map<string, { label: string; value: string | number }>()
  records.forEach((item: any) => {
    const id = item?.id ?? item?.planId
    if (!id && id !== 0) return
    const label =
      item?.batchRangeName ??
      buildRangeLabel(
        item?.initialValue ?? item?.initial ?? item?.startValue ?? item?.batchRangeStart,
        item?.endValue ?? item?.end ?? item?.finishValue ?? item?.batchRangeEnd
      )
    if (!label) return
    optionMap.set(String(id), {
      label,
      value: id
    })
  })
  planOptions.value = Array.from(optionMap.values())
}

const fetchPlanOptions = async () => {
  try {
    const res: any = await getRandomInspectionPlanOptions()
    const optionSource = Array.isArray(res) ? res : res?.records || res?.list || res?.rows || []
    setPlanOptions(optionSource)
  } catch (error) {
    console.error(error)
  }
}

const handleDelete = async (item: Record<string, any>) => {
  if (!item?.id) {
    message.warning('缺少主键，无法执行删除')
    return
  }
  try {
    await message.confirm('确认删除该抽查方案配置吗？', '提示')
    loading.value = true
    await deleteRandomInspectionPlan({ id: item.id })
    message.success('删除成功')
    onSearch()
  } catch (error: any) {
    if (error === 'cancel' || error === 'close') return
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 按钮回调
const onButtonClick = () => {
  // 预留后续拓展
}

// 操作列回调
const viewDetails = (type: string, item?: any) => {
  if (type === 'delete') {
    handleDelete(item)
    return
  }
  detailsRef?.value?.openView(item, type)
}

const initPage = async () => {
  await fetchPlanOptions()
  await onSearch()
}

onMounted(() => {
  getPermissionInfo(() => {
    userInfo.value = { isAdd: grabCheck('QC权限'), role: getRole('QC权限') }
    dataList.value = []
    initPage()
  })
})

setRouterInfo()

async function handlePreview() {
  const earlyStageReportId = '68ca6080-9325-467f-bdae-f8b24842e838'
  const lateStageReportId = 'b484cb70-0975-458e-b5d6-b545c3034ea9'
  const reportId = lateStageReportId
  // if (reportId === undefined || reportId === null || reportId === '') {
  //   message.warning('请选择要预览的质检报告')
  //   return
  // }

  loadingStore.showLoading()
  try {
    const report = await fetchQualityPreviewReport({ reportId })
    openDialog({
      title: '打印预览',
      content: defineAsyncComponent(() => import('../../quality/components/preview/index.vue')),
      width: '1290px',
      footer: false,
      props: {
        report
      }
    })
  } catch (error) {
    console.error(error)
    message.error('预览失败，请稍后重试')
  } finally {
    loadingStore.hideLoading()
  }
}

function handleExport() {
  const reportId = 'ac1cc2ae-5280-46d1-805e-b572940cf8ee'
  // if (reportId === undefined || reportId === null || reportId === '') {
  //   message.warning('请选择要导出的质检报告')
  //   return
  // }
  exportQualityPreview(vueInstance?.appContext, {
    filename: '品质检验报告.pdf',
    reportId
  })
    .catch((error) => {
      console.error(error)
      message.error('导出失败，请稍后重试')
    })
    .finally(() => {})
}

provide(`${pageName}Form`, {
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
