<template>
  <ElScrollbar>
    <div class="bg">
      <img class="bg-logo" src="@/assets/imgs/dataV/team/logo_title.png" />
      <div class="bg-title">
        <img class="bg-title-left" src="@/assets/imgs/dataV/sale/weekly_rank.png" />
        <div class="bg-title-text">{{ title }}</div>
        <img class="bg-title-right" src="@/assets/imgs/dataV/sale/rank_right_star.png" />
      </div>

      <div class="bg-rankTop">
        <div
          class="item"
          v-for="(_, index) in topList"
          :key="index"
          :class="{
            item2: index === 0,
            item1: index === 1,
            item3: index === 2
          }"
          :style="{ marginRight: index < 2 ? '28px' : '0px' }"
        >
          <div
            class="item-row"
            :class="{
              'item-row2': index === 0,
              'item-row1': index === 1,
              'item-row3': index === 2
            }"
          >
            <div style="display: flex; flex-direction: row">
              <div
                class="item-row-item"
                :class="{
                  'item-row-item1': index === 0,
                  'item-row-item2': index === 1,
                  'item-row-item3': index === 2
                }"
                v-for="(value1, index1) in tableTopRankConfigList()[rankIndex(index)]"
                :key="index1"
              >
                <div class="item-row-item-title" :class="{ 'item-row-item-title1': index === 1 }">{{
                  value1.name
                }}</div>
                <div class="item-row-item-value" :class="{ 'item-row-item-value1': index === 1 }">{{
                  value1.value
                }}</div>
              </div>
            </div>
          </div>
          <div
            class="item-group"
            :class="{
              'item-group1': index === 0,
              'item-group2': index === 1,
              'item-group3': index === 2
            }"
          >
            <div class="item-group-value">{{
              index < beforeWeekTopRankGropuList().length
                ? beforeWeekTopRankGropuList()[rankIndex(index)]
                : ''
            }}</div>
          </div>
        </div>
      </div>

      <div class="bg-rankScroll">
        <div class="bg-rank">
          <div class="bg-rank-left">
            <div class="bg-rank-left-rankBg bg-rank-left-rankBgHeader">
              <div
                class="item"
                v-for="(value, index1) in tableColumnConfigList({})"
                :key="index1"
                :style="{
                  width: value.width + 'px',
                  marginLeft: index1 === 0 ? '140px' : ''
                }"
              >
                <div class="item-title">{{ value.name }}</div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="bgRankScroll"
          ref="rankScrollRef"
          :style="{
            height: exportImg ? `${rankList.length * 77 + 45}px` : page === 1 ? '560px' : '594px'
          }"
        >
          <div class="bg-rank" v-for="(item, index) in rankList" :key="index">
            <div
              class="bg-rank-left"
              :style="{
                marginBottom:
                  index === rankList.length - 1
                    ? '-10px'
                    : index === 0
                      ? '12px'
                      : index === 1
                        ? '6px'
                        : index === 2
                          ? '11px'
                          : '14px'
              }"
            >
              <div class="bg-rank-left-rank" v-if="index > 2">
                <img
                  v-if="index > 2"
                  class="bg-rank-left-rank-top"
                  src="@/assets/imgs/dataV/team/rank_top.png"
                />
                <div
                  class="bg-rank-left-rank-No"
                  :style="{
                    color: monthNoColor(index + 1)
                  }"
                >
                  {{ index + 1 }}
                </div>
              </div>
              <div
                class="bg-rank-left-rankBg"
                :class="{
                  'bg-rank-left-rankBgTop': index <= 2,
                  'bg-rank-left-rankNormal': index > 2 && index < rankList.length - 3,
                  'bg-rank-left-rankOtherImg':
                    index <= rankList.length - 1 && index >= rankList.length - 3 && index > 2
                }"
              >
                <img
                  v-if="index === 0"
                  class="columnRankImg"
                  src="@/assets/imgs/dataV/sale/item_rank_1.png"
                />
                <img
                  v-if="index === 1"
                  class="columnRankImg"
                  src="@/assets/imgs/dataV/sale/item_rank_2.png"
                />
                <img
                  v-if="index === 2"
                  class="columnRankImg"
                  src="@/assets/imgs/dataV/sale/item_rank_3.png"
                />
                <div v-if="index > 2" style="width: 84px"></div>
                <div
                  class="item"
                  v-for="(value, index1) in tableColumnConfigList(item)"
                  :key="index1"
                  :style="{
                    width: value.width + 'px',
                    marginLeft: index <= 2 && index1 === 0 ? '74px' : ''
                  }"
                >
                  <div
                    v-if="value.group"
                    class="colmnGroup"
                    :style="{
                      background: monthItemGroupBackground(index + 1)
                    }"
                  >
                    <div class="colmnGroup-title">{{ value.value }}</div>
                  </div>
                  <div v-if="value.progress" class="item-progress">
                    <div class="item-value" v-if="value.value" style="color: #076d6b">{{
                      value.value
                    }}</div>
                  </div>
                  <div v-if="!value.group && !value.progress" class="item-value">{{
                    value.value
                  }}</div>
                </div>
              </div>
            </div>
          </div></div
        >
      </div>
    </div>
  </ElScrollbar>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import { monthNoColor, monthItemGroupBackground, rankIndex } from './utils'

const props = defineProps({
  exportImg: propTypes.bool.def(false),
  title: propTypes.string.def(''),
  totalPage: propTypes.number.def(1),
  topList: propTypes.array.def([]),
  rankList: propTypes.array.def([])
})
const page = ref(1)
const timeInterval = 1000 * 10 // 每10秒滚动下一页数据

const rankScrollRef = ref()
// 排行内容滚动
const rankContentScroll = () => {
  if (props.exportImg) {
    return
  }
  let firstHeight = 576
  let otherHeight = 606
  let scrollHeight = 0
  if (page.value === 1) {
    scrollHeight = 0
  } else if (page.value === 2) {
    scrollHeight = firstHeight
  } else {
    scrollHeight = firstHeight + (page.value - 2) * otherHeight
  }
  rankScrollRef.value?.scrollTo({
    top: scrollHeight,
    behavior: 'smooth'
  })
  if (page.value >= 1 && page.value < props.totalPage) {
    setTimeout(() => {
      page.value = page.value + 1
      rankContentScroll()
    }, timeInterval)
  } else if (page.value === props.totalPage) {
    setTimeout(() => {
      page.value = 1
      rankContentScroll()
    }, timeInterval)
  }
}

const rankContentScrollTop = () => {
  page.value = 1
  rankScrollRef.value.scrollTo({
    top: 0
  })
}

const tableTopRankConfigList = () => {
  return beforeWeekTopRankList()
}

const tableColumnConfigList = (item: any) => {
  const list = [
    {
      name: '客服姓名',
      width: 417,
      value: item.name || ''
    },
    {
      name: '分组',
      width: 276,
      value: item.groupName || '',
      group: true
    },
    {
      name: '询单人数',
      width: 325,
      value: item.numberOfInquiries || ''
    },
    {
      name: '询单->最终付款人数',
      width: 404,
      value: item.inquiryFinalNumberOfPayers || ''
    },
    {
      name: '转化率',
      width: 312,
      value: item.conversionRate || '',
      valueNumber: getPercentValueNumber(item.conversionRate) || '',
      progress: true
    },
    {
      name: '满意率',
      width: 90,
      value: item.customerSatisfactionRate || '',
      valueNumber: getPercentValueNumber(item.customerSatisfactionRate) || '',
      progress: true
    }
  ]
  return list
}

const beforeWeekTopRankList = () => {
  const rankList = []
  props.topList &&
    props.topList.forEach((item, index) => {
      let arr = [
        {
          name: '最终付款人数',
          value: item.inquiryFinalNumberOfPayers || '--'
        },
        {
          name: '转化率均值',
          value: item.conversionRate || '--'
        }
      ]
      rankList.push(arr)
    })
  return rankList
}

const beforeWeekTopRankGropuList = () => {
  const list = []
  props.topList &&
    props.topList.forEach((item, index) => {
      list.push(item.groupName || '')
    })
  return list
}

const getPercentValueNumber = (percent: String) => {
  if (percent) {
    const arr = percent.split('%')
    if (arr && arr.length > 0) {
      return arr[0]
    }
  }
  return ''
}

defineExpose({ rankContentScroll, rankContentScrollTop })
</script>

<style lang="scss" scoped>
.bg {
  background-image: url('@/assets/imgs/dataV/team/rank_bg.jpg');
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  min-width: 1920px;
  min-height: 1080px;
  &-logo {
    margin-top: 18px;
    width: 145px;
    height: 20px;
  }
  &-title {
    margin-top: 9px;
    height: 80px;
    display: flex;
    flex-direction: row;
    position: relative;
    &-left {
      position: absolute;
      width: 123px;
      height: 44px;
      margin-left: -34px;
    }
    &-text {
      margin-top: 15px;
      font-size: 40px;
      color: #256a5e;
      line-height: 60px;
      font-weight: 600;
    }
    &-right {
      position: absolute;
      right: 0px;
      width: 74px;
      height: 40px;
      margin-right: -36px;
    }
  }
  &-rankTop {
    margin-top: 15px;
    width: 1854px;
    height: 229px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    position: relative;
    .item1 {
      background-image: url('@/assets/imgs/dataV/sale/rank_1.png');
      background-size: 100% 100%;
      width: 634px;
      height: 214px;
      margin-top: 0px;
    }
    .item2 {
      background-image: url('@/assets/imgs/dataV/sale/rank_2.png');
      background-size: 100% 100%;
      width: 551px;
      height: 220px;
      margin-top: 22px;
    }
    .item3 {
      background-image: url('@/assets/imgs/dataV/sale/rank_3.png');
      background-size: 100% 100%;
      width: 551px;
      height: 229px;
      margin-top: 12px;
    }
    .item {
      display: flex;
      flex-direction: column;
      &-row1 {
        margin-bottom: 13px;
        margin-left: 56px;
      }
      &-row2 {
        margin-bottom: 36px;
        margin-left: 73px;
      }
      &-row3 {
        margin-bottom: 36px;
        margin-left: 73px;
      }
      &-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        font-family: SourceHanSansCN, SourceHanSansCN;
        font-weight: bold;
        color: #4a6950;
        margin-top: auto;
        &-item {
          display: flex;
          flex-direction: column;
          &-title {
            font-weight: 500;
            font-size: 19px;
            color: #598063;
            line-height: 39px;
          }
          &-value {
            font-weight: bold;
            font-size: 32px;
            color: #1b564a;
            line-height: 48px;
          }
        }
        &-item1 {
          width: 259px;
        }
        &-item2 {
          width: 373px;
        }
        &-item3 {
          width: 259px;
        }
      }
      &-group {
        margin-left: 200px;
        margin-top: 34px;
        position: absolute;
        background: linear-gradient(
          270deg,
          rgba(238, 238, 238, 0) 0%,
          rgba(150, 186, 161, 0.32) 36%,
          rgba(98, 149, 113, 0.32) 100%
        );
        border-radius: 6px;
        height: 45px;
        &-value {
          padding-left: 17px;
          font-weight: bold;
          font-size: 25px;
          color: #4d6e55;
          line-height: 45px;
        }
      }
      &-group1 {
        margin-left: 199px;
        margin-top: 34px;
      }
      &-group2 {
        margin-left: 256px;
        margin-top: 34px;
      }
      &-group3 {
        margin-left: 200px;
        margin-top: 43px;
      }
    }
  }

  &-rankScroll {
    margin-top: 15px;
    width: 1821px;

    .bg-rank {
      width: 1820px;
      &-left {
        width: 1820px;
        margin-bottom: 14px;
        display: flex;
        flex-direction: row;
        align-items: center;
        &-rankBg {
          width: 1820px;
          height: 76px;
          display: flex;
          flex-direction: row;
          align-items: center;
          // background: #fdfff9;
          // border-radius: 20px;
          .item {
            display: flex;
            flex-direction: row;
            align-items: center;
            &-title {
              font-family: SourceHanSansCN, SourceHanSansCN;
              font-weight: bold;
              font-size: 20px;
              color: #4a6950;
              line-height: 30px;
            }
            &-value {
              font-family: SourceHanSansCN, SourceHanSansCN;
              font-weight: bold;
              // padding-left: 80px;
              font-size: 20px;
              color: #333333;
              line-height: 30px;
            }
            &-progress {
              position: relative;
              display: flex;
              flex-direction: row;
              height: 62px;
              align-items: center;
            }
          }
        }

        &-rankBgTop {
          background-image: url('@/assets/imgs/dataV/sale/column_bg.png');
          background-size: 100% 100%;
          width: 1820px;
          height: 81px;
          display: flex;
          flex-direction: row;
          align-items: center;
        }

        &-rank {
          background-image: url('@/assets/imgs/dataV/team/normal_rank.png');
          background-size: 100% 100%;
          width: 62px;
          height: 62px;
          display: flex;
          flex-direction: column;
          align-items: center;
          &-top {
            margin-top: 9px;
            width: 30px;
            height: 10px;
          }
          &-No {
            font-family: SourceHanSansCN, SourceHanSansCN;
            font-weight: bold;
            font-size: 34px;
            color: #f2fef3;
          }
        }
        &-rankNormal {
          width: calc(1820px - 62px);
          height: 62px;
          background: #fdfff9;
          border-radius: 10px;
        }

        &-rankOtherImg {
          background-image: url('@/assets/imgs/dataV/sale/column_bg1.png');
          background-size: 100% 100%;
          width: calc(1820px - 62px);
          height: 62px;
        }

        &-rankBgHeader {
          background: #eaf0e9;
          border-radius: 5px;
          box-shadow: 0px 14px 21px 2px rgba(1, 70, 48, 0.17);
          box-shadow: 0px 14px 21px 2px rgba(1, 70, 48, 0.17);
        }
      }
    }
  }
  .columnRankImg {
    width: 48px;
    height: 68px;
    margin-left: 20px;
    margin-top: 7px;
  }
  .colmnGroup {
    height: 35px;
    background: #f9ed9e;
    border-radius: 10px;
    &-title {
      padding-left: 8px;
      padding-right: 8px;
      line-height: 35px;
      text-align: center;
      font-weight: bold;
      font-size: 16px;
      color: #333333;
    }
  }
  .bgRankScroll {
    width: 1821px;
    overflow: auto;
    display: flex;
    flex-direction: column;
  }
}
</style>

<style scoped>
/* 定制滚动条整体样式 */
::-webkit-scrollbar {
  width: 0px;
  background: transparent !important;
  background-color: transparent !important;
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
  background: transparent !important;
  /* 设置滚动条轨道的背景色 */
}
</style>
