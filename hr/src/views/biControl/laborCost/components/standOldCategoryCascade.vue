<!--
 * @Date: 2025-03-17 09:46:11
-->
<template>
  <div class="cascaderBox" :id="pannelId">
    <el-cascader v-model="value1" :options="options" @change="handleChange" :props="myPropos" :placeholder="placeholder"
      show-checked-strategy="parent" :filterable="true" ref="cascadeRef" :clearable="clearable" :teleported="false"
      :disabled="disabled" :separator="separator" style="width: 100%;" />
  </div>
</template>

<script lang="ts" setup>
import { cloneDeep } from 'lodash-es'
import { generateUUID } from '@/utils'
const props = defineProps({
  placeholder: {
    type: String,
    default: '请选择类目'
  },
  clearable: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  separator: {
    type: String,
    default: '>'
  },
})

const emit = defineEmits<{
  (e: 'change', value: any[], backup: any, allValue: any): void
  (e: 'close', value: Object): void
}>()

interface allValueData {
  //类目名
  value: any[]
  //用于前端回显的类目
  backup: any[]
}

const { oldCategoryListData } = inject('LaborcostForm') as any
const value1 = ref<any[]>([])
const allValue = ref<allValueData>({
  //类目名
  value: [],
  //用于前端回显的类目
  backup: []
})

const options = ref<any[]>([])

const resetData = () => {
  allValue.value = {
    //类目名
    value: [],
    //用于前端回显的类目
    backup: []
  }
  options.value = cloneDeep(oldCategoryListData.value)
  pannelId.value = generateUUID()
}

const cascadeRef = ref<any>()
const myPropos = reactive<any>({
  multiple: true,
  value: 'code',
  label: 'label',
  children: 'children',
  expandTrigger: 'hover',
  disabled: 'disabled',
  hoverThreshold: 1000,
})
const pannelId = ref<string>(generateUUID());

onMounted(() => {
  resetData()
})


const handleChange = (value: any) => {
  const data: any[] = []
  const checkNodes = cascadeRef?.value?.getCheckedNodes()
  const nodes = document.getElementById(pannelId.value)?.querySelector('.el-cascader__tags')?.querySelectorAll('.el-tag__content')
  if (nodes) {
    Array.from(nodes).forEach((node) => {
      if (node.children) {
        Array.from(node.children).forEach((child) => {
          if (child?.innerText) {
            data.push(child.innerText)
          }
        })
      }
    })
  }
  const dataAttrs = new Set<any>()
  checkNodes.map(node => {
    const eachText = node.pathLabels.join(props.separator)
    data.map(item => {
      if (eachText.includes(item)) {
        dataAttrs.add(JSON.stringify(node.pathValues.slice(0, item.split(props.separator).length)))
      }
    })
  })
  const dataAttrsArr = [...dataAttrs]
  const valuesAttr: any[] = []
  dataAttrsArr.map(item => {
    valuesAttr.push(JSON.parse(item))
  })
  allValue.value.value = valuesAttr
  allValue.value.backup = value
  console.log(allValue.value.value, allValue.value.backup)
  emit('change', valuesAttr, value, allValue.value)
}


let interNum = ref<any>(0)
//编辑时原数据回显
const setOriginValue = (val: any) => {
  if (interNum.value) {
    clearInterval(interNum.value)
  }
  interNum.value = setInterval(() => {
    if (options.value.length > 0) {
      clearInterval(interNum.value)
      interNum.value = 0
      allValue.value = cloneDeep(val)
      value1.value = cloneDeep(val.backup)
    }
  }, 10)
}

onBeforeUnmount(() => {
  if (interNum.value) {
    clearInterval(interNum.value)
    interNum.value = 0
  }
})
defineExpose({
  setOriginValue
})

</script>
<style lang="scss" scoped>
* {
  --el-color-primary: #0064ff;
  --el-border-color: #dcdfe6;
}

.cascaderBox {
  width: 100%;

  .el-input {
    --el-input-inner-height: 30px;
  }

  :deep(.el-input__wrapper) {
    height: auto;
    min-height: 30px;
    padding: 0 11px;
    display: flex;
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
    min-height: 30px;
    line-height: 30px;
  }

  :deep(.el-select__wrapper) {
    box-shadow: none;
    border: 1px solid #e5e5e5;
  }

  :deep(.el-cascader__search-input) {
    min-width: 40px;
    width: 40px;
  }
}
</style>
