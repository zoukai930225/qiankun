<template>
  <div>
    <el-input ref="inputRef" v-if="!justDialog" :model-value="inputVModel" :prefix-icon="SearchIcon"
      :placeholder="placeholder" :readonly="readonly" :disabled="disabled" :clearable="clearable" @clear="onClear"
      @click="handleOpen" />
    <el-dialog class="store-range-plus-dialog" title="应用范围" v-model="dialogVisible" width="540" ref="dialogRef"
      :show-close="false" :append-to-body="true" :before-close="beforeClose">
      <template #header>
        <div class="header">
          <div>应用范围</div>
          <img src="@/assets/imgs/common/close.png" alt="" @click="handleClose" />
        </div>
      </template>

      <div class="container">
        <div class="channel-container">
          <div class="channel-item" v-for="(item, index) in channelList" :key="index"
            :class="{ 'channel-item_selected': index === currentIndex }"
            @click="handlePlatformClick(item.platformId, index)">
            <div class="channel-item-logo">
              <img v-if="!!item.platformId" :src="getImageUrl(item.platformId)" alt="" />
            </div>
            {{ item.label }}
          </div>
        </div>
        <div class="store-container">
          <el-checkbox-group v-model="checkList" v-if="storeList?.length > 0" @change="handleChange">
            <el-checkbox ref="checkBox" :label="item?.shopName"
              :value="{ shopName: item?.shopName, storeCode: item?.storeCode }" v-for="(item, index) in storeList"
              :key="index" class="store-item" />
          </el-checkbox-group>
          <el-empty description="全渠道" v-else />
        </div>
      </div>

      <template #footer>
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="comfireValue">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import * as TagMngApi from '@/api/tagMng'
import { getImageUrl } from '@/utils'
import { isNumber } from 'lodash-es'

const props = withDefaults(
  defineProps<{
    /**
     * 绑定值
     */
    modelValue?: string | string[]
    /**
     * 渠道
     */
    channel?: string | string[]
    /**
     * 值类型
     */
    valueType?: 'storeCode' | 'shopName' | 'store'
    /**
     * 是否多选
     */
    multiple?: boolean
    /**
     * 原生属性
     */
    placeholder?: string
    /**
     * 输入框宽度
     */
    width?: string | number
    /**
     * 是否展示全渠道
     */
    showAllChannels?: boolean
    /**
     * 只使用弹窗
     */
    justDialog?: boolean
    /**
     * 外部控制弹窗开关，在justDialog为true时使用
     */
    showDialog?: boolean
    /**
     * 是否显示图标
     */
    showIcon?: boolean
    /**
     * 只读
     */
    readonly?: boolean
    /**
     * 清除按钮
     */
    clearable?: boolean
    /**
     * disable
     */
    disabled?: boolean
    /**
     * 关闭弹窗的回调
     */
    beforeClose?: (done: () => void) => void
  }>(),
  {
    valueType: 'storeCode',
    width: 200,
    showAllChannels: true,
    showIcon: true,
    beforeClose: (done: () => void) => {
      done()
    }
  }
)

const SearchIcon = props.showIcon ? Search : undefined

const emit = defineEmits([
  'update:modelValue',
  'change',
  'update:show-dialog',
  'clear',
  'update:channel'
])

const dialogVisible = ref(false)
watch(
  () => props.showDialog,
  (val) => {
    dialogVisible.value = val
  },
  {
    immediate: true
  }
)
const inputRef = ref()
const allData = ref()
const currentIndex = ref(0)
const storeList = ref<any[]>([])
const checkList = ref<any>([])
const dialogRef = ref()
const inputVModel = ref()

const channelList = computed(() => {
  const list = ['', ...new Set(allData.value?.map((el) => el.platformId))]?.map((el) => {
    let label: string = ''
    switch (el) {
      case 'Pdd':
        label = '拼多多'
        break
      case 'Douyin':
        label = '抖音'
        break
      case 'TaoBao':
        label = '淘宝'
        break
      case 'Tmall':
        label = '天猫'
        break
      case 'XHS':
        label = '小红书'
        break
      case 'KuaiShou':
        label = '快手'
        break
      case 'VIP':
        label = '唯品会'
        break
      case 'Dewu':
        label = '得物'
        break
      case 'WeiXinStore':
        label = '微信小店'
        break
      case 'Youzan':
        label = '有赞'
        break
      case 'JD':
        label = '京东'
        break
      default:
        label = '全渠道'
        break
    }
    return {
      platformId: el,
      label
    }
  })

  props.showAllChannels || list.shift()

  return list
})

watch(
  () => [props.modelValue, allData.value],
  async ([val, all]) => {
    await nextTick()
    if (val && all) {
      if (props.multiple) {
        const target = all?.find((el) => el[props.valueType] === (val as string).split(',')[0])

        currentIndex.value = channelList.value.findIndex(
          (el) => el.platformId === target?.platformId
        )

        checkList.value = (val as string).split(',').map((el) => {
          return {
            storeCode: all.find((ele) => ele[props.valueType] === el)?.storeCode,
            shopName: all.find((ele) => ele[props.valueType] === el)?.shopName
          }
        })
      } else {
        const target = all?.find((el) => el[props.valueType] === val)
        currentIndex.value = channelList.value.findIndex(
          (el) => el.platformId === target?.platformId
        )

        checkList.value = [
          {
            storeCode: all?.find((ele) => ele[props.valueType] === val)?.storeCode,
            shopName: all?.find((ele) => ele[props.valueType] === val)?.shopName
          }
        ]
      }

      storeList.value = all?.filter((el) => {
        return el.platformId === channelList.value[currentIndex.value]?.platformId
      })

      inputVModel.value = checkList.value?.map((el) => el?.shopName).join(',')
    } else {
      storeList.value = all?.filter((el) => {
        return el.platformId === channelList.value[currentIndex.value]?.platformId
      })
      checkList.value = []
      inputVModel.value = props.showAllChannels ? '全渠道' : ''
    }
  },
  {
    immediate: true
  }
)

watch(
  () => currentIndex.value,
  (val) => {
    storeList.value = allData.value?.filter((el) => {
      return el.platformId === channelList.value[val]?.platformId
    })
  },
  {
    immediate: true
  }
)

// 获取所有店铺信息
async function getAllData() {
  try {
    const res = await TagMngApi.getQueryChannels()
    allData.value = res
  } catch (error) { }
}

const handlePlatformClick = (platformId, index) => {
  currentIndex.value = index
  if (platformId === '全渠道') {
    checkList.value = []
  }
}

async function comfireValue() {
  let target: any = null;
  if (!props.multiple) {
    if (checkList.value.length) {
      target = checkList.value[checkList.value.length - 1]
      inputVModel.value = target?.shopName
      emit('update:modelValue', target[props.valueType])
    } else {
      inputVModel.value = '全渠道';
      target = null;
      emit('update:modelValue', '')
    }

    if (currentIndex.value === 0 && props.showAllChannels) {
      target = null;
      emit('update:modelValue', '')
    }
  } else {
    target = checkList.value;
    emit('update:modelValue', checkList.value.map((el) => el[props.valueType]).join(','))
  }

  await nextTick()
  emit('change', props.modelValue, target)

  handleClose()
}

function handleClose() {
  dialogVisible.value = false
  emit('update:show-dialog', false)
}
function handleOpen() {
  dialogVisible.value = true
  emit('update:show-dialog', true)
}

function handleChange(val) {
  if (!props.multiple && val.length >= 1) {
    // 如果选中的数量大于 1，只保留最后一个选中的值
    checkList.value = [val[val.length - 1]]
  } else if (val.length >= 1) {
    checkList.value = checkList.value.filter((el) => el?.shopName !== '全渠道')
  }
}

function onClear() {
  inputVModel.value = ''
  checkList.value = []
  emit('update:modelValue', '')
  emit('change', '', null)
  emit('clear')
}

getAllData()

onMounted(() => {
  // 设置自定义宽度
  if (inputRef.value?.$el) {
    inputRef.value.$el.style.width = isNumber(props.width) ? `${props.width}px` : props.width
  }

  if (typeof props.modelValue === 'string') {
    return [props.modelValue]
  } else if (props.modelValue && typeof props.modelValue === 'object') {
    return [...props.modelValue]
  }
})
</script>
<style lang="less">
.store-range-plus-dialog {
  padding: 20px;
  background-image: linear-gradient(226deg, #ffffff 0%, #ffffff 88%, #e8f6fd 95%, #f0f8ff 100%);
  border-radius: 14px;
}
</style>
<style lang="less" scoped>
::-webkit-scrollbar {
  display: none;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;

  img {
    width: 14px;
    cursor: pointer;
  }
}

.container {
  display: flex;
  width: 100%;
  max-height: 443px;
  margin: 0 auto;

  .channel-container {
    width: 120px;
    padding: 10px 4px;
    max-height: 320px;
    overflow: auto;
    border: 1px solid #dcdfe6;
    border-radius: 14px;
    margin-right: 14px;
    box-sizing: border-box;
    cursor: pointer;

    .channel-item {
      font-size: 14px;
      color: #333333;
      padding: 10px 0 10px 12px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      position: relative;
      margin-bottom: 6px;

      .channel-item-logo {
        display: flex;
        align-items: center;
        width: 14px;
        height: 14px;
        margin-right: 8px;

        img {
          width: 100%;
        }
      }
    }

    .channel-item_selected {
      background: #ecf4ff;

      &::before {
        content: ' ';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        background: #0064ff;
        border-radius: 4px 0px 0px 4px;
      }
    }
  }

  .store-container {
    flex-grow: 1;
    min-width: 300px;
    cursor: pointer;
    padding: 10px 16px;
    box-sizing: border-box;
    border: 1px solid #dcdfe6;
    border-radius: 14px;
    max-height: 320px;
    overflow: auto;

    .store-item {
      display: flex;
      font-size: 14px;
    }
  }
}
</style>
