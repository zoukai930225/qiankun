<template>
  <div>
    <Dialog :width="974" :border-radius="14" v-model="dialogVisible">
      <template #title>
        <span style="font-weight: 500; font-size: 16px; color: #333333">快速选择商品 </span>
      </template>
      <div class="goodsInfo">
        <div>
          <div>
            <div class="commonTopFilterWrap">
              <div class="commonTopFilterWrap-filter">
                <el-form
                  :model="queryParams"
                  ref="queryFormRef"
                  :inline="true"
                  label-width="58px"
                  @submit.prevent
                >
                  <el-form-item label="店铺" prop="store">
                    <StoreRangePlus
                      v-model="queryParams.store"
                      placeholder="请选择店铺"
                      @change="getList"
                    />
                  </el-form-item>
                  <el-form-item label="商品" prop="nameAndId">
                    <el-input
                      :prefix-icon="Search"
                      class="dialogFormItemWidth"
                      style="width: 200px"
                      v-model="queryParams.nameAndId"
                      placeholder="请输入商品ID/名称/编码"
                      clearable
                      @clear="handleQuery"
                      @keyup.enter="handleQuery"
                    />
                  </el-form-item>

                  <el-form-item label="状态" prop="status">
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
                          { name: '售卖中', code: '1' },
                          { name: '已下架', code: '2' }
                        ]"
                        :key="dict.code"
                        :label="dict.name"
                        :value="dict.code"
                      >
                        <el-tag typeprimary="danger" round v-if="dict.code === '1'">
                          售卖中
                        </el-tag>

                        <el-tag type="danger" round v-if="dict.code === '2'"> 已下架 </el-tag>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="负责人" prop="head">
                    <el-input
                      :prefix-icon="Search"
                      class="dialogFormItemWidth"
                      style="width: 200px"
                      v-model="queryParams.head"
                      placeholder="请输入负责人"
                      clearable
                      @clear="handleQuery"
                      @keyup.enter="handleQuery"
                    />
                  </el-form-item>
                  <el-form-item v-show="isExpand" label="标签" prop="tagName">
                    <el-select
                      class="searchFormItemWidth"
                      v-model="queryParams.tagName"
                      filterable
                      placeholder="请选择标签"
                      clearable
                      @clear="handleQuery"
                      @change="handleQuery"
                    >
                      <el-option
                        v-for="dict in tagList"
                        :key="dict.id"
                        :label="dict.tagName"
                        :value="dict.tagName"
                      >
                        <span
                          v-if="dict.tagSymbol"
                          :style="{
                            background: `${dict.tagColor || '#ee657'} `,
                            paddingLeft: '10px',
                            paddingRight: '10px',
                            borderRadius: '14px',
                            color: '#fff',
                            height: '28px',
                            lineHeight: '28px',
                            marginRight: '10px'
                          }"
                          >{{ dict.tagSymbol }}</span
                        >
                        <span>
                          {{ dict.tagName }}
                        </span>
                      </el-option>
                    </el-select>
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
                  <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0px">
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
          >
            <template #header="scope">
              <!-- 自定义图标 -->
              <div class="row-center">
                <div class="tableHeaderText">{{ scope.column.label }}</div>
              </div>
            </template>
            <el-table-column
              prop="name"
              width="247"
              :show-overflow-tooltip="false"
              label="商品"
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
            <el-table-column label="店铺" prop="store" min-width="220" />
            <el-table-column label="操作" align="center" fixed="right" width="100">
              <template #default="scope">
                <el-button type="primary" @click="selectGood(scope.row)"> 选 择 </el-button>
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
        </div>
      </div>
    </Dialog>
  </div>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { DICT_TYPE, getDictLabel } from '@/utils/dict'
import { getImageUrl } from '@/utils/index'

import { Search } from '@element-plus/icons-vue'

import GoodCard from '@/components/common/goods/goodCard.vue';

import * as GoodsShopApi from '@/api/shop'
import * as CommonApi from '@/api/common/index'
import * as GalleryApi from '@/api/gallery'

const appStore = useAppStore()
const dialogVisible = ref(false) // 弹窗的是否展示
/** 打开弹窗 */
const open = async () => {
  dialogVisible.value = true
  queryParams.page = 1
  queryParams.size = 10
  queryParams.status = ''
  queryParams.nameAndId = ''
  queryParams.store = ''
  queryParams.head = ''
  queryParams.tagName = ''
  queryParams.category = ''

  searchStoreName.value = ''
  queryParams.store = ''
  getList()
  getTagList()
  getCategoryList()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const total = ref(0) // 列表的总页数
const loading = ref(false)
const list = ref([]) // 列表的数据
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

const queryFormRef = ref()

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.page = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  searchStoreName.value = ''
  queryParams.store = ''
  handleQuery()
}

// 选择商品
const selectGood = async (row: any) => {
  await GalleryApi.goodsIsExist({
    goodsId: row.goodsId
  })
  emit('selectGood', row)
  dialogVisible.value = false
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
    const data = await GoodsShopApi.goodsPersonResponsibilityList(param).catch(() => {})
    if (data) {
      list.value = data.records || []
      total.value = data.total
    }
  } finally {
    loading.value = false
  }
}

/** 提交表单 */
const emit = defineEmits(['selectGood']) // 定义 success 事件，用于操作成功后的回调

onMounted(() => {
  getList()
})
</script>

<style lang="less" scoped>
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

:deep(.el-dialog) {
  /* background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important; */
  /* box-shadow: 10px 10px 24px 0px rgba(0, 0, 0, 0.07); */
  /* background: linear-gradient(225deg, #f2f3ff 0%, #ffffff 39%, #ffffff 88%, #f0f8ff 100%); */
}
:deep(.com-dialog .el-dialog__body) {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  min-height: 85vh;
  max-height: 85vh;
}
</style>
