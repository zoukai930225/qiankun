<template>
  <el-cascader
    v-model="value"
    :options="options"
    :show-all-levels="false"
    filterable
    :props="{
      checkStrictly: true,
      emitPath: false,
      label: 'name',
      value: 'id',
      children: 'children'
    }"
    :disabled="disabled"
    class="w-100%"
    clearable
    placeholder="请选择所属分组"
    @change="handleChange"
  />
</template>

<script lang="tsx" setup>
import { getAllDeptTree } from '@/api/system/dept'

const props = defineProps<{
  modelValue?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value?: string): void
  (e: 'change', value?: string): void
}>()

const options = ref<any[]>([])

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 获取部门树数据
async function getList() {
  try {
    const res = await getAllDeptTree()
    options.value = res || []
  } catch (error) {
    console.error('获取部门列表失败：', error)
  }
}

function handleChange(val: string) {
  emit('change', val)
}

onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
:deep(.el-cascader) {
  width: 100%;
}
</style>
