<template>
  <SWDialog v-model="dialogShow" title="采购主管分配" :showTitleLine="true" :showBottomLine="true" @closed="handleClosed">
    <el-form :model="formData" ref="formRef" :rules="rules" class="mt20px">
      <el-form-item label="采购负责人" prop="purchaseUserId">
        <SWSelectPeople :isEdit="isEdit" :deptCode="'NEW_DEPT_PURCHASE'" :multiple="false" v-model:modelValue="formData.purchaseUserId"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="btns mt10px mr20px">
        <el-button type="primary" v-if="isEdit" :loading="loading" @click="handleSubmit">提交</el-button>
        <el-button @click="dialogShow = false">取消</el-button>
      </div>
    </template>
  </SWDialog>
</template>

<script lang="ts" setup>
import * as factoryPlanApi from '@/api/oa/factory/plan'
import SWSelectPeople from '@/views/OA/factory/components/selectPeople.vue'
const dialogShow = ref(false)
const loading = ref(false)
const formData = ref<any>({
  fsTaskId:"",
  supplierId:"",
  purchaseUserId:[]
})
const formRef = ref()
const rules = reactive({
  'purchaseUserId':[{ required:true,message:'请选择采购负责人',trigger:['change','blur'] }]
})

const emit = defineEmits(['success'])
const message = useMessage()
const handleSubmit = async() => {
/**
 * "fsTaskId": "14",
    "supplierId": "16",
    "purchaseUserId": "62"
 */
  await formRef.value?.validate()
  const params = {
    ...formData.value,
    purchaseUserId:formData.value.purchaseUserId.map((user:any)=>user.userId).join(',')
  }
  try{
    await factoryPlanApi.assignPurchaseDirector(params)
    message.success('提交成功')
    handleClosed()
    emit('success')
  }finally{

  }
}
const handleClosed = () => {
  dialogShow.value = false
}

const getDetail = async () => {
  const data = await factoryPlanApi.queryDetail(formData.value.fsTaskId,formData.value.supplierId )
  formData.value.purchaseUserId = data?.purchaseUser? [data.purchaseUser] : []
}

const isEdit = ref(true)
const open = async (taskId:string,suppId:string,isNodeInProgress:boolean)=>{
  dialogShow.value = true
  formData.value.fsTaskId = taskId
  formData.value.supplierId = suppId
  getDetail()
  isEdit.value = isNodeInProgress
}
defineExpose({ open })
</script>
<style lang="scss" scoped></style>
