<template>
  <div>
    <el-dialog
      v-model="visible"
      :width="dialogWidth"
      :before-close="handleClose"
      @open="resetForm"
      class="oadialog-background"
      style="border-radius: 20px"
      :append-to-body="true"
    >
      <div>
        <div class="dialog-content">
          <div class="flex-row form-wapper">
            <el-form ref="formRef" :model="localForm" :rules="formRules" label-width="140px">
              <el-form-item label="下单数量(件)" class="formItem" prop="orderNumber">
                <el-input-number
                  style="width: 220px"
                  v-model="localForm.orderNumber"
                  placeholder="请输入下单数量(件)"
                />
              </el-form-item>
              <el-form-item label="下单金额" class="formItem" prop="orderAmount">
                <el-input-number
                  style="width: 220px"
                  v-model="localForm.orderAmount"
                  placeholder="请输入下单金额"
                />
              </el-form-item>
              <div style="height: 20px"></div>
            </el-form>
          </div>
        </div>
      </div>
      <template #header="{}">
        <div class="my-header">
          <img src="@/assets/imgs/oa/shenhe-title.png" class="shenhe-title" />
          <span style="margin-left: 10px">{{ realTitle }}</span>
        </div>
      </template>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button v-if="!forbidEdit" type="primary" @click="confirmDialog">提交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { debounce } from 'lodash-es'

import { updateDesign, getDesignDetailById } from '@/api/oa/new/designGallery/index'

const message = useMessage() // 消息弹窗

const props = defineProps({
  title: {
    type: String,
    default: '运营日期'
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
const dialogWidth = ref('560px')
const emit = defineEmits(['update:modelValue', 'confirm', 'close'])
const visible = ref(false)
const localForm = ref({
  orderNumber: '',
  orderAmount: ''
})
const formRef = ref()
const realTitle = ref('')
// 打开
const open = async (data: any, permission: string) => {
  // 信息获取
  const res = await getDesignDetailById(data.npDesignPictureGodownId)
  delete res.jsonData
  if (res) localForm.value = { ...res }
  realTitle.value = (data && data.nodeName) || ''
  visible.value = true
}

defineExpose({ open })

onMounted(() => {})

const formRules = reactive({
  orderNumber: [{ required: true, message: '请输入下单数量', trigger: 'blur' }],
  orderAmount: [{ required: true, message: '请输入下单金额', trigger: 'blur' }]
})

const handleClose = () => {
  visible.value = false
  emit('close')
}
const resetForm = () => {}

const confirmDialog = debounce(async () => {
  operateDateConfirm()
})

const operateDateConfirm = async () => {
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

<style scoped lang="scss">
.dialog-footer {
  text-align: right;
}

.my-header {
  display: flex;
  align-items: center;

  .shenhe-title {
    width: 14px;
    height: 16px;
    margin-right: 3px;
    margin-top: 3px;
  }
}
</style>

<style scoped lang="scss">
.dialogBg {
  position: absolute;
  top: -16px;
  left: -15px;
  // width: 968px;
  // height: 444px;
  z-index: -1;
}
</style>
<style lang="scss">
.oadialog-background {
  border-radius: 20px;
  background-image: url('@/assets/imgs/oa/oa_design_audit_bg.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;

  .dialog-content {
    background: #ffffff;
    border-radius: 20px;
    margin: 0 auto;
    padding-top: 20px;
    box-sizing: border-box;
    // overflow: auto;
    overflow: hidden;
  }
  .formItem {
    width: 560px;
  }
}
</style>
