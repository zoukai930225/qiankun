<!--
 * @Date: 2025-01-03 16:22:21
-->
<template>
  <div>
    <el-table
      class="SWCommonTable editeTable"
      :data="tableList"
      width="100%"
      ref="SWTableRef"
      :show-overflow-tooltip="true"
      v-loading="loading"
      v-horizontal-scroll="'always'"
      row-class-name="commonTableRow"
      :header-cell-style="headerCellStyle"
      :header-row-style="headerRowStyle"
      :cell-style="cellStyle"
      :row-style="rowStyle"
      highlight-current-row
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
      @cell-click="handleCellClick"
      row-key="id"
    >
      <el-table-column prop="customWarn" width="78" label="">
        <template #default="{ row }">
          <div v-if="row.isNewProgress == '1'" class="row-center">
            <div class="messageWarn">
              <div class="messageWarn-text">新进度！</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="planType" label="企划类型">
        <template #default="{ row }">
          <PlanType :planType="row.planType" />
        </template>
      </el-table-column>
      <el-table-column prop="planName" label="企划名称">
        <template #default="{ row }">
          <span class="linkColor" @click="handlePlanNameClick(row)">
            {{ row.planName || '--' }}</span
          >
        </template>
      </el-table-column>
      <el-table-column label="企划时间">
        <template #default="{ row }">
          <span> {{ `${row.planStartTime}-${row.planEndTime}` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="系列" prop="series">
        <template #default="{ row }">
          <span> {{ `${row.series}` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设计图" prop="productPictureUrl">
        <template #default="{ row }">
          <preview-image
            v-if="row.productPictureUrl && row.productPictureUrl.length > 0"
            style="width: 46px; height: 46px; z-index: 999999"
            :url="row.productPictureUrl.split(',')[0]"
            :preview-teleported="true"
            :preview-src-list="[row.productPictureUrl.split(',')[0]]"
            show-progress
            :initial-index="4"
          ></preview-image>
          <!-- <span> -->
          <!-- <el-image
              v-if="row.productPictureUrl && row.productPictureUrl.length > 0"
              style="width: 46px; height: 46px; z-index: 999999"
              :src="row.productPictureUrl.split(',')[0]"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-teleported="true"
              :preview-src-list="[row.productPictureUrl.split(',')[0]]"
              show-progress
              :initial-index="4"
              fit="cover"
            /> -->
          <span v-else>暂无</span>
          <!-- </span> -->
        </template>
      </el-table-column>
      <el-table-column label="当前节点" prop="currentNodeName">
        <template #default="{ row }">
          <span> {{ `${row.currentNodeName}` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="货品编码" prop="productCode">
        <template #default="{ row }">
          <span> {{ row.productCode || '' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="产研负责人" prop="productionResearchHeadInfo">
        <template #default="{ row }">
          <SWSelectPeople
            v-if="row.productionResearchHeadInfo"
            style="width: 130px"
            :isEdit="false"
            :multiple="true"
            :member-list="handleJSONParse(row.productionResearchHeadInfo)"
          />
          <div v-else class="empty-content">
            <img src="@/assets/imgs/common/empty-people.png" alt="" class="logo" />
            <div class="desc">待匹配</div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="采购负责人" prop="purchasingManagerInfo">
        <template #default="{ row }">
          <SWSelectPeople
            v-if="row.purchasingManagerInfo"
            style="width: 130px"
            :isEdit="false"
            :multiple="true"
            :member-list="handleJSONParse(row.purchasingManagerInfo)"
          />
          <div v-else class="empty-content">
            <img src="@/assets/imgs/common/empty-people.png" alt="" class="logo" />
            <div class="desc">待匹配</div>
          </div>
        </template>
      </el-table-column>

      <!-- 添加操作列 -->
      <el-table-column label="操作" width="120" fixed="right" align="center">
        <template #default="{ row }">
          <div class="table-btn">
            <div class="operate-btn" @click.stop="handleProgress(row)">
              <span>进度维护</span>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getDictDataPage } from '@/api/system/dict/dict.data'
import PreviewImage from '@/components/common/image/preview.vue'
import { useCategoryList } from '../hooks.js'

import { updateDesignProgress } from '@/api/oa/package/designGallery/index'
import PlanType from '@/views/OA/package/components/planType.vue'
import SWSelectPeople from '@/views/OA/package/develop/components/SWSelectPeople.vue'

const { categoryList, initSelectData } = useCategoryList()

const headerCellStyle = {
  backgroundColor: '#EBF2FF',
  color: '#666',
  fontSize: '14px',
  fontWeight: '400',
  height: '30px',
  'line-height': '30px',
  borderBottom: 'none',
  padding: 0
}
const headerRowStyle = {
  backgroundColor: 'rgba(256, 256, 256, 0)'
}
const cellStyle = {
  borderBottom: 'none'
}
const rowStyle = {
  marginBottom: '16px',
  height: '80px'
}
// 定义类型
interface Field {
  id: string
  listDisplay: boolean
  name: string
  code: string
  state: number
  type: number
  supportSort: boolean
  dictCode: string
  options: any[]
  maxLength: string
  placeholder: string
  edit: boolean
}
const handlePlanNameClick = (row) => {
  emit('handleNew', row)
}

const currentPage = ref(1)
const pageSize = ref(10)

const props = defineProps({
  tableColumns: {
    type: Array as PropType<Field[]>,
    default: () => []
  },
  tableData: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  total: {
    type: Number,
    default: 0
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const tableList = ref<any[]>([])
watch(
  () => props.tableData,
  (newData) => {
    tableList.value = [...newData]
  },
  { immediate: true }
)

// 获取字典值
interface DicItem {
  id: string
  name: string
}

const dicList = ref<DicItem[]>([])

const initDicList = async () => {
  const params = {
    page: 1,
    size: 1000,
    type: 1
  }
  const res = await getDictDataPage(params)
  dicList.value = res.data || []
}

const handleJSONParse = (str) => {
  try {
    if (Array.isArray(str)) {
      return str.map((item) => {
        return {
          avatarOrigin: item.userAvatarOrigin,
          name: item.userName,
          userId: item.userId
        }
      })
    }
    return [
      {
        avatarOrigin: str.userAvatarOrigin,
        name: str.userName,
        userId: str.userId
      }
    ]
  } catch (error) {
    return []
  }
}

const selectedRows = ref<any[]>([])
const handleSelectionChange = (val: any[]) => {
  selectedRows.value = val
  emit('selectionChange', val)
}

onMounted(() => {
  initSelectData()
  initDicList()
})
// 点击当前行
const currentRow = ref()
const handleRowClick = (row) => {
  currentRow.value = row
  emit('openNode', row)
}

const SWTableRef = ref()
const selectHgiglightRow = () => {
  if (currentRow.value) {
    SWTableRef.value?.setCurrentRow(currentRow.value)
  }
}

const emit = defineEmits([
  'pageChange',
  'handleProgress',
  'openNode',
  'selectionChange',
  'handleProductNumber',
  'handleNew',
  'updateProgress'
])

// 进度维护
const handleProgress = (row: any) => {
  const item = categoryList.value.find((item) => item.code === row.category)
  row.categoryName = item ? item.name : ''
  emit('handleProgress', row)
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
  emit('pageChange', { page: currentPage.value, pageSize: val })
}

// 分页
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  emit('pageChange', { page: val, pageSize: pageSize.value })
}

// 处理点击列事件
const handleCellClick = async (row: any) => {
  console.log(row, '?????')
  if (Number(row.isNewProgress || 0) === 1) {
    // 有新提醒
    await updateDesignProgress(row.productPlanId)
    emit('updateProgress', { id: row.productPlanId, isNewProgress: '0' })
  }
}

defineExpose({ selectHgiglightRow })
</script>

<style lang="scss" scoped>
/* 隐藏全选按钮 */
:deep(.el-table__header .el-checkbox) {
  display: none !important;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.table-btn {
  display: flex;
}

.operate-btn {
  display: flex;
  align-items: center;
  color: #0064ff;
  cursor: pointer;

  &:last-child {
    margin-left: 14px;
  }

  &:nth-child(2) {
    margin-left: 14px;
  }
}

.table-edite {
  display: inline-block;
  width: 100%;
  padding: 0 11px;
  height: 32px;
  line-height: 32px;
  background-color: #f2f6fc;
}

.editeTable {
  :deep(.el-input__wrapper) {
    box-shadow: none !important;
    border: 1px solid #e5e5e5;
  }
}

.linkColor {
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  color: #0064ff;
}

.tableValueStyle {
  font-weight: 400;
  font-size: 14px;
  color: #333333;
}

.is-sorted .cell {
  background-color: #f5f5f5;
}

.messageWarn {
  font-weight: 500;
  font-size: 12px;
  color: #ffffff;
  line-height: 21px;
  height: 21px;
  background: #ff0000;
  border-radius: 100px 6px 0px 100px;

  &-text {
    padding-left: 5px;
    padding-right: 0px;
  }
}
.empty-content {
  display: flex;
  flex-direction: row;
  align-items: center;

  .logo {
    width: 20px;
    height: 20px;
    margin-right: 4px;
    margin-left: 8px;
  }
  .desc {
    color: #3d3d3d;
    font-size: 14px;
  }
}
</style>
