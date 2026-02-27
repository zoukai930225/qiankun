<template>
  <div class="user">
    <el-avatar :src="userInfo[image] || DefaultAvatar" :size="size" class="ava" />
    {{ userInfo[name] || '-' }}
  </div>
</template>

<script lang="tsx">
export default { name: 'LineAvatar' };
</script>

<script lang="tsx" setup>
import DefaultAvatar from '@/assets/svgs/defaultAvatar.svg';

const props = defineProps({
  user: { type: Object, default: () => { } },
  image: { type: String, default: 'avatarOrigin' },
  name: { type: String, default: 'name' },
  size: { type: Number, default: 20}
});

const userInfo = computed(() => props.user || {});

</script>
<style lang="scss" scoped>
.user {
  display: flex;
  align-items: center;

  .ava {
    margin-right: 10px;

    .name {
      font-size: 6px;
    }
  }
}
</style>
