<template>
  <ex-screen>
    <query-scheme :scheme="scheme" v-model="searchData" :name="pageName" :show-expand="true" />

    <scheme-table
      ref="tableRef"
      :btn-list="btns"
      :handle-column="handleColumn"
      :screen="screen"
      :name="pageName"
      :column="column"
      :table-data="dataList"
      :table-props="{ selectable: rowSelectable }"
      :list-name="'来料检验列表'"
      :is-selection="true"
      :is-index="true"
      :show-screen="true"
    />
    <incoming-material-inspection-details ref="detailsRef" @submitted="onSearch" />
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'IncomingMaterialInspection' }
</script>

<script lang="tsx" setup>
import { ref, onMounted, toRef, provide } from 'vue'
import { PageItem, BtnItem } from '@/components/template/config/type'
import { usePage, SearchItem } from './config'
import IncomingMaterialInspectionDetails from '../details/index.vue'
import {
  getIncomingInspectionPage,
  exportIncomingInspection,
  type WhIncomingInspectionPageQuery
} from '@/api/storage/qualityInspection/incomingMaterialInspection'
import download from '@/utils/download'

const pageName = 'IncomingMaterialInspection'
const detailsRef = ref<any>()
const tableRef = ref<any>()
const userInfo = ref<any>({})

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
  userInfo: toRef(userInfo, 'value'),
  openDetails: (item: any) => detailsRef.value?.openView(item, 'view')
})

const setParamsData = (noPage: boolean = false) => {
  const raw = { ...searchData.value } as any
  const range = Array.isArray(raw.inspectionTimeRange) ? raw.inspectionTimeRange : []
  const inspectionTimeBegin = range?.[0] || ''
  const inspectionTimeEnd = range?.[1] || ''

  const selectedRows: any[] = (tableRef.value?.selectRows?.value ||
    tableRef.value?.selectRows ||
    []) as any[]
  const idList = noPage ? selectedRows.map((r) => r?.id).filter(Boolean) : []

  // 组装接口入参，避免把 inspectionTimeRange 直接发到后端
  const base: any = {
    idList,
    purchaseNo: raw.purchaseNo || '',
    goodsNo: raw.goodsNo || '',
    inspectionTimeBegin,
    inspectionTimeEnd,
    status:
      raw.inspectionStatus === '' ||
      raw.inspectionStatus === null ||
      raw.inspectionStatus === undefined
        ? ''
        : raw.inspectionStatus,
    inspectionQc: raw.inspectionQc || '',
    inspectionUser: raw.inspectionUser || ''
  }

  return noPage ? base : { ...base, page: page.value.page, size: page.value.size }
}

const onSearch = async () => {
  const params = setParamsData(false) as WhIncomingInspectionPageQuery
  loading.value = true
  try {
    const res = await getIncomingInspectionPage(params)
    const records = Array.isArray(res?.records) ? res.records : []
    // 字段不做兼容，直接使用后端返回字段
    dataList.value = records as any
    page.value = {
      ...page.value,
      total: Number(res?.total || 0),
      // 接口返回 current/size 时，同步回显；否则保留组件内的值
      page: Number(res?.current || page.value.page),
      size: Number(res?.size || page.value.size)
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

const onButtonClick = (btn: BtnItem) => {
  if (btn.fun === 'exportCustom') {
    const params = setParamsData(true) as any
    exportIncomingInspection({
      idList: Array.isArray(params?.idList) ? params.idList : [],
      purchaseNo: params?.purchaseNo || '',
      goodsNo: params?.goodsNo || '',
      inspectionTimeBegin: params?.inspectionTimeBegin || '',
      inspectionTimeEnd: params?.inspectionTimeEnd || '',
      status: params?.status ?? '',
      inspectionQc: params?.inspectionQc || '',
      inspectionUser: params?.inspectionUser || ''
    }).then((blob: any) => {
      const name = `${(btn as any)?.exportName || '来料检验导出'}-${Date.now()}.xlsx`
      download.excel(blob, name)
    })
    return
  }
}

const viewDetails = (type: string, item?: any) => {
  // 操作列的按钮会走这里（scheme-table 内部调用 viewDetails(btn.fun, row)）
  if (type === 'inspect') {
    detailsRef.value?.openView(item, 'inspect')
    return
  }

  // 兜底：其他类型默认打开详情
  detailsRef.value?.openView(item, type || 'view')
}

const rowSelectable = (row: any) => {
  // 未检(0) 的行不可勾选
  return Number(row?.inspectionStatus) !== 0
}

onMounted(() => {
  onSearch()
})

setRouterInfo()

// 2. 关键修复：使用变量拼接 Key，确保与子组件 inject 逻辑一致
// 子组件通常是 inject(`${props.name}Form`)
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
