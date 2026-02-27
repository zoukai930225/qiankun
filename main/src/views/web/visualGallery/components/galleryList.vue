<template>
  <div>
    <Gallery
      ref="galleryRef"
      v-bind="$attrs"
      :list="list"
      @get-list="forwardGetList"
      :baseWidth="baseWidth"
    />

    <!-- 分页组件 -->
    <div class="pagination-bar">
      <Pagination
        v-if="total > 0"
        class="pagination-inner"
        :total="total"
        :pageSizes="[30, 60, 90]"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.size"
        @pagination="getList2"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Gallery from './gallery.vue'

defineProps({
  list: { type: Array, default: () => [] } as any,
  total: { type: Number, default: 0 },
  baseWidth: { type: String, default: '' }
})

const emit = defineEmits(['getList'])

// 分页参数
const queryParams = ref({
  page: 1,
  size: 30
})

// 分页回调
const getList2 = () => {
  emit('getList', { ...queryParams.value })
}

// 子组件刷新列表时携带当前分页参数，避免上层数据缺失
const forwardGetList = () => {
  emit('getList', { ...queryParams.value })
}

const galleryRef = ref()
const openDetail = (goodsId: string) => {
  galleryRef.value?.openDetail(goodsId)
}

defineExpose({
  openDetail
})
</script>

<style lang="scss" scoped>
/* 分页容器样式（从行内样式迁移） */
.pagination-bar {
  background-color: #fff;
  width: 100%;
  // position: absolute;
  // bottom: 0;
  // border-radius: 0 0 8px 8px;
  background: #ffffff;
  // box-shadow: 0 -4px 10px 0 rgba(0, 0, 0, 0.04);
}

.pagination-inner {
  margin-right: 25px;
}
</style>
