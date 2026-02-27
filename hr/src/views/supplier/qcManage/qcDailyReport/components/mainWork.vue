<template>
  <div class="listTable">
    <div class="listHeader">
      <div class="title">核心工作进度</div>
      <div class="btn" v-if="isEdit">
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </div>
    </div>
    <div :class="['list',isEdit?'editTable':'']">
      <el-form :model="{ list:data}" :rules="formRules" scroll-to-error ref="formRef">
        <el-table class="SWCommonTable" :data="data" width="100%" v-horizontal-scroll="'always'"
          row-class-name="commonTableRow" :header-cell-style="appStore.headerCellStyle" border>
          <el-table-column label="供应商" prop="supplier" width="300">
            <template #default="{ row,$index }">
              <el-form-item required label=" " v-if="isEdit" :prop="`list.${$index}.supplier`" :rules="formRules.supplier">
                <!-- <el-select v-model="row.supplier" clearable filterable>
                  <el-option v-for="dict in supplierList" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select> -->
              <el-select-v2 filterable clearable v-model="row.supplier"  :options="supplierList" />
              </el-form-item>
              <span v-else>
                {{ row.supplierValue }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="具体问题描述" prop="progressDescription" show-overflow-tooltip min-width="300">
            <template #default="{ row,$index }">
              <el-form-item required label=" " v-if="isEdit" :prop="`list.${$index}.progressDescription`" :rules="formRules.progressDescription">
                <el-input v-model.trim="row.progressDescription" placeholder="请输入" show-word-limit :maxlength="200" clearable/>
              </el-form-item>
              <span v-else>
                {{ row.progressDescription }}
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
const selectOptions = inject<any>('selectOptions')
const supplierList = computed(() => selectOptions.supplierList.value)
const isEdit = computed(()=> props.type !== 'view')
const params = ref({
  supplier:'',
  progressDescription:'',
})
const formRef = ref()
const formRules = reactive({
  supplier:[{required:true,message:'请选择供应商',trigger:['blur','change']}],
  progressDescription:[{required:true,message:'请填写具体问题描述',trigger:['blur','change']}]
})
const formValidate = async()=>{
  return await formRef.value?.validate()
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