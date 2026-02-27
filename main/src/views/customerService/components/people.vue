<template>
  <div>
    <div class="customerServicePeople" v-if="data.name">
      <!-- <div class="userNameAvatar">
      <div class="userNameAvatar-text">{{ shortName(data.name) }}</div>
    </div> -->
      <img class="userNameAvatar" :src="data.avatarOrigin" />
      <el-tooltip effect="dark" :content="data.name || ''">
        <div class="userName text1">{{ data.name || '' }}</div>
      </el-tooltip>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

const props = defineProps({
  data: propTypes.object.def({ name: '', avatarOrigin: '' })
})

// const shortName = (name) => {
//   if (name.length > 2) {
//     if (isChinese(name.substring(2, 3))) {
//       return name.substring(1, 3)
//     } else {
//       return name.substring(0, 2)
//     }
//   } else {
//     return name
//   }
// }

// // 字符串是否中文
// const isChinese = (str) => {
//   var reg = /^[\u4E00-\u9FA5\uF900-\uFA2D]+$/
//   return reg.test(str)
// }
</script>

<style lang="scss" scoped>
.customerServicePeople {
  display: flex;
  flex-direction: row;
  align-items: center;
  .userNameAvatar {
    width: 18px;
    height: 18px;
    background: #0064ff;
    border-radius: 9px;
    &-text {
      font-size: 12px;
      color: #ffffff;
      line-height: 28px;
      text-align: center;
    }
  }
  .userName {
    padding-left: 8px;
    color: #333333;
    line-height: 22px;
  }
}
</style>
