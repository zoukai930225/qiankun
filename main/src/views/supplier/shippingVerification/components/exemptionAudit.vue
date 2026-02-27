<template>
  <el-form
    ref="formRef"
    :model="formData"
    label-width="90px"
    v-loading="loading"
    :rules="rules"
    hide-required-asterisk
  >
    <el-card header="申请信息" shadow="never" class="!border-0 !rounded-16px mb-20px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="申请人">
            <el-input :model-value="applyInfo.creatorInfo?.name" disabled placeholder="--">
              <template #prefix>
                <el-avatar :src="applyInfo.creatorInfo?.avatarOrigin" :size="16" />
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请时间">
            <el-date-picker
              :model-value="applyInfo.createdAt"
              value-format="YYYY-MM-DD HH:mm:ss"
              format="YYYY-MM-DD HH:mm:ss"
              type="datetime"
              disabled
              placeholder="--"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="申请原因">
            <s-textarea :model-value="applyInfo.reason" :rows="5" placeholder="--" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="附件">
            <files-upload v-model:model-value="applyInfo.file" disabled :url="applyInfo?.file" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-card>

    <el-card
      v-if="type === 1 || (type === 2 && reviewInfo)"
      header="审核信息"
      shadow="never"
      class="!border-0 !rounded-16px"
    >
      <el-row v-if="type === 2">
        <el-col :span="8">
          <el-form-item label="审核人">
            <el-input :model-value="reviewInfo?.reviewer?.name" disabled placeholder="--">
              <template #prefix>
                <el-avatar :src="reviewInfo?.reviewer?.avatarOrigin" :size="16" />
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="审核时间">
            <el-date-picker
              :model-value="reviewInfo?.reviewTime"
              value-format="YYYY-MM-DD HH:mm:ss"
              format="YYYY-MM-DD HH:mm:ss"
              type="datetime"
              disabled
              placeholder="--"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="审核结果">
            <el-select :model-value="reviewInfo?.result" disabled>
              <el-option value="1" label="通过" />
              <el-option value="2" label="不通过" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="16">
          <el-form-item label="审核备注" prop="remark">
            <s-textarea
              v-model="formData.remark"
              :rows="5"
              :disabled="type === 2"
              placeholder="请输入审核备注"
            />
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="附件" prop="file">
            <files-upload v-model="formData.file" :url="formData.url" :disabled="type === 2" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-card>
  </el-form>
</template>
<script lang="ts" setup>
import {
  auditExemptionApplicationApi,
  getExemptionDetailApi
} from '@/api/supplier/shippingVerification'
import FilesUpload from '@/views/supplier/product/components/changePageUpload.vue'
import { FormInstance, FormRules } from 'element-plus'

const message = useMessage()

const props = defineProps<{ id: string; type: number }>()
const emit = defineEmits<{
  (e: 'back'): void
}>()

const formData = ref<any>({
  applyInfo: {}
})
const applyInfo = ref<any>({})
const reviewInfo = ref<any>({})
const formRef = ref<FormInstance>()
const loading = ref(false)
async function getDetail() {
  loading.value = true
  try {
    const params: { id?: string; poId?: string } = {}
    params[props.type === 1 ? 'poId' : 'id'] = props.id
    const res = await getExemptionDetailApi(params)
    if (!res) return
    applyInfo.value = res.applyInfo
    reviewInfo.value = res.reviewInfo
    formData.value = { ...res.reviewInfo, id: res.applyInfo.id }
  } catch (error) {
  } finally {
    loading.value = false
  }
}
const rules = computed<FormRules>(() => ({
  remark: { required: formData.value.result === '2', message: '请输入审核备注！' }
}))

const footerBtns = computed(() => {
  return [
    {
      label: '审核通过',
      onClick: () => handleAudit('1'),
      type: 'primary',
      page: props.type === 1,
      permission: 'ShippingVerification:ExemptionAudit:Pass'
    },
    {
      label: '审核不通过',
      onClick: () => handleAudit('2'),
      type: 'danger',
      page: props.type === 1,
      permission: 'ShippingVerification:ExemptionAudit:NoPass'
    }
  ]
})

async function handleAudit(result: '1' | '2') {
  formData.value.result = result
  await nextTick()
  if (result === '2' && !formData.value.remark) await formRef.value?.validate()
  const auditLoading = ElLoading.service({
    text: '免检审核中...'
  })

  try {
    const res = await auditExemptionApplicationApi({
      ...props,
      ...formData.value,
      result
    })

    if (res && res.success) {
      message.success('免检审核成功！')
      formRef.value?.resetFields()
      formData.value = {}
      emit('back')
    }
  } catch (error: any) {
    console.log('免检审核失败：', error?.message)
  } finally {
    delete formData.value.result
    auditLoading.close()
  }
}

defineExpose({ getDetail, footerBtns })
</script>
<style lang="less" scoped>
@import url(../../index.scss);
</style>
