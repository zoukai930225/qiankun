<template>
  <div>
    <Dialog width="65vw" :border-radius="14" v-model="visible">
      <template #title>
        <span style="font-weight: 500; font-size: 16px; color: #333333">关联上架商品</span>
      </template>
      <ContentWrap style="border-radius: 0px 0px 8px 8px">
        <div class="formList">
          <div class="button">
            <el-button @click="getList" class="commonSearchBtn">
              <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
              搜索
            </el-button>
            <el-button @click="reset" class="commonResetBtn" style="margin-left: 0">重置</el-button>
            <div v-show="!isOpen" class="zhankai" @click="isOpen = !!!isOpen"
              style="display: flex; justify-content: center; align-items: center"><img
                style="width: 0.729167vw; height: 0.729167vw" src="@/assets/imgs/web/chevron-up.png" alt="" />
              <div class="shouqi">收起</div>
            </div>
            <div v-show="isOpen" class="zhankai" @click="isOpen = !!!isOpen"
              style="display: flex; justify-content: center; align-items: center"><img
                style="width: 0.729167vw; height: 0.729167vw" src="@/assets/imgs/web/chevron-down.png" alt="" />
              <div class="shouqi">展开</div>
            </div>
          </div>
          <el-form ref="formRef" :model="queryParams" label-width="4.166667vw">
            <el-form-item prop="string" label="商品主键" style="margin-bottom: 0.520833vw">
              <el-input style="width: 12vw" v-model="queryParams.searchContent" placeholder="请输入商品ID/商品名称/货品编码"
                @keyup.enter="getList" />
            </el-form-item>
            <el-form-item prop="string" label="人员查询" style="position: absolute; top: 1.041667vw; left: 17vw">
              <el-select style="width: 12vw; margin-right: 1.5625vw" v-model="queryParams.personType"
                placeholder="请选择人员类型">
                <el-option v-for="item in optionOptions" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
              <div class="valueBgInput">
                <SWSelectPeople style="width: 12vw" v-if="queryParams.personType" :isEdit="true" :multiple="false"
                  v-model="personId" :getSearchList="remoteMethod" @select-people-change="getList" @clear="getList" />
              </div>
            </el-form-item>
            <el-form-item prop="string" label="渠道" v-show="!isOpen">
              <div class="storeItem" :class="{ actived: activeStore === 'TaoBao' }" @click="storeChange('TaoBao')">淘宝
              </div>
              <div class="storeItem" :class="{ actived: activeStore === 'Tmall' }" @click="storeChange('Tmall')">天猫
              </div>
            </el-form-item>
            <el-form-item prop="string" label="图片类型" v-show="!isOpen">
              <div class="storeItem" :class="{ actived: activePicType === '1' }" @click="picTypeChange('1')">主图(含车图)
              </div>
              <div class="storeItem" :class="{ actived: activePicType === '0' }" @click="picTypeChange('0')">主图(无车图)
              </div>
            </el-form-item>
            <el-form-item prop="string" label="类目" v-show="!isOpen">
              <div v-for="(item, index) in TypeList" :key="index" class="storeItem"
                :class="{ actived: activeCloseType === item.value }" @click="CloseTypeChange(item.value)">{{ item.name
                }}
              </div>
            </el-form-item>
            <el-form-item prop="string" label="高级搜索" v-show="!isOpen">
              <div class="storeItem" :class="{ actived: activeWJType === '4' }" @click="activeWJTypeChange('4')">销量正序
              </div>
              <div class="storeItem" :class="{ actived: activeWJType === '5' }" @click="activeWJTypeChange('5')">销量倒序
              </div>
              <div class="storeItem" :class="{ actived: activeWJType === '1' }" @click="activeWJTypeChange('1')">文件最新发布
              </div>
              <div class="storeItem" :class="{ actived: activeWJType === '2' }" @click="activeWJTypeChange('2')">车图更新时间
              </div>
              <div class="storeItem" :class="{ actived: activeWJType === '3' }" @click="activeWJTypeChange('3')">车图数据待完善
              </div>
            </el-form-item>
          </el-form>
        </div>
        <el-table :header-cell-style="appStore.headerCellStyle" v-loading="loading" :data="list" :stripe="true"
          :show-overflow-tooltip="true" class="SWCommonTable" v-horizontal-scroll="'always'" style="width:100%"
          @sort-change="handleSortChange">
          <template #header="scope">
            <!-- 自定义图标 -->
            <div class="row-center">
              <div class="tableHeaderText">{{ scope.column.label }}</div>
            </div>
          </template>
          <el-table-column prop="name" width="247" :show-overflow-tooltip="false" label="商品" fixed>
            <template #default="scope">
              <div class="row-center" @click="getUrlByTypeAndId(scope.row.channel || 'TaoBao', scope.row.goodsId)"
                style="margin-top: 0.208333vw; margin-bottom: 0.15625vw; cursor: pointer">
                <el-popover placement="right" :width="348" trigger="hover" :show-arrow="false" :offset="20">
                  <template #reference>
                    <div class="goodImg">
                      <img style="width: 2.395833vw; height: 2.395833vw; border-radius: 0.208333vw"
                        :src="(scope.row.productImage && scope.row.productImage.fileUrl) || ''" />
                    </div>
                  </template>
                  <GoodCard :good="{
                    materialName: scope.row.goodsName || scope.row.goods_name,
                    materialId: scope.row.goodsId,
                    goodsImage: (scope.row.productImage && scope.row.productImage.fileUrl) || '',
                    channel: scope.row.channel || ''
                  }" />
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
                <img v-if="getImageUrl(scope.row.channel)"
                  style="width: 0.9375vw; height: 0.9375vw; margin-right: 0.416667vw"
                  :src="getImageUrl(scope.row.channel)" />
                <div class="single-line" :style="{
                  width: getImageUrl(scope.row.channel) ? '3.854167vw' : '5.729167vw',
                  paddingRight: '0.3125vw'
                }">{{ getDictLabel(DICT_TYPE.SYSTEM_PARAM_CHANNEL, scope.row.channel) }}</div>
              </div>
            </template>
          </el-table-column>
          <!-- 上架时间 -->
          <el-table-column label="上架时间" prop="groundingTime" min-width="120" />
          <el-table-column label="类目" prop="categoryName" min-width="280" />
          <el-table-column label="产品定位" prop="productPositioning" min-width="240" />
          <el-table-column label="车图数" prop="promotionImageQuantity" min-width="100" sortable="custom">
            <template #default="scope"> {{ scope.row.promotionImageQuantity }}</template>
          </el-table-column>
          <!-- 更新时间 -->
          <el-table-column label="更新时间" prop="newUpdate" min-width="180" />
          <el-table-column label="操作" align="center" fixed="right" width="85">
            <template #default="scope">
              <el-button link type="primary" style="color: #0064ff" @click="relevanceData(scope.row)">关联</el-button>
            </template>
          </el-table-column>
        </el-table>
        <Pagination :total="total" v-model:page="queryParams.page" v-model:limit="queryParams.size"
          @pagination="getList" />
        <AddDialog ref="addDialogRef" @success="getList()" />
        <AddProtorionImgDrawer ref="addProtorionImgDraweRef" @success="getList()" />
      </ContentWrap>
    </Dialog>
  </div>
</template>

<script lang="ts">
export default { name: 'GalleryRelevance' };
</script>


<script lang="ts" setup>
import { ElLoading } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import * as PersonRosterApi from '@/api/hrAdmin/personRoster'
import { getImageUrl } from '@/utils'
import { DICT_TYPE, getDictLabel } from '@/utils/dict'
import GoodCard from '@/components/common/goods/goodCard.vue';
import SWSelectPeople from '@/views/OA/new/develop/components/SWSelectPeople.vue'
import { getUrlByTypeAndId } from '@/utils/index'
import * as CommonApi from '@/api/common/index'
import * as GalleryApi from '@/api/gallery';
import request from '@/config/axios'

const visible = ref<boolean>(false), rowData = ref<any>(), loading = ref(false);

const isOpen = ref(false);
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
}

const queryParams = ref({
  page: 1,
  size: 10,
  goodsId: '',
  goodsName: '',
  categoryCode: '',
  channel: '',
  promotionImageQuantitySort: null // 添加车图数排序字段
}) as any
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据

const addDialogRef = ref()
const addProtorionImgDraweRef = ref()

const categoryList = ref<any[]>([])
const getCategoryList = async () => {
  const data = await CommonApi.getCategoryNameList().catch(() => { })
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
    const data = await GalleryApi.getList({ ...queryParams.value, sfsj: 1 }).catch(() => { })
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

const openDialog = (item: any) => {
  rowData.value = item;
  getCategoryList();
  getList();
  visible.value = true;
};

const message = useMessage()

const emit = defineEmits(['success'])

const relevanceData = (row: any) => {
  message.confirm('请确认是否关联该商品?').then((res: any) => {
    if (res === 'confirm') {
      const loadValue: any = ElLoading.service({ fullscreen: true, text: '数据关联中' })
      request.get({
        url: `/api/pictureGallery/relatedProducts`, params: {
          unionId: row.goodsId, goodsId: rowData.value.goodsId
        }
      }).then((info: any) => {
        info && (visible.value = false, emit('success'));
      }).finally(() => {
        loadValue?.close();
      });
    }
  }).catch(() => { })
};

defineExpose({ openDialog });

</script>

<style lang="scss" scoped>
:deep(.com-dialog .el-dialog__header) {
  border-bottom: none;
  font-weight: 500;
  font-size: 16px;
  color: #333333;
  line-height: 22px;
}

.goodsInfo {
  margin-top: 20px;

  .goodImg {
    width: 42px;
    height: 42px;
    border-radius: 2px;
    margin-right: 8px;
  }

  .goodName {
    width: calc(100% - 70px);
    font-size: 14px;
    color: #0064ff;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
  }
}
</style>

<style scoped lang="less">
:deep(.com-dialog .el-dialog__header) {
  border-bottom: none;
  font-weight: 500;
  font-size: 16px;
  color: #333333;
  line-height: 22px;
  margin-left: -10px;
  margin-top: -10px;
  margin-bottom: -10px;
}

:deep(.com-dialog .el-dialog__body) {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  min-height: 85vh;
  max-height: 85vh;
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
  padding-top: 1.041667vw;
  border-bottom: 0.052083vw solid #f0f0f0;

  :deep(.el-form-item--default) {
    margin-bottom: 0.3125vw;
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
  right: 0px
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
  margin-left: 8px;
  width: 2.395833vw;
  height: 1.666667vw;
}

.staus_txt_1::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #349B34;
  border-radius: 50%;
  margin-right: 5px;
}

.staus_txt_2::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #EB3737;
  border-radius: 50%;
  margin-right: 5px;
}
</style>
