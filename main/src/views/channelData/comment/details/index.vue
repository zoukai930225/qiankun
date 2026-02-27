<template>
  <scheme-details ref="detailsRef" name="Comment" :width="1200">
    <template #card>
      <div>
        <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleClick">
          <el-tab-pane label="评论" name="comment">
            <template #label>
              <span class="row-center">
                <span class="mr5px">评论</span>
                <el-tooltip placement="top" popper-style="max-width: 210px;">
                  <template #content>
                    <p>1. 最新采集的评论，在上次采集的评论里，但排序变化，则标黄，反之亦然；</p>
                    <p>2. 最新采集的评论，不在上次采集的评论里，则标红，反之亦然；</p>
                  </template>
                  <img src="@/assets/svgs/common/tips.svg" style="cursor: pointer;" />
                </el-tooltip>
              </span>
            </template>
            <CommentDetailTable ref="commentTableRef" />
          </el-tab-pane>
          <el-tab-pane label="问大家" name="ask">
            <template #label>
              <span class="row-center">
                <span class="mr5px">问大家</span>
                <el-tooltip placement="top" popper-style="max-width: 210px;">
                  <template #content>
                    <p>1. 最新采集的问答，在上次采集的问答里，但排序变化，则标黄，反之亦然；</p>
                    <p>2. 最新采集的问答，不在上次采集的问答里，则标红，反之亦然；</p>
                  </template>
                  <img src="@/assets/svgs/common/tips.svg" style="cursor: pointer;" />
                </el-tooltip>
              </span>
            </template>
            <AskDetailTable ref="ascTableRef" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </template>
  </scheme-details>
</template>

<script lang="tsx">
export default { name: 'CommentDetails' };
</script>

<script lang="tsx" setup>
import { cloneDeep } from "lodash-es";
import { DataItem } from "../page/config";
import CommentDetailTable from '../components/commentDetail.vue';
import AskDetailTable from '../components/askDetail.vue';

const detailsRef = ref<any>(), dataValue = ref<DataItem>({ ...new DataItem() }), bukValue = ref<DataItem>({ ...new DataItem() }), viewType = ref<string>('view');
const activeName = ref<string>('comment');

const title = computed(() => viewType.value === 'view' ? '详情' : '编辑');
const commentTableRef = ref<any>();
const ascTableRef = ref<any>();

// 弹出通用
const openView = (item: any = {}, type: string = 'view') => {
  activeName.value = item.detailType;
  // detailsRef openDrawer方法支持前/后置方法入参，无需操作抽屉显隐，内部已处理
  detailsRef?.value?.openDrawer(async () => {
    dataValue.value = { ...new DataItem(), ...item };
    // bukValue为备份数据，用以处理已操作未保存数据校验，慎重！！！
    bukValue.value = cloneDeep({ ...dataValue.value });
    viewType.value = type;
  }, () => {
    handleClick(activeName.value)
  });
};

const handleClick = (name: string) => {
  nextTick(() => {
    switch (name) {
      case 'comment':
        commentTableRef.value?.onSearch()
        break;
      case 'ask':
        ascTableRef.value?.onSearch()
        break;
    }
  })
}


defineExpose({ openView });

provide('CommentDetails', { dataValue, bukValue, viewType, title });

/**************************************以上文件文件内容非必要不可删除，按需追加使用******************************************************* */

</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
