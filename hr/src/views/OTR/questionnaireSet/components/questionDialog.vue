<!--
 * @Date: 2024-10-12 14:05:20
-->
<template>
  <div>
    <Dialog
      v-model="dialogTableVisible"
      title="设置问卷"
      width="90%"
      @close="close"
      :before-close="handleClose"
    >
      <Tabs :currentTab="currentTab" />

      <div class="content">
        <!-- 前导页 -->
        <div v-show="currentTab == 0">
          <el-form
            class="dialogForm"
            ref="formRef"
            :model="formData"
            :rules="formRules"
            label-width="120px"
          >
            <el-form-item label="问卷名称" prop="surveyName">
              <el-input
                class="dialogFormItemWidth"
                v-model="formData.surveyName"
                placeholder="请输入问卷名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="强制停留时间" prop="leadStopTime">
              <el-input
                class="dialogFormItemWidth"
                v-model="formData.leadStopTime"
                placeholder="请输入强制停留时间"
                clearable
                type="number"
              />
              <span style="margin-left: 5px">秒</span>
            </el-form-item>

            <el-form-item label="前导页内容" prop="leadContent">
              <Editor class="leadEditor" v-model:modelValue="formData.leadContent" height="400px" />
            </el-form-item>
          </el-form>
        </div>
        <div class="btn-wapper">
          <el-button v-if="currentTab == 0" type="primary" @click="next">下一步</el-button>
          <el-button v-if="currentTab == 1" type="primary" @click="preStep">上一步</el-button>
          <el-button v-if="currentTab == 1" type="primary" @click="save">保存</el-button>
        </div>
        <!-- 题目编辑 -->
        <div v-if="currentTab == 1" style="margin-bottom: 40px">
          <EditQuestion
            ref="EditQuestionRef"
            :programDtoList="programDtoList"
            :wapperDetail="wapperDetail"
            :id="id"
            @reset="resetList"
            @pre-change="preChange"
            @preview="preview"
          />
        </div>
      </div>

      <!-- 预览  -->
      <PrewView ref="prewViewRefs" />
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import Tabs from './tabs.vue'
import { Editor } from '@/components/Editor'
import EditQuestion from './editQuestion.vue'
import PrewView from './previewView.vue'
import { surveySave, getSurveyById, resetRestore } from '@/api/otr/questionnaireSet/index'
const message = useMessage()

const dialogTableVisible = ref(false)
const currentTab = ref(0)

// form表单
const formData = reactive({
  surveyName: undefined, //问卷名称
  leadStopTime: 5, //强制停留时间
  leadContent: ''
})

const formRules = reactive({
  surveyName: [{ required: true, message: '请输入问卷名称', trigger: 'blur' }]
})

// 下一步
const next = () => {
  currentTab.value = 1
}
const preStep = () => {
  currentTab.value = 0
}
const emit = defineEmits(['success'])

const checkWeightSum = (arr) => {
  let sum = 0
  // 计算所有对象的weight字段的总和
  arr.forEach((obj) => {
    sum += Number(obj.weight)
  })
  return sum == 100
}
const EditQuestionRef = ref()
// 保存
const save = async () => {
  if (!formData.surveyName) {
    message.error('问卷名称不能为空')
    return
  }
  const list = EditQuestionRef.value.list
  // 所有选择题
  const arr = list.filter((item) => {
    if (item.type == 0) {
      return item
    }
  })
  if (arr.length) {
    const flag = checkWeightSum(arr)
    if (!flag) {
      message.error('单选题权重之和不等于100%，请检查后重新提交')
      return
    }
  }
  programDtoList.value = list

  try {
    const params = {
      id: id.value,
      ...formData,
      programDtoList: list
    }
    await surveySave(params)
    message.success('操作成功')
    reset()
    dialogTableVisible.value = false
    emit('success')
  } catch (error) {}
}

// 重制按钮
const resetList = async () => {
  try {
    const res = await resetRestore(id.value)
    programDtoList.value = res || []
    message.success('操作成功')
  } catch (error) {}
}

// 上一步
const preChange = () => {
  currentTab.value = 0
}

const prewViewRefs = ref()
// 预览
const preview = (value) => {
  const detail = {
    ...formData,
    programDtoList: value
  }
  prewViewRefs.value.open(detail)
}

// 清空
const reset = () => {
  formData.surveyName = undefined
  formData.leadStopTime = 5
  formData.leadContent = ''
}

const programDtoList = ref() //题目(项目)与等级数据集合
const id = ref('')
const wapperDetail = ref()

// 打开
const open = async (currentId) => {
  id.value = currentId
  dialogTableVisible.value = true
  try {
    reset()
    const res = await getSurveyById(currentId)
    // 前导页内容设置
    formData.surveyName = res.surveyName
    formData.leadStopTime = res.leadStopTime
    formData.leadContent = res.leadContent
    //题目(项目)与等级数据集合
    programDtoList.value = res.programDtoList
    wapperDetail.value = res
  } catch (error) {}
}

const handleClose = (done: () => void) => {
  ElMessageBox.confirm(`问卷未保存，会丢失当前设置，请问是否关闭`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    done()
    close()
  })
}

const close = () => {
  dialogTableVisible.value = false
  id.value = ''
  currentTab.value = 0
  formData.surveyName = undefined
  formData.leadStopTime = 5
  formData.leadContent = ''
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
.content {
  padding-top: 16px;
  position: relative;
  min-width: 1400px;
}

.btn-wapper {
  position: fixed;
  display: flex;
  flex-direction: row;
  justify-content: end;
  right: 0px;
  bottom: 0px;
  margin-right: 30px;
  padding-bottom: 10px;
  width: calc(100% - 30px);
  background: #fff;
  z-index: 99;
}
.leadEditor {
  margin-bottom: 50px;
}
</style>

<style scoped>
:deep(.el-dialog) {
  padding: 0px;
  box-shadow: 10px 10px 24px 0px rgba(0, 0, 0, 0.07);
}
:deep(.com-dialog .el-dialog__body) {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  max-height: 85vh;
  min-height: 85vh;
}
:deep(.com-dialog .el-dialog__header) {
  border-bottom: none;
  font-weight: 500;
  font-size: 16px;
  color: #333333;
  line-height: 22px;
}
</style>
