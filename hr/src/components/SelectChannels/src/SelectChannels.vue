<template>
  <el-select
    class="searchFormItemWidth"
    v-model="modelValue"
    placeholder="请选择渠道"
    clearable
    @clear="emit('clear')"
    @change="emit('change')"
  >
    <template #label="{ value, label }">
      <div class="option-content">
        <div class="channel-icon">
          <img :src="getImageUrl(value)" alt="" />
        </div>
        <span>{{ label }}</span>
      </div>
    </template>
    <el-option
      v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_CHANNEL, hideAllChannels)"
      :key="dict.value"
      :label="dict.label"
      :value="dict[valueType]"
    >
      <div class="option-content">
        <div class="channel-icon">
          <img :src="getImageUrl(dict.value)" alt="" />
        </div>
        <span>{{ dict.label }}</span>
      </div>
    </el-option>
  </el-select>
</template>
<script lang="ts" setup>
import { getImageUrl } from '@/utils'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    valueType?: 'value' | 'label'
    hideAllChannels?: boolean
  }>(),
  {
    valueType: 'value',
    hideAllChannels: false
  }
)

const emit = defineEmits(['update:modelValue', 'clear', 'change'])

const modelValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>
<style lang="less" scoped>
.option-content {
  display: flex;
  align-items: center;
  .channel-icon {
    display: flex;
    max-width: 16px;
    max-height: 16px;
    margin-right: 8px;
    img {
      width: 100%;
    }
  }
}
</style>
