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
              <el-form-item label="发货下单时间" class="formItem" prop="bulkGoodsOrderTime">
                <el-date-picker
                  style="width: 320px"
                  v-model="localForm.bulkGoodsOrderTime"
                  type="datetime"
                  value-format="YYYY-MM-DD HH:mm"
                  format="YYYY-MM-DD HH:mm"
                  placeholder="请选择发货下单时间"
                  :disabled="forbidEdit"
                />
              </el-form-item>
              <el-form-item label="首批到仓时间" class="formItem" prop="firstArrivedWarehouseTime">
                <el-date-picker
                  style="width: 320px"
                  v-model="localForm.firstArrivedWarehouseTime"
                  type="datetime"
                  value-format="YYYY-MM-DD HH:mm"
                  format="YYYY-MM-DD HH:mm"
                  placeholder="请选择首批到仓时间"
                  :disabled="forbidEdit"
                />
              </el-form-item>

              <el-form-item label="产前样时间" class="formItem" prop="prenatalSamplingTime">
                <el-date-picker
                  style="width: 320px"
                  v-model="localForm.prenatalSamplingTime"
                  type="datetime"
                  value-format="YYYY-MM-DD HH:mm"
                  format="YYYY-MM-DD HH:mm"
                  placeholder="请选择产前样时间"
                  :disabled="forbidEdit"
                />
              </el-form-item>

              <el-form-item
                label="预计清单到货时间"
                class="formItem"
                prop="listEstimatedDeliveryTime"
              >
                <el-date-picker
                  style="width: 320px"
                  v-model="localForm.listEstimatedDeliveryTime"
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
import { debounce } from 'lodash-es'
import { defineProps } from 'vue'

import { getPurchasingInfoById, updateDesignSingle } from '@/api/oa/package/designGallery/index'

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
  },
  designInfo: {
    type: Object,
    default() {
      return {}
    }
  }
})
const emit = defineEmits(['update:modelValue', 'confirm', 'close'])
const visible = ref(false)
const localForm = ref({
  bulkGoodsOrderTime: '',
  firstArrivedWarehouseTime: '',
  prenatalSamplingTime: '',
  listEstimatedDeliveryTime: ''
})
const formRef = ref()

// 打开
const open = async (data: any) => {
  visible.value = true
  const res = await getPurchasingInfoById(props.designInfo.productPlanId) //回显详情
  if (res) {
    localForm.value = res || {
      bulkGoodsOrderTime: '',
      firstArrivedWarehouseTime: '',
      prenatalSamplingTime: '',
      listEstimatedDeliveryTime: ''
    }
  }
}

defineExpose({ open })

onMounted(() => {})

const formRules = reactive({
  bulkGoodsOrderTime: [{ required: true, message: '请选择大货下单时间', trigger: 'blur' }],
  firstArrivedWarehouseTime: [{ required: true, message: '请选择首批到仓时间', trigger: 'blur' }],
  prenatalSamplingTime: [{ required: true, message: '请选择产前样时间', trigger: 'blur' }],
  listEstimatedDeliveryTime: [
    { required: true, message: '请选择预计清单到货时间', trigger: 'blur' }
  ]
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
  console.log('localForm', localForm.value)
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  const data = {
    ...localForm.value,
    productPlanId: props.designInfo.productPlanId //开发计划id
  }

  await updateDesignSingle(data)
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
