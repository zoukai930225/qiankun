<template>
  <SchemeDialog ref="schemeDialogRef" name="Folder" :width="424">
    <template #header="{ close }">
      <div class="custom-header">
        <div v-if="viewState === 'list'" class="header-title">{{ favoritesTitle }}</div>

        <div v-else class="header-title back-mode">
          <el-icon class="back-icon" @click="handleBack"><ArrowLeft /></el-icon>
          <span>新建收藏夹</span>
        </div>

        <el-icon @click="close" class="header-close">
          <CloseBold />
        </el-icon>
      </div>
    </template>

    <template #card>
      <div class="tree-filter-container" v-if="viewState === 'list'">
        <el-input
          v-model="filterText"
          class="tree-filter"
          placeholder="请输入"
          clearable
          prefix-icon="Search"
        />
      </div>
      
      <el-scrollbar v-if="viewState === 'list'" max-height="300px">
        <div class="list-container" v-loading="listAreaLoading">
          <template v-if="favoritesFolderList.length">
            <div class="folder-list">
              <el-tree
                ref="treeRef"
                :data="favoritesFolderList"
                node-key="favoritesId"
                :expand-on-click-node="false"
                :props="treeProps"
                :filter-node-method="filterNode"
                style="max-width: 394px;"
                :default-expanded-keys="defaultExpandedKeys"
              >
                <template #default="{ node, data }">
                  <div class="folder-main" @click="handleFolderClick(data)" @mouseenter="data.showPlusIcon = true" @mouseleave="data.showPlusIcon = false">
                    <img v-if="node.level === 1" :src="node.expanded ? FolderAddIconUrl : FoldIconUrl" class="icon-folder" />
                    <img v-else :src="SubFoldIconUrl" class="icon-folder" />
                    <div class="folder-info">
                      <overflow-tooltip :content="data.favoritesName">
                        {{ data.favoritesName }}
                      </overflow-tooltip>
                    </div>
                    <img :src="data.plusIconActive ? folderPlusActiveSvg : folderPlusSvg" 
                      @mouseenter="data.plusIconActive = true"
                      @mouseleave="data.plusIconActive = false"
                      class="icon-folder-plus" 
                      v-show="data.showPlusIcon"
                     @click.stop="toCreateMode(data.favoritesId)"/>
                  </div>
                </template>
              </el-tree>
              <!-- <div
                v-for="item in folderList"
                :key="item.uid"
                class="folder-item"
                @click="handleFolderClick(item)"
              >
                <div class="folder-main">
                  <img :src="FoldIcon" class="icon-folder" />
                  <div class="folder-info">
                    <overflow-tooltip :content="item.name">
                      <span class="folder-name">{{ item.name }}</span>
                    </overflow-tooltip>
                  </div>
                </div>
              </div> -->
            </div>
          </template>
          <el-empty v-else class="folder-empty" description="暂无收藏夹" :image-size="120" />
        </div>
      </el-scrollbar>

      <div v-else class="create-container">
        <el-form ref="formRef" :model="formData" :rules="rules">
          <el-form-item label="收藏夹名称" prop="name">
            <el-input
              maxlength="100"
              v-model="formData.name"
              placeholder="请输入收藏夹名称"
              clearable
            />
          </el-form-item>
        </el-form>
      </div>
    </template>

    <template #button>
      <div
        v-if="viewState === 'list'"
        class="create-trigger"
        :class="{ disabled: listAreaLoading }"
        @click="toCreateMode('')"
      >
        <!-- <img :src="FolderAddIcon" class="icon-folder" /> -->

        <span class="text-blue-color">+ 新建收藏夹</span>
      </div>
      <template v-if="viewState === 'create'">
        <el-button @click="handleBack">取消</el-button>
        <el-button type="primary" @click="confirmCreate" :loading="createLoading"> 确定 </el-button>
      </template>
    </template>
  </SchemeDialog>
</template>

<script setup lang="ts">
import { ref, provide, computed } from 'vue'
import { ArrowLeft, CloseBold } from '@element-plus/icons-vue'
import FoldIconUrl from '@/assets/svgs/gallery/folder.svg'
import FolderAddIconUrl from '@/assets/svgs/gallery/folder_active.svg'
import SubFoldIconUrl from '@/assets/svgs/gallery/subFolder.svg'
import folderPlusSvg from '@/assets/svgs/gallery/folder_plus.svg'
import folderPlusActiveSvg from '@/assets/svgs/gallery/folder_plus_active.svg'
import { getFavoritesInfo, addFavorites, addCollect } from '@/api/gallery'
import request from '@/config/axios';
import { useMessage } from '@/hooks/web/useMessage'
import type { FormInstance, FormRules, TreeInstance } from 'element-plus'

const message = useMessage()

type FavoritesType = '1' | '2'

const emit = defineEmits(['collectSuccess', 'createSuccess'])

interface FavoritesResponseItem {
  favoritesId?: string
  favoritesName?: string
  goodsId?: string[]
  goodsIds?: string[]
  imageUrls?: string[]
}

interface FolderItem {
  uid: string
  favoritesId: string
  name: string
  imageUrls: string[]
  goodsCount: number
}

interface FavoritesFolderItem {
  favoritesId?: string
  favoritesName?: string
  childFavorites?: FavoritesFolderItem[]
  goodsId?: string[]
  goodsIds?: string[]
  imageUrls?: string[]
}

interface OpenPayload {
  favoritesType: FavoritesType
  goodsIds?: string[]
  goodsId?: string | string[]
  title?: string
}

const treeProps = {
  label: 'favoritesName',
  children: 'childFavorites',
}

// Type-safe SVG imports
const FoldIcon: string = FoldIconUrl
const FolderAddIcon: string = FolderAddIconUrl

// --- 状态管理 ---
const schemeDialogRef = ref()
const filterText = ref('')
const treeRef = ref<TreeInstance>()
const viewState = ref<'list' | 'create'>('list')
const currentFavoritesType = ref<FavoritesType>('2')
const folderList = ref<FolderItem[]>([])
const favoritesFolderList = ref<FavoritesFolderItem[]>([])
const defaultExpandedKeys = ref<string[]>([])
const listLoading = ref(false)
const collecting = ref(false)
const createLoading = ref(false)
const goodsIds = ref<string[]>([])
const listTitleOverride = ref('')
const formRef = ref<FormInstance>()
const formData = ref({
  name: '',
  pId: null
})
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入收藏夹名称', trigger: 'blur' }]
})

const favoritesTitle = computed(
  () => listTitleOverride.value || (currentFavoritesType.value === '1' ? '个人收藏' : '公共收藏')
)
const listAreaLoading = computed(() => listLoading.value || collecting.value)

watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

const filterNode:any = (value: string, data: FavoritesFolderItem) => {
  if (!value) return true
  return data.favoritesName?.includes(value)
}
// --- 构造 provide 数据供 windows.vue 使用 ---
// windows.vue 需要: dataValue, bukValue, viewType, title, loading
const detailsState = {
  dataValue: ref({}),
  bukValue: ref({}),
  viewType: ref('edit'),
  title: ref('公共收藏'),
  loading: ref(false)
}

// 注入依赖，key 为 props.name + 'Details' => 'FolderDetails'
provide('FolderDetails', detailsState)

const handleOpen = () => {
  schemeDialogRef.value?.openDialog?.()
  fetchFavorites()
}

// --- 交互逻辑 ---

const buildFolderList = (rows: FavoritesResponseItem[] = []): FolderItem[] => {
  return rows.map((item, index) => {
    const goods = Array.isArray(item.goodsIds)
      ? item.goodsIds
      : Array.isArray(item.goodsId)
        ? item.goodsId
        : []
    const imageUrls = Array.isArray(item.imageUrls) ? item.imageUrls.slice(0, 3) : []
    const favoritesId = item.favoritesId ?? ''
    const uid = favoritesId || `folder-${index}`
    return {
      uid,
      favoritesId,
      name: item.favoritesName?.trim() || `未命名收藏夹${index + 1}`,
      imageUrls,
      goodsCount: goods.length
    }
  })
}

// 处理树形数据，确保每个节点都有 favoritesId
const processTree = (tree: FavoritesFolderItem[]): FavoritesFolderItem[] => {
  return tree.map(item => ({
    ...item,
    favoritesId: item.favoritesId || '',
    childFavorites: item.childFavorites && item.childFavorites.length > 0 ? processTree(item.childFavorites) : undefined,
    isLeaf: !item.childFavorites || item.childFavorites.length === 0,
    showPlusIcon: false
  }))
}

const fetchFavorites = async () => {
  listLoading.value = true
  folderList.value = []
  favoritesFolderList.value = []
  request.get({ url: `/api/pictureCollect/getFavoritesTree`, params: { favoritesType: currentFavoritesType.value } }).then((res: any) => {
    // 处理数据，确保树形结构正确
    favoritesFolderList.value = Array.isArray(res) ? processTree(res) : []
    
  }).finally(() => {
    listLoading.value = false
  })
  // try {
  //   const res = await getFavoritesInfo({ favoritesType: currentFavoritesType.value }).catch(
  //     () => []
  //   )
  //   const list = Array.isArray(res) ? res : []
  //   folderList.value = buildFolderList(list)
  // } catch (error) {
  //   folderList.value = []
  //   console.error('getFavoritesInfo error:', error)
  // } finally {
  //   listLoading.value = false
  // }
}

const normalizeGoodsIds = (payload: OpenPayload) => {
  const set = new Set<string>()
  const append = (input?: string | string[]) => {
    if (!input) return
    if (Array.isArray(input)) {
      input.forEach((id) => {
        if (typeof id === 'string' && id.trim()) {
          set.add(id.trim())
        }
      })
      return
    }
    if (typeof input === 'string' && input.trim()) {
      set.add(input.trim())
    }
  }
  append(payload.goodsIds)
  append(payload.goodsId)
  return Array.from(set)
}

const open = (payload: OpenPayload) => {
  if (!payload?.favoritesType) {
    message?.warning?.('缺少收藏夹类型')
    return
  }
  currentFavoritesType.value = payload.favoritesType
  listTitleOverride.value = payload.title ?? ''
  goodsIds.value = normalizeGoodsIds(payload)
  viewState.value = 'list'
  detailsState.viewType.value = 'edit'
  filterText.value = ''
  defaultExpandedKeys.value = []
  fetchFavorites()
  schemeDialogRef.value?.openDialog?.()
}

// 切换到新建模式
const toCreateMode = (pId?: any) => {
  if (listAreaLoading.value) return
  defaultExpandedKeys.value  = [pId || ''] 
  formData.value.name = ''
  formData.value.pId = pId || undefined
  viewState.value = 'create'
  detailsState.viewType.value = 'edit' // 切换状态以显示 Footer
}

// 返回列表模式
const handleBack = () => {
  viewState.value = 'list'
  formData.value.name = ''
  detailsState.viewType.value = 'edit'
  filterText.value = ''
}

// 确认创建
const confirmCreate = async () => {
  if (!formRef.value) return
  await formRef.value.validate()
  createLoading.value = true
  try {
    await addFavorites({
      favoritesName: formData.value.name,
      favoritesType: currentFavoritesType.value,
      pId: formData.value.pId
    })
    message?.success?.('新建收藏夹成功')
    await fetchFavorites()
    handleBack()
    emit('createSuccess')
  } catch (error) {
    console.error('addFavorites error:', error)
  } finally {
    createLoading.value = false
  }
}

const handleFolderClick = async (folder: FavoritesFolderItem) => {
  if (listAreaLoading.value) return
  if (!goodsIds.value.length) {
    message?.warning?.('请先选择需要收藏的商品')
    return
  }
  if (!folder.favoritesId) {
    message?.error?.('收藏夹信息缺失，无法收藏')
    return
  }
  try {
    await message.confirm(`请确认是否将数据收藏在【${folder.favoritesName}】收藏夹中`)
  } catch {
    return
  }
  collecting.value = true
  try {
    await addCollect({
      goodsIds: goodsIds.value,
      favoritesType: currentFavoritesType.value,
      favoritesId: folder.favoritesId
    })
    message?.success?.('收藏成功')
    emit('collectSuccess')
    schemeDialogRef.value?.close?.()
  } catch (error) {
    console.error('addCollect error:', error)
  } finally {
    collecting.value = false
  }
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
/* 样式适配 */

/* 自定义 Header 样式 */
.custom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* windows.vue 原有 header padding 是 12px 20px，slot 会替换内容，需要自己处理布局 */
  /* 由于 slot 在 el-dialog header 内，外层可能有 padding，视实际渲染调整 */
}

.header-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
}

.back-mode .back-icon {
  cursor: pointer;
  margin-right: 8px;
  font-size: 18px;
  &:hover {
    color: #409eff;
  }
}

.header-close {
  cursor: pointer;
  position: absolute; /* 保持与 windows.vue 原有样式一致的位置 */
  right: 20px;
  top: 12px;
  font-size: 16px;
  color: #909399;
  &:hover {
    color: #333;
  }
}
.tree-filter-container{
  width: 100%;
  margin-top: 10px;
  margin-bottom: 6px;
  padding: 0 15px;
  text-align: center;
  box-sizing: border-box;
  .tree-filter{
    // width: calc(100% - 30px);
  }
}

.list-container {
  padding: 5px 0;
  min-height: 200px;
}

/* 列表样式 */
.folder-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 15px 10px;
  overflow: hidden auto;
}

.folder-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 12px;
  cursor: pointer;
  border-radius: 8px;
  border: 1px solid transparent;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
  &:hover {
    background-color: #f8f8f9;
    border-color: #eef0f4;
  }
}

.folder-main {
  display: flex;
  align-items: center;
  width: 94%;
  justify-content: flex-start;
}
:deep(){
  --el-tree-node-content-height:34px
}
.icon-folder-plus{
  // margin-right: 0;
  // margin-left: auto;
}

.folder-info {
  // flex: 1;
  // display: flex;
  // flex-direction: column;
  // min-width: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 83%;
}

.folder-name {
  font-size: 14px;
  color: #303133;
  // font-weight: 500;
}

.folder-count {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.folder-preview {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  width: 100%;
}

.preview-img {
  width: 74px;
  height: 74px;
  border-radius: 6px;
  object-fit: cover;
  background-color: #f3f4f8;
}

.folder-empty {
  padding: 40px 0;
}

.create-trigger {
  // display: flex;
  // align-items: center;
  text-align: center;
  padding: 8px 8px;
  cursor: pointer;
  border-radius: 6px;
  transition: color 0.2s;
  font-size: 16px;
  .text-blue {
    font-size: 14px;
  }
  &:hover {
    color: #409eff;
  }
  &.disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}

/* 新建页面样式 */
.create-container {
  padding: 20px; /* 给 Input 一些上下间距 */
}

.icon-folder {
  margin-right: 12px;
}

.text-blue-color {
  color: var(--el-color-primary);
}

.page-details :deep(.el-dialog__body) {
  padding: 0 !important;
}

:deep(){
  --el-tree-node-hover-bg-color:#F7FBFF;
}
</style>
