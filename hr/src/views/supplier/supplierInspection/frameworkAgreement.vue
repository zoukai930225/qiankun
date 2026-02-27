<template>
  <SWDialog v-model="dialogVisible" width="600" :title="dialogTitle" :showTitleLine="true" :showBottomLine="true"
    v-loading="loading" @close="close">
    <el-form :model="params" class="mt10px" style="padding:0 10px" :rules="formRule" ref="formRef" labelWidth="80">
      <el-form-item label="签订日期" prop="signDate">
        <el-date-picker type="date" v-model="params.signDate" placeholder="请选择签订日期"  format="YYYY-MM-DD"
        value-format="YYYY-MM-DD" style="width: 100%"/>
      </el-form-item>
      <el-form-item label="合同编号" prop="contractNumber">
        <el-input maxlength="20" placeholder="请输入合同编号" v-model="params.contractNumber" showWordLimit style="width: 100%"/>
      </el-form-item>
      <el-form-item label="附件" prop="contractAttachmentUrl">
        <transfer v-model="params.contractAttachmentUrl" :upload-data="{ code: 'SUPPLIER_FILE' }" style="width: 100%" :limit="5"
            :tip="'最多上传5张大小不超过20M的图片或者文件'" accept-type="all" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class=" mr10px mt10px">
        <el-button @click="close">取消</el-button>
        <el-button @click="handleSubmit" type="primary">保存</el-button>
      </div>
    </template>
  </SWDialog>
</template>
<script lang="ts" setup>
import { debounce } from 'lodash-es'
import request from '@/config/axios'
import Transfer from "@/components/common/upload/transfer.vue";
const emit = defineEmits(['success'])
const message = useMessage()
const params = ref<any>({})
const dialogVisible = ref(false);
const dialogTitle = ref()
const loading = ref(false)
const open = (row?: any) => {
  dialogVisible.value = true
  dialogTitle.value = '框架合同'
  params.value.id = row.id
  params.value.signDate = row.signDate
  params.value.contractNumber = row.contractNumber
  params.value.contractAttachmentUrl = row.contractAttachmentUrl
  formRef.value?.clearValidate()
}
const close = () => {
  dialogVisible.value = false
}

const formRef = ref()

const formRule = reactive({
  signDate: [{ required: true, message: '请选择签订日期', trigger: ['blur','change'] }],
  // /^[A-Za-z0-9]+$/
  contractNumber:[{required: true, message: '请输入合同编号', trigger: ['blur',]  },{pattern: /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z]{2,20}$/,message:`合同编号只能为数字+字母`,trigger: ['blur', 'change'] }]
})
const handleSubmit = debounce(async () => {
  await formRef.value?.validate()
  const data = { ...params.value }
  request.post({ url:`/api/supplier-basic-info/updateSupplierContract`,data }).then(()=>{
    message.success('提交成功')
    close()
    emit('success')
  }).catch()
})
onMounted(() => {

})
defineExpose({
  open
})

</script>
<style lang="scss" scoped></style>