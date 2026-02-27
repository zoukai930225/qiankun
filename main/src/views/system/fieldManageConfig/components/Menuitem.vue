<!--
 * @Date: 2024-12-28 14:27:47
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
import { getMenuList } from '@/api/system/fieldManageConfig/index'

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
    default: '请选择所属模块'
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
    const res = await getMenuList({})
    menuList.value = res
  } catch (error) {}
}

onMounted(() => {
  initMenu()
})
</script>
