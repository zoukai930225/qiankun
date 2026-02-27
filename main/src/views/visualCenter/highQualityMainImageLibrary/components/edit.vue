<template>
  <scheme-details ref="detailsRef" :name="name" :width="936">
    <template #card>
      <el-form ref="formRef" :model="dataValue" :rules="rules" label-width="80px">
        <form-content-layout :layouts="layouts">
          <template #basicInfo>
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item label="商品名称" prop="goodsName">
                  <el-input
                    v-model="dataValue.goodsName"
                    placeholder="请输入商品名称"
                    maxlength="100"
                    clearable
                    :disabled="viewType === 'editCollection'"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="产品编码" prop="goodsCode">
                  <good-code
                    url="/api/wdtSpec/listSpecNo"
                    v-model="dataValue.goodsCode"
                    placeholder="请输入产品编码"
                    :disabled="viewType === 'editCollection'"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="商品ID" prop="goodsId">
                  <el-input
                    v-model="dataValue.goodsId"
                    placeholder="请输入商品ID"
                    maxlength="100"
                    clearable
                    :disabled="viewType === 'editCollection'"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="收藏原因" prop="collectionReason">
                  <s-text-area
                    v-model="dataValue.collectionReason"
                    maxlength="300"
                    show-word-limit
                    :autosize="{ minRows: 3, maxRows: 6 }"
                    placeholder="请输入收藏原因"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </template>

          <template #tagClassify>
            <div class="tag-panel">
              <div class="sub-label">可选标签 ({{ totalOptionCount }}个)</div>
              <CommonFilter
                label-width="60px"
                v-model="dataValue.tags"
                :groups="filterGroups"
                class="dialog-filter"
              />

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
                    清空
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
            </div>
          </template>

          <template #gallery>
            <el-form-item label="优质图库" prop="imageUrl">
              <Transfer v-model="dataValue.imageUrl" :limit="1" accept-type="image" width="100%" :disabled="viewType === 'editCollection'"/>
            </el-form-item>
          </template>
        </form-content-layout>
      </el-form>
    </template>

    <template #button>
      <el-button @click="detailsRef?.close()" :disabled="loading">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :disabled="loading">确定</el-button>
    </template>
  </scheme-details>
</template>

<script lang="ts" setup>
import { computed, onMounted, provide, ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import type { FormInstance, FormRules } from 'element-plus'
import STextArea from '@/components/common/input/s-textarea.vue'
import Transfer from '@/components/common/upload/transfer.vue'
import CommonFilter from '@/components/Filter/commonFilter/index.vue'
import FormContentLayout from '@/layout/components/ContentLayout'
import { useMessage } from '@/hooks/web/useMessage'
import { useHighQualityDict } from '../hooks/useHighQualityDict'
import {
  getHighQualityCollectionDetail,
  systemImageCollection,
  systemImageCollectionEdit
} from '@/api/visualCenter/highQualityMainImageLibrary'

type ViewType = 'add' | 'edit' | 'view' | 'editCollection'

type TagsModel = {
  marketPosition: string[]
  masterImageCollectionCategory: string[]
  masterImageCollectionFabric: string[]
  masterImageCollectionForm: string[]
}

type FormModel = {
  id?: string
  goodsName: string
  goodsCode: string
  goodsId: string
  collectionReason: string
  tags: TagsModel
  imageUrl: any
}

const props = defineProps({
  name: { type: String, required: true }
})

const emit = defineEmits<{
  (e: 'success', payload: FormModel): void
}>()

const message = useMessage()
const detailsRef = ref<any>()
const formRef = ref<FormInstance>()
const loading = ref(false)

const { filterGroups, valueLabelMap, fetchDicts } = useHighQualityDict()
onMounted(() => {
  fetchDicts()
})

const buildDefaultForm = (): FormModel => ({
  id: '',
  goodsName: '',
  goodsCode: '',
  goodsId: '',
  collectionReason: '',
  tags: {
    marketPosition: [],
    masterImageCollectionCategory: [],
    masterImageCollectionFabric: [],
    masterImageCollectionForm: []
  },
  imageUrl: ''
})

const dataValue = ref<FormModel>(buildDefaultForm())
const bukValue = ref<FormModel>(cloneDeep(dataValue.value))
const viewType = ref<ViewType>('add')
const title = ref('新增')

provide(`${props.name}Details`, { dataValue, bukValue, viewType, title })

const layouts = computed(() => [
  { label: '基本信息', key: 'basicInfo' },
  { label: '标签分类', key: 'tagClassify' },
  { label: '优质图库', key: 'gallery' }
])

const rules: FormRules = {
  collectionReason: [{ required: true, message: '请输入收藏原因', trigger: 'blur' }],
  imageUrl: [{ required: true, message: '请上传优质图库图片', trigger: 'change' }]
}

const totalOptionCount = computed(() => {
  return (filterGroups.value || []).reduce(
    (sum: number, g: any) => sum + (g?.options?.length || 0),
    0
  )
})

type SelectedTag = { groupKey: keyof TagsModel; value: string; label: string }
const selectedTagsList = computed<SelectedTag[]>(() => {
  const groups = filterGroups.value || []
  const tags = dataValue.value.tags || ({} as TagsModel)
  return groups.flatMap((g: any) => {
    const groupKey = g.key as keyof TagsModel
    const values: string[] = (tags[groupKey] || []) as any
    return values.map((v) => ({
      groupKey,
      value: v,
      label: (valueLabelMap.value as any)?.[groupKey]?.[v] || v
    }))
  })
})

const handleRemoveTag = (tagItem: SelectedTag) => {
  const { groupKey, value } = tagItem
  const list = dataValue.value.tags[groupKey] as any[]
  const idx = list.indexOf(value)
  if (idx > -1) list.splice(idx, 1)
}

const handleClearTags = () => {
  Object.keys(dataValue.value.tags).forEach((k) => {
    ;(dataValue.value.tags as any)[k] = []
  })
}

const openDrawer = (item: Partial<FormModel> = {}, type: ViewType = 'add') => {
  detailsRef.value?.openDrawer(
    async () => {
      viewType.value = type
      title.value = (type === 'edit' || type === 'editCollection') ? '编辑' : '新增'

      // 先清空再回填，避免上一次残留
      dataValue.value = { ...buildDefaultForm(), ...(item as any) }

      if ((type === 'edit' || type === 'editCollection') && (item as any)?.id) {
        try {
          loading.value = true
          const detail: any = await getHighQualityCollectionDetail(String((item as any).id))
          const splitTags = (val: any): string[] => {
            if (!val) return []
            if (Array.isArray(val)) return val as any
            if (typeof val === 'string') {
              return val
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            }
            return []
          }

          dataValue.value = {
            ...buildDefaultForm(),
            ...dataValue.value,
            id: String(detail?.id ?? (item as any).id ?? ''),
            goodsName: detail?.goodsName ?? '',
            goodsCode: detail?.goodsCode ?? '',
            goodsId: detail?.goodsId ?? '',
            collectionReason: detail?.collectionReason ?? '',
            imageUrl: detail?.imageUrl ?? '',
            tags: {
              marketPosition: splitTags(detail?.marketPosition),
              masterImageCollectionCategory: splitTags(detail?.masterImageCollectionCategory),
              masterImageCollectionFabric: splitTags(detail?.masterImageCollectionFabric),
              masterImageCollectionForm: splitTags(detail?.masterImageCollectionForm)
            }
          }
        } finally {
          loading.value = false
        }
      }

      bukValue.value = cloneDeep(dataValue.value)
    },
    () => {
      formRef.value?.clearValidate?.()
    }
  )
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  try {
    loading.value = true

    const tags = dataValue.value.tags || ({} as TagsModel)
    const normalizeImageUrl = (val: any): string => {
      if (!val) return ''
      if (typeof val === 'string') return val
      if (Array.isArray(val)) {
        const first = val[0]
        return typeof first === 'string' ? first : first?.url || first?.fileUrl || ''
      }
      return val?.url || val?.fileUrl || ''
    }

    const payload = {
      id: dataValue.value.id,
      goodsName: dataValue.value.goodsName,
      goodsCode: dataValue.value.goodsCode,
      goodsId: dataValue.value.goodsId,
      collectionReason: dataValue.value.collectionReason,
      marketPosition: tags.marketPosition?.join(',') || '',
      masterImageCollectionCategory: tags.masterImageCollectionCategory?.join(',') || '',
      masterImageCollectionFabric: tags.masterImageCollectionFabric?.join(',') || '',
      masterImageCollectionForm: tags.masterImageCollectionForm?.join(',') || '',
      imageUrl: normalizeImageUrl(dataValue.value.imageUrl)
    }

    if (viewType.value === 'edit' || viewType.value === 'editCollection') {
      if (!payload.id) {
        message.error('缺少主键 id，无法保存')
        return
      }
      await systemImageCollectionEdit(payload as any)
    } else {
      // 新增
      const { id: _id, ...rest } = payload as any
      await systemImageCollection(rest)
    }

    bukValue.value = cloneDeep(dataValue.value)
    emit('success', cloneDeep(dataValue.value))
    message.success('操作成功')
    detailsRef.value?.close()
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

defineExpose({ openDrawer })
</script>

<style scoped lang="scss">
.tag-panel {
  padding: 0 6px;
}

.sub-label {
  font-size: 13px;
  color: #666;
  margin-bottom: 10px;
}

.selected-area {
  margin-top: 14px;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.sub-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #333;
  margin-bottom: 10px;

  .divider {
    color: #dcdfe6;
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

:deep(.el-form) {
  .el-select,
  .el-input,
  .el-date-editor,
  .el-cascader {
    width: 100%;
  }
}

:deep(.el-card) {
  background-color: transparent;
  .el-card__body {
    padding: 0 !important;
    box-sizing: border-box;
    height: 100% !important;
  }
}
</style>
