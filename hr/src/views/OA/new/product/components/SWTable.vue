<!--
 * @Date: 2025-01-03 16:22:21
-->
<template>
  <div>
    <el-table
      class="SWCommonTable"
      border
      :data="tableList"
      width="100%"
      ref="SWTableRef"
      :show-overflow-tooltip="true"
      v-loading="loading"
      v-horizontal-scroll="'always'"
      row-class-name="commonTableRow"
      :header-cell-style="appStore.headerCellStyle"
      :highlight-current-row="true"
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
      @cell-click="handleCellClick"
      row-key="id"
    >
      <el-table-column
        v-for="field in showTableColumns"
        :key="field.id"
        :prop="field.code"
        :label="field.name"
        :sortable="field.supportSort"
        :show-overflow-tooltip="field.code === 'customWarn' ? false : true"
        :min-width="tableMinWidth(field)"
      >
        <template #default="{ row }">
          <span
            v-if="
              (field.code === 'planCode' ||
                field.code === 'npCompetitiveInformationCount' ||
                field.code === 'progressTemplate' ||
                field.code === 'planName' ||
                field.code === 'planType' ||
                field.code === 'planningPlan' ||
                field.code === 'productGrade' ||
                field.code === 'productType' ||
                field.code === 'planProductType' ||
                field.code === 'isCore' ||
                field.code === 'category' ||
                field.code === 'classCode' ||
                field.code === 'productNumber' ||
                field.code === 'productPicture' ||
                field.code === 'planningTime') &&
              !isEditable(row, field.code)
            "
            @click="
              field.code === 'progressTemplate' ||
              field.code === 'npCompetitiveInformationCount' ||
              field.code === 'planName'
                ? handleCell(field.code, row)
                : null
            "
          >
            <span v-if="field.code === 'category'">
              <!-- {{ formatCategory(row[field.code]) }} -->
              {{ row.completeCategoryName || '-' }}
            </span>
            <div
              v-else-if="
                field.code === 'planCode' ||
                field.code === 'planName' ||
                field.code === 'productNumber'
              "
              class="row-center"
            >
              <div
                style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
                class="text1"
              >
                {{ row[field.code] }}</div
              >
              <img
                style="cursor: pointer; margin-left: 6px; width: 10px; height: 10px"
                src="@/assets/imgs/common/copy.png"
                alt=""
                @click.stop.prevent="copyText(row[field.code])"
              />
            </div>

            <span
              v-else-if="field.code === 'progressTemplate'"
              :class="[field.code === 'progressTemplate' ? 'linkColor' : '']"
            >
              {{ row[field.code] || '点击维护进度模板' }}
            </span>
            <span v-else-if="field.code === 'productGrade' || field.code === 'isCore'">
              <span> {{ getDictLabel(DICT_TYPE.NP_PRODUCTGRADE, row[field.code]) || '--' }}</span>
            </span>
            <!-- 设计图 -->
            <span v-else-if="field.code === 'productPicture'">
              <el-image
                v-if="row[field.code] && row[field.code].length > 0"
                style="width: 46px; height: 46px; z-index: 999999"
                :src="row[field.code].split(',')[0]"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                :preview-teleported="true"
                :preview-src-list="[row[field.code].split(',')[0]]"
                show-progress
                :initial-index="4"
                fit="cover"
              />
              <span v-else>暂无</span>
            </span>
            <PlanType
              v-else-if="
                field.code === 'planType' ||
                field.code === 'productType' ||
                field.code === 'planProductType'
              "
              :fieldCode="field.code"
              :planType="row[field.code]"
            />
            <span
              v-else
              :class="[
                field.code === 'npCompetitiveInformationCount' || field.code === 'planName'
                  ? 'linkColor'
                  : ''
              ]"
            >
              {{ row[field.code] || '--' }}</span
            >
          </span>
          <!-- 当前节点 -->
          <span v-else-if="field.code === 'nodeCode' ">
            {{ row['nodeName'] || '-' }}
          </span>
          <!-- 时间格式化 -->
          <span
            v-else-if="
              (field.code === 'listingDate' || field.code === 'firstOrderTime') &&
              !isEditable(row, field.code)
            "
          >
            {{ formatCustomDate(row[field.code]) }}
          </span>

          <!-- 产品状态 -->
          <span v-else-if="field.code === 'productStatus' && !isEditable(row, field.code)">
            {{ productStatusMap([row[field.code]]) || '--' }}
          </span>

          <span
            class="table-edite"
            v-else-if="field.code === 'goodsCode' && !isEditable(row, field.code)"
            @dblclick="handleDoubleClick(row, field.code, field.edit)"
          >
            {{ formatTableValue(row, field.code) }}
          </span>

          <span
            v-else-if="
              !isEditable(row, field.code) && field.type !== 8 && field.code !== 'customWarn' && field.code !== 'goodsId'
            "
          >
            {{ formatTableValue(row, field.code) }}
          </span>

          <div v-if="field.code === 'customWarn' && row.newProgress === '1'" class="row-center">
            <div class="messageWarn">
              <div class="messageWarn-text">新进度！</div>
            </div>
          </div>
          <!-- 商品 -->
          <div v-if="field.code === 'goodsId'" class="row-center">
            <el-popover
              placement="right"
              :width="348"
              trigger="hover"
              :show-arrow="false"
              :offset="20"
            >
              <template #reference>
                <div class="goodImg">
                  <img
                    v-if="row.goodsImage"
                    style="width: 42px; height: 42px; border-radius: 4px"
                    :src="row.goodsImage"
                  />
                  <template v-else>--</template>
                </div>
              </template>
              <GoodCard
                :good="{
                  materialName: row.goodsName,
                  materialId: row.goodsId,
                  goodsImage: row.goodsImage,
                  channel: row.channel || ''
                }"
              />
            </el-popover>
            <div class="goodName">{{ row.goodsName || row.goods_name }}</div>
          </div>

          <!-- 文本编辑 -->
          <el-input
            v-if="isEditable(row, field.code) && field.type === 0"
            class="table-input"
            v-model="row[field.code]"
            :placeholder="field.placeholder || placeholderMap(field.type)"
            :maxlength="field.maxLength"
            @keyup.enter="handleBlur(row, field.code)"
            @blur="handleBlur(row, field.code)"
            clearable
          />
          <!-- 数字 -->
          <el-input
            v-if="isEditable(row, field.code) && field.type == 1"
            class="table-input"
            v-model="row[field.code]"
            type="number"
            :min="0"
            :maxlength="field.maxLength"
            @keyup.enter="handleBlur(row, field.code)"
            @blur="handleBlur(row, field.code)"
            :placeholder="field.placeholder || placeholderMap[field.type]"
            clearable
          />
          <!-- 单选 -->
          <el-select
            v-model="row[field.code]"
            v-if="isEditable(row, field.code) && field.type === 2"
            :placeholder="field.placeholder || placeholderMap[field.type]"
            clearable
            value-on-clear=""
            @visible-change="(val) => handleVisibleChange(row, field.code, val)"
            @clear="handleBlur(row, field.code)"
          >
            <el-option
              v-for="dict in field.options || []"
              :key="dict.code"
              :label="dict.value"
              :value="dict.code"
            />
          </el-select>
          <!-- 日期 -->
          <el-date-picker
            style="width: 100%"
            v-if="isEditable(row, field.code) && (field.type === 4 || field.type === 5)"
            v-model="row[field.code]"
            :type="field.type === 4 ? 'date' : 'datetime'"
            :value-format="field.type === 4 ? 'YYYY-MM-DD' : 'yyyy-MM-dd HH:mm:ss'"
            :placeholder="field.placeholder || placeholderMap[field.type]"
            @change="handleBlur(row, field.code)"
            @blur="handleBlur(row, field.code)"
          />
          <!-- 人员 -->
          <!-- <SWSelectPeople style="width: 100%" :isEdit="false" :multiple="true"
            v-if="field.type === 8 && row[`${field.code}`]" :member-list="handleJSONParse(row[`${field.code}List`])" />
          <div v-if="field.type === 8 && !row[`${field.code}`]">--</div> -->
        </template>
      </el-table-column>
      <el-table-column :width="170 * 6" align="center" label="负责人">
        <el-table-column :width="170" label="设计师">
          <template #default="{ row }">
            <div class="row-center">
              <ListPersonShow :list="handleJSONParse(row.designerList) || []" />
            </div>
          </template>
        </el-table-column>
        <el-table-column :width="170" label="版师">
          <template #default="{ row }">
            <div class="row-center">
              <ListPersonShow :list="handleJSONParse(row.patternMakerList) || []" />
            </div>
          </template>
        </el-table-column>
        <el-table-column :width="170" label="供应链开发">
          <template #default="{ row }">
            <div class="row-center">
              <ListPersonShow :list="handleJSONParse(row.chosenSupplierStaffList) || []" />
            </div>
          </template>
        </el-table-column>
        <el-table-column :width="170" label="工艺师">
          <template #default="{ row }">
            <div class="row-center">
              <ListPersonShow :list="handleJSONParse(row.workmanshipList) || []" />
            </div>
          </template>
        </el-table-column>
        <el-table-column :width="170" label="运营">
          <template #default="{ row }">
            <div class="row-center">
              <ListPersonShow :list="handleJSONParse(row.operationalInformationPersonList) || []" />
            </div>
          </template>
        </el-table-column>
        <el-table-column :width="170" label="采购">
          <template #default="{ row }">
            <div class="row-center">
              <ListPersonShow :list="handleJSONParse(row.purchaseInformationPersonList) || []" />
            </div>
          </template>
        </el-table-column>
      </el-table-column>
      <!-- 添加操作列 -->
      <el-table-column label="操作" width="230" fixed="right" align="center">
        <template #default="{ row }">
          <div class="table-btn">
            <!-- <div class="operate-btn" @click="handleOnline(row)">
              <span>上架维护</span>
            </div> -->
            <div class="operate-btn" @click="handleProgress(row)">
              <span>进度维护</span>
            </div>
            <div
              v-if="row.displayRecycleButton"
              class="operate-btn"
              @click.stop.prevent="handleBusinessRecycle(row)"
            >
              <span>商企回收</span>
            </div>
            <div
              v-if="row.displayCopyButton"
              class="operate-btn"
              @click.stop.prevent="handleCopy(row)"
            >
              <span>复制</span>
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
    <BusinessRecycleDialog ref="businessRecycleDialogRef" @confirm="refreshList" />

    <CopyDialog ref="copyDialogRef" @confirm="refreshList" />
  </div>
</template>

<script lang="ts" setup>
import IconProgress from '@/assets/imgs/oa/product/icon-progress.png'
import { formatCustomDate, placeholderMap, productStatusMap } from '../utils'
import { getDictDataPage } from '@/api/system/dict/dict.data'
import { getIntDictOptions, DICT_TYPE, getDictLabel } from '@/utils/dict'
import { copyText } from '@/utils/copyText.js'

import { useCategoryList } from '../hooks.js'

import SWSelectPeople from '@/views/OA/new/develop/components/SWSelectPeople.vue'
import PlanType from '@/views/OA/new/components/planType.vue'
import BusinessRecycleDialog from '@/views/OA/new/plan/components/businessRecycleDialog.vue'
import ListPersonShow from '@/views/OA/new/develop/components/listPersonShow.vue'
import CopyDialog from '../components/copyDialog.vue'
import GoodCard from '@/components/common/goods/goodCard.vue'

import { updateDesignProgress } from '@/api/oa/new/designGallery/index'

const { categoryList, initSelectData } = useCategoryList()
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()

// const headerCellStyle = {
//   backgroundColor: '#EBF2FF',
//   color: '#333',
//   fontSize: '14px',
//   fontWeight: '500',
//   height: '40px',
//   'line-height': '40px',
//   borderBottom: 'none',
//   padding: 0
// }
// const headerRowStyle = {
//   backgroundColor: 'rgba(256, 256, 256, 0)'
// }
// const cellStyle = {
//   borderBottom: 'none'
// }
// const rowStyle = {
//   marginBottom: '16px',
//   height: '80px'
// }
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

const formatCategory = (code) => {
  const item = categoryList.value.find((item) => item.code === code)
  return item ? item.name : '--'
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
      return str
    }
    if (str !== '') {
      return JSON.parse(str)
    }
  } catch (error) {
    return []
  }
}

const formatTableValue = (row, code) => {
  let value = row[code]
  const column = showTableColumns.value.find((item) => item.code === code)

  // 检查是否是单选类型且dictCode有值
  if (column?.type === 2 && column.dictCode) {
    // 使用字典值来查找对应的选项
    let dictData = dicList.value.find((dict) => dict.id == column.dictCode)
    if (dictData) {
      const dictName = getDictLabel(dictData.code, value)
      return dictName || ''
    }
  } else if (column?.type === 2) {
    // 处理自定义选项的情况
    const selectItem = column.options?.find((item) => item.code === value || item.value === value)
    return selectItem ? selectItem.value : ''
  }

  // 其他类型直接返回值
  // console.log(code, value)
  return value || '--'
}

// 企划类型
const formatPlanType = (value, field) => {
  const item = field.options.find((item) => item.code === value)
  return item ? item.value : '--'
}

const tableMinWidth = (field: any) => {
  switch (field.code) {
    case 'customWarn':
      return 80
    case 'planName':
      return 300
    case 'productNumber':
      return 230
    case 'planCode':
      return 200
    case 'planningTime':
      return 240
    case 'isCore':
    case 'nodeName':
      return 160
    default:
      return field.type === 8 ? 240 : 120
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

const currentRow = ref()
const handleRowClick = (row, column, event) => {
  currentRow.value = row
  emit('openNode', row)
}

const SWTableRef = ref()
const selectHgiglightRow = (row) => {
  if (row) {
    currentRow.value = row
  }
  if (currentRow.value) {
    SWTableRef.value?.setCurrentRow(currentRow.value)
  }
}

// 列表展示 && 启用状态
const showTableColumns = computed(() => {
  // 如果type为2或者3，但是options为null，则需要根据dictCode获取options
  props.tableColumns.forEach((item) => {
    if ((item.type === 2 || item.type === 3) && !item.options) {
      let dictData = dicList.value.find((dict) => dict.id == item.dictCode)
      if (dictData) {
        item.options = getIntDictOptions(dictData.code, true)
        // console.log('item.options', item.options);
      }
    }
  })
  return props.tableColumns.filter((item) => item.listDisplay && item.state == 1 && item.type !== 8)
})

const emit = defineEmits([
  'pageChange',
  'handleOnline',
  'handleProgress',
  'informationExport',
  'handleDesign',
  'handleTemplate',
  'openNode',
  'blur',
  'handleCompetitor',
  'selectionChange',
  'handleView',
  'handleProductNumber',
  'handleNew',
  'updateProgress',
  'refreshList'
])

// 判断是否编辑状态
const isEditable = (row, key) => {
  return row['editeCode'] === key
}
const handleCell = (key: string, row: any) => {
  if (key === 'progressTemplate') {
    emit('handleTemplate', row)
  } else if (key === 'npCompetitiveInformationCount') {
    emit('handleCompetitor', row)
  } else if (key === 'productNumber') {
    emit('handleProductNumber', row)
  } else if (key === 'planName') {
    emit('handleNew', row)
  }
}
const handleDoubleClick = (row: any, key: string, edit: boolean) => {
  console.log('双击')
  if (edit) {
    row.editeCode = key
  }
  // console.log(row)
}
const handleBlur = (row, key) => {
  row.editeCode = undefined
  // console.log(row. key)
  emit('blur', row, key)
}
const handleVisibleChange = (row, key, val) => {
  if (!val) {
    row.editeCode = undefined
  }
}

// 上架维护
const handleOnline = (row: any) => {
  const item = categoryList.value.find((item) => item.code === row.category)
  row.categoryName = item ? item.name : ''
  emit('handleOnline', row)
}

// 进度维护
const handleProgress = (row: any) => {
  // console.log('进度维护', row)
  const item = categoryList.value.find((item) => item.code === row.category)
  row.categoryName = item ? item.name : ''
  emit('handleProgress', row)
}

//资料导出
const informationExport = (row: any) => {
  const item = categoryList.value.find((item) => item.code === row.category)
  row.categoryName = item ? item.name : ''
  emit('informationExport', row)
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
  emit('pageChange', { page: currentPage.value, size: val })
}

// 分页
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  emit('pageChange', { page: val, size: pageSize.value })
}

// 处理点击列事件
const handleCellClick = async (row: any) => {
  if (Number(row.newProgress || 0) === 1) {
    // 有新提醒
    await updateDesignProgress({ id: row.id, newProgress: 0 })
    emit('updateProgress', { id: row.id, newProgress: '0' })
  }
}
const recycleId = ref('')
const businessRecycleDialogRef = ref()
// 商企回收
const handleBusinessRecycle = (row: any) => {
  row.recycleType = 3
  recycleId.value = row.id
  businessRecycleDialogRef.value?.open(row)
}
const refreshList = () => {
  emit('refreshList', recycleId.value)
}

const copyDialogRef = ref()
const handleCopy = (row: any) => {
  copyDialogRef?.value?.open(row)
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

  span {
    //padding-left: 10px;
  }

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
</style>

<style lang="scss" scoped>
.el-table {
  :deep(.el-popper) {
    max-width: 400px !important;
    white-space: pre-wrap !important;
  }
}

:deep(.el-table__body tr.current-row > td.el-table__cell) {
  background-color: rgb(236, 245, 255);
}

.goodImg {
  width: 42px;
  height: 42px;
  border-radius: 2px;
  margin-right: 8px;
}

.goodName {
  width: calc(100% - 70px);
  font-size: 14px;
  color: #0064ff;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
}
</style>
