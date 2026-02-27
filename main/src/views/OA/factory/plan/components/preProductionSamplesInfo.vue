<template>
  <SWDrawer v-model="visible" :title="title" @close="handleClose" :width="1300">
    <div class="content" v-loading="loading">
      <div class="left">
        <el-card shadow="never" class="commonCard" v-loading="operationLoading">
          <template #header>
            <CardTitle :title="'操作日志'" />
          </template>
          <operationLogs :operationRecords="operationLog" v-if="isShowOperation" />
          <div class="inner" v-else style="margin-top: 200px;">
            <div class="flex-column empty">
              <img class="empty-table" style="width: 100%;height: 170px;" src="@/assets/imgs/promotion/empty.png"
                alt="" />
              <span>暂无数据</span>
            </div>
          </div>
        </el-card>
      </div>
      <div class="right">
        <el-card shadow="never" class="commonCard">
          <!-- 搜索 -->
          <div class="search">
            <el-form :inline="true" ref="formRef" :model="formData">
              <el-form-item label="颜色" prop="color">
                <el-input class="!w170px" @keydown.enter="handleSearch" @clear="handleSearch" v-model="formData.color"
                  placeholder="请输入颜色" clearable />
              </el-form-item>
              <el-form-item label="尺码" prop="size">
                <el-select class="!w170px" @change="handleSearch" @clear="handleSearch" collapse-tags
                  collapse-tags-tooltip v-model="formData.size" placeholder="请选择尺码" clearable multiple>
                  <el-option v-for="dict in getIntDictOptions(DICT_TYPE.NP_DESIGN_PRODUCT_SIZE, true)" :key="dict.value"
                    :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <el-select class="!w170px" @change="handleSearch" @clear="handleSearch" collapse-tags
                  collapse-tags-tooltip v-model="formData.status" placeholder="请选择状态" clearable multiple>
                  <el-option v-for="dict in getIntDictOptions(DICT_TYPE.NP_PRENATAL_SAMPLE_EXAMINE_STATUS, true)"
                    :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button @click="handleSearch">搜索</el-button>
                <el-button @click="resetSearch">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          <!-- 审核信息、基本信息 -->
          <div class="info">
            <el-card shadow="never" class="infoCard auditInfo" body-class="auditBody" style="width: 555px;">
              <template #header>
                <div class="header">
                  <CardTitle :title="'审核信息'" />
                  <div class="statusMap">
                    <div class="status" v-for="(status, index) in statusMap" :key="index">
                      <img :src="status.icon" />
                      <span>{{ status.label }}</span>
                    </div>
                  </div>
                </div>
              </template>
              <div class="auditContent">
                <div class="selectAll">
                  <el-checkbox label="全选" size="large" v-model="selectAll" @change="handleSelectSample" />
                </div>
                <el-scrollbar height="400">
                  <el-checkbox-group v-model="selectedList" @change="handleSelectSample">
                    <div class="colorList" v-for="(key, index) in Object.keys(preProSampleList)" :key="index">
                      <div class="row title">{{ key }}</div>
                      <div class="row" v-for="(sample, index) in preProSampleList[key]" :key="index">
                        <!-- :disabled="!sample.examineButtonFlag && !sample.submitButtonFlag" -->
                        <el-checkbox :value="sample" size="large" class="checkbox">
                          <template #default>
                            <span :title="`${sample.color} ${sample.size}`">{{ `${sample.color} ${sample.size}`
                            }}</span>
                          </template>
                        </el-checkbox>
                        <!-- <div class="auditRole">
                          <img :src="getAuditStatus(sample.patternMakerExamineStatus)?.icon" />
                          <span>{{ '版师' }}</span>
                        </div>
                        <div class="auditRole">
                          <img :src="getAuditStatus(sample.designerExamineStatus)?.icon" />
                          <span>{{ '设计师/买手' }}</span>
                        </div> -->
                        <!-- <div class="auditRole">
                          <img :src="getAuditStatus(sample.qaExamineStatus)?.icon" />
                          <span>{{ 'QA' }}</span>
                        </div> -->
                        <div class="status" :class="getSampleStatus(sample.status)?.className">{{
                          getSampleStatus(sample.status)?.text }}</div>
                      </div>
                    </div>
                  </el-checkbox-group>
                </el-scrollbar>
              </div>
            </el-card>
            <el-card shadow="never" class="infoCard basicInfo" body-class="basicBody" footer-class="basicCardFooter">
              <template #header>
                <CardTitle :title="'基础信息'" />
              </template>
              <div class="basicContent">
                <el-scrollbar>
                  <el-table header-cell-class-name="basicTableHeader" :data="selectedTableData">
                    <el-table-column label="颜色" prop="color"></el-table-column>
                    <el-table-column label="尺码" prop="size"></el-table-column>
                  </el-table>
                </el-scrollbar>
              </div>
              <template #footer v-if="isEdit">
                <el-button type="primary" v-if="!!submitList?.length" :disabled="!selectedTableData.length"
                  @click="handelSubmit">提交</el-button>
                <div v-if="!!examineList?.length">
                  <el-button :disabled="!selectedTableData.length" @click="handleAudit(2)">审核拒绝</el-button>
                  <el-button type="primary" :disabled="!selectedTableData.length"
                    @click="handleAudit(1)">审核通过</el-button>
                </div>
              </template>
            </el-card>
          </div>

          <!-- 颜色，尺码进度 -->
          <div class="progress" style=" width: 870px;overflow-y: auto;">
            <div class="progressItem" v-for="(progress, index) in progressList" :key="index"
              :style="{ width: `${(length * 170) > 870 ? (length * 170) : 870}px`, marginBottom: '0px' }">
              <div class="title">{{ progress.label }}</div>
              <el-tooltip>
                <template #content>
                  <div class="tips" v-for="el in progress.list" :key="el.id">
                    <div class="label">{{ el[progress.type] }}</div>
                    <img :src="getSampleStatus(el.status).icon" />
                    <div class="text" :style="{ color: getSampleStatus(el.status)?.color }">{{
                      getSampleStatus(el.status)?.text }}</div>
                  </div>
                </template>
                <div class="content" :style="{ display: 'flex' }">
                  <div class="progressLine" style="flex: 1;" v-for="(item, index) in progress.list" :key="index">
                    <div class="label">{{ item[progress.type] }}</div>
                    <div class="line" :style="{ background: getSampleStatus(item.status)?.bgColor }"></div>
                  </div>
                </div>
              </el-tooltip>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <template #footer>
      <el-button @click="handleClose" class="mr20px">关闭</el-button>
    </template>
  </SWDrawer>
</template>

<script lang="ts" setup>
import * as factoryPlanApi from '@/api/oa/factory/plan'
import CardTitle from '@/views/OA/factory/components/cardTitle.vue';
import operationLogs from './operationLogs.vue';
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import grayDot from '@/assets/svgs/common/dot_gray.svg'
import redDot from '@/assets/svgs/common/dot_red.svg'
import greenDot from '@/assets/svgs/common/dot_green.svg'

import iconWarning from '@/assets/svgs/common/icon_warning.svg'
import iconPass from '@/assets/svgs/common/icon_pass.svg'
import iconFail from '@/assets/svgs/common/icon_fail.svg'
import iconStart from '@/assets/svgs/common/icon_gray.svg'

import { defineProps } from 'vue'

const message = useMessage()

const props = defineProps({
  isAudit: {
    type: Boolean,
    required: false
  },
  forbidEdit: {
    type: Boolean,
    required: false
  }
})

//  QA审核状态（0:未审核，1:通过，2:拒绝）
const statusMap = [
  {
    label: '未审核',
    icon: grayDot
  },
  {
    label: '通过',
    icon: greenDot
  },
  {
    label: '拒绝',
    icon: redDot
  }
]

const getAuditStatus = (qaStatus: number) => {
  return statusMap[qaStatus]
}

// 状态（1:未提交，2:审核中，3:审核通过，4:审核拒绝）
const tipStatusMap = [
  {
    icon: iconStart,
    color: '#666',
    text: '未提交',
    className: ''
  },
  {
    icon: iconWarning,
    color: '#E26A00',
    bgColor: '#E59453',
    text: '审核中',
    className: 'orange'
  },
  {
    icon: iconPass,
    color: '#5DB300',
    bgColor: '#5DB300',
    text: '审核通过',
    className: 'green'
  },
  {
    icon: iconFail,
    color: '#EB3737',
    bgColor: '#EB3737',
    text: '审核拒绝',
    className: 'red'
  }
]

const getSampleStatus = (status: number) => {
  return tipStatusMap[status - 1]
}
const getSampleDisabled = (item: any) => {
  return !!item.submitButtonFlag || !!item.examineButtonFlag;
  // if (auditPermission.value && submitPermission.value) {
  //   return ![1, 2, 4].includes(status)
  // } else if (auditPermission.value && !submitPermission.value) {
  //   return ![2].includes(status)
  // } else if (!auditPermission.value && submitPermission.value) {
  //   return ![1, 4].includes(status)
  // }
  // // if (auditPermission.value) {
  // //   // 如果是审核权限 只能选择审核中的 
  // //   return status !== 2
  // // }
  // // if (submitPermission.value) {
  // //   // 如果是提交权限 只能选择未提交的 或者审核拒绝的
  // //   return status !== 1 && status !== 4
  // // }
  // return false
}

// 选择产前样
const handleSelectSample = () => {
  // selectAll.value = selectedList.value.length ===
  if (selectedList.value && selectedList.value.length) {
    getOperationLogs()
  } else {
    operationLog.value = null
  }
}

/** 搜索 重置 */
const formData = ref({
  color: '',
  size: [],
  status: []
})
const preProSampleList = ref<any>({})
const formRef = ref()
const getSampleList = async (params) => {
  const data = await factoryPlanApi.queryPrenatalSampleList(params)
  preProSampleList.value = data || {}
}
const handleSearch = () => {
  const params = {
    ...formData.value,
    size: formData.value.size.join(','),
    status: formData.value.status.join(','),
    fsTaskId: fsTaskId.value,
    supplierId: supplierId.value
  }
  getSampleList(params)
}

const resetSearch = () => {
  formRef.value?.resetFields()
  handleSearch()
}

const selectedList = ref<any>([])

const getAllSampleList = computed(() => {
  let arr = [] as any
  Object.keys(preProSampleList.value).forEach((key: string) => {
    arr.push(...preProSampleList.value[key])
  })
  // return arr.filter((item: any) => !getSampleDisabled(item.status))
  return arr;
})

const getAllList = computed(() => {
  let arr = [] as any
  Object.keys(preProSampleList.value).forEach((key: string) => {
    arr.push(...preProSampleList.value[key])
  })
  return arr.filter((item: any) => getSampleDisabled(item))
});

const submitList = computed(() => getAllList.value.filter((si: any) => !!si.submitButtonFlag));

const examineList = computed(() => getAllList.value.filter((si: any) => !!si.examineButtonFlag));

// const getSampleIds = computed(() => {
//   return selectedList.value.map((sample) => sample.id)
// })

// 全选
const selectAll = computed({
  get() {
    return getAllSampleList.value.length ? selectedList.value.length === getAllSampleList.value.length : false
  },
  set(val) {
    if (val) {
      selectedList.value = getAllSampleList.value
    } else {
      selectedList.value = []
    }
  }
})

const selectedTableData = computed(() => {
  return selectedList.value.map((item: any) => {
    const { color, size } = item
    return { color, size }
  })
})

//产前样提交
const handelSubmit = async () => {
  if (!selectedList.value.length) message.error('请选择一条数据提交')
  loading.value = true
  const params = {
    fsTaskId: fsTaskId.value,
    supplierId: supplierId.value,
    ids: selectedList.value.filter((si: any) => si.submitButtonFlag === 1).map((si: any) => si.id)
  }
  try {
    await factoryPlanApi.submitPrenatalSample(params)
    message.success('提交成功')
    handleClose()
    emit('success')
  } finally {
    loading.value = false
  }
}

// 产前样审核 QA审核
const handleAudit = async (result: number) => {
  if (!selectedList.value.length) message.error('请选择一条数据审核')
  loading.value = true
  const params = {
    fsTaskId: fsTaskId.value,
    supplierId: supplierId.value,
    ids: selectedList.value.filter((si: any) => si.examineButtonFlag === 1).map((si: any) => si.id),
    examineResult: result
  }
  try {
    await factoryPlanApi.qualificationAudit(params)
    message.success('审核成功')
    handleClose()
    emit('success')
  } finally {
    loading.value = false
  }
}

// 齐色错码进度
const progressList = ref<any>([])

const emit = defineEmits(['success'])
const visible = ref(false)
const title = ref()
const fsTaskId = ref()
const supplierId = ref()
// 产前样操作记录
const operationLog = ref<any>(null)
const operationLoading = ref(false)
const isShowOperation = computed(() => {
  return operationLog.value && !!Object.keys(operationLog.value).length
})
const getOperationLogs = async (ids: Array<string> = selectedList.value) => {
  operationLoading.value = true
  try {
    const data = await factoryPlanApi.getOperateList({
      fsTaskId: fsTaskId.value,
      supplierId: supplierId.value,
      prenatalSampleIds: ids.map((id: any) => id.id)
    })
    operationLog.value = data || null
  } finally {
    operationLoading.value = false
  }

}
// 齐色错码进度
const getSampleProgress = async () => {
  progressList.value = []
  const data = await factoryPlanApi.queryPrenatalSampleProgress({
    fsTaskId: fsTaskId.value,
    supplierId: supplierId.value,
  })
  // 处理数据
  Object.keys(data).forEach((key) => {
    if (data[key]?.length) {
      let label, type
      if (key === 'colorProgress') {
        label = '颜色进度'
        type = 'color'
      }
      if (key === 'sizeProgress') {
        label = '尺码进度'
        type = 'size'
      }
      progressList.value.push({
        label,
        type,
        list: data[key]
      })
    }
  })
}

const length = computed(() => {
  const list: any = progressList.value?.length ? [progressList.value[0].list.length, progressList.value[1].list.length].sort((a, b) => a - b) : [];
  return list[1];

});

// 打开
const loading = ref(false)
const isEdit = ref(true)
const auditPermission = ref(false)
const submitPermission = ref(false)
const open = async (taskId: string, suppId: string, canEdit: boolean, hasAuditPermission: boolean, hasSubmitPermission: boolean) => {
  visible.value = true
  title.value = '产前样详情'
  fsTaskId.value = taskId
  supplierId.value = suppId
  isEdit.value = canEdit
  // auditPermission.value = hasAuditPermission
  // submitPermission.value = hasSubmitPermission
  loading.value = true
  try {
    await handleSearch();
    await getSampleProgress()
  } finally {
    loading.value = false;
  }

}

defineExpose({ open })

const handleClose = () => {
  visible.value = false
  selectedList.value = []
  operationLog.value = null
}
</script>

<style lang="scss" scoped>
@use '@/views/OA/factory/style/preProductSample.scss';

.row {
  :deep() {
    .checkbox {
      width: 190px !important;
    }

    .el-checkbox__label {
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.progressItem {
  :deep() {
    .label {
      min-width: 150px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
    }
  }
}

.empty {
  .empty-table {
    margin: 0 auto;
  }

  span {
    text-align: center;
  }
}
</style>
