<template>
  <section class="gallery-content">
    <div class="filters">
      <div class="category-row mt-4px text-14px">
        <span class="text-#666">类目</span>
        <div
          v-for="(item, index) in categoryList"
          :key="index"
          class="chip"
          :class="{ active: activeCategory === item.value }"
          @click="onCategoryToggle(item.value)"
        >
          {{ item.name }}
        </div>
        <div class="spacer"></div>
      </div>
    </div>
    <div v-loading="loading" class="grid-container" :class="{ flex: !imageList.length }">
      <el-scrollbar v-if="imageList.length">
        <div class="grid">
          <div
            v-for="(item, index) in imageList"
            :key="item?.id || item?.goodsId || index"
            class="card"
          >
            <el-image
              :src="getCoverUrl(item)"
              :preview-src-list="previewSrcList"
              :preview-teleported="true"
              :z-index="4000"
              :initial-index="index"
              fit="cover"
              class="img"
            />
          </div>
        </div>
      </el-scrollbar>
      <div v-else-if="!loading" class="flex-1 h-full">
        <Empty />
      </div>
    </div>

    <div v-if="imageList.length" class="footer">
      <Pagination
        class="s-pagination"
        :total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.size"
        @pagination="getList"
      />
    </div>
  </section>
</template>
<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import Pagination from '@/components/SWTable/src/SPagination.vue'
import * as GalleryApi from '@/api/gallery'
import Empty from '@/components/SWTable/src/empty.vue'
import { nextFrameTick } from '@/utils/util'

const props = withDefaults(defineProps<{ dir: any; isGood?: string }>(), { isGood: '0' })

const displayName = computed(() => {
  const d: any = props.dir
  if (typeof d === 'string' || typeof d === 'number') return String(d)
  return d?.name || d?.title || d?.label || d?.date || '未命名'
})

const queryParams = ref({
  page: 1,
  size: 10,
  category: ''
})

const total = ref(0)
const imageList = ref<any[]>([])
const previewSrcList = computed(() =>
  imageList.value.map((it) => getCoverUrl(it)).filter((src) => !!src)
)
const loading = ref(false)

const categoryList = ref([
  { name: '内衣', value: 'UNDERWEAR_CATEGORY_GROUP' },
  { name: '季节品', value: 'SEASONAL_CATEGORY_GROUP' },
  { name: '女士内裤', value: 'WOMANPANTS_CATEGORY_GROUP' },
  { name: '袜子', value: 'SOCKS_CATEGORY_GROUP' },
  { name: '男士内裤', value: 'MANPANTS_CATEGORY_GROUP' },
  { name: '胸贴', value: 'PASTIES_CATEGORY_GROUP' }
])
const activeCategory = ref('')

function onCategoryToggle(categoryValue: string) {
  activeCategory.value = activeCategory.value === categoryValue ? '' : categoryValue
  queryParams.value.category = activeCategory.value
  queryParams.value.page = 1
  getList()
}

// 目前无排序筛选

function getCoverUrl(item: any): string {
  return (
    item?.imageUrl ||
    item?.masterImageUrl ||
    (Array.isArray(item?.promotionImageUrls) ? item.promotionImageUrls[0] : '') ||
    item?.picImageUrl ||
    item?.url ||
    ''
  )
}

const getList = async () => {
  try {
    loading.value = true
    await nextFrameTick()
    const params: any = {
      page: queryParams.value.page,
      size: queryParams.value.size,
      category: queryParams.value.category,
      isGood: props.isGood
    }
    const isCarDir = props?.dir?.id === 2
    const api = isCarDir
      ? GalleryApi.getCarImageLikeOrStepPage
      : GalleryApi.getMainImageLikeOrStepPage
    const res: any = await api(params).catch(() => ({}))
    imageList.value = res?.records || []
    total.value = res?.total || 0
  } finally {
    loading.value = false
  }
}

watch(
  () => props.dir,
  () => {
    queryParams.value.page = 1
    getList()
  },
  { immediate: true }
)
</script>
<style scoped lang="scss">
.gallery-content {
  // padding: 12px 16px 8px 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.filters {
  // margin-bottom: 8px;
}
.category-row {
  display: flex;
  align-items: center;
  gap: 30px;
}
.chip {
  // padding: 6px 10px;
  // background: #fff;
  // border: 1px solid #e5e5e5;
  // border-radius: 6px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}
.chip.active {
  // background: #0064ff;
  // border-color: #0064ff;
  color: #0064ff;
}
.spacer {
  flex: 1;
}
.refresh-link {
  margin-left: 12px;
}
.grid-container {
  flex: 1 0 auto;
  height: 0;
  margin-top: 20px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 270px);
  gap: 20px;
}
.card {
  background: #fff;
  border: 1px solid #f1f1f1;
  border-radius: 8px;
  overflow: hidden;
  height: 280px;
  box-sizing: border-box;
}
.img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}
.footer {
  margin-top: 34px;
  display: flex;
  justify-content: flex-end;
}

:deep(.s-empty) {
  margin-top: 200px;
}
</style>
