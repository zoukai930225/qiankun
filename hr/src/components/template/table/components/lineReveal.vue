<template>
  <div style="display: inline-flex;">
    <div class="label_txt" v-for="(item, index) in showList" :key="index">
      <img class="label_img" :src="item.avatar" alt="" />
      {{ item.label }}
      <img v-if="disabled" class="itemClose" src="@/assets/imgs/team/itemClose.png" @click.stop="emit('delItem', item)"
        alt="" />
    </div>
    <el-popover placement="bottom" trigger="hover" :width="270" :disabled="disabled"
      :popper-style="{ padding: '10px 0 0 10px !important' }">
      <template #reference>
        <div class="label_txt" style="padding-left: 10px;" v-if="!!(valueList.length - showList.length)">
          {{ `+${valueList.length - showList.length}` }}
        </div>
      </template>
      <template #default>
        <div class="label_txt" style="margin-bottom: 10px;" v-for="(item, index) in tagList" :key="`tag_${index}`">
          <img class="label_img" :src="item.avatar" alt="" />
          {{ item.label }}
        </div>
      </template>
    </el-popover>
  </div>
</template>

<script lang="ts">
export default { name: 'LineReveal' };
</script>

<script lang="ts" setup>
import { filterObject } from '@/utils';
import { cloneDeep } from 'lodash-es';

const emit = defineEmits(['delItem']);

const props = defineProps({
  tags: { type: Number, default: 2 },
  disabled: { type: Boolean, default: false },
  optionsList: { type: Array<any>, default: () => [] },
  optionParams: { type: Object, default: () => ({ label: 'name', value: 'userId', avatar: 'avatarOrigin', depart: 'departmentName' }) },
});

const valueList = computed(() => cloneDeep([...props.optionsList]).map((vs: any) => {
  let obj: any = {};
  filterObject(props.optionParams, (key: string, value: any) => {
    obj[key] = vs[value];
  });
  return obj;
}));

const showList = computed(() => cloneDeep([...valueList.value]).slice(0, props.tags));

const tagList = computed(() => cloneDeep([...valueList.value]).slice(props.tags, valueList.value.length));

</script>

<style scoped lang="scss">
.label_txt {
  margin-right: 6px;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  height: 26px;
  background: #cad6f8;
  border-radius: 13px;
  padding: 2px 10px 2px 5px;
  box-sizing: border-box;

  .label_img {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-right: 5px;
  }

  .itemClose {
    margin-left: 5px;
    cursor: pointer;
    width: 6px;
    height: 6px;
  }
}
</style>
