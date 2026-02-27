<template>
  <ContentWrap is-auto-height ref="contentWrapRef">
    <table-box v-bind="{ maxViewHeight: innerHeight, thresholdValue: 0 }">
      <template #prePart>
        <el-row :gutter="24">
          <el-col :span="20" class="!flex-1">
            <el-form
              ref="queryFormRef"
              :model="queryParams"
              :label-width="90"
              @submit.prevent="handleQuery"
            >
              <el-row>
                <el-col :span="6">
                  <el-form-item label="货品编码" prop="goodsNo">
                    <scroll-select
                      class-name="!w-100%"
                      v-model:model-value="queryParams.goodsNo"
                      :api="getInfoByGoodsCode"
                      item-label-key="goodsCode"
                      item-value-key="goodsCode"
                      selectKey="goodsCode"
                      :multiple="true"
                      clearable
                      @change="handleQuery"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item label="类目" prop="categories">
                    <el-cascader
                      v-model="categoryCode"
                      :options="productInfoData.categoryOptions"
                      :props="customProps"
                      placeholder="请选择货品类目"
                      collapse-tags
                      collapse-tags-tooltip
                      clearable
                      @change="handleQuery"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item label="下架状态" prop="outOfStocks">
                    <el-select
                      v-model="queryParams.outOfStocks"
                      placeholder="请选择"
                      clearable
                      multiple
                      @change="handleQuery"
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
                </el-col>

                <el-col :span="6">
                  <el-form-item label="生产周期" prop="productionCycles" v-show="isExpand">
                    <el-select
                      v-model="queryParams.productionCycles"
                      placeholder="请选择"
                      clearable
                      multiple
                      @change="handleQuery"
                      value-on-clear=""
                    >
                      <el-option
                        v-for="dict in getIntDictOptions(DICT_TYPE.SC_PRODUCTON_CYCLE, true)"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item label="跟单员" prop="userIds" v-show="isExpand">
                    <select-people
                      v-model:list="supplierProduct.personList"
                      v-model:model-value="userIds"
                      :api="getScPersonsApi"
                      @change="handleQuery"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item label="商品等级" prop="levels" v-show="isExpand">
                    <el-select
                      v-model="queryParams.levels"
                      placeholder="请选择"
                      clearable
                      multiple
                      @change="handleQuery"
                      value-on-clear=""
                    >
                      <el-option
                        v-for="dict in getIntDictOptions(DICT_TYPE.SC_GOODS_LEVEL, true)"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>

          <el-col :span="4" class="!flex justify-end min-w-380px">
            <el-button @click="handleQuery" class="commonSearchBtn">
              <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
              搜索
            </el-button>
            <el-button @click="resetQuery" class="commonResetBtn" :style="{ marginLeft: '0px' }">
              重置
            </el-button>
            <special-dropdown :btns="btnOps" :loading-btns="['导出']" :show-default="false" />

            <el-button @click="isExpand = !isExpand" type="primary" link class="ml12px !h-32px">
              <img
                src="@/assets/svgs/supplier/zhankai.svg"
                alt=""
                class="mr4px"
                :style="{ transform: !isExpand ? 'rotate(180deg)' : 'rotate(0)' }"
              />
              {{ isExpand ? '收起' : '展开' }}
            </el-button>
          </el-col>
        </el-row>
      </template>

      <list-table
        :list="list"
        :total="total"
        :loading="loading"
        @view_sku_details="handleViewSkuDetails"
        @publish_product="handlePublishProduct"
        @unpubilish_product="handleUnpublishProduct"
        @edit_product="handleEditProduct"
        @selection_change="handleSelectionChange"
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
    </table-box>
  </ContentWrap>
  <!-- 选择供应商 -->
  <ChooseSupplier ref="chooseSupplierRef" @success="getList" />
  <!-- 编辑分类弹窗 -->
  <EditDrawer ref="editDrawerRef" @success="getList" />
</template>

<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

import * as productInfoApi from '@/api/supplier/productInfo'
import specialDropdown from '../components/specialDropdown.vue'
import { Icon } from '@/components/Icon'
import EditDrawer from './components/editDrawer.vue'
import listTable from './components/listTable.vue'
import ChooseSupplier from './components/chooseSupplier.vue'
const router = useRouter()
import { productInfoStore } from '@/store/modules/productInfo'
import { customProps } from '../supplierProduct/options'
import { getInfoByGoodsCode, getScPersonsApi } from '@/api/supplier/purchase'
import { useSupplierProduct } from '@/store/modules/supplier'
import selectPeople from '@/views/supplier/components/selectPeople.vue'
import tableBox from '../components/tableBox.vue'
import ContentWrap from '@/components/ContentWrap/src/ContentWrap.vue'
import download from '@/utils/download'
import { formatDate } from '@/utils/formatTime'

const productInfoData = productInfoStore()

const message = useMessage() // 消息弹窗
const supplierProduct = useSupplierProduct()
const isExpand = ref(false) // 是否展开

const getProductCategoryList = async () => {
  const res = await productInfoApi.getProductCategoryList()
  // options.value = res || []
  productInfoData.categoryOptions = res || [] // 更新到store中
}
const categoryCode = ref<string[][] | undefined>([])
const contentWrapRef = ref<InstanceType<typeof ContentWrap>>()
const innerHeight = computed(() => contentWrapRef.value?.cardInnerHeigh || 0)
const userIds = computed({
  get: () => (queryParams.value.userIds.length ? queryParams.value.userIds?.join(',') : undefined),
  set: (val) => (queryParams.value.userIds = val?.split(',') || [])
})

const btnOps = [
  {
    label: '供应商',
    option: openChooseSupplierDialog,
    icon: h(Icon, { icon: 'ep:plus' }),
    permission: 'ProductInfo:Supplier'
  },
  {
    label: '上架',
    option: () => handlePublish('publish'),
    permission: 'ProductInfo:Publish'
  },
  {
    label: '下架',
    option: () => handlePublish('unpublish'),
    permission: 'ProductInfo:UnPublish'
  },
  {
    label: '同步ERP',
    option: () => handleSyncERP(),
    permission: 'ProductInfo:ERP'
  },
  {
    label: '导出',
    option: handleExport,
    icon: h(Icon, { icon: 'ep:download' }),
    permission: 'ProductInfo:Export'
  }
]

// 打开选择供应商弹窗
const chooseSupplierRef = ref<{ open: (selectedProducts) => void } | null>(null)
function openChooseSupplierDialog() {
  if (selectedProducts.value.length === 0) {
    message.warning('请先选择货品')
    return
  }
  chooseSupplierRef.value?.open(selectedProducts.value)
}

// 上架/下架操作
const handlePublish = async (keyValue: string) => {
  try {
    const params = {
      outOfStock: keyValue === 'publish' ? 0 : 1, // 上架为0，下架为1
      goodsIds: selectedProducts.value.map((item) => item.goodsId) // 选中的商品ID
    }
    await message.confirm(`是否确定${keyValue === 'publish' ? '上架' : '下架'}选中的商品?`)

    await productInfoApi.updateProductStatus(params)
    message.success(`${keyValue === 'publish' ? '上架' : '下架'}成功!`)
    // 刷新列表
    await getList()
  } catch {}
}

// 同步ERP操作
const handleSyncERP = async () => {
  try {
    await message.confirm('是否确定同步商品到ERP?')
    const res = await productInfoApi.syncProductsToERP()
    if (!res.success) {
      message.error(res.message)
      return
    }
    message.success('同步成功!')
    // 刷新列表
    await getList()
  } catch {}
}

async function handleExport() {
  try {
    const res = await productInfoApi.downloadProductInfo(queryParams.value)
    download.excel(res, `货品信息导出_${formatDate(new Date(), 'YYYYMMDDHHmmss')}.xlsx`)
  } catch (error) {}
}

// 查看SKU明细逻辑
const handleViewSkuDetails = (goodsId: string) => {
  // 处理打开新页面
  router.push({ name: 'productInfoNewPage', query: { goodsId } })
}

// 打开编辑抽屉
const editDrawerRef = ref<{ open: (id: string) => void } | null>(null)
const handleEditProduct = (goodsId: string) => {
  // 处理编辑商品逻辑
  console.log('-- 编辑商品 --', goodsId)
  editDrawerRef.value?.open(goodsId)
}

// 选择商品
const selectedProducts = ref<any[]>([])
const handleSelectionChange = (selection: any[]) => {
  // 处理选择变化逻辑
  console.log('选择的商品:', selection)
  selectedProducts.value = selection
}
// 单个上架
const handlePublishProduct = async (goodsId: string) => {
  await handleUpdateProductStatus(goodsId, true)
}

// 单个下架
const handleUnpublishProduct = async (goodsId: string) => {
  await handleUpdateProductStatus(goodsId, false)
}

// 统一处理单个商品上下架
const handleUpdateProductStatus = async (goodsId: string, isPublish: boolean) => {
  try {
    const actionText = isPublish ? '上架' : '下架'
    const params = {
      outOfStock: isPublish ? 0 : 1,
      goodsIds: [goodsId]
    }

    await message.confirm(`是否确定${actionText}选中的商品?`)

    await productInfoApi.updateProductStatus(params)
    message.success(`${actionText}成功!`)

    // 刷新列表
    await getList()
  } catch (error) {}
}

// 查询参数
const queryFormRef = ref()
const queryParams = ref({
  pageSize: 10,
  pageNum: 1,
  goodsNo: '', // 货品编码
  supplierIds: [], // 供应商
  categories: [] as any[], // 类目
  outOfStocks: [], // 下架状态
  productionCycles: [], // 生产周期
  levels: [], // 商品等级
  userIds: [] as any[] // 跟单员
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
  categoryCode.value = []
  handleQuery()
}

// 列表数据
const loading = ref(false) // 加载状态
const total = ref(0)
const list = ref<any>([])
const getList = async () => {
  try {
    loading.value = true
    queryParams.value.categories = Array.from(new Set(categoryCode.value?.flat() || []).values())
    const params = { ...queryParams.value }

    const res = await productInfoApi.getProductInfoList(params)
    list.value = res.records || []
    total.value = res.total || 0
  } finally {
    loading.value = false
  }
}

// 获取跟单人员列表
const selectLoading = ref(false)
const getPeopleList = async () => {
  try {
    selectLoading.value = true
    const data = await productInfoApi.getSupplyChainCenterList()
    productInfoData.peopleList = data || [] // 更新到store中
  } catch (error) {
    console.error('请求失败:', error)
  } finally {
    selectLoading.value = false
  }
}

onBeforeMount(() => {
  supplierProduct.getSupplierList()
  productInfoData.getCategoryOptions()
  getPeopleList()
  getSupplierList()
  getList()
  getProductCategoryList()
})
</script>

<style lang="less" scoped>
@import url(../index.scss);
</style>
