<template>
  <SWDialog v-model="drawerVisible" title="重新执行任务" @closed="reset" show-title-line show-bottom-line
    :beforeClose="beforeClose" width="392px">
    <el-form :model="formParams" label-width="70px" :rules="fromRules" ref="formRef" v-loding="drawerLoading"
      style="margin-top: 20px;" :disabled="true">
      <el-form-item label="任务名" prop="cleanIndicators">
        <s-text-area v-model="formParams.cleanIndicators" placeholder="请输入任务名" class="!w300px" />
      </el-form-item>
      <el-form-item label="日期" prop="dataDate">
        <el-date-picker v-model="formParams.dataDate" type="date" placeholder="请选择日期" value-format="YYYY-MM-DD"
          class="!w300px" disabled />
      </el-form-item>
      <el-form-item label="店铺" prop="store">
        <store-cascader :otherProps="{ disabled: true }" v-model="formParams.store" class="!w300px" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleCloseDrawer" style="margin-top: 20px;">取消</el-button>
      <el-button type="primary" class="mr20px" :loading="drawerLoading" style="margin-top: 20px;"
        @click="handleSubmit">确定</el-button>
    </template>
  </SWDialog>
</template>
<script lang="ts" setup>
import { consistency } from "@/utils";
import { cloneDeep, debounce } from 'lodash-es';
import request from '@/config/axios';
const drawerVisible = ref(false)
const drawerLoading = ref(false)
const hostoryData = ref<any>({})
const message = useMessage()
import STextArea from '@/components/common/input/s-textarea.vue'
// 请求参数
const formParams = ref<any>({
  id: undefined,
  cleanIndicators: undefined,
  dataDate: undefined,
  store: '',
})
const fromRules = reactive({
  cleanIndicators: [{ required: true, message: '请输入任务名称', trigger: ['blur', 'change'] }],
  dataDate: [{ required: true, message: '请选择日期', trigger: ['blur', 'change'] }],
  store: [{ required: true, message: '请选择店铺', trigger: ['blur', 'change'] }],
})
//打开弹框
const open = async (data: any) => {
  drawerVisible.value = true
  formParams.value.cleanIndicators = data.cleanIndicators;
  formParams.value.dataDate = data.dataDate;
  formParams.value.store = data.store;
}
const formRef = ref<any>()
const reset = () => {
  hostoryData.value = {}
  formParams.value = {
    id: undefined,
    cleanIndicators: undefined,
    dataDate: undefined,
    store: '',
  }
  drawerLoading.value = false
}

const handleSubmit = async () => {
  // 校验表单
  if (!formRef.value) return
  await formRef.value.validate()
  submit()
}

const submit = debounce(async () => {
  // 提交请求
  try {
    drawerLoading.value = true
    const params = {
      dataDate: formParams.value.dataDate,
      store: formParams.value.store,
    }
    await request.get({ url: '/api/cleanDashboard/reExecute', params })
    reset()
    message.success('重新执行成功')
    // 发送操作成功的事件
    emits('success')
    drawerVisible.value = false
  } catch (err) { } finally {
    drawerLoading.value = false
  }
}, 500)

const beforeClose = (done: Function) => {
  consistency(hostoryData.value, formParams.value, done)
};
const handleCloseDrawer = () => {
  beforeClose(() => {
    drawerVisible.value = false;
  });
}

const emits = defineEmits(['success'])
defineExpose({ open })
</script>