<template>
  <div :style="{ position: 'relative' }">
    <el-input prefix-icon="Calendar" class="seach-time" v-model="dateTime" :placeholder="placeholder || '请选择'"
      @click="open" readonly :style="{ width: `${tWidth}px !important` }">
      <template #prepend>
        <el-select v-model="(dateType as any)" class="date-select" :style="{ width: `${sWidth}px` }"
          @change="typeChange">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </template>
      <template #suffix>
        <el-icon v-if="dateTime" class="el-input__icon" @click="clear">
          <CircleClose />
        </el-icon>
      </template>
    </el-input>
    <div class="dis-time" :style="{ width: `${tWidth / 2}px !important` }">
      <el-date-picker ref="timeRef" v-model="dateValue" type="daterange" value-format="YYYY-MM-DD" format="YYYY-MM-DD"
        @change="valueChange" />
    </div>
  </div>
</template>

<script lang="ts">
export default { name: 'TimeSelect' };
</script>

<script lang="ts" setup>

import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';

dayjs.locale('zh-cn');


const props = defineProps({
  placeholder: { type: String, reuqired: false, default: '请选择日期' },
  options: { type: Array<any>, reuqired: false, default: () => [] },
  formatStr: { type: String, reuqired: false, default: 'YYYY-MM-DD' },
  defaultType: { type: [String, Number], reuqired: false, default: 0 },
  sWidth: { type: Number, reuqired: false, default: 135 },
  tWidth: { type: Number, reuqired: false, default: 634 },
});

const emit = defineEmits(['change']);

const dateValue: any = defineModel(), formatValue = ref<Array<any>>([]);

const dateType = ref<string | number | null>(null), timeRef = ref(), dateTime = ref<string | null>('');

const open = () => {
  nextTick(() => {
    timeRef?.value?.handleOpen();
  })
};

const typeChange = () => {
  dateValue.value = null;
  setTimeDate();
};

const setTimeDate = () => {
  if (dateValue?.value?.length) {
    formatValue.value = [dayjs(dateValue.value[0]).format(props.formatStr), dayjs(dateValue.value[1]).format(props.formatStr)];
    dateTime.value = `${formatValue.value[0]} - ${formatValue.value[1]}`;
  } else {
    formatValue.value = [];
    dateTime.value = '';
  }
};

const clear = () => {
  dateValue.value = null;
  setTimeout(() => {
    setTimeDate();
    emit('change', formatValue.value, dateType.value);
  }, 0)
};

const valueChange = () => {
  setTimeDate();
  emit('change', formatValue.value, dateType.value);
};

const resetDate = () => {
  dateType.value = props.defaultType;
  dateTime.value = '';
  dateValue.value = null;
  formatValue.value = [];
};

watch(() => props.defaultType, () => {
  dateType.value = props.defaultType;
}, { immediate: true, deep: true })

defineExpose({ resetDate, formatValue, dateType })

</script>
<style scoped lang="scss">
.dis-time {
  position: absolute;
  right: 0;
  top: 0;
  visibility: hidden;
  height: 0px;
}

.seach-time {
  width: 100%;
}

:deep(.el-input__wrapper) {
  box-shadow: 0px 0px 0px 1px #e5e5e5 inset;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0px 0px 0px 1px var(--el-input-focus-border-color) inset !important;
}

.el-input__icon {
  cursor: pointer;
}
</style>
