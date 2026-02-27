<template>
  <SWDialog v-model="dialogVisible" width="600" :title="dialogTitle" :showTitleLine="true" :showBottomLine="true"
    v-loading="loading" @close="close">
    <el-form :model="params" class="mt20px" :rules="formRule" ref="formRef">
      <el-form-item label="评估人员" prop="evaluatorId" class="!mb5px">
        <el-select class="dialogFormItemWidth" v-model="params.evaluatorId" placeholder="请选择" style="width: 100%"
          >
          <el-option v-for="dict in options" :key="dict.value"
            :label="dict.label" :value="dict.value">
            <div class="flex items-center">
                <el-avatar :src="dict.avatar" size="small" class="mr5px"></el-avatar>
                <span>{{dict.label}}</span>
            </div>
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
import defaultAvatar from '@/assets/svgs/defaultAvatar.svg'
import { debounce } from 'lodash-es'
// import { DICT_TYPE, getDictLabel, getIntDictOptions } from '@/utils/dict';
import request from '@/config/axios'
const emit = defineEmits(['success'])
const message = useMessage()
const params = ref<any>({})
const dialogVisible = ref(false);
const dialogTitle = ref()
const loading = ref(false)
const open = ( row?: any) => {
  dialogVisible.value = true
  dialogTitle.value = '评估人员配置	'
  getEvaluators()
  params.value.supplierId = row.id
  params.value.evaluatorId = row.evaluator?.userId || ''
  formRef.value?.clearValidate()
}
const close = () => {
  dialogVisible.value = false
}
const options = ref<any>([])
const formRef = ref()
const formRule = reactive({
  evaluatorId:[{ required:true,message:'请选择评估人员',trigger:['blur','change'] }]
})
const getEvaluators = () => {
  request.get({ url:`/api/supplier-basic-info/listProductCenterEvaluator`}).then((res:any)=>{
    options.value = res.map((item:any)=>{
      return {
        label:item.name,
        value:item.userId,
        avatar:item.avatarOrigin || defaultAvatar
      }
    })
  }).catch()
}
const handleSubmit = debounce(async()=>{
  await formRef.value?.validate()
  const data = { ...params.value}
  request.post({ url:`/api/supplier-basic-info/configureEvaluators`,data }).then(()=>{
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


</style>