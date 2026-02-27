<template>
  <ex-screen>
    <div
      class="father"
      :class="{ 'sync-container': props.isSync }"
      v-loading.fullscreen.lock="loading"
      :style="fatherStyle"
    >
      <Title
        v-if="isNotSync"
        ref="titleRef"
        @update-time-select="updateTimeSelect"
        :is-show-back="false"
      />
      <div class="content">
        <div class="formList">
          <el-form ref="formRef" :model="formData" label-width="4.166667vw">
            <div class="flex items-center justify-between">
              <div>
                <el-form-item prop="string" label="商品主键" style="margin-bottom: 0.520833vw">
                  <el-input
                    style="width: 15.625vw"
                    v-model="formData.searchContent"
                    placeholder="请输入商品ID/商品名称/货品编码"
                    @keyup.enter="getList"
                  />
                </el-form-item>
                <el-form-item
                  prop="string"
                  label="人员查询"
                  class="personQuery"
                  style="position: absolute; top: 1.041667vw; left: 22.395833vw"
                >
                  <el-select
                    style="width: 15.625vw; margin-right: 1.5625vw"
                    v-model="formData.personType"
                    placeholder="请选择人员类型"
                  >
                    <el-option
                      v-for="item in optionOptions"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    />
                  </el-select>
                  <div class="valueBgInput">
                    <SWSelectPeople
                      style="width: 16.666667vw"
                      v-if="formData.personType"
                      :isEdit="true"
                      :multiple="false"
                      v-model="formData.personId"
                      :getSearchList="remoteMethod"
                      @select-people-change="getList"
                    />
                  </div>
                </el-form-item>
              </div>
              <div class="mr-20px">
                <el-button @click="reset" class="commonResetBtn">重置</el-button>
              </div>
            </div>
            <!-- 渠道 -->
            <el-form-item prop="string" label="渠道" v-show="!isOpen">
              <div
                style="margin-left: 0.625vw"
                class="storeItem"
                :class="{ actived: activeStore === 'TaoBao' }"
                @click="storeChange('TaoBao')"
                >淘宝</div
              >
              <div
                class="storeItem"
                :class="{ actived: activeStore === 'Tmall' }"
                @click="storeChange('Tmall')"
                >天猫
              </div>
            </el-form-item>
            <!-- 图片类型 -->
            <el-form-item prop="string" label="图片类型" v-show="!isOpen">
              <div
                style="margin-left: 0.625vw"
                class="storeItem"
                :class="{ actived: activePicType === '1' }"
                @click="picTypeChange('1')"
                >主图(含车图)</div
              >
              <div
                class="storeItem"
                :class="{ actived: activePicType === '0' }"
                @click="picTypeChange('0')"
                >主图(无车图)
              </div>
            </el-form-item>
            <!-- 类目 -->
            <el-form-item prop="string" label="类目" v-show="!isOpen">
              <div
                style="margin-left: 0.625vw"
                v-for="(item, index) in TypeList"
                :key="index"
                class="storeItem"
                :class="{ actived: activeCloseType === item.value }"
                @click="CloseTypeChange(item.value)"
                >{{ item.name }}
              </div>
            </el-form-item>
            <!-- 高级搜索 -->
            <el-form-item
              prop="string"
              label="高级搜索"
              v-show="!isOpen"
              class="advanced-search-item"
            >
              <div class="advanced-search-item-content">
                <div
                  style="margin-left: 0.625vw"
                  class="storeItem"
                  :class="{ actived: activeWJType === '4' }"
                  @click="activeWJTypeChange('4')"
                  >销量正序</div
                >
                <div
                  class="storeItem"
                  :class="{ actived: activeWJType === '5' }"
                  @click="activeWJTypeChange('5')"
                  >销量倒序
                </div>
                <div
                  class="storeItem"
                  :class="{ actived: activeWJType === '1' }"
                  @click="activeWJTypeChange('1')"
                  >文件最新发布
                </div>
                <div
                  class="storeItem"
                  :class="{ actived: activeWJType === '2' }"
                  @click="activeWJTypeChange('2')"
                  >车图更新时间
                </div>
                <div
                  class="storeItem"
                  :class="{ actived: activeWJType === '3' }"
                  @click="activeWJTypeChange('3')"
                  >车图数据待完善
                </div>
              </div>
              <div class="button">
                <template v-if="isNotSync">
                  <!-- <span class="ml-22px"
                    ><el-button class="collect-btn" @click="openPersonalCollection" plain>
                      个人收藏
                    </el-button></span
                  >
                  <span class="ml-16px"
                    ><el-button class="collect-btn" @click="openPublicCollection" plain>
                      公共收藏
                    </el-button></span
                  > -->
                  <span class="ml-16px">
                    <el-button class="collect-btn" @click="onCollection" plain> 收藏夹 </el-button>
                  </span>
                  <!-- <span class="ml-16px"
                    ><el-button @click="onBeUpgraded" type="primary"> 待提升图库 </el-button></span
                  >

                  <span class="ml-16px"
                    ><el-button @click="onQuality" type="primary"> 优质图库 </el-button></span
                  > -->
                </template>
                <!-- <div
            v-show="!isOpen"
            class="zhankai"
            @click="isOpen = !!!isOpen"
            style="display: flex; justify-content: center; align-items: center"
            ><img
              style="width: 0.729167vw; height: 0.729167vw"
              src="@/assets/imgs/web/chevron-up.png"
              alt=""
            />
            <div class="shouqi">收起</div>
          </div>
          <div
            v-show="isOpen"
            class="zhankai"
            @click="isOpen = !!!isOpen"
            style="display: flex; justify-content: center; align-items: center"
            ><img
              style="width: 0.729167vw; height: 0.729167vw"
              src="@/assets/imgs/web/chevron-down.png"
              alt=""
            />
            <div class="shouqi">展开</div>
          </div> -->
              </div>
            </el-form-item>
          </el-form>
          <!-- 提示词 -->
          <div class="tip-container" v-if="isNotSync">
            <transition name="expand">
              <div v-show="isExpanded" class="tip-content-wrapper">
                <div class="tip-content">
                  <div
                    >每日12点之后更新三方系统最新数据！其中达摩盘最新的数据为前日，其他系统最新数据为昨日）注：千牛后台达摩盘系统的数据会延迟一天</div
                  >
                  <div>免费点击率来自【{{ freeClickDate }}】达摩盘全店洞察的免费搜索点击率</div>
                  <div
                    >免费转换率来自【{{
                      freeTransformDate
                    }}】商品360手淘搜索-商品及其他的支付转换率</div
                  >
                  <div>综合点击转换率=免费点击率*免费转换率</div>
                </div>
              </div>
            </transition>
            <div
              class="tip-img"
              @click="toggleTip"
              :style="{ backgroundColor: isExpanded ? '#0064ff' : '#fff' }"
            >
              <img v-if="isExpanded" src="@/assets/imgs/web/tip.svg" alt="" />
              <img
                v-if="!isExpanded"
                src="@/assets/imgs/web/tip_default.png"
                alt=""
                style="width: 7px; height: 13px"
              />
              <div class="tip-text text-center">点击伸缩<br />查看</div>
            </div>
          </div>
        </div>
        <!-- 图片区域 -->
        <div class="picList">
          <!-- <typeFilter @filter-type-click="filterTypeClick" /> -->
          <galleryList ref="galleryListRef" :list="list" :total="total" @get-list="changeGetList" />
          <!-- 空页面 -->
          <img
            v-if="total === 0"
            style="
              width: 18.541667vw;
              height: 11.770833vw;
              position: absolute;
              z-index: 999;
              top: 23.958333vw;
              left: 41.666667vw;
            "
            src="@/assets/imgs/web/noData.png"
            alt=""
          />
          <div
            v-if="total === 0"
            style="
              position: absolute;
              font-family: PingFang SC;
              font-size: 0.729167vw;
              font-weight: normal;
              line-height: normal;
              letter-spacing: normal;
              color: #999999;
              top: 39.0625vw;
              left: 48.958333vw;
            "
            >暂无相关数据</div
          >
        </div>
      </div>
    </div>
    <ImgDialog ref="imgDialog" />
  </ex-screen>
</template>
<script setup lang="ts">
import * as GalleryApi from '@/api/gallery'
import * as PersonRosterApi from '@/api/hrAdmin/personRoster'
import dayjs from 'dayjs'
import galleryList from '@/views/web/visualGallery/components/galleryList.vue'
import ImgDialog from '@/views/web/visualGallery/components/imgDialog.vue'
import SWSelectPeople from '@/views/web/visualGallery/components/SWSelectPeople.vue'
import Title from '@/views/web/visualGallery/components/title.vue'
import { useDialog } from '@/hooks/web/useDialog'
import { defineAsyncComponent, nextTick, onActivated, onDeactivated } from 'vue'
import { useMessage } from '@/hooks/web/useMessage'
import { checkPermi } from '@/utils/permission'
import { useRoute } from 'vue-router'
import { isWindows } from '@/utils/os'
import { nextFrameTick } from '@/utils/util'
import { useRouter } from 'vue-router'


defineOptions({
  name: 'ImageGallery'
})

const route = useRoute()

const props = withDefaults(
  defineProps<{
    isSync: boolean
    goodsId?: string
  }>(),
  {
    isSync: false,
    goodsId: ''
  }
)

const isNotSync = computed(() => {
  return !props.isSync
})

provide('isSync', props.isSync)
provide('isNotSync', isNotSync.value)
provide('currentGoodsId', props.goodsId)

const router = useRouter()
const galleryListRef = ref()

const message = useMessage?.()

const total = ref<number>(0)
const activeStore = ref<string>('')
const activePicType = ref<string>('')
const activeCloseType = ref<string>('')
const activeWJType = ref<string>('5')
const formData = ref<any>({
  searchContent: '',
  personType: '',
  personId: []
})
const loading = ref(false)
const checkedGoodsIds = ref<string[]>([])
const submitting = ref(false)

const toggleGoodsSelection = (goodsId: string, checked: boolean) => {
  if (!goodsId) return
  const next = new Set(checkedGoodsIds.value)
  if (checked) {
    next.add(goodsId)
  } else {
    next.delete(goodsId)
  }
  checkedGoodsIds.value = Array.from(next)
}

const isGoodsSelected = (goodsId: string) => {
  if (!goodsId) return false
  return checkedGoodsIds.value.includes(goodsId)
}

const clearGoodsSelection = () => {
  checkedGoodsIds.value = []
}

provide('syncSelection', {
  checkedGoodsIds,
  toggleGoodsSelection,
  isGoodsSelected,
  clearGoodsSelection
})

const baseWidth = 1920
const baseHeight = 1080
const supportsZoom = ref(true)
const scale = ref(1)

function computeScale() {
  const dpr = window.devicePixelRatio || 1
  // 非 Windows 或无缩放、一倍/两倍等整数倍密度都不处理（避免 macOS dpr=2 被缩小）
  if (!isWindows() || dpr <= 1) return 1
  // 只处理典型的 Windows 显示缩放：1.25、1.5
  if (dpr > 1 && dpr <= 1.5) return 1 / dpr
  return 1
}

const fatherStyle = computed(() => {
  if (supportsZoom.value) {
    return { zoom: scale.value }
  }
  return {
    transform: `scale(${scale.value})`,
    transformOrigin: 'top left',
    width: scale.value !== 1 ? `${100 / scale.value}%` : '100%',
    height: '100%'
  }
})

function applyScale() {
  scale.value = computeScale()
}

const isOpen = ref(false)
const titleRef = ref()
const queryParams = ref<any>({
  size: 30,
  page: 1,
  channel: '',
  orderType: ''
})
const optionOptions = ref([
  { value: 1, label: '运营' },
  { value: 2, label: '策划' },
  { value: 3, label: '拍摄' },
  { value: 4, label: '后期' },
  { value: 5, label: '设计' }
])
const publishTimeStart = ref('')
const publishTimeEnd = ref('')
const updateTimeStart = ref('')
const updateTimeEnd = ref('')

const list = ref<any>([])
// 选择渠道
const storeChange = (item) => {
  if (activeStore.value === item) {
    activeStore.value = ''
    return getList()
  }
  activeStore.value = item
  getList()
}
// 选择图片类型
const picTypeChange = (item) => {
  if (activePicType.value === item) {
    activePicType.value = ''
    return getList()
  }
  activePicType.value = item
  getList()
}
const personList = ref([])
const personalRequest = ref(false)
const remoteMethod = async () => {
  if (personalRequest.value) {
    return []
  }
  if (personList.value && personList.value.length > 0) {
    return personList.value
  }
  personalRequest.value = true
  const data = await PersonRosterApi.getPersonRosterAvatarOriginList({
    status: '2'
  }).catch(() => {
    personalRequest.value = false
  })
  personList.value = data || []
  personalRequest.value = false
  return personList.value
}

const TypeList = ref<any>([
  { name: '内衣', value: 'UNDERWEAR_CATEGORY_GROUP' },
  { name: '季节品', value: 'SEASONAL_CATEGORY_GROUP' },
  { name: '女士内裤', value: 'WOMANPANTS_CATEGORY_GROUP' },
  { name: '袜子', value: 'SOCKS_CATEGORY_GROUP' },
  { name: '男士内裤', value: 'MANPANTS_CATEGORY_GROUP' },
  { name: '胸贴', value: 'PASTIES_CATEGORY_GROUP' }
])
//
const CloseTypeChange = (item) => {
  if (activeCloseType.value === item) {
    activeCloseType.value = ''
    return getList()
  }
  activeCloseType.value = item
  getList()
}
const activeWJTypeChange = (item) => {
  if (activeWJType.value === item) {
    activeWJType.value = ''
    return getList()
  }
  activeWJType.value = item
  getList()
}
// const filterTypeClick = (data) => {
//   queryParams.value.orderType = data.type
// }

const imgDialog = ref()

const openHighQualityImgs = () => {
  console.log('打开优质车图库')
  imgDialog.value.open('1')
}

const openPromoteImgs = () => {
  console.log('打开待提升车图库')
  imgDialog.value.open('0')
}

function onQuality() {
  openDialog({
    title: '优质图库',
    width: '1470px',
    top: '3.5vh',
    content: defineAsyncComponent(
      () => import('@/views/web/visualGallery/components/dir/gallery/index.vue')
    ),
    props: {
      dirs: primaryDirs,
      isGood: '1'
    },
    showConfirmFooter: false,
    footer: false
  })
}

const reset = () => {
  queryParams.value = {
    size: 30,
    page: 1,
    orderType: ''
  }
  formData.value = {
    searchContent: '',
    personType: '',
    personId: []
  }
  activeWJType.value = '5'
  activeStore.value = ''
  activePicType.value = ''
  activeCloseType.value = ''
  titleRef.value.reset()
  // updateTimeSelect({ selectIndex: 0, selectIndex2: 0 })
  updateTimeSelect({
    selectIndex: 3,
    selectIndex2: 3,
    queryParams: { pickerVModel: ['', ''], pickerVModel2: ['', ''] }
  })
}
const getList = async () => {
  try {
    loading.value = true
    await nextFrameTick()
    queryParams.value.channel = activeStore.value
    queryParams.value.imageType = activePicType.value
    queryParams.value.category = activeCloseType.value
    queryParams.value.searchContent = formData.value.searchContent
    queryParams.value.publishTimeStart = publishTimeStart.value
    queryParams.value.publishTimeEnd = publishTimeEnd.value
    queryParams.value.updateTimeStart = updateTimeStart.value
    queryParams.value.updateTimeEnd = updateTimeEnd.value
    queryParams.value.orderType = +activeWJType.value
    if (formData.value.personId.length >= 1) {
      queryParams.value.personId = formData.value.personId[0].userId
      queryParams.value.personType = formData.value.personType
    } else {
      queryParams.value.personType = ''
      queryParams.value.personId = ''
    }
    const data = await GalleryApi.getHomePage(queryParams.value).catch(() => {})
    if (data) {
      list.value = data.records || []
      total.value = data.total
    }
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

const changeGetList = (data) => {
  queryParams.value.size = data?.size ?? data?.limit ?? queryParams.value.size
  queryParams.value.page = data?.page ?? queryParams.value.page
  getList()
}

// 日期格式化函数
const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const updateTimeSelect = (data) => {
  console.log(data, 'data')

  const today = new Date()
  if (data.selectIndex === 0) {
    // 3个月前
    const threeMonthsAgo = new Date(today)
    threeMonthsAgo.setMonth(today.getMonth() - 3)
    publishTimeStart.value = formatDate(threeMonthsAgo)
    publishTimeEnd.value = formatDate(today)
  } else if (data.selectIndex === 1) {
    // 1个月前
    const oneMonthAgo = new Date(today)
    oneMonthAgo.setMonth(today.getMonth() - 1)
    publishTimeStart.value = formatDate(oneMonthAgo)
    publishTimeEnd.value = formatDate(today)
  } else if (data.selectIndex === 2) {
    // 半个月前 (15天)
    const halfMonthAgo = new Date(today)
    halfMonthAgo.setDate(today.getDate() - 15)
    publishTimeStart.value = formatDate(halfMonthAgo)
    publishTimeEnd.value = formatDate(today)
  } else {
    publishTimeStart.value = data.queryParams?.pickerVModel[0]
    publishTimeEnd.value = data.queryParams?.pickerVModel[1]
  }
  if (data.selectIndex2 === 0) {
    // 3个月前
    const threeMonthsAgo = new Date(today)
    threeMonthsAgo.setMonth(today.getMonth() - 3)
    updateTimeStart.value = formatDate(threeMonthsAgo)
    updateTimeEnd.value = formatDate(today)
  } else if (data.selectIndex2 === 1) {
    // 1个月前
    const oneMonthAgo = new Date(today)
    oneMonthAgo.setMonth(today.getMonth() - 1)
    updateTimeStart.value = formatDate(oneMonthAgo)
    updateTimeEnd.value = formatDate(today)
  } else if (data.selectIndex2 === 2) {
    // 半个月前 (15天)
    const halfMonthAgo = new Date(today)
    halfMonthAgo.setDate(today.getDate() - 15)
    updateTimeStart.value = formatDate(halfMonthAgo)
    updateTimeEnd.value = formatDate(today)
  } else {
    updateTimeStart.value = data.queryParams?.pickerVModel2[0]
    updateTimeEnd.value = data.queryParams?.pickerVModel2[1]
  }
  getList()
}

const freeClickDate = ref('') // 免费点击率日期
const freeTransformDate = ref('') // 免费转换率日期
const isExpanded = ref(true) // 展开提示词
const toggleTip = () => {
  isExpanded.value = !isExpanded.value
}
// 日期更新逻辑
// 12点之前展示的提示内容为： 免费点击率展示3天前日期，转换率展示2天前日期
// 12点及12点之后展示的提示内容为： 免费点击率展示2天前日期，转换率展示1天前日期
const updateDates = () => {
  const now = dayjs()
  const isAfterNoon = now.hour() >= 12

  let clickDaysAgo = isAfterNoon ? 2 : 3
  let transformDaysAgo = isAfterNoon ? 1 : 2

  const clickDate = now.subtract(clickDaysAgo, 'day')
  const transformDate = now.subtract(transformDaysAgo, 'day')

  freeClickDate.value = clickDate.format('YYYY-MM-DD')
  freeTransformDate.value = transformDate.format('YYYY-MM-DD')
}
onMounted(() => {
  supportsZoom.value = 'zoom' in document.documentElement.style
  applyScale()
  window.addEventListener('resize', applyScale)
  updateDates()
  // updateTimeSelect({ selectIndex: 0, selectIndex2: 0 })
  updateTimeSelect({
    selectIndex: 3,
    selectIndex2: 3,
    queryParams: { pickerVModel: ['', ''], pickerVModel2: ['', ''] }
  })
  setTimeout(() => {
    console.log(
      supportsZoom.value,
      'supportsZoom.value',
      'fatherStyle',
      fatherStyle.value,
      'goodsId',
      props.goodsId
    )
  }, 1000)
  if (route.query.goodsId) {
    nextTick(() => {
      galleryListRef.value?.openDetail(route.query.goodsId as string)
    })
  }
})

onActivated(() => {
  // isGalleryActive.value = true
  // triggerGalleryRefresh()
  getList()
})

// onDeactivated(() => {
//   isGalleryActive.value = false
// })

onUnmounted(() => {
  window.removeEventListener('resize', applyScale)
})

const beforeSubmit = async () => {
  if (!props.isSync) return false
  if (!checkedGoodsIds.value.length) {
    message?.warning?.('请选择需要同步的商品')
    return false
  }
  if (submitting.value) return false

  try {
    // 二次确认
    await message?.confirm?.('确定要同步选中的商品吗？', '提示')
  } catch {
    // 用户取消操作
    return false
  }
}

const submit = async () => {
  submitting.value = true
  try {
    await GalleryApi.syncPictureGallery({ goodsIds: [props.goodsId, ...checkedGoodsIds.value] })
    message?.success?.('同步成功')
    clearGoodsSelection()
    return true
  } catch (error) {
    message?.error?.('同步失败')
    throw error
  } finally {
    submitting.value = false
  }
}

// 提供方法给后代组件
provide('getList', getList)

const primaryDirs = [
  { name: '主图图库', id: 1 },
  { name: '车图图库', id: 2 }
]
const { openDialog } = useDialog()

async function openCollection(type: 1 | 2, title: string) {
  try {
    let closeable = true
    if (type === 2) {
      const approvalPermi = 'gallery:deleteCollection'
      closeable = checkPermi([approvalPermi])
    }
    const res: any = await GalleryApi.getPictureCollectDate({ type }).catch(() => null)
    const rawDirs: any = res || []
    const dirs: any[] = Array.isArray(rawDirs) ? rawDirs.map((v) => ({ closeable, label: v })) : []
    openDialog({
      title,
      width: '1482px',
      top: '3.5vh',
      content: defineAsyncComponent(
        () => import('@/views/web/visualGallery/components/dir/collection/index.vue')
      ),
      props: {
        dirs,
        type
      },
      showConfirmFooter: false,
      footer: false,
      deferFooterUntilContent: true
    })
  } catch (error) {
    console.log(error)
  }
}

function openPersonalCollection() {
  openCollection(1, '个人收藏')
}

function openPublicCollection() {
  openCollection(2, '公共收藏')
}

function onBeUpgraded() {
  openDialog({
    title: '待提升图库',
    width: '1470px',
    top: '3.5vh',
    content: defineAsyncComponent(
      () => import('@/views/web/visualGallery/components/dir/gallery/index.vue')
    ),
    props: {
      dirs: primaryDirs,
      isGood: '0'
    },
    showConfirmFooter: false,
    footer: false
  })
}

function onCollection() {
  router.push('/admin/VD/gallery/favorites')
}

defineExpose({
  submit,
  checkedGoodsIds,
  beforeSubmit
})
</script>
<style scoped lang="scss">
.father {
  // background: #f4f7fe;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  overflow-y: auto;

  &.sync-container {
    padding: 0;
    // display: flex;
    // flex-direction: column;
    height: 82vh;
    background: unset;
    .content {
      // flex: 1;
      // height: 0;
      border-top: unset;
      .formList {
        border-bottom: unset;
        :deep(.el-form) {
          .el-input,
          .el-select {
            width: 240px !important;
          }
          .personQuery {
            left: 18.3958vw !important;
          }
          .valueBgInput {
            display: block;
          }
        }
      }
    }
  }
  .content {
    position: relative;
    // margin-right: 3.645833vw;
    // margin-top: 0.833333vw;
    background-color: #fff;
    border-top: 1px solid #f0f0f0;
    border-radius: 0px 0px 0.416667vw 0.416667vw;

    // min-height: 13.541667vw;
    // .button {
    //   z-index: 9;
    //   position: absolute;
    //   bottom: 0;
    //   display: flex;
    //   right: 20px;
    // }

    .formList {
      // margin-right: 1.041667vw;
      position: relative;
      padding-top: 1.041667vw;
      border-bottom: 0.052083vw solid #f0f0f0;

      :deep(.el-form-item--default) {
        margin-bottom: 0.3125vw;
      }
      :deep(.el-form-item) {
        .el-form-item__label {
          white-space: nowrap;
        }
      }
      :deep(.el-form) {
        .advanced-search-item {
          .el-form-item__content {
            display: flex;
            justify-content: space-between;
          }
          .advanced-search-item-content {
            display: flex;
            // justify-content: space-between;
          }
          .button {
            margin-right: 20px;
          }
        }
      }
    }

    .storeItem {
      margin-right: 1.041667vw;
      cursor: pointer;
    }

    .actived {
      color: #0064ff;
    }
  }

  // 提示词
  .tip-container {
    width: auto;
    position: absolute;
    right: 26px;
    top: 72px;
    display: flex;
    height: 66px;
    box-sizing: border-box;
    align-items: center;
    z-index: 2000;
  }

  .tip-img {
    width: 36px;
    height: 36px;
    background-color: #0064ff;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-left: 30px;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.2);
    position: relative;

    .tip-text {
      position: absolute;
      bottom: -36px;
      left: 50%;
      transform: translateX(-50%);
      white-space: nowrap;
      font-size: 12px;
      line-height: 16px;
    }

    img {
      width: 20px;
      height: 20px;
    }
  }

  .tip-content-wrapper {
    overflow: hidden;
    white-space: nowrap;
    max-width: 900px;
    // height: 78px;
    line-height: 1.5;
    will-change: max-width;
    background: #f8fbff;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.2);
    padding: 6px 12px;
    box-sizing: border-box;
    border-radius: 4px;
    font-size: 14px;
    color: rgba(8, 18, 37, 0.88);
    z-index: 2000;
  }

  .expand-enter-active,
  .expand-leave-active {
    transition:
      max-width 0.3s ease,
      opacity 0.2s ease;
    opacity: 1;
  }

  .expand-enter-from,
  .expand-leave-to {
    max-width: 0;
    opacity: 0;
  }
}

.picList {
  // overflow-y: auto;
  margin-top: 0.833333vw;
}

.shouqi {
  font-family: PingFang SC;
  font-size: 0.729167vw;
  font-weight: normal;
  text-transform: capitalize;
  letter-spacing: normal;
  /* 主题色/主色 */
  color: #0064ff;
  cursor: pointer;
}

.zhankai {
  width: 2.395833vw;
  height: 1.666667vw;
}

.tisheng {
  border-radius: 4px;
  border: 1px solid #0064ff;
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: normal;
  letter-spacing: normal;
  color: #0064ff;
  cursor: pointer;
  margin: 0 10px;
  width: 116px;
  height: 32px;
  line-height: 32px;
  text-align: center;
}

.good {
  margin-left: 0;
  background: #0064ff;
  color: #ffffff;
}

.collect-btn {
  color: #0064ff;
  border: 1px solid #0064ff;
}

.el-button.commonResetBtn {
  font-size: 14px;
}
</style>
