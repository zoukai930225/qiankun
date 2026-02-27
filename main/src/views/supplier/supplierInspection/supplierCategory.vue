<template>
  <SWDialog v-model="dialogVisible" width="600" :title="dialogTitle" :showTitleLine="true" :showBottomLine="true"
    v-loading="loading" @close="close">
    <el-form :model="params" class="mt20px" :rules="formRule" ref="formRef">
      <el-form-item label="合作品类" prop="collabCategory" class="!mb5px">
        <el-select class="dialogFormItemWidth" v-model="params.collabCategory" placeholder="请选择" style="width: 100%"
          multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="4">
          <el-option v-for="dict in options" :key="dict.categoryCode"
             :value="dict.categoryCode" :label="dict.categoryName">
             <!-- <div class="option">
              <div class="label">{{ dict.label }}</div>
              <div class="tag orange">待审核</div>
             </div> -->
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
import { updateCollabCategory } from '@/api/supplier/index'
import { queryCategoryTree } from '@/api/system/categoryManager'
const emit = defineEmits(['success'])
const message = useMessage()
const params = ref<any>({})
const dialogVisible = ref(false);
const dialogType = ref()
const dialogTitle = ref()
const loading = ref(false)
const open = (type?: string, row?: any) => {
  dialogVisible.value = true
  dialogType.value = type
  dialogTitle.value = '合作品类变更'
  params.value.id = row.id
  params.value.collabCategory = row.collabCategoryCodes || row.collabCategory.split(',') 
  formRef.value?.clearValidate()
}
const close = () => {
  dialogVisible.value = false
}
const options = ref<any>([])
const getCategoryTree = async()=>{
  queryCategoryTree().then((res:any)=>{
    options.value = res || []
  })
}
const formRef = ref()
const formRule = reactive({
  collabCategory:[{ required:true,message:'请选择合作品类',trigger:['blur','change'] }]
})
const handleSubmit = debounce(async()=>{
  await formRef.value?.validate()
  const data = { ...params.value}
  data.collabCategory = data.collabCategory.join(',')
  updateCollabCategory(data).then(()=>{
    message.success('提交成功')
    close()
    emit('success')
  }).catch()
})
onMounted(()=>{
  getCategoryTree()
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