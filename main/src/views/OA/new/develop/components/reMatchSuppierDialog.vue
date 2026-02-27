<template>
  <div>
    <SWDialog v-if="visible" v-model="visible" :width="width" :title="title" :showTitleLine="true"
      :showBottomLine="true">
      <div>
        <s-text-area v-model="localForm.price" placeholder="请输入重新匹配供应商原因" :autosize="{ minRows: 8 }" :maxlength="200"
          :showWordLimit="true"
          style="width: 574px; margin-top: 20px; width: 578px; height: 170px; border-radius: 4px" />
        <div style="font-size: 10px; color: #999999; padding-top: 15px">备注：重新匹配供应商后，当前流程节点将回退至“匹配供应商”节点</div>
      </div>
      <template #footer>
        <div style="margin-top: 10px; margin-bottom: -5px">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="confirmDialog" style="margin-right: 20px">提交</el-button>
        </div>
      </template>
    </SWDialog>
  </div>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { defineProps } from 'vue'
import { debounce } from 'lodash-es'

const message = useMessage() // 消息弹窗

const props = defineProps({
  title: {
    type: String,
    default: '重新匹配供应商'
  },
  width: {
    type: String,
    default: '614px'
  }
})
const emit = defineEmits(['update:modelValue', 'confirm', 'close'])
const visible = ref(false)
const queryFormRef = ref()
const localForm = ref({
  suppier: '',
  price: '',
  priceFile: '',
  priceFileList: [{ url: '111', name: 'test1.png', uploadStatus: 'success', percent: 100 }],
  time: ''
})
const formRef = ref()
const swUploadFileRef = ref()

const suppierOptions = ref([
  { value: '1', label: '供应商1' },
  { value: '2', label: '供应商2' }
])

// 打开
const open = async (data: any) => {
  visible.value = true
}

defineExpose({ open })

onMounted(() => { })

const formRules = reactive({
  // bigGoodsOrderTime: [{ required: true, message: '请选择大货下单时间', trigger: 'blur' }],
  // firstBatchWarehousingTime: [{ required: true, message: '请选择首批到仓时间', trigger: 'blur' }],
  // beforeProduceSampleTime: [{ required: true, message: '请选择产前样时间', trigger: 'blur' }],
  // expectListArrivalTime: [{ required: true, message: '请选择预计清单到货时间', trigger: 'blur' }]
})

const handleClose = () => {
  // 将visible的值设置为false
  visible.value = false
  // 触发close事件
  emit('close')
}
const confirmDialog = debounce(async () => {
  procurementNoticeConfirm()
})

const procurementNoticeConfirm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  const data = {
    ...localForm.value
  }

  await updateDesign(data)
  message.success('操作成功')
  emit('confirm')
  visible.value = false
}
</script>

<style lang="scss" scoped>
:deep(.el-form-item--default .el-form-item__label) {
  line-height: 20px;
  text-align: right;
  display: flex;
  align-items: center;
  padding-left: 0px;

  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  text-align: right;
  letter-spacing: normal;
  color: #666666;
}
</style>
