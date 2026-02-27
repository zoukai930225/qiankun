<!--
 * @Date: 2025-01-03 16:22:21
-->
<template>
  <div>
    <ContentWrap>
      <SWForm ref="SWFormRef" @search="handleSearch" @reset="handleReset" @add="handleAdd"
        @upload-design-img="handleAddDesignImg" :categoryList="categoryList" />
    </ContentWrap>
    <ContentWrap>
      <div class="table-main">
        <SWTable ref="tableRef" :tableData="list" :total="total" :loading="loading" @blur="handleBlur"
          @page-change="handlePageChange" @sort-change="handleSortChange" @open-handle="openHandle"
          @save-designer="handleSaveDesigner" @save-chosen-supplier-staff="handleSaveChosenSupplierStaff"
          @update-progress="updateProgress" @handle-selection-change="handleSelectionChange" />
      </div>
    </ContentWrap>

    <!-- 上新计划 -->
    <NewDrawer ref="newDialogRef" />
    <!-- 竞品信息 -->
    <CompetitorDrawer ref="competitorRef" @success="getList" />
    <!-- 进度模板 -->
    <TemplateDialog ref="templateRef" @success="getList" />
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
import {
  getDevelopList,
  updateDevelop,
  updateDistributeChosenSupplier,
  updateDistributionDesigner
} from '@/api/oa/package/develop'
import SWForm from './components/SWForm.vue'
import SWTable from './components/SWTable.vue'
import CompetitorDrawer from './components/competitorDrawer.vue'
import NewDrawer from './components/newDrawer.vue'
import TemplateDialog from './components/templateDialog.vue'
import { useCategoryList } from './hooks.js'
import router from '@/router'
const { categoryList, initSelectData } = useCategoryList()

const planCode = route.query.planCode || undefined

const ids = route.query.ids || undefined

// const message = useMessage() // 消息弹窗
defineOptions({ name: 'PackageDevelop' })
const list = ref<any[]>([]) // 列表数据
const total = ref(0) // 总数
const form = ref<any>({
  page: 1,
  pageSize: 10,
  planName: undefined,
  taskCode: undefined,
  planCode: undefined,
  designerIdList: undefined,
  ids: undefined
})
const loading = ref(false)

// 选中的table数据
const selectTableValue = ref([])
const handleSelectionChange = (value) => {
  selectTableValue.value = value
}

const tableRef = ref()

// 参数变化
const handleSearch = (val: any) => {
  form.value = Object.assign(
    {
      page: 1,
      pageSize: form.value.pageSize
    },
    val
  )
  tableRef.value?.updateCurrentPage(1)
  form.value.designerIdList = undefined
  getList()
}

const handleSaveDesigner = async (row) => {
  console.log('handleSaveDesigner11111', row)
  const designerVosSubmit = row[`designerVos`] && row[`designerVos`].map((item) => item.userId)
  const data = {
    taskId: row.id,
    designerUserIds: designerVosSubmit
  }
  console.log('handleSaveDesigner data:', data)
  await updateDistributionDesigner(data)
  getList()
}

const handleSaveChosenSupplierStaff = async (row) => {
  console.log('handleSaveChosenSupplierStaff11111', row)
  const chosenSupplierStaffVosSubmit =
    row[`chosenSupplierStaffVos`] &&
    row[`chosenSupplierStaffVos`].map((item) => item.userId || item.chosenSupplierStaffId)
  await updateDistributeChosenSupplier({
    taskId: row.id,
    chosenSupplierStaffId: chosenSupplierStaffVosSubmit
  })
  getList()
}

const handleReset = () => {
  form.value = {
    page: 1,
    pageSize: 10,
    planName: undefined,
    planCode: undefined,
    designerIdList: undefined,
    ids: undefined
  }

  tableRef.value?.updateCurrentPage(1)
  orderParam.value = { prop: '', custorOrder: null }
  getList()
}

const handleAdd = () => {
  if (selectTableValue.value.length === 0) {
    ElMessage.warning('请选择数据')
    return
  }
  const idsArr = selectTableValue.value.map((item: any) => item.id)
  const ids = idsArr.join(',')
  competitorRef.value.open(ids)
}

const handleAddDesignImg = () => {
  if (selectTableValue.value.length === 0) {
    ElMessage.warning('请选择数据')
    return
  }
  if (selectTableValue.value.length > 0) {
    ElMessage.warning('请选择1条数据')
    return
  }
  router.push({ path: `/admin/oa/new/designGallery?planName=` })
}

// 更新
const handleBlur = async (row, key) => {
  let obj = JSON.parse(JSON.stringify(row))
  if (obj.jsonData) {
    delete obj.jsonData
  }
  if (obj.listingDate && obj.listingDate.indexOf(':') === -1) {
    obj.listingDate = obj.listingDate + ' 00:00:00'
  }
  await updateDevelop(obj)
  getList()
}
// 分页变化
const handlePageChange = (val: any) => {
  form.value.page = val.page
  form.value.pageSize = val.size
  getList()
}

const orderParam = ref({
  prop: '',
  custorOrder: null
})

const handleSortChange = ({ prop, custorOrder }) => {
  orderParam.value = { prop, custorOrder }
  getList()
}

// 点击企划编号
const newDialogRef = ref()
// 点击竞品信息
const competitorRef = ref()
// 进度模板
const templateRef = ref()
const openHandle = (row: any, key: string) => {
  console.log('openHandle1111', row, key)
  newDialogRef.value.open(row.id)
}

const warnConfig = {
  id: 0,
  name: '',
  listDisplay: true,
  state: 1,
  code: 'customWarn'
}

const updateProgress = (row) => {
  list.value.forEach((item) => {
    if (item.id === row.id) {
      item.newProgress = row.newProgress
    }
  })
}

const handleSuccess = () => {
  form.value.page = 1
  getList()
}

const getList = async () => {
  try {
    loading.value = true
    const params = {
      ...form.value,
      page: form.value.page,
      pageSize: form.value.pageSize
    }
    const res = await getDevelopList(params)
    loading.value = false

    list.value = formatList(res.records) || []
    total.value = res.total || 0
  } catch (error) {
    loading.value = false
  }
}

const formatList = (arr) => {
  return arr.map((item) => {
    // 修改designerVos数组中的designerId字段为userId
    if (item?.designerVos && item?.designerVos.length > 0) {
      item.designerVos = item.designerVos.map((designer) => {
        return {
          ...designer,
          userId: designer.designerId,
          name: designer.userName, // 确保有name字段
          avatarOrigin: designer.avatarOrigin || '' // 确保有avatarOrigin字段
        }
      })
    }
    return item
  })
}

const SWFormRef = ref()
onMounted(async () => {
  initSelectData()
  handleRouteParam()
  // await getConfig()
  getList()
})

onActivated(() => {
  handleRouteParam()
})

const handleRouteParam = () => {
  let planName = route.query.planName
  let taskCode = route.query.taskCode
  if (ids) {
    form.value.ids = ids
  }
  if (planName) {
    form.value.planName = planName + ''
    SWFormRef.value.setSearchPlanNameValue(planName)
  }
  if (taskCode) {
    form.value.taskCode = taskCode + ''
    SWFormRef.value.setSearchTaskCodeValue(taskCode)
  }
}

if (planCode || ids) {
  const newUrl = window.location.href.replace(/\?.*$/, '') // 获取当前路径，并去除参数
  history.replaceState({}, '', newUrl)
}
</script>

<style lang="scss" scoped>
.tips {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
  padding-bottom: 16px;

  .el-icon {
    margin-right: 12px;
    margin-left: 20px;
  }
}

.table-main {
  background: linear-gradient(0,
      rgba(250, 252, 255, 0.19) 0%,
      rgba(242, 247, 255, 0.78) 37%,
      #ebf2ff 100%);
  border-radius: 6px;
  padding: 20px;
}
</style>
