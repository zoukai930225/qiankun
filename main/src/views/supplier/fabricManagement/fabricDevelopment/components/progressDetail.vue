<template>
  <div class="p-content">
    <div
      v-for="(item, index) in listData"
      :key="item.id"
      class="p-content-item"
      :style="listData.length === 1 ? 'border-radius: 10px' : ''"
    >
      <div class="item-title">
        <div class="title-name">
          <!-- <span>{{ item.supplierName }}</span> -->
          <div class="img-icon">
            <img
              :src="successSvg"
              alt=""
              v-if="item.displayGreenTick"
              style="width: 20px; height: 20px; margin: 3px 4px"
            />
            <img
              :src="errorSvg"
              alt=""
              v-if="item.displayRedCross"
              style="width: 20px; height: 20px; margin: 3px 4px"
            />
          </div>
          <suspend-txt :txt="item.supplierName" :style="{ fontWeight: '500', maxWidth: '365px' }" />
          <el-popover placement="bottom" effect="dark" popper-style="max-width: 300px;">
            <template #reference>
              <img :src="tipSvg" alt="" class="img-tips" style="margin: 4px 4px" />
            </template>
            <div>
              <div style="margin-bottom: 10px">匹配原因:{{ item.matchReason }}</div>
              <div>预估报价:{{ item.matchPrice }}</div>
            </div>
          </el-popover>
        </div>
        <div class="steps-wapper">
          <el-steps :active="getheaderActive(item)" :finish-status="titleSttus" align-center>
            <el-step :title="item" v-for="(sitem, sindex) in titleSetpsData">
              <template #title :icon="CircleCheck">
                <el-text class="titel-step-text">{{ sitem }}</el-text>
              </template>
              <template #icon>
                <img :src="getHeaderSetpIcon(item, sindex)" alt="" class="step_icon" />
              </template>
            </el-step>
          </el-steps>
        </div>
      </div>
      <el-scrollbar
        :height="
          isDetail
            ? `calc(100vh - ${isExpand ? '625px' : '430px'})`
            : `calc(100vh - ${isExpand ? '638px' : '440px'})`
        "
      >
        <div class="item-content">
          <el-steps
            :active="getAuditRecordList(item).length - 1"
            finish-status="success"
            direction="vertical"
            v-if="item.flowStatus !== 0"
          >
            <el-step v-for="(contentItem, sindex) in getAuditRecordList(item)">
              <template #title :icon="CircleCheck">
                <div
                  style="display: flex; align-items: flex-start; justify-content: space-between"
                  :style="contentItem.flowStatus === 20 ? 'margin-top: -5px;' : ''"
                >
                  <el-text
                    class="titel-step-text"
                    :style="{
                      color: getSetpIcon(contentItem.operateStatus, contentItem.flowStatus).color,
                      fontWeight: 500
                    }"
                    >{{
                      getSetpIcon(contentItem.operateStatus, contentItem.flowStatus).name
                    }}</el-text
                  >
                  <template v-if="contentItem.flowStatus === 20">
                    <el-select
                      v-model="item.latestFabricChooseRecordId"
                      style="flex: 1; margin-left: 10px; font-weight: 400"
                      @change="changeFabicChoose($event, item.supplierId, item.fabricId, index)"
                    >
                      <el-option-group
                        v-for="(group, __index) in item?.fabricChooseRecordGroup"
                        :key="__index"
                        :label="__index === '0' ? '审核中' : '已完成'"
                      >
                        <el-option
                          v-for="cGroup in group"
                          :key="cGroup.id"
                          :label="`面料选用${cGroup.serialNumber}`"
                          :value="cGroup.id"
                        />
                      </el-option-group>
                    </el-select>
                  </template>
                </div>
              </template>
              <template #icon>
                <img
                  :src="getSetpIcon(contentItem.operateStatus, contentItem.flowStatus).icon"
                  alt=""
                  class="step_icon"
                />
              </template>
              <template #description>
                <template v-if="contentItem.flowStatus === 20">
                  <div class="fabic-choose-box">
                    <div class="box-header">
                      <div class="title">{{
                        `面料选用${getNumber(item?.latestFabricChooseRecordId, item?.fabricChooseRecordGroup)?.serialNumber}`
                      }}</div>
                      <div
                        class="tag"
                        :class="
                          getNumber(item?.latestFabricChooseRecordId, item?.fabricChooseRecordGroup)
                            ?.status === 0
                            ? 'yellow'
                            : ''
                        "
                        >{{
                          getNumber(item?.latestFabricChooseRecordId, item?.fabricChooseRecordGroup)
                            ?.status === 0
                            ? '审核中'
                            : '已完成'
                        }}</div
                      >
                    </div>
                    <div class="info">
                      <div class="step_user">
                        <img
                          :src="contentItem?.submitUserAvatarOrigin || DefaultAvatar"
                          alt=""
                          class="user_icon"
                        />
                        {{ contentItem?.submitUserName || '--' }}
                      </div>
                      <div class="step_time">{{ contentItem?.createdAt || '' }}</div>
                      <div class="step_remark choose-remark">{{ contentItem?.remark || '' }}</div>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="step_user">
                    <img
                      :src="contentItem?.submitUserAvatarOrigin || DefaultAvatar"
                      alt=""
                      class="user_icon"
                    />
                    {{ contentItem?.submitUserName || '--' }}
                  </div>
                  <div class="step_time">{{ contentItem?.createdAt || '' }}</div>
                  <div class="step_remark">{{ contentItem?.remark || '' }}</div>

                  <div class="step_file_list">
                    <div v-for="file in fileGet(contentItem)" class="file_card">
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
                </template>
              </template>
            </el-step>
          </el-steps>

          <div class="empty-wapper" v-else>
            <img
              class="empty-table"
              src="@/assets/imgs/promotion/empty.png"
              alt=""
              style="width: 258px; height: 164px"
            />
            <span style="text-align: center; color: #999999">暂无数据</span>
          </div>
        </div>
      </el-scrollbar>
      <div class="item-bottom" v-if="!isDetail">
        <!-- && !progressFinshed -->
        <el-button
          v-if="item.displayEliminationBtn"
          style="width: 120px"
          :icon="Refresh"
          @click="handleDropSupplier(item.supplierName, item.id, item.supplierId, item.fabricId)"
          >淘汰供应商</el-button
        >
        <el-button
          v-if="item.displayUploadDataBtn"
          style="width: 120px"
          :icon="Upload"
          type="primary"
          @click="handleUpload(item.id, item.supplierId, item.fabricId)"
          >资料上传</el-button
        >
        <el-button
          v-if="item.displayChooseBtn"
          style="width: 120px"
          icon="MessageBox"
          type="primary"
          @click="handleChoose(item.supplierName, item.id, item.supplierId, item.fabricId)"
          >面料选用</el-button
        >
        <el-button
          v-if="item.displayTrialResultBtn"
          style="width: 120px"
          :icon="CircleCheck"
          type="primary"
          @click="
            handleTrialTest(
              item.id,
              item.supplierId,
              item.fabricId,
              item.latestFabricChooseRecordId,
              1,
              index
            )
          "
          >试穿样测试</el-button
        >
        <el-button
          v-if="item.displayBfConfirmBtn"
          style="width: 120px"
          :icon="CircleCheck"
          type="primary"
          @click="
            handleTrialTest(
              item.id,
              item.supplierId,
              item.fabricId,
              item.latestFabricChooseRecordId,
              2,
              index
            )
          "
          >版房试穿测试</el-button
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'ProgressSupplierStep' })

import SuspendTxt from '@/components/common/text/suspend.vue'
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
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Checked,
  CircleCheck,
  CircleCloseFilled,
  Refresh,
  SuccessFilled,
  Upload
} from '@element-plus/icons-vue'
import createDialog from '@/components/common/directDialog/index'
import ResourceUpload from './resourceUpload.vue'
import DropSupplier from './dropSupplier.vue'
import ResultConfirm from './resultConfirm.vue'
// import choose from './choose.vue'
import useDialog from '@/hooks/web/useDialog'
import { cloneDeep } from 'lodash-es'
const { openDialog } = useDialog()
const active = ref(0)

const addNoticeRef = ref()

const message = useMessage()

const emit = defineEmits(['update', 'quote', 'refresList', 'refresData'])

const props = defineProps({
  list: { type: Array<any>, default: () => [] },
  item: { type: Object, default: () => {} },
  height: { type: Number, default: 200 },
  progressFinshed: { type: Boolean, default: false },
  isDetail: { type: Boolean },
  isExpand: { type: Boolean, default: false }
})

const titleSetpsData = ref(['资料上传', '面料选用', '试穿样测试', '版房试穿确认'])

const contentStep = ref([])
const listData: any = ref([])

const tipsHeight = computed(() => props.height - 128)

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
  if (!item?.attachmentUrl) return []
  return item?.attachmentUrl.split(',').map((ds: any) => {
    const files: any = ds.split('?name=')
    return { name: files[1].split('&')[0], url: ds }
  })
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

const getGroup = (group: any) => {
  console.log(group, 999)
  if (!group) return []
  const arr0 = group[0] || []
  const arr1 = group[1] || []
  return [...arr0, ...arr1]
}

const titleShow = (item: any, value: string, name: string = 'label') => {
  const status: Array<number> = [1]
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
    { label: '供需计划审批拒绝', value: 7, color: '#EB3737', ecolor: '#EB3737', icon: failedSvg }
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

const titleSttus: any = ref('wait')

const getheaderActive = (item) => {
  const { finishedUploadData, finishedChoose, finishedTrial, finishedBfConfirm } = item
  if (finishedBfConfirm) return 4 // 版房试穿
  if (finishedTrial) return 2 // 试穿样
  if (finishedChoose) return 1 // 面料选用
  if (finishedUploadData) return 0 // 资料上传
  return undefined
}
const getHeaderSetpIcon = (item, index) => {
  // ['资料上传', '面料选用', '试穿样测试', '板房试穿确认']
  return (index === 0 && item.finishedUploadData) ||
    (index === 1 && item.finishedChoose) ||
    (index === 2 && item.finishedTrial) ||
    (index === 3 && item.finishedBfConfirm)
    ? successSvg
    : remarkSvg
}

const getSetpIcon = (operateStatus, flowStatus) => {
  let icon = successSvg
  let color = '#349B34'
  let size = {
    width: '16px',
    height: '16px'
  }
  let name = ''
  if (flowStatus === 10) {
    name = '资料上传'
  }
  if (flowStatus === 20) {
    name = '面料选用'
  }
  if (flowStatus === 30 && operateStatus === 1) {
    name = '试穿样测试 ：审核通过'
  }
  if (flowStatus === 30 && operateStatus === 2) {
    name = '试穿样测试 ：审核拒绝'
    icon = errorSvg
    color = '#EB3737'
    // size.width = size.height ='12px'
  }
  if (flowStatus === 40 && operateStatus === 1) {
    name = '版房试穿确认 ：审核通过'
  }
  if (flowStatus === 40 && operateStatus === 2) {
    name = '版房试穿确认 ：审核拒绝'
    icon = errorSvg
    color = '#EB3737'
    // size.width = size.height ='12px'
  }
  if (flowStatus === 100) {
    name = '已淘汰'
    icon = errorSvg
    color = '#EB3737'
    // size.width = size.height ='12px'
  }

  return {
    icon,
    color,
    width: size.width,
    height: size.height,
    name
  }
}

const successCb = (isRefresList: boolean = false) => {
  console.log(isRefresList)
  emit('refresList')
  isRefresList && emit('refresData')
}

const handleUpload = (id, supplierId, fabricId) => {
  createDialog({
    title: '资料上传',
    content: ResourceUpload,
    top: '10vh',
    width: 600,
    props: {
      type: 1,
      id,
      fabricId,
      supplierId
    },
    successCb
  })
}

const handleDropSupplier = (name, id, supplierId, fabricId) => {
  createDialog({
    title: name,
    content: DropSupplier,
    width: 600,
    props: {
      id,
      fabricId,
      supplierId
    },
    successCb
  })
}

// 面料选用
const handleChoose = (name, id, supplierId, fabricId) => {
  openDialog({
    title: '面料选用',
    content: defineAsyncComponent(() => import('./choose.vue')),
    width: '600px',
    closeOnClickModal: false,
    props: {
      fabricId,
      supplierId
    },
    alignCenter: true,
    footerStyle: { borderTop: 'solid #f0f0f0 1px' },
    onSuccess: () => {
      successCb(true)
    }
  })
}

const handleTrialTest = (id, supplierId, fabricId, latestFabricChooseRecordId, type, index) => {
  console.log(type)
  createDialog({
    title: type === 1 ? '试穿样测试' : '版房试穿确认',
    content: ResultConfirm,
    width: 520,
    props: {
      type,
      id,
      fabricId,
      supplierId,
      chooseRecordId: latestFabricChooseRecordId
    },
    successCb: () => {
      // successCb(type === 2)
      changeFabicChoose(latestFabricChooseRecordId, supplierId, fabricId, index)
    }
  })
}

watch(
  () => props.list,
  () => {
    const source = ['资料上传', '面料选用', '试穿样测试', '版房试穿确认']
    listData.value = [...props.list].map((x) => {
      x.setps = source.slice(0, x.flowStatus)
      return x
    })
  },
  {
    immediate: true
  }
)

const getAuditRecordList = (item: any) => {
  const fabricSupplierAuditRecordList = cloneDeep(item?.fabricSupplierAuditRecordList || [])
  const fabricChooseProcessRecordList = cloneDeep(item?.fabricChooseProcessRecordList || [])
  const index = fabricSupplierAuditRecordList.findIndex((record: any) => record.flowStatus === 100)
  if(index > -1) {
    fabricSupplierAuditRecordList.splice(index, 0, ...fabricChooseProcessRecordList)
    return fabricSupplierAuditRecordList
  }
  return fabricSupplierAuditRecordList.concat(fabricChooseProcessRecordList)
}

// 获取面料选用序号
const getNumber = (latestFabricChooseRecordId: string, fabricChooseRecordGroup: any) => {
  const arr = (fabricChooseRecordGroup?.[0] || []).concat(fabricChooseRecordGroup?.[1] || [])
  const tar = arr.find((item: any) => item.id === latestFabricChooseRecordId)
  return {
    serialNumber: tar?.serialNumber || '',
    status: tar?.status || 0
  }
}

const changeFabicChoose = async (
  chooseRecordId: string,
  supplierId: string,
  fabricId: string,
  index: any
) => {
  const data = {
    fabricId,
    supplierId,
    chooseRecordId
  }
  const res = await request.get({
    url: `/workflow-api/api/workflow/business/fabric/develop/supplier/chooseProcessList`,
    params: data
  })
  if (res) {
    listData.value[index] = {
      ...listData.value[index],
      fabricChooseProcessRecordList: res?.fabricChooseProcessRecordList || [],
      finishedBfConfirm: res?.finishedBfConfirm || false,
      finishedChoose: res?.finishedChoose || false,
      finishedTrial: res?.finishedTrial || false,
      finishedUploadData: res?.finishedUploadData || false,
      displayBfConfirmBtn: res?.displayBfConfirmBtn || false,
      displayChooseBtn: res?.displayChooseBtn || false,
      displayEliminationBtn: res?.displayEliminationBtn || false,
      displayTrialResultBtn: res?.displayTrialResultBtn || false,
      fabricChooseRecordGroup: res?.fabricChooseRecordGroup || {}
    }
  }
}
</script>

<style lang="scss" scoped>
.step_icon {
  width: 14px;
  height: 14px;
  background-color: transparent;
}

.step_title {
  width: 100%;
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
  &.choose-remark {
    background-color: #ffffff;
    padding: 10px 7px 10px;
    box-sizing: border-box;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
  }
}

.step_desc {
  width: 100%;
  margin-bottom: 20px;

  .step_user {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 400;
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
        width: 170px;
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
  // border: 1px solid #E5E5E5;
  box-sizing: border-box;
  // border-radius: 10px;
  // overflow: hidden;

  .p-content-item {
    width: 429px;
    display: flex;
    flex-direction: column;
    border: 1px solid #e5e5e5;
    border-right: 0;
    box-sizing: border-box;
    overflow: hidden;
    &:last-child {
      border-radius: 0 10px 10px 0;
      border-right: 1px solid #e5e5e5;
    }
    &:first-child {
      border-radius: 10px 0 0 10px;
    }
    // border-radius: 8px 8px 0 0;
    // margin-right: 20px;

    .item-title {
      width: 100%;
      height: 97px;
      background-color: #f8f8f9;
      // border-radius: 8px 8px 0 0;

      .title-name {
        width: calc(100% - 20px);
        height: 48px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        font-weight: 500;
        color: #3d3d3d;
        padding: 0 10px;

        .item-txt {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          // width: 100%; /* 占满父容器宽度 */
        }
      }

      .steps-wapper {
        width: 100%;
        height: 48px;
        justify-content: center;
        align-items: center;

        ::v-deep(.el-step.is-horizontal .el-step__line) {
          border-top: 1px dashed #e5e5e5;
          /* 设置2像素宽的虚线 */
          background-color: transparent;
          /* 将原背景色设为透明 */
          height: 0;
          /* 调整高度以适应边框 */
        }

        .titel-step-text {
          // color: red;
          font-size: 12px;
        }

        :deep(.el-step__main) {
          margin-top: -10px;
        }

        :deep(.el-step__icon.is-icon) {
          background-color: transparent;
        }

        // background-color: red;
      }
    }

    .item-content {
      height: 100%;
      position: relative;
      padding: 10px 15px 10px 5px;

      :deep(.el-steps--vertical) {
        display: block;
      }

      :deep(.el-step.is-vertical .el-step__line) {
        border-left: 1px dashed #e5e5e5;
        /* 修改垂直连接线 */
        background-color: transparent;
        border-right: 0px;

        .el-step__line-inner {
          border: 0px;
        }
      }

      .empty-wapper {
        // margin-top: 55%;
        // position: absolute;
        // top: 50%;
        // transform: translateY(-50%);
        // text-align: center;
        width: 100%;
        height: calc(100vh - 650px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .step_user {
        display: inline-flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        font-weight: 400;
        color: #333;

        .user_icon {
          margin-right: 5px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
        }
      }

      .step_time {
        margin-left: 0px;
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

    .item-bottom {
      width: calc(100% - 20px);
      height: 30px;
      border-top: 1px #e5e5e5 dashed;
      padding: 10px 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      // justify-content: space-between;
    }
  }
}

.fabic-choose-box {
  background: #f9fafb;
  box-sizing: border-box;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  width: 100%;
  margin: 10px 0;
  .box-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 9px 10px 13px;
    .title {
      font-size: 14px;
      font-weight: 500;
    }
    .tag {
      background: rgba(52, 155, 52, 0.1);
      padding: 3px 6px;
      color: #349b34;
      font-size: 10px;
      border-radius: 2px;
      &.yellow {
        background: rgba(219, 106, 15, 0.1);
        color: #db6a0f;
      }
    }
  }
  .info {
    border-top: 1px solid #e5e5e5;
    box-sizing: border-box;
    padding: 13px 9px 14px 14px;
  }
}

:deep() {
  .steps-wapper {
    .el-step {
      flex-basis: 23.5% !important;
      &:last-of-type {
        flex-basis: 29.5% !important;
        max-width: 29.5% !important;
      }
    }
  }
}

:deep() {
  .el-step.is-vertical .el-step__main {
    padding-bottom: 5px;
  }
}
</style>
