<template>
  <scheme-details ref="detailsRef" name="OfflineNew" :width="1000">
    <template #card>
      <!-- <div> 详情内容区(外围卡片样式无需书写) </div> -->
      <div
        class="header"
        style="
          padding: 16px 20px;
          display: flex;
          align-items: center;
          border-bottom: solid 1px #f0f0f0;
          box-sizing: border-box;
        "
      >
        <div style="background: #0064ff; width: 3px; height: 10px"></div>
        <div style="font-size: 14px; color: #333333; font-weight: 600; padding-left: 6px"
          >基本信息</div
        >
      </div>
      <div class="form-content" style="padding: 24px 0px 20px 20px">
        <el-form ref="formRef" :model="dataValue" label-width="80px" :rules="formRules">
          <el-row>
            <el-col :span="24">
              <el-form-item prop="supplierIds" label="供应商">
                <el-select
                  v-model="dataValue.supplierIds"
                  placeholder="请选择供应商"
                  multiple
                  filterable
                  collapse-tags
                  collapse-tags-tooltip
                  :max-collapse-tags="2"
                >
                  <el-option
                    v-for="item in supplierList"
                    :key="(item as any).supplierId"
                    :value="(item as any).supplierId"
                    :label="(item as any).supplierName"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="quotation" label="报价单">
                <transfer
                  multiple
                  acceptType="all"
                  style="width: 100%"
                  v-model="dataValue.quotation"
                  :limit="5"
                  tip="文件大小不超过5M"
                ></transfer>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="factoryReceivingDate" label="工厂接单日期" class="longLabel">
                <el-date-picker
                  style="width: 100%"
                  v-model="dataValue.factoryReceivingDate"
                  placeholder="请选择工厂接单日期"
                  type="date"
                  value-format="YYYY-MM-DD"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="firstOrderDate" label="首单日期">
                <el-date-picker
                  style="width: 100%"
                  v-model="dataValue.firstOrderDate"
                  placeholder="请选择首单日期"
                  type="date"
                  value-format="YYYY-MM-DD"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="规格">
                <el-table
                  :data="dataValue.offlineNpSkuDetailList"
                  border
                  :header-cell-style="{
                    height: '40px',
                    background: '#F2F6FC'
                  }"
                >
                  <el-table-column label="序号" type="index" width="60"></el-table-column>
                  <el-table-column label="规格名称" prop="specName" width="100">
                    <!-- <template #default="{ row }">
                      <el-input
                        v-if="row.tempId"
                        v-model="row.specName"
                        placeholder="请输入"
                        style="flex: 1"
                      ></el-input>
                      <template v-else>{{ row?.specName || '-' }}</template>
                    </template> -->
                  </el-table-column>
                  <el-table-column label="规格码" prop="specSizeCode" width="80">
                    <!-- <template #default="{ row }">
                      <el-input
                        v-if="row.tempId"
                        v-model="row.specSizeCode"
                        placeholder="请输入"
                        style="flex: 1"
                      ></el-input>
                      <template v-else>{{ row?.specSizeCode || '-' }}</template>
                    </template> -->
                  </el-table-column>
                  <el-table-column label="SKU编码" prop="skuCode" minwidth="160">
                    <!-- <template #default="{ row }">
                      <el-input
                        v-model="row.skuCode"
                        placeholder="请输入"
                        style="flex: 1"
                      ></el-input>
                    </template> -->
                  </el-table-column>
                  <el-table-column label="采购价" prop="purchasePrice" width="122">
                    <template #default="{ row, $index }">
                      <div
                        class="row-center"
                        style="display: flex; align-items: center; width: 100%"
                      >
                        <el-input-number
                          placeholder="请输入"
                          v-model="row.purchasePrice as any"
                          :precision="3"
                          :controls="false"
                          :max="999999999.999"
                          style="width: calc(100% - 20px)"
                        />
                        <el-tooltip
                          v-if="$index === 0"
                          effect="dark"
                          content="一键同步所有数据"
                          placement="bottom"
                        >
                          <img
                            style="width: 16px; height: 16px; margin-left: 6px; cursor: pointer"
                            @click="allSetOneValue(row.purchasePrice, 'purchasePrice')"
                            src="@/assets/imgs/oa/oa_all_add.png"
                          />
                        </el-tooltip>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="零售价" prop="retailPrice" width="122">
                    <template #default="{ row, $index }">
                      <div
                        class="row-center"
                        style="display: flex; align-items: center; width: 100%"
                      >
                        <el-input-number
                          placeholder="请输入"
                          v-model="row.retailPrice as any"
                          :precision="3"
                          :controls="false"
                          :max="999999999.999"
                          style="width: calc(100% - 20px)"
                        />
                        <el-tooltip
                          v-if="$index === 0"
                          effect="dark"
                          content="一键同步所有数据"
                          placement="bottom"
                        >
                          <img
                            style="width: 16px; height: 16px; margin-left: 6px; cursor: pointer"
                            @click="allSetOneValue(row.retailPrice, 'retailPrice')"
                            src="@/assets/imgs/oa/oa_all_add.png"
                          />
                        </el-tooltip>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="下单数量" prop="orderQuantity" width="122">
                    <!-- <template #default="{ row, $index }">
                      <div
                        class="row-center"
                        style="display: flex; align-items: center; width: 100%"
                      >
                        <el-input-number
                          placeholder="请输入"
                          v-model="row.orderQuantity as any"
                          :precision="0"
                          :controls="false"
                          :max="999999999"
                          style="width: 75px"
                        />
                        <el-tooltip
                          v-if="$index === 0"
                          effect="dark"
                          content="一键同步所有数据"
                          placement="bottom"
                        >
                          <img
                            style="width: 16px; height: 16px; margin-left: 6px; cursor: pointer"
                            @click="allSetOneValue(row.orderQuantity, 'orderQuantity')"
                            src="@/assets/imgs/oa/oa_all_add.png"
                          />
                        </el-tooltip>
                      </div>
                    </template> -->
                  </el-table-column>
                  <!-- <el-table-column fixed="right" label="操作" width="60">
                    <template #default="scope">
                      <el-button link type="danger" @click="delSku(scope)">删除</el-button>
                    </template>
                  </el-table-column>
                  <template #append>
                    <el-button
                      type="primary"
                      link
                      style="width: 100%; height: 40px"
                      icon="Plus"
                      @click="addSku"
                      >添加</el-button
                    >
                  </template> -->
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </template>
    <template #button>
      <!-- <div> 按钮操作区 </div> -->
      <el-button @click="detailsRef?.close()" :disabled="loading">取消</el-button>
      <el-button type="primary" @click="submitForm" :disabled="loading">保存</el-button>
    </template>
  </scheme-details>
</template>

<script lang="tsx">
export default { name: 'OfflineNewDetails' }
</script>

<script lang="tsx" setup>
import { FromProvideType } from '@/components/template/config/type'
import { cloneDeep, debounce } from 'lodash-es'
import request from '@/config/axios'
import { v4 as uuidv4 } from 'uuid'

const message = useMessage()
const title = ref('报价核价')

const formRules = ref({
  supplierIds: [{ required: true, message: '请选择供应商', trigger: 'change' }],
  quotation: [{ required: true, message: '请上传报价单', trigger: 'change' }]
})

const { onSearch } = inject(`OfflineNewForm`) as FromProvideType
class DataItem {
  baseInfoId: string = ''
  supplierId: string = ''
  supplierIds: any = []
  remark: string = ''
  quotation: string = ''
  factoryReceivingDate: string = ''
  firstOrderDate: string = ''
  currentNodeCode: string = ''
  offlineNpSkuDetailList: any = []
}
const detailsRef = ref<any>(),
  formRef = ref(),
  dataValue = ref<DataItem>({ ...new DataItem() }),
  bukValue = ref<DataItem>({ ...new DataItem() }),
  viewType = ref<string>('view'),
  loading = ref<boolean>(false)
// 弹出通用
const openView = (item: any = {}, type: string = 'view') => {
  // detailsRef openDrawer方法支持前/后置方法入参，无需操作抽屉显隐，内部已处理
  detailsRef?.value?.openDrawer(
    async () => {
      await getSupplierList()
      const { baseInfoId, currentNodeCode } = item
      const res = await request.get({
        url: `/api/offline/np/process/getSkuInfo/${baseInfoId}`,
        params: {}
      })
      if (res) {
        dataValue.value = {
          ...new DataItem(),
          baseInfoId,
          currentNodeCode,
          offlineNpSkuDetailList: res.length ? res : []
        }
        // bukValue为备份数据，用以处理已操作未保存数据校验，慎重！！！
        bukValue.value = cloneDeep({ ...dataValue.value })
      }
      viewType.value = type
    },
    () => {
      nextTick(() => {
        formRef?.value?.clearValidate()
      })
    }
  )
}

const supplierList = ref([])
const getSupplierList = async () => {
  const res = await request.get({ url: `/api/np/plan/queryAdoptSupplier` })
  supplierList.value = res.length ? res : []
}

// 通用表单校验
const checkValue = async () => {
  return await formRef?.value?.validate((valid: boolean) => {
    return valid
  })
}

// 提交
const submitForm = async () => {
  const valid: boolean = await checkValue()
  if (valid) {
    const { offlineNpSkuDetailList } = dataValue.value
    const hasEmpty = offlineNpSkuDetailList.some(
      (item: any) => !item.purchasePrice || item.purchasePrice === '' || item.purchasePrice === null || item.purchasePrice === undefined
    )
    // 非空校验
    if (hasEmpty) {
      message.notifyWarning('该页面存在采购价或零售价为空，请调整后再保存！')
      return
    }
    const hasError = offlineNpSkuDetailList.some(
      (item: any) => item.purchasePrice < 0 || item.retailPrice < 0
    )
    if (hasError) {
      message.notifyWarning('该页面存在采购价或零售价小于0，请调整后再保存！')
      return
    }
    // // 校验货品编码&skuCode重复
    // const skuCodes = offlineNpSkuDetailList.map((item: any) => item.skuCode)
    // // 判断sku是否重复
    // const skuCodeSet = Array.from(new Set(skuCodes))
    // let isRepeat = false
    // skuCodeSet.forEach((scs) => {
    //   const arr = skuCodes.filter((sc) => sc === scs)
    //   if (arr && arr.length > 1) {
    //     isRepeat = true
    //   }
    // })
    // if (isRepeat) {
    //   message.notifyWarning('该页面存在SKU编码重复，请修改后重新保存！')
    //   return
    // }
    await message.confirm('是否确定保存，保存后数据将流转至下一节点？')
    // const res = await request.post({
    //   url: '/api/offline/np/base/checkProductCodeAndSkuCode',
    //   data: {
    //     baseInfoId: dataValue.value?.baseInfoId || '',
    //     isSubmit: '1',
    //     productCode: '',
    //     skuCodes
    //   }
    // })
    // // 存在旺店通重复skuCode，确认是否强制更新
    // if (res) {
    //   await message.confirm(res)
    //   await submit()
    // } else {
    submit()
    // }
  }
}

// 实际提交（防抖）
const submit = debounce(async () => {
  if (loading.value) return
  loading.value = true
  const { baseInfoId, currentNodeCode, supplierIds, offlineNpSkuDetailList } = dataValue.value
  const temp = cloneDeep(offlineNpSkuDetailList).map((item: any) => {
    const obj = { ...item }
    if (obj.tempId) {
      delete obj.tempId
    }
    return obj
  })
  const offlineNpPriceQuoteInfoDTO = {
    ...dataValue.value,
    supplierId: supplierIds.join() || '',
    offlineNpSkuDetailList: temp || []
  }
  delete offlineNpPriceQuoteInfoDTO.supplierIds
  const data = {
    nodeCode: currentNodeCode || '',
    baseInfoId: baseInfoId || '',
    offlineNpPriceQuoteInfoDTO
  }
  request
    .post({
      url: `/api/offline/np/process/submitNode`,
      data
    })
    .then(() => {
      message.success('操作成功')
      detailsRef?.value?.closed()
      onSearch()
    })
    .finally(() => {
      loading.value = false
    })
}, 500)

defineExpose({ openView })

provide('OfflineNewDetails', { dataValue, bukValue, viewType, title })

// 删除sku
const delSku = (scope: any) => {
  const { $index } = scope
  dataValue.value.offlineNpSkuDetailList.splice($index, 1)
}

// 新增sku
const addSku = () => {
  const { offlineNpSkuDetailList } = dataValue.value
  offlineNpSkuDetailList.push({
    tempId: uuidv4()
  })
}

// 一键同步数据
const allSetOneValue = (value: number, key: string) => {
  const { offlineNpSkuDetailList } = dataValue.value
  offlineNpSkuDetailList.map((item: any) => {
    item[key] = value
  })
}
</script>

<style lang="scss" scoped>
.longLabel {
  :deep(.el-form-item__label) {
    line-height: 16px;
  }
}
</style>
