<!-- 品控、打包使用 -->
<template>
  <div class="drawer-wrapper">
    <el-drawer
      ref="drawerRef"
      v-model="isShow"
      :with-header="false"
      :wrapper-closable="true"
      class="drawer"
      size="597"
      :before-close="handleBeforClose"
    >
      <div>
        <div class="drawerTitle">
          <div>{{ title }}</div>
          <div @click="emit('update:is-show', false)">
            <el-icon>
              <CloseBold />
            </el-icon>
          </div>
        </div>
      </div>
      <el-card shadow="never">
        <div class="content userInfo">
          <el-form label-position="top">
            <el-row :gutter="0">
              <el-col :span="8" class="item">
                <el-form-item label="日期">
                  <el-input class="isDisabled" :value="detail?.dataDate || '--'" readonly />
                </el-form-item>
              </el-col>
              <el-col :span="8" class="item">
                <el-form-item label="姓名">
                  <el-input class="isDisabled" :value="detail?.userName || '--'" readonly />
                </el-form-item>
              </el-col>
              <el-col :span="8" class="item">
                <el-form-item label="班次">
                  <el-select v-model="shiftType" placeholder="请选择班次">
                    <el-option
                      v-for="item in shiftTypeOptions"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>

        <cell
          v-for="(item, index) in infos"
          ref="cellRefs"
          :key="index"
          :data="item"
          :loading="loading"
          :show-detail-btn="false"
          :show-delete-btn="showDeleteBtn && item.rolesMask !== salary.currentRolesMask"
          @on-edit="(val) => handleOpenAddDialog('edit', val)"
          @on-delete="handleDelete"
          @open-dialog="(val) => emit('open-dialog', val)"
          @change="(val) => handleCellChange(val, index)"
        />
      </el-card>

      <template #footer>
        <el-button class="mlauto" @click="drawerRef.handleClose()">取消</el-button>
        <el-button class="ml12px" type="primary" @click="handleOpenAddDialog('add')">
          添加跨组数据
        </el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
      </template>
    </el-drawer>
  </div>

  <AddDialog
    ref="addDialog"
    v-model="isShowAddDialog"
    :type="dialogType"
    :quantity="editQuantity!"
    :roles-mask="addRolesMask"
    :classification-id="editClassificationId"
    :classification-name="editClassificationName"
    :classifications="classifications"
    :is-deleted="isDeleted"
    @comfire="handleUpdate"
    @on-change-roles-mask="handleChangeRolesMask"
  />
</template>
<script setup lang="ts">
import { getWhInspectionSalaryById, updateWhInspectionSalary } from '@/api/storage/salary/examine'
import { deepEqual } from '@/utils/common'
import { getDictLabel, DICT_TYPE, getDictValue, getIntDictOptions } from '@/utils/dict'
import Cell from './cell.vue'
import { cloneDeep } from 'lodash-es'
import { useSalary } from '@/store/modules/storage'

const AddDialog = defineAsyncComponent(() => import('./qualityAddDialog.vue'))

const props = withDefaults(
  defineProps<{
    isShow: boolean
    title: string
    rowData?: StorageSalary.Examien.ListItem
    rolesMask?: string
  }>(),
  {}
)

const message = useMessage()
const salary = useSalary()

const emit = defineEmits(['update:is-show', 'refresh', 'open-dialog'])

const isShowAddDialog = ref(false)
const formData = ref<StorageSalary.Examien.UpdateParams[]>([])
const oldFormData = ref<typeof formData.value>()
const drawerRef = ref()
const formRef = ref()
const loading = ref(false)
const detail = ref<StorageSalary.Examien.Detail>()
const infos = ref<StorageSalary.Examien.CurrentRolesMasks[]>([])
const cellRefs = ref()
const dialogType = ref()
const addRolesMask = ref('')
const editClassificationId = ref('')
const editClassificationName = ref('')
const editQuantity = ref<number>()
const addDialog = ref()
const shiftTypeOptions = getIntDictOptions(DICT_TYPE.SHIFT_TYPE, true)
const shiftType = ref('')
const classifications = ref()
const isDeleted = ref(false)

const isShow = computed({
  get: () => {
    if (props.isShow) getDetail()
    return props.isShow
  },
  set: (val) => {
    emit('update:is-show', val)
  }
})

const showDeleteBtn = computed(
  () =>
    props.rolesMask === getDictValue(DICT_TYPE.ROLES_MASK, '质检员') ||
    props.rolesMask === getDictValue(DICT_TYPE.ROLES_MASK, '售后质检员')
)

watch(
  () => shiftType.value,
  (val) => {
    formData.value.forEach((item) => (item.shiftType = val))
  },
  { immediate: true }
)

function clearForm() {
  formRef.value?.resetFields()
  cellRefs.value?.forEach((item) => {
    item.clearForm()
  })
  shiftType.value = ''
}

/** 关闭前 */
async function handleBeforClose(done: () => void) {
  if (!deepEqual(oldFormData.value, formData.value)) {
    await message.confirm('当前数据还没有保存，关闭后会丢失数据，确定关闭吗？')
  }
  clearForm()
  done()
  emit('update:is-show', false)
}

/** 获取详情 */
async function getDetail() {
  loading.value = true
  await salary.getCurrentClassificationByRolesMask(salary.currentRolesMask)

  try {
    const res = await getWhInspectionSalaryById({
      id: props.rowData?.id || '',
      rolesMask: salary.currentRolesMask || ''
    })
    detail.value = cloneDeep(res)
    infos.value = [
      res.currentRolesMask || { rolesMask: salary.currentRolesMask || '' },
      ...(res.otherRolesMasks || [])
    ]

    // 本组数据分类全量展示
    if (infos.value[0].detailVos) {
      infos.value[0].detailVos?.push(
        ...salary.currentClassification.map((item) => ({
          classificationId: item.code,
          classificationName: item.name,
          rolesMask: salary.currentRolesMask
        }))
      )
    } else {
      infos.value[0].detailVos = salary.currentClassification.map((item) => ({
        classificationId: item.code,
        classificationName: item.name,
        rolesMask: salary.currentRolesMask
      }))
    }
    infos.value[0].detailVos = infos.value[0].detailVos.filter((item, index) => {
      return (
        infos.value[0].detailVos?.findIndex(
          (ele) => ele.classificationId === item.classificationId
        ) === index
      )
    })

    // 跨组数据无分类不展示
    infos.value = infos.value.filter(
      (item, index) => index === 0 || (item.detailVos && item.detailVos.length !== 0)
    )

    shiftType.value = getDictValue(
      DICT_TYPE.SHIFT_TYPE,
      getDictLabel(DICT_TYPE.SHIFT_TYPE, res.shiftType) || '白班'
    )
    formData.value = infos.value.map((item) => {
      return {
        accountingMethod: item?.accountingMethod || '0',
        duration: item?.duration || '0',
        rolesMask: item?.rolesMask || '',
        salaryId: props.rowData?.id || ''
      } as StorageSalary.Examien.UpdateParams
    })

    await nextTick()

    cellRefs.value?.forEach((ele) => {
      ele.updateForm()
    })
  } catch (error) {
  } finally {
    await nextTick()
    oldFormData.value = cloneDeep(formData.value)
    loading.value = false
  }
}

async function onSave() {
  const validateRes: boolean[] = []
  cellRefs.value?.forEach(async (item) => {
    const res = await item.formValidate()
    validateRes.push(res)

    if (validateRes.length === cellRefs.value.length) {
      try {
        const res = await updateWhInspectionSalary(formData.value)
        if (res.success) {
          message.success('保存成功')
          oldFormData.value = cloneDeep(formData.value)
          drawerRef.value.handleClose()
          emit('refresh')
        }
      } catch (error) {}
    }
  })
}

function handleCellChange(val: StorageSalary.Examien.UpdateParams, index: number) {
  formData.value[index] = { ...formData.value[index], ...val }
}

async function handleOpenAddDialog(
  type: 'edit' | 'add',
  item?: StorageSalary.Examien.CurrentRolesMasks | StorageSalary.Examien.DetailVos
) {
  dialogType.value = type

  if (type === 'edit') {
    // 获取分类列表
    addRolesMask.value = item?.rolesMask || ''
    await salary.getCurrentClassificationByRolesMask(addRolesMask.value)
    classifications.value = salary.currentClassification
    editClassificationId.value = item?.classificationId || ''
    editClassificationName.value = item?.classificationName
    editQuantity.value = item?.quantity
    isDeleted.value = !!item?.isDeleted
  } else {
    addRolesMask.value = ''
  }

  isShowAddDialog.value = true
}

async function handleChangeRolesMask(val) {
  await salary.getCurrentClassificationByRolesMask(val)
  // 整合已有的分类
  const currentExitedClassifications: string[] = []
  infos.value.forEach((item) => {
    item.detailVos?.forEach((ele) => {
      ele.classificationId && currentExitedClassifications.push(ele.classificationId)
    })
  })
  // 从当前工种下的分类列表中过滤出已有分类
  classifications.value = salary.currentClassification.filter((item) =>
    currentExitedClassifications.every((ele) => ele !== item.code)
  )

  // 没有分类给提示
  if (classifications.value.length === 0) {
    return message.warning('当前工种的分类已全部添加，请前往“货品分类”重新添加分类后再次进行添加')
  }
}

function handleUpdate(val) {
  dialogType.value === 'add' ? handleAdd(val) : handleEdit(val)
}

function handleAdd(val: { rolesMask: string; classificationId: string; quantity: number }) {
  const addPart = formData.value.find((item) => item.rolesMask === val.rolesMask)

  const isOldData =
    detail.value?.currentRolesMask?.detailVos?.some(
      (ele) => ele.classificationId === val.classificationId
    ) ||
    detail.value?.otherRolesMasks?.some((ele) =>
      ele.detailVos?.some((el) => el.classificationId === val.classificationId)
    )

  const deleteItem = addPart?.deleteSalaryDetailVos?.find(
    (ele) => ele.classificationId === val.classificationId
  )
  const addItem = { ...val, salaryId: addPart?.salaryId || '' }
  if (addPart) {
    if (deleteItem) {
      addPart.deleteSalaryDetailVos = addPart.deleteSalaryDetailVos?.filter(
        (ele) => ele.classificationId !== val.classificationId
      )
    }

    if (isOldData) {
      addPart.updateSalaryDetailVos
        ? addPart.updateSalaryDetailVos.push(addItem)
        : (addPart!.updateSalaryDetailVos = [addItem])
    } else {
      addPart.addSalaryDetailVos
        ? addPart.addSalaryDetailVos.push(addItem)
        : (addPart!.addSalaryDetailVos = [addItem])
    }
  } else {
    addItem.salaryId = props.rowData?.id || ''
    formData.value.push({
      salaryId: props.rowData?.id,
      rolesMask: val.rolesMask,
      addSalaryDetailVos: [addItem],
      shiftType: shiftType.value,
      accountingMethod: '0'
    })
  }

  const addTableItemPart = infos.value.find((item) => item.rolesMask === val.rolesMask)
  if (addTableItemPart) {
    addTableItemPart.detailVos = [{ ...val, canEdit: true }, ...(addTableItemPart.detailVos || [])]
  } else {
    infos.value.push({
      rolesMask: val.rolesMask,
      detailVos: [{ ...val, canEdit: true }],
      accountingMethod: '0'
    })
  }
  isShowAddDialog.value = false
}

function handleEdit(val) {
  const editPart = formData.value.find((item) => item.rolesMask === val.rolesMask)

  // 判断是不是在新增中
  const addItem = editPart?.addSalaryDetailVos?.find(
    (ele) => ele.classificationId === val.classificationId
  )

  if (addItem) {
    addItem.quantity = val.quantity
  } else {
    const editItem = { ...val, salaryId: editPart?.salaryId || '' }
    const isEditTargetInCurrentRolesMask = detail.value?.currentRolesMask?.detailVos?.some(
      (item) => item.classificationId === val.classificationId
    )
    if (editPart) {
      if (!isEditTargetInCurrentRolesMask && editPart.rolesMask === salary.currentRolesMask) {
        editPart.addSalaryDetailVos
          ? editPart.addSalaryDetailVos.push(editItem)
          : (editPart.addSalaryDetailVos = [editItem])
      } else {
        editPart.updateSalaryDetailVos
          ? editPart.updateSalaryDetailVos.push(editItem)
          : (editPart.updateSalaryDetailVos = [editItem])
      }
    } else {
      formData.value.push({
        salaryId: props.rowData?.id,
        rolesMask: val.rolesMask,
        updateSalaryDetailVos: [editItem]
      })
    }
  }

  const editTableItemPart = infos.value.find((item) => item.rolesMask === val.rolesMask)
  if (editTableItemPart) {
    const target = editTableItemPart.detailVos?.find(
      (ele) => ele.classificationId === val.classificationId
    )
    if (target) {
      target.quantity = val.quantity
    }
  }
  isShowAddDialog.value = false
}

function handleDelete(val) {
  const deletePart = formData.value.find((item) => item.rolesMask === val.rolesMask)
  const deleteItem = { ...val, salaryId: deletePart?.salaryId || '' }
  if (deletePart) {
    const addItem = deletePart.addSalaryDetailVos?.find(
      (ele) => ele.classificationId === val.classificationId
    )
    const editItem = deletePart.updateSalaryDetailVos?.find(
      (ele) => ele.classificationId === val.classificationId
    )
    if (addItem) {
      deletePart.addSalaryDetailVos = deletePart?.addSalaryDetailVos?.filter(
        (ele) => ele.classificationId !== addItem.classificationId
      )
    } else if (editItem) {
      deletePart.updateSalaryDetailVos = deletePart?.updateSalaryDetailVos?.filter(
        (ele) => ele.classificationId !== editItem.classificationId
      )
    } else {
      deletePart.deleteSalaryDetailVos
        ? deletePart.deleteSalaryDetailVos.push(deleteItem)
        : (deletePart.deleteSalaryDetailVos = [deleteItem])
    }

    if (deletePart.addSalaryDetailVos?.length === 0) {
      delete deletePart.addSalaryDetailVos
    }
    if (deletePart.updateSalaryDetailVos?.length === 0) {
      delete deletePart.updateSalaryDetailVos
    }
  } else {
    formData.value.push({
      salaryId: props.rowData?.id,
      rolesMask: val.rolesMask,
      deleteSalaryDetailVos: [deleteItem]
    })
  }

  const deleteTablePart = infos.value.find((item) => item.rolesMask === val.rolesMask)
  if (deleteTablePart) {
    deleteTablePart.detailVos = deleteTablePart.detailVos?.filter(
      (ele) => ele.classificationId !== val.classificationId
    )

    if (deleteTablePart.detailVos && deleteTablePart.detailVos.length === 0) {
      infos.value = infos.value.filter(
        (item) => item.rolesMask !== val.rolesMask || val.rolesMask === salary.currentRolesMask
      )
    }
  }
}
</script>

<style lang="less" scoped>
:deep(.el-drawer__body) {
  .el-form {
    .el-form-item__content {
      .el-input__wrapper,
      .el-select__wrapper {
        width: auto;
      }
    }
  }
}

.drawer-wrapper {
  flex: 1;
  overflow: hidden;
  border-radius: 8px;
}

:deep(.el-drawer) {
  min-width: 500px;
  border-top-left-radius: 16px !important;
  border-bottom-left-radius: 16px !important;
  overflow: hidden !important;
}

// 背景
:deep(.el-drawer__body) {
  display: flex;
  flex-direction: column;
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;
  padding-bottom: 0 !important;
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

.drawerContent {
  flex: 1;
  overflow: scroll;
  border: 0;
  font-size: 14px;

  &::-webkit-scrollbar {
    display: none;
  }
}

:deep(.el-card) {
  margin-bottom: 24px;
  padding: 20px;
  border-radius: 8px;
  overflow: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  .el-card__body {
    box-sizing: border-box;
    padding: 0;
  }

  .el-card__header {
    padding: 16px 20px;
  }

  .title {
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 20px;

    &::before {
      content: '';
      display: block;
      width: 3px;
      height: 10px;
      margin-right: 6px;
      background-color: rgb(0, 100, 255);
    }
  }

  .content {
    margin-bottom: 20px;

    .item {
      display: flex;

      .el-form-item {
        flex: 1;
        margin: 0;
        padding: 16px 20px;

        .el-form-item__label {
          margin-bottom: 10px;
          line-height: 20px;
        }

        .isDisabled {
          cursor: text;

          .el-input__wrapper {
            border: none !important;
            box-shadow: none !important;
            background: #e8e9ed8c;

            .el-input__inner {
              color: #333333 !important;

              &::placeholder {
                display: none;
              }
            }
          }
        }
      }
    }
  }
}

.baseInfo {
  min-height: 288px;
}

.postInfo {
  min-height: 211px;
}

.btns {
  :deep(.el-form-item__content) {
    flex-direction: row-reverse;

    .el-button {
      margin-left: 16px;
    }
  }
}

:deep(.el-drawer__footer) {
  padding-bottom: 10px;
  box-shadow: 0px -4px 10px 0px rgba(0, 0, 0, 0.04);
  z-index: 999;
}

:deep(.el-form-item) {
  margin: 2px 0 14px 0;

  .el-form-item__content {
    flex-wrap: nowrap;
  }

  .el-input__inner {
    width: 109px;
  }

  .el-input__suffix {
    width: 20px;
  }
}

.endTimePicker {
  margin-left: 4px;

  :deep(label) {
    display: none;
  }
}

.store {
  display: flex;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.is-disabled),
.disabled {
  color: #cdcdcd !important;
}

.datePickers {
  :deep(.el-input__inner) {
    width: 70px;
  }
}

.footer {
  display: flex;
}

.userInfo {
  background: #f2f6fc;
}
</style>
