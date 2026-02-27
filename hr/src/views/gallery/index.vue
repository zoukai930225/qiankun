<template>
  <div>
    <Title ref="titleRef" @update-time-select="updateTimeSelect">
      <!-- <el-button type="primary" @click="onOpenImgDialog">车图图库</el-button> -->
    </Title>
    <!-- 列表 -->
    <ContentWrap style="border-radius: 0px 0px 8px 8px">
      <div class="formList">
        <div class="button">
          <!-- <el-button @click="getList" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button> -->
          <el-button @click="reset" class="commonResetBtn" style="margin-left: 0"> 重置 </el-button>

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
        <el-form ref="formRef" :model="queryParams" label-width="4.166667vw">
          <el-form-item prop="string" label="商品主键" style="margin-bottom: 0.520833vw">
            <!-- 15.625vw -->
            <el-input
              style="width: 12vw"
              v-model="queryParams.searchContent"
              placeholder="请输入商品ID/商品名称/货品编码"
              @keyup.enter="getList"
            />
          </el-form-item>
          <el-form-item
            prop="string"
            label="人员查询"
            style="position: absolute; top: 1.041667vw; left: 17vw"
          >
            <el-select
              style="width: 12vw; margin-right: 1.5625vw"
              v-model="queryParams.personType"
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
                style="width: 12vw"
                v-if="queryParams.personType"
                :isEdit="true"
                :multiple="false"
                v-model="personId"
                :getSearchList="remoteMethod"
                @select-people-change="getList"
                @clear="getList"
              />
            </div>
          </el-form-item>
          <el-form-item
            prop="sfsj"
            label="上架状态"
            :style="{
              position: 'absolute',
              top: '1.041667vw',
              left: queryParams.personType ? '47.5vw' : '34vw'
            }"
          >
            <el-select
              style="width: 12vw; margin-right: 1.5625vw"
              v-model="queryParams.sfsj"
              placeholder="请选择上架状态"
              clearable
              @change="getList"
            >
              <el-option :value="1" label="已上架" />
              <el-option :value="0" label="未上架" />
            </el-select>
          </el-form-item>
          <el-form-item
            label="更新人"
            :style="{
              position: 'absolute',
              top: '1.041667vw',
              left: queryParams.personType ? '64.5vw' : '51vw'
            }"
          >
            <el-input
              style="width: 12vw"
              v-model="queryParams.operationUserName"
              placeholder="请输入更新人姓名"
              @keyup.enter="getList"
              clearable
            />
          </el-form-item>
          <el-form-item prop="string" label="渠道" v-show="!isOpen">
            <div
              class="storeItem"
              :class="{ actived: activeStore === 'TaoBao' }"
              @click="storeChange('TaoBao')"
              >淘宝
            </div>
            <div
              class="storeItem"
              :class="{ actived: activeStore === 'Tmall' }"
              @click="storeChange('Tmall')"
              >天猫</div
            >
          </el-form-item>
          <el-form-item prop="string" label="图片类型" v-show="!isOpen">
            <div
              class="storeItem"
              :class="{ actived: activePicType === '1' }"
              @click="picTypeChange('1')"
              >主图(含车图)</div
            >
            <div
              class="storeItem"
              :class="{ actived: activePicType === '0' }"
              @click="picTypeChange('0')"
              >主图(无车图)</div
            >
          </el-form-item>
          <el-form-item prop="string" label="类目" v-show="!isOpen">
            <div
              v-for="(item, index) in TypeList"
              :key="index"
              class="storeItem"
              :class="{ actived: activeCloseType === item.value }"
              @click="CloseTypeChange(item.value)"
              >{{ item.name }}
            </div>
          </el-form-item>
          <el-form-item
            prop="string"
            label="高级搜索"
            v-show="!isOpen"
            class="advanced-search-item"
          >
            <div class="store-item-container">
              <div
                class="storeItem"
                :class="{ actived: activeWJType === '4' }"
                @click="activeWJTypeChange('4')"
                >销量正序
              </div>
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
            <div class="button-item">
              <el-button @click="addClick" type="primary"
                ><el-icon class="mr-4px"><Plus /></el-icon>新增</el-button
              >
              <el-button @click="syncData" type="primary">同步数据</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :header-cell-style="appStore.headerCellStyle"
        v-loading="loading"
        :data="list"
        :stripe="true"
        :show-overflow-tooltip="true"
        class="SWCommonTable"
        v-horizontal-scroll="'always'"
        @sort-change="handleSortChange"
      >
        <template #header="scope">
          <!-- 自定义图标 -->
          <div class="row-center">
            <div class="tableHeaderText">{{ scope.column.label }}</div>
          </div>
        </template>
        <el-table-column prop="name" width="247" :show-overflow-tooltip="false" label="商品" fixed>
          <template #default="scope">
            <div
              class="row-center"
              @click="getUrlByTypeAndId(scope.row.channel || 'TaoBao', scope.row.goodsId)"
              style="margin-top: 0.208333vw; margin-bottom: 0.15625vw; cursor: pointer"
            >
              <el-popover
                placement="right"
                :width="348"
                trigger="hover"
                :show-arrow="false"
                :offset="20"
              >
                <template #reference>
                  <div class="goodImg">
                    <img
                      style="width: 2.395833vw; height: 2.395833vw; border-radius: 0.208333vw"
                      :src="(scope.row.productImage && scope.row.productImage.fileUrl) || ''"
                    />
                  </div>
                </template>
                <GoodCard
                  :good="{
                    materialName: scope.row.goodsName || scope.row.goods_name,
                    materialId: scope.row.goodsId,
                    goodsImage: (scope.row.productImage && scope.row.productImage.fileUrl) || '',
                    channel: scope.row.channel || ''
                  }"
                />
              </el-popover>
              <div class="goodName">{{ scope.row.goodsName || scope.row.goods_name }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="上架状态" prop="sfsj" min-width="90">
          <template #default="{ row }">
            <div :class="[row?.sfsj ? 'staus_txt_1' : 'staus_txt_2']">
              {{ row?.sfsj ? '已上架' : '未上架' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品ID" prop="goodsId" min-width="140" />
        <el-table-column label="商品编码" prop="goodsCode" min-width="140">
          <template #default="scope"> {{ scope.row.goodsCode || '--' }}</template>
        </el-table-column>
        <el-table-column label="渠道" prop="channel" min-width="110">
          <template #default="scope">
            <div class="row-center">
              <img
                v-if="getImageUrl(scope.row.channel)"
                style="width: 0.9375vw; height: 0.9375vw; margin-right: 0.416667vw"
                :src="getImageUrl(scope.row.channel)"
              />
              <div
                class="single-line"
                :style="{
                  width: getImageUrl(scope.row.channel) ? '3.854167vw' : '5.729167vw',
                  paddingRight: '0.3125vw'
                }"
                >{{ getDictLabel(DICT_TYPE.SYSTEM_PARAM_CHANNEL, scope.row.channel) }}</div
              >
            </div>
          </template>
        </el-table-column>
        <!-- 上架时间 -->
        <el-table-column label="上架时间" prop="groundingTime" min-width="120" />
        <el-table-column label="类目" prop="categoryName" min-width="280" />
        <el-table-column label="产品定位" prop="productPositioning" min-width="240" />
        <el-table-column
          label="车图数"
          prop="promotionImageQuantity"
          min-width="100"
          sortable="custom"
        >
          <template #default="scope"> {{ scope.row.promotionImageQuantity }}</template>
        </el-table-column>
        <!-- 更新时间 -->
        <el-table-column label="更新人" prop="operationPerson" min-width="180">
          <template #default="scope">
            <avatar-display
              :avatars="[
                { name: scope.row.operationUserName, src: scope.row.operationUserAvatarOrigin }
              ]"
            ></avatar-display>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" prop="newUpdate" min-width="180">
          <template #default="scope">
            {{ scope.row.operationTime || scope.row.newUpdate }}</template
          >
        </el-table-column>

        <el-table-column label="操作" align="center" fixed="right" width="240">
          <template #default="scope">
            <div class="row-center">
              <div
                style="color: #0064ff; margin-right: 0.78125vw; cursor: pointer; font-weight: 500"
                @click="openEditForm(scope.row)"
                >编辑
              </div>
              <div
                v-if="scope.row.promotionImageQuantity >= 1"
                style="color: red; margin-right: 0.520833vw; cursor: pointer"
                @click="seeHistoryPrototeImg(scope.row)"
              >
                编辑历史车图</div
              >
              <!-- <div
                v-if="scope.row.promotionImageQuantity >= 1"
                style="color: red; margin-right: 0.520833vw; cursor: pointer"
                @click="onEditChildImg(scope.row)"
              >
                上传车图1</div
              > -->
              <div class="row-center" @click="onEditChildImg(scope.row)">
                <!-- <img
                  src="@/assets/imgs/visualGallery/upload_prototion_img_icon.png"
                  style="width: 0.677083vw; height: 0.677083vw; margin-right: 0.520833vw; cursor: pointer"
                /> -->
                <el-button link type="primary" style="color: #0064ff">上传车图</el-button>
              </div>
              <!-- :visible="isShowHide" -->
              <el-popover placement="bottom-end" v-if="!scope.row?.sfsj" :width="40">
                <template #reference>
                  <img src="@/assets/svgs/moreBtn.svg" class="ml10px" alt="" />
                </template>
                <div class="hideBtns">
                  <el-button
                    v-if="!scope.row?.sfsj"
                    link
                    type="primary"
                    style="color: #0064ff"
                    @click="relevanceRef.openDialog(scope.row)"
                    >关联上架商品</el-button
                  >
                </div>
              </el-popover>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.size"
        @pagination="getList"
      />
      <AddDialog ref="addDialogRef" @success="getList()" />
      <AddProtorionImgDrawer ref="addProtorionImgDraweRef" @success="getList()" />
    </ContentWrap>
    <ImgDialog ref="imgDialogRef" />
    <gallery-relevance ref="relevanceRef" @success="getList()" />
  </div>
</template>
<script lang="ts" setup>
import GalleryRelevance from './components/relevance.vue'
import { useAppStore } from '@/store/modules/app'
// import { Search } from '@element-plus/icons-vue'
import * as PersonRosterApi from '@/api/hrAdmin/personRoster'
import { getImageUrl } from '@/utils'
import { DICT_TYPE, getDictLabel } from '@/utils/dict'
import GoodCard from '@/components/common/goods/goodCard.vue'
import SWSelectPeople from '@/views/OA/new/develop/components/SWSelectPeople.vue'
import AddDialog from './components/addDialog.vue'
import AddProtorionImgDrawer from './components/addProtorionImgDrawer.vue'
import Title from './components/title.vue'
import { getUrlByTypeAndId } from '@/utils/index'
import ImgDialog from './components/imgDialog.vue'
import * as CommonApi from '@/api/common/index'
import * as GalleryApi from '@/api/gallery'
import useDrawer from '@/hooks/web/useDrawer'
defineOptions({ name: 'GalleryManage' })
const isOpen = ref(false),
  relevanceRef = ref()
const activeStore = ref<string>('')
const activePicType = ref<string>('')
const activeCloseType = ref<string>('')
const activeWJType = ref<string>('5')
const appStore = useAppStore()
const optionOptions = ref([
  { value: 1, label: '运营' },
  { value: 2, label: '策划' },
  { value: 3, label: '拍摄' },
  { value: 4, label: '后期' },
  { value: 5, label: '设计' }
])
const personId = ref() as any
const publishTimeStart = ref('')
const publishTimeEnd = ref('')
const updateTimeStart = ref('')
const updateTimeEnd = ref('')
const TypeList = ref<any>([
  { name: '内衣', value: 'UNDERWEAR_CATEGORY_GROUP' },
  { name: '季节品', value: 'SEASONAL_CATEGORY_GROUP' },
  { name: '女士内裤', value: 'WOMANPANTS_CATEGORY_GROUP' },
  { name: '袜子', value: 'SOCKS_CATEGORY_GROUP' },
  { name: '男士内裤', value: 'MANPANTS_CATEGORY_GROUP' },
  { name: '胸贴', value: 'PASTIES_CATEGORY_GROUP' }
])
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
// 日期格式化函数
const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
const titleRef = ref()
const reset = () => {
  queryParams.value = {
    size: 10,
    page: 1,
    orderType: '',
    promotionImageQuantitySort: null // 重置排序字段
  }
  activeStore.value = ''
  activePicType.value = ''
  activeCloseType.value = ''
  activeWJType.value = '5'
  titleRef.value.reset()
  updateTimeSelect({
    selectIndex: 3,
    selectIndex2: 3,
    queryParams: { pickerVModel: ['', ''], pickerVModel2: ['', ''] }
  })
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
const queryParams = ref({
  page: 1,
  size: 10,
  goodsId: '',
  goodsName: '',
  categoryCode: '',
  operationUserName: '',
  channel: '',
  promotionImageQuantitySort: null // 添加车图数排序字段
}) as any
const total = ref(0) // 列表的总页数
const loading = ref(false)
const list = ref([]) // 列表的数据
onMounted(() => {
  // getList()
  getCategoryList()
  updateTimeSelect({
    selectIndex: 3,
    selectIndex2: 3,
    queryParams: { pickerVModel: ['', ''], pickerVModel2: ['', ''] }
  })
})

const queryFormRef = ref()

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()

  handleQuery()
}

const addDialogRef = ref()
const addProtorionImgDraweRef = ref()
// 新增图库
const addClick = () => {
  addDialogRef.value.open()
}

const openEditForm = (row) => {
  addDialogRef.value.open(row)
}

// 编辑推广图
const seeHistoryPrototeImg = (row) => {
  addProtorionImgDraweRef.value.open(row, 'see')
}

// 上传推广图
const uploadPromotionImg = (row) => {
  addProtorionImgDraweRef.value.open(row, '')
}

const categoryList = ref<any[]>([])
const getCategoryList = async () => {
  const data = await CommonApi.getCategoryNameList().catch(() => {})
  if (data) {
    categoryList.value = data || []
  }
}
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    if (personId.value) {
      queryParams.value.personId = personId.value[0]?.userId
    }
    queryParams.value.channel = activeStore.value
    queryParams.value.imageType = activePicType.value
    queryParams.value.category = activeCloseType.value
    queryParams.value.publishTimeStart = publishTimeStart.value
    queryParams.value.publishTimeEnd = publishTimeEnd.value
    queryParams.value.updateTimeStart = updateTimeStart.value
    queryParams.value.updateTimeEnd = updateTimeEnd.value
    queryParams.value.orderType = +activeWJType.value
    // promotionImageQuantitySort 字段已经在 queryParams 中
    const data = await GalleryApi.getList(queryParams.value).catch(() => {})
    if (data) {
      list.value = data.records || []
      total.value = data.total
    }
  } finally {
    loading.value = false
  }
}

// 处理排序变化
const handleSortChange = (column) => {
  if (column.prop === 'promotionImageQuantity') {
    if (column.order === 'ascending') {
      queryParams.value.promotionImageQuantitySort = 1 // 升序
    } else if (column.order === 'descending') {
      queryParams.value.promotionImageQuantitySort = 2 // 降序
    } else {
      queryParams.value.promotionImageQuantitySort = null // 不排序
    }
    getList()
  }
}

const imgDialogRef = ref()

/**
 * 打开车图图库弹窗
 */
function onOpenImgDialog() {
  imgDialogRef.value.open()
}

const { openDrawer } = useDrawer()
const EditChildImg = defineAsyncComponent(() => import('./components/editChildImg.vue'))

function onEditChildImg(row: any) {
  openDrawer({
    title: '上传车图',
    content: EditChildImg,
    width: 936,
    wrapperStyle: { padding: 'unset', backgroundColor: 'unset' },
    props: {
      row
    },
    on: {
      'submit-success': () => {
        getList()
      }
    }
  })
}

const message = useMessage()

const syncData = () => {
  GalleryApi.syncData({}).then((res) => {
    message.success('同步成功')
    getList()
  })
}
</script>

<style lang="scss" scoped>
.staus_txt_1::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #349b34;
  border-radius: 50%;
  margin-right: 5px;
}

.staus_txt_2::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #eb3737;
  border-radius: 50%;
  margin-right: 5px;
}

:deep(.el-card__body) {
  padding: 0px !important;
}

.goodImg {
  width: 2.395833vw;
  height: 2.395833vw;
  border-radius: 0.104167vw;
  margin-right: 0.416667vw;
}

.goodName {
  width: calc(100% - 3.645833vw);
  font-size: 0.729167vw;
  color: #0064ff;
  line-height: 1.041667vw;
  white-space: normal;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden; //溢出内容隐藏
  text-overflow: ellipsis; //文本溢出部分用省略号表示
  display: -webkit-box; //特别显示模式
  -webkit-line-clamp: 2; //行数
  line-clamp: 2;
  -webkit-box-orient: vertical; //盒子中内容竖直排列
}

.formList {
  position: relative;
  margin-left: 1.041667vw;
  margin-right: 1.041667vw;
  padding-top: 1.041667vw;
  border-bottom: 0.052083vw solid #f0f0f0;

  :deep(.el-form-item--default) {
    margin-bottom: 0.3125vw;
  }
  :deep(.el-form) {
    .advanced-search-item {
      margin-bottom: 16px;
      .el-form-item__content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .store-item-container {
          display: flex;
          // justify-content: space-between;
        }
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

.button {
  display: flex;
  z-index: 9;
  position: absolute;
  // top: 3.75vw;
  right: 0;
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
</style>
