<template>
  <div class="add-category">
    <el-form ref="formRef" :model="model" :rules="rules" label-width="90px">
      <el-form-item label="分类名称" prop="name">
        <s-text-area v-model="model.name" placeholder="请输入（最多50字符）" maxlength="50" show-word-limit clearable
          :rows="3" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import {
  addFabricClassification,
  editFabricClassification,
  getFabricClassificationDetail
} from '@/api/supplier/fabricManagement/classification'

defineOptions({ name: 'AddCategory' })

const props = defineProps<{ id?: string | number; name?: string }>()

const formRef = ref<FormInstance>()
const model = reactive({
  name: ''
})

const fetchDetail = async () => {
  if (props.id === undefined || props.id === null || props.id === '') return
  const res: any = await getFabricClassificationDetail(String(props.id))
  model.name = res?.name || ''
}

onMounted(() => {
  if (props.id !== undefined && props.id !== null && props.id !== '') {
    fetchDetail()
  } else if (props.name) {
    model.name = props.name
  }
})

const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 1, max: 50, message: '最多50字符', trigger: 'blur' }
  ]
})

const submit = async () => {
  await formRef.value?.validate()
  if (props.id) {
    await editFabricClassification({ id: String(props.id), name: model.name })
  } else {
    await addFabricClassification({ name: model.name })
  }
  return true
}

defineExpose({
  submit
})
</script>

<style scoped lang="scss">
.add-category {
  padding: 12px 12px 4px 12px;
}
</style>
