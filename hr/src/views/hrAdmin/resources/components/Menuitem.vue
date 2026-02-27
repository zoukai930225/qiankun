<!--
 * @Date: 2025-2-25 14:42:26
-->
<template>
  <el-cascader
    v-model="cascaderValue"
    :options="options || menuList"
    :props="customProps"
    @change="handleChange"
    :placeholder="placeholder"
    :clearable="clearable"
    filterable
    style="width: 100%"
  />
</template>

<script lang="ts" setup>
import { getDeptTree } from '@/api/hrAdmin/personRoster/index'
import { getAllDeptTree } from '@/api/system/dept'

const props = defineProps({
  value: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  options: {
    type: Array as PropType<any[]>
  },
  placeholder: {
    type: String,
    default: '请选择部门'
  },
  clearable: {
    type: Boolean,
    default: true
  }
})

const cascaderValue = computed({
  get: () => props.value,
  set: (value) => {
    // handleChange(value)
  }
})

const customProps = {
  label: 'name',
  value: 'id',
  children: 'children',
  checkStrictly: true
}

const emit = defineEmits(['change'])

const handleChange = (value) => {
  console.log('???')
  emit('change', value)
}

const menuList = ref([])

const initMenu = async () => {
  try {
    const data = await getAllDeptTree({})
    menuList.value = data
  } catch (error) {}
}

onMounted(() => {
  initMenu()
})
</script>
