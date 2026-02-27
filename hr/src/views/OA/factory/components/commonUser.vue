<template>
  <div :class="['user',showBgColor?'userBg':'']">
    <el-avatar class="user-avatar" :size="20" :src="data?.avatarOrigin || data?.userAvatarOrigin || DefaultAvatar" />
    <div class="user-userName">{{ data?.name || data?.userName}}</div>
  </div>
</template>

<script lang="ts" setup>
import DefaultAvatar from '@/assets/svgs/defaultAvatar.svg'
const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  },
  showBgColor:{
    type:Boolean,
    default:false
  }
})
</script>

<style lang="scss" scoped>
.user {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 16px;
  width: fit-content;
  &-avatar {
    margin-right: 8px;
  }
  &-userName {
    color: #333;
    word-break: keep-all;
  }
  &.userBg{
    padding: 2px 5px;
    border-radius: 12px;
    background: #E6ECFF;
  }
}
</style>
