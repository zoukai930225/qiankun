<template>
  <el-form :label-width="110" ref="formRef" :rules="rules" :model="dataValue" inline class="form_body"
    :disabled="disabled">
    <el-form-item label="内容排期" prop="contentExpectedDate" class="half">
      <el-date-picker v-model="dataValue.contentExpectedDate" type="date" style="width: 100%" value-format="YYYY-MM-DD"
        :disabled="disabledDetails" @change="valueChange" />
    </el-form-item>
    <el-form-item label="主评卖点" prop="commentSalePoint" class="half" v-if="type !== 'grab_10'">
      <el-input v-model="dataValue.commentSalePoint" :disabled="disabledDetails" @change="valueChange" />
    </el-form-item>

    <div class="image-wrapper" v-if="type !== 'grab_10'">
      <div class="actions">
        <el-form>
          <el-button :disabled="false" class="copy-btn" plain @click="copyMainComment">
            <img :src="copySvg" alt="" class="copy-icon" />
            主评文案复制
          </el-button>
        </el-form>
      </div>
      <el-form-item label="主评文案" prop="mainComment" class="all" v-if="type !== 'grab_10'">
        <s-text-area v-model="dataValue.mainComment" :rows="3" :maxlength="300" :disabled="disabledDetails"
          @change="valueChange" />
      </el-form-item>
    </div>
    <el-form-item label="主评图片" prop="mainCommentLinks" class="all" v-if="type !== 'grab_10'">
      <Upload v-model:modelValue="dataValue.mainCommentLinks" :disabled="disabledDetails" @change="fileChange"
        :business-code="'SUPPLEMENT_ORDER'" :only-upload-img="false" :multiple="true" :limit="5" />
    </el-form-item>

    <div class="image-wrapper" v-if="type !== 'grab_10'">
      <div class="actions">
        <el-form>
          <el-button :disabled="false" class="copy-btn" plain @click="copyFollowupComment">
            <img :src="copySvg" alt="" class="copy-icon" />
            追评文案复制
          </el-button>
        </el-form>
      </div>
      <el-form-item label="追评文案" prop="followupComment" class="all" v-if="type !== 'grab_10'">
        <s-text-area v-model="dataValue.followupComment" :rows="3" :maxlength="300" :disabled="disabledDetails"
          @change="valueChange" />
      </el-form-item>
    </div>
    <el-form-item label="追评图片" prop="followupCommentLinks" class="all" v-if="type !== 'grab_10'">
      <Upload v-model:modelValue="dataValue.followupCommentLinks" :disabled="disabledDetails" @change="fileChange"
        :business-code="'SUPPLEMENT_ORDER'" :only-upload-img="false" :multiple="true" :limit="5" />
    </el-form-item>
    <el-form-item label="对接完成情况" prop="contentStatus" class="half" v-if="type !== 'grab_10'">
      <el-select v-model="dataValue.contentStatus" :disabled="disabledDetails" @change="valueChange">
        <el-option label="未对接" :value="0" />
        <el-option label="已对接" :value="1" />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script lang="tsx">
export default { name: 'TransactionOrderDetailComment' }
</script>

<script lang="tsx" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { useUserStore } from '@/store/modules/user'
import { DetailProvideType } from './type'
import { setImageInfo } from '@/utils'
import { ElMessage } from 'element-plus'
import copySvg from '@/assets/svgs/newMedia/copy.svg'
import { copyText } from '@/utils/copyText'
import { UploadBatch as Upload } from '@/components/UploadFile'

const { dataValue, type, updetaValue } = inject('transaction_order_details') as DetailProvideType

const userStore = useUserStore()

const rules = computed(() => ({
  contentExpectedDate: [
    { required: true, message: '请选择期内容排期', trigger: ['blur', 'change'] }
  ],
  commentSalePoint: [{ required: true, message: '请输入主评卖点', trigger: ['blur', 'change'] }],
  mainComment: [{ required: true, message: '请输入主评文案', trigger: ['blur', 'change'] }],
  mainCommentLinks: [{ required: true, message: '请上传主评图片', trigger: ['blur', 'change'] }],
  followupComment: [{ required: true, message: '请输入追评文案', trigger: ['blur', 'change'] }],
  followupCommentLinks: [
    { required: true, message: '请上传追评图片', trigger: ['blur', 'change'] }
  ],
  contentStatus: [{ required: true, message: '请选择评论完成情况', trigger: ['blur', 'change'] }]
}))

const formRef = ref()

const disabled = computed(
  () =>
    ((userStore.user as any)?.id || '') !== dataValue.value.commentCreatedId &&
    !!dataValue.value.commentIsCommit
)

const disabledDetails = computed(() => {
  return (
    !(type.value === 'grab_10' || type.value === 'edit') ||
    (!!dataValue?.value?.commentCreatedId &&
      dataValue.value.commentCreatedId !== (userStore.user as any).id)
  )
})

const validateCheck = async () => {
  return await formRef?.value?.validate((valid: boolean) => {
    return valid
  })
}

const valueChange = () => {
  updetaValue({ ...dataValue.value })
}

const fileChange = () => {
  updetaValue({
    ...dataValue.value,
    mainCommentLink: setImageInfo(dataValue.value.mainCommentLinks),
    followupCommentLink: setImageInfo(dataValue.value.followupCommentLinks)
  })
}

const copyFollowupComment = async (): Promise<void> => {
  const text: string = (dataValue?.value?.followupComment as string) || ''
  if (!text) {
    ElMessage.warning('暂无可复制的追评文案')
    return
  }
  await copyText(text)
}

const copyMainComment = async (): Promise<void> => {
  const text: string = (dataValue?.value?.mainComment as string) || ''
  if (!text) {
    ElMessage.warning('暂无可复制的主评文案')
    return
  }
  await copyText(text)
}

const clearValidate = () => {
  formRef?.value?.clearValidate()
}

defineExpose({ clearValidate, validateCheck })
</script>
<style lang="scss" scoped>
.form_body {
  margin-top: 10px;

  .half {
    width: calc(50% - 50px);
  }

  .all {
    width: calc(100% - 50px);
  }
}

:deep(.el-input-number .el-input__inner) {
  text-align: left !important;
}

.image-wrapper {
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  padding: 16px 0;
  margin-bottom: 18px;
}

.image-wrapper .actions {
  display: flex;
  justify-content: flex-end;
  padding: 0 16px;
  margin-bottom: 10px;
  margin-right: 34px;
}

.image-wrapper .copy-btn {
  display: inline-flex;
  align-items: center;
}

.image-wrapper .copy-icon {
  width: 14px;
  height: 14px;
  margin-right: 6px;
}
</style>
