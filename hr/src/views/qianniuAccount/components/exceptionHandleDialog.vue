<template>
  <div>
    <el-dialog v-model="dialogVisible" :modal-append-to-body="true" :width="450" :show-close="false">
      <template #header>
        <div class="header-content">
          <div class="header-title">异常处理</div>
          <img src="@/assets/imgs/serviceConfiguration/close.png" alt="" @click="dialogVisible = false" />
        </div>
      </template>
      <div class="form">
        <div class="exception-reason">
          <div class="exception-reason-title">异常原因</div>
          <div class="exception-reason-content">{{ currentData.exceptionCause }}</div>
        </div>
        <div class="exception-result">
          <div class="exception-result-title">处理结果</div>
          <el-form ref="formRef" label-width="0" v-loading="formLoading" :model="currentData" :rules="formRules">
            <el-form-item label="" prop="exceptionDispose">
              <s-text-area v-model.trim="currentData.exceptionDispose" placeholder="请输入" class="dialogFormItemWidth"
                style="width: 100%" :rows="5" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <template #footer>
        <el-button :disabled="formLoading" type="primary" @click="submitForm">提 交</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
defineOptions({ name: 'ExceptionHandleDialog' })
import STextArea from "@/components/common/input/s-textarea.vue";
import * as qianniuAccountApi from '@/api/qianniuAccount'
const message = useMessage()

const dialogVisible = ref(false) // 弹窗的是否展示
const currentData = ref({
  id: '', // 异常id
  exceptionCause: '', // 当前异常的原因
  exceptionDispose: '' // 异常处理结果
})
const formLoading = ref(false) // 数据加载是否中

const formRef = ref()
const resetForm = () => {
  currentData.value = {
    id: '',
    exceptionCause: '',
    exceptionDispose: ''
  }
  formRef.value?.resetFields()
}

const formRules = reactive({
  exceptionDispose: [{ required: true, message: '请输入处理结果', trigger: 'blur' }]
})

/** 打开弹窗 */
const open = async (row) => {
  dialogVisible.value = true
  resetForm()
  currentData.value = {
    id: row.id,
    exceptionCause: row.exceptionCause,
    exceptionDispose: row.exceptionDispose
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  console.log('--', valid)
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = currentData.value as any
    delete data.exceptionCause
    // console.log('data', data)
    await qianniuAccountApi.handleError(data)
    message.success('提交成功')

    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}
</script>

<style scoped lang="scss">
:deep(.el-dialog) {
  border-radius: 14px;
  background-image: url('@/assets/imgs/serviceConfiguration/bg.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 410px;
}

:deep(.el-textarea__inner) {
  resize: none;
}

.header-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;

  .header-title {
    font-weight: bold;
  }

  img {
    width: 14px;
    height: 14px;
    cursor: pointer;
  }
}

.form {
  box-sizing: border-box;

  .exception-reason,
  .exception-result {
    background: #fff;
    border-radius: 6px;
    padding: 4px 10px;
    box-sizing: border-box;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 8px;
    font-size: 12px;

    &-title {
      font-size: 14px;
      margin-bottom: 6px;
      font-weight: bold;
      color: #333;

      &:before {
        content: '';
        display: inline-block;
        width: 2px;
        height: 12px;
        background-color: #333;
        vertical-align: middle;
        margin-right: 4px;
      }
    }
  }

  .exception-reason {
    height: 100px;

    &-content {
      height: 65px;
      overflow-y: auto;
    }
  }
}
</style>
