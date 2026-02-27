<template>
  <div class="progressMainContainer">
    <div ref="contentWapperRef">
      <div class="drawer-wapper">
        <div class="content-wapper">
          <div style="display: flex; flex-direction: row">
            <div style="
                border-radius: 8px;
                background: #ffffff;
                padding-left: 20px;
                margin-right: 0px;
                padding-top: 20px;
                bottom: 10px;
                overflow: auto;
                height: auto;
              ">
              <div style="margin-right: 0px; height: auto" v-if="rowData">
                <displayInfo ref="displayInfoRef" :rowData="rowData" :key="rowData.id"
                  :progressContentHeight="progressContentHeight" :nodeList="nodeList" :otherFiles="otherFiles"
                  @finishedErpNode="getFinishedErpNode" />
              </div>
            </div>
            <!-- 右侧 -->
            <!-- <div style="width: 10px"></div> -->

            <div style="width: 425px; background: #ffffff; display: flex; flex-direction: row"
              :style="{ width: `${nodeShowWidth + 16}px` }" class="resizableLeft" ref="resizeLeftHandle">
              <div v-if="nodeList && nodeList.length > 0" style="
                  height: auto;
                  width: 16;
                  display: flex;
                  margin-top: 20px;
                  flex-direction: column;
                  background: #ffffff;
                  position: relative;
                " :style="{ height: `${nodeShowHeight + formInlineHeight + 20}px` }">
                <div style="background: #eceaea; width: 1px; height: 100%; margin-right: 7px"></div>
                <img @mousedown="startResizeWidth" style="
                    width: 16px;
                    height: 16px;
                    cursor: move;
                    z-index: 11;
                    position: absolute;
                    top: 50%;
                    right: 0px;
                  " :style="{ top: `${nodeShowHeight - 8}px` }" src="@/assets/imgs/drag_left_right.png" />
              </div>
              <div style="width: 409px; height: auto" :style="{ width: `${nodeShowWidth}px` }" ref="progressContent">
                <div class="resizable" ref="resizeHandle" style="
                    width: 389px;
                    background: #ffffff;
                    margin-top: 20px;
                    margin-bottom: 15px;
                    height: 406px;
                    box-sizing: border-box;
                    border: 1px solid #e5e5e5;
                  " :style="{
                    borderRadius: formInline.nodeCode ? '8px 8px 0px 0px' : '8px',
                    borderBottom: formInline.nodeCode ? 'none' : '',
                    height: `${nodeShowHeight}px`,
                    width: `${nodeShowWidth - 16}px`
                  }">
                  <div style="margin-top: 0px; padding-right: 8px; overflow: hidden"
                    :style="{ maxHeight: `${nodeShowHeight - 2}px` }">
                    <div style="height: 2px"></div>
                    <SWProgressNode style="margin-left: 2px; width: calc(100% + 6px)" ref="swProgressNodeRef"
                      :max-height="nodeShowHeight - 14" :parallelHeaderNodeList="parallelHeaderNodeList"
                      :node-list="nodeList" :selectId="selectId" @select-handle="selectHandle" />
                  </div>
                  <div v-if="nodeList && nodeList.length > 0" class="resize-handle" ref="resizeHandleMove" style="
                      height: 16px;
                      width: calc(100% - 20px);
                      display: flex;
                      flex-direction: column;
                      justify-items: center;
                      align-items: center;
                      z-index: 99;
                      margin-top: 4px;
                    ">
                    <!-- onmousemove="handleMouseMove(event)" -->
                    <img @mousedown="startResize" style="width: 16px; height: 16px; cursor: move; z-index: 11"
                      src="@/assets/imgs/drag_up_down.png" />
                  </div>
                </div>

                <div v-if="formInline.nodeCode" ref="formInlineRef" style="
                    border-radius: 0px 0px;
                    box-sizing: border-box;
                    border: 1px solid #e5e5e5;
                    margin-right: 20px;
                    margin-top: -15px;
                  ">
                  <div class="drawerContent nodeForm">
                    <SWProgressNodeEnter :form-inline="formInline" :designInfo="displayInfoRef?.getDesignInfo()"
                      @handle-confirm-operation-manager="handleConfirmOperationManager"
                      @handle-confirm-purchase-manager="handleConfirmPurchaseManager" @success="handleSccess" />
                    <div class="formContent" style="margin-left: 10px; margin-right: 10px">
                      <NodeForm :formData="formInline" :disabled="!isHasEditInfoPermission(formInline) ||
                        isPreProductionSampleAudit ||
                        selectId === 'ProcurementNotice'
                        " :loading="formLoading" />
                    </div>
                    <!--  -->

                    <div class="formFooter" v-if="
                      isHasEditInfoPermission(formInline) &&
                      selectId !== 'ProcurementNotice' &&
                      formInline?.status &&
                      (formInline?.status == 0 || formInline?.status == 3) &&
                      !isPreProductionSampleAudit &&
                      ((checkPermi(['oa:product:review']) && formInline.isExamine == 1) ||
                        (checkPermi(['oa:product:submit']) && formInline.isExamine == 0))
                    ">
                      <div class="auditBtns" v-if="checkPermi(['oa:product:review']) && formInline.isExamine == 1">
                        <el-button :loading="auditRefueLoading" @click="handleAuditRefuse">审核拒绝</el-button>
                        <el-button type="primary" :loading="auditPassLoading" :disabled="loading"
                          @click="handleAuditPass">审核通过</el-button>
                      </div>
                      <el-button type="primary" :disabled="loading" :loading="submitLoading"
                        v-if="checkPermi(['oa:product:submit']) && formInline.isExamine == 0"
                        @click="handleSubmitConfirm">提交</el-button>
                    </div>
                  </div>
                </div>
                <!-- 在需要审核，且提交人已经提交的情况下展示 -->
                <ContentWrap v-if="
                  (formInline?.examineInfo &&
                    formInline?.examineInfo?.length &&
                    formatExamineInfo(formInline?.examineInfo) &&
                    formatExamineInfo(formInline?.examineInfo).length > 0) ||
                  (formInline?.nodeCode === 'PreProductionSampleUpload' &&
                    formatExamineInfo(formInline?.examineInfo) &&
                    formatExamineInfo(formInline?.examineInfo).length > 0)
                ">
                  <!-- 审核人  在审核人已提交的状态下展示 -->
                  <div class="audit-wrap" v-for="(item, index) in formatExamineInfo(formInline?.examineInfo)"
                    :key="index">
                    <div class="title">
                      <img src="@/assets/imgs/oa/product/dot.png" alt="" class="avatar" />
                      审核人
                    </div>
                    <div class="audit-container">
                      <div class="proposedBg">
                        <div class="row-center">
                          <div class="allBg-auditNode">{{
                            getDictLabel(
                              DICT_TYPE.NP_TEMPLATE_EXAMINE_DETAIL_NAME,
                              item?.examineNodeName || ''
                            ) ||
                            item?.examineNodeName ||
                            ''
                          }}</div>
                        </div>

                        <div class="allBg-title row-center" style="margin-left: 12px">
                          <img :src="item?.avatarOrigin" alt="" class="avatar" />
                          <span class="name">{{ item?.examineNodePersonName || '' }}</span>
                          <div class="auditStatus" :style="{
                            color: getAuditStatusColors(Number(item?.examineStatus) || 0, '')[1],
                            background: getAuditStatusColors(
                              Number(item?.examineStatus) || 0,
                              ''
                            )[2]
                          }">{{
                            getAuditStatusColors(Number(item?.examineStatus) || 0, '')[0]
                          }}</div>
                        </div>
                        <div class="allBg-text" style="text-align: left; margin-left: 12px">
                          <span class="date">{{ item?.finishCreated || '' }}</span>
                        </div>
                      </div>
                      <div class="auditFile" style="display: flex; flex-direction: row; margin-top: 14px">
                        <div style="
                            font-size: 14px;
                            color: #666666;
                            margin-left: -5px;
                            margin-right: 10px;
                            margin-top: 2px;
                          ">附件:</div>
                        <div style="display: flex; flex-direction: column; width: calc(100% - 40px)">
                          <ul class="file-list" style="margin-left: -5px; margin-top: 0px"
                            v-if="item?.uploadList && item?.uploadList.length > 0">
                            <li v-for="item1 in item?.uploadList" :key="item1.url">
                              <el-icon class="document">
                                <Document />
                              </el-icon>
                              <span class="name text1" style="max-width: 250px" @click="previewHandle(item1)">{{
                                item1?.name }}</span>
                            </li>
                          </ul>
                          <div style="font-size: 14px; margin-top: 2px" v-else>无</div>
                        </div>
                      </div>
                      <div class="allBg-remark"> {{ item?.examineNodeRemark }} </div>
                    </div>
                  </div>
                </ContentWrap>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 如果是资料填写的节点，提交的时候需要确认对话框确认信息是否填写完成 -->

    <confirmDialog ref="confirmDialogRef" @confirm="save" :title="'系统提醒'" cancelText="关闭" confirmText="确认"
      :content="`是否已完成${formInline.nodeName}？`" />

    <confirmDialog ref="auditRefusedDialogRef" @confirm="auditRefuseSave" :title="'系统提醒'" cancelText="关闭"
      confirmText="确认" :content="`是否审核拒绝${formInline.nodeName}？`" />
  </div>
</template>

<script lang="ts" setup>
import {
  auditSuccessUpdate,
  confirmProductSuccess,
  getPlanNodeByDesignId,
  refuseUpdate,
  submitUpdate
} from '@/api/oa/new/develop'
import { createImageViewer } from '@/components/ImageViewer'
import { useUserStore } from '@/store/modules/user'
import { getAccessToken } from '@/utils/auth'
import { redrawTree } from '@/utils'
import { DICT_TYPE, getDictLabel } from '@/utils/dict'
import { checkPermi } from '@/utils/permission'
import {
  getParallelHeaderNodeList,
  handleJSONParse,
  isHasEditInfoPermission,
  parsedDocUrls,
  parseExamineInfoFiles
} from '@/views/OA/new/product/utils.js'

import { formatCustomDate } from '../utils'
import displayInfo from './displayInfo/displayInfo.vue'
import SWProgressNode from './SWProgressNode.vue'
import SWProgressNodeEnter from './SWProgressNodeEnter.vue'
import NodeForm from '../components/nodeComponents/nodeForm.vue'

import confirmDialog from './confirmDialog.vue'
import { cloneDeep } from 'lodash-es'

const formLoading = ref(false) //表单加载状态
const message = useMessage() // 消息弹窗
const isVisible = ref(false)
const loading = ref(false)
const nodeList = ref<any[]>([])
const userStore = useUserStore()
const uploadLoading = ref(false) //上传loading
const auditUploadLoading = ref(false) //上传loading
const submitLoading = ref(false) //提交loading
const formInline = ref({
  id: '',
  nodeName: '',
  personInCharge: '',
  personInChargeList: '', // 提交人列表
  planStartTime: '',
  planEndTime: '',
  actualStartTime: '',
  actualEndTime: '',

  produce: '',
  docUrl: '',
  remarks: '', //提交人的备注
  examineNodeRemark: '', //审核人的备注
  isExamine: 0, // 0 -提交人 1-审核人
  finishCreated2: '', //审核人创建时间
  finishCreated: '', //提交人创建时间
  author: '', //提交人
  authorOrigin: '', //提交人头像
  reviewers: '', //审核人
  reviewersOrigin: '', //审核人头像
  status: 0, // 节点状态 status(0-未开始,1-待审核,2-审核失败,3-已结束)
  nodeStatus: 0, //提交人是否提交 0-未提交 1-已提交
  nodeStatus2: 0, //审核人是否提交 0-未提交 1-已提交 2-拒绝

  examineInfo: '', //审核信息
  nodeCode: undefined,
  nodeOrder: undefined,

  operationalInformationPerson: '', //运营信息
  operationalInformationPersonList: [], //
  operateDetails: [], //运营明细
  purchaseInformationPerson: '', //采购信息
  purchaseInformationPersonList: [] //
})

const auditRefueLoading = ref(false)
const auditPassLoading = ref(false)

const isPreProductionSampleAudit = computed(() => {
  return formInline.value.nodeCode === 'PreProductionSampleAudit'
})
// 产前样审核是否有被拒的子节点
const isRefundPreProductionSampleAudit = () => {
  const node = nodeList.value.find((item) => item.nodeCode === 'PreProductionSampleAudit')
  let isExistRefund = false
  if (node) {
    node.examineInfo = handleJSONParse(node.examineInfo) || []
    node.examineInfo.forEach((item) => {
      if (Number(item.examineStatus || 0) === 2) {
        // 被拒绝
        isExistRefund = true
      }
    })
  }
  return isExistRefund
}

const formatExamineInfo = (arr) => {
  if (!arr?.length) return []
  if (formInline.value.nodeCode === 'PreProductionSampleAudit') {
    const midArr = arr.filter((item) => item.examineStatus == 1 || item.examineStatus == 2)
    return midArr
  }
  const midArr = arr.filter((item) => item.examineStatus == 1 || item.examineStatus == 2)
  return midArr
}

// 获取审核状态颜色和背景
const getAuditStatusColors = (status: Number, nodeCode: string) => {
  if (nodeCode && nodeCode === 'PreProductionSampleAudit' && isRefundPreProductionSampleAudit()) {
    return ['拒绝', '#FF2020', `rgba(255,32,32,0.1)`]
  }
  //status 0:未开始 节点完成 节点废弃
  if (status === 0) {
    return ['未开始', '#666666', `rgba(112, 112, 112, 0.1)`]
  } else if (status === 1) {
    return ['已结束', '#24BC29', `rgba(36,188,41,0.1)`]
  } else if (status === 2) {
    return ['淘汰', '#FF2020', `rgba(255,32,32,0.1)`]
  } else if (status === 3) {
    return ['进行中', '#FF8C00', `rgba(255,140,0,0.1)`]
  }
  return ['未开始', '#666666', `rgba(112, 112, 112, 0.1)`]
}

const currentNodeIsCanClick = (node: any) => {
  if (node && Number(node.status || 0) !== 0) {
    return true
  }
  if (
    node.nodeCode &&
    node.nodeCode === 'PreProductionSampleAudit' &&
    isRefundPreProductionSampleAudit()
  ) {
    return true
  }
  return false
}
const selectId = ref('')
// 选择节点
const selectHandle = (id, arr) => {
  if (!currentNodeIsCanClick(arr)) {
    return
  }
  uploadList.value = []
  selectId.value = id
  console.log('当前节点信息', arr)
  formInline.value = arr

  if (
    (arr.isExamine == 0 || arr.isExamine == 1) &&
    arr.docUrl &&
    arr.nodeCode !== 'DesignPictureUpload' &&
    arr.nodeCode !== 'SampleUpload'
  ) {
    uploadList.value = arr.docUrl.split(',').map((item) => {
      let array = item.split('?name=')
      return {
        name: array.length > 1 && array[1] && array[1] !== 'undefined' ? array[1] : array[0],
        url: array[0]
      }
    })
  }

  if (formInline.value.examineInfo) {
    formInline.value.examineInfo = handleJSONParse(formInline.value.examineInfo)
    if (formInline.value.examineInfo && formInline.value.examineInfo.length > 0) {
      formInline.value.examineInfo.forEach((item) => {
        let fileArr = []
        if (item.examineNodeFile) {
          fileArr = item.examineNodeFile.split(',')
        }
        item.uploadList = []
        item.fileList = []
        fileArr.forEach((file, index) => {
          let array = file.split('?name=') || []
          if (array.length > 1) {
            item.uploadList.push({
              name: array.length > 1 && array[1] && array[1] !== 'undefined' ? array[1] : array[0],
              url: array[0]
            })
          }
        })
      })
    }
  }
  if (!formInline.value.nodeStatus) {
    // 如果返回的提交人状态为空，则默认未提交
    formInline.value.nodeStatus = 0
  }
  if (!formInline.value.nodeStatus2) {
    // 如果返回的审核人状态为空，则默认未提交
    formInline.value.nodeStatus2 = 0
  }
  progressContentHeight.value = window.innerHeight - 80
  nextTick(() => {
    getHeight(0)
  })
}
const uploadList = ref<any[]>([])

// 打开弹窗
const rowData = ref() // 行数据
const currentId = ref('') // 当前编辑的 id
const productType = ref(0) // 产品类型
const contentWapperRef = ref()
const open = async (row) => {
  isVisible.value = true

  currentId.value = row.id
  productType.value = Number(row.productType || '')
  rowData.value = row

  selectId.value = ''
  nodeList.value = []
  Promise.all([getNodeList(true)])
    .then(() => {
      getHeight()
    })
    .catch((error) => { })

  await nextTick()
}

const swProgressNodeRef = ref()
// 滚动到当前正在进行的节点
const scrollCurrentNode = () => {
  let currentIndex = -1
  nodeList.value.some((item, index) => {
    if (Number(item.status || 0) === 1) {
      if (index + 1 < nodeList.value.length) {
        if (Number(nodeList.value[index + 1].status || 0) !== 1) {
          currentIndex = index + 1
          return true;
        }
      }
    }
    return false;
  })
  // if (currentIndex > 0) {
  //   nextTick(() => {
  //     swProgressNodeRef.value?.scrollCurrentNode(currentIndex)
  //   })
  // } else if (currentIndex === -1) {
  //   selectId.value = ''
  //   formInline.value = {}
  // }
  clickCurrentProgressNode(currentIndex)
}

// 是否当前正在进行的节点
const clickCurrentProgressNode = (currentIndex: number) => {
  const index: any = currentIndex === -1 ? nodeList.value.length - 1 : currentIndex
  selectId.value = nodeList.value[index].nodeCode
  selectHandle(nodeList.value[index].nodeCode, nodeList.value[index])
  nextTick(() => {
    swProgressNodeRef.value?.scrollCurrentNode(index)
  })
  // nodeList.value.forEach((item, index) => {
  //   if (Number(item.status || 0) !== 1) {
  //     if (index - 1 >= 0) {
  //       if (Number(nodeList.value[index - 1].status || 0) === 1) {
  //         console.log('ajgsdgasjhgdsjhagsjdhgashj', item, nodeList.value[currentIndex]);
  //         selectId.value = item.nodeCode
  //         selectHandle(item.nodeCode, item)
  //       }
  //     }
  //   }
  // })
}
// 并行头部节点
const parallelHeaderNodeList = ref<any>([])
const getNodeList = async (openLocation = false) => {
  try {
    formLoading.value = true
    const res = await getPlanNodeByDesignId({ npDesignPictureGodownId: currentId.value })
    nodeList.value = res
    // parallelHeaderNodeList.value = getParallelHeaderNodeList(nodeList.value)
    getOtherFiles()
    // if (
    //   parallelHeaderNodeList.value.length > 1 &&
    //   parallelHeaderNodeList.value[1].childNodes &&
    //   parallelHeaderNodeList.value[1].childNodes.length === 1
    // ) {
    //   const oneNode = parallelHeaderNodeList.value[1].childNodes[0]
    //   let tempList = [] as any
    //   nodeList.value.forEach((item) => {
    //     if (item.nodeCode === oneNode.nodeCode) {
    //       tempList.push(item)
    //       item.nextNodeCode = 'hideNode'
    //       let tempObj = { ...item }
    //       tempList.push({
    //         ...tempObj,
    //         id: '9999999',
    //         nodeName: '地方撒发的',
    //         nodeCode: 'hideNode',
    //         preNodeCode: oneNode.nodeCode,
    //         nextNodeCode: oneNode.nextNodeCode,
    //         childNodes: null
    //       })
    //     } else {
    //       tempList.push(item)
    //     }
    //   })
    //   nodeList.value = tempList
    //   parallelHeaderNodeList.value = getParallelHeaderNodeList(nodeList.value)

    // }
    transtoTree(nodeList.value)

    if (openLocation) {
      scrollCurrentNode()
    }
  } finally {
    formLoading.value = false
  }
}

// const chartsRef = ref()
const transtoTree = (nodes: any) => {
  const list: any[] = []
  nodes.forEach((item: any) => {
    const { preNodeCode } = item
    const temp = preNodeCode.split(',')
    temp.forEach((tem: any) => {
      const obj = cloneDeep(item)
      obj['preNodeCode'] = tem
      list.push(obj)
    })
  })
  const tree = redrawTree(list, '0', 'preNodeCode', 'nodeCode')
  swProgressNodeRef?.value?.initCharts(tree, list, {
    mode: 'lengthways',
    site: { x: 115, y: 20 },
    size: { width: 180, height: 80 },
    space: { x: 90, y: 120, },
    corner: {
      right: { addX: 90, addY: 100, reduceY: 20 },
      left: { addX: 90, addY: 100 }
    },
  })
};

// 获取其他文件
const otherFiles = ref([])
const getOtherFiles = () => {
  let fileList = []
  if (nodeList.value && nodeList.value.length > 0) {
    nodeList.value.forEach((item) => {
      if (item.nodeCode !== 'DesignPictureUpload' && item.nodeCode !== 'SampleUpload') {
        // 设计图上传(DesignPictureUpload),样衣上传(SampleUpload)
        let arr = parseExamineInfoFiles(item) || []
        let arr1 = []
        let examineInfo = handleJSONParse((item && item.examineInfo) || [])
        examineInfo.forEach((element) => {
          if (element.examineNodeFile) {
            arr1 = arr1.concat(parsedDocUrls(element.examineNodeFile || ''))
          }
        })
        fileList = fileList.concat(arr, arr1)
      }
    })
  }
  otherFiles.value = fileList || []
}
//
const handleConfirmOperationManager = async (data) => {
  formInline.value.operationalInformationPerson = data.operationalInformationPerson
  formInline.value.operationalInformationPersonList = data.operationalInformationPersonList

  formInline.value.operateDetails = data.operateDetails
}

const handleConfirmPurchaseManager = async (data) => {
  formInline.value.purchaseInformationPerson = data.purchaseInformationPerson
  formInline.value.purchaseInformationPersonList = data.purchaseInformationPersonList
}

const previewHandle = (file) => {
  const imageFormats = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp']
  const extension = file.url.toLowerCase()
  const isImg = imageFormats.some((value) => extension.includes(value))
  console.log(isImg)
  if (isImg) {
    createImageViewer({
      zIndex: 9999999,
      urlList: [file.url]
    })
  } else {
    // window.location.href = file.url
    window.open(file.url, '_blank')
  }
}

// 删除公共字段
const removeFields = (fields) => {
  fields.forEach((field) => {
    if (field in formInline.value) {
      delete formInline.value[field]
    }
  })
}
const confirmDialogRef = ref() // 确认对话框 Ref
const handleSubmitConfirm = () => {
  if (
    formInline.value.nodeCode === 'ProductinformationFilling' ||
    formInline.value.nodeCode === 'ERPInformationFilling' ||
    formInline.value.nodeCode === 'OperationInformationFilling' ||
    formInline.value.nodeCode === 'PreProductionSampleUpload' ||
    formInline.value.nodeCode === 'OperationManagerDistribution'
  ) {
    // 如果是资料填写的节点，提交的时候需要确认对话框确认信息是否填写完成
    confirmDialogRef.value?.open()
  } else {
    save()
  }
}

const save = async () => {
  try {
    submitLoading.value = true
    formInline.value.finishCreated = formatCustomDate(
      new Date().toISOString(),
      'yyyy-MM-dd HH:mm:ss'
    ) // 提交设置为当前时间
    console.log('时间', formInline.value.finishCreated)

    // 删除公共字段
    removeFields([
      'company',
      'isDeleted',
      'createdAt',
      'createdId',
      'updatedAt',
      'updatedId',
      'companyName'
    ])
    const data = {
      ...formInline.value
    }
    data.nodeStatus = 1 // 提交人提交
    // 节点状态 status(0-未开始,1-待审核,2-审核失败,3-已结束)
    // TODO:
    // 如果是已经审核拒绝需要重新提交的情况，需要将审核状态改为0
    if (data.status == 2) {
      data.nodeStatus2 = 0 // 审核人状态
    }

    data.authorOrigin = userStore.user.avatarUrl // 提交人头像
    data.author = userStore.user.realName // 提交人姓名
    // console.log('当前提交人', userStore.user)

    if (data.actualStartTime && data.actualStartTime.indexOf(':') === -1) {
      // data.actualStartTime = data.actualStartTime + ' 00:00:00'
    }
    if (data.actualEndTime && data.actualEndTime.indexOf(':') === -1) {
      // data.actualEndTime = data.actualEndTime + ' 23:59:59'
    }
    if (!data.examineInfo) {
      data.examineInfo = []
    }

    let obj = JSON.parse(JSON.stringify(data))
    if (obj.jsonData) {
      delete obj.jsonData
    }

    await submitUpdate({ ...obj, jsonData: undefined })

    message.success('操作成功')
    // reset()
    emit('success')
    submitSuccess()
    isVisible.value = false
  } catch (error) {
    console.log(error)
  } finally {
    submitLoading.value = false
  }
}

//下面这两个状态都只在最后请求接口的时候才会用到，为了不影响页面显示
const nodeStatus2 = ref(0) // 审核人状态
const nodeStatus = ref(0) // 提交人状态
const flagType = ref() //0 拒绝 1 通过

const auditRefusedDialogRef = ref()
// 审核拒绝
const handleAuditRefuse = async () => {
  auditRefusedDialogRef.value?.open()
}

const auditRefuseSave = () => {
  nodeStatus2.value = 2 //审核人拒绝
  nodeStatus.value = 0 //为了在提交人重新提交的时候展示正常的提交按钮
  flagType.value = 0
  handleAudit()
}

// 审核通过
const handleAuditPass = async () => {
  nodeStatus2.value = 1 //审核人提交
  flagType.value = 1
  handleAudit()
}

// 审核的最终提交
const handleAudit = async () => {
  formInline.value.finishCreated2 = formatCustomDate(
    new Date().toISOString(),
    'yyyy-MM-dd HH:mm:ss'
  ) // 审核设置为当前时间

  // 删除公共字段
  removeFields([
    'company',
    'isDeleted',
    'createdAt',
    'createdId',
    'updatedAt',
    'updatedId',
    'companyName'
  ])

  const data = { ...formInline.value, examineNodeFile: formInline.value.docUrl }

  data.reviewersOrigin = userStore.user.avatarUrl // 审核人头像
  data.reviewers = userStore.user.realName // 审核人姓名
  data.nodeStatus2 = nodeStatus2.value // 审核人状态
  data.nodeStatus = data.nodeStatus2 == 2 ? nodeStatus.value : data.nodeStatus // 当审核人拒绝的时候将提交人状态设置为0

  if (!data.examineInfo) {
    data.examineInfo = []
  }
  if (data.jsonData) {
    delete data.jsonData
  }
  try {
    if (flagType.value == 0) {
      auditRefueLoading.value = true
      //拒绝
      await refuseUpdate({ ...data, jsonData: undefined })
      message.success('操作成功')
      emit('success')
      submitSuccess()

      isVisible.value = false
    } else if (flagType.value == 1) {
      auditPassLoading.value = true
      // 通过
      if (data.nodeCode === 'ConfirmProductDataExamine') {
        // 定品资料审核
        await confirmProductSuccess({ ...data, jsonData: undefined })
      } else {
        await auditSuccessUpdate({ ...data, jsonData: undefined })
      }

      message.success('操作成功')
      emit('success')
      submitSuccess()

      isVisible.value = false
    }
  } catch (err) {
    console.log(err)
    auditRefueLoading.value = false
    auditPassLoading.value = false
  } finally {
    auditRefueLoading.value = false
    auditPassLoading.value = false
  }
}

const displayInfoRef = ref()

const handleSccess = () => {
  // 刷新页面
  submitSuccess()
}

// 刷新页面
const submitSuccess = async () => {
  setTimeout(async () => {
    await getNodeList()
    scrollCurrentNode()
    displayInfoRef.value && displayInfoRef.value.refreshData()
  }, 100)
}

const emit = defineEmits(['success'])

const progressContent = ref(null)
const progressContentHeight = ref(0)
const getHeight = (extraOffset = 0) => {
  setTimeout(() => {
    if (progressContent.value) {
      let height = progressContent.value.offsetHeight + extraOffset
      if (height > window.innerHeight - 80) {
        progressContentHeight.value = height
      } else {
        progressContentHeight.value = window.innerHeight - 80
      }
    }
  }, 100)
}

defineExpose({ open })

const formInlineRef = ref()

const formInlineHeight = computed(() => {
  return formInlineRef.value?.offsetHeight
})

const resizeHandle = ref()
const resizeHandleMove = ref()
const nodeShowHeight = ref(406)

const startResize = (event) => {
  const rect = resizeHandle.value?.getBoundingClientRect() // 获取控制点的位置和尺寸

  const startX = event.clientX // 鼠标按下的X坐标
  const startY = event.clientY // 鼠标按下的Y坐标
  const startHeight = rect.height + 8 // 控制点初始高度

  const resizable = document.querySelector('.resizable') // 获取可调整大小的元素
  console.log('待开发；拉萨反馈；了', startY, event, rect)
  const onMouseMove = (moveEvent) => {
    const dy = moveEvent.clientY - startY // 鼠标移动的Y距离
    if (startHeight + dy >= 406) {
      nodeShowHeight.value = startHeight + dy
      resizable.style.height = `${startHeight + dy}px` // 更新高度
    }
  }
  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove) // 移除鼠标移动事件监听器
    document.removeEventListener('mouseup', onMouseUp) // 移除鼠标松开事件监听器
  }
  document.addEventListener('mousemove', onMouseMove) // 添加鼠标移动事件监听器
  document.addEventListener('mouseup', onMouseUp) // 添加鼠标松开事件监听器
}

const resizeLeftHandle = ref()
const nodeShowWidth = ref(409)

const startResizeWidth = (event) => {
  const rect = resizeLeftHandle.value?.getBoundingClientRect() // 获取控制点的位置和尺寸

  const startX = event.clientX // 鼠标按下的X坐标
  const startY = event.clientY // 鼠标按下的Y坐标
  const startWidth = rect.width + 8 // 控制点初始高度

  const resizable = document.querySelector('.resizableLeft') // 获取可调整大小的元素
  console.log('待开发；拉萨反馈；了', startY, event, rect)
  const onMouseMove = (moveEvent) => {
    const dx = moveEvent.clientX - startX // 鼠标移动的X距离
    if (startWidth - dx >= 409) {
      nodeShowWidth.value = startWidth - dx
      resizable.style.width = `${startWidth - dx}px` // 更新高度
    }
  }
  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove) // 移除鼠标移动事件监听器
    document.removeEventListener('mouseup', onMouseUp) // 移除鼠标松开事件监听器
  }
  document.addEventListener('mousemove', onMouseMove) // 添加鼠标移动事件监听器
  document.addEventListener('mouseup', onMouseUp) // 添加鼠标松开事件监听器
}

const finishedErpNode = ref(false)
const getFinishedErpNode = (flag: boolean) => {
  finishedErpNode.value = flag
}

provide('finishedErpNode', { finishedErpNode })
</script>

<style lang="scss" scoped>
@use './progressDialog.scss';

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 98px;
  height: 98px;
}
</style>
<style lang="scss">
.oadialog-background {
  border-radius: 20px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background: #f4f7fe;

  .dialog-content {
    background: #ffffff;
    border-radius: 20px;
    margin: 0 auto;
    padding-top: 20px;
    box-sizing: border-box;
  }
}

:deep(.el-drawer__body) {
  background: #f8f8f8;
}
</style>
<style scoped>
.resizable {
  position: relative;
  cursor: move;
}

.resize-handle {}
</style>
