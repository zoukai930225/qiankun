<template>
  <div :style="{ position: 'relative' }">
    <el-input prefix-icon="Calendar" class="seach-time" v-model="dateValue" :placeholder="placeholder" @click="open"
      :style="{ width: `${tWidth}px !important` }">
      <template #prepend>
        <el-select v-model="(dateType as any)" class="date-select" :style="{ width: `${sWidth}px` }"
          @change="typeChange">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </template>
    </el-input>
  </div>
</template>

<script lang="ts">
export default { name: 'SelectInput' };
</script>

<script lang="ts" setup>

import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';

dayjs.locale('zh-cn');


const props = defineProps({
  placeholder: { type: String, reuqired: false, default: '请输入' },
  options: { type: Array<any>, reuqired: false, default: () => [] },
  sWidth: { type: Number, reuqired: false, default: 105 },
  tWidth: { type: Number, reuqired: false, default: 310 },
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
  // if (dateValue?.value?.length) {
  //   formatValue.value = [dayjs(dateValue.value[0]).format(props.formatStr), dayjs(dateValue.value[1]).format(props.formatStr)];
  //   dateTime.value = `${formatValue.value[0]} - ${formatValue.value[1]}`;
  // } else {
  //   formatValue.value = [];
  //   dateTime.value = '';
  // }
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
  dateType.value = props.options[0].value;
  dateTime.value = '';
  dateValue.value = null;
  formatValue.value = [];
};

watchEffect(() => {
  setTimeDate();
  !dateType.value && (dateType.value = props.options[0].value);
});

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
