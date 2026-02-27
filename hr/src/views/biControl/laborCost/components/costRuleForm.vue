<template>
  <div>
    <div class="alert-box mt30px">
      <el-icon :size="16">
        <WarningFilled />
      </el-icon>
      <div class="info ml10px">
        <span>分摊规则：按计提金额(计提金额=计算指标 x 计算系数)</span>
      </div>
    </div>
    <el-form :model="formParams" label-width="80px" :rules="fromRules" ref="formRef" style="margin-top: 20px;"
      :disabled="viewType === 'see'">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="计算指标" prop="calculateIndex">
            <el-select v-model="formParams.calculateIndex" placeholder="请选择计算指标" filterable style="width: 100%;">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CALCULATE_INDICATOR, true)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="生效日期" prop="effectiveStartDate">
            <el-date-picker v-model="formParams.effectiveStartDate" style="width: 100%;" placeholder="请选择开始日期"
              type="date" value-format="YYYY-MM-DD" :disabled="viewType === 'see'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计算系数" prop="calculateCoefficient">
            <sw-input-number prop="calculateCoefficient" label="单价" required v-model="formParams.calculateCoefficient"
              :min="0" ref="inputRef" style="width: 100%;" placeholder="请输入计算系数">
              <template #suffix>%</template></sw-input-number>
          </el-form-item>
          <el-form-item label="结束日期" prop="effectiveEndDate">
            <el-date-picker v-model="formParams.effectiveEndDate" style="width: 100%;" placeholder="请选择结束日期" type="date"
              value-format="YYYY-MM-DD" :disabled="viewType === 'see'" />
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
  </div>
</template>
<script lang="ts" setup>
import swInputNumber from '@/components/common/inputNumber/index.vue'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict';
import dayjs from 'dayjs'
const { viewType } = inject(`LaborcostDetails`) as any;
const formParams = ref({
  //计算指标
  calculateIndex: '',
  effectiveStartDate: '',
  //结束日期
  effectiveEndDate: '',
  calculateCoefficient: undefined
})
const emits = defineEmits(['change'])

const formRef = ref<any>()
const validateBeginDate = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('请选择开始日期！'))
  } else if (formParams.value.effectiveEndDate && dayjs(value).isAfter(dayjs(formParams.value.effectiveEndDate))) {
    callback(new Error("开始日期不能小于结束日期!"))
  } else {
    callback()
  }
}

const validateEndDate = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('请选择结束日期！'))
  } else if (formParams.value.effectiveStartDate && dayjs(value).isBefore(dayjs(formParams.value.effectiveStartDate))) {
    callback(new Error("结束日期不能大于开始日期!"))
  } else {
    callback()
  }
}

const validateCalculateCoefficient = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('请输入计算系数！'))
    return
  }
  if (!/^[0-9]\d*(?:\.\d{1,6})?$/.test(value)) {
    callback(new Error('数字必须大于0且最多6位小数！'))
    return
  }
  callback()
}
const fromRules = reactive({
  calculateIndex: [{ required: true, message: '请选择计算指标', trigger: ['blur', 'change'] }], effectiveStartDate: [{ required: true, validator: validateBeginDate, trigger: ['blur', 'change'] }],
  effectiveEndDate: [{ required: true, validator: validateEndDate, trigger: ['blur', 'change'] }],
  calculateCoefficient: [{ required: true, validator: validateCalculateCoefficient, trigger: ['blur', 'change'] }]
})
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
    //计算指标
    calculateIndex: '',
    effectiveStartDate: '',
    //结束日期
    effectiveEndDate: '',
    calculateCoefficient: undefined
  }
}
const setDefaultStartDate = () => {
  formParams.value.effectiveStartDate = dayjs().format('YYYY-MM-DD')
}
const setValue = (val: any) => {
  formParams.value = { ...formParams.value, ...val }
}
watch(formParams, (val) => {
  emits('change', val)
}, { deep: true, immediate: false })
defineExpose({
  validate, clear, getValue, setDefaultStartDate, setValue
})
</script>
<style lang="scss" scoped>
.alert-box {
  padding: 6px 10px;
  border-radius: 4px;
  opacity: 1;
  background: rgba(226, 106, 0, 0.1);
  border: 1px solid #E26A00;
  font-family: PingFang SC;
  font-size: 14px;
  color: #E26A00;
  line-height: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;

  .info {
    word-break: break-all;
  }
}

:deep(.el-input-number .el-input__inner) {
  text-align: left;
}

:deep(.el-form-item--default) {
  margin-bottom: 20px !important;
}
</style>