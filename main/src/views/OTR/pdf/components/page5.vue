<template>
  <div class="PdfPage5">
    <div class="row">
      <img class="topIcon" src="@/assets/imgs/otr/pdf/page2_top.png" />
      <div class="column">
        <div class="descTitle">分歧度分析</div>
        <div class="descSubTitle">DIVERGENCE ANALYSIS</div>
        <div class="otherTitle">该部分展示了各素质项的分歧度</div>

        <div class="wrap">
          <page5Item class="wrap-item" title="尽责" />
          <page5Item class="wrap-item" title="极致" />
          <page5Item class="wrap-item" title="客户第一" />
          <page5Item class="wrap-item" title="团结一心" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import { strRemoveChar } from '@/utils/index'
import page5Item from './page5Item.vue'

const props = defineProps({
  data: propTypes.object.def({})
})

const fqdList = ref<any>()
const handleFqdData = () => {
  fqdList.value = []
  props.data.scores && props.data.scores.forEach((item) => {})
  props.data.fqd &&
    Object.keys(props.data.fqd).forEach((key) => {
      fqdList.value.push({
        key: key,
        value: props.data.fqd[key],
        minus: Number(strRemoveChar(props.data.fqd[key], '%')) < 0 ? true : false,
        progress: getValueProgress(props.data.fqd[key])
      })
    })
}

const getValueProgress = (value: string) => {
  let progress = ''
  let value1 = strRemoveChar(value, '%')
  value1 = strRemoveChar(value1, '-')
  progress = (Number(value1) / 100).toFixed(2)
  return progress
}

const topOffset = (index) => {
  if (index === 0) {
    return 0
  } else if (index === 1) {
    return 55
  } else if (index === 2) {
    return 112
  }
  return 55 * index
}

const itemWidth = (progress: number) => {
  const width = Math.floor(progress * 118)
  return width < 2 ? 2 : width
}

onMounted(() => {
  handleFqdData()
})
</script>

<style lang="scss" scoped>
.PdfPage5 {
  background-image: url('@/assets/imgs/otr/pdf/page2_bg.png');
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background: #e9f2fb;
  .row {
    display: flex;
    flex-direction: row;
    .topIcon {
      margin-top: 32px;
      margin-left: 14px;
      width: 23px;
      height: 27px;
    }
    .column {
      margin-left: 13px;
      margin-top: 24px;
      display: flex;
      flex-direction: column;
      .descTitle {
        font-weight: 500;
        font-size: 30px;
        color: #232323;
      }
      .descSubTitle {
        font-weight: 400;
        font-size: 12px;
        color: #666666;
        line-height: 18px;
      }
      .otherTitle {
        margin-top: 24px;
        font-weight: 400;
        font-size: 17px;
        color: #232323;
        margin-bottom: 19px;
      }
      .wrap {
        display: flex;
        flex-wrap: wrap;
        width: calc(575px + 39px);
        margin-left: -39px;
        &-item {
          width: 282px;
          height: 232px;
          margin-bottom: 24px;
          margin-right: 11px;
        }
      }
    }
  }
}
</style>
