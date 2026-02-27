<template>
  <ex-screen is-details name="Quality" :site="{ right: 80, bottom: 80 }" ref="screenRef">
    <div class="quality_body" v-loading="loading">
      <el-form
        :model="dataValue"
        ref="detailsRef"
        :rules="{ qualityInspectionCycle: [{ required: true }] }"
        :disabled="viewType !== 'add'"
        style="margin-bottom: 20px"
      >
        <el-form-item label="质检周期" prop="qualityInspectionCycle">
          <el-select
            v-model="dataValue.qualityInspectionCycle"
            style="width: 334px"
            @change="valueChange"
            :suffix-icon="viewType === 'view' ? '' : 'ArrowDown'"
          >
            <el-option
              v-for="item in cycle"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="质检信息" name="first" />
        <el-tab-pane label="问题结果" name="second" />
      </el-tabs>
      <quality-details-base ref="baseRef" v-show="activeName === 'first'" />
      <quality-details-size
        v-show="dataValue.qualityInspectionCycle !== 3 && activeName === 'first'"
        style="margin-top: 20px"
        ref="sizeRef"
      />
      <quality-details-trail
        v-show="dataValue.qualityInspectionCycle === 3 && activeName === 'first'"
        style="margin-top: 20px"
        ref="trailRef"
      />
      <quality-details-detection v-show="activeName === 'second'" ref="detectionRef" />
    </div>
    <template #footer>
      <el-button @click="changeTab(activeName)">{{
        activeName === 'first' ? '下一步' : '上一步'
      }}</el-button>
      <el-button
        type="primary"
        v-if="viewType !== 'view' && activeName === 'second'"
        @click="submitForm"
        :disabled="loading"
        >提交</el-button
      >
    </template>
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'QualityDetails' }
</script>

<script lang="tsx" setup>
import QualityDetailsDetection from '../components/detection.vue'
import QualityDetailsTrail from '../components/trail.vue'
import QualityDetailsBase from '../components/base.vue'
import QualityDetailsSize from '../components/size.vue'
import { useDetails, DataItem } from './details'
import { cloneDeep, debounce } from 'lodash-es'
import { executablePage } from './executable'
import { cycle } from '../components/dic'
import request from '@/config/axios'
import { useRole } from '@/hooks/common/useRole'
const { getPermissionInfo, getRole } = useRole('供应链')
const router = useRouter(),
  route = useRoute()

const message = useMessage()

const { viewType, queryInfo, initRouter } = useDetails()

const detailsRef = ref<any>(),
  loading = ref<boolean>(false),
  dataValue = ref<DataItem>({ ...new DataItem() }),
  bukValue = ref<DataItem>({ ...new DataItem() }),
  userOption = ref<any>([])

const baseRef = ref(),
  sizeRef = ref(),
  screenRef = ref(),
  trailRef = ref(),
  detectionRef = ref(),
  activeName = ref('first')

const changeTab = (tab: string) => {
  if (tab === 'first') activeName.value = 'second'
  else activeName.value = 'first'
}

const checkValue = async () => {
  const baseValid: boolean = baseRef?.value ? await baseRef.value.checkValue() : true
  console.log(baseValid)
  if (!baseValid) activeName.value = 'first'
  let sizeValid = true,
    trailValid = true
  if (dataValue.value.qualityInspectionCycle !== 3) {
    sizeValid = sizeRef?.value ? await sizeRef.value.checkValue() : true
    if (!sizeValid) activeName.value = 'first'
  }
  if (dataValue.value.qualityInspectionCycle === 3) {
    trailValid = trailRef?.value ? await trailRef.value.checkValue() : true
    if (!trailValid) activeName.value = 'first'
  }

  const detectionValid: boolean = detectionRef?.value ? await detectionRef.value.checkValue() : true
  return baseValid && trailValid && sizeValid && detectionValid
}

// 提交
const submitForm = async () => {
  const valid: boolean = await checkValue()
  if (!valid) return message.error('存在未填写内容，请检查后再提交！')
  valid && ((loading.value = true), submit())
}

// 实际提交（防抖）
const submit = debounce(async () => {
  let params: any = cloneDeep({ ...dataValue.value })
  if (dataValue.value.qualityInspectionCycle === 3) {
    params = {
      ...params,
      chestPatchesProductProcess: params.chestPatchesProductProcessList.join(','),
      chestPatchesStyle: params.chestPatchesStyleList.join(','),
      packingMethod: params.packingMethodList.join(',')
    }
    delete params.chestPatchesProductProcessList
    delete params.chestPatchesStyleList
    delete params.packingMethodList
  } else {
    // 非尾期，剔除货期字段
    delete params.deliveryTime
  }
  // 默认字段判断
  if (params.itemNumberIdDic) delete params.itemNumberIdDic
  if (params.productTypeDic) delete params.productTypeDic
  if (params.scPurchaseOrderNos) delete params.scPurchaseOrderNos
  if (params.styleDic) delete params.styleDic
  if (params.supplierList) delete params.supplierList
  const url: string = `/api/qcQualityInspectionReportInfo/${dataValue.value?.id ? 'edit' : 'add'}${dataValue.value.qualityInspectionCycle === 3 ? 'LastData' : 'EarlyMiddleData'}`
  request
    .post({ url, data: params })
    .then(() => {
      message.success('操作成功')
      const para = {
        scPurchaseOrderNo: queryInfo?.value?.scPurchaseOrderNo || '',
        timestamp: new Date().getTime()
      }
      screenRef?.value?.backToPage('refresh', para)
    })
    .finally(() => {
      loading.value = false
    })
}, 500)

const initValue = async (value: number = 1, isInit: boolean = true) => {
  // 如果有生产订单号，通过生产订单查询信息
  const temp = {
    ...new DataItem(),
    qualityInspectionCycle: value,
    dimenMeasureList: [
      {
        partName: '1/2腰围',
        tolerance: '±1',
        sizeDetailsOne: { standard: '28', sample: '' },
        sizeDetailsTwo: { standard: '30', sample: '' },
        sizeDetailsThree: { standard: '32', sample: '' },
        sizeDetailsFour: { standard: '34', sample: '' }
      },
      {
        partName: '1/2臀围(不含橡筋)',
        tolerance: '±1',
        sizeDetailsOne: { standard: '33', sample: '' },
        sizeDetailsTwo: { standard: '35', sample: '' },
        sizeDetailsThree: { standard: '37', sample: '' },
        sizeDetailsFour: { standard: '39', sample: '' }
      },
      {
        partName: '前中长(不含橡筋)',
        tolerance: '±0.5',
        sizeDetailsOne: { standard: '9.2', sample: '' },
        sizeDetailsTwo: { standard: '9.7', sample: '' },
        sizeDetailsThree: { standard: '10.2', sample: '' },
        sizeDetailsFour: { standard: '10.7', sample: '' }
      },
      {
        partName: '后中长(不含橡筋)',
        tolerance: '±0.5',
        sizeDetailsOne: { standard: '16.5', sample: '' },
        sizeDetailsTwo: { standard: '17.7', sample: '' },
        sizeDetailsThree: { standard: '18.9', sample: '' },
        sizeDetailsFour: { standard: '20.1', sample: '' }
      },
      {
        partName: '浪长',
        tolerance: '±0.5',
        sizeDetailsOne: { standard: '13', sample: '' },
        sizeDetailsTwo: { standard: '13.5', sample: '' },
        sizeDetailsThree: { standard: '14', sample: '' },
        sizeDetailsFour: { standard: '14.5', sample: '' }
      },
      {
        partName: '1/2裤脚宽',
        tolerance: '±0.5',
        sizeDetailsOne: { standard: '20.5', sample: '' },
        sizeDetailsTwo: { standard: '21.5', sample: '' },
        sizeDetailsThree: { standard: '22.5', sample: '' },
        sizeDetailsFour: { standard: '23.5', sample: '' }
      },
      {
        partName: '前浪宽(不含脚)',
        tolerance: '±0.5',
        sizeDetailsOne: { standard: '6.5', sample: '' },
        sizeDetailsTwo: { standard: '6.5', sample: '' },
        sizeDetailsThree: { standard: '7.2', sample: '' },
        sizeDetailsFour: { standard: '7.2', sample: '' }
      },
      {
        partName: '后浪宽(不含脚)',
        tolerance: '±0.5',
        sizeDetailsOne: { standard: '16', sample: '' },
        sizeDetailsTwo: { standard: '16.5', sample: '' },
        sizeDetailsThree: { standard: '17', sample: '' },
        sizeDetailsFour: { standard: '17.5', sample: '' }
      },
      {
        partName: '侧边长(不含橡筋)',
        tolerance: '±0.5',
        sizeDetailsOne: { standard: '8.2', sample: '' },
        sizeDetailsTwo: { standard: '8.7', sample: '' },
        sizeDetailsThree: { standard: '9.2', sample: '' },
        sizeDetailsFour: { standard: '9.7', sample: '' }
      },
      {
        partName: '1/2裤高',
        tolerance: '±0.5',
        sizeDetailsOne: { standard: '20.8', sample: '' },
        sizeDetailsTwo: { standard: '21.9', sample: '' },
        sizeDetailsThree: { standard: '23', sample: '' },
        sizeDetailsFour: { standard: '24.1', sample: '' }
      }
    ]
  }
  if (queryInfo?.value?.scPurchaseOrderNo) {
    // 查询接口
    const res = await request.get({
      url: `/api/QCInspection/getBaseInfo/${queryInfo?.value?.scPurchaseOrderNo}`,
      params: {}
    })
    if (res?.scPurchaseOrderNo) {
      // 塞入默认数据
      const obj = {
        scPurchaseOrderNo: res.scPurchaseOrderNo, // 生产订单号
        scPurchaseOrderId: res.scPurchaseOrderId,
        scPurchaseOrderNos: res.scPurchaseOrderNo
          ? [
              {
                label: res.scPurchaseOrderNo,
                value: res.scPurchaseOrderNo
              }
            ]
          : [],
        purchasedGoodsQuantity: res?.purchasedGoodsQuantity || '', // 采购数量
        deliveryTime: res?.orderArrivalTime || '' // 货期
      }
      if (res?.supplierId) {
        obj['supplier'] = res?.supplierId || '' // 供应商id
      }
      if (res?.supplierId && res?.supplierName) {
        // 供应商集合
        obj['supplierList'] = [
          {
            value: res?.supplierId || '',
            label: res?.supplierName || ''
          }
        ]
      }
      if (res?.goodsCodes && res?.goodsCodes.length > 0) {
        if (res?.goodsCodes.length === 1) {
          obj['itemNumberIds'] = res.goodsCodes[0].goodsId || '' // 款号
          obj['itemNumberNames'] = res.goodsCodes[0].goodsNo || ''
        }
        obj['itemNumberIdDic'] =
          res?.goodsCodes.map((item: any) => {
            return {
              label: item?.goodsNo || '',
              value: item?.goodsId || ''
            }
          }) || [] // 款号集合
      }
      if (res?.goodsType) {
        obj['productType'] = String(res?.goodsType) || ''
      }
      if (res?.goodsType && res?.goodsTypeDisplay) {
        obj['productTypeDic'] = [
          {
            label: res?.goodsTypeDisplay || '',
            value: String(res?.goodsType) || ''
          }
        ]
      }
      if (res?.categoryCode) {
        obj['styleDescription'] = res?.categoryCode || ''
      }
      if (res?.categoryCode && res?.categoryName) {
        obj['styleDic'] = [
          {
            label: res?.categoryName || '',
            value: res?.categoryCode || ''
          }
        ]
      }
      if (res?.orderHandlerId) {
        obj['orderFollowId'] = res?.orderHandlerId || ''
        if (res?.orderHandler) {
          obj['orderFollow'] = [
            {
              realName: res?.orderHandler?.name || '',
              userId: res?.orderHandler?.userId || '',
              avatarOrigin: res?.orderHandler?.avatarOrigin || ''
            }
          ]
        }
      }
      Object.assign(temp, obj)
    }
  }
  dataValue.value = {
    ...temp
    // ...new DataItem(),
    // qualityInspectionCycle: value, dimenMeasureList: [
    //   { partName: '1/2腰围', tolerance: '±1', sizeDetailsOne: { standard: '28', sample: '' }, sizeDetailsTwo: { standard: '30', sample: '' }, sizeDetailsThree: { standard: '32', sample: '' }, sizeDetailsFour: { standard: '34', sample: '' } },
    //   { partName: '1/2臀围(不含橡筋)', tolerance: '±1', sizeDetailsOne: { standard: '33', sample: '' }, sizeDetailsTwo: { standard: '35', sample: '' }, sizeDetailsThree: { standard: '37', sample: '' }, sizeDetailsFour: { standard: '39', sample: '' } },
    //   { partName: '前中长(不含橡筋)', tolerance: '±0.5', sizeDetailsOne: { standard: '9.2', sample: '' }, sizeDetailsTwo: { standard: '9.7', sample: '' }, sizeDetailsThree: { standard: '10.2', sample: '' }, sizeDetailsFour: { standard: '10.7', sample: '' } },
    //   { partName: '后中长(不含橡筋)', tolerance: '±0.5', sizeDetailsOne: { standard: '16.5', sample: '' }, sizeDetailsTwo: { standard: '17.7', sample: '' }, sizeDetailsThree: { standard: '18.9', sample: '' }, sizeDetailsFour: { standard: '20.1', sample: '' } },
    //   { partName: '浪长', tolerance: '±0.5', sizeDetailsOne: { standard: '13', sample: '' }, sizeDetailsTwo: { standard: '13.5', sample: '' }, sizeDetailsThree: { standard: '14', sample: '' }, sizeDetailsFour: { standard: '14.5', sample: '' } },
    //   { partName: '1/2裤脚宽', tolerance: '±0.5', sizeDetailsOne: { standard: '20.5', sample: '' }, sizeDetailsTwo: { standard: '21.5', sample: '' }, sizeDetailsThree: { standard: '22.5', sample: '' }, sizeDetailsFour: { standard: '23.5', sample: '' } },
    //   { partName: '前浪宽(不含脚)', tolerance: '±0.5', sizeDetailsOne: { standard: '6.5', sample: '' }, sizeDetailsTwo: { standard: '6.5', sample: '' }, sizeDetailsThree: { standard: '7.2', sample: '' }, sizeDetailsFour: { standard: '7.2', sample: '' } },
    //   { partName: '后浪宽(不含脚)', tolerance: '±0.5', sizeDetailsOne: { standard: '16', sample: '' }, sizeDetailsTwo: { standard: '16.5', sample: '' }, sizeDetailsThree: { standard: '17', sample: '' }, sizeDetailsFour: { standard: '17.5', sample: '' } },
    //   { partName: '侧边长(不含橡筋)', tolerance: '±0.5', sizeDetailsOne: { standard: '8.2', sample: '' }, sizeDetailsTwo: { standard: '8.7', sample: '' }, sizeDetailsThree: { standard: '9.2', sample: '' }, sizeDetailsFour: { standard: '9.7', sample: '' } },
    //   { partName: '1/2裤高', tolerance: '±0.5', sizeDetailsOne: { standard: '20.8', sample: '' }, sizeDetailsTwo: { standard: '21.9', sample: '' }, sizeDetailsThree: { standard: '23', sample: '' }, sizeDetailsFour: { standard: '24.1', sample: '' } },
    // ]
  }
  !!isInit && (bukValue.value = cloneDeep({ ...dataValue.value }))
}

const valueChange = (value: any) => {
  setTimeout(() => {
    initValue(value, false)
    baseRef?.value?.resetFields()
    trailRef.value?.resetFields()
  }, 0)
}

const getDataValue = () => {
  loading.value = true
  request
    .get({ url: `/api/qcQualityInspectionReportInfo/${queryInfo.value.id}` })
    .then((res: any) => {
      if (res?.id) {
        const id: string = res.id
        if (res.qualityInspectionCycle !== 3) {
          dataValue.value = {
            ...res,
            ...res.earlyMiddleInfo,
            id,
            problemDescriptionList: res?.earlyMiddleInfo?.problemDescriptionList || []
          }
        } else {
          dataValue.value = {
            ...res,
            ...res.lastInfo,
            id,
            chestPatchesProductProcessList: res?.lastInfo?.chestPatchesProductProcess
              ? res.lastInfo.chestPatchesProductProcess.split(',')
              : [],
            chestPatchesStyleList: res?.lastInfo?.chestPatchesStyle
              ? res.lastInfo.chestPatchesStyle.split(',')
              : [],
            packingMethodList: res?.lastInfo?.packingMethod
              ? res.lastInfo.packingMethod.split(',')
              : [],
            orderFollowIds: res?.lastInfo?.orderFollowId
              ? res.lastInfo.orderFollowId.split(',')
              : [],
            defectDescriptionList: res?.lastInfo?.defectDescriptionList || []
          }
          userOption.value = [
            {
              realName: res?.lastInfo?.orderFollowName,
              userId: res?.lastInfo?.orderFollowId,
              avatarOrigin: res?.lastInfo?.orderFollowAvatarOrigin
            }
          ]
        }

        setTimeout(() => {
          baseRef?.value?.clearValidate()
          trailRef.value?.clearValidate()
          sizeRef.value?.clearValidate()
        }, 0)
        bukValue.value = cloneDeep({ ...dataValue.value })
      }
    })
    .finally(() => {
      loading.value = false
    })
}

const scPurchaseOrderNo = ref<string>()
onMounted(() => {
  initRouter(() => {
    getPermissionInfo()
    queryInfo.value?.id ? getDataValue() : initValue()
  })
})

executablePage('Quality', route, router)

provide('QualityDetails', { dataValue, bukValue, viewType })
provide('PermissionInfo', { getRole })
provide('UserOption', { userOption })

/**************************************以上文件文件内容非必要不可删除，按需追加使用******************************************************* */
</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
