<!--
 * @Date: 2025-07-21 15:25:30
-->
<template>
  <div class="supplier-step" :style="{
    borderRadius: stepBorderRadius(),
    borderLeft: stepBorderLeft(),
    borderRight: stepBorderRight(),
    width: stepWidth()
  }">
    <div class="step-header">
      <img src="@/assets/imgs/oa/tongguo.png" alt="" v-if="item.displayGreenTick" class="img-icon" />
      <img src="@/assets/imgs/oa/taotai-icon.png" v-if="item.displayRedCross" alt="" class="img-icon" />
      <span :style="{
        marginLeft: item.displayGreenTick || item.displayRedCross ? '' : 'auto',
        marginRight: item.supplierId != '999' ? '' : 'auto'
      }">
        {{ title }}</span>
      <el-tooltip placement="right" v-if="item.supplierId != '999'">
        <template #content>
          <div>
            <div class="flex-row tip-wapper" style="width: 300px">
              <span class="tip-title">匹配原因</span>
              <span class="tip-title">预估报价</span>
            </div>
            <div class="flex-row tip-wapper" style="width: 300px">
              <span class="tip-value tip-desc">{{ item.matchReason }}</span>
              <span class="tip-value">{{ item.matchPrice }}</span>
            </div>
          </div>
        </template>
        <img src="@/assets/imgs/oa/more-icon.png" alt="" class="more-icon" />
      </el-tooltip>
    </div>
    <div class="step-progress" style="">
      <div class="step-progress-line"></div>
      <div class="step-progress-item" v-for="(value, index) in stepPrgressList" :key="index">
        <div style="display: flex;flex-direction:column;justify-content: center;align-items: center;">
          <template v-if="value.name">
            <img v-if="getStepProgressStatus(index)" src="@/assets/imgs/oa/step_green_small.png"
              style="width: 12px; height: 12px" />
            <img v-if="!getStepProgressStatus(index)" src="@/assets/imgs/oa/step_gray_small.png"
              style="width: 12px; height: 12px" />
            <div style="font-size: 12px; line-height: 20px; padding-top: 2px; padding-bottom: 7px">{{
              value.name
              }}</div>
          </template>
        </div>
      </div>
    </div>
    <ElScrollbar>
      <div class="step-content" :class="{
        'step-content1':
          isShowBottomBtn(item) &&
          showMore,
        'step-content2': !isShowBottomBtn(item) &&
          showMore,
        'step-content-hidden': !isShowBottomBtn(item) &&
          !showMore,
        'step-content1-hidden':
          isShowBottomBtn(item) &&
          !showMore
      }">
        <div class="line-wapper" :style="{ paddingBottom: item?.npSupplierAuditRecordList?.length > 0 ? '10px' : '' }">
          <!-- :style="{
          borderLeft: item?.npSupplierAuditRecordList?.length > 0 ? '1px dashed #E5E5E5' : 'none'
        }" -->
          <div v-for="(step, stepIndex) in item?.npSupplierAuditRecordList" :key="step.id">
            <SupplierStepItem :item="step" :count="item?.npSupplierAuditRecordList.length"
              :isLast="stepIndex === item?.npSupplierAuditRecordList.length - 1 && stepIndex > 0"
              @success="stepItemSuccess" />
          </div>
          <!-- add -btn -->
          <div class="row-center">
            <div class="add-wapper" @click="addNotice">
              <img src="@/assets/imgs/oa/btn-add.png" alt="" class="add-btn" />
              <span class="add-text">备注/上传</span>
            </div>
            <div class="add-wapper" style="margin-left: 10px" @click="addColorCard" v-if="item.supplierId != '999' && productType !== '0'">
              <img src="@/assets/imgs/oa/btn-add.png" alt="" class="add-btn" />
              <span class="add-text">色卡</span>
            </div>
          </div>
        </div>
      </div>
    </ElScrollbar>

    <div class="step-footer">
      <slot name="footer"></slot>
    </div>

    <AddNotice ref="addNoticeRef" @success="handleSuccess" />
    <AddColorCard ref="addColorCardRef" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps } from 'vue'
import AddNotice from './progressDialogComponents/addNotice.vue'
import AddColorCard from './progressDialogComponents/addColorCard.vue'

import SupplierStepItem from './SupplierStepItem.vue'

const message = useMessage() // 消息弹窗

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  showClose: {
    type: Boolean,
    default: false
  },
  showMore: {
    type: Boolean,
    default: false
  },
  item: {
    type: Object,
    default: () => ({})
  },
  pictureId: {
    type: Number
  },
  index: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  },
  productType: {
    type: String,
    default: 0
  }
})

const stepWidth = () => {
  if (props.total === 1) {
    return '860px'
  } else if (props.total === 2) {
    return '428px'
  } else {
    return '286px'
  }
}
const stepBorderRadius = () => {
  if (props.total === 1) {
    return '6px'
  }
  if (props.index === 0) {
    return '6px 0px 0px 6px'
  }
  if (props.index === props.total - 1) {
    return '0px 6px 6px 0px'
  }
  return '0px'
}

const stepBorderLeft = () => {
  if (props.total === 1) {
    return '1px solid #e5e5e5'
  }
  if (props.index === 0) {
    return '1px solid #e5e5e5'
  }
  if (props.index === props.total - 1) {
    return '0.5px solid #e5e5e5'
  }
  return '0.5px solid #e5e5e5'
}
const stepBorderRight = () => {
  if (props.total === 1) {
    return '1px solid #e5e5e5'
  }
  if (props.index === 0) {
    return '0.5px solid #e5e5e5'
  }
  if (props.index === props.total - 1) {
    return '1px solid #e5e5e5'
  }
  return '0.5px solid #e5e5e5'
}

const emit = defineEmits(['close', 'success'])

const stepItemSuccess = () => {
  emit('success')
}

// const stepPrgressList = ref([
//   {
//     name: '试穿样'
//   },
//   {
//     name: '报价核价'
//   },
//   {
//     name: '齐色样'
//   },
//   {
//     name: 'QA'
//   },
//   {
//     name: '色卡'
//   }
// ])

const stepList = [[
  {
    name: '试穿样'
  },
  {},
  {
    name: '报价核价'
  },
  {},
  {
    name: 'QA'
  },
], [
  {
    name: '试穿样'
  },
  {
    name: '报价核价'
  },
  {
    name: '齐色样'
  },
  {
    name: 'QA'
  },
  {
    name: '色卡'
  }
]]

const stepPrgressList = computed(() => {
  return stepList[props.productType]
})

const isShowBottomBtn = (item) => {
  if (item.displayEliminationBtn ||
    item.displayTrialResultBtn ||
    item.displayQuotePriceBtn ||
    item.displayColorSampleBtn ||
    item.displayQaExamineBtn ||
    item.displayReUploadBtn) {
    return true
  }
  return false
}
const getStepProgressStatus = (index) => {
  if(props.productType === '0') {
    if (index == 0) {
      return props.item.finishedTrialResult ? true : false
    } else if(index == 2) {
      return props.item.finishedQuotePrice ? true : false
    } else if(index == 4) {
      return props.item.finishedQaExamine ? true : false
    }
    return false
  }
  if (index == 0) {
    return props.item.finishedTrialResult ? true : false
  } else if (index == 1) {
    return props.item.finishedQuotePrice ? true : false
  } else if (index == 2) {
    return props.item.finishedColorSample ? true : false
  } else if (index == 3) {
    return props.item.finishedQaExamine ? true : false
  } else if (index == 4) {
    return props.item.finishedColorCard ? true : false
  }
  return false
}

const addNoticeRef = ref()
const addNotice = () => {
  // 这里可以添加备注的逻辑
  addNoticeRef.value.open({
    ...props.item,
    pictureId: props.pictureId
  })
}

const addColorCardRef = ref()

const addColorCard = () => {
  addColorCardRef.value.open({
    ...props.item,
    pictureId: props.pictureId
  })
}

const handleSuccess = () => {
  emit('success')
}

const handleClose = () => {
  emit('close')
}
</script>

<style lang="scss" scoped>
.supplier-step {
  border: 1px solid #e5e5e5;
  border-left: 0.5px solid #e5e5e5;
  border-right: 0.5px solid #e5e5e5;
  border-radius: 6px;
  background: #ffffff;

  box-sizing: border-box;

  .step-header {
    /* width: 284px; */
    width: calc(100%);
    height: 48px;
    background: #f8f8f9;
    box-sizing: border-box;

    /* border: 1px solid #e6e6e6; */
    border-radius: 6px 6px 0 0;
    text-align: center;
    line-height: 16px;
    font-size: 14px;
    font-weight: 500;
    color: #3d3d3d;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 4px;
    padding-right: 4px;

    .img-icon {
      /* position: absolute; */
      width: 20px;
      height: 20px;
      margin-right: 10px;
      align-items: center;
      margin-left: auto;
      /* top: 6px;
      right: 24px; */
    }

    .more-icon {
      cursor: pointer;
      margin-right: auto;
      margin-top: -2px;
      width: 12px;
      height: 12px;
      margin-left: 10px;
      transform: translateY(1px);
    }
  }

  .step-progress {
    background: #f8f8f9;
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid #e5e5e5;
    position: relative;
    justify-content: space-around;
    padding: 0 10px;

    .step-progress-line {
      background: #e7e9f2;
      height: 1px;
      margin-left: calc(10% - 7px);
      margin-right: calc(10% - 7px);
      width: calc(75% - 0px);
      position: absolute;
      top: 10px;
    }

    .step-progress-item {
      z-index: 9;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 4px;
      flex: 1;
    }
  }

  .step-content {
    margin-right: 8px;
    padding: 16px 10px;
    box-sizing: border-box;
    /* overflow: auto; */
    max-height: calc(100vh - 510px - 70px);

    .line-wapper {
      position: relative;

      .start-none {
        position: absolute;
        width: 1px;
        height: 12px;
        background: white;
        left: -1px;
        top: 0;
      }

      .step-one {
        margin-left: -8px;
        position: relative;

        .notice-img {
          width: 64px;
          height: 64px;
          margin-right: 8px;
        }

        .address {
          width: 16px;
          height: 16px;
          margin-right: 12px;
          position: absolute;
          left: 0;
          top: 0;
        }

        .step-content-text {
          width: 225px;
          background: #f6f6f6;
          position: relative;
          padding: 10px 12px;
          box-sizing: border-box;
          color: #333333;
          font-size: 14px;
          cursor: pointer;

          .del-icon {
            width: 14px;
            height: 14px;
            position: absolute;
            top: 13px;
            right: 10px;
            cursor: pointer;
          }

          .del-activity {
            display: none;
          }

          .del-normal {
            display: block;
          }
        }

        .step-content-text:hover .del-normal {
          display: none;
        }

        .step-content-text:hover .del-activity {
          display: block;
        }

        .error-content {
          display: flex;
          flex-direction: column;
          background: #ffefef;
          color: #333333;

          .err-title {
            color: #eb3737;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 6px;
          }

          .pass-title {
            color: #349b34;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 6px;
          }
        }

        .pass-content {
          background: #eff7ef;
        }

        .shenhe-wapper {
          background: white;
          padding-left: 0;
          position: relative;

          .shenhe-title {
            color: #333333;
            font-size: 14px;
            margin-right: 20px;
          }

          .shenhe-btn {
            color: #349b34;
            font-size: 14px;
          }

          .last-miss {
            position: absolute;
            left: -21px;
            bottom: -38px;
            width: 1px;
            height: 50px;
            background: white;
          }
        }
      }

      .notice {
        margin-top: 24px;
        margin-left: 20px;

        .notice-img {
          width: 64px;
          height: 64px;
        }
      }
    }
  }

  .step-content-hidden {
    max-height: calc(100vh - 470px - 70px + 150px);
  }



  .step-content1 {
    max-height: calc(100vh - 510px - 70px);
  }

  .step-content2 {
    max-height: calc(100vh - 470px - 70px);
  }

  .step-content1-hidden {
    max-height: calc(100vh - 510px - 70px + 150px);
  }

  .ml-common {
    margin-top: 20px;
  }

  .time {
    /* margin-left: 20px; */
    display: inline-flex;
    margin-top: 4px;
    background: #f6f6f6;
    padding: 4px;
    box-sizing: border-box;
    border-radius: 2px;

    .time-icon {
      width: 12px;
      height: 12px;
      margin-right: 6px;
    }

    .time-text {
      color: #333333;
      font-size: 12px;
    }

    .error-color {
      color: #eb3737;
    }

    .pass-color {
      color: #349b34;
    }
  }

  .pass-time {
    background: #eff7ef;
  }

  .error-time {
    background: #ffefef;
  }

  .step-footer {
    /* padding: 10px; */
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    /* border-top: 1px dashed #cdcdcd; */
  }
}

.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.connon-lf {
  width: 22px;
  border-radius: 2px;
  color: #ffffff;
  font-size: 14px;
  background: #eb3737;
  text-align: center;
  margin-right: 8px;
}

.pass {
  background: #349b34;
}

.error-color {
  background: #ffefef;
}

.pass-color {
  background: #eff7ef;
}

.add-wapper {
  display: flex;
  /* width: 68px; */
  align-items: center;
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid #0064ff;
  padding: 5px 10px;
  box-sizing: border-box;
  margin-left: 20px;

  .add-btn {
    /* width: 12px; */
    height: 12px;
  }

  .add-text {
    color: #0064ff;
    font-size: 14px;
    margin-left: 4px;
  }
}

.tip-wapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  .tip-title {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
  }

  .tip-value {
    color: #ffffff;
    font-size: 12px;
    font-size: 14px;
  }

  .tip-desc {
    word-break: break-all;
    width: 170px;
  }
}
</style>
