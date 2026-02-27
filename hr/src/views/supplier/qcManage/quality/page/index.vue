<template>
  <ex-screen>
    <query-scheme :scheme="scheme" v-model="searchData" name="Quality" />
    <scheme-table
      :btn-list="btns"
      :handle-column="handleColumn"
      :screen="screen"
      name="Quality"
      :column="column"
      :table-data="dataList"
      :list-name="'QC质检报告列表'"
      mode="page"
    />
  </ex-screen>
  <SWDialog
    show-title-line
    show-bottom-line
    v-model="uploadDialogShow"
    title="附件上传"
    width="500"
  >
    <el-form :model="uploadForm" ref="uploadFormRef" :rules="rules" class="mt10px">
      <el-form-item label="" label-width="28" prop="mainFileIds">
        <transfer
          v-model="uploadForm.mainFileIds"
          style="width: 420px"
          :tip="'最多上传5张大小不超过20M的图片'"
          :limit="5"
          :upload-data="{ code: 'QC_QUALITY_INSPECTION_REPORT' }"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="mt10px mr10px">
        <el-button @click="uploadDialogShow = false">取消</el-button>
        <el-button
          type="primary"
          @click="submitUpload"
          :disabled="submitLoading"
          :loading="submitLoading"
        >
          确定
        </el-button>
      </div>
    </template>
  </SWDialog>
</template>

<script lang="tsx">
export default { name: 'Quality' }
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type'
import { exportQualityPreview } from '../components/preview/export'
import { useMessage } from '@/hooks/web/useMessage'
import { useRole } from '@/hooks/common/useRole'
import { getIntDictOptions } from '@/utils/dict'
import { usePage, SearchItem } from './config'
import { getCurrentInstance } from 'vue'
import { cloneDeep, debounce } from 'lodash-es'
import { cycle } from '../components/dic'
import request from '@/config/axios'
import Transfer from '@/components/common/upload/transfer.vue'

const optionInfo = ref<any>({ style: [] })

const userInfo = ref<any>({ isAdd: false }),
  supplierList = ref<Array<any>>([])

const route = useRoute()
const router = useRouter()

const message = useMessage()

const vueInstance = getCurrentInstance()

const categoryDic = ref([])
const getFirstCategoryDic = async () => {
  const res = await request.get({
    url: `/api/sysCategory/categorySelector/page`,
    params: { pageSize: -1, pageNum: 1 }
  })
  categoryDic.value = res?.records.length
    ? res?.records.map((item: any) => {
        return {
          label: item.categoryName || '',
          value: item.categoryCode || ''
        }
      })
    : []
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
  cycle: toRef(cycle, 'value'),
  userInfo: toRef(userInfo, 'value'),
  optionInfo: toRef(optionInfo, 'value'),
  supplierList: toRef(supplierList, 'value'),
  categoryDic: toRef(categoryDic, 'value')
})

const { getPermissionInfo, grabCheck, getRole } = useRole('供应链')

// 处理请求数据
const setParamsData = (noPage: boolean = false) => {
  let params: any = cloneDeep({ ...searchData.value })
  if (!!params?.time?.length) {
    params.submissionDateBegin = params.time[0]
    params.submissionDateEnd = params.time[1]
  }
  if (!!params?.qualityInspectionCycles?.length) {
    params.qualityInspectionCycle = params.qualityInspectionCycles.join(',')
  }
  if (!!params?.testResult?.length) {
    params.testResults = params.testResult.join(',')
  }
  if (!!params?.suppliers?.length) {
    params.supplier = params.suppliers.join(',')
  }
  if (!!params?.itemNumberId?.length) {
    params.itemNumberIds = params.itemNumberId.join(',')
  }
  if (!!params?.styleDescriptions?.length) {
    params.styleDescription = params.styleDescriptions.join(',')
  }
  if (!!params?.createdIds?.length) {
    params.createdId = params.createdIds.join(',')
  }
  delete params.testResult
  delete params.suppliers
  delete params.itemNumberId
  delete params.styleDescriptions
  delete params.createdIds
  delete params.qualityInspectionCycles
  delete params.time
  return noPage ? { ...params } : { ...params, page: page.value.page, size: page.value.size }
}

// 查询
const onSearch = () => {
  const params: any = setParamsData()
  loading.value = true
  request
    .post({ url: `/api/qcQualityInspectionReportInfo/page`, data: params })
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
  const params: any = setParamsData()
  request
    .post({ url: `/api/qcQualityInspectionReportInfo/selectCountForTestResults`, data: params })
    .then((res: any) => {
      res && (stateInfo.value = { ...res })
    })
}

// 按钮回调
const onButtonClick = (_btn: BtnItem) => {
  const { fun } = _btn
  if (fun === 'cusAdd') {
    const query = {
      type: 'add'
    }
    if (searchData.value.scPurchaseOrderNo) {
      query['scPurchaseOrderNo'] = searchData.value.scPurchaseOrderNo
    }
    router.push({
      path: '/admin/details/qualityDetails',
      query
    })
    return
  }
}

// 附件上传
const uploadDialogShow = ref(false)
const submitLoading = ref(false)
const uploadForm = ref<any>({
  id: '',
  mainFileIds: ''
})
const uploadFormRef = ref()
const rules = reactive({
  mainFileIds: [{ required: true, message: '请上传附件', trigger: ['blur', 'change'] }]
})
const submitUpload = debounce(async () => {
  await uploadFormRef.value?.validate()
  submitLoading.value = true
  request
    .post({
      url: `/api/qcQualityInspectionReportInfo/uploadAttachment`,
      data: { ...uploadForm.value }
    })
    .then(() => {
      message.success('提交成功')
      submitLoading.value = false
      uploadDialogShow.value = false
      onSearch()
    })
    .catch(() => {
      submitLoading.value = false
    })
})

// 操作列回调
const viewDetails = (type: string, item?: any) => {
  if (type === 'preview') {
    if (!item?.id) {
      message.error('缺少质检报告标识参数')
      return
    }
    exportQualityPreview(vueInstance?.appContext, {
      filename: '品质检验报告.pdf',
      reportId: item.id
    }).catch((error) => {
      console.error(error)
      message.error('打印预览失败，请稍后重试')
    })
  }
  if (type === 'attachUpload') {
    uploadDialogShow.value = true
    uploadForm.value.id = item.id
    uploadForm.value.mainFileIds = item.mainFileIds || ''
  }
}

const initDic = () => {
  optionInfo.value = {
    style: getIntDictOptions('style_description', true) || [],
    productType: getIntDictOptions('np_design_product_type', true) || []
  }
}

const getSelectOptions = () => {
  request.post({ url: `/api/qcDailyReportInfo/selectSupplierList` }).then((res: any) => {
    if (res && res.length) {
      supplierList.value = res.map((sup: any) => ({
        label: sup.abbreviationCompany || sup.fullCompany,
        value: sup.id,
        fullName: sup.fullCompany
      }))
    }
  })
}

watch(
  () => route,
  () => {
    const query: any = route.query
    if (!!Object?.keys(query)?.length) {
      if (JSON.stringify(route.query) === JSON.stringify({ operate: 'refresh' })) {
        onSearch()
        const newUrl = window.location.href.replace(/\?.*$/, '')
        history.replaceState({}, '', newUrl)
      }
    }
  },
  { deep: true }
)

onMounted(async () => {
  getFirstCategoryDic()
  getSelectOptions()
  initDic()
  getPermissionInfo(() => {
    userInfo.value = { isAdd: grabCheck('QC权限'), role: getRole('QC权限') }
    dataList.value = []
    onSearch()
  })
})

setRouterInfo()

provide('QualityForm', {
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
