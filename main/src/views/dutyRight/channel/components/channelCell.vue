<template>
  <!--- 特殊样式-店铺 渠道图标+店铺名称 --->
  <div class="row-left">
    <img v-if="showIcon && row[keyName] && getImageUrl(row[keyName])" class="goodImg" :src="getImageUrl(row[keyName])"
      object-fit="contain" />
    <div class="single-line">{{ getDictLabel(DICT_TYPE.SYSTEM_PARAM_CHANNEL, row[keyName]) || '--' }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import { getDictLabel, DICT_TYPE } from '@/utils/dict'
import { getImageUrl } from '@/utils'
defineProps({
  row: {
    type: Object,
    required: true
  },
  keyName: {
    type: String,
    default: 'channelCode'
  },
  showIcon: {
    type: Boolean,
    default: true
  }
})
</script>
<style scoped lang="scss">
@mixin common-flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.single-line {
  font-size: 14px;
  color: #333333;
  font-family: PingFangSC-Regular;
  width: 124px;
}

.row-left {
  @include common-flex-row;
  justify-content: flex-start;
}

.goodImg {
  width: 18px;
  margin-right: 4px
}
</style>