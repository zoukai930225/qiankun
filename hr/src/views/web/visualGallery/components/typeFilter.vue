<template>
  <div class="typeFilter">
    <el-popover
      ref="newElPopperRef"
      placement="bottom"
      :popper-style="{ minWidth: '105px', padding: '0', width: 'auto' }"
      trigger="click"
      :show-arrow="false"
      @show="isOpen = true"
      @hide="isOpen = false"
    >
      <template #reference>
        <div class="item">
          <img
            class="item-icon"
            :style="{ width: selectValue.iconWidth, height: selectValue.iconHeight }"
            :src="selectValue.iconSelect"
          />
          <div class="item-text">{{ selectValue.name }}</div>
          <img
            v-show="!isOpen"
            class="item-arrow"
            src="@/assets/imgs/visualGallery/arrow_down.png"
          />
          <img v-show="isOpen" class="item-arrow" src="@/assets/imgs/visualGallery/arrow_up.png" />
        </div>
      </template>
      <div class="moreDialog">
        <div
          class="item"
          v-for="(value, index) in list"
          :key="index"
          :class="{ itemSelect: value.type === selectValue.type }"
          @click="clickOtherItem(value)"
        >
          <img
            class="item-icon"
            :style="{ width: value.iconWidth, height: value.iconHeight }"
            :src="value.type === selectValue.type ? value.iconSelect : value.icon"
          />
          <div class="item-label" :class="{ 'item-labelSelect': value.type === selectValue.type }">
            {{ value.name }}
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import filter_hot_hlImg from '@/assets/imgs/visualGallery/filter_hot_hl.png'
import filter_hot_normalImg from '@/assets/imgs/visualGallery/filter_hot_normal.png'

import filter_daoxu_hlImg from '@/assets/imgs/visualGallery/filter_daoxu_hlImg.png'
import filter_daoxu_normalImg from '@/assets/imgs/visualGallery/filter_daoxu_normalImg.png'
import filter_radom_hlImg from '@/assets/imgs/visualGallery/filter_radom_hl.png'
import filter_radom_normalImg from '@/assets/imgs/visualGallery/filter_radom_normal.png'
import filter_zhengxu_hl from '@/assets/imgs/visualGallery/filter_zhengxu_hl.png'
import filter_zhengxu_normal from '@/assets/imgs/visualGallery/filter_zhengxu_normal.png'

// const props = defineProps({
//   selectValue: propTypes.object.def({ type: 1, name: '最新', icon: iconImg })
// })
const isOpen = ref(false)
const selectValue = ref({
  type: 4,
  name: '销量倒序',
  iconWidth: '18px',
  iconHeight: '18px',
  icon: filter_daoxu_normalImg,
  iconSelect: filter_daoxu_hlImg
})

const list = ref([
  {
    type: 1,
    name: '最新',
    iconWidth: '18px',
    iconHeight: '18px',
    icon: filter_hot_normalImg,
    iconSelect: filter_hot_hlImg
  },
  {
    type: 2,
    name: '随机',
    iconWidth: '14px',
    iconHeight: '14px',
    icon: filter_radom_normalImg,
    iconSelect: filter_radom_hlImg
  },
  {
    type: 3,
    name: '销量正序',
    iconWidth: '18px',
    iconHeight: '18px',
    icon: filter_zhengxu_normal,
    iconSelect: filter_zhengxu_hl
  },
  {
    type: 4,
    name: '销量倒序',
    iconWidth: '18px',
    iconHeight: '18px',
    icon: filter_daoxu_normalImg,
    iconSelect: filter_daoxu_hlImg
  }
  // {
  //   type: '3',
  //   name: '排行榜',
  //   icon: filter_rank_normalImg,
  //   iconSelect: filter_rank_hlImg
  // }
])

const newElPopperRef = ref()
const clickOtherItem = (value: any) => {
  selectValue.value = value
  newElPopperRef.value?.hide()
  emit('filterTypeClick', value)
}

const emit = defineEmits(['filterTypeClick'])
</script>

<style lang="scss" scoped>
.typeFilter {
  margin-top: -10px;
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
  margin-right: 15px;
  .item {
    margin-top: 24px;
    margin-left: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 158px;
    height: 32px;
    background: #fff;
    border-radius: 5px;
    border: 1px solid #e5e5e5;
    &-icon {
      margin-left: 20px;
      // width: 14px;
      // height: 18px;
    }
    &-text {
      padding-left: 16px;
      font-size: 14px;
      color: #333333;
      line-height: 20px;
    }
    &-arrow {
      margin-left: auto;
      margin-right: 20px;

      width: 12px;
      height: 6px;
    }
  }
  &-right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: 0.5px;
    width: 26px;
    height: 32px;
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
  :deep(.el-popover.el-popper) {
    min-width: 105px !important;
  }
}
// .typeFilter:hover {
//   background-color: #CBCBCB;
// }
.item:hover {
  background-color: #fafafa;
  cursor: pointer;
}
.moreDialog {
  margin: -2px;
  // margin-left: 10px;
  width: 158px;
  height: 192px;
  background: #fff;
  border-radius: 5px;
  // border: 1px solid #545455;
  .item {
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 46px;
    font-size: 14px;
    line-height: 20px;

    &-icon {
      margin-left: 20px;
      // width: 14px;
      // height: 18px;
    }
    &-label {
      padding-left: 16px;
      color: #666;
    }

    &-labelSelect {
      color: #333333;
    }
  }
}
</style>

<style scoped>
/* :deep(.el-popover.el-popper) {
  min-width: 105px !important;
}
:deep(.el-popover) {
  min-width: 105px !important;
} */
:deep(.el-popover.el-popper) {
  min-width: 105px !important;
}
</style>
