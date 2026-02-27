<template>
  <div>
    <!-- 列表 -->
    <ContentWrap>
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form
            :model="queryParams"
            ref="queryFormRef"
            :inline="true"
            label-width="68px"
            @submit.prevent
          >
            <el-form-item label="商品名称" prop="goodsName">
              <el-input
                :prefix-icon="Search"
                class="dialogFormItemWidth"
                style="width: 200px"
                v-model="queryParams.goodsName"
                placeholder="请输入商品名称"
                clearable
                @clear="handleQuery"
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="商品ID" prop="goodsId">
              <el-input
                :prefix-icon="Search"
                class="dialogFormItemWidth"
                style="width: 200px"
                v-model="queryParams.goodsId"
                placeholder="请输入商品ID"
                clearable
                @clear="handleQuery"
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="店铺" prop="storeName">
              <el-select
                style="width: 200px"
                class="topFilter-select"
                v-model="queryParams.storeName"
                placeholder="请选择店铺"
                clearable
                @clear="handleQuery"
                @change="handleQuery"
              >
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.COMPETITIVE_STORES, true)"
                  :key="dict.value"
                  :label="dict.value"
                  :value="dict.value"
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
            <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0px">
              重置
            </el-button>
          </div>
        </div>
      </div>

      <el-table
        :header-cell-style="appStore.headerCellStyle"
        v-loading="loading"
        :data="list"
        :stripe="true"
        class="SWCommonTable"
        :show-overflow-tooltip="true"
        v-horizontal-scroll="'always'"
      >
        <el-table-column
          prop="name"
          min-width="120"
          :show-overflow-tooltip="false"
          label="新品图片"
          fixed
        >
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
                      :src="scope.row.goodsImg"
                    />
                  </div>
                </template>
                <GoodCard
                  :good="{
                    materialName: scope.row.goodsName || scope.row.goods_name,
                    materialId: scope.row.goodsId || scope.row.goods_id,
                    goodsImage: scope.row.goodsImg,
                    channel: scope.row.channel || ''
                  }"
                />
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="新品名称" prop="goodsName" min-width="220">
          <template #default="scope">
            <div class="text2">{{ scope.row.goodsName || '--' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="店铺名称" prop="storeName" min-width="150" />
        <el-table-column label="新品ID" prop="goodsId" min-width="120" />
        <el-table-column label="上架时间" prop="listDate" min-width="120" />
        <el-table-column label="销量破百日期" prop="breakHundredDate" min-width="120" />
        <el-table-column fixed="right" width="120" label="查看销量趋势" align="center">
          <template #default="scope">
            <div
              style="color: #0064ff; line-height: 20px; font-size: 14px; cursor: pointer"
              @click="seeTred(scope.row)"
            >
              查看
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

      <TrendDialog ref="trendDialogRef" />
    </ContentWrap>
  </div>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { getImgUrlById } from '@/utils/index'
import { Search } from '@element-plus/icons-vue'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

import GoodCard from '@/components/common/goods/goodCard.vue'
import TrendDialog from './components/trendDialog.vue'

import * as GoodsShopApi from '@/api/shop'

const appStore = useAppStore()

defineOptions({ name: 'SaleMonitor' })

const queryParams = reactive({
  page: 1,
  size: 10,
  goodsName: '',
  goodsId: '',
  storeName: ''
})
const total = ref(0) // 列表的总页数
const loading = ref(false)
const list = ref([]) // 列表的数据

onMounted(() => {
  getList()
})
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.page = 1
  getList()
}

const queryFormRef = ref()
/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await GoodsShopApi.goodsSaleMonitorList(queryParams).catch(() => {})
    if (data) {
      list.value = data.records || []
      total.value = data.total
    }
  } finally {
    loading.value = false
  }
}

const trendDialogRef = ref()
// 查看趋势
const seeTred = (row) => {
  trendDialogRef.value.open(row.goodsId)
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
</style>
