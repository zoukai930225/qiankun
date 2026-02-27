<!--
 * @Date: 2025-01-03 16:22:21
-->
<template>
  <div>
    <ContentWrap>
      <SWForm ref="SWFormRef" :fields="configList" :isShowSupplyChainChosen="isShowSupplyChainChosen"
        @search="handleSearch" @reset="handleReset" @add="handleAdd" @upload-design-img="handleAddDesignImg"
        :categoryList="categoryList" />
      <!-- </ContentWrap>
    <ContentWrap> -->
      <!-- <div class="tips">
        <el-icon color="#EB3737"><QuestionFilled /></el-icon>
        <span>禁止编辑，其余未标志的双击进行编辑</span>
      </div> -->
      <div class="table-main">
        <SWTable ref="tableRef" :tableColumns="configList" :isShowSupplyChainChosen="isShowSupplyChainChosen"
          :tableData="list" :total="total" :loading="loading" @blur="handleBlur" @get-list="getList"
          @save-designer="handleSaveDesigner" @save-chosen-supplier-staff="handleSaveChosenSupplierStaff"
          @page-change="handlePageChange" @sort-change="handleSortChange" @open-handle="openHandle"
          @update-progress="updateProgress" @handle-selection-change="handleSelectionChange"
          @savePatternMaker="handleSavePatternMaker" />
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
import { getBasicAttribute } from '@/api/oa/new/plan/index'
import {
  getDevelopList,
  updateDevelop,
  updateDevelopDistributeDesigner,
  updateDistributeChosenSupplier,
  updatePatternMaker
} from '@/api/oa/new/develop'
import SWForm from './components/SWForm.vue'
import SWTable from './components/SWTable.vue'
import NewDrawer from './components/newDrawer.vue'
import CompetitorDrawer from './components/competitorDrawer.vue'
import TemplateDialog from './components/templateDialog.vue'
import { useCategoryList } from './hooks.js'
const { categoryList, initSelectData } = useCategoryList()

const planCode = route.query.planCode || undefined

const ids = route.query.ids || undefined

// const message = useMessage() // 消息弹窗
defineOptions({ name: 'Develop' })
const list = ref<any[]>([]) // 列表数据
const total = ref(0) // 总数
const configList = ref<any[]>([]) // 配置列表
const form = ref<any>({
  page: 1,
  size: 10,
  planName: '',
  planCode
  // npBusinessEnterprisePlanId: ''
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
      size: form.value.size
      // npBusinessEnterprisePlanId: form.value.npBusinessEnterprisePlanId
    },
    val
  )
  configList.value.forEach((item: any) => {
    if (item.type === 8 && form.value[`${item.code}List`]) {
      form.value[`${item.code}List`] = undefined
    }
  })
  if (!form.value.planListDate) {
    form.value.planListDate = undefined
  }

  form.value.chosenSupplierStaffIdList = undefined

  tableRef.value?.updateCurrentPage(1)
  getList()
}

const handleReset = () => {
  form.value = {
    page: 1,
    size: 10
    // npBusinessEnterprisePlanId: form.value.npBusinessEnterprisePlanId
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
  // route.push(`/admin/oa/new/designGallery?planName=${planName}`)
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

const handleSaveDesigner = async (row) => {
  let obj = JSON.parse(JSON.stringify(row))
  if (obj.jsonData) {
    delete obj.jsonData
  }
  if (obj.listingDate && obj.listingDate.indexOf(':') === -1) {
    obj.listingDate = obj.listingDate + ' 00:00:00'
  }
  await updateDevelopDistributeDesigner(obj)
  getList()
}

const handleSaveChosenSupplierStaff = async (row) => {
  await updateDistributeChosenSupplier({
    id: row.id,
    chosenSupplierStaffId: row.chosenSupplierStaffId
  }).catch((err) => { })
  getList()
}

// 版师
const handleSavePatternMaker = async (row) => {
  await updatePatternMaker({
    id: row.id,
    patternMakerId: row.patternMakerId
  }).catch((err) => { })
  getList()

}
// 分页变化
const handlePageChange = (val: any) => {
  form.value.page = val.page
  form.value.size = val.size
  getList()
}

const orderParam = ref({
  prop: '',
  custorOrder: null
})

const handleSortChange = (data) => {
  form.value = { ...form.value, ...data }
  getList()
}

// 点击企划编号
const newDialogRef = ref()
// 点击竞品信息
const competitorRef = ref()
// 进度模板
const templateRef = ref()
const openHandle = (row: any, key: string) => {
  if (key === 'planName') {
    newDialogRef.value.open(row.id, row.npBusinessEnterprisePlanId)
  } else if (key === 'competitorsInfo') {
    competitorRef.value.open(row.id)
  } else if (key === 'progressTemplate') {
    templateRef.value.open(row.id, row.progressTemplateId)
  }
}

const warnConfig = {
  id: 0,
  name: '',
  listDisplay: true,
  state: 1,
  code: 'customWarn'
}
// 获取配置
const getConfig = async () => {
  const params = {
    code: 'Develop'
  }
  const res = await getBasicAttribute(params)
  configList.value = res || []
  handleIsShowWarnInfo()
  // console.log('configList', configList.value)
}

const handleIsShowWarnInfo = () => {
  if (list.value.length > 0 && configList.value.length > 0) {
    const isShowWarn = list.value.some((item) => item.newProgress === '1')
    if (configList.value[0].code === 'customWarn' && !isShowWarn) {
      configList.value.splice(0, 1)
    } else if (configList.value[0].code !== 'customWarn' && isShowWarn) {
      configList.value = [warnConfig, ...configList.value]
    }
  }
}

const updateProgress = (row) => {
  list.value.forEach((item) => {
    if (item.id === row.id) {
      item.newProgress = row.newProgress
    }
  })
  handleIsShowWarnInfo()
}

const handleSuccess = () => {
  form.value.page = 1
  getList()
}

const sortChange = (data) => {
  console.log(data)
}

// 是否展示选供专员框
const isShowSupplyChainChosen = ref(true)

const getList = async () => {
  try {
    loading.value = true
    form.value = Object.entries(form.value).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        acc[key] = value
      }
      return acc
    }, {}) as any
    var formData = new FormData()

    formData.append(
      'queryParam',
      JSON.stringify({
        ...form.value,
        page: undefined,
        pageSize: undefined
        // npBusinessEnterprisePlanId: undefined
      })
    )
    let paramsData = {
      ...form.value
    }
    if (paramsData.designPictureDeadline && paramsData.designPictureDeadline.length > 1) {
      paramsData['designPictureStartTime'] = paramsData.designPictureDeadline[0]
      paramsData['designPictureEndTime'] = paramsData.designPictureDeadline[1]
    } else {
      paramsData['designPictureStartTime'] = undefined
      paramsData['designPictureEndTime'] = undefined
    }
    paramsData.designPictureDeadline = undefined

    const res = await getDevelopList(paramsData)
    loading.value = false
    list.value = res.records || []
    handleIsShowWarnInfo()
    total.value = res.total || 0
  } catch (error) {
    loading.value = false
  }
}

const SWFormRef = ref()
onMounted(async () => {
  initSelectData()
  handleRouteParam()
  await getConfig()
  !ids && getList()
})

onActivated(() => {
  handleRouteParam()
})

const handleRouteParam = () => {
  let planName = route.query.planName
  let planCode1 = route.query.planCode || undefined

  if (ids) {
    form.value.ids = ids
    getList()
  }
  if (planName) {
    form.value.planName = planName + ''
    SWFormRef.value.setSearchPlanNameValue(planName)
    getList()
  }
  if (planCode1 && form.value.planCode !== planCode1) {
    form.value.planCode !== planCode1
    SWFormRef.value.setSearchPlanCodeValue(planCode1)
    getList()
  }
}

if (planCode || route.query?.planName || ids) {
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
  // background: linear-gradient(
  //   0,
  //   rgba(250, 252, 255, 0.19) 0%,
  //   rgba(242, 247, 255, 0.78) 37%,
  //   #ebf2ff 100%
  // );
  border-radius: 6px;
  margin-top: 15px;
  // padding: 20px;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background: #0064ff;
}
</style>
