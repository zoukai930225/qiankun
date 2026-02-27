<template>
  <div class="confirm-dialog">
    <el-dialog v-model="dialogVisible" :width="488">
      <template #header>
        <div class="header">
          <img src="@/assets/imgs/common/warning_icon.png" alt="" class="header-icon" />
          <span class="header-title">{{ title }}</span>
        </div>
      </template>
      <div class="content">
        <div class="mb-16px">{{ content }}</div>
        <el-form
          ref="queryFormRef"
          :inline="true"
          label-width="80px"
          @submit.prevent
          :rules="formRules"
          :model="queryParams"
        >
          <el-form-item label="关联问卷" prop="questionnaireId">
            <el-select
              class="searchFormItemWidth"
              v-model="queryParams.questionnaireId"
              placeholder="请选择问卷"
              clearable
            >
              <el-option
                v-for="dict in surveyList"
                :key="dict.id"
                :label="dict.surveyName"
                :value="dict.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ cancelText }}</el-button>
        <el-button type="primary" @click="handleConfirm">{{ confirmText }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import * as OtrEvaluationRelationshipApi from '@/api/otr/evaluationRelationship/index'
import * as InventoryCalibrationApi from '@/api/otr/InventoryCalibration'
defineOptions({ name: 'ConfirmDialog' })
const dialogVisible = ref(false) // 弹窗的是否展示
const emit = defineEmits(['confirm', 'cancel'])
const props = defineProps({
  title: {
    type: String,
    default: '提示'
  },
  content: {
    type: String,
    default: ''
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  inventoryId: {
    type: String,
    default: ''
  }
})
const queryFormRef = ref()
const formRules = reactive({
  questionnaireId: [{ required: true, message: '请选择关联问卷', trigger: 'blur' }]
})
const queryParams = reactive({
  questionnaireId: ''
})
const appraiseeId = ref('') // 被评价人id
const surveyList = ref<any[]>([]) // 问卷列表
// 点击确认按钮
const handleConfirm = async () => {
  // 校验表单
  if (!queryFormRef) return
  const valid = await queryFormRef.value.validate()
  if (!valid) return
  dialogVisible.value = false
  console.log(queryParams.questionnaireId)
  const params = {
    appraiseeId: appraiseeId.value,
    inventoryId: props.inventoryId,
    newSurveyId: queryParams.questionnaireId
  }
  await InventoryCalibrationApi.cancelEvaluation(params).catch(() => {})
  emit('confirm')
}
/**
 * 查询问卷列表
 */
const getSurveyList = async () => {
  if (props.inventoryId) {
    const data = await OtrEvaluationRelationshipApi.getSurveyList(props.inventoryId).catch(() => {
      surveyList.value = []
    })
    if (data && data.length > 0) {
      surveyList.value = data || []
    }
  }
}

/** 打开弹窗 */
const open = async (id) => {
  await getSurveyList()
  dialogVisible.value = true
  appraiseeId.value = id
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<style lang="scss">
.confirm-dialog {
  .header-icon {
    width: 14px;
    vertical-align: middle;
    margin-right: 5px;
  }
  .header-title {
    font-size: 14px;
    color: #333333;
    line-height: 22px;
    font-weight: bold;
  }
  .content {
    font-size: 14px;
    color: #666666;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    margin-bottom: 10px;
  }
}
</style>
