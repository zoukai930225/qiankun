<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" :bigDialog="true" class="commomDialig">
    <el-form ref="formRef" :model="formData" :rules="formRules" :inline="true">
      <div class="drawerContent">
        <el-form-item label="奖池名称" prop="name" style="width: 80%" required>
          <el-input class="dialogFormItemWidth" v-model="formData.name" placeholder="请输入奖池名称" />
        </el-form-item>
        <el-form-item prop="value" label-width="0" style="width: 80%">
          <s-text-area v-model="formData.value" placeholder="请输入配置" style="width: 100%"
            :autosize="{ minRows: 20, maxRows: 20 }" />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
defineOptions({ name: 'AddOrEditePool' })
import STextArea from "@/components/common/input/s-textarea.vue";
import { getLotteryDetail, createOrUpdateLottery } from '@/api/system/lottery'
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示'
const formLoading = ref(false)
const dialogTitle = ref('')

const formData = ref({
  id: undefined,
  name: '',
  value: '',
  status: 2
})
// 表单校验
const formRules = reactive({
  name: [{ required: true, message: '请输入奖池名称', trigger: 'blur' }]
})
const currentId = ref()
/** 打开弹窗 */
const open = (id: String) => {
  dialogVisible.value = true
  formData.value.name = ''
  formLoading.value = false
  dialogTitle.value = !id ? '新增' : '编辑'
  resetForm()
  if (id) {
    currentId.value = id
    getDetail()
  }
}
const getDetail = async () => {
  const res = await getLotteryDetail(currentId.value)
  formData.value = {
    ...res
  }
}
/** 重置表单 */
const resetForm = () => {
  formRef.value?.resetFields()
  formData.value = {
    id: undefined,
    name: '',
    value: '',
    status: 2
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const formRef = ref()
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
/** 提交表单 */
const submitForm = async () => {
  // uploadRef.value!.submit()
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return

  formLoading.value = true
  const params = {
    ...formData.value
  }
  try {
    await createOrUpdateLottery(params)
  } finally {
    formLoading.value = false
  }

  message.success('操作成功')
  dialogVisible.value = false
  emit('success')
}
</script>

<style lang="scss" scoped>
.lottery-title {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  margin-bottom: 14px;

  .add-btn {
    display: flex;
    line-height: 20px;
    cursor: pointer;
    color: #0064ff;

    .mr-5px {
      padding-top: 2px;
      margin-right: 0;
    }
  }
}

.jackpot-wrap {
  .lottery-title {
    margin-top: 0;
  }
}

.jackpot-content {
  border: 1px solid #dbe1e4;
  border-radius: 10px;
  padding: 20px 0;

  ul,
  li {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .pool {
    &-list {
      display: flex;
    }

    &-item {
      margin: 0 20px;
      padding: 0 8px 0 20px;
      height: 32px;
      line-height: 32px;
      background: #dce5fe;
      border-radius: 16px;
      cursor: pointer;
    }
  }
}

:deep(.close-btn) {
  padding-top: 2px;
  cursor: pointer;
}

.export-select {
  margin-right: 20px;
}

:deep(.el-button.export-btn) {
  background: #ecf2f9;
}
</style>
