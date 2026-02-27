<template>
  <SWDialog v-model="dialogVisible" width="600" :title="dialogTitle" :showTitleLine="true" :showBottomLine="true"
    v-loading="loading" @close="close">
    <el-form :model="params" class="mt20px" :rules="formRule" ref="formRef">
      <el-form-item label="结算方式" prop="supplierPaymentMethod" class="!mb5px">
        <el-select class="dialogFormItemWidth" v-model="params.supplierPaymentMethod" placeholder="请选择" style="width: 100%"
          >
          <el-option v-for="dict in options" :key="dict.value"
            :label="dict.label" :value="dict.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class=" mr10px mt10px">
        <el-button @click="close">取消</el-button>
        <el-button @click="handleSubmit" type="primary">提交</el-button>
      </div>
    </template>
  </SWDialog>
</template>
<script lang="ts" setup>
import { debounce } from 'lodash-es'
import { DICT_TYPE, getDictLabel, getIntDictOptions } from '@/utils/dict';
import request from '@/config/axios'
const emit = defineEmits(['success'])
const message = useMessage()
const params = ref<any>({})
const dialogVisible = ref(false);
const dialogTitle = ref()
const loading = ref(false)
const open = ( row?: any) => {
  dialogVisible.value = true
  dialogTitle.value = '反审'
  params.value.id = row.id
  params.value.supplierPaymentMethod = row.supplierPaymentMethod
  formRef.value?.clearValidate()
}
const close = () => {
  dialogVisible.value = false
}
const options = getIntDictOptions(DICT_TYPE.SUPPLIER_PAYMENT_METHOD, true)
const formRef = ref()
const formRule = reactive({
  supplierPaymentMethod:[{ required:true,message:'请选择结算方式',trigger:['blur','change'] }]
})
const handleSubmit = debounce(async()=>{
  await formRef.value?.validate()
  const data = { ...params.value}
  request.post({ url:`/api/supplier-basic-info/updateSupplierPaymentMethod`,data }).then(()=>{
    message.success('提交成功')
    close()
    emit('success')
  }).catch()
})
onMounted(()=>{
 
})
defineExpose({
  open
})

</script>
<style lang="scss" scoped>
.option{
  display: flex;
  align-items: center;
  .label{
    margin-right: 40px;
  }
  .tag{
    width: 64px;
    height: 28px;
    border-radius: 362px;
    text-align: center;
    line-height: 28px;
    font-size: 14px;
    font-weight: normal;
    &.red{
      background: rgba(235, 55, 55, 0.2);
      color: #eb3737;
    }
    &.green{
      background: #EDF5DD;
      color: #349B34;
    }
    &.orange{
      background: rgba(219, 106, 15, 0.2);
      color:#DB6A0F;
    }
  }
}

</style>