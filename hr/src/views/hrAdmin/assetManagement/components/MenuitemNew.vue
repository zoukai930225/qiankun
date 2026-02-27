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

const cascaderValue = ref([])

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
  const text = cascaderRef.value?.presentText
  console.log(cascaderValue.value, 'cascaderValue')
  emit('change', text)
}

function findParentIds(tree, targetLabel, path = []) {
  for (const node of tree) {
    // 将当前节点的 value 加入路径
    const currentPath = [...path, node.id]

    // 如果当前节点的 label 匹配目标 label，返回路径
    if (node.name === targetLabel) {
      return currentPath
    }

    // 如果有子节点，递归查找
    if (node.children && node.children.length > 0) {
      const result = findParentIds(node.children, targetLabel, currentPath)
      if (result) {
        return result
      }
    }
  }

  // 如果没有找到，返回 null
  return null
}

const HuiXian = (text) => {
  initMenu().then(() => {
    if (!text) return
    const text2 = text.split('/')[1]
    console.log(text2, 'text2')
    const res = findParentIds(menuList.value, text2)
    // console.log();
    cascaderValue.value = res
  })
}
const reset = () => {
  cascaderValue.value = []
}

defineExpose({
  HuiXian,
  reset
})
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
