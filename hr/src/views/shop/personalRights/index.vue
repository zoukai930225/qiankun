<template>
  <div>
    <!-- 列表 -->
    <ContentWrap>
      <div>
        <div class="commonTopFilterWrap">
          <div class="commonTopFilterWrap-filter">
            <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="58px" @submit.prevent>
              <el-form-item label="店铺" prop="store">
                <StoreRangePlus v-model="queryParams.store" placeholder="请选择店铺" @change="getList" @clear="getList"
                  :clearable="true" />
              </el-form-item>
              <el-form-item label="商品" prop="nameAndId">
                <el-input :prefix-icon="Search" class="dialogFormItemWidth" style="width: 200px"
                  v-model="queryParams.nameAndId" placeholder="请输入商品ID/名称" clearable @clear="handleQuery"
                  @keyup.enter="handleQuery" />
              </el-form-item>

              <el-form-item label="状态" prop="status">
                <el-select class="searchFormItemWidth" v-model="queryParams.status" placeholder="请选择状态"
                  @change="handleQuery" @clear="handleQuery" clearable>
                  <el-option v-for="dict in [
                    { name: '售卖中', code: '1' },
                    { name: '已下架', code: '2' }
                  ]" :key="dict.code" :label="dict.name" :value="dict.code">
                    <el-tag typeprimary="danger" round v-if="dict.code === '1'"> 售卖中 </el-tag>

                    <el-tag type="danger" round v-if="dict.code === '2'"> 已下架 </el-tag>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="负责人" prop="head">
                <el-input :prefix-icon="Search" class="dialogFormItemWidth" style="width: 200px"
                  v-model="queryParams.head" placeholder="请输入负责人" clearable @clear="handleQuery"
                  @keyup.enter="handleQuery" />
              </el-form-item>
              <el-form-item v-show="isExpand" label="标签" prop="tagName">
                <el-select class="searchFormItemWidth" v-model="queryParams.tagName" filterable placeholder="请选择标签"
                  clearable @clear="handleQuery" @change="handleQuery">
                  <el-option v-for="dict in tagList" :key="dict.id" :label="dict.tagName" :value="dict.id">
                    <span v-if="dict.tagSymbol" :style="{
                      background: `${dict.tagColor || '#ee657'} `,
                      paddingLeft: '10px',
                      paddingRight: '10px',
                      borderRadius: '14px',
                      color: '#fff',
                      height: '28px',
                      lineHeight: '28px',
                      marginRight: '10px'
                    }">{{ dict.tagSymbol }}</span>
                    <span>
                      {{ dict.tagName }}
                    </span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-show="isExpand" label="品类" prop="category">
                <el-select class="searchFormItemWidth" v-model="queryParams.category" placeholder="请选择品类"
                  @change="handleQuery" @clear="handleQuery" clearable>
                  <el-option v-for="dict in categoryList" :key="dict.code" :label="dict.name" :value="dict.code" />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div class="commonTopFilterWrap-search">
            <div class="commonTopFilterWrap-search-container">
              <el-button @click="handleQuery" class="commonSearchBtn">
                <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
                搜索
              </el-button>
              <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0px">
                重置
              </el-button>
            </div>
          </div>
        </div>
        <SWFilterExpandAll :isExpand="isExpand" @expand-click="isExpand = !isExpand" />
      </div>

      <el-table :header-cell-style="appStore.headerCellStyle" v-loading="loading" :data="list" :stripe="true"
        :show-overflow-tooltip="true" class="SWCommonTable" v-horizontal-scroll="'always'">
        <template #header="scope">
          <!-- 自定义图标 -->
          <div class="row-center">
            <div class="tableHeaderText">{{ scope.column.label }}</div>
          </div>
        </template>
        <el-table-column prop="name" width="247" :show-overflow-tooltip="false" label="商品" fixed>
          <template #default="scope">
            <div class="row-center">
              <el-popover placement="right" :width="348" trigger="hover" :show-arrow="false" :offset="20">
                <template #reference>
                  <div class="goodImg">
                    <img style="width: 42px; height: 42px; border-radius: 4px" :src="scope.row.goodsImage" />
                  </div>
                </template>
                <GoodCard :good="{
                  materialName: scope.row.goodsName || scope.row.goods_name,
                  materialId: scope.row.goodsId,
                  goodsImage: scope.row.goodsImage,
                  channel: scope.row.channel || ''
                }" />
              </el-popover>
              <div class="goodName">{{ scope.row.goodsName || scope.row.goods_name }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品ID" prop="goodsId" min-width="190" />
        <el-table-column label="商品编码" prop="goodsCode" min-width="120" />
        <el-table-column label="类目" prop="categoryName" min-width="180" />
        <el-table-column prop="channel" width="110" label="渠道">
          <template #default="scope">
            <div class="row-center">
              <img v-if="getImageUrl(scope.row.channel)" style="width: 18px; height: 18px; margin-right: 8px"
                :src="getImageUrl(scope.row.channel)" />
              <div class="single-line" :style="{
                width: getImageUrl(scope.row.channel) ? '74px' : '110px',
                paddingRight: '6px'
              }">{{ getDictLabel(DICT_TYPE.SYSTEM_PARAM_CHANNEL, scope.row.channel) }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="店铺" prop="store" min-width="150" />
        <el-table-column label="上架时间" prop="groundingTime" min-width="150" />
        <el-table-column label="上架状态" prop="status" min-width="150">
          <template #default="scope">
            <el-tag typeprimary="danger" round v-if="scope.row.status === '1'"> 售卖中 </el-tag>

            <el-tag type="danger" round v-if="scope.row.status === '2'"> 已下架 </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="运营负责人" prop="headOperations" :show-overflow-tooltip="false" min-width="200">
          <template #default="scope">
            <div style="margin-left: -6px" v-if="scope.row.goodsPersonInfos && scope.row.goodsPersonInfos.length > 0">
              <SWPersonalStyle :can-click="true" :data="scope.row"
                :list="getHeaderPersonalList('1', scope.row.goodsPersonInfos)" @item-click="personalClick" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="产品负责人" prop="goodsPersonInfos" :show-overflow-tooltip="false" min-width="120">
          <template #default="scope">
            <div style="margin-left: -6px" v-if="scope.row.goodsPersonInfos && scope.row.goodsPersonInfos.length > 0">
              <SWPersonalStyle :list="getHeaderPersonalList('2', scope.row.goodsPersonInfos)" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="视觉负责人" prop="goodsPersonInfos" :show-overflow-tooltip="false" min-width="120">
          <template #default="scope">
            <div style="margin-left: -6px" v-if="scope.row.goodsPersonInfos && scope.row.goodsPersonInfos.length > 0">
              <SWPersonalStyle :list="getHeaderPersonalList('3', scope.row.goodsPersonInfos)" />
            </div>
          </template>
        </el-table-column>

        <el-table-column label="标签" prop="tag" min-width="240">
          <template #default="scope">
            <div class="row" v-if="scope.row.tagManagements && Array.isArray(scope.row.tagManagements)
              && scope.row.tagManagements.length > 0">
              <div v-for="(value) in scope.row.tagManagements" :key="value.id" :style="{
                fontSize: '16px',
                background: (value.tagColor) || '',
                color: '#fff',
                borderRadius: '13px',
                height: '26px',
                lineHeight: '26px'
              }">
                <div style="padding-left: 10px; padding-right: 10px">{{
                  (value.tagName) || ''
                }}</div>
              </div>
            </div>
            <span v-else>-</span>
          </template></el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="150">
          <template #default="scope">
            <el-button link type="primary" @click="setLeader(scope.row)"> 设置负责人 </el-button>
            <el-popover placement="bottom" :width="225" trigger="click">
              <template #reference>
                <el-button link type="primary" @click="markTag(scope.row)"> 打标 </el-button>
              </template>
              <el-select class="searchFormItemWidth" v-model="selectTag" filterable placeholder="请选择标签"
                @change="handleSelectTag">
                <el-option v-for="dict in tagList" :key="dict.id" :label="dict.tagName" :value="dict.id">
                  <span v-if="dict.tagSymbol" :style="{
                    background: `${dict.tagColor || '#ee657'} `,
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    borderRadius: '14px',
                    color: '#fff',
                    height: '28px',
                    lineHeight: '28px',
                    marginRight: '10px'
                  }">{{ dict.tagSymbol }}</span>
                  <span>
                    {{ dict.tagName }}
                  </span>
                </el-option>
              </el-select>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <Pagination :total="total" v-model:page="queryParams.page" v-model:limit="queryParams.size"
        @pagination="getList" />
      <RightsDialog ref="rightsDialogRef" @success="getList()" />
      <SetLeaderDialog ref="setLeaderDialogRef" @success="getList()" />
    </ContentWrap>
  </div>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { DICT_TYPE, getDictLabel } from '@/utils/dict'
import { getImageUrl } from '@/utils/index'

import { Search } from '@element-plus/icons-vue'
import SWFilterExpandAll from '@/components/SWBaseComponent/SWFilterExpandAll/index.vue' // 展开组件

import GoodCard from '@/components/common/goods/goodCard.vue'
import RightsDialog from './components/rightsDialog.vue'
import SetLeaderDialog from './components/setLeaderDiaolog.vue'

import * as GoodsShopApi from '@/api/shop'
import * as CommonApi from '@/api/common/index'

const appStore = useAppStore()
const message = useMessage() // 消息弹窗

defineOptions({ name: 'PersonalRights' })

const isExpand = ref(false) // 是否展开
const tagList = ref<any>([])

const queryParams = reactive({
  page: 1,
  size: 10,
  status: '',
  nameAndId: '',
  store: '',
  head: '',
  tagName: '',
  category: ''
})

const selectTag = ref()
const markGoodsId = ref('') // 打标的商品id

const total = ref(0) // 列表的总页数
const loading = ref(false)
const list = ref([]) // 列表的数据
onMounted(() => {
  getList()
  getTagList()
  getCategoryList()
})
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.page = 1
  getList()
}

const queryFormRef = ref()

const getHeaderName = (type, list) => {
  let filterList = []
  list.forEach((item) => {
    if (item.type === type) {
      if (item.name) {
        filterList.push(item.name)
      }
    }
  })
  if (filterList && filterList.length > 0) {
    return filterList.join('、')
  }
  return ''
}

const getHeaderPersonalList = (type, list) => {
  let filterList = []
  list.forEach((item) => {
    if (item.type === type) {
      filterList.push(item)
    }
  })
  return filterList
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  // searchStoreName.value = ''
  queryParams.store = ''
  handleQuery()
}

const categoryList = ref<any[]>([])
const getCategoryList = async () => {
  const data = await CommonApi.getCategoryNameList().catch(() => { })
  if (data) {
    categoryList.value = data || []
  }
}

// 获取标签列表
const getTagList = async () => {
  try {
    const data = await GoodsShopApi.goodsPersonalQueryTag({
      page: 1,
      size: 99999,
      tagCategory: 'goods'
    }).catch(() => { })
    if (data) {
      tagList.value = data.records || []
    }
  } finally {
  }
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const param = {
      page: queryParams.page,
      size: queryParams.size,
      status: queryParams.status || '',
      nameAndId: queryParams.nameAndId || '',
      store: queryParams.store || '',
      head: queryParams.head || '',
      tagName: queryParams.tagName || '',
      category: queryParams.category || ''
    }
    const data = await GoodsShopApi.goodsPersonResponsibilityList(param).catch(() => { })
    if (data) {
      list.value = data.records || []
      total.value = data.total
    }
  } finally {
    loading.value = false
  }
}

const rightsDialogRef = ref()
const goUserDetail = (row: any) => {
  rightsDialogRef.value?.open(row.goodsId)
}
const personalClick = (_, row: any) => {
  goUserDetail(row)
}

const setLeaderDialogRef = ref()
const setLeader = (row: any) => {
  setLeaderDialogRef.value?.open(row.goodsId, row)
}

const markTag = (row: any) => {
  markGoodsId.value = row.goodsId || ''
}

const handleSelectTag = async (val: any) => {
  await GoodsShopApi.saveGoodsTag({
    goodsId: markGoodsId.value,
    tagId: selectTag.value
  }).catch(() => {
    selectTag.value = ''
  })
  selectTag.value = ''
  getList()
  message.success('商品打标成功')
}
</script>

<style lang="scss" scoped>
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

.personalStyle {
  color: #0064ff;
  cursor: pointer;
  font-weight: 500;
  text-decoration: underline;
}
</style>
