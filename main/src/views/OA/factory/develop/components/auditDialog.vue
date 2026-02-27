<!--
 * @Date: 2025-02-11 17:22:22
-->
<template>
  <div v-if="visible">
    <el-dialog v-model="visible" :width="width" :before-close="handleClose" @open="resetForm"
      class="oadialog-background" style="border-radius: 20px" :append-to-body="true">
      <div v-loading="loading" element-loading-text="正在审核,请稍候...">
        <div class="dialog-content" style="width: 456px; height: 252px; overflow: hidden">
          <el-form ref="ruleFormRef" :model="form" label-width="auto"
            style="max-width: 600px; margin-left: 22px; padding-top: 10px" :rules="rules" label-position="left">
            <el-form-item label="是否通过审核：" prop="status">
              <el-radio-group v-model="form.status">
                <div style="
                    border-bottom: 1px solid #eaeced;
                    width: 294px;
                    margin-bottom: 10px;
                    padding-bottom: 10px;
                  ">
                  <el-radio value="1" style="width: 100%; font-size: 16px"> 审核通过</el-radio>
                </div>

                <el-radio value="0" style="width: 100%; font-size: 16px"> 审核拒绝</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="form.status === '0'" label="备注：" prop="examineRemark">
              <s-text-area style="width: 294px" v-model="form.examineRemark" placeholder="请输入备注" :rows="4"
                :autosize="{ minRows: 4, maxRows: 4 }" />
            </el-form-item>
            <el-form-item v-else label="备注：">
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
          <el-button type="primary" @click="confirmDialog">提交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { auditSupplierFlow } from '@/api/oa/factory/plan/index'

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
  status: '',
  examineRemark: ''
})

const rules = reactive({
  status: [{ required: true, message: '请选择是否通过审核', trigger: 'blur' }],
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
  form.status = ''
  form.examineRemark = ''
  emit('update:modelValue', false)
}

const resetForm = () => {
  form.status = ''
  form.examineRemark = ''
}

const loading = ref()

const ruleFormRef = ref()
const confirmDialog = async () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      const data = {
        taskDefinitionKey: "FsDevPlanExamine",
        fsTaskId: props.selectItem.id,
        supplierId: undefined,
        auditStatus: form.status,
        auditComment: form.examineRemark,
        auditFile: ''
      }
      // if (form.status === '2') {
      //   // 拒绝审核二次确认
      //   await message.confirm('确定拒绝该企划方案吗？请确定在备注栏已填写具体的拒绝原因！')
      // }
      try {
        loading.value = true
        await auditSupplierFlow(data)
        loading.value = false
        message.success('操作成功')
        emit('confirm')
        emit('update:modelValue', false)
        resetForm()
      } catch {
        loading.value = false
      } finally {
        loading.value = false
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
