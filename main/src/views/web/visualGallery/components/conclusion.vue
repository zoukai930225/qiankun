<template>
  <div class="conclusion">
    <div class="title">结论</div>

    <div class="infoBg"> {{ data.conclusion || '--' }} </div>
  </div>
</template>

<script setup lang="ts">
import { propTypes } from '@/utils/propTypes'

const props = defineProps({
  data: propTypes.object.def({})
})
</script>

<style lang="scss" scoped>
.conclusion {
  margin-left: 25px;
  margin-right: 25px;
  margin-top: 3px;
  .title {
    font-size: 12px;
    color: #dadada;
    line-height: 17px;
  }

  .infoBg {
    margin-top: 8px;
    width: calc(100% - 34px);
    background: #1a1c26;
    border-radius: 7px;
    font-size: 12px;
    color: #dadada;
    line-height: 17px;
    padding: 17px;
  }
}
</style>
