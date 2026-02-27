<template>
  <div class="gallery-wrap-list">
    <div
      class="boz"
      :style="{
        'grid-template-columns': gridTemplateColumns
      }"
    >
      <div
        class="galleryList-item"
        v-for="(item, index) in list"
        :key="index"
        :data-order="index + 1"
        :data-goods-id="item.goodsId"
        @click="clickItem(item)"
      >
        <div :class="{ 'is-gray': item.goodsStatus === '2' }">
          <el-image class="galleryList-item-img" :src="item.imageUrl" fit="cover" lazy />
          <img class="galleryList-item-chennel" :src="getImageUrl(item.channel)" alt="" />
          <template v-if="isNotSync">
            <div v-if="item.goodsStatus === '1'" class="goods-status-wrapper">
              <div class="shelf-time-pill text-12px">上架时间: {{ item.groundingTime || '-' }}</div>
              <div class="goods-status-badge is-online">上架</div>
            </div>
            <div v-else-if="item.goodsStatus === '2'" class="goods-status-wrapper">
              <div class="goods-status-badge is-offline">下架</div>
            </div>
          </template>

          <div v-if="isSyncMode" class="sync-checkbox-wrapper" @click.stop @mousedown.stop>
            <el-checkbox
              :disabled="currentGoodsId === item.goodsId"
              :model-value="isGoodsChecked(item.goodsId)"
              @update:model-value="(val) => handleCheckboxChange(val, item)"
            />
          </div>

          <div class="galleryList-item-carNumber">
            <div>车图数</div>
            <div>{{ item.promotionImageQuantity }}</div>
          </div>
        </div>

        <div class="galleryList-item-content">
          <div class="content-top">
            <!-- <el-tooltip :content="item.goodsCode">
              <div class="content-top-left">{{ item.goodsCode }}</div>
            </el-tooltip> -->
            <overflow-tooltip :content="item.goodsCode">
              <div class="content-top-left">{{ item.goodsCode }}</div>
            </overflow-tooltip>
            <div class="content-top-right">
              <img class="content-top-img" src="@/assets/imgs/web/look.png" alt="" />
              <div class="content-top-value">{{ item.salesVolumeThirty }}</div>
            </div>
          </div>

          <div class="content-center" v-if="item.timeType === 1">
            <div class="content-center-one">
              <div>7天免费点击率</div>
              <div v-if="item.clickRateSeven">{{ item.clickRateSeven }}</div>
              <div v-else class="loading-wrap">
                <img class="loading-img" src="@/assets/imgs/web/loading.gif" alt="" />抓取中
              </div>
            </div>
            <div class="content-center-one">
              <div>7天免费转换率</div>
              <div v-if="item.checkNormal === '2'">{{ item.clickConversionRateSeven }}</div>
              <div v-else class="loading-wrap">
                <img class="loading-img" src="@/assets/imgs/web/loading.gif" alt="" />抓取中
              </div>
            </div>
            <div class="content-center-two">
              <div>7天综合点击转化</div>
              <div v-if="item.checkNormal === '2'">{{
                item.comprehensiveConversionRateSeven || ''
              }}</div>
              <div v-else>{{ '' }}</div>
            </div>
          </div>
          <div class="content-center" v-else-if="item.timeType === 2">
            <div class="content-center-one">
              <div>30天免费点击率</div>
              <div v-if="item.clickRateThirty">{{ item.clickRateThirty }}</div>
              <div v-else class="loading-wrap">
                <img class="loading-img" src="@/assets/imgs/web/loading.gif" alt="" />抓取中
              </div>
            </div>
            <div class="content-center-one">
              <div>30天免费转换率</div>
              <div v-if="item.checkNormal === '2'">{{ item.clickConversionRateThirty }}</div>
              <div v-else class="loading-wrap">
                <img class="loading-img" src="@/assets/imgs/web/loading.gif" alt="" />抓取中
              </div>
            </div>
            <div class="content-center-two">
              <div>30天综合点击转化</div>
              <div v-if="item.checkNormal === '2'">{{
                item.comprehensiveConversionRateThirty || ''
              }}</div>
              <div v-else>{{ '' }}</div>
            </div>
          </div>

          <div class="content-bottom">
            <img
              class="userImg"
              :src="item.lastUpdatePersonInfo?.avatarOrigin || DefaultAvatar"
              alt=""
            />
            <div class="userName">{{ item.lastUpdatePersonInfo?.name || '-' }}</div>
            <div class="userTime">{{ formattedTime(item.newUpdate) || '-' }}</div>
          </div>
        </div>

        <div v-if="isNotSync && showMore" class="more-mask">
          <div class="more-panel" @click.stop>
            <ul class="w-full flex items-center justify-around mb-10px more-list">
              <li v-if="hasPermission" title="优质图库收藏" @click="handleCollectionClick(item)">
                <img :src="getMoreIcon('collection', item)" alt="" />
              </li>
              <li title="个人收藏" @click="toggleMore('personal', item)">
                <img :src="getMoreIcon('personal', item)" alt="" />
              </li>
              <li title="公共收藏" @click="toggleMore('public', item)">
                <img :src="getMoreIcon('public', item)" alt="" />
              </li>
              <!-- <li title="优质主图" @click="toggleMore('quality', item)">
                <img :src="getMoreIcon('quality', item)" alt="" />
              </li>
              <li title="待提升主图" @click="toggleMore('improve', item)">
                <img :src="getMoreIcon('improve', item)" alt="" />
              </li> -->
            </ul>
          </div>
        </div>
        <div v-if="Object.keys(favorite).length" class="more-mask">
          <div class="more-panel" @click.stop>
            <ul class="w-full flex items-center justify-between mb-10px more-list">
              <!-- 公共收藏type出现个人收藏按钮 -->
              <li
                v-if="favorite.type === '2'"
                title="个人收藏"
                @click="toggleMore('personal', item)"
              >
                <img :src="getMoreIcon('personal', item)" alt="" />
              </li>
              <li v-if="favorite.type === '1'" title="公共收藏" @click="toggleMore('public', item)">
                <img :src="getMoreIcon('public', item)" alt="" />
              </li>
              <!-- 
                      @mouseenter="hoverEditId = item.goodsId"
                @mouseleave="hoverEditId = null" -->
              <li title="备注" @click="toggleMore('remark', item)">
                <img :src="getMoreIcon('remark', item)" alt="" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <DetailDialog ref="detailDialogRef" @success="emit('getList')" />

    <HighQualityCollection
      ref="highQualityCollectionRef"
      name="HighQualityCollection"
      @success="handleHighQualityCollectionSuccess"
      :is-batch="false"
      :current-item="currentItem"
    />

    <CollectionDialog ref="collectionDialogRef" @collectSuccess="handleCollectionDialogSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, onMounted } from 'vue'
import type { Ref } from 'vue'
import { getImageUrl } from '@/utils'
import DetailDialog from './detailDialog.vue'
import CollectionDialog from '@/views/visualCenter/imageGallery/components/collectionDialog.vue' // 引入组件
import * as GalleryApi from '@/api/gallery'
import { useMessage } from '@/hooks/web/useMessage'
import GoodImageCollectionIcon from '@/assets/svgs/gallery/1126good_image_collection.svg'
import GoodImageCollectionIconActive from '@/assets/svgs/gallery/1126good_image_collection_active.svg'
import DislikeIcon from '@/assets/svgs/gallery/1126dislike.svg'
import DislikeIconActive from '@/assets/svgs/gallery/1126dislike_active.svg'
import LikeIcon from '@/assets/svgs/gallery/1126like.svg'
import LikeIconActive from '@/assets/svgs/gallery/1126like_active.svg'
import PublicCollectionIcon from '@/assets/svgs/gallery/1126public_collection.svg'
import PublicCollectionIconActive from '@/assets/svgs/gallery/1126public_collection_active.svg'
import PersonalCollectionIcon from '@/assets/svgs/gallery/1126personal_collection.svg'
import PersonalCollectionIconActive from '@/assets/svgs/gallery/1126personal_collection_active.svg'
import HighQualityCollection from '@/views/visualCenter/highQualityMainImageLibrary/components/highQualityCollection.vue'
import { useRole } from '@/hooks/common/useRole'
import RemarkIcon from '@/assets/svgs/gallery/remark.svg'
import RemarkIconActive from '@/assets/svgs/gallery/remark_active.svg'
import DefaultAvatar from '@/assets/svgs/defaultAvatar.svg'

// [Ref] 组件引用
const highQualityCollectionRef = ref()
const detailDialogRef = ref<InstanceType<typeof DetailDialog>>()
const collectionDialogRef = ref() // 新增 Ref
const hoverEditId = ref<string | number | null>(null)

// [Permission] 权限控制
const { getPermissionInfo, grabCheck } = useRole('视觉')
const hasPermission = ref(false)

onMounted(() => {
  getPermissionInfo(() => {
    hasPermission.value = grabCheck('优质主图收藏')
  })
})

// [State] 当前操作项（仅在点击弹窗时赋值，不再用于 hover）
const currentItem = ref<any>(null)

// 消息弹窗
const message = useMessage?.() as any

// [Props]
const props = defineProps({
  list: { type: Array, default: () => [] } as any,
  showMore: { type: Boolean, default: true },
  baseWidth: { type: String, default: '' },
  favorite: { type: Object, default: () => ({}) } as any // 收藏夹信息
})

// [Emits]
const emit = defineEmits(['getList', 'edit-remark'])

// [Inject] 上下文注入
const isNotSync = inject<boolean>('isNotSync')
const isSync = inject<boolean>('isSync')
const currentGoodsId = inject<string>('currentGoodsId')

// [Computed] 栅格布局
const gridTemplateColumns = computed(() => {
  const baseWidth = props.baseWidth || (isSync ? '230px' : '250px')
  return `repeat(auto-fill, minmax(${baseWidth}, 1fr))`
})

// [Sync] 同步模式逻辑
type SyncSelectionContext = {
  checkedGoodsIds: Ref<string[]>
  toggleGoodsSelection: (goodsId: string, checked: boolean) => void
  isGoodsSelected?: (goodsId: string) => boolean
  clearGoodsSelection?: () => void
}

const syncSelection = inject<SyncSelectionContext | null>('syncSelection', null)
const selectedGoodsIds = computed(() => syncSelection?.checkedGoodsIds?.value ?? [])
const isSyncMode = computed(() => Boolean(isSync))

const isGoodsChecked = (goodsId?: string) => {
  if (!goodsId) return false
  if (syncSelection?.isGoodsSelected) {
    return !!syncSelection.isGoodsSelected(goodsId)
  }
  return selectedGoodsIds.value.includes(goodsId)
}

const handleCheckboxChange = (value: any, item: any) => {
  if (!syncSelection || !item?.goodsId) return
  syncSelection.toggleGoodsSelection(item.goodsId, Boolean(value))
}

// [Logic] 优质主图收藏点击
const handleCollectionClick = async (item: any) => {
  if (!item) return
  // 将当前点击的 item 赋值给 currentItem，以便 HighQualityCollection 组件使用 props
  currentItem.value = item

  console.log('item', item)
  if (item.isCollection === 1) {
    try {
      await message.confirm('该主图已被收藏，请确认是否替换？', '提示')
      openCollectionDialog(item, true)
    } catch {
      // 取消操作
    }
  } else {
    openCollectionDialog(item, false)
  }
}

// 优质主图收藏成功回调
const handleHighQualityCollectionSuccess = () => {
  emit('getList')
}

// 个人/公共收藏成功回调
const handleCollectionDialogSuccess = () => {
  // 收藏成功后刷新列表以更新图标状态
  emit('getList')
}

// 打开优质主图弹窗
const openCollectionDialog = (item: any, isEdit: boolean = false) => {
  highQualityCollectionRef.value?.open({
    isEdit,
    title: '优质图库收藏',
    url: item.imageUrl,
    ids: [item.id],
    reason: item.collectionReason || '',
    tagsObject: {}
  })
}

// [Logic] 优质/待提升主图操作 (点赞/踩)
const handleLikeOrStep = async (key: 'quality' | 'improve', item: any) => {
  if (!item) return
  const id = item.goodsId
  if (!id) return

  const alreadySelected = key === 'quality' ? item.isGood === '1' : item.isGood === '0'
  const nextIsGood = alreadySelected ? '2' : key === 'quality' ? '1' : '0'

  try {
    await GalleryApi.mainImageLikeOrStep({ id, isGood: nextIsGood })
    // 更新本地状态
    item.isGood = nextIsGood as any
    message?.success?.('操作成功')
  } catch (error) {
    message?.error?.('操作失败')
  }
}

// [Logic] 个人/公共收藏操作 (新增取消逻辑)
const handleCollect = async (key: 'personal' | 'public', item: any) => {
  if (!item?.goodsId) return

  // 映射类型: 1=个人收藏, 2=公共收藏
  const isPersonal = key === 'personal'
  const type = isPersonal ? '1' : '2'

  // 判断当前是否已收藏
  const isCollected = isSelected(key, item)

  if (isCollected) {
    // 已经收藏 -> 执行取消收藏
    try {
      await GalleryApi.cancelCollect({
        goodsIds: [item.goodsId],
        favoritesType: type
      })
      message?.success?.('取消收藏成功')
      emit('getList') // 刷新列表更新状态
    } catch (error) {
      console.error(error)
      // message?.error?.('取消收藏失败')
    }
  } else {
    // 未收藏 -> 打开收藏弹窗
    const title = isPersonal ? '个人收藏' : '公共收藏'
    collectionDialogRef.value?.open({
      favoritesType: type,
      goodsId: item.goodsId,
      title: title
    })
  }
}

// 统一操作入口
const toggleMore = (key: 'personal' | 'public' | 'quality' | 'improve' | 'remark', item: any) => {
  // 确保点击操作时也更新 currentItem
  currentItem.value = item

  if (key === 'remark') {
    emit('edit-remark', {
      item,
      favorite: props.favorite
    })
    return
  }

  if (key === 'quality' || key === 'improve') {
    handleLikeOrStep(key, item)
    return
  }
  // 处理收藏逻辑
  handleCollect(key, item)
}

// 判断图标状态
const isSelected = (
  key: 'personal' | 'public' | 'quality' | 'improve' | 'collection' | 'remark',
  item: any
) => {
  if (!item) return false
  if (key === 'quality') return item.isGood === '1'
  if (key === 'improve') return item.isGood === '0'
  // grsc=1 代表个人已收藏, comsc=1 代表公共已收藏
  if (key === 'personal') return item.grsc === 1
  if (key === 'public') return item.comsc === 1
  if (key === 'collection') return item.isCollection === 1
  return false
}

// 获取图标资源
const getMoreIcon = (
  key: 'personal' | 'public' | 'quality' | 'improve' | 'collection' | 'remark',
  item: any
) => {
  const selected = isSelected(key, item)
  if (key === 'personal') {
    return selected ? PersonalCollectionIconActive : PersonalCollectionIcon
  }
  if (key === 'public') {
    return selected ? PublicCollectionIconActive : PublicCollectionIcon
  }
  if (key === 'quality') {
    return selected ? LikeIconActive : LikeIcon
  }
  if (key === 'collection') {
    return selected ? GoodImageCollectionIconActive : GoodImageCollectionIcon
  }
  if (key === 'improve') {
    return selected ? DislikeIconActive : DislikeIcon
  }

  if (key === 'remark') {
    const hovered = hoverEditId.value === item?.goodsId
    return hovered ? RemarkIconActive : RemarkIcon
  }
  return ''
}

// 列表项点击
const clickItem = (item: any) => {
  // 非同步模式且没有收藏夹时，不显示详情弹窗
  if (!isNotSync && !Object.keys(props.favorite).length) return
  detailDialogRef.value?.open(item.goodsId)
}

// [Util] 时间格式化
const formattedTime = computed(() => {
  return (timeString: string) => {
    if (!timeString) return ''
    const updateTime = new Date(timeString.replace(',', ' '))
    const diffMs = Date.now() - updateTime.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    if (diffHours < 1 && diffMinutes === 0) return `1分钟内`
    if (diffHours < 1) return `${diffMinutes}分钟前`
    if (diffDays < 1) return `${diffHours}小时前`
    return timeString.split(',')[0]
  }
})

const openDetail = (goodsId: string) => {
  detailDialogRef.value?.open(goodsId)
}

defineExpose({
  openDetail
})
</script>

<style lang="scss" scoped>
.boz {
  display: grid;
  padding: 6px 20px 20px;
  position: relative;
  overflow: auto;
  gap: 24px;

  .galleryList-item {
    margin-top: 4px;
    position: relative;
    height: auto;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
    will-change: transform;
    box-sizing: border-box;
    border-radius: 8px;
    overflow: hidden;

    &:hover {
      transform: scale(1.03);
      box-shadow:
        0 0 0 2px #b2cbed,
        0 6px 20px rgba(0, 0, 0, 0.12);
      z-index: 100; // 提高层级，防止被遮挡
      border-radius: 8px;

      .galleryList-item-content {
        background: #e2edfc;
      }

      .content-center-one {
        display: flex;
        background: #d9e8fc;
        border-bottom: 1px solid #cde0fa;
        align-items: center;
      }

      .content-center-two {
        display: flex;
        background: #d9e8fc;
        align-items: center;
      }

      // 核心修改：鼠标悬停时显示蒙层
      .more-mask {
        display: flex;
        animation: fadeIn 0.2s ease-in-out;
      }
    }

    &:nth-child(6n) {
      margin-right: 0;
    }

    .galleryList-item-carNumber {
      position: absolute;
      left: 9px;
      top: 222px;
      display: flex;
      justify-content: space-between;
      width: 75px;
      height: 29px;
      font-size: 14px;
      color: #fff;
      padding: 0 10px;
      border-radius: 2px;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(10px);
      align-items: center;
    }

    .galleryList-item-content {
      margin-top: 0;
      width: 100%;
      background: #f6f9fd;
      border-radius: 0 0 8px 8px;
    }
  }

  // 内容区样式
  .content-top {
    display: flex;
    justify-content: space-between;
    padding: 6px 10px;
    align-items: center;

    .content-top-left {
      font-size: 18px;
      font-weight: 500;
      color: #333;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 108px;
      z-index: 1000;
      position: relative;
    }

    .content-top-right {
      display: flex;
      align-items: center;
      gap: 6px;
      padding-right: 10px;

      .content-top-value {
        font-size: 24px;
        font-weight: 500;
        color: #ff1123;
      }

      .content-top-img {
        margin-top: 8px;
        margin-right: 6px;
        width: 12px;
        height: 12px;
      }
    }
  }

  .content-center {
    font-size: 14px;
    color: #727e93;

    .content-center-one,
    .content-center-two {
      display: flex;
      justify-content: space-between;
      margin: 0 6px;
      padding: 6px 15px;
      background: #f0f6ff;
      border-bottom: 1px solid #e2edfc;
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: normal;
      color: #6e7a8f;
      align-items: center;

      &:last-child {
        border-bottom: none;
      }
    }

    .content-center-two {
      justify-content: space-between;
    }

    .loading-wrap {
      display: flex;
    }

    .loading-wrap .loading-img {
      width: 20px;
      height: 20px;
      margin-right: 6px;
    }
  }

  .content-bottom {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 10px 10px;
    min-height: 20px;

    .userImg {
      width: 20px;
      height: 20px;
      margin-right: 10px;
      border-radius: 50%;
    }

    .userName {
      font-size: 14px;
      color: #333;
      flex-grow: 1;
    }

    .userTime {
      font-size: 14px;
      color: #666;
      text-align: right;
    }
  }

  .galleryList-item-img {
    border-radius: 8px 8px 0 0;
    width: 100%;
    aspect-ratio: 1 / 1;
    height: auto;
    display: block;
  }

  .galleryList-item-chennel {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 32px;
    height: 32px;
  }

  .goods-status-wrapper {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    align-items: center;
  }

  .sync-checkbox-wrapper {
    position: absolute;
    top: 10px;
    right: 10px;
    // width: 32px;
    // height: 32px;
    // border-radius: 4px;
    opacity: 1;
    // background: rgba(0, 0, 0, 0.49);
    box-sizing: border-box;
    // border: 1px solid #d8d8d8;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
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

  .goods-status-badge {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #fff;
    user-select: none;
    position: relative;
    z-index: 2;
  }

  .goods-status-badge.is-online {
    background: #ff1123;
  }

  .goods-status-badge.is-offline {
    background: rgba(51, 51, 51, 0.3);
  }

  .shelf-time-pill {
    height: 32px;
    line-height: 32px;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(10px);
    color: #fff;
    border-radius: 16px;
    padding: 0 28px 0 10px;
    margin-right: 0;
    opacity: 0;
    transform: translateX(8px);
    transition: all 0.2s ease;
    white-space: nowrap;
    pointer-events: none;
    position: absolute;
    right: 10px;
    top: 0;
    z-index: 1;
    border: 1px solid rgba(255, 255, 255, 0.18);
  }

  .goods-status-wrapper:hover .shelf-time-pill {
    opacity: 1;
    transform: translateX(0);
    pointer-events: auto;
  }

  .is-gray {
    filter: grayscale(100%);
  }
}

/* 滚动条样式 */
.boz::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.boz::-webkit-scrollbar-thumb {
  background-color: #c8c8c8;
  border-radius: 4px;

  &:hover {
    background-color: #aaa;
  }
}

.boz::-webkit-scrollbar-track {
  background-color: #f0f0f0;
  border-radius: 4px;
}

/* 更多蒙版与面板 */
.more-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%);
  backdrop-filter: blur(0px);
  // 核心修改：默认隐藏，通过父级 hover 显示
  display: none;
  align-items: center;
  justify-content: flex-end;
  z-index: 999;
  top: 304px;
}

// 简单的淡入动画
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.more-panel {
  width: 100%;
  height: 100%;
  padding: 0 10px 8px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.more-list {
  li {
    cursor: pointer;
  }
}
</style>
