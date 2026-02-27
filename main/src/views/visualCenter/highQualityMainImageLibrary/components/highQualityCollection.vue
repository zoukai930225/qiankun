<template>
  <scheme-dialog ref="dialogRef" :name="name" :width="800" :title="dialogTitle" append-to-body>
    <template #card>
      <div class="collection-form">
        <div v-if="props.showInfo" class="section-block">
          <section-title-header class="mb-10px">优质主图信息</section-title-header>
          <div class="info-content">
            <div class="info-img">
              <image-display :src="formModel.url" width="128" height="128" />
            </div>
            <el-form class="info-form" :model="formModel" :rules="rules" ref="formRef">
              <el-form-item label="收藏原因" prop="collectionReason">
                <s-textarea
                  v-model="formModel.collectionReason"
                  maxlength="300"
                  :rows="3"
                  placeholder="请输入收藏原因"
                  show-word-limit
                />
              </el-form-item>
            </el-form>
          </div>
        </div>

        <div class="section-block mt-4px tags-block">
          <el-scrollbar>
            <section-title-header class="mb-16px">标签分类</section-title-header>

            <div class="filter-area">
              <div class="sub-label">可选标签 ({{ totalOptionCount }}个)</div>

              <CommonFilter
                label-width="52px"
                v-model="formModel.tags"
                :groups="filterGroups"
                class="dialog-filter"
              />
            </div>

            <div class="selected-area">
              <div class="sub-header">
                <span>已选标签 ({{ selectedTagsList.length }}个)</span>
                <span class="divider">|</span>
                <el-button
                  link
                  type="danger"
                  @click="handleClearTags"
                  :disabled="selectedTagsList.length === 0"
                >
                  <el-icon class="mr-4px"><Delete /></el-icon> 清空
                </el-button>
              </div>

              <div class="selected-tags-list">
                <el-tag
                  v-for="tag in selectedTagsList"
                  :key="`${tag.groupKey}-${tag.value}`"
                  closable
                  type="info"
                  effect="plain"
                  class="custom-tag"
                  @close="handleRemoveTag(tag)"
                >
                  {{ tag.label }}
                </el-tag>
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
import { ref, computed, provide, onMounted } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import CommonFilter from '@/components/Filter/commonFilter/index.vue'
import { cloneDeep } from 'lodash-es'
// [修改 1] 引入详情查询接口
import {
  batchClassifyHighQualityCollection,
  addHighQualityCollection,
  addPromotionImageCollection,
  getDetailByMasterId
} from '@/api/visualCenter/highQualityMainImageLibrary'
import { useMessage } from '@/hooks/web/useMessage'
import { useHighQualityDict } from '../hooks/useHighQualityDict'

const props = defineProps({
  name: { type: String, required: true },
  showInfo: { type: Boolean, default: true },
  isBatch: { type: Boolean, default: true },
  currentItem: { type: Object, default: () => {} },
  // master: 主图收藏；promotion: 车图收藏
  collectionType: { type: String, default: 'master' }
})

const message = useMessage()
const dialogRef = ref()
const { filterGroups, fetchDicts } = useHighQualityDict()
onMounted(() => {
  fetchDicts()
})

const rules = {
  collectionReason: [{ required: true, message: '请输入收藏原因', trigger: 'blur' }]
}

const defaultFormModel = () => ({
  url: '',
  collectionReason: '',
  ids: [] as Array<string | number>,
  tags: {
    marketPosition: [] as string[],
    masterImageCollectionCategory: [] as string[],
    masterImageCollectionFabric: [] as string[],
    masterImageCollectionForm: [] as string[]
  } as Record<string, string[]>
})
type FormModel = ReturnType<typeof defaultFormModel>

const formModel = ref<FormModel>(defaultFormModel())
const bukValue = ref<FormModel>(defaultFormModel())
const viewType = ref('edit')
const loading = ref(false)
const dialogTitleRef = ref('优质图库收藏 ')

provide(`${props.name}Details`, {
  dataValue: formModel,
  bukValue,
  viewType,
  title: dialogTitleRef,
  loading
})

const emit = defineEmits<{
  (event: 'success'): void
}>()

const dialogTitle = computed(() => dialogTitleRef.value)

// --- 计算属性 ---

// 计算总选项数 (用于展示 "可选标签 (16个)")
const totalOptionCount = computed(() => {
  return filterGroups.value.reduce((acc, group) => acc + group.options.length, 0)
})

// 计算已选标签的扁平化数组 (用于展示底部 tag 列表)
const selectedTagsList = computed(() => {
  const list: Array<{ label: string; value: any; groupKey: string }> = []

  filterGroups.value.forEach((group) => {
    const selectedValues = formModel.value.tags[group.key] || []
    if (Array.isArray(selectedValues)) {
      selectedValues.forEach((val) => {
        const option = group.options.find((opt) => opt.value === val)
        if (option) {
          list.push({
            label: option.label,
            value: val,
            groupKey: group.key
          })
        }
      })
    }
  })
  return list
})

// --- 方法 ---

// 打开弹窗供父组件调用
const open = async (payload: any = {}) => {
  const {
    isEdit = false,
    url = '',
    collectionReason = '',
    ids = [],
    tagsObject = {},
    title
  } = payload
  const base = defaultFormModel()

  // 1. 先初始化基础数据
  formModel.value = {
    ...base,
    url,
    collectionReason,
    ids,
    tags: { ...base.tags, ...tagsObject }
  }

  dialogTitleRef.value = title || '优质图库收藏'

  // 2. 如果是单条编辑（ids长度为1），尝试回显详情
  if (isEdit) {
    try {
      loading.value = true
      // 获取详情，注意这里取第一个id
      const detail = await getDetailByMasterId(ids[0])

      // 回显收藏原因
      if (detail.collectionReason) {
        formModel.value.collectionReason = detail.collectionReason
      }

      // 回显图片（如果传入的url为空，使用详情里的）
      if (!formModel.value.url && detail.imageUrl) {
        formModel.value.url = detail.imageUrl
      }

      // 回显标签 (后端返回的是逗号分隔的字符串，需要转为数组)
      const splitTags = (str?: string) => (str ? str.split(',') : [])

      formModel.value.tags = {
        marketPosition: splitTags(detail.marketPosition),
        masterImageCollectionCategory: splitTags(detail.masterImageCollectionCategory),
        masterImageCollectionFabric: splitTags(detail.masterImageCollectionFabric),
        masterImageCollectionForm: splitTags(detail.masterImageCollectionForm)
      }
      console.log('formModel.value', formModel.value)
    } catch (error) {
      console.error('获取详情失败', error)
    } finally {
      loading.value = false
    }
  }

  // 保存快照用于对比或重置
  bukValue.value = cloneDeep(formModel.value)

  dialogRef.value?.openDialog(
    () => {
      // preCall
    },
    () => {
      // callback
    }
  )
}
// 移除单个标签
const handleRemoveTag = (tagItem: any) => {
  const { groupKey, value } = tagItem
  const list = formModel.value.tags[groupKey] as any[]
  const index = list.indexOf(value)
  if (index > -1) {
    list.splice(index, 1)
  }
}

// 清空所有标签
const handleClearTags = () => {
  Object.keys(formModel.value.tags).forEach((key) => {
    formModel.value.tags[key] = []
  })
}

const handleCancel = () => {
  dialogRef.value?.close()
}
const formRef = ref()
const handleConfirm = async () => {
  await formRef.value?.validate()
  try {
    loading.value = true
    const tags = formModel.value.tags
    if (props.isBatch) {
      await batchClassifyHighQualityCollection({
        idList: formModel.value.ids as string[],
        marketPosition: tags.marketPosition?.join(','),
        masterImageCollectionCategory: tags.masterImageCollectionCategory?.join(','),
        masterImageCollectionFabric: tags.masterImageCollectionFabric?.join(','),
        masterImageCollectionForm: tags.masterImageCollectionForm?.join(',')
      })
    } else {
      const payload = {
        masterImageId: formModel.value.ids[0] as string,
        goodsId: props.currentItem.goodsId,
        collectionReason: formModel.value.collectionReason,
        marketPosition: tags.marketPosition?.join(','),
        masterImageCollectionCategory: tags.masterImageCollectionCategory?.join(','),
        masterImageCollectionFabric: tags.masterImageCollectionFabric?.join(','),
        masterImageCollectionForm: tags.masterImageCollectionForm?.join(',')
      }
      if (props.collectionType === 'promotion') {
        await addPromotionImageCollection(payload)
      } else {
        await addHighQualityCollection(payload)
      }
    }
    message.success('操作成功')
    emit('success')
    bukValue.value = cloneDeep(formModel.value)
    dialogRef.value?.close()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

defineExpose({ open })
</script>

<style scoped lang="scss">
.collection-form {
  padding: 0 10px;
}

.section-block {
  margin-bottom: 16px;

  &.tags-block {
    height: 370px;
  }

  .section-title {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    padding-left: 8px;
    border-left: 3px solid #1890ff; // 蓝色竖条
    margin-bottom: 16px;
    line-height: 1;
  }
}

/* 第一部分布局 */
.info-content {
  display: flex;
  // gap: 16px;
  // background: #f9f9f9;
  // padding: 12px;
  // border: 1px solid #e5e5e5;
  border-radius: 4px;
  height: 128px;
  .info-img {
    flex-shrink: 0;
    .img-preview {
      width: 100%;
      height: 100%;
      border-radius: 4px;
      display: block;
    }
    .img-placeholder {
      width: 100%;
      height: 100%;
      border-radius: 4px;
      background: #f2f2f2;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
      font-size: 12px;
    }
  }

  .info-form {
    flex: 1;
    height: 100%; // 1. 确保表单容器占满 128px 高度

    :deep(.el-form-item) {
      display: flex;
      flex-direction: column;
      height: 100%; // 2. 确保 form-item 占满高度
      margin-bottom: 0 !important; // 移除 form-item 默认的下边距

      .el-form-item__label {
        justify-content: flex-start;
        text-align: left;
        height: 42px; // 固定标题高度
        line-height: 42px;
        background: #f4f8ff;
        padding-left: 10px;
        color: #666;
        flex-shrink: 0; // 防止标题被压缩
        border-top: 1px solid #e5e5e5;
        border-left: 1px solid #e5e5e5;
        border-right: 1px solid #e5e5e5;
      }

      // 3. 核心：控制内容区域填满剩余空间 (128px - 42px)
      .el-form-item__content {
        flex: 1;
        line-height: normal; // 重置行高，避免文字偏上

        // 适配 s-textarea 或 el-input 的外层 wrapper
        > div,
        .el-textarea {
          height: 100%;
          display: flex;
        }

        // 4. 强制 textarea 内部元素高度 100%
        .el-textarea__inner {
          height: 100% !important;
          min-height: auto !important;
          border: 1px solid #e5e5e5;
          border-radius: 0;
          resize: none; // 通常这种固定布局建议禁止拖拽缩放
          box-sizing: border-box;
        }
      }
    }
  }
}

/* 第二部分布局 */
.filter-area {
  margin-bottom: 20px;

  .sub-label {
    font-size: 13px;
    color: #333;
    margin-bottom: 12px;
  }

  /* 穿透修改 common-filter 样式使其更紧凑适应弹窗 */
  :deep(.common-filter) {
    .filter-row {
      margin-bottom: 16px;
    }
    .filter-options {
      gap: 10px;
    }
    .filter-label {
      // width: 60px; // 调整 label 宽度
      font-size: 13px;
    }
    .filter-item {
      padding: 4px 12px;
      background: #f8f8f9; // 灰色背景块
      border-radius: 2px;
      font-size: 12px;

      &.is-active {
        background: rgba(0, 100, 255, 0.1); // 选中淡蓝背景
        color: var(--el-color-primary);
      }
    }
  }
}

.selected-area {
  border-top: 1px dashed #eee;
  padding-top: 16px;

  .sub-header {
    display: flex;
    align-items: center;
    font-size: 13px;
    color: #333;
    margin-bottom: 12px;

    .divider {
      margin: 0 8px;
      color: #ddd;
    }

    .el-button {
      font-size: 13px;
      height: auto;
      padding: 0;
    }
  }

  .selected-tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .custom-tag {
      border: none;
      background: #f5f5f5;
      color: #333;
      height: 28px;
      padding: 0 10px;

      :deep(.el-tag__close) {
        color: #999;
        &:hover {
          background-color: #ccc;
          color: #fff;
        }
      }
    }
  }
}
</style>
