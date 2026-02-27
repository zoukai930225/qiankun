<!--
 * @Date: 2025-02-11 17:22:22
-->
<template>
  <div>
    <el-dialog v-model="visible" :width="width" :before-close="handleClose" @open="resetForm"
      class="oadialog-background" style="border-radius: 20px">
      <div>
        <!-- <img src="@/assets/imgs/oa/oa_design_audit_bg.png" class="dialogBg" /> -->
        <div class="dialog-content" style="width: 456px; height: 262px; overflow: hidden">
          <el-form ref="ruleFormRef" :model="form" label-width="auto"
            style="max-width: 600px; margin-left: 22px; padding-top: 25px" :rules="rules" label-position="left">
            <el-form-item label="是否通过审核：" prop="examineStatus">
              <el-radio-group v-model="form.examineStatus">
                <div style="
                    border-bottom: 1px solid #eaeced;
                    width: 294px;
                    margin-bottom: 10px;
                    padding-bottom: 10px;
                  ">
                  <el-radio value="2" style="width: 100%; font-size: 16px"> 审核通过</el-radio>
                </div>

                <el-radio value="1" style="width: 100%; font-size: 16px"> 审核拒绝</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备注：" prop="examineRemark">
              <s-text-area style="width: 294px" v-model="form.examineRemark" placeholder="请输入备注" :rows="4"
                :autosize="{ minRows: 4, maxRows: 4 }" />
            </el-form-item>
          </el-form>
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
          <el-button type="primary" @click="confirmDialog" :loading="examineLoading">提交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { designExamine } from '@/api/oa/new/designGallery/index'
const message = useMessage() // 消息弹窗

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: '审核'
  },
  width: {
    type: String,
    default: '490px'
  },

  selectItem: {
    type: Object,
    default: () => ({})
  }
})

const form = reactive({
  examineStatus: '',
  examineRemark: ''
})

const rules = reactive({
  examineStatus: [{ required: true, message: '请选择是否通过审核', trigger: 'blur' }],
  examineRemark: [{ required: true, message: '请填写备注', trigger: 'blur' }]
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const visible = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newVal) => {
    visible.value = newVal
  }
)

const handleClose = () => {
  form.examineStatus = ''
  form.examineRemark = ''
  emit('update:modelValue', false)
}

const resetForm = () => {
  form.examineStatus = ''
  form.examineRemark = ''
}

const ruleFormRef = ref()
const examineLoading=ref(false)
const confirmDialog = async () => {
  if(examineLoading.value) return
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const data = {
          id: props.selectItem.id,
          developmentPlanId: props.selectItem.developmentPlanId,
          enterprisePlanId: props.selectItem.enterprisePlanId,
          productPicture: props.selectItem.productPicture,
          examineStatus: form.examineStatus,
          examineRemark: form.examineRemark
        }
        examineLoading.value=true
        await designExamine(data)
        examineLoading.value=false
        message.success('操作成功')
        emit('confirm')
        emit('update:modelValue', false)
      } finally {
        examineLoading.value=false
      }
    } else {
      return false
    }
  })
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
  width: 544px;
  height: 444px;
  z-index: -1;
}

:deep(.el-dialog) {
  /* background-image: url('@/assets/imgs/oa/oa_design_audit_bg.png') !important; */
  // background-size: cover !important;
  // width: 544px !important;
  // height: 444px !important;
  /* padding: 10px; */
}

:deep(.el-dialog__body) {
  /* background-image: url('@/assets/imgs/oa/oa_design_audit_bg.png') !important;
  background-size: cover !important;
  width: 496px !important;
  height: 396px !important; */
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
  }
}
</style>
