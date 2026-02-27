<template>
  <div class="row-center">
    <el-select v-model="value" filterable remote :placeholder="placeholder" :remote-method="remoteMethod"
      :loading="loading" style="width: 100%" clearable @change="handleChange">
      <template #label="{ label, value }">
        <span style="font-size: 12px;color: #999;">{{ value.lable }}：</span>
        <span>{{ label }}</span>
      </template>
      <el-option v-for="(item, index) in options" :key="index" :label="item.query" :value="item.value">
        <span class="common-text">{{ item.prefix }}</span>
        <span class="lable-text">
          {{ item.query }}
        </span>
        <span class="common-text">{{ item.suffix }}</span>
      </el-option>
    </el-select>
    <div class="row-center icon-box" @click="handleTypeChange">
      <el-icon>
        <Sort />
      </el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  placeholder: {
    type: String,
    default: '请输入关键词'
  },
  suffixText: {
    type: String,
    default: '的记录'
  }
})
const emit = defineEmits(['change', 'selectChange'])
const value: any = defineModel()
const loading = ref(false)
const options = ref<any[]>([])
//关键词:1.商品ID/2.名称/3.货品编码/4.负责人名称
const list = [{
  id: 2,
  lable: '商品名称包含'
}, {
  id: 1,
  lable: '商品ID包含'
}, {
  id: 4,
  lable: '链接负责人包含'
}, {
  id: 3,
  lable: '货品编码包含'
}]
const remoteMethod = (query: string) => {
  options.value = []
  if (query) {
    list.forEach((item) => {
      options.value.push({
        prefix: item.lable,
        query: query,
        suffix: props.suffixText,
        value: {
          ...item, query
        }
      })
    })
  }
}
const handleChange = (val: any) => {
  emit('change', val)
}

const handleTypeChange = () => {
  emit('selectChange')
}
</script>
<style lang="scss" scoped>
.lable-text {
  color: #0064ff;
  padding: 0 5px;
}

.common-text {
  color: #666666;
}

:deep() {
  .el-select__wrapper {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
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