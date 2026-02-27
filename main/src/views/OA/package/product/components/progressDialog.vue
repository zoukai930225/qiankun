<!-- 进度维护详情 -->
<template>
  <div class="progressMainContainer">
    <div ref="contentWapperRef">
      <div class="drawer-wapper">
        <div class="content-wapper">
          <div style="display: flex; flex-direction: row">
            <div class="left-wapper">
              <div style="margin-right: 16px; height: auto" v-if="rowData">
                <!-- 左侧 & 中间信息 -->
                <displayInfo ref="displayInfoRef" :rowData="rowData" :key="rowData.id"
                  :progressContentHeight="progressContentHeight" :nodeList="nodeList" :otherFiles="otherFiles" />
              </div>
            </div>
            <!-- 右侧 -->
            <div style="width: 10px"></div>

            <div class="right-wapper">
              <div style="width: 409px; height: auto; overflow: auto" ref="progressContent">
                <div style="
                    width: 389px;
                    background: #ffffff;
                    margin-bottom: 15px;
                    border-radius: 6px;
                    height: 406px;
                  ">
                  <div style="
                      margin-top: 10px;
                      padding-right: 8px;
                      max-height: 404px;
                      overflow: hidden;
                    ">
                    <div style="height: 2px"></div>
                    <!-- 右上节点流程图 -->
                    <SWProgressNode style="margin-left: 2px; width: calc(100% + 6px); max-height: 404px"
                      ref="swProgressNodeRef" :parallelHeaderNodeList="parallelHeaderNodeList" :node-list="nodeList"
                      :selectId="selectId" @select-handle="selectHandle" />
                  </div>
                </div>
                <ContentWrap v-if="formInline.nodeCode">
                  <div class="drawerContent nodeForm">
                    <!-- 右下信息（节点信息进入） -->
                    <SWProgressNodeEnter :form-inline="formInline" :designInfo="displayInfoRef?.getDesignInfo()"
                      @success="handleSccess" />
                    <el-form :inline="true" :model="formInline" label-width="140px" style="margin-left: -5px"
                      v-loading="formLoading">
                      <el-form-item label="节点名称" prop="nodeName">
                        <div class="drawerContent-disabledInput">{{ formInline.nodeName }}</div>
                      </el-form-item>
                      <el-form-item label="提交人">
                        <div class="drawerContent-disabledInput"
                          style="display: flex; align-items: center; flex-wrap: wrap">
                          <span class="itemValue" v-for="item in formInline.submitUserList" :key="item.userId">
                            <img class="avatorLogo" :src="item.userAvatarOrigin" alt="" />
                            <span class="itemDesc">{{ item.userName }} </span></span>
                        </div>
                      </el-form-item>

                      <el-form-item label="节点计划结束时间" prop="planEndTime">
                        <div class="drawerContent-disabledInput">{{
                          formInline.planEndTime
                            ? formatDate(new Date(formInline.planEndTime), 'YYYY-MM-DD HH:mm')
                            : '--'
                        }}</div>
                      </el-form-item>

                      <el-form-item label="备注" style="width: 100%" prop="comment"
                        :rules="[{ required: false, message: '请输入备注', trigger: 'blur' }]">
                        <s-text-area style="width: calc(100% - 0px)" v-model.trim="formInline.comment" placeholder="请输入"
                          :autosize="{ minRows: 4, maxRows: 4 }" />
                      </el-form-item>

                      <el-form-item label="附件" style="width: 100%">
                        <el-upload style="width: 60%" v-model:file-list="fileList" :action="importUrl" class="upload"
                          :headers="uploadHeaders" name="files" :show-file-list="false"
                          :data="{ code: 'NEW_PRODUCT', businessForeignKey: selectId }" :on-error="uploadError"
                          :on-success="uploadSuccess" :before-upload="beforeUpload" :disabled="false"
                          v-if="formInline.status != 'Completed' && isCurrentPeople">
                          <el-button type="primary" :loading="auditUploadLoading">点击上传</el-button>
                        </el-upload>
                        <div style="color: #666666" v-if="
                          uploadList && uploadList.length == 0 && formInline.status == 'Completed'
                        ">暂无附件</div>
                      </el-form-item>
                      <ul v-if="uploadList && uploadList.length > 0" class="file-list"
                        :class="{ 'file-list1': !isCurrentPeople }">
                        <li v-for="(item, index) in uploadList" :key="item.url">
                          <el-icon class="document">
                            <Document />
                          </el-icon>
                          <div class="name text1" style="max-width: 250px" @click="previewHandle(item)">{{ item.name }}
                          </div>
                          <!-- 删除按钮会在提交人未提交，或者审核人拒绝的情况下展示 -->
                          <el-icon class="close" @click="delHandle(item, index)">
                            <Close />
                          </el-icon>
                        </li>
                      </ul>
                    </el-form>
                  </div>
                </ContentWrap>

                <div class="btn-wapper" style="margin-right: 10px">
                  <el-button v-if="
                    formInline.nodeType == 2 && formInline.status == 'active' && isCurrentPeople
                  " type="primary" :loading="submitLoading" @click="handleSubmitConfirm">提 交</el-button>
                  <!-- 目前没有审核节点 所以把逻辑删除 -->
                  <div v-if="
                    formInline.nodeType == 1 && formInline.status == 'active' && isCurrentPeople
                  ">
                    <el-button @click="save('0')" :loading="submitLoading">审核拒绝</el-button>
                    <el-button type="primary" :loading="submitLoading" @click="save('1')">审核通过</el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 如果是资料填写的节点，提交的时候需要确认对话框确认信息是否填写完成 -->

    <confirmDialog ref="confirmDialogRef" @confirm="save" :title="'系统提醒'" cancelText="关闭" confirmText="确认"
      :content="`是否已完成${formInline.nodeName}？`" />
  </div>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { getPlanNodeByDesignId, submitUpdate } from '@/api/oa/package/develop'
import { createImageViewer } from '@/components/ImageViewer'
import { useUserStore } from '@/store/modules/user'
import { getAccessToken } from '@/utils/auth'
import { formatDate } from '@/utils/formatTime'
import {
  getParallelHeaderNodeList,
  handleJSONParse,
  parsedDocUrls,
  parseExamineInfoFiles
} from '@/views/OA/package/product/utils.js'
import { cloneDeep } from 'lodash-es'

import displayInfo from './displayInfo/displayInfo.vue'
import SWProgressNode from './SWProgressNode.vue'
import SWProgressNodeEnter from './SWProgressNodeEnter.vue'

import confirmDialog from './confirmDialog.vue'
const importUrl =
  import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL + '/api/ossInfo/upload'
const uploadHeaders = ref({ token: getAccessToken() }) // 上传 Header 头

const formLoading = ref(false) //表单加载状态
const message = useMessage() // 消息弹窗
const isVisible = ref(false)
const loading = ref(false)
const nodeList = ref<any[]>([])
const userStore = useUserStore()
const uploadLoading = ref(false) //上传loading
const auditUploadLoading = ref(false) //上传loading
const submitLoading = ref(false) //提交loading
//当前节点信息
const formInline = ref({
  id: '',
  nodeName: '',
  planEndTime: '',
  produce: '',
  docUrl: '',
  remarks: '', //提交人的备注
  status: undefined, // 节点状态 status(0-未开始,1-待审核,2-审核失败,3-已结束)
  examineInfo: '', //审核信息
  nodeCode: undefined,
  comment: '', // 备注
  taskDefinitionKey: '', // 节点code
  nodeType: undefined, // 节点类型 1-审核节点 2-填写节点
  submitUserList: [] // 提交人列表
})

const isCurrentPeople = computed(() => {
  return (
    formInline.value.submitUserList &&
    formInline.value.submitUserList.map((item) => item?.userId).includes(userStore.user.id)
  )
})

// 当前节点是否可以点击
const currentNodeIsCanClick = (node: any) => {
  if (node && node.status !== 'future') {
    return true
  }
  return false
}

//当前选中的code

const selectId = ref('')
// 选择节点
const selectHandle = (id, arr) => {
  // id node
  if (!currentNodeIsCanClick(arr)) {
    return
  }
  uploadList.value = []
  selectId.value = id
  console.log('当前节点信息', arr)
  formInline.value = arr

  uploadList.value = (arr.attachmentUrl && arr.attachmentUrl.split(',')) || []

  if (arr.attachmentUrl) {
    uploadList.value = arr.attachmentUrl.split(',').map((item) => {
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

  progressContentHeight.value = window.innerHeight - 80
  nextTick(() => {
    getHeight(0)
  })
}
const fileList = ref([])
const uploadList = ref<any[]>([])

// 打开弹窗
const rowData = ref() // 行数据
const currentId = ref('') // 当前编辑的 id
const contentWapperRef = ref()
const open = async (row) => {
  isVisible.value = true
  currentId.value = row.id
  rowData.value = row

  selectId.value = ''
  nodeList.value = []
  Promise.all([getNodeList(true)]).then(() => {
    getHeight()
  })

  await nextTick()
}

const swProgressNodeRef = ref()
// 滚动到当前正在进行的节点
const scrollCurrentNode = () => {
  let currentIndex = -1
  nodeList.value.forEach((item, index) => {
    if (item.status == 'Completed') {
      if (index + 1 < nodeList.value.length) {
        if (nodeList.value[index + 1].status != 'Completed') {
          currentIndex = index + 1
        }
      }
    }
  })
  if (currentIndex > 0) {
    nextTick(() => {
      swProgressNodeRef.value?.scrollCurrentNode(currentIndex)
    })
  } else if (currentIndex === -1) {
    selectId.value = ''
    formInline.value = {}
  }
  clickCurrentProgressNode()
}

// 是否当前正在进行的节点
const clickCurrentProgressNode = () => {
  nodeList.value.forEach((item, index) => {
    if (item.status != 'Completed') {
      if (index - 1 >= 0) {
        if (nodeList.value[index - 1].status == 'Completed') {
          selectId.value = item.nodeCode
          selectHandle(item.nodeCode, item)
        }
      }
    }
  })
}
// 并行头部节点
const parallelHeaderNodeList = ref([])
const getNodeList = async (openLocation = false) => {
  try {
    formLoading.value = true

    const params = {
      enterprisePlanId: rowData.value.id || '', //企划id
      taskId: rowData.value.developmentPlanId, //任务id
      designGalleryId: rowData.value.designGalleryId || '' //设计图id
    }
    const res = await getPlanNodeByDesignId(params)
    const res1 = formatNodeListTree(res)
    nodeList.value = res1
    parallelHeaderNodeList.value = getParallelHeaderNodeList(cloneDeep(res1))

    getOtherFiles()
    if (openLocation) {
      scrollCurrentNode()
    }
  } finally {
    formLoading.value = false
  }
}

const formatNodeListTree = (res1) => {
  if (typeof res1 === 'string') return res1
  const arr = [res1]

  const result = []

  const traverse = (nodes, preNodeCode = 0, parentIndex = '') => {
    nodes.forEach((node, idx) => {
      const nodeCode = node.taskDefinitionKey
      const nextNodeArr = node.nextProgress?.map((item) => item.taskDefinitionKey)?.join() || ''
      let childNodes1 = null
      const currentIndex = parentIndex === '' ? `${idx}` : `${parentIndex}-${idx}`

      if (node.nextProgress && node.nextProgress.length > 1) {
        childNodes1 = node.nextProgress.map((item, childIdx) => {
          return {
            ...item,
            nodeCode: item.taskDefinitionKey,
            preNodeCode: nodeCode,
            nextNodeCode: item.nextProgress?.map((n) => n.taskDefinitionKey).join() || '',
            childNodes: null,
            nodeName: item?.taskName,
            nextProgress: null,
            index: `${currentIndex}-${childIdx}` // 分支子节点index
          }
        })
      }

      const flatNode = {
        ...node,
        nodeName: node?.taskName,
        nodeCode,
        preNodeCode,
        nextNodeCode: nextNodeArr,
        childNodes: childNodes1,
        nextProgress: null,
        index: currentIndex // 当前节点index
      }
      result.push(flatNode)

      // 递归下一级
      if (node.nextProgress && node.nextProgress.length > 0) {
        traverse(cloneDeep(node.nextProgress), nodeCode, currentIndex)
      }
    })
  }

  traverse(arr)

  console.log('平铺节点', cloneDeep(result))
  //result 遍历result 如果nodeCode 和 nodeName 和 nextNodeCode 都相同 这两项合并 preNodeCode是相同节点的并集 字符串用逗号分隔
  const mergedResult = []
  result.forEach((item) => {
    const existingItem = mergedResult.find(
      (i) =>
        i.nodeCode === item.nodeCode &&
        i.nodeName === item.nodeName &&
        i.nextNodeCode === item.nextNodeCode
    )
    if (existingItem) {
      const preNodeCodes = new Set(
        existingItem.preNodeCode.split(',').concat(item.preNodeCode.split(','))
      )
      existingItem.preNodeCode = Array.from(preNodeCodes).join(',')
    } else {
      mergedResult.push({ ...item })
    }
  })
  console.log('合并后节点', cloneDeep(mergedResult))

  // 比如  preNodeCode: "DesignPictureExamine,SupplierChainDistribution"
  //  循环数组 当前项的preNodeCode包含两项。那么去数组中找 nodecode包含在这两项中的节点排到当前项的前面
  const finalResult = []
  mergedResult.forEach((item) => {
    const preNodeCodes = item.preNodeCode == 0 ? '0' : item.preNodeCode.split(',')
    if (preNodeCodes.length > 1) {
      preNodeCodes.forEach((code) => {
        const foundIndex = mergedResult.findIndex((i) => i.nodeCode === code)
        if (foundIndex !== -1) {
          const foundItem = mergedResult[foundIndex]
          if (!finalResult.includes(foundItem)) {
            finalResult.push(foundItem)
          }
        }
      })
      if (!finalResult.includes(item)) {
        finalResult.push(item)
      }
    } else {
      if (!finalResult.includes(item)) {
        finalResult.push(item)
      }
    }
  })
  console.log('最终节点', cloneDeep(finalResult))

  return cloneDeep(finalResult)
}

// 获取其他文件
const otherFiles = ref([])
const getOtherFiles = () => {
  let fileList = []
  if (nodeList.value && nodeList.value.length > 0) {
    nodeList.value.forEach((item) => {
      let arr = parseExamineInfoFiles(item) || []
      let arr1 = []
      let examineInfo = handleJSONParse((item && item.examineInfo) || [])
      examineInfo.forEach((element) => {
        if (element.examineNodeFile) {
          arr1 = arr1.concat(parsedDocUrls(element.examineNodeFile || ''))
        }
      })
      fileList = fileList.concat(arr, arr1)
    })
  }
  otherFiles.value = fileList || []
}

// 图片上传成功提示
const uploadSuccess = (res: any): void => {
  uploadList.value.push({ url: res.data[0].fileUrl, name: res.data[0].fileName })
  uploadLoading.value = false
  auditUploadLoading.value = false
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
const delHandle = (item, index) => {
  uploadList.value.splice(index, 1)
}
// 图片上传错误提示
const uploadError = () => {
  uploadLoading.value = false
  auditUploadLoading.value = false
  message.notifyError('图片上传失败，请您重新上传！')
}

const beforeUpload = (file) => {
  uploadLoading.value = true
  auditUploadLoading.value = true
}

const confirmNodeCodes = [
  'ProductInformationFilling',
  'ERPInformationFilling',
  'SupplyAndDemandPlan',
  'PurchaseManagerDistribution',
  'ProcurementNotice',
  'ApplicationProcurementPlan'
]
const confirmDialogRef = ref() // 确认对话框 Ref
const handleSubmitConfirm = () => {
  if (formInline.value.nodeCode && confirmNodeCodes.includes(formInline.value.nodeCode)) {
    // 如果是资料填写的节点，提交的时候需要确认对话框确认信息是否填写完成
    confirmDialogRef.value?.open()
  } else {
    save()
  }
}

const save = async (type = '1') => {
  try {
    submitLoading.value = true
    if (fileList.value?.length > 0) {
      const url = fileList.value
        .map((item) => {
          return (
            item?.response?.data[0]?.fileUrl + '?name=' + (item?.response?.data[0]?.fileName || '')
          )
        })
        .join(',')
      formInline.value.auditFile = url
    }

    const data = {
      enterprisePlanId: rowData.value.id, //企划id
      developmentTaskId: rowData.value.developmentPlanId, //开发任务id
      designerGalleryId: rowData.value.designGalleryId, //产品设计图库id
      productPlanId: rowData.value.productPlanId, //开发计划id
      taskDefinitionKey: formInline.value.taskDefinitionKey, //节点code
      auditStatus: type, //审核状态 审批状态（0：拒绝，1：通过）
      auditComment: formInline.value.comment, //审核意见
      auditFile: formInline.value.auditFile //审核附件
    }

    await submitUpdate(data)

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
