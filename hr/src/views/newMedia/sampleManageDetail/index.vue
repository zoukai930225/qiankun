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
            <div v-if="isExpand">
              <el-form-item label="申请人" prop="applicant">
                <el-input
                  v-model="queryParams.applicant"
                  class="searchFormItemWidth"
                  :prefix-icon="Search"
                  clearable
                  placeholder="请输入申请人"
                  @keyup.enter="handleQuery"
                  @clear="handleQuery"
                />
              </el-form-item>
              <el-form-item label="当前状态" prop="status">
                <el-select
                  class="!w-200px"
                  v-model="queryParams.status"
                  placeholder="请选择当前状态"
                  clearable
                  @clear="handleQuery"
                  @change="handleQuery"
                >
                  <el-option
                    v-for="dict in sampleStatusList"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
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
            <el-button @click="exportData" type="primary"> 导出 </el-button>
            <SWFilterExpandAllNew :isExpand="isExpand" @expand-click="isExpand = !isExpand" />
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
      <el-table-column label="条码" prop="barcode" min-width="120">
        <template #default="scope">
          <div class="row text1">
            {{ scope.row.barcode || '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="产品类目" prop="productCategory" min-width="110">
        <template #default="scope">
          <div class="row">
            {{ scope.row.productCategory || '--' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="SKU编码" prop="skuCode" min-width="150">
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
      <el-table-column label="品牌" prop="brand" min-width="150">
        <template #default="scope">
          <div class="row-center">
            {{ scope.row.brand || '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="样品类别" prop="sampleCategory" min-width="120">
        <template #default="scope">
          <div class="row">
            {{ scope.row.sampleCategory || '--' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="尺码" prop="size">
        <template #default="scope">
          <div class="row">
            {{ scope.row.size || '--' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="颜色" prop="colour">
        <template #default="scope">
          <div class="row">
            {{ scope.row.colour || '--' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="申请人" prop="applicant">
        <template #default="scope">
          <div class="row">
            {{ scope.row.applicant || '--' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="申请日期" prop="date" min-width="140">
        <template #default="scope">
          <div class="row">
            {{ scope.row.date || '--' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="申请数量" prop="number">
        <template #default="scope">
          <div class="row">
            {{ scope.row.number || '--' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="位置条码" prop="locationCode" min-width="120">
        <template #default="scope">
          <div class="row">
            {{ scope.row.locationCode || '--' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="存放位置" prop="location" min-width="120">
        <template #default="scope">
          <div class="row">
            {{ scope.row.location || '--' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" min-width="120">
        <template #default="scope">
          <div class="row">
            {{ scope.row.remark || '--' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="当前状态" prop="status">
        <template #default="scope">
          <div class="row">
            {{ getStatusName(Number(scope.row.status)) || '--' }}
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
      <el-table-column label="操作按钮" :show-overflow-tooltip="false" fixed="right" width="100">
        <template #default="scope">
          <el-button type="primary" @click="openForm('show', scope.row.id, scope.row.barcode)" link>
            详情
          </el-button>
          <!-- <el-button
            type="primary"
            @click="openForm('edit', scope.row.id, scope.row.barcode)"
            link
            v-if="scope.row.status === '4'"
          >
            编辑
          </el-button> -->
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
  <!-- 编辑/查看-->
  <editDrawer ref="editDrawerRef" @success="getList" />
</template>

<script lang="ts" setup>

import { useAppStore } from '@/store/modules/app'
import { Search } from '@element-plus/icons-vue'
import editDrawer from './components/editDrawer.vue'
import * as sampleDetailApi from '@/api/sample/sampleManageDetail'
import { sampleSizeList, sampleStatusList } from '@/views/newMedia/hooks/useSample'
import download from '@/utils/download'

const route = useRoute()
const appStore = useAppStore()
const barcode = (route.query.barcode || '') as string

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
  skuCode: '', // SKU编码
  productModelNumber: '',
  size: [] as any,
  status: '',
  applicant: '',
  brand: ''
})
const queryFormRef = ref() // 搜索的表单

// 状态
const getStatusName = (status) => {
  if (status === 2) return '报废'
  if (status === 3) return '已入库'
  if (status === 4) return '已出库'
}

/** 添加/修改操作 */
const editDrawerRef = ref()
const openForm = (type: string, id?: string, barcode?: string) => {
  if (editDrawerRef.value) {
    editDrawerRef.value.open(type, id, barcode)
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
// 导出
const exportData = async () => {
  const loadingInstance = ElLoading.service({ fullscreen: false, text: '数据导出中......' })
  try {
    const params = { ...queryParams.value }
    const data = await sampleDetailApi.exportData(params)
    const fileName = `样品管理明细数据统计`
    download.excel(data, fileName)
    message.success('导出成功')
  } finally {
    loadingInstance.close()
  }
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const params = {
      ...queryParams.value,
      size: queryParams.value.size.join(',')
    }
    const data = await sampleDetailApi.getDetailList(params).catch(() => {})
    if (data) {
      list.value = data.records
      total.value = data.total
    }
  } finally {
    loading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  if (barcode) queryParams.value.barcode = barcode
  getList()
})
</script>

<style lang="less" scoped>
:deep(.el-form--inline) {
  .el-form-item {
    margin-right: 30px;
  }
}
* {
  --el-color-primary: #0064ff;
  --el-color-danger: #f00;
}
</style>
