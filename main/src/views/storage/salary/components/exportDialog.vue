<template>
  <el-dialog v-model="isShow" title="导出" ref="dialogRef" :width="400" :append-to-body="true"
    :before-close="handleBeforeClose">
    <el-divider />
    <el-form :model="formData" ref="formRef" :rules="rules" :label-width="60">
      <el-form-item label="部门:" prop="departmentId">
        <el-cascader ref="departmentRef" v-model="departmentIds" :options="options" :props="salary.departmentProps"
          placeholder="请选择部门" clearable collapse-tags collapse-tags-tooltip />
      </el-form-item>
      <el-form-item label="月份:" prop="dataMonth">
        <el-date-picker type="month" v-model="formData.dataMonth" value-format="YYYY-MM" format="YYYY-MM"
          placeholder="请选择月份" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="exportStatement" :loading="loading" :disabled="loading">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { exportData } from '@/api/storage/salary/statement'
import { useSalary } from '@/store/modules/storage'
import download from '@/utils/download'
import { CascaderOption, FormRules } from 'element-plus'
import { cloneDeep } from 'lodash-es'

const props = defineProps<{
  modelValue: boolean
}>()

const emits = defineEmits(['update:modelValue', 'exportSuccess'])

const salary = useSalary()

const departmentIds = ref<string[]>([])
const formData = ref<Pick<StorageSalary.Statement.GetListParams, 'departmentId' | 'dataMonth'>>({})
const formRef = ref()
const loading = ref(false)
const rules = ref<FormRules>({
  dataMonth: [{ required: true, message: '请选择月份' }],
  departmentId: [
    {
      required: true,
      validator: (_, __, callback) => {
        if (departmentIds.value.length) {
          callback()
        } else {
          callback('请选择部门')
        }
      }
    }
  ]
})
const dialogRef = ref()
const departmentRef = ref()
const options = ref<CascaderOption[]>([])

const isShow = computed({
  get: () => props.modelValue,
  set: (val) => {
    emits('update:modelValue', val)
  }
})

watch(
  departmentIds,
  (val) => {
    formData.value.departmentId = val.join(',')

    if (/ALL/.test(formData.value.departmentId)) {
      options.value = options.value.map((ele) => {
        ele.disabled = ele.id !== 'ALL'
        return ele
      })
      departmentIds.value.length > 1 && (departmentIds.value = ['ALL'])
    } else {
      options.value = options.value.map((ele) => {
        ele.disabled = false
        return ele
      })
    }
  },
  { immediate: true }
)

function handleBeforeClose(done: () => void) {
  isShow.value = false
  formRef.value.resetFields()
  departmentIds.value = []
  done()
}

async function exportStatement() {
  await formRef.value.validate()

  loading.value = true

  try {
    const res = await exportData(formData.value)
    const names: any = departmentRef.value.getCheckedNodes().map((item) => item?.text || '').filter((item: string) => !!item);
    if (res) {
      const fileName = `${names.join('、')} ${formData.value.dataMonth}薪资报表.xlsx`
      download.excel(res, fileName)
      emits('exportSuccess')
      isShow.value = false
    }
  } catch (err) {
  } finally {
    loading.value = false
  }
}

async function handleCancel() {
  formRef.value.resetFields()
  departmentIds.value = []
  isShow.value = false
}

onBeforeMount(async () => {
  if (!salary.departmentOptions.length) {
    await salary.getDepartmentList()
  }

  const res = cloneDeep(salary.departmentOptions)
  res.unshift({ name: '全部', id: 'ALL' })
  options.value = res
})
</script>

<style lang="less" scoped>
.el-divider {
  width: calc(100% + 32px);
  margin: 0 -16px 16px;
}

:deep(.el-dialog) {
  top: 0;
}

:deep(.el-input) {
  width: 287px;
}
</style>
