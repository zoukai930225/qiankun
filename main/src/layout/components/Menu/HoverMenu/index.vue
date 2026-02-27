<template>
  <div class="HoverMenu">
    <div
      class="item"
      v-for="(value, index) in menuList"
      :key="index"
      @click="menuClick(value)"
      :style="{ background: menuIsSelected(value) ? 'rgba(0, 100, 255, 0.1)' : '#FFF' }"
    >
      <div class="item-title" :style="{ color: menuIsSelected(value) ? '#0064FF' : '#1E1C21' }">{{
        value.name
      }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import { useAppStore } from '@/store/modules/app'
const { push } = useRouter()

const props = defineProps({
  menuList: propTypes.array.def([]), // 数据
  selectMenu: propTypes.string.def('') // 选中菜单
})

// 菜单是否被选中
const menuIsSelected = (menu: any) => {
  if (menu.path === props.selectMenu.path) {
    return true
  }
  if (props.selectMenu.pPath === `/bi/${menu.path}`) {
    //父级
    return true
  }
  return false
}

// 菜单选中
const menuClick = (menu: any) => {
  emit('selectSubMenuItem', menu)
  menuRouterPush(menu)
}

// 路由跳转
const menuRouterPush = (menu) => {
  let pushPath = menu.path
  if (menu.pPath) {
    pushPath = `${menu.pPath}/${menu.path}`
  }
  push(pushPath)
}

const emit = defineEmits(['selectSubMenuItem'])
</script>

<style lang="scss" scoped>
.HoverMenu {
  width: 100%;

  .item {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 40px;
    justify-content: center;
    cursor: pointer;

    &-title {
      font-size: 14px;
      color: #1e1c21;
      font-weight: 400;
      font-family:
        PingFangSC-Regular,
        PingFang SC;
    }
  }
}
</style>
