<template>
  <Dialog class="commomDialig calDialog" v-model="dialogVisible" title="编辑">
    <el-form
      class="dialogForm"
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="130px"
    >
      <el-form-item label="成本类型" prop="costType">
        <el-select v-model="formData.costType" placeholder="请输入成本类型" style="width: 357px">
          <el-option label="ERP成本价" :value="1" />
          <el-option label="核算成本价" :value="2" />
        </el-select>
      </el-form-item>

      <div>
        <el-form-item label="价格" prop="cost">
          <el-input
            style="width: 357px; height: 32px"
            v-model="formData.cost"
            placeholder="请输入价格"
            :disabled="formData.costType === 1 ? true : false"
          />
        </el-form-item>
        <el-form-item label="生效时间" required prop="dateRange" style="width: 487px">
          <el-date-picker
            v-model="formData.dateRange"
            type="daterange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width: 100%; height: 32px"
            @change="changeDate"
            :prefix-icon="Clock"
            :disabled="formData.costType === 1 ? true : false"
          />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">保 存</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import * as productApi from '@/api/productManage'
import { Clock } from '@element-plus/icons-vue'
import { cloneDeep } from 'lodash-es'

const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用

const formData = ref({
  id: '',
  wdtGoodsNo: undefined,
  startDate: undefined,
  endDate: undefined,
  costType: undefined as number | undefined, // 成本类型 1-ERP成本价 2-核算成本价
  cost: undefined,
  dateRange: undefined
})
const validateCost = (rule, value, callback) => {
  if (value === '' || value === undefined || value === null) {
    callback(new Error('请输入价格'))
  } else if (parseFloat(value) < 0) {
    callback(new Error('价格不能为负数'))
  } else {
    callback()
  }
}
const formRules = reactive({
  costType: [{ required: true, message: '成本类型不能为空', trigger: 'blur' }],
  cost: [
    { required: true, message: '价格不能为空', trigger: 'blur' },
    { validator: validateCost, trigger: 'blur' }
  ],
  dateRange: [{ required: true, message: '请选择生效时间', trigger: 'change' }]
})

const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (data, wdtGoodsNo) => {
  dialogVisible.value = true
  resetForm()
  if (data.id) {
    formLoading.value = true
    try {
      nextTick(() => {
        formData.value = cloneDeep(data)
        formData.value.dateRange = [formData.value.startDate, formData.value.endDate] as any
        formData.value.wdtGoodsNo = wdtGoodsNo
        // console.log('打开弹窗', formData.value)
      })
    } finally {
      formLoading.value = false
    }
  }
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as any
    await productApi.getUpdateErpPrice(data)
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

// 日期选择
const changeDate = (val: any) => {
  formData.value.startDate = formatDate(val[0]) as any
  formData.value.endDate = formatDate(val[1]) as any
  // console.log('格式化', formatDate(val[0]))
}

// 日期格式化
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 限制只能选今天之后的时间
const pickerOptionsRang = (time) => {
  return time.getTime() < Date.now() - 8.64e7 // 8.64e7 毫秒数代表一天
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: '',
    wdtGoodsNo: undefined,
    startDate: undefined,
    endDate: undefined,
    costType: undefined,
    cost: undefined,
    dateRange: undefined
  }
  formRef.value?.resetFields()
}
</script>
<style lang="scss">
.calDialog .el-dialog__header {
  border-bottom: none;
}
.calDialog .el-input__inner {
  height: 32px;
}
</style>
