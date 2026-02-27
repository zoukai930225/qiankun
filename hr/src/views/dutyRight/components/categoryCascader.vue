<!--
 * @Date: 2025-03-17 09:46:11
-->
<template>
  <div class="cascaderBox" v-loading="loading" spinner="cascader-loading">
    <el-cascader v-model="value1" :options="options" @change="handleChange" :props="myPropos" :placeholder="placeholder"
      style="width: 100%" :collapse-tags="collapseTags" ref="cascadeRef" :clearable="clearable"
      @visible-change="handleClose" :teleported="popperAppendToBody" filterable :max-collapse-tags-tooltip-height="300"
      collapse-tags-tooltip :disabled="disabled" :separator="separator" popper-class="duty-right-categroy-cascader">
      <template #default="{ data, node }">
        <div class="flex" style="align-items: center">
          <img style="width: 18px; height: 18px; margin-right: 5px" :src="getImageUrl(data.channelCode)"
            v-if="node.data.isChannel" /><span>{{ data[myPropos.label] }}</span>
        </div>
      </template>
    </el-cascader>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useExportParams } from '@/store/modules/BI'
import { getImageUrl } from '@/utils/index'
const ExportParams = useExportParams()
const value1 = defineModel<string[] | number[] | any>({ default: [] })
import { cloneDeep } from 'lodash-es'
const props = defineProps({
  placeholder: {
    type: String,
    default: '请选择类目'
  },
  clearable: {
    type: Boolean,
    default: true
  },
  showLevel: {
    type: Number,
    //0 - 全部，1-展示1级，2-展示2级，以此例推
    default: 0
  },
  cascaderProps: {
    type: Object as PropType<any>,
    default: () => ({})
  },
  collapseTags: {
    type: Boolean,
    default: true
  },
  popperAppendToBody: {
    type: Boolean,
    default: true
  },
  //上级code，用来做筛选联动
  topCodes: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  disabledChannel: {
    type: Boolean,
    default: false
  },
  //渠道code，用来做筛选
  channelCode: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  //权限限制
  usePremission: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  separator: {
    type: String,
    default: '>'
  }
})

const emit = defineEmits<{
  (e: 'change', value: Object, node: any): void
  (e: 'close', value: Object): void
}>()

const cascadeRef = ref()
const handleChange = (value: any) => {
  const node = cascadeRef.value?.getCheckedNodes()
  if (!myPropos.value.multiple && myPropos.value.checkStrictly && value && Array.isArray(value) && value.length > 0) {
    if (value.length > 1) {
      emit('change', value, Array.isArray(node) && node.length > 0 && !!node[0] ? node[0] : null)
      cascadeRef.value?.togglePopperVisible(false)
    }
  } else {
    emit('change', value, Array.isArray(node) && node.length > 0 && !!node[0] ? node[0] : null)
  }
}

const handleClose = (val) => {
  if (val) return
  emit('close', value1.value)
}
const options = ref<any[]>([])
const getList = async () => {
  let res = [] as any[]
  if (props.usePremission) {
    res = await ExportParams.getCategoryList()
  } else {
    res = await ExportParams.getCategoryAllList()
  }
  options.value = []
  const data = cloneDeep(res)
  for (let i = 0; i < data.length; i++) {
    if (props.showLevel > 0) {
      dealData(data[i].categoryList, 0)
    }
    if (props.topCodes?.length > 0) {
      if (props.topCodes.includes(data[i].channelCode) || props.topCodes.includes(data[i].channelName)) {
        if (props.topCodes.length > 1) {
          dealTopCodes(data[i].categoryList)
        }
        options.value = [
          {
            categoryName: data[i].channelName,
            children: data[i].categoryList,
            channelCode: data[i].channelCode,
            isChannel: true,
            disabled: props.disabledChannel
          }
        ]
        break;
      } else {
        dealTopCodes(data[i].categoryList)
      }
    }
    if (props.channelCode.length > 0 && (props.channelCode.includes(data[i].channelCode) || props.channelCode.includes(data[i].channelName))) {
      options.value.push({
        categoryName: data[i].channelName,
        children: data[i].categoryList,
        channelCode: data[i].channelCode,
        isChannel: true,
        disabled: props.disabledChannel
      })
    }

    if (props.channelCode.length === 0) {
      options.value.push({
        categoryName: data[i].channelName,
        children: data[i].categoryList,
        channelCode: data[i].channelCode,
        isChannel: true,
        disabled: props.disabledChannel
      })
    }

  }
  loading.value = false
}

const dealData = (data: any[], level = 0) => {
  level = level + 1
  for (let i = 0; i < data.length; i++) {
    if (level >= props.showLevel) {
      data[i].children = undefined
    } else if (Array.isArray(data[i].children)) {
      dealData(data[i].children, level)
    }
  }
}


const dealTopCodes = async (data: any[], level = 1) => {
  level = level + 1
  for (let i = 0; i < data.length; i++) {
    if (!props.topCodes.includes(data[i].categoryName)) {
      data.splice(i, 1)
      i--;
    } else if (data[i]?.children?.length > 0) {
      if (level < props.topCodes.length) {
        dealTopCodes(data[i]?.children, level)
      }
    }
  }
}

const myPropos = ref<any>({
  multiple: false,
  value: 'categoryName',
  label: 'categoryName',
  children: 'children',
  expandTrigger: 'hover',
})
onMounted(() => {
  Object.assign(myPropos.value, props.cascaderProps)
  getList()
})

const loading = ref(false)
watch(() => props.topCodes, (newVal, oldVal) => {
  if (!oldVal || (JSON.stringify(newVal) === JSON.stringify(oldVal))) return
  loading.value = true
  getList()
})

watch(() => props.channelCode, (newVal, oldVal) => {
  if (!oldVal || (JSON.stringify(newVal) === JSON.stringify(oldVal))) return
  loading.value = true
  getList()
})
</script>
<style lang="scss" scoped>
* {
  --el-color-primary: #0064ff;
}

.cascaderBox {
  width: 100%;

  .el-input {
    --el-input-inner-height: 30px;
  }

  :deep(.el-input__wrapper) {
    height: 30px;
    padding: 0 11px;
    box-shadow: none;
    border: 1px solid #e5e5e5;

    &:hover {
      box-shadow: none;
      border-color: #0064ff;
    }

    .is-focus {
      box-shadow: none;
      border-color: #0064ff;
    }
  }

  :deep(.el-input__inner) {
    height: 30px;
    line-height: 30px;
  }

  :deep(.el-select__wrapper) {
    box-shadow: none;
    border: 1px solid #e5e5e5;
  }

  :deep(.el-cascader__tags) {
    flex-wrap: nowrap;
  }

  :deep(.el-cascader__search-input) {
    min-width: 40px;
    width: 40px;
  }

  :deep(.el-cascader__suggestion-item) {
    height: auto;
  }
}

* {
  --el-loading-spinner-size: 20px
}
</style>
<style lang="scss">
.duty-right-categroy-cascader {
  .el-cascader-node {
    height: auto;
    line-height: 17px;
    padding-top: 3px;
    padding-bottom: 3px;
  }

  .el-cascader-node__label {
    max-width: 120px;
    text-overflow: inherit;
    word-break: break-all;
    white-space: inherit;
  }
}
</style>
