<template>
  <el-button class="mr3" type="primary" @click="handleClick">预警配置</el-button>
  <el-dialog
    v-model="isOpenSetOptionsDialog"
    title="预警配置"
    width="650"
    :before-close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      label-width="160px"
      label-position="right"
      :rules="rules"
      inline
    >
      <el-form-item prop="value" label="库存预警销量">
        <el-select v-model="formData.value" placeholder="请选择应满足的销量">
          <el-option
            v-for="item in options"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
        <el-tooltip class="w12" placement="right">
          <el-icon color="#666" size="24" class="ml3"><QuestionFilled /></el-icon>
          <template #content>
            <div class="tip-content">
              成品库存应满足的销量，当成品库存低于选择的销量时，会发出成品库存缺货告警
            </div>
          </template>
        </el-tooltip>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="onComfire">确定</el-button>
      <el-button @click="onCancle">取消</el-button>
    </template>
  </el-dialog>
</template>
<script lang="tsx" setup>
import { getPrewarningOptions, setPrewarningOptions } from '@/api/storage/prewarning'

const isOpenSetOptionsDialog = ref(false)
const formData = ref<StoragePrewarningType.SetPreWarningOptionsParams>({
  code: '',
  company: '',
  companyName: '',
  createdAt: '',
  createdId: '',
  id: '',
  isDeleted: 0,
  name: '',
  type: '',
  updatedAt: '',
  updatedId: '',
  value: ''
})
const options = [
  {
    label: '3天销量',
    value: '3'
  },
  {
    label: '7天销量',
    value: '7'
  }
]
const formRef = ref()
const rules = ref({
  value: [{ required: true, message: '请选择' }]
})
const message = useMessage()

async function onComfire() {
  await formRef.value.validate()
  try {
    const res = await setPrewarningOptions(formData.value)
    if (res.success) {
      message.success('配置成功')
      isOpenSetOptionsDialog.value = false
    }
  } catch (error) {}
}

function onCancle() {
  isOpenSetOptionsDialog.value = false
  formRef.value.resetFields()
}

function handleClose(done: () => void) {
  done()
  formRef.value.resetFields()
}

async function handleClick() {
  getCurrentOp()
  isOpenSetOptionsDialog.value = true
}

/**
 * 获取当前配置
 */
async function getCurrentOp() {
  try {
    const res = await getPrewarningOptions()
    formData.value.value = res.value
  } catch (error) {}
}
</script>

<style scoped lang="less">
:deep(.el-form-item__content) {
  flex-wrap: nowrap;
}
.tip-content {
  width: 160px;
}
</style>
