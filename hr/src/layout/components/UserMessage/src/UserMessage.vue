<script lang="ts" setup>
import bellImage from '@/assets/imgs/home/bell.svg'
import { userMessageStore } from '@/store/modules/userMessage'
const useUserMessageStore = userMessageStore()
const showMessage = () => {
  useUserMessageStore.openVisible();
  useUserMessageStore.updateTabActiveName('wait');
}
</script>

<template>
  <div class="user-message"
    :class="[{ 'user-message-max': useUserMessageStore.getCount > 99, 'user-message-offset': useUserMessageStore.getCount > 0 && useUserMessageStore.getCount <= 99 }]"
    @click="showMessage">
    <el-badge :value="useUserMessageStore.getCount" :max="99" class="item" :show-zero="false" color="#EB3737"
      :offset="[3, 2]">
      <img style="width: 18px; height: 18px" :src="bellImage" fit="fill" />
    </el-badge>
    <div class="tips">消息</div>
  </div>
</template>
<style lang="scss" scoped>
.user-message {
  font-family: PingFang SC;
  font-size: 13px;
  height: 49px;
  color: #666666;

  .item {
    margin: 0 auto;
    margin-top: 5px;
    height: 20px;
    line-height: 20px;
  }

  &:hover {
    img {
      /* 将单色图标滤成接近 #0064FF 的蓝色 */
      filter: invert(26%) sepia(97%) saturate(4152%) hue-rotate(214deg) brightness(100%) contrast(101%);
    }
  }

  &-offset {
    margin-right: 5px;
  }

  &-max {
    margin-right: 10px;
  }

  .tips {
    height: 20px;
    line-height: 20px;
    display: inline-block;
    text-align: center;
  }
}
</style>