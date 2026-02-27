<template>
  <div class="cascaderBoxAdmin">
    <el-cascader
      ref="cascaderRef"
      :options="storeList"
      :collapse-tags="true"
      :model-value="cascaderValue"
      :props="customProps"
      @change="handleChange"
      @clear="handleClear"
      :placeholder="placeholder"
      :clearable="clearable"
      :max-collapse-tags="maxCollapsetags"
      :collapse-tags-tooltip="collapseTagsTooltip"
      filterable
      style="width: 100%"
    >
      <template #default="{ data }">
        <div>
          <img v-if="getImageUrl(data.id)" class="storeImg" :src="getImageUrl(data.id)" alt="" />
          {{ data.name }}
        </div>
      </template>
    </el-cascader>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue' // 补全引用，防止未定义
import { getImageUrl } from '@/utils/index'
import { useAllDeptTree } from '@/hooks/common/useDeptTree'

import type { PropType } from 'vue'

const { menuList } = useAllDeptTree()
const StroeList = ref(['TaoBao', 'Tmall', 'Douyin', 'Pdd'])

const props = defineProps({
  modelValue: String,
  options: {
    type: Array as PropType<any[]>
  },
  placeholder: {
    type: String,
    default: '请选择店铺'
  },
  clearable: {
    type: Boolean,
    default: true
  },
  customProps: {
    type: Object as PropType<any>,
    default: () => ({
      label: 'name',
      value: 'id',
      children: 'children',
      multiple: true,
      collapse: true
    })
  },
  customList: {
    type: Array,
    default: () => []
  },
  // 用法示例：['Pdd', 'Douyin']，如果为空数组则不顾虑
  platformFilter: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  maxCollapsetags: {
    type: Number,
    default: 1
  },
  collapseTagsTooltip: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  (e: 'change', value: Object): void
  (e: 'update:modelValue', value: String): void
  (e: 'clear'): void
}>()

const storeList: any = computed(() => {
  // 1. 获取原始数据源
  let arr = props?.options || menuList.value || []

  // 2. 处理过滤逻辑
  if (props.platformFilter && props.platformFilter.length > 0) {
    arr = arr.filter((item: any) => {
      // 获取当前节点的 name 或 id (通常顶级节点的 name 就是 'Pdd', 'Douyin' 等)
      // 兼容处理：优先匹配 customProps 中定义的 label 字段，其次匹配 name 或 id
      const labelKey = props.customProps?.label || 'name'
      const valueKey = props.customProps?.value || 'id'

      // 判断 过滤数组 中是否包含当前节点的 名字 或 ID
      return (
        props.platformFilter.includes(item[labelKey]) ||
        props.platformFilter.includes(item[valueKey]) ||
        props.platformFilter.includes(item.name)
      )
    })
  }

  return arr.length > 0 ? props?.customList.concat(arr) : []
})

const cascaderValue = computed(() => {
  if (!props.modelValue) return []
  return props.modelValue.split(',')
})

const handleChange = (value: any[]) => {
  console.log(value, '组件value')
  let storeList: any[] = []
  value.forEach((item) => {
    if (item.length > 0) {
      storeList.push(item[item.length - 1])
    }
  })
  emit('update:modelValue', storeList.join(','))

  emit('change', value)
}

const handleClear = () => {
  emit('update:modelValue', '')
  emit('change', '')
  emit('clear')
}
</script>
<style lang="scss" scoped>
.storeImg {
  width: 20px;
  height: 20px;
  vertical-align: middle;
}

/* 自定义样式控制输入框高度 */
.cascaderBoxAdmin {
  :deep(.el-cascader__search-input) {
    display: none;
  }

  :deep(.el-cascader__tags) {
    flex-wrap: nowrap;
  }

  :deep(.el-input__wrapper) {
    height: auto;
  }
}
</style>
