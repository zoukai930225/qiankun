<template>
  <ex-screen class="orderStructure">
    <query-scheme
      :scheme="scheme"
      v-model="searchData"
      name="orderStructure"
      :show-expand="false"
    />
    <div class="summary-cnt">
      <div
        >总搭配次数：<span class="summary-cnt-value">{{ summary.totalCombinationTimes }}</span></div
      >
      <div
        >有效搭配次数：<span class="summary-cnt-value valid-count">{{
          summary.validCombinationTimes
        }}</span></div
      >
      <div
        >占比：<span class="summary-cnt-value proportion">{{ summary.proportion }}%</span></div
      >
    </div>
    <scheme-table
      :btn-list="btns"
      :handle-column="handleColumn"
      :screen="screen"
      name="orderStructure"
      :column="column"
      :table-data="dataList"
      :list-name="'订单结构分析列表'"
    />
    <sku-dialog ref="skuDialogRef" @success="onSearch" />
    <download-drawer ref="downloadDrawerRef" />
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'orderStructure' }
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type'
import { usePage, SearchItem } from './config'
import request from '@/config/axios'
import SkuDialog from '../components/SkuDialog.vue'
import DownloadDrawer from '../components/downloadDrawer.vue'
import { useMessage } from '@/hooks/web/useMessage'
const detailsRef = ref<any>(),
  skuDialogRef = ref<any>(),
  downloadDrawerRef = ref<any>()

const message = useMessage()

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
const summary = ref<any>({
  totalCombinationTimes: 0,
  validCombinationTimes: 0,
  proportion: 0
})
// 处理请求数据
const setParamsData = (noPage: boolean = false) => {
  return noPage
    ? { ...searchData.value }
    : { ...searchData.value, pageNum: page.value.page, pageSize: page.value.size }
}

// 查询
const onSearch = () => {
  const params: any = setParamsData()
  loading.value = true
  request
    .get({ url: `/api/productBundlingAnalysis/list`, params: params })
    .then((res: any) => {
      dataList.value = res?.list?.length ? [...res.list] : []
      summary.value.totalCombinationTimes = res?.bundleCount || 0
      summary.value.validCombinationTimes = res?.validBundleCount || 0
      summary.value.proportion = ((res?.validBundleCount / res?.bundleCount) * 100 || 0).toFixed(4)
      page.value = { ...page.value, total: res?.total || 0 }
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
  if (btn.fun === 'viewSku') {
    viewSku()
  } else if (btn.fun === 'uploadSku') {
    uploadSku()
  } else if (btn.fun === 'refresh') {
    refreshSku()
  } else if (btn.fun === 'exportDrawer') {
    downloadDrawerRef.value?.openView()
  } else if (btn.fun === 'exportAction') {
    exportAction()
  }
}

const exportAction = () => {
  request.get({ url: `/api/productBundlingAnalysis/export`, params: setParamsData() })
  message.success('导出文件生成中，请稍后刷新结果下载列表查看结果')
}

// 操作列回调
const viewDetails = (type: string, item?: any, btn?: any) => {
  detailsRef?.value?.openView(item, type)
}

const viewSku = () => {
  skuDialogRef.value?.openDialog('view')
}

const uploadSku = () => {
  skuDialogRef.value?.openDialog('upload')
}
const refreshSku = async () => {
  await request.post({ url: `/api/productBundlingAnalysis/refresh` })
  message.success('刷新成功')
  onSearch()
}

onMounted(() => {
  dataList.value = []
  onSearch()
})

setRouterInfo()

provide('orderStructureForm', {
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
