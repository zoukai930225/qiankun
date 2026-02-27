<!--
 * @Date: 2025-01-03 16:22:21
-->
<template>
  <div>
    <el-table
      ref="SWTableRef"
      class="SWCommonTable"
      border
      :data="sortedTableData"
      width="100%"
      :show-overflow-tooltip="true"
      v-loading="loading"
      v-horizontal-scroll="'always'"
      row-class-name="commonTableRow"
      :header-cell-style="appStore.headerCellStyle"
      :highlight-current-row="true"
      @sort-change="handleSortChange"
      @cell-click="handleCellClick"
    >
      <el-table-column
        v-for="field in showTableColumns"
        :key="field.id"
        :prop="field.code"
        :label="field.name"
        :sortable="field.supportSort"
        :min-width="tableMinWidth(field)"
        :class="{ 'is-sorted': sortProp === field.code }"
      >
        <template #default="{ row }">
          <!-- 名字特殊处理 -->
          <span v-if="field.code === 'planName'">
            <div class="row-center">
              <div class="linkColor text1" @click="routeHandle(row.planName)">
                {{ row[field.code] }}</div
              >
              <img
                style="cursor: pointer; margin-left: 6px; width: 10px; height: 10px"
                src="@/assets/imgs/common/copy.png"
                alt=""
                @click="copyText(row.planName)"
              />
            </div>
          </span>
          <!-- 计划数 hover效果 -->
          <span v-else-if="field.code == 'detailNum'">
            <el-popover
              placement="right"
              :width="485"
              trigger="hover"
              v-if="row?.details?.length > 0"
            >
              <el-table class="palnCountTable" :data="row.details" align="center">
                <el-table-column width="90" property="category" label="品类">
                  <template #default="{ row: innerRow }">
                    <!-- {{ formatCategory(innerRow.category) }} -->
                      {{ innerRow.completeCategoryName || '-' }}
                  </template>
                </el-table-column>
                <el-table-column width="90" property="series" label="系列" />
                <el-table-column label="类型" prop="series">
                  <template #default="scope">
                    <div>{{
                      scope.row.productType == '0'
                        ? '买手款'
                        : scope.row.productType == '1'
                          ? '定制款'
                          : '--'
                    }}</div>
                  </template>
                </el-table-column>
                <el-table-column width="120" property="packageMethod" label="包装方式">
                  <template #default="scope">
                    {{ scope.row.packageMethod || '--' }}
                  </template>
                </el-table-column>

                <el-table-column label="包装图片" prop="unRoutinePackagePicture" width="120">
                  <template #default="scope">
                    <el-image
                      v-if="scope.row.unRoutinePackagePicture"
                      :src="scope.row.unRoutinePackagePicture"
                      :preview-src-list="[scope.row.unRoutinePackagePicture || '']"
                      :preview-teleported="true"
                      alt=""
                      style="width: 26px; height: 26px"
                    />
                    <div v-else>--</div>
                  </template>
                </el-table-column>
                <!-- <el-table-column width="80" property="designNumber" label="定制款" />
                <el-table-column width="80" property="marketNumber" label="买手款" /> -->
              </el-table>
              <template #reference>
                <span class="linkColor"> {{ row[field.code] }}</span>
              </template>
            </el-popover>
            <span v-else class="linkColor">{{ row[field.code] }}</span>
          </span>
          <!-- 时间格式化 -->
          <!-- <span v-else-if="field.code == 'planListDate' || field.code == 'planOrderDate'">{{
            formatCustomDate(
              row[field.code],
              field.code == 'planListDate' ? 'yyyy-MM' : 'yyyy-MM-dd'
            )
          }}</span> -->
          <span v-else-if="field.code == 'planOrderDate'">{{
            formatCustomDate(row[field.code], 'yyyy-MM-dd')
          }}</span>
          <span v-else-if="field.code === 'status'">
            <span>
              {{ getDictLabel(DICT_TYPE.NP_ENTERPRISE_STATUS, row[field.code]) || '--' }}</span
            >
          </span>
          <span v-else-if="field.code === 'planTemplate'">
            <span> {{ getDictLabel(DICT_TYPE.NP_PLAN_TEMPLATE, row[field.code]) || '--' }}</span>
          </span>
          <span v-else-if="field.code === 'isCore'">
            <span> {{ getDictLabel(DICT_TYPE.NP_PRODUCTGRADE, row[field.code]) || '--' }}</span>
          </span>

          <span
            v-else-if="field.code === 'examineInfos'"
            style="font-size: 14px; color: #0064ff; line-height: 20px; cursor: pointer"
          >
            <el-popover :width="420" trigger="hover">
              <AuditDetail :list="handleJSONParse(row.examineInfos) || []" />
              <template #reference>
                <div class="row-center">
                  <span> 查看</span>
                </div>
              </template>
            </el-popover>
          </span>
          <div
            v-else-if="field.code === 'progressBoard'"
            style="font-size: 14px; color: #0064ff; line-height: 20px; cursor: pointer"
          >
            <div class="row-center" @click="handlePlanProgress(row)">
              <span style="color: #0064ff"> 查看</span>
            </div>
          </div>
          <div
            v-else-if="field.code === 'customWarn' && row.newProgress === '1'"
            class="row-center"
          >
            <div class="messageWarn">
              <div class="messageWarn-text">新进度！</div>
            </div>
          </div>
          <div v-else-if="field.code === 'store'" class="row-center">
            <img
              v-if="row.channel && getImageUrl(row.channel)"
              style="width: 14px; height: 14px; margin-right: 8px"
              :src="getImageUrl(row.channel)"
              alt=""
            />
            <div
              :style="{
                width: row.channel && getImageUrl(row.channel) ? 'calc(100% - 22px)' : '100%'
              }"
              style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
            >
              {{ row.storeName || row[field.code] }}
            </div>
          </div>
          <!-- 人员 -->
          <!-- 提交人 -->
          <div v-else-if="field.code === 'submitPerson'" class="row-center">
            <ListPersonShow :list="handleJSONParse(row.submitPersonList) || []" />
          </div>
          <!-- 运营负责人 -->
          <div v-else-if="field.code === 'operateManageId'" class="row-center">
            <ListPersonShow :list="handleJSONParse(row.operateManages) || []" />
          </div>

          <!-- <SWSelectPeople style="width: 100%" :isEdit="false" :multiple="true"
            v-else-if="field.type === 8 && row[`${field.code}List`]"
            :member-list="handleJSONParse(row[`${field.code}List`])" />
          <div v-else-if="field.type === 8 && !row[`${field.code}List`]">--</div> -->
          <PlanType
            v-else-if="
              field.code === 'planType' ||
              field.code === 'productType' ||
              field.code === 'planProductType'
            "
            :fieldCode="field.code"
            :planType="row[field.code]"
          />
          <!-- 产品图参考 -->
          <div v-else-if="field.code === 'productDiagramReference'">
            <el-image style="width: 100px;z-index:999" :preview-teleported="true" :src="row[field.code]" :preview-src-list="[row[field.code] || '']" fit="cover"/>
          </div>
          <!-- 其他 -->
          <span v-else class="tableValueStyle">{{ formatTableValue(row, field.code) }}</span>

        </template>
      </el-table-column>

      <!-- 添加操作列 -->
      <el-table-column label="操作" width="360" fixed="right">
        <template #default="{ row }">
          <el-button v-if="row.displayAuditButton" link type="primary" @click="handleAudit(row)">
            审核</el-button
          >
          <el-button link type="primary" @click="handleView(row)" v-if="row.displayDetailButton">
            详情
          </el-button>
          <el-button v-if="row.displayEditButton" link type="primary" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button
            v-if="row.displayDesignButton"
            link
            type="primary"
            @click="handleDesignGallery(row)"
            >设计图库</el-button
          >
          <el-button
            v-if="row.displayRecycleButton"
            link
            type="primary"
            @click="handleBusinessRecycle(row)"
            >商企回收</el-button
          >
          <el-button v-if="row.displayDeleteButton" link type="danger" @click="handleDel(row)"
            >删除</el-button
          >
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
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      />
    </div>

    <!-- 审核 -->
    <AuditDialog v-model="dialogVisible" :selectItem="selectItem" @confirm="handleConfirm" />
    <BusinessRecycleDialog ref="businessRecycleDialogRef" @confirm="handleConfirm" />
  </div>
</template>

<script lang="ts" setup>
const router = useRouter()
import { useAppStore } from '@/store/modules/app'
import { DICT_TYPE, getDictLabel } from '@/utils/dict'
import { getImageUrl } from '@/utils'
import SWSelectPeople from '@/views/OA/new/develop/components/SWSelectPeople.vue'
import { Delete, Edit, Picture, View } from '@element-plus/icons-vue'
import { useCategoryList } from '../hooks.js'
import { formatCustomDate } from '../utils.js'
import AuditDetail from './auditDetail.vue'
import AuditDialog from './auditDialog.vue'
import BusinessRecycleDialog from './businessRecycleDialog.vue'
import PlanType from '@/views/OA/new/components/planType.vue'
import ListPersonShow from '@/views/OA/new/develop/components/listPersonShow.vue'

import { updateDevelopManageProgress } from '@/api/oa/new/develop'
import { useNewProductStore } from '@/store/modules/newProduct'
import { copyText } from '@/utils/copyText.js'

const newProductInfo = useNewProductStore()

const appStore = useAppStore()
const { categoryList, initSelectData } = useCategoryList()
// 定义类型
interface Field {
  id: string
  listDisplay: boolean
  name: string
  code: string
  state: number
  type: number
  supportSort: boolean
}

const currentPage = ref(1)
const pageSize = ref(10)

const sortProp = ref('')
//@ts-ignore
const sortOrder = ref<'ascending' | 'descending'>('')
const handleSortChange = ({ prop, order }) => {
  sortProp.value = prop
  sortOrder.value = order
  // 排序字段 1-顺序 2-倒叙 null-不排序
  const custorOrder = order == 'ascending' ? 1 : order == 'descending' ? 2 : null
  emit('sortChange', { prop, custorOrder })
}

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

const sortedTableData = ref<any[]>([])
watch(
  () => props.tableData,
  (newData) => {
    sortedTableData.value = [...newData]
  },
  { immediate: true }
)

onMounted(() => {
  initSelectData()
})

const tableMinWidth = (field: any) => {
  switch (field.code) {
    case 'customWarn':
      return 80
    case 'planName':
      return 300
    case 'planningTime':
      return 200
    case 'store':
      return 220
    case 'planOrderDate':
    case 'planListDate':
      return 140
    default:
      return field.type === 8 ? 140 : 120
  }
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
  const value = row[code]
  if (showTableColumns.value.find((item) => item.code == code)?.type == 2) {
    const item = showTableColumns.value.find((item) => item.code == code)
    // 通过code找到对应的options
    // @ts-ignore
    const selectItem = item?.options?.find((item) => item.code === value)
    return selectItem ? selectItem.value : ''
  }

  return value
}

const formatCategory = (code) => {
  const item = categoryList.value.find((item) => item.code === code)
  return item ? item.name : ''
}

// 企划类型
const formatPlanType = (value, field) => {
  const item = field.options.find((item) => item.code === value)
  return item ? item.value : '--'
}
const routeHandle = (planName) => {
  router.push({
    name: 'Develop',
    query: {
      planName
    }
  })
}
// 列表展示 && 启用状态
const showTableColumns = computed(() => {
  return props.tableColumns.filter((item) => item.listDisplay && item.state == 1)
})

const emit = defineEmits([
  'pageChange',
  'edit',
  'seeDetail',
  'del',
  'sortChange',
  'auditSuccess',
  'updateProgress'
])

const dialogVisible = ref(false)
const selectItem = ref({})
const handleConfirm = async () => {
  emit('auditSuccess')
}
const handleAudit = (row: any) => {
  selectItem.value = row
  dialogVisible.value = true
}

const handlePlanProgress = (row: any) => {
  router.push({
    name: 'NodeDetail',
    params: {
      planId: row.id || ''
    },
    query: {
      planName: row.planName || ''
    }
  })
}
const handleView = (row: any) => {
  emit('seeDetail', row)
}
const handleEdit = (row: any) => {
  emit('edit', row)
}

const handleDesignGallery = (row: any) => {
  newProductInfo.planName = row.planName
  router.push({name: 'DesignGallery'})
}
const businessRecycleDialogRef = ref()
// 商企回收
const handleBusinessRecycle = (row: any) => {
  row.recycleType = 1
  businessRecycleDialogRef.value?.open(row)
}

const handleDel = (row: any) => {
  emit('del', row)
}
const handleSizeChange = (val: number) => {
  pageSize.value = val
  emit('pageChange', { page: currentPage.value, size: val })
}

// 分页
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  emit('pageChange', { page: val, size: pageSize.value })
}

// 更新当前页
const updateCurrentPage = (page: number) => {
  currentPage.value = page
}

const SWTableRef = ref()
const currentRow = ref()
// 处理点击列事件
const handleCellClick = async (row: any) => {
  currentRow.value = row
  SWTableRef.value?.setCurrentRow(currentRow.value)
  console.log('打开弗利萨开发了')
  if (Number(row.newProgress || 0) === 1) {
    // 有新提醒
    await updateDevelopManageProgress({ id: row.id, newProgress: 0 })
    emit('updateProgress', { id: row.id, newProgress: '0' })
  }
}

defineExpose({
  updateCurrentPage
})
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
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

.palnCountTable {
  :deep(.el-table__row) {
    // background: #f2f7ff;
    // border-radius: 7px;
  }

  :deep(.el-table__inner-wrapper:before) {
    // background: #fff !important;
  }

  // :deep(.el-table td.el-table__cell) {
  //   border-bottom: 8px solid red;
  // }
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
</style>
