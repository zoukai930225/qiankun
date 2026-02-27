<template>
  <ContentWrap>
    <div>
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form
            :model="queryParams"
            ref="queryFormRef"
            :inline="true"
            label-width="80px"
            @submit.prevent
          >
            <el-form-item label="店铺" prop="store">
              <el-input
                :prefix-icon="Search"
                class="dialogFormItemWidth"
                v-model.trim="searchStoreName"
                placeholder="请选择店铺"
                readonly
                @click="onStoreSelectClick"
              />
            </el-form-item>
            <el-form-item label="商品" prop="nameAndId">
              <el-input
                :prefix-icon="Search"
                class="dialogFormItemWidth"
                v-model.trim="queryParams.nameAndId"
                placeholder="请输入商品ID/名称"
                clearable
                @clear="handleQuery"
                @keyup.enter="handleQuery"
              />
            </el-form-item>

            <el-form-item label="申请状态" prop="status">
              <el-select
                class="searchFormItemWidth"
                v-model="queryParams.status"
                placeholder="请选择状态"
                @change="handleQuery"
                @clear="handleQuery"
                clearable
              >
                <el-option
                  v-for="dict in [
                    { name: '未申请', code: '0' },
                    { name: '已申请', code: '1' }
                  ]"
                  :key="dict.code"
                  :label="dict.name"
                  :value="dict.code"
                >
                  <el-tag typeprimary="danger" round v-if="dict.code === '0'"> 未申请 </el-tag>

                  <el-tag type="success" round v-if="dict.code === '1'"> 已申请 </el-tag>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="负责人" prop="head">
              <el-input
                :prefix-icon="Search"
                class="dialogFormItemWidth"
                v-model.trim="queryParams.head"
                placeholder="请输入负责人"
                clearable
                @clear="handleQuery"
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item v-show="isExpand" label="品类" prop="category">
              <el-select
                class="searchFormItemWidth"
                v-model="queryParams.category"
                placeholder="请选择品类"
                @change="handleQuery"
                @clear="handleQuery"
                clearable
              >
                <el-option
                  v-for="dict in categoryList"
                  :key="dict.code"
                  :label="dict.name"
                  :value="dict.code"
                />
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
            <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0">
              重置
            </el-button>
          </div>
        </div>
      </div>
      <SWFilterExpandAll :isExpand="isExpand" @expand-click="isExpand = !isExpand" />
    </div>
    <el-table
      :header-cell-style="appStore.headerCellStyle"
      v-loading="loading"
      :data="list"
      :stripe="true"
      :show-overflow-tooltip="true"
      class="SWCommonTable"
      v-horizontal-scroll="'always'"
    >
      <template #header="scope">
        <!-- 自定义图标 -->
        <div class="row-center">
          <div class="tableHeaderText">{{ scope.column.label }}</div>
        </div>
      </template>
      <el-table-column prop="name" width="247" :show-overflow-tooltip="false" label="商品" fixed>
        <template #default="scope">
          <div class="row-center">
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
                    style="width: 42px; height: 42px; border-radius: 4px"
                    :src="scope.row.goodsImage"
                  />
                </div>
              </template>
              <GoodCard
                :good="{
                  materialName: scope.row.goodsName || scope.row.goods_name,
                  materialId: scope.row.goodsId,
                  goodsImage: scope.row.goodsImage,
                  channel: scope.row.channel || ''
                }"
              />
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
            <img
              v-if="getImageUrl(scope.row.channel)"
              style="width: 18px; height: 18px; margin-right: 8px"
              :src="getImageUrl(scope.row.channel)"
            />
            <div
              class="single-line"
              :style="{
                width: getImageUrl(scope.row.channel) ? '74px' : '110px',
                paddingRight: '6px'
              }"
              >{{ getDictLabel(DICT_TYPE.SYSTEM_PARAM_CHANNEL, scope.row.channel) }}</div
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column label="店铺" prop="store" min-width="150" />
      <el-table-column label="上架时间" prop="groundingTime" min-width="150" />
      <el-table-column label="申请状态" prop="status" min-width="150">
        <template #default="scope">
          <el-tag typeprimary="danger" round v-if="scope.row.status === '0'"> 未申请 </el-tag>

          <el-tag type="success" round v-if="scope.row.status === '1'"> 已申请 </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="运营负责人"
        prop="headOperations"
        :show-overflow-tooltip="false"
        min-width="200"
      >
        <template #default="scope">
          <div
            style="margin-left: -6px"
            v-if="scope.row.goodsPersonInfos && scope.row.goodsPersonInfos.length > 0"
          >
            <SWPersonalStyle
              :can-click="true"
              :data="scope.row"
              :list="getHeaderPersonalList('1', scope.row.goodsPersonInfos)"
              @item-click="personalClick"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="产品负责人"
        prop="goodsPersonInfos"
        :show-overflow-tooltip="false"
        min-width="120"
      >
        <template #default="scope">
          <div
            style="margin-left: -6px"
            v-if="scope.row.goodsPersonInfos && scope.row.goodsPersonInfos.length > 0"
          >
            <SWPersonalStyle :list="getHeaderPersonalList('2', scope.row.goodsPersonInfos)" />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="视觉负责人"
        prop="goodsPersonInfos"
        :show-overflow-tooltip="false"
        min-width="120"
      >
        <template #default="scope">
          <div
            style="margin-left: -6px"
            v-if="scope.row.goodsPersonInfos && scope.row.goodsPersonInfos.length > 0"
          >
            <SWPersonalStyle :list="getHeaderPersonalList('3', scope.row.goodsPersonInfos)" />
          </div>
        </template>
      </el-table-column>

      <el-table-column label="标签" prop="tag" min-width="100">
        <template #default="scope">
          <div class="row">
            <div
              :style="{
                fontSize: '16px',
                background: (scope.row.tagManagement && scope.row.tagManagement.tagColor) || '',
                color: '#fff',
                borderRadius: '13px',
                height: '26px',
                lineHeight: '26px'
              }"
            >
              <div style="padding-left: 10px; padding-right: 10px">{{
                (scope.row.tagManagement && scope.row.tagManagement.tagSymbol) || ''
              }}</div></div
            >
          </div>
        </template></el-table-column
      >
      <el-table-column label="操作" align="center" fixed="right" width="150">
        <template #default="{ row }">
          <el-button @click="cancelApproval(row)" v-if="row.status === '1'" type="primary" link
            >取消申请</el-button
          >
          <el-button v-else type="primary" link @click="payApproval(row)">付费申请</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :total="total"
      v-model:page="queryParams.page"
      v-model:limit="queryParams.size"
      @pagination="getList"
    />
  </ContentWrap>
</template>
<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
import { DICT_TYPE, getDictLabel } from '@/utils/dict'
import { getImageUrl } from '@/utils/index'

import { Search } from '@element-plus/icons-vue'
import SWFilterExpandAll from '@/components/SWBaseComponent/SWFilterExpandAll/index.vue' // 展开组件

import GoodCard from '@/components/common/goods/goodCard.vue'

import * as GoodsShopApi from '@/api/shop'
import * as CommonApi from '@/api/common/index'

const appStore = useAppStore()
const message = useMessage()

defineOptions({ name: 'PaidApplication' })

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
  searchStoreName.value = ''
  queryParams.store = ''
  handleQuery()
}

const categoryList = ref<any[]>([])
const getCategoryList = async () => {
  const data = await CommonApi.getCategoryNameList().catch(() => {})
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
    }).catch(() => {})
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
    const data = await GoodsShopApi.alipayNewProductPayApplyList(param).catch(() => {})
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

// 店铺选择--打开弹窗
const searchStoreName = ref('')
const storeRangeRef = ref()
const onStoreSelectClick = () => {
  if (storeRangeRef.value) {
    storeRangeRef.value.open(queryParams.store, 'storeCode')
  }
}

// 付费申请
async function payApproval(row: any) {
  await message.confirm('请确认已完成线下申请')
  const res = await GoodsShopApi.alipayNewProductPayApplySave({ goodsId: row.goodsId })
  if (res.success) {
    message.success('付费申请成功')
    handleQuery()
  } else {
    message.error(res.message || '付费申请失败')
  }
}
// 取消付费申请
async function cancelApproval(row: any) {
  try {
    await message.confirm('您确认取消付费申请吗？')
    const res = await GoodsShopApi.alipayNewProductPayApplyDel(row.payId)
    if (res.success) {
      message.success('取消付费申请成功')
      handleQuery()
    } else {
      message.error(res.message || '取消付费申请失败')
    }
  } catch (error) {}
}
</script>

<style scoped lang="less">
:deep(.el-form) {
  .el-input {
    width: 200px;
  }
}
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
