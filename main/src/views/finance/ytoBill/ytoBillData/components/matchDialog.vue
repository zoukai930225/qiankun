<template>
  <SWDialog v-model="drawerVisible" title="新建圆通账单匹配" @closed="reset" show-title-line show-bottom-line
    :beforeClose="beforeClose" width="492px">
    <el-form :model="formParams" label-width="160px" :rules="fromRules" ref="formRef" v-loding="drawerLoading"
      style="margin-top: 20px;">
      <el-form-item label="圆通账单所属月份" prop="belongTime">
        <el-date-picker v-model="formParams.belongTime" type="month" placeholder="请选择月份" value-format="YYYY-MM"
          class="!w300px" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleCloseDrawer" style="margin-top: 20px;">取消</el-button>
      <el-button type="primary" class="mr20px" :loading="drawerLoading" style="margin-top: 20px;"
        @click="handleSubmit">开始匹配</el-button>
    </template>
  </SWDialog>
</template>
<script lang="ts" setup>
import * as ytBillApi from "@/api/finance/ytoBill/ytBill";
import { consistency } from "@/utils";
import { debounce } from 'lodash-es';
const drawerVisible = ref(false)
const drawerLoading = ref(false)
const hostoryData = ref<any>({})
const message = useMessage()
// 请求参数
const formParams = ref({
  belongTime: undefined
})
const fromRules = reactive({
  belongTime: [{ required: true, message: '请选择月份', trigger: 'blur' }],
})
//打开弹框
const open = async (data: any) => {
  drawerVisible.value = true
}
const formRef = ref<any>()
const reset = () => {
  hostoryData.value = {}
  formParams.value = {
    belongTime: undefined,
  }
  formRef.value.resetFields()
  drawerLoading.value = false
}

const handleSubmit = debounce(async () => {
  // 校验表单
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch (e) {
    return
  }
  // 提交请求
  try {
    drawerLoading.value = true
    await ytBillApi.dataMatch(formParams.value)
    reset()
    message.success('新建圆通账单匹配成功')
    // 发送操作成功的事件
    emits('success')
    drawerVisible.value = false
  } catch (err) { } finally {
    drawerLoading.value = false
  }
}, 1000)



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