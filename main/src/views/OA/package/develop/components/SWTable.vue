<template>
  <div>
    <el-table
      class="SWCommonTable editeTable"
      :data="tableList"
      width="100%"
      :show-overflow-tooltip="false"
      v-loading="loading"
      v-horizontal-scroll="'always'"
      row-class-name="commonTableRow"
      :header-cell-style="headerCellStyle"
      :header-row-style="headerRowStyle"
      :cell-style="cellStyle"
      :row-style="rowStyle"
      @selection-change="handleSelectionChange"
      @cell-click="handleCellClick"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="taskCode" label="任务编号" />

      <!-- 店铺 -->
      <el-table-column label="店铺">
        <template #header>
          <div class="table-header">
            <span class="label">店铺</span>
          </div>
        </template>
        <template #default="scope">
          <span>{{ scope.row?.storeName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="planName" label="企划名称">
        <template #default="scope">
          <!-- 点击事件 -->
          <div class="linkColor" @click="handleCell('planName', scope.row)">{{
            scope.row.planName
          }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="planType" label="企划类型">
        <template #default="{ row }">
          <PlanType :planType="row.planType || ''" />
        </template>
      </el-table-column>
      <el-table-column label="系列">
        <template #default="scope">
          <div class="row-center">{{ scope.row?.seriesName }} </div>
        </template>
      </el-table-column>

      <el-table-column label="设计图数">
        <template #default="scope">
          <div class="row-center">
            <el-popover
              placement="right"
              :width="725"
              trigger="hover"
              v-if="scope.row.designGalleryNumber && scope.row.designGalleryNumber.length > 0"
            >
              <el-table
                :data="scope.row.designGalleryVos"
                align="center"
                :show-overflow-tooltip="true"
              >
                <el-table-column min-width="130" property="productNumber" label="产品编号" />

                <el-table-column min-width="110" prop="productPictureTime" label="设计图上传时间">
                  <template #default="scope">
                    {{ scope.row.productPictureTime || '--' }}
                  </template>
                </el-table-column>
                <el-table-column min-width="110" prop="remark" label="设计图备注" />

                <el-table-column label="设计图" prop="productPicture" min-width="60">
                  <template #default="scope">
                    <el-image
                      v-if="scope.row.productPictureUrl"
                      :src="scope.row.productPictureUrl"
                      :preview-src-list="[scope.row.productPictureUrl || '']"
                      :preview-teleported="true"
                      alt=""
                      style="width: 30px; height: 30px"
                    />

                    <div v-else>--</div>
                  </template>
                </el-table-column>
              </el-table>
              <template #reference>
                <span style="color: #0064ff; cursor: pointer">
                  {{
                    scope.row.designPictureGodownList && scope.row.designPictureGodownList.length
                  }}</span
                >
              </template>
            </el-popover>
            <span v-else>{{ scope.row.designGalleryNumber || 0 }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="设计师/买手">
        <template #default="scope">
          <SWSelectPeople
            style="width: 140px"
            :isEdit="true"
            v-model:modelValue="scope.row[`designerVos`]"
            type="operate"
            :getSearchList="remoteMethodDesigner"
            @save-select-people="saveSelectPeople(scope.row, 'designerVos')"
            @handle-focus="handleCellClick(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="选供专员">
        <template #default="scope">
          <!-- 选择人员 只有产研主管才能维护设计师/买手 只能选择一个-->
          <SWSelectPeople
            style="width: 140px"
            :isEdit="true"
            v-model:modelValue="scope.row[`chosenSupplierStaffVos`]"
            type="operate"
            :getSearchList="remoteMethodChosenSupplierStaffId"
            @save-select-people="saveSelectPeople(scope.row, 'chosenSupplierStaffVos')"
            @handle-focus="handleCellClick(scope.row)"
            :multiple="false"
          />
        </template>
      </el-table-column>

      <!-- 添加操作列 -->
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleDesignGallery(row)">设计图库</el-button>
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
  </div>
</template>

<script lang="ts" setup>
const message = useMessage() // 消息弹窗
const router = useRouter()
import { updateDevelopManageProgressNew } from '@/api/oa/package/develop'
import { getDictDataPage } from '@/api/system/dict/dict.data'
import { getDictLabel, getIntDictOptions } from '@/utils/dict'
import PlanType from '@/views/OA/package/components/planType.vue'
import { useCategoryList } from '../hooks.js'
import SWSelectPeople from './SWSelectPeople.vue'

import * as CommonApi from '@/api/common'
import * as SystemConstantApi from '@/api/system/systemConstant'

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

const addForm = ref({
  operate: ''
})

const chosenSupplierStaffIdOpenIds = ref('')

// 选供专员
const remoteMethodChosenSupplierStaffId = async (value) => {
  if (!chosenSupplierStaffIdOpenIds.value) {
    chosenSupplierStaffIdOpenIds.value =
      await SystemConstantApi.getSystemConstantConfigbyCode('NEW_PRODUCT_DEPT_SUPPLY')
  }

  const data = await CommonApi.getPersonByOpenId(chosenSupplierStaffIdOpenIds.value)
  console.log('选供专员', data)
  return data || []
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
// 品类
const formatCategory = (code) => {
  const item = categoryList.value.find((item) => item.code === code)
  return item ? item.name : '--'
}
// 企划类型
const formatPlanType = (value, field) => {
  const item = field.options.find((item) => item.code === value)
  return item ? item.value : '--'
}
// 类型
const formatProductType = (value, field) => {
  const item = field.options.find((item) => item.code === value)
  return item ? item.value : '--'
}

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
const formatTableValue = (row, code) => {
  let value = row[code]
  const column = showTableColumns.value.find((item) => item.code === code)
  // console.log(column?.options)
  // 检查是否是单选类型且dictCode有值
  if (column?.type === 2 && column.dictCode) {
    // 使用字典值来查找对应的选项
    let dictData = dicList.value.find((dict) => dict.id == column.dictCode)
    if (dictData) {
      const dictName = getDictLabel(dictData.code, value)

      if (dictName) {
        return dictName || ''
      }
      // 处理自定义选项的情况
      const selectItem = column.options?.find((item) => item.code === value || item.value === value)
      return selectItem ? selectItem.value : '--'
    } else {
      // 处理自定义选项的情况
      const selectItem = column.options?.find((item) => item.code === value || item.value === value)
      return selectItem ? selectItem.value : '--'
    }
  } else if (column?.type === 2) {
    // 处理自定义选项的情况
    const selectItem = column.options?.find((item) => item.code === value || item.value === value)
    return selectItem ? selectItem.value : '--'
  }

  // 其他类型直接返回值
  return value || '--'
}
// 判断是否编辑状态
const isEditable = (row, key) => {
  return row['editeCode'] === key
}
const handleCell = (key: string, row: any) => {
  emit('openHandle', row, key)
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
  return props.tableColumns.filter((item) => item.listDisplay && item.state == 1)
})

const emit = defineEmits([
  'pageChange',
  'sortChange',
  'doubleClick',
  'blur',
  'saveChosenSupplierStaff',
  'openHandle',
  'saveDesigner',
  'handleSelectionChange',
  'updateProgress'
])

const handleSizeChange = (val: number) => {
  pageSize.value = val
  emit('pageChange', { page: currentPage.value, size: val })
}

// 分页
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  emit('pageChange', { page: val, size: pageSize.value })
}

const handleDoubleClick = (row: any, key: string, edit: boolean) => {
  handleCellClick(row)

  if (edit) {
    row.editeCode = key
  }
  console.log('点击', key)
}

// 选中的table数据
const selectTableValue = ref([])
const handleSelectionChange = (value) => {
  selectTableValue.value = value
  // emit(
  //   'handleSelectionChange',
  //   selectTableValue.value.map((item) => item.id)
  // )
  emit('handleSelectionChange', selectTableValue.value)
  console.log(value)
}

const handleDesignGallery = (row: any) => {
  if (row.designerVos && row.designerVos.length > 0) {
    router.push({
      name: 'PackageDesignGallery',
      query: {
        planId: row.enterprisePlanId || '',
        developId: row.id || ''
      }
    })
  } else {
    if (!row.designerVos || row.designerVos.length === 0) {
      ElMessage.warning('请先指派设计师/买手')
      return
    }
  }
}

const designerOpenIds = ref('')
// 获取设计师/买手-产研部门
const remoteMethodDesigner = async (value) => {
  if (!designerOpenIds.value) {
    designerOpenIds.value = await SystemConstantApi.getSystemConstantConfigbyCode(
      'NEW_PRODUCT_DEPT_DEVELOP'
    )
  }

  const data = await CommonApi.getPersonByOpenId(designerOpenIds.value)
  return data || []
}

// 关联设计师
const saveSelectPeople = async (row, fieldCode) => {
  row.editeCode = undefined
  // 选供专员
  if (fieldCode == 'chosenSupplierStaffVos') {
    emit('saveChosenSupplierStaff', row, '')
    return
  }
  emit('saveDesigner', row, '')
}

const handleDevelopProgress = (row: any) => {
  router.push({
    name: 'DevPlanDetail',
    params: {
      developPlanId: row.enterprisePlanId || ''
    },
    query:{
      taskCode: row.taskCode || '',
      taskId: row.id || ''
    }
  })
}

onMounted(() => {
  initSelectData()
  initDicList()
})

// 更新当前页
const updateCurrentPage = (page: number) => {
  currentPage.value = page
}

// 处理点击列事件
const handleCellClick = async (row: any) => {
  if (Number(row.isNewProgress || 0) == 1) {
    // 有新提醒
    await updateDevelopManageProgressNew(row.id)
    emit('updateProgress', { id: row.id, isNewProgress: '0' })
  }
}

defineExpose({
  updateCurrentPage
})
</script>

<style lang="scss" scoped>
.operation-status {
  width: 80px;
  height: 32px;
  // background-color: #F68D18;
  display: inline-block;
  line-height: 32px;
  color: white;
  border-radius: 15px;
  text-indent: 6px;
}

.operation-status-icon {
  width: 28px;
  vertical-align: middle;
  position: absolute;
  right: 0;
  top: -4px;
}

.table-header {
  display: flex;
  align-items: center;

  .label {
    padding-right: 5px;
  }
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.table-edite {
  display: inline-block;
  width: 100%;
  padding: 0 11px;
  // height: 32px;
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

.salePointBg {
  display: flex;
  flex-direction: column;

  &-title {
    font-size: 14px;
    color: #333333;
    font-weight: 500;
    margin-bottom: 8px;
  }

  &-content {
    // font-size: 14px;
    // color: #666666;
  }
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

<style scoped>
:deep(p) {
  margin: 0px !important;
  padding: 0px !important;
}
</style>
