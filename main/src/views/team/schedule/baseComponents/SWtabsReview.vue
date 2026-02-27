<!--
 * @Date: 2024-09-13 15:25:17
table tabs review
-->
<template>
  <div class="tabs-review-wapper">
    <div class="tabs-wapper">
      <div
        class="item"
        v-for="item in tabsList"
        :key="item.label"
        :class="{ active: currentIndex == item.code }"
        @click="handleChange(item)"
        >{{ item.label }}</div
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
const message = useMessage() // 消息弹窗
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { getSubNodeList } from '../common.js'
defineOptions({ name: 'SWTabsReview' })

const props = defineProps({
  modelValue: {
    type: String,
    default: '0' //0:人像 1:静物 2:视频 视觉3  平面4
  },

  isThreeSubNode: {
    type: Boolean,
    default: true
  }
})
const tabsList = ref()
const emit = defineEmits(['update:modelValue', 'handleChange'])

const initData = async () => {
  const res = await getSubNodeList(props.isThreeSubNode ? 3 : 2)
  if (props.modelValue || props.modelValue == '0') {
    emit('update:modelValue', props.modelValue)
  } else {
    emit('update:modelValue', res[0].code)
  }

  tabsList.value = res
}

const currentIndex = computed({
  get: () => {
    return props.modelValue
  },
  set: (val) => {
    emit('update:modelValue', val)
  }
})

const handleChange = (item) => {
  currentIndex.value = item.code
  emit('handleChange', item.code)
}

onMounted(() => {
  initData()
})
</script>

<style scoped lang="scss">
.tabs-review-wapper {
  .tabs-wapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 32px;
    background: #f1f2f5;
    border-radius: 20px;
    .item {
      cursor: pointer;
      width: 66px;
      height: 28px;
      border-radius: 20px;
      line-height: 28px;
      text-align: center;
      font-weight: 400;
      font-size: 14px;
      color: #666666;
      margin: 0 2px;
    }
    .active {
      background: #ffffff;
      color: #0064ff;
    }
  }
}
</style>
