<!--
 * @Date: 2024-10-14 10:19:55
-->
<template>
  <div class="singleChoice" :class="whiteBg ? 'whiteBg' : 'otherBg'">
    <div class="title-wapper">
      <div class="title"
        >{{ currentIndex + 1 }}、{{ detailInfo?.otrProgramDto?.name || detailInfo?.name }}</div
      >
      <!-- <img src="@/assets/imgs/common/wenhao.png" class="icon" /> -->
      <div class="desc">{{ detailInfo?.otrProgramDto?.definition || detailInfo?.definition }}</div>
    </div>
    <div class="content">
      <!-- 正常 -->
      <div v-if="!isSpecial">
        <div class="content-item" v-for="item in detailInfo?.programRankList" :key="item.id">
          <span class="item-title">{{ item?.name }} ({{ item.minScore }}~{{ item.maxScore }})</span>
          <span class="item-desc">{{ item?.description }}</span>
        </div>
      </div>

      <div class="mid"></div>
      <div class="choice-wapper">
        <div class="recort" v-if="!isSpecial">
          <div class="title-label-width"></div>
        </div>
        <div v-if="!review">
          <div v-if="isSpecial">
            <div
              class="recort recort-item"
              v-for="(item, index) in answerList"
              :key="index"
              style="padding-bottom: 16px; box-sizing: border-box"
            >
              <el-rate
                size="large"
                :max="5"
                v-model="item.choiceValue"
                @change="handleChange"
                allow-half
              />
            </div>
          </div>
          <div v-if="!isSpecial">
            <div class="recort recort-item" v-for="(item, index) in answerList" :key="index">
              <div class="title-label-width">{{ isSpecial ? '分数' : item.name }}</div>
              <div class="radio-wapper" style="display: flex">
                <el-slider
                  v-model="item.choiceValue"
                  @change="handleChange"
                  show-input
                  size="small"
                  :max="getMaxScore(detailInfo?.programRankList)"
                  :min="getMinScore(detailInfo?.programRankList)"
                />
                <!-- <div
                  v-for="ite in detailInfo?.programRankList"
                  :key="ite.id"
                  style="display: flex"
                  class="group-wapper"
                >
                  <div class="desc">{{ ite.name }}:</div>
                  <el-radio-group v-model="item.choiceValue" @change="handleChange">
                    <el-radio :value="it" v-for="it in formatList(ite)" :key="it">{{it}}</el-radio>
                  </el-radio-group>
                </div> -->
              </div>
            </div>
          </div>
        </div>
        <!-- 预览 -->
        <div v-else>
          <div class="recort" v-for="(item, index) in 2" :key="index">
            <div class="title-label-width">被评价人{{ index + 1 }}</div>
            <div class="radio-wapper" style="display: flex">
              <el-slider show-input size="small" />
              <!-- <div
                v-for="ite in detailInfo?.programRankList"
                :key="ite.id"
                style="display: flex"
                class="group-wapper"
              >
                <div class="desc">{{ ite.name }}:</div>
                <el-radio-group>
                  <el-radio :value="it" v-for="it in formatList(ite)" :key="it">{{ it }}</el-radio>
                </el-radio-group>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { cloneDeep } from 'lodash-es'

const props = defineProps({
  detail: {
    type: Object,
    default: () => {}
  },

  currentIndex: {
    type: Number,
    default: 0
  },
  whiteBg: {
    type: Boolean,
    default: false
  },
  review: {
    type: Boolean,
    default: false
  },
  isSpecial: {
    type: Boolean,
    default: false
  }
})

const detailInfo = ref()

const answerList = ref()

watch(
  () => props.detail,
  (newValue) => {
    detailInfo.value = newValue
    answerList.value = cloneDeep(newValue.appraiseeList)
  },
  {
    deep: true,
    immediate: true
  }
)

const formatList = (item) => {
  const arr: any = []
  const step = item.maxScore - item.minScore
  for (let i = 0; i <= step; i++) {
    arr.push(`${item.minScore + i}`)
  }
  return arr
}

// 计算分数最大值 最小值
const getMaxScore = (arr: any) => {
  return arr[arr.length - 1].maxScore
}
const getMinScore = (arr: any) => {
  return arr[0].minScore
}

const emit = defineEmits(['change'])

const handleChange = () => {
  detailInfo.value.appraiseeList = answerList.value
  emit('change', props.currentIndex, detailInfo.value)
}
</script>

<style lang="scss" scoped>
.otherBg {
  background: linear-gradient(180deg, #f1f3fc 0%, #f7f9ff 100%);
  cursor: pointer;
  .content {
    padding: 18px 20px 15px 20px;
  }
}
.whiteBg {
  background: white;
}
.singleChoice {
  width: 100%;

  border-radius: 10px;
  padding: 12px 20px 18px 18px;
  box-sizing: border-box;

  .title-wapper {
    display: flex;
    flex-direction: column;
    margin-bottom: 32px;
    .title {
      display: inline-block;
      font-weight: 500;
      font-size: 16px;
      color: #333;
      // max-width: 200px;
    }
    .icon {
      width: 14px;
      height: 14px;
      margin: 3px 3px 0 10px;
    }

    .desc {
      // flex: 1;
      font-weight: 400;
      font-size: 14px;
      color: #999;
    }
  }
  .content {
    width: 100%;
    // padding: 18px 20px 15px 20px;
    box-sizing: border-box;
    background: #ffffff;
    border-radius: 10px;
    .content-item {
      display: flex;
      flex-direction: row;
      margin-bottom: 32px;
      width: 100%;
      // height: 81.5px;
      padding: 16px 8px;
      border-radius: 4px;
      background: #f8f8fa;
      box-sizing: border-box;
      border: 1px solid #599aff;
      position: relative;
      .item-title {
        position: absolute;
        top: -15px;
        // width: 90px;
        height: 28px;
        padding: 0 24px;
        line-height: 28px;
        font-size: 14px;
        background: linear-gradient(180deg, #0064ff 0%, #6967fe 100%);
        border-radius: 28px;
        color: #fff;
        // margin-right: 20px;
      }

      .item-desc {
        flex: 1;
        font-weight: 400;
        font-size: 14px;
        color: #333333;
        // background: #f1f3fc;
        border-radius: 4px;
        padding: 5px;
        box-sizing: border-box;
      }
    }

    .mid {
      width: 100%;
      border-bottom: 1px solid #e7e8ee;
      margin-top: 11px;
      // margin-bottom: 15px;
    }
    .choice-wapper {
      // margin-top: 16px;
      .recort-item {
        // border-bottom: 1px dashed #e2e2e2;
        // margin-bottom: 26px;
      }
      .recort-item:last-child {
        margin-bottom: 0;
      }
      .recort {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 26px;
        .mid-title {
          width: 100px;
        }
        .mid {
          width: 100%;
          border-bottom: 1px dashed #e7e8ee;
          margin: 16px 0;
        }
      }

      :deep(.el-input-number) {
        width: 90px;
      }
    }
  }
}
.flex-row {
  display: flex;
  flex-direction: row;
}
.title-label-width {
  // width: 150px;
  // margin-bottom: 10px;
  margin-right: 16px;
}
.radio-wapper {
  // padding-left: 10px;
  box-sizing: border-box;
  flex-wrap: wrap !important;
  flex: 1;
  .group-wapper {
    // flex: 1;
    // background: transparent !important;
    width: 100%;
    overflow-x: auto;
    margin-bottom: 10px;
    padding: 0 5px;
    box-sizing: border-box;
    margin-right: 5px;
    .desc {
      // min-width: 50px;
      text-align: right;
      font-weight: 400;
      font-size: 13px;
      color: #333333;
      line-height: 32px;
      margin-right: 5px;
    }
  }
}

:deep(.el-radio-group) {
  display: flex !important;
  flex-direction: row !important;
  flex-wrap: nowrap;
  margin: 0 8px !important;
  border-radius: 2px !important;
}
:deep(.recort-item .el-rate .el-rate__item) {
  margin-right: 34px;
}

:deep(.recort-item .el-rate .el-rate__item .el-icon svg) {
  width: 32px !important;
  height: 32px !important;
}

:deep(.recort-item .el-rate .el-rate__item.hover) {
  transform: scale(1) !important;
}

:deep(.recort-item .el-rate .el-rate__item .el-icon .el-rate__decimal) {
  width: 16px !important;
  height: 32px !important;
}
</style>
