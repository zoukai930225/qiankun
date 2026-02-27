<template>
  <SWDialog
    v-if="visible"
    v-model="visible"
    width="600"
    title="添加规格"
    :showTitleLine="true"
    :showBottomLine="true"
    @close="handleClose"
    align-center
  >
    <div class="dialog-content">
      <el-form
        ref="formRef"
        :model="form"
        label-width="auto"
        style="margin-left: 15px; margin-right: 15px"
        :rules="rules"
      >
        <el-form-item label="规格名称" prop="spec">
          <el-input style="border: none" v-model="form.spec" placeholder="请输入" />
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" plain @click="submit(0)">保存</el-button>
        <el-button type="primary" @click="submit(1)">再次提交</el-button>
      </div>
    </template>
  </SWDialog>
</template>

<script lang="ts" setup>
// const props = defineProps({
//   specNameCode: {
//     type: String,
//     default: ''
//   }
// })
const formRef = ref()
const form = ref({
  spec: undefined
})
const visible = ref(false)
const rules = ref({
  spec: [{ required: true, message: '请输入规格名称', trigger: 'blur' }]
})

const handleClose = () => {
  visible.value = false
}

const emits = defineEmits(['save'])
const submit = (flag = 0) => {
  formRef?.value?.validate((valid: boolean) => {
    if (valid) {
      if (flag === 0) {
        // 保存
        emits('save', form.value.spec)
        handleClose()
      } else {
        emits('save', form.value.spec)
        // 再次提交
        form.value = {
          spec: undefined
        }
        formRef?.value?.clearValidate()
      }
    }
  })
}

const openDialog = () => {
  visible.value = true
  form.value = {
    spec: undefined
  }
  nextTick(() => {
    formRef?.value?.clearValidate()
  })
}

defineExpose({ openDialog })
</script>

<style scoped lang="scss">
.dialog-content {
  margin-top: 20px;
  .item {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 10px;
    margin-bottom: 10px;
    height: 32px;
    background: rgba(0, 100, 255, 0.1);
    border-radius: 4px;
    border: 1px solid #0064ff;

    .item-add {
      margin-left: 12px;
      margin-right: -2px;
      width: 8px;
      height: 8px;
    }

    .item-text {
      padding-left: 10px;
      padding-right: 10px;
      height: 32px;
      line-height: 32px;
      font-size: 14px;
      color: #0064ff;
    }

    .item-text1 {
      color: #333333;
    }

    .item-textDisable {
      color: #333333;
    }

    .item-close {
      margin-left: -4px;
      margin-right: 12px;
      width: 8px;
      height: 8px;
      cursor: pointer;
    }
  }

  .item1 {
    background: #ffffff;
    border: 1px dashed #d9d9d9;
    cursor: pointer;
  }
}

:deep(.el-dialog) {
  border-radius: 20px;
}

.dialogBg {
  position: absolute;
  top: -16px;
  left: -15px;
  width: 470px;
  height: 344px;
  z-index: -1;
}

.dialog-footer {
  margin-top: 10px;
  margin-right: 20px;
  text-align: right;
}

.my-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  .shenhe-title {
    width: 14px;
    height: 14px;
    margin-right: 20px;
  }
}

.inputBg {
  width: 250px;
  height: 32px;
  // background: #f8f8f9;
  border-radius: 4px;
}

:deep(.el-input__wrapper) {
  // background: #f8f8f9;
  border-radius: 4px;
}

:deep(.el-input) {
  border: none;
}

:deep(.el-select__wrapper) {
  height: 32px;
  font-size: 14px;
  color: #333333;
  // background: #f8f8f9;
  box-shadow: none;
  line-height: 22px;
  border-radius: 4px;
  padding-left: 20px;
}

:deep(.el-select__placeholder) {
  width: 95px;
  font-size: 14px;
  color: #333;
  line-height: 22px;
}

:deep(.el-input__wrapper) {
  border-radius: 4px;
}

// :deep(.el-input__wrapper) {
//   box-shadow: none;
//   background: #f8f8f9;
//   border-radius: 4px;
// }
</style>
