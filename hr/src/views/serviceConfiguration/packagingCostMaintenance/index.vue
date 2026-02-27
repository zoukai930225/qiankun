<template>
  <div class="commonTopFilterWrap packageCostMaintenanceTopFilter">
    <div class="commonTopFilterWrap-filter">
      <el-form ref="queryFormRef" :inline="true" :model="queryParams" :label-width="80" @submit.prevent="handleQuery">
        <!-- 默认品类 -->
        <el-form-item v-if="activeName === 'category'" label="查询条件" prop="merchantCode">
          <el-select style="width: 200px;" v-model="queryParams.merchantCode" placeholder="请选择品类" @change="handleQuery"
            clearable>
            <el-option v-for="dict in getIntDictOptions(DICT_TYPE.STANDARD_CATEGORY, true)" :key="dict.code"
              :label="dict.label" :value="dict.code" />
          </el-select>
        </el-form-item>
        <!-- 商品  -->
        <el-form-item v-else label="查询条件" prop="merchantCode">
          <el-input style="width: 200px;height: 32px;" :prefix-icon="Search" v-model="queryParams.merchantCode"
            placeholder="请输入货品编码" @change="handleQuery" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select style="width: 200px;" v-model="queryParams.status" placeholder="请选择状态" @change="handleQuery">
            <el-option label="全部" value="3" />
            <el-option label="生效中" value="1" />
            <el-option label="已作废" value="2" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="commonTopFilterWrap-search">
      <div class="commonTopFilterWrap-search-container">
        <el-button @click="handleQuery" class="commonSearchBtn">
          <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
          搜索
        </el-button>
        <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0">
          重置
        </el-button>
      </div>
    </div>
  </div>
  <ContentWrap>
    <div class="top-header">
      <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-change="handleClick">
        <el-tab-pane v-for="tab in tabs" :key="tab.name" :label="tab.label" :name="tab.name" />
      </el-tabs>
      <div>
        <el-button type="primary" @click="openForm('create', undefined)">
          <Icon class="commonSearchBtnIcon" :size="12" icon="ep:plus" />
          新增
        </el-button>
      </div>
    </div>
    <ListTable :list="list" :loading="loading" :tab-type="activeName" @open-form="openForm"
      @template-file-download="templateFileDownload" @upload="openUploadDialog" @export="handleExport"
      @historical-packaging-price="openHistoricalPackagingPriceDialog" @delete="handleDelete" />
    <!-- 分页 -->
    <Pagination v-model:limit="queryParams.size" v-model:page="queryParams.page" :total="total" @pagination="getList" />
  </ContentWrap>

  <!-- 历史包装价 -->
  <HistoricalPackagingPriceDrawer ref="historicalPackagingPriceRef" :tab-type="activeName" />
  <!-- 新增弹窗 -->
  <AddForm ref="addFormRef" @success="getList" :tab-type="activeName" />
  <!-- 导入 -->
  <UploadDialog ref="uploadDialogRef" @success="getList" @error="handleError" />

  <!-- 导入错误列表 -->
  <UploadErrorListDialog ref="uploadErrorListDialogRef" />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { getIntDictOptions, DICT_TYPE, getDictLabel } from '@/utils/dict'
import { Search } from '@element-plus/icons-vue'
import * as historicalPackagingPriceApi from '@/api/serviceConfiguration/historicalPackagingPrice'
const message = useMessage() // 消息弹窗
const router = useRouter()
const { t } = useI18n() // 国际化
import HistoricalPackagingPriceDrawer from './components/HistoricalPackagingPriceDrawer.vue'
import AddForm from './components/AddForm.vue'
import download from '@/utils/download'
import UploadDialog from './components/UploadDialog.vue'
import UploadErrorListDialog from './components/UploadErrorListDialog.vue'
import ListTable from './components/listTable.vue'

const activeName = ref('category')

const queryParams = ref({
  size: 10,
  page: 1,
  merchantCode: '',
  packageCostType: undefined as number | undefined,// 1: 商品 2: 品类
  status: "1",//生效中-1/已作废-2
})

const tabs = [
  {
    name: 'category',
    label: '品类'
  },
  {
    name: 'product',
    label: '商品'
  }
]

/** 搜索按钮操作 */
const queryFormRef = ref()
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields()
  handleQuery()
}

// tab切换
const handleClick = () => {
  // console.log('active', activeName.value)
  // 清空查询条件
  list.value = []
  total.value = 0
  queryParams.value.merchantCode = ''
  handleQuery()
}

const total = ref(0)
const loading = ref(false)

/** 查询列表 */
const list = ref<any[]>([])
const getList = async () => {
  loading.value = true

  try {
    // 1: 商品 2: 品类
    if (activeName.value === 'product') {
      queryParams.value.packageCostType = 1
    } else if (activeName.value === 'category') {
      queryParams.value.packageCostType = 2
    }

    const data = await historicalPackagingPriceApi.getPageList(queryParams.value).catch(() => { })
    if (data) {
      list.value = data.records || []
      total.value = data.total
    }
  } finally {
    loading.value = false
  }
}

// 新增
const addFormRef = ref()
const openForm = (type: string, id?: string) => {
  console.log('00', type, id)
  addFormRef.value?.open(type, id)
}

// 历史包装价
const historicalPackagingPriceRef = ref()
const openHistoricalPackagingPriceDialog = (row) => {
  historicalPackagingPriceRef.value?.open(row.id, row.merchantCode)
}

// 导入模板下载
const templateFileDownload = () => {
  const url =
    'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/excel/template/package_price_template.xlsx'
  const a = document.createElement('a')
  a.href = url
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

// 打开导入弹窗
const uploadDialogRef = ref()
const openUploadDialog = () => {
  uploadDialogRef.value?.open()
}

const uploadErrorListDialogRef = ref()
// 打开上传错误列表弹窗
const openUploadErrorListDialog = (data) => {
  uploadErrorListDialogRef.value?.open(data)
}

// 上传错误列表弹窗
const handleError = (data) => {
  openUploadErrorListDialog(data)
}

// 导出
const exportLoading = ref(false)
const handleExport = async () => {
  exportLoading.value = true
  const data = await historicalPackagingPriceApi.exportPackagingCostList().catch((err) => {
    exportLoading.value = false
  })
  exportLoading.value = false
  if (data) {
    download.excel(data, `商品包装耗材费数据.xlsx`)
  }
}

// 删除
const handleDelete = async (row) => {
  try {
    let info = ''
    // 删除的二次确认
    if (activeName.value === 'category') {
      info = `作废后，${getDictLabel(DICT_TYPE.STANDARD_CATEGORY,row.merchantCode) || '--'}/${getSubCategoryLabel(row.merchantCode, row.subMerchantCode) || '--'}的外包装单价将不再作为统计依据，您确定要作废吗？`
    } else {
      info = `作废后，${row.merchantCode || '--'}的外包装单价将不再作为统计依据，您确定要作废吗？`
    }
    await message.confirm(info)
    // 发起删除
    await historicalPackagingPriceApi.deleteData(row.id)
    message.success('作废成功')
    getList()
  } catch { }


}
const getSubCategoryLabel = (merchantCode: string, subCategoryCode: string) => {
  const categoryKey = `standard_category_${merchantCode.toLowerCase()}`
  const data = getIntDictOptions(categoryKey, true)
  let name = '--'
  const subCategory = data.find(item => item.code === subCategoryCode)
  if (subCategory) {
    name = subCategory.label
  }
  return name
}
onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
// 查询条件
.packageCostMaintenanceTopFilter {
  background-color: #fff;
  padding: 20px 20px 0 20px;
  margin-bottom: 20px;
  border-radius: 12px;
}

// tab切换框样式
:deep(.el-tabs--card > .el-tabs__header .el-tabs__item) {
  border-bottom: 1px solid #e4e7ed;
}

:deep(.el-tabs--card > .el-tabs__header .el-tabs__item.is-active) {
  border-bottom-color: #e4e7ed;
  color: #fff;
  background: #0064ff;
}

:deep(.el-tabs__item:hover) {
  color: #0064ff;
}

:deep(.el-tabs--card > .el-tabs__header) {
  border-bottom: none;
}

.top-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
