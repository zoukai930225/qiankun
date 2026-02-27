<template>
  <flux-wrap class="hq-main-image-library">
    <template #header>
      <query-scheme
        :scheme="scheme"
        v-model="searchData"
        :name="pageName"
        :show-expand="false"
        :show-divider="false"
      />

      <div class="filter-card" v-show="isExpand">
        <common-filter
          :groups="filterGroups"
          v-model="filterState"
          @change="handleFilterChange"
          label-width="60px"
        />
        <!-- 策划未填写、人像未填写、静物未填写、修图未填写角标显示未填写要点的数量统计 -->
        <div class="filterCheck mt10px">
          <el-form :model="searchData" :inline="true" class="demo-form-inline">
            <el-form-item label="" >
              <el-checkbox-group v-model="searchData.unfilled" @change="()=>handleFilterChange()">
                <el-badge v-for="item in filterCheckList" :key="item.value" :value="statistics[item.key]" type="danger" :offset="[-12, 0]"
                color="#EB3737" :badge-style="{ height: '14px' }" class="mr10px">
                  <el-checkbox :label="item.label" :value="item.value" border/>
                </el-badge>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </div>
      </div>
       <el-divider class="g-query-divider">
        <el-button link @click="isExpand = !isExpand"
          >{{ isExpand ? '收起' : '展开' }}
          <el-icon class="el-icon--right">
            <component :is="!isExpand ? 'ArrowDown' : 'ArrowUp'" />
          </el-icon>
        </el-button>
      </el-divider>
      
    </template>

    <div class="list-container" v-loading="loading">
      <div class="list-toolbar">
        <div class="left-action">
          <template v-if="hasPermission">
            <el-checkbox
              v-model="isAllSelected"
              :indeterminate="isIndeterminate"
              @change="handleSelectAll"
            >
              全选
            </el-checkbox>
            <span class="selected-count" v-if="selectionCount > 0">
              已选({{ selectionCount }})
            </span>
          </template>
        </div>
        <div class="right-action">
          <template v-if="hasPermission">
            <el-button
              type="danger"
              plain
              @click="handleBatchDelete"
              :disabled="selectionCount === 0"
            >
              批量删除
            </el-button>
            <el-button type="primary" @click="handleBatchClassify" :disabled="selectionCount === 0">
              批量分类
            </el-button>
          </template>
          <el-button type="primary" @click="handleAdd"> 新增 </el-button>
        </div>
      </div>

      <div class="image-grid">
        <div
          v-for="item in dataList"
          :key="item.id"
          class="image-card"
          :class="{ 'is-selected': item.checked }"
          @click="handleCardClick(item)"
        >
          <div class="card-image-wrapper">
            <el-image :src="item.imageUrl" fit="contain" loading="lazy" class="card-image" />
            <div v-if="canEdit(item)" class="edit-mask more-mask">
              <div class="more-panel">
                <ul class="more-list">
                  <li
                    title="编辑"
                    @mouseenter="hoverEditId = item.id"
                    @mouseleave="hoverEditId = null"
                    @click.stop="handleEditClick(item)"
                  >
                    <img :src="getEditIcon(item)" alt="" />
                  </li>
                </ul>
              </div>
            </div>
            <div v-if="canEditCollection(item)" class="edit-mask more-mask">
              <div class="more-panel">
                <ul class="more-list">
                  <li
                    title="编辑"
                    @mouseenter="hoverEditId = item.id"
                    @mouseleave="hoverEditId = null"
                    @click.stop="handleCollectionEditClick(item)"
                  >
                    <img :src="getEditIcon(item)" alt="" />
                  </li>
                </ul>
              </div>
            </div>
            <div class="card-checkbox" v-if="hasPermission">
              <div @click.stop>
                <el-checkbox v-model="item.checked" />
              </div>
            </div>
          </div>

          <div class="card-content">
            <div class="card-id">
              <overflow-tooltip>
                <span>{{ item.goodsCode }}</span>
              </overflow-tooltip>
            </div>

            <div class="card-tags">
              <overflow-tags :items="getTags(item)" :lines="1"> </overflow-tags>
            </div>

            <div class="card-reason">
              <overflow-tooltip :line-clamp="2">
                <span>
                  <span class="reason-label">收藏原因：</span>
                  {{ item.collectionReason }}
                </span>
              </overflow-tooltip>
            </div>

            <div class="card-footer">
              <div class="user-info">
                <el-avatar :size="20" :src="item.collectionUserAvatarOrigin" />
                <span class="username">{{ item.collectionUserName }}</span>
              </div>
              <span class="date">{{ item.collectionDate }}</span>
            </div>
          </div>
        </div>
      </div>
      <Empty v-if="!loading && dataList.length === 0" />

      <div class="pagination-wrapper">
        <s-pagination
          v-model:page="page.page"
          v-model:limit="page.size"
          :total="page.total"
          @pagination="onSearch"
        />
      </div>
    </div>
    <HighQualityCollection
      ref="collectionDialogRef"
      name="HighQualityCollection"
      :show-info="false"
      @success="handleBatchClassifyConfirm"
    />
    <CollectionDialog
      ref="collectionDetailDialogRef"
      name="HighQualityCollectionDetail"
      @confirm="handleDetailConfirm"
    />
    <EditDrawer
      ref="editDrawerRef"
      name="HighQualityMainImageLibraryEdit"
      @success="handleAddSuccess"
    />
  </flux-wrap>
</template>

<script lang="ts" setup>
import { ref, computed, provide, onMounted, onActivated, onDeactivated } from 'vue'
import { PageItem } from '@/components/template/config/type'
import CommonFilter from '@/components/Filter/commonFilter/index.vue'
import EditIcon from '@/assets/svgs/gallery/edit.svg'
import EditIconActive from '@/assets/svgs/gallery/edit_active.svg'
import {
  useScheme,
  pageName,
  SearchForm,
  createDefaultFilterState,
  buildQueryParams,
  type FilterState,
  type ImageItem
} from './config'
import { useMessage } from '@/hooks/web/useMessage'
import HighQualityCollection from './components/highQualityCollection.vue'
import CollectionDialog from './components/collection.vue'
import {
  fetchHighQualityCollectionPage,
  deleteHighQualityCollection,
  type HighQualityRecord,
  type HighQualityPageParams
} from '@/api/visualCenter/highQualityMainImageLibrary'
import { useHighQualityDict } from './hooks/useHighQualityDict'
import { useRole } from '@/hooks/common/useRole'
import Empty from '@/components/SWTable/src/empty.vue'
import { useRouter } from 'vue-router'
import EditDrawer from './components/edit.vue'
import { useUserStore } from '@/store/modules/user'
import request from '@/config/axios'
defineOptions({
  name: 'HighQualityMainImageLibrary'
})

const { getPermissionInfo, grabCheck, getRole } = useRole('视觉')
const scheme = useScheme(getRole)
const hasPermission = ref(false)
const { filterGroups, fetchDicts } = useHighQualityDict()

const searchData = ref<SearchForm>({ ...new SearchForm() })
const filterState = ref<FilterState>(createDefaultFilterState())
const isExpand = ref(true)
const filterCheckList = ref<any[]>([
  {
    label: '策划未填写',
    value: 'planFlag',
    key:'planCount'
  },
  {
    label: '人像未填写',
    value: 'shootFlag',
    key:'shootCount'
  },
  {
    label: '静物未填写',
    value: 'stillFlag',
    key:'stillCount'
  },
  {
    label: '修图未填写',
    value: 'retouchFlag',
    key:'retouchCount'
  },
])
const dataList = ref<ImageItem[]>([])
const loading = ref(false)
const page = ref<PageItem>({ ...new PageItem(), size: 10, total: 0 })
const stateInfo = ref<Record<string, number>>({})
const statistics = ref<Record<string, any>>({})
const collectionDialogRef = ref<InstanceType<typeof HighQualityCollection> | null>(null)
// const collectionDetailDialogRef = ref<InstanceType<typeof CollectionDialog> | null>(null)
const editDrawerRef = ref<InstanceType<typeof EditDrawer> | null>(null)
const router = useRouter()
const paramsPreview = computed(() => buildQueryParams(searchData.value, filterState.value))
const message = useMessage()
const hoverEditId = ref<string | null>(null)
const userStore = useUserStore()
const userInfo = computed(() => userStore.user)

const canEdit = (item: ImageItem) => {
  return Number((item as any)?.collectionType) === 3 && userInfo.value.id === item.collectionUserId
}
const canEditCollection = (item: ImageItem) => {
  return Number((item as any)?.collectionType) !== 3 && userInfo.value.id === item.collectionUserId
}

const getEditIcon = (item: ImageItem) => {
  const hovered = hoverEditId.value === item.id
  return hovered ? EditIconActive : EditIcon
}

const getTags = (record: ImageItem): string[] => {
  let tags: string[] = []
  if (typeof record.marketPositionStr === 'string' && record.marketPositionStr.length) {
    tags = [...record.marketPositionStr.split(',')]
  }
  if (
    typeof record.masterImageCollectionCategoryStr === 'string' &&
    record.masterImageCollectionCategoryStr.length
  ) {
    tags = [...tags, ...record.masterImageCollectionCategoryStr.split(',')]
  }
  if (
    typeof record.masterImageCollectionFabricStr === 'string' &&
    record.masterImageCollectionFabricStr.length
  ) {
    tags = [...tags, ...record.masterImageCollectionFabricStr.split(',')]
  }
  if (
    typeof record.masterImageCollectionFormStr === 'string' &&
    record.masterImageCollectionFormStr.length
  ) {
    tags = [...tags, ...record.masterImageCollectionFormStr.split(',')]
  }
  console.log('tags', tags)
  return tags
}

const mapRecordToItem = (record: HighQualityRecord): ImageItem => {
  return {
    ...record,
    checked: false
  }
}

// --- 列表选择逻辑 Start ---
const selectionCount = computed(() => dataList.value.filter((item) => item.checked).length)
const selectedItems = computed(() => dataList.value.filter((item) => item.checked))

const isAllSelected = computed({
  get: () => dataList.value.length > 0 && dataList.value.every((item) => item.checked),
  set: (val) => handleSelectAll(val)
})

const isIndeterminate = computed(() => {
  const count = selectionCount.value
  return count > 0 && count < dataList.value.length
})

const handleSelectAll = (val: any) => {
  const isChecked = !!val
  dataList.value.forEach((item) => (item.checked = isChecked))
}

const handleCardClick = (listItem: ImageItem) => {
  // collectionDetailDialogRef.value?.open({ id: listItem.id })
  router.push({
    name: 'HighQualityMainImageLibraryCollection',
    query: { id: listItem.id }
  })
}

const handleEditClick = (item: ImageItem) => {
  if (!canEdit(item)) return
  editDrawerRef.value?.openDrawer({ id: item.id }, 'edit')
}
const handleCollectionEditClick = (item: ImageItem) => {
  if (!canEditCollection(item)) return
  editDrawerRef.value?.openDrawer({ id: item.id }, 'editCollection')
}

const handleBatchDelete = async () => {
  if (!selectionCount.value) return
  try {
    await message.confirm(`确定要删除选中的 ${selectionCount.value} 项吗？`)
    await deleteHighQualityCollection({ idList: selectedItems.value.map((item) => item.id) })
    message.success(`删除${selectionCount.value}项成功`)
    onSearch()
  } catch (error) {
    // 用户取消操作，无需处理
  }
}

const handleBatchClassify = () => {
  if (!selectionCount.value) return
  const items = selectedItems.value
  collectionDialogRef.value?.open({
    title: `批量分类（${items.length}项）`,
    ids: items.map((item) => item.id),
    url: items[0]?.imageUrl || ''
  })
}

const handleBatchClassifyConfirm = () => {
  onSearch()
}

const handleDetailConfirm = (payload: any) => {
  console.log('单图信息提交参数:', payload)
  message.success('主图信息已保存')
}
// --- 列表选择逻辑 End ---

const onSearch = async () => {
  loading.value = true
  const requestParams = setParamsData() as HighQualityPageParams
  if (searchData.value.unfilled.length) {
    requestParams.planFlag = searchData.value.unfilled.includes('planFlag') ? '1' : ''
    requestParams.shootFlag = searchData.value.unfilled.includes('shootFlag') ? '1' : ''
    requestParams.stillFlag = searchData.value.unfilled.includes('stillFlag') ? '1' : ''
    requestParams.retouchFlag = searchData.value.unfilled.includes('retouchFlag') ? '1' : ''
  }
  if (import.meta.env.DEV) {
    console.log('优质主图查询参数：', requestParams)
  }
  try {
    request.post({
      url: '/api/pictureHighQualityMasterImageCollection/getNotFillCount',
      data: requestParams
    }).then((res: any) => {
      statistics.value = res || {}
    })
    const res = await fetchHighQualityCollectionPage(requestParams)
    const records = Array.isArray(res?.records) ? res.records : []
    dataList.value = records.map((record) => mapRecordToItem(record))
    page.value.total = res?.total ?? 0
    page.value.size = res?.size ?? requestParams.size
    page.value.page = res?.current ?? requestParams.page
  } catch (error) {
    dataList.value = []
    page.value.total = 0
    message.error('优质主图列表加载失败')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  page.value = { ...new PageItem(), size: 10, total: 0 }
  searchData.value = { ...new SearchForm() }
  filterState.value = createDefaultFilterState()
  onSearch()
}

const setParamsData = (noPage = false) => {
  const base = paramsPreview.value
  if (noPage) return { ...base }
  return { ...base, page: page.value.page, size: page.value.size }
}
const onButtonClick = () => {}
const viewDetails = () => {}
const handleFilterChange = (_key?: string, _value?: any) => {
  page.value.page = 1
  onSearch()
}

function handleAdd() {
  editDrawerRef.value?.openDrawer({}, 'add')
}

function handleAddSuccess() {
  onSearch()
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

onMounted(async () => {
  try {
    getPermissionInfo(async () => {
      // console.log(permissionList.value)
      hasPermission.value = grabCheck('优质主图收藏')
    })
    await fetchDicts()
  } catch (error) {
    console.error('加载筛选字典失败', error)
  } finally {
    await onSearch()
  }
})

onActivated(() => {
  onSearch()
})

// onDeactivated(() => {
//   onSearch()
// })
</script>

<style scoped lang="scss">
.hq-main-image-library {
  :deep(.el-card__body .flux-body){
    overflow: unset !important;
  }
}
.list-container {
  background-color: #fff;
  border-radius: 8px;
  padding: 8px 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden; // 防止撑开外层
}

/* 操作栏样式 */
.list-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-shrink: 0;

  .left-action {
    display: flex;
    align-items: center;
    gap: 12px;

    .selected-count {
      color: #666;
      font-size: 14px;
    }
  }

  .right-action {
    display: flex;
    gap: 8px;
  }
}

/* 网格布局 */
.image-grid {
  display: grid;
  // 响应式 Grid：最小宽度 260px，自动填充
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  overflow-y: auto;
  flex: 1;
  padding-bottom: 16px;
}

/* 卡片样式 */
.image-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s;
  cursor: pointer;
  position: relative;
  background: #fff;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #dcdfe6;
  }

  // 选中态样式
  &.is-selected {
    border-color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
  }

  .card-image-wrapper {
    position: relative;
    height: 0;
    padding-bottom: 100%; // 1:1 正方形图片
    background: #f5f7fa;

    .card-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    // 与 gallery.vue 的“保存/更多”蒙层风格保持一致：渐变 mask + 底部操作区
    .more-mask.edit-mask {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%);
      backdrop-filter: blur(0px);
      display: none; // 默认隐藏，通过父级 hover 显示
      align-items: flex-end;
      justify-content: flex-end;
      z-index: 3;
      // 关键：蒙层不应拦截整卡点击/checkbox 点击，仅底部操作按钮可点击
      pointer-events: none;
    }

    .more-panel {
      width: 100%;
      height: 100%;
      padding: 0 12px 10px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: flex-end;
      // 让点击穿透到卡片；由 .more-list 接管交互
      pointer-events: none;
    }

    .more-list {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;
      margin: 0;
      padding: 0;
      list-style: none;
      // 底部按钮需要可点击
      pointer-events: auto;

      li {
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
    }

    .card-checkbox {
      position: absolute;
      top: 8px;
      right: 8px;
      // 关键：checkbox 需要始终在蒙层之上可点击
      z-index: 4;
      // background: rgba(255, 255, 255, 0.9);
      // border-radius: 4px;
      // padding: 2px 4px;
      display: flex; /* 确保 checkbox 居中 */
      :deep(.el-checkbox) {
        margin: 0;
        .el-checkbox__input {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .el-checkbox__inner {
          width: 24px;
          height: 24px;
          border-radius: 4px;
          // background-color: transparent;
          // border: none;
        }
        .el-checkbox__inner::after {
          left: 8px;
          top: 10px;
          width: 6px;
          height: 12px;
          border-width: 2px;
          // border-color: #fff;
          transform: translateY(-50%) rotate(45deg);
        }
        .el-checkbox__input.is-checked .el-checkbox__inner {
          background-color: var(--el-color-primary);
          border: none;
        }
        &.is-disabled {
          .el-checkbox__inner::after {
            display: none;
          }
        }
      }
    }
  }

  &:hover {
    .card-image-wrapper {
      .more-mask.edit-mask {
        display: flex;
        animation: fadeIn 0.2s ease-in-out;
      }
    }
  }

  .card-content {
    padding: 6px 10px;
    font-size: 12px;
    background-color: #f6f9fd;
  }

  .card-id {
    font-size: 18px;
    font-weight: 500;
    color: #333;
    margin-bottom: 8px;
    min-height: 27px;
  }

  .card-tags {
    // display: flex;
    // flex-wrap: wrap;
    // gap: 6px;
    margin-bottom: 10px;
    min-height: 23px;

    .tag-item {
      background: #e7eaf1;
      color: #333333;
      font-size: 12px;
      padding: 6px 12px;
      border-radius: 4px;
    }
  }

  .card-reason {
    color: #333;
    background-color: #fff;
    line-height: 1.4;
    margin-bottom: 12px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2; // 最多显示2行
    line-clamp: 2;
    overflow: hidden;
    height: 34px; // 固定高度防止抖动
    padding: 6px 10px;
    .reason-label {
      color: #727e93;
    }
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #666;

    .user-info {
      display: flex;
      align-items: center;
      gap: 6px;

      .username {
        color: #333;
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 分页样式 */
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #eee;
  flex-shrink: 0;

  .total-text {
    color: #606266;
    font-size: 13px;
    margin-right: 16px;
  }
}

:deep(.filter-card) {
  // padding-bottom: 16px;
  // border-bottom: 1px solid #f0f0f0;
}
.g-query-divider {
  margin: 10px 0;
  .el-button :hover {
    color: var(--el-color-primary);
  }
}
</style>
