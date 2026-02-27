<template>
  <div class="cell">
    <div class="title">{{ title }}</div>
    <el-form :model="formData" class="content" ref="formDataRef" label-width="120px" :rules="rules">
      <el-form-item label="薪资核算方式" prop="accountingMethod">
        <el-select v-model="formData!.accountingMethod" @change="handleAccountChange">
          <el-option
            v-for="item in salary.accountingMethodOps"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="formData.accountingMethod === '0'" label="产量">
        <div class="item">{{ quantity || '--' }}</div>
      </el-form-item>
      <el-form-item v-else label="时长" prop="duration">
        <div class="duration">
          <el-input
            type="number"
            v-model.trim="formData.duration"
            placeholder="请输入时长"
            clearable
            @clear="formValidate"
          />
          <span>小时</span>
        </div>
      </el-form-item>
      <el-form-item class="mb0" label="分类数据">
        <template #label>
          <span class="ml48px mb0" :style="{ lineHeight: '40px' }">分类数据</span>
        </template>
        <sw-table
          :table-data="data.detailVos || []"
          :options="currentTableOps"
          :loading="loading"
          :showOverFlowTooltip="true"
          empty-size="180px"
        >
          <template #quantity="{ col }">
            <span>{{ col || '--' }}</span>
          </template>
          <template #options="{ row }">
            <el-button
              v-if="showDetailBtn(row)"
              link
              type="primary"
              @click="emit('open-dialog', row)"
            >
              产量明细
            </el-button>
            <div v-else>
              <el-button link type="primary" @click="emit('on-edit', row)">编辑</el-button>
              <el-button
                v-if="showDeleteBtn(row)"
                link
                type="danger"
                @click="emit('on-delete', row)"
              >
                删除
              </el-button>
            </div>
          </template>
        </sw-table>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { useSalary } from '@/store/modules/storage'
import { currentTableOps } from '../options'
import SwTable from './table.vue'
import { getDictLabel, DICT_TYPE, getDictValue } from '@/utils/dict'
import { cloneDeep } from 'lodash-es'
import { FormRules } from 'element-plus'

const props = defineProps<{
  data: StorageSalary.Examien.CurrentRolesMasks
  loading: boolean
}>()

const emit = defineEmits(['open-dialog', 'change', 'on-edit', 'on-delete', 'set-exited'])

const formData = ref<StorageSalary.Examien.UpdateParams>({
  accountingMethod: '0'
})
const oldForm = ref<typeof formData.value>({})
const formDataRef = ref()

const quantity = computed(() => {
  return props.data.detailVos?.reduce((arr, cur) => arr + (Number(cur?.quantity) || 0), 0)
})

const rules: FormRules = {
  accountingMethod: [{ required: true, message: '请选择薪资结算方式' }],
  duration: [
    {
      required: true,
      message: '请输入时长'
    }
  ]
}

watch(formData, (val) => emit('change', val), { deep: true })

const title = computed(() => {
  return `${props.data.rolesMask === salary.currentRolesMask ? '本组数据' : '跨组数据'}（${getDictLabel(DICT_TYPE.ROLES_MASK, props.data.rolesMask)}）`
})

const salary = useSalary()

async function formValidate() {
  await formDataRef.value.validate()
  return true
}

function showDetailBtn(row: StorageSalary.Examien.DetailVos) {
  // 质检员、售后质检员、打包员可以编辑
  if (
    row.rolesMask === getDictValue(DICT_TYPE.ROLES_MASK, '质检员') ||
    row.rolesMask === getDictValue(DICT_TYPE.ROLES_MASK, '售后质检员') ||
    row.rolesMask === getDictValue(DICT_TYPE.ROLES_MASK, '打包员')
  )
    return false
  else return true
}

function showDeleteBtn(row: StorageSalary.Examien.DetailVos) {
  // 打包员不能删除
  if (
    (row.rolesMask === getDictValue(DICT_TYPE.ROLES_MASK, '质检员') ||
      row.rolesMask === getDictValue(DICT_TYPE.ROLES_MASK, '售后质检员')) &&
    row.rolesMask !== salary.currentRolesMask
  )
    return true
  else return false
}

function clearForm() {
  formDataRef.value?.resetFields()
}

function updateForm() {
  formData.value.duration = props.data.duration
  formData.value.accountingMethod = props.data.accountingMethod || '0'

  oldForm.value = cloneDeep(formData.value)
}

function handleAccountChange() {
  formData.value.duration = oldForm.value.duration
}

defineExpose({
  formValidate,
  clearForm,
  updateForm
})
</script>

<style scoped lang="less">
.duration {
  display: flex;
  align-items: center;
  width: 100%;

  & > span {
    width: 2em;
    margin-left: 14px;
    color: #666666;
    white-space: nowrap;
    // flex: 1;
  }
}

.item {
  margin-left: 12px;
}

.mb0 {
  margin-bottom: 0 !important;
}

.content {
  margin-bottom: 16px !important;
}

.cell {
  margin-bottom: 20px;

  &:last-of-type {
    margin-bottom: 0;
  }
}

.title {
  margin-bottom: 16px;
}
</style>
