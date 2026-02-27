<!--
 * @Date: 2025-03-17 09:46:11
-->
<template>
  <div class="cascaderBox">
    <el-cascader
      ref="cascaderRef"
      :options="options || menuList"
      :props="customProps"
      @change="handleChange"
      :placeholder="placeholder"
      :clearable="clearable"
      filterable
      style="width: 100%"
      :collapse-tags="collapse"
    >
      <template #default="{ data }">
        <div>
          <img
            v-if="StroeList.includes(data.id)"
            class="storeImg"
            :src="getImageUrl(data.id)"
            alt=""
          />
          {{ data.name }}
        </div>
      </template>
    </el-cascader>
  </div>
</template>

<script lang="ts" setup>
import { getImageUrl } from '@/utils/index'
import { useDeptTree } from '@/hooks/common/useDeptTree'

import type { PropType } from 'vue'

const { menuList } = useDeptTree({ isPermission: 1, type: 'BI' })

const StroeList = ref(['TaoBao', 'Tmall', 'Douyin', 'Pdd'])
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
  collapse: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  (e: 'change', value: Object): void
  (e: 'update:value', value: any[]): void
}>()

const cascaderValue = computed({
  get: () => props.value,
  set: () => {}
})

const handleChange = (value: any[]) => {
  console.log(value, '组件value')
  emit('change', value)
}
</script>
<style lang="scss" scoped>
.storeImg {
  width: 20px;
  height: 20px;
  vertical-align: middle;
}

/* 自定义样式控制输入框高度 */
.cascaderBox {
  :deep(.el-cascader__search-input) {
    display: none;
  }
}
</style>
