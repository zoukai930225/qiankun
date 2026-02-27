<template>
  <s-w-drawer :model-value="modelValue" :title="title" @closed="handleClosed" @open="handleOpen" width="600px">
    <el-card shadow="never" class="!border-0">
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="110px">
        <el-form-item label="类型：" prop="type">
          <el-select-v2 v-model="formData.type" clearable :options="scoreTypeOptions" placeholder="请选择类型" />
        </el-form-item>
        <el-form-item label="名称：" prop="name">
          <el-input v-model="formData.name" placeholder="请输入名称" :maxlength="50" show-word-limit clearable />
        </el-form-item>
        <el-form-item label="分数范围：" prop="score">
          <el-input-number v-model="formData.startScore" :min="1" placeholder="最小分数" @change="handleChangeScoreRange" />
          <span class="ml3 mr3">~</span>
          <el-input-number v-model="formData.endScore" :min="1" placeholder="最大分数" @change="handleChangeScoreRange" />
        </el-form-item>
        <el-form-item label="规则：" prop="rule">
          <s-text-area v-model="formData.rule" :maxlength="200" show-word-limit :rows="5" placeholder="请输入规则" />
        </el-form-item>
      </el-form>
    </el-card>
    <template #footer>
      <el-button @click="handleClosed">取消</el-button>
      <el-button class="mr-10px" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </s-w-drawer>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import * as Assess from '@/api/supplier/assess'
import { FormInstance, FormRules } from 'element-plus'
import { scoreTypeOptions } from '../options'

interface Props {
  modelValue: boolean
  title: string
  rowData?: Supplier.Assess.SupplierScoreChangeRow
}

interface Emit {
  (e: 'update:model-value', value: boolean): void
  (e: 'refresh'): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const formData = ref<Supplier.Assess.SupplierScoreChangeRow>({
  type: '1'
})

const rules: FormRules = {
  type: { required: true, message: '请选择类型' },
  name: { required: true, message: '请输入名称' },
  score: {
    required: true,
    validator: (_, __, callback) => {
      switch (true) {
        case !formData.value.startScore:
          return callback(new Error('请输入最小分数'))
        case !formData.value.endScore:
          return callback(new Error('请输入最大分数'))
        case formData.value.endScore <= formData.value.startScore:
          return callback(new Error('最大分数需大于最小分数'))
        default:
          return callback()
      }
    }
  }
}

const formRef = ref<FormInstance>()

async function handleOpen() {
  if (props.rowData?.id) {
    try {
      const res = await Assess.getSupplierScoreChangeByIdApi(props.rowData?.id)

      if (res) {
        formData.value = res
      }
    } catch (error) { }
  }
}

function handleClosed() {
  emit('update:model-value', false)

  formData.value.startScore = undefined
  formData.value.endScore = undefined
  formRef.value?.resetFields()
}

function handleChangeScoreRange() {
  formRef.value?.validateField('score')
}

const loading = ref(false)
async function handleSubmit() {
  loading.value = true
  try {
    await formRef.value?.validate()
    const res = await Assess[
      props.rowData?.id ? 'editSupplierScoreChangeApi' : 'addSupplierScoreChangeApi'
    ]({ ...props.rowData, ...formData.value })

    if (res.success) {
      loading.value = false
      handleClosed()
      emit('refresh')

      nextTick(() => {
        ElMessage.success(props.rowData?.id ? '编辑成功！' : '新增成功！')
      })
    }
  } catch (error) { }
}
</script>
<style lang="less" scoped>
@import url(../../../index.scss);

:deep(.label-column) {
  background: #f4f6fa;
}
</style>
