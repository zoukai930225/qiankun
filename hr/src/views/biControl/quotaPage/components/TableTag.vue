<template>
  <div class="flex-row">
    <template v-for="(item, index) in data" :key="index">
      <template v-if="index < maxNums">
        <span style="margin-right: 5px;">
          <template v-if="noConfig">{{ item }}</template>
          <template v-else>{{ item[showConfig.lable] }}<span v-if="showConfig.value">[{{ item[showConfig.value]
          }}]</span></template>
        </span>
      </template>
    </template>
    <div v-if="data.length > maxNums" class="tag-box">
      <el-popover :width="popoverWidth" :effect="effect" popper-style="max-height:300px;overflow-y:auto">
        <template #reference>
          <el-tag effect="dark" round size="small">
            {{ data.length - maxNums }}
          </el-tag>
        </template>
        <template v-for="(item, index) in data" :key="index">
          <template v-if="index > maxNums - 1">
            <div>
              <template v-if="noConfig">{{ item }}</template>
              <template v-else>{{ item[showConfig.lable] }}<span v-if="showConfig.value">[{{ item[showConfig.value]
              }}]</span></template>
            </div>
          </template>
        </template>
      </el-popover>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
const props = defineProps({
  data: {
    type: Array as PropType<any[]>,
    default: () => [] as any[],
  },
  //超过多少使用该显示
  maxNums: propTypes.number.def(2),
  size: propTypes.string.def('small'),
  popoverWidth: propTypes.number.def(200),
  effect: propTypes.string.def('dark'),
  config: propTypes.object.def({}),
  noConfig: propTypes.bool.def(false),
})

const showConfig = ref<any>({
  value: '',
  lable: ''
})



watch(() => props.config, (val) => {
  Object.assign(showConfig.value, val)
}, { immediate: true })
</script>

<style lang="scss" scoped>
.flex-row {
  display: flex;
  align-items: center;
  width: 100%;
}

.tag-box {
  margin-left: 8px;
}
</style>