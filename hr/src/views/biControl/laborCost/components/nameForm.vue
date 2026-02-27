<template>
  <s-w-dialog v-model="drawerVisible" :title="drawerTitle" @closed="reset" show-title-line show-bottom-line
    :beforeClose="beforeClose" width="400px">
    <el-form :model="formParams" label-width="80px" :rules="fromRules" ref="formRef" style="margin-top: 20px;">
      <el-form-item label="费用名称" prop="name">
        <s-text-area v-model="formParams.name" placeholder="请输入费用名称" maxlength="255" show-word-limit />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleCloseDrawer" style="margin-top: 20px;" class="new-btn-font">取消</el-button>
      <el-button type="primary" class="mr20px new-btn-font" :loading="submitLoading" style="margin-top: 20px;"
        @click="handleSubmit">确定</el-button>
    </template>
  </s-w-dialog>
</template>
<script lang="ts" setup>
import { consistency } from "@/utils";
import { cloneDeep, debounce } from "lodash-es";
import STextArea from "@/components/common/input/s-textarea.vue";
import request from '@/config/axios';
const drawerVisible = ref(false)
const drawerType = ref('')
const drawerTitle = computed(() => drawerType.value === 'add' ? '创建费用名称' : '编辑费用名称')
const historyData = ref<any>({})
const message = useMessage()
// 请求参数
const formParams = ref({
  id: undefined,
  name: '',
})
const submitLoading = ref(false)
const fromRules = reactive({
  name: [{ required: true, message: '请输入费用名称', trigger: ['blur', 'change'] }],
})
const emits = defineEmits(['success'])
const open = async (type: string, row?: any) => {
  reset()
  drawerVisible.value = true
  drawerType.value = type
  if (row) {
    formParams.value.id = row.id
    formParams.value.name = row.name
  }
  historyData.value = cloneDeep(formParams.value)
}

const formRef = ref<any>()
const reset = () => {
  historyData.value = {}
  formParams.value = {
    id: undefined,
    name: '',
  }
  formRef.value?.resetFields()
  submitLoading.value = false
}

const handleSubmit = async () => {
  // 校验表单
  if (!formRef.value) return
  await formRef.value.validate()
  submitRequest()
}

const submitRequest = debounce(async () => {
  try {
    submitLoading.value = true
    const id = await request.get({ url: formParams.value.id ? `/api/customFee/feeName/update` : '/api/customFee/feeName/add', params: formParams.value })
    const backOptions = cloneDeep(formParams.value)
    if (formParams.value.id) {
      message.success('编辑成功')
      reset()
      emits('success', backOptions)
    } else {
      message.success('创建成功')
      reset()
      Object.assign(backOptions, { id })
      emits('success', backOptions)
    }
    drawerVisible.value = false
  } catch (err) {
    console.log(err)
  } finally {
    submitLoading.value = false;
  }
}, 1000)

const beforeClose = (done: Function) => {
  consistency(historyData.value, formParams.value, done)
};
const handleCloseDrawer = () => {
  beforeClose(() => {
    drawerVisible.value = false;
  });
}


defineExpose({ open })
</script>
<style lang="scss" scoped>
.new-btn-font {
  font-size: 14px;
}
</style>