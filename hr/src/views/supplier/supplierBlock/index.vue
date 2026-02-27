<template>
  <ContentWrap>
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form ref="queryFormRef" :inline="true" :model="queryParams" :label-width="85">
          <el-form-item label="操作人" prop="blockName">
            <!-- <SWSelectPeople
              :isEdit="true"
              :multiple="true"
              placeholder="请选择操作人"
            /> -->
            <el-input class="!w-240px" placeholder="请输入操作人" v-model.trim="queryParams.blockName"
              @keydown.enter="handleQuery" clearable @clear="handleQuery" />
          </el-form-item>
          <el-form-item label="操作时间">
            <el-date-picker v-model="dateRange" clearable type="daterange" range-separator="至" @change="handleQuery"
              start-placeholder="开始日期" end-placeholder="结束日期" class="!w-240px" value-format="YYYY-MM-DD"
              @clear="handleQuery" />
          </el-form-item>
          <el-form-item label="供应商" prop="supplierName">
            <el-input class="!w-240px" placeholder="请输入供应商" v-model.trim="queryParams.supplierName"
              @keydown.enter="handleQuery" clearable @clear="handleQuery" />
          </el-form-item>
          <el-form-item label="操作类型" prop="blockStatus">
            <el-select class="!w-240px" placeholder="请选择" clearable v-model="queryParams.blockStatus"
              :empty-values="[undefined, null]" @change="handleQuery" @clear="handleQuery">
              <el-option label="全部" value="" />
              <el-option v-for="dict in getIntDictOptions('supplier_block_status', true)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="拉黑原因" prop="blockReason">
            <el-input class="!w-240px" placeholder="请输入拉黑原因" v-model.trim="queryParams.blockReason"
              @keydown.enter="handleQuery" clearable @clear="handleQuery" />
          </el-form-item>
        </el-form>
      </div>
      <div class="commonTopFilterWrap-search">
        <div class="commonTopFilterWrap-search-container">
          <el-button class="commonSearchBtn" @click="handleQuery">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button class="commonResetBtn" style="margin-left: 0" @click="resetQuery">
            重置
          </el-button>

        </div>
      </div>
    </div>
    <div class="container-body">
      <div class="body_title">
        <span>拉黑记录</span>
      </div>
      <div class="list">
        <el-table class="SWCommonTable" :data="list" width="100%" v-horizontal-scroll="'always'"
          row-class-name="commonTableRow" :header-cell-style="appStore.headerCellStyle" v-loading="loading">
          <el-table-column label="操作人" prop="blockName" width="140"></el-table-column>
          <el-table-column label="操作时间" prop="blockTime" width="240"></el-table-column>
          <el-table-column label="操作类型" prop="blockStatus" width="220">
            <template #default="{ row }">
              <div :class="['status',row.blockStatus === 1 ? 'unblock':'']">{{ getDictLabel('supplier_block_status',row.blockStatus) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="供应商" prop="supplierName" show-overflow-tooltip width="320"></el-table-column>
          <el-table-column label="拉黑原因" prop="blockReason" show-overflow-tooltip>
            <template #default="{ row }">
              {{ row.blockReason || '-'}}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <Pagination v-model:limit="queryParams.size" v-model:page="queryParams.page" :total="total"
        @pagination="handleQuery" />
    </div>
  </ContentWrap>


</template>
<script setup lang="ts">
import { DICT_TYPE, getDictLabel, getIntDictOptions } from '@/utils/dict';
import * as blockApi from '@/api/supplier/block'
import { useAppStore } from '@/store/modules/app';
// import SWSelectPeople from '@/views/OA/factory/components/selectPeople.vue'
const appStore = useAppStore()
// 查询
const queryParams = ref<any>({
  page: 1,
  size: 10,
  blockName: '',
  blockReason: '',
  blockStatus: undefined,
  queryStartDate: '',
  queryEndDate: '',
  supplierName: ''
})
const total = ref()
const dateRange = ref([])
const handleDate = (dateRange: any) => {
  if (dateRange && dateRange.length) {
    queryParams.value.queryStartDate = dateRange[0]
    queryParams.value.queryEndDate = dateRange[1]
  } else {
    queryParams.value.queryStartDate = ''
    queryParams.value.queryEndDate = ''
  }
}

const queryFormRef = ref()
const loading = ref(false)
const handleQuery = () => {
  loading.value = true
  handleDate(dateRange.value)
  blockApi.queryAllBlockData({ ...queryParams.value }).then((res: any) => {
    console.log(res)
    if (res) {
      list.value = res.records || []
      total.value = res.total
    }
  }).finally(() => {
    loading.value = false
  })
}
const resetQuery = () => {
  queryFormRef.value?.resetFields()
  dateRange.value = []
  handleQuery()
}
const list = ref<any>([])
onMounted(() => {
  handleQuery()
})
</script>

<style lang="less" scoped>
:deep(.el-form--inline .el-form-item) {
  margin-right: 20px;
}

:deep(.el-form-item__content) {
  width: 240px;
}

.container-body {
  width: calc(100%);
  background: #ffffff;
  padding: 16px 0 30px 0;
  border-top: 1px solid #e6e6e6;

  .body_title {
    width: 100%;
    font-size: 16px;
    font-weight: 600;
  }

  .list {
    margin-top: 10px;
  }
}
.el-table {
  :deep(.el-popper) {
    max-width: 500px !important;
    white-space: pre-wrap !important;
  }
}
.status{
  width: 74px;
  height:28px;
  line-height: 28px;
  text-align: center;
  border-radius: 158px;
  background: #e8e8e8;
  color: #333;
  &.unblock{
    background: rgba(0, 100, 255, 0.2);
    color:#0064ff;
  }
}
</style>
