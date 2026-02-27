<template>
  <div class="PdfPage4">
    <div class="row">
      <img class="topIcon" src="@/assets/imgs/otr/pdf/page2_top.png" />
      <div class="column">
        <div class="descTitle">分歧度分析</div>
        <div class="descSubTitle">DIVERGENCE ANALYSIS</div>
        <div class="otherTitle">分歧度代表了您的上级/同事/下属与您自评</div>

        <div class="centerContentBg">
          <img
            class="centerBgImg"
            v-if="onlyShowMyself"
            src="@/assets/imgs/otr/pdf/page4_item_bg.png"
          />
          <img
            class="centerBgImg"
            v-if="!onlyShowMyself"
            src="@/assets/imgs/otr/pdf/page4_item_bg1.png"
          />
          <div class="centerBg">
            <div v-for="(value, index) in fqdList" :key="index">
              <div v-if="value.minus" class="center-row" :style="{ top: `${topOffset(index)}px` }">
                <div class="red-value">{{ value.key }}分歧度{{ value.value }}</div>
                <img class="red-arrow" src="@/assets/imgs/otr/pdf/page4_arrow_red.png" />
                <div class="red-bg" :style="{ width: `${itemWidth(value.progress)}px` }"></div>
              </div>
              <div v-else class="top-row" :style="{ top: `${topOffset(index)}px` }">
                <div class="blue-bg" :style="{ width: `${itemWidth(value.progress)}px` }"></div>
                <img class="blue-arrow" src="@/assets/imgs/otr/pdf/page4_arrow_blue.png" />
                <div class="blue-value">{{ value.key }}分歧度{{ value.value }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="item" v-for="(value, index) in list" :key="index">
          <div class="item-left">{{ value.title }}</div>
          <div class="item-right">{{ value.content }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import { strRemoveChar } from '@/utils/index'

const props = defineProps({
  data: propTypes.object.def({}),
  onlyShowMyself: propTypes.bool.def(false)
})

const fqdList = ref<any>()
const handleFqdData = () => {
  fqdList.value = []
  if (props.onlyShowMyself) {
    props.data.fqd &&
      Object.keys(props.data.fqd).forEach((key) => {
        if (key === '平均') {
          fqdList.value.push({
            key: '',
            value: props.data.fqd[key],
            minus: Number(strRemoveChar(props.data.fqd[key], '%')) < 0 ? true : false,
            progress: getValueProgress(props.data.fqd[key])
          })
        }
      })
  } else {
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
    return 38
  } else if (index === 2) {
    return 38 * 2 + 2
  } else if (index === 3) {
    return 38 * 3 + 3
  } else if (index === 4) {
    return 38 * 4 + 3
  } else if (index === 5) {
    return 38 * 5 + 6
  }
  return 38 * index
}

const itemWidth = (progress: number) => {
  const width = Math.floor(progress * 118)
  return width < 2 ? 2 : width
}

onMounted(() => {
  handleFqdData()
})

const list = ref([
  {
    title: '自我满意区',
    content: '分歧度小于-20%，自我评价高于他人评价'
  },
  {
    title: '认知平衡区',
    content: '分歧度偏差20%以内，评价对象的自我评价和他人给予的评价较为一致。'
  },
  {
    title: '谦虚自卑区',
    content: '分歧度大于20%，自我评价低于他人评价'
  }
])
</script>

<style lang="scss" scoped>
.PdfPage4 {
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

      .centerContentBg {
        position: relative;
        margin-left: -24px;
        margin-bottom: 19px;
        width: 543px;
        height: 421px;
        .centerBgImg {
          position: absolute;
          width: 543px;
          height: 421px;
        }
        .centerBg {
          position: absolute;
          top: 166px;
          .top-row {
            position: absolute;
            height: 29px;
            width: 244px;
            margin-left: 274px;
            margin-top: 3px;
            display: flex;
            flex-direction: row;
            align-items: center;
            .blue-bg {
              width: 138px;
              height: 26px;
              background: #004aff;
              border-radius: 13px;
            }
            .blue-arrow {
              width: 6px;
              height: 9px;
              margin-left: 5px;
              margin-right: 8px;
            }
            .blue-value {
              font-weight: 500;
              font-size: 11px;
              color: #232323;
              line-height: 17px;
            }
          }
          .center-row {
            position: absolute;
            height: 26px;
            width: 273px;
            margin-left: 0px;
            margin-top: 3px;

            display: flex;
            flex-direction: row;
            align-items: center;
            .red-bg {
              // width: 74px;
              height: 26px;
              background: #f30303;
              border-radius: 13px;
            }
            .red-arrow {
              width: 6px;
              height: 9px;
              margin-left: 0px;
              margin-right: 5px;
            }
            .red-value {
              margin-left: auto;
              font-weight: 500;
              font-size: 11px;
              color: #232323;
              line-height: 17px;
            }
          }
        }
      }

      .item {
        margin-left: -24px;
        display: flex;
        flex-direction: row;
        margin-bottom: 14px;
        width: 545px;
        height: 68px;
        background: #ffffff;
        border-radius: 12px 10px 10px 0px;
        &-left {
          width: 92px;
          height: 68px;
          background: linear-gradient(124deg, #2946ed 0%, #408dfd 100%);
          border-radius: 12px 0px 12px 0px;
          font-weight: 500;
          font-size: 15px;
          color: #ffffff;
          line-height: 68px;
          text-align: center;
        }
        &-right {
          width: calc(100% - 92px);
          height: 68px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          font-weight: 400;
          font-size: 13px;
          color: #232323;
          line-height: 18px;
          padding-left: 11px;
          padding-right: 8px;
          padding-top: 4px;
          padding-bottom: 4px;
        }
      }
    }
  }
}
</style>
