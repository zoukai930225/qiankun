<template>
  <el-select v-model="value" filterable remote :placeholder="placeholder" :remote-method="remoteMethod"
    :loading="loading" style="width: 100%" clearable>
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

const value: any = defineModel()
const loading = ref(false)
const options = ref<any[]>([])
//关键词: 1-订单号, 2-子订单号, 3-商品名称, 4-商品ID, 5-商家编码/货品编码, 6-SKUID
const list = [{
  id: 1,
  lable: '订单号'
}, {
  id: 2,
  lable: '子订单号'
}, {
  id: 3,
  lable: '商品名称'
}, {
  id: 4,
  lable: '商品ID'
}, {
  id: 5,
  lable: '商家编码/货品编码'
}, {
  id: 6,
  lable: 'SKUID'
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

</script>
<style lang="scss" scoped>
.lable-text {
  color: #0064ff;
  padding: 0 5px;
}

.common-text {
  color: #666666;
}
</style>