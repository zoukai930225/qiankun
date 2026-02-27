<!--
 * @Date: 2025年3月1日13:43:42
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
    ref="cascaderRef"
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

const cascaderRef = ref(null)
const handleChange = () => {
  console.log('???')
  let text = ''
  let lengthNumber = 2
  const presentText = cascaderRef.value?.presentText
  if (presentText.includes(' / ')) {
    const arr = presentText.split(' / ')
    text = arr[arr.length - 1]
  } else if (!presentText) {
    lengthNumber = 2
  } else {
    lengthNumber = 1
    text = presentText
  }
  emit('change', text, lengthNumber)
}

const menuList = ref([])

const initMenu = async () => {
  try {
    const data = await getAllDeptTree({})
    menuList.value = data
  } catch (error) {}
}
const reset = () => {
  // console.log('resetresetresetresetreset');
  cascaderRef.value.cascaderPanelRef.clearCheckedNodes()
}
defineExpose({
  reset
})
onMounted(() => {
  initMenu()
})
</script>
