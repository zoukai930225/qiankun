<template>
  <el-cascader
    v-model="value"
    :options="options"
    :show-all-levels="false"
    filterable
    :props="{
      emitPath: false,
      multiple: true,
      checkStrictly: true
    }"
    collapse-tags
    collapse-tags-tooltip
    :max-collapse-tags="2"
    class="w-100%"
    clearable
    popper-class="departmentCascaderPopper"
    @change="handleChange"
    @blur="handleBlur"
  />
</template>

<script lang="ts" setup>
import { getAllDepartmentList } from '@/api/supplier/assess'
import { FormItemContext } from 'element-plus'
import { inject } from 'vue'

const props = defineProps<{
  modelValue?: string
}>()

const emit = defineEmits<{
  (e: 'update:model-value', value?: string): void
}>()

const formItemContext = inject<FormItemContext | null>('elFormItem', null)

const options = ref<any[]>([])

const value = computed({
  get: () => (props.modelValue ? props.modelValue.split(',') : undefined),
  set: (val) => {
    emit('update:model-value', val?.join(',') || undefined)
  }
})

async function getList() {
  try {
    const res = await getAllDepartmentList()
    options.value = await createTree(res.filter((ele) => ele.pId === '1'))
  } catch (error) {
    console.error('获取部门列表失败：', error)
  }
}

async function createTree(tree: any[]) {
  return Promise.all(
    tree.map(async (ele) => {
      let children: any[] = []
      if (ele.children?.length) {
        children = await createTree(ele.children)
      }
      return {
        label: ele.name,
        value: ele.id,
        children: children
      }
    })
  )
}

function handleValidate() {
  if (formItemContext) {
    formItemContext.validate('change').catch((err) => {
      console.error('表单验证失败：', err)
    })
  }
}

function handleChange() {
  handleValidate()
}

function handleBlur() {
  handleValidate()
}

onMounted(() => {
  getList()
})
</script>
