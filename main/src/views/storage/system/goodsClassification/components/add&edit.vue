<template>
  <div class="drawer-wrapper">
    <el-drawer
      v-model="isShow"
      class="drawer"
      ref="drawerRef"
      size="936px"
      :with-header="false"
      :wrapper-closable="true"
      :before-close="handleBeforClose"
    >
      <div>
        <div class="drawerTitle">
          <div>{{ DrawerTitle[drawerType!] }}</div>
          <div @click="drawerRef.handleClose">
            <el-icon><CloseBold /></el-icon>
          </div>
        </div>
      </div>
      <el-card shadow="never" class="mb4" v-loading="loading">
        <template #header>
          <div>基本信息</div>
        </template>
        <el-form
          ref="queryFormRef"
          class="mb6px"
          :model="formData"
          :rules="rules"
          label-position="right"
          label-width="88px"
        >
          <el-row :gutter="44">
            <el-col :span="12">
              <el-form-item label="分类:" prop="classificationName">
                <el-input
                  v-model.trim="formData.classificationName"
                  placeholder="请输入分类"
                  clearable
                  @clear="delete formData.classificationName"
                  :maxlength="50"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工种:" prop="rolesMask">
                <el-select
                  v-model="formData.rolesMask"
                  placeholder="请选择工种"
                  clearable
                  @clear="delete formData.rolesMask"
                  @change="handleClearRoles"
                >
                  <el-option
                    v-for="item in rolesMasks"
                    :key="item.code"
                    :value="item.code!"
                    :label="item.rolesMaskName"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="44">
            <el-col :span="12">
              <el-form-item label="白班计价:" prop="dayPricing">
                <el-input
                  v-model.trim="formData.dayPricing"
                  placeholder="请输入白班计价"
                  clearable
                  :maxlength="9"
                  @clear="delete formData.dayPricing"
                  @input="(val) => handleInput(val, 'dayPricing')"
                  @blur="handleBlur('dayPricing')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="夜班计价:" prop="nightPricing">
                <el-input
                  v-model.trim="formData.nightPricing"
                  placeholder="请输入夜班计价"
                  clearable
                  :maxlength="9"
                  @clear="delete formData.nightPricing"
                  @input="(val) => handleInput(val, 'nightPricing')"
                  @blur="handleBlur('nightPricing')"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="44">
            <el-col :span="12">
              <el-form-item label="跨工种价:" prop="crossWorkPricing">
                <el-input
                  v-model.trim="formData.crossWorkPricing"
                  placeholder="请输入跨工种价"
                  clearable
                  :maxlength="9"
                  @clear="delete formData.crossWorkPricing"
                  @input="(val) => handleInput(val, 'crossWorkPricing')"
                  @blur="handleBlur('crossWorkPricing')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="爆款计价:" prop="hotSellPricing">
                <el-input
                  v-model.trim="formData.hotSellPricing"
                  placeholder="请输入爆款计价"
                  clearable
                  :maxlength="9"
                  @clear="delete formData.hotSellPricing"
                  @input="(val) => handleInput(val, 'hotSellPricing')"
                  @blur="handleBlur('hotSellPricing')"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-card shadow="never" v-loading="loading">
        <template #header>
          <div>关联配置</div>
          <div class="btns">
            <el-button @click="onRemove">移除</el-button>
            <el-button type="primary" @click="openRelatonDialog">关联</el-button>
          </div>
        </template>
        <el-table-v2
          v-if="isShow"
          ref="tableRef"
          class="SWCommonTable mb20px"
          v-horizontal-scroll="'always'"
          :data="tableData"
          :height="400"
          :width="856"
          :columns="optionTable"
        />
      </el-card>
      <template #footer>
        <el-button @click="drawerRef.handleClose()">取消</el-button>
        <el-button
          class="ml12px"
          type="primary"
          :loading="saveLoading"
          :disabled="saveLoading"
          @click="onSave"
          >保存</el-button
        >
      </template>
    </el-drawer>
  </div>

  <relation-dialog
    v-model:is-show="isShowRelationDialog"
    v-model:modle-value="tableData"
    :custom-classification-id="rowData.id"
    :roles-mask="formData.rolesMask"
  />
</template>
<script setup lang="tsx">
import { getRolesMasks } from '@/api/storage/system'
import { getGoodsClassficationDetail, SaveOrUpdate } from '@/api/storage/system/goodsClassfication'
import RelationDialog from './relationDialog.vue'
import { cloneDeep } from 'lodash-es'
import { ElMessageBox } from 'element-plus'
import { DrawerTitle } from '../../options'
import { CheckboxValueType } from 'element-plus'
import { ElCheckbox } from 'element-plus'
import { FunctionalComponent } from 'vue'

const props = defineProps<{
  drawerType: 'add' | 'edit'
  rowData: StorageSystem.GoodsClassfication.ListItem
  isShow: boolean
}>()

const emit = defineEmits(['update:is-show', 'refresh'])

const message = useMessage()

const formData = ref<StorageSystem.GoodsClassfication.SaveParams>({})
const rolesMasks = ref<StorageSystem.PersonalManagement.RolesMaskItem[]>([])
const tableData = ref<StorageSystem.GoodsClassfication.SpecClassificationRelationVo[]>([])
const selectedRows = ref<StorageSystem.GoodsClassfication.SpecClassificationRelationVo[]>([])
const loading = ref(false)
const queryFormRef = ref()
const drawerRef = ref()
const oldParams = ref<StorageSystem.GoodsClassfication.SaveParams>({})
const hasRelated = ref(false)
const saveLoading = ref(false)
const isShowRelationDialog = ref(false)
const isAllSelected = ref(false)
const rules = ref({
  classificationName: [{ required: true, message: '请输入分类名称' }],
  crossWorkPricing: [{ required: true, validator }],
  dayPricing: [{ required: true, validator }],
  nightPricing: [{ required: true, validator }],
  rolesMask: [{ required: true, message: '请选择工种' }]
})
const checkBoxRef = ref()
function validator(_: any, val: string, callback: (err?: Error) => void) {
  if (!val) return callback(new Error('请输入整数位不超过4位、小数位不超过4位的数字'))
  if (/^\d{0,4}(\.\d{0,4})?$/.test(val)) {
    callback()
  } else {
    callback(new Error('请输入整数位不超过4位、小数位不超过4位的数字'))
  }
}

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
  return (
    <ElCheckbox
      ref={checkBoxRef}
      onChange={onChange}
      modelValue={value}
      indeterminate={intermediate}
    />
  )
}

const optionTable = ref<any[]>([])

const isShow = computed({
  get: () => props.isShow,
  set: async (val) => {
    !val && emit('update:is-show', val)
  }
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
        const _data = unref(tableData.value)
        const allSelected = _data.every((row) => row.checked)
        const containsChecked = _data.some((row) => row.checked)
        const onChange = (value: CheckboxValueType) => {
          tableData.value = _data.map((row) => {
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

async function getRenderData() {
  loading.value = true
  if (props.drawerType === 'edit') {
    await Promise.all([getBaseInfo(), getRoles()])
  } else {
    await getRoles()
  }
  loading.value = false
  oldParams.value = cloneDeep(formData.value)
  oldParams.value.specClassificationRelationDto = tableData.value.map((item) => ({
    specId: item.specId
  }))
}

/** 获取工种列表 */
async function getRoles() {
  try {
    const res = await getRolesMasks()
    rolesMasks.value = res
  } catch (error) {}
}

/** 获取基本信息 */
async function getBaseInfo() {
  try {
    const res = await getGoodsClassficationDetail(props.rowData.id!)
    tableData.value = cloneDeep(res.specClassificationRelationVos || [])
    console.log(res)

    delete res.specClassificationRelationVos
    formData.value = res
    formData.value.dayPricing = formData.value.dayPricing
      ? `${+formData.value.dayPricing}`
      : formData.value.dayPricing
    formData.value.nightPricing = formData.value.nightPricing
      ? `${+formData.value.nightPricing}`
      : formData.value.nightPricing
    formData.value.crossWorkPricing = formData.value.crossWorkPricing
      ? `${+formData.value.crossWorkPricing}`
      : formData.value.crossWorkPricing
  } catch (error) {}
}

/** 移除 */
function onRemove() {
  if (isAllSelected.value) {
    tableData.value = []
  } else {
    tableData.value = tableData.value
      .filter((row) => !selectedRows.value.some((item) => item.specId === row.specId))
      .map((row) => {
        row.checked = false
        return row
      })
  }
}

/** 打开关联弹窗 */
function openRelatonDialog() {
  queryFormRef.value.validateField('rolesMask', (valid) => {
    valid && (isShowRelationDialog.value = true)
  })
}

/** 弹窗关闭前的回调 */
async function handleBeforClose(done: () => void) {
  if (loading.value) {
    return done()
  }

  if (
    Object.keys(formData.value).some((key) => {
      if (key !== 'specClassificationRelationDto')
        return formData.value[key] !== oldParams.value[key]
      return false
    }) ||
    (() => {
      const tableSpecIds = new Set(tableData.value.map((item) => item.specId))
      return oldParams.value?.specClassificationRelationDto?.some(
        (item) => !tableSpecIds.has(item.specId)
      )
    })() ||
    oldParams.value?.specClassificationRelationDto?.length !== tableData.value.length
  ) {
    await message.confirm('当前页面数据未保存，确认返回货品分类页面吗？')
  }
  queryFormRef.value.resetFields()
  tableData.value = []
  done()
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
    await queryFormRef.value.validate()
    formData.value.specClassificationRelationDto = tableData.value.map((item) => ({
      specId: item.specId
    }))
    if (props.drawerType === 'add') delete formData.value.id
    const res = await SaveOrUpdate(formData.value)
    if (res && res.success) {
      message.success('保存成功')
      oldParams.value = cloneDeep(formData.value)
      emit('refresh')
      drawerRef.value.handleClose()
    }
  } catch (error) {
  } finally {
    saveLoading.value = false
  }
}

function handleClearRoles() {
  tableData.value = []
}

/** 限制输入格式 */
function handleInput(value: string, key: string) {
  // 先移除所有非数字和小数点的字符
  let inputValue = value.replace(/[^\d.]/g, '')
  // 处理多个小数点的情况
  const dotCount = (inputValue.match(/\./g) || []).length
  if (dotCount > 1) {
    inputValue = inputValue.slice(0, inputValue.lastIndexOf('.'))
  }
  // 正则表达式：匹配整数位最多 4 位，小数位最多 4 位的数字
  const regex = /^\d{0,4}(\.\d{0,4})?$/
  if (!regex.test(inputValue)) {
    // 移除不符合规则的字符
    inputValue = inputValue.slice(0, -1)
  }
  formData.value[key] = inputValue
}

function handleBlur(key: string) {
  formData.value[key] = `${formData.value[key] ? +formData.value[key] : ''}`
}

onBeforeMount(() => {
  createCol()
})

defineExpose({ getRenderData })
</script>
<style lang="less" scoped>
:deep(.el-drawer__body) {
  padding-left: 20px;
  padding-right: 20px;
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;
  position: relative;
  box-sizing: border-box;

  .el-card {
    border-radius: 8px;
    font-size: 14px;
    line-height: 20px;
    border: 0;
    & > .el-card__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border: 0;

      & > div {
        display: flex;
        align-items: center;
      }

      & > div:first-of-type::before {
        content: '';
        display: block;
        width: 3px;
        height: 10px;
        margin-right: 5px;
        background-color: rgba(0, 100, 255, 1);
      }
    }

    & > .el-card__body {
      padding: 0 20px;
    }

    .el-form-item {
      margin-bottom: 20px;
    }
  }
}

.drawerTitle {
  font-size: 14px;
  display: flex;
  color: #333333;
  font-weight: 600;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin: 0 0 18px 0;
}

.footer {
  display: flex;
  width: calc(100%);
  margin-left: -20px;
  padding: 10px 20px;
  background-color: #fff;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
}

.totalTime {
  position: relative;
  &.error {
    &::after {
      content: '';
      display: block;
      position: absolute;
      top: 100%;
      left: 110px;
      font-size: 12px;
      color: #f56c6c;
    }
  }
}

.el-input__inner {
  height: 32px;
  line-height: 32px;
}

:deep(.el-input__wrapper) {
  height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

:deep(.el-drawer__footer) {
  padding-bottom: 10px;
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
