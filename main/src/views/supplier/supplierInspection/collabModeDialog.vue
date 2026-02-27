<template>
  <SWDialog v-model="dialogVisible" width="600" :title="dialogTitle" :showTitleLine="true" :showBottomLine="true"
    v-loading="loading" @close="close">
    <el-form :model="params" labelWidth="120" class="mt10px" :rules="formRule" ref="formRef">
      <el-form-item label="当前合作模式:">
        <span>{{ getSupplierCollabModeName(currentCollabMode) || '无' }}</span>
      </el-form-item>
      <el-form-item label="申请合作模式:" prop="collabMode" v-if="!hasCollabModePermission">
        <el-select class="dialogFormItemWidth" v-model="params.collabMode" placeholder="请选择" style="width: 100%">
          <el-option v-for="dict in showCollabmodeList" :key="dict.value"
             :value="dict.value" :label="dict.label" :disabled="!!pendingAuditMode">
             <div class="option">
              <div class="label">{{ dict.label }}</div>
              <div class="tag orange" v-if="isPendingAudit(dict.value)">待审核</div>
             </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请合作模式:" prop="collabModeList" v-else>
        <el-select class="dialogFormItemWidth" v-model="params.collabModeList" placeholder="请选择" style="width: 100%"  multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="4">
          <el-option v-for="dict in options" :key="dict.value"
             :value="dict.value" :label="dict.label">
             <!-- <div class="option">
              <div class="label">{{ dict.label }}</div>
              <div class="tag orange" v-if="isPendingAudit(dict.value)">待审核</div>
             </div> -->
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class=" mr10px mt10px">
        <el-button @click="close">取消</el-button>
        <el-button v-if="hasCollabModePermission" @click="handleSubmit" type="primary">提交</el-button>
        <el-button v-else @click="openRemarkDialog" type="primary" :disabled="!!pendingAuditMode || !isCanUpdate">提交审核</el-button>
      </div>
    </template>
  </SWDialog>
  <!-- 填写变更原因 -->
  <SWDialog v-model="remarkDialogVisible" width="600" title="变更原因" :showTitleLine="true" :showBottomLine="true"
    v-loading="loading" @close="closeRemarkDialog">
    <el-form :model="params" labelWidth="120" class="mt10px" :rules="remarkFormRule" ref="remarkFormRef">
      <el-form-item label="变更原因:" prop="applyRemark">
        <STextArea v-model="params.applyRemark" placeholder="请输入变更原因" style="width: 100%" maxlength="200" show-word-limit />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class=" mr10px mt10px">
        <el-button @click="closeRemarkDialog">取消</el-button>
        <el-button @click="handleSubmit" type="primary">提交审核</el-button>
      </div>
    </template>
  </SWDialog>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { updateCollabMode } from '@/api/supplier/index'
import { debounce } from 'lodash-es'
import { DICT_TYPE, getDictLabel, getIntDictOptions } from '@/utils/dict';
const emit = defineEmits(['success'])
const message = useMessage()
const params = ref<any>({})
const dialogVisible = ref(false);
const dialogType = ref()
const dialogTitle = ref()
const loading = ref(false)
const currentCollabMode = ref()
const pendingAuditMode = ref()
const supplierType = ref('')

const props = defineProps({
  hasCollabModePermission: {
    type: Boolean,
    default: false
  }
})
const open = (type?: string, row?: any) => {
  dialogVisible.value = true
  dialogType.value = type
  dialogTitle.value = '模式变更申请'
  currentCollabMode.value = row.collabMode
  params.value.collabModeList = row.collabMode?.split(',') || []
  params.value.id = row.id
  pendingAuditMode.value = row.pendingAuditCollabMode
  supplierType.value = row.supplierType
  formRef.value?.clearValidate()
}
// 是否待审核的
const isPendingAudit = (code:any)=>{
  return pendingAuditMode.value && pendingAuditMode.value?.split(',').includes(code)
}
// 是否有可新增的合作模式
const isCanUpdate = computed(()=>{
  const disabledMode =  pendingAuditMode.value? currentCollabMode.value + ','+  pendingAuditMode.value : currentCollabMode.value
  return disabledMode ? disabledMode? disabledMode.split(',')?.length < options.value?.length : true : true
})
const options = computed(()=>{
  if(supplierType.value === 'auxiliaryMaterials') return getIntDictOptions('sc_supplier_auxiliary_materials_collab_mode', true)
  else return getIntDictOptions(DICT_TYPE.SUPPLIER_COLLAB_MODE, true)
})
const showCollabmodeList = computed(()=>options.value.filter((dict:any)=>!currentCollabMode.value?.split(',').includes(dict.code)))
const getSupplierCollabModeName = (mode:string)=>{
  if(!mode) return ''
  const modeList = mode.split(',')
  if(supplierType.value === 'auxiliaryMaterials') return modeList?.map((code:any)=>getDictLabel('sc_supplier_auxiliary_materials_collab_mode',code)).join(',')
  else return modeList?.map((code:any)=>getDictLabel(DICT_TYPE.SUPPLIER_COLLAB_MODE,code)).join(',')
}
const close = () => {
  params.value.collabMode = ''
  dialogVisible.value = false
}
const formRef = ref()
const formRule = reactive({
  collabModeList:[{ required:true,message:'请选择申请合作模式',trigger:['blur','change'] }],
  collabMode:[{ required:true,message:'请选择申请合作模式',trigger:['blur','change'] }]
})
const remarkDialogVisible = ref(false)
const remarkFormRef = ref()
const remarkFormRule = reactive({
  remark:[{ required:true,message:'请输入变更原因',trigger:['blur','change'] }]
})
const closeRemarkDialog = () => {
  params.value.applyRemark = ''
  remarkDialogVisible.value = false
}
const openRemarkDialog = async()=>{
  await formRef.value?.validate()
  remarkDialogVisible.value = true
  remarkFormRef.value?.clearValidate()
}
const handleSubmit = debounce(async()=>{
  // if(!!pendingAuditMode.value)return close()
  // if(!isCanUpdate.value)return close()
  const data = !props.hasCollabModePermission ? {...params.value,addCollabMode:true} : {...params.value,collabMode:params.value.collabModeList?.join(','),addCollabMode:false}
  // data.collabMode = data.collabModeList?.join(',')
  updateCollabMode(data).then(()=>{
    message.success('申请成功')
    closeRemarkDialog()
    close()
    emit('success')
  }).catch()
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