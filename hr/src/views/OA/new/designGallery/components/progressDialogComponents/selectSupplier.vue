<!--
 * @Date: 2025-07-22 08:46:34
-->
<template>
  <el-dialog v-model="dialogVisible" :show-close="false" @close="handleClose" style="
      width: 570px;
      background: linear-gradient(226deg, #ffffff 0%, #ffffff 88%, #e8f6fd 95%, #f0f8ff 100%);
      border-radius: 14px;
    ">
    <template #header>
      <div class="header">
        <div>重新匹配供应商</div>
        <img src="@/assets/imgs/common/close.png" alt="" @click="dialogVisible = false" />
      </div>
    </template>
    <div class="container">
      <el-form :model="form" label-width="100px" ref="formRef" :rules="rules">
        <el-form-item label="供应商名称" prop="supplierId">
          <el-select v-model="form.supplierId" filterable placeholder="请选择供应商">
            <el-option v-for="item in supplierList" :key="item.id" :label="item.supplierName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="匹配原因" prop="matchReason">
          <s-text-area v-model="form.matchReason"  />
        </el-form-item>
        <el-form-item label="预估报价" prop="matchPrice">
          <el-input v-model="form.matchPrice" />
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submitForm" :loading="loading">提 交</el-button>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { queryReMatchSupplierList, reMatchSupplier } from '@/api/oa/new/designGallery/index'
const dialogVisible = ref(false)
const message = useMessage() // 消息弹窗

const form = ref({
  matchReason: '',
  attachmentUrl: '',
  supplierId: '',
  matchPrice: ''
})
const supplierList = ref([]) // 假设这是从API获取的供应商列表

const currentDetail = ref()
const open = (item) => {
  console.log('打开齐色样上传弹窗', item)
  dialogVisible.value = true
  currentDetail.value = item
  initSelectData()
}

const rules = {
  supplierId: [{ required: true, message: '请选择供应商', trigger: 'change' }],
  matchReason: [{ required: true, message: '请输入匹配原因', trigger: 'blur' }],
  matchPrice: [{ required: true, message: '请输入预估报价', trigger: 'blur' }]
}

const loading = ref(false) // 提交按钮加载状态

const initSelectData = async () => {
  const params = { npPictureId: currentDetail.value.id }
  const res = await queryReMatchSupplierList(params)
  console.log('重新匹配供应商列表', res)
  supplierList.value = res || []
}

const emit = defineEmits(['success']) // 定义 success 事件
const formRef = ref() // 表单引用
const submitForm = async () => {
  // 校验表单
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return
  //二次确认提交逻辑
  message
    .confirm('是否重新匹配供应商', '系统提示')
    .then(async () => {
      // 提交逻辑
      console.log('提交表单', form.value)
      const data = {
        npPictureId: currentDetail.value.id,
        supplierId: form.value.supplierId,
        matchReason: form.value.matchReason,
        matchPrice: form.value.matchPrice
      }
      await reMatchSupplier(data)
      message.success('操作成功')
      emit('success') // 提交成功后触发 success 事件
      handleClose()
    })
    .catch(() => {
      console.log('取消提交')
    })
}

const handleClose = () => {
  form.value = {
    matchReason: '',
    attachmentUrl: '',
    supplierId: '',
    matchPrice: ''
  }
  dialogVisible.value = false
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
