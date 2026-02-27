<!--
 * @Date: 2025-03-17 09:46:11
-->
<template>
  <div class="cascaderBox">
    <el-cascader v-model="value1" :options="options" @change="handleChange" :props="myPropos" :placeholder="placeholder"
      :popper-class="popoverClass" :collapse-tags-tooltip="collapseTagsTooltip" @clear="handleClear" style="width: 100%"
      :collapse-tags="collapseTags" ref="cascadeRef" :clearable="clear" @visible-change="handleClose"
      :teleported="popperAppendToBody" filterable v-bind="otherProps" :max-collapse-tags-tooltip-height="300">
      <template #default="{ data, node }">
        <div class="flex" style="align-items: center">
          <img style="width: 18px; margin-right: 5px" :src="getImageUrl(data.storeCode)" object-fit="contain"
            v-if="node.data.isChannel && data[myPropos.label] !== '渠道'" /><span>{{ data[myPropos.label] }}</span>
        </div>
      </template>
    </el-cascader>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useExportParams } from '@/store/modules/BI'
import { getImageUrl } from '@/utils/index'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
const ExportParams = useExportParams()
import { generateUUID } from '@/utils'
const value1: string[] | number[] | any = defineModel()
const props = defineProps({
  value: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  placeholder: {
    type: String,
    default: '请选择店铺'
  },
  clear: {
    type: Boolean,
    default: true
  },
  display: {
    type: String,
    //channel - 只展示渠道
    default: 'all'
  },
  cascaderProps: {
    type: Object as PropType<any>,
    default: () => ({})
  },
  collapseTags: {
    type: Boolean,
    default: true
  },
  collapseTagsTooltip: {
    type: Boolean,
    default: true
  },
  popperAppendToBody: {
    type: Boolean,
    default: true
  },
  //cascader其他没有列出来的属性
  otherProps: {
    type: Object as PropType<any>,
    default: () => ({})
  },
  //允许展示的渠道，不传展示全部，传入channel的code或名字,区分大小写
  filterChannel: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  //多选时是否展示footer
  showFooter: {
    type: Boolean,
    default: false
  },
  //展示全渠道
  showAll: {
    type: Boolean,
    default: false
  },
  //权限限制
  usePremission: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  (e: 'change', value: Object, node: any): void
  (e: 'close', value: Object): void
  (e: 'clear'): void
  (e: 'submit'): void
  (e: 'created', value: any): void
}>()

//字典里全部渠道值
const channelList = getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_CHANNEL, true)
const popoverClass = ref(`bi-store-cascader_${generateUUID()}`)
const cascadeRef = ref()
const handleChange = (value: any) => {
  const node = cascadeRef.value?.getCheckedNodes()
  emit('change', value, node?.length > 0 ? node : null)
  if (!myPropos.value.multiple && myPropos.value.checkStrictly && value && Array.isArray(value) && value.length > 1) {
    if (value[0] === '渠道') {
      cascadeRef.value?.togglePopperVisible(false)
    } else if (value.length > 2) {
      cascadeRef.value?.togglePopperVisible(false)
    }

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
    res = await ExportParams.getStorePremissonList()
  } else {
    res = await ExportParams.getStoreList()
  }
  if (!res) return
  options.value = []
  const codeList = new Set<any>();
  channelList.forEach((item) => {
    if (props.filterChannel.includes(item.value || item.label)) {
      codeList.add(item.value)
    } else {
      props.filterChannel.map((code: any) => {
        if (item.value?.toString().includes(code)) {
          codeList.add(item.value)
        }
      })
    }
  })

  res.map((item) => {
    Object.assign(item, {
      storeName: item.channelName ? item.channelName : item.channelCode === 'ALL' ? '全渠道' : '-',
      storeCode: item.channelCode,
      isChannel: true
    })
    //只展示渠道
    if (props.display === 'channel') {
      delete item.storeList
    }
    if (codeList.size > 0) {
      if (codeList.has(item.storeCode)) {
        options.value.push(item)
      }
    } else {
      options.value.push(item)
    }
  })

  if (props.showAll &&
    options.value.findIndex((item) => item.storeCode === 'ALL') === -1) {
    options.value = [{
      storeName: '全渠道',
      storeCode: 'ALL',
      isChannel: true
    }, ...options.value]
  }
  if (!props.showAll) {
    options.value = options.value.filter((item) => item.storeCode !== 'ALL')
  }
  emit('created', options.value)
}
const myPropos = ref<any>({
  multiple: false,
  value: 'storeCode',
  label: 'storeName',
  children: 'storeList',
  expandTrigger: 'hover',
})

onMounted(() => {
  Object.assign(myPropos.value, props.cascaderProps)
  getList()
  addFooter()
})

const handleClear = async () => {
  await nextTick()
  emit('clear')
}


//多选手动加fotter
const addFooter = () => {
  if (!myPropos.value.multiple || !props.showFooter) {
    if (document.querySelector(`.${popoverClass.value} .el-cascader__footer`)) {
      document.querySelector(`.${popoverClass.value} .el-cascader__footer`)?.remove()
    }
    return
  }
  const newNode = document.createElement('div');
  newNode.setAttribute('class', 'el-cascader__footer');
  newNode.innerHTML = '<button aria-disabled="false" type="button" class="el-button el-button--primary el-button--small dept-submit-btn"><span class="">确 定</span></button>'
  document.querySelector(`.${popoverClass.value} .el-cascader-panel`)?.parentNode?.appendChild(newNode)
  newNode.querySelector('.dept-submit-btn')?.addEventListener('click', handleSubmit)
}

const handleSubmit = () => {
  cascadeRef.value?.togglePopperVisible(false)
  emit('submit')
}
defineExpose({ getList })
</script>
<style lang="scss" scoped>
* {
  --el-color-primary: #0064ff;
}

.storeImg {
  width: 20px;
  height: 20px;
  vertical-align: middle;
  margin-right: 8px;
}

/* 自定义样式控制输入框高度 */
.cascaderBox {
  width: 100%;

  .el-input {
    & {
      --el-input-inner-height: 30px;
    }
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
    line-height: 30px
  }

  :deep(.el-select__wrapper) {
    box-shadow: none;
    border: 1px solid #e5e5e5;
  }

  :deep(.el-cascader__tags) {
    flex-wrap: nowrap;
  }

  :deep(.el-cascader__search-input) {
    min-width: 18px;
  }

  :deep(.el-tag.is-closable) {
    max-width: 120px;
  }

  :deep(.el-cascader__suggestion-item) {
    height: auto;
    line-height: 17px;
    padding: 5px 15px;
    word-break: break-all;
  }
}

:deep(.el-cascader__footer) {
  padding: 10px;
  border-top: 1px solid var(--el-border-color-light);
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}
</style>
