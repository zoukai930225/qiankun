<template>
  <scheme-details ref="detailsRef" name="BuyerPlan" :width="936">
    <template #card>
      <form-content-layout :layouts="layouts">
        <template #basicInfo>
          <el-descriptions :column="2" border class="form-descriptions" label-width="174">
            <el-descriptions-item label="品类">
              {{ dataValue.categoryLabel || dataValue.category || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="企划名称">
              {{ dataValue.planName || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="选品会时间">
              {{ dataValue.selectionMeetingDate || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="企划发起时间">
              {{ dataValue.planInitiateTime || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="定价">
              {{ dataValue.pricing || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="销量">
              {{ dataValue.sales || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="产品图片">
              <template v-if="firstImageUrl">
                <el-image
                  :src="firstImageUrl"
                  :preview-src-list="[firstImageUrl]"
                  fit="contain"
                  style="width: 120px; height: 120px"
                />
              </template>
              <template v-else>-</template>
            </el-descriptions-item>
            <el-descriptions-item label="尺码" :span="2">
              <template v-if="dataValue.sizeText || dataValue.sizeFile">
                <div v-if="dataValue.sizeText" style="white-space: pre-wrap">
                  {{ dataValue.sizeText }}
                </div>
                <el-link
                  v-if="dataValue.sizeFile"
                  :href="dataValue.sizeFile"
                  target="_blank"
                  :underline="false"
                >
                  查看尺码附件
                </el-link>
              </template>
              <template v-else>-</template>
            </el-descriptions-item>
            <el-descriptions-item label="产品链接" :span="2">
              <template v-if="dataValue.productLink">
                <el-link :href="dataValue.productLink" target="_blank" :underline="false">
                  {{ dataValue.productLink }}
                </el-link>
              </template>
              <template v-else>-</template>
            </el-descriptions-item>
            <el-descriptions-item label="选品方向" :span="2">
              <div style="white-space: pre-wrap">{{ dataValue.selectionDirection || '-' }}</div>
            </el-descriptions-item>
            <el-descriptions-item label="核心卖点" :span="2">
              <div style="white-space: pre-wrap">{{ dataValue.coreSellingPoint || '-' }}</div>
            </el-descriptions-item>
            <el-descriptions-item label="面料成分" :span="2">
              {{ compositionText }}
            </el-descriptions-item>
          </el-descriptions>
        </template>
      </form-content-layout>
    </template>
  </scheme-details>
</template>
<script lang="ts" setup>
import { cloneDeep } from 'lodash-es'
import { DICT_TYPE, getDictLabel } from '@/utils/dict'
import FormContentLayout from '@/layout/components/ContentLayout'

// detail view

type FabricItem = { key: string; name?: string; value: number }

type FormModel = {
  id?: string | number
  category: string | number
  categoryLabel?: string
  planName: string
  selectionMeetingDate: string
  planInitiateTime: string
  pricing: string
  sales: string
  image: string // Transfer组件v-model，单张，用逗号拼接的url?name=xx
  sizeText: string
  sizeFile: string // Transfer组件v-model，单个文件
  productLink: string
  selectionDirection: string
  coreSellingPoint: string
  fabricComposition: FabricItem[]
  createdName?: string
}

const layouts = [{ label: '基本信息', key: 'basicInfo' }]

const detailsRef = ref<any>()
const dataValue = ref<FormModel>({
  category: '',
  planName: '',
  selectionMeetingDate: '',
  planInitiateTime: '',
  pricing: '',
  sales: '',
  image: '',
  sizeText: '',
  sizeFile: '',
  productLink: '',
  selectionDirection: '',
  coreSellingPoint: '',
  fabricComposition: []
})
const bukValue = ref<FormModel>(cloneDeep(dataValue.value))
const viewType = ref<'view' | 'add' | 'edit'>('add')
const loading = ref(false)

const formatFabricTag = (item: FabricItem) => {
  const dictLabel = item.key ? getDictLabel(DICT_TYPE.FABRIC, item.key) : ''
  const display = dictLabel || item.name || item.key
  if (!display && (item.value === undefined || item.value === null)) return ''
  const normalizeValue = () => {
    const raw = item.value
    if (raw === undefined || raw === null) return ''
    if (typeof raw === 'number') return `${raw}%`
    const str = String(raw).trim()
    if (!str) return ''
    const parsed = Number.parseFloat(str.replace('%', ''))
    if (Number.isFinite(parsed)) return `${parsed}%`
    return str
  }
  const value = normalizeValue()
  return `${display || '未命名'}${value ? value : ''}`
}

const compositionText = computed(() => {
  const list = dataValue.value.fabricComposition || []
  if (!Array.isArray(list) || !list.length) return '-'
  const texts = list
    .map((item) => formatFabricTag(item))
    .map((str) => str?.trim?.())
    .filter((str) => str && str.length)
  return texts.length ? texts.join('、') : '-'
})

// 详情页无需唯一性校验

// detail view 无需表单校验规则

const title = computed(() =>
  viewType.value === 'view' ? '详情' : viewType.value === 'edit' ? '编辑' : '新增'
)

const firstImageUrl = computed(() => {
  const raw = dataValue.value.image || ''
  if (!raw) return ''
  const first = raw.split(',')[0] || ''
  return first
})

const openDrawer = (item: Partial<FormModel> = {}, type: 'view' | 'add' | 'edit' = 'add') => {
  detailsRef?.value?.openDrawer(
    async () => {
      viewType.value = type
      // 数据回填
      dataValue.value = {
        category: '',
        planName: '',
        selectionMeetingDate: '',
        planInitiateTime: '',
        pricing: '',
        sales: '',
        image: '',
        sizeText: '',
        sizeFile: '',
        productLink: '',
        selectionDirection: '',
        coreSellingPoint: '',
        fabricComposition: [],
        ...(item as any)
      }
      bukValue.value = cloneDeep(dataValue.value)
    },
    () => {}
  )
}

defineExpose({ openDrawer })
provide('BuyerPlanDetails', { dataValue, bukValue, viewType, title, loading })
</script>
<style scoped lang="scss">
.composition-items {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.composition-tag.el-tag {
  height: 28px;
  display: inline-flex;
  align-items: center;
  padding: 0 10px;
}
</style>
