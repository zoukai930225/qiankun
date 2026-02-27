<template>
  <ContentWrap>
    <div>
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form ref="queryFormRef" :inline="true" :model="queryParams" class="mb-5px" label-width="78px">
            <el-form-item label="条码" prop="barcode">
              <el-input v-model="queryParams.barcode" class="!w200px" :prefix-icon="Search" clearable
                placeholder="请输入条码" @keyup.enter="handleQuery" @clear="handleQuery" />
            </el-form-item>
            <el-form-item label="产品款号" prop="productModelNumber">
              <el-input v-model="queryParams.productModelNumber" class="!w200px" :prefix-icon="Search" clearable
                placeholder="请输入产品款号" @keyup.enter="handleQuery" @clear="handleQuery" />
            </el-form-item>
            <el-form-item label="SKU编码" prop="skuCode">
              <el-input v-model="queryParams.skuCode" class="!w200px" :prefix-icon="Search" clearable
                placeholder="请输入SKU编码" @keyup.enter="handleQuery" @clear="handleQuery" />
            </el-form-item>
            <el-form-item label="颜色" prop="colour">
              <el-input v-model="queryParams.colour" class="!w200px" :prefix-icon="Search" clearable placeholder="请输入颜色"
                @keyup.enter="handleQuery" @clear="handleQuery" />
            </el-form-item>


            <div v-if="isExpand">
              <el-form-item label="申请人" prop="applicant">
                <!-- <el-input
                  v-model="queryParams.applicant"
                  class="!w200px"
                  :prefix-icon="Search"
                  clearable
                  placeholder="请输入申请人"
                  @keyup.enter="handleQuery"
                  @clear="handleQuery"
                /> -->
                <SWSelectPeople ref="peopleRef" style="width: 200px" :isEdit="true" :multiple="true"
                  v-model:modelValue="applicant" type="operate" :getSearchList="getPersonList" placeholder="请选择登记人" />
              </el-form-item>
              <el-form-item label="尺码" prop="size">
                <el-select class="!w200px" v-model="queryParams.size" placeholder="请选择尺码" clearable @clear="handleQuery"
                  @change="handleQuery" multiple filterable>
                  <el-option v-for="dict in sampleSizeList" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="产品类目" prop="productCategory">
                <el-input v-model="queryParams.productCategory" class="!w200px" :prefix-icon="Search" clearable
                  placeholder="请输入产品类目" @keyup.enter="handleQuery" @clear="handleQuery" />
              </el-form-item>
              <el-form-item label="样品类别" prop="sampleCategory">
                <el-input v-model="queryParams.sampleCategory" class="!w200px" :prefix-icon="Search" clearable
                  placeholder="请输入样品类别" @keyup.enter="handleQuery" @clear="handleQuery" />
              </el-form-item>

              <el-form-item label="品牌" prop="brand">
                <el-input v-model="queryParams.brand" class="!w200px" :prefix-icon="Search" clearable
                  placeholder="请输入品牌" @keyup.enter="handleQuery" @clear="handleQuery" />
              </el-form-item>
              <el-form-item label="状态" prop="statusList">
                <el-select class="!w200px" v-model="queryParams.statusList" placeholder="请选择状态" clearable
                  @clear="handleQuery" @change="handleQuery" multiple filterable>
                  <el-option v-for="dict in sampleApplyStatusList" :key="dict.value" :label="dict.label"
                    :value="dict.value" />
                </el-select>
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
    <el-table :header-cell-style="appStore.headerCellStyle" v-loading="loading" :data="list"
      :show-overflow-tooltip="true" row-class-name="commonTableRow" class="SWCommonTable"
      v-horizontal-scroll="'always'">
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
      <el-table-column label="图片" prop="image" min-width="150">
        <template #default="{ row }">
          <el-image v-if="row.image" style="width: 60px; height: 40px; z-index: 999" :src="row.image" :zoom-rate="1.2"
            :max-scale="7" :min-scale="0.2" :preview-teleported="true" :preview-src-list="[row.image]" fit="cover" />
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" min-width="120" show-overflow-tooltip>
        <template #default="scope">
          <div class="row">
            {{ scope.row.remark || '--' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="申请人" prop="applicantName" min-width="120">
        <template #default="scope">
          <div class="row">
            {{ scope.row.applicantName || '--' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="申请日期" prop="applicationDate" min-width="160">
        <template #default="scope">
          <div class="row">
            {{ scope.row.applicationDate || '--' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="申请数量" prop="applyQuantity">
        <template #default="scope">
          <div class="row">
            {{ scope.row.applyQuantity || '--' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="上级审核人员" prop="firstReviewerName" min-width="150">
        <template #default="scope">
          <div class="row">
            {{ scope.row.firstReviewerName || '--' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="上级审核时间" prop="firstReviewDate" min-width="180">
        <template #default="scope">
          <div class="row">
            {{ scope.row.firstReviewDate || '--' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="样品管理员" prop="secondReviewerName" min-width="150">
        <template #default="scope">
          <div class="row">
            {{ scope.row.secondReviewerName || '--' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="样品管理员审核时间" prop="secondReviewerDate" min-width="180">
        <template #default="scope">
          <div class="row">
            {{ scope.row.secondReviewerDate || '--' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="当前状态" prop="status" min-width="150">
        <template #default="scope">
          <div class="row">
            {{ getDictLabel(DICT_TYPE.SAMPLE_MANAGEMENT_INVENTORY_APPLY_STATUS, scope.row.status) || '--' }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作按钮" :show-overflow-tooltip="false" fixed="right" width="100">
        <template #default="scope">
          <el-button type="primary" @click="openForm('show', scope.row.id)" link>
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination-wrapper">
      <Pagination :total="total" v-model:page="queryParams.page" v-model:limit="queryParams.pageSize"
        @pagination="getList" />
    </div>
  </ContentWrap>
  <!-- 查看-->
  <detailsDrawer ref="detailsDrawerRef" @success="getList" />
</template>

<script lang="ts" setup>

import { useAppStore } from '@/store/modules/app'
import { Search } from '@element-plus/icons-vue'
import detailsDrawer from './components/detailsDrawer.vue'
import * as sampleApplyApi from '@/api/sample/sampleApply'
import { sampleSizeList, sampleApplyStatusList } from '@/views/newMedia/hooks/useSample'
import download from '@/utils/download'
import { ElLoading } from 'element-plus'
import { DICT_TYPE, getDictLabel } from '@/utils/dict'

import * as PersonRosterApi from '@/api/hrAdmin/personRoster'
import SWSelectPeople from '@/views/OA/new/develop/components/SWSelectPeople.vue'

const route = useRoute()
const appStore = useAppStore()
const barcode = (route.query.barcode || '') as string

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const isExpand = ref(false), peopleRef = ref();
const loading = ref(false) // 列表的加载中
const list = ref<any[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = ref<any>({
  page: 1,
  pageSize: 10,
  barcode: '',
  skuCode: '', // SKU编码
  colour: '',
  productModelNumber: '',
  size: [] as any,
  status: '',
  applicantId: '',
  brand: '',
  productCategory: '',
  sampleCategory: '',
  statusList: [] as any
})
const queryFormRef = ref() // 搜索的表单

// 人员选择
const personList = ref<any>([])
const getPersonList = async () => {
  const data = await PersonRosterApi.getPersonRosterAvatarOriginList({
    status: '2'
  }).catch(() => { })
  personList.value = data || []
  return personList.value
}
const applicant = ref<any>([])

/** 查看 */
const detailsDrawerRef = ref()
const openForm = (type: string, id?: string, barcode?: string) => {
  if (detailsDrawerRef.value) {
    detailsDrawerRef.value.open(type, id, barcode)
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  peopleRef?.value?.clearItems();
  queryFormRef.value.resetFields()
  handleQuery()
}
// 导出
const exportData = async () => {
  const loadingInstance = ElLoading.service({ fullscreen: false, text: '数据导出中......' })
  try {
    const params = {
      ...queryParams.value,
      size: queryParams.value.size.join(','),
      applicantId: queryParams.value.applicant?.map((item: any) => item.userId).join(',')
    }
    delete params.page
    delete params.pageSize
    const data = await sampleApplyApi.exportData(params)
    const fileName = `样品申请记录明细数据统计.xlsx`
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
      size: queryParams.value.size.join(','),
      applicantId: applicant.value.length ? applicant.value?.map((item: any) => item.userId).join(',') : ''
    }
    const data = await sampleApplyApi.getApplyRecordsList(params).catch(() => { })
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

  getList()
})
</script>

<style lang="less" scoped>
:deep(.el-form--inline) {
  .el-form-item {
    margin-right: 10px;
  }
}

:deep(.el-select__wrapper) {
  background: #ffffff !important;
}
</style>
