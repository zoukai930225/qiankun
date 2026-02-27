<!--
 * @Date: 2025-03-19 11:44:58
-->
<template>
  <div>
    <el-dialog v-model="dialogVisible" :before-close="handleClose" :show-close="false" title="员工备注" width="600">
      <div class="content-wapper">
        <el-form-item label="备注:" prop="noteType">
          <s-text-area v-model="employeeRemarks" :rows="6" placeholder="请输入员工备注" />
        </el-form-item>
      </div>
      <template #header="{ close }">
        <div class="my-header">
          <div class="flex-row" style="justify-content: space-between">
            <div class="flex-row">
              <img src="@/assets/imgs/hrAdmin/notes.png" class="title" alt="" />
              <div>备注</div>
            </div>
            <img src="@/assets/imgs/hrAdmin/close.png" alt="" class="close" @click="close" />
          </div>
        </div>
      </template>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="save"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { newEmployeeOnboard, newEmployeeOnboardupdate, saveNotes } from '@/api/hrAdmin/train/index'
const message = useMessage() // 消息弹窗

const employeeRemarks = ref()
const currentId = ref()

const dialogVisible = ref(false)

const handleClose = () => {
  employeeRemarks.value = ''
  currentId.value = ''
  dialogVisible.value = false
}

const newEmployeeLedId = ref()

const open = (params) => {
  currentId.value = params?.id
  newEmployeeLedId.value = params?.newEmployeeLedId
  if (currentId.value) {
    getDetail()
  }
  dialogVisible.value = true
}

const getDetail = async () => {
  const res = await newEmployeeOnboard(currentId.value)
  employeeRemarks.value = res?.employeeRemarks || ''
}

const emits = defineEmits(['success'])

// 保存
const save = async () => {
  const data = {
    userId: currentId.value,
    employeeRemarks: employeeRemarks.value
  }
  if (newEmployeeLedId.value) {
    await newEmployeeOnboardupdate(data)
    message.success('操作成功')
    dialogVisible.value = false
    emits('success')
  } else {
    await saveNotes(data)
    message.success('操作成功')
    dialogVisible.value = false
    emits('success')
  }
}

defineExpose({
  open
})
</script>

<style lang="scss" scoped>
:deep(.el-dialog) {
  background: url('@/assets/imgs/hrAdmin/remark-bg.png') no-repeat;
  background-size: 100% 100%;
}

.content-wapper {
  padding: 16px 20px;
  box-sizing: border-box;
  background: #ffffff;
  border-radius: 20px;
}

.title {
  width: 14px;
  height: 17px;
  margin-right: 10px;
}

.close {
  width: 14px;
  height: 14px;
  cursor: pointer;
}

.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
