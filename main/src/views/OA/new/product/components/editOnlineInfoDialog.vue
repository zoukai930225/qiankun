<template>
  <div>
    <el-dialog v-model="visible" :width="dialogWidth" :before-close="handleClose" @open="resetForm"
      class="oadialog-background" style="border-radius: 20px" :append-to-body="true">
      <div>
        <div class="dialog-content">
          <div class="flex-row form-wapper" style="margin-left: 10px">
            <el-form ref="formRef" :model="localForm" :rules="formRules" label-width="120px">
              <el-form-item label="是否上架" style="width: 390px" prop="isOnshelf">
                <el-radio-group :disabled="forbidEdit" v-model="localForm.isOnshelf">
                  <el-radio v-for="dict in [
                    {
                      label: '是',
                      value: '1'
                    },
                    {
                      label: '否',
                      value: '2'
                    }
                  ]" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="localForm.isOnshelf === '2'" label="未上架原因" style="width: 395px"
                prop="notOnShelfReason">
                <s-text-area v-model="localForm.notOnShelfReason" :autosize="{ minRows: 3, maxRows: 3 }"
                  placeholder="请输入未上架原因" />
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <template #header="{ }">
        <div class="my-header">
          <img src="@/assets/imgs/oa/shenhe-title.png" class="shenhe-title" />
          <span style="margin-left: 10px">{{ title }}</span>
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
import STextArea from "@/components/common/input/s-textarea.vue";
import { defineProps } from 'vue'
import { debounce } from 'lodash-es'

import { onShelfDesign } from '@/api/oa/new/designGallery/index'

const message = useMessage() // 消息弹窗

const props = defineProps({
  title: {
    type: String,
    default: '上架维护'
  },
  width: {
    type: String,
    default: '868px'
  },
  forbidEdit: {
    type: Boolean,
    default: false
  }
})
const dialogWidth = ref('560px')
const emit = defineEmits(['update:modelValue', 'confirm', 'close', 'success'])
const visible = ref(false)
const formRef = ref()
const localForm = ref({
  id: '',
  developmentPlanId: '',
  enterprisePlanId: '',
  isOnshelf: '0',
  notOnShelfReason: ''
})

// 打开
const open = async (data: any) => {
  visible.value = true
  const { id, developmentPlanId, enterprisePlanId, isOnshelf, notOnShelfReason } = data || {}
  localForm.value = { id, developmentPlanId, enterprisePlanId, isOnshelf, notOnShelfReason }
}

defineExpose({ open })

onMounted(() => { })

const formRules = reactive({
  isOnshelf: [{ required: true, message: '选择是否上架', trigger: 'blur' }],
  notOnShelfReason: [{ required: true, message: '请输入未上架原因', trigger: 'blur' }]
})

const handleClose = () => {
  visible.value = false
  emit('close')
}
const resetForm = () => { }

const confirmDialog = debounce(async () => {
  saveIsOnShelfConfirm()
})

const saveIsOnShelfConfirm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  const data = {
    ...localForm.value
  }
  // 该为上架 删掉之前的数据
  if (data.isOnshelf === '1') {
    data.notOnShelfReason = ''
  }

  await onShelfDesign(data)
  message.success('操作成功')
  emit('confirm')
  emit('success')
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
    overflow: auto;
  }
}
</style>
