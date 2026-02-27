<template>
  <el-dialog
    v-model="isShow"
    title="商家编码关联"
    :modal="modal"
    class="relation-dialog"
    width="880px"
  >
    <el-divider />
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form ref="queryRef" :model="queryParams" inline>
          <el-form-item prop="specNo" label="商家编码">
            <el-input
              v-model.trim="queryParams.specNo"
              placeholder="请输入商家编码"
              clearable
              @keydown.enter="getList"
              @change="getList"
            />
          </el-form-item>
          <el-form-item prop="relationStatus" label="关联状态">
            <el-select v-model="queryParams.relationStatus" placeholder="全部" @change="getList">
              <el-option
                v-for="item in relationStatusOps"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="commonTopFilterWrap-search">
        <div class="commonTopFilterWrap-search-container">
          <el-button @click="handleQuery" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
        </div>
      </div>
    </div>

    <el-table
      ref="tableRef"
      class="SWCommonTable"
      v-horizontal-scroll="'always'"
      v-loading="loading"
      show-overflow-tooltip
      :header-cell-style="appStore.headerCellStyle"
      :data="tableData"
      :row-key="(row) => row.specId"
      :height="440"
      @select="handleSelect"
      @select-all="handleSelectAll"
    >
      <el-table-column
        v-for="item in relationTable"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :type="item.type"
        :width="item.width"
      >
        <template v-if="item.prop === 'relationStatus'" #default="{ row }">
          {{ transformRelationStatus(row.relationStatus) }}
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.page"
      v-model:limit="queryParams.pageSize"
      @pagination="handlePageChange"
    />
    <div class="btns">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" @click="onComfire">确定</el-button>
    </div>
  </el-dialog>
</template>
<script lang="ts" setup>
import { getGoodsList } from '@/api/storage/system/goodsClassfication'
import { relationStatusOps, relationTable, transformRelationStatus } from '../../options'
import { useAppStore } from '@/store/modules/app'
import { cloneDeep } from 'lodash-es'
const props = withDefaults(
  defineProps<{
    isShow: boolean
    modleValue: StorageSystem.GoodsClassfication.SpecClassificationRelationVo[]
    modal?: boolean
    customClassificationId: string
    hasRelated?: boolean
    rolesMask?: string
  }>(),
  {
    modleValue: () => [],
    modal: true,
    customClassificationId: '',
    hasRelated: false
  }
)

const emit = defineEmits(['update:is-show', 'refresh', 'update:modle-value', 'update:has-related'])

const appStore = useAppStore()

const queryParams = reactive<StorageSystem.GoodsClassfication.GetGoodsInfoParams>({
  page: 1,
  pageSize: 10,
  relationStatus: 0
})
const total = ref(0)
const tableData = ref<StorageSystem.GoodsClassfication.SpecClassificationRelationVo[]>([])
const selectedRows = ref<StorageSystem.GoodsClassfication.SpecClassificationRelationVo[]>([])
const queryRef = ref()
const loading = ref(true)
const tableRef = ref()

const isShow = computed({
  get: () => {
    return props.isShow
  },
  set: (val) => {
    queryRef.value?.resetFields()
    emit('update:is-show', val)
  }
})

watch(
  () => props.rolesMask,
  (val) => (queryParams.rolesMask = val)
)

watch(isShow, async (val) => {
  if (val) {
    selectedRows.value = props.modleValue
    await handleQuery()
  }
})

// 监听表格数据变化，恢复选中状态
watch(tableData, () => {
  nextTick(() => {
    const currentPageData = tableData.value.slice(
      (queryParams.page! - 1) * queryParams.pageSize!,
      queryParams.page! * queryParams.pageSize!
    )
    currentPageData.forEach((row) => {
      if (selectedRows.value.some((selectedRow) => selectedRow.specId === row.specId)) {
        tableRef.value.toggleRowSelection(row, true)
      }
    })
  })
})

/**
 * 搜索
 */
async function handleQuery() {
  queryParams.page = 1
  await getList()
}

/** 获取列表 */
async function getList() {
  loading.value = true
  try {
    queryParams.rolesMask = props.rolesMask

    console.log(props.rolesMask)

    const res = await getGoodsList(queryParams)
    tableData.value = res.records
    total.value = res.total
  } catch (error) {}
  loading.value = false
}

/** 取消 */
function onCancel() {
  isShow.value = false
}

/** 确定 */
async function onComfire() {
  // 校验当前商家编码是否已被关联
  emit(
    'update:has-related',
    selectedRows.value.some(
      (row) => row.relationStatus === 1 && row.classificationId !== props.customClassificationId
    )
  )
  emit('update:modle-value', cloneDeep(selectedRows.value))
  isShow.value = false
}

/** 页面切换 */
async function handlePageChange() {
  await getList()
  // 恢复当前页的选中状态
  nextTick(() => {
    tableData.value.forEach((row) => {
      if (selectedRows.value.some((selectedRow) => selectedRow.specId === row.specId)) {
        tableRef.value.toggleRowSelection(row, true)
      }
    })
  })
}

/** 单选 */
function handleSelect(_: any, row: StorageSystem.GoodsClassfication.SpecClassificationRelationVo) {
  const currentSelection = tableRef.value.getSelectionRows()
  const isRowSelected = currentSelection.some((item) => item.specId === row.specId)
  if (isRowSelected) {
    selectedRows.value.push(row)
  } else {
    selectedRows.value = selectedRows.value.filter((item) => item.specId !== row.specId)
  }
}

/** 全选 */
function handleSelectAll(
  selection: StorageSystem.GoodsClassfication.SpecClassificationRelationVo[]
) {
  if (selection.length) {
    tableData.value.forEach(
      (tableRow) =>
        !selectedRows.value.some((selectredRow) => selectredRow.specId === tableRow.specId) &&
        selectedRows.value.push(tableRow)
    )
  } else {
    selectedRows.value = selectedRows.value.filter(
      (selectedRow) => !tableData.value.some((tableRow) => tableRow.specId === selectedRow.specId)
    )
  }
}
</script>
<style lang="less" scoped>
.el-divider {
  width: calc(100% + 40px);
  margin-left: -20px;
  margin-top: 0;
  margin-bottom: 16px;
}

:deep(.el-form) {
  .el-input__wrapper,
  .el-select__wrapper {
    width: 200px;
    box-sizing: border-box;
  }

  .el-form-item {
    margin-bottom: 24px;
  }
}

.el-pagination {
  float: none;

  &::before {
    content: '';
    display: block;
    flex: 1;
  }
}

.btns {
  display: flex;
  &::before {
    content: '';
    display: block;
    flex: 1;
  }
}
</style>
<style lang="less">
.relation-dialog {
  padding: 0;

  .el-dialog__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;

    .el-dialog__headerbtn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      position: static;
    }
  }
  .el-dialog__body {
    padding: 0 20px 24px !important;
  }
}
</style>
