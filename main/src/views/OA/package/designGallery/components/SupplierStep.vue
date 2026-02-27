<!--
 * @Date: 2025-07-21 15:25:30
 package
-->
<template>
  <div
    class="supplier-step"
    :style="{
      borderRadius: stepBorderRadius(),
      borderLeft: stepBorderLeft(),
      borderRight: stepBorderRight(),
      width: stepWidth()
    }"
  >
    <div class="step-header">
      <img
        src="@/assets/imgs/oa/tongguo.png"
        alt=""
        v-if="item.displayGreenTick"
        class="img-icon"
      />
      <img
        src="@/assets/imgs/oa/taotai-icon.png"
        v-if="item.displayRedCross"
        alt=""
        class="img-icon"
      />
      <span
        :style="{
          marginLeft: item.displayGreenTick || item.displayRedCross ? '' : 'auto',
          marginRight: item.supplierId != '999' ? '' : 'auto'
        }"
      >
        {{ title }}</span
      >
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

    <ElScrollbar>
      <div
        class="step-content"
        :class="{
          'step-content1':
            item.displayEliminationBtn ||
            item.displayTrialResultBtn ||
            item.displayQuotePriceBtn ||
            item.displayColorSampleBtn
        }"
      >
        <div
          class="line-wapper"
          :style="{ paddingBottom: item?.npSupplierAuditRecordList?.length > 0 ? '10px' : '' }"
        >
          <div v-for="(step, stepIndex) in item?.npSupplierAuditRecordList" :key="step.id">
            <SupplierStepItem
              :item="step"
              :count="item?.npSupplierAuditRecordList.length"
              :isLast="stepIndex === item?.npSupplierAuditRecordList.length - 1 && stepIndex > 0"
              @success="stepItemSuccess"
            />
          </div>
          <!-- add -btn -->
          <div class="row-center">
            <div class="add-wapper" @click="addNotice">
              <img src="@/assets/imgs/oa/btn-add.png" alt="" class="add-btn" />
              <span class="add-text">备注</span>
            </div>
          </div>
        </div>
      </div>
    </ElScrollbar>

    <!-- <div class="step-content">
      <div
        class="line-wapper"
        :style="{
          borderLeft: item?.npSupplierAuditRecordList?.length > 0 ? '1px solid #ced8f0' : 'none'
        }"
      >
        <div v-for="(step, index) in item?.npSupplierAuditRecordList" :key="step.id">
          <div
            class="step-one flex-row"
            v-if="step.flowStatus == '5'"
            style="align-items: flex-start"
          >
            <img src="@/assets/imgs/oa/address.png" alt="" class="address" v-show="index == 0" />
            <div class="step-content-text" style="margin-left: 30px">
              <div> {{ step.remark }}</div>
              <div v-for="(imgItem, imgIndex) in formatImg(step.attachmentUrl)" :key="imgIndex">
                <el-image
                  v-if="imgItem.url"
                  :src="imgItem.url"
                  class="notice-img"
                  style="width: 64px; height: 64px"
                  :zoom-rate="1.2"
                  :max-scale="7"
                  :min-scale="0.2"
                  :preview-src-list="formatImg(step.attachmentUrl).map((img) => img.url)"
                  show-progress
                  :initial-index="imgIndex"
                  fit="cover"
                />
              </div>
              <div v-for="(fileItem, fileIndex) in formatFile(step.attachmentUrl)" :key="fileIndex">
                <a :href="fileItem.url">{{ fileItem.name }}</a>
              </div>
              <img
                src="@/assets/imgs/oa/del-activity.png"
                alt=""
                class="del-icon del-activity"
                @click="delRemark(step.id)"
              />
              <img
                src="@/assets/imgs/oa/del-normal.png"
                class="del-icon del-normal"
                alt=""
                @click="delRemark(step.id)"
              />
            </div>
          </div>
          <div
            class="time flex-row"
            v-if="step.flowStatus == '5'"
            style="margin-bottom: 20px; align-items: center; margin-left: 20px"
          >
            <img src="@/assets/imgs/oa/time-icon.png" alt="" class="time-icon" />
            <span class="time-text">{{ step.createdAt }}</span>
          </div>

          <div
            class="step-one flex-row ml-common"
            style="align-items: flex-start"
            v-if="
              (step.flowStatus == '1' && [1, 2, 3].includes(step.operateStatus)) ||
              step.flowStatus == 3
            "
          >
            <div class="connon-lf">{{ formatTitle(step) }}</div>
            <div>
              <div class="step-content-text error-content error-color">
                <div v-for="(imgItem, imgIndex) in formatImg(step.attachmentUrl)" :key="imgIndex">
                  <el-image
                    :src="imgItem.url"
                    class="notice-img"
                    style="width: 64px; height: 64px"
                    :zoom-rate="1.2"
                    :max-scale="7"
                    :min-scale="0.2"
                    :preview-src-list="formatImg(step.attachmentUrl).map((img) => img.url)"
                    show-progress
                    :initial-index="imgIndex"
                    fit="cover"
                  />
                </div>
                <span>{{ step.remark }}</span>
                <div
                  v-for="(fileItem, fileIndex) in formatFile(step.attachmentUrl)"
                  :key="fileIndex"
                >
                  <a :href="fileItem.url">{{ fileItem.name }}</a>
                </div>
              </div>

              <div
                style="margin-bottom: 20px; align-items: center"
                class="time flex-row error-time"
                v-if="
                  (step.flowStatus == '1' && [1, 2, 3].includes(step.operateStatus)) ||
                  step.flowStatus == '4'
                "
              >
                <img src="@/assets/imgs/oa/error-time-icon.png" alt="" class="time-icon" />
                <span class="time-text error-color">{{ step.createdAt }}</span>
              </div>
            </div>
          </div>

          <div
            class="step-one flex-row ml-common"
            style="align-items: flex-start"
            v-if="
              (step.flowStatus == 1 && step.operateStatus == 4) || [2].includes(step.flowStatus)
            "
          >
            <div class="connon-lf pass">{{ formatSuccessTitle(step) }}</div>
            <div>
              <div class="step-content-text error-content pass-content">
                <span class="err-title pass-title">{{ formatTitleByStep(step) }}</span>

                <div
                  v-for="(imgItem, imgIndex) in formatImg(
                    step.attachmentUrl || step.quotationSheetFile
                  )"
                  :key="imgIndex"
                >
                  <el-image
                    :src="imgItem.url"
                    class="notice-img"
                    style="width: 64px; height: 64px"
                    :zoom-rate="1.2"
                    :max-scale="7"
                    :min-scale="0.2"
                    :preview-src-list="
                      formatImg(step.attachmentUrl || step.quotationSheetFile).map((img) => img.url)
                    "
                    show-progress
                    :initial-index="4"
                    fit="cover"
                  />
                </div>
                <span>{{ step.remark }}</span>
                <div
                  v-for="(fileItem, fileIndex) in formatFile(
                    step.attachmentUrl || step.quotationSheetFile
                  )"
                  :key="fileIndex"
                >
                  <a :href="fileItem.url">{{ fileItem.name }}</a>
                </div>
              </div>

              <div
                class="time flex-row pass-time"
                style="margin-bottom: 20px; align-items: center"
                v-if="
                  (step.flowStatus == '1' && step.operateStatus == 4) ||
                  [2, 3].includes(step.flowStatus)
                "
              >
                <img src="@/assets/imgs/oa/pass-time-icon.png" alt="" class="time-icon" />
                <span class="time-text error-color pass-color">{{ step.createdAt }}</span>
              </div>
            </div>
          </div>

          <div
            class="step-one flex-row ml-common"
            v-if="step.flowStatus == '4'"
            style="margin-bottom: 10px; background: white; margin-left: 20px"
          >
            <img
              :src="step.eliminateConfirmUserAvatar"
              alt=""
              style="border-radius: 50%; width: 16px; height: 16px; background: white"
            />
            <div class="step-content-text flex-row shenhe-wapper" style="background: white">
              <span class="shenhe-title">{{ step.eliminateConfirmUserName }}</span>
              <span class="shenhe-btn" style="color: #eb3737">已淘汰确认</span>
              <div class="last-miss"></div>
            </div>
          </div>
        </div>

        <div class="add-wapper" @click="addNotice">
          <img src="@/assets/imgs/oa/btn-add.png" alt="" class="add-btn" />
          <span class="add-text">备注</span>
        </div>
      </div>
    </div> -->
    <div class="step-footer">
      <slot name="footer"></slot>
    </div>

    <AddNotice ref="addNoticeRef" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps } from 'vue'
import AddNotice from './progressDialogComponents/addNotice.vue'
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
  }
})

const stepItemSuccess = () => {
  emit('success')
}

// const formatTitle = (item) => {
//   const state = item.operateStatus

//   if (item.flowStatus == '4' || item.flowStatus == '3') {
//     return `已淘汰${item.flowStatus == '4' ? '确认' : ''}`
//   }

//   const titles = {
//     1: '打样问题',
//     2: '设计稿问题',
//     3: '工厂问题'
//   }
//   return titles[state]
// }

// const formatImg = (attachmentUrl) => {
//   if (!attachmentUrl) return []
//   return attachmentUrl
//     .split(',')
//     .map((item) => {
//       return {
//         url: item,
//         name: item.split('?')[1] // 获取文件名
//       }
//     })
//     .filter((item) => {
//       return (
//         (item.name &&
//           (item.name.endsWith('.jpg') ||
//             item.name.endsWith('.png') ||
//             item.name.endsWith('.jpeg'))) ||
//         (item.url &&
//           (item.url.endsWith('.jpg') || item.url.endsWith('.png') || item.url.endsWith('.jpeg')))
//       )
//     })
// }

// const formatFile = (attachmentUrl) => {
//   if (!attachmentUrl) return []

//   // 只要文件不要图片
//   return attachmentUrl
//     .split(',')
//     .map((item) => {
//       return {
//         url: item,
//         name: item?.split('?')[1]?.split('=')[1] // 获取文件名
//       }
//     })
//     .filter((item) => {
//       return (
//         item.name &&
//         !(item.name.endsWith('.jpg') || item.name.endsWith('.png') || item.name.endsWith('.jpeg'))
//       )
//     })
// }

// const formatSuccessTitle = (step) => {
//   if (step.flowStatus == '1' && step.operateStatus == 4) {
//     return '审核通过'
//   } else if (step.flowStatus == '2') {
//     return '报价核价'
//   } else if (step.flowStatus == '3') {
//     return '已淘汰'
//   } else if (step.flowStatus == '4') {
//     return '已淘汰确认'
//   }
//   return ''
// }

// const formatTitleByStep = (step) => {
//   if (step.flowStatus == '1' && step.operateStatus == 4) {
//     return '打样结果：通过'
//   } else if (step.flowStatus == '2') {
//     return `报价核实：报价为 ${step.physicalQuotePrice} 元`
//   } else if (step.flowStatus == '3') {
//     return `已淘汰`
//   } else if (step.flowStatus == '4') {
//     return '已淘汰确认'
//   }
//   return ''
// }

const emit = defineEmits(['close', 'success'])

// const delRemark = async (id) => {
//   try {
//     // 二次确认删除逻辑
//     await message.confirm('是否确认删除该备注？', '系统提示')
//     // 调用删除接口
//     await deleteRemark(id)
//     emit('success')
//   } catch (error) {
//     console.error('删除备注失败', error)
//   }
// }

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

const stepWidth = () => {
  if (props.total === 1) {
    return '860px'
  } else if (props.total === 2) {
    return '428px'
  } else {
    return '286px'
  }
}

const addNoticeRef = ref()
const addNotice = () => {
  // 这里可以添加备注的逻辑
  addNoticeRef.value.open({
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

<style scoped>
.supplier-step {
  border: 1px solid #e5e5e5;
  border-left: 0.5px solid #e5e5e5;
  border-right: 0.5px solid #e5e5e5;
  border-radius: 6px;
  background: #ffffff;

  box-sizing: border-box;

  .step-header {
    width: calc(100%);
    height: 48px;
    background: #f8f8f9;
    box-sizing: border-box;
    border-bottom: 1px solid #e5e5e5;

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

    .img-icon {
      width: 20px;
      height: 20px;
      margin-right: 10px;
      align-items: center;
      margin-left: auto;
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

  .step-content {
    margin-right: 8px;
    padding: 16px 10px;
    box-sizing: border-box;
    max-height: calc(100vh - 506px);

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
  .step-content1 {
    max-height: calc(100vh - 546px);
  }

  .ml-common {
    margin-top: 20px;
  }

  .time {
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
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
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
  width: 68px;
  align-items: center;
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid #0064ff;
  padding: 5px 10px;
  box-sizing: border-box;
  margin-left: 20px;

  .add-btn {
    width: 12px;
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
