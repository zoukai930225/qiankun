<template>
  <SWDrawer v-model="drawerVisible" title="商品管理" @close="reset" width="936px" :showBottom="false">
    <div class="content">
      <div class="rule-form">
        <el-form ref="queryFormRef" :inline="true" :model="queryParams" label-width="66px">
          <el-form-item label="分类" class="each-form" prop="goodsType">
            <el-select class="width-220" v-model="queryParams.goodsType" placeholder="请选择" clearable filterable
              @change="handleQuery">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.DY_REFUND_PRODUCT_TYPE, true)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="店铺" class="each-form" prop="store">
            <el-select filterable v-model="queryParams.store" placeholder="请选择店铺" @change="handleQuery" clearable>
              <el-option v-for="item in storeList" :key="item.id" :label="item.nickName" :value="item.code" />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="row-center" style="align-items: flex-start;">
          <el-button class="commonResetBtn new-btn-font" @click="resetQuery" style="width: 60px;">
            重置
          </el-button>
          <el-button type="primary" @click="handleAdd" class="new-btn-font"><el-icon>
              <Plus />
            </el-icon>添加商品ID</el-button>
        </div>
      </div>
      <!-- 列表 -->
      <el-table border :header-cell-style="appStore.headerCellStyle" v-loading="drawerLoading" :data="list"
        :show-overflow-tooltip="false" row-class-name="commonTableRow1" class="SWCommonTable"
        v-horizontal-scroll="'always'" ref="tableRef" :tooltip-options="{ popperClass: 'refund-tips' }">
        <el-table-column label="店铺名称" prop="storeName" min-width="240" show-overflow-tooltip
          :formatter="(row: any) => formatterValue(row, 'storeName', '-')" fixed />
        <el-table-column label="分类" prop="goodsType" min-width="130" show-overflow-tooltip
          :formatter="(row: any) => getDictLabel(DICT_TYPE.DY_REFUND_PRODUCT_TYPE, row.goodsType) || '-'" />
        <el-table-column label="商品id" prop="goodsId" min-width="190" show-overflow-tooltip
          :formatter="(row: any) => formatterValue(row, 'goodsId', '-')" />
        <el-table-column label="零售价" prop="sale" min-width="150"
          :formatter="(row: any) => numberFormateShow(row.sale) || '-'" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleUpdate(row)">编辑</el-button>
            <el-button link type="danger" @click="delGoods(row)" :loading="row.loading">作废</el-button>
          </template>
        </el-table-column>
        <template #empty>
          <div class="flex-column" style="align-items: center;">
            <img class="empty-table" src="@/assets/imgs/promotion/empty.png" alt="" />
            <span>暂无数据</span>
          </div>
        </template>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-wrapper">
        <Pagination :total="total" v-model:page="queryParams.page" v-model:limit="queryParams.size"
          @pagination="getList" />
      </div>
    </div>
  </SWDrawer>
</template>
<script lang="ts" setup>
import { numberFormateShow } from '@/utils/formatter'
import { formatterValue } from "@/utils";
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
import { getQcAccountStoreByChannel } from '@/api/qianchuan'
import * as douyinRefundGoodsManageApi from '@/api/channelData/douyinRefundGoodsManage'
import { cloneDeep, debounce } from 'lodash-es'
const message = useMessage()
const drawerVisible = ref(false)
const drawerLoading = ref(false)
const list = ref<any[]>([])
const queryParams = ref<any>({
  goodsType: undefined,
  store: undefined,
  page: 1,
  size: 10
})
const emit = defineEmits(['update', 'add', 'refresh'])
const storeList = ref<any[]>([])
const total = ref(0)
const reset = () => {
  drawerVisible.value = false
  drawerLoading.value = false
  queryParams.value = {
    goodsType: undefined,
    store: undefined,
    page: 1,
    size: 10
  }
  total.value = 0
}
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

const resetQuery = () => {
  queryParams.value = {
    goodsType: undefined,
    store: undefined,
    page: 1,
    size: 10
  }
  getList()
}
//打开弹框
const open = async (row: any) => {
  drawerVisible.value = true
  getList()
}

const dealParams = (needPage: boolean = false) => {
  const params: any = cloneDeep(queryParams.value)
  Object.keys(params).forEach(key => {
    if (params[key] === '' || params[key] === null) {
      delete params[key]
    }
  })

  if (!needPage) {
    delete params.page
    delete params.size
  }
  return params
}

const getList = async () => {
  drawerLoading.value = true
  try {
    const res = await douyinRefundGoodsManageApi.getGoodsList(dealParams(true))
    list.value = res && res.records && Array.isArray(res.records) ? res.records : []
    total.value = res.total || 0
  } finally {
    drawerLoading.value = false
  }
}
getStoreList()
async function getStoreList() {
  const res = await getQcAccountStoreByChannel({
    channelCode: 'Douyin'
  })
  storeList.value = res
}

//商品作废
const delGoods = debounce(async (row: any) => {
  try {
    await message.confirm(`确认要作废商品id为 [${row.goodsId}] 的商品吗？`)
    row.loading = true
    await douyinRefundGoodsManageApi.deleteGoodsById(row.id)
    message.success('商品作废成功')
    getList()
    emit('refresh')
  } catch (err) { } finally {
    row.loading = false
  }
}, 500)

// 编辑事件
const handleUpdate = (row: any) => {
  emit('update', row)
}

const handleAdd = () => {
  emit('add')
}

defineExpose({ open, getList })
</script>

<style lang="scss" scoped>
.content {
  background-color: #fff;
  width: 100%;
  min-height: calc(100vh - 102px);
  border-radius: 20px;
  padding: 20px;
}

.rule-form {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  & {
    --el-input-inner-height: 30px;
  }

  :deep(.el-form-item__label) {
    padding: 0 10px 0 0;
  }

  .each-form {
    margin-right: 20px;
    margin-bottom: 20px;
  }

  :deep(.el-input) {

    width: 220px !important;
  }


  :deep(.el-input__wrapper) {
    height: 30px;
    padding: 0 11px;
    box-shadow: none;
    border: 1px solid #e5e5e5;

    &:hover {
      box-shadow: none;
      border-color: #0064ff;
    }

    .is-focus {
      box-shadow: none;
      border-color: #0064ff;
    }
  }

  :deep(.el-input__inner) {
    height: 30px;
    line-height: 30px;
  }
}

.right-20 {
  margin-right: 20px !important;
}

.width-220 {
  width: 220px !important;
}


:deep(.refund-tips) {
  max-width: 335px;
}

.new-btn-font {
  font-size: 14px;
}
</style>