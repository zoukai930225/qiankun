<template>
  <ContentWrap>
    <div>
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form
            ref="queryFormRef"
            :inline="true"
            :model="queryParams"
            class="mb-5px"
            label-width="78px"
          >
            <el-form-item label="条码" prop="barcode">
              <el-input
                v-model="queryParams.barcode"
                class="searchFormItemWidth"
                :prefix-icon="Search"
                clearable
                placeholder="请输入条码"
                @keyup.enter="handleQuery"
                @clear="handleQuery"
              />
            </el-form-item>
            <el-form-item label="产品款号" prop="productModelNumber">
              <el-input
                v-model="queryParams.productModelNumber"
                class="searchFormItemWidth"
                :prefix-icon="Search"
                clearable
                placeholder="请输入产品款号"
                @keyup.enter="handleQuery"
                @clear="handleQuery"
              />
            </el-form-item>
            <el-form-item label="SKU编码" prop="skuCode">
              <el-input
                v-model="queryParams.skuCode"
                class="searchFormItemWidth"
                :prefix-icon="Search"
                clearable
                placeholder="请输入SKU编码"
                @keyup.enter="handleQuery"
                @clear="handleQuery"
              />
            </el-form-item>
            <el-form-item label="颜色" prop="colour">
              <el-input
                v-model="queryParams.colour"
                class="searchFormItemWidth"
                :prefix-icon="Search"
                clearable
                placeholder="请输入颜色"
                @keyup.enter="handleQuery"
                @clear="handleQuery"
              />
            </el-form-item>
            <div v-if="isExpand">
              <el-form-item label="尺码" prop="size">
                <el-select
                  class="!w-200px"
                  v-model="queryParams.size"
                  placeholder="请选择尺码"
                  clearable
                  @clear="handleQuery"
                  @change="handleQuery"
                  multiple
                  filterable
                >
                  <el-option
                    v-for="dict in sampleSizeList"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="产品类目" prop="productCategory">
                <el-input
                  v-model="queryParams.productCategory"
                  class="searchFormItemWidth"
                  :prefix-icon="Search"
                  clearable
                  placeholder="请输入产品类目"
                  @keyup.enter="handleQuery"
                  @clear="handleQuery"
                />
              </el-form-item>
              <el-form-item label="样品类别" prop="sampleCategory">
                <el-input
                  v-model="queryParams.sampleCategory"
                  class="searchFormItemWidth"
                  :prefix-icon="Search"
                  clearable
                  placeholder="请输入样品类别"
                  @keyup.enter="handleQuery"
                  @clear="handleQuery"
                />
              </el-form-item>
              <el-form-item label="品牌" prop="brand">
                <el-input
                  v-model="queryParams.brand"
                  class="searchFormItemWidth"
                  :prefix-icon="Search"
                  clearable
                  placeholder="请输入品牌"
                  @keyup.enter="handleQuery"
                  @clear="handleQuery"
                />
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="commonTopFilterWrap-search">
          <div class="commonTopFilterWrap-search-container">
            <el-button @click="handleQuery" class="commonSearchBtn">
              <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
              搜索
            </el-button>
            <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0px">
              重置
            </el-button>
            <el-dropdown
              split-button
              type="primary"
              class="ml10px"
              :teleported="false"
              @click="openForm('add', '')"
            >
              <!-- <el-icon><Plus /></el-icon> -->
              <span class="ml-2px">新增库存</span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="openUploadDialog">批量导入</el-dropdown-item>
                  <el-dropdown-item @click="handleDownload">导出</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <SWFilterExpandAllNew :isExpand="isExpand" @expand-click="isExpand = !isExpand" />
            <!-- <el-button @click="openForm('add', '')" type="primary" :icon="Plus">
              新增库存
            </el-button>
            <el-button @click="openUploadDialog" type="primary">
              批量导入
            </el-button>
            <el-button @click="handleDownload" type="primary">
              导出
            </el-button> -->
          </div>
        </div>
      </div>
    </div>

    <!-- 列表 -->
    <el-table
      :header-cell-style="appStore.headerCellStyle"
      v-loading="loading"
      :data="list"
      :show-overflow-tooltip="true"
      row-class-name="commonTableRow"
      class="SWCommonTable"
      v-horizontal-scroll="'always'"
    >
      <el-table-column label="条码" prop="barcode" min-width="160">
        <template #default="scope">
          <div
            class="row text1 showPop"
            @click="
              router.push({ name: 'sampleManageDetail', query: { barcode: scope.row.barcode } })
            "
          >
            {{ scope.row.barcode || '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="产品类目" prop="productCategory" min-width="140">
        <template #default="scope">
          <div class="row">
            {{ scope.row.productCategory || '--' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="SKU编码" prop="skuCode" min-width="120">
        <template #default="scope">
          {{ scope.row.skuCode || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="产品款号" prop="productModelNumber" min-width="100">
        <template #default="scope">
          <div class="row">
            {{ scope.row.productModelNumber || '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="品牌" prop="brand" min-width="160">
        <template #default="scope">
          <div class="row-center">
            {{ scope.row.brand || '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="样品类别" prop="sampleCategory" min-width="140">
        <template #default="scope">
          <div class="row">
            {{ scope.row.sampleCategory || '--' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="尺码" prop="size" min-width="120">
        <template #default="scope">
          <div class="row">
            {{ scope.row.size || '--' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="颜色" prop="colour" min-width="100">
        <template #default="scope">
          <div class="row">
            {{ scope.row.colour || '--' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="登记人" prop="registrant" min-width="100">
        <template #default="scope">
          <div class="row">
            {{ scope.row.registrant || '--' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" min-width="100">
        <template #default="scope">
          <div class="row">
            {{ scope.row.remark || '--' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="总库存数量" prop="totalInventoryQuantity" min-width="120">
        <template #default="scope">
          <div class="row">
            {{ scope.row.totalInventoryQuantity || '--' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="当前库存数量" prop="currentInventoryQuantity" min-width="120">
        <template #default="scope">
          <el-tooltip placement="top" effect="light">
            <template #content>
              <div class="location flex" v-for="loc in scope.row.details" :key="loc.id">
                <div class="loc">{{ loc.location }}:</div>
                <div class="num" style="margin-left: 4px">{{ loc.number }}</div>
              </div>
            </template>
            <span class="showPop">
              {{ scope.row.currentInventoryQuantity || '--' }}
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="已出库数量" prop="outOfWarehouseQuantity" min-width="120">
        <template #default="scope">
          <div class="row">
            {{ scope.row.outOfWarehouseQuantity || '--' }}
          </div>
        </template>
      </el-table-column>
      <!-- inWarehouseQuantity -->
      <el-table-column label="已入库数量" prop="inWarehouseQuantity" min-width="120">
        <template #default="scope">
          <div class="row">
            {{ scope.row.inWarehouseQuantity || '--' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="图片" prop="image" min-width="150">
        <template #default="{ row }">
          <el-image
            v-if="row.image"
            style="width: 60px; height: 40px; z-index: 999"
            :src="row.image"
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :preview-teleported="true"
            :preview-src-list="[row.image]"
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column label="样品条形码" prop="image" min-width="240">
        <template #default="{ row }">
          <img :src="row.codeUrl" alt="" style="width: 180px" />
        </template>
      </el-table-column>
      <el-table-column label="操作按钮" :show-overflow-tooltip="false" fixed="right" width="300">
        <template #default="scope">
          <el-button type="primary" @click="openForm('edit', scope.row.barcode)" link>
            编辑
          </el-button>
          <el-button type="primary" @click="openSampleInBound(scope.row.barcode)" link>
            入库
          </el-button>
          <el-button
            type="primary"
            @click="openSampleOutBound(scope.row.id, scope.row.currentInventoryQuantity)"
            link
          >
            出库
          </el-button>
          <el-button
            type="danger"
            @click="openSampleScrap(scope.row.id, scope.row.currentInventoryQuantity)"
            link
          >
            报废
          </el-button>
          <el-button type="primary" @click="printBarCode(scope.row)" link> 打印样品条码 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination-wrapper">
      <Pagination
        :total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
  </ContentWrap>

  <!-- 新增/编辑 -->
  <sampleDrawer ref="sampleDrawerRef" @success="getList" :locationList="locationList" />
  <!-- 入库 -->
  <sampleInBound ref="sampleInBoundRef" @success="getList" :locationList="locationList" />
  <!--  出库 -->
  <sampleOutBound ref="sampleOutBoundRef" @success="getList" :locationList="locationList" />
  <!-- 批量导入 -->
  <uploadDialog ref="uploadDialogRef" @success="exportSuccess" />
  <!-- 报废 -->
  <sampleScrap ref="sampleScrapRef" @success="getList" :locationList="locationList" />
</template>

<script lang="ts" setup>

import { useAppStore } from '@/store/modules/app'
import { Search, Plus } from '@element-plus/icons-vue'
import sampleDrawer from './components/sampleDrawer.vue'
import sampleInBound from './components/sampleInBound.vue'
import sampleOutBound from './components/sampleOutBound.vue'
import sampleScrap from './components/sampleScrap.vue'
import uploadDialog from './components/uploadDialog.vue'
import { sampleSizeList, getLocationList } from '@/views/newMedia/hooks/useSample'
import * as sampleManageApi from '@/api//sample/sampleManage'
import download from '@/utils/download'
import { savebarCodeAsImage } from '@/views/newMedia/hooks/usePrint'

const router = useRouter()

const appStore = useAppStore()

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const isExpand = ref(false)
const loading = ref(false) // 列表的加载中
const list = ref<any[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = ref({
  page: 1,
  pageSize: 10,
  barcode: '',
  productCategory: '', //产品类目
  skuCode: '', // SKU编码
  productModelNumber: '',
  brand: '',
  sampleCategory: '',
  size: [] as any,
  colour: ''
})
const queryFormRef = ref() // 搜索的表单

// 库位列表
const locationList = ref<any>([])

/** 添加/修改操作 */
const sampleDrawerRef = ref()
const openForm = (type: string, id?: string) => {
  if (sampleDrawerRef.value) {
    sampleDrawerRef.value.open(type, id)
  }
}

// 入库
const sampleInBoundRef = ref()
const openSampleInBound = (id: string) => {
  if (sampleInBoundRef.value) {
    sampleInBoundRef.value.open(id)
  }
}

// 出库
const sampleOutBoundRef = ref()
const openSampleOutBound = (id: string, number: string) => {
  if (Number(number) === 0) {
    message.confirm('该样品当前库存为0')
  } else {
    if (sampleOutBoundRef.value) {
      sampleOutBoundRef.value.open(id)
    }
  }
}

// 报废
const sampleScrapRef = ref()
const openSampleScrap = (id: string, number: string) => {
  if (Number(number) === 0) {
    message.confirm('该样品当前库存为0')
  } else {
    if (sampleScrapRef.value) {
      sampleScrapRef.value.open(id)
    }
  }
}

// 批量导入
const uploadDialogRef = ref()
const openUploadDialog = () => {
  if (uploadDialogRef.value) {
    uploadDialogRef.value.open()
  }
}
// 批量导入成功后刷新
const exportSuccess = async () => {
  getList()
  locationList.value = await getLocationList()
}

//导出
const handleDownload = async () => {
  const loadingInstance = ElLoading.service({ fullscreen: false, text: '数据导出中......' })
  try {
    const params = { ...queryParams.value }
    const data = await sampleManageApi.exportData(params)
    const fileName = `样品管理数据统计`
    download.excel(data, fileName)
    message.success('导出成功')
  } finally {
    loadingInstance.close()
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

// 打印条形码
const printBarCode = async (item: {}) => {
  await message.confirm('确认是否打印该样品条码？')
  savebarCodeAsImage(item, '样品条码')
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const params = {
      ...queryParams.value,
      size: queryParams.value.size.join(',')
    }
    const data = await sampleManageApi.getInventoryList(params).catch(() => {})
    if (data) {
      list.value = data.records
      total.value = data.total
    }
  } finally {
    loading.value = false
  }
}

/** 初始化 **/
onMounted(async () => {
  getList()
  locationList.value = await getLocationList()
})
</script>

<style lang="less" scoped>
:deep(.el-button-group) {
  display: flex;
  font-size: 12px;
  .el-dropdown__caret-button .el-icon-arrow-down {
    display: none;
  }
}
:deep(.el-form--inline) {
  .el-form-item {
    margin-right: 30px;
  }
}

.showPop {
  color: #0064ff;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
}
* {
  --el-color-primary: #0064ff;
  --el-color-danger: #f00;
}
</style>
