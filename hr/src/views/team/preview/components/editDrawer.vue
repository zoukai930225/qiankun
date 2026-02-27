<template>
  <div>
    <el-drawer custom-class="editDrawer" v-model="dialogVisible" :title="dialogTitle" size="968">
      <div class="editBg">
        <div class="row" style="padding-top: 20px">
          <div class="row-label">姓名</div>
          <div class="row-value">{{ formData.name || '--' }}</div>
        </div>
        <div class="row">
          <div class="row-label">部门</div>
          <div class="row-value">{{ formData.dept || '--' }}</div>
        </div>
        <div class="row">
          <div class="row-label">目标金额</div>
          <el-input
            v-model="formData.targetAmount"
            placeholder="请输入"
            class="row-input"
            clearable
          />
        </div>
        <div class="row-center" style="margin-top: 20px"
          ><el-button @click="dialogVisible = false" style="margin-left: auto">取 消</el-button>
          <el-button
            :disabled="formLoading"
            type="primary"
            style="margin-right: 20px"
            @click="submitForm"
            >提 交</el-button
          ></div
        >
      </div>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
import * as BiBilityAuthorityApi from '@/api/biBilityAuthority'

const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用

const formData = ref({
  id: '',
  name: '',
  dept: '',
  targetAmount: ''
})

/** 打开弹窗 */
const open = async (id: string) => {
  dialogVisible.value = true
  dialogTitle.value = '编辑'
  const data = await BiBilityAuthorityApi.biResponsibilityAuthorityInfo(id)
  if (data) {
    formData.value = data
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const submitForm = async () => {
  if (!formData.value.targetAmount) {
    message.warning('请填写目标金额')
    return
  }
  // 提交请求
  formLoading.value = true
  try {
    await BiBilityAuthorityApi.biResponsibilityAuthoritySave(formData.value)
    message.success('编辑成功')
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
</script>

<style lang="scss" scoped>
.editDrawer {
}
.editBg {
  margin-top: -20px;
  margin-left: 20px;
  margin-right: 20px;
  height: 220px;
  background: #ffffff;
  border-radius: 8px;

  .row {
    margin-left: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 32px;
    margin-bottom: 14px;
    &-label {
      line-height: 32px;
      font-size: 12px;
      color: #666666;
      width: 62px;
    }
    &-value {
      font-size: 12px;
      padding-left: 16px;
      color: #999999;
      line-height: 20px;
      text-align: left;
    }
    &-input {
      margin-left: 8px;
      margin-right: 20px;
      height: 32px;
      background: #f8f8f9;
    }
  }
}
:deep(.el-drawer__body) {
  background: #f8f9fb;
}
:deep(.el-drawer) {
  background: linear-gradient(102deg, #ecf0f9 0%, #effdfd 100%);
  border-radius: 12px 0px 0px 0px;
}
:deep(.el-drawer__body) {
  background: linear-gradient(102deg, #ecf0f9 0%, #effdfd 100%);
}
:deep(.el-input__wrapper) {
  background: #f8f8f9;
  border-radius: 4px;
  box-shadow: none;
}
</style>
