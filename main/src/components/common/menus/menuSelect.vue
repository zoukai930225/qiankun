<template>
  <el-tree-select v-model="selectValue" :data="menus" :multiple="isMultiple" collapse-tags collapse-tags-tooltip
    :show-checkbox="isMultiple" :check-strictly="isStrictly" check-on-click-node @focus="focusOn" :loading="loading"
    :props="treeProps" node-key="id" @change="valueChange" @blur="submit" clearable filterable />
</template>

<script lang="tsx">
export default { name: 'MenuSelect' }
</script>

<script lang="tsx" setup>
import request from '@/config/axios';
import { treeToArray, redrawTree } from '@/utils';
import { cloneDeep } from 'lodash-es';

const dataValue: any = defineModel();

const emit = defineEmits(['change']);

const props = defineProps({
  isMultiple: { type: Boolean, default: false },
  isStrictly: { type: Boolean, default: false },
});

const treeProps = computed(() => ({ label: 'name', children: 'children' }));

const selectValue = ref<any>([]), backValue = ref<any>([]), menus = ref<any>([]), loading = ref<boolean>(false);

const valueChange = () => {
  // console.log(selectValue.value);
};

const resetDate = () => {
  backValue.value = [];
  selectValue.value = [];
};

const submit = () => {
  if (JSON.stringify(backValue.value) !== JSON.stringify(selectValue.value)) {
    backValue.value = cloneDeep([...selectValue.value]);
    dataValue.value = selectValue.value.join(',');
    emit('change', selectValue.value);
  }
};

const getDataList = () => {
  loading.value = true;
  request.get({ url: '/api/menu/list' }).then((res: any) => {
    !!res?.length && (menus.value = redrawTree(treeToArray([...res]).filter((rs: any) => [1, 2].includes(rs.type)).map((rs: any) => {
      let obj: any = cloneDeep(rs);
      delete obj.children;
      return obj
    }), ''));
  }).finally(() => loading.value = false);
};

const focusOn = () => {
  !menus?.value?.length && getDataList();
};

const initValue = () => {
  if (!!dataValue.value) {
    selectValue.value = dataValue.value.split(',');
    backValue.value = cloneDeep([...selectValue.value]);
  }
};

onMounted(() => {
  resetDate();
  initValue();
});

defineExpose({ resetDate, initValue });

</script>
<style lang="scss" scoped></style>
