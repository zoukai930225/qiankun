<template>
  <div class="row-center">
    <el-form ref="formRef" :model="formData" inline class="table-form">
      <el-form-item :prop="start" label="" :rules="[{ validator: validateBeginDate, trigger: ['blur', 'change'] }]">
        <el-date-picker v-model="formData[start]" :value-format="format" :format="format" type="date"
          :placeholder="`请选择${startPlaceholder}`" :style="`width: ${width}px;`" @change="handleDateChange"
          :clearable="canClear" />
      </el-form-item>
      <el-form-item label="">
        <span class="ml5px mr5px">-</span>
      </el-form-item>
      <el-form-item :prop="end" label="" :rules="[{ validator: validateEndDate, trigger: ['blur', 'change'] }]">
        <el-date-picker v-model="formData[end]" :value-format="format" :format="format" type="date"
          :placeholder="`请选择${endPlaceholder}`" :style="`width: ${width}px;`" @change="handleDateChange"
          :clearable="canClear" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import dayjs from 'dayjs'
const props = defineProps({
  start: {
    type: String,
    default: 'startTime'
  },
  end: {
    type: String,
    default: 'endTime'
  },
  startPlaceholder: {
    type: String,
    default: '开始时间'
  },
  endPlaceholder: {
    type: String,
    default: '结束时间'
  },
  //开始时间和结束时间是否都必填
  needFull: {
    type: Boolean,
    default: false
  },
  format: {
    type: String,
    default: 'YYYY/MM/DD'
  },
  canClear: {
    type: Boolean,
    default: true
  },
  width: {
    type: Number,
    default: 220
  }
})
const emit = defineEmits(['change'])
const formRef = ref<any>()
const formData = defineModel<any>()
const validateBeginDate = (rule: any, value: any, callback: any) => {
  if (formData.value[props.end] && dayjs(value).isAfter(dayjs(formData.value[props.end]))) {
    callback(new Error(`${props.startPlaceholder}不能后于${props.endPlaceholder}!`))
  } else {
    callback()
  }
}

const validateEndDate = (rule: any, value: any, callback: any) => {
  if (!!value && formData.value[props.start] && dayjs(value).isBefore(dayjs(formData.value[props.start]))) {
    callback(new Error(`${props.endPlaceholder}不能前于${props.startPlaceholder}!`))
  } else {
    callback()
  }
}

const handleDateChange = async () => {
  try {
    await nextTick()
    await formRef?.value.validate()
    if (!props.needFull) {
      emit('change', formData.value)
    } else {
      if ((formData.value[props.start] && formData.value[props.end]) || (!formData.value[props.start] && !formData.value[props.end])) {
        emit('change', formData.value)
      }
    }
  } catch (err) {

  }
}

</script>
<style scoped lang="scss"></style>