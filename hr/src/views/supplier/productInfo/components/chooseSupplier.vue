<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :modal-append-to-body="true"
      :width="450"
      :show-close="false"
    >
      <template #header>
        <div class="header-content">
          <div class="header-title">选择供应商</div>
          <img
            src="@/assets/imgs/serviceConfiguration/close.png"
            alt=""
            @click="dialogVisible = false"
          />
        </div>
      </template>
      <div class="form">
        <div v-if="!supplierName" class="form-info"> 您选择的货品暂未配置供应商 </div>
        <div v-else class="form-info">
          您选择的货品已配置供应商：
          <div class="form-info-value">{{ supplierName }}</div>
        </div>

        <div class="form-content">
          <el-form
            ref="formRef"
            v-loading="formLoading"
            :model="formData"
            :rules="formRules"
            :label-width="70"
          >
            <el-form-item label="供应商" prop="supplierIds">
              <el-select
                class="dialogFormItemWidth"
                v-model="formData.supplierIds"
                placeholder="请选择"
                clearable
                multiple
                filterable
              >
                <el-option
                  v-for="dict in productInfoData.supplierList"
                  :key="dict.id"
                  :label="dict.fullCompany"
                  :value="dict.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <template #footer>
        <el-button :disabled="formLoading" type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
defineOptions({ name: 'ExceptionHandleDialog' })
import * as productInfoApi from '@/api/supplier/productInfo'

import { productInfoStore } from '@/store/modules/productInfo'
const productInfoData = productInfoStore()

const message = useMessage()

const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 数据加载是否中

const formRef = ref()

const formData = ref<any>({
  goodsIds: [], // 货品ID
  supplierIds: [] // 供应商ID
})

// 重置数据
const resetForm = () => {
  supplierName.value = '' // 清空供应商名称
  selectedProducts.value = [] // 清空之前的选中数据
  formData.value = {
    goodsIds: [], // 重新设置货品ID
    supplierIds: [] // 清空供应商ID
  }
  formRef.value?.resetFields()
}

const formRules = reactive({
  supplierIds: [{ required: true, message: '请选择供应商', trigger: 'change' }]
})

const selectedProducts = ref([]) // 用于存储选中的产品数据

/** 打开弹窗 */
const open = async (data: any) => {
  dialogVisible.value = true
  resetForm()
  selectedProducts.value = data
  try {
    formLoading.value = true
    await getProductSupplier() // 获取供应商信息
  } catch (error) {
    console.error('获取供应商信息失败', error)
  } finally {
    formLoading.value = false
  }
}

// 根据传入的货品id去获取绑定的供应商信息
const supplierName = ref('') // 用于存储供应商名称
const getProductSupplier = async () => {
  formData.value.goodsIds = selectedProducts.value.map((item) => item.goodsId)

  const res = await productInfoApi.getProductSupplier({ goodsIds: formData.value.goodsIds })
  if (res) {
    supplierName.value = res.map((item) => item.supplierName).join(',')
    console.log('--', supplierName.value)
  }

  console.log('获取供应商信息', res)
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  await formRef.value.validate()

  // 提交请求
  formLoading.value = true
  try {
    await message.confirm('确定要更改选中的货品的供应商吗?')
    const data = formData.value as any
    await productInfoApi.updateProductSupplier(data)
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
  &-info {
    background: #fff;
    padding: 10px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    &-value {
      color: #333;
      font-weight: bold;
      margin: 4px 0 0;
    }
  }
  &-content {
    margin: 20px 0;
  }
}
</style>
