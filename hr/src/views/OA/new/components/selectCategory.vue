<template>
  <div style="width: 100%;">
    <el-cascader
      :options="options"
      :props="casProps"
      clearable
      :placeholder="placeholder"
      v-model="dateModelValue"
      :collapse-tags="multiple"
      :collapse-tags-tooltip="multiple"
      :max-collapse-tags="1"
      :style="style"
    />
  </div>
</template>

<script lang="ts" setup>
import { queryCategoryTree } from '@/api/system/categoryManager'
import { treeToArray } from '@/utils'

const props = defineProps({
  modelValue: {
    type: Array<string>,
    default: []
  },
  placeholder: {
    type: String,
    default: '请选择品类'
  },
  returnCategoryName: {
    type: Boolean,
    default: false
  },
  multiple: {
    type: Boolean,
    default: false
  },
  style: {
    type: Object,
    default: () => {}
  }
})
const emits = defineEmits(['update:modelValue', 'change', 'getCategoryName'])
const dateModelValue = computed({
  get: () => props.modelValue,
  set: (val) => {
    emits('update:modelValue', val)
    if (props.returnCategoryName) {
      emits('getCategoryName', getCategoryName(val))
    }
    emits('change')
  }
})

const getCategoryName = (val) => {
  if (!options.value || options.value.length === 0) return ''
  const temp = treeToArray(options.value, 'categoryCode', 'subCategories')
  const obj = temp.find((item) => item.categoryCode === val)
  return obj?.completeCategoryName || ''
}

const casProps = ref({
  label: 'categoryName',
  value: 'categoryCode',
  children: 'subCategories',
  checkStrictly: true,
  emitPath: false,
  multiple: props.multiple || false
})

const options = ref([])
const getCategoryTree = async () => {
  queryCategoryTree().then((res: any) => {
    options.value = res || []
  })
}
onMounted(() => {
  getCategoryTree()
})
</script>

<style lang="scss" scoped>
:deep() {
  .el-cascader__tags {
    flex-wrap: nowrap;
    .el-tag:not(:last-child) {
      max-width: 80% !important;
    }
  }
}
</style>
