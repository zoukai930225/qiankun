<template>
  <div class="row-center">
    <img v-if="getImageUrl(channel)" style="width: 18px; height: 18px; margin-right: 8px" :src="getImageUrl(channel)" />
    <div class="single-line" :style="{
      width: storeName ? 'auto' : (getImageUrl(channel) ? '74px' : '110px'),
      paddingRight: '6px'
    }">{{ storeName ? storeName : getDictLabel(DICT_TYPE.SYSTEM_PARAM_CHANNEL, channel) }}</div>
  </div>
</template>

<script lang="ts">
export default { name: 'LineChannel' };
</script>


<script lang="ts" setup>
import { DICT_TYPE, getDictLabel } from '@/utils/dict';
import { getImageUrl } from '@/utils/index';

const props = defineProps({ channel: { type: String, default: '' }, storeName: {type: String, default: ''} });

</script>

<style scoped lang="scss"></style>
