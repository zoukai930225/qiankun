<template>
  <div class="jingpin-list">
    <!--  -->
    <div
      class="jingpin-item"
      v-for="(item, index) in reviewDetail.competitiveInformationList"
      :key="index"
      :style="{
        marginRight: index % 2 == 1 ? '0px' : '20px',
        marginBottom: '20px',
        width: `${jingpinItemWidth()}px`
      }"
    >
      <div
        class="jingpin-item-title row-center"
        style="border-bottom: 1px solid #eceaea; padding-bottom: 12px"
      >
        <div style="font-size: 14px; font-weight: 400; color: #666666; padding-right: 10px"
          >店铺</div
        >
        {{ item.store || '--' }}
      </div>
      <div class="jingpin-item-content" :style="{ width: `${jingpinItemWidth()}px` }">
        <div class="jingpin-item-content-item" :style="{ width: `${jingpinItemWidth()}px` }">
          <div class="jingpin-item-content-label"> 竞品销售/月 </div>
          <div class="jingpin-item-content-value" style="padding-left: 10px; width: 118px">
            {{ item.salesVolume }}
          </div>
          <div class="jingpin-item-content-label"> 竞品客单价 </div>
          <div class="jingpin-item-content-value" style="padding-left: 10px">
            {{ item.customerUnitPrice }}
          </div>
        </div>
        <div class="jingpin-item-content-item">
          <div class="jingpin-item-content-label" style="width: 84px"> 链接 </div>
          <div
            class="jingpin-item-content-value text2"
            style="cursor: pointer; width: calc(100% - 120px); padding-left: 10px"
            @click="openlink(item.competitiveLink)"
            v-if="item.competitiveLink"
          >
            {{ item.competitiveLink }}
          </div>
        </div>
        <div class="jingpin-item-content-item">
          <div class="jingpin-item-content-label" style="width: 86px"> 竞品平台备注 </div>
          <div
            class="jingpin-item-content-value text2"
            style="width: calc(100% - 120px); padding-left: 10px"
          >
            {{ item.remarks }}
          </div>
        </div>
      </div>
      <div class="jingpin-img-list">
        <img v-if="item.imgUrl" :src="item.imgUrl" class="jingpin-img" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  reviewDetail: {
    type: Object as PropType<any>,
    default: () => ({})
  },
  designDetail: {
    type: Object as PropType<any>,
    default: () => ({})
  },
  jingpinItemWidth: {
    type: Number,
    default: 0
  }
})

const jingpinItemWidth = () => {
  return props.jingpinItemWidth
}

const openlink = (link: string) => {
  window.open(link)
}
</script>

<style lang="scss" scoped>
.jingpin-list {
  // display: grid;
  // grid-template-columns: repeat(2, 262px);
  // grid-column-gap: 30px;
  width: calc(100%);
  display: flex;
  flex-wrap: wrap;
  .jingpin-item {
    width: 455px;
    min-height: 267px;
    margin-right: 20px;

    background: #f8f8f9;
    border-radius: 10px;
    padding: 16px 20px;
    box-sizing: border-box;

    .jingpin-item-title {
      font-size: 14px;
      color: #333333;
      // font-weight: bold;
    }

    .jingpin-item-content {
      width: 239px;
      min-height: 140px;

      box-sizing: border-box;
      margin-top: 16px;

      .jingpin-item-content-item {
        display: flex;
        // justify-content: space-between;
        margin-bottom: 16px;

        &:last-child {
          margin-bottom: 0;
        }

        .jingpin-item-content-label {
          color: #666666;
          font-size: 14px;
          text-align: right;
          width: 84px;
        }

        .jingpin-item-content-value {
          // width: 120px;
          // text-align: right;
          color: #666666;
          font-size: 14px;
        }
      }
    }
  }

  .jingpin-img-list {
    margin-top: 0px;
    display: grid;
    grid-template-columns: repeat(3, 73px);
    grid-column-gap: 9px;

    .jingpin-img {
      width: 74px;
      height: 74px;
      border-radius: 4px;
    }
  }
}
</style>
