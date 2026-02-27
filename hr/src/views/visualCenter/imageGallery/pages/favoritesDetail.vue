<template>
  <div class="favorites-detail-page">
    <div class="detail-header">
      <!-- <span v-if="isPersonalCollection" class="title"> 个人收藏 </span>

      <div v-else class="public-tabs-wrapper">
        <el-tabs v-model="activeTab" @tab-change="handleTabChange">
          <el-tab-pane label="公共收藏（全部）" name="all" />
          <el-tab-pane label="公共收藏（我的）" name="mine" />
        </el-tabs>
      </div> -->
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item class="breadcrumb-item">
          <div @click="handleBackFolder" class="breadcrumb-item-text"><overflow-tooltip :content="isPersonalCollection ? '个人收藏' : '公共收藏'">{{ isPersonalCollection ? '个人收藏' : '公共收藏' }}</overflow-tooltip></div>
        </el-breadcrumb-item>
        <el-breadcrumb-item class="breadcrumb-item" v-for="(item,index) in favoriteList" :key="item.favoritesId" @click="handleClickFolder(item,index)">
          <div class="breadcrumb-item-text" :class="{'active': item.favoritesId === currentFolder.favoritesId}">
            <overflow-tooltip :content="item.favoritesName" >
              {{ item.favoritesName }}
            </overflow-tooltip>
          </div>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <div class="folder-list">
      <el-scrollbar ref="scrollbarRef">
        <div class="card-scrollbar" >
          <div class="card" v-for="item in folderList" :key="item.favoritesId" @click.stop.prevent="handleClickFolder(item)">
            <img :src="folderSubSvg" alt="" class="folder-icon" />
            <div class="folder-name">
              <div class="folder-name-text">
                <overflow-tooltip :content="item.favoritesName">{{ item.favoritesName }}</overflow-tooltip>
              </div>
              <div class="folder-name-count">全部图片内容 {{ item.favoritesContentNum }}</div>
            </div>
            <el-popover placement="bottom-end" trigger="hover" :width="100">
              <template #reference>
                <img :src="item.moreBtnShow? moreBtn_activeSvg : moreBtnSvg" alt="" class="more-btn" @mouseenter="item.moreBtnShow = true" @mouseleave="item.moreBtnShow = false"/>
              </template>
              <div class="dropdown-menu">
                <el-button type="primary" link class="dropdown-item" @click="handleRename(item)">重命名收藏夹</el-button>
                <el-button type="danger" link class="dropdown-item" @click="handleDelete(item)">删除</el-button>
              </div>
            </el-popover>
          </div>
          <div class="card plus" @click="handleCreate">
            <img :src="plusFolder" alt="" class="plus-icon" />
            <div class="plus-text">新建收藏夹</div>
          </div>
        </div>
      </el-scrollbar>
      
      <!-- 按钮 -->
      <div class="left roundBtn" @click="handleScroll('left')">
        <el-icon><ArrowLeft /></el-icon>
      </div>
      <div class="right roundBtn" @click="handleScroll('right')">
        <el-icon><ArrowRight /></el-icon>
      </div>
    </div>
    
    <div>
      <!-- <div v-if="isPersonalCollection" class="public-tabs-wrapper"> 
        <el-tabs>
          <el-tab-pane label="个人收藏"  />
        </el-tabs> 
        <el-radio-group v-model="activeTabName">
          <el-radio-button label="个人收藏" value="all"/>
        </el-radio-group>
      </div> -->

      <div v-if="!isPersonalCollection"  class="public-tabs-wrapper">
        <el-radio-group @change="handleTabChange" v-model="activeTab">
          <el-radio-button label="全部" value="all" />
          <el-radio-button label="我的" value="mine" />
        </el-radio-group>
        <!-- <el-tabs v-model="activeTab" @tab-change="handleTabChange">
          <el-tab-pane label="公共收藏（全部）" name="all" />
          <el-tab-pane label="公共收藏（我的）" name="mine" />
        </el-tabs> -->
      </div>
    </div>

    <div class="batch-bar" v-if="total > 0 && !loading">
      <div class="batch-left">
        <el-checkbox
          v-model="isAllSelected"
          :indeterminate="isIndeterminate"
          @change="handleSelectAll"
          :disabled="loading"
        >
          全选
        </el-checkbox>
        <el-divider direction="vertical" />
        <span class="selected-count"> 已选({{ checkedGoodsIds.length }}) </span>
      </div>
      <div class="batch-right">
        <el-button
          type="primary"
          plain
          :disabled="checkedGoodsIds.length === 0"
          @click="handleBatchCopy"
        >
          {{ isPersonalCollection ? '批量复制到公共收藏' : '批量复制到个人收藏' }}
        </el-button>

        <el-button
          v-if="canShowCancelBtn"
          type="primary"
          @click="handleBatchCancel"
          :disabled="checkedGoodsIds.length === 0"
        >
          批量取消
        </el-button>
      </div>
    </div>

    <div class="list-container" v-loading="loading">
      <!-- <el-scrollbar height="calc(100vh - 430px)" v-if="list.length">
        
      </el-scrollbar> -->
      <GalleryList
      v-if="list.length"
          ref="galleryListRef"
          :list="list"
          :total="total"
          @getList="handlePageChange"
          @edit-remark="handleEditRemark"
          :favorite="favorite"
          baseWidth="250px"
        />
      
      <SEmpty v-if="!loading && list.length === 0" description="暂无数据" />
    </div>

    <CollectionDialog
      ref="collectionDialogRef"
      @collectSuccess="handleCollectSuccess"
      @createSuccess="handleCreateSuccess"
    />
    <RemarkDialog ref="remarkDialogRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, provide, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import GalleryList from '@/views/web/visualGallery/components/galleryList.vue'
import CollectionDialog from '../components/collectionDialog.vue'
import RemarkDialog from '../components/remarkDialog.vue'
import { getHomePage, cancelCollect ,getFavoritesInfo, delFavorites } from '@/api/gallery'
import SEmpty from '@/components/SWTable/src/empty.vue'
import folderSubSvg from '@/assets/svgs/gallery/folder_sub.svg'
import moreBtnSvg from '@/assets/svgs/gallery/moreBtn.svg'
import moreBtn_activeSvg from '@/assets/svgs/gallery/moreBtn_active.svg'
import plusFolder from '@/assets/svgs/gallery/plus_Folder.svg'
const props = defineProps<{
  folderData: any
  favoritesType: string
  hasPermission: boolean
}>()
const currentFolder = ref<any>(),scrollbarRef = ref()
// 监听 folderData 变化
watch(() => props.folderData, (newVal) => {
  if (newVal) {
    currentFolder.value = newVal
    favoriteList.value = []
    handleClickFolder(newVal)
  }else{
    handleBackFolder()
  }
},{ deep: true })
const emit = defineEmits(['backFolder','handleRenameFolder','handleDeleteFolder','handleCreateFolder'])
const handleBackFolder = () => {
  emit('backFolder')
}
const handleRename = (item: any) => {
  emit('handleRenameFolder', item)
}
const handleDelete = (item: any) => {
  emit('handleDeleteFolder', item)
}
const handleCreate = () => {
  emit('handleCreateFolder', currentFolder.value.favoritesId)
}

const favoriteList = ref<any[]>([])
const handleClickFolder = (item: any,index?:number)=>{
  currentFolder.value = item
  // 点击面包屑 如果点击的当前文件夹打开了下层文件夹 则关闭下层文件夹
  if(Number(index) < (favoriteList.value.length - 1) ){
    favoriteList.value = favoriteList.value.slice(0, Number(index) + 1)
  }

  if(favoriteList.value.findIndex((item: any) => item.favoritesId === currentFolder.value.favoritesId) === -1){
    favoriteList.value.push(item)
  }
  fetchData()
  getFolderList()
}
defineExpose({
  handleClickFolder
})

// 文件夹列表
const folderList = ref<any[]>([])
const getFolderList = async () => {
  loading.value = true
  try {
    const res = await getFavoritesInfo({
      favoritesType: props.favoritesType as string,
      favoritesId: currentFolder.value?.favoritesId as string
    })
    folderList.value = (res[0].childFavoritesInfo || []).map((item) => ({
      ...item,
      id: item.favoritesId,
      name: item.favoritesName,
      images: item.imageUrls || [],
      count: item.favoritesContentNum || 0,
      type: props.favoritesType as string,
      isMenuOpen: false,
      pId:res[0]?.favoritesId || ''
    }))
  } catch (error) {
    message.error('获取文件夹列表失败')
  } finally {
    loading.value = false
  }
}

const handleScroll = (direction: string) => {
 if (!scrollbarRef.value) return
  
  const scrollbar = scrollbarRef.value.wrapRef
  const scrollAmount = 270
  
  if (direction === 'left') {
    scrollbar.scrollLeft -= scrollAmount
  } else {
    scrollbar.scrollLeft += scrollAmount
  }
}
const message = useMessage?.() as any

// 权限判断
const hasPermission = ref(props.hasPermission)

const route = useRoute()
const router = useRouter()

// --- 状态 ---
const loading = ref(false)
const list = ref<any[]>([])
const total = ref(0)
const checkedGoodsIds = ref<string[]>([])
const queryParams = ref({
  page: 1,
  size: 30
})
const collectionDialogRef = ref()
const remarkDialogRef = ref()

const favorite = computed(() => {
  return {
    type: props.favoritesType as string,
    favoritesId: currentFolder.value?.favoritesId as string
  }
})

// 【核心修改 1】：activeTab 初始化时优先从 URL 读取，没有则默认为 'all'
const activeTab = ref((route.query.tab as string) || 'all'),activeTabName = ref('all')

const isPersonalCollection = computed(() => {
  return props.favoritesType === '1'
})

// 控制批量取消按钮显示
const canShowCancelBtn = computed(() => {
  if (isPersonalCollection.value) return true
  // 公共收藏只有在 "我的" tab 下才显示
  return activeTab.value === 'mine' || hasPermission.value
})

// --- 依赖注入 ---
provide('isSync', true)
provide('isNotSync', false)
provide('currentGoodsId', '')

const toggleGoodsSelection = (goodsId: string, checked: boolean) => {
  if (checked) {
    if (!checkedGoodsIds.value.includes(goodsId)) {
      checkedGoodsIds.value.push(goodsId)
    }
  } else {
    checkedGoodsIds.value = checkedGoodsIds.value.filter((id) => id !== goodsId)
  }
}

provide('syncSelection', {
  checkedGoodsIds,
  toggleGoodsSelection,
  isGoodsSelected: (id: string) => checkedGoodsIds.value.includes(id)
})

// --- 全选逻辑 ---
const isAllSelected = computed({
  get: () => {
    if (list.value.length === 0) return false
    return list.value.every((item) => checkedGoodsIds.value.includes(item.goodsId))
  },
  set: (val) => {
    handleSelectAll(val)
  }
})

const isIndeterminate = computed({
  get: () => {
    if (list.value.length === 0) return false
    const currentIds = list.value.map((item) => item.goodsId)
    const selectedInCurrent = currentIds.filter((id) => checkedGoodsIds.value.includes(id))
    return selectedInCurrent.length > 0 && selectedInCurrent.length < currentIds.length
  },
  set: () => {}
})

const handleSelectAll = (val: boolean) => {
  const currentIds = list.value.map((item) => item.goodsId)
  if (val) {
    currentIds.forEach((id) => {
      if (!checkedGoodsIds.value.includes(id)) {
        checkedGoodsIds.value.push(id)
      }
    })
  } else {
    checkedGoodsIds.value = checkedGoodsIds.value.filter((id) => !currentIds.includes(id))
  }
}

// --- 数据获取 ---
const fetchData = async () => {
  // const allGoodsIdStr = route.query.allGoodsId as string
  // const personalGoodsIdStr = route.query.personalGoodsId as string

  let goodsIds: string[] = []

  if (isPersonalCollection.value) {
    goodsIds = Array.isArray(currentFolder.value?.allGoodsId) ? currentFolder.value.allGoodsId : []
  } else {
    if (activeTab.value === 'all') {
      goodsIds = Array.isArray(currentFolder.value?.allGoodsId) ? currentFolder.value.allGoodsId : []
    } else {
      goodsIds =  Array.isArray(currentFolder.value?.personalGoodsId) ? currentFolder.value.personalGoodsId : []
    }
  }

  if (!goodsIds.length) {
    list.value = []
    total.value = 0
    return
  }

  loading.value = true
  try {
    const params: any = {
      page: queryParams.value.page,
      size: queryParams.value.size,
      goodsIds
    }
    const res = await getHomePage(params)

    if (res) {
      list.value = res.records || []
      total.value = res.total || 0
    }
  } catch (error) {
    console.error('获取详情失败', error)
  } finally {
    loading.value = false
  }
}

// 【核心修改 2】：切换 Tab 时同步更新 URL 上的参数
const handleTabChange = (val: any) => {
  // 重置状态
  queryParams.value.page = 1
  total.value = 0
  checkedGoodsIds.value = []
  list.value = []
  fetchData()
}

const handlePageChange = (data: any = {}) => {
  queryParams.value.page = data.page || queryParams.value.page || 1
  queryParams.value.size = data.limit || data.size || queryParams.value.size
  fetchData()
}

// --- 业务操作 ---

// 批量复制转移
const handleBatchCopy = () => {
  if (!checkedGoodsIds.value.length) return
  const targetType = isPersonalCollection.value ? '2' : '1'
  const dialogTitle = isPersonalCollection.value ? '公共收藏' : '个人收藏'
  collectionDialogRef.value?.open({
    favoritesType: targetType,
    goodsIds: checkedGoodsIds.value,
    title: dialogTitle
  })
}

const handleCollectSuccess = () => {
  checkedGoodsIds.value = []
  fetchData()
}

const handleCreateSuccess = () => {
  // checkedGoodsIds.value = []
  // ElMessage.success('操作成功')
}

const handleEditRemark = (payload: any) => {
  const { item, favorite: favoriteInfo } = payload || {}
  if (!item?.goodsId) return
  remarkDialogRef.value?.open({
    goodsId: item.goodsId,
    favoritesId: favoriteInfo?.favoritesId || (route.query.id as string),
    imageUrl: item.imageUrl,
    goodsCode: item.goodsCode,
    channel: item.channel,
    lastUpdatePersonInfo: item.lastUpdatePersonInfo
  })
}

// 批量取消
const handleBatchCancel = () => {
  let typeText = '收藏'
  const currentType = isPersonalCollection.value ? '1' : '2'

  if (isPersonalCollection.value) {
    typeText = '个人收藏'
  } else {
    typeText = '公共收藏'
  }

  message
    .confirm(
      `确定要从【${typeText}】中移除选中的 ${checkedGoodsIds.value.length} 个收藏吗？`,
      '批量取消',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    .then(async () => {
      try {
        loading.value = true
        const currentFavoritesId = currentFolder.value?.favoritesId as string

        // 1. 调用后端接口
        await cancelCollect({
          goodsIds: checkedGoodsIds.value,
          favoritesType: currentType,
          favoritesId: currentFavoritesId
        })

        ElMessage.success('移除成功')

        currentFolder.value.allGoodsId = currentFolder.value?.allGoodsId?.filter((id) => !checkedGoodsIds.value.includes(id)) || []
        currentFolder.value.personalGoodsId = currentFolder.value?.personalGoodsId?.filter((id) => !checkedGoodsIds.value.includes(id)) || []
        fetchData()
        // --- 处理 URL 参数 ---

        // 2. 获取当前 URL 上的 ID 字符串
        const currentAllGoodsStr = (route.query.allGoodsId as string) || ''
        const currentPersonalGoodsStr = (route.query.personalGoodsId as string) || ''

        // 辅助函数：移除选中的 ID
        const filterIds = (sourceStr: string, idsToRemove: string[]) => {
          if (!sourceStr) return ''
          const arr = sourceStr.split(',')
          const newArr = arr.filter((id) => !idsToRemove.includes(id))
          return newArr.join(',')
        }

        // 3. 计算新的 ID 字符串
        const newAllGoodsStr = filterIds(currentAllGoodsStr, checkedGoodsIds.value)
        const newPersonalGoodsStr = filterIds(currentPersonalGoodsStr, checkedGoodsIds.value)

        // 4. 构造新的 Query 对象
        const newQuery: any = { ...route.query }

        if (newAllGoodsStr) {
          newQuery.allGoodsId = newAllGoodsStr
        } else {
          delete newQuery.allGoodsId
        }

        if (newPersonalGoodsStr) {
          newQuery.personalGoodsId = newPersonalGoodsStr
        } else {
          delete newQuery.personalGoodsId
        }

        // 确保 newQuery 中包含当前的 tab 状态
        newQuery.tab = activeTab.value

        // 5. 更新路由 (replace)
        // 注意：如果您的组件因 URL 变化而重新加载（key="$route.fullPath"），
        // 这一步会自动触发 onMounted 里的 fetchData，不需要手动再调。
        // await router.replace({ path: route.path, query: newQuery })
        

        // 6. 仅清空选中状态，不再手动调用 fetchData()，避免重复请求
        checkedGoodsIds.value = []

        // fetchData() // <--- 已删除此行
      } catch (error) {
        console.error('Batch cancel error', error)
      } finally {
        loading.value = false
      }
    })
    .catch(() => {})
}

onMounted(() => {
  // fetchData()
  // getPermissionInfo(() => {
  //   hasPermission.value = grabCheck('图库车图管理员')
  // })
})
</script>

<style lang="scss" scoped>
.favorites-detail-page {
  background: #fff;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
:deep(.breadcrumb) {
  padding: 0 20px;
  .breadcrumb-item {
    font-size: 14px;
    
    .breadcrumb-item-text{
      max-width: 140px;
      overflow: ellipsis;
      color: #333;
      &:hover {
        color: #0064ff;
        cursor: pointer;
      }
      &.active {
        font-weight: 600;
      }
    }
  }
}

.detail-header {
  height: 20px;
  display: flex;
  align-items: center;
  padding: 0 ;
  // border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;

  .title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
  }

  .public-tabs-wrapper {
    height: 100%;
    display: flex;
    align-items: flex-end;
    :deep(.el-tabs__header) {
      margin: 0;
    }
    :deep(.el-tabs__nav-wrap::after) {
      height: 0;
    }
    :deep(.el-tabs__item) {
      font-size: 15px;
    }
  }
}
.public-tabs-wrapper{
  padding: 10px 20px 0px;
}
.folder-list {
  // height: 100px;
  border-bottom: 1px solid #f0f0f0;
  // display: flex;
  // align-items: center;
  // gap: 12px;
  position: relative;
  padding: 0 20px;
  :deep(.el-scrollbar__bar.is-horizontal) {
    height: 0;
  }
  .card-scrollbar{
    width: 100%;
    height: 100px;
    // border-bottom: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .card{
    flex-shrink: 0;
    width: 255px;
    height: 70px;
    border-radius: 8px;
    background: #FCFDFD;
    box-sizing: border-box;
    border: 1px solid #e5e5e5;
    padding:10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    // &.active,:hover{
    //   border-color: #0064ff;
    //   background-color: #fff;
    // }
    &:hover{
      box-shadow: 0px 2px 10px 0px rgba(67, 72, 94, 0.12);
    }
    &:active{
      border-color: #0064ff;
    }
    &.plus{
      justify-content: center;
      background: #fff;
      border: 1px dashed #E5E5E5;
      .plus-icon{
        width: 14px;
        height: 14px;
        margin-right: 10px;
      }
      .plus-text{
        font-size: 14px;
        color: #666;
      }
      &:active{
        border-color: #0064ff;
      }
    }
    .folder-icon {
      width: 50px;
      height: 50px;
    }
    .folder-name {
      height: 100%;
      font-size: 14px;
      color: #333;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      &-text {
        width: 140px;
        overflow: ellipsis;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &-count {
        font-size: 12px;
        font-weight: 400;
        color: #666;
      }
    }
    .more-btn {
      width: 22px;
      height: 22px;
    }
    
  }
  .roundBtn{
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: #FFFFFF;
    box-sizing: border-box;
    border: 0.8px solid #F8F8F9;
    box-shadow: 0px 2px 3px 0px rgba(9, 34, 71, 0.2781);
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover{
      color: #0064ff;
      border-color: #0064ff;
    }
    &.left {
      left: 10px;
    }
    &.right {
      right: 10px;
    }
  }
}

.dropdown-menu{
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
  gap: 4px;
  :deep(.dropdown-item) {
    margin-left: 0!important;
  }
}

.batch-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px 0px;
  background: #fff;
  flex-shrink: 0;

  .batch-left {
    display: flex;
    align-items: center;
    .selected-count {
      color: #666;
      font-size: 14px;
    }
  }

  .batch-right {
    display: flex;
    gap: 12px;
  }
}

.list-container {
  flex: 1;
  padding-bottom: 10px;
  overflow-y: auto;

  :deep(.boz) {
    padding-top: 10px;
    padding-bottom: 20px;
  }
}
:deep(.el-carousel__container) {
  height: 100px;
  padding: 6px 0;
}

:deep(.el-carousel__item) {
  display: flex;
  height: max-content;
  padding: 6px 0;

  &::after {
    content: '';
    display: block;
  }
}

:deep(.el-carousel__indicator) {
  display: none;
}
</style>
