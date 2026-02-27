<!--
 * @Date: 2025-03-17 09:46:11
-->
<template>
  <div style="width: 100%;" class="row-center">
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
      <el-cascader v-model="value1" :options="options" :props="myPropos" :placeholder="placeholder" :filterable="true"
        @change="handleChange" collapse-tags collapse-tags-tooltip :max-collapse-tags-tooltip-height="300"
        style="width: 100%" ref="cascadeRef" :clearable="clearable" :teleported="false" :disabled="!channel || disabled"
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
    default: '>>'
  },
  //允许展示的渠道，不传展示全部，传入channel的code或名字,区分大小写
  filterChannel: {
    type: Array as PropType<any[]>,
    default: () => []
  },
})

const emit = defineEmits<{
  (e: 'change', value: any[]): void
  (e: 'close', value: Object): void,
  (e: 'channelChange'): void
}>()

const ExportParams = useExportParams()
const value1 = defineModel<any[]>({ default: [] })

const channel = defineModel<string>('channel', { default: '' })
const options = ref<any[]>([])
//所有选项
let allOptions = ref<any>({})
//所有渠道
const allChannels = ref<any[]>([])

const getList = async () => {
  const res = await ExportParams.getCategoryAllList()
  const data = cloneDeep(res)
  const codeList = new Set<any>();
  const currentChannels: any[] = []
  for (let i = 0; i < data.length; i++) {
    allOptions.value[data[i].channelCode] = {
      categoryName: data[i].channelName,
      children: data[i].categoryList,
      channelCode: data[i].channelCode,
      isChannel: true,
    }
    currentChannels.push({
      channelName: data[i].channelName,
      channelCode: data[i].channelCode,
    })
    if (props.filterChannel.includes(data[i].channelCode || data[i].channelName)) {
      codeList.add(data[i].channelCode)
    } else {
      props.filterChannel.map((code: any) => {
        if (data[i].channelCode?.toString().includes(code)) {
          codeList.add(data[i].channelCode)
        }
      })
    }
  }

  currentChannels.map((item) => {
    if (codeList.size > 0) {
      if (codeList.has(item.channelCode)) {
        allChannels.value.push(item)
      }
    } else {
      allChannels.value.push(item)
    }
  })
}
//渠道选择变化
const handleChannelChange = (val: string) => {
  options.value = cloneDeep(allOptions.value[val]).children
  value1.value = []
  emit('channelChange')
}
const handleChange = (val: any[]) => {
  emit('change', val)
}
const myPropos = reactive<any>({
  multiple: true,
  value: 'categoryName',
  label: 'categoryName',
  children: 'children',
  expandTrigger: 'hover',
  disabled: 'disabled',
  hoverThreshold: 1000,
  checkStrictly: true
})


onMounted(() => {
  getList()
})

const setChannelChange = (val: string) => {
  options.value = cloneDeep(allOptions.value[val]).children
}

onBeforeUnmount(() => {

})
defineExpose({
  setChannelChange
})

</script>
<style lang="scss" scoped>
* {
  --el-color-primary: #0064ff;
  --el-border-color: #dcdfe6;
}

.cascaderBox {
  width: calc(100% - 130px);

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

  :deep(.el-cascader__tags) {
    flex-wrap: nowrap;
  }

  :deep(.el-cascader__suggestion-item) {
    height: auto;
  }
}
</style>
