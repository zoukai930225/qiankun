<template>
  <div v-if="list && list.length > 0" class="swFilterAddMore">
    <div
      class="swFilterAddMore-left"
      :style="{ borderRadius: list.length === 1 ? '4px' : '4px 0 0 4px' }"
      @click="clickLeftBtn"
    >
      <img
        src="@/assets/imgs/negativeReviewDashboard/board.svg"
        alt=""
        class="swFilterAddMore-left-addIcon"
      />

      <div class="swFilterAddMore-left-addText">数据看板</div>
    </div>
    <el-popover
      v-if="list && list.length > 1"
      ref="newElPopperRef"
      placement="bottom-end"
      :width="266"
      trigger="hover"
      :show-arrow="false"
    >
      <template #reference>
        <div class="swFilterAddMore-right">
          <el-icon size="12"><ArrowDown /></el-icon>
        </div>
      </template>
      <div class="moreDialog">
        <div
          class="item"
          v-for="(value, index) in list"
          :key="index"
          :class="{ itemSelect: value.code === currentCode }"
          @click="addBtnClick(value)"
        >
          <div class="item-label" :class="{ 'item-labelSelect': value.code === currentCode }">{{
            value.label
          }}</div>
        </div>
      </div>
    </el-popover>
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

const props = defineProps({
  list: propTypes.array.def([]),
  currentCode: propTypes.string.def('add'),
  loading: propTypes.bool.def(false)
})

const newElPopperRef = ref()

const clickLeftBtn = () => {
  emit('addBtnClick', { code: props.currentCode })
}

const addBtnClick = (value) => {
  if (value) {
    emit('addBtnClick', value)
    newElPopperRef.value?.hide()
  }
}

const emit = defineEmits(['addBtnClick'])
</script>

<style lang="scss" scoped>
.swFilterAddMore {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 32px;
  font-size: 14px;
  color: #ffffff;
  line-height: 18px;
  background: rgba(255, 255, 255, 0.37);
  &-left {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 32px;
    background: #0064ff;
    border-radius: 4px 0px 0px 4px;
    padding: 0 0 0 12px;
    box-sizing: border-box;

    width: auto;
    &-addIcon {
      width: 16px;
      height: 16px;
    }
    &-loading {
      background: transparent;
      width: 16px;
      height: 32px;
      margin-right: 4px;
      background-color: transparent;
      box-shadow: none;
      border: none; /* 去掉边框 */
    }
    &-addText {
      width: 70px;
      text-align: center;
      border-right: 1px solid #ffffff;
      // margin-right: 12px;
    }
  }
  &-right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    cursor: pointer;
    background: #0064ff;
    border-radius: 0px 4px 4px 0px;
    &-moreIcon {
      width: 10px;
      height: 6px;
    }
  }
  &-right:hover {
    background: #277bfd;
  }
}
.moreDialog {
  margin: -13px;
  margin-top: -18px;
  background: #ffffff;
  box-shadow: 0px 2px 18px 0px rgba(0, 31, 61, 0.08);
  border: 1px solid #ebebeb;
  border-radius: 4px;
  .item {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 33px;
    font-size: 12px;
    color: #333333;
    line-height: 33px;
    &:hover {
      background: #f3f4f7;
    }
    &-label {
      color: #333333;
    }

    &-labelSelect {
      color: #0064ff;
    }
  }
  .itemSelect {
    background: #f3f4f7;
  }
}
:deep(.el-button.is-loading) {
  background: transparent;
}
:deep(.el-button.is-loading:before) {
  background: transparent;
}
:deep(.el-icon) {
  color: #fff;
}
</style>
