<template>
  <SWDialog v-model="drawerVisible" title="新建电子面单匹配" @closed="reset" show-title-line show-bottom-line
    :beforeClose="beforeClose" width="472px">
    <el-form :model="formParams" label-width="140px" :rules="fromRules" ref="formRef" v-loding="drawerLoading"
      style="margin-top: 20px;">
      <el-form-item label="面单取号月份" prop="channelBillMonth">
        <el-date-picker v-model="formParams.channelBillMonth" type="month" placeholder="请选择月份" value-format="YYYY-MM"
          class="!w300px" />
      </el-form-item>
      <el-form-item label="中通账单所属月份" prop="ztoBillMonth" v-if="billMatchType === 'ZTO'">
        <el-date-picker v-model="formParams.ztoBillMonth" type="month" placeholder="请选择月份" value-format="YYYY-MM"
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
import * as ztoEleDataApi from '@/api/finance/billMatch'
import { consistency } from "@/utils";
import { cloneDeep, debounce } from 'lodash-es';
const drawerVisible = ref(false)
const drawerLoading = ref(false)
const hostoryData = ref<any>({})
const message = useMessage()
const props = defineProps({
  billMatchType: {
    type: String,
    //中通ZTO ,圆通YTO
    default: 'ZTO'
  },
})
// 请求参数
const formParams = ref<any>({
  id: undefined,
  channelBillMonth: undefined,
  ztoBillMonth: undefined,
})
const fromRules = reactive({
  channelBillMonth: [{ required: true, message: '请选择面单取号月份', trigger: 'blur' }],
  ztoBillMonth: [{ required: true, message: '请选择中通账单所属月份', trigger: 'blur' }],
})
//打开弹框
const open = async (data: any) => {
  drawerVisible.value = true
}
const formRef = ref<any>()
const reset = () => {
  hostoryData.value = {}
  formParams.value = {
    id: undefined,
    channelBillMonth: undefined,
    ztoBillMonth: undefined,
  }
  drawerLoading.value = false
}

const handleSubmit = debounce(async () => {
  // 校验表单
  if (!formRef.value) return
  await formRef.value.validate()
  // 提交请求
  try {
    drawerLoading.value = true
    formParams.value.billMatchBizType = props.billMatchType
    console.log(formParams.value)
    await ztoEleDataApi.billMatch(formParams.value)
    reset()
    message.success('新建电子面单匹配成功')
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