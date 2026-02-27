<template>
  <div class="image-content flex" :class="!list || list.length === 0 ? 'justify-center' : ''">
    <!-- <template v-if="list && list.length > 0"> -->
    <el-carousel
      style="width: 100%"
      height="290px"
      v-if="list && list.length > 0"
      :autoplay="false"
      indicator-position="none"
      trigger="click"
      :arrow="!list || list.length <= 5 ? 'never' : 'always'"
    >
      <el-carousel-item v-for="item in page" :key="item.name">
        <div class="image-list" style="padding-top: 10px">
          <div class="item" v-for="listItem in total[item - 1]">
            <el-image
              class="image"
              lazy
              :src="getUrl(listItem.docUrl)"
              fit="contain"
              :preview-src-list="[listItem.docUrl]"
              preview-teleported
            ></el-image>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
    <!-- <template v-if="list.length >= 5">
        <div class="left">
          <el-icon size="15" color="#FFFFFF"><ArrowLeftBold /></el-icon>
        </div>

        <div class="right">
          <el-icon size="15" color="#FFFFFF"><ArrowRightBold /></el-icon>
        </div>
      </template> -->

    <!-- </template> -->
    <div v-else>
      <img src="@/assets/svgs/oa/imgEmpty.svg" />
      <div class="empty">暂无图片</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getUrl } from '../util'
const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
  size: {
    type: Number,
    default: 5
  }
})
const page = ref(0)
const total = ref<any[][]>([])
watch(
  () => props.list,
  (newVal: any) => {
    page.value = Math.ceil(newVal.length / props.size)
    const temp: any[][] = []
    for (let i = 0; i < page.value; i++) {
      temp.push(newVal.slice(i * 5, (i + 1) * 5))
    }
    total.value = temp
  },
  {
    immediate: true
  }
)
</script>

<style lang="scss" scoped>
.image-content {
  height: 267px;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
  .left {
    position: absolute;
    top: calc(50% - 22px);
    left: 0;
    border-radius: 0px 4px 4px 0px;
    background: rgba(51, 51, 51, 0.6);
    height: 44px;
    width: 32px;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .right {
    position: absolute;
    top: calc(50% - 22px);
    right: 0;
    border-radius: 4px 0px 0px 4px;
    background: rgba(51, 51, 51, 0.6);
    height: 44px;
    width: 32px;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .image-list {
    width: 100%;
    display: flex;
    align-items: center;
    // overflow: hidden;
    .item {
      min-width: 177px;
      margin-right: 18px;
      &:last-child {
        margin-right: 0;
      }
      .image {
        cursor: pointer;
        width: 187px;
        height: 269px;
        border-radius: 10px;
        user-select: none;
        background-color: #f2f2f2;
        &:hover {
          margin-top: -10px;
          box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.2);
        }
      }
    }
    // justify-content: space-between;
  }
}

.empty {
  margin-top: 16px;
  text-align: center;
  font-size: 14px;
  color: #999999;
}

:deep() {
  .el-carousel__arrow--left {
    left: 0 !important;
    border-radius: 0px 4px 4px 0px;
    background: rgba(51, 51, 51, 0.6);
    height: 44px;
    width: 32px;
    .el-icon {
      font-size: 18px;
    }
  }
  .el-carousel__arrow--right {
    right: 0 !important;
    border-radius: 4px 0px 0px 4px;
    background: rgba(51, 51, 51, 0.6);
    height: 44px;
    width: 32px;
    .el-icon {
      font-size: 18px;
    }
  }
}
</style>
