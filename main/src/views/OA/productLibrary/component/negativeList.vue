<template>
  <div class="negative-list" :class="!list || list.length === 0 ? 'flex-center' : ''">
    <template v-if="list && list.length > 0">
      <div class="item" v-for="(item, index) in sortList" :class="`item_${index + 1}`" :key="index">
        <div class="txt">{{ item }}</div>
      </div>
    </template>
    <div v-else>
      <img src="@/assets/svgs/oa/imgEmpty.svg" />
      <div class="empty">暂无内容</div>
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

const sortList = computed(() => {
  return props.list.sort((a: string, b: string) => b.length - a.length)
})
</script>

<style lang="scss" scoped>
.negative-list {
  padding: 20px;
  position: relative;
  height: 265px;
  overflow: hidden;
  &.flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .item {
    font-size: 18px;
    color: #333333;
    position: absolute;
    max-width: 800px;
    cursor: pointer;
    &:hover {
      z-index: 99 !important;
      font-size: 22px;
      // max-width: 800px;

      .txt {
        text-overflow: unset;
        white-space: unset;
        // max-height: 60px;
      }
    }
    &_1 {
      z-index: 1;
      top: 30px;
      left: 20px;
      &::before {
        content: '';
        width: 98px;
        height: 38px;
        background: url('@/assets/svgs/oa/cornerLeftBlue.svg');
        background-repeat: no-repeat;
        position: absolute;
        transform: scale(2);
        top: 8px;
        left: 45px;
        z-index: -1;
      }
      .txt {
        background: #eff5ff !important;
        // box-shadow: 0px 20px 20px 0px rgba(40, 56, 80, 0);
      }
    }
    &_2 {
      z-index: 2;
      top: 80px;
      left: 263px;
      &::before {
        content: '';
        width: 98px;
        height: 38px;
        background: url('@/assets/svgs/oa/cornerLeftYellow.svg');
        background-repeat: no-repeat;
        position: absolute;
        transform: scale(2);
        top: 8px;
        left: 45px;
        z-index: -1;
      }
    }
    &_3 {
      z-index: 3;
      left: 30px;
      top: 150px;
      &::before {
        content: '';
        width: 98px;
        height: 38px;
        background: url('@/assets/svgs/oa/cornerLeftBlue.svg');
        background-repeat: no-repeat;
        position: absolute;
        transform: scale(2);
        top: 8px;
        left: 45px;
        z-index: -1;
      }
      .txt {
        background: #eff5ff !important;
      }
    }
    &_4 {
      z-index: 4;
      // top: 240px;
      left: 419px;
      bottom: 10px;
      &::before {
        content: '';
        width: 98px;
        height: 38px;
        background: url('@/assets/svgs/oa/cornerLeftYellow.svg');
        background-repeat: no-repeat;
        position: absolute;
        transform: scale(2);
        top: 8px;
        left: 45px;
        z-index: -1;
      }
    }
    &_5 {
      z-index: 6;
      top: 45px;
      right: 30px;
      &::after {
        content: '';
        width: 98px;
        height: 38px;
        background: url('@/assets/svgs/oa/cornerRightYellow.svg');
        background-repeat: no-repeat;
        position: absolute;
        transform: scale(2);
        z-index: -1;
        top: 5px;
        right: -66px;
      }
    }
    &_6 {
      z-index: 5;
      top: 95px;
      right: 117px;
      &::after {
        content: '';
        width: 98px;
        height: 38px;
        background: url('@/assets/svgs/oa/cornerRightBlue.svg');
        background-repeat: no-repeat;
        position: absolute;
        transform: scale(2);
        z-index: -1;
        top: 5px;
        right: -66px;
      }
      .txt {
        background: #eff5ff !important;
      }
    }

    &_7 {
      z-index: 7;
      right: 55px;
      bottom: 80px;
      &::after {
        content: '';
        width: 98px;
        height: 38px;
        background: url('@/assets/svgs/oa/cornerRightYellow.svg');
        background-repeat: no-repeat;
        position: absolute;
        transform: scale(2);
        z-index: -1;
        top: 5px;
        right: -66px;
      }
    }

    &_8 {
      z-index: 8;
      top: 215px;
      right: 155px;
      &::after {
        content: '';
        width: 98px;
        height: 38px;
        background: url('@/assets/svgs/oa/cornerRightBlue.svg');
        background-repeat: no-repeat;
        position: absolute;
        transform: scale(2);
        z-index: -1;
        top: 5px;
        right: -66px;
      }
      .txt {
        background: #eff5ff !important;
      }
    }

    &_9 {
      z-index: 9;
      top: 130px;
      right: 680px;
      &::after {
        content: '';
        width: 98px;
        height: 38px;
        background: url('@/assets/svgs/oa/cornerRightBlue.svg');
        background-repeat: no-repeat;
        position: absolute;
        transform: scale(2);
        z-index: -1;
        top: 5px;
        right: -66px;
      }
      .txt {
        background: #eff5ff !important;
      }
    }

    &_10 {
      z-index: 10;
      bottom: 10px;
      left: 50px;
      &::before {
        content: '';
        width: 98px;
        height: 38px;
        background: url('@/assets/svgs/oa/cornerLeftBlue.svg');
        background-repeat: no-repeat;
        position: absolute;
        transform: scale(2);
        top: 8px;
        left: 45px;
        z-index: -1;
      }
       .txt {
        background: #eff5ff !important;
      }
    }

    .txt {
      min-width: 70px;
      padding: 20px;
      background: #fcefdd;
      border-radius: 100px;
      box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 22px;
    }
  }

  .empty {
    margin-top: 16px;
    text-align: center;
    font-size: 14px;
    color: #999999;
  }
}
</style>
