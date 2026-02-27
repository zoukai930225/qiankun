<!--
 * @Date: 2025-07-12 10:59:18
-->
<template>
  <div>
    <SWDrawer v-if="visible" v-model="visible" :title="title" @close="handleClose">
      <div>
        <div class="dialog-content">
          <div class="dialog-content-top">
            <!-- search -->
            <div class="flex-row search-wapper">
              <el-form :inline="true" ref="formRef" :model="formData" class="form-inline">
                <el-form-item label="颜色" prop="color" class="form-item">
                  <el-input
                    v-model="formData.color"
                    placeholder="请输入颜色"
                    clearable
                    @keyup.enter="submitForm"
                    @clear="submitForm"
                  />
                </el-form-item>
                <el-form-item label="尺码" prop="size" class="form-item">
                  <el-select
                    v-model="formData.size"
                    placeholder="请选择尺码"
                    @change="storeSelectChange"
                    @clear="submitForm"
                    clearable
                    multiple
                    collapse-tags
                  >
                    <el-option
                      v-for="dict in getIntDictOptions(DICT_TYPE.NP_DESIGN_PRODUCT_SIZE, true)"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="status" class="form-item">
                  <el-select
                    v-model="formData.status"
                    placeholder="请选择状态"
                    @change="statusSelectChange"
                    clearable
                    @clear="submitForm"
                    multiple
                    collapse-tags
                  >
                    <el-option
                      v-for="dict in getIntDictOptions(
                        DICT_TYPE.NP_PRENATAL_SAMPLE_EXAMINE_STATUS,
                        true
                      )"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
              </el-form>
              <div class="search-btn">
                <el-button @click="submitForm">搜索</el-button>
                <el-button @click="resetForm">重置</el-button>
              </div>
            </div>
            <div class="btn-wapper">
              <span class="title"></span>
            </div>
            <!-- contant -->
            <div class="content">
              <div class="content-left">
                <div class="header">
                  <div class="header-left">
                    <div class="header-desc"></div>
                    <div class="title">审核信息</div>
                  </div>
                  <div class="header-right">
                    <div class="item" v-for="status in statusList" :key="status.value">
                      <div :class="['icon', status.class]"></div>
                      <div class="desc">{{ status.label }}</div>
                    </div>
                  </div>
                </div>
                <!-- 全选 -->
                <div class="select-all">
                  <el-checkbox v-model="selectAll" @change="handleSelectAll" v-if="list?.length"
                    >全选</el-checkbox
                  >
                </div>
                <!-- 分组列表 -->
                <div class="group-list">
                  <div v-for="group in list" :key="group.color" class="group">
                    <!-- 分组标题 -->
                    <div class="group-title">{{ group.color }}</div>
                    <!-- 分组内容 -->
                    <div
                      class="group-items"
                      v-for="item in group.children"
                      :key="item.id"
                      @click="itemClick(item)"
                    >
                      <el-checkbox
                        v-model="selectedItems"
                        :label="item"
                        @change="handleAuditChange"
                        :disabled="formatDisabled(item)"
                        @click.stop
                      >
                        {{ item.color }} {{ item.size }}
                      </el-checkbox>
                      <div class="item-status">
                        <div class="status-item" v-for="role in roles" :key="role.field">
                          <template v-for="icon in statusIcons" :key="icon.value">
                            <div
                              v-if="icon.show(item[role.field], item.status)"
                              :class="icon.class"
                            ></div>
                          </template>
                          <div class="state-desc">{{ role.label }}</div>
                        </div>
                        <div
                          class="status"
                          :style="{
                            color: formatStatusColor(item?.status),
                            background: formatStatusBg(item?.status)
                          }"
                        >
                          {{ formatStatus(item?.status) }}</div
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="right-wapper">
                <AuditBaseInfo
                  @audit="handleAudit"
                  @submit="handleSubmit"
                  :selectedItems="selectedItems"
                  :designPictureGodownId="nodeData.npDesignPictureGodownId"
                  :examineButtonFlag="allList.length > 0 && allList[0]?.examineButtonFlag == 1"
                  :submitButtonFlag="allList.length > 0 && allList[0]?.submitButtonFlag == 1"
                />
              </div>
            </div>
            <!-- progress -->
            <div>
              <div class="progress-wapper-title"
                ><span class="desc"></span> <span>齐色错码进度</span></div
              >
              <div class="progress-wapper">
                <div class="progress-title">颜色进度</div>
                <el-tooltip placement="top">
                  <template #content>
                    <div v-if="colorProgressList?.length > 0" class="color-wapper">
                      <div
                        v-for="item in colorProgressList"
                        :key="item.id"
                        class="flex-row color-item"
                      >
                        <div class="title" v-if="item?.status != '1'">{{ item?.color }}</div>
                        <div
                          class="desc"
                          :style="{ color: formatColor(item?.status) }"
                          v-if="item?.status != '1'"
                        >
                          <template v-for="icon in statusImgList" :key="icon.status">
                            <img
                              v-if="item?.status == icon.status"
                              :src="icon.src"
                              alt=""
                              class="icon"
                            />
                          </template>
                          {{ formatStatus(item?.status) }}
                        </div>
                      </div>
                    </div>
                  </template>
                  <div class="progress-content">
                    <div
                      class="progress-item"
                      v-for="item in colorProgressList"
                      :key="item.id"
                      :style="{
                        width: `${100 / colorProgressList.length}%`,
                        background: formatBgColor(item.status)
                      }"
                    >
                      <span class="index-position">{{ item.color }}</span>
                    </div>
                  </div>
                </el-tooltip>
              </div>
              <div class="progress-wapper">
                <div class="progress-title">尺码进度</div>
                <el-tooltip placement="top">
                  <template #content>
                    <div v-if="sizeProgressList?.length > 0" class="color-wapper">
                      <div
                        v-for="item in sizeProgressList"
                        :key="item.id"
                        class="flex-row color-item"
                      >
                        <div class="title" v-if="item?.status != '1'">{{ item?.size }}</div>
                        <div
                          class="desc"
                          :style="{ color: formatColor(item?.status) }"
                          v-if="item?.status != '1'"
                        >
                          <template v-for="icon in statusImgList" :key="icon.status">
                            <img
                              v-if="item?.status == icon.status"
                              :src="icon.src"
                              alt=""
                              class="icon"
                            />
                          </template>
                          {{ formatStatus(item?.status) }}
                        </div>
                      </div>
                    </div>
                  </template>
                  <div class="progress-content">
                    <div
                      class="progress-item"
                      v-for="item in sizeProgressList"
                      :key="item.id"
                      :style="{
                        width: `${100 / sizeProgressList.length}%`,
                        background: formatBgColor(item.status)
                      }"
                    >
                      <span class="index-position">{{ item.size }}</span>
                    </div>
                  </div>
                </el-tooltip>
              </div>
            </div>
          </div>
          <!-- 操作日志 -->
          <div style="background: #ffffff; margin-top: 20px; margin-bottom: 80px">
            <PrenatalSampleAuditLogs :logsList="logsList" />
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="handleClose">关闭</el-button>

        <div style="width: 20px"></div>
      </template>
    </SWDrawer>
  </div>
</template>

<script lang="ts" setup>
//状态status（1:未提交，2:审核中，3:审核通过，4:审核拒绝）
import { getOperateList, getSampleList, queryProgress } from '@/api/oa/new/develop'
import JujueIcon from '@/assets/imgs/common/jujue-icon.png'
import PassIcon from '@/assets/imgs/common/pass-icon.png'
import shenheIcon from '@/assets/imgs/common/shenhe-icon.png'
import { DICT_TYPE, getDictLabel, getIntDictOptions } from '@/utils/dict'
import { useDicList } from '@/views/OA/new/designGallery/hooks.js'
import AuditBaseInfo from './auditBaseInfo.vue'
import PrenatalSampleAuditLogs from './prenatalSampleAuditLogs.vue'

import { defineProps } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '868px'
  },
  isAudit: {
    type: Boolean,
    required: false
  },
  forbidEdit: {
    type: Boolean,
    required: false
  }
})

// 齐色错码进度图片
const statusImgList = [
  { status: 2, src: shenheIcon },
  { status: 3, src: PassIcon },
  { status: 4, src: JujueIcon }
]

// 审核信息角色
const roles = [
  { field: 'patternMakerExamineStatus', label: '版师' },
  { field: 'designerExamineStatus', label: '设计师' },
  { field: 'qaExamineStatus', label: 'QA' }
]

// 审核信息 橘色、绿色、灰色图标
const statusIcons = [
  {
    value: 0,
    class: 'status-icon',
    show: (roleStatus, status) => roleStatus == 0 || status == 1
  },
  {
    value: 1,
    class: 'status-icon status-icon-tongguo',
    show: (roleStatus, status) => roleStatus == 1 && status != 1
  },
  {
    value: 2,
    class: 'status-icon status-icon-jujue',
    show: (roleStatus, status) => roleStatus == 2 && status != 1
  }
]

// 审核状态
const statusList = [
  { value: 0, label: '未审核', class: '' },
  { value: 1, label: '通过', class: 'tongguo' },
  { value: 2, label: '拒绝', class: 'jujue' }
]

const formatColor = (status) => {
  const colorMap = {
    1: '#FF0000', // 红色
    2: '#E26A00', // 橙色
    3: '#5DB300', // 绿色
    4: '#EB3737' // 灰色
  }
  return colorMap[status] || '#ffffff' // 默认黑色
}

const formatBgColor = (status) => {
  const bgColorMap = {
    1: '#E5E5E5',
    2: '#E59453',
    3: '#5DB300',
    4: '#EB3737'
  }
  return bgColorMap[status] || '#E5E5E5' // 默认白色
}

// 展示审核按钮
const showAuditButton = computed(() => {
  return allList.value.length > 0 && allList.value[0]?.examineButtonFlag == 1
})

// 展示提交按钮
const showSubmitButton = computed(() => {
  return allList.value.length > 0 && allList.value[0]?.submitButtonFlag == 1
})

const formatDisabled = (item) => {
  // 审核人员
  if (showAuditButton.value) {
    return item.isExamine == 0
  }
  // 提交人员
  if (showSubmitButton.value) {
    return item.status == 2 || item.status == 3
  }
}

const formData = ref({
  color: '',
  size: '',
  status: ''
})

const submitForm = () => {
  resetSource()
  initDetails()
}

const resetForm = () => {
  formData.value = {
    color: '',
    size: '',
    status: ''
  }
  selectAll.value = false
  resetSource()
  initDetails()
}

const resetSource = () => {
  selectedItems.value = []
  allList.value = []
  logsList.value = []
}

const handleAudit = () => {}
// 提交审核
const handleSubmit = () => {
  // 提交完之后需要刷新数据
  selectedItems.value = []
  initDetails()
  getProgress()
  getOperates()
  emit('success')
}

// 店铺选择发生变化
const storeSelectChange = (newValue) => {
  const selectedLabel = getDictLabel(DICT_TYPE.NP_DESIGN_PRODUCT_SIZE, newValue)
  console.log('选中的尺码:', selectedLabel)
}

const statusSelectChange = (newValue) => {
  const selectedLabel = getDictLabel(DICT_TYPE.NP_PRENATAL_SAMPLE_EXAMINE_STATUS, newValue)
  console.log('选中的状态:', selectedLabel)
}

//状态（1:未提交，2:审核中，3:审核通过，4:审核拒绝）
const formatStatus = (type) => {
  const statusMap = {
    1: '未提交',
    2: '审核中',
    3: '审核通过',
    4: '审核拒绝'
  }
  return statusMap[type] || '未知状态'
}

const formatStatusColor = (status) => {
  const colorMap = {
    1: '#666666',
    2: '#DB6A0F',
    3: '#349B34',
    4: '#EB3737'
  }
  return colorMap[status] || '#666666'
}

const formatStatusBg = (status) => {
  const bgColorMap = {
    1: '#E5E5E5',
    2: '#F7DECB',
    3: '#D5F0D5',
    4: '#FFDDDA'
  }
  return bgColorMap[status] || '#E5E5E5'
}

// 选中项
const selectedItems = ref<any[]>([])
// 全选
const selectAll = ref(false)
const handleSelectAll = () => {
  if (selectAll.value) {
    //提交 审核通过的和审核中的不能选中提交
    if (showSubmitButton.value) {
      selectedItems.value = allList.value.filter((item) => item.status != 2 && item.status != 3)
    }
    //审核 审核通过、审核拒绝不能选中审核
    if (showAuditButton.value) {
      selectedItems.value = allList.value.filter((item) => item.status != 3 && item.status != 4)
    }
    getOperates()
  } else {
    // 取消全选
    selectedItems.value = []
    logsList.value = []
    getOperates()
  }
}

const { dicList } = useDicList()

const listDic = ref([])

watch(dicList, (newVal) => {
  // @ts-ignore
  listDic.value = newVal || []
})

const emit = defineEmits(['update:modelValue', 'confirm', 'close', 'success'])
const visible = ref(false)
const nodeData = ref<any>({})

// 打开
const open = async (data: any) => {
  visible.value = true
  if (data) {
    nodeData.value = { ...data }
    initDetails()
    // 进度
    getProgress()
  }
}

//多选发生变化
const handleAuditChange = () => {
  // 日志
  getOperates()
}

// 处理点击事件
const itemClick = (item) => {
  getOperates([item])
}

const colorProgressList: Ref<any[]> = ref([])
const sizeProgressList: Ref<any[]> = ref([])
const colorCon: Ref<number> = ref(3)
const sizeCon: Ref<number> = ref(3)

// 进度
const getProgress = async () => {
  const params = {
    designPictureGodownId: nodeData.value.npDesignPictureGodownId
  }
  const res = await queryProgress(params)
  // 按照 status 2,3,4,1 排序
  res.colorProgress?.sort((a, b) => [2, 3, 4, 1].indexOf(a.status) - [2, 3, 4, 1].indexOf(b.status))
  res.sizeProgress?.sort((a, b) => [2, 3, 4, 1].indexOf(a.status) - [2, 3, 4, 1].indexOf(b.status))

  colorProgressList.value = res.colorProgress || []
  sizeProgressList.value = res.sizeProgress || []
  colorCon.value = res.colorCon || 0
  sizeCon.value = res.sizeCon || 0
}

const logsList = ref<any[]>([])
// 操作日志
const getOperates = async (midArr?: any[]) => {
  let arr: any[] = []
  if (midArr?.length) {
    arr = midArr.map((item) => item.id)
  } else {
    arr = selectedItems.value.map((item) => item.id)
  }

  const res = await getOperateList(arr)

  logsList.value = Object.keys(res).map((key) => {
    return {
      color: key,
      children: res[key].map((item) => {
        return {
          ...item,
          prenatalSamplePictureUrl: item.prenatalSamplePictureUrl
            ? [{ url: item.prenatalSamplePictureUrl }]
            : [],
          examineAttachmentUrl: formatUrls(item.examineAttachmentUrl)
        }
      })
    }
  })
}

const isImage = (url: string) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']
  const extension = url.split('?')[0].split('.').pop()?.toLowerCase()
  return imageExtensions.includes(extension || '')
}

// 区分图片和文件
const formatUrls = (urls: string) => {
  const imageUrls: { url: string; name: string }[] = []
  const fileUrls: { url: string; name: string }[] = []
  if (!urls) return { imageUrls, fileUrls }

  urls.split(',').forEach((url) => {
    if (isImage(url)) {
      imageUrls.push({
        url: url.trim(),
        name: url.split('?')[1]?.split('=')[1] || '未知图片'
      })
    } else {
      fileUrls.push({
        url: url.trim(),
        name: url.split('?')[1]?.split('=')[1] || '未知文件'
      })
    }
  })
  return { imageUrls, fileUrls }
}

// 获取数据
const initDetails = async () => {
  const params = {
    ...formData.value,
    size: formData.value.size && formData.value.size.join(','),
    designPictureGodownId: nodeData.value.npDesignPictureGodownId,
    status: formData.value.status && formData.value.status.join(',')
  }
  const res = await getSampleList(params)
  if (Object.keys(res).length > 0) {
    formatDetails(res)
  } else {
    list.value = []
    allList.value = []
    selectedItems.value = []
  }
}

const list = ref<any>([]) // 数据源
const allList = ref<any>([]) //一维数据
const formatDetails = (res) => {
  // 处理返回的数据
  list.value = []
  allList.value = []

  Object.keys(res).forEach((key) => {
    list.value.push({
      color: key,
      children: res[key].map((item) => {
        return {
          ...item,
          prenatalSamplePictureUrl: item.prenatalSamplePictureUrl
            ? [{ url: item.prenatalSamplePictureUrl }]
            : []
        }
      })
    })

    allList.value.push(
      ...res[key].map((item) => {
        return {
          ...item,
          prenatalSamplePictureUrl: item.prenatalSamplePictureUrl
            ? [{ url: item.prenatalSamplePictureUrl }]
            : []
        }
      })
    )
  })
}

defineExpose({ open })

onMounted(() => {})

const handleClose = () => {
  visible.value = false
  selectAll.value = false
  resetSource()
  emit('close')
}
</script>

<style lang="scss" scoped>
.dialog-content {
  border-radius: 8px;
  box-sizing: border-box;
  box-shadow: 0px -4px 10px 0px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  height: calc(100vh - 100px);
  overflow-y: auto;

  .dialog-content-top {
    background: #ffffff;
    padding: 20px;
    box-sizing: border-box;

    .content {
      display: flex;
      flex-direction: row;

      .content-left {
        margin-right: 20px;
        width: 500px;
        border-radius: 8px;
        opacity: 1;
        height: 507px;
        overflow-y: auto;
        overflow-x: hidden;
        align-items: center;
        justify-content: space-between;
        border: 1px solid #e5e5e5;
        padding: 0px 0px 16px;
        box-sizing: border-box;

        .select-all {
          background: #f4f6fa;
          height: 44px;
          padding-left: 20px;
          box-sizing: border-box;
          border-bottom: 1px solid #eceaea;
          display: flex;
          flex-direction: row;
          align-items: center;
        }

        .group-list {
          .group {
            border-bottom: 1px solid #eceaea;

            .group-title {
              font-size: 14px;
              font-weight: 500;
              line-height: 22px;
              color: #3d3d3d;
              padding: 10px 20px;
              box-sizing: border-box;
            }

            .group-items {
              cursor: pointer;
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              border-top: 1px solid #e5e5e5;
              padding: 10px 20px;
              box-sizing: border-box;

              .item-status {
                font-size: 14px;
                font-weight: normal;
                line-height: 22px;
                color: #3d3d3d;
                display: flex;
                flex-direction: row;
                align-items: center;

                .status-item {
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  margin-left: 20px;

                  .status-icon {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: #999999;
                    border: 3px solid #e8e8e8;
                    margin-right: 6px;
                  }

                  .status-icon-tongguo {
                    background: #349b34;
                    border: 3px solid #d5f0d5;
                  }

                  .status-icon-jujue {
                    background: #eb3737;
                    border: 3px solid #ffddda;
                  }

                  .status-desc {
                    font-size: 12px;
                    color: #666666;
                  }
                }

                .status-item:first-child {
                  margin-left: 0;
                }

                .status {
                  width: 74px;
                  text-align: center;
                  padding: 3.2px 0px;
                  box-sizing: border-box;
                  background: #f7decb;
                  border-radius: 126.4px;
                  font-size: 12px;
                  color: #db6a0f;
                  margin-left: 54px;
                }
              }
            }
          }
        }
      }

      .right-wapper {
        flex: 1;
        width: calc(100% - 450px);
      }
    }
  }
}

.btn-wapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;

  .title {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    font-variation-settings: 'opsz' auto;
    color: #1a1a1a;
  }
}

.search-wapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  margin-bottom: 18px;

  .form-inline {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .form-item {
      flex: 1;
      margin-right: 16px;
      margin-bottom: 0;

      &:last-child {
        margin-right: 0;
      }

      .el-input {
        width: 100%;
      }
    }
  }

  .search-btn {
    margin-left: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}

.progress-wapper-title {
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: normal;
  color: #333333;
  margin-top: 30px;
  margin-bottom: 20px;
  .desc {
    background: #0064ff;
    display: inline-block;
    width: 4px;
    height: 10px;
  }
}

.progress-wapper {
  display: flex;
  flex-direction: row;
  margin-bottom: 30px;

  .progress-title {
    font-size: 14px;
    font-weight: 500;
    line-height: 22px;
    text-transform: capitalize;
    letter-spacing: 0em;
    font-variation-settings: 'opsz' auto;
    color: #3d3d3d;
  }

  .progress-content {
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 20px;
    flex: 1;

    .progress-item {
      flex: 1;
      height: 8px;
      background: #d8d8d8;
      margin-right: 8px;

      &:last-child {
        margin-right: 0;
      }

      position: relative;

      .index-position {
        position: absolute;
        top: -23px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 14px;
        color: #999999;
      }
    }

    .progress-item:last-child {
      border-radius: 0 8px 8px 0;
    }

    .progress-item:first-child {
      border-radius: 8px 0 0 8px;
    }

    .activity {
      background-color: #0064ff;
    }
  }
}

.progress-wapper:last-child {
  margin-bottom: 0;
}

.color-wapper {
  display: flex;
  flex-direction: column;

  .color-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .title {
      min-width: 100px;
      font-size: 14px;
      font-weight: normal;
      color: #ffffff;
    }

    .desc {
      font-size: 14px;
      font-weight: normal;
      color: #5db300;

      .icon {
        width: 12px;
        height: 12px;
        margin-right: 6px;
      }
    }
  }
}

:deep(.el-radio__input.is-checked + .el-radio__label) {
  color: #0064ff;
}

:deep(.el-radio__input.is-checked .el-radio__inner) {
  background: #0064ff;
}

:deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: #0064ff;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background: #0064ff;
}

.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 16px 20px 16px 20px;
  box-sizing: border-box;
  border-color: #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  border-radius: 8px 8px 0 0;

  .header-left {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;

    .header-desc {
      background: #0064ff;
      width: 3px;
      height: 10px;
      margin-right: 6px;
    }

    .title {
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      letter-spacing: 0px;
    }
  }

  .header-right {
    font-size: 14px;
    color: #333333;
    display: flex;
    flex-direction: row;

    .item {
      margin-left: 16px;
      display: flex;
      flex-direction: row;
      align-items: center;

      .icon {
        width: 12px;
        height: 12px;
        background: #999999;
        box-sizing: border-box;
        border: 2px solid #e8e8e8;
        margin-right: 8px;
        border-radius: 50%;
      }

      .desc {
        font-size: 14px;
        color: #666666;
      }

      .tongguo {
        background: #349b34;
        box-sizing: border-box;
        border: 2px solid #d5f0d5;
      }

      .jujue {
        background: #eb3737;
        box-sizing: border-box;
        border: 2px solid #ffdfdf;
      }
    }
  }
}
:deep(.el-radio) {
  margin-right: 5px;
}
</style>
