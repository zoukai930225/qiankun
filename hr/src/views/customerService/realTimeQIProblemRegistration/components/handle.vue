<template>
  <el-form :label-width="80" ref="formRef" :rules="rules" :model="dataValue" inline class="form_body"
    :class="disabledHandle ? 'only-view' : ''">
    <el-form-item label="是否完结" prop="warehouseIssueComplete" class="half">
      <el-select v-model="dataValue.warehouseIssueComplete" :disabled="disabledHandle" @change="valueChange">
        <el-option v-for="item in warehouseIssueCompleteOptions" :key="item.value" :value="Number(item.value)"
          :label="item.label"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="完结时间" prop="completeTime" class="half">
      <el-date-picker placeholder="请选择日期" v-model="dataValue.completeTime" type="datetime" style="width: 100%;"
        format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" time-format="HH:mm" :disabled="disabledHandle"
        @change="valueChange" :default-time="new Date()" v-bind="pickerOptions" />
    </el-form-item>
    <el-form-item label="反馈当日最终结果" prop="feedbackResult" class="all line-h16">
      <s-text-area placeholder="请输入" v-model="dataValue.feedbackResult"  :rows="4" :maxlength="500"
        :disabled="disabledHandle" @change="valueChange" show-word-limit/>
    </el-form-item>
    <el-form-item label="处理截图" prop="handleUrls" class="all" :show-message="type === 'handle' && !dataValue.handleUrls">
      <transfer v-if="type === 'handle' || type === 'edit' || (type === 'view' && !dataValue.handleUrls)"
        style="width: 320px;" v-model="dataValue.handleUrls" :tip="'只能上传图片，且不超过5M'" :limit="5"
        :disabled="type === 'view' && !dataValue.handleUrls"></transfer>
      <div v-if="type === 'view'" class="file_image" v-for="(file, index) in fileList" :key="index">
        <el-image class="img" :src="file" :preview-src-list="[file ? file : '']" fit="cover" />
      </div>
    </el-form-item>
  </el-form>
</template>

<script lang="tsx">
export default { name: 'TransactionOrderDetailHandle' };
</script>

<script lang="tsx" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { DetailProvideType, warehouseIssueCompleteOptions } from './type';

const { dataValue, type, updetaValue } = inject('realtimeqi_details') as DetailProvideType;

const fileList = computed(() => {
  return dataValue.value?.handleUrls ? dataValue.value?.handleUrls.split(',') : []
})

const rules = computed(() => ({
  warehouseIssueComplete: [{ required: !disabledHandle.value, message: '请选择是否完结', trigger: ['blur', 'change'] }],
  completeTime: [{ required: !disabledHandle.value, message: '请输选择完结时间', trigger: ['blur', 'change'] }],
  feedbackResult: [{ required: !disabledHandle.value, message: '请输入反馈当日最终结果', trigger: ['blur', 'change'] }],
  handleUrls: [{ required: !disabledHandle.value, message: '请上传处理截图', trigger: ['blur', 'change'] }],
}));

const formRef = ref();

const disabledHandle = computed(() => type.value === 'view' || (type.value !== 'handle' && dataValue.value.warehouseIssueComplete !== null));

const validateCheck = async () => {
  return await formRef?.value?.validate((valid: boolean) => {
    return valid
  });
};

const valueChange = () => {
  updetaValue({ ...dataValue.value });
};

const clearValidate = () => {
  formRef?.value?.clearValidate();
};

/**
 * 生成一个数组
 * @param start
 * @param end
 */
const makeRange = (start: number, end: number) => {
  const result: number[] = []
  for (let i = start; i <= end; i++) {
    result.push(i)
  }
  return result
}

/**
 * 限制今天之前的时间不能选择（小时）
 */
const disabledHours = () => {
  let newVal = new Date(dataValue.value.completeTime)
  if (newVal && newVal.getFullYear() == new Date().getFullYear() &&
    newVal.getMonth() == new Date().getMonth() &&
    newVal.getDate() == new Date().getDate()
  ) {
    //如果为今天，则限制当前时间前的时间不能选择。
    return makeRange(0, new Date().getHours() - 1)
  }
}

/**
 * 限制今天之前的时间不能选择（分钟）
 * @param hour
 */
const disabledMinutes = (hour: number) => {
  let newVal = new Date(dataValue.value.completeTime)
  if (newVal && newVal.getFullYear() == new Date().getFullYear() &&
    newVal.getMonth() == new Date().getMonth() &&
    newVal.getDate() == new Date().getDate()
  ) {
    //如果为今天，则限制当前时间前的时间不能选择。
    return makeRange(0, new Date().getMinutes() - 1)
  }
}

/**
 * 限制今天之前的时间不能选择的配置
 */
const pickerOptions = computed(() => {
  return {
    // 限制今天之前的日期不能选择
    disabledDate(time: any) {
      return time.getTime() < Date.now() - 24 * 3600 * 1000
    },
    // 限制今天之前的小时不能选择
    disabledHours,
    // 限制今天之前的分钟不能选择
    disabledMinutes
  }
})

defineExpose({ clearValidate, validateCheck });
</script>
<style lang="scss" scoped>
.form_body {
  margin-top: 10px;

  &.only-view {

    :deep(.el-select__suffix) {
      display: none;
    }
  }

  .file_image {
    margin-right: 20px;

    .img {
      border-radius: 6px;
      width: 110px;
      height: 110px;
    }
  }

  .line-h16 {
    :deep(.el-form-item__label) {
      line-height: 16px;
    }
  }

  :deep(.el-form-item) {
    margin-right: 20px;
    margin-bottom: 20px;
  }

  .half {
    width: calc(50% - 20px);
  }

  .all {
    width: calc(100% - 20px);
  }
}

:deep(.file_icon) {
  .img {
    box-shadow: none !important;
  }
}

:deep(.el-input-number .el-input__inner) {
  text-align: left !important;
}
</style>
