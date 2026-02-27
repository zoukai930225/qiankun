<template>
  <ex-screen>
    <div class="collection-page">
      <div class="collection-header">
        <el-tabs v-model="activeTab" class="collection-tabs" >
          <el-tab-pane label="个人收藏" name="1" />
          <el-tab-pane label="公共收藏" name="2" />
        </el-tabs>
      </div>
      <!-- <advance :height="cardHeight" ref="advanceRef">
        
      </advance> -->
      <div  v-show="activePage === '1'" class="pl20px pr20px">
          <div class="content-bar">
            <section-title-header
              :hasDot="false"
              :title="activeTab === '1' ? '个人收藏列表' : '公共收藏列表'"
            >
              <template #right>
                <el-button type="primary" @click="handleCreate('')">新建收藏夹</el-button>
              </template>
            </section-title-header>
          </div>
          <div class="collection-content" v-loading="loading">
            <!-- <el-scrollbar class="scrollbar" ref="scrollbarRef" height="calc(100vh - 260px)">
              
            </el-scrollbar> -->
            <div class="folder-grid" v-if="list.length">
              <div
                v-for="item in list"
                :key="item.id"
                class="folder-card"
                @click="handleViewDetail(item)"
              >
                <div class="card-preview">
                  <div class="main-img-box">
                    <el-image
                      v-if="item.images && item.images[0]"
                      :src="item.images[0]"
                      fit="cover"
                      class="img-cover"
                    />
                    <div v-else class="empty-block main"></div>
                  </div>

                  <div class="sub-imgs-row">
                    <div v-for="i in 3" :key="i" class="sub-img-box">
                      <el-image
                        v-if="item.images && item.images[i]"
                        :src="item.images[i]"
                        fit="cover"
                        class="img-cover"
                      />
                      <div v-else class="empty-block"></div>
                    </div>
                  </div>

                  <div class="more-action-trigger" :class="{ 'is-active': item.isMenuOpen }">
                    <el-popover
                      placement="bottom-end"
                      trigger="click"
                      :width="120"
                      popper-class="folder-action-popover"
                      @show="item.isMenuOpen = true"
                      @hide="item.isMenuOpen = false"
                    >
                      <template #reference>
                        <div class="more-btn" @click.stop>
                          <el-icon><MoreFilled /></el-icon>
                        </div>
                      </template>

                      <div class="action-menu">
                        <div class="action-item" @click="handleRename(item)">重命名收藏夹</div>
                        <div
                          v-if="hasDeletePermission || activeTab === '1'"
                          class="action-item delete"
                          @click="handleDelete(item)"
                          >删除</div
                        >
                      </div>
                    </el-popover>
                  </div>
                </div>

                <div class="card-info">
                  <div class="folder-name">
                    <overflow-tooltip :content="item.name" />
                  </div>
                  <div class="folder-meta">
                    <span>全部图片内容</span>
                    <span class="count">{{ item.count }}</span>
                  </div>
                </div>
              </div>
            </div>
            <SEmpty v-if="!loading && list.length === 0" description="暂无收藏夹" />
          </div>
        </div>
        <div v-show="activePage === '2'" >
          <FavoritesDetail ref="detailRef" 
            :folder-data="currentFolder" 
            :favorites-type="activeTab" 
            @backFolder="handleBackFolder" 
            :hasPermission="hasDeletePermission"
            @handleRenameFolder="handleRename"
            @handleDeleteFolder="handleDelete"
            @handleCreateFolder="handleCreate"
          />
        </div>
      <CreateFavoritesDialog ref="createDialogRef" @success="fetchData" />
      <RenameDialog ref="renameDialogRef" @success="fetchData" />
    </div>
  </ex-screen>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { MoreFilled } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import RenameDialog from '../components/renameDialog.vue'
// 引入 delFavorites 接口
import { getFavoritesInfo, delFavorites } from '@/api/gallery'
import { useRole } from '@/hooks/common/useRole'
import { useRouter } from 'vue-router'
import SEmpty from '@/components/SWTable/src/empty.vue'
import CreateFavoritesDialog from '../components/createFavoritesDialog.vue'
import Advance from '@/components/common/advance/advance.vue'
import FavoritesDetail from './favoritesDetail.vue'

const router = useRouter()

// [Permission] 权限控制
const { getPermissionInfo, grabCheck } = useRole('视觉')
const hasDeletePermission = ref(false)

onMounted(() => {
  getPermissionInfo(() => {
    hasDeletePermission.value = grabCheck('图库车图管理员')
  })
})

const advanceRef = ref(),detailRef = ref(),activePage = ref('1')
const cardHeight = computed(() => {
  return `${window.innerHeight - 200}px`
})

// --- 类型定义 ---
interface FolderItem {
  id: string
  name: string
  images: string[]
  count: number | string
  type: '1' | '2'
  isMenuOpen?: boolean
  allGoodsId?: string[]
  personalGoodsId?: string[]
}

interface ApiFavoriteItem {
  favoritesId: string
  favoritesName: string
  goodsId: string[] | null
  imageUrls: string[] | null
  favoritesContentNum?: number | string
}

// --- 状态 ---
const activeTab = ref<'1' | '2'>('1')
const loading = ref(false)
const list = ref<FolderItem[]>([])
const renameDialogRef = ref()
const createDialogRef = ref<InstanceType<typeof CreateFavoritesDialog> | null>(null)
const currentFolder = ref<FolderItem | null>(null) // 当前选中的收藏夹
// --- 方法 ---

const fetchData = async () => {
  loading.value = true
  try {
    if(currentFolder.value?.id){
      detailRef.value?.handleClickFolder(currentFolder.value)
    }
    const res = (await getFavoritesInfo({
      favoritesType: activeTab.value
    })) as unknown as ApiFavoriteItem[]

    list.value = (res || []).map((item) => ({
      ...item,
      id: item.favoritesId,
      name: item.favoritesName,
      images: item.imageUrls || [],
      count: item.favoritesContentNum || 0,
      type: activeTab.value,
      isMenuOpen: false
    }))
  } catch (error) {
    console.error('获取收藏夹列表失败:', error)
    list.value = []
  } finally {
    loading.value = false
  }
}

const handleCreate = (favoritesId?: string) => {
  createDialogRef.value?.open({
    favoritesType: activeTab.value,
    title: activeTab.value === '1' ? '个人收藏' : '公共收藏',
    favoritesId
  })
}

const handleRename = (item: FolderItem) => {
  item.isMenuOpen = false
  renameDialogRef.value?.open(item)
}

// 修改后的删除逻辑
const handleDelete = (item: FolderItem) => {
  item.isMenuOpen = false

  ElMessageBox.confirm('请确认是否删除该收藏夹？', '警告', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        loading.value = true // 简单的加载反馈
        // 调用删除接口
        await delFavorites({ favoritesId: item.id })
        ElMessage.success('删除成功')
        // 刷新列表
        fetchData()
      } catch (error) {
        console.error(error)
        loading.value = false
      }
    })
    .catch(() => {})
}

const handleViewDetail = (item: FolderItem) => {
  currentFolder.value = item
  // const allGoodsIdStr = Array.isArray(item.allGoodsId) ? item.allGoodsId.join(',') : ''
  // const personalGoodsIdStr = Array.isArray(item.personalGoodsId)
  //   ? item.personalGoodsId.join(',')
  //   : ''
  // router.push({
  //   path: '/admin/VD/gallery/favoritesDetail',
  //   query: {
  //     allGoodsId: allGoodsIdStr,
  //     personalGoodsId: personalGoodsIdStr,
  //     type: activeTab.value,
  //     id: item.id
  //   }
  // })
  // advanceRef.value?.next()
  activePage.value = '2'
}

// 处理返回收藏夹列表
const handleBackFolder = () => {
  currentFolder.value = null
  advanceRef.value?.prev()
  activePage.value = '1'
}

// onMounted(() => {
//   handleBackFolder()
//   fetchData()
// })
watch(
  activeTab,
  () => {
    handleBackFolder()
    fetchData()
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.collection-page {
  // padding: 20px;
  background-color: #fff;
  min-height: 100%;
}

.collection-tabs {
  margin-bottom: 20px;
  padding:0 20px;

  :deep(.el-tabs__header) {
    margin: 0;
    // border-bottom: none;
  }

  :deep(.el-tabs__nav-wrap::after) {
    // display: none;
    height: 1px;
    background-color: #f0f0f0;
  }

  :deep(.el-tabs__item) {
    // padding: 12px 0;
    font-size: 14px;
    color: #666;
    cursor: pointer;
  }
}

.content-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .section-title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    margin: 0;
  }
}

/* 网格布局 */
.folder-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

/* 卡片样式 */
.folder-card {
  background: #f6f9fd;

  /* 应用/边框 */
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
  position: relative;

  &:hover {
    // box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: var(--el-color-primary);
    // 鼠标悬停时显示按钮
    .more-action-trigger {
      opacity: 1;
    }
  }
}

.card-preview {
  padding: 12px;
  position: relative;
}

/* 图片布局 */
.main-img-box {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  margin-bottom: 4px;
}

.sub-imgs-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 4px;
}

.sub-img-box {
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  &:first-child {
    border-radius: 0 0 0 8px;
  }
  &:last-child {
    border-radius: 0 0 8px 0;
  }
}

.img-cover {
  width: 100%;
  height: 100%;
  display: block;
}

.empty-block {
  width: 100%;
  height: 100%;
  background-color: #e3e6ea;
}

/* 更多按钮 - 核心逻辑 */
.more-action-trigger {
  position: absolute;
  top: 18px;
  right: 18px;
  opacity: 0; // 默认隐藏
  transition: opacity 0.2s;
  z-index: 2;

  // 1. 当菜单打开时，强制显示 (opacity: 1)
  &.is-active {
    opacity: 1 !important;

    // 2. 当菜单打开时，保持背景为深色 (模拟 hover 状态)
    .more-btn {
      background: rgba(0, 0, 0, 0.7);
    }
  }

  .more-btn {
    width: 28px;
    height: 28px;
    background: rgba(0, 0, 0, 0.5); // 默认半透明黑
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: rgba(0, 0, 0, 0.7); // 悬停深黑
    }
  }
}

/* 底部文字信息 */
.card-info {
  padding: 12px;
  border-top: 1px solid #f5f7fa;

  .folder-name {
    font-size: 18px;
    color: #333;
    font-weight: 500;
    margin-bottom: 10px;
  }

  .folder-meta {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #727e93;
  }
}

/* 菜单样式覆盖 */
:global(.folder-action-popover) {
  padding: 4px 0 !important;
  min-width: 100px !important;
}

.action-menu {
  .action-item {
    padding: 8px 16px;
    font-size: 13px;
    color: #333;
    cursor: pointer;

    &:hover {
      background-color: #f5f7fa;
    }

    &.delete {
      color: #ff4d4f;
    }
  }
}
</style>
