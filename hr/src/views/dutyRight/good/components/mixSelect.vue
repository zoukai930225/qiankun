<template>
  <keySelect v-model="value" v-if="currentType === 1" @selectChange="changeType(2)" @change="handleChange"
    :placeholder="placeholder" :suffixText="suffixText" />
  <textareaSearch v-model="value" v-else @selectChange="changeType(1)" @change="handleChange" :width="width" :max="max"
    :name="name" />
</template>
<script lang="ts" setup>
import keySelect from './keySelect.vue';
import textareaSearch from './textareaSearch.vue';
import { cloneDeep } from 'lodash-es';
const props = defineProps({
  placeholder: {
    type: String,
    default: '商品名/商品ID/负责人/货品编码'
  },
  suffixText: {
    type: String,
    default: '的记录'
  },
  width: {
    type: Number,
    default: 220
  },
  //最多可输入行数
  max: {
    type: Number,
    default: 200
  },
  name: {
    type: String,
    default: '商品ID'
  },
})
const value: any = defineModel()
const emit = defineEmits(['change'])
//1-混合搜索，商品id搜索
const currentType = ref<1 | 2>(1)

const changeType = (type: 1 | 2) => {
  currentType.value = type
  const origin = cloneDeep(value.value)
  if (type === 1) {
    value.value = null
  } else {
    value.value = ''
  }
  if (!!origin) {
    emit('change', value.value)
  }

}

const handleChange = () => {
  emit('change', value.value)
}
</script>