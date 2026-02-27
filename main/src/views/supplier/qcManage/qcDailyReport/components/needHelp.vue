<template>
  <div class="listTable">
    <div class="listHeader">
      <div class="title">需要协助与帮助</div>
      <div class="btn" v-if="isEdit">
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </div>
    </div>
    <div :class="['list',isEdit?'editTable':'']">
      <el-form :model="{ list:data}" :rules="formRules" scroll-to-error ref="formRef">
        <el-table class="SWCommonTable" :data="data" width="100%" v-horizontal-scroll="'always'"
          row-class-name="commonTableRow" :header-cell-style="appStore.headerCellStyle" border>
          <el-table-column label="是否需要协助" prop="isNeedAssistance" width="300">
            <template #default="{ row,$index }">
              <el-form-item required label=" " v-if="isEdit" :prop="`list.${$index}.isNeedAssistance`" :rules="formRules.isNeedAssistance">
                <el-select v-model="row.isNeedAssistance" @click="changeIsNeedAssistance($index)" clearable>
                  <el-option value="1" label="是"/>
                  <el-option value="0" label="否"/>
                </el-select>
              </el-form-item>
              <span v-else>
                {{ row.isNeedAssistance === '1'? '是':'否' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="详细描述" prop="description" show-overflow-tooltip min-width="300">
            <template #default="{ row,$index }">
              <el-form-item label=" " v-if="isEdit" :prop="`list.${$index}.description`" :rules="row.isNeedAssistance === '1'?formRules.description:[]">
                <el-input v-model.trim="row.description" placeholder="请输入" show-word-limit :maxlength="100" clearable/>
              </el-form-item>
              <span v-else>
                {{ row.description || '-'}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="70" fixed="right" v-if="isEdit">
            <template #default="{ $index }">
              <!-- <el-button link type="primary">{{ type==='add'?'保存':'编辑' }}</el-button> -->
              <el-button link type="danger" @click="handleCancel($index)" :disabled="$index === 0" v-show="$index !== 0">取消</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useAppStore } from '@/store/modules/app';
const appStore = useAppStore()
const message = useMessage()
const props = defineProps({
  data: {
    type: Array as any,
    default: null
  },
  type:{
    type: String,
    default:''
  },
  maxNum:{
    type: Number,
    default:10
  }
})

const isEdit = computed(()=> props.type !== 'view')
const params = ref({
  isNeedAssistance:'',
  description:'',
})
const formRef = ref()
const formRules = reactive({
  isNeedAssistance:[{required:true,message:'请选择是否需要协助',trigger:['blur','change']}],
  description:[{required:true,message:'请填写详细描述',trigger:['blur','change']}]
})
const formValidate = async()=>{
  return await formRef.value?.validate()
}
const changeIsNeedAssistance = (index:number)=>{
  formRef.value?.resetFields([`list.${index}.description`])
}
defineExpose({formValidate})
const handleAdd = ()=>{
  if(props.data.length < props.maxNum){
    props.data.push({...params.value})
  }else{
    message.error(`最多支持添加${props.maxNum}条记录`)
  }
}
const handleCancel = async(index:number)=>{
  await message.confirm('请确认是否删除？')
  props.data.splice(index,1)
}
onMounted(() => {
  
})
</script>

<style lang="scss" scoped>
@use './style/table.scss';
</style>
