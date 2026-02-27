<template>
  <div
    class="shejitu-info"
    style="margin-left: 19px"
    :style="{ width: `${planInfoDesignWidth()}px` }"
  >
    <formTitle title="打样进度" icon="icon6" />
    <div
      class="shejitu-list"
      v-if="sampleProgressList.length > 0"
      style="display: flex; flex-direction: column"
    >
      <div v-for="(item, index) in sampleProgressList" :key="index">
        <div
          class="shejitu-beizhu"
          style="min-height: auto"
          :style="{ width: `${planInfoDesignWidth()}px` }"
        >
          <div class="shejitu-item-title">{{ item.sampleProgressTime }}</div>
          <div class="shejitu-item-content">{{ item?.sampleProgressContent || '' }}</div>
        </div>
      </div>
    </div>

    <div v-else class="empty-img">
      <img src="@/assets/imgs/oa/product/displayInfo/empty.png" alt="" />
      暂无打样进度
    </div>
    <!-- 备注 -->
  </div>
</template>

<script setup lang="ts">
import formTitle from './formTitle.vue'

const props = defineProps({
  reviewDetail: {
    type: Object as PropType<any>,
    default: () => ({})
  },
  designDetail: {
    type: Object as PropType<any>,
    default: () => ({})
  },
  planInfoDesignWidth: {
    type: Number,
    default: 0
  },

  sampleProgressList: {
    type: Array,
    default: () => []
  }
})

const planInfoDesignWidth = () => {
  return props.planInfoDesignWidth
}
</script>

<style lang="scss" scoped>
// 设计图
.shejitu-info {
  width: 446px;
  .shejitu-list {
    display: grid;
    grid-template-columns: repeat(4, 110px);
    grid-column-gap: 38px;
    grid-row-gap: 12px;
    margin-bottom: 12px;

    .shejitu-item {
      width: 110px;
      height: 110px;
      border-radius: 10px;
    }
  }

  // 备注
  .shejitu-beizhu {
    width: 446px;
    min-height: 100px;
    background: rgb(153, 153, 153, 0.08);
    border-radius: 10px;
    padding: 14px;
    box-sizing: border-box;
    border: 1px solid #e5e5e5;

    .shejitu-item-title {
      font-size: 14px;
      color: #999999;
      margin-bottom: 5px;
    }

    .shejitu-item-content {
      font-size: 14px;
      color: #666666;
    }
  }
}
.empty-img {
  width: 90px;
  height: 90px;
  background: #ffffff;
  border-radius: 5px;
  border: 1px dashed #b8b8b8;
  text-align: center;
  font-size: 12px;
  color: #999999;
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}
</style>
