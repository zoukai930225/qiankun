<template>
  <Audit :table-option="changeAuditTable">
    <template #header>
      <el-button type="primary" :style="{ 'margin-left': 'auto' }" @click="auditLogRef?.open()">
        审核记录
      </el-button>
    </template>
    <template #footer>
      <el-button @click="handleBack">返回</el-button>
      <component :is="easyBtnGroup(AddFooterBtns)" />
    </template>
  </Audit>

  <SWDialog v-model="isShow" title="审核意见" @closed="handleClosed">
    <el-form :model="formData" ref="formRef" :rules="rules">
      <el-form-item prop="auditComment">
        <s-text-area v-model="formData.auditComment" :maxlength="200" :rows="5" show-word-limit />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" :loading="loading" @click="handleSubmit">确定</el-button>
      <el-button @click="isShow = false">取消</el-button>
    </template>
  </SWDialog>

  <auditLogDrawer
    ref="auditLogRef"
    time-key="updatedAt"
    status-key="approveStatus"
    person-key="operatorObj"
    comment-key="approveMsg"
    :desc="descMethod"
    :api="scPoChangeRequestLogApi"
    :is-pass="(status) => status === '10'"
    :is-recall="(status) => status === '30'"
    :is-no-pass="(status) => status === '20'"
    :is-submit="(status) => status === '0'"
  />
</template>
<script lang="tsx" setup>
import STextArea from '@/components/common/input/s-textarea.vue'
import { scPoChangeRequestAuditApi, scPoChangeRequestLogApi } from '@/api/supplier/changeAudit'
import Audit from '../../product/change.vue'
import { FormInstance, FormRules } from 'element-plus'
import auditLogDrawer from '../../appointment/components/auditLogDrawer.vue'
import { changeAuditTable } from '../option'
import { easyBtnGroup } from '../../components/twoFourSix'

defineOptions({
  name: 'PurchaseProductOrderChangeAudit'
})

const router = useRouter()
const route = useRoute()
const message = useMessage()

const formData = reactive({
  auditComment: '',
  auditStatus: ''
})
const isShow = ref(false)
const formRef = ref<FormInstance>()
const rules = computed<FormRules>(() => ({
  auditComment: [{ required: formData.auditStatus === '2', message: '请输入审核意见' }]
}))
const auditLogRef = ref<{ open: () => void }>()

const AddFooterBtns = computed(() => {
  const type = {
    [String(route.query.changeStatus === '10')]: 'Audit',
    [String(route.query.changeStatus === '20')]: 'PlaneAudit'
  }['true']

  return [
    {
      label: '审核不通过',
      onClick: () => handleAudit('2'),
      type: 'danger',
      permission: `SupplierChangeAuditIndex:${type}:NoPass`
    },
    {
      label: '审核通过',
      onClick: () => handleAudit('1'),
      type: 'primary',
      permission: `SupplierChangeAuditIndex:${type}:Pass`
    }
  ]
})

function handleBack() {
  router.push({
    name: 'SupplierChangeAuditIndex'
  })
}

async function handleAudit(auditStatus: '1' | '2') {
  formData.auditStatus = auditStatus
  isShow.value = true
}

const loading = ref(false)
async function handleSubmit() {
  await formRef.value?.validate()
  loading.value = true
  try {
    const res = await scPoChangeRequestAuditApi({
      id: route.params.id as string,
      ...formData,
      changeStatus: route.query.changeStatus as string
    })
    if (res.success) {
      handleBack()
      message.success('审核成功')
      isShow.value = false
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
}

function descMethod(status: any) {
  switch (status) {
    case '10':
      return '审核通过'
    case '20':
      return '审核不通过'
    case '0':
      return '提交审核'
    case '50':
      return '废弃'
    default:
      return ''
  }
}

function handleClosed() {
  formRef.value?.resetFields()
}
</script>
<style lang="less" scoped></style>
