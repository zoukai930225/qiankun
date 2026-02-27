<template>
  <SWDrawer v-model="visible" :title="title" :width="936" @close="reset">
    <advance ref="advanceRef" :height="`${bodyHeight}px`">
      <template #first>
        <div ref="cardRef" style="height: 100%">
          <el-scrollbar>
            <div class="card">
              <div class="header">
                <CardTitle :title="'基本信息'" />
              </div>
              <div class="inner">
                <div class="form">
                  <el-form scroll-to-error :model="dataItem" ref="formRef" label-width="75px" inline>
                    <el-form-item label="货品编码" prop="productCode" style="width: 32%">
                      <el-input v-model="dataItem.productCode" disabled />
                    </el-form-item>
                    <el-form-item label="系列" prop="series" style="width: 32%">
                      <el-input v-model="dataItem.series" disabled />
                    </el-form-item>
                    <el-form-item label="品类" prop="categoryName" style="width: 32%">
                      <el-input v-model="dataItem.categoryName" disabled />
                    </el-form-item>
                    <el-form-item label="二开原因" prop="secondaryDevReason"
                      style="margin-bottom: 0px !important; width: 98.5%">
                      <s-text-area v-model="dataItem.secondaryDevReason" disabled />
                    </el-form-item>
                    <el-form-item label="销量预估" prop="salesForecast" style="margin-bottom: 0px !important; width: 98.5%">
                      <!-- <el-input v-model="dataItem.secondaryDevReason" disabled  /> -->
                      <transfer disabled :upLoad-data="{ code: 'SALES_FORECAST' }" :width="768"
                        v-model="dataItem.salesForecast" :limit="5" is-all />
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="header">
                <CardTitle :title="'进度详情'" />
                <div class="tips">
                  <img :src="notice" />
                  <span>关于试穿结果(通过,不通过)请通过下方按钮操作来推动新品流程!</span>
                </div>
                <div class="btn">
                  <el-select v-model="dataValue.inProgress" style="width: 100px" @change="getDataInfo(() => { })">
                    <el-option label="流程中" :value="true" />
                    <el-option label="已淘汰" :value="false" />
                  </el-select>
                </div>
              </div>
              <div class="inner">
                <div class="card_body">
                  <progress-supplier-step :list="dataValue.list" :height="cardHeight" :item="dataItem" @update="update"
                    @quote="quote" />
                </div>
                <div class="flex-column empty" v-if="dataValue.list?.length === 0">
                  <img class="empty-table" src="@/assets/imgs/promotion/empty.png" alt="" />
                  <span>暂无数据</span>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </template>
      <template #second>
        <div>
          <div class="back_btn">
            <el-button link text @click="prev">
              <el-icon>
                <ArrowLeft />
              </el-icon>返回</el-button>
          </div>
          <develop-quote v-if="isSecond" v-model="quoteValue" :height="bodyHeight - 25" :row="dataItem"
            :supplier="supplierData" ref="quoteRef" />
        </div>
      </template>
    </advance>
    <template #footer>
      <el-button @click="reset">关闭</el-button>
      <el-button v-if="isSecond" @click="submit" type="primary" :disabled="loading">提交</el-button>
    </template>
  </SWDrawer>
</template>

<script lang="ts" setup>
defineOptions({ name: 'DevelopProgress' })
import STextArea from "@/components/common/input/s-textarea.vue";
import Advance from '@/components/common/advance/advance.vue'
import ProgressSupplierStep from './SupplierStep.vue'
import notice from '@/assets/svgs/notice.svg'
import DevelopQuote from './quote.vue'
import request from '@/config/axios'

class Item {
  id: string = ''
  fsTaskId: string = ''
  supplierId: string = ''
  productCostExcludingTax: number | null = null
  productCostIncludingTax: number | null = null
  packagingManpower: number | null = null
  finishedProductCost: number | null = null
  sumOrderQuantity: number | null = null
  productionCycle: string = ''
  packagingCost: number | null = null
  productCostRemark: number | null = null
  remark: string = ''
  quotationSheetFile: string = ''
  colorSizeGroups: Array<any> = []
}

const message = useMessage()

const visible = ref<boolean>(false),
  cardHeight = ref<number>(300),
  bodyHeight = ref<number>(300),
  supplierData = ref<any>({}),
  advanceRef = ref(),
  loading = ref<boolean>(false)

const dataItem = ref<any>({}),
  dataValue = ref<any>({ inProgress: true, list: [] }),
  isSecond = ref<boolean>(false),
  quoteRef = ref(),
  quoteValue = ref<Item>({ ...new Item() })

const title = computed(() =>
  !isSecond.value ? '打样进度' : `${supplierData.value?.supplierName || ''}-报价核价`
)

const getDataInfo = (fun: Function) => {
  request
    .get({
      url: `/workflow-api/api/workflow/business/factorySecondary/supplierInfo/list`,
      params: { fsTaskId: dataItem.value.id, inProgress: dataValue.value.inProgress }
    })
    .then((res: any) => {
      dataValue.value = { ...dataValue.value, list: !!res?.length ? res : [] }
      fun()
    })
}

const update = () => {
  getDataInfo(() => { })
}

const open = async (row: any) => {
  dataItem.value = row
  dataValue.value = { inProgress: true, list: [] }
  getDataInfo(() => {
    visible.value = true
    isSecond.value = false
    advanceRef?.value?.setActiveItem('first')
    supplierData.value = {}
    initObserver()
  })
}

const reset = async () => {
  visible.value = false
  clearObserver()
}

const onResize = () => {
  setTimeout(() => {
    if (window.innerHeight) {
      bodyHeight.value = window.innerHeight - 135
      cardHeight.value = window.innerHeight - 443
    }
  }, 500)
}

const quote = async (item: any) => {
  supplierData.value = { ...item }
  const supplierInfo: any = await request.get({
    url: `/workflow-api/api/workflow/business/factorySecondary/supplierInfo/queryFsSupplierQuoteVerification`,
    params: { supplierInfoId: supplierData.value.id }
  })
  supplierInfo?.fsTaskId && (quoteValue.value = { ...new Item(), ...supplierInfo })
  const colorInfo: any = await request.get({
    url: `/workflow-api/api/workflow/business/factorySecondary/supplierInfo/queryWaitQuotePriceList/${dataItem.value.id}/${supplierData.value.supplierId}`
  })
  colorInfo?.records?.length &&
    (quoteValue.value = { ...quoteValue.value, colorSizeGroups: colorInfo.records })
  advanceRef.value?.next()
  isSecond.value = true
}

const prev = () => {
  isSecond.value = false
  advanceRef?.value?.prev()
}

const submit = async () => {
  const check: boolean = await quoteRef?.value?.valueCheck()
  if (check) {
    if (!!quoteValue.value.colorSizeGroups?.length) {
      const loadValue: any = ElLoading.service({ fullscreen: true, text: '数据保存中' })
      loading.value = true
      request
        .post({
          url: `/workflow-api/api/workflow/business/factorySecondary/supplierInfo/confirmQuotePrice`,
          data: {
            ...quoteValue.value,
            id: supplierData.value.id,
            fsTaskId: dataItem.value.id,
            supplierId: supplierData.value.supplierId
          }
        })
        .then((res: any) => {
          message.success('保存成功')
          prev()
          getDataInfo(() => { })
        })
        .finally(() => {
          loading.value = false
          loadValue?.close()
        })
    } else {
      message.warning('请选择SKU明细')
    }
  }
}

watchEffect(() => {
  onResize()
})

const initObserver = () => {
  onResize()
  window.addEventListener('resize', onResize)
}

const clearObserver = () => {
  window.removeEventListener('resize', onResize)
}

defineExpose({ open })
</script>

<style scoped lang="scss">
@use '@/views/OA/factory/style/card.scss';

.card_body {
  width: 100%;
  overflow-x: auto;
  display: inline-flex;

  .card_flex {
    width: 260px;
    margin-right: 20px;
  }
}

.el-form-item {
  margin: 0 10px 20px 0 !important;
}

.tips {
  display: inline-flex;
  margin-left: 18px;
  color: #eb3737;
  font-size: 14px;
  font-weight: 400;

  span {
    display: inline-block;
    padding-left: 5px;
  }
}

.empty {
  .empty-table {
    margin: 10px auto;
  }

  span {
    text-align: center;
  }
}
</style>
