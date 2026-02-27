<!--
 * @Date: 2025-03-17 09:46:11
-->
<template>
  <div style="width: 100%;" class="row-center" :id="pannelId">
    <el-select v-model="channel" placeholder="请选择" style="width: 120px" filterable @change="handleChannelChange"
      :disabled="disabled">
      <el-option v-for="item in allChannels" :key="item.channelCode" :label="item.channelName"
        :value="item.channelCode">
        <div class="flex" style="align-items: center">
          <img style="width: 18px;  margin-right: 5px" :src="getImageUrl(item.channelCode)" object-fit="contain" />
          <span>{{ item.channelName }}</span>
        </div>
      </el-option>
    </el-select>
    <div class="cascaderBox ml10px">
      <el-cascader v-model="value1" :options="options" @change="handleChange" :props="myPropos"
        :placeholder="placeholder" show-checked-strategy="parent" :filterable="true" style="width: 100%"
        ref="cascadeRef" :clearable="clearable" :teleported="false" :disabled="!channel || disabled"
        :separator="separator">
        <template #default="{ data, node }">
          <div class="flex" style="align-items: center">
            <img style="width: 18px; height: 18px; margin-right: 5px" :src="getImageUrl(data.channelCode)"
              v-if="node.data.isChannel" /><span>{{ data[myPropos.label] }}</span>
          </div>
        </template>
      </el-cascader>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useExportParams } from '@/store/modules/BI'
import { getImageUrl } from '@/utils/index'
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
  disabled: {
    type: Boolean,
    default: false
  },
  separator: {
    type: String,
    default: '>'
  },
  pannelId: {
    type: String,
    required: true
  }
})

const emit = defineEmits<{
  (e: 'change', value: any[], backup: any): void
  (e: 'close', value: Object): void
  (e: 'back', value: Object): void
}>()

interface allValueData {
  //类目名
  [property: string]: {
    //存储后台类目
    value: any[]
    //用于前端回显的类目
    backup: any[]
  };
}
const ExportParams = useExportParams()
const value1 = ref<any[]>([])
const allValue = ref<allValueData>({})
const channel = ref<any>('')
const options = ref<any[]>([])
//所有选项
let allOptions = ref<any>({})
//所有渠道
const allChannels = ref<any[]>([])
const cascadeRef = ref<any>()

const resetData = () => {
  allChannels.value = []
  options.value = []
  allValue.value = {}
  allOptions.value = {}
  channel.value = ''
}
const getList = async () => {
  const res = await ExportParams.getCategoryAllList()
  const data = cloneDeep(res)
  for (let i = 0; i < data.length; i++) {
    allOptions.value[data[i].channelCode] = {
      categoryName: data[i].channelName,
      children: data[i].categoryList,
      channelCode: data[i].channelCode,
      isChannel: true,
    }
    allChannels.value.push({
      channelName: data[i].channelName,
      channelCode: data[i].channelCode,
    })
    allValue.value[data[i].channelCode] = {
      value: [],
      backup: []
    }
  }
}
//渠道选择变化
const handleChannelChange = (val: string) => {
  options.value = cloneDeep(allOptions.value[val]).children
  value1.value = allValue.value[val].backup.map(item => item.value)
  console.log("handleChannelChange", value1.value)
}

const myPropos = reactive<any>({
  multiple: true,
  value: 'categoryId',
  label: 'categoryName',
  children: 'children',
  expandTrigger: 'hover',
  disabled: 'disabled',
  hoverThreshold: 1000,
})


onMounted(() => {
  resetData()
  getList()
})


const handleChange = (value: any) => {
  const data: any[] = []
  const nodes = document.getElementById(props.pannelId)?.querySelector('.el-cascader__tags')?.querySelectorAll('.el-tag__content')
  if (nodes) {
    Array.from(nodes).forEach((node) => {
      if (node.children) {
        Array.from(node.children).forEach((child) => {
          if (child?.innerText) {
            data.push(child.innerText.split(props.separator))
          }
        })
      }

    })
  }
  const backVal = [] as any[];
  const checkNodes = cascadeRef.value.getCheckedNodes();
  value.map(each => {
    if (checkNodes.findIndex(item => JSON.stringify(item.pathValues) === JSON.stringify(each)) > -1) {
      backVal.push({
        value: each,
        name: checkNodes.find(item => JSON.stringify(item.pathValues) === JSON.stringify(each)).pathLabels
      })
    }
  })

  allValue.value[channel.value].value = data
  allValue.value[channel.value].backup = backVal
  const reData: any[] = [], backup: any = {};
  Object.keys(allValue.value).forEach(key => {
    if (key !== channel.value) {
      allValue.value[key].value.map(item => {
        reData.push([allChannels.value.find(i => i.channelCode === key)?.channelName, ...item])
      })
    }
    backup[key] = allValue.value[key].backup
  })
  data.map(item => {
    reData.push([allChannels.value.find(i => i.channelCode === channel.value)?.channelName, ...item])
  })

  emit('change', reData, backup)
}


const getChannelsList = () => {
  return allChannels.value
}
const setValue = (channelCode: string, value: any[], backup: any[]) => {
  allValue.value[channelCode] = {
    value: cloneDeep(value),
    backup: cloneDeep(backup)
  }
  if (channelCode === channel.value) {
    value1.value = backup.map(item => item.value)
  }
}

let interNum = ref<any>(0)
//编辑时原数据回显
const setOriginValue = (val: any) => {
  let channelCode = ''
  Object.keys(val).map(key => {
    if (!channelCode && val[key].backup?.length > 0) {
      channelCode = key
    }
  })
  if (interNum.value) {
    clearInterval(interNum.value)
  }
  interNum.value = setInterval(() => {
    if (Object.keys(allOptions.value).includes(channelCode) && Array.isArray(allOptions.value[channelCode].children)) {
      clearInterval(interNum.value)
      interNum.value = 0
      allValue.value = cloneDeep(val)
      channel.value = channelCode;
      const backUp = {} as any;
      Object.keys(val).map(key => {
        backUp[key] = val[key].backup
      })
      nextTick(() => {
        emit('back', backUp)
        handleChannelChange(channelCode)
      })
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
  getChannelsList, setValue, setOriginValue
})

</script>
<style lang="scss" scoped>
* {
  --el-color-primary: #0064ff;
  --el-border-color: #dcdfe6;
}

.cascaderBox {
  width: calc(100% - 140px);

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

  :deep() {
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

}
</style>
