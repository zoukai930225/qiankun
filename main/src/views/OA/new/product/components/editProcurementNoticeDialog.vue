<template>
  <div>
    <SWDialog
      v-if="visible"
      v-model="visible"
      :title="title"
      :titleIcon="titleIcon"
      titleIconWidth="14px"
      backgroundName="Audit"
    >
      <div>
        <div class="dialog-content">
          <div class="flex-row form-wapper">
            <el-form ref="formRef" :model="localForm" :rules="formRules" label-width="150px">
              <el-form-item label="发货下单时间" class="formItem" prop="bigGoodsOrderTime">
                <el-date-picker
                  style="width: 320px"
                  v-model="localForm.bigGoodsOrderTime"
                  type="datetime"
                  value-format="YYYY-MM-DD HH:mm"
                  format="YYYY-MM-DD HH:mm"
                  placeholder="请选择发货下单时间"
                  :disabled="forbidEdit"
                />
              </el-form-item>
              <el-form-item label="首批到仓时间" class="formItem" prop="firstBatchWarehousingTime">
                <el-date-picker
                  style="width: 320px"
                  v-model="localForm.firstBatchWarehousingTime"
                  type="datetime"
                  value-format="YYYY-MM-DD HH:mm"
                  format="YYYY-MM-DD HH:mm"
                  placeholder="请选择首批到仓时间"
                  :disabled="forbidEdit"
                />
              </el-form-item>

              <el-form-item label="产前样时间" class="formItem" prop="beforeProduceSampleTime">
                <el-date-picker
                  style="width: 320px"
                  v-model="localForm.beforeProduceSampleTime"
                  type="datetime"
                  value-format="YYYY-MM-DD HH:mm"
                  format="YYYY-MM-DD HH:mm"
                  placeholder="请选择产前样时间"
                  :disabled="forbidEdit"
                />
              </el-form-item>

              <el-form-item label="预计清单到货时间" class="formItem" prop="expectListArrivalTime">
                <el-date-picker
                  style="width: 320px"
                  v-model="localForm.expectListArrivalTime"
                  type="datetime"
                  value-format="YYYY-MM-DD HH:mm"
                  format="YYYY-MM-DD HH:mm"
                  placeholder="请选择预计清单到货时间"
                  :disabled="forbidEdit"
                />
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button v-if="!forbidEdit" type="primary" @click="confirmDialog">提交</el-button>
      </template>
    </SWDialog>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { debounce } from 'lodash-es'

import { getDesignDetailById, updateDesign } from '@/api/oa/new/designGallery/index'

import titleIcon from '@/assets/imgs/oa/shenhe-title.png'

const message = useMessage() // 消息弹窗

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '560px'
  },
  forbidEdit: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue', 'confirm', 'close'])
const visible = ref(false)
const localForm = ref({
  bigGoodsOrderTime: '',
  firstBatchWarehousingTime: '',
  beforeProduceSampleTime: '',
  expectListArrivalTime: ''
})
const formRef = ref()

// 打开
const open = async (data: any) => {
  visible.value = true
  const res = await getDesignDetailById(data.npDesignPictureGodownId) //回显详情
  if (res) {
    localForm.value = { ...res }
  }
}

defineExpose({ open })

onMounted(() => {})

const formRules = reactive({
  bigGoodsOrderTime: [{ required: true, message: '请选择大货下单时间', trigger: 'blur' }],
  firstBatchWarehousingTime: [{ required: true, message: '请选择首批到仓时间', trigger: 'blur' }],
  beforeProduceSampleTime: [{ required: true, message: '请选择产前样时间', trigger: 'blur' }],
  expectListArrivalTime: [{ required: true, message: '请选择预计清单到货时间', trigger: 'blur' }]
})

const handleClose = () => {
  // 将visible的值设置为false
  visible.value = false
  // 触发close事件
  emit('close')
}
const resetForm = () => {}
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
.dialog-content {
  background: #ffffff;
  border-radius: 20px;
  margin: 0 auto;
  padding-top: 20px;
  box-sizing: border-box;
  overflow: auto;
}
.formItem {
  width: 460px;
}
</style>
