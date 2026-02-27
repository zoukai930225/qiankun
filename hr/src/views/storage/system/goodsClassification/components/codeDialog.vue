<template>
  <el-dialog
    v-model="isShow"
    title="商家编码"
    width="577px"
    height="470px"
    class="code-dialog"
    :before-close="handleBeforeClose"
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
              @change="handleQuery"
              @keydown.enter="$event.preventDefault()"
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="commonTopFilterWrap-search">
        <div class="commonTopFilterWrap-search-container">
          <el-button @click="onRemove"> 移除 </el-button>
          <el-button type="primary" @click="openRelatonDialog"> 关联 </el-button>
        </div>
      </div>
    </div>

    <el-table-v2
      ref="tableRef"
      class="SWCommonTable mb20px"
      v-horizontal-scroll="'always'"
      v-loading="loading"
      :data="showData"
      :height="400"
      :width="537"
      :columns="optionTable"
      @selection-change="handleSelectChange"
    />

    <div class="btns">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" :loading="saveLoading" :disabled="saveLoading" @click="onSave"
        >保存</el-button
      >
    </div>
  </el-dialog>

  <RelationDialog
    v-model:is-show="isShowRelationDialog"
    v-model:modle-value="tableData"
    v-model:has-related="hasRelated"
    :custom-classification-id="rowData.id"
    :modal="false"
    :roles-mask="rowData.rolesMask"
  />
</template>
<script lang="tsx" setup>
import { getRelations, SaveOrUpdate } from '@/api/storage/system/goodsClassfication'
import { cloneDeep } from 'lodash-es'
import RelationDialog from './relationDialog.vue'
import { deepEqual } from '@/utils/common'
import { CheckboxValueType } from 'element-plus'
import { ElCheckbox } from 'element-plus'
import { FunctionalComponent } from 'vue'

const props = withDefaults(
  defineProps<{
    isShow: boolean
    rowData: StorageSystem.GoodsClassfication.ListItem
  }>(),
  {}
)

const emit = defineEmits(['update:is-show', 'refresh'])

const message = useMessage()

const queryParams = reactive<StorageSystem.GoodsClassfication.GetRelatedParams>({})
const tableData = ref<StorageSystem.GoodsClassfication.SpecClassificationRelationVo[]>([])
const oldData = ref<StorageSystem.GoodsClassfication.SpecClassificationRelationVo[]>([])
const showData = ref<StorageSystem.GoodsClassfication.SpecClassificationRelationVo[]>([])
const selectedRows = ref<StorageSystem.GoodsClassfication.SpecClassificationRelationVo[]>([])
const isShowRelationDialog = ref(false)
const queryRef = ref()
const loading = ref(true)
const tableRef = ref()
const hasRelated = ref(false)
const saveLoading = ref(false)
const isAllSelected = ref(false)

type SelectionCellProps = {
  value: boolean
  intermediate?: boolean
  onChange: (value: CheckboxValueType) => void
}

const SelectionCell: FunctionalComponent<SelectionCellProps> = ({
  value,
  intermediate = false,
  onChange
}) => {
  return <ElCheckbox onChange={onChange} modelValue={value} indeterminate={intermediate} />
}

const optionTable = ref<any[]>([])

const isShow = computed({
  get: () => {
    return props.isShow
  },
  set: (val) => {
    queryRef.value?.resetFields()
    emit('update:is-show', val)
  }
})

watch(isShow, async (val) => {
  if (val) {
    await getList()
    oldData.value = cloneDeep(tableData.value)
  }
})

watch(tableData, (val) => {
  showData.value = cloneDeep(val)
  handleQuery(queryParams.specNo)
})

function createCol() {
  optionTable.value = [
    {
      width: 66,
      key: 'selection',
      cellRenderer: ({ rowData }) => {
        const onChange = (value: CheckboxValueType) => {
          rowData.checked = value

          if (value) {
            selectedRows.value.push(rowData)
          } else {
            selectedRows.value = selectedRows.value.filter((item) => item.specId === rowData.specId)
          }
        }
        return <SelectionCell value={rowData.checked} onChange={onChange} />
      },
      headerCellRenderer: () => {
        const allSelected = showData.value.every((row) => row.checked)
        const containsChecked = showData.value.some((row) => row.checked)
        const onChange = (value: CheckboxValueType) => {
          showData.value = showData.value.map((row) => {
            row.checked = value
            return row
          })
          if (value) {
            selectedRows.value.push(...tableData.value)
          } else {
            selectedRows.value = []
          }
        }

        isAllSelected.value = allSelected
        return (
          <SelectionCell
            value={allSelected}
            intermediate={containsChecked && !allSelected}
            onChange={onChange}
          />
        )
      }
    },
    { dataKey: 'specNo', title: '商家编码', width: 350 },
    { dataKey: 'specName', title: '规格名称', width: 240 },
    { dataKey: 'specCode', title: '规格码', width: 200 }
  ]
}

/**
 * 搜索
 */
async function handleQuery(val) {
  if (val) {
    showData.value = cloneDeep(tableData.value).filter((row) => row.specNo?.includes(val))
  } else {
    showData.value = cloneDeep(tableData.value)
  }
}

/** 获取列表 */
async function getList() {
  loading.value = true
  try {
    queryParams.id = props.rowData.id
    const res = await getRelations(queryParams)
    tableData.value = res
  } catch (error) {}
  loading.value = false
}

/** 取消 */
async function onCancel() {
  if (!deepEqual(oldData.value, tableData.value)) {
    await message.confirm('当前页面数据未保存，确认返回货品分类页面吗？')
  }

  isShow.value = false
}

/** 保存 */
async function onSave() {
  hasRelated.value &&
    (await ElMessageBox.confirm(
      '当前商家编码已关联其他货品分类，继续操作将移除原有关联并关联当前分类，是否继续？',
      '系统提示',
      {
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: true,
        center: true,
        cancelButtonClass: 'cancelbth',
        confirmButtonClass: 'yepbth',
        customClass: 'custom_class_confirm'
      }
    ))

  saveLoading.value = true

  try {
    const specClassificationRelationDto = tableData.value.map((item) => ({
      specId: item.specId
    }))
    const res = await SaveOrUpdate({
      ...props.rowData,
      specClassificationRelationDto
    })
    if (res && res.success) {
      message.success('保存成功')
      oldData.value = cloneDeep(tableData.value)
      emit('refresh')
      isShow.value = false
    }
  } catch (error) {
  } finally {
    saveLoading.value = false
  }
}

/** 打开商家编码关联弹窗 */
function openRelatonDialog() {
  isShowRelationDialog.value = true
}

/**  */
function handleSelectChange(val: StorageSystem.GoodsClassfication.SpecClassificationRelationVo[]) {
  selectedRows.value.push(...val)
  selectedRows.value = Array.from(
    new Map(selectedRows.value.map((item) => [JSON.stringify([item.specId]), item])).values()
  )
}

function onRemove() {
  if (isAllSelected.value) {
    tableData.value = []
  } else {
    tableData.value = tableData.value
      .filter((row) => !selectedRows.value.some((el) => el.specId === row.specId))
      .map((row) => {
        row.checked = false
        return row
      })
  }

  handleQuery(queryParams.specNo)
}

async function handleBeforeClose(done: () => void) {
  if (!deepEqual(oldData.value, tableData.value)) {
    await message.confirm('当前页面数据未保存，确认返回货品分类页面吗？')
  }

  done()
}

onBeforeMount(() => {
  createCol()
})
</script>
<style lang="less" scoped>
.el-divider {
  width: calc(100% + 40px);
  margin-left: -20px;
  margin-top: 0;
  margin-bottom: 16px;
}

:deep(.el-form) {
  .el-form-item {
    margin-bottom: 24px;
  }
  .el-input__wrapper,
  .el-select__wrapper {
    width: 200px;
    box-sizing: border-box;
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
  margin-top: 16px;
  &::before {
    content: '';
    display: block;
    flex: 1;
  }
}
.headerCellStyle {
  display: none;
  background-color: '#F2F6FC';
  color: '#666';
  font-size: '14px';
  font-weight: '400';
  height: '40px';
}

:deep(.el-table-v2__header-cell) {
  --el-table-header-bg-color: #f2f6fc;
  color: '#666';
  height: '40px';

  .el-table-v2__header-cell-text {
    font-size: 14px;
    font-weight: 400;
  }
}
</style>
<style lang="less">
.code-dialog {
  padding: 0;

  .el-dialog__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;

    .el-dialog__headerbtn {
      width: 16px;
      height: 16px;
      position: static;
    }
  }
  .el-dialog__body {
    padding: 0 20px 24px !important;
  }
}
</style>
