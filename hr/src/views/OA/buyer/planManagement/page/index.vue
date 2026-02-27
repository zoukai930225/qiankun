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
      list-name="企划管理列表"
    />
    <RandomPlanDrawer ref="drawerRef" @success="onSearch" />
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'RandomInspectionPlanConfigurationPage' }
</script>

<script lang="tsx" setup>
import { onMounted, provide, ref, toRef } from 'vue'
import { useRouter } from 'vue-router'
import { PageItem } from '@/components/template/config/type'
import RandomPlanDrawer from '../details/editDrawer.vue'
import { usePage, SearchItem, DataItem, CATEGORY_PROVIDE_KEY } from '../config/config'
import { useMessage } from '@/hooks/web/useMessage'
import {
  deleteBuyerPlan,
  getBuyerPlanDetail,
  getBuyerPlanPage
} from '@/api/oa/buyer/planManagement'
import { useRole } from '@/hooks/common/useRole'

const { getPermissionInfo, grabCheck, getRole } = useRole('新品')

const drawerRef = ref<InstanceType<typeof RandomPlanDrawer> | null>(null)
const pageName = 'RandomInspectionPlanConfiguration'
const router = useRouter()

const userInfo = ref<Record<string, any>>({})

const CATEGORY_OPTIONS = Object.freeze([
  { label: '内裤品', value: 1 },
  { label: '内衣', value: 2 },
  { label: '季节品', value: 3 },
  { label: '袜子', value: 4 }
])

const categoryLabelMap = new Map<string | number, string>()
const categoryValueByLabelMap = new Map<string, number>()
CATEGORY_OPTIONS.forEach((option) => {
  categoryLabelMap.set(option.value, option.label)
  categoryLabelMap.set(String(option.value), option.label)
  categoryValueByLabelMap.set(option.label, option.value)
  categoryValueByLabelMap.set(String(option.value), option.value)
})

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

const message = useMessage()

const ensureCategoryName = (category: any, categoryName?: string) => {
  if (categoryName) return categoryName
  const label = categoryLabelMap.get(category as any) ?? categoryLabelMap.get(String(category))
  return label ?? ''
}

const toDisplayString = (value: unknown) => {
  if (value === undefined || value === null) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' && Number.isFinite(value)) return value.toString()
  return String(value)
}

const transformPlanRecord = (item: Record<string, any>) => {
  const record = Object.assign(new DataItem(), item)
  record.category = item.category
  record.categoryName = ensureCategoryName(record.category, item.categoryName)
  record.fabricContent = typeof item.fabricContent === 'string' ? item.fabricContent : ''
  record.pricing = toDisplayString(item.pricing ?? item.price)
  record.salesVolume = toDisplayString(item.salesVolume ?? item.sales)
  record.costEstimate = toDisplayString(item.costEstimate ?? item.cost)
  return record
}

const setParamsData = (noPage = false) => {
  const params: Record<string, any> = {}
  const category = (searchData.value as any).category
  if (category !== undefined && category !== null && category !== '') {
    params.category = typeof category === 'number' ? category : String(category)
  }
  const keyword = (searchData.value as any).keyword?.trim?.()
  if (keyword) params.keyword = keyword
  const planName = (searchData.value as any).planName?.trim?.()
  if (planName) params.planName = planName
  const planInitiateTime = (searchData.value as any).planInitiateTime
  if (Array.isArray(planInitiateTime) && planInitiateTime.length === 2) {
    const [start, end] = planInitiateTime
    if (start) params.startTime = start
    if (end) params.endTime = end
  }
  if (noPage) return params
  return {
    ...params,
    page: page.value.page,
    size: page.value.size
  }
}

const onSearch = async () => {
  loading.value = true
  try {
    const params = setParamsData()
    const res = await getBuyerPlanPage(params)
    const records = res.records
    const formatted = records.map(transformPlanRecord)
    dataList.value = formatted
    page.value = {
      ...page.value,
      total: res.total
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  page.value = { ...new PageItem() }
  searchData.value = { ...new SearchItem() }
  onSearch()
}

const handleDelete = async (item: Record<string, any>) => {
  if (!item?.id && item?.id !== 0) {
    message.warning('缺少主键，无法执行删除')
    return
  }
  try {
    await message.confirm(
      '删除后，将同步删除关联此企划名称的所有参选产品库，是否确认删除？',
      '提示'
    )
    loading.value = true
    await deleteBuyerPlan(item.id)
    message.success('删除成功')
    onSearch()
  } catch (error: any) {
    if (error === 'cancel' || error === 'close') return
    console.error(error)
  } finally {
    loading.value = false
  }
}

const unwrapDetailResponse = (res: any): any => {
  if (!res) return null
  if (Array.isArray(res)) return res[0] ?? null
  const candidates = [res.record, res.detail, res.info, res.result, res.data]
  for (const candidate of candidates) {
    if (!candidate) continue
    if (Array.isArray(candidate)) return candidate[0] ?? null
    if (typeof candidate === 'object') {
      const nested = unwrapDetailResponse(candidate)
      if (nested) return nested
    }
  }
  return res
}

const fetchPlanDetail = async (id: string | number) => {
  if (id === undefined || id === null || id === '') return null
  try {
    const res = await getBuyerPlanDetail(id)
    const detailSource = unwrapDetailResponse(res)
    if (!detailSource) return null
    return transformPlanRecord(detailSource)
  } catch (error) {
    console.error(error)
    message.error('获取详情失败')
    return null
  }
}

const onButtonClick = () => {
  drawerRef.value?.openDrawer({}, 'add')
}

const viewDetails = async (type: string, item?: any) => {
  if (type === 'add') {
    drawerRef.value?.openDrawer({}, 'add')
    return
  }
  if (type === 'delete' || type === 'del') {
    await handleDelete(item ?? {})
    return
  }
  if (type === 'candidate') {
    const planName = typeof item?.planName === 'string' ? item.planName.trim() : ''
    router.push({
      name: 'ProductReferenceLibrary',
      query: {
        planName
      }
    })
    return
  }
  const targetId = item?.id ?? ''
  if (!targetId && targetId !== 0) {
    message.warning('缺少主键，无法获取数据')
    return
  }
  const detail = await fetchPlanDetail(targetId)
  if (!detail) return
  if (type === 'edit') {
    drawerRef.value?.openDrawer({ ...detail }, 'edit')
    return
  }
  drawerRef.value?.openDrawer({ ...detail }, 'view')
}

const initPage = async () => {
  await onSearch()
}

onMounted(() => {
  getPermissionInfo(async () => {
    userInfo.value = { isAdd: grabCheck('新品企划负责人') }
    await initPage()
  })
})

setRouterInfo()

provide(CATEGORY_PROVIDE_KEY, {
  options: CATEGORY_OPTIONS,
  labelMap: categoryLabelMap,
  valueMap: categoryValueByLabelMap
})

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
