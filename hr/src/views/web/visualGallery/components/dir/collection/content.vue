<template>
  <div v-loading="loading" class="collection-scroll">
    <template v-if="list.length">
      <el-scrollbar>
        <div class="gallery-wrap">
          <Gallery :show-more="false" :list="list" @get-list="getList" />
        </div>
      </el-scrollbar>

      <!-- 分页组件 -->
      <div class="pagination-bar">
        <Pagination
          class="pagination-inner"
          :total="total"
          :pageSizes="[10, 30, 60, 90]"
          v-model:page="queryParams.page"
          v-model:limit="queryParams.size"
          @pagination="onPaginationChange"
        />
      </div>
    </template>
    <Empty v-else-if="!loading && !list.length" />
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import * as GalleryApi from '@/api/gallery'
import Gallery from '../../gallery.vue'
import { nextFrameTick } from '@/utils/util'
import Empty from '@/components/SWTable/src/empty.vue'

const props = defineProps<{
  dir: any
  type?: 1 | 2
  isGood?: string
}>()

const list = ref<any[]>([])
const total = ref<number>(0)
const loading = ref<boolean>(false)

const queryParams = ref({
  page: 1,
  size: 10
})

const resolveCollectDate = (dir: any): string => {
  if (typeof dir === 'string' || typeof dir === 'number') return String(dir)
  return dir?.label || dir?.name || dir?.date || ''
}

const getList = async () => {
  try {
    loading.value = true
    await nextFrameTick()
    const collectDate = resolveCollectDate(props.dir)
    const params: any = {
      ...queryParams.value,
      type: props.type,
      collectDate
    }
    const data = await GalleryApi.getHomePage(params).catch(() => undefined)
    if (data) {
      list.value = data.records || []
      total.value = data.total || 0
    }
  } finally {
    loading.value = false
  }
}

const onPaginationChange = () => {
  getList()
}

watch(
  () => [props.dir, props.type],
  () => {
    queryParams.value.page = 1
    getList()
  },
  { immediate: true }
)
</script>
<style scoped lang="scss">
:deep(.boz) {
  padding: 10px 6px;
  gap: 16px;
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.collection-scroll {
  display: flex;
  flex-direction: column;
  height: 100%;
  // :deep(.el-scrollbar__view) {
  //   height: 100%;

  //   .gallery-wrap {
  //     flex: 1 0 auto;
  //     height: 0;
  //   }
  // }
}

/* 分页容器样式（从 galleryList 迁移） */
.pagination-bar {
  // background-color: #fff;
  // width: 100%;
  // position: absolute;
  // bottom: 0;
  // border-radius: 0 0 8px 8px;
  // background: #ffffff;
  // box-shadow: 0 -4px 10px 0 rgba(0, 0, 0, 0.04);
  // margin-top: 16px;
  // margin-right: 16px;
}

.pagination-inner {
}

:deep(.s-empty) {
  margin-top: 200px;
}
</style>
