<template>
  <div class="fixFunction" :style="{ right: right + 'px' }">
    <div class="item" v-for="(value, index) in list" :key="index">
      <img class="item-icon" :src="value.iconHl" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { propTypes } from '@/utils/propTypes'

import function_1_hlImg from '@/assets/imgs/visualGallery/function_1_hl.png'
import function_1_normalImg from '@/assets/imgs/visualGallery/function_1_normal.png'

import function_2_hlImg from '@/assets/imgs/visualGallery/function_2_hl.png'
import function_2_normalImg from '@/assets/imgs/visualGallery/function_2_normal.png'

import function_3_hlImg from '@/assets/imgs/visualGallery/function_3_hl.png'
import function_3_normalImg from '@/assets/imgs/visualGallery/function_3_normal.png'

const props = defineProps({
  right: propTypes.number.def(0)
})
const list = ref([
  {
    icon: function_1_normalImg,
    iconHl: function_1_hlImg
  },
  {
    icon: function_2_normalImg,
    iconHl: function_2_hlImg
  },
  {
    icon: function_3_normalImg,
    iconHl: function_3_hlImg
  }
])

const emit = defineEmits(['selectCategory'])
</script>

<style lang="scss" scoped>
.fixFunction {
  position: fixed;
  bottom: 37px;
  width: 55px;
  .item {
    margin-top: 20px;
    width: 55px;
    height: 55px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &-icon {
      width: 55px;
      height: 55px;
    }
  }
}
</style>
