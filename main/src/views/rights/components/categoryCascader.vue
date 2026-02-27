<template>
  <el-cascader
    v-model="value"
    :options="rights.categoryOptions"
    placeholder="请选择类目"
    filterable
    clearable
    @change="handleChange"
  >
    <template #default="{ data }">
      {{ data.label }}
    </template>
  </el-cascader>
</template>
<script lang="ts" setup>
import { useRightsStore } from '@/store/modules/rights'

const props = defineProps<{
  modelValue?: string
}>()

const emit = defineEmits(['update:model-value', 'change'])

const rights = useRightsStore()

const value = ref<string[][] | undefined>([])

watch(
  () => props.modelValue,
  (val) => {
    if (!val) value.value = undefined
  }
)

function handleChange(val: string[][]) {
  emit('update:model-value', val?.join('>>') || '')
  emit('change')
}

onMounted(() => {
  if (!rights.categoryOptions.length) {
    rights.getCategoryOptions()
  }
})
</script>
<style lang="less" scoped></style>
