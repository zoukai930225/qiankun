<template>
  <div class="basicInfo">
    <div class="row-center">
      <div class="title">信息</div>
      <img class="basicInfo-icon" src="@/assets/imgs/visualGallery/icon_info.png" />
    </div>

    <div class="infoBg">
      <div
        class="item"
        v-for="(value, index) in list()"
        :key="index"
        :class="{
          item1: index % 3 === 0,
          item2: index % 3 === 1,
          itemOne: value.name === '产品定位'
        }"
      >
        <div class="item-title">{{ value.name }}</div>
        <div class="item-value" :class="{ 'item-value1': index % 3 <= 1 }">{{ value.value }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { propTypes } from '@/utils/propTypes'

const props = defineProps({
  isMainImg: propTypes.bool.def(false),
  data: propTypes.object.def({}),
  promoteData: propTypes.object.def({})
})

const list = () => {
  let arr = [
    {
      name: '类目',
      value: props.data?.category || '--'
    },
    {
      name: '编码',
      value: props.data?.goodsCode || '--'
    },
    {
      name: '产品定位',
      value: props.data?.productPositioning || '--'
    }
    // {
    //   name: '点击率',
    //   value: props.data?.productPositioning || '--'
    // },
    // {
    //   name: '转换率',
    //   value: props.data?.productPositioning || '--'
    // },
    // {
    //   name: '销量',
    //   value: props.data?.productPositioning || '--'
    // },
  ]

  // if (!props.isMainImg) {
  //   arr.push({
  //     name: '需求方',
  //     value: props.promoteData?.demandSide || '--'
  //   })
  //   arr.push({
  //     name: '测图目的',
  //     value: props.promoteData?.mappingPurpose || '--'
  //   })
  // }

  return arr || []
}
</script>

<style lang="scss" scoped>
.basicInfo {
  margin-left: 25px;
  .title {
    font-weight: 500;
    font-size: 17px;
    color: #ffffff;
    line-height: 23px;
  }
  &-icon {
    margin-left: 10px;
    width: 6px;
    height: 14px;
  }
  .infoBg {
    margin-top: 25px;

    display: flex;
    flex-wrap: wrap;
    .item {
      display: flex;
      flex-direction: column;
      margin-bottom: 17px;
      &-title {
        font-size: 12px;
        color: #dadada;
        line-height: 17px;
      }
      &-value {
        padding-top: 8px;
        font-weight: 500;
        font-size: 12px;
        color: #ffffff;
        line-height: 17px;
      }
      &-value1 {
        padding-right: 10px;
      }
    }
    .item1 {
      width: 160px;
    }
    .item2 {
      width: 160px;
    }
    .itemOne {
      width: 320px;
    }
    // .item3 {
    //   width: 76px;
    // }
  }
}
:deep(.tooltip-class) {
  max-width: 100px;
}
</style>
