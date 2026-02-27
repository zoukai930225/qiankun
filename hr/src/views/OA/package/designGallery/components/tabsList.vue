<!--
 * @Date: 2025-01-03 16:22:21
-->
<template>
  <div>
    <CustonTabs v-model="activeTab" />
    <!--  -->
    <div style="padding: 20px; box-sizing: border-box">
      <SWForm ref="SWFormRef" @search="handleSearch" :categoryList="categoryList" @reset="handleReset" @add="addItem" />

      <!--  -->
      <div class="cards-container">
        <CardItem v-for="(card, index) in oaCustomTabsStorePackage().records" :key="index" @success="handleSuccess"
          :item="card" :style-object="getCardStyle(index)">
          <div>
            <span class="title-contetn">
              <span class="title">{{ card.planName }}</span>
              <div class="planningTime" :style="{
                backgroundColor:
                  card.examineStatus == '1'
                    ? '#ffa5000f'
                    : card.chooseStatus == '4'
                      ? '#FF00000f'
                      : '#4862280f'
              }">
                <img src="@/assets/imgs/oa/label_icon.png" alt="" />
                {{ card.planningTime }}
              </div>
            </span>
            <div class="design_container" @click="editItem(card, 'view')">
              <div class="flex-row">
                <preview-image :url="card.productPictureUrl || defaultImg" class="logo" />
                <div class="flex-column info-wapper">
                  <div class="flex-row">
                    <div class="info-item">
                      <div class="label-title">系列</div>
                      <el-tooltip :content="card.series" placement="bottom" :disabled="card.series?.length < 6">
                        <div class="value" style="
                            max-width: 100px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                          ">{{ card.series }}</div>
                      </el-tooltip>
                    </div>
                  </div>

                  <div class="info-item">
                    <div class="label-title">系列备注</div>
                    <div class="value salePoint">
                      <el-popover placement="bottom" :width="200" trigger="hover"
                        :disabled="getIsSalePointOverflow(card.seriesRemark)">
                        <div>
                          <ElScrollbar max-height="300px">
                            <div v-html="card.seriesRemark"></div>
                          </ElScrollbar>
                        </div>
                        <template #reference>
                          <div class="detail-content-row-item-value" style="max-width: 88%">{{
                            getDisplaySalePoint(card.seriesRemark)
                          }}</div>
                        </template>
                      </el-popover>
                    </div>
                  </div>

                  <div class="flex-row">
                    <div class="tip">
                      <el-tooltip :content="card.designerName" placement="bottom">
                        {{ card.designerName }}
                      </el-tooltip>
                    </div>
                  </div>
                </div>
              </div>
              <img :src="iconUrl(card.examineStatus)" class="design_container-icon"
                v-if="card.examineStatus == '1' || card.examineStatus == '2'" alt="" />
            </div>
            <div class="design-bottomBtn">
              <div class="flex-row" style="margin-top: 11px">
                <div class="btn edit" @click="editItem(card, 'edit')" @mouseover="hover = true"
                  @mouseleave="hover = false" v-if="card.disPlayEditorButton || card.disPlayEditorAgainButton" :class="[
                    { 'hover-status-2': card.examineStatus == '2' && hover },
                    { 'hover-status-3': card.examineStatus == '1' && hover },
                    { 'hover-status-4': card.chooseStatus == '4' && hover },
                    {
                      'hover-status-default':
                        card.examineStatus != '2' && card.examineStatus != '1' && hover
                    }
                  ]">
                  <img src="@/assets/imgs/oa/edit.png" class="icon normal" alt="" />
                  <img src="@/assets/imgs/oa/edit-activity.png" class="icon activity" alt="" />
                  <span>
                    {{
                      card.disPlayEditorButton
                        ? '编辑'
                        : card.disPlayEditorAgainButton
                          ? '再次编辑'
                          : ''
                    }}
                  </span>
                </div>

                <div v-if="card.disPlayApprovalButton" class="shenhe btn" @click.stop="shenhe(card)"
                  @mouseover="hover = true" @mouseleave="hover = false" :class="[
                    { 'hover-status-2': card.examineStatus == '1' && hover },
                    { 'hover-status-3': card.examineStatus == '2' && hover },
                    ,
                    { 'hover-status-4': card.chooseStatus == '4' && hover },
                    {
                      'hover-status-default':
                        card.examineStatus != '2' && card.examineStatus != '1' && hover
                    }
                  ]">
                  <img src="@/assets/imgs/oa/shenhe.png" class="icon normal" alt="" />
                  <img src="@/assets/imgs/oa/shenhe-activity.png" class="icon activity" alt="" />
                  审核
                </div>
                <div v-if="card.displaySupplierButton" class="shenhe btn" @click="openMatchSuppierDrawer(card)"
                  @mouseover="hover = true" @mouseleave="hover = false" :class="[
                    { 'hover-status-2': card.examineStatus == '1' && hover },
                    { 'hover-status-3': card.examineStatus == '2' && hover },
                    ,
                    { 'hover-status-4': card.chooseStatus == '4' && hover },
                    {
                      'hover-status-default':
                        card.examineStatus != '2' && card.examineStatus != '1' && hover
                    }
                  ]">
                  <img src="@/assets/imgs/oa/shenhe.png" class="icon normal" alt="" />
                  <img src="@/assets/imgs/oa/shenhe-activity.png" class="icon activity" alt="" />
                  供应商
                </div>

                <div class="dayangProgress btn" @click.stop="progressEdit(card)" @mouseover="hover = true"
                  @mouseleave="hover = false" :class="[
                    { 'hover-status-2': card.examineStatus === '1' && hover },
                    { 'hover-status-3': card.examineStatus === '2' && hover },
                    ,
                    { 'hover-status-4': card.chooseStatus === '4' && hover },
                    {
                      'hover-status-default':
                        card.examineStatus !== '1' && card.examineStatus !== '2' && hover
                    }
                  ]" v-if="card.displayShowSampleProgressBtn" style="position: relative">
                  <div>
                    <img src="@/assets/imgs/oa/dayang.png" class="icon normal" alt="" />
                    <img src="@/assets/imgs/oa/dayang-activity.png" class="icon activity" alt="" />
                    打样进度
                  </div>
                  <img v-if="card.displayShowNewIcon" src="@/assets/imgs/oa/flag_new.png" class="flagNew" alt="" />
                  <div v-if="card.displayShowNewIcon" class="flagNewTip">
                    <img class="flagNewTip-icon" src="@/assets/imgs/oa/flag_tips.png" alt="" />
                    <div class="flagNewTip-text">24小时内有更新</div>
                  </div>
                </div>

                <div v-if="card.disPlayDeleteButton" class="deleteBtn btn" @click.stop="deleteDesign(card)"
                  @mouseover="hover = true" @mouseleave="hover = false" :class="[
                    { 'hover-status-2': card.examineStatus == '2' && hover },
                    { 'hover-status-3': card.examineStatus == '1' && hover },
                    ,
                    { 'hover-status-4': card.chooseStatus == '4' && hover },
                    {
                      'hover-status-default':
                        card.examineStatus != '2' && card.examineStatus != '1' && hover
                    }
                  ]">
                  <img src="@/assets/imgs/oa/delete.png" class="icon normal" alt="" />
                  <img src="@/assets/imgs/oa/delete_white.png" class="icon activity" alt="" />
                  删除
                </div>
              </div>
            </div>
          </div>
        </CardItem>

        <div class="flex-row" style="width: 100%; justify-content: end; margin-top: 20px">
          <!-- 分页 -->
          <Pagination :total="total" v-model:page="form.page" v-model:limit="form.pageSize" @pagination="getList" />
        </div>

        <div class="flex-column empty" v-if="oaCustomTabsStorePackage().records?.length == 0">
          <img class="empty-table" src="@/assets/imgs/promotion/empty.png" alt="" />
          <span>暂无数据</span>
        </div>
      </div>
    </div>

    <!-- 审核 -->
    <RevireDialog v-model="dialogVisible" :selectItem="selectItem" @confirm="handleConfirm" />
    <!-- 样衣上传 -->
    <GoodUploadDialog v-model="uploadDialogVisible" :selectItem="selectItem" @confirm="handleConfirm"
      @cancel="handleCancle" />

    <!-- 打样进度编辑 -->
    <DayangProgressDialogNew ref="dayangProgresDialogNewVisible" @confirm="handleConfirm" />

    <!-- 选中 -->
    <AffiliateProgram ref="affiliateProgram" @confirm="handleAffiliateProgram" />

    <AddDialog ref="addDialog" @success="handleSuccess" @close="handleClose" />
    <!-- 匹配供应商 -->
    <MatchSuppierDrawer ref="matchSuppierDrawerRef" @confirm-success="getList" />
  </div>
</template>

<script lang="ts" setup>
const defaultImg = 'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/newProduct/default_design.png'

import PreviewImage from "@/components/common/image/preview.vue";
import {
  deleteDesignPicture,
  getConDesign,
  getDesignPictureList
} from '@/api/oa/package/designGallery/index'
import { oaCustomTabsStorePackage } from '@/store/modules/oaCustomTabs'
import { useCategoryList } from '../../product/hooks'
import AddDialog from './addDialog.vue'
import AffiliateProgram from './affiliateProgram.vue'
import CardItem from './cardItem.vue'
import CustonTabs from './custonTabs.vue'
import DayangProgressDialogNew from './dayangProgressDialogNew.vue'
import GoodUploadDialog from './goodUploadDialog.vue'
import MatchSuppierDrawer from './matchSuppierDrawer.vue'

import RevireDialog from './revireDialog.vue'
import SWForm from './SWForm.vue'

const message = useMessage() // 消息弹窗
const { categoryList, initSelectData } = useCategoryList()

const total = ref(0)

const route = useRoute()
const productNumber = route.query.productNumber || undefined

const props = defineProps({
  ids: { default: '' },
  form1: {
    type: Object,
    required: true,
    default: () => {
      return {
        page: 1,
        size: 10
      }
    }
  }
})

const hover = ref(false)

const getCardStyle = (index) => {
  return {
    marginRight: index % 4 == 3 ? '0' : '15px'
  }
}

const matchSuppierDrawerRef = ref()
const openMatchSuppierDrawer = (card) => {
  matchSuppierDrawerRef.value.open(card)
}

const form = ref<any>({
  page: 1,
  pageSize: 10,
  chooseStatus: undefined,
  productStatus: undefined,
  enterprisePlanId: undefined,
  productNumber: productNumber ? productNumber : undefined,
  ids: undefined
})

const dayangProgresDialogNewVisible = ref()
// 打样进度编辑
const progressEdit = (item) => {
  dayangProgresDialogNewVisible.value.open(item)
}

watch(
  () => props.form1,
  async (newForm) => {
    //@ts-ignore
    form.value = {
      ...form.value,
      enterprisePlanId: newForm.enterprisePlanId
    }
    getList()
    getCont()
  },
  { deep: true }
)

const changeSearchTabs = async () => {
  const params = {
    ...form.value,
    page: undefined,
    size: undefined
  }
  const res = await getConDesign(params)
  contDetail.value = res

  changeTabs()
}

// 参数变化
const handleSearch = (val: any) => {
  const key = tabsMap.value[activeTab.value]
  resetMap()
  if (key) {
    const [prop, value] = key.split('-')
    form.value[prop] = value
  }
  form.value = Object.assign({}, form.value, val, {
    page: 1,
    designerId: val.designer ? val.designer : undefined,
    designer: undefined,
    enterprisePlanId: form.value.enterprisePlanId // 确保保留enterprisePlanId属性
  })
  form.value.chooseStatus = undefined
  changeSearchTabs()
  getList()
}

const handleReset = () => {
  activeTab.value = -1

  const key = tabsMap.value[activeTab.value]
  resetMap()
  if (key) {
    const [prop, value] = key.split('-')
    form.value[prop] = value
  }

  let chooseStatus = form.value.chooseStatus
  form.value = {
    page: 1,
    size: 10,
    chooseStatus: chooseStatus,
    productStatus: undefined,
    enterprisePlanId: form.value.enterprisePlanId,
    productNumber: undefined,
    ids: undefined
  }
  getList()
  getCont()
}

const dialogVisible = ref(false)
const uploadDialogVisible = ref(false)

const handleConfirm = async () => {
  await getList()
  getCont()
}

const handleCancle = () => {
  selectItem.value = {}
}

// 新增
const handleAffiliateProgram = async (item) => {
  addDialog.value.open(item, 'add')
}

// 卡片列表类型
interface CardItem {
  selected?: boolean
  planName?: string
  category?: string
  classCode?: string
  planCode?: string
  productNumber?: string
  designer?: string
  productPicture?: string
  examineStatus?: string
  chooseStatus?: string
  planningTime?: string
}

interface ListDetail {
  allCon: number
  chooseCon: number
  designCon: number
  dpCon: number
  marketCon: number
  noChooseCon: number
  records: CardItem[]
}

const listDetail = ref<ListDetail>({
  allCon: 0,
  chooseCon: 0,
  designCon: 0,
  dpCon: 0,
  marketCon: 0,
  noChooseCon: 0,
  records: []
})

const tabs = ref([
  { label: '计划', count: 0 },
  { label: '临时', count: 0 },
  { label: '待审核', count: 0 },
  { label: '待匹配', count: 0 },
  { label: '打样中', count: 0 }
])

oaCustomTabsStorePackage().tabs = tabs.value

const activeTab = ref(-1)

const tabsMap = ref({
  3: 'chooseStatus-2', // 选中
  4: 'chooseStatus-4', // 淘汰
  5: 'chooseStatus-3', // 选品会
  6: 'chooseStatus-9', // 未选中
  7: 'isCore-1' // 核心品
})

const SWFormRef = ref<any>(null)

watch(activeTab, (val) => {
  const key = tabsMap.value[val]
  resetMap()

  if (SWFormRef.value) {
    SWFormRef.value.resetQuery()
  }

  // 在切换tab的时候清空下面的查询条件
  form.value.category = undefined //品类
  form.value.classCode = undefined //系列
  form.value.planCode = undefined //任务编号
  form.value.productNumber = undefined //产品编号
  form.value.examineStatus = undefined //审核状态

  if (key) {
    const [prop, value] = key.split('-')
    form.value = { ...form.value, [prop]: value }
  }
  getCont()
  getList()
})

watchEffect(() => {
  props.ids && (form.value = { ...form.value, ids: props.ids });
})

const resetMap = () => {
  form.value = {
    ...form.value,
    chooseStatus: undefined,
    productStatus: undefined,
    isCore: undefined
  }
}

const addDialog = ref()
const affiliateProgram = ref()
const addItem = () => {
  affiliateProgram.value.open()
}

// 编辑 详情
const editItem = (res, type) => {
  const item = {
    ...res
  }
  addDialog.value.open(item, type)
}

const selectItem = ref<CardItem>({})
const shenhe = (item) => {
  selectItem.value = item
  dialogVisible.value = true
}

const deleteDesign = async (item) => {
  // 删除二次确认
  await message.confirm('确认删除吗？')
  if (item.designGalleryId) {
    await deleteDesignPicture(item.designGalleryId)
    message.success('删除成功')
    getList()
  }
}

const getList = async () => {
  console.log(form.value);
  // breadcrumbType 面包屑类型（0:全部 1:计划 2:临时 3: 待审核 4:待匹配 5:打样中）
  const params = {
    ...form.value,
    chooseStatus: undefined,
    breadcrumbType: activeTab.value == -1 ? undefined : activeTab.value + 1,
  }

  const res = await getDesignPictureList(params)
  listDetail.value = res || {}
  total.value = res.total

  listDetail.value.records =
    listDetail.value.records &&
    listDetail.value.records.map((item) => {
      return {
        ...item,
        selected: false
      }
    })
  oaCustomTabsStorePackage().records = listDetail.value.records
  await nextTick() //新增完刷新页面
  form.value.ids = undefined;
}

// 更新 tabs 数量
const changeTabs = () => {
  tabs.value = [
    {
      label: '计划',
      count: contDetail.value.planNumber
    },
    {
      label: '临时',
      count: contDetail.value.tempNumber
    },
    {
      label: '待审核',
      count: contDetail.value.unreviewedNumber
    },
    {
      label: '待匹配',
      count: contDetail.value.toBeMatchedNumber
    },
    {
      label: '打样中',
      count: contDetail.value.samplingNumber
    }
  ]
  oaCustomTabsStorePackage().tabs = tabs.value
}

const handleSuccess = () => {
  form.value = { ...form.value, page: 1 }
  getCont()
  getList()

  emit('addDialogClose')
}

const handleClose = () => {
  emit('addDialogClose')
}

onMounted(() => {
  initSelectData()
  getList()
  getCont()
})

// 自动打开新增弹框
//  企华id。开发任务id
const autoOpenAddDialog = (id: any, devPlanId: any) => {
  addDialog.value.open({ id, devPlanId }, 'add')
}

const contDetail = ref()
const getCont = async () => {
  const params = {
    ...form.value
  }
  const res = await getConDesign(params)
  contDetail.value = res
  changeTabs()
}

defineExpose({
  autoOpenAddDialog
})

const iconUrl = (examineStatus) => {
  switch (examineStatus) {
    case 2:
      return 'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/visualApproval/877444744-reject-icon.png'
    case 1:
      return 'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/visualApproval/265091067-pass-icon.png'

    default:
      return ''
  }
}

const emit = defineEmits(['addDialogClose'])

if (productNumber) {
  const newUrl = window.location.href.replace(/\?.*$/, '') // 获取当前路径，并去除参数
  history.replaceState({}, '', newUrl)
}

// 是否展示品类卖点
const getPlainText = (html) => {
  if (!html) return '【--】'
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html
  return (tempDiv.textContent || tempDiv.innerText || '').trim()
}

// 截断显示的方法
const getDisplaySalePoint = (salePoint) => {
  const plainText = getPlainText(salePoint)
  const maxLength = 40
  return plainText.length <= maxLength ? plainText : plainText.slice(0, maxLength) + '...'
}

// 是否溢出的方法
const getIsSalePointOverflow = (salePoint) => {
  const plainText = getPlainText(salePoint)
  const maxLength = 40
  return plainText.length < maxLength
}
</script>

<style lang="scss" scoped>
.search-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.cards-container {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  row-gap: 20px;
  margin-top: 0;

  .design_container {
    position: relative;
    width: 365px;
    min-height: 216px;
    background: #ffffff;
    border-radius: 10px;
    border: 1px solid #eef1f0;
    padding: 11px 14px;
    box-sizing: border-box;

    &-icon {
      width: 70px;
      height: 50px;
      position: absolute;
      bottom: 0px;
      left: 117px;
    }
  }

  .title-contetn {
    display: inline-block;
    margin-left: 20px;

    .planningTime {
      background: #4862280f;
      border-radius: 12px;
      padding: 2px 10px;
      font-size: 12px;
      color: #666666;
      margin-top: 8px;
      margin-bottom: 10px;

      img {
        vertical-align: middle;
        margin-right: 4px;
      }
    }

    .title {
      display: inline;
      font-weight: bold;
      font-size: 14px;
      color: #333333;
      line-height: 22px;
      font-style: normal;
    }

    .desc {
      height: 5px;
      background: rgba(254, 226, 160, 0.82);
      margin-top: -6px;
    }
  }

  .logo {
    width: 180px;
    height: 186px;
    margin-right: 14px;
  }

  .info-wapper {
    flex: 1;
    justify-content: flex-start;
  }
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.info-item {
  margin-bottom: 8px;
  width: 100%;

  .title {
    font-weight: 400;
    font-size: 14px;
    color: #666666;
    line-height: 20px;
    text-align: left;
    font-style: normal;
  }

  .value {
    font-size: 14px;
    font-weight: bold;
    color: #333333;
    line-height: 17px;
    max-width: 150px;
    word-wrap: break-word;
    overflow-wrap: break-word;
    white-space: normal;
  }

  .label-title {
    font-weight: 400;
    font-size: 12px;
    color: #999999;
    margin-bottom: 5px;
  }

  // 卖点
  .salePoint {
    height: 90px;
  }
}

.tip {
  width: 70px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  height: 21px;
  border-radius: 2px;
  background: rgba(253, 230, 176, 0.51);
  line-height: 21px;
  font-weight: 400;
  font-size: 10px;
  color: #c68b00;
  font-style: normal;
  text-align: center;
  padding: 0 6px;
  box-sizing: border-box;
  margin-right: 4px;
}

.mid {
  margin: 12px auto;
  height: 1px;
  background: rgba(209, 209, 209, 0.35);
}

.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 17px;
  box-sizing: border-box;
  height: 38px;
  line-height: 38px;
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #d0d0d0;
  margin-right: 16px;
  font-weight: 400;
  margin-bottom: 3px;
  font-size: 14px;
  color: #666666;

  .icon {
    width: 12px;
    height: 12px;
    margin-right: 4px;
    vertical-align: middle;
  }
}

/* 鼠标悬停时的样式 */
.hover-status-2:hover {
  background: #ffb022;
  /* 黄色背景 */
  color: #fff;
  border: 1px solid #ffb022;
}

.hover-status-3:hover {
  background: #88b74e;
  /* 绿色背景 */
  color: #fff;
  border: 1px solid #88b74e;
}

.hover-status-default:hover {
  background: #94a3c0;
  /* 灰色背景 */
  color: #fff;
  border: 1px solid #94a3c0;
}

.hover-status-4:hover {
  background: #f57171;
  /* 红色背景 */
  color: #fff;
  border: 1px solid #f57171;
}

.icon.activity {
  display: none;
}

.btn:hover .icon.normal {
  display: none;
}

.btn:hover .icon.activity {
  display: inline;
}

.flagNew {
  position: absolute;
  top: -8px;
  right: 3px;
  width: 43px;
  height: 14.5px;
}

.flagNewTip {
  position: absolute;
  top: 25px;
  display: flex;
  flex-direction: row;
  align-items: center;

  &-icon {
    margin-left: auto;
    width: 10px;
    height: 10px;
  }

  &-text {
    font-size: 10px;
    padding-left: 4px;

    color: #eb3737;
    margin-right: auto;
  }
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  justify-content: center;
  color: #999999;
  margin: 150px 0;
}
</style>
