<template>
  <SWDialog v-if="visible" v-model="visible" :width="width" :title="title" :showTitleLine="true" :showBottomLine="true">
    <el-form ref="formRef" :model="formData" :rules="fromRules" class="mt20px pl4px pr4px" labelPosition="right"
      labelWidth="80">
      <div class="row-center" style="margin-bottom: 20px;">
        <div style="background: #0064FF;width: 3px;height: 10px;margin-right: 6px;"></div>
        <div style="font-weight: 600; color: #333333; ">设计组</div>

      </div>
      <div style="display: flex; flex-wrap: wrap; width: 100%">
        <el-form-item label="设计师" :style="{ width: itemWidth }" prop="designer">
          <SWSelectPeople :isEdit="Number(formData && formData.isSubmitDesign || '') == 1"
            v-model:modelValue="formData['designerList']" :getSearchList="remoteMethodDesigner"
            @save-select-people="saveSelectPeople(formData, 'designer')" />
        </el-form-item>
        <el-form-item label="设计截止时间" :style="{ width: itemWidth }" prop="designPictureDeadline">
          <el-date-picker v-model="formData.designPictureDeadline"
            :disabled="Number(formData && formData.isSubmitDesign || 0) != 1" type="date" placeholder="请选择"
            style="width: 490px" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="版师" :style="{ width: itemWidth }" prop="patternMakerId">
          <SWSelectPeople :isEdit="Number(formData && formData.isSubmitDesign || 0) == 1"
            v-model:modelValue="formData['patternMakerIdList']" :getSearchList="remoteMethodDesigner"
            @save-select-people="saveSelectPeople(formData, 'patternMakerId')" />
        </el-form-item>
      </div>
      <div class="row-center" style="margin-bottom: 20px;margin-top: 10px;">
        <div style="background: #0064FF;width: 3px;height: 10px;margin-right: 6px;"></div>
        <div style="font-weight: 600; color: #333333; ">生产组</div>
      </div>
      <div style="display: flex; flex-wrap: wrap; width: 100%">
        <el-form-item label="供应链开发" :style="{ width: itemWidth }" prop="chosenSupplierStaffId">
          <SWSelectPeople :isEdit="Number(formData && formData.isSubmitSupply || 0) == 1"
            v-model:modelValue="formData['chosenSupplierStaffIdList']"
            :getSearchList="remoteMethodChosenSupplierStaffId"
            @save-select-people="saveSelectPeople(formData, 'chosenSupplierStaffId')" />
        </el-form-item>
        <el-form-item label="工艺师" :style="{ width: itemWidth }" prop="workmanshipId">
          <SWSelectPeople :isEdit="Number(formData && formData.isSubmitSupply || 0) == 1"
            v-model:modelValue="formData['workmanshipIdList']" :getSearchList="remoteMethodChosenSupplierStaffId"
            @save-select-people="saveSelectPeople(formData, 'workmanshipId')" />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <el-button @click="handleClose" class="mt20px mr20px">取消</el-button>
      <el-button v-if="isShowSaveBtn()" type="primary" :loading="loading" @click="saveAction" style="margin-left: -5px;"
        class="mr20px mt20px">提交</el-button>
    </template>
    <ConfirmDialog ref="confirmDialogRef" @confirm="confirmSubmit" :title="'系统提醒'" cancelText="否" confirmText="是"
      content="保存后该任务的对应人员即刻改变！是否确认人员的正确分配？" />
  </SWDialog>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import SWSelectPeople from './SWSelectPeople.vue'
import ConfirmDialog from '@/views/OA/new/product/components/confirmDialog.vue'

import {
  getDistributeInfo,
  saveDistributeInfo
} from '@/api/oa/new/develop'
import * as CommonApi from '@/api/common'
import * as SystemConstantApi from '@/api/system/systemConstant'
const props = defineProps({
  title: {
    type: String,
    default: '人员分配'
  },
  width: {
    type: String,
    default: '600px'
  }
})
const emit = defineEmits(['update:modelValue', 'confirm', 'close'])
const visible = ref(false)

const itemWidth = ref('556px')
const formData = ref({
  isSubmitDesign: 0,
  isSubmitSupply: 0,
  designPictureDeadline: '',
  npBusinessEnterprisePlanId: '',
  designer: '',
  designerList: [],
  patternMakerId: '',
  patternMakerIdList: [],
  chosenSupplierStaffId: '',
  chosenSupplierStaffIdList: [],
  workmanshipId: '',
  workmanshipIdList: []

})

const fromRules = reactive({
  designer: [{ required: true, message: '请选择设计师', trigger: 'blur' }],
  designPictureDeadline: [{ required: true, message: '设计截止时间', trigger: 'blur' }],
  patternMakerId: [{ required: true, message: '请选择版师', trigger: 'blur' }],
  chosenSupplierStaffId: [{ required: true, message: '请选择供应链开发', trigger: 'blur' }],
  // workmanshipId: [{ required: true, message: '请选择工艺师', trigger: 'blur' }],
})
// 打开
const open = async (row: any) => {
  visible.value = true
  const res = await getDistributeInfo(row.id)
  formData.value = res
  formData.value.designerList = formData.value.designerList || []
  formData.value.patternMakerIdList = formData.value.patternMakerIdList || []
  formData.value.chosenSupplierStaffIdList = formData.value.chosenSupplierStaffIdList || []
  formData.value.workmanshipIdList = formData.value.workmanshipIdList || []
}

const isShowSaveBtn = () => {
  if (Number(formData.value.isSubmitDesign || '') == 1 || Number(formData.value.isSubmitSupply || '') == 1) {
    return true
  }
  return false
}

const designerOpenIds = ref('')
// 获取设计师/买手-产研部门
const remoteMethodDesigner = async (value) => {
  if (!designerOpenIds.value) {
    designerOpenIds.value = await SystemConstantApi.getSystemConstantConfigbyCode(
      'NEW_PRODUCT_DEPT_DEVELOP'
    ).catch((e) => { })
  }

  const data = await CommonApi.getPersonByOpenId(designerOpenIds.value).catch(() => { })
  return data || []
}

const chosenSupplierStaffIdOpenIds = ref('')

// 选供专员
const remoteMethodChosenSupplierStaffId = async (value) => {
  if (!chosenSupplierStaffIdOpenIds.value) {
    chosenSupplierStaffIdOpenIds.value = await SystemConstantApi.getSystemConstantConfigbyCode(
      'NEW_PRODUCT_DEPT_SUPPLY'
    ).catch((e) => { })
  }

  const data = await CommonApi.getPersonByOpenId(chosenSupplierStaffIdOpenIds.value).catch(() => { })
  return data || []
}

const saveSelectPeople = async (row, fieldCode) => {
  row.editeCode = undefined
  row[`${fieldCode}`] =
    (row[`${fieldCode}List`] && row[`${fieldCode}List`].map((item) => item.userId).join(',')) ||
    undefined
}
const formRef = ref()
const confirmDialogRef = ref()
const saveAction = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  confirmDialogRef.value?.open()
}

const loading = ref(false)
const confirmSubmit = async () => {
  loading.value = true
  try {
    await saveDistributeInfo(formData.value)
    loading.value = false
    emit('confirm')
    visible.value = false
  } finally {
    loading.value = false
  }
}

defineExpose({ open })

onMounted(() => { })

const handleClose = () => {
  // 将visible的值设置为false
  visible.value = false
  // 触发close事件
  emit('close')
}
</script>

<style lang="scss" scoped>
:deep(.el-form-item--default .el-form-item__label) {
  line-height: 20px;
  text-align: right;
  display: flex;
  align-items: center;
  padding-left: 0px;
  font-size: 14px;
  text-align: right;
  color: #666666;
}

:deep(.el-form-item.is-required:not(.is-no-asterisk).asterisk-left>.el-form-item__label:before) {
  margin-right: 0px;
}

.imgList {
  display: flex;
  flex-wrap: wrap;

  .img {
    margin-right: 10px;
  }
}

.fileList {
  .fileLink {
    display: flex;
    align-items: center;

    img {
      margin-right: 4px;
    }

    &:hover {
      color: #0064ff;
      cursor: pointer;
    }
  }
}
</style>
