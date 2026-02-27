<!--双击备注-->

<template>
  <div class="assignment">
    <el-dialog
      v-model="visible"
      :show-close="false"
      width="800"
      align-center
      destroy-on-close
      @close="close"
      class="oadialog-background1"
    >
      <div class="wapper">
        <el-form :model="addForm" label-width="auto" label-position="left" ref="formRef">
          <el-form-item label="备注" prop="remark">
            <!-- <s-text-area v-model="addForm.remark" :rows="4" placeholder="请输入备注" /> -->
            <Editor
              class="leadEditor"
              ref="EditorRef"
              v-model:modelValue="addForm.remark"
              height="200px"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #header="{ close: closeDialog }">
        <div class="my-header">
          <span class="title">任务指派</span>
          <img src="@/assets/imgs/team/closeD.png" @click="closeDialog" class="closeD" />
        </div>
      </template>
      <template #footer>
        <div>
          <div class="btn-wapper">
            <el-button type="primary" style="width: 64px; height: 32px" @click="onSubmit"
              >保存</el-button
            >
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { getCalendarRemarks, saveCalendarRemark } from '@/api/team/index'
import { Editor } from '@/components/Editor'
defineOptions({ name: 'Remark' })
const message = useMessage() // 消息弹窗
const visible = ref(false)

const props = defineProps({
  node: {
    type: Number
  },
  subNode: {
    type: String
  },
  currentDetail: {
    type: Object
  },
  isVisualDashboard: {
    //是从日历过来的
    type: Boolean,
    default: false
  }
})

let addForm = reactive({
  remark: '' as string | undefined //备注
})

const emit = defineEmits(['success', 'cancle', 'addRemarkSuccess'])
const user = ref<any>({
  calendarDate: undefined,
  userId: undefined,
  dept: undefined,
  name: undefined,
  node: undefined,
  subNode: undefined,
  start: undefined,
  end: undefined,
  processNode: undefined
})

const formRef = ref()
const onSubmit = async () => {
  const data = {
    node: user.value.processNode.split(',')[0],
    subNode: user.value.processNode.split(',')[1],
    userId: user.value.userId,
    calendarDate: user.value.calendarDate,
    remark: addForm.remark
  }
  const res = await saveCalendarRemark(data)
  message.success('保存成功')
  emit('addRemarkSuccess', {
    remark: addForm.remark,
    calendarDate: user.value.calendarDate,
    processNode: user.value.processNode,
    userId: user.value.userId,
    newItem: res
  })
  close()
}
const EditorRef = ref()
const close = () => {
  reset()
  visible.value = false
}

const reset = () => {
  user.value = {
    calendarDate: undefined,
    userId: undefined,
    dept: undefined,
    name: undefined,
    node: undefined,
    subNode: undefined,
    start: undefined,
    end: undefined
  }
  // 重置 remark
  addForm.remark = ''
  EditorRef.value = null
  emit('cancle')
}

const open = (item) => {
  visible.value = true
  user.value = item
  initData()
}

const initData = async () => {
  const res = await getCalendarRemarks({
    group: user.value.dept,
    userName: user.value.name,
    start: user.value.start,
    end: user.value.end,
    node: user.value.processNode.split(',')[0],
    subNode: user.value.processNode.split(',')[1],
    queryProcessNodes: user.value.processNode
  })
  console.log('res', res)
  res.findIndex((item) => {
    if (item.processNode == user.value.processNode) {
      item.remarks.forEach((it) => {
        if (it.calendarDate == user.value.calendarDate) {
          nextTick(() => {
            addForm.remark = it.remark
          })
          return true
        }
      })
    }
  })
  console.log(' addForm.remark', addForm.remark)
}

defineExpose({ open, close })
</script>

<style scoped lang="scss">
.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .title {
    font-size: 14px;
    color: #333333;
  }

  .closeD {
    width: 16px;
    height: 16px;
  }
}

:deep(.el-dialog__header) {
  margin-right: 0;
}

.btn-wapper {
  display: flex;
  flex-direction: row;
  justify-content: end;
  width: 100%;
}

.wapper {
  padding: 16px 16px 10px 16px;
  border-radius: 12px;
  box-sizing: border-box;
  background: #ffffff;
}

:deep(.el-select__wrapper),
:deep(.el-input__wrapper) {
  min-height: 32px;
  background: #fafafa;
  border-radius: 4px;
}

.eloption .el-select-dropdown__wrap .el-select-dropdown__item {
  height: 50px !important;
}

:deep(.el-dialog) {
  border-radius: 20px;
  background-image: url('@/assets/imgs/oa/oa_design_audit_bg.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>
