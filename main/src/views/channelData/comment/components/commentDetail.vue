<template>
  <el-table :header-cell-style="appStore.headerCellStyle" v-loading="loading" :data="dataList" border
    :show-overflow-tooltip="false" row-class-name="commonTableRow1" class="SWCommonTable"
    cell-class-name="self-table-cell" v-horizontal-scroll="'always'" ref="tableRef"
    :tooltip-options="{ popperClass: 'refund-tips' }" :cell-style="handleCellStyle">
    <el-table-column align="center" type="index" width="100" label="排序" />
    <el-table-column align="center" prop="tody" :min-width="200">
      <template #header>
        <span class="row-center" style="justify-content: center;">
          最新一次采集（{{ todoyDate }}）
        </span>
      </template>
      <template v-slot="{ row }">
        <Card :row="row.tody" @showVideo="showVideo" />
      </template>
    </el-table-column>
    <el-table-column align="center" prop="yester" :min-width="200">
      <template #header>
        上一次采集（{{ yesterDate }}）
      </template>
      <template v-slot="{ row }">
        <Card :row="row.yester" @showVideo="showVideo" />
      </template>
    </el-table-column>
    <template #empty>
      <div class="flex-column" style="align-items: center;">
        <img class="empty-table" src="@/assets/imgs/promotion/empty.png" alt="" />
        <span>暂无数据</span>
      </div>
    </template>
  </el-table>
  <VideoDialog ref="videoRef" :urls="videoUrls" />
</template>



<script lang="tsx" setup>
import request from '@/config/axios';
import dayjs from 'dayjs';
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
import Card from './commentDetailCard.vue'
const commentForm = inject<any>('CommentForm');
const CommentDetails = inject<any>('CommentDetails');
import VideoDialog from './videoDialog.vue';
const loading = ref(false);
const dataList = ref<any[]>([]);
const todoyDate = ref<any>(commentForm.searchData.value.dataDate);
const yesterDate = ref<any>(dayjs(commentForm.searchData.value.dataDate).subtract(1, 'day').format('YYYY-MM-DD'));
// 查询
const onSearch = () => {
  loading.value = true;
  request.get({ url: `/api/odsTaoProductDetailComments/getCommentDetail`, params: { dataDate: commentForm.searchData.value.dataDate, goodsId: CommentDetails.dataValue.value.goodsId, store: CommentDetails.dataValue.value.store } }).then((res: any) => {
    const data = [] as any[]
    if (res?.todoyDate && Array.isArray(res?.todayList)) {
      todoyDate.value = res.todoyDate;
      yesterDate.value = res.yesterDate;
      res.todayList.map((item, index) => {
        item.pictures = JSON.parse(item.pictures)
        res.yesterList[index].pictures = JSON.parse(res.yesterList[index].pictures);
        data.push(
          {
            tody: item,
            yester: res.yesterList[index],
            color: item.color || res.yesterList[index].color || ''
          }
        )
      })
    }
    dataList.value = data;
  }).finally(() => {
    loading.value = false;
  });
};

const handleCellStyle = ({ row, columnIndex }) => {
  if (columnIndex === 0) return {};
  const item = columnIndex === 1 ? row.tody : row.yester;
  return row.color ? { backgroundColor: item.color === 'red' ? 'rgba(235,55,55,0.1)' : 'rgba(219,106,15,0.1)' } : {}
}

const videoUrls = ref('');
const videoRef = ref<any>()
const showVideo = (row: any) => {
  videoUrls.value = row.video
  nextTick(() => {
    videoRef.value.openPreview()
  })
}
onMounted(() => {
  dataList.value = [];
});

defineExpose({
  onSearch
})


</script>
<style lang="scss" scoped></style>
