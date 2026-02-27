<template>
  <div class="progressMainContent" v-loading="searchLoading" style="width: 100%">
    <!-- <div> -->
    <div style="width: 100%; min-width: 700px; position: relative; box-sizing: border-box">
      <div style="width: 100%; min-width: 1600px; display: flex">
        <div style="display: flex; width: 100%">
          <div class="left" style="overflow: hidden; position: relative; flex: 1">
            <div class="documents" style="padding-right: 0px; width: 209px; border-right: none">
              <CardTitle :title="'文档资料'" />
              <el-collapse class="docCollapse" v-model="collapseItems">
                <el-collapse-item v-for="(doc, index) in documentList" :key="index" :title="doc.label" :name="doc.label"
                  :isActive="true">
                  <fileItem v-if="currentTaskDetails && doc.key !== 'fileUrl'"
                    :fileUrls="currentTaskDetails?.[doc.formKey]?.[doc.key]" />
                  <fileItem v-if="currentTaskDetails && doc.key === 'fileUrl'"
                    :fileUrls="currentTaskDetails?.fileUrl" />
                </el-collapse-item>
              </el-collapse>
            </div>
            <!-- <div style="width: 1px; height: auto; background: rgb(236, 234, 234)"></div> -->
            <div class="infos" style="width: calc(100% - 209px)">
              <infosTable v-for="(table, index) in infoTables" :key="index" :params="table"
                :infoData="currentTaskDetails" @success="getRefreshData" />
            </div>
          </div>
          <!-- 流程节点 -->
          <div class="right" style="background-color: #ffffff; width: 410px; position: relative; padding-right: 10px"
            :style="{ width: `${nodeShowWidth + 16}px` }" ref="resizeLeftHandle">
            <div style="display: flex; position: relative">
              <div style="
                  width: 1px;
                  height: calc(100% - 20px);
                  background: rgb(236, 234, 234);
                  position: absolute;
                  left: 8px;
                  top: 20px;
                "></div>
              <img @mousedown="startResizeWidth" style="
                  width: 16px;
                  height: 16px;
                  cursor: move;
                  z-index: 11;
                  position: absolute;
                  top: 50%;
                  left: 0px;
                " :style="{
                  top: `${nodeShowHeight + 12}px`
                }" src="@/assets/imgs/drag_left_right.png" />
              <div style="width: 410px; margin-left: 16px;" :style="{ width: `${nodeShowWidth}px` }">
                <!-- :config="config" -->
                <card-flow ref="flowRef" @changeSelectedNode="getSelectedNode"
                  @set-node-show-height="setNodeShowHeight" />
                <!-- <nodeProgress @changeSelectedNode="getSelectedNode" :nodeProgressData="currentNodeProgressData" /> -->
                <!-- 节点提交审核相关内容 -->
                <div class="nodeForm" v-if="selectedNode?.taskDefinitionKey">
                  <img @mousedown.stop.passive="startResize" style="
                      width: 16px;
                      height: 16px;
                      cursor: move;
                      z-index: 11;
                      position: absolute;
                      top: -10px;
                      left: 50%;
                    " src="@/assets/imgs/drag_up_down.png" />
                  <div class="formTitle">
                    <div class="nodeName">{{ selectedNode?.taskName }}</div>
                    <div class="nodeOperationBtn" v-if="canAuditOrSubmit && showDialogContent">
                      <el-button type="primary" round @click="goToNodeDetails">
                        进入
                        <img :src="arrowRight" class="ml12px" />
                      </el-button>
                    </div>
                  </div>
                  <div class="formContent" style="padding: 0 10px">
                    <nodeForm :data="currentNodeDetails" :formData="currentNodeForm"
                      :disabled="!showBtns || isPreProductSampleNode" :loading="nodeFormLoading" />
                  </div>
                  <div class="formFooter" style="margin: 0 10px" v-if="showBtns && !isPreProductSampleNode">
                    <div class="auditBtns" v-if="currentNodeDetails?.hasAuditPermission">
                      <el-button @click="handleNodeAudit(0)">审核拒绝</el-button>
                      <el-button type="primary" @click="handleNodeAudit(1)">审核通过</el-button>
                    </div>
                    <template v-if="currentNodeDetails.taskDefinitionKey === 'FsProcurementConfirmation'">
                      <el-button v-if="!([0, 1].includes(currentNodeDetails?.extraData?.procurementConfirmStatus))"
                        @click="openOrderForm">暂定下单</el-button>
                      <el-button type="primary" v-if="currentNodeDetails?.hasSubmitPermission"
                        @click="handleNodeSubmit">{{ !([0,
                          1].includes(currentNodeDetails?.extraData?.procurementConfirmStatus)) ? '确定下单' : '重新下单'
                        }}</el-button>
                    </template>
                    <el-button v-else type="primary" v-if="currentNodeDetails?.hasSubmitPermission"
                      @click="handleNodeSubmit">提交</el-button>
                  </div>
                </div>
                <!-- 审核记录 -->
                <div class="auditLogs" v-if="currentNodeDetails?.auditRecords?.length">
                  <nodeAuditRecords :list="currentNodeDetails?.auditRecords" :taskName="selectedNode?.taskName" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- </div> -->
    <!-- 任务详情数据展示 -->

    <el-dialog title="应用范围" v-model="dialogVisible" append-to-body :show-close="false"
      style="width: 570px; border-radius: 14px">
      <template #header>
        <div class="header">
          <div>{{ selectedNode?.taskName }}</div>
          <img src="@/assets/imgs/common/close.png" alt="" @click="dialogVisible = false" />
        </div>
      </template>
      <div class="container" v-loading="nodeFormLoading">
        <el-form :model="form" label-width="80px" ref="formRef" :validate-on-rule-change="false" :rules="{
          auditComment: [{ required: true, message: '请输入拒绝原因', trigger: 'blur' }]
        }">
          <el-form-item label="拒绝原因" prop="auditComment">
            <s-text-area v-model="form.auditComment" :placeholder="`请输入审批备注`" />
          </el-form-item>
          <el-form-item label="附件" prop="auditFile">
            <transfer :upLoad-data="{ code: 'FS_SUPPLIER_PLAN' }" :width="468" v-model="form.auditFile" :limit="5"
              :tip="'最多上传5张大小不超过20M的图片'" is-all />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">提 交</el-button>
      </template>
    </el-dialog>

    <el-dialog title="暂定下单" v-model="orderDialogVisible" append-to-body :show-close="false" style="
      border-radius: 8px;
      transform: none;
      position: static;
      margin-top: var(--el-dialog-margin-top) !important;
      padding: 0 0 20px 0;
    " width="570" top="35vh">
      <template #header>
        <div class="header" style="display: flex;
        align-items: center;
        justify-content: space-between;
        font-weight: bold;
        padding: 16px 20px;
        border-bottom: solid #f0f0f0 1px;
      ">
          <div>暂定下单</div>
          <img src="@/assets/imgs/common/close.png" alt="" @click="dialogVisible = false" />
        </div>
      </template>
      <div style="padding: 0 16px;">
        <el-form :model="currentNodeForm" label-width="80px" ref="orderFormRef" :validate-on-rule-change="false" :rules="{
          tentativeOrderReason: [{ required: true, message: '请输入暂定下单原因', trigger: 'blur' }]
        }">
          <el-form-item label="暂定下单原因" prop="tentativeOrderReason">
            <template #label>
              <div style="height: 32px;">
                <div style="height: 16px;line-height: 16px;color: #666666;">暂定下单</div>
                <div style="height: 16px;line-height: 16px;color: #666666;">原因</div>
              </div>
            </template>
            <s-text-area v-model="currentNodeForm.tentativeOrderReason" :placeholder="`请输入暂定下单原因`" show-word-limit
              :maxlength="200" :rows="6" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="orderDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitOrderForm(false)" style="margin-right: 20px;">提 交</el-button>
      </template>
    </el-dialog>
  </div>

  <!-- 节点进入 -->
  <component :is="showDialogContent" :info="currentTaskDetails" ref="showDialogContentRef" @success="getRefreshData" />
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import CardFlow from './components/cardFlow.vue'
import * as factoryPlanApi from '@/api/oa/factory/plan'
import arrowRight from '@/assets/svgs/arrowRight.svg'
import CardTitle from '@/views/OA/factory/components/cardTitle.vue'
import infosTable from './components/infosTable.vue'
import nodeProgress from './components/node/nodeProgress.vue'
import nodeForm from './components/nodeForm.vue'
import nodeAuditRecords from './components/nodeAuditRecords.vue'
import fileItem from '@/views/OA/factory/components/fileItem.vue'
import { infoTables, documentList } from '@/views/OA/factory/planOld/infoTablesOption'
import { treeToArray, redrawTree } from '@/utils'
import supplyAndDemandPlan from './components/supplyAndDemandPlan.vue' // 供需计划
import purchaseManagerDistribution from './components/purchaseManagerDistribution.vue' //采购主管分配
import purchaseInfo from './components/purchaseInfo.vue' //采购信息
import preProductionSamplesInfo from './components/preProductionSamplesInfo.vue' // 产前样详情(上传，审核)
import orderInfoFilling from './components/orderInfoFilling.vue'
import orderDistributionPersonnel from './components/orderDistributionPersonnel.vue'

const dialogVisible = ref(false),
  form = ref<any>({}),
  formRef = ref()

const route = useRoute() // 路由
const message = useMessage()
const fsTaskId = route.params.id // 二开任务id
const supplierId = route.query.supplierId // 供应商id
const searchLoading = ref(false),
  flowRef = ref()
const currentNodeProgressData = ref<any>() // 节点流程数据
const currentTaskDetails = ref<any>() // 当前任务详情数据
onMounted(async () => {
  await getRefreshData()
})

const config = computed(() => [
  {
    id: 'FactorySecondaryDevelopment',
    taskName: '二开发起',
    site: { x: 90, y: 20 },
    size: { width: 180, height: 80 }
  },
  {
    id: 'FsDevPlanExamine',
    taskName: '二开审核',
    site: { x: 90, y: 140 },
    size: { width: 180, height: 80 }
  },
  {
    id: 'FsSupplierChainDistribution',
    taskName: '供应链开发分配',
    site: { x: 0, y: 260 },
    size: { width: 180, height: 80 }
  },
  {
    id: 'FSSupplierChainSpecialistMatch',
    taskName: '匹配供应商',
    site: { x: 0, y: 380 },
    size: { width: 180, height: 80 }
  },
  {
    id: 'FsSamplingProgress',
    taskName: '打样进度',
    site: { x: 90, y: 500 },
    size: { width: 180, height: 80 }
  },
  {
    id: 'FsProcurementConfirmation',
    taskName: '采购确认',
    site: { x: 90, y: 620 },
    size: { width: 180, height: 80 }
  },
  {
    id: 'FsOrderDistributionPersonnel',
    taskName: '下单人员分配',
    site: { x: 90, y: 740 },
    size: { width: 180, height: 80 }
  },
  {
    id: 'FSOrderInformationFill',
    taskName: '下单信息填写',
    site: { x: 90, y: 860 },
    size: { width: 180, height: 80 }
  },
  {
    id: 'FSSupplyAndDemandPlan',
    taskName: '供需计划审批',
    site: { x: 90, y: 980 },
    size: { width: 180, height: 80 },
    isliberty: true
  },
  {
    id: 'FSPurchaseManagerDistribution',
    taskName: '采购主管分配',
    site: { x: 90, y: 1100 },
    size: { width: 180, height: 80 },
    isliberty: true
  },
  {
    id: 'FSProcurementNotice',
    taskName: '采购信息填写',
    site: { x: 90, y: 1220 },
    size: { width: 180, height: 80 },
    isliberty: true
  },
  {
    id: 'FsDevelopManagerDistribution',
    taskName: '产研主管分配',
    site: { x: 180, y: 260 },
    size: { width: 180, height: 80 },
  },
  {
    id: 'FSPPSampleUpload',
    taskName: '产前样审核',
    site: { x: 90, y: 1340 },
    size: { width: 180, height: 80 },
    isliberty: true
  }
])

const getRefreshData = async () => {
  searchLoading.value = true
  try {
    const data = await factoryPlanApi.getProgressDashboard({ fsTaskId, supplierId });
    const list: any = treeToArray([data], 'taskDefinitionKey', 'nextProgress');
    flowRef?.value?.initCharts([data], list,
      {
        mode: 'lengthways',
        site: { x: 115, y: 20 },
        size: { width: 180, height: 80 },
        space: { x: 90, y: 120, },
        corner: {
          right: { addX: 90, addY: 100, reduceY: 20 },
          left: { addX: 90, addY: 100 }
        },
      })
    const detailData = await factoryPlanApi.querySupplierTaskDetail(fsTaskId, supplierId)
    currentTaskDetails.value = detailData
  } finally {
    searchLoading.value = false
  }
}

const collapseItems = computed(() => {
  return documentList.map((el) => el.label)
})

// 选中节点
const showDialogContent = shallowRef()
const showDialogContentRef = ref()
const selectedNode = ref<any>()
const currentNodeDetails = ref<any>()
const currentNodeForm = ref<any>({
  taskDefinitionKey: '',
  fsTaskId: route.params.id,
  supplierId: route.query.supplierId,
  auditStatus: undefined,
  auditComment: '',
  auditFile: '',
  procurementConfirmStatus: '1',
  tentativeOrderReason: ''
})
const getSelectedNode = async (node: any) => {
  // 针对历史记录，没有二开审核记录
  // if (node.mock) {
  //   selectedNode.value = {}
  //   currentNodeDetails.value = {}
  //   return
  // }
  selectedNode.value = node
  const currentNodeDetail = await factoryPlanApi.queryNodeDetail({
    fsTaskId,
    supplierId,
    taskDefinitionKey: node.taskDefinitionKey
  })
  currentNodeDetails.value = {
    ...currentNodeDetail,
    ...selectedNode.value
  }
  currentNodeForm.value = {
    ...currentNodeForm.value,
    taskDefinitionKey: node.taskDefinitionKey,
    auditFile: node.attachmentUrl
  }
  switch (node.taskDefinitionKey) {
    case 'FSSupplyAndDemandPlan':
      showDialogContent.value = supplyAndDemandPlan
      break
    case 'FSPurchaseManagerDistribution':
      showDialogContent.value = purchaseManagerDistribution
      break
    case 'FSProcurementNotice':
      showDialogContent.value = purchaseInfo
      break
    case 'FSPPSampleUpload':
      showDialogContent.value = preProductionSamplesInfo
      break
    case 'FSOrderInformationFill':
      showDialogContent.value = orderInfoFilling
      break
    case 'FsOrderDistributionPersonnel':
      showDialogContent.value = orderDistributionPersonnel
      break
    default:
      showDialogContent.value = null
  }
}

// 节点正在进行中
const isNodeInProgress = (node: any) => {
  return node?.status === 'active'
}

const canAuditOrSubmit = computed(() => {
  return (
    currentNodeDetails.value?.hasAuditPermission || currentNodeDetails.value?.hasSubmitPermission
  )
})
const showBtns = computed(() => {
  const isInProgress = isNodeInProgress(selectedNode.value)
  return isInProgress && canAuditOrSubmit.value
})

// 产前样节点 在内部提交或者审核
const isPreProductSampleNode = computed(() => {
  return selectedNode.value.taskDefinitionKey === 'FSPPSampleUpload'
})

// 进入节点详情
const goToNodeDetails = async () => {
  showDialogContentRef.value?.open(
    fsTaskId,
    supplierId,
    showBtns.value,
    currentNodeDetails.value?.hasAuditPermission,
    currentNodeDetails.value?.hasSubmitPermission
  )
}

// 清除数据
const resetNodeForm = () => {
  currentNodeForm.value = {
    taskDefinitionKey: '',
    fsTaskId: route.params.id,
    supplierId: route.query.supplierId,
    auditStatus: undefined,
    auditComment: '',
    auditFile: '',
    procurementConfirmStatus: '1',
    tentativeOrderReason: ''
  }
}

const nodeFormLoading = ref(false)
// 节点审核
const handleNodeAudit = async (status: number) => {
  if (status === 1) {
    const msg = status === 1 ? '审核通过' : '审核拒绝'
    await message.confirm(`是否${msg}当前节点（${selectedNode.value?.taskName}）？`)
    currentNodeForm.value.auditStatus = status
    nodeFormLoading.value = true
    try {
      await factoryPlanApi.auditSupplierFlow({ ...currentNodeForm.value })
      message.success('节点审核完成')
      resetNodeForm()
      await getRefreshData()
    } finally {
      nodeFormLoading.value = false
    }
  } else {
    dialogVisible.value = true
    form.value = {}
  }
}

const submitForm = async () => {
  formRef?.value.validate(async (val: boolean) => {
    if (val) {
      await message.confirm(`是否审核拒绝当前节点（${selectedNode.value?.taskName}）?`)
      currentNodeForm.value.auditStatus = 0
      nodeFormLoading.value = true
      const params = {
        ...currentNodeForm.value,
        ...form.value
      }
      try {
        await factoryPlanApi.auditSupplierFlow(params)
        message.success('节点审核完成')
        resetNodeForm()
        await getRefreshData()
      } finally {
        dialogVisible.value = false
        nodeFormLoading.value = false
      }
    }
  })
}

// 节点提交
const handleNodeSubmit = async () => {
  await message.confirm(`是否已完成当前节点（${selectedNode.value?.taskName}）？`)
  nodeFormLoading.value = true
  const params = {
    ...currentNodeForm.value,
    taskDefinitionKey: selectedNode.value?.taskDefinitionKey
  }
  try {
    await factoryPlanApi.auditSupplierFlow(params)
    message.success('节点提交完成')
    resetNodeForm()
    await getRefreshData()
  } finally {
    nodeFormLoading.value = false
  }
}

const resizeLeftHandle = ref()
const nodeShowWidth = ref(410)

const startResizeWidth = (event) => {
  const rect = resizeLeftHandle.value?.getBoundingClientRect() // 获取控制点的位置和尺寸

  const startX = event.clientX // 鼠标按下的X坐标
  const startY = event.clientY // 鼠标按下的Y坐标
  const startWidth = rect.width + 8 // 控制点初始高度

  const resizable = document.querySelector('.right') // 获取可调整大小的元素
  const onMouseMove = (moveEvent) => {
    const dx = moveEvent.clientX - startX // 鼠标移动的X距离
    if (startWidth - dx >= 410) {
      nodeShowWidth.value = startWidth - dx
      // resizable.style.width = `${nodeShowWidth.value - 2}px` // 更新高度
      flowRef.value.resize(nodeShowWidth.value - 2)
    } else {
      nodeShowWidth.value = 410
      flowRef.value.resize(408)
    }
  }
  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove) // 移除鼠标移动事件监听器
    document.removeEventListener('mouseup', onMouseUp) // 移除鼠标松开事件监听器
  }
  document.addEventListener('mousemove', onMouseMove) // 添加鼠标移动事件监听器
  document.addEventListener('mouseup', onMouseUp) // 添加鼠标松开事件监听器
}

const nodeShowHeight = ref(400)
const startResize = (event) => {
  flowRef.value.startResize(event)
}

const setNodeShowHeight = (height) => {
  nodeShowHeight.value = height
}

const orderDialogVisible = ref(false)
const orderFormRef = ref()

const openOrderForm = () => {
  orderDialogVisible.value = true
  nextTick(() => {
    orderFormRef?.value.resetFields()
  })
}

const submitOrderForm = (flag: boolean = false) => {
  orderFormRef?.value.validate(async (valid: boolean) => {
    if (valid) {
      currentNodeForm.value.procurementConfirmStatus = flag ? '1' : '0'
      try {
        const data = {
          taskDefinitionKey: selectedNode.value.taskDefinitionKey,
          procurementConfirmStatus: flag ? '1' : '0',
          ...currentNodeForm.value,
        }
        await factoryPlanApi.auditSupplierFlow(data)
        orderDialogVisible.value = false
        message.success('暂定下单完成')
        resetNodeForm()
        await getRefreshData()
      } catch (e) {

      }
    }
  })
}
</script>

<style lang="scss" scoped>
@use '@/views/OA/factory/style/progress.scss';

:deep(.el-collapse-item__header) {
  // width: calc(100% - 32px);
  padding: 0 16px !important;
  min-height: 45px !important;
  box-sizing: border-box;
}

.progressMainContent {
  :deep() {
    .right {
      // width: 360px !important;
      // min-height: 360px !important;
      // border: 1px solid rgb(229, 229, 229);
      // border-radius: 8px;
    }
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;

  img {
    width: 14px;
    cursor: pointer;
  }
}
</style>
