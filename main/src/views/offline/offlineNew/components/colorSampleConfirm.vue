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
      <div class="form-content" style="padding: 24px 20px 20px 20px">
        <el-form ref="formRef" :model="dataValue" label-width="80px" :rules="formRules">
          <el-row>
            <el-col :span="24">
              <el-form-item prop="remark" label="备注">
                <s-text-area
                  v-model="dataValue.remark"
                  :autosize="{ minRows: 4, maxRows: 7 }"
                  style="width: 100%"
                  maxlength="200"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="attachmentUrl" label="附件上传">
                <transfer
                  multiple
                  acceptType="all"
                  style="width: 100%"
                  v-model="dataValue.attachmentUrl"
                  :limit="5"
                  tip="文件大小不超过5M"
                ></transfer>
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
                  <el-table-column label="规格名称" prop="specName" min-width="150">
                    <template #default="{ row, $index }">
                      <div
                        class="row-center"
                        style="display: flex; align-items: center; width: 100%"
                      >
                        <el-input
                          v-model="row.specName"
                          placeholder="请输入"
                          style="width: calc(100% - 20px)"
                        ></el-input>
                        <el-tooltip
                          v-if="$index === 0"
                          effect="dark"
                          content="一键同步所有数据"
                          placement="bottom"
                        >
                          <img
                            style="width: 16px; height: 16px; margin-left: 6px; cursor: pointer"
                            @click="allSetOneValue(row.specName, 'specName')"
                            src="@/assets/imgs/oa/oa_all_add.png"
                          />
                        </el-tooltip>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="规格码" prop="specSizeCode" min-width="150">
                    <template #default="{ row, $index }">
                      <div
                        class="row-center"
                        style="display: flex; align-items: center; width: 100%"
                      >
                        <el-select
                          style="width: calc(100% - 20px)"
                          v-model="row.specSizeCode"
                          filterable
                        >
                          <el-option
                            v-for="item in getIntDictOptions('offlineNp_specSize', true)"
                            :key="item.value"
                            :value="item.value"
                            :label="item.label"
                          ></el-option>
                        </el-select>
                        <el-tooltip
                          v-if="$index === 0"
                          effect="dark"
                          content="一键同步所有数据"
                          placement="bottom"
                        >
                          <img
                            style="width: 16px; height: 16px; margin-left: 6px; cursor: pointer"
                            @click="allSetOneValue(row.specSizeCode, 'specSizeCode')"
                            src="@/assets/imgs/oa/oa_all_add.png"
                          />
                        </el-tooltip>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="SKU编码" prop="skuCode" minWidth="240">
                    <template #default="{ row, $index }">
                      <div
                        class="row-center"
                        style="display: flex; align-items: center; width: 100%"
                      >
                        <el-input
                          v-model="row.skuCode"
                          placeholder="请输入"
                          style="width: calc(100% - 20px)"
                        ></el-input>
                        <el-tooltip
                          v-if="$index === 0"
                          effect="dark"
                          content="一键同步所有数据"
                          placement="bottom"
                        >
                          <img
                            style="width: 16px; height: 16px; margin-left: 6px; cursor: pointer"
                            @click="allSetOneValue(row.skuCode, 'skuCode')"
                            src="@/assets/imgs/oa/oa_all_add.png"
                          />
                        </el-tooltip>
                      </div>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column label="采购价" prop="purchasePrice" width="122">
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
                            @click="allSetOneValue(row.retailPrice, 'retailPrice')"
                            src="@/assets/imgs/oa/oa_all_add.png"
                          />
                        </el-tooltip>
                      </div>
                    </template>
                  </el-table-column> -->
                  <el-table-column label="下单数量" prop="orderQuantity" minWidth="150">
                    <template #default="{ row, $index }">
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
                            @click="allSetOneValue(row.orderQuantity, 'orderQuantity')"
                            src="@/assets/imgs/oa/oa_all_add.png"
                          />
                        </el-tooltip>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column fixed="right" label="操作" width="60">
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
                  </template>
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
      <el-button type="primary" @click="submitForm(0)" :disabled="loading">暂存</el-button>
      <el-button type="primary" @click="submitForm(1)" :disabled="loading">保存</el-button>
    </template>
  </scheme-details>
</template>

<script lang="tsx">
export default { name: 'OfflineNewDetails' }
</script>

<script lang="tsx" setup>
import STextArea from '@/components/common/input/s-textarea.vue'
import { FromProvideType } from '@/components/template/config/type'
import { cloneDeep, debounce } from 'lodash-es'
import request from '@/config/axios'
import { getIntDictOptions } from '@/utils/dict'
import { v4 as uuidv4 } from 'uuid'

const message = useMessage()
const title = ref('齐色样确认')

const formRules = ref({
  // supplierIds: [{ required: true, message: '请选择供应商', trigger: 'change' }],
  // attachmentUrl: [{ required: true, message: '请上传附件', trigger: 'change' }]
})

const { onSearch } = inject(`OfflineNewForm`) as FromProvideType
class DataItem {
  baseInfoId: string = ''
  remark: string = ''
  attachmentUrl: string = ''
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
      // await getSupplierList()
      const { baseInfoId, currentNodeCode } = item
      const resp = await request.get({
        url: `/api/offline/np/process/getColorSampleConfirmInfo/${baseInfoId}`,
        params: {}
      })
      dataValue.value = { ...new DataItem() }
      if (resp) {
        Object.assign(dataValue.value, {
          baseInfoId,
          currentNodeCode,
          attachmentUrl: resp?.attachmentUrl || '',
          remark: resp?.remark || ''
        })
      }
      const res = await request.get({
        url: `/api/offline/np/process/getSkuInfo/${baseInfoId}`,
        params: {}
      })
      if (res) {
        Object.assign(dataValue.value, {
          baseInfoId,
          currentNodeCode,
          offlineNpSkuDetailList: res.length ? res : []
        })
        // bukValue为备份数据，用以处理已操作未保存数据校验，慎重！！！
      }
      bukValue.value = cloneDeep({ ...dataValue.value })
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
const submitForm = async (flag: number = 0) => {
  if (flag === 0) {
    // 暂存
    const { offlineNpSkuDetailList } = dataValue.value
    const temp = cloneDeep(offlineNpSkuDetailList).filter(
      (item: any) =>
        item.specName ||
        item.specSizeCode ||
        item.skuCode ||
        (item.orderQuantity !== null &&
          item.orderQuantity !== '' &&
          item.orderQuantity !== undefined)
    )
    submit(0, temp)
  } else {
    // 提交
    const valid: boolean = await checkValue()
    if (valid) {
      const { offlineNpSkuDetailList } = dataValue.value
      const hasEmpty = offlineNpSkuDetailList.some(
        (item: any) =>
          item.orderQuantity === null ||
          item.orderQuantity === '' ||
          item.orderQuantity === undefined ||
          !item.specName ||
          !item.specSizeCode ||
          !item.skuCode
      )
      // 非空校验
      if (hasEmpty) {
        message.notifyWarning('该页面存在规格名称、规格码、SKU编码或下单数量为空，请调整后再保存！')
        return
      }
      // 下单数量校验
      const hasError = offlineNpSkuDetailList.some((item: any) => item.orderQuantity < 0)
      if(hasError) {
        message.notifyWarning('该页面存在下单数量小于0，请调整后再保存！')
        return
      }
      // 校验货品编码&skuCode重复
      const skuCodes = offlineNpSkuDetailList.map((item: any) => item.skuCode)
      // 判断sku是否重复
      const skuCodeSet = new Set(skuCodes)
      if (skuCodeSet.size !== skuCodes.length) {
        message.notifyWarning('该页面存在SKU编码重复，请调整后再保存！')
        return
      }
      await message.confirm('是否确定保存，保存后数据将流转至下一节点？')
      const res = await request.post({
        url: '/api/offline/np/base/checkProductCodeAndSkuCode',
        data: {
          baseInfoId: dataValue.value?.baseInfoId || '',
          isSubmit: '1',
          productCode: '',
          skuCodes
        }
      })
      // 存在旺店通重复skuCode，确认是否强制更新
      if (res) {
        await message.confirm(res)
        await submit(1, offlineNpSkuDetailList)
      } else {
        submit(1, offlineNpSkuDetailList)
      }
    }
  }
}

// 实际提交（防抖）
const submit = debounce(async (flag: number = 0, offlineNpSkuDetailList: any = []) => {
  if (loading.value) return
  loading.value = true
  const { baseInfoId, currentNodeCode } = dataValue.value
  const offlineNpColorSampleConfirmDTO = {
    ...dataValue.value,
    isSubmit: flag,
    offlineNpSkuDetailList: cloneDeep(offlineNpSkuDetailList) || []
  }
  const data = {
    nodeCode: currentNodeCode || '',
    baseInfoId: baseInfoId || '',
    offlineNpColorSampleConfirmDTO
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
  // if (!value) return
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
:deep() {
  .card_info {
    .el-card__body.el-card__body {
      padding: 0 !important;
    }
  }
}
</style>
