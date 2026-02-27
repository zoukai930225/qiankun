<template>
  <el-scrollbar>
    <div class="p-content">
      <div
        v-for="(item, index) in list"
        :key="item.id"
        :class="['p-content-item', !index ? 'left' : '', index === list.length - 1 ? 'right' : '']"
      >
        <div class="item-title">
          <div class="top-info">
            <div class="img-icon">
              <img
                :src="errorSvg"
                alt=""
                v-if="item.displayRedCross"
                style="width: 100%; height: 100%"
              />
              <img :src="successSvg" alt="" v-if="item.displayGreenTick" />
            </div>
            <el-popover
              :content="item.supplierName"
              placement="bottom"
              effect="dark"
              trigger="click"
            >
              <template #reference>
                <span class="item-txt">{{ item.supplierName }}</span>
              </template>
            </el-popover>
            <el-popover placement="bottom" effect="dark">
              <template #reference>
                <img :src="tipSvg" alt="" class="img-tips" style="padding-left: 4px;"/>
              </template>
              <div>
                <div style="margin-bottom: 10px">匹配原因:{{ item.matchReason }}</div>
                <div>预估报价:{{ item.matchPrice }}</div>
              </div>
            </el-popover>
          </div>
          <div class="progress">
            <div v-for="pNodes in progressNodes" class="progress-item">
              <div class="node" v-for="node in pNodes" style="display: flex; align-items: center">
                <img
                  v-if="
                    getStatus(
                      item.fabricConfirmStatus,
                      item.operateStatus,
                      item.flowStatus,
                      node.flowStatus
                    )
                  "
                  src="@/assets/imgs/oa/step_green_small.png"
                  alt=""
                  class="image"
                />
                <img v-else src="@/assets/imgs/oa/step_gray_small.png" alt="" class="image" />
                <div class="label" style="">{{ node.name }}</div>
              </div>
            </div>
          </div>
        </div>
        <div
          :style="{
            height: `${tipsHeight - 2 + (item.displayEliminationBtn || item.displayTrialResultBtn || item.displayQuotePriceBtn || item.displayFabricConfirmBtn ? 0 : 53)}px`
          }"
        >
          <el-scrollbar
            :max-height="
              tipsHeight -
              2 +
              (item.displayEliminationBtn ||
              item.displayTrialResultBtn ||
              item.displayQuotePriceBtn ||
              item.displayFabricConfirmBtn
                ? 0
                : 48)
            "
            style="margin: 10px 5px 0 5px"
          >
            <el-steps
              direction="vertical"
              class="custom-steps"
              space="200"
              :active="item.fsSupplierAuditRecordList.length"
            >
              <el-step v-for="rs in item.fsSupplierAuditRecordList" :key="rs.id">
                <template #icon>
                  <img :src="titleShow(rs, rs.flowStatus, 'icon')" alt="" class="step_icon" />
                </template>
                <template #title>
                  <div
                    class="step_title"
                    :style="{
                      color: `${titleShow(rs, rs.flowStatus, rs.operateStatus === 2 ? 'ecolor' : 'color')} !important`
                    }"
                    style="position: relative"
                  >
                    {{ titleShow(rs, rs.flowStatus) }}
                    <img
                      v-if="[5, 6].includes(rs.flowStatus)"
                      :src="delSvg"
                      alt=""
                      class="del_icon"
                      @click="delRecord(rs)"
                    />
                    <div
                      v-if="rs.flowStatus === 2"
                      style="
                        display: flex;
                        align-items: center;
                        position: absolute;
                        top: 0;
                        right: 10px;
                      "
                    >
                      <el-button
                        link
                        type="primary"
                        v-if="item.displayWithdrawBtn"
                        style="font-size: 12px"
                        @click="withdrawal(item)"
                        icon="refreshLeft"
                        >撤回</el-button
                      >
                      <div
                        style="width: 1px; height: 14px; background-color: #d8d8d8; margin: 0 12px"
                        v-if="item.displayWithdrawBtn && item.displayViewDetailBtn"
                      ></div>
                      <el-button
                        link
                        type="primary"
                        v-if="item.displayViewDetailBtn"
                        style="font-size: 12px"
                        @click="quote(item, 'view')"
                        >查看详情</el-button
                      >
                    </div>
                  </div>
                </template>
                <template #description>
                  <div class="step_desc">
                    <div class="step_user">
                      <img
                        :src="rs?.personRoster?.avatarOrigin || DefaultAvatar"
                        alt=""
                        class="user_icon"
                      />
                      {{ rs?.personRoster?.name || '--' }}
                      <span class="step_time">{{ rs?.createdAt || '' }}</span>
                    </div>
                    <div class="step_remark">{{ rs.remark }}</div>
                    <div class="step_file_list">
                      <div v-for="file in fileGet(rs)" class="file_card">
                        <div class="file_icon">
                          <el-image
                            v-if="getFileType(file, imageTypes) && file.url !== defaultImg"
                            class="img"
                            :src="file.url"
                            :preview-src-list="[file.url]"
                            fit="cover"
                            preview-teleported
                          />
                          <el-image
                            v-else-if="getFileType(file, imageTypes) && file.url === defaultImg"
                            class="img"
                            :src="defaultImg"
                            fit="cover"
                            preview-teleported
                          />
                          <el-image
                            v-else-if="getFileType(file, videoTypes)"
                            class="img"
                            :src="videoIcon"
                            fit="cover"
                            @click="openFile(file.url)"
                          />
                          <el-image
                            v-else
                            class="img"
                            :src="getFileIcon(file)"
                            fit="cover"
                            @click="openFile(file.url)"
                          />
                        </div>
                        <span class="file_name" :title="file.name">{{ file.name }}</span>
                      </div>
                    </div>
                  </div>
                </template>
              </el-step>
            </el-steps>
            <div class="center">
              <div class="add-wapper" @click="addNoticeItem(item)">
                <img src="@/assets/imgs/oa/btn-add.png" alt="" class="add-btn" />
                <span class="add-text">备注</span>
              </div>
              <div
                class="add-wapper"
                style="margin-left: 10px"
                v-if="item.displayColorCardBtn"
                @click="addColor(item)"
              >
                <img :src="linkSvg" alt="" class="add-btn" />
                <span class="add-text">色卡</span>
              </div>
            </div>
          </el-scrollbar>
        </div>
        <div
          class="bottom-btn"
          v-if="
            item.displayEliminationBtn ||
            item.displayTrialResultBtn ||
            item.displayQuotePriceBtn ||
            item.displayFabricConfirmBtn
          "
        >
          <el-button icon="Refresh" v-if="item.displayEliminationBtn" @click="disuse(item)"
            >淘汰供应商</el-button
          >
          <el-button
            icon="CircleCheck"
            @click="confirmResult(item)"
            type="primary"
            v-if="item.displayTrialResultBtn"
            >试穿结果确认</el-button
          >
          <el-button
            icon="Tickets"
            type="primary"
            v-if="item.displayQuotePriceBtn"
            @click="quote(item, 'add')"
            >报价核价</el-button
          >
          <el-button
            icon="MessageBox"
            type="primary"
            v-if="item.displayFabricConfirmBtn"
            @click="fabric(item)"
          >
            面料结果确认
          </el-button>
        </div>
      </div>
    </div>
    <add-notice ref="addNoticeRef" @success="emit('update')" />
  </el-scrollbar>
</template>

<script lang="ts" setup>
defineOptions({ name: 'ProgressSupplierStep' })

import DefaultAvatar from '@/assets/svgs/defaultAvatar.svg'
import excelSvg from '@/assets/svgs/common/file_excel.svg'
import successSvg from '@/assets/svgs/develop/success.svg'
import remarkSvg from '@/assets/svgs/develop/remark.svg'
import failedSvg from '@/assets/svgs/develop/failed.svg'
import errorSvg from '@/assets/svgs/develop/error.svg'
import docSvg from '@/assets/svgs/common/file_doc.svg'
import pdfSvg from '@/assets/svgs/common/file_pdf.svg'
import pptSvg from '@/assets/svgs/common/file_ppt.svg'
import txtSvg from '@/assets/svgs/common/file_txt.svg'
import defaultImg from '@/assets/svgs/defaultImg.svg'
import videoIcon from '@/assets/svgs/videoIcon.svg'
import linkSvg from '@/assets/svgs/develop/link.svg'
import overSvg from '@/assets/svgs/develop/over.svg'
import tipSvg from '@/assets/svgs/develop/tips.svg'
import delSvg from '@/assets/svgs/develop/del.svg'
import AddNotice from './addNotice.vue'
import request from '@/config/axios'

const addNoticeRef = ref()

const message = useMessage()

const emit = defineEmits(['update', 'quote', 'withdrawal', 'fabric'])

const props = defineProps({
  list: { type: Array<any>, default: () => [] },
  item: { type: Object, default: () => {} },
  height: { type: Number, default: 200 },
  isExpand: {type: Boolean, default: false}
})

const tipsHeight = computed(() => props.height - 128 + (props.isExpand ? -222 : 38))

const imageTypes = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg']

const videoTypes = ['mp4', 'avi', 'webm', 'mkv', 'mov']

const excelTypes = ['xls', 'xlsx', 'xlsm', 'xltm', 'csv']

const ppt‌Types = ['ppt', 'pptx', 'potx']

const getFileType = (file: any, types: Array<string>) => {
  const fileName = file.fileName || file.name
  const type = fileName?.split('.')[1]
  return types.includes(type)
}

const fileGet = (item: any) => {
  return item?.attachmentUrl
    ? item.attachmentUrl.split(',').map((ds: any) => {
        const files: any = ds.split('?name=')
        return { name: files[1].split('&')[0], url: files[0] }
      })
    : []
}

const getFileIcon = (file: any) => {
  const fileName = file.fileName || file.name
  const type = fileName?.split('.')[1]
  if (type === 'pdf') {
    return pdfSvg
  } else if (type === 'txt') {
    return txtSvg
  } else if (excelTypes.includes(type)) {
    return excelSvg
  } else if (ppt‌Types.includes(type)) {
    return pptSvg
  } else {
    return docSvg
  }
}

const openFile = (url: any) => {
  window.open(url, '_blank')
}

const addNoticeItem = (item: any) => {
  addNoticeRef?.value?.open(
    { ...item },
    { urlValue: '/workflow-api/api/workflow/business/factorySecondary/supplierInfo/addRemark' }
  )
}

const addColor = (item: any) => {
  addNoticeRef?.value?.open(
    { ...item },
    {
      titleValue: '色卡',
      urlValue: '/workflow-api/api/workflow/business/factorySecondary/supplierInfo/addColorCard'
    }
  )
}

const disuse = (item: any) => {
  addNoticeRef?.value?.open(
    { ...item },
    {
      width: 80,
      remarkValue: '淘汰原因',
      tipsValue: `淘汰供应商${item.supplierName},是否确认?`,
      urlValue:
        '/workflow-api/api/workflow/business/factorySecondary/supplierInfo/eliminateSupplier'
    }
  )
}

const confirmResult = (item: any) => {
  addNoticeRef?.value?.open(
    { ...item },
    {
      width: 80,
      urlValue:
        '/workflow-api/api/workflow/business/factorySecondary/supplierInfo/confirmPrintSampleResult'
    },
    true
  )
}

const titleShow = (item: any, value: string, name: string = 'label') => {
  const status: Array<number> = [1, 8]
  const list: any = [
    {
      label: '试穿结果',
      value: 1,
      color: '#349B34',
      ecolor: '#EB3737',
      icon: item.operateStatus === 1 ? overSvg : failedSvg
    },
    { label: '报价核价', value: 2, color: '#349B34', ecolor: '#349B34', icon: overSvg },
    { label: '已淘汰', value: 3, color: '#EB3737', ecolor: '#EB3737', icon: failedSvg },
    { label: '已淘汰确认', value: 4, color: '#EB3737', ecolor: '#EB3737', icon: failedSvg },
    { label: '备注信息', value: 5, color: '#8C8E90', ecolor: '#8C8E90', icon: remarkSvg },
    { label: '色卡信息', value: 6, color: '#349B34', ecolor: '#349B34', icon: overSvg },
    { label: '供需计划:审批拒绝', value: 7, color: '#EB3737', ecolor: '#EB3737', icon: failedSvg },
    {
      label: '面料结果',
      value: 8,
      color: '#349B34',
      ecolor: '#EB3737',
      icon: item.operateStatus === 1 ? overSvg : failedSvg
    },
    { label: '报价核价:撤回', value: 9, color: '#EB3737', ecolor: '#EB3737', icon: failedSvg }
  ]
  const statusLabel: string =
    name === 'label'
      ? status.includes(value as any)
        ? item?.operateStatus === 1
          ? '审核通过'
          : '继续调整'
        : ''
      : ''
  const tar: any = list.find((li: any) => li.value === value)
  return tar ? `${tar[name]}${statusLabel ? `:${statusLabel}` : ''}` : ''
}

const delRecord = (item: any) => {
  message.confirm('请确认是否删除?', '系统提示').then(async () => {
    request
      .get({
        url: `/workflow-api/api/workflow/business/factorySecondary/supplierInfo/${item?.flowStatus === 6 ? 'deleteColorCard' : 'deleteRemark'}/${item.id}`
      })
      .then((res: any) => {
        emit('update')
      })
  })
}

const quote = (item: any, type: string) => {
  emit('quote', {
    item,
    type
  })
}

// 面料结果确认
const fabric = (item: any) => {
  emit('fabric', item)
}

// 撤回
const withdrawal = (item: any) => {
  emit('withdrawal', item)
}

const progressNodes = ref<any[][]>([
  [
    { name: '试穿结果确认', flowStatus: 1 },
    {
      name: '面料结果确认',
      flowStatus: 3
    }
  ],
  [{ name: '报价核价', flowStatus: 2 }]
])

const getStatus = (
  fabricConfirmStatus: number,
  operateStatus: number,
  flowStatus: number,
  code: number
) => {
  if (code === 1 && operateStatus === 1) return true // 试穿样
  if (code === 3 && fabricConfirmStatus === 1) return true // 面料确认
  if (code === 2 && flowStatus === 2) return true // 报价核价
  return false
}
</script>

<style lang="scss" scoped>
.step_icon {
  width: 16px;
  height: 16px;
}

.step_title {
  // width: 100%;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  position: relative;

  .del_icon {
    width: 14px;
    position: absolute;
    right: 10px;
    top: 2px;
    cursor: pointer;
  }
}

.step_remark {
  display: block;
  margin-bottom: 10px;
  color: #333;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  word-break: break-all;
}

.step_desc {
  width: 100%;
  margin-bottom: 20px;

  .step_user {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    font-weight: 500;
    color: #333;

    .user_icon {
      margin-right: 5px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
    }
  }

  .step_time {
    margin-left: 10px;
    color: #999;
    font-size: 12px;
    font-weight: normal;
  }

  .step_file_list {
    width: 100%;

    .file_card {
      display: inline-flex;
      width: 100%;
      line-height: 16px;

      .file_icon {
        margin-right: 10px;

        .img {
          width: 16px;
          height: 16px;
          border-radius: 2px;
          box-shadow: 3px 1px 3px 0px rgba(185, 185, 185, 0.43);
          cursor: pointer;
        }
      }

      .file_name {
        cursor: pointer;
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 350px;
        height: 16px;
        line-height: 16px;
        color: #333;
      }
    }
  }
}

.custom-steps {
  :deep() {
    .el-step__line {
      background-color: transparent !important;
    }

    .el-step__line-inner {
      border: 1px dashed #e5e5e5 !important;
      height: 4px;
    }
  }
}

.p-content {
  display: flex;
  width: fit-content;
}

.p-content-item {
  border: 1px solid #e5e5e5;
  border-right: none;
  align-items: center;
  justify-content: center;
  width: 429px;
  text-align: center;
  box-sizing: border-box;
  overflow: hidden;

  .item-title {
    background: #f8f8f9;
    width: 100%;
    border-bottom: 1px solid #e6e6e6;
    // padding: 0 8px;
    .top-info {
      width: 100%;
      // width: calc(100% - 55px);
      display: inline-flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      height: 48px;
      line-height: 48px;
      font-size: 14px;
      font-weight: 500;
    }
    .progress {
      border-top: 1px solid #e5e5e5;
      box-sizing: border-box;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 5px 0;
      position: relative;
      .progress-item {
        &::after {
          content: '';
          position: absolute;
          width: 49px;
          height: 43px;
          // background-color: #e7e9f2;
          // right: 0;
          border: solid #e5e5e5 1px;
          border-left: 0;
          top: 22px;
          left: 165px;
          z-index: 0;
        }
        &::before {
          content: '';
          position: absolute;
          width: 72px;
          height: 1px;
          background-color: #e5e5e5;
          top: 44px;
          left: 215px;
          z-index: 0;
        }
        .node {
          flex: 1;
          position: relative;
          display: flex;
          // flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: #ffffff;
          padding: 6px 8px;
          border-radius: 4px;
          box-sizing: border-box;
          border: 1px solid #e5e5e5;
          margin-top: 10px;
          &:first-child {
            margin-top: 0;
          }
          .image {
            position: relative;
            z-index: 1;
            width: 12px;
            height: 12px;
          }
          .label {
            margin-left: 4px;
            // padding-top: 4px;
            font-size: 12px;
            color: #3d3d3d;
            line-height: 20px;
          }
          // &:first-of-type {
          //   &::before {
          //     display: none;
          //   }
          // }
          // &:last-of-type {
          //   &::after {
          //     display: none;
          //   }
          // }
          // &::before {
          //   content: '';
          //   position: absolute;
          //   width: calc(50% - 10px);
          //   height: 1px;
          //   background-color: #e7e9f2;
          //   left: 0;
          //   top: 6px;
          //   z-index: 0;
          // }
        }
      }
    }

    .item-txt {
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;

      .img-tips {
        width: 14px;
        height: 14px;
        margin-left: 8px;
        cursor: pointer;
      }
    }

    .img-icon {
      width: 20px;
      height: 20px;
      margin-right: 10px;
      align-items: center;
      line-height: 20px;
      margin-left: 10px;
    }
  }

  .bottom-btn {
    height: 52px;
    line-height: 52px;
    border-top: 1px dashed #e5e5e5;
    :deep() {
      .el-button {
        padding: 8px 13px;
      }
    }
  }

  .center {
    text-align: center;
    display: block;
    padding: 10px 0;
    width: 100%;
  }

  .add-wapper {
    display: inline-flex;
    width: 68px;
    align-items: center;
    cursor: pointer;
    border-radius: 4px;
    border: 1px solid #0064ff;
    padding: 5px 10px;
    box-sizing: border-box;

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
}

.left {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

.right {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-right: 1px solid #e5e5e5;
}
</style>
