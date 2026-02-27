<!--
 * @Date: 2025-02-11 18:11:15
-->
<template>
  <div class="plan-detail">
    <FormTitle title="竞品信息" />
    <ElScrollbar
      v-if="
        reviewDetail &&
        reviewDetail?.competitiveInformationList &&
        reviewDetail?.competitiveInformationList.length > 0
      "
    >
      <div class="cardScrollBar">
        <div
          class="card-item"
          v-for="(item, index) in reviewDetail?.competitiveInformationList"
          :class="{
            'card-item-last': index === reviewDetail?.competitiveInformationList.length * 2 - 1
          }"
          :key="item.id"
        >
          <div class="title-wapper">
            {{ item.store }}
          </div>
          <div class="basicInfo">
            <div class="flex-row">
              <div class="info-item flex-row">
                <div class="label">竞品销售/月</div>
                <div class="value">{{ item.salesVolume }}</div>
              </div>
            </div>
            <div class="flex-row">
              <div class="info-item flex-row">
                <div class="label">竞品客单价</div>
                <div class="value">{{ item.customerUnitPrice }}</div>
              </div>
            </div>

            <div class="flex-row">
              <div class="info-item flex-row">
                <div class="label">链接</div>
                <div
                  class="value linkValue"
                  @click="openlink(item.competitiveLink)"
                  v-if="item.competitiveLink"
                  >{{ item.competitiveLink }}</div
                >
              </div>
            </div>

            <div class="flex-row">
              <div class="info-item flex-row">
                <div class="label">竞品平台备注</div>
                <el-tooltip effect="dark" :content="item.remarks">
                  <div
                    class="value text2"
                    style="max-width: 190px; text-align: right; cursor: pointer"
                    >{{ item.remarks }}</div
                  >
                </el-tooltip>
              </div>
            </div>
          </div>
          <div class="img-wapper flex-row">
            <img :src="item.imgUrl" class="img-item" />
          </div>
        </div>
      </div>
    </ElScrollbar>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import FormTitle from './formTitle.vue'

const props = defineProps({
  reviewDetail: {
    type: Object,
    detault: () => ({})
  }
})
const emit = defineEmits(['update:modelValue'])

const openlink = (link: string) => {
  window.open(link)
}
</script>

<style lang="scss" scoped>
.plan-detail {
  width: 100%;
  min-height: 100px;
  background: #ffffff;
  border-radius: 8px;
  padding: 20px 0px 0px 20px;
  box-sizing: border-box;
  margin-bottom: 20px;
}
.card-wapper {
  /* display: flex;
  flex-wrap: wrap; */
  display: flex; /* 使用Flexbox */
  overflow-x: auto; /* 允许水平滚动 */
}
.cardScrollBar {
  width: 900px;
  height: 358px;
  white-space: nowrap;
  display: flex; /* 使用Flexbox */
  overflow-x: auto; /* 允许水平滚动 */
  .card-item {
    width: 324px;
    height: 338px;
    background: #f0f0f0;
    border-radius: 10px;
    padding: 14px;
    box-sizing: border-box;
    margin-right: 20px;
    margin-bottom: 20px;
  }
  .card-item-last {
    margin-right: 10px;
  }
  .title-wapper {
    font-weight: 500;
    font-size: 16px;
    color: #333333;
    line-height: 22px;
    margin-bottom: 14px;
  }
  .basicInfo {
    width: 296px;
    height: 173px;
    background: #ffffff;
    border-radius: 5px;
    .flex-row {
      display: flex;
      flex-direction: row;
    }

    .info-item {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-right: 12px;
      margin-left: 10px;
      margin-top: 16px;
      .label {
        font-weight: 400;
        font-size: 12px;
        color: #666666;
        line-height: 17px;
        text-align: left;
        font-style: normal;
      }
      .value {
        font-weight: 400;
        font-size: 14px;
        color: #333333;
        line-height: 20px;
        text-align: center;
        font-style: normal;
      }
      .linkValue {
        white-space: normal; /* 允许换行 */
        word-wrap: break-word; /* 长单词换行 */
        max-width: 80%; /* 最大宽度为容器宽度 */
        color: #0064ff;
        cursor: pointer;
      }
    }
  }
  .img-wapper {
    margin-top: 12px;
    width: 296px;
    height: 86px;
    white-space: nowrap;
    display: flex; /* 使用Flexbox */
    overflow-x: auto; /* 允许水平滚动 */
    .img-item {
      width: 90px;
      height: 86px;
      margin-right: 13px;
      border-radius: 4px;
    }
    .img-item-last {
      margin-right: 0px;
    }

    // .img-item:nth-child(2n) {
    // }
  }
}
</style>
