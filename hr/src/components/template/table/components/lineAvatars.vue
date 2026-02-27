<template>
  <div class="user">
    <div class="info" v-for="userInfo in userInfos.slice(0, showCount)">
      <el-avatar :src="(userInfo as any)[image] || DefaultAvatar" :size="size" class="ava" />
      {{ (userInfo as any)[name] || '-' }}
    </div>
    <el-popover
      placement="bottom"
      trigger="hover"
      :width="
        userInfos.length - showCount > 0
          ? (userInfos.length - showCount < 3 ? userInfos.length - showCount : 3) * 90
          : 240
      "
      v-if="userInfos.length - showCount > 0"
      :popper-style="{ padding: '10px 0 5px 10px !important', minWidth: '95px' }"
    >
      <template #reference>
        <div class="more">
          {{ `+${userInfos.length - showCount}` }}
        </div>
      </template>
      <template #default>
        <div class="user">
          <div class="info third" v-for="userInfo in userInfos.slice(showCount, userInfos.length)">
            <el-avatar :src="(userInfo as any)[image] || DefaultAvatar" :size="size" class="ava" />
            {{ (userInfo as any)[name] || '-' }}
          </div>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<script lang="tsx">
export default { name: 'LineAvatars' }
</script>

<script lang="tsx" setup>
import DefaultAvatar from '@/assets/svgs/defaultAvatar.svg'

const props = defineProps({
  users: { type: Array, default: () => [] },
  image: { type: String, default: 'avatarOrigin' },
  name: { type: String, default: 'name' },
  size: { type: Number, default: 20 },
  showCount: { type: Number, default: 2 }
})

const userInfos = computed(() => props.users || [])
</script>
<style lang="scss" scoped>
.user {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  .info {
    margin-right: 15px;
    display: flex;
    align-items: center;
    padding-bottom: 5px;
    &.third {
      &:nth-child(3),
      &:last-child {
        margin-right: 0;
      }
    }
    .ava {
      margin-right: 10px;

      .name {
        font-size: 6px;
      }
    }
  }
}

:deep() {
  .more {
    background: #f2f6fc;
    padding: 0 5px;
    cursor: pointer;
    border-radius: 2px;
    line-height: 25px;
    margin-bottom: 3px;
  }
}
</style>
