<template>
  <div class="shejitu-info" :style="{ width: `${planInfoDesignWidth()}px` }">
    <formTitle :title="title" />

    <div class="shejitu-list" v-if="productPictureList.length > 0">
      <div v-for="(item, index) in productPictureList" :key="index">
        <el-image
          class="shejitu-item"
          :src="item"
          :zoom-rate="1.2"
          :max-scale="7"
          :min-scale="0.2"
          :preview-src-list="productPictureList"
          show-progress
          :initial-index="index"
          preview-teleported
          fit="cover"
        />
      </div>
    </div>

    <div v-else class="empty-img">
      <img src="@/assets/imgs/oa/product/displayInfo/empty.png" alt="" />
      暂无图片
    </div>
    <!-- 备注 -->
    <div class="shejitu-beizhu" :style="{ width: `${planInfoDesignWidth()}px` }">
      <div class="shejitu-item-content">{{ remark || '--' }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import formTitle from './formTitle.vue'

const props = defineProps({
  title: {
    type: String,
    default: '设计图'
  },
  remark: {
    type: String,
    default: ''
  },
  planInfoDesignWidth: {
    type: Number,
    default: 0
  },

  productPictureList: {
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
