<!--
 * @Date: 2025-01-03 16:22:21
-->
<template>
  <div>
    <!--  -->
    <div style="padding: 20px; box-sizing: border-box">
      <SWForm ref="SWFormRef" :fields="configList" @search="handleSearch" :categoryList="categoryList"
        @reset="handleReset" @add="addItem" />
      <div style="margin-left: -20px; margin-top: -5px; margin-bottom: 10px;position: relative;">
        <CustonTabs v-model="activeTab" />
        <div style="height: 100%;position: absolute;top: -5px;right: 0;display: flex;align-items: center;">
          <el-button @click="addItem" type="primary">新增</el-button>
        </div>
      </div>

      <div class="row-center" style="margin-bottom: 16px;">
        <img src="@/assets/imgs/common/warning_icon.png" alt="" style="width: 14px;height: 14px">
        <div style="font-size: 14px;color: #E26A00;margin-left: 5px;">点击标签即可进行切换以便于查看不同状态下的内容详情</div>
      </div>
      <!--  -->
      <div v-loading="loading" element-loading-text="数据加载中..." class="cards-container">
        <CardItem v-if="oaCustomTabsStore().npDesignPictureGodownDtos.length"
          v-for="(card, index) in oaCustomTabsStore().npDesignPictureGodownDtos" :key="index" @success="handleSuccess"
          :item="card" :designerName="card.submitPersonName" :style-object="getCardStyle(index)">
          <div v-if="card.isCore === 'S'" class="productIsCoreBg">核心品</div>
          <div>
            <span class="title-contetn">
              <span class="title">{{ card.planName }}</span>
              <div class="planningTime" :style="{
                backgroundColor:
                  card.examineStatus === '1'
                    ? '#ffa5000f'
                    : card.chooseStatus === '4'
                      ? '#FF00000f'
                      : '#4862280f'
              }">
                <img src="@/assets/imgs/oa/label_icon.png" class="" />
                {{ card.planningTime }}
              </div>
            </span>
            <div class="design_container" @click="editItem(card, 'view')">
              <div class="flex-row1">
                <div class="img">
                  <img :src="formatOnePic(card.productPicture) ||
                    'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/newProduct/default_design.png'
                    " class="logo" style="height: 196px;" />
                  <div class="artWorkNum">
                    <div class="pb4px">图稿编号:</div>
                    <div class="text1">{{ card.artworkNumber || '-' }}</div>
                  </div>
                </div>
                <div class="flex-column info-wapper">
                  <div class="flex-row">
                    <div class="info-item" style="width: 40%">
                      <div class="label-title">品类</div>
                      <div class="value">{{
                        (card.completeCategoryName) || ''
                      }}</div>
                    </div>
                    <div class="info-item" style="width: calc(60% - 5px); margin-left: 5px">
                      <div class="label-title">系列</div>
                      <el-tooltip :content="card.classCode" placement="bottom" :disabled="card.classCode?.length < 6">
                        <div class="value" style="
                            max-width: 100px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                          ">{{ card.classCode }}</div>
                      </el-tooltip>
                    </div>
                  </div>

                  <div class="info-item">
                    <div class="label-title">品类卖点</div>
                    <div class="value salePoint">
                      <el-popover placement="bottom" :width="200" trigger="hover"
                        :disabled="getIsSalePointOverflow(card.salePoint)">
                        <div>
                          <ElScrollbar max-height="300px">
                            <div v-html="card.salePoint"></div>
                          </ElScrollbar>
                        </div>
                        <template #reference>
                          <div class="detail-content-row-item-value" style="max-width: 88%">{{
                            getDisplaySalePoint(card.salePoint)
                          }}</div>
                        </template>
                      </el-popover>
                    </div>
                  </div>
                  <div>
                    <div class="p-[2px_7px_2px_2px] inline-flex items-center text-12px rounded-10px" :class="[
                      card.productType === '0' ? 'market-shape' : '',
                      card.productType === '1' ? 'design-shape' : ''
                    ]">
                      <el-avatar :size="18" :src="card.submitPersonAvatar"></el-avatar>
                      <span class="ml-4px">{{ card.submitPersonName || '--' }}</span>
                      <div class="split w-1px h-14px bg-[rgba(51,65,93,0.4)] ml-6px rounded-1px"></div>
                      <span class="ml-6px">{{ getProductType(card.productType) }}</span>
                    </div>
                    <!-- <div class="tip" :class="{ 'market-tip': card.productType == 0 }"
                      >{{
                        card.productType == 0 ? '买手款' : card.productType == 1 ? '定制款' : ''
                      }}
                    </div>
                    <div class="tip">
                      <el-tooltip :content="card.submitPersonName" placement="bottom">
                        {{ card.submitPersonName || '--' }}
                      </el-tooltip>
                    </div> -->
                  </div>
                </div>
              </div>
              <!-- <div style="width: 100%;font-size: 10px;color: #333333;padding-top: 3px;">
                图稿编号:
              </div>
              <div style="font-size: 14px;padding-top: 3px;color: #666666;">{{ card.artworkNumber || '-' }}</div> -->
              <img :src="iconUrl(card.examineStatus)" class="design_container-icon"
                v-if="card.examineStatus == '1' || card.examineStatus == '2'" />
            </div>
            <div class="design-bottomBtn">
              <div class="flex-row" style="margin-top: 11px">
                <div class="btn edit" @click="editItem(card, 'edit')" @mouseover="hover = true"
                  @mouseleave="hover = false" :class="[
                    { 'hover-status-2': card.examineStatus === '1' && hover },
                    { 'hover-status-3': card.examineStatus === '2' && hover },
                    { 'hover-status-4': card.chooseStatus === '4' && hover },
                    {
                      'hover-status-default':
                        card.examineStatus !== '1' && card.examineStatus !== '2' && hover
                    }
                  ]" v-if="!(card.examineStatus == '2')">
                  <img src="@/assets/imgs/oa/edit.png" class="icon normal" />
                  <img src="@/assets/imgs/oa/edit-activity.png" class="icon activity" />
                  <span>
                    {{ card.examineStatus !== '1' ? '编辑' : '再次编辑' }}
                  </span>
                </div>
                <!-- 买手款与定制款逻辑一致 && card.productType != 0 -->
                <div class="shenhe btn" @click.stop="shenhe(card)" @mouseover="hover = true" @mouseleave="hover = false"
                  :class="[
                    { 'hover-status-2': card.examineStatus === '1' && hover },
                    { 'hover-status-3': card.examineStatus === '2' && hover },
                    ,
                    { 'hover-status-4': card.chooseStatus === '4' && hover },
                    {
                      'hover-status-default':
                        card.examineStatus !== '1' && card.examineStatus !== '2' && hover
                    }
                  ]" v-if="
                    card.examineStatus != '2' && card.examineStatus !== '1'
                  ">
                  <img src="@/assets/imgs/oa/shenhe.png" class="icon normal" />
                  <img src="@/assets/imgs/oa/shenhe-activity.png" class="icon activity" />
                  审核
                </div>

                <div class="deleteBtn btn" @click.stop="deleteDesign(card)" @mouseover="hover = true"
                  @mouseleave="hover = false" :class="[
                    { 'hover-status-2': card.examineStatus === '1' && hover },
                    { 'hover-status-3': card.examineStatus === '2' && hover },
                    ,
                    { 'hover-status-4': card.chooseStatus === '4' && hover },
                    {
                      'hover-status-default':
                        card.examineStatus !== '1' && card.examineStatus !== '2' && hover
                    }
                  ]" v-if="card.examineStatus === '0' && card.chooseStatus === '0'">
                  <img src="@/assets/imgs/oa/delete.png" class="icon normal" />
                  <img src="@/assets/imgs/oa/delete_white.png" class="icon activity" />
                  删除
                </div>

                <div @click.stop="openMatchSupplierDrawer(card)" class="yangyi btn" @mouseover="hover = true"
                  @mouseleave="hover = false" :class="[
                    { 'hover-status-2': card.examineStatus === '1' && hover },
                    { 'hover-status-3': card.examineStatus === '2' && hover },
                    ,
                    { 'hover-status-4': card.chooseStatus === '4' && hover },
                    {
                      'hover-status-default':
                        card.examineStatus !== '1' && card.examineStatus !== '2' && hover
                    }
                  ]" v-if="card.examineStatus !== '0' && card.workmanshipStatus === 1">
                  <img src="@/assets/svgs/newProduct/supplier.svg" class="icon normal" />
                  <img src="@/assets/svgs/newProduct/supplier_active.svg" class="icon activity" />
                  供应商
                </div>
                <!-- v-if="card.displayShowUploadWorkmanshipBtn" -->
                <div @click.stop="openUploadTechniqueFiles(card)" class="yangyi btn" @mouseover="hover = true"
                  @mouseleave="hover = false" :class="[
                    { 'hover-status-2': card.examineStatus === '1' && hover },
                    { 'hover-status-3': card.examineStatus === '2' && hover },
                    ,
                    { 'hover-status-4': card.chooseStatus === '4' && hover },
                    {
                      'hover-status-default':
                        card.examineStatus !== '1' && card.examineStatus !== '2' && hover
                    }
                  ]" v-if="card.displayShowUploadWorkmanshipBtn">
                  设计工艺单
                </div>
                <!-- <div
                  @click.stop="openQuotation(card)"
                  class="yangyi btn"
                  @mouseover="hover = true"
                  @mouseleave="hover = false"
                  :class="[
                    { 'hover-status-2': card.examineStatus === '1' && hover },
                    { 'hover-status-3': card.examineStatus === '2' && hover },
                    ,
                    { 'hover-status-4': card.chooseStatus === '4' && hover },
                    {
                      'hover-status-default':
                        card.examineStatus !== '1' && card.examineStatus !== '2' && hover
                    }
                  ]"
                >
                  <img src="@/assets/svgs/newProduct/quota.svg" class="icon normal" />
                  <img src="@/assets/svgs/newProduct/quota_active.svg" class="icon activity" />
                  报价核价
                </div> -->

                <el-popover placement="right" :popper-style="{ width: '500px' }" :show-arrow="false">
                  <template #reference>
                    <div class="dayangProgress btn" @click.stop="progressEdit(card)"
                      @mouseenter="getSampleProgressList(card)" @mouseover="hover = true" @mouseleave="hover = false"
                      :class="[
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
                        <img src="@/assets/imgs/oa/dayang.png" class="icon normal" />
                        <img src="@/assets/imgs/oa/dayang-activity.png" class="icon activity" />
                        打样进度
                      </div>
                      <!-- v-if="isFlagNewShow(card.newSampleProgressTime)" -->

                      <img v-if="card.displayShowNewIcon" src="@/assets/imgs/oa/flag_new.png" class="flagNew" />
                      <div v-if="card.displayShowNewIcon" class="flagNewTip">
                        <img class="flagNewTip-icon" src="@/assets/imgs/oa/flag_tips.png" />
                        <div class="flagNewTip-text">24小时内有更新</div>
                      </div>
                    </div>
                  </template>
                  <sampleProgressTable :list="sampleProgressList" :loading="sampleProgressLoading" />
                </el-popover>

              </div>
              <!-- 等待匹配供应商 -->
              <div class="wait-wapper" v-if="card.displayShowWaitMatchSupplierRedFont">
                <img src="@/assets/imgs/oa/wait-icon.png" class="wait-icon" />
                <span class="desc">等待匹配供应商</span>
              </div>
              <!-- 等待上传设计工艺单 -->
              <div class="wait-wapper" v-if="card.displayShowUploadWorkmanshipRedFont">
                <img src="@/assets/imgs/oa/wait-icon.png" class="wait-icon" />
                <span class="desc">等待上传设计工艺单</span>
              </div>
            </div>
          </div>
        </CardItem>

        <div v-else class="empty">
          暂无数据
        </div>
      </div>
      <div class="pagination">
        <Pagination v-model:limit="form.size" v-model:page="form.page" :total="total" @pagination="getList"
          :page-sizes="[30, 60, 90, 100]" />
      </div>
    </div>

    <!-- 审核 -->
    <RevireDialog v-model="dialogVisible" :selectItem="selectItem" @confirm="handleConfirm" />
    <!-- 样衣上传 -->
    <!-- <GoodUploadDialog
      v-model="uploadDialogVisible"
      :selectItem="selectItem"
      @confirm="handleConfirm"
      @cancel="handleCancle"
    /> -->
    <!-- 打样进度 -->
    <DayangProgressDialog v-model="dayangProgresDialogVisible" :selectItem="selectItem" @confirm="handleConfirm"
      @cancel="handleCancle" />

    <DayangProgressDialogNew ref="dayangProgresDialogNewVisible" @confirm="handleConfirm" />

    <!-- 选中 -->
    <AffiliateProgram ref="affiliateProgram" @confirm="handleAffiliateProgram" />
    <AddDialog ref="addDialog" @success="handleSuccess" @close="handleClose" />
    <!-- 重新匹配供应商 -->
    <!-- <SelectSupplier @success="handleSuccess" ref="selectSupplierRef" /> -->

    <!-- 匹配供应商 -->
    <matchSupplierDrawer @success="handleSuccess" ref="matchSupplierDrawerRef" />

    <!-- 上传工艺文件 -->
    <uploadTechniqueFiles ref="uploadTechniqueFilesRef" @success="handleSuccess" />

    <!-- 报价核价 -->
    <QuotationVerification ref="quotationVerificationRef" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" setup>
import {
  deleteDesignPicture,
  getConDesign,
  getDesignPictureList,
  getSampleProgressDetail
} from '@/api/oa/new/designGallery/index'
import { oaCustomTabsStore } from '@/store/modules/oaCustomTabs'
import { useCategoryConfig } from '@/views/OA/new/designGallery/hooks'
import dayjs from 'dayjs'
import { useCategoryList } from '../../product/hooks'
import { usePeopleList } from '../hooks'
import AddDialog from './addDialog.vue'
import AffiliateProgram from './affiliateProgram.vue'
import CardItem from './cardItem.vue'
import CustonTabs from './custonTabs.vue'
import DayangProgressDialog from './dayangProgressDialog.vue'
import DayangProgressDialogNew from './dayangProgressDialogNew.vue'
// import SelectSupplier from './progressDialogComponents/selectSupplier.vue'
import matchSupplierDrawer from '../../develop/components/matchSuppierDrawer.vue'
import uploadTechniqueFiles from './uploadTechniqueFiles.vue'
import sampleProgressTable from './sampleProgressTable.vue'
import QuotationVerification from './progressDialogComponents/quotationVerification.vue'

const quotationVerificationRef = ref()
const openQuotation = (card) => {
  quotationVerificationRef.value?.open(card)
}

const uploadTechniqueFilesRef = ref()
const openUploadTechniqueFiles = (card) => {
  uploadTechniqueFilesRef.value?.open(card)
}

const sampleProgressList = ref([])
const sampleProgressLoading = ref(false)
const getSampleProgressList = async (card: any) => {
  sampleProgressLoading.value = true
  try {
    sampleProgressList.value = []
    const params = {
      pictureId: card.id,
      flowStatus: '6'
    }
    const res = await getSampleProgressDetail(params)
    sampleProgressList.value = res || []
  } catch (err) {

  } finally {
    sampleProgressLoading.value = false
  }

}

import RevireDialog from './revireDialog.vue'
import SWForm from './SWForm.vue'

const message = useMessage() // 消息弹窗
const { categoryList, initSelectData } = useCategoryList()

const { getNameByCode } = useCategoryConfig()

const route = useRoute()
const productNumber = route.query.productNumber || undefined

const props = defineProps({
  ids: { default: '' },
  configList: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  form1: {
    type: Object,
    required: true,
    default: () => {
      return {
        page: 1,
        size: 30
      }
    }
  }
})

const hover = ref(false)

const getCardStyle = (index) => {
  return {
    marginRight: index % 4 === 3 ? '15px' : '15px'
  }
}

const form = ref<any>({
  page: 1,
  size: 30,
  productType: undefined,
  chooseStatus: undefined,
  productStatus: undefined,
  enterprisePlanId: undefined,
  productNumber: productNumber ? productNumber : undefined,
  ids: undefined
})

const formatOnePic = (url) => {
  if (url) {
    return `${url.split(',')[0]}?x-oss-process=image/quality,q_50`
  }
  return ''
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
  var formData = new FormData()
  formData.append(
    'queryParam',
    JSON.stringify({
      ...form.value,
      page: undefined,
      size: undefined
    })
  )

  const res = await getConDesign({ data: formData })
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
    enterprisePlanId: form.value.enterprisePlanId // 确保保留enterprisePlanId属性
  })

  changeSearchTabs()
  getList()
}

watchEffect(() => {
  props.ids && (form.value = { ...form.value, ids: props.ids });
})

const handleReset = () => {
  const key = tabsMap.value[activeTab.value]
  resetMap()
  let tabKey = ''
  let tabValue = ''
  if (key) {
    const [prop, value] = key.split('-')
    form.value[prop] = value
    tabKey = prop
    tabValue = value
  }

  console.log('电视剧付了款jk', key, form.value)

  form.value = {
    page: 1,
    size: 30
  }
  form.value[tabKey] = tabValue
  getList()
  getCont()
}

const dialogVisible = ref(false)
// const uploadDialogVisible = ref(false)
const dayangProgresDialogVisible = ref(false)
const dayangProgresDialogNewVisible = ref()

const handleConfirm = async () => {
  await getList()
  getCont()
}

const handleCancle = () => {
  selectItem.value = {}
}

const handleAffiliateProgram = async (item) => {
  addDialog.value.open(item)
}

// 卡片列表类型
interface CardItem {
  id?: string
  selected?: boolean
  planName?: string
  category?: string
  classCode?: string
  planCode?: string
  productNumber?: string
  productType?: number
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
  npDesignPictureGodownDtos: CardItem[]
}

const listDetail = ref<ListDetail>({
  allCon: 0,
  chooseCon: 0,
  designCon: 0,
  dpCon: 0,
  marketCon: 0,
  noChooseCon: 0,
  npDesignPictureGodownDtos: []
})

const tabs = ref([
  { label: '全部', count: 0 },
  // { label: '买手款', count: 0 },
  // { label: '定制款', count: 0 },
  // { label: '计划', count: 0 },
  // { label: '临时', count: 0 },
  // { label: '优化', count: 0 },
  // { label: '迭代', count: 0 },
  { label: '打样中', count: 0 },
  { label: '待审核', count: 0 },
  { label: '选品会', count: 0 },
  { label: '待匹配', count: 0 },
  { label: '已选中', count: 0 },
  { label: '已淘汰', count: 0 }
  // { label: '核心品', count: 0 }
])

oaCustomTabsStore().tabs = tabs.value

const activeTab = ref(0)

const tabsMap = ref({
  // 1: 'productType-0', // 买手款
  // 2: 'productType-1', // 定制款
  // 3: 'planType-0', // 计划
  // 4: 'planType-1', // 临时
  // 5: 'planProductType-2', // 优化
  // 6: 'planProductType-3', // 迭代
  1: 'type-sampleCon', // 打样中
  2: 'type-waitExamineCon', // 待审核
  3: 'chooseStatus-3', // 选品会
  4: 'type-waitSupplierCon', // 待匹配
  5: 'chooseStatus-2', // 已选中
  6: 'chooseStatus-4', // 已淘汰
  // 13: 'isCore-S' // 核心品
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
  form.value.productType = undefined
  form.value.planType = undefined
  form.value.planProductType = undefined
  form.value.chooseStatus = undefined
  form.value.type = undefined
  form.value.isCore = undefined

  if (key) {
    const [prop, value] = key.split('-')
    form.value = { page: 1, size: 30, [prop]: value }
  }
  console.log('电视剧付了款jk11', key, form.value)

  getCont()
  getList()
})

const resetMap = () => {
  form.value = {
    ...form.value,
    // @ts-ignore
    productType: undefined,
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

const editItem = (res, type) => {
  const item = {
    devPlanId: res.developmentPlanId,
    enterprisePlanId: res.enterprisePlanId,
    id: res.id
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
  if (item.id) {
    await deleteDesignPicture(item.id)
    message.success('删除成功')
    getList()
  }
}

const selectSupplierRef = ref()
// 重新匹配供应商
const selectSupplier = (item) => {
  selectSupplierRef.value.open(item)
}

//  匹配供应商
const matchSupplierDrawerRef = ref()
const openMatchSupplierDrawer = (item: any) => {
  matchSupplierDrawerRef.value.open(item)
}

// const goodsUpload = (item) => {
//   selectItem.value = item
//   uploadDialogVisible.value = true
// }

// 打样进度编辑
const progressEdit = (item) => {
  // console.log('打样进度编辑', item)
  // selectItem.value = { ...item, designName: getName(item.submitPerson) }
  // dayangProgresDialogVisible.value = true
  dayangProgresDialogNewVisible.value.open(item)
}

const total = ref(0)

const loading = ref(false)
const getList = async (isNeedJump = false) => {
  var formData = new FormData()
  formData.append(
    'queryParam',
    JSON.stringify({
      ...form.value,
      page: undefined,
      size: undefined
    })
  )

  if (orderParam.value.custorOrder) {
    formData.append(
      'orderParam',
      JSON.stringify({
        [orderParam.value.prop]: orderParam.value.custorOrder
      })
    )
  }
  loading.value = true
  const res = await getDesignPictureList(form.value).catch((err) => {
    loading.value = false
  })
  if (res && res.records.length > 0) {
    listDetail.value.npDesignPictureGodownDtos = res.records || []

    openItemId.value =
      listDetail.value.npDesignPictureGodownDtos.find(
        (row: any) => row.developmentPlanId === route.query.developId
      )?.id || ''
  } else {
    listDetail.value.npDesignPictureGodownDtos = []
    // 需求跳转新增设计图
    // if (isNeedJump) {
    //   openAddDesignDialog()
    // }
  }
  loading.value = false

  total.value = (res && res.total) || 0
  listDetail.value.npDesignPictureGodownDtos =
    listDetail.value.npDesignPictureGodownDtos &&
    listDetail.value.npDesignPictureGodownDtos.map((item) => {
      return {
        ...item,
        selected: false
      }
    })

  oaCustomTabsStore().npDesignPictureGodownDtos = listDetail.value.npDesignPictureGodownDtos
  await nextTick() //新增完刷新页面
  form.value.ids = undefined;
}
const orderParam = ref({
  prop: '',
  custorOrder: null
})

//打开设计图弹框
const openAddDesignDialog = () => {
  addDialog.value.open({ devPlanId: '', id: route.query.developId, enterprisePlanId: '111' })
}

// 更新 tabs 数量
const changeTabs = () => {
  tabs.value = [
    { label: '全部', count: contDetail.value.allCon },
    // { label: '买手款', count: contDetail.value.marketCon },
    // { label: '定制款', count: contDetail.value.designCon },
    // { label: '计划', count: contDetail.value.enterprisePlanCon },
    // { label: '临时', count: contDetail.value.enterprisePlanTempCon },
    // { label: '优化', count: contDetail.value.enterprisePlanOptimizeCon },
    // { label: '迭代', count: contDetail.value.enterprisePlanIterationCon },
    { label: '打样中', count: contDetail.value.sampleCon },
    { label: '待审核', count: contDetail.value.waitExamineCon },
    { label: '选品会', count: contDetail.value.waitChooseCon },
    { label: '待匹配', count: contDetail.value.waitSupplierCon },
    { label: '已选中', count: contDetail.value.chooseCon },
    { label: '已淘汰', count: contDetail.value.noChooseCon },
    // { label: '核心品', count: contDetail.value.coreCon }
  ]
  oaCustomTabsStore().tabs = tabs.value
  console.log('tabs', oaCustomTabsStore().tabs)
}
// const custonTabsRef = ref<any>(null)
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
const openItemId = ref('')
const autoOpenAddDialog = (id: any, devPlanId: any) => {
  addDialog.value.open({ devPlanId, id: openItemId.value, enterprisePlanId: id })
}

const contDetail = ref()
const getCont = async () => {
  // var formData = new FormData()
  // formData.append(
  //   'queryParam',
  //   JSON.stringify({
  //     productNumber: productNumber,
  //     enterprisePlanId: form.value.enterprisePlanId
  //   })
  // )
  const res = await getConDesign({
    productNumber: productNumber,
    enterprisePlanId: form.value.enterprisePlanId
  })
  contDetail.value = res
  changeTabs()
}

defineExpose({
  autoOpenAddDialog
})

const iconUrl = (examineStatus) => {
  switch (examineStatus) {
    case '1':
      return 'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/visualApproval/877444744-reject-icon.png'
    case '2':
      return 'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/visualApproval/265091067-pass-icon.png'

    default:
      return ''
  }
}

const emit = defineEmits(['addDialogClose'])
onActivated(() => {
  handleRouteParam()
})

const handleRouteParam = () => {
  let productNumber1 = route.query.productNumber
  if (productNumber1) {
    form.value.productNumber = productNumber1 + ''
    SWFormRef.value.setSearchProductNumberValue(productNumber1)
    getList(true)
  }
}
if (productNumber) {
  const newUrl = window.location.href.replace(/\?.*$/, '') // 获取当前路径，并去除参数
  history.replaceState({}, '', newUrl)
}

// 是否显示提醒 如果这个时间距离当前时间在24小时以内就展示新动态提醒,否则不展示
const isFlagNewShow = (newTime) => {
  if (!newTime) return false
  return dayjs().diff(dayjs(newTime), 'hour') < 24
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

function getProductType(productType: string) {
  if (productType === '0') {
    return '买手款'
  } else if (productType === '1') {
    return '定制款'
  } else {
    return ''
  }
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
  width: 100%;
  justify-content: flex-start;
  flex-wrap: wrap;
  row-gap: 20px;
  margin-top: 0;

  .design_container {
    position: relative;
    width: 365px;
    height: 240px;
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

  .design-bottomBtn {}

  .title-contetn {
    display: inline-block;
    // margin-bottom: 16px;
    margin-left: 20px;

    .planningTime {
      background: #4862280f;
      // background:  #ffa5000f;
      border-radius: 12px;
      padding: 2px 10px;
      font-size: 12px;
      color: #666666;
      margin-top: 8px;
      margin-bottom: 10px;
      width: fit-content;

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
    border-radius: 10px;
  }

  .info-wapper {
    flex: 1;
    justify-content: flex-start;
  }
}

.flex-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.flex-row1 {
  display: flex;
  flex-direction: row;

  .img {
    position: relative;
    height: 196px;

    .artWorkNum {
      position: absolute;
      bottom: 0px;
      box-sizing: border-box;
      width: 180px;
      border-radius: 0 0 10px 10px;
      padding: 4px;
      font-size: 12px;
      color: #fff;
      background: rgba(0, 0, 0, 0.5);
    }
  }
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
    font-family:
      PingFangSC,
      PingFang SC;
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
  width: 60px;
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
  text-align: left;
  font-style: normal;
  text-align: center;
  padding: 0 6px;
  box-sizing: border-box;
  margin-right: 4px;
}

.design-shape {
  background: rgba(253, 230, 176, 0.51);
  color: #c68b00;
}

.market-shape {
  background: rgba(183, 238, 246, 0.51);
  color: rgb(3, 163, 182);
}

.market-tip {
  background: rgba(183, 238, 246, 0.51);
  color: rgb(3, 163, 182);
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
  // margin-top: 16px;
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

// .btn:hover {
//   border: 1px solid #8cac67;
//   color: #5b7c33;
// }

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

.pagination {
  width: calc(100%);
  margin-bottom: 50px;
}

.wait-wapper {
  width: 100%;
  height: 32px;
  line-height: 32px;
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;

  // background: rgba(228, 54, 54, 0.1);
  .wait-icon {
    width: 14px;
    height: 14px;
    margin-left: 14px;
  }

  .desc {
    font-size: 12px;
    color: #e43636;
    margin-left: 6px;
  }
}

.productIsCoreBg {
  position: absolute;
  top: -2px;
  right: 0px;
  background-image: url(@/assets/imgs/oa/produce_isCore_bg.svg);
  width: 60px;
  height: 24px;
  font-size: 14px;
  font-weight: 600;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  text-align: center;
  line-height: 24px;
  color: #a26d01;
}

.empty {
  color: #999;
  width: 100%;
  text-align: center;
}
</style>
