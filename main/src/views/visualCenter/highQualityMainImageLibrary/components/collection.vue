<template>
  <scheme-dialog
    ref="dialogRef"
    :name="name"
    :width="1100"
    :title="dialogTitle"
    append-to-body
    class="collection-dialog"
  >
    <template #card>
      <div class="dialog-body">
        <div class="left-panel">
          <el-scrollbar>
            <section-title-header title-size="16px" class="mb-16">
              商品基本信息
            </section-title-header>

            <div class="main-image-box">
              <image-display width="426" height="366" :src="detailData.url" fit="contain" />
            </div>

            <div class="car-data-header">
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
                        :avatars="[
                          { name: detailData.collectorName, src: detailData.collectorAvatar }
                        ]"
                      />
                    </div>
                  </FormDescriptionItem>

                  <FormDescriptionItem label="产品编码">
                    {{ detailData.productCode || '-' }}
                  </FormDescriptionItem>

                  <FormDescriptionItem label="商品ID">
                    {{ detailData.productId || '-' }}
                  </FormDescriptionItem>

                  <FormDescriptionItem label="上架时间" :span="2">
                    {{ detailData.launchTime }}
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
          </el-scrollbar>
        </div>

        <div class="right-panel">
          <el-scrollbar>
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
                <div class="grid-row">
                  <div class="grid-label">目标客群</div>
                  <div class="grid-content">
                    <s-textarea
                      v-model="formModel.targetAudience"
                      placeholder="请输入目标客群"
                      rows="3"
                    />
                  </div>
                </div>
                <div class="grid-row">
                  <div class="grid-label">产品定位</div>
                  <div class="grid-content">
                    <s-textarea
                      v-model="formModel.productPosition"
                      placeholder="请输入产品定位"
                      rows="3"
                    />
                  </div>
                </div>
                <div class="grid-row">
                  <div class="grid-label">视觉风格</div>
                  <div class="grid-content">
                    <s-textarea
                      v-model="formModel.visualStyle"
                      placeholder="请输入视觉风格"
                      rows="3"
                    />
                  </div>
                </div>
              </div>
            </el-form>

            <div class="analysis-section mt-16px">
              <section-title-header title-size="16px">主图视觉分析</section-title-header>

              <div class="analysis-section-content">
                <el-tabs v-model="activeTab" class="custom-tabs">
                  <el-tab-pane name="planner">
                    <template #label>
                      <span class="custom-tabs-label">
                        <span>策划人员</span>
                      </span>
                    </template>
                  </el-tab-pane>
                  <el-tab-pane name="photographer">
                    <template #label>
                      <span class="custom-tabs-label">
                        <span>拍摄人员</span>
                      </span>
                    </template>
                  </el-tab-pane>
                  <el-tab-pane name="retoucher">
                    <template #label>
                      <span class="custom-tabs-label">
                        <span>修图人员</span>
                      </span>
                    </template>
                  </el-tab-pane>
                </el-tabs>
                <el-form :model="formModel">
                  <div class="role-upload-section">
                    <el-form-item :label="currentTabConfig.label">
                      <avatar-display
                        :size="18"
                        :name-size="14"
                        :avatars="[{ name: currentTabUser.name, src: currentTabUser.avatar }]"
                        :name-style="{ color: '#666' }"
                      />
                    </el-form-item>
                    <el-form-item label="案例上传" :prop="currentTabConfig.modelKey">
                      <Transfer
                        :key="activeTab"
                        v-model="formModel[currentTabConfig.modelKey]"
                        :limit="5"
                        accept-type="all"
                        value-type="array"
                        show-time
                      />
                    </el-form-item>
                  </div>
                </el-form>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </template>

    <template #button>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </scheme-dialog>
</template>

<script setup lang="ts">
import { ref, provide, computed } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { cloneDeep } from 'lodash-es'
// 注意：这里引用上一轮生成的组件，根据你的实际文件路径调整
import { FormDescription, FormDescriptionItem } from '@/components/Descriptions'
import { useRouter } from 'vue-router'
import {
  saveCollectionInfoSupplement,
  getHighQualityCollectionDetail,
  type HighQualityRecord
} from '@/api/visualCenter/highQualityMainImageLibrary'
import { useMessage } from '@/hooks/web/useMessage'
import eventBus from '@/utils/eventBus'

const props = defineProps({
  name: { type: String, required: true },
  readonly: { type: Boolean, default: false }
})

const message = useMessage()

// --- 状态定义 ---
const dialogRef = ref()
const dialogTitle = ref('主图信息')
const activeTab = ref('planner')

// 用户信息 (默认值)
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
  reason: ''
})
type DetailData = ReturnType<typeof defaultDetailData>
const detailData = ref<DetailData>(defaultDetailData())

const createDefaultFormModel = () => ({
  targetAudience: '',
  productPosition: '',
  visualStyle: '',
  planImageList: [] as any[],
  shootImageList: [] as any[],
  retouchImageList: [] as any[]
})
type FormModel = ReturnType<typeof createDefaultFormModel>

// 右侧表单数据
const formModel = ref<FormModel>(createDefaultFormModel())

const bukValue = ref<FormModel>(cloneDeep(formModel.value))

// Tab User Info State
const tabUserInfo = ref({
  planner: { name: '', avatar: '' },
  photographer: { name: '', avatar: '' },
  retoucher: { name: '', avatar: '' }
})

// --- Inject ---
provide(`${props.name}Details`, {
  dataValue: formModel,
  bukValue,
  viewType: ref('edit'),
  title: dialogTitle,
  loading: ref(false)
})

const tabConfigMap = {
  planner: {
    label: '策划人员',
    modelKey: 'planImageList',
    uploadCode: 'visual_analysis_planner'
  },
  photographer: {
    label: '拍摄人员',
    modelKey: 'shootImageList',
    uploadCode: 'visual_analysis_photographer'
  },
  retoucher: {
    label: '修图人员',
    modelKey: 'retouchImageList',
    uploadCode: 'visual_analysis_retoucher'
  }
} as const

// 计算当前选中的配置
const currentTabConfig = computed(() => {
  return tabConfigMap[activeTab.value as keyof typeof tabConfigMap]
})

const currentTabUser = computed(() => {
  return (
    tabUserInfo.value[activeTab.value as keyof typeof tabUserInfo.value] || { name: '', avatar: '' }
  )
})

const emit = defineEmits<{
  (event: 'confirm', payload: FormModel): void
}>()

// --- 方法 ---

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

const open = async (payload: { id: string }) => {
  dialogTitle.value = '主图信息'
  currentDate.value = ''
  userName.value = ''
  userAvatar.value = ''
  currentId.value = ''
  try {
    const item = await getHighQualityCollectionDetail(payload.id)

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
      launchTime: item.groundingTime || ''
    }

    if (item.productIntroductionUserName) {
      userName.value = item.productIntroductionUserName
    }
    if (item.productIntroductionUserAvatarOrigin) {
      userAvatar.value = item.productIntroductionUserAvatarOrigin
    }
    if (item.productIntroductionDate) {
      currentDate.value = item.productIntroductionDate
    }

    // Initialize user info
    tabUserInfo.value = {
      planner: { name: item.planUserName || '', avatar: item.planUserAvatarOrigin || '' },
      photographer: { name: item.shootUserName || '', avatar: item.shootUserAvatarOrigin || '' },
      retoucher: { name: item.retouchUserName || '', avatar: item.retouchUserAvatarOrigin || '' }
    }

    let planImageList: any[] = []
    let shootImageList: any[] = []
    let retouchImageList: any[] = []
    if (Array.isArray(item.planImageList)) {
      planImageList = item.planImageList.map((v: any) => {
        return {
          ...v,
          createdAt: v.uploadTime
        }
      })
    }
    if (Array.isArray(item.shootImageList)) {
      shootImageList = item.shootImageList.map((v: any) => {
        return {
          ...v,
          createdAt: v.uploadTime
        }
      })
    }
    if (Array.isArray(item.retouchImageList)) {
      retouchImageList = item.retouchImageList.map((v: any) => {
        return {
          ...v,
          createdAt: v.uploadTime
        }
      })
    }
    activeTab.value = 'planner'
    formModel.value = {
      ...createDefaultFormModel(),
      targetAudience: item.targetAudience ?? '',
      productPosition: item.productPosition ?? '',
      visualStyle: item.visualStyle ?? '',
      planImageList: planImageList || [],
      shootImageList: shootImageList || [],
      retouchImageList: retouchImageList || []
    }
    bukValue.value = cloneDeep(formModel.value)
    currentId.value = payload.id
    dialogRef.value?.openDialog(
      () => {},
      () => {}
    )
  } catch (error) {
    console.error('获取详情失败', error)
    message.error('获取详情失败')
  }
}
const currentId = ref('')

const handleCancel = () => {
  dialogRef.value?.close()
}

const handleConfirm = async () => {
  // --- 校验逻辑 Start ---
  const {
    targetAudience,
    productPosition,
    visualStyle,
    planImageList,
    shootImageList,
    retouchImageList
  } = formModel.value

  const isTextEmpty = !targetAudience?.trim() && !productPosition?.trim() && !visualStyle?.trim()

  const isFilesEmpty =
    (!planImageList || planImageList.length === 0) &&
    (!shootImageList || shootImageList.length === 0) &&
    (!retouchImageList || retouchImageList.length === 0)

  if (isTextEmpty && isFilesEmpty) {
    message.warning('请填写信息或上传图片后再提交')
    return
  }
  // --- 校验逻辑 End ---

  try {
    const data = {
      id: currentId.value,
      targetAudience: formModel.value.targetAudience,
      productPosition: formModel.value.productPosition,
      visualStyle: formModel.value.visualStyle,
      planImageList: formModel.value.planImageList.map((item: any) => {
        return {
          ...item,
          uploadTime: item.createdAt
        }
      }),
      shootImageList: formModel.value.shootImageList.map((item: any) => {
        return {
          ...item,
          uploadTime: item.createdAt
        }
      }),
      retouchImageList: formModel.value.retouchImageList.map((item: any) => {
        return {
          ...item,
          uploadTime: item.createdAt
        }
      })
    }
    await saveCollectionInfoSupplement(data)
    message.success('主图信息已保存')
    eventBus.emit('upload:delete')
    emit('confirm', formModel.value)
    bukValue.value = cloneDeep(formModel.value)
    dialogRef.value?.close()
  } catch (error) {
    console.error(error)
  }
}

const router = useRouter()
const openGallery = () => {
  const { href } = router.resolve({
    path: '/admin/VD/gallery/imageGallery',
    query: {
      goodsId: detailData.value.productId
    }
  })
  window.open(href, '_blank')
}
defineExpose({ open })
</script>

<style scoped lang="scss">
/* 通用变量 */
$border-color: #e5e5e5;
$text-color-primary: #333;
$text-color-secondary: #666;
$bg-color-header: #f4f6fa;
$bg-color-tag: rgba(0, 100, 255, 0.1);
$color-tag-text: var(--el-color-primary);
$form-bg-color: #f4f8ff;

.dialog-body {
  display: flex;
  gap: 16px;
  padding: 0 10px;
  height: 810px;
  align-items: stretch;
}

/* ================= 左侧样式 ================= */
.left-panel {
  width: 426px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden auto;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: $text-color-primary;
  border-left: 3px solid #1890ff;
  line-height: 1;
}

.mb-16 {
  margin-bottom: 16px;
}
.mb-12 {
  margin-bottom: 12px;
}
.mb-8 {
  margin-bottom: 8px;
}
.mt-24 {
  margin-top: 24px;
}
.ml-2 {
  margin-left: 4px;
}
.mr-1 {
  margin-right: 4px;
}
.mr-2 {
  margin-right: 8px;
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

/* 标签列表容器 */
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

/* ================= 右侧样式 ================= */
.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
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

/* 模拟表格布局的表单 */
.form-grid {
  .grid-row {
    display: flex;
    border: 1px solid $border-color;
    &:not(:first-child) {
      // margin-top: 10px;
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

.tab-user-info {
  font-size: 13px;
  color: #333;
  display: flex;
  align-items: center;
}

.upload-area {
  border: 1px dashed #d9d9d9;
  background: #fafafa;
  padding: 20px;
  border-radius: 4px;
  .upload-label {
    display: none;
  }
  :deep(.upload-dropzone) {
    background: transparent;
  }
}

.empty-placeholder {
  color: #999;
  text-align: center;
  padding: 40px 0;
  font-size: 13px;
}

.analysis-section-content {
  border: 1px solid $border-color;
  // background: rgba(244, 246, 250, 0.5);
  margin-top: 16px;
  border-radius: 4px;
  min-height: 467px;
  :deep(.el-form) {
    padding: 0 16px;
  }
}
:deep(.el-textarea__inner) {
  border: none !important; /* 去除默认边框 */
  box-shadow: none !important; /* 去除 Element 自带的阴影/聚焦光晕 */
  resize: none; /* (可选) 去除右下角拖拽标 */
}

/* 确保 hover 和 focus 状态下也不显示 */
:deep(.el-textarea__inner:hover),
:deep(.el-textarea__inner:focus) {
  border: none !important;
  box-shadow: none !important;
}

.description {
  height: 344px;
}

:deep(.form-descriptions-container) {
  .form-descriptions-body {
    min-height: 344px;
  }
}
</style>
