<template>
  <div>
    <!-- 操作按钮列 -->
    <!-- <div class="action-group">
      <el-button
        style="border-color: rgb(198, 199, 204)"
        @click="templateFileDownload"
        v-if="tabType === 'product'"
      >
        <Icon class="commonSearchBtnIcon" :size="12" icon="ep:download" />
        <span style="">导入模板下载</span>
      </el-button>
      <el-button
        style="border-color: rgb(198, 199, 204)"
        @click="openUploadDialog"
        v-if="tabType === 'product'"
      >
        <Icon class="commonSearchBtnIcon" :size="12" icon="ep:download" />
        导入
      </el-button>
      <el-button
        style="border-color: rgb(198, 199, 204)"
        @click="handleExport"
        :loading="exportLoading"
        v-if="tabType === 'product'"
      >
        <Icon class="commonSearchBtnIcon" :size="12" icon="ep:upload" />
        导出
      </el-button>
      <el-button type="primary" @click="openForm('create', undefined)">
        <Icon class="commonSearchBtnIcon" :size="12" icon="ep:plus" />
        新增
      </el-button>
    </div> -->

    <div>
      <el-table :data="list" width="100%" :show-overflow-tooltip="false" v-loading="loading"
        v-horizontal-scroll="'always'" row-class-name="commonTableRow" class="SWCommonTable"
        :header-cell-style="appStore.headerCellStyle">
        <el-table-column prop="merchantCode" :label="tabType === 'product' ? '商家编码' : '一级品类'" min-width="150">
          <template #default="{ row }">
            <span v-if="row.merchantCode">{{ tabType === 'product' ? row.merchantCode :
              getDictLabel(DICT_TYPE.STANDARD_CATEGORY, row.merchantCode)
            }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column v-if="tabType === 'category'" prop="subMerchantCode" label="二级品类" min-width="150">
          <template #default="{ row }">
            <span v-if="row.subMerchantCode"> {{ getSubCategoryLabel(row.merchantCode, row.subMerchantCode) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="warehouseName" label="仓库" min-width="120" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.warehouseName || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="packagingUnitPrice" label="包装单价" width="120" align="right" />
        <el-table-column label="起止日期" width="200" align="right">
          <template #default="{ row }">
            {{ row.beginDate || '--' }}~{{ row.endDate || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <span>{{ getStatusName(row.status) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="notes" label="备注" min-width="150" show-overflow-tooltip>
          <template #default="{ row }">
            <span>{{ row.notes || '--' }}</span>
          </template>
        </el-table-column>
        <!-- 添加操作列 -->
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openForm('edit', row.id)" v-if="row.status == 1">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)" v-if="row.status == 1">作废</el-button>
            <el-button link type="primary" @click="openHistoricalPackagingPriceDialog(row)">历史包装价</el-button>
          </template>
        </el-table-column>
        <template #empty>
          <div class="empty-img">
            <img src="@/assets/imgs/common/empty_list.png" alt="" />
            <div>暂无数据</div>
          </div>
        </template>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DICT_TYPE, getDictLabel, getIntDictOptions } from '@/utils/dict'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
const emits = defineEmits([
  'delete',
  'openForm',
  'historicalPackagingPrice',
  'templateFileDownload',
  'upload',
  'export'
])

const props = defineProps({
  tabType: {
    type: String,
    default: ''
  },
  list: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// 新增/编辑
const openForm = (type, id) => {
  emits('openForm', type, id)
}

// 导入模板下载
const templateFileDownload = () => {
  emits('templateFileDownload')
}

// 导入
const openUploadDialog = () => {
  emits('upload')
}

// 导出
const exportLoading = ref(false) // 导出loading
const handleExport = () => {
  emits('export')
}

// 历史包装价
const openHistoricalPackagingPriceDialog = (row) => {
  emits('historicalPackagingPrice', row)
}

// 删除
const handleDelete = (row) => {
  emits('delete', row)
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

function getStatusName(status: number | string) {
  if (!status) return ('--')
  if (Number(status) === 1) {
    return '生效中'
  }
  if (Number(status) === 2) {
    return '已作废'
  }
}
</script>

<style lang="scss" scoped></style>