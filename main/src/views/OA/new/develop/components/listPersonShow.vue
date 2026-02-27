<template>
  <div class="listPersonShow">
    <div v-if="list && list.length === 0" class="row-center">
      <img src="@/assets/imgs/list_avatar_default.svg"
        style="width: 20px;height: 20px;border-radius: 10px;margin-right: 4px;" />
      <div style="font-size: 14px;line-height: 20px;color: #3D3D3D;">待匹配</div>
    </div>

    <div v-else v-for="(item, index) in list" :key="index" style="margin-right: 10px;height: 30px;" class="row-center">
      <img :src="item.avatarOrigin" style="width: 20px;height: 20px;border-radius: 10px;margin-right: 4px;" />
      <div style="font-size: 14px;line-height: 20px;color: #3D3D3D;">{{ item.name }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps({
  list: {
    type: Array,
    default: () => []
  }
})

const getPersonalInfo = (row) => {
  return row.chosenSupplierStaff || {}
}
</script>

<style lang="scss" scoped>
.listPersonShow {
  display: flex;
  flex-wrap: wrap;
}
</style>
