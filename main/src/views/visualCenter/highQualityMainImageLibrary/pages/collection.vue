<template>
  <flux-wrap use-scroll-bar>
    <div class="collection-body">
      <div class="left-panel">
        <section-title-header title-size="16px" class="mb-16"> 商品基本信息 </section-title-header>

        <div class="main-image-box">
          <image-display width="426" height="366" :src="detailData.url" fit="contain" />
        </div>

        <div v-if="detailData.collectionType !== 3" class="car-data-header">
          <span class="header-text">车图数据</span>
          <el-button type="primary" size="small" round class="enter-btn" @click="openGallery">
            进入 <el-icon class="el-icon--right"><ArrowRight /></el-icon>
          </el-button>
        </div>

        <div class="description">
          <el-scrollbar>
            <FormDescription :column="2" label-width="90px">
              <FormDescriptionItem label="商品名称" :span="2">
                {{ detailData.productName }}
              </FormDescriptionItem>

              <FormDescriptionItem label="收藏时间">
                {{ detailData.collectionTime }}
              </FormDescriptionItem>

              <FormDescriptionItem label="收藏人">
                <div class="user-cell">
                  <avatar-display
                    :size="20"
                    :avatars="[{ name: detailData.collectorName, src: detailData.collectorAvatar }]"
                  />
                </div>
              </FormDescriptionItem>

              <FormDescriptionItem label="产品编码">
                {{ detailData.productCode || '-' }}
              </FormDescriptionItem>

              <FormDescriptionItem label="商品ID">
                {{ detailData.collectionType === 2 ? '-' : detailData.productId || '-' }}
              </FormDescriptionItem>

              <FormDescriptionItem label="上架时间" :span="2">
                {{ detailData.collectionType === 2 ? '-' : detailData.launchTime || '-' }}
              </FormDescriptionItem>

              <FormDescriptionItem label="标签" :span="2">
                <div class="tag-list-container">
                  <OverflowTags
                    :items="detailData.tags"
                    :lines="0"
                    :tag-style="{
                      backgroundColor: 'rgba(0, 100, 255, 0.1)',
                      color: 'var(--el-color-primary)'
                    }"
                  />
                </div>
              </FormDescriptionItem>

              <FormDescriptionItem label="收藏原因" :span="2">
                <div class="reason-text">
                  {{ detailData.reason || '-' }}
                </div>
              </FormDescriptionItem>
            </FormDescription>
          </el-scrollbar>
        </div>
      </div>

      <div class="right-panel">
        <el-scrollbar>
          <div class="right-panel-content">
            <div class="right-header">
              <section-title-header title-size="16px" title="产品介绍">
                <template #right>
                  <div class="meta-info">
                    <span class="meta-item">
                      填写人：<avatar-display
                        :size="18"
                        :name-size="14"
                        :avatars="[{ name: userName, src: userAvatar }]"
                        :name-style="{ color: '#666' }"
                      />
                    </span>
                    <el-divider class="divider" direction="vertical" />
                    <span class="meta-item">填写时间：{{ currentDate || '-' }}</span>
                  </div>
                </template>
              </section-title-header>
            </div>

            <el-form :model="formModel" ref="formRef" class="intro-form">
              <div class="form-grid">
                <!-- <div class="grid-row">
                  <div class="grid-label">目标客群</div>
                  <div class="grid-content">
                    <s-textarea v-model="formModel.targetAudience" placeholder="" rows="3" />
                  </div>
                </div> -->
                <div class="grid-row">
                  <div class="grid-label">产品定位</div>
                  <div class="grid-content">
                    <s-textarea
                      v-model="formModel.productPosition"
                      placeholder="请输入产品的几大素(例如产品类型、季节、人群等）"
                      rows="3"
                    />
                  </div>
                </div>
                <div class="grid-row">
                  <div class="grid-label">视觉风格</div>
                  <div class="grid-content">
                    <s-textarea
                      v-model="formModel.visualStyle"
                      placeholder="请输入视觉是怎么呈现的的几大要素(光线、背景、色调、核心呈现等)"
                      rows="3"
                    />
                  </div>
                </div>
              </div>
            </el-form>
          </div>

          <div class="analysis-section mt-16px right-panel-content">
            <section-title-header title-size="16px">图库视觉分析</section-title-header>

            <div class="analysis-section-content">
              <el-tabs v-model="activeTab" class="custom-tabs">
                <el-tab-pane name="planner">
                  <template #label>
                    <span class="custom-tabs-label">
                      <span>策划人员</span>
                      <span class="tab-count">{{`(${detailData.planCount})` }}</span>
                    </span>
                  </template>
                </el-tab-pane>
                <el-tab-pane name="photographer">
                  <template #label>
                    <span class="custom-tabs-label">
                      <span>人像拍摄</span>
                      <span class="tab-count">{{`(${detailData.shootCount})` }}</span>
                    </span>
                  </template>
                </el-tab-pane>
                <el-tab-pane name="still">
                  <template #label>
                    <span class="custom-tabs-label">
                      <span>静物拍摄</span>
                      <span class="tab-count">{{`(${detailData.stillCount})` }}</span>
                    </span>
                  </template>
                </el-tab-pane>
                <el-tab-pane name="retoucher">
                  <template #label>
                    <span class="custom-tabs-label">
                      <span>修图人员</span>
                      <span class="tab-count">{{`(${detailData.retouchCount})` }}</span>
                    </span>
                  </template>
                </el-tab-pane>
              </el-tabs>
              <el-form :model="formModel" class="analysis-form">
                <div class="role-upload-section">
                  <el-form-item :label="currentTabConfig.label">
                    <avatar-display
                      :size="18"
                      :name-size="14"
                      :avatars="[{ name: currentTabUser.name, src: currentTabUser.avatar }]"
                      :name-style="{ color: '#666' }"
                    />
                  </el-form-item>
                </div>
                <div class="keypoint-section">
                  <div class="keypoint-header">
                    <section-title-header title-size="14px" :has-dot="false">
                      要点提炼
                      <template #right>
                        <div class="keypoint-actions">
                          <el-button type="primary" @click="handleAddKeyPoint(activeTab)">
                            + 添加
                          </el-button>
                          <el-link
                            type="primary"
                            :underline="false"
                            class="collapse-link"
                            @click="toggleKeyPointCollapse(activeTab)"
                          >
                            {{ keyPointCollapse[activeTab] ? '收起' : '展开' }}
                            <el-icon
                              class="collapse-icon"
                              :class="{ rotated: keyPointCollapse[activeTab] }"
                            >
                              <ArrowDown />
                            </el-icon>
                          </el-link>
                        </div>
                      </template>
                    </section-title-header>
                  </div>
                  <ElCollapseTransition>
                    <div v-show="keyPointCollapse[activeTab]" class="keypoint-table-wrapper">
                      <s-table
                        class="keypoint-table"
                        :columns="keyPointColumns"
                        :data="currentKeyPointList"
                        :showPagination="false"
                        :showLoading="false"
                        size="small"
                        border
                      >
                        <template #keyPoints="{ row, $index }">
                          <dict-select
                            v-model="row.keyPoints"
                            :dict-type="keyPointDictType"
                            placeholder="请选择要点"
                            @change="forceKeyPointUpdate($index, activeTab)"
                          />
                        </template>
                        <template #keyPointsIntroduction="{ row, $index }">
                          <el-input
                            v-model="row.keyPointsIntroduction"
                            placeholder="请输入备注"
                            type="textarea"
                            :rows="2"
                            @input="forceKeyPointUpdate($index, activeTab)"
                            maxlength="300"
                            show-word-limit
                          />
                        </template>
                        <template #action="{ $index }">
                          <el-button
                            link
                            type="danger"
                            :disabled="currentKeyPointList.length <= 1"
                            @click="handleDeleteKeyPoint($index, activeTab)"
                            >删除</el-button
                          >
                        </template>
                      </s-table>
                    </div>
                  </ElCollapseTransition>
                </div>
                <el-form-item label="案例上传" :prop="currentTabConfig.formProp">
                  <Transfer
                    :key="activeTab"
                    v-model="formModel[currentTabConfig.modelKey].imageList"
                    :limit="5"
                    accept-type="all"
                    value-type="array"
                    show-time
                  />
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>

    <template #footer>
      <div class="footer-actions">
        <el-button @click="handleCancel">返回</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </template>
  </flux-wrap>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowRight, ArrowDown } from '@element-plus/icons-vue'
import { cloneDeep } from 'lodash-es'
import FluxWrap from '@/components/ContentWrap/src/fluxWrap.vue'
import { FormDescription, FormDescriptionItem } from '@/components/Descriptions'
import {
  getHighQualityCollectionDetail,
  saveCollectionInfoSupplement,
  type HighQualityRecord
} from '@/api/visualCenter/highQualityMainImageLibrary'
import { useMessage } from '@/hooks/web/useMessage'
import eventBus from '@/utils/eventBus'
import DictSelect from '@/components/Select/DictSelect/index.vue'
import type { TableColumn } from '@/components/SWTable/src/table'
import { consistency } from '@/utils'

const message = useMessage()
const router = useRouter()
const route = useRoute()

const dialogTitle = ref('主图信息')
const activeTab = ref<'planner' | 'photographer' | 'still' | 'retoucher'>('planner')

const userAvatar = ref('')
const userName = ref('')
const currentDate = ref('')

const defaultDetailData = () => ({
  url: '',
  productName: '',
  collectionTime: '',
  collectorName: '',
  collectorAvatar: '',
  productCode: '',
  productId: '',
  launchTime: '',
  tags: [] as string[],
  reason: '',
  collectionType: 0 as number,
  planCount: 0 as number, // 策划要点
  shootCount: 0 as number, // 人像拍摄
  stillCount: 0 as number, // 静物拍摄
  retouchCount: 0 as number, // 修图人员
})
type DetailData = ReturnType<typeof defaultDetailData>
const detailData = ref<DetailData>(defaultDetailData())

type KeyPointItem = {
  keyPoints: string
  keyPointsIntroduction: string
}
type ImageSection = {
  imageList: any[]
  keyPointsExtractedList: KeyPointItem[]
}

const createImageSection = (): ImageSection => ({
  imageList: [],
  keyPointsExtractedList: [{ keyPoints: '', keyPointsIntroduction: '' }]
})

const createDefaultFormModel = () => ({
  targetAudience: '',
  productPosition: '',
  visualStyle: '',
  planImage: createImageSection(),
  shootImage: createImageSection(),
  stillImage: createImageSection(),
  retouchImage: createImageSection()
})
type FormModel = ReturnType<typeof createDefaultFormModel>

const formModel = ref<FormModel>(createDefaultFormModel())
const bukValue = ref<FormModel>(cloneDeep(formModel.value))

const tabUserInfo = ref({
  planner: { name: '', avatar: '' },
  photographer: { name: '', avatar: '' },
  still: { name: '', avatar: '' },
  retoucher: { name: '', avatar: '' }
})

const tabConfigMap = {
  planner: {
    label: '策划人员',
    modelKey: 'planImage',
    formProp: 'planImage.imageList',
    uploadCode: 'visual_analysis_planner',
    keyPointDictCode: 'plan_image_key_points'
  },
  photographer: {
    label: '人像拍摄',
    modelKey: 'shootImage',
    formProp: 'shootImage.imageList',
    uploadCode: 'visual_analysis_photographer',
    keyPointDictCode: 'shoot_image_key_points'
  },
  still: {
    label: '静物拍摄',
    modelKey: 'stillImage',
    formProp: 'stillImage.imageList',
    uploadCode: 'visual_analysis_still',
    keyPointDictCode: 'still_image_key_points'
  },
  retoucher: {
    label: '修图人员',
    modelKey: 'retouchImage',
    formProp: 'retouchImage.imageList',
    uploadCode: 'visual_analysis_retoucher',
    keyPointDictCode: 'retouch_image_key_points'
  }
} as const

const currentTabConfig = computed(() => {
  return tabConfigMap[activeTab.value]
})

const currentTabUser = computed(() => {
  return tabUserInfo.value[activeTab.value] || { name: '', avatar: '' }
})

const keyPointDictType = computed(() => currentTabConfig.value.keyPointDictCode)
const keyPointColumns = computed<TableColumn[]>(() => [
  {
    prop: 'keyPoints',
    label: `${currentTabConfig.value.label}要点`,
    minWidth: 100,
    align: 'left',
    headerAlign: 'left'
  },
  {
    prop: 'keyPointsIntroduction',
    label: '备注',
    minWidth: 260,
    align: 'left',
    headerAlign: 'left'
  },
  { prop: 'action', label: '操作', width: 80, align: 'center' }
])

const keyPointCollapse = ref<Record<'planner' | 'photographer' | 'still' | 'retoucher', boolean>>({
  planner: true,
  photographer: true,
  still: true,
  retoucher: true
})

const currentKeyPointList = computed<KeyPointItem[]>(() => {
  return formModel.value[currentTabConfig.value.modelKey].keyPointsExtractedList
})

const getTags = (record: HighQualityRecord): string[] => {
  const tags: string[] = []
  const pushTags = (str: string | null | undefined) => {
    if (str && typeof str === 'string' && str.trim() !== '') {
      const splitTags = str.split(',').filter((t) => t.trim() !== '')
      tags.push(...splitTags)
    }
  }

  pushTags(record.marketPositionStr)
  pushTags(record.masterImageCollectionCategoryStr)
  pushTags(record.masterImageCollectionFabricStr)
  pushTags(record.masterImageCollectionFormStr)

  return tags
}

const currentId = ref('')

const loadDetail = async (id: string) => {
  dialogTitle.value = '主图信息'
  currentDate.value = ''
  userName.value = ''
  userAvatar.value = ''
  currentId.value = ''

  try {
    const item = await getHighQualityCollectionDetail(id)
    detailData.value = {
      ...defaultDetailData(),
      url: item.imageUrl,
      productName: item.goodsName,
      productCode: item.goodsCode,
      productId: item.goodsId,
      collectionTime: item.collectionDate,
      collectorName: item.collectionUserName,
      collectorAvatar: item.collectionUserAvatarOrigin,
      tags: getTags(item),
      reason: item.collectionReason,
      launchTime: item.groundingTime || '',
      collectionType: item.collectionType,
      planCount: item.planCount,
      shootCount: item.shootCount,
      stillCount: item.stillCount,
      retouchCount: item.retouchCount,
    }

    userName.value = item.productIntroductionUserName || ''
    userAvatar.value = item.productIntroductionUserAvatarOrigin || ''
    currentDate.value = item.productIntroductionDate || ''

    tabUserInfo.value = {
      planner: { name: item.planUserName || '', avatar: item.planUserAvatarOrigin || '' },
      photographer: { name: item.shootUserName || '', avatar: item.shootUserAvatarOrigin || '' },
      still: { name: item.stillUserName || '', avatar: item.stillUserAvatarOrigin || '' },
      retoucher: { name: item.retouchUserName || '', avatar: item.retouchUserAvatarOrigin || '' }
    }

    const mapList = (list?: any[]) =>
      Array.isArray(list)
        ? list.map((v) => ({
            ...v,
            createdAt: v.uploadTime
          }))
        : []

    const mapKeyPoints = (list?: any[]): KeyPointItem[] => {
      const mapped = Array.isArray(list)
        ? list.map((v) => ({
            keyPoints: v.keyPoints ?? '',
            keyPointsIntroduction: v.keyPointsIntroduction ?? ''
          }))
        : []
      return mapped.length ? mapped : [{ keyPoints: '', keyPointsIntroduction: '' }]
    }

    const normalizeImageSection = (section?: any, fallbackList?: any[]): ImageSection => ({
      imageList: mapList(section?.imageList ?? fallbackList),
      keyPointsExtractedList: mapKeyPoints(section?.keyPointsExtractedList)
    })

    activeTab.value = 'planner'
    formModel.value = {
      ...createDefaultFormModel(),
      targetAudience: item.targetAudience ?? '',
      productPosition: item.productPosition ?? '',
      visualStyle: item.visualStyle ?? '',
      planImage: normalizeImageSection(item.planImage, item.planImageList),
      shootImage: normalizeImageSection(item.shootImage, item.shootImageList),
      stillImage: normalizeImageSection(item.stillImage, item.stillImageList),
      retouchImage: normalizeImageSection(item.retouchImage, item.retouchImageList)
    }
    bukValue.value = cloneDeep(formModel.value)
    currentId.value = id
  } catch (error) {
    console.error('获取详情失败', error)
    message.error('获取详情失败')
  }
}

const handleCancel = () => {
  consistency(formModel.value, bukValue.value, goBack)
}

const handleConfirm = async () => {
  const {
    targetAudience,
    productPosition,
    visualStyle,
    planImage,
    shootImage,
    stillImage,
    retouchImage
  } = formModel.value

  //!targetAudience?.trim() &&
  const isTextEmpty =  !productPosition?.trim() && !visualStyle?.trim()
  const isFilesEmpty =
    (!planImage?.imageList || planImage.imageList.length === 0) &&
    (!shootImage?.imageList || shootImage.imageList.length === 0) &&
    (!stillImage?.imageList || stillImage.imageList.length === 0) &&
    (!retouchImage?.imageList || retouchImage.imageList.length === 0)

  if (isTextEmpty && isFilesEmpty) {
    message.warning('请填写信息或上传图片后再提交')
    return
  }

  try {
    const mapSaveList = (list: any[]) =>
      (Array.isArray(list) ? list : []).map((item: any) => ({
        ...item,
        uploadTime: item.createdAt || item.uploadTime
      }))

    const mapSaveKeyPoints = (list: KeyPointItem[]) =>
      (Array.isArray(list) ? list : [])
        .filter(
          (item) =>
            (item.keyPoints && item.keyPoints.trim()) ||
            (item.keyPointsIntroduction && item.keyPointsIntroduction.trim())
        )
        .map((item) => ({
          keyPoints: item.keyPoints,
          keyPointsIntroduction: item.keyPointsIntroduction
        }))

    const buildSection = (section: ImageSection) => ({
      imageList: mapSaveList(section?.imageList || []),
      keyPointsExtractedList: mapSaveKeyPoints(section?.keyPointsExtractedList || [])
    })

    const data = {
      id: currentId.value,
      targetAudience: formModel.value.targetAudience,
      productPosition: formModel.value.productPosition,
      visualStyle: formModel.value.visualStyle,
      planImage: buildSection(planImage),
      shootImage: buildSection(shootImage),
      stillImage: buildSection(stillImage),
      retouchImage: buildSection(retouchImage)
    }
    await saveCollectionInfoSupplement(data)
    message.success('操作成功')
    eventBus.emit('upload:delete')
    bukValue.value = cloneDeep(formModel.value)
    goBack()
  } catch (error) {
    console.error(error)
  }
}

function goBack() {
  router.push({
    path: '/admin/VD/gallery/highQualityMainImageLibrary'
  })
}

const handleAddKeyPoint = (tabKey: 'planner' | 'photographer' | 'still' | 'retoucher') => {
  const target = formModel.value[tabConfigMap[tabKey].modelKey].keyPointsExtractedList
  target.push({ keyPoints: '', keyPointsIntroduction: '' })
}

const handleDeleteKeyPoint = (
  index: number,
  tabKey: 'planner' | 'photographer' | 'still' | 'retoucher'
) => {
  const target = formModel.value[tabConfigMap[tabKey].modelKey].keyPointsExtractedList
  if (target.length <= 1) return
  target.splice(index, 1)
}

const toggleKeyPointCollapse = (tabKey: 'planner' | 'photographer' | 'still' | 'retoucher') => {
  keyPointCollapse.value[tabKey] = !keyPointCollapse.value[tabKey]
}

const forceKeyPointUpdate = (
  index: number,
  tabKey: 'planner' | 'photographer' | 'still' | 'retoucher'
) => {
  // 触发视图更新以兼容 s-table 对深层变更的响应
  const list = formModel.value[tabConfigMap[tabKey].modelKey].keyPointsExtractedList
  list[index] = { ...list[index] }
}

const openGallery = () => {
  const { href } = router.resolve({
    path: '/admin/VD/gallery/imageGallery',
    query: {
      goodsId:
        typeof detailData.value.productId === 'string'
          ? detailData.value.productId.split(',')[0]
          : ''
    }
  })
  window.open(href, '_blank')
}

onMounted(() => {
  const id = (route.query?.id as string) || (route.params?.id as string) || ''
  if (!id) {
    message.warning('未获取到收藏ID')
    return
  }
  loadDetail(id)
})
</script>

<style scoped lang="scss">
$border-color: #e5e5e5;
$text-color-primary: #333;
$text-color-secondary: #666;
$bg-color-tag: rgba(0, 100, 255, 0.1);
$color-tag-text: var(--el-color-primary);
$form-bg-color: #f4f6fa;

* {
  box-sizing: border-box;
}

.collection-body {
  display: flex;
  gap: 16px;
  //   padding: 0 10px 70px;
  //   height: calc(100vh - 200px);
  height: 100%;
  align-items: stretch;
  box-sizing: border-box;
}

.left-panel {
  width: 466px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden auto;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
}

.mb-16 {
  margin-bottom: 16px;
}
.mt-16px {
  margin-top: 16px;
}

.main-image-box {
  width: 100%;
  margin-bottom: 16px;
  .img-preview {
    width: 100%;
    height: 100%;
  }
}

.car-data-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(270deg, #fdf2ff 0%, #f6fcff 47%, #eff6ff 100%);
  padding: 8px 20px;
  border: 1px solid $border-color;
  border-bottom: none;
  .header-text {
    font-size: 14px;
    font-weight: 600;
    color: var(--el-color-primary);
  }
  .enter-btn {
    font-size: 12px;
    padding: 6px 12px;
  }
}

.user-cell {
  display: flex;
  align-items: center;
}

.tag-list-container {
  width: 100%;
}

:deep(.custom-tag) {
  background-color: $bg-color-tag !important;
  color: $color-tag-text !important;
  border: none !important;
  border-radius: 2px !important;
  height: 22px !important;
  line-height: 22px !important;
  padding: 0 8px !important;
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.reason-text {
  color: #333;
  font-size: 14px;
  line-height: 1.5;
}

.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.right-panel-content {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}

.right-header {
  margin-bottom: 16px;
  .meta-info {
    font-size: 14px;
    color: #666;
    display: flex;
    align-items: center;
    .meta-item {
      display: flex;
      align-items: center;
    }
    :deep(.el-divider--vertical) {
      margin: 0 6px 0 0;
      color: #666;
      border-left: 1px solid #666;
    }
  }
}

.form-grid {
  :deep(.el-textarea__inner) {
    border: none !important;
    box-shadow: none !important;
    resize: none;
  }

  :deep(.el-textarea__inner:hover),
  :deep(.el-textarea__inner:focus) {
    border: none !important;
    box-shadow: none !important;
  }

  .grid-row {
    display: flex;
    border: 1px solid $border-color;
    &:not(:first-child) {
      border-top: none;
    }
    .grid-label {
      width: 100px;
      background: $form-bg-color;
      color: $text-color-secondary;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-right: 1px solid $border-color;
      flex-shrink: 0;
    }
    .grid-content {
      flex: 1;
      padding: 4px 12px;
      :deep(.el-input__wrapper) {
        box-shadow: none !important;
        padding: 0;
      }
    }
  }
}

.custom-tabs {
  :deep(.el-tabs__nav-wrap::after) {
    height: 1px;
    background-color: $border-color;
  }
  :deep(.el-tabs__item) {
    font-size: 13px;
    color: #666;
    &.is-active {
      color: var(--el-color-primary);
      font-weight: 600;
    }
    .custom-tabs-label {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 0 18px;
    }
  }
}

.analysis-section-content {
  // border: 1px solid $border-color;
  // margin-top: 16px;
  border-radius: 4px;
  min-height: 467px;
  :deep(.el-form) {
    padding: 0 16px 6px 16px;
    .el-form-item {
      margin-bottom: 10px;
    }
  }
}

.description {
  //   height: 344px;
  flex: 1;
  min-height: 0;
}

:deep(.form-descriptions-container) {
  .form-descriptions-body {
    min-height: 344px;
  }
}

.keypoint-section {
  border-radius: 4px;
  background-color: #fff;
}

.keypoint-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  .keypoint-title {
    font-weight: 600;
    color: $text-color-primary;
  }
  .keypoint-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }
}

.keypoint-table-wrapper {
  :deep(.el-table__cell) {
    padding: 8px 0;
  }
}

.collapse-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  .collapse-icon {
    transition: transform 0.2s ease;
  }
  .collapse-icon.rotated {
    transform: rotate(180deg);
  }
}

.footer-actions {
  display: flex;
  justify-content: flex-end;
  //   gap: 12px;
}

.flux-wrap {
  background: transparent;
  :deep(.el-card__body) {
    padding: unset;
  }
}
.analysis-section {
  min-height: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  .analysis-section-content {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }
}
</style>
