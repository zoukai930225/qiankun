<template>
  <div style="position: relative;">
    <el-input prefix-icon="Calendar" class="seach-time" v-model="dateTime" :placeholder="placeholder || '请选择'"
      @click="open" readonly>
      <template #prepend>
        <el-select v-model="dateType" class="date-select" @change="typeChange">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </template>
      <template #suffix>
        <el-icon v-if="dateTime" class="el-input__icon" @click="clear">
          <CircleClose />
        </el-icon>
      </template>
    </el-input>
    <div class="dis-time">
      <el-date-picker v-if="dateType === '0'" ref="timeRef" v-model="dateValue" type="date" value-format="YYYY-MM-DD"
        format="YYYY-MM-DD" @change="valueChange" />
      <el-date-picker v-if="dateType === '1'" ref="timeRef" v-model="dateValue" type="month" format="YYYY-MM"
        value-format="YYYY-MM" @change="valueChange" />
      <el-date-picker v-if="dateType === '2'" ref="timeRef" v-model="dateValue" type="week" value-format="YYYY-MM-DD"
        format="YYYY-MM-DD" @change="valueChange" />
      <el-date-picker v-if="dateType === '3'" ref="timeRef" v-model="dateValue" type="year" format="YYYY"
        value-format="YYYY" @change="valueChange" />
    </div>
  </div>
</template>

<script lang="ts">
export default { name: 'SearchTime' };
</script>

<script lang="ts" setup>
import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';

dayjs.locale('zh-cn');

const props = defineProps({
  placeholder: { type: String, reuqired: false, default: '' },
  layout: { type: String, reuqired: false, default: '日,周,月,年' },
  separator: { type: String, reuqired: false, default: '-' },
  showDateIcon: { type: Boolean, reuqired: false, default: false },
  formatStr: { type: String, reuqired: false, default: 'YYYY-MM-DD' },
});

const emit = defineEmits(['change']);

const dateValue: any = defineModel(), formatValue = ref<Array<any>>([]);

const dateList = ref<Array<any>>([{ label: '日', value: '0' }, { label: '周', value: '2' }, { label: '月', value: '1' }, { label: '年', value: '3' }]);

const dateType = ref<string>('0'), timeRef = ref(), dateTime = ref<string | null>('');

const options = computed(() => dateList.value.filter((ds: any) => props.layout.includes(ds.label)));

const open = () => {
  nextTick(() => {
    timeRef?.value?.handleOpen();
  })
};

const typeChange = () => {
  dateValue.value = null;
  setTimeout(() => valueChange(), 0);
};

const setTimeDate = () => {
  dateTime.value = dateValue.value ? (dateType.value === '2' ? setWeekDate() : dateValue.value) : null;
  if (dateValue.value) {
    switch (dateType.value) {
      case '0': formatValue.value = [dayjs(dateValue.value).startOf('day').format(props.formatStr), dayjs(dateValue.value).endOf('day').format(props.formatStr)]; break;
      case '1': formatValue.value = [dayjs(dateValue.value).startOf('month').format(props.formatStr), dayjs(dateValue.value).endOf('month').format(props.formatStr)]; break;
      case '2': formatValue.value = setWeekDate('list') as any; break;
      case '3': formatValue.value = [dayjs(dateValue.value).startOf('year').format(props.formatStr), dayjs(dateValue.value).endOf('year').format(props.formatStr)]; break;
      default:
        break;
    }
  } else {
    formatValue.value = [];
  }
};

const setWeekDate = (type: string = 'show') => {
  const start: string = dayjs(dateValue.value).startOf('week').format(props.formatStr);
  const end: string = dayjs(dateValue.value).endOf('week').format(props.formatStr);
  return type === 'show' ? `${start} ${props.separator} ${end}` : [start, end];
};

const clear = () => {
  dateValue.value = null;
  setTimeout(() => {
    setTimeDate();
    emit('change', formatValue.value);
  }, 0)
};

const valueChange = () => {
  setTimeDate();
  emit('change', formatValue.value);
};

const resetDate = () => {
  dateType.value = '0';
  dateTime.value = '';
  dateValue.value = null;
  formatValue.value = [];
};

watchEffect(() => {
  setTimeDate();
});

defineExpose({ resetDate, formatValue })

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
  .date-select {
    width: 60px;

    :deep() {
      .el-select__wrapper {
        height: 34px !important;
        padding: 4px 12px !important;
      }

      .el-select__input {
        height: 26px !important
      }

    }
  }
}

:deep(.el-input__wrapper) {
  box-shadow: 0px 0px 0px 1px #e5e5e5 inset;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0px 0px 0px 1px var(--el-input-focus-border-color) inset !important;
}

// :deep(.el-input__prefix-inner) {
//   display: none;
// }


.el-input__icon {
  cursor: pointer;
}
</style>
