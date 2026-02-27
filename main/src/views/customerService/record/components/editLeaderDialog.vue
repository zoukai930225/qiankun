<template>
  <div>
    <Dialog
      :modal-append-to-body="false"
      v-model="dialogVisible"
      :title="dialogTitle"
      :hideHeader="true"
      :width="428"
    >
      <div class="maniContent">
        <div class="item">
          <div class="item-title">客服昵称</div>
          <el-input
            class="item-content"
            v-model="formData.customerNickName"
            placeholder="请输入客服昵称"
            :maxlength="10"
            :show-word-limit="true"
            clearable
          />
        </div>
        <div class="item">
          <div class="item-title">是否组长</div>
          <div class="item-content">
            <el-switch
              v-model="formData.isLeader"
              inline-prompt
              :active-value="1"
              :inactive-value="0"
            />
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      </template>
    </Dialog>
  </div>
</template>
<script lang="ts" setup>
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({})

const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (userInfo: any) => {
  dialogVisible.value = true
  resetForm()
  formData.value = {
    userId: userInfo.userId,
    name: userInfo.name,
    customerNickName: userInfo.customerNickName || `客服${userInfo.name}`,
    isLeader: userInfo.isLeader
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  dialogVisible.value = false
  // 发送操作成功的事件
  emit('success', formData.value)
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {}
  formRef.value?.resetFields()
}
</script>

<style scoped lang="scss">
.maniContent {
  display: flex;
  flex-direction: column;
  margin-left: 3px;
  margin-right: 25px;
  margin-top: 30px;
  .item {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 20px;
    margin-bottom: 45px;
    &-title {
      font-size: 14px;
      color: #666666;
      line-height: 20px;
      width: 80px;
      padding-right: 30px;
    }
    &-content {
      font-size: 14px;
      color: #333333;
      line-height: 20px;
    }
  }
}
:deep(.com-dialog .el-dialog__header) {
  height: 0px;
}
</style>

<style scoped>
:deep(.com-dialog .el-dialog__header) {
  height: 0px;
}
:deep(.el-switch.is-checked .el-switch__core) {
  background: #0064ff;
}
</style>

<style scoped>
:deep(.el-select__wrapper) {
  height: 32px;
  font-size: 14px;
  color: #333333;
  background: #f3f4f7;
  box-shadow: none;
  line-height: 22px;
  border-radius: 4px;
  padding-left: 20px;
}
:deep(.el-select__placeholder) {
  width: 95px;
  font-size: 14px;
  color: #333;
  line-height: 22px;
}
:deep(.el-input__wrapper) {
  border-radius: 4px;
}
:deep(.el-input__wrapper) {
  box-shadow: none;
  background: #f3f4f7;
  border-radius: 4px;
}
:deep(.el-input .el-input__count .el-input__count-inner) {
  background: transparent;
}
</style>
