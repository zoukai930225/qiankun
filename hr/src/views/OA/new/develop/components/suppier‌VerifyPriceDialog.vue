<template>
  <div>
    <SWDialog
      v-if="visible"
      v-model="visible"
      :width="width"
      :title="title"
      :showTitleLine="true"
      :show-bottom-line="true"
    >
      <div>
        <el-form :model="localForm" ref="queryFormRef" :inline="true" label-width="88px">
          <el-form-item label="供应商名称" prop="suppier" style="margin-top: 20px">
            <el-select
              v-model="localForm.suppier"
              placeholder="请选择供应商"
              clearable
              style="width: 490px"
              :disabled="forbidEdit"
            >
              <el-option
                v-for="item in suppierOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="实物报价" prop="price">
            <el-input
              v-model="localForm.price"
              placeholder="请输入实物报价"
              style="width: 490px"
              :disabled="forbidEdit"
            />
          </el-form-item>
          <el-form-item label="报价单" prop="priceFile">
            <SWUploadFile
              ref="swUploadFileRef"
              :show-btn-style="true"
              v-model:modelValue="localForm.priceFileList"
              :onlyShow="forbidEdit"
              :showDownloadIcon="true"
              :width="490"
            />
          </el-form-item>

          <el-form-item label="节点时间截止时间" prop="price">
            <el-date-picker
              :disabled="forbidEdit"
              v-model="localForm.time"
              type="datetime"
              placeholder="请选择"
              style="width: 490px"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div style="margin-top: 10px; margin-bottom: -5px" v-if="!forbidEdit">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="confirmDialog" style="margin-right: 20px"
            >提交</el-button
          >
        </div>
      </template>
    </SWDialog>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { debounce } from 'lodash-es'
import SWUploadFile from '@/components/SWUoloadFile/index.vue'

import { getDesignDetailById, updateDesign } from '@/api/oa/new/designGallery/index'

const message = useMessage() // 消息弹窗

const props = defineProps({
  title: {
    type: String,
    default: '报价核价'
  },
  width: {
    type: String,
    default: '614px'
  },
  forbidEdit: {
    type: Boolean,
    default: false
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

onMounted(() => {})

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
