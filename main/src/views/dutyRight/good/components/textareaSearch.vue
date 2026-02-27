<template>
  <el-popover placement="bottom" :width="(width + 100)">
    <template #reference>
      <div class="row-center">
        <div :style="`width: ${(width - 22 - 31)}px`" class="show-box text1">
          <span v-if="!!value">{{ displayVal }}</span>
          <span v-else style="color: #a8abb2;">请输入{{ name }}</span>
        </div>
        <div class="row-center icon-box" @click="handleTypeChange">
          <el-icon>
            <Sort />
          </el-icon>
        </div>
      </div>
    </template>
    <div class="mb5px" style="color: #666666;">已输入{{ name }}：{{ currentNum }}/{{ max }}<span style="font-size: 12px; color: #999999;" class="ml5px">(一个商品ID一行)</span></div>
    <s-text-area v-model="value" :autosize="{ minRows: 6, maxRows: 15 }" style="width: 100%"
      :placeholder="`请输入${name}(不超过${max}个)，每输完一个请以回车键结束`" @change="handleChange" />
    <div class="row-center mt10px">
      <el-button type="primary" size="small" @click="search">搜索</el-button>
      <el-button size="small" @click="clear">清除</el-button>
    </div>
  </el-popover>
</template>
<script lang="ts" setup>
import STextArea from '@/components/common/input/s-textarea.vue'
const props = defineProps({
  width: {
    type: Number,
    default: 220
  },
  //最多可输入行数
  max: {
    type: Number,
    default: 200
  },
  name: {
    type: String,
    default: '商品ID'
  },
})
const emit = defineEmits(['change', 'selectChange'])
const message = useMessage()
const value = defineModel({ type: String, default: '' })
const displayVal = computed(() => value.value.split('\n').filter(item => !!item).join(','))
const currentNum = computed(() => value.value.split('\n').filter(item => !!item).length)
const handleChange = (val: string) => {
  const attrs = val.split('\n').filter(item => !!item)
  if (attrs.length > props.max) {
    message.error(`不能超过${props.max}个`)
    value.value = attrs.slice(0, props.max).join('\n')
  }
}
const clear = () => {
  value.value = '';
  emit('change', value.value)
}

const search = () => {
  emit('change', value.value)
}

const handleTypeChange = () => {
  emit('selectChange')
}
</script>
<style lang="scss" scoped>
.show-box {
  height: 28px;
  border: 1px solid rgb(229, 229, 229);
  border-radius: 4px;
  padding: 1px 11px;
  cursor: pointer;
  font-size: 14px;
  line-height: 28px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;

  &:hover {
    border-color: #c0c4cc;
  }
}

.icon-box {
  justify-content: center;
  width: 30px;
  height: 30px;
  border-top: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  border-right: 1px solid #dcdfe6;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  cursor: pointer;
  color: #666666;

  &:hover {
    color: #999;
  }
}
</style>