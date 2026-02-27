<template>
  <s-w-drawer
    :model-value="modelValue"
    width="600"
    :title="title"
    @closed="handleClosed"
    @open="handleOpen"
  >
    <el-card shadow="never" class="!border-0 rounded-8px">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="title">考核</span>
          <el-button
            v-if="
              (rowData && permissionSet.has('SupplierAssessType:Edit:Add')) ||
              permissionSet.has('SupplierAssessType:Add:Add')
            "
            type="primary"
            @click="handleAddItems"
          >
            <Icon icon="ep:plus" />
            添加考核指标
          </el-button>
        </div>
      </template>

      <el-scrollbar height="100%">
        <el-form ref="formRef" label-width="80" :model="formData" :rules="rules" scroll-to-error>
          <el-card shadow="never">
            <el-form-item label="考核模块" v-model="formData.name" prop="name">
              <el-input
                v-model="formData.name"
                clearable
                maxlength="50"
                show-word-limit
                placeholder="请输入考核模块名称"
              />
            </el-form-item>
            <el-form-item label="负责部门" prop="departmentId">
              <department-tree v-model="formData.departmentId" />
            </el-form-item>
            <el-form-item label="模块总分">{{ sumScore || 0 }}</el-form-item>
          </el-card>

          <el-card
            v-for="(item, index) in formData.items"
            :key="item.itemId"
            shadow="never"
            class="mt-20px"
          >
            <div class="font-600 flex items-center justify-between mb-20px font-size-14px">
              <span>考核指标{{ index + 1 }}</span>
              <el-button
                v-if="
                  permissionSet.has('SupplierAssessType:Edit:Delete') ||
                  (rowData && permissionSet.has('SupplierAssessType:Add:Delete'))
                "
                type="danger"
                link
                :disabled="formData.items?.length === 1"
                @click="handleRemove(index)"
              >
                <Icon icon="ep:delete" />
              </el-button>
            </div>

            <el-form
              :ref="(el) => el && (itemFormRefs[index] = el as FormInstance)"
              label-width="80"
              :model="formData.items?.[index]"
              :rules="itemsRules"
              scroll-to-error
            >
              <el-form-item label="名称" prop="name">
                <el-input
                  clearable
                  maxlength="50"
                  show-word-limit
                  placeholder="请输入名称"
                  v-model="formData.items![index].name"
                />
              </el-form-item>
              <el-form-item label="分数" prop="score">
                <sw-input-number
                  placeholder="请输入分数"
                  v-model="formData.items![index].score"
                  :max="100"
                  :min="1"
                  class="!w-100%"
                />
              </el-form-item>
              <el-form-item label="考核规则" prop="rules">
                <s-text-area
                  v-model="formData.items![index].rules"
                  :rows="5"
                  :maxlength="300"
                  show-word-limit
                  placeholder="请输入考核规则"
                />
              </el-form-item>
            </el-form>
          </el-card>
        </el-form>
      </el-scrollbar>
    </el-card>

    <template #footer>
      <el-button @click="handleClosed">取消</el-button>
      <el-button
        v-if="
          permissionSet.has('SupplierAssessType:Edit:Save') ||
          (rowData && permissionSet.has('SupplierAssessType:Add:Save'))
        "
        type="primary"
        :loading="submitLoading"
        @click="handleSubmit"
        >保存</el-button
      >
    </template>
  </s-w-drawer>
</template>
<script lang="ts" setup>
import STextArea from '@/components/common/input/s-textarea.vue'
import { FormInstance, FormRules } from 'element-plus'
import departmentTree from './departmentTree.vue'
import { addAssessmentTypeApi, getAssessmentTypeByIdApi } from '@/api/supplier/assess'
import { getPermission } from '@/utils'

interface Props {
  modelValue: boolean
  rowData?: any
  assessmentType: string
  sort?: number
}

interface Emit {
  (e: 'update:model-value', value: boolean): void
  (e: 'closed'): void
  (e: 'refresh'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()
const permissionSet = new Set(getPermission())

const formData = ref<Supplier.Assess.AddOrEditRequest>({
  items: [{}]
})
const formRef = ref<FormInstance>()
const rules: FormRules = {
  name: { required: true, message: '请输入模块名称' },
  departmentId: { required: true, message: '请选择部门' }
}
const itemsRules: FormRules = {
  name: {
    required: true,
    validator: (_, value, callback) => {
      switch (true) {
        case !value:
          return callback(new Error('请输入名称'))
        case formData.value.items &&
          formData.value.items.filter((ele) => ele.name === value).length > 1:
          return callback(new Error('名称重复'))
        default:
          return callback()
      }
    }
  },
  score: { required: true, message: '请输入分数' },
  rules: { required: true, message: '请输入考核规则' }
}
const itemFormRefs = ref<FormInstance[]>([])

const title = computed(() => (props.rowData ? `编辑` : '新增'))

const sumScore = computed(() =>
  formData.value.items?.reduce((arr, cur) => arr + (cur.score ?? 0), 0)
)

async function handleOpen() {
  formData.value.assessmentType = props.assessmentType
  formData.value.sort = props.sort

  if (!props.rowData) return

  const res = await getAssessmentTypeByIdApi(props.rowData[0]?.id)

  formData.value = { ...res, items: res?.items?.length ? res.items : [{}] }
}

function handleClosed() {
  emit('update:model-value', false)

  formData.value = { items: [{}] }
  formRef.value?.resetFields()
  itemFormRefs.value.forEach((ele) => ele?.resetFields())
}

async function validateAll() {
  const results = await Promise.all(
    itemFormRefs.value.map(async (ele) => {
      if (!ele) return Promise.reject(false)

      try {
        await ele.validate()
        return true
      } catch (error) {
        return Promise.reject(false)
      }
    })
  )

  return results.every((res) => res)
}

const submitLoading = ref(false)
async function handleSubmit() {
  if (submitLoading.value) return
  try {
    await Promise.all([formRef.value?.validate(), validateAll()])

    submitLoading.value = true
    const res = await addAssessmentTypeApi(formData.value)

    if (res.success) {
      ElMessage.success('保存成功！')
      handleClosed()
      emit('refresh')
    }
  } catch (error) {
  } finally {
    submitLoading.value = false
  }
}

function handleAddItems() {
  formData.value.items?.push({
    sort: Math.max(...formData.value.items.map((ele) => ele.sort ?? 0)) + 1
  })
}

function handleRemove(index: number) {
  formData.value.items?.splice(index, 1)
}
</script>
<style lang="less" scoped>
@import url(../../../index.scss);

:deep(.title) {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333;
  font-weight: 600;

  &::before {
    content: '';
    display: block;
    margin-right: 6px;
    width: 3px;
    height: 10px;
    background-color: #0064ff;
  }
}

:deep(.el-card__header) {
  padding-top: 12px;
  padding-bottom: 12px;
}

:deep(.el-form) {
  .el-card__body {
    background-color: #f4f6fa;
  }
}
</style>
