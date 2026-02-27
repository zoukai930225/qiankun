<template>
  <scheme-details ref="detailsRef" name="BuyerPlan" :width="936" @closed="handleClosed">
    <template #card>
      <form-content-layout :layouts="layouts">
        <template #productInfo>
          <el-descriptions :column="2" border class="form-descriptions" label-width="174">
            <el-descriptions-item label="品类">
              {{ productCategoryText }}
            </el-descriptions-item>
            <el-descriptions-item label="关联企划">
              {{ product.planName || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="产品名称">
              {{ product.productName || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="供应商">
              {{ product.supplierName || '-' }}
            </el-descriptions-item>
            <!-- 最小起订量 -->
            <el-descriptions-item label="最小起订量">
              {{ product.minimumOrderQuantity || '-' }}
            </el-descriptions-item>
            <!-- 成本预估 -->
            <el-descriptions-item label="成本预估">
              {{ product.costEstimate || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="现货库存" :span="2">
              <template
                v-if="hasField(product.spotInventoryText, productAttachments.spotInventory)"
              >
                <div v-if="product.spotInventoryText" style="white-space: pre-wrap">
                  {{ product.spotInventoryText }}
                </div>
                <div
                  v-for="file in productAttachments.spotInventory"
                  :key="file.url"
                  class="attachment-item"
                >
                  <el-link type="primary" :href="file.url" target="_blank" :underline="false">
                    {{ file.name || file.url }}
                  </el-link>
                </div>
              </template>
              <template v-else>-</template>
            </el-descriptions-item>
            <el-descriptions-item label="尺码" :span="2">
              <template v-if="product.sizeText || product.sizeFile">
                <div class="flex items-center gap-6px">
                  <Transfer
                    v-if="product.sizeFile"
                    v-model="product.sizeFile"
                    disabled
                    :show-file-name="false"
                    width="unset"
                  />
                  <div v-if="product.sizeText" style="white-space: pre-wrap">
                    {{ product.sizeText }}
                  </div>
                </div>
                <!-- <div v-for="file in planAttachments.size" :key="file.url" class="attachment-item">
                  <el-link :href="file.url" target="_blank" :underline="false">
                    {{ file.name || file.url }}
                  </el-link>
                </div> -->
              </template>
              <template v-else>-</template>
            </el-descriptions-item>
            <el-descriptions-item label="单价">
              {{ product.unitPrice || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="图稿编号">
              {{ product.artworkNumber || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="实拍图片">
              <template v-if="productAttachments.realPhotos.length">
                <div class="image-group">
                  <el-image
                    v-for="item in productAttachments.realPhotos"
                    :key="item.url"
                    :src="item.url"
                    :preview-src-list="productRealPhotoUrls"
                    fit="cover"
                    style="width: 36px; height: 36px"
                  />
                </div>
              </template>
              <template v-else>-</template>
            </el-descriptions-item>
            <el-descriptions-item label="模特上身图">
              <template v-if="productAttachments.modelUpperBody.length">
                <div class="image-group">
                  <el-image
                    v-for="item in productAttachments.modelUpperBody"
                    :key="item.url"
                    :src="item.url"
                    :preview-src-list="productModelPhotoUrls"
                    fit="cover"
                    style="width: 36px; height: 36px"
                  />
                </div>
              </template>
              <template v-else>-</template>
            </el-descriptions-item>
            <el-descriptions-item label="竞品链接" :span="2">
              <template v-if="product.productLink">
                <el-link
                  type="primary"
                  :href="product.productLink"
                  target="_blank"
                  :underline="false"
                >
                  {{ product.productLink }}
                </el-link>
              </template>
              <template v-else>-</template>
            </el-descriptions-item>

            <el-descriptions-item label="毛利率" :span="2">
              <template
                v-if="hasField(product.grossProfitMarginText, productAttachments.grossProfit)"
              >
                <div v-if="product.grossProfitMarginText" style="white-space: pre-wrap">
                  {{ product.grossProfitMarginText }}
                </div>
                <div
                  v-for="file in productAttachments.grossProfit"
                  :key="file.url"
                  class="attachment-item"
                >
                  <el-link type="primary" :href="file.url" target="_blank" :underline="false">
                    {{ file.name || file.url }}
                  </el-link>
                </div>
              </template>
              <template v-else>-</template>
            </el-descriptions-item>
            <el-descriptions-item label="企划初步目标规划" :span="2">
              <template
                v-if="hasField(product.planningObjectiveText, productAttachments.planningObjective)"
              >
                <div v-if="product.planningObjectiveText" style="white-space: pre-wrap">
                  {{ product.planningObjectiveText }}
                </div>
                <div
                  v-for="file in productAttachments.planningObjective"
                  :key="file.url"
                  class="attachment-item"
                >
                  <el-link type="primary" :href="file.url" target="_blank" :underline="false">
                    {{ file.name || file.url }}
                  </el-link>
                </div>
              </template>
              <template v-else>-</template>
            </el-descriptions-item>
            <el-descriptions-item label="工厂库存深度" :span="2">
              <template
                v-if="hasField(product.inventoryDepthText, productAttachments.inventoryDepth)"
              >
                <div v-if="product.inventoryDepthText" style="white-space: pre-wrap">
                  {{ product.inventoryDepthText }}
                </div>
                <div
                  v-for="file in productAttachments.inventoryDepth"
                  :key="file.url"
                  class="attachment-item"
                >
                  <el-link type="primary" :href="file.url" target="_blank" :underline="false">
                    {{ file.name || file.url }}
                  </el-link>
                </div>
              </template>
              <template v-else>-</template>
            </el-descriptions-item>
            <el-descriptions-item label="卖点/功能" :span="2">
              <div v-if="product.salePoint">
                <template v-for="(item, index) in product.salePoint.split('&#&')">
                  <div class="sale-point-line">{{ `${index+1}、${item}` }}</div>
                </template>
              </div>
              <div v-else>-</div>
              <!-- <div style="white-space: pre-wrap">{{ product.salePoint || '-' }}</div> -->
            </el-descriptions-item>
            <el-descriptions-item label="色系分析" :span="2">
              {{ product.colorAnalysis || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="面料成分" :span="2">
              {{
                tryParseJsonString(
                  product.fabricContent,
                  (item) => `${item.key || item.name}${item.value ? item.value + '%' : ''}`
                ) || '-'
              }}
            </el-descriptions-item>
          </el-descriptions>
        </template>
        <template #planInfo>
          <el-descriptions :column="2" border class="form-descriptions" label-width="174">
            <el-descriptions-item label="品类">
              {{ planCategoryText || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="企划名称">
              {{ plan.planName || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="选品会时间">
              {{ plan.chooseTime || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="定价">
              {{ plan.pricing || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="销量">
              {{ plan.salesVolume || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="成本预估">
              {{ plan.costEstimate || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="最小起订量">
              {{ plan.minimumOrderQuantity || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="工厂库存深度">
              {{ plan.factoryInventoryDepth || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="产品图片" :span="2">
              <template v-if="planAttachments.productPictures.length">
                <div class="image-group">
                  <el-image
                    v-for="item in planAttachments.productPictures"
                    :key="item.url"
                    :src="item.url"
                    :preview-src-list="planProductPictureUrls"
                    fit="cover"
                    style="width: 36px; height: 36px"
                  />
                </div>
              </template>
              <template v-else>-</template>
            </el-descriptions-item>
            <el-descriptions-item label="尺码" :span="2">
              <template v-if="plan.sizeText || plan.sizeFile">
                <div class="flex items-center gap-6px">
                  <Transfer
                    v-if="plan.sizeFile"
                    v-model="plan.sizeFile"
                    disabled
                    :show-file-name="false"
                    width="unset"
                  />
                  <div v-if="plan.sizeText" style="white-space: pre-wrap">
                    {{ plan.sizeText }}
                  </div>
                </div>
                <!-- <div v-for="file in planAttachments.size" :key="file.url" class="attachment-item">
                  <el-link :href="file.url" target="_blank" :underline="false">
                    {{ file.name || file.url }}
                  </el-link>
                </div> -->
              </template>
              <template v-else>-</template>
            </el-descriptions-item>
            <el-descriptions-item label="竞品链接" :span="2">
              <template v-if="plan.productLink">
                <el-link type="primary" :href="plan.productLink" target="_blank" :underline="false">
                  {{ plan.productLink }}
                </el-link>
              </template>
              <template v-else>-</template>
            </el-descriptions-item>
            <el-descriptions-item label="选品方向" :span="2">
              <div style="white-space: pre-wrap">{{ plan.chooseDirection || '-' }}</div>
            </el-descriptions-item>
            <el-descriptions-item label="核心卖点" :span="2">
              <div style="white-space: pre-wrap">{{ plan.salePoint || '-' }}</div>
            </el-descriptions-item>
            <el-descriptions-item label="面料成分" :span="2">
              {{
                tryParseJsonString(
                  plan.fabricComposition,
                  (item) => `${item.key || item.name}${item.value ? item.value + '%' : ''}`
                ) || '-'
              }}
            </el-descriptions-item>
            <el-descriptions-item label="色系分析">
              {{ plan.colorAnalysis || '-' }}
            </el-descriptions-item>
          </el-descriptions>
        </template>
      </form-content-layout>
    </template>
  </scheme-details>
</template>
<script lang="tsx" setup>
import { computed, provide, ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import FormContentLayout from '@/layout/components/ContentLayout'
import { getCandidateProductDetail } from '@/api/oa/buyer/productReference'
import { getBuyerPlanDetail } from '@/api/oa/buyer/planManagement'
import { DICT_TYPE, getDictLabel } from '@/utils/dict'
import Transfer from '@/components/common/upload/transfer.vue'
import { ElButton } from 'element-plus'
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import { tryParseJsonString } from '@/utils/formatter'
const emit = defineEmits<{ (e: 'closed'): void }>()
type AttachmentItem = { url: string; name: string; createdAt?: string }

type ProductDetail = {
  id?: string | number
  bpBusinessEnterprisePlanId?: string | number | ''
  category?: number | string | ''
  categoryName?: string
  planName?: string
  productName?: string
  supplierId?: string | number | ''
  supplierName?: string
  spotInventoryText?: string
  spotInventoryFile?: unknown
  sizeText?: string
  sizeFile?: unknown
  unitPrice?: string
  realPhotos?: unknown
  modelUpperBodyPicture?: unknown
  productLink?: string
  grossProfitMarginText?: string
  grossProfitMarginFile?: unknown
  planningObjectiveText?: string
  planningObjectiveFile?: unknown
  inventoryDepthText?: string
  inventoryDepthFile?: unknown
  salePoint?: string
  artworkNumber?: string
  minimumOrderQuantity?: string
  costEstimate?: string
  colorAnalysis?: string
  fabricContent?: string
}

type FabricItem = { key: string; name?: string; value?: number | string }

type PlanDetail = {
  id?: string | number
  category?: number | string | ''
  categoryLabel?: string
  planName?: string
  chooseTime?: string
  pricing?: string
  salesVolume?: string
  costEstimate?: string
  productPicture?: unknown
  sizeText?: string
  sizeFile?: unknown
  productLink?: string
  chooseDirection?: string
  salePoint?: string
  fabricComposition?: FabricItem[]
  minimumOrderQuantity?: string
  factoryInventoryDepth?: string
  colorAnalysis?: string
}

type DetailState = {
  product: ProductDetail
  plan: PlanDetail
}

const CATEGORY_OPTIONS = [
  { label: '内裤品', value: 1 },
  { label: '内衣', value: 2 },
  { label: '季节品', value: 3 },
  { label: '袜子', value: 4 }
] as const

const categoryLabelMap = new Map<string | number, string>()
CATEGORY_OPTIONS.forEach((item) => {
  categoryLabelMap.set(item.value, item.label)
  categoryLabelMap.set(String(item.value), item.label)
})

const primaryExpanded = ref(true)
const planExpanded = ref(true)

const togglePlanExpanded = () => {
  planExpanded.value = !planExpanded.value
}

const togglePrimaryExpanded = () => {
  primaryExpanded.value = !primaryExpanded.value
}

const layouts = computed(() => [
  {
    label: '参选产品信息',
    key: 'productInfo',
    show: primaryExpanded.value,
    right: () => (
      <ElButton link type="primary" size="small" onClick={togglePrimaryExpanded}>
        {primaryExpanded.value ? (
          <span class="flex items-center">
            收起
            <el-icon style="margin-left: 4px">
              <ArrowUp />
            </el-icon>
          </span>
        ) : (
          <span class="flex items-center">
            展开
            <el-icon style="margin-left: 4px">
              <ArrowDown />
            </el-icon>
          </span>
        )}
      </ElButton>
    )
  },
  {
    label: '企划选品信息',
    key: 'planInfo',
    show: planExpanded.value,
    right: () => (
      <ElButton link type="primary" size="small" onClick={togglePlanExpanded}>
        {planExpanded.value ? (
          <span class="flex items-center">
            收起
            <el-icon style="margin-left: 4px">
              <ArrowUp />
            </el-icon>
          </span>
        ) : (
          <span class="flex items-center">
            展开
            <el-icon style="margin-left: 4px">
              <ArrowDown />
            </el-icon>
          </span>
        )}
      </ElButton>
    )
  }
])

const createDefaultProduct = (): ProductDetail => ({
  id: '',
  bpBusinessEnterprisePlanId: '',
  category: '',
  categoryName: '',
  planName: '',
  productName: '',
  supplierId: '',
  supplierName: '',
  spotInventoryText: '',
  spotInventoryFile: '',
  sizeText: '',
  sizeFile: '',
  unitPrice: '',
  realPhotos: '',
  modelUpperBodyPicture: '',
  productLink: '',
  grossProfitMarginText: '',
  grossProfitMarginFile: '',
  planningObjectiveText: '',
  planningObjectiveFile: '',
  inventoryDepthText: '',
  inventoryDepthFile: '',
  salePoint: '',
  minimumOrderQuantity: '',
  costEstimate: '',
  colorAnalysis: '',
  fabricContent: '',
  artworkNumber: ''
})

const createDefaultPlan = (): PlanDetail => ({
  id: '',
  category: '',
  categoryLabel: '',
  planName: '',
  chooseTime: '',
  pricing: '',
  salesVolume: '',
  costEstimate: '',
  productPicture: '',
  sizeText: '',
  sizeFile: '',
  productLink: '',
  chooseDirection: '',
  salePoint: '',
  fabricComposition: [],
  minimumOrderQuantity: '',
  factoryInventoryDepth: '',
  colorAnalysis: ''
})

const detailsRef = ref<any>()
const dataValue = ref<DetailState>({
  product: createDefaultProduct(),
  plan: createDefaultPlan()
})
const bukValue = ref<DetailState>(cloneDeep(dataValue.value))
const viewType = ref<'view' | 'add' | 'edit'>('view')
const loading = ref(false)

const title = computed(() =>
  viewType.value === 'view' ? '详情' : viewType.value === 'edit' ? '编辑' : '新增'
)

const product = computed(() => dataValue.value.product)
const plan = computed(() => dataValue.value.plan)

const getCategoryLabel = (value: any, fallback?: string) => {
  if (fallback) return fallback
  if (value === undefined || value === null || value === '') return ''
  return categoryLabelMap.get(value) ?? categoryLabelMap.get(String(value)) ?? ''
}

const tryDecode = (value: string) => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

const parseTransferValue = (value: unknown): AttachmentItem[] => {
  const results: AttachmentItem[] = []

  const append = (url?: string, name?: string, createdAt?: string) => {
    if (!url) return
    const normalizedUrl = String(url).trim()
    if (!normalizedUrl) return

    // 如果没有名字，尝试从 URL 截取或直接使用 URL
    const displayName = String(name ?? '').trim() || normalizedUrl.split('/').pop() || normalizedUrl

    // 避免重复 (判断 URL 和 name)
    if (results.some((item) => item.url === normalizedUrl && item.name === displayName)) return

    results.push({ url: normalizedUrl, name: displayName, createdAt })
  }

  const handleString = (raw: string) => {
    if (!raw) return
    const trimmed = raw.trim()
    if (!trimmed) return

    // 尝试解析 JSON 格式
    if (
      (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']'))
    ) {
      try {
        const parsed = JSON.parse(trimmed)
        handleValue(parsed)
        return
      } catch {
        // ignore json parse error
      }
    }

    // 处理逗号分隔的字符串
    trimmed
      .split(',')
      .map((segment) => segment.trim())
      .filter(Boolean)
      .forEach((segment) => {
        let tempSegment = segment
        let createdAt = ''

        // 1. 提取 createdAt (支持 &createdAt=... 或 ?createdAt=...)
        // 正则解释：匹配 ? 或 & 开头的 createdAt=，捕获后续直到字符串结束或下一个 & 的内容
        const dateMatch = tempSegment.match(/[?&]createdAt=([^&]+)/)
        if (dateMatch) {
          createdAt = tryDecode(dateMatch[1]) // 解码时间字符串（处理空格等）
          // 从原始字符串中移除 createdAt 部分，保持 URL 干净
          tempSegment = tempSegment.replace(dateMatch[0], '')
        }

        // 2. 提取 name (原逻辑)
        const [urlPart, namePart] = tempSegment.split('?name=')
        if (!urlPart) return

        const decodedName = namePart ? tryDecode(namePart) : ''
        append(urlPart, decodedName, createdAt)
      })
  }

  const handleObject = (obj: Record<string, any>) => {
    if (!obj) return
    const url = obj.url ?? obj.fileUrl ?? obj.previewUrl ?? obj.ossUrl ?? obj.path ?? ''
    const name =
      obj.name ?? obj.fileName ?? obj.originalName ?? obj.originName ?? obj.displayName ?? ''
    const createdAt = obj.createdAt ?? obj.createTime ?? '' // 对象里也可能直接有 createdAt

    if (Array.isArray(obj.list)) {
      handleValue(obj.list)
    }
    append(url, name, createdAt)
  }

  const handleValue = (val: unknown) => {
    if (!val) return
    if (Array.isArray(val)) {
      val.forEach((item) => handleValue(item))
      return
    }
    if (typeof val === 'string') {
      handleString(val)
      return
    }
    if (typeof val === 'object') {
      handleObject(val as Record<string, any>)
    }
  }

  handleValue(value)
  return results
}
const productAttachments = computed(() => ({
  spotInventory: parseTransferValue(product.value.spotInventoryFile),
  size: parseTransferValue(product.value.sizeFile),
  realPhotos: parseTransferValue(product.value.realPhotos),
  modelUpperBody: parseTransferValue(product.value.modelUpperBodyPicture),
  grossProfit: parseTransferValue(product.value.grossProfitMarginFile),
  planningObjective: parseTransferValue(product.value.planningObjectiveFile),
  inventoryDepth: parseTransferValue(product.value.inventoryDepthFile)
}))

const planAttachments = computed(() => ({
  productPictures: parseTransferValue(plan.value.productPicture),
  size: parseTransferValue(plan.value.sizeFile)
}))

const productRealPhotoUrls = computed(() =>
  productAttachments.value.realPhotos.map((item) => item.url)
)

const productModelPhotoUrls = computed(() =>
  productAttachments.value.modelUpperBody.map((item) => item.url)
)

const planProductPictureUrls = computed(() =>
  planAttachments.value.productPictures.map((item) => item.url)
)

const productCategoryText = computed(
  () => product.value.categoryName || getCategoryLabel(product.value.category)
)

const planCategoryText = computed(
  () => plan.value.categoryLabel || getCategoryLabel(plan.value.category, plan.value.categoryLabel)
)

const formatFabricTag = (item: FabricItem) => {
  const dictLabel = item.key ? getDictLabel(DICT_TYPE.FABRIC, item.key) : ''
  const display = dictLabel || item.name || item.key
  if (!display && (item.value === undefined || item.value === null)) return ''
  const formatValue = () => {
    const raw = item.value
    if (raw === undefined || raw === null) return ''
    if (typeof raw === 'number') return `${raw}%`
    const str = String(raw).trim()
    if (!str) return ''
    const parsed = Number.parseFloat(str.replace('%', ''))
    if (Number.isFinite(parsed)) return `${parsed}%`
    return str
  }
  const value = formatValue()
  return `${display || '未命名'}${value ? value : ''}`
}

const fabricCompositionText = computed(() => {
  if (typeof plan.value.fabricComposition === 'string') {
    return plan.value.fabricComposition || '-'
  }
  const list = plan.value.fabricComposition || []
  if (!Array.isArray(list) || !list.length) return '-'
  const texts = list
    .map((item) => formatFabricTag(item))
    .map((str) => str?.trim?.())
    .filter((str) => str && str.length)
  return texts.length ? texts.join('、') : '-'
})

const hasField = (text?: string, attachments?: AttachmentItem[]) => {
  const textFilled = typeof text === 'string' && text.trim().length > 0
  const hasAttachment = Array.isArray(attachments) && attachments.length > 0
  return textFilled || hasAttachment
}

const unwrapDetail = (res: any): any => {
  if (!res) return {}
  if (Array.isArray(res)) return res[0] ?? {}
  if (res.data !== undefined) return unwrapDetail(res.data)
  if (res.detail !== undefined) return unwrapDetail(res.detail)
  if (res.record !== undefined) return unwrapDetail(res.record)
  if (res.result !== undefined) return unwrapDetail(res.result)
  if (res.info !== undefined) return unwrapDetail(res.info)
  if (Array.isArray(res.records)) return res.records[0] ?? {}
  if (Array.isArray(res.list)) return res.list[0] ?? {}
  if (Array.isArray(res.rows)) return res.rows[0] ?? {}
  return res
}

const transformProductDetail = (source: any): ProductDetail => {
  const detail = source ?? {}
  if (!detail || typeof detail !== 'object') {
    return createDefaultProduct()
  }
  const category = detail.category ?? detail.categoryValue ?? ''
  const categoryName =
    detail.categoryName ??
    detail.categoryLabel ??
    getCategoryLabel(category) ??
    getCategoryLabel(detail.category)
  return {
    ...detail,
    id: detail.id ?? detail.candidateProductId ?? detail.bpCandidateProductInfoId ?? '',
    bpBusinessEnterprisePlanId:
      detail.bpBusinessEnterprisePlanId ??
      detail.planId ??
      detail.bpBusinessEnterprisePlanInfoId ??
      '',
    category,
    categoryName,
    planName: detail.planName ?? detail.planInfo?.planName ?? '',
    productName: detail.productName ?? '',
    supplierId: detail.supplierId ?? '',
    supplierName:
      detail.supplierName ??
      detail.supplier ??
      detail.supplierLabel ??
      detail.supplierCompany ??
      '',
    spotInventoryText: detail.spotInventoryText ?? '',
    spotInventoryFile: detail.spotInventoryFile ?? detail.spotInventoryFileList ?? '',
    sizeText: detail.sizeText ?? '',
    sizeFile: detail.sizeFile ?? detail.sizeFileList ?? '',
    unitPrice: detail.unitPrice ?? '',
    realPhotos: detail.realPhotos ?? detail.realPhoto ?? detail.realPhotosList ?? '',
    modelUpperBodyPicture:
      detail.modelUpperBodyPicture ?? detail.modelPhoto ?? detail.modelUpperBodyPictureList ?? '',
    productLink: detail.productLink ?? detail.productUrl ?? '',
    grossProfitMarginText: detail.grossProfitMarginText ?? '',
    grossProfitMarginFile: detail.grossProfitMarginFile ?? detail.grossProfitMarginFileList ?? '',
    planningObjectiveText: detail.planningObjectiveText ?? '',
    planningObjectiveFile: detail.planningObjectiveFile ?? detail.planningObjectiveFileList ?? '',
    inventoryDepthText: detail.inventoryDepthText ?? '',
    inventoryDepthFile: detail.inventoryDepthFile ?? detail.inventoryDepthFileList ?? '',
    salePoint: detail.salePoint ?? detail.coreSellingPoint ?? '',
    minimumOrderQuantity: detail.minimumOrderQuantity ?? '',
    costEstimate: detail.costEstimate ?? '',
    colorAnalysis: detail.colorAnalysis ?? '',
    fabricContent: detail.fabricContent ?? ''
  }
}

const parseFabricComposition = (content: unknown): FabricItem[] => {
  const list: FabricItem[] = []
  const append = (item: FabricItem) => {
    if (!item.key && item.value === undefined) return
    list.push(item)
  }

  const handleArray = (arr: any[]) => {
    arr.forEach((item) => {
      if (item && typeof item === 'object') {
        append({
          key: String(item.key ?? item.name ?? item.material ?? '').trim(),
          name: item.name ?? item.label ?? '',
          value: item.value ?? item.percentage ?? item.percent ?? ''
        })
      }
    })
  }

  if (!content) return list
  if (Array.isArray(content)) {
    handleArray(content)
    return list
  }
  if (typeof content === 'string') {
    const trimmed = content.trim()
    if (!trimmed) return list
    if (
      (trimmed.startsWith('[') && trimmed.endsWith(']')) ||
      (trimmed.startsWith('{') && trimmed.endsWith('}'))
    ) {
      try {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed)) {
          handleArray(parsed)
        }
        return list
      } catch {
        // ignore
      }
    }
    trimmed
      .split(/[,，;；]/)
      .map((segment) => segment.trim())
      .filter(Boolean)
      .forEach((segment) => {
        const match = segment.match(/^([^0-9%]+)(.*)$/)
        if (match) {
          append({
            key: match[1].trim(),
            value: match[2]?.trim()
          })
        } else {
          const [key, value = ''] = segment.split(/[:：]/)
          append({
            key: (key ?? '').trim(),
            value: value.trim()
          })
        }
      })
    return list
  }
  if (typeof content === 'object') {
    handleArray([content])
  }
  return list
}

const transformPlanDetail = (source: any): PlanDetail => {
  const detail = source
  if (!detail || typeof detail !== 'object') {
    return createDefaultPlan()
  }
  const category = detail.category ?? detail.categoryValue ?? ''
  const categoryLabel =
    detail.categoryLabel ?? detail.categoryName ?? getCategoryLabel(category) ?? ''
  return {
    ...detail,
    id: detail.id ?? detail.bpBusinessEnterprisePlanId ?? '',
    category,
    categoryLabel,
    planName: detail.planName ?? detail.name ?? '',
    chooseTime:
      detail.chooseTime ??
      detail.selectionMeetingDate ??
      detail.selectionDate ??
      detail.chooseDate ??
      '',
    pricing: detail.pricing ?? '',
    salesVolume: detail.salesVolume ?? detail.sales ?? '',
    costEstimate: detail.costEstimate ?? detail.cost ?? '',
    productPicture: detail.productPicture ?? detail.image ?? detail.productPictures ?? '',
    sizeText: detail.sizeText ?? '',
    sizeFile: detail.sizeFile ?? detail.sizeFileList ?? '',
    productLink: detail.productLink ?? detail.competitiveProductLink ?? '',
    chooseDirection: detail.chooseDirection ?? detail.selectionDirection ?? '',
    salePoint: detail.salePoint ?? detail.coreSellingPoint ?? '',
    fabricComposition: detail.fabricContent ?? ''
  }
}

const fetchPlanDetail = async (planId: string | number | '') => {
  if (planId === '' || planId === undefined || planId === null) {
    return createDefaultPlan()
  }
  try {
    const res = await getBuyerPlanDetail(planId)
    return transformPlanDetail(res)
  } catch (error) {
    console.error(error)
    return createDefaultPlan()
  }
}

const handleClosed = () => {
  emit('closed')
}

const openDrawer = (
  payload: Partial<{ id: string | number }> = {},
  type: 'view' | 'add' | 'edit' = 'view'
) => {
  detailsRef?.value?.openDrawer(
    async () => {
      viewType.value = type
      loading.value = true
      try {
        let productDetail: ProductDetail = createDefaultProduct()
        if (payload?.id !== undefined && payload?.id !== null && payload.id !== '') {
          const res = await getCandidateProductDetail(payload.id)
          productDetail = transformProductDetail(res)
        } else {
          productDetail = transformProductDetail(payload)
        }
        const planDetail = await fetchPlanDetail(productDetail.bpBusinessEnterprisePlanId ?? '')
        dataValue.value = {
          product: productDetail,
          plan: planDetail
        }
        bukValue.value = cloneDeep(dataValue.value)
      } catch (error) {
        console.error(error)
        dataValue.value = {
          product: createDefaultProduct(),
          plan: createDefaultPlan()
        }
      } finally {
        loading.value = false
      }
    },
    () => {}
  )
}

defineExpose({ openDrawer })
provide('BuyerPlanDetails', { dataValue, bukValue, viewType, title, loading })
</script>
<style scoped lang="scss">
.image-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.attachment-item + .attachment-item {
  margin-top: 4px;
}

:deep(.sw-form-content-layout) {
  background-color: #f8f8f9;
}

:deep(.el-image) {
  display: block;
}

// :deep(.upload_info) {
//   width: unset;
// }

:deep(.card_info) {
  background-color: unset;
}

.sale-point-line {
  font-size: 14px;
  color: #333333;
  padding: 12px 4px 12px 16px;
  border-bottom:1px solid #E5E5E5;
  margin-left: -12px;
  margin-right: -12px;
  &:first-child {
    padding-top: 4px;
  }
  &:last-child {
    padding-bottom: 4px;
    border-bottom: 0;
  }
}
</style>
