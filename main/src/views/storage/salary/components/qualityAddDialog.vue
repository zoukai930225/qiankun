<template>
  <div>
    <el-dialog
      ref="dialogRef"
      v-model="isShow"
      :width="432"
      :title="title"
      @closed="handleAfterClose"
    >
      <el-divider />

      <el-form ref="formRef" :model="formData" :label-width="100" :rules="rules">
        <el-form-item label="工种" prop="rolesMask">
          <el-select
            v-model="formData.rolesMask"
            :disabled="type === 'edit'"
            @change="handleChangeRolesMask"
            placeholder="请选择工种"
          >
            <el-option
              v-for="item in rolesMaskOps"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" prop="classificationId">
          <el-select
            v-model="formData.classificationId"
            :disabled="type === 'edit' || !formData.rolesMask"
            :placeholder="classificationPlaceHolder"
            clearable
          >
            <el-option
              v-for="item in classifications"
              :key="item.code"
              :value="item.code"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="产量（件）" prop="quantity">
          <el-input
            v-model.number="formData.quantity"
            placeholder="请输入产量"
            clearable
            :disabled="isDeleted"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleComfire">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { useSalary } from '@/store/modules/storage'
import { getDictValue, getIntDictOptions } from '@/utils/dict'
const salary = useSalary()

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    type: 'add' | 'edit'
    rolesMask: string
    classificationId: string
    classificationName?: string
    quantity?: number
    classifications?: any[]
    isDeleted?: boolean
  }>(),
  {
    type: 'add'
  }
)

const emit = defineEmits(['update:model-value', 'comfire', 'on-change-roles-mask'])

const formData = reactive({
  classificationId: '',
  quantity: undefined as number | undefined,
  rolesMask: '',
  classificationName: ''
})
const formRef = ref()
const classificationPlaceHolder = computed(() =>
  !!formData.rolesMask ? '请选择分类' : '请先选择工种'
)

const rolesMaskOps = computed(() => {
  if (props.type === 'add')
    return getIntDictOptions(DICT_TYPE.ROLES_MASK, true).filter(
      (item) =>
        (item.code === getDictValue(DICT_TYPE.ROLES_MASK, '质检员') ||
          item.code === getDictValue(DICT_TYPE.ROLES_MASK, '售后质检员')) &&
        item.code !== salary.currentRolesMask
    )
  else
    return getIntDictOptions(DICT_TYPE.ROLES_MASK, true).filter(
      (item) => item.code === props.rolesMask
    )
})

const isShow = computed({
  get: () => {
    if (props.modelValue) {
      if (props.type === 'add') {
        nextTick(() => {
          formRef.value.resetFields()
        })
      } else {
        nextTick(() => {
          // 不用nextTick数据会初始化，影响重置
          formData.classificationId = props.isDeleted
            ? `${props.classificationName}（已删除）` || ''
            : props.classificationId
          formData.classificationName = props.classificationName || ''
          formData.quantity = props.quantity
          formData.rolesMask = props.rolesMask
        })
      }
    }

    return props.modelValue
  },
  set: (val) => emit('update:model-value', val)
})
const title = computed(() => (props.type === 'add' ? '新增' : '编辑'))
const dialogRef = ref()
const rules = {
  rolesMask: [{ required: true, message: '请选择工种' }],
  classificationId: [{ required: true, message: '请选择分类' }],
  quantity: [{ required: true, message: '请输入产量' }]
}

async function handleComfire() {
  await formRef.value.validate()

  formData.classificationName =
    salary.currentClassification.find((item) => item.code === formData.classificationId)?.name || ''
  emit('comfire', formData)
}

async function handleClose() {
  isShow.value = false
}

function handleAfterClose() {
  nextTick(() => {
    formRef.value?.resetFields()
  })
}

async function handleChangeRolesMask(val) {
  if (props.type === 'edit') return
  emit('on-change-roles-mask', val)
}
</script>

<style lang="less" scoped>
.el-divider {
  width: calc(100% + 32px);
  margin: 0 -16px 16px;
}

:deep(.el-form-item) {
  margin: 0 0 20px;
}

:deep(.el-dialog__footer) {
  padding-top: 10px;
}
</style>
