<!--
 * @Date: 2025-07-22 08:46:34
-->
<template>
  <el-dialog title="应用范围" v-model="dialogVisible" :show-close="false" style="
      width: 570px;
      background: linear-gradient(226deg, #ffffff 0%, #ffffff 88%, #e8f6fd 95%, #f0f8ff 100%);
      border-radius: 14px;
    ">
    <template #header>
      <div class="header">
        <div>{{ currentDetail?.supplierName }}</div>
        <img src="@/assets/imgs/common/close.png" alt="" @click="dialogVisible = false" />
      </div>
    </template>
    <div class="container">
      <el-form :model="form" ref="formRef" label-position="right" label-width="90px" :rules="rules">
        <el-form-item label="淘汰原因" prop="remark">
          <s-text-area v-model="form.remark" placeholder="请输入淘汰原因" />
        </el-form-item>
        <el-form-item label="附件" prop="attachmentUrl">
          <SWUploadFile :style="{ width: 445 }" ref="attachmentUrlUploadFileRef" v-model:modelValue="form.attachmentUrl"
            :width="445" />
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm" :loading="loading">提 交</el-button>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { eliminateSupplier } from '@/api/oa/new/designGallery/index'
import SWUploadFile from '@/components/SWUoloadFile/index.vue'

const dialogVisible = ref(false)
const message = useMessage() // 消息弹窗

const form = ref({
  remark: '',
  attachmentUrl: []
})

const loading = ref(false) // 提交按钮加载状态

const currentDetail = ref()
const open = (item) => {
  dialogVisible.value = true
  currentDetail.value = item // 设置当前供应商详情
}
const formRef = ref() // 表单引用
const rules = {
  remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
}

const emit = defineEmits(['success']) // 定义 success 事件

const attachmentUrlUploadFileRef = ref() // 附件上传组件引用

const submitForm = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return
  //二次确认提交逻辑
  message
    .confirm(`淘汰供应商【${currentDetail.value.supplierName}】，是否确认？`, '系统提示')
    .then(async () => {
      const data = {
        id: currentDetail.value.id,
        remark: form.value.remark,
        attachmentUrl: ''
      }
      if (form.value.attachmentUrl && form.value.attachmentUrl.length > 0) {
        data.attachmentUrl = form.value.attachmentUrl
          .map((item) => {
            return item.url && item.url + '?name=' + item.name
          })
          .join(',')
      }
      loading.value = true // 开始加载状态
      await eliminateSupplier(data)
      loading.value = false // 结束加载状态
      // 提交逻辑
      console.log('提交表单', form.value)
      message.success('操作成功')
      emit('success') // 触发父组件的 success 事件
      form.value.remark = '' // 清空表单
      form.value.attachmentUrl = []
      dialogVisible.value = false
    })
    .catch(() => {
      loading.value = false // 结束加载状态
      console.log('取消提交')
    })
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<style lang="scss" scoped>
/* 隐藏滚动条，但保持滚动功能 */
::-webkit-scrollbar {
  display: none;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;

  img {
    width: 14px;
    cursor: pointer;
  }
}

.container {}
</style>
