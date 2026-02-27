<template>
  <SWDrawer v-model="visible" :title="title" :width="936" @close="reset">
    <advance ref="advanceRef" :height="`${bodyHeight}px`">
      <template #first>
        <div ref="cardRef" style="height: 100%">
          <el-scrollbar>
            <div class="card">
              <div class="header" style="display: flex;align-items: center;justify-content: space-between;">
                <CardTitle :title="'基本信息'" />
                <el-button link @click="isExpand = !isExpand" type="primary"
                  >
                  <el-icon class="el-icon--right" style="margin-right: 4px;">
                    <component :is="!isExpand ? 'ArrowDown' : 'ArrowUp'" />
                  </el-icon>
                  {{ txt }}
                </el-button>
              </div>
              <div class="inner" v-if="isExpand">
                <form-description :column="2">
                  <form-description-item label="货品编码">{{
                    dataItem.productCode || '-'
                  }}</form-description-item>
                  <form-description-item label="系列">{{
                    dataItem.series || '-'
                  }}</form-description-item>
                  <form-description-item label="品类" :span="2">{{
                    dataItem.categoryName || '-'
                  }}</form-description-item>
                  <form-description-item label="二开原因" :span="2">{{
                    dataItem.secondaryDevReasonName || '-'
                  }}</form-description-item>
                  <form-description-item label="备注" :span="2">{{
                    dataItem.remark || '-'
                  }}</form-description-item>
                  <form-description-item label="销量预估" :span="2">
                    <transfer
                      disabled
                      :upLoad-data="{ code: 'SALES_FORECAST' }"
                      :width="720"
                      v-model="dataItem.salesForecast"
                      :limit="5"
                      is-all
                  /></form-description-item>
                </form-description>
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
                  <el-select
                    v-model="dataValue.inProgress"
                    style="width: 100px"
                    @change="getDataInfo(() => {})"
                  >
                    <el-option label="流程中" :value="true" />
                    <el-option label="已淘汰" :value="false" />
                  </el-select>
                </div>
              </div>
              <div class="inner">
                <div class="card_body">
                  <progress-supplier-step
                    :list="dataValue.list"
                    :height="cardHeight"
                    :item="dataItem"
                    :isExpand="isExpand"
                    @update="update"
                    @quote="quote"
                    @withdrawal="withdrawal"
                    @fabric="fabric"
                  />
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
              <el-icon> <ArrowLeft /> </el-icon>返回</el-button
            >
          </div>
          <develop-quote
            v-if="isSecond"
            v-model="quoteValue"
            :height="bodyHeight - 25"
            :row="dataItem"
            :supplier="supplierData"
            ref="quoteRef"
            :disabled="buttonType === 'view'"
          />
        </div>
      </template>
    </advance>
    <template #footer>
      <el-button @click="reset">取消</el-button>
      <template v-if="isSecond">
        <el-button v-if="buttonType === 'add'" @click="submit" type="primary" :disabled="loading"
          >提交</el-button
        >
        <el-button
          v-if="buttonType === 'view' && (supplierData?.displayWithdrawBtn || false)"
          @click="withdrawal(supplierData)"
          type="primary"
          :disabled="loading"
          >撤回</el-button
        >
      </template>
    </template>
  </SWDrawer>
</template>

<script lang="ts" setup>
defineOptions({ name: 'DevelopProgress' })
import { defineAsyncComponent } from 'vue'
import STextArea from '@/components/common/input/s-textarea.vue'
import Advance from '@/components/common/advance/advance.vue'
import ProgressSupplierStep from './SupplierStep.vue'
import notice from '@/assets/svgs/notice.svg'
import DevelopQuote from './quote.vue'
import request from '@/config/axios'
import { useDialog } from '@/hooks/web/useDialog'
import FormDescription from '@/components/Descriptions/src/FormDescription.vue'
import FormDescriptionItem from '@/components/Descriptions/src/FormDescriptionItem.vue'
const { openDialog } = useDialog()
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

const isExpand = ref(false)
const txt = computed(() => isExpand.value ? '收起' : '展开')

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
  getDataInfo(() => {})
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
  isExpand.value = false
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

const buttonType = ref('add')
const quote = async ({ item, type }) => {
  buttonType.value = type
  supplierData.value = { ...item }
  const supplierInfo: any = await request.get({
    url: `/workflow-api/api/workflow/business/factorySecondary/supplierInfo/queryFsSupplierQuoteVerification`,
    params: { supplierInfoId: supplierData.value.id }
  })
  supplierInfo?.fsTaskId && (quoteValue.value = { ...new Item(), ...supplierInfo })
  const colorInfo: any = await request.get({
    // url: `/workflow-api/api/workflow/business/factorySecondary/supplierInfo/queryWaitQuotePriceList/${dataItem.value.id}/${supplierData.value.supplierId}`
    url: `/workflow-api/api/workflow/business/factorySecondary/supplierInfo/queryQuotePriceAggList/${dataItem.value.id}/${supplierData.value.supplierId}`
  })
  colorInfo?.length && (quoteValue.value = { ...quoteValue.value, colorSizeGroups: colorInfo })
  advanceRef.value?.next()
  isSecond.value = true
  nextTick(() => {
    quoteRef?.value?.reset()
  })
}

const prev = () => {
  isSecond.value = false
  advanceRef?.value?.prev()
}

const submit = async () => {
  // nextTick(async () => {
  setTimeout(async () => {
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
            getDataInfo(() => {})
          })
          .finally(() => {
            loading.value = false
            loadValue?.close()
          })
      } else {
        message.warning('请选择规格明细')
      }
    }
  }, 0)
  // })
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

// 撤回
const withdrawal = (item: any) => {
  openDialog({
    title: '撤回',
    width: 600,
    content: defineAsyncComponent(() => import('./widthdrawal.vue')),
    props: { item },
    showConfirmFooter: true,
    confirmText: '确定',
    cancelText: '取消',
    alignCenter: true,
    footerStyle: { borderTop: 'solid #e5e5e5 1px' },
    onSuccess: async () => {
      advanceRef?.value?.setActiveItem('first')
      isSecond.value = false
      update()
      // tableRef.value?.refresh?.(true)
    }
  })
}

// 面料结果确认
const fabric = (item: any) => {
  openDialog({
    title: `${item.supplierName}`,
    width: 600,
    content: defineAsyncComponent(() => import('./fabric.vue')),
    props: { item },
    showConfirmFooter: true,
    alignCenter: true,
    confirmText: '提交',
    cancelText: '取消',
    footerStyle: { borderTop: 'solid #e5e5e5 1px' },
    onSuccess: async () => {
      update()
      // await nextTick()
      // tableRef.value?.refresh?.(true)
    }
  })
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
  align-items: center;
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
