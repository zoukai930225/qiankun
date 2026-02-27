<template>
  <el-form ref="formRef" v-loading="loading" :model="formData" :rules="rules" label-width="90px">
    <el-form-item label="区域名称" prop="qymc" v-if="type !== 'relation'">
      <el-input v-model.trim="formData.qymc" maxlength="20" placeholder="请输入区域名称" />
    </el-form-item>
    <el-form-item label="所属组织" prop="sszz">
       <el-select  v-model="formData.sszz">
        <el-option v-for="item in canChooseCompany" :key="item.value" :value="item.value" :label="item.label"></el-option>
       </el-select>
    </el-form-item>
    <el-form-item label="优先级" prop="priority" v-if="type !== 'relation'">
      <el-input-number v-model="formData.priority" :step="1" step-strictly :min="0"/>
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useMessage } from '@/hooks/web/useMessage'
import { saveAssetArea, relationOrgan } from '@/api/hrAdmin/asset'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()

const canChooseCompany = computed(() => {
  const companyOptions = getIntDictOptions(DICT_TYPE.PR_COMPANY, true)
  if(userStore?.user.company !== 'SecretWorld') {
    return companyOptions.filter((item: any) => item.value === userStore?.user?.company) || []
  }
  return companyOptions || []
})

interface Props {
  type?: 'create' | 'update' | 'relation'
  record?: any
  selectedData?: any
  onAfterSave?: (data: { id: any; qymc: string; sszz: string }) => void
}
const props = withDefaults(defineProps<Props>(), {
  type: 'create',
  record: undefined,
  selectedData: []
})

const message = useMessage()

const formRef = ref()
const loading = ref(false)
const formData = ref({
  id: '' as string | number | undefined,
  qymc: '',
  sszz: '' as string | undefined,
  priority: 0,
})

const rules = {
  qymc: [{ required: props.type !== 'relation', message: '请输入区域名称', trigger: 'blur' }],
  sszz: [{ required: true, message: '请选择所属组织', trigger: ['blur', 'change'] }],
}

watch(
  () => props.record,
  (val) => {
    if (props.type === 'update' && val) {
      formData.value.id = val.id
      formData.value.qymc = val.qymc || val.name || val.label || ''
      formData.value.sszz = val.sszz
      formData.value.priority = val.priority || 0
    } else {
      formData.value.id = undefined as any
      formData.value.qymc = ''
      formData.value.sszz = ''
      formData.value.priority = 0
    }
  },
  { immediate: true }
)

const submit = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return
  loading.value = true
  try {
    if(props.type === 'relation') {
      const query = {
        ids: props.selectedData.map((item: any) => item.id),
        sszz: formData.value.sszz
      }
      await relationOrgan(query)
      message.success('关联成功')
      return true
    }
    const payload: any = {
      qymc: formData.value.qymc,
      sszz: formData.value.sszz,
      priority: formData.value.priority
    }
    if (props.type === 'update') {
      payload.id = formData.value.id
    }
    await saveAssetArea(payload)
    message.success(props.type === 'create' ? '新增成功' : '修改成功')
    return true
  } finally {
    loading.value = false
  }
}

defineExpose({ submit })
</script>
