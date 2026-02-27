<template>
  <el-tree-select v-model="dataValue" :data="menus" :multiple="isMultiple" collapse-tags collapse-tags-tooltip
    :show-checkbox="isMultiple" :check-strictly="isStrictly" check-on-click-node :loading="loading" :props="treeProps"
    node-key="id" @change="valueChange" clearable filterable :default-expanded-keys="defaultExpandedKeys" />
</template>

<script lang="tsx">
export default { name: 'MenuSelect' }
</script>

<script lang="tsx" setup>
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

};

const resetDate = () => {
  backValue.value = [];
  selectValue.value = [];
};


const outMenuList = inject<any>('outMenuList');
const defaultExpandedKeys = ref<any>([]);
const initValue = () => {
  if (!!dataValue.value) {
    selectValue.value = dataValue.value.split(',');
    backValue.value = cloneDeep([...selectValue.value]);
    defaultExpandedKeys.value = [...selectValue.value];
  }
};

onMounted(() => {
  resetDate();
  initValue();
  menus.value = outMenuList.value;
});

defineExpose({ resetDate, initValue });

</script>
<style lang="scss" scoped></style>
