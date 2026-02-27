<template>
  <ex-screen>
    <query-scheme :scheme="scheme" v-model="searchData" :name="pageName" />
    <section-title-header :has-dot="false">
      <div class="header-filter-container">
        <h3 class="mr-12px">企划确认结果：</h3>
        <el-checkbox-group v-model="searchData.confirmResult" @change="onSearch">
          <el-checkbox
            v-for="opt in confirmedStatusOptions"
            :key="opt.value"
            :label="opt.value"
            border
            class="filter-checkbox"
          >
            <div class="checkbox-content">
              <img :src="opt.icon" class="checkbox-icon" alt="" />
              <span>{{ opt.label }}</span>
            </div>
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <template #right>
        <el-button v-if="userInfo.isAdd" type="primary" @click="onAdd">新增</el-button>
      </template>
    </section-title-header>
    <section class="mt-16px" v-loading="loading">
      <el-scrollbar>
        <ul class="product-list" :class="{ 'product-list-empty': !dataList.length }">
          <template v-for="item in dataList" :key="item.id || item.productName">
            <li
              class="product-item"
              :class="{
                'is-clickable': (item.availableButtons || []).includes('detail'),
                'is-active': currentActiveId === item.id
              }"
              @click="onCardClick(item)"
            >
              <div class="product-item-title">
                <!-- <div
                  v-if="STATUS_APPROVAL_SHOW.has(Number(item.candidateProductStatus))"
                  class="product-approval-status"
                  :class="getStatusClass(item.candidateProductStatus)"
                >

                  <div class="product-approval-status-icon"></div>
                  <div class="product-approval-status-text">
                    {{ item.candidateProductStatusName || '-' }}
                  </div>
                </div> -->
                <div v-if="getConfirmResultIcon(item.confirmResult)" class="confirm-status-wrapper">
                  <el-tooltip
                    :content="getConfirmResultIcon(item.confirmResult)?.label || ''"
                    :teleported="true"
                  >
                    <img
                      :src="getConfirmResultIcon(item.confirmResult)?.icon || ''"
                      class="confirm-result-icon"
                      style="width: 20px; height: 20px"
                      alt=""
                    />
                  </el-tooltip>
                </div>
                <overflow-tooltip :content="item.productName || '-'" :teleported="true" />
                <avatar-display v-if="buildUploader(item).length" :avatars="buildUploader(item)" />
              </div>
              <div class="product-item-subtitle">
                <span class="product-item-label">关联企划：</span>
                <overflow-tooltip :content="item.planName || '-'" :teleported="true" />
              </div>
              <div class="product-item-content">
                <div class="img-line">
                  <div class="img-item" @click.stop>
                    <image-display
                      :src="getProductImage(item)"
                      fit="contain"
                      width="125"
                      height="120"
                    />
                    <div class="img-item-mask">
                      <div class="img-item-mask-label">图稿编号：</div>
                      <div class="img-item-mask-value">
                        <overflow-tooltip :content="item.artworkNumber || '-'" />
                      </div>
                    </div>
                  </div>
                  <div class="info-item">
                    <el-row>
                      <el-col :span="14">
                        <div class="product-item-label">品类</div>
                        <div class="product-item-value product-item-value-bold">
                          <overflow-tooltip
                            :content="item.categoryName || mapCategory(item.category) || '-'"
                          />
                        </div>
                      </el-col>
                      <el-col :span="10">
                        <div class="product-item-label">单价</div>
                        <div class="product-item-value product-item-value-bold">
                          <overflow-tooltip :content="formatUnitPrice(item.unitPrice) || '-'" />
                        </div>
                      </el-col>
                    </el-row>
                    <el-row class="mt-10px">
                      <el-col :span="24">
                        <div class="product-item-label">卖点/功能</div>
                        <div class="product-item-value product-item-value-bold">
                          <overflow-tooltip
                            :content="formatSalePoint(item.salePoint) || '-'"
                            :line-clamp="2"
                            :teleported="true"
                          />
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </div>
                <div class="product-progress">
                  <div class="product-progress-item">
                    <reviewer v-if="buildReviewers(item).length" :reviewer="buildReviewers(item)" />
                    <div v-else class="product-item-label">选品审核：-</div>
                  </div>
                </div>
              </div>
              <div class="button-group" v-if="(item.availableButtons || []).length">
                <template v-for="btn in item.availableButtons" :key="btn">
                  <el-button
                    v-if="btn !== 'detail'"
                    :type="resolveButtonType(btn)"
                    @click.stop="handleAction(btn, item)"
                    :plain="resolveButtonType(btn) === 'danger'"
                  >
                    {{ resolveButtonText(btn) }}
                  </el-button>
                </template>
              </div>
              <div
                v-if="hasStatus(item)"
                class="product-item-select-status"
                :class="getStatusClass(item, true)"
              >
                {{ statusText(item) }}
              </div>
              <div class="product-item-rematch-tips" v-if="hasRematchTips(item)">
                <el-icon size="14px" color="#EB3737" class="mr-4px">
                  <WarningFilled />
                </el-icon>
                <overflow-tooltip>
                  <span
                    >当前参选产品需由【{{ getSupplierName(item) }}】重新匹配供应商，请务必于【{{
                      item.latestCompletionDate
                    }}】前完成！</span
                  >
                </overflow-tooltip>
              </div>
            </li>
          </template>
          <li v-if="!loading && !dataList.length" class="empty-holder">
            <s-empty />
          </li>
        </ul>
      </el-scrollbar>
    </section>
    <div class="pagination-wrapper">
      <s-pagination
        v-model:page="page.page"
        v-model:limit="page.size"
        :total="page.total"
        @pagination="handlePagination"
      />
    </div>
  </ex-screen>
  <edit-drawer ref="editDrawerRef" @success="onSearch" />
  <review-drawer ref="reviewDrawerRef" @success="onSearch" />
  <!-- 选品抽屉 -->
  <selection-drawer ref="selectionDrawerRef" @refresh="onSearch" />

  <!-- 企划确认弹窗 -->
  <plan-dialog ref="planDialogRef" @refresh="onSearch" />
  <detail-drawer ref="detailDrawerRef" @refresh="onSearch" @closed="onDetailClosed" />

  <!-- 匹配供应商弹窗 -->
  <match-supplier-dialog ref="matchSupplierDialogRef" @refresh="onSearch" />
</template>

<script lang="tsx">
export default { name: 'ProductReferenceManagementPage' }
</script>

<script lang="tsx" setup>
import { onMounted, provide, ref } from 'vue'
import { PageItem } from '@/components/template/config/type'
import SPagination from '@/components/SWTable/src/SPagination.vue'
import Reviewer from '../components/reviewer.vue'
import { usePage, SearchItem, DataItem } from '../config/config'
import { getCandidateProductPage, deleteCandidateProduct } from '@/api/oa/buyer/productReference'
import SEmpty from '@/components/SWTable/src/empty.vue'
import EditDrawer from '../details/editDrawer.vue'
import ReviewDrawer from '../details/reviewDrawer.vue'
import { useMessage } from '@/hooks/web/useMessage'
import selectionDrawer from '../details/selectionDrawer.vue'
import planDialog from '../details/planDialog.vue'
import { useRole } from '@/hooks/common/useRole'
import DetailDrawer from '../details/detailDrawer.vue'
import { nextFrameTick } from '@/utils/util'
// 1. 引入新组件
import MatchSupplierDialog from '../details/matchSupplierDialog.vue'

const currentActiveId = ref<number | string>('')

// ... 原有代码 ...

// 2. 定义 ref
const matchSupplierDialogRef = ref<InstanceType<typeof MatchSupplierDialog>>()

const { getPermissionInfo, grabCheck, getRole, permissionList } = useRole('新品')

const pageName = 'ProductReferenceManagement'
const userInfo = ref<Record<string, any>>({})

const {
  dataList,
  page,
  loading,
  scheme,
  searchData,
  stateInfo,
  statistics,
  setRouterInfo,
  confirmedStatusOptions
} = usePage(userInfo)

const editDrawerRef = ref<InstanceType<typeof EditDrawer>>()
const reviewDrawerRef = ref<InstanceType<typeof ReviewDrawer>>()
const selectionDrawerRef = ref<InstanceType<typeof selectionDrawer>>()
const planDialogRef = ref<InstanceType<typeof planDialog>>()
const detailDrawerRef = ref<InstanceType<typeof DetailDrawer>>()
const message = useMessage()
const STATUS_APPROVAL_SHOW = new Set([400, 500, 600])
const STATUS_FLAG = new Set([100, 200, 300, 600, 500])
const STATUS_SUCCESS = new Set([300, 600])
const STATUS_WARNING = new Set([100, 500])
const STATUS_APPROVAL = new Set([400]) // 待审核

const confirmResultIconMap = new Map(
  confirmedStatusOptions.map((opt) => [opt.value, { icon: opt.icon, label: opt.label }])
)

function hasStatus(item: any) {
  const status = item.candidateProductStatus
  const isDraft = item.isDraft === 1
  if (isDraft) {
    return true
  } else {
    return STATUS_FLAG.has(Number(status))
  }
}

function hasRematchTips(item: any) {
  return item.confirmResult === 4 && item.candidateProductStatus === 600
}

const onCardClick = (item: any) => {
  const buttons = item.availableButtons || []
  // 只有当 availableButtons 包含 'detail' 时才触发详情弹窗
  if (buttons.includes('detail')) {
    // handleAction('detail', item)
    currentActiveId.value = item.id
    handleAction('detail', item)
  }
}

// 2. 定义获取图标的函数 (供 template 列表使用)
const getConfirmResultIcon = (status: number | string | undefined) => {
  if (status === null || status === undefined) return null
  const iconData = confirmResultIconMap.get(Number(status))
  return iconData ? { icon: iconData.icon, label: iconData.label } : null
}

const statusText = (item: any) => {
  const status = item.candidateProductStatus
  const isDraft = item.isDraft === 1
  if (isDraft) {
    return '已暂存'
  } else if (status === 600 || status === 500) {
    return '已选中'
  }
  return item.candidateProductStatusName || '-'
}

const BUTTON_META: Record<
  string,
  {
    text: string
    type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  }
> = {
  detail: { text: '查看详情', type: 'primary' },
  selection: { text: '选品', type: 'primary' },
  edit: { text: '编辑' },
  delete: { text: '删除', type: 'danger' },
  selection_read: { text: '选品', type: 'primary' },
  review: { text: '选品审核' },
  review_read: { text: '选品审核' },
  confirm: { text: '企划确认' },
  confirm_read: { text: '企划确认' },
  match_supplier: { text: '匹配供应商' }
}

const CATEGORY_LABEL_MAP = new Map<string | number, string>()
;[
  { label: '内裤品', value: 1 },
  { label: '内衣', value: 2 },
  { label: '季节品', value: 3 },
  { label: '袜子', value: 4 }
].forEach((item) => {
  CATEGORY_LABEL_MAP.set(item.value, item.label)
  CATEGORY_LABEL_MAP.set(String(item.value), item.label)
})

const setParamsData = (noPage = false) => {
  const params: Record<string, any> = {}
  const {
    category,
    candidateProductStatus,
    productName,
    planName,
    uploadUserId,
    id,
    artworkNumber,
    confirmResult
  } = searchData.value
  if (category !== '' && category !== null && category !== undefined) {
    params.category = typeof category === 'number' ? category : String(category)
  }
  if (confirmResult && confirmResult.length > 0) {
    params.confirmResults = confirmResult
  }
  if (
    candidateProductStatus !== '' &&
    candidateProductStatus !== null &&
    candidateProductStatus !== undefined
  ) {
    const parsed = Number(candidateProductStatus)
    params.candidateProductStatus = Number.isNaN(parsed) ? candidateProductStatus : parsed
  }
  if (productName?.trim()) {
    params.productName = productName.trim()
  }
  if (planName?.trim()) {
    params.planName = planName.trim()
  }
  if (id) {
    params.id = id
  }
  if (uploadUserId !== '' && uploadUserId !== null && uploadUserId !== undefined) {
    if (typeof uploadUserId === 'object') {
      const candidate =
        (uploadUserId as Record<string, any>)?.userId ??
        (uploadUserId as Record<string, any>)?.id ??
        ''
      if (candidate) {
        params.uploadUserId = candidate
      }
    } else {
      params.uploadUserId = uploadUserId
    }
  }
  if (artworkNumber) {
    params.artworkNumber = artworkNumber
  }
  if (noPage) return params
  return {
    ...params,
    page: page.value.page,
    size: page.value.size
  }
}

const unwrapRecords = (res: any) => {
  if (!res) return []
  if (Array.isArray(res)) return res
  if (Array.isArray(res.records)) return res.records
  if (Array.isArray(res.list)) return res.list
  if (Array.isArray(res.rows)) return res.rows
  return []
}

const unwrapTotal = (res: any, fallback: number) => {
  if (!res) return fallback
  if (typeof res.total === 'number') return res.total
  if (typeof res.total === 'string' && res.total !== '') {
    const parsed = Number(res.total)
    if (!Number.isNaN(parsed)) return parsed
  }
  if (res.page && typeof res.page?.total === 'number') return res.page.total
  if (typeof res.totalCount === 'number') return res.totalCount
  return fallback
}

function onAdd() {
  editDrawerRef.value?.openDrawer({}, 'add')
}

function onReview(item: DataItem) {
  // reviewDrawerRef.value?.openDrawer({ ...item }, 'review')
}

const onSearch = async () => {
  currentActiveId.value = ''
  loading.value = true
  await nextFrameTick()
  try {
    const params = setParamsData()
    const res = await getCandidateProductPage(params)
    const records = res.records
    dataList.value = records
    page.value = {
      ...page.value,
      total: unwrapTotal(res, records.length)
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const onDetailClosed = () => {
  currentActiveId.value = ''
}

const resetForm = () => {
  page.value = { ...new PageItem() }
  searchData.value = { ...new SearchItem() }
  onSearch()
}

const handlePagination = ({ page: current, limit }: { page: number; limit: number }) => {
  if (typeof current === 'number') {
    page.value.page = current
  }
  if (typeof limit === 'number') {
    page.value.size = limit
  }
  onSearch()
}

const getStatusClass = (item: any, isFlag = false) => {
  const status = item.candidateProductStatus
  const isDraft = item.isDraft === 1
  console.log(item.isDraft, 'item.isDraft')
  const numeric = Number(status)
  if (isFlag) {
    if ([500, 300, 600].includes(numeric)) return 'success'
  } else {
    if (STATUS_SUCCESS.has(numeric)) return 'success'
  }
  if (isDraft) {
    return 'draft'
  }

  if (STATUS_WARNING.has(numeric)) return 'warning'
  if (STATUS_APPROVAL.has(numeric)) return 'approval'
  return ''
}

const mapCategory = (category: string | number | undefined) => {
  if (category === null || category === undefined || category === '') return ''
  return CATEGORY_LABEL_MAP.get(category) ?? CATEGORY_LABEL_MAP.get(String(category)) ?? ''
}

const formatUnitPrice = (value: unknown) => {
  if (value === null || value === undefined || value === '') return '-'
  // const numberValue = Number(value)
  // if (!Number.isNaN(numberValue)) {
  //   return `¥${numberValue.toFixed(2)}`
  // }
  return String(value)
}

const parsePhotos = (source: unknown): string[] => {
  if (!source) return []
  if (Array.isArray(source)) {
    return source.filter((item) => typeof item === 'string' && item.trim())
  }
  if (typeof source === 'string') {
    const trimmed = source.trim()
    if (!trimmed) return []
    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) {
        return parsed.filter((item) => typeof item === 'string' && item.trim())
      }
    } catch {
      // ignore json parse error
    }
    return trimmed
      .split(/[,，]/)
      .map((url) => url.trim())
      .filter(Boolean)
  }
  return []
}

const getProductImage = (item: any) => {
  const photos = parsePhotos(item.realPhotos)
  return photos[0]
}

const buildUploader = (item: any) => {
  const user = item.uploadUser as Record<string, any> | null
  if (!user) return []
  const name = user.name ?? user.enName ?? user.nickName ?? user.realName ?? user.managerName ?? ''
  const avatar = user.avatarOrigin ?? ''
  if (!name && !avatar) return []
  return [
    {
      name: name || '上传人',
      src: avatar
    }
  ]
}

const convertReviewStatus = (status: any) => {
  const numeric = Number(status)
  if (numeric === 1 || numeric === 2) return 'success'
  return 'warning'
}

const buildReviewers = (item: any) => {
  const list = Array.isArray(item.reviewInfoList) ? item.reviewInfoList : []
  if (!list.length) return []
  type ReviewerGroup = {
    title: string
    status: string
    children: Array<{ name: string; src: string }>
  }
  const reviewTypeMap = new Map<number | string, string>([
    [2, '版师'],
    [1, '供应链'],
    [3, 'QA']
  ])
  const map = new Map<string, ReviewerGroup>()
  list.forEach((info: any, index: number) => {
    const rawKey = info?.reviewType ?? info?.reviewTypeName ?? index
    const key = String(rawKey)
    const status = convertReviewStatus(info?.reviewStatus)
    const title =
      reviewTypeMap.get(info?.reviewType as number) ||
      reviewTypeMap.get(info?.reviewTypeName as string) ||
      info?.reviewType ||
      '审核'
    const group: ReviewerGroup = map.get(key) ?? {
      title,
      status,
      children: []
    }
    if (status === 'success') {
      group.status = 'success'
    }
    const reviewersSource = Array.isArray(info?.reviewers) ? info.reviewers : [info]
    reviewersSource.forEach((reviewer: any) => {
      const name =
        reviewer?.reviewerName ?? reviewer?.name ?? reviewer?.userName ?? reviewer?.nickName ?? ''
      const src = reviewer?.reviewerAvatar ?? reviewer?.avatar ?? reviewer?.avatarOrigin ?? ''
      if (name || src) {
        group.children.push({ name, src })
      }
    })
    map.set(key, group)
  })
  const orderedKeys = Array.from(reviewTypeMap.keys()).map((orderKey) => String(orderKey))
  const orderedGroups: ReviewerGroup[] = []
  const visited = new Set<string>()
  orderedKeys.forEach((orderKey) => {
    const group = map.get(orderKey)
    if (group) {
      orderedGroups.push(group)
      visited.add(orderKey)
    }
  })
  map.forEach((group, key) => {
    if (!visited.has(key)) {
      orderedGroups.push(group)
    }
  })
  console.log(orderedGroups)
  return orderedGroups
}

const resolveButtonText = (code: string) => BUTTON_META[code]?.text ?? code

const resolveButtonType = (
  code: string
): 'primary' | 'success' | 'warning' | 'danger' | 'info' | undefined => BUTTON_META[code]?.type

const handleAction = async (code: string, item: any) => {
  if (!item?.id && item?.id !== 0) {
    message.warning('缺少主键，无法执行操作')
    return
  }
  switch (code) {
    case 'detail':
      detailDrawerRef.value?.openDrawer({ id: item.id }, 'view')
      break
    case 'edit':
      editDrawerRef.value?.openDrawer({ id: item.id }, 'edit')
      break
    case 'selection':
    case 'selection_read': {
      const mode = code === 'selection_read' ? 'view' : 'edit'
      selectionDrawerRef.value?.openDrawer({ candidateProductId: item.id, mode })
      break
    }
    case 'review':
    case 'review_read':
      reviewDrawerRef.value?.openDrawer({ id: item.id })
      break
    case 'confirm':
      planDialogRef.value?.openDialog({ candidateProductId: item.id, mode: 'edit' })
      break
    case 'confirm_read':
      planDialogRef.value?.openDialog({ candidateProductId: item.id, mode: 'view' })
      break
    case 'delete':
      try {
        await message.confirm('确认删除该参选产品吗？', '提示')
        await deleteCandidateProduct(item.id)
        message.success('删除成功')
        onSearch()
      } catch (error: any) {
        if (error === 'cancel' || error === 'close') return
        console.error(error)
        message.error('删除失败')
      }
      break
    // [新增] 处理匹配供应商点击
    case 'match_supplier':
      console.log(item, 'item')
      matchSupplierDialogRef.value?.openDialog(item)
      break
    default:
      message.info('功能开发中')
  }
}

const onButtonClick = () => {}
const viewDetails = () => {}

const getSupplierName = (item: any) => {
  const list = buildReviewers(item)
  const supplier = list.find((item) => item.title === '供应链')
  return supplier?.children?.map((item) => item.name).join(',')
}

setRouterInfo()

onMounted(() => {
  getPermissionInfo(async () => {
    console.log(permissionList.value)
    userInfo.value = { isAdd: grabCheck('买手图库提交人员') || grabCheck('新品供应链负责人') }
    await onSearch()
  })
})

const formatSalePoint = (salePoint: string) => {
  if(!salePoint) return 
  return salePoint.split('&#&').reduce((res: string, item: string, index: number) =>{
    return res+=`${index === 0 ? '' : '，'}${index+1}、${item}`
  }, '')
}

provide(`${pageName}Form`, {
  searchData,
  dataList,
  page,
  loading,
  stateInfo,
  statistics,
  setParamsData,
  resetForm,
  onSearch,
  onButtonClick,
  viewDetails
})
</script>

<style lang="scss" scoped>
@use './styles.scss';
</style>
