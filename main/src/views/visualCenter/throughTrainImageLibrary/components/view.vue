<!--
 * @Date: 2025年5月14日16:37:15
-->
<template>
  <div class="main-box body">
    <el-drawer
      v-model="isVisible"
      title="图片详情"
      size="1590px"
      :close-on-click-modal="true"
      @close="handleDrawerClose"
    >
      <template #header>
        <div class="header row-center">
          <img class="header-icon" :src="getImageUrl(mainImgData?.channel)" />
          <el-tooltip
            class="box-item"
            effect="dark"
            content="点击跳转商品链接"
            placement="top-start"
          >
            <div
              class="header-name"
              @click="clickGoodCard(mainImgData?.channel, mainImgData?.goodsId)"
              >{{ `${mainImgData?.goodsCode || ''}` + `(${mainImgData?.goodsId || ''})` }}</div
            >
          </el-tooltip>
          <div class="header-mainImg">主图</div>
        </div>
      </template>
      <div class="mainContainer h-full">
        <div class="flex gap-22px h-full">
          <!-- 主图 -->
          <div class="w-456px">
            <div class="mainContainer-coverBg">
              <el-image
                v-if="mainImgData?.imageUrl"
                fit="contain"
                class="mainContainer-coverBg-cover"
                :src="mainImgData?.imageUrl || ''"
              />
            </div>
            <div class="mainContainer-coverBg-imgs">
              <div class="flex items-center">
                <img class="zhexianatux" src="@/assets/imgs/web/zhexianatu2x.png" alt="" />
                <div class="zhexianatuxValue">访客数曲线图</div>
              </div>
              <div class="zhexianatuxButton" @click="openZheXian(mainImgData?.goodsId)">进入</div>
            </div>
            <!-- 信息 -->
            <div class="right">
              <div class="rightMessage">
                <div class="rightMessageText">
                  <img class="rightMessagePng" src="@/assets/imgs/web/rightMessage.png" alt="" />
                  <div>信息</div>
                </div>
                <div class="rightMessageTop">
                  <div>
                    <div>类目</div>
                    <div class="textValue right-message-top-item">
                      <overflow-tooltip :content="mainImgData?.category || '--'" :line-clamp="1" />
                    </div>
                  </div>
                  <div>
                    <div>编码</div>
                    <div class="textValue right-message-top-item">
                      <overflow-tooltip :content="mainImgData?.goodsCode || '--'" :line-clamp="1" />
                    </div>
                  </div>
                  <div>
                    <div>产品定位</div>
                    <div class="right-message-top-item">
                      <overflow-tooltip
                        :content="mainImgData?.productPositioning || '--'"
                        :line-clamp="1"
                      />
                    </div>
                  </div>
                  <div>
                    <div class="whitespace-nowrap">平均停留时长(秒)</div>
                    <div class="textValue right-message-top-item">
                      <overflow-tooltip
                        :content="mainImgData?.averageStayDuration || '--'"
                        :line-clamp="1"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="rightMessageBottom">
                <div style="height: 10px"></div>
                <div class="rightMessageBottomTop">
                  <img class="blueTimePng" src="@/assets/imgs/web/blueTime.png" alt="" />
                  <div class="rightMessageBottomTopText">数据时间</div>
                  <div style="margin-right: 10px" class="rightMessageBottomTopValue">截止</div>
                  <div class="rightMessageBottomTopValue">{{
                    mainImgData?.clickRateEndTime || '-'
                  }}</div>
                </div>
                <div class="rightMessageBottomCenter">
                  <div class="rightMessageBottomCenterTopText">
                    <div style="margin-right: 56px">7天免费点击率</div>
                    <div style="margin-right: 40px">30天免费点击率</div>
                    <div>7天免费转换率</div>
                  </div>
                  <div class="rightMessageBottomCenterTopValue">
                    <!-- 7天付费点击率 -->
                    <div
                      v-if="mainImgData?.clickRateSeven"
                      style="width: 150px; font-weight: 600"
                      class="textValue"
                    >
                      {{ mainImgData?.clickRateSeven }}
                    </div>
                    <div v-else style="width: 146px; font-weight: 600" class="textValue textValue2">
                      <img
                        style="width: 20px; height: 20px; margin-right: 6px"
                        src="@/assets/imgs/web/loading.gif"
                        alt=""
                      />抓取中
                    </div>
                    <!-- 30天免费点击率 -->
                    <div
                      v-if="mainImgData?.clickRateThirty"
                      style="width: 140px; font-weight: 600"
                      class="textValue"
                    >
                      {{ mainImgData?.clickRateThirty }}
                    </div>
                    <div v-else style="width: 140px; font-weight: 600" class="textValue textValue2">
                      <img
                        style="width: 20px; height: 20px; margin-right: 6px"
                        src="@/assets/imgs/web/loading.gif"
                        alt=""
                      />抓取中
                    </div>
                    <!-- 7天付费转换率 -->
                    <div
                      v-if="mainImgData?.checkNormal === '2'"
                      style="flex: 1; font-weight: 600"
                      class="textValue"
                    >
                      {{ mainImgData?.clickConversionRateSeven || '-' }}
                    </div>
                    <div v-else style="flex: 1; font-weight: 600" class="textValue textValue2">
                      <img
                        style="width: 20px; height: 20px; margin-right: 6px"
                        src="@/assets/imgs/web/loading.gif"
                        alt=""
                      />抓取中
                    </div>
                  </div>
                  <div class="rightMessageBottomCenterLine"></div>
                  <div class="rightMessageBottomCenterTopText">
                    <div style="margin-right: 48px">30天免费转换率</div>
                    <div style="margin-right: 76px">30天销量</div>
                    <div style="margin-left: 4px">累计销量</div>
                  </div>
                  <div class="rightMessageBottomCenterTopValue">
                    <div
                      v-if="mainImgData?.checkNormal === '2'"
                      style="width: 152px; font-weight: 600"
                      class="textValue"
                    >
                      {{ mainImgData?.clickConversionRateThirty || '-' }}
                    </div>
                    <div v-else style="width: 152px; font-weight: 600" class="textValue textValue2">
                      <img
                        style="width: 20px; height: 20px; margin-right: 6px"
                        src="@/assets/imgs/web/loading.gif"
                        alt=""
                      />抓取中
                    </div>

                    <div style="width: 136px; font-weight: 600" class="textValue textValue2">{{
                      mainImgData?.salesVolumeThirty || '-'
                    }}</div>

                    <div style="flex: 1; font-weight: 600" class="textValue">{{
                      mainImgData?.salesVolumeCumulative || '-'
                    }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 推广图 修改 TODO: -->
          <div class="content-main bg-white h-full">
            <date-filter
              :key="dateFilterKey"
              @sendDateSelect="onDateSelect"
              :default-idx="dateFilterDefaultIdx"
              :default-date-by-query="dateFilterDefaultDate"
            />
            <div class="button-group text-right">
              <el-button type="primary" @click="handleSync">车图同步</el-button>
              <el-button v-if="groupedList.length" @click="toggleAllGroups">
                {{ isAllCollapsed ? '一键展开' : '一键收起' }}
              </el-button>
            </div>
            <el-scrollbar v-if="groupedList.length" class="content-scrollbar">
              <div class="tuijiantuBox">
                <div
                  v-for="(group, groupIndex) in groupedList"
                  :key="group.id || group.mappingTime || groupIndex"
                  class="promotion-group"
                >
                  <div class="promotion-header">
                    <div class="promotion-group__title">
                      版本时间 {{ filterTime(group.mappingTime) || '--' }}
                    </div>
                    <span class="promotion-toggle cursor-pointer" @click="toggleGroup(groupIndex)"
                      >{{ group.collapsed ? '展开' : '收起' }}
                      <el-icon><ArrowDown v-if="group.collapsed" /> <ArrowUp v-else /></el-icon
                    ></span>
                  </div>
                  <ElCollapseTransition>
                    <div v-show="!group.collapsed" class="promotion-group__content">
                      <div
                        v-for="(x, y) in group.list"
                        :key="x.id || `${groupIndex}-${y}`"
                        class="promotion-group__item"
                      >
                        <DetailTitleHeader
                          :item="x"
                          :desc="x.type == '1' ? '手动上传' : '自动上传'"
                          @delete-success="handleUpdateSuccess"
                        >
                          <!-- <div class="flex-column header-title-content" v-if="x.type == '2'">
                            <div class="title-desc"
                              ><span class="title-header">推广场景：</span>{{ x.sceneName }}</div
                            >
                          </div> -->
                          <template #desc-right>
                            <div class="flex items-center text-14px">
                              <div class="text-#666">车图上传时间</div>
                              <div class="text-#333 ml-16px">{{ getMaxCreatedTime(x) }}</div>
                            </div>
                          </template>
                        </DetailTitleHeader>
                        <!-- 手动 -->
                        <AutoItem
                          :item="x"
                          @pic-click="handlePicClick"
                          @update-success="handleUpdateSuccess"
                          :isAuto="false"
                          v-if="x.type == '1'"
                        />
                        <!-- 自动 -->
                        <div v-if="x.type == '2'">
                          <div v-for="it in x.dataList" :key="it.id">
                            <AutoItem
                              :item="it"
                              @pic-click="handlePicClick"
                              :isAuto="true"
                              @update-success="handleUpdateSuccess"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </ElCollapseTransition>
                </div>
              </div>
            </el-scrollbar>
            <div class="tuijiantuBox" v-else style="width: 100%">
              <div style="display: flex; flex-direction: column; align-items: center">
                <img
                  style="margin-top: 200px; width: 356px; height: 226.11px"
                  src="@/assets/imgs/web/NoChePic.png"
                  alt=""
                />
                <div
                  style="
                    margin-top: 20px;
                    font-family: PingFang SC;
                    font-size: 14px;
                    font-weight: normal;
                    line-height: normal;
                    letter-spacing: normal;
                    color: #999999;
                  "
                >
                  暂无相关数据</div
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
  <!-- 图片详情弹窗 -->
  <DetailDialog
    ref="detailDialogRef"
    :detail-data="dialog2Data"
    :current-is-auto="currentIsVisible2Auto"
    @edit="openDialog3"
    @close="handleDetailClose"
  />

  <!-- 图片详情抽屉 -->
  <DetailDrawer
    ref="detailDrawerRef"
    :detail-data="dialog2Data"
    :current-is-auto="currentIsVisible2Auto"
    @edit="openDialog3"
    @close="handleDetailClose"
  />
  <!-- 编辑弹窗 -->
  <EditDialog
    ref="editDialogRef"
    :edit-data="dialog2Data"
    :current-is-auto="currentIsVisible2Auto"
    @close="handleEditClose"
    @submit="handleEditSubmit"
  />

  <!-- 编辑抽屉 -->
  <EditDrawer
    ref="editDrawerRef"
    :edit-data="dialog2Data"
    :current-is-auto="currentIsVisible2Auto"
    @close="handleEditClose"
    @submit="handleEditSubmit"
  />
  <AccessLineChart ref="accessLineChartRef" />
</template>

<script lang="ts" setup>
import { nextTick } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')
import * as GalleryApi from '@/api/gallery'
// import UploadImgs from '@/components/UploadFile/src/UploadImgs.vue'
// import UploadFile from '@/components/UploadFile/src/UploadFile.vue'
// UploadFile 和 UPLOAD_FILE_BISSONESSCODE 已移至编辑组件中
import { getImageUrl } from '@/utils'
import { getUrlByTypeAndId } from '@/utils/index'
import AccessLineChart from '@/views/web/visualGallery/components/accessLineChart.vue'
// 文件处理工具已移至detail组件中

import AutoItem from '@/views/web/visualGallery/components/detailDialogComponents/autoItem.vue'
import DetailTitleHeader from '@/views/web/visualGallery/components/detailDialogComponents/detailTitleHeader.vue'
// Dialog2ListItem已移至detail组件中
import DetailDialog from './detailDialog.vue'
import DetailDrawer from './detailDrawer.vue'
import EditDialog from './editDialog.vue'
import EditDrawer from './editDrawer.vue'

// SWSelectPeople 和 PersonRosterApi 已移至编辑组件中

import DateFilter from './dateFilter.vue'
import { OverflowTooltip } from '@/components/Overflow'
import { ElCollapseTransition } from 'element-plus'
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import { useDialog } from '@/hooks/web/useDialog'
import { defineAsyncComponent } from 'vue'

// 文件类型图标和判断函数已移至detail组件中

// loading 状态已移至编辑组件中
const { openDialog: openSyncDialog } = useDialog()
const SyncImgDialog = defineAsyncComponent(() => import('@/views/web/visualGallery/index.vue'))

const isVisible = ref(false)
const isVisible2 = ref(false)
// isVisible3 已不再需要，编辑弹框状态由组件内部管理
const detailDialogRef = ref()
const detailDrawerRef = ref()
const editDialogRef = ref()
const editDrawerRef = ref()
const detailDatas = ref([])
const mainImgData = ref({}) as any
const showImgList = ref([])

// const demandSide = ref('')
// const mappingPurpose = ref('')
const currentId = ref('') // 当前编辑的 id
const groupedList = ref([]) as any
const isAllCollapsed = computed(
  () => groupedList.value.length > 0 && groupedList.value.every((group) => group.collapsed)
)
const dialog2Data = ref({
  imageUrl: '',
  operationPersonnels: [],
  planningPersonnels: [],
  cameraCrews: [],
  latePersonnels: [],
  designers: [],
  conclusionType: '',
  conclusion: '',
  url: ''
}) as any
const dateRangeRef = ref<string[]>([])
// form 定义已移至编辑组件中
// 按钮图片导入已移至detail组件中

// 人员查询方法已移至编辑组件中

// 按钮图片相关逻辑已移至detail组件中

// closeDialog3 逻辑已移至编辑组件中
const currentGoodsId = ref('') // 商品ID
const dateFilterDefaultIdx = ref(2) // 默认激活索引
const dateFilterDefaultDate = ref('') // 默认日期
const dateFilterKey = ref(0) // 用于强制重新渲染dateFilter组件
const isInitializing = ref(false) // 标志位：是否正在初始化，防止重复调用接口

// 判断是否为刚好一周的时间范围
const isExactOneWeek = (startDate: string, endDate: string) => {
  if (!startDate || !endDate) return false

  const start = dayjs(startDate)
  const end = dayjs(endDate)
  const diffDays = end.diff(start, 'day') + 1 // 包含结束日期

  // 检查是否刚好7天，并且是周一到周日
  if (diffDays === 7) {
    const startOfWeek = start.startOf('week')
    const endOfWeek = start.endOf('week')
    return start.isSame(startOfWeek, 'day') && end.isSame(endOfWeek, 'day')
  }

  return false
}

const open = async (
  goodsId: string,
  uploadTimeRange?: { uploadTimeStart: string; uploadTimeEnd: string }
) => {
  // 设置初始化标志，防止重复调用接口
  isInitializing.value = true

  // 清空之前的详情数据
  detailDatas.value = []
  mainImgData.value = {}
  showImgList.value = []
  groupedList.value = []
  dialog2Data.value = {
    imageUrl: '',
    operationPersonnels: [],
    planningPersonnels: [],
    cameraCrews: [],
    latePersonnels: [],
    designers: [],
    conclusionType: '',
    conclusion: '',
    url: ''
  }

  // 重置状态
  currentIsVisible2Auto.value = false
  isVisible2.value = false

  // 设置新的商品ID和显示状态
  currentGoodsId.value = goodsId
  isVisible.value = true

  // 处理上传时间范围，决定dateFilter的默认状态
  if (uploadTimeRange && uploadTimeRange.uploadTimeStart && uploadTimeRange.uploadTimeEnd) {
    const { uploadTimeStart, uploadTimeEnd } = uploadTimeRange

    if (isExactOneWeek(uploadTimeStart, uploadTimeEnd)) {
      // 刚好一周，默认激活"周"
      dateFilterDefaultIdx.value = 0
      dateFilterDefaultDate.value = `${uploadTimeStart},${uploadTimeEnd}`
    } else {
      // 不是刚好一周，默认激活"自定义"
      dateFilterDefaultIdx.value = 2
      dateFilterDefaultDate.value = `${uploadTimeStart},${uploadTimeEnd}`
    }
  } else {
    // 没有传递时间范围，使用默认值
    dateFilterDefaultIdx.value = 2
    dateFilterDefaultDate.value = dayjs().format('YYYY-MM-DD')
  }

  // 强制重新渲染dateFilter组件，确保props变化生效
  dateFilterKey.value++

  // 获取详情数据，支持时间范围参数
  dateRangeRef.value = uploadTimeRange
    ? [uploadTimeRange.uploadTimeStart, uploadTimeRange.uploadTimeEnd]
    : []
  await refreshDetailData()

  // 初始化完成，允许日期选择回调
  isInitializing.value = false

  console.log('uploadTimeRange', uploadTimeRange)
  console.log(
    'dateFilterDefaultDate',
    dateFilterDefaultDate.value,
    'dateFilterDefaultIdx',
    dateFilterDefaultIdx.value
  )
  console.log('详情数据初始化完成，isInitializing:', isInitializing.value)
}
// message 已移至编辑组件中

// filterTime方法已移至detail组件中

// 获取dataList中最大的createdAt时间
const getMaxCreatedTime = (item) => {
  if (!item.dataList || !Array.isArray(item.dataList) || item.dataList.length === 0) {
    return item.createdAt || ''
  }

  // 找到最大的createdAt时间 (格式: yyyy-mm-dd hh:mm:ss)
  const maxTime = item.dataList.reduce((max, current) => {
    if (!current.createdAt) return max
    if (!max) return current.createdAt

    // 将时间字符串转换为Date对象进行比较
    const currentDate = new Date(current.createdAt)
    const maxDate = new Date(max)

    // 如果日期无效，保持原值
    if (isNaN(currentDate.getTime())) return max
    if (isNaN(maxDate.getTime())) return current.createdAt

    return currentDate > maxDate ? current.createdAt : max
  }, '')

  return maxTime || item.createdAt || ''
}

const filterTime = (date) => {
  if (!date) {
    return ''
  }
  // 创建 Date 对象
  const dateObj = new Date(date)
  // 检查是否为有效的日期
  if (isNaN(dateObj.getTime())) {
    return ''
  }
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const groupPromotionImageList = (list: any[] = []) => {
  if (!Array.isArray(list)) return []
  const groupMap = new Map<string, { mappingTime: string; list: any[] }>()
  list.forEach((item) => {
    if (!item) return
    const key = item.mappingTime || ''
    if (!groupMap.has(key)) {
      groupMap.set(key, { mappingTime: item.mappingTime || '', list: [] })
    }
    const group = groupMap.get(key)
    if (group) {
      group.list.push(item)
    }
  })
  return Array.from(groupMap.entries()).map(([key, value], index) => ({
    ...value,
    id: key || `promotion-group-${index}`,
    collapsed: index !== 0 // 第一个组默认展开，其他默认收起
  }))
}

const toggleGroup = (index: number) => {
  const group = groupedList.value[index]
  if (!group) return
  group.collapsed = !group.collapsed
}

const toggleAllGroups = () => {
  const shouldCollapse = !isAllCollapsed.value
  groupedList.value.forEach((group) => {
    group.collapsed = shouldCollapse
  })
}

const handleSync = () => {
  console.log('handleSync')
  openSyncDialog({
    title: '车图同步',
    content: () => SyncImgDialog,
    bodyStyle: { padding: 0 },
    top: '1vh',
    width: 1400,
    props: {
      isSync: true,
      goodsId: mainImgData.value.goodsId
    },
    onSuccess: () => {
      // 车图同步完成后刷新数据
      handleUpdateSuccess()
    }
  })
}

const reset = () => {
  currentId.value = ''
  // 重置dateFilter相关状态为默认值（自定义模式）
  dateFilterDefaultIdx.value = 2
  dateFilterDefaultDate.value = dayjs().format('YYYY-MM-DD')
}

// 清空详情数据
const clearDetailData = () => {
  // 清空详情相关数据
  detailDatas.value = []
  mainImgData.value = {}
  showImgList.value = []
  groupedList.value = []
  dialog2Data.value = {
    imageUrl: '',
    operationPersonnels: [],
    planningPersonnels: [],
    cameraCrews: [],
    latePersonnels: [],
    designers: [],
    conclusionType: '',
    conclusion: '',
    url: ''
  }
  currentGoodsId.value = ''

  // 重置状态
  currentIsVisible2Auto.value = false
  isVisible2.value = false
  isInitializing.value = false // 重置初始化标志

  console.log('详情数据已清空')
}

const emit = defineEmits(['cancle', 'success', 'close'])

const close = () => {
  // 只负责关闭 drawer，数据清空由 watch(isVisible) 自动处理
  isVisible.value = false
  console.log('view drawer 开始关闭')
}

// 处理 drawer 关闭事件
const handleDrawerClose = async () => {
  // 等待DOM更新完成
  await nextTick()
  // 清空详情数据
  clearDetailData()

  // 重置其他状态（如日期过滤器）
  reset()

  // 关闭抽屉后查询数据
  emit('close')
}

const handlePicClick = ({ url, item, isAuto }) => {
  console.log(url, item, 'handlePicClick')
  openDialog(url, item, isAuto)
}

// 刷新详情数据
const refreshDetailData = async () => {
  if (!currentGoodsId.value) return

  try {
    let params: any = { goodsId: currentGoodsId.value }

    // 如果传递了日期范围，添加时间参数
    if (dateRangeRef.value && dateRangeRef.value.length === 2) {
      params = {
        ...params,
        uploadTimeStart: dateRangeRef.value[0],
        uploadTimeEnd: dateRangeRef.value[1]
      }
    }

    console.log('刷新详情数据，参数:', params)
    const data = await GalleryApi.getDetailPage(params)
    mainImgData.value = data.masterImageInfo
    groupedList.value = groupPromotionImageList(data.promotionImageList)
  } catch (error) {
    console.error('刷新详情数据失败:', error)
  }
}

// 更新当前的 dialog2Data，确保包含最新的数据图上传信息
const updateCurrentDialog2Data = async () => {
  if (!dialog2Data.value || !groupedList.value) return

  try {
    // 根据当前的图片信息，在最新的 groupedList 中找到对应的项目
    const currentImageUrl = dialog2Data.value.url || dialog2Data.value.imageUrl
    const currentId = dialog2Data.value.id

    // 在最新的数据中查找匹配的项目
    let updatedItem: any = null
    for (const item of groupedList.value) {
      // 如果是自动模式，直接匹配 imageUrl
      if (currentIsVisible2Auto.value && item.imageUrl === currentImageUrl) {
        updatedItem = item
        break
      }
      // 如果是手动模式，在 dataList 中查找
      else if (!currentIsVisible2Auto.value && item.dataList) {
        for (const dataItem of item.dataList) {
          if (dataItem.imageUrl === currentImageUrl || dataItem.id === currentId) {
            updatedItem = {
              ...item,
              // 使用找到的 dataItem 的信息
              ...dataItem
            }
            break
          }
        }
        if (updatedItem) break
      }
    }

    // 如果找到了匹配的项目，更新 dialog2Data
    if (updatedItem && dialog2Data.value && typeof updatedItem === 'object') {
      console.log('找到匹配项目，更新 dialog2Data:', updatedItem)
      dialog2Data.value = {
        ...dialog2Data.value,
        ...updatedItem,
        currentIndex: dialog2Data.value.currentIndex, // 保持当前索引
        url: currentImageUrl, // 保持当前图片URL
        imageList: dialog2Data.value.imageList, // 保持图片列表
        masterImageInfo: mainImgData.value // 更新主图信息
      }
    } else {
      console.warn('未找到匹配的项目，保持原有 dialog2Data')
    }
  } catch (error) {
    console.error('更新 dialog2Data 失败:', error)
  }
}

// 更新数据（保持向后兼容）
const handleUpdateSuccess = async () => {
  await refreshDetailData()
}

const currentIsVisible2Auto = ref(false) // 当前是否为自动抓取的图片
const openDialog = (item, x, isAuto) => {
  console.log('dialogData', x)
  // 查找点击图片在数组中的索引
  currentIsVisible2Auto.value = isAuto
  const index = isAuto
    ? [x.imageUrl].indexOf(item)
    : x.dataList.map((item) => item.imageUrl).indexOf(item)
  const dialogData = {
    ...x,
    currentIndex: index, // 添加当前索引
    url: item,
    imageList: isAuto ? [x.imageUrl] : x.dataList.map((item) => item.imageUrl)
  }
  console.log(dialogData, 'dialogData', x)
  dialog2Data.value = dialogData

  // 默认使用弹窗，可以根据需要切换为抽屉
  detailDialogRef.value?.open(dialogData)
  // 如果要使用抽屉，可以调用：
  // detailDrawerRef.value?.open(dialogData)
}
// 处理详情组件关闭事件
const handleDetailClose = () => {
  isVisible2.value = false
}
// 编辑回显 - 使用新的编辑组件
const openDialog3 = () => {
  // 默认使用弹窗，可以根据需要切换为抽屉
  editDialogRef.value?.open(dialog2Data.value, currentIsVisible2Auto.value)
  // 如果要使用抽屉，可以调用：
  // editDrawerRef.value?.open(dialog2Data.value, currentIsVisible2Auto.value)
}

// 处理编辑组件关闭事件
const handleEditClose = () => {
  // 编辑弹框的显示状态现在由各自的组件内部管理
  // 这里只需要处理业务逻辑，比如清理数据等
  console.log('编辑弹框已关闭')
}

// 处理编辑组件提交事件
const handleEditSubmit = async (params) => {
  try {
    console.log('收到编辑提交事件:', {
      params: params,
      currentGoodsId: currentGoodsId.value,
      paramsGoodsId: params.goodsId,
      isSameGoods: currentGoodsId.value === params.goodsId
    })

    isVisible2.value = false
    detailDialogRef.value?.close()

    // 刷新详情数据
    await refreshDetailData()

    // 更新当前的 dialog2Data，确保包含最新的数据图上传信息
    // await updateCurrentDialog2Data()

    // 重新打开详情对话框，使用更新后的数据
    // openDialog(dialog2Data.value.url, dialog2Data.value, currentIsVisible2Auto.value)
  } catch (error) {
    console.error('编辑提交后刷新失败:', error)
  }
}

const accessLineChartRef = ref()
// 折线图展示
const openZheXian = (id) => {
  // console.log(id,'id');
  accessLineChartRef.value.open(id)
}

// 商品链接跳转
const clickGoodCard = (channel, goodsId) => {
  getUrlByTypeAndId(channel || 'TaoBao', goodsId)
}

defineExpose({ open, close })

// 表单验证规则已移至编辑组件中

/**
 * 处理文件预览
 * 如果是文档类型，则打开微软在线文档预览
 * 否则打开文件下载链接
 * @param {Object} param0 文件名和url
 * @param {string} param0.name 文件名
 * @param {string} param0.url 文件url
 */
// 文件处理和图片URL计算已移至detail组件中

// 处理日期选择变化事件
const onDateSelect = (selectDateRange, dateType, newType) => {
  console.log('日期选择变化:', {
    selectDateRange,
    dateType,
    newType,
    isInitializing: isInitializing.value
  })

  // 如果正在初始化，不触发接口调用，防止重复请求
  if (isInitializing.value) {
    console.log('正在初始化，跳过日期选择回调')
    return
  }
  dateRangeRef.value = selectDateRange
  // 刷新详情数据，传入选择的日期范围
  refreshDetailData()
}
</script>

<style lang="scss" scoped>
.header {
  font-weight: 500;
  font-size: 16px;
  color: 333333;
  line-height: 22px;

  &-icon {
    width: 20px;
    height: 20px;
    margin-right: 14px;
  }

  &-name {
    font-weight: 500;
    font-size: 16px;
    color: #333333;
  }

  &-mainImg {
    width: 40px;
    height: 22px;
    background: url('@/assets/imgs/web/MainPicBackground.png');
    background-size: 100% 100%;
    font-weight: 500;
    font-size: 12px;
    margin-left: 14px;
    color: #ffffff;
    line-height: 22px;
    text-align: center;
  }

  &-promotionImg {
    width: 58px;
    height: 25px;
    background: #3e5d3e;
    border-radius: 8px 0 8px 0;
    font-weight: 500;
    font-size: 12px;
    color: #99ff9a;
    line-height: 25px;
    text-align: center;
  }
}

.mainContainer {
  &-coverBg {
    display: inline-block;
    position: relative;
    padding: 0 27px;
    height: 460px;
    border-radius: 9px;
    background: #f7f8fc;
    width: 100%;
    box-sizing: border-box;

    &-cover {
      width: 100%;
      height: 100%;
      border-radius: 6px;
      object-fit: contain;
    }

    &-arrowLeft {
      position: absolute;
      top: 324px;
      width: 45px;
      height: 45px;
      left: 15px;
      cursor: pointer;
    }

    &-arrowRight {
      position: absolute;
      top: 324px;
      right: 15px;
      width: 45px;
      height: 45px;
      cursor: pointer;
    }
  }

  &-close {
    position: absolute;
    top: 14px;
    right: 25px;
    width: 20px;
    height: 20px;
    cursor: pointer;
    z-index: 99;
  }

  &-line {
    position: absolute;
    left: 1161px;
    top: 0;
    bottom: 0;
    width: 1px;
    background: #4c5061;
  }
}

.main-box {
  font-family: PingFang SC;

  :deep(.el-dialog) {
    margin-top: 6px;
    margin-bottom: 20px;
    width: 1550px;
    // height: 45.3125vw;
    padding: 10px 0 0 0;
    border-radius: 10px;
    background: #fff;
    box-shadow:
      0 1 2px 0 rgba(0, 0, 0, 0.5),
      0 1 2px 0 rgba(0, 0, 0, 0.5);
  }

  .header-icon {
    margin-right: 22px;
  }

  .header-name {
    cursor: pointer;

    &:hover {
      color: #0064ff;
    }
  }
}

.main-box {
  :deep(.el-dialog__header) {
    display: none;
  }
}

.Idclass {
  margin-top: 10px;
  margin-left: 11px;
  width: 179px;
  min-height: 20px;
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 500;
  font-size: 14px;
  color: #ffffff;
  line-height: 20px;
  text-align: left;
  font-style: normal;
  display: flex;
  /* 使用 flex 布局 */
  align-items: flex-start;
  /* 顶部对齐 */
}

.tuiID {
  width: 57px;
  height: 20px;
  display: inline-block;
  text-align: left;
  vertical-align: top;
  /* 顶部对齐 */
}

.tuiIdnumber {
  display: inline-block;
  width: 111px;
  word-break: keep-all;
  vertical-align: top;
  /* 顶部对齐 */
}

.timeBox {
  margin-top: 8px;
  display: flex;

  .timeBox-timeBox {
    margin-left: 10px;
    margin-right: 40px;
    width: 48px;
    height: 17px;
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #ffffff;
  }

  > img {
    margin-top: 7px;
    width: 8px;
    height: 8px;
    margin-right: 8px;
  }

  .time-nubmer {
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #dadada;
  }
}

.xuqiufang {
  display: flex;
  margin-top: 8px;

  .xuqiufang-box {
    margin-left: 10px;
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #ffffff;
    line-height: 17px;
    font-style: normal;
  }

  .xuqiufang-text {
    margin-right: 10px;
    flex: 1;
    text-align: right;
    font-style: normal;
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #ffffff;
  }
}

.box-pic:nth-child(2n-1) {
  margin-left: 50px;
  margin-right: 50px;
}

.tuiMessage {
  margin-top: 17px;
  margin-right: 15px;
  margin-bottom: 13px;

  .messageBox-first {
    display: inline-block;
    margin-top: 19px;
    margin-left: 25px;
    margin-right: 12px;
    width: 80px;
    height: 28px;
  }
}

.messageBox-center {
  margin-top: 20px;
  display: flex;
  vertical-align: top;
  /* 顶部对齐 */
  min-height: 20px;
}

.messageBox-center2 {
  padding-left: 25px;
  margin-top: 20px;
  display: flex;
  vertical-align: top;
  /* 顶部对齐 */
  min-height: 20px;
}

.messageBox-center-left {
  margin-left: 25px;
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #dadada;
  line-height: 20px;
  text-align: left;
  font-style: normal;
  display: inline-block;
  margin-right: 106px;
  vertical-align: top;
  /* 顶部对齐 */
}

.messageBox2-center-left {
  vertical-align: top;
  /* 顶部对齐 */
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 500;
  font-size: 14px;
  color: #ffffff;
  font-style: normal;
  flex: 1;
}

.messageBox-center-right {
  display: inline-block;
  flex: 1;
  vertical-align: top;
  /* 顶部对齐 */
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #dadada;
  line-height: 20px;
  font-style: normal;
}

.messageBox2-center-right {
  flex: 1;
  vertical-align: top;
  /* 顶部对齐 */
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 500;
  font-size: 14px;
  color: #ffffff;
  font-style: normal;
}

.fly {
  display: inline-block;
  width: 17px;
  height: 16px;
}

.right {
  margin-top: 16px;

  .rightMessage {
    // width: 457px;
    height: 112px;
    border-radius: 4px;
    background: #f7f8fc;

    .rightMessageText {
      height: 40px;
      line-height: 40px;
      display: flex;
      color: #333333;
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: 500;
      align-content: center;
      place-items: center;

      .rightMessagePng {
        margin-left: 14px;
        margin-right: 10px;
        width: 14px;
        height: 14px;
      }
    }
  }
}

.basicInfo {
  &-icon {
    margin-left: 10px;
    width: 6px;
    height: 14px;
  }
}

.tuijiantuBox {
  .promotion-group {
    margin-bottom: 16px;
    border-radius: 8px;
    overflow: hidden;
    background: #fff;

    &:last-child {
      margin-bottom: 0;
    }

    .promotion-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #f0f6ff;
      padding: 14px 16px;
      user-select: none;
    }

    &__title {
      font-weight: 600;
      font-size: 16px;
      color: #333333;
    }

    .promotion-toggle {
      font-size: 14px;
      color: #3a7cff;
      display: inline-flex;
      align-items: center;
      column-gap: 4px;
    }

    &__content {
      padding: 16px;
      background: #f7f8fc;
    }

    &__item {
      margin-bottom: 18px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .tuijiantuBox_top {
    margin-right: 20px;
    padding-left: 16px;
    height: 50px;
    line-height: 50px;
    display: flex;
    border-radius: 4px 4px 0 0;
    background: #f0f6ff;
    box-sizing: border-box;
    border: 1px solid #ecf0fc;
  }

  .tuijiantuBox_top_banben {
    margin-right: 29px;
    width: 147px;
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 600;
    font-size: 20px;
    color: #cadaff;
    text-align: left;
    font-style: normal;
    color: #333333;
  }

  .tuijiantuBox_top_time {
    margin-top: 10px;
    margin-right: 10px;
    width: 12px;
    height: 28px;
    line-height: 28px;

    img {
      width: 12px;
      height: 12px;
      vertical-align: middle;
    }
  }

  .tuijiantuBox_top_banbenTime {
    margin-right: 16px;
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #666;
    text-align: left;
    font-style: normal;
  }

  .tuijiantuBox_top_banbenTimeText {
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #666;
    text-align: left;
    font-style: normal;
  }

  .banKuai {
    margin-bottom: 20px;
    display: flex;
  }
}

// dialog2相关样式已移至对应组件中

.dialog2 {
  .dialog2_close {
    position: absolute;
    top: 16px;
    right: 16px;
    cursor: pointer;

    img {
      width: 18px;
      height: 18px;
    }
  }

  .topZhanWei {
    width: 398px;
    height: 54px;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 10px;
  }

  .dialog2-top {
    display: flex;
    margin-bottom: 16px;

    .dialog2-top-left {
      margin-left: 30px;
      margin-right: 28px;
      width: 118px;
      height: 220px;
      background: #f7f8fc;
      border-radius: 10px;
      position: relative;

      .Urlimg {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    .dialog2-top-right {
      flex: 1;
      // height: 118px;
      border-radius: 8px;

      .dialog2-top-right-title {
        display: flex;
        padding-left: 30px;
        height: 32px;
        line-height: 32px;
        background: #f8f9fc;
        border-radius: 8px 8px 0 0;
        font-family:
          PingFangSC,
          PingFang SC;
        font-weight: 500;
        font-size: 14px;
        color: #3d3d3d;
        font-style: normal;
        place-items: center;
      }

      .dialog2-top-right-list {
        display: flex;
        flex-direction: column;
      }

      .dialog2-top-right-item {
        display: flex;
        margin-bottom: 16px;
        height: 30px;
        line-height: 30px;

        .dialog2-right-line {
          margin-top: 15px;
          margin-right: 16px;
          width: 149px;
          height: 1px;
          border-top: 1px dashed #46507d;
          opacity: 0.69;
        }

        img {
          margin-left: 30px;
          margin-right: 14px;
          margin-top: 8px;
          width: 14px;
          height: 14px;
        }

        .dialog2-top-right-item-name {
          margin-right: 19px;
          font-family:
            PingFangSC,
            PingFang SC;
          font-weight: 400;
          font-size: 14px;
          color: #dadada;
          text-align: left;
          font-style: normal;
        }

        .dialog2-right-text {
          width: 80px;
          height: 100%;
          background: #c8c8cb;
          border-radius: 4px;
          border: 1px solid #dbe0e0;
          text-align: center;
        }

        .dialog2-right-text2 {
          width: 80px;
          height: 100%;
          background: #afd1b5;
          border-radius: 4px;
          border: 1px solid #dbe0e0;
          text-align: center;
        }

        .dialog2-right-text3 {
          width: 80px;
          height: 100%;
          background: #fbeada;
          border-radius: 4px;
          border: 1px solid #dbe0e0;
          text-align: center;
        }

        .dialog2-right-text4 {
          width: 80px;
          height: 100%;
          background: #bfe9f2;
          border-radius: 4px;
          border: 1px solid #dbe0e0;
          text-align: center;
        }

        .dialog2-right-text5 {
          width: 80px;
          height: 100%;
          background: #c5dbfe;
          border-radius: 4px;
          border: 1px solid #dbe0e0;
          text-align: center;
        }
      }

      .dialog2-top-right-item:nth-child(1) {
        margin-top: 10px;
      }
    }
  }

  .dialog2-content {
    display: flex;

    .dialog2-content-left {
      margin-left: 30px;
      margin-right: 19px;
      width: 192px;
      padding: 10px;
      background-color: #f7f8fc;
      height: 294px;

      .dialog2-content-left-title {
        margin-bottom: 16px;
        font-family:
          PingFangSC,
          PingFang SC;
        font-weight: 500;
        font-size: 14px;
        color: #333333;
        text-align: left;
        font-style: normal;

        img {
          // margin-left: 14px;
          margin-top: 2px;
          margin-right: 10px;
          width: 14px;
          height: 12px;
        }
      }

      .dialog2-content-left-xuqiu {
        display: flex;
        // margin-bottom: 24px;
        flex-direction: column;

        .dialog2-content-left-xuqiu-text {
          margin-right: 20px;
          width: 104px;
          height: 32px;
          line-height: 32px;
          // text-align: center;
          border-radius: 4px;
          color: #666666;
        }

        .dialog2-content-left-xuqiu-value {
          flex: 1;
          text-align: left;
          line-height: 32px;
          color: #333;
          font-family:
            PingFangSC,
            PingFang SC;
          font-weight: 600;
          font-size: 14px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          background-color: #ffffff;
        }

        .cetumudi {
          // height: 200px;
          white-space: normal;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          // -webkit-line-clamp: 5;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: normal;
        }
      }
    }

    .dialog2-content-right {
      margin-top: -30px;
      flex: 1 0 auto;
      width: 0;

      .dialog2-content-right-top {
        position: relative;
        height: 44px;
        display: flex;
        vertical-align: middle;
        font-family:
          PingFangSC,
          PingFang SC;
        font-weight: 400;
        font-size: 14px;
        text-align: left;
        font-style: normal;
        line-height: 44px;
        border-radius: 4px 4px 0 0;
        background: #f7f8fc;
        color: #333333;

        img {
          margin-left: 16px;
          margin-right: 4px;
          width: 12px;
          height: 12px;
          vertical-align: middle;
        }

        .dialog2-content-right-top-value {
          margin-left: 20px;
          color: #ffffff;
        }
      }

      .dialog2-content-right-content {
        // height: 1106px;
        border-radius: 0 0 4px 4px;
        box-sizing: border-box;
        border: 1px solid #ecf0fc;
        padding-bottom: 10px;
        box-sizing: border-box;

        .dialog2-content-right-content-header {
          height: 14px;
        }

        .dialog2-content-right-content-top {
          margin-left: 16px;
          margin-bottom: 13px;
          width: 86px;
          height: 32px;
          border-radius: 17px;
          border: 1px solid #494975;
          line-height: 32px;
          font-family:
            PingFangSC,
            PingFang SC;
          font-weight: 400;
          font-size: 14px;
          color: #ffffff;
          text-align: left;
          font-style: normal;
          vertical-align: middle;
          cursor: pointer;

          img {
            vertical-align: middle;
            margin-right: 12px;
            margin-left: 14px;
            width: 14px;
            height: 14px;
          }
        }

        .dialog2-content-right-content-footer-text {
          margin-left: 16px;
          margin-top: 12px;
          padding-top: 8px;
          padding-left: 18px;
          padding-right: 16px;
          padding-bottom: 8px;
          height: 40px;
          margin-right: 30px;
          background: #f0f6ff;
          border-radius: 4px;
          overflow-y: hidden;
          font-family:
            PingFangSC,
            PingFang SC;
          font-weight: 400;
          font-size: 14px;
          color: #333333;
          overflow-y: auto;
        }
      }
    }
  }

  .dialog2-footerImgs {
    margin: 8px 0 0 30px;

    .dialog2-footerImgs-Title {
      display: flex;
      height: 41px;
      border-radius: 4px 4px 0 0;
      background: #f8f9fc;
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: 600;
      line-height: normal;
      letter-spacing: normal;
      color: #333;
      align-items: center;

      .TitleImg {
        margin-left: 14px;
        margin-right: 11px;
        width: 14px;
        height: 14px;
      }
    }

    .imgsUrl {
      // width: 334px;
      // height: 124px;
      padding: 10px;
      border-radius: 0 0 4px 4px;
      box-sizing: border-box;
      border: 1px solid #ecf0fc;
      gap: 10px;
      display: flex;
      overflow: hidden;
      overflow-x: scroll;
    }

    .imgsUrl2 {
      height: 124px;
      border-radius: 0 0 4px 4px;
      border: 1px solid #ecf0fc;

      img {
        margin-top: 20px;
      }

      .nodata {
        font-family: PingFang SC;
        font-size: 12px;
        font-weight: normal;
        line-height: normal;
        letter-spacing: 3px;
        color: #9b9999;
      }
    }
  }
}

.dialog2-content-right-content-footer-top {
  height: 40px;
  line-height: 40px;
  display: flex;
  padding-left: 16px;
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #dadada;
  font-style: normal;

  img {
    margin-top: 14px;
    margin-left: 16px;
    margin-right: 10px;
    width: 13px;
    height: 13px;
  }
}

.dialog3 {
  :deep(.el-dialog__header) {
    display: none;
  }
}

.dialog3 {
  :deep(.el-dialog) {
    // margin: 6.94vh auto;
    // margin-top: 70px;
    width: 1245px;
    // height: 752.000006px;
    padding: 0;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
    border-radius: 8px;
  }
}

.dialog3 {
  // width: 100;
  // height: 100vh;

  .dialog3-zhan {
    height: 20px;
  }

  .dialog3-top {
    display: flex;
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 500;
    font-size: 14px;
    color: #333;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 16px;
    padding-left: 20px;

    img {
      margin-top: 3px;
      margin-left: 20px;
      margin-right: 16px;
      width: 14px;
      height: 14px;
    }
  }

  .dialog3-content {
    margin-left: 20px;
    margin-top: 20px;
    border-radius: 14px;
    padding-right: 20px;
    box-sizing: border-box;
  }

  .dialog3-imgsText {
    font-size: 14px;
    font-weight: normal;
    margin-left: 20px;
    text-align: right;
    margin-right: 10px;
    letter-spacing: normal;
    color: #666666;
  }

  .dialog3-imgs {
    // height: 17.708333vw;
    overflow: hidden;
    overflow-y: scroll;
  }
}

.dialog3 {
  :deep(.el-form-item__label) {
    width: 100px;
    font-family: AlibabaPuHuiTi_2_55_Regular;
    font-size: 14px;
    color: #666;
  }
}

.dialog3 {
  .input-container2 {
    display: flex;
    align-items: center;
    gap: 4px;
    width: 250px;
    /* 控制输入框与%的间距 */
  }

  .percent-symbol {
    color: #666;
    /* 按需调整颜色 */
    font-size: inherit;
  }
}

.dialog3 {
  :deep(.el-input__inner) {
    width: 120px;
    // background: #14171c;
  }
}

// .dialog3 {
//   :deep(.el-input__wrapper) {
//     // background: #14171c;
//   }
// }
.dialog3 {
  :deep(.el-textarea__inner) {
    // width: 34.533333vw;
    // height: 4.791667vw;
    // background: #14171c;
    border-radius: 4px;
    color: #333;
    // border: none;
    // box-shadow: none;
  }
}

.dialog3-footer {
  width: 100%;
  // height: 3.645833vw;
  display: flex;
  padding-bottom: 16px;
  display: flex;
  flex-direction: row;
  justify-content: center;

  .dialog3-footer-close {
    // margin-top: 20px;
    margin-top: 10px;
    // margin-left: 34.375vw;
    margin-right: 26px;
    width: 68px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    font-family: AlibabaPuHuiTi_2_55_Regular;
    font-size: 12px;
    color: #333;
    background: #fff;
    border-radius: 4px;
    cursor: pointer;
    border: 1px solid #e5e5e5;
  }

  .dialog3-footer-submit {
    // margin-top: 20px;
    margin-top: 10px;
    width: 68px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    font-family: AlibabaPuHuiTi_2_55_Regular;
    font-size: 12px;
    color: #ffffff;
    border-radius: 4px;
    cursor: pointer;
    background: #0064ff;
  }
}

/* Chrome、Safari、Edge 等 WebKit 内核浏览器 */
::-webkit-scrollbar {
  width: 6px;
  /* 滚动条整体宽度，可根据需求调整 */
}

::-webkit-scrollbar-track {
  background: transparent;
  /* 隐藏滚动条轨道 */
}

::-webkit-scrollbar-thumb {
  background: #d1d9e5;
  /* 滚动条滑块颜色 */
  border-radius: 3px;
  /* 滑块圆角，让滚动条更圆润 */
}

.message-list-line {
  margin-top: 10px;
  margin-bottom: 10px;
  width: 2157px;
  height: 1px;
  border-top: 1px solid #4c5061;
  opacity: 0.4;
}

.zhexiantu {
  width: 118px;
  padding-left: 10px;
  height: 48px;
  background: #090b15;
  border-radius: 6px;
  border: 1px solid #444b63;
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 500;
  font-size: 14px;
  color: #ffffff;
  line-height: 20px;
  text-align: left;
  font-style: normal;
  line-height: 48px;
  cursor: pointer;

  img {
    margin-left: 5px;
    width: 14px;
    height: 12px;
    vertical-align: middle;
  }
}

.zhexiantu:hover {
  background: #090b15;
  border-radius: 6px;
  border: 1px solid #3965ff;
}

.dialog2-content-right-line {
  margin-left: 20px;
  margin-top: 14px;
  margin-bottom: 8px;
  width: 347px;
  height: 1px;
}

.dialog2-content-right-update {
  display: flex;
  margin-bottom: 16px;

  .name {
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #666;
    text-align: left;
    font-style: normal;
  }

  .nameValue {
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 400;
    font-size: 14px;
    text-align: left;
    font-style: normal;
    color: #333333;
  }
}

.jiezhiText {
  margin-left: 295px;
  margin-right: 16px;
  font-size: 16px;
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 400;
  color: #6365ff;
  text-align: left;
  font-style: normal;
}

.jiezhiTextValue {
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 400;
  font-size: 16px;
  color: #6365ff;
  text-align: left;
  font-style: normal;
}

.mainContainer-coverBg-imgs {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  height: 52px;
  border-radius: 4px;
  background: #f7f8fc;
  align-items: center;
  padding: 0 14px;

  /* 垂直居中（交叉轴方向） */
  .zhexianatux {
    // margin-left: 16px;
    width: 34px;
    height: 33px;
  }

  .zhexianatuxValue {
    margin-left: 10px;
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: normal;
    color: #333333;
  }

  .zhexianatuxButton {
    width: 60px;
    height: 32px;
    border-radius: 2px;
    line-height: 32px;
    /* 主题色/主色 */
    background: #0064ff;
    color: #fff;
    text-align: center;
    cursor: pointer;
  }
}

.rightMessageTop {
  margin: 0 14px;
  padding: 10px;
  display: flex;
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: normal;
  letter-spacing: normal;
  color: #666666;
  background: #ffffff;
  // height: 25px;
  justify-content: space-between;

  & > div {
    flex: 1 0 auto;
    flex-shrink: 0;
    width: 0;
  }

  .right-message-top-item {
    margin-top: 6px;
    font-weight: 600;
    color: #333;
  }
}

.textValue {
  // display: flex;
  // align-items: center;
  white-space: nowrap;
  /* 禁止换行 */
  overflow: hidden;
  /* 溢出内容隐藏 */
  text-overflow: ellipsis;
  /* 溢出内容显示省略号 */
}

.textValue2 {
  display: flex;
  align-items: center;
}

.rightMessageValue {
  padding: 0 0 10px 0;
  margin: 0 14px;
  display: flex;
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: normal;
  color: #333333;
  background: #ffffff;
}

.rightMessageBottom {
  width: 457px;
  height: 185px;
  border-radius: 4px;
  background: #f7f8fc;
  margin-top: 16px;

  .rightMessageBottomTop {
    display: flex;
    height: 20px;
    place-items: center;
    margin-bottom: 10px;

    .blueTimePng {
      margin: 0 10px 0 14px;
      width: 14px;
      height: 14px;
    }

    .rightMessageBottomTopText {
      margin-right: 220px;
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: normal;
      color: #333333;
    }

    .rightMessageBottomTopValue {
      font-size: 14px;
      color: #666666;
    }
  }

  .rightMessageBottomCenter {
    margin: 0 14px;
    padding: 0 12px;
    height: 136px;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .rightMessageBottomCenterTopText {
      margin-top: 10px;
      display: flex;
      color: #727e93;
      font-family: PingFang SC;
      font-size: 14px;
    }

    .rightMessageBottomCenterTopValue {
      margin-top: 10px;
      margin-bottom: 10px;
      display: flex;
      color: #333333;
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: 500;
      align-items: center;
    }

    .rightMessageBottomCenterLine {
      border-bottom: 1px solid #f0f0f0;
    }
  }
}

.picBox {
  width: 157px;
  height: 185px;
  display: flex;
  margin-right: 14px;
  border-radius: 6px;
  background: #e7e8eb;
  overflow: hidden;
  /* 确保图片被裁剪为圆角 */
  margin-bottom: 10px;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* 可选：确保图片填满容器且不变形 */
  }
}

.pic-list {
  width: 100%;
  margin-left: 16px;
  padding-bottom: 10px;
  display: flex;
  overflow-x: scroll;

  /* 新增横向滚动条样式 */
  &::-webkit-scrollbar {
    height: 3px;
    /* 横向滚动条高度（即视觉上的宽度），建议比纵向更细 */
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    /* 隐藏滚动条轨道 */
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d9e5;
    /* 滚动条滑块颜色 */
    border-radius: 3px;
    /* 滑块圆角 */
  }
}

.nameUser {
  width: 98px;
  height: 32px;
  line-height: 32px;
  color: #666666;
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: normal;
  border-right: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
  text-align: center;
}

.UserNameValue {
  padding-left: 50px;
  width: 100%;
  height: 32px;
  line-height: 32px;
  color: #333333;
  border-bottom: 1px solid #ebeef5;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.bianjiButoon {
  width: 60px;
  height: 32px;
  border-radius: 2px;
  /* 主题色/主色 */
  background: #0064ff;
  color: #fff;
  text-align: center;
  line-height: 32px;
  cursor: pointer;
  position: absolute;
  top: 50%;
  right: 19px;
  transform: translateY(-50%);
}

.leftButton {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateX(-50%);
  transform: translateY(-50%);
  cursor: pointer;
}

.rightButton {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateX(50%);
  transform: translateY(-50%);
  cursor: pointer;
}

.conclusionTypeClass {
  flex: 1;
  margin-left: 24px;
  margin-right: 20px;
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #333333;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.content-main {
  // height: 83.15vh;
  // height: 856px;
  // margin-top: 14px;
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 0;

  .content-scrollbar {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  .button-group {
    padding: 16px;
    display: flex;
    justify-content: flex-end;
  }
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.header-title-content {
  .title-desc {
    font-size: 16px;
    font-weight: 400;
    color: #333333;
    font-weight: bold;

    .title-header {
      font-family:
        PingFangSC,
        PingFang SC;
      font-weight: 400;
      font-size: 14px;
      color: #666666;
      text-align: left;
      font-style: normal;
    }
  }
}

.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-items: center;
}

.form-item {
  align-items: center;
}

.mapping-time {
  margin-left: 14px;
}

/* 添加到现有样式中 */
.form-input {
  width: 250px !important;
  /* 统一所有输入框宽度 */
}

.dialog3 {
  :deep(.el-form-item__label) {
    width: 120px !important;
    /* 统一所有标签宽度 */
    text-align: right;
    padding-right: 12px;
  }

  :deep(.el-input) {
    width: 100% !important;
    /* 让输入框填充容器 */
  }

  :deep(.el-input__inner) {
    width: 100% !important;
    /* 覆盖之前设置的120px宽度 */
  }

  :deep(.el-select) {
    width: 100% !important;
    /* 让下拉框与输入框宽度一致 */
  }
}

/* 对于textarea保持原有样式 */
.dialog3 {
  :deep(.el-form-item.is-textarea .el-textarea__inner) {
    width: 100% !important;
  }
}

.imgsUrl2 {
  height: 124px;
  border-radius: 0 0 4px 4px;
  border: 1px solid #ecf0fc;

  img {
    margin-top: 20px;
  }

  .nodata {
    font-family: PingFang SC;
    font-size: 12px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 3px;
    color: #9b9999;
  }
}

.img-item {
  width: 100px;
  height: 100px;
}

.img-link {
  margin-top: 4px;
  font-size: 12px;

  :deep(.el-link__inner) {
    word-break: break-all;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
  }
}

:deep(.el-drawer) {
  .el-drawer__header {
    padding: 0 20px;
    margin: 0;
    border-bottom: 1px solid #f0f0f0;
    height: 52px;
  }

  .el-drawer__body {
    background: #fff;
    padding: 20px;
  }
}
</style>
