<template>
  <ElScrollbar>
    <div class="bg">
      <img class="bg-logo" src="@/assets/imgs/dataV/team/logo_title.png" />
      <img class="bg-title" v-if="type === 0" src="@/assets/imgs/dataV/team/rank_title.png" />
      <img
        class="bg-title"
        v-if="type === 1"
        src="@/assets/imgs/dataV/team/target_rank_title.png"
      />
      <div class="bg-date" v-if="dataYear && dataMonth">
        <div class="bg-date-year"> {{ dataYear }}年</div>
        <img class="bg-date-icon" src="@/assets/imgs/dataV/team/rank_star.png" />
        <div class="bg-date-month"> {{ dataMonth }}月 </div>
      </div>
      <div v-else style="margin-top: 14px; height: 30px"></div>

      <div class="bg-rankTop">
        <div
          class="item"
          v-for="(value, index) in topList"
          :key="index"
          :class="{ item2: index === 0, item1: index === 1, item3: index === 2 }"
          :style="{ marginRight: index < 2 ? '46px' : '0px' }"
        >
          <img v-if="index === 0" class="item-rankNo2" src="@/assets/imgs/dataV/team/rank2.png" />
          <img v-if="index === 1" class="item-rankNo1" src="@/assets/imgs/dataV/team/rank1.png" />
          <img v-if="index === 2" class="item-rankNo3" src="@/assets/imgs/dataV/team/rank3.png" />

          <img v-if="index === 0" class="item-rank2" src="@/assets/imgs/dataV/team/top2.png" />
          <img v-if="index === 1" class="item-rank1" src="@/assets/imgs/dataV/team/top1.png" />
          <img v-if="index === 2" class="item-rank3" src="@/assets/imgs/dataV/team/top3.png" />
          <div
            class="item-row"
            :class="{
              'item-row2': index === 0,
              'item-row1': index === 1,
              'item-row3': index === 2
            }"
          >
            <div
              :class="{
                'item-row-nameValue2': index === 0,
                'item-row-nameValue1': index === 1,
                'item-row-nameValue3': index === 2
              }"
              >{{ value.name }}</div
            >
            <div
              :class="{
                'item-row-ratioValue2': index === 0,
                'item-row-ratioValue1': index === 1,
                'item-row-ratioValue3': index === 2
              }"
              >{{ getCompletionRate(value) }}</div
            >
          </div>
        </div>
      </div>

      <div class="bg-rankScroll" ref="rankScrollRef">
        <div
          class="bg-rank"
          v-for="(item, index) in rankList"
          :key="index"
          :class="{
            'bg-rank-right': Number(index) % 3 === 0,
            'bg-rank-right1 bg-rank1': Number(index) % 3 === 1
          }"
        >
          <div
            class="bg-rank-left"
            :class="{
              'bg-rank-left1': Number(index) % 3 === 1
            }"
          >
            <div class="bg-rank-left-rank">
              <img class="bg-rank-left-rank-top" src="@/assets/imgs/dataV/team/rank_top.png" />
              <div class="bg-rank-left-rank-No"> {{ index + 4 }} </div>
            </div>
            <div
              class="bg-rank-left-rankBg"
              :class="{
                'bg-rank-left-rankBg1': Number(index) % 3 === 1
              }"
            >
              <div
                v-if="type === 1 && !getCompletionRate(item)"
                class="bg-rank-left-rankBg-nameCenter"
                :class="{
                  'bg-rank-left-rankBg-nameCenter1': Number(index) % 3 === 1
                }"
                >{{ item.name }}
              </div>
              <div v-else class="bg-rank-left-rankBg-name">{{ item.name }} </div>
              <div
                v-if="type === 0 || (type === 1 && getCompletionRate(item))"
                class="bg-rank-left-rankBg-ratioValue"
                >{{ getCompletionRate(item) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ElScrollbar>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import { numberFormateShow } from '@/utils/formatter'

const props = defineProps({
  type: propTypes.number.def(0), // 0：净利完成率排行榜 1：目标净利超额排行榜
  totalPage: propTypes.number.def(1),
  dataYear: propTypes.string.def(''),
  dataMonth: propTypes.string.def(''),
  topList: propTypes.array.def([]),
  rankList: propTypes.array.def([])
})

const getCompletionRate = (value) => {
  if (props.type === 0) {
    if (
      value.completionRate === null ||
      value.completionRate === undefined ||
      value.completionRate === '' ||
      value.completionRate < 0
    ) {
      return ''
    } else {
      return value.completionRate + '%'
    }
  } else if (props.type === 1) {
    if (
      value.excessNetProfit === null ||
      value.excessNetProfit === undefined ||
      value.excessNetProfit < 0
    ) {
      return ''
    } else {
      return numberFormateShow(value.excessNetProfit)
    }
  }
  return ''
}

const page = ref(1)
const timeInterval = 1000 * 10 // 每10秒滚动下一页数据

const rankScrollRef = ref()
// 排行内容滚动
const rankContentScroll = () => {
  rankScrollRef.value.scrollTo({
    top: (page.value - 1) * 1098,
    behavior: 'smooth'
  })
  if (page.value >= 1 && page.value < props.totalPage) {
    page.value = page.value + 1
    setTimeout(() => {
      rankContentScroll()
    }, timeInterval)
  } else if (page.value === props.totalPage) {
    page.value = 1
    setTimeout(() => {
      rankContentScroll()
    }, timeInterval)
  }
}
defineExpose({ rankContentScroll })
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
    width: 370px;
    height: 52px;
  }
  &-title {
    margin-top: 22px;
    width: 848px;
    height: 123px;
  }

  &-date {
    margin-top: 14px;
    font-size: 30px;
    color: #076d6b;
    line-height: 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 848px;
    height: 30px;
    margin-right: 52px;

    &-year {
      margin-left: auto;
      padding-right: 11px;
    }
    &-icon {
      width: 20px;
      height: 20px;
    }
    &-month {
      padding-left: 11px;
    }
  }

  &-rankTop {
    margin-top: 21px;
    width: 1720px;
    height: 205px;
    display: flex;
    flex-direction: row;
    position: relative;
    .item1 {
      background-image: url('@/assets/imgs/dataV/team/rank_top_1_bg.png');
      background-size: 100% 100%;
      width: 538px;
      height: 205px;
      margin-top: 0px;
    }
    .item2 {
      background-image: url('@/assets/imgs/dataV/team/rank_top_2_bg.png');
      background-size: 100% 100%;
      width: 545px;
      height: 200px;
      margin-top: 15px;
    }
    .item3 {
      background-image: url('@/assets/imgs/dataV/team/rank_top_3_bg.png');
      background-size: 100% 100%;
      width: 545px;
      height: 200px;
      margin-top: 15px;
    }
    .item {
      display: flex;
      flex-direction: column;
      &-rankNo1 {
        position: absolute;
        width: 60px;
        height: 58px;
        margin-top: -11px;
        margin-left: -34px;
      }

      &-rankNo2 {
        position: absolute;
        width: 60px;
        height: 58px;
        margin-top: -13px;
        margin-left: -5px;
      }

      &-rankNo3 {
        position: absolute;
        width: 60px;
        height: 58px;
        margin-top: -15px;
        margin-left: 0px;
      }
      &-rank1 {
        margin-top: 22px;
        margin-left: 17px;
        width: 142px;
        height: 63px;
      }

      &-rank2 {
        margin-top: 24px;
        margin-left: 35px;
        width: 130px;
        height: 57px;
      }

      &-rank3 {
        margin-top: 26px;
        margin-left: 49px;
        width: 130px;
        height: 57px;
      }
      &-row1 {
        margin-bottom: 35px;
      }
      &-row2 {
        margin-bottom: 44px;
      }
      &-row3 {
        margin-bottom: 47px;
      }
      &-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        font-family: SourceHanSansCN, SourceHanSansCN;
        font-weight: bold;
        color: #4a6950;
        margin-top: auto;
        &-nameValue1 {
          padding-left: 39px;
          font-size: 35px;
          color: #1b564a;
        }

        &-nameValue2 {
          font-size: 32px;
          color: #4a6950;
          padding-left: 52px;
        }

        &-nameValue3 {
          font-size: 32px;
          color: #4a6950;
          padding-left: 62px;
        }
        &-ratioValue1 {
          font-size: 50px;
          color: #1b564a;
          margin-left: auto;
          padding-right: 41px;
        }

        &-ratioValue2 {
          font-size: 37px;
          color: #4a6950;
          margin-left: auto;
          padding-right: 54px;
        }

        &-ratioValue3 {
          font-size: 37px;
          color: #4a6950;
          margin-left: auto;
          padding-right: 45px;
        }
      }
    }
  }

  &-rankScroll {
    margin-top: 26px;
    width: 1686px;
    max-height: calc(522px + 30px);
    overflow: auto;
    display: flex;
    flex-wrap: wrap;
  }

  .bg-rank {
    // width: 738px;
    width: 515px;
    &-left {
      // width: 738px;
      width: 515px;
      margin-bottom: 30px;
      height: 62px;
      display: flex;
      flex-direction: row;
      align-items: center;
      &-rank {
        background-image: url('@/assets/imgs/dataV/team/normal_rank.png');
        background-size: 100% 100%;
        width: 60px;
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
      &-rankBg {
        background-image: url('@/assets/imgs/dataV/team/normal_rank_bg.png');
        background-size: 100% 100%;
        // width: 678px;
        width: 455px;
        height: 62px;
        display: flex;
        flex-direction: row;
        align-items: center;
        &-name {
          padding-left: 52px;
          font-family: SourceHanSansCN, SourceHanSansCN;
          font-weight: bold;
          font-size: 33px;
          width: 149px;
          color: #333333;
        }
        &-nameCenter {
          font-family: SourceHanSansCN, SourceHanSansCN;
          font-weight: bold;
          font-size: 33px;
          color: #333333;

          padding-left: 0px;
          // width: calc(678px);
          width: calc(455px);
          text-align: center;
        }

        &-nameCenter1 {
          width: calc(473px);
        }
        &-ratioValue {
          font-family: SourceHanSansCN, SourceHanSansCN;
          font-weight: bold;
          font-size: 45px;
          color: #333333;
        }
      }

      &-rankBg1 {
        width: 473px;
      }
    }
    &-left1 {
      width: 533px;
    }
  }
  .bg-rank-right {
    margin-right: 60px;
  }

  .bg-rank-right1 {
    margin-right: 80px;
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
