<template>
  <el-select-v2 v-model="dataValue" :placeholder="placeholder" filterable remote clearable :disabled="disabled"
    reserve-keyword remote-show-suffix :remote-method="remoteMethod" :loading="loading" :options="optionOptions"
    @change="(val) => emit('change', val)" allow-create :multiple="multiple" :collapse-tags="multiple" :collapse-tags-tooltip="multiple"/>
</template>

<script lang="ts">
export default { name: 'GoodCode' };
</script>

<script lang="ts" setup>
import request from '@/config/axios'

const loading = ref(false), optionOptions = ref<{ label: string; value: string }[]>([]);

const emit = defineEmits(['change']);

const dataValue = defineModel();

const props = defineProps({
  disabled: { type: Boolean, default: false },
  placeholder: { type: String, default: '请选择货品编码' },
  url: { type: String, default: '/api/wdtGoods/listGoodsNo' },
  params: { type: Object, default: () => { } },
  name: { type: String, default: 'specNo' },
  paramsValue: { type: Object, default: () => ({ label: 'name', value: 'code' }) },
  multiple: {type: Boolean, default: false}
});

const remoteMethod = (val: string) => {
  loading.value = true;
  let data: any = {};
  data[props.name] = val;
  request.get({ url: props.url, params: { ...data, ...props.params } }).then((res: any) => {
    optionOptions.value = res?.map((item) => ({ value: item[props.paramsValue.value], label: item[props.paramsValue.label] }));
  }).finally(() => {
    loading.value = false;
  });
}
</script>
<style lang="less" scoped></style>
