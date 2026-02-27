<template>
  <ContentWrap title="详情">
    <div class="rule-form">
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form ref="queryFormRef" :inline="true" :model="queryParams" class="mb-5px" label-width="auto">
            <el-form-item label="订单号" class="each-form" prop="orderNum">
              <el-input class="width-220" v-model.trim="queryParams.orderNum" placeholder="请输入订单号"
                @keyup.enter="handleQuery" @clear="handleQuery" @change="searchInput"/>
              <el-button class="commonResetBtn" @click="resetQuery" style="margin-left: 10px;width: 60px;">
                重置
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <!---订单信息 -->
    <orderTable :loading="loading" :list="orderInfoDetailList" />
    <!---出库信息 -->
    <outboundTable :loading="loading" :list="deliveryInfoDetailList" />
    <!---售后信息 -->
    <afterSaleTable :loading="loading" :list="refundOrderDetailList" />
    <!--入库信息-->
    <warehouseTable :loading="loading" :list="returnWarehousingList" />
  </ContentWrap>
</template>
<script lang="ts" setup>
import orderTable from './components/orderTable.vue';
import outboundTable from './components/outboundTable.vue';
import afterSaleTable from './components/afterSaleTable.vue';
import warehouseTable from './components/warehouseTable.vue';
import * as returnRefundApi from "@/api/finance/returnRefund";
import { debounce } from "lodash-es";
const loading = ref(false)
const message = useMessage();

const queryParams = ref<any>({
  orderNum: '',
})

const queryFormRef = ref()

const resetQuery = () => {
  queryFormRef.value.resetFields()
  queryParams.value.orderNum = route.query.orderNum
  handleQuery()
}
/** 搜索按钮操作 */
const handleQuery = () => {
  getList()
}

const deliveryInfoDetailList = ref<any[]>([])
const orderInfoDetailList = ref<any[]>([])
const refundOrderDetailList = ref<any[]>([])
const returnWarehousingList = ref<any[]>([])

const getList = async () => {
  loading.value = true
  try {

    const data = await returnRefundApi.getInfo(queryParams.value)
    deliveryInfoDetailList.value = data?.deliveryInfoDetailList?.length ? data.deliveryInfoDetailList : []
    orderInfoDetailList.value = data?.orderInfoDetailList?.length ? data.orderInfoDetailList : []
    refundOrderDetailList.value = data?.refundOrderDetailList?.length ? data.refundOrderDetailList : []
    returnWarehousingList.value = data?.returnWarehousingList?.length ? data.returnWarehousingList : []
  } finally {
    loading.value = false
  }
}
const route = useRoute()
const router = useRouter()
onMounted(() => {
  if (!route?.query?.orderNum) {
    router.back()
    message.error('订单号不能为空')
    return
  }
  queryParams.value.orderNum = route.query.orderNum
  getList()
})

const searchInput = debounce(async () => {
  handleQuery()
}, 1000)
</script>
<style lang="scss" scoped>
.rule-form {
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

  :deep(.SWFilterExpandAll-middle-text) {
    color: #666666;
  }

  :deep(.SWFilterExpandAll) {
    margin-bottom: 15px;
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
</style>