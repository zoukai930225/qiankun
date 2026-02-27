<template>
  <el-form class="mt15px" ref="formRef" :model="formParams" :rules="formRules" label-width="80px"
  :disabled="viewType === 'see'">
    <el-form-item label="费用名称" prop="feeNameId">
      <el-select v-model="formParams.feeNameId" placeholder="请选择费用名称" style="width: 100%" filterable
        @change="nameChange">
        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
          <div class="row-center" style="justify-content: space-between;">
            <div>{{ item.name }}</div>
            <div class="row-center">
              <el-button type="primary" text style="padding: 0;" @click="openNameForm('edit', item)">
                <el-icon>
                  <EditPen />
                </el-icon>
              </el-button>
              <el-button type="danger" text style="padding: 0;" @click="deleteHandle(item)">
                <el-icon>
                  <Delete />
                </el-icon>
              </el-button>
            </div>
          </div>
        </el-option>
        <template #footer>
          <el-button type="primary" icon="Plus" text @click="openNameForm('add')">新建费用名称</el-button>
        </template>
      </el-select>
    </el-form-item>
    <el-form-item label="计算维度" prop="calculateDimension">
      <el-radio-group v-model="formParams.calculateDimension">
        <el-radio value="PAY">按支付</el-radio>
        <el-radio value="DELIVER">按发货</el-radio>
        <el-radio value="REFUND">按退款</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="备注信息" prop="remark">
      <s-text-area v-model="formParams.remark" style="width: 100%;" placeholder="请输入描述，如参数值的用途等补充说明"
        :autosize="{ minRows: 4, maxRows: 7 }" maxlength="1000" show-word-limit />
    </el-form-item>
  </el-form>
  <nameForm ref="nameFormRef" @success="optionsChange" />
</template>
<script lang="ts" setup>
import nameForm from './nameForm.vue';
import STextArea from "@/components/common/input/s-textarea.vue";
import request from '@/config/axios';
const options = ref<any[]>([]);
const { viewType } = inject(`LaborcostDetails`) as any;
const formParams = ref<any>({
  feeNameId: '',
  //费用名称
  feeName: '',
  //计算维度
  calculateDimension: 'PAY',
  //备注
  remark: ''
})
const formRules = reactive({
  feeNameId: [{ required: true, message: '请选择费用名称', trigger: ['blur', 'change'] }],
  calculateDimension: [{ required: true, message: '请选择计算维度', trigger: 'change' }]
})
const emits = defineEmits(['change'])
const nameFormRef = ref<any>()
const openNameForm = (name: string, row?: any) => {
  nameFormRef.value?.open(name, row)
}
const formRef = ref<any>()
const validate = async () => {
  // 校验表单
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    return true;
  } catch (err) {
    return false
  }
}
const getValue = () => {
  return formParams.value
}
const clear = () => {
  formRef.value?.resetFields()
  formParams.value = {
    feeNameId: '',
    //费用名称
    feeName: '',
    //计算维度
    calculateDimension: 'PAY',
    //备注
    remark: ''
  }
}
const message = useMessage()
const getNameList = async () => {
  try {
    const res = await request.get({ url: "/api/customFee/feeName/list", params: { name: "" } })
    options.value = Array.isArray(res) ? res : []
  } catch (err) {

  }
}

const optionsChange = async (params: any) => {
  await getNameList()
  if (formParams.value.feeNameId) {
    nameChange(formParams.value.feeNameId)
  }
}

const nameChange = (id: string) => {
  options.value.map(item => {
    if (item.id === id) {
      formParams.value.feeName = item.name
    }
  })
}

const deleteHandle = async (item: any) => {
  try {
    await message.confirm('确认删除该费用名称 [' + item.name + '] 吗？', '提示')
    await request.get({ url: '/api/customFee/feeName/remove', params: { id: item.id } })
    if (item.id === formParams.value.feeNameId) {
      formParams.value.feeNameId = ''
      formParams.value.feeName = ''
    }
    getNameList()
    message.success('删除成功')
  } catch (err) { }
}
onMounted(() => {
  getNameList()
})
const setValue = (val: any) => {
  formParams.value = { ...formParams.value, ...val }
}
watch(formParams, (val) => {
  emits('change', val)
}, { deep: true, immediate: false })

defineExpose({
  validate, clear, getValue, setValue
})
</script>