<template>
  <s-w-dialog
    :model-value="modelValue"
    :title="title"
    width="477"
    @open="handleOpen"
    @closed="handleClosed"
  >
    <el-form
      :model="formData"
      ref="formRef"
      label-width="60"
      :rules="rules"
      :validate-on-rule-change="false"
    >
      <el-form-item prop="type" label="类型">
        <el-select
          v-model="formData.type"
          placeholder="请选择类型"
          clearable
          @change="handleChangeType"
        >
          <el-option :value="1" label="加分项" />
          <el-option :value="2" label="减分项" />
        </el-select>
      </el-form-item>
      <el-form-item prop="name" label="名称">
        <scroll-select
          ref="selectNameRef"
          v-model:model-value="formData.name"
          :api="supplierScoreChangeApi"
          item-label-key="name"
          item-value-key="name"
          select-key="name"
          :multiple="false"
          :other-params="{
            type: formData.type
          }"
          :default-label="formData.name"
          @change="handleChangeName"
        >
          <template #label="{ label, selectItem }">
            <div class="flex justify-between items-center">
              <span>{{ label }}</span>
              <span class="font-size-14px color-#999 ml-auto">
                <span class="mr-16px">最小分值：{{ selectItem?.startScore }}分</span>
                <span>最大分值：{{ selectItem?.endScore }}分</span>
              </span>
            </div>
          </template>
        </scroll-select>
      </el-form-item>
      <el-form-item prop="score" label="分值">
        <!-- <el-input v-model.trim="formData.score" placeholder="请输入分值" clearable /> -->

        <sw-input-number
          v-model="formData.score"
          placeholder="请输入分值"
          clearable
          :isDecimal="false"
        />
      </el-form-item>
      <el-form-item prop="comment" label="备注">
        <s-text-area
          v-model.trim="formData.comment"
          :rows="5"
          :maxlength="200"
          show-word-limit
          placeholder="请输入分值"
          clearable
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div>
        <el-button @click="handleClosed">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </template>
  </s-w-dialog>
</template>
<script lang="ts" setup>
import STextArea from '@/components/common/input/s-textarea.vue'
import { supplierScoreChangeApi, updateQuizExtraScoreApi } from '@/api/supplier/assess'
import { FormInstance, FormRules } from 'element-plus'

interface Props {
  modelValue: boolean
  rowData?: Supplier.Assess.SupplierAssessmentQuizVo
  title: string
  quizId: string
}

interface Emit {
  (e: 'update:model-value', value: boolean): void
  (e: 'update:row-data', value: any): void
  (e: 'refresh'): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const message = useMessage()

const formData = ref<Supplier.Assess.SupplierAssessmentQuizExtraScore>({})
const formRef = ref<FormInstance>()
const rules = ref<FormRules>({
  type: [{ required: true, message: '请选择类型' }],
  name: [{ required: true, message: '请输入名称' }],
  score: [{ required: true }]
})
const selectNameRef = ref<{ selectItem: any }>()

const scoreRange = computed(() => {
  if (!selectNameRef.value?.selectItem) return [0, 0]

  const { startScore, endScore } = selectNameRef.value?.selectItem
  return [startScore, endScore]
})

watch(
  () => selectNameRef.value?.selectItem,
  (val) => (formData.value.rule = val.rule)
)

function handleClosed() {
  emit('update:model-value', false)
  emit('update:row-data', {})
  formRef.value?.resetFields()

  delete rules.value.score![0].validator
}

function handleChangeType() {
  formData.value.name = undefined
  formData.value.score = undefined
}

function handleChangeName(_, selectItem) {
  console.log(selectItem)

  formData.value.score = undefined
}

function handleOpen() {
  formData.value = { ...props.rowData }
  nextTick(() => {
    rules.value.score![0].validator = (_, val, callback) => {
      console.log(val)

      if (!val) return callback(new Error('请输入分值'))

      const maxScore = Math.max(...scoreRange.value)
      const minScore = Math.min(...scoreRange.value)

      if (Number(val) > maxScore || Number(val) < minScore)
        return callback(new Error(`请输入大于等于 ${minScore} 且小于等于 ${maxScore} 的数字`))
      else return callback()
    }
  })
}

async function handleSubmit() {
  try {
    const res = await updateQuizExtraScoreApi({
      ...formData.value,
      quizId: props.quizId,
      id: props.rowData?.id
    })

    if (res.success) {
      message.success(formData.value.id ? '编辑分值成功' : '添加分值成功')
      emit('refresh')
      handleClosed()
    }
  } catch (error) {}
}
</script>
<style lang="less" scoped>
@import url(../../../index.scss);

:deep(.el-form-item__content) {
  & > div {
    flex: 1;
  }
}

:deep(.el-input-number) {
  width: 100%;
}
</style>
