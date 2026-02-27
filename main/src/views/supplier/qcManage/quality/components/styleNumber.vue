<template>
  <el-select-v2 filterable v-model="dataValue" :options="options" remote :remote-method="remoteMethod"
    :loading="loading" @focus="initOptions" placeholder="请选择款号" @change="valueChange" v-bind="componentProps" />
</template>

<script lang="tsx">
export default { name: 'StyleNumber' };
</script>

<script lang="tsx" setup>
import request from '@/config/axios';

const dataValue: any = defineModel('value');

const name: any = defineModel('name');

const props = defineProps({
  componentProps: { type: Object, default: () => { } }
});

const emit = defineEmits(['change']);

const options = ref<Array<any>>([]), loading = ref<boolean>(false), isInit = ref<Boolean>(false), selectItems = ref();

const remoteMethod = (query: string) => {
  if (query !== '') {
    getDataOptions(query);
  } else {
    isInit.value && getDataOptions();
  }
};

const initOptions = () => {
  !isInit.value && getDataOptions();
};

const getDataOptions = (goodsNo: string = '') => {
  loading.value = true;
  request.get({ url: `/api/qcQualityInspectionReportInfo/selectWdtGoodsList50`, params: { goodsNo: goodsNo } }).then((res: any) => {
    options.value = [...res].map((rs: any) => ({ label: rs.goodsNo, value: rs.goodsId }));
  }).finally(() => {
    loading.value = false;
    isInit.value = true;
    backfill();
  });
};

const backfill = () => {
  const ids: any = options.value.map((ops: any) => ops.value);
  if (props.componentProps.multiple) {
    selectItems?.value?.length && selectItems.value.forEach((si: any) => {
      !ids.includes(si.value) && options.value.unshift(si);
    });
  } else {
    (selectItems?.value?.value && !ids.includes(selectItems.value.value)) && options.value.unshift(selectItems.value);
  }
};

const valueChange = () => {
  setTimeout(() => {
    if (props.componentProps.multiple) {
      selectItems.value = dataValue.value.map((item: any) => options.value.find((ops: any) => ops.value === item));
      name.value = selectItems.value.map((si: any) => si.label);
    } else {
      selectItems.value = options.value.find((item: any) => item.value === dataValue.value);
      name.value = selectItems.value.label;
    }
    console.log(name.value);
    emit('change', dataValue.value, selectItems.value);
  }, 0);
};


watch(() => dataValue.value, () => {
  if (!dataValue.value?.length || !dataValue.value) {
    selectItems.value = null;
  }
  if (!props?.componentProps?.multiple && dataValue.value && name.value) {
    selectItems.value = { label: name.value, value: dataValue.value };
    // options.value = [{ label: name.value, value: dataValue.value }];
    backfill()
  }
  if (props?.componentProps?.multiple && dataValue?.value?.length) {
    const names: any = name?.value?.length ? name.value : [];
    selectItems.value = dataValue.value.map((vs: any, index: number) => ({ label: names[index] || '', value: vs }));
    backfill();
  }
}, { immediate: true, deep: true, })

onMounted(() => isInit.value = false);

</script>
<style lang="scss" scoped></style>
