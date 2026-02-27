<template>
  <el-table
    class="SWCommonTable"
    :data="list"
    width="100%"
    :show-overflow-tooltip="false"
    v-loading="loading"
    v-horizontal-scroll="'always'"
    row-class-name="commonTableRow"
    :header-cell-style="appStore.headerCellStyle"
  >
    <el-table-column prop="store" label="店铺" min-width="210">
      <template #default="{ row }">
        <div class="store-name">{{ getStoreName(row.store) }}</div>
      </template>
    </el-table-column>
    <el-table-column prop="month" label="月份" />
    <el-table-column prop="monthWithWeek" label="周度" min-width="100" />
    <el-table-column prop="firstEvaluate" label="初次评价日期" min-width="180" />
    <el-table-column prop="type" label="评价类型" align="center">
      <template #default="{ row }">
        <el-tag v-if="row.type" :type="getTypeMeta(row).tagType">
          {{ getTypeMeta(row).name }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="number" label="数量" />
    <el-table-column prop="goodsId" label="商品ID" min-width="200" />
    <el-table-column prop="goodsCode" label="商品编码" />
    <el-table-column prop="categoryName" label="产品类目" min-width="300" />
    <el-table-column prop="orderNo" label="订单号" min-width="200" />
    <el-table-column prop="content" label="评价内容" min-width="160">
      <template #default="{ row }">
        <!-- 超过15个字符就显示Popover -->
        <div v-if="row.content.length > 15">
          <el-popover
            class="box-item"
            placement="bottom-start"
            width="340px"
            :disabled="!row.content"
          >
            <template #reference>
              <div class="comment-content-ellipsis">
                {{ row.content }}
              </div>
            </template>
            <div class="comment-content">
              <ElScrollbar max-height="300px">
                {{ row.content }}
              </ElScrollbar>
            </div>
          </el-popover>
        </div>
        <div v-else>
          {{ row.content }}
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="primaryClassification" label="一级分类" />
    <el-table-column prop="secondaryClassification" label="二级分类" min-width="120" />
    <el-table-column prop="commentStatus" label="是否已处置" min-width="120">
      <template #default="{ row }">
        {{ row.commentStatus === '1' ? '是' : '否' }}
      </template>
    </el-table-column>
    <el-table-column prop="imgUrls" label="图片链接" :show-overflow-tooltip="false" min-width="150">
      <template #default="{ row }">
        <div class="img-box" @click="handleImgLink(row.imgUrls)">
          {{ row.imgUrls }}
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="videoUrls" label="视频链接" :show-overflow-tooltip="true">
      <template #default="{ row }">
        <div class="video-box" @click="handleVideoLink(row.videoUrls)">
          {{ row.videoUrls }}
        </div>
      </template>
    </el-table-column>
    <!-- 添加操作列 -->
    <el-table-column label="操作" width="100" fixed="right" align="center">
      <template #default="{ row }">
        <el-button link type="primary" style="color: #0064ff" @click="handleEditCategory(row)"
          >编辑分类</el-button
        >
      </template>
    </el-table-column>
    <template #empty>
      <div class="empty-img">
        <img src="@/assets/imgs/common/empty_list.png" alt="" />
        <div>暂无数据</div>
      </div>
    </template>
  </el-table>

  <!-- 图片预览组件 -->
  <ImgPreview ref="imgPreviewRef" />
</template>
<script lang="ts" setup>
import { ref } from 'vue'

import { onNegativeReviewDashboardStore } from '@/store/modules/negativeReviewDashboard'
const negativeReviewDashboardStore = onNegativeReviewDashboardStore()
import { useAppStore } from '@/store/modules/app'
import ImgPreview from './imgPreview.vue'
const appStore = useAppStore()

const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
  total: {
    type: Number,
    default: 0
  },
  loading: {
    type: Boolean,
    default: false
  }
})
// 获取店铺名称
const getStoreName = (storeCode: string) => {
  if (!storeCode) return ''
  const store = negativeReviewDashboardStore.storeList?.find((item) => item.storeCode === storeCode)
  return store?.storeName || ''
}

// 评价类型标签：中评→warning；差评/负面评价→danger
const getTypeMeta = ({
  type,
  store
}: {
  type: string | null | undefined
  store: string
}): { name: string; tagType?: 'warning' | 'danger' } => {
  const defaultMeta: { name: string; tagType?: 'warning' | 'danger' } = { name: '' }
  if (!type || type.trim() === '') return defaultMeta

  const trimmedType = type.trim()
  const specialStoreKeywords = ['swpdd', 'swvip', 'swjd']
  const isSpecial =
    store &&
    typeof store === 'string' &&
    specialStoreKeywords.some((keyword) => store.toLowerCase().includes(keyword))

  if (isSpecial) {
    if (trimmedType === '3') return { name: '中评', tagType: 'warning' }
    if (trimmedType === '1' || trimmedType === '2') return { name: '差评', tagType: 'danger' }
    return defaultMeta
  }

  if (trimmedType === '3') return { name: '中评', tagType: 'warning' }
  if (trimmedType === '4') return { name: '差评', tagType: 'danger' }
  if (trimmedType === '5') return { name: '负面评价', tagType: 'danger' }
  return defaultMeta
}

// 打开视频播放
const handleVideoLink = (videoUrls: string) => {
  if (videoUrls.trim() === '') return
  window.open(videoUrls)
}

// 打开图片预览
const imgPreviewRef = ref<{ open: (imgUrls: string) => void } | null>(null)
const handleImgLink = (imgUrls: string) => {
  if (imgUrls && imgUrls.trim() === '') return
  imgPreviewRef.value?.open(imgUrls)
}

// 点击编辑分类
const emit = defineEmits(['edit-category'])
const handleEditCategory = (row: any) => {
  emit('edit-category', row.id)
}
</script>

<style lang="scss" scoped>
// 评价类型
.comment-type {
  width: 65px;
  height: 28px;
  line-height: 28px;
  border-radius: 4px;
  text-align: center;
}

// 评价内容
.comment-content-ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  /* 限制显示行数 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  line-height: 1.5;
}

.comment-content {
  background-color: #f5f5f5;
  padding: 8px;
  box-sizing: border-box;
}

// 视频链接 // 图片链接
.video-box,
.img-box {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  /* 限制显示行数 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  line-height: 1.5;
  color: #0064ff;
  cursor: pointer;
}
</style>
