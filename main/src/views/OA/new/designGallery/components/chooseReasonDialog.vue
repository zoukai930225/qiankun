<template>
  <div>
    <el-dialog v-model="visible" :width="dialogWidth" :before-close="handleClose" @open="resetForm"
      class="oadialog-background" style="border-radius: 20px" :append-to-body="true">
      <div>
        <div class="dialog-content">
          <div class="flex-row form-wapper" style="margin-left: 10px">
            <el-form ref="formRef" :model="localForm" :rules="formRules" label-width="80px">
              <el-form-item label="选品理由" style="width: 465px" prop="chooseReason">
                <s-text-area v-model="localForm.chooseReason" :autosize="{ minRows: 4, maxRows: 4 }"
                  placeholder="请输入选品理由" />
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
          <el-button type="primary" @click="confirmDialog">提交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { defineProps } from 'vue'
import { debounce } from 'lodash-es'

const props = defineProps({
  title: {
    type: String,
    default: '选品理由'
  },
  width: {
    type: String,
    default: '868px'
  }
})
const dialogWidth = ref('560px')
const emit = defineEmits(['update:modelValue', 'confirm', 'close', 'success'])
const visible = ref(false)
const formRef = ref()
const localForm = ref({
  chooseReason: ''
})

// 打开
const open = async () => {
  visible.value = true
  localForm.value = { chooseReason: '' }
}

defineExpose({ open })

onMounted(() => { })

const formRules = reactive({})

const handleClose = () => {
  visible.value = false
  emit('success', localForm.value.chooseReason)
}
const resetForm = () => { }

const confirmDialog = debounce(async () => {
  saveIsOnShelfConfirm()
})

const saveIsOnShelfConfirm = async () => {
  emit('success', localForm.value.chooseReason)
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
