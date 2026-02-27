<template>
  <scheme-details ref="detailsRef" name="Factorydevelop">
    <template #card>
      <div v-loading="drawerLoading">
        <div class="header">
          <CardTitle :title="'货品信息'" />
          <div class="btn" v-if="viewType === 'add'">
            <el-button type="primary" @click="addList">
              <Icon :size="14" icon="ep:plus" class="mr4px" />
              添加货品信息
            </el-button>
          </div>
        </div>
        <div class="inner">
          <div class="infoCard" v-for="(form, index) in infoCardList" :key="index">
            <div class="flex justify-between">
              <div class="title">{{ `货品 ${form.productCode?.productCode || ''}` }}</div>
              <img :src="delSvg" class="del" @click="handleListDel(index)" v-if="index > 0" />
            </div>
            <div class="form">
              <el-form
                scroll-to-error
                :model="form"
                :rules="formRules"
                ref="formRef"
                label-width="80"
              >
                <el-form-item label="货品编码" prop="productCode">
                  <el-select-v2
                    filterable
                    clearable
                    v-model="form.productCode"
                    value-key="productCode"
                    :options="options"
                    @change="(val: any) => codeChange(val, index)"
                  />
                </el-form-item>
                <el-form-item label="二开原因" prop="secondaryDevReason">
                  <!-- <s-text-area
                    v-model="form.secondaryDevReason"
                    maxlength="500"
                    show-word-limit
                    :rows="4"
                  /> -->
                  <el-select
                    v-model="form.secondaryDevReason"
                    placeholder="请选择二开原因"
                    @change="changeReason(form, $event)"
                  >
                    <!-- 生产品质、降本、工厂产能不足、其他 -->
                    <el-option
                      :label="item.label"
                      :value="item.value"
                      v-for="item in getIntDictOptions(
                        DICT_TYPE.SECCONDARY_DEVELOPMENT_REASON,
                        true
                      )"
                      :key="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="备注"
                  prop="remark"
                  :rules="[
                    {
                      required: form.secondaryDevReason === 'other',
                      message: '请输入备注',
                      trigger: ['change', 'blur']
                    }
                  ]"
                >
                  <s-text-area v-model="form.remark" maxlength="500" show-word-limit :rows="4" />
                </el-form-item>
                <el-form-item label="选供专员" prop="chosenSupplierStaffId">
                  <SWSelectPeople
                    v-model:modelValue="form.chosenSupplierStaffId"
                    :isEdit="true"
                    :multiple="true"
                    placeholder="请选择选供专员"
                    :deptCode="'NEW_PRODUCT_DEPT_SUPPLY'"
                  />
                </el-form-item>
                <el-form-item label="销量预估" prop="salesForecast">
                  <transfer
                    :upLoad-data="{ code: 'SALES_FORECAST' }"
                    :width="335"
                    v-model="form.salesForecast"
                    :limit="5"
                    is-all
                  />
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #button>
      <el-button @click="detailsRef?.close()" :disabled="loading">取消</el-button>
      <el-button type="primary" @click="submitForm" :disabled="loading">提交</el-button>
    </template>
  </scheme-details>
</template>

<script lang="tsx">
export default { name: 'FactorydevelopDetails' }
</script>

<script lang="tsx" setup>
import STextArea from '@/components/common/input/s-textarea.vue'
import SWSelectPeople from '@/views/OA/factory/components/selectPeople.vue'
import CardTitle from '@/views/OA/factory/components/cardTitle.vue'
import { FromProvideType } from '@/components/template/config/type'
import { cloneDeep, debounce } from 'lodash-es'
import { DataItem } from '../page/config'
import request from '@/config/axios'
import { useProductCodeList } from '@/views/OA/factory/hooks'
import delSvg from '@/assets/svgs/del.svg'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

const { productCodeList, getProductCodes } = useProductCodeList()

const message = useMessage()

const { onSearch } = inject(`FactorydevelopForm`) as FromProvideType

const detailsRef = ref<any>(),
  formRef = ref(),
  dataValue = ref<DataItem>({ ...new DataItem() }),
  bukValue = ref<DataItem>({ ...new DataItem() }),
  viewType = ref<string>('view'),
  loading = ref<boolean>(false)

// const props = defineProps({
//   dicInfo: { type: Array<any>, default: () => [] },
// });

// 表单校验
const formRules = reactive({
  productCode: [{ required: true, message: '请选择货品编码', trigger: ['blur', 'change'] }],
  secondaryDevReason: [{ required: true, message: '请选择二开原因', trigger: ['blur', 'change'] }],
  chosenSupplierStaffId: [
    { required: true, message: '请选择选供专员', trigger: ['blur', 'change'] }
  ]
})

const options = computed(() => {
  return productCodeList.value.map((item: any) => {
    return {
      label: item.productCode,
      value: item,
      disabled: item.productCode ? disableProductCode(item.productCode) : false
    }
  })
})

const codeChange = (val: any, index: number) => {
  let item: any = cloneDeep({ ...infoCardList.value[index] })
  if (val?.productCode) {
    request
      .get({
        url: `/workflow-api/api/workflow/business/factorySecondary/devTask/getMappedSupplier/${val.productCode}`
      })
      .then((res: any) => {
        item.chosenSupplierStaffId = res?.length ? res : []
        infoCardList.value.splice(index, 1, item)
      })
  } else {
    item.chosenSupplierStaffId = []
    infoCardList.value.splice(index, 1, item)
  }
}

const disableProductCode = (code: string) => {
  return infoCardList.value.map((li: any) => li.productCode?.productCode).includes(code)
}
// 请求参数
const infoCardList = ref([
  {
    id: undefined as any,
    productCode: null as any,
    secondaryDevReason: '',
    secondaryDevReasonName: '',
    remark: '',
    chosenSupplierStaffId: [] as any,
    salesForecast: null as any
  }
])

// list 操作
const addList = () => {
  infoCardList.value.push({
    id: undefined as any,
    productCode: null as any,
    secondaryDevReason: '',
    secondaryDevReasonName: '',
    remark: '',
    chosenSupplierStaffId: [] as any,
    salesForecast: null as any
  })
}

const reset = async () => {
  infoCardList.value = [
    {
      id: undefined,
      productCode: null as any,
      secondaryDevReason: '',
      secondaryDevReasonName: '',
      remark: '',
      chosenSupplierStaffId: [] as any,
      salesForecast: null as any
    }
  ]
  nextTick(() => {
    if (infoCardList.value.length >= 1) {
      formRef?.value && Promise.all(formRef.value?.map((formRef) => formRef?.resetFields()))
    }
  })
}

const title = computed(() => (viewType.value === 'view' ? '详情' : (viewType.value === 'edit' ? '编辑' : '新增')))

// 弹出通用
const openView = (item: any = {}, type: string = 'view') => {
  // detailsRef openDrawer方法支持前/后置方法入参，无需操作抽屉显隐，内部已处理
  detailsRef?.value?.openDrawer(
    async () => {
      reset()
      dataValue.value = { ...new DataItem(), ...item }
      // bukValue为备份数据，用以处理已操作未保存数据校验，慎重！！！
      bukValue.value = cloneDeep({ ...dataValue.value })
      drawerLoading.value = true
      getProductCodes()
      if (dataValue.value.id) {
        try {
          const {
            id,
            productCode,
            series,
            category,
            categoryName,
            secondaryDevReason,
            secondaryDevReasonName,
            remark,
            chosenSupplierStaffList,
            salesForecast
          } = dataValue.value
          infoCardList.value = [
            {
              id,
              productCode: {
                productCode,
                series,
                category,
                categoryName
              },
              secondaryDevReason,
              secondaryDevReasonName,
              remark,
              chosenSupplierStaffId: chosenSupplierStaffList.map((user: any) => ({
                userId: user.userId,
                name: user.name,
                avatarOrigin: user.avatarOrigin
              })),
              salesForecast
            }
          ]
        } finally {
          drawerLoading.value = false
        }
      }
      drawerLoading.value = false
      viewType.value = type
    },
    () => {
      nextTick(() => {
        //  reset()
        if (infoCardList.value.length >= 1) {
          Promise.all(formRef?.value && formRef.value?.map((formRef) => formRef?.clearValidate()))
        }
      })
    }
  )
}

// 通用表单校验
const checkValue = async () => {
  // return await Promise.all(formRef.value?.map((formRef) => formRef?.validate()))
}

// 提交
const submitForm = async () => {
  // const valid: boolean = await checkValue()
  submit()
}

const handleListDel = (index) => {
  infoCardList.value.splice(index, 1)
}

const drawerLoading = ref(false)
// 实际提交（防抖）
const submit = debounce(async () => {
  await Promise.all(formRef.value?.map((formRef) => formRef?.validate()))
  /**
   * {
      "productCode": "A214-1",
      "series": "A214升级",
      "category": "WomenBottomWear",
      "categoryName": "袜子/中筒袜",
      "secondaryDevReason": "这是第一次测试的数据1",
      "chosenSupplierStaffId": "ou_99db3ca8927d0097d3f04fdf4bff568e"
    },
   */
  drawerLoading.value = true
  const dataList = infoCardList.value.map((info: any) => {
    const { productCode, series, category, categoryName } = info.productCode
    return {
      id: info.id,
      productCode,
      series,
      category,
      categoryName,
      secondaryDevReason: info.secondaryDevReason,
      secondaryDevReasonName: info.secondaryDevReasonName,
      chosenSupplierStaffId: info.chosenSupplierStaffId.map((li: any) => li.userId).join(','),
      salesForecast: info.salesForecast,
      remark: info.remark
    }
  })
  try {
    if (viewType.value === 'add') {
      await request.post({
        url: `/workflow-api/api/workflow/business/factorySecondary/devTask/add`,
        data: dataList
      })
    } else {
      await request.post({
        url: `/workflow-api/api/workflow/business/factorySecondary/devTask/update`,
        data: dataList[0]
      })
    }
    message.success('保存成功')
    reset()
    detailsRef?.value?.closed()
    onSearch()
    // emits('success')
  } finally {
    drawerLoading.value = false
  }
  // loading.value = true;
  // request.post({ url: `/api/employeeMonthlyAssessment/update`, data: dataValue.value }).then(() => {
  //   message.success('操作成功');
  //   detailsRef?.value?.closed();
  //   onSearch();
  // }).finally(() => {
  //   loading.value = false;
  // });
}, 500)

defineExpose({ openView })

provide('FactorydevelopDetails', { dataValue, bukValue, viewType, title })

/**************************************以上文件文件内容非必要不可删除，按需追加使用******************************************************* */

const changeReason = (form: any,val: any) => {
  const dicts = getIntDictOptions(DICT_TYPE.SECCONDARY_DEVELOPMENT_REASON, true) || []
  const tar = dicts.find((item: any) => item.value === val)
  form['secondaryDevReasonName'] = tar && tar.label
}
</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
