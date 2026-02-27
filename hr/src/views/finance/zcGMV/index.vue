<template>
  <div>
    <ContentWrap>
      <!-- 筛选框 -->
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form :inline="true" :model="queryParams" ref="queryFormRef">
            <el-form-item label="种草产品：" prop="grassPlantingProduct">
              <el-select
                style="width: 200px"
                v-model="queryParams.grassPlantingProduct"
                placeholder="请选择种草产品"
                clearable
                @change="handleSelect"
                @clear="handleSelect"
              >
                <el-option
                  v-for="item in goodsList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="品宣达人：" prop="productPromotionMaster">
              <el-input
                style="width: 200px"
                v-model.trim="queryParams.productPromotionMaster"
                placeholder="请输入品宣达人"
                clearable
                @keyup.enter="getList"
                @clear="getList"
              />
            </el-form-item>
            <el-form-item label="发文时间：" prop="dataDate">
              <el-date-picker
                v-model="dataDateRange"
                type="daterange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                style="width: 240px"
                @change="handleDateChange"
                @clear="handleDateChange"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-form>
        </div>
        <div class="commonTopFilterWrap-search">
          <div class="commonTopFilterWrap-search-container">
            <el-button @click="getList" class="commonSearchBtn">
              <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
              搜索
            </el-button>
            <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0">
              重置
            </el-button>

            <el-dropdown
              split-button
              type="primary"
              class="ml20px"
              ref="othersOptions"
              :teleported="false"
              @click="handleDropdownClick"
            >
              更多操作
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="downloadData">数据导出</el-dropdown-item>
                  <el-dropdown-item @click="syncData">种草数据同步</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
      <!-- list列表 -->
      <div style="margin-top: 20px">
        <el-table
          :header-cell-style="appStore.headerCellStyle"
          v-loading="loading"
          :data="list"
          class="SWCommonTable"
          v-horizontal-scroll="'always'"
          show-overflow-tooltip
          style="width: 100%"
        >
          <el-table-column type="expand">
            <template #default="props">
              <el-table
                v-horizontal-scroll="'always'"
                :data="props.row.children"
                :header-cell-style="{ background: '#fbfbfb', color: '#666' }"
                :cell-style="{ background: '#fbfbfb', padding: '10px 0' }"
                class="expandTable"
              >
                <el-table-column label="" width="48px" />
                <el-table-column label="店铺名称" prop="storeName" width="320px">
                  <template #default="{ row }">
                    <div class="flex">
                      <img
                        :src="getImageUrl(row.channel || '')"
                        style="margin-right: 8px; width: 20px; height: 20px"
                      />
                      <span>{{ row.storeName }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="商品名称" prop="goodsName" width="400px">
                  <template #default="{ row }">
                    <el-tooltip
                      class="box-item"
                      effect="dark"
                      :content="row.goodsName"
                      placement="top"
                    >
                      <span class="text2">
                        {{ row.goodsName }}
                      </span>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column label="商品ID" prop="goodsId" width="320px" />
                <el-table-column label="GMV销售额" prop="gmv" />
                <el-table-column label="操作" prop="action">
                  <template #default="{ row }">
                    <el-button class="function_btn" link @click="openDetail(row)">明细图</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column prop="grassPlantingProduct" label="种草产品" width="320px" />
          <el-table-column prop="productPromotionMaster" label="品宣达人" width="400px" />
          <el-table-column prop="publicationDate" label="发文时间" width="320px" />
          <el-table-column prop="gmvTotal" label="GMV销售总额" />
        </el-table>
        <!-- 分页 -->
        <Pagination
          v-model:limit="queryParams.size"
          v-model:page="queryParams.page"
          :total="total"
          @pagination="getList"
        />
      </div>
    </ContentWrap>
  </div>

  <!-- 明细图 -->
  <detailDialog ref="detailDialogRef" />
</template>
<script setup lang="ts">
import * as zcGMVApi from '@/api/finance/zcGMV/index'
import download from '@/utils/download'
import { useAppStore } from '@/store/modules/app'
import detailDialog from './components/detailDialog.vue'
import { getImageUrl } from '@/utils'
const message = useMessage() // 消息弹窗

const detailDialogRef = ref()
const appStore = useAppStore()
const queryParams = ref({
  page: 1,
  size: 10,
  grassPlantingProduct: '',
  productPromotionMaster: '',
  startDate: '' as any,
  endDate: '' as any
})
const goodsList = ref<any>([])
const dataDateRange = ref([])
// 时间选择
const handleDateChange = (dateRange: any) => {
  if (dateRange) {
    queryParams.value.startDate = dateRange[0]
    queryParams.value.endDate = dateRange[1]
  } else {
    queryParams.value.startDate = ''
    queryParams.value.endDate = ''
  }
  getList()
}
const list = ref([])

// 选择器 清除
const handleSelect = (value) => {
  if (!value) {
    queryParams.value.grassPlantingProduct = ''
  }
  getList()
}

const othersOptions = ref()
function handleDropdownClick() {
  othersOptions.value?.handleOpen()
}

// 打开明细图
const openDetail = (params) => {
  detailDialogRef.value?.open(params)
}

// 数据导出
const downloadData = async () => {
  const loadingInstance = ElLoading.service({ fullscreen: false, text: '数据导出中......' })
  try {
    const { grassPlantingProduct, productPromotionMaster, startDate, endDate } = queryParams.value
    const params = { grassPlantingProduct, productPromotionMaster, startDate, endDate }
    const data = await zcGMVApi.exportList(params)
    const fileName = `种草GMV监控数据统计`
    download.excel(data, fileName)
    message.success('导出成功')
  } finally {
    loadingInstance.close()
  }
}

// 数据同步
const syncData = async () => {
  const loadingInstance = ElLoading.service({ fullscreen: false, text: '数据同步中......' })
  try {
    await zcGMVApi.syncDataList()
    message.success('同步成功')
    getList()
  } finally {
    loadingInstance.close()
  }
}

// 重置
const queryFormRef = ref()
const resetQuery = () => {
  queryFormRef.value.resetFields()
  dataDateRange.value = []
  queryParams.value.startDate = ''
  queryParams.value.endDate = ''
  getList()
}
const total = ref(0)
const loading = ref(false)

const getList = async () => {
  loading.value = true
  try {
    console.log(queryParams.value)
    const data = await zcGMVApi.getList(queryParams.value)
    loading.value = false
    total.value = data.total
    list.value = data.records
  } catch (error) {
    loading.value = false
  }
}

const getGoodsList = async () => {
  const data = await zcGMVApi.getGrassList(queryParams.value)
  goodsList.value = data.map((item) => ({
    label: item,
    value: item
  }))
}

onMounted(() => {
  getGoodsList()
  getList()
})
</script>

<style lang="scss" scoped>
.function_btn {
  color: #0064ff;
  cursor: pointer;
  &:hover {
    color: #0064ff;
    opacity: 0.6;
  }
}

:deep(.el-button-group) {
  display: flex;
  font-size: 12px;
  .el-dropdown__caret-button .el-icon-arrow-down {
    display: none;
  }
}
:deep(.el-table__expanded-cell) {
  padding: 0 !important;
  background: #fbfbfb !important;
}

:deep(.expandTable) {
  tr:last-of-type {
    td.el-table__cell {
      border-bottom: none !important;
    }
  }

  .el-table__empty-block {
    background: #fbfbfb !important;
  }
}

:deep(.el-table__inner-wrapper:before) {
  background-color: transparent;
}
</style>
