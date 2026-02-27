<template>
  <ContentWrap is-auto-height ref="contentWrapRef">
    <table-box v-bind="{ maxViewHeight: innerHeight, thresholdValue: 0 }">
      <template #prePart>
        <div class="commonTopFilterWrap">
          <div class="commonTopFilterWrap-filter">
            <el-form
              ref="queryFormRef"
              :inline="true"
              :model="queryParams"
              :label-width="90"
              @submit.prevent="handleQuery"
            >
              <el-form-item label="SKU编码:" prop="sku">
                <scroll-select
                  class-name="!w-220px"
                  v-model:model-value="queryParams.sku"
                  :api="getInfoBySku2"
                  item-label-key="sku"
                  item-value-key="sku"
                  selectKey="sku"
                  :multiple="true"
                  clearable
                  @change="handleQuery"
                />
              </el-form-item>

              <el-form-item label="下架状态" prop="outOfStocks">
                <el-select
                  v-model="queryParams.outOfStocks"
                  placeholder="请选择"
                  clearable
                  multiple
                  @change="handleQuery"
                  style="width: 220px"
                  value-on-clear=""
                >
                  <el-option
                    v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_WHETHER, true)"
                    :key="dict.value"
                    :label="dict.label"
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
              <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0">
                重置
              </el-button>
            </div>
          </div>
        </div>
      </template>

      <div class="table-wrapper">
        <list-table
          :list="list"
          :total="total"
          :loading="loading"
          @publish_product="handlePublishProduct"
          @unpubilish_product="handleUnpublishProduct"
          @edit_product="handleEditProduct"
        />
        <div class="pagination">
          <!-- 分页 -->
          <Pagination
            v-model:limit="queryParams.pageSize"
            v-model:page="queryParams.pageNum"
            :total="total"
            @pagination="getList"
          />
        </div>

        <div class="flex justify-end">
          <el-button @click="handleBack">返回</el-button>
        </div>

        <!-- 编辑分类弹窗 -->
        <EditDrawer ref="editDrawerRef" @success="getList" />
      </div>
    </table-box>
  </ContentWrap>
</template>

<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

import * as productInfoApi from '@/api/supplier/productInfo'

import EditDrawer from './components/newPageEditDrawer.vue'
import listTable from './components/newPageListTable.vue'
import { useTagsView } from '@/hooks/web/useTagsView'
const tagsViewStore = useTagsView()
import { productInfoStore } from '@/store/modules/productInfo'
import { getInfoBySku2 } from '@/api/supplier/purchase'
import tableBox from '../../components/tableBox.vue'
import ContentWrap from '@/components/ContentWrap/src/ContentWrap.vue'

const productInfoData = productInfoStore()

const message = useMessage() // 消息弹窗
const router = useRouter()

const contentWrapRef = ref<InstanceType<typeof ContentWrap>>()
const innerHeight = computed(() => contentWrapRef.value?.cardInnerHeigh || 0)
// 编辑
const editDrawerRef = ref<{ open: (goodsId: string) => void } | null>(null)
const handleEditProduct = (goodsId: string) => {
  // 处理编辑商品逻辑
  console.log('-- 编辑商品 --', goodsId)
  editDrawerRef.value?.open(goodsId)
}

// 上架商品
const handlePublishProduct = async (skuId: any) => {
  await handleUpdateSkuStatus(skuId, true)
}

// 下架商品
const handleUnpublishProduct = async (skuId: any) => {
  await handleUpdateSkuStatus(skuId, false)
}

// 统一处理SKU上下架
const handleUpdateSkuStatus = async (skuId: string, isPublish: boolean) => {
  try {
    const actionText = isPublish ? '上架' : '下架'
    const params = {
      outOfStock: isPublish ? 0 : 1,
      skuIds: [skuId]
    }

    await message.confirm(`是否确定${actionText}选中的商品?`)

    await productInfoApi.updateSkuStatus(params)
    message.success(`${actionText}成功!`)

    // 刷新列表
    await getList()
  } catch (error) {}
}

// 查询参数
const queryFormRef = ref()
const route = useRoute()
const queryParams = ref({
  pageSize: 10,
  pageNum: 1,
  sku: '',
  outOfStocks: [],
  goodsId: route.query.goodsId || ''
})

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1
  getList()
}

// 获取供应商列表
const getSupplierList = async () => {
  const res = await productInfoApi.getApprovedSuppliers()
  productInfoData.supplierList = res || [] // 更新到store中
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields()
  handleQuery()
}

// 列表数据
const loading = ref(false) // 加载状态
const total = ref(0)
const list = ref<any>([])
const getList = async () => {
  try {
    loading.value = true

    const params = { ...queryParams.value }

    const res = await productInfoApi.getSkuDetailList(params)
    list.value = res.records || []
    total.value = res.total || 0
  } finally {
    loading.value = false
  }
}

function handleBack() {
  router.push({ name: 'ProductInfo' })
  tagsViewStore.closeCurrent()
}

onBeforeMount(() => {
  productInfoData.getCategoryOptions()
  getSupplierList()
  getList()
})
</script>

<style lang="less" scoped>
@import url('../index.scss');

// 查询条件
.productInfoTopFilter {
  background-color: #fff;
  padding: 20px 20px 0 20px;
  border-radius: 12px 12px 0 0;
  min-width: 1000px;
}
:deep(.el-button-group) {
  display: flex;
  margin-left: 12px;
}

:deep(.longlabel .el-form-item--default .el-form-item__label) {
  line-height: 1.5;
}

:deep(.el-form--inline .el-form-item) {
  margin-right: 16px;
}

// 表格样式
.table-wrapper {
  background: #fff;
  box-sizing: border-box;
  border-radius: 0 0 12px 12px;

  .tab-wrapper {
    .tabs-label {
      display: flex;
      align-items: center;
    }

    .tab-icon {
      width: 16px;
      margin-right: 8px;
    }

    :deep(.el-tabs__item.is-active),
    :deep(.el-tabs__item:hover) {
      color: #0064ff;
    }

    :deep(.el-tabs__active-bar) {
      background-color: #0064ff;
    }
  }
}

// 分页
.pagination {
  display: flex;
  justify-content: flex-end;
}
.footer {
  display: flex;
  justify-content: flex-end;
}
</style>
