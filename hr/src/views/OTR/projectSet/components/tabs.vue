<!--
 * @Date: 2024-10-10 09:01:47
-->
<template>
  <div class="tab-wapper">
    <div
      v-for="item in tabList"
      :key="item.code"
      class="item"
      @click="tabChange(item)"
      :class="{ activity: currentTab == item.code }"
    >
      <!-- <span class="activity" v-if="currentTab == item.code"></span> -->
      <span> {{ item?.label }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'Tabs' })

const props = defineProps({
  currentTab: {
    type: String,
    default: '0'
  },
  tabList: {
    type: Array as any,
    default: () => {
      return []
    }
  }
})

const emit = defineEmits(['tabChange'])

const tabChange = (item) => {
  emit('tabChange', item.code)
}
</script>

<style lang="scss" scoped>
.tab-wapper {
  display: flex;
  flex-direction: row;
  width: 100%;
  border-bottom: 1px solid #e7e8ee;
  .item {
    cursor: pointer;
    position: relative;
    width: 90px;
    height: 40px;
    // background: #f3f8ff;
    border-radius: 6px 6px 0px 0px;
    margin-right: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .icon {
      width: 14px;
      height: 15px;
      margin-right: 14px;
    }

    &.activity {
      color: #3e80ff;
      border-bottom: 2px solid #3e80ff;
    }
    &:hover {
      color: #3e80ff;
    }
  }
}
</style>
