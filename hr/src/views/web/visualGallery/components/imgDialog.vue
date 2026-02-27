<!--
 * @Date: 2025-06-20 17:55:54
-->
<template>
  <div>
    <el-dialog v-model="imagedialog" :title="title" width="1240">
      <template #header>
        <div style="padding: 16px 20px; box-sizing: border-box">
          <span class="title">{{ props.title }}</span>
          <i class="el-dialog__headerbtn el-icon-close" @click="imagedialog = false"></i>
        </div>
      </template>
      <div class="img-wapper">
        <div class="img-wapper-item">
          <el-image
            v-for="(item, index) in list"
            :key="item.id"
            :src="item.picImageUrl"
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :preview-src-list="previewSrcList"
            show-progress
            :initial-index="index"
            fit="cover"
            class="img"
          />
        </div>
        <div v-if="list && list.length === 0" class="paidPromotionTable-empty">
          <img class="empty-table" src="@/assets/imgs/promotion/empty.png" alt="" />
          <span>暂无数据</span>
        </div>
      </div>
      <div class="pagination">
        <!-- 分页 -->
        <Pagination
          v-model:limit="queryParams.size"
          v-model:page="queryParams.page"
          :total="total"
          @pagination="getList"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { getQualityAndImprove } from '@/api/gallery'

const queryParams = ref({
  size: 10,
  page: 1
})
const total = ref(10)

const props = defineProps({
  title: {
    type: String,
    default: '优质车图库'
  }
})

const list = ref<any>([])
const previewSrcList = ref<string[]>([])

const getList = async () => {
  // 这里可以添加获取数据的逻辑
  const res = await getQualityAndImprove({
    isGood: isGood.value,
    page: queryParams.value.page,
    size: queryParams.value.size
  })
  total.value = res.total
  list.value = res.records || []
  previewSrcList.value = list.value.map((item) => item.picImageUrl)
}

const imagedialog = ref(false)
const isGood = ref()
const open = (isGoodType) => {
  imagedialog.value = true
  isGood.value = isGoodType
  console.log('打开弹窗', isGoodType)
  initData()
}

const initData = () => {
  queryParams.value.page = 1
  queryParams.value.size = 10
  getList()
}

defineExpose({ open })
</script>

<style scoped lang="scss">
.img-wapper {
  border-top: 1px solid #e4e7ed;
  padding: 18px 20px 0 20px;
  box-sizing: border-box;
  .img-wapper-item {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: flex-start;

    .img {
      object-fit: cover;
      border-radius: 4px;
      width: 224px;
      height: 265px;
      cursor: pointer;
      margin-right: 20px;
      margin-bottom: 20px;
      border-radius: 8px;
    }
    .img:nth-child(5n) {
      margin-right: 0;
    }
  }
}

// 分页
.pagination {
  display: flex;
  justify-content: flex-end;
  padding-right: 20px;
  box-sizing: border-box;
}
.paidPromotionTable-empty {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 100px 0;
}
:deep(.el-dialog) {
  padding: 0;
}

:deep(.el-dialog__header) {
  padding-bottom: 0;
}
.title {
  font-family: PingFang SC;
  font-size: 16px;
  font-weight: 500;
  line-height: normal;
  letter-spacing: normal;
  color: #333333;
}
</style>
