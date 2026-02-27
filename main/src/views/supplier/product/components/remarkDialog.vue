<template>
  <el-dialog v-model="isShow" ref="dialogRef" :width="577" :show-close="false" append-to-body @closed="handleClosed">
    <template #header>
      <div class="header">
        <span class="el-dialog__title">备注</span>
        <img src="@/assets/svgs/close.svg" alt="" @click="isShow = false" />
      </div>
    </template>
    <el-divider />
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form ref="queryRef" :model="formData" inline :rules="rules">
          <el-form-item prop="scPrRemarks" label="需求备注">
            <s-text-area v-model.trim="formData.scPrRemarks" :style="{ width: '469px' }" :rows="8" placeholder="请输入需求备注"
              clearable :maxlength="200" show-word-limit />
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="btns">
      <el-button @click="handleCancel">关闭</el-button>
      <el-button type="primary" @click="handleComfire"> 保存 </el-button>
    </div>
  </el-dialog>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { DialogInstance, FormInstance } from 'element-plus'

const props = defineProps<{
  modelValue?: string
}>()

const emit = defineEmits(['update:model-value'])

const isShow = ref(false)
const formData = ref({
  scPrRemarks: ''
})
const queryRef = ref<FormInstance>()
const dialogRef = ref<DialogInstance>()
const rules = {
  scPrRemarks: [
    {
      required: true,
      message: '请输入备注'
    }
  ]
}

async function open() {
  isShow.value = true
  formData.value.scPrRemarks = props.modelValue || ''
}

async function handleCancel() {
  isShow.value = false
}
function handleClosed() {
  queryRef.value?.resetFields()
}
async function handleComfire() {
  emit('update:model-value', formData.value.scPrRemarks)
  isShow.value = false
}

defineExpose({ open })
</script>
<style lang="less" scoped>
.el-divider {
  width: calc(100% + 32px);
  margin-left: -16px;
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

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  img {
    cursor: pointer;
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
