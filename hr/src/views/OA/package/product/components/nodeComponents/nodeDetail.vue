<template>
  <div class="popver-main">
    <!--  节点状态 status(0-未开始,1-已结束,2-淘汰 3-进行中) -->
    <div
      :class="[
        'popver-status',
        tab.status !== '2' ? 'status-normal' : 'status-red',
        tab.status == 'future' ? 'status-gray' : '',
        tab.status == 'Completed' && tab.finishStatus && tab.finishStatus == '延期'
          ? 'status-red'
          : ''
      ]"
    >
      <img
        style="width: 18px; height: 18px"
        v-if="tab.status != 'Completed'"
        :src="getDotImg(tab.status, tab.nodeCode, nodeList)"
        alt=""
      />
      <img
        class="endStatus"
        v-else-if="tab.status == 'Completed' && tab.finishStatus && tab.finishStatus == '正常'"
        src="@/assets/imgs/oa/node/node_endStatus_blue.png"
      />
      <img
        class="endStatus"
        v-else-if="tab.status == 'Completed' && tab.finishStatus && tab.finishStatus == '延期'"
        src="@/assets/imgs/oa/node/node_endStatus_red.png"
      />
      <img
        class="endStatus"
        v-else-if="tab.status == 'Completed'"
        src="@/assets/imgs/oa/node/node_endStatus_blue.png"
      />
      <span>{{
        tab.status == 'future'
          ? tab.finishStatus === '正常'
            ? '正常'
            : tab.finishStatus === '延期'
              ? '延期'
              : getStatusLabel(tab.status, tab.nodeCode, nodeList)
          : getStatusLabel(tab.status, tab.nodeCode, nodeList)
      }}</span>
    </div>
    <div class="popver-main-head">
      <div class="popver-node">{{ tab.nodeName }}</div>
    </div>
    <!-- overflow-x: hidden; -->

    <div class="progress">
      <div v-if="tab.flagName" class="row-center" style="margin-top: 10px; margin-bottom: 14px">
        <img src="@/assets/imgs/oa/node/node_planIcon.png" style="width: 12px; height: 12px" />
        <div style="padding-left: 8px; font-size: 14px; color: #666666; line-height: 20px">{{
          tab.flagName
        }}</div>
      </div>
      <!-- <div class="progress-item">
        <div class="progress-item__dot">
          <img :src="startDot" alt="" />
        </div>
        <div class="progress-item__name">开始</div>
        <div class="progress-item__body">
          <div class="progress-item__date" style="min-width: 145px">
            <span class="label">计划</span>
            <span>{{ formatCustomDate(tab.planStartTime, 'yyyy-MM-dd HH:ss') }}</span>
          </div>
          <div class="progress-item__date" style="min-width: 145px">
            <span class="label">实际</span>
            <span>{{ formatCustomDate(tab.actualStartTime, 'yyyy-MM-dd HH:ss') }}</span>
          </div>
        </div>
      </div> -->
      <div class="progress-item">
        <!-- <div class="progress-item__dot">
          <img :src="endDot" alt="" />
        </div> -->
        <!-- <div class="progress-item__name">结束</div> -->
        <div class="progress-item__body">
          <div class="progress-item__date" style="min-width: 200px">
            <span class="label">计划结束时间</span>
            <span>{{ formatCustomDate(tab.planEndTime, 'yyyy-MM-dd HH:mm') }}</span>
          </div>
          <div class="progress-item__date" style="min-width: 200px">
            <span class="label">实际结束时间</span>
            <span>{{ formatCustomDate(tab.actualEndTime, 'yyyy-MM-dd HH:mm') }}</span>
          </div>
        </div>
      </div>
    </div>
    <div style="height: 8px"></div>

    <div
      v-if="Number(tab.isExamine || 0) === 1"
      style="
        overflow: auto;
        overflow-x: hidden;
        max-height: calc(400px - 210px);
        border-radius: 6px;
        border: 1px solid #e7ecf0;
        width: 220px;
      "
    >
      <div style="width: 200px; padding-bottom: 4px; padding-left: 8px; padding-right: 8px">
        <div class="progress-item__value textWrap" style="padding-top: 8px; padding-left: 6px">
          <div
            v-for="(value, index1) in parseExamineInfoRemarks(tab)"
            :key="index1"
            style="padding-top: 2px; padding-bottom: 2px"
          >
            <div class="row-center">
              <div style="font-weight: 500; font-size: 12px; color: #333333; padding-right: 5px">{{
                value.examineNodeName
              }}</div>
              <div
                class="row-center"
                style="height: 23px; background: #e6ecff; border-radius: 13px"
              >
                <img
                  style="
                    width: 15px;
                    height: 15px;
                    border-radius: 8px;
                    margin-left: 4px;
                    margin-right: 4px;
                  "
                  :src="value.avatarOrigin"
                />
                <div
                  v-if="value.examineNodePersonName"
                  style="font-size: 12px; color: #333333; padding-right: 7px"
                  >{{ value.examineNodePersonName }}</div
                >
              </div>
            </div>
            <div
              v-if="value.examineNodeRemark"
              style="font-size: 12px; color: #666666; padding-top: 8px; padding-bottom: 4px"
              >{{ value.examineNodeRemark }}</div
            >
            <div
              v-if="value.examineNodeFile && parsedDocUrls(value.examineNodeFile).length > 0"
              class="row-center"
              style="
                margin-bottom: 5px;
                padding-top: 3px;
                padding-right: 6px;
                padding-bottom: 4px;
                line-height: 20px;
                width: 190px;
                background: #e9eefa;
                border-radius: 4px;
              "
            >
              <img
                src="@/assets/imgs/oa/node/node_link.png"
                alt=""
                style="margin-left: 6px; margin-right: 5px; width: 10px; height: 11px"
              />
              <div class="download-text" style="">
                <span @click="downloadFile(parsedDocUrls(value.examineNodeFile)[0])">
                  {{ parsedDocUrls(value.examineNodeFile)[0].name }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="
        Number(tab.isExamine || 0) === 0 &&
        (getNodeSubmitter(tab) || tab.remarks || parseExamineInfoFiles(tab).length > 0)
      "
      style="
        overflow: auto;
        overflow-x: hidden;
        max-height: calc(400px - 210px);
        border-radius: 6px;
        border: 1px solid #e7ecf0;
        width: 220px;
      "
    >
      <div style="width: 200px; padding-bottom: 4px; padding-left: 8px; padding-right: 8px">
        <div style="padding-top: 8px; padding-left: 6px">
          <div class="row-center">
            <div
              v-if="getNodeSubmitter(tab)"
              class="row-center"
              style="height: 23px; background: #e6ecff; border-radius: 13px"
            >
              <img
                style="
                  width: 15px;
                  height: 15px;
                  border-radius: 8px;
                  margin-left: 4px;
                  margin-right: 4px;
                "
                :src="getNodeSubmitter(tab).avatarOrigin"
              />
              <div
                v-if="getNodeSubmitter(tab).name"
                style="font-size: 12px; color: #333333; padding-right: 7px"
                >{{ getNodeSubmitter(tab).name }}</div
              >
            </div>
          </div>
          <div
            v-if="tab.remarks"
            style="font-size: 12px; color: #666666; padding-top: 8px; padding-bottom: 4px"
            >{{ tab.remarks }}</div
          >
          <div
            class="row-center"
            style="
              margin-bottom: 5px;
              padding-top: 3px;
              padding-right: 6px;
              padding-bottom: 4px;
              line-height: 20px;
              width: 190px;
              background: #e9eefa;
              border-radius: 4px;
            "
            v-for="(url, index) in parseExamineInfoFiles(tab)"
            :key="index"
          >
            <img
              src="@/assets/imgs/oa/node/node_link.png"
              alt=""
              style="margin-left: 6px; margin-right: 5px; width: 10px; height: 11px"
            />
            <div class="download-text">
              <span @click="downloadFile(url)"> {{ url.name }} </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

import {
  formatCustomDate,
  getDotImg,
  getNodeSubmitter,
  getStatusLabel,
  handleJSONParse,
  parsedDocUrls,
  parseExamineInfoFiles
} from '@/views/OA/package/product/utils.js'

const props = defineProps({
  nodeList: {
    type: Array as PropType<any[]>,
    default: () => {
      return []
    }
  },
  tab: propTypes.object.def({})
})

const parseExamineInfoRemarks = (tab: any) => {
  if ((Number(tab.isExamine) || 0) === 0) {
    if (tab.remarks) {
      return [tab.remarks]
    }
    return []
  }
  const examineInfos = tab.examineInfo
  if (!examineInfos) {
    return []
  }
  const examineInfoArr = handleJSONParse(examineInfos)
  return examineInfoArr || []
}

const downloadFile = (url) => {
  // console.log('url', url)
  // 下载文件
  const a = document.createElement('a')
  a.href = url.url
  a.download = url.fileName // 设置下载的文件名
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

onMounted(() => {})
</script>

<style lang="scss" scoped>
.download-text {
  width: calc(100% - 20px);
  &:hover {
    color: #0064ff;
    cursor: pointer;
  }
}

.popver-main {
  position: relative;
  // overflow: auto;
  .popver-status {
    position: absolute;
    right: -16px;
    top: -14px;
    width: 85px;
    height: 27px;
    background: url('@/assets/imgs/oa/product/unnormal-bg.png') no-repeat center center;
    background-size: 85px 27px;
    color: #ff0000;
    display: flex;
    align-items: center;

    img {
      padding-right: 6px;
      padding-left: 16px;
    }
  }
  .endStatus {
    width: 12px;
    height: 12px;
  }

  .status-normal {
    background-image: url('@/assets/imgs/oa/product/normal-bg.png');
    color: #05975b;
  }
  .status-gray {
    background-image: url('@/assets/imgs/oa/product/normal-bg_normal.png');
    color: #666666;
  }

  .status-red {
    background-image: url('@/assets/imgs/oa/product/normal-bg_red.png');
    color: #ff2020;
  }
  &-head {
    display: flex;
    align-items: center;

    .popver-name {
      background-color: #e6ecff;
      margin-left: 10px;
      height: 18px;
      line-height: 18px;
      padding: 4px;
      border-radius: 12px;
      font-size: 12px;
      display: flex;
      align-items: center;

      .avator {
        width: 15px;
        height: 15px;
        border-radius: 7.5px;
        margin-right: 5px;
        margin-top: 1px;
      }
    }
  }

  .progress {
    &-item {
      display: flex;
      align-items: center;
      font-size: 12px;

      &__name {
        padding: 0 7px 0 10px;
        color: #333;
      }

      &__body {
        background-color: #fef7eb;
        padding: 5px 10px;
        color: #666;

        .progress-item__date {
          .label {
            padding-right: 16px;
          }

          &:first-child {
            padding-bottom: 8px;
          }
        }
      }

      &:first-child {
        position: relative;
        margin-bottom: 6px;
        margin-top: 13px;

        .progress-item__body {
          background-color: #f2fcf8;
        }

        &::after {
          content: '';
          position: absolute;
          top: 30px;
          left: 5px;
          width: 4px;
          // height: 40px;
          //border-left: 1px dashed #d5dee4;
        }
      }
    }
  }

  .progress-item-titleRow {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-weight: 500;
    font-size: 12px;
    color: #0064ff;
    line-height: 17px;
    padding-top: 12px;
    margin-bottom: 10px;
    &-icon {
      width: 10px;
      height: 10px;
    }
    &-text {
      padding-left: 8px;
    }
  }
  .progress-item__value {
    width: 164px;
    padding: 8px;
    line-height: 17px;
    background: #ffffff;
    border-radius: 6px;
  }
}
</style>
