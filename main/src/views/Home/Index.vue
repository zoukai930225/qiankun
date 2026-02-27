<template>
  <div>
    <!-- <SWSwitch
      class=""
      :value="status"
      active-text="启用"
      inactive-text="禁用"
      :active-value="1"
      :inactive-value="0"
      @change="switchChange"
    /> -->
    <!-- <DataChart /> -->
    <Workbench />
  </div>
</template>

<script lang="ts" setup>
import DataChart from '@/views/dataChart/index.vue'
import Workbench from './workbench/index.vue'

// import SWSwitch from '@/components/SWBaseComponent/SWSwitch/index.vue'

// const switchChange = (v) => {
//   console.log('开关变化:', v)
//   status.value = v
// }
// const status = ref(1)
</script>

<style lang="scss" scoped></style>
