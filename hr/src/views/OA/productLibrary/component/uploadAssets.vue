<template>
  <el-form :model="formModel" ref="formRef" :rules="formRules">
    <el-form-item prop="docUrl" label="共享素材">
      <!-- <el-input v-model="formModel.inputVModel" placeholder="请输入"></el-input> -->
      <transfer
        style="width: 334px"
        v-model="formModel.docUrl"
        :uploadData="{ code: 'PRODUCT_REPOSITORY' }"
        width="100%"
        :tip="'最多上传5张大小不超过20M的图片'"
        :limit="5"
      />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import request from '@/config/axios'
const message = useMessage()
const props = defineProps({
  goodsId: {
    type: String,
    default: ''
  },
  productCode: {
    type: String,
    default: ''
  }
})
const formModel = ref({
  docUrl: ''
})

const formRules = ref({
  docUrl: [{ required: true, message: '请选择共享素材', trigger: 'change' }]
})

const formRef = ref(),
  loading = ref(false)

const submit = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return
  loading.value = true
  try {
    const data = {
      wdtGoodsId: props.goodsId,
      productCode: props.productCode,
      materialType: 2,
      ...formModel.value
    }
    await request.post({ url: '/api/pr/material/save', data })
    message.success('上传成功')
    return true
  } finally {
    loading.value = false
  }
}

defineExpose({ submit })
</script>

<style lang="scss" scoped></style>
