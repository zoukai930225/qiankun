<template>
  <s-w-drawer :model-value="modelValue" :title="title" @closed="handleClosed" @open="handleOpen" width="600px">
    <el-card shadow="never" class="!border-0">
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="110px">
        <el-form-item label="供应商等级：" prop="grade">
          <el-input v-model="formData.grade" :maxlength="10" placeholder="请输入供应商等级" show-word-limit />
        </el-form-item>
        <el-form-item label="分数规则：" prop="scoreRule">
          <s-text-area v-model="scoreRule" placeholder="请输入分数规则" clearable />
          <div class="mt1 lh-5" v-for="item in getDictOptions(DICT_TYPE.SUPPLIER_GRADE_SCORE_RULE)" :key="item.value">
            <el-button link type="primary" plain @click="setScoreRule(item.value)" @keydown.prevent>{{ item.label
              }}</el-button>
          </div>
        </el-form-item>
        <el-form-item label="后续计划：" prop="followUpPlan">
          <s-text-area :rows="5" v-model="formData.followUpPlan" placeholder="请输入后续计划" :maxlength="200" show-word-limit
            clearable />
        </el-form-item>
        <el-form-item label="处理方案：" prop="handlingScheme">
          <el-checkbox-group v-model="handlingScheme">
            <el-descriptions border :column="1" label-width="135">
              <el-descriptions-item v-for="item in handlingSchemeTableData" :key="item.value" :label="item.label"
                label-class-name="descriptions-label">
                <el-checkbox class="ml-50px" :value="item.value" />
              </el-descriptions-item>
            </el-descriptions>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </el-card>
    <template #footer>
      <el-button @click="handleClosed">取消</el-button>
      <el-button class="mr-10px" :loading="loading" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </s-w-drawer>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { FormInstance, FormRules } from 'element-plus'
import { handlingSchemeTable } from '../options'
import { getDictOptions, DICT_TYPE, getDictLabel, getDictValue } from '@/utils/dict'
import * as Assess from '@/api/supplier/assess'
import { ElDescriptions, ElDescriptionsItem } from 'element-plus'

interface Props {
  modelValue: boolean
  title: string
  rowData?: Supplier.Assess.SupplierGrade
}

interface Emit {
  (e: 'update:model-value', value: boolean): void
  (e: 'refresh'): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const formData = reactive({
  grade: '',
  scoreRule: '',
  followUpPlan: '',
  handlingScheme: ''
})
const rules: FormRules = {
  grade: { required: true, message: '请输入供应商等级' },
  scoreRule: { required: true, message: '请输入分数规则' }
}
const handlingSchemeTableData = reactive(getDictOptions(DICT_TYPE.SUPPLIER_GRADE_HANDLING_SCHEME))
const scoreRule = ref('')
const loading = ref(false)

const formRef = ref<FormInstance>()
const handlingSchemeRef = ref()

const handlingScheme = computed({
  get: () => formData.handlingScheme.split(','),
  set: (val) => {
    formData.handlingScheme = val && val.length ? val.join(',') : ''
  }
})

watch(
  () => formData.handlingScheme,
  (value) => {
    const valueArr = value.split(',')
    handlingSchemeTableData.forEach((row: any) => {
      nextTick(() => {
        handlingSchemeRef.value?.toggleRowSelection(row, valueArr.includes(row.value))
      })
    })
  }
)

watch(scoreRule, (val) => {
  formData.scoreRule = val
    .split(' ')
    .filter((ele) => ele.trim() !== '')
    .map((ele) => getDictValue(DICT_TYPE.SUPPLIER_GRADE_SCORE_RULE, ele) || ele)
    .join(' ')
    .trim()
    .replace(/\s+/g, ' ')
})

function setScoreRule(value) {
  scoreRule.value =
    [...scoreRule.value?.split(' '), getDictLabel(DICT_TYPE.SUPPLIER_GRADE_SCORE_RULE, value)]
      .join(' ')
      .replace(/^\s/, '') + ' '
}

async function handleOpen() {
  if (!props.rowData?.id) return
  const res = await Assess.getsupplierGradeByIdApi(props.rowData?.id)
  Object.assign(formData, res)

  const scoreRuleArr = res.scoreRule?.split(' ')
  scoreRule.value =
    scoreRuleArr
      ?.map((ele) => getDictLabel(DICT_TYPE.SUPPLIER_GRADE_SCORE_RULE, ele) || ele)
      .join(' ') + ' '
}

function handleClosed() {
  emit('update:model-value', false)

  formRef.value?.resetFields()
  handlingSchemeRef.value?.clearValidate()
  handlingSchemeTable.forEach((row) => {
    handlingSchemeRef.value?.toggleRowSelection(row, false)
  })
  scoreRule.value = ''
}

async function handleSubmit() {
  loading.value = true
  try {
    const res = await Assess[props.rowData?.id ? 'editSupplierGradeApi' : 'addSupplierGradeApi']({
      ...props.rowData,
      ...formData
    })

    if (res.success) {
      handleClosed()
      emit('refresh')
      nextTick(() => {
        ElMessage.success(props.rowData ? '编辑成功！' : '新增成功！')
      })
      loading.value = false
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
}
</script>
<style lang="less" scoped>
@import url(../../../index.scss);

:deep(.label-column) {
  background: #f4f6fa;
}

:deep(.el-descriptions),
:deep(.el-checkbox-group) {
  width: 100%;
}

:deep(.descriptions-label) {
  font-weight: normal !important;
  background-color: #f4f6fa !important;
}
</style>
