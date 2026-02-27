<template>
  <div class="row" style="border-bottom: 1px solid #eceaea">
    <div>
      <div class="qihua-info">
        <div class="qihua-list">
          <div class="qihua-item" :style="{ width: `${planInfoItemWidth}px` }">
            <div class="qihua-item-title">企划名称</div>
            <el-tooltip effect="dark" :content="reviewDetail.planName || ''">
              <div class="qihua-item-content text1" :style="{ width: `${planInfoInputWidth}px` }">{{
                reviewDetail.planName || ''
                }}</div>
            </el-tooltip>
          </div>
          <div class="qihua-item" :style="{ width: `${planInfoItemWidth}px` }">
            <div class="qihua-item-title">企划类型</div>
            <div class="qihua-item-content" :style="{ width: `${planInfoInputWidth}px` }"> {{
              getDictLabel(DICT_TYPE.NP_ENTERPRISE_PLANTYPE, Number(reviewDetail?.planType || ''))
            }}</div>
          </div>
          <div class="qihua-item" :style="{ width: `${planInfoItemWidth}px` }">
            <div class="qihua-item-title">店铺</div>
            <div class="qihua-item-content text1" :style="{ width: `${planInfoInputWidth}px` }">{{
              reviewDetail?.store || ''
              }}</div>
          </div>

          <div class="qihua-item" :style="{ width: `${planInfoItemWidth}px` }">
            <div class="qihua-item-title">品类</div>
            <div class="qihua-item-content text1" :style="{ width: `${planInfoInputWidth}px` }">{{
              formatCategory(reviewDetail?.category) || ''
              }}</div>
          </div>
          <div class="qihua-item" :style="{ width: `${planInfoItemWidth}px` }">
            <div class="qihua-item-title">系列</div>
            <div class="qihua-item-content text1" :style="{ width: `${planInfoInputWidth}px` }">{{
              reviewDetail?.classCode
              }}</div>
          </div>
          <div class="qihua-item" :style="{ width: `${planInfoItemWidth}px` }">
            <div class="qihua-item-title">目标客群</div>
            <div class="qihua-item-content text1" :style="{ width: `${planInfoInputWidth}px` }">{{
              reviewDetail?.targetAudience
              }}</div>
          </div>
          <div class="qihua-item" :style="{ width: `${planInfoItemWidth}px` }">
            <div class="qihua-item-title">竞品链接</div>
            <div class="qihua-item-content text1"
              :style="{ width: `${planInfoInputWidth}px`, cursor: 'pointer', color: '#0064FF' }"
              @click="openLink(reviewDetail?.competitionLink)">{{ reviewDetail?.competitionLink }}</div>
          </div>
          <div class="qihua-item" :style="{ width: `${planInfoItemWidth}px` }">
            <div class="qihua-item-title" style="line-height: 18px">销售目标季度</div>
            <div class="qihua-item-content text1" :style="{ width: `${planInfoInputWidth}px` }">{{
              reviewDetail?.salesTargetQuarter
              }}</div>
          </div>
          <div class="qihua-item" :style="{ width: `${planInfoItemWidth}px` }">
            <div class="qihua-item-title" style="line-height: 20px">预计拍摄日期</div>
            <div class="qihua-item-content text1" :style="{ width: `${planInfoInputWidth}px` }">{{
              reviewDetail?.estimatedShootingDate || ''
              }}</div>
          </div>
          <div class="qihua-item" :style="{ width: `${planInfoItemWidth}px` }">
            <div class="qihua-item-title">企划时间</div>
            <div class="qihua-item-content text1" :style="{ width: `${planInfoInputWidth}px` }">{{
              reviewDetail?.planningTime || ''
              }}</div>
          </div>
          <div class="qihua-item" :style="{ width: `${planInfoItemWidth}px` }">
            <div class="qihua-item-title">计划上架</div>
            <div class="qihua-item-content text1" :style="{ width: `${planInfoInputWidth}px` }">{{
              reviewDetail?.planListDate || ''
              }}</div>
          </div>
          <div class="qihua-item" :style="{ width: `${planInfoItemWidth}px` }">
            <div class="qihua-item-title">计划下单</div>
            <div class="qihua-item-content text1" :style="{ width: `${planInfoInputWidth}px` }">{{
              reviewDetail?.planOrderDate || ''
              }}</div>
          </div>
          <div class="qihua-item" :style="{ width: `${planInfoItemWidth}px` }">
            <div class="qihua-item-title">大货到仓</div>
            <div class="qihua-item-content text1" :style="{ width: `${planInfoInputWidth}px` }">{{
              reviewDetail?.goodsToWarehouseDate || '--'
              }}</div>
          </div>
          <div class="qihua-item" :style="{ width: `${planInfoItemWidth}px` }">
            <div class="qihua-item-title">产品等级</div>
            <div class="qihua-item-content text1" :style="{ width: `${planInfoInputWidth}px` }">{{
              productLevel(reviewDetail?.isCore)
              }}</div>
          </div>
          <div class="qihua-item" style="width: calc(100%); height: auto">
            <div class="qihua-item-title">风险点</div>
            <div class="qihua-item-content" style="width: calc(100% - 66px); height: auto">{{
              reviewDetail?.productRisk || '--'
              }}</div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="qihua-item1 row textWrap" style="height: 282px; position: relative">
        <div class="qihua-item1-title" style="width: 38px; line-height: 20px">产品需求</div>
        <el-popover :width="200" trigger="hover">
          <template #reference>
            <div class="qihua-item1-content text6" style="
                height: 282px;
                width: 160px;
                line-height: 20px;
                padding-top: 6px;
                padding-right: 4px;
                white-space: normal;
                text-overflow: -o-ellipsis-lastline;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 7;
                line-clamp: 7;
                -webkit-box-orient: vertical;
              " :style="{ width: `${planInfoReamrkWidth}px` }">{{ reviewDetail?.enterpriseRemark || '' }}</div>
          </template>
          <div>{{ reviewDetail?.enterpriseRemark || '' }}</div>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isUrl } from '@/utils/is'
import { getDictLabel, DICT_TYPE } from '@/utils/dict'

const props = defineProps({
  reviewDetail: {
    type: Object as PropType<any>,
    default: () => ({})
  },
  planInfoItemWidth: {
    type: Number,
    default: 0
  },
  planInfoInputWidth: {
    type: Number,
    default: 0
  },
  planInfoReamrkWidth: {
    type: Number,
    default: 0
  },
  categoryList: {
    type: Array,
    default: () => []
  }
})

const formatCategory = (category) => {
  if (!category) return ''
  const result = props.categoryList.find((item) => item.code == category)
  return result ? result.name : ''
}

const productLevel = (isCore) => {
  if (isCore) {
    return getDictLabel(DICT_TYPE.NP_PRODUCTGRADE, isCore) || '--'
  }
  return '--'
}
const openLink = (link) => {
  if (isUrl(link)) {
    window.open(link, '_blank')
  } else {
    ElMessage.warning('非链接无法跳转')
  }
}
</script>

<style lang="scss" scoped>
// 企划信息
.qihua-info {
  .qihua-list {
    display: flex;
    flex-wrap: wrap;
  }

  white-space: normal !important;
  word-break: break-all !important;
  line-break: anywhere;

  .qihua-item-title {
    text-align: right;
    padding-right: 10px;
    font-size: 14px;
    color: #666666;
    margin-bottom: 5px;
    width: 66px;
    height: 32px;
    line-height: 32px;
  }

  .qihua-item-content {
    font-size: 14px;
    color: #666666;
    width: 166px;
    border-radius: 4px;
    background: #f8f8f9;
    box-sizing: border-box;
    border: 1px solid #e5e5e5;
    height: 32px;
    line-height: 32px;
    padding-left: 8px;
    padding-right: 2px;
  }

  // 卖点
  .qihua-maidian {
    width: 554px;
    min-height: 100px;
    background: rgb(153, 153, 153, 0.08);
    border-radius: 10px;
    padding: 14px;
    box-sizing: border-box;
  }
}

.qihua-item {
  width: 242px;
  // min-height: 100px;
  // background: rgb(153, 153, 153, 0.08);
  border-radius: 10px;
  // padding: 14px;
  // box-sizing: border-box;
  margin-bottom: 12px;
  display: flex;
  flex-direction: row;
}

.qihua-item1-title {
  text-align: right;
  padding-right: 10px;
  font-size: 14px;
  color: #666666;
  margin-bottom: 5px;
  width: 66px;
  height: 32px;
  line-height: 32px;
}

.qihua-item1-content {
  font-size: 14px;
  color: #666666;
  width: 166px;
  border-radius: 4px;
  background: #f8f8f9;
  box-sizing: border-box;
  border: 1px solid #e5e5e5;
  height: 32px;
  line-height: 32px;
  padding-left: 10px;
  padding-right: 2px;
}
</style>
