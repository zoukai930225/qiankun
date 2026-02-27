<template>
  <div class="otrUser">
    <img class="otrUser-avatar" :src="data.avatarOrigin" />
    <div class="otrUser-userName">{{ data.name }}</div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  }
})
</script>

<style lang="scss" scoped>
.otrUser {
  display: flex;
  align-items: center;
  cursor: pointer;
  &-avatar {
    width: 18px;
    height: 18px;
    border-radius: 9px;
  }
  &-userName {
    padding-left: 8px;
    color: #333;
    line-height: 22px;
  }
}
</style>
