<template>
  <scheme-details ref="detailsRef" name="OfflineNew" :width="800">
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
            <el-col :span="12">
              <el-form-item prop="productName" label="品名">
                <el-input v-model="dataValue.productName" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="sampleGarmentStyleNumber" label="样衣款号">
                <el-input
                  v-model="dataValue.sampleGarmentStyleNumber"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="styleChart" label="款式图">
                <!-- <el-input v-model="dataValue.styleChart" placeholder="请输入"></el-input> -->
                <transfer
                  multiple
                  style="width: 100%"
                  v-model="dataValue.styleChart"
                  :limit="5"
                ></transfer>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="estimatedLaunchDate" label="预计上新日期" class="longLabel">
                <el-date-picker
                  type="date"
                  v-model="dataValue.estimatedLaunchDate"
                  style="width: 100%"
                  placeholder="请选择预计上新日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="productCode" label="货品编码">
                <el-input v-model="dataValue.productCode" placeholder="请输入货品编码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="categoryCode" label="品类">
                <!-- <el-select v-model="dataValue.categoryCode" filterable>
                  <el-option
                    v-for="item in getIntDictOptions('offlineNp_categoryCode', true)"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  ></el-option>
                  <template #label></template>
                </el-select> -->
                <CategorySelect
                  v-model="dataValue.categoryCode as any"
                  style="width: 100%"
                ></CategorySelect>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="certificateProductName" label="合格证品名" class="longLabel">
                <template #label>
                  <div>
                    <div>合格证</div>
                    <div>品名</div>
                  </div>
                </template>
                <el-input
                  v-model="dataValue.certificateProductName"
                  placeholder="请输入合格证品名"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="fabricComposition" label="面料成分">
                <FabricComposition
                  :list="
                    (dataValue.fabricComposition && dataValue.fabricComposition.split(',')) || []
                  "
                  @delete-click="deleteFabricCompositionSupplement"
                  @add-click="addFabricCompositionSupplement"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="fabricSpecification" label="面料规格">
                <el-input
                  v-model="dataValue.fabricSpecification"
                  placeholder="请输入面料幅宽/克重/折米价"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="fabricSupplier" label="面料供应商" class="longLabel">
                <template #label>
                  <div>
                    <div>面料</div>
                    <div>供应商</div>
                  </div>
                </template>
                <!-- <el-input v-model="dataValue.fabricSupplier" placeholder="请输入面料供应商">
                </el-input> -->
                <el-select
                  v-model="dataValue.fabricSupplier"
                  placeholder="请选择面料供应商"
                  filterable
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
            <el-col :span="12">
              <el-form-item label="执行标准" prop="executionStandards" label-width="80px">
                <el-select
                  v-model="dataValue.executionStandards"
                  placeholder="请选择执行标准"
                  clearable
                  style="width: 100%"
                >
                  <el-option
                    v-for="dict in getIntDictOptions('EXECUTION_STANDARDS', true)"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="安全类别" prop="securityCategory" label-width="80px">
                <el-select
                  v-model="dataValue.securityCategory"
                  placeholder="请选择安全类别"
                  clearable
                  style="width: 100%"
                >
                  <el-option
                    v-for="dict in getIntDictOptions('SECURITY_CATEGORY', true)"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="specSizeCodes" label="规格码">
                <el-select
                  v-model="dataValue.specSizeCodes"
                  multiple
                  filterable
                  collapse-tags
                  collapse-tags-tooltip
                  @change="changeSize"
                >
                  <el-option
                    v-for="item in getIntDictOptions('offlineNp_specSize', true)"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="specName" label="规格名称">
                <FabricComposition
                  :list="(dataValue.specName && dataValue.specName.split(',')) || []"
                  add-text="添加规格"
                  @delete-click="deleteSpecName"
                  @add-click="addSpecName"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24" style="padding: 0 20px 0 0">
              <div
                style="
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  padding-bottom: 10px;
                "
              >
                <div style="font-size: 14px; color: #666666">SKU</div>
                <el-button type="primary" @click="restoreSku">规格还原</el-button>
              </div>
              <el-table
                :data="dataValue.offlineNpSkuDetailList"
                border
                :header-cell-style="{
                  height: '40px',
                  background: '#F2F6FC'
                }"
              >
                <el-table-column label="序号" type="index" width="70"></el-table-column>
                <el-table-column label="规格名称" prop="specName" width="130"></el-table-column>
                <el-table-column label="规格码" prop="specSizeCode" width="130"></el-table-column>
                <el-table-column label="SKU编码" prop="skuCode">
                  <template #default="{ row }">
                    <!-- <div class="row-center" style="display: flex; align-items: center; width: 100%"> -->
                    <el-input v-model="row.skuCode" placeholder="请输入" style="flex: 1"></el-input>
                    <!-- <el-tooltip effect="dark" content="一键同步所有数据" placement="bottom">
                        <img
                          style="width: 16px; height: 16px; margin-left: 6px; cursor: pointer"
                          @click=""
                          src="@/assets/imgs/oa/oa_all_add.png"
                        />
                      </el-tooltip> -->
                    <!-- </div> -->
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="80">
                  <template #default="scope">
                    <el-button link type="danger" @click="delSku(scope)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </template>
    <template #button>
      <!-- <div> 按钮操作区 </div> -->
      <el-button @click="detailsRef?.close()" :disabled="loading">取消</el-button>
      <el-button @click="submitForm(0)" :disabled="loading">暂存</el-button>
      <el-button type="primary" @click="submitForm(1)" :disabled="loading">保存</el-button>
    </template>
  </scheme-details>

  <!-- 面料成分新增 -->
  <FabricCompositionSupplementDialog
    v-if="dialogVisibleSupplement"
    v-model="dialogVisibleSupplement"
    @confirm="handleConfirmSupplement"
  />

  <spec-color-dialog ref="specColorDialogRef" @save="saveSpecName"></spec-color-dialog>
</template>

<script lang="tsx">
export default { name: 'OfflineNewDetails' }
</script>

<script lang="tsx" setup>
import { defineAsyncComponent } from 'vue'
import { FromProvideType } from '@/components/template/config/type'
import { viewTypeCheck } from '@/components/template/config/index'
import { cloneDeep, debounce } from 'lodash-es'
import { DataItem } from '../page/config'
import CategorySelect from '@/views/OA/new/components/selectCategory.vue'
import FabricComposition from '@/views/OA/new/designGallery/components/formComponents/fabricComposition.vue'
import FabricCompositionSupplementDialog from '@/views/OA/new/designGallery/components/formComponents/fabricCompositionSupplementDialog.vue'
import specColorDialog from '../components/specColorDialog.vue'
import request from '@/config/axios'
import { getIntDictOptions } from '@/utils/dict'

const message = useMessage()

const { onSearch } = inject(`OfflineNewForm`) as FromProvideType

const detailsRef = ref<any>(),
  formRef = ref(),
  dataValue = ref<DataItem>({ ...new DataItem() }),
  bukValue = ref<DataItem>({ ...new DataItem() }),
  viewType = ref<string>('view'),
  loading = ref<boolean>(false),
  dialogVisibleSupplement = ref(false)

// const props = defineProps({
//   dicInfo: { type: Array<any>, default: () => [] },
// });

const title = computed(() => (viewType.value === 'add' ? '建档' : viewTypeCheck(viewType.value)))

const formRules = ref({
  productName: [{ required: true, message: '请输入品名', trigger: 'blur' }],
  styleChart: [{ required: true, message: '请上传款式图', trigger: 'change' }],
  productCode: [{ required: true, message: '请输入货品编码', trigger: 'blur' }],
  categoryCode: [{ required: true, message: '请选择品类', trigger: 'change' }],
  specSizeCodes: [{ required: true, message: '请选择规格码', trigger: 'change' }],
  specNameCode: [{ required: true, message: '请添加规格名称', trigger: 'change' }],
  estimatedLaunchDate: [{ required: true, message: '请选择预计上新日期', trigger: 'change' }]
  // offlineNpSkuDetailList: [{ required: true, message: 'SKU不能为空', trigger: 'change' }]
})

// 弹出通用
const openView = (item: any = {}, type: string = 'view') => {
  // detailsRef openDrawer方法支持前/后置方法入参，无需操作抽屉显隐，内部已处理
  detailsRef?.value?.openDrawer(
    async () => {
      await getSupplierList()
      if (type !== 'add') {
        const { baseInfoId } = item
        const res = await request.get({
          url: `/api/offline/np/base/baseDetail/${baseInfoId}`,
          params: {}
        })
        if (res) {
          const { baseInfoDetail, skuDetails } = res
          const temp = {
            ...baseInfoDetail,
            specSizeCodes: baseInfoDetail?.specSizeCode
              ? baseInfoDetail?.specSizeCode.split(',')
              : [],
            offlineNpSkuDetailList: skuDetails || []
            // categoryCodes: getCategory(categoryCode)
          }
          dataValue.value = { ...new DataItem(), ...temp }
        }
      } else {
        dataValue.value = { ...new DataItem(), ...item }
      }
      // bukValue为备份数据，用以处理已操作未保存数据校验，慎重！！！
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

const getCategory = (val: string) => {
  if (!val) return []
  const arr = val.split('-')
  const res: string[] = []
  let str = ''
  return arr.map((item: string) => {
    res.push((str += str === '' ? item : '-' + item))
  })
  return res
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
const submitForm = async (flag = 1) => {
  if (flag === 1) {
    const valid: boolean = await checkValue()
    valid && submit(flag)
  } else {
    confirmSubmit(flag)
  }
}

// 实际提交（防抖）
const submit = debounce(async (flag = 1) => {
  if (loading.value) return
  const { productCode, offlineNpSkuDetailList } = dataValue.value
  if (!offlineNpSkuDetailList || offlineNpSkuDetailList.length === 0) {
    message.notifyWarning('SKU列表不能为空！')
    return
  }
  const hasEmpytSku = offlineNpSkuDetailList.some((item: any) => !item.skuCode)
  if (hasEmpytSku) {
    message.notifyWarning('该页面存在SKU编码为空，请修改后重新保存！')
    return
  }
  // 校验货品编码&skuCode重复
  const skuCodes = offlineNpSkuDetailList.map((item: any) => item.skuCode)
  // 判断sku是否重复
  const skuCodeSet = new Set(skuCodes)
  const isRepeat = skuCodeSet.size !== skuCodes.length
  if (isRepeat) {
    message.notifyWarning('该页面存在SKU编码重复，请修改后重新保存！')
    return
  }
  await message.confirm('是否确定保存，保存后数据将流转至下一节点？')
  const res = await request.post({
    url: '/api/offline/np/base/checkProductCodeAndSkuCode',
    data: { baseInfoId: dataValue.value?.baseInfoId || '', isSubmit: flag, productCode, skuCodes }
  })
  // 存在旺店通重复skuCode，确认是否强制更新
  if (res) {
    await message.confirm(res)
    await confirmSubmit(flag)
  } else {
    confirmSubmit(flag)
  }
}, 500)

// 最终提交事件
const confirmSubmit = async (flag = 1) => {
  const offlineNpCreateBaseInfoDTO = { ...dataValue.value }
  if (
    offlineNpCreateBaseInfoDTO.specSizeCodes &&
    offlineNpCreateBaseInfoDTO.specSizeCodes.length > 0
  ) {
    offlineNpCreateBaseInfoDTO.specSizeCode = offlineNpCreateBaseInfoDTO.specSizeCodes.join()
    delete offlineNpCreateBaseInfoDTO.specSizeCodes
  }
  offlineNpCreateBaseInfoDTO.isSubmit = flag
  offlineNpCreateBaseInfoDTO.processStatus = flag === 1 ? '100' : ''
  // const { categoryCodes } = offlineNpCreateBaseInfoDTO
  // offlineNpCreateBaseInfoDTO.categoryCode = categoryCodes as any
  loading.value = true
  request
    .post({
      url: `/api/offline/np/process/submitNode`,
      data: {
        nodeCode: 'createBaseInfo',
        baseInfoId: offlineNpCreateBaseInfoDTO?.baseInfoId || '',
        offlineNpCreateBaseInfoDTO
      }
    })
    .then(() => {
      message.success('操作成功')
      detailsRef?.value?.closed()
      onSearch()
    })
    .finally(() => {
      loading.value = false
    })
}

defineExpose({ openView })

provide('OfflineNewDetails', { dataValue, bukValue, viewType, title })

/**************************************以上文件文件内容非必要不可删除，按需追加使用******************************************************* */
// 新增面料
const addFabricCompositionSupplement = () => {
  dialogVisibleSupplement.value = true
}

// 删除面料
const deleteFabricCompositionSupplement = (index) => {
  const arr = dataValue.value.fabricComposition.split(',') || []
  let newArr = arr.filter((item, idx) => {
    return idx !== index
  })
  dataValue.value.fabricComposition = newArr.join(',')
}

// 面料新增确认
const handleConfirmSupplement = (data) => {
  if (dataValue.value.fabricComposition && data) {
    const arr = dataValue.value.fabricComposition.split(',') || []
    arr.push(data)
    dataValue.value.fabricComposition = arr.join(',')
  } else {
    dataValue.value.fabricComposition = data || ''
  }
}

// 新增规格名称
const specColorDialogRef = ref()
const addSpecName = () => {
  specColorDialogRef?.value?.openDialog()
}

// 删除规格名称
const deleteSpecName = (index) => {
  const arr = dataValue.value.specName.split(',') || []
  let newArr = arr.filter((item, idx) => {
    return idx !== index
  })
  dataValue.value.specName = newArr.join(',')
  calcSkuList()
}

// 保存规格名称
const saveSpecName = (spec: string) => {
  const arr = dataValue.value.specName ? dataValue.value.specName.split(',') : []
  console.log(arr)
  if (!arr.includes(spec)) {
    arr.push(spec)
    dataValue.value.specName = arr.join()
  }
  calcSkuList()
}

// 重新生成skulist
const calcSkuList = () => {
  const { specSizeCodes, specName, offlineNpSkuDetailList } = dataValue.value
  const { offlineNpSkuDetailList: bukOfflineNpSkuDetailList } = bukValue.value
  // 没有规格码、规格名称
  if (!specSizeCodes || specSizeCodes.length === 0 || !specName) {
    dataValue.value.offlineNpSkuDetailList = []
    bukValue.value.offlineNpSkuDetailList = []
    return
  }
  const specNames = specName.split(',')
  const arr: any = []
  specNames.forEach((sn: string) => {
    specSizeCodes.forEach((ssc: string) => {
      arr.push({
        specName: sn,
        specSizeCode: ssc,
        skuCode: ''
      })
    })
  })
  // 历史数据赋值
  arr.forEach((item: any) => {
    // 已经保存的数据
    const obj = bukOfflineNpSkuDetailList.find(
      (sku: any) => item.specName === sku.specName && item.specSizeCode === sku.specSizeCode
    )
    if (obj && obj.skuCode) {
      item.skuCode = obj.skuCode
    }
    const temp = offlineNpSkuDetailList.find(
      (sku: any) => item.specName === sku.specName && item.specSizeCode === sku.specSizeCode
    )
    if (temp && temp.skuCode) {
      item.skuCode = temp.skuCode
    }
  })
  dataValue.value.offlineNpSkuDetailList = arr
}

// 删除sku
const delSku = (scope: any) => {
  const { $index } = scope
  dataValue.value.offlineNpSkuDetailList.splice($index, 1)
}

// 调整规格码
const changeSize = () => {
  calcSkuList()
}

// 规格还原
const restoreSku = () => {
  message
    .confirm('还原后，数据将回到最原始的数据，你做的所有修改都不可找回！确认是否还原')
    .then((res) => {
      if (res === 'confirm') {
        // 还原未提交的skuCode
        const { offlineNpSkuDetailList: bukOfflineNpSkuDetailList } = bukValue.value
        const { offlineNpSkuDetailList } = dataValue.value
        offlineNpSkuDetailList.forEach((ofnSku: any) => {
          const buk = bukOfflineNpSkuDetailList.some(
            (item: any) =>
              item.specName === ofnSku.specName &&
              item.specSizeCode === ofnSku.specSizeCode &&
              item.skuCode === ofnSku.skuCode
          )
          if (!buk) {
            ofnSku.skuCode = ''
          }
        })
      }
    })
}
</script>
<style lang="scss" scoped>
@use './styles.scss';
.right-operate {
  position: relative;
}
:deep() {
  .card_info {
    .el-card__body {
      padding: 0 !important;
    }
  }
  .el-form-item {
    margin: 0 20px 16px 0 !important;
  }
}
.longLabel {
  :deep(.el-form-item__label) {
    line-height: 16px;
  }
}
</style>
