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
            <el-form ref="formRef" :model="localForm" :rules="formRules" label-width="120px">
              <el-form-item v-if="isOperationMember" label="店铺" class="formItem" prop="store">
                <el-select
                  class="formItem"
                  v-model="localForm.store"
                  placeholder="请选择店铺"
                  clearable
                  :disabled="forbidEdit"
                >
                  <el-option
                    v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_STORE, true)"
                    :key="dict.value"
                    :label="dict.shortName"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="isOperationMember"
                label="商品ID"
                class="formItem"
                prop="productId"
              >
                <el-input
                  v-model="localForm.productId"
                  placeholder="请输入商品ID"
                  :disabled="forbidEdit"
                />
              </el-form-item>
              <el-form-item
                v-if="isOperationMember"
                label="实际上架时间"
                class="formItem"
                prop="actualShelfTime"
              >
                <el-date-picker
                  style="width: 460px"
                  v-model="localForm.actualShelfTime"
                  type="datetime"
                  format="YYYY-MM-DD HH:mm"
                  value-format="YYYY-MM-DD HH:mm"
                  placeholder="请选择上架时间"
                  :disabled="forbidEdit"
                />
              </el-form-item>
              <el-form-item
                v-if="isVisualMember"
                label="实际拍摄时间"
                class="formItem"
                prop="shootTime"
              >
                <el-date-picker
                  style="width: 460px"
                  v-model="localForm.shootTime"
                  type="datetime"
                  format="YYYY-MM-DD HH:mm"
                  value-format="YYYY-MM-DD HH:mm"
                  placeholder="请选择拍摄时间"
                  :disabled="forbidEdit"
                />
              </el-form-item>
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

import { updateDesign, saveDesign, getDesignDetailById } from '@/api/oa/new/designGallery/index'

import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

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
  store: '',
  productId: '',
  shootTime: '',
  operationTime: '',
  actualShelfTime: ''
})
const formRef = ref()
const isOperationMember = ref(false)
const isVisualMember = ref(false)
const realTitle = ref('')
// 打开
const open = async (data: any, permission: string) => {
  // 信息获取
  const res = await getDesignDetailById(data.npDesignPictureGodownId)
  delete res.jsonData
  if (res) localForm.value = { ...res }
  realTitle.value = (data && data.nodeName) || ''
  visible.value = true
  if (permission === 'OperationTimeFilling') {
    isOperationMember.value = true
  } else {
    isOperationMember.value = false
  }
  if (permission === 'VisualTimeFilling') {
    isVisualMember.value = true
  } else {
    isVisualMember.value = false
  }
}

defineExpose({ open })

onMounted(() => {})

const formRules = reactive({
  store: [{ required: true, message: '请选择店铺', trigger: 'change' }],
  productId: [{ required: true, message: '请输入商品ID', trigger: 'blur' }],
  actualShelfTime: [{ required: true, message: '请选择上架时间', trigger: 'blur' }],
  shootTime: [{ required: true, message: '请选择拍摄时间', trigger: 'blur' }]
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
<style lang="scss" scoped>
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
  .formItem {
    width: 460px;
  }
}
</style>
