<template>
  <SWDrawer v-model="drawerVisible" :title="drawerTitle" :width="516" @close="reset">
    <el-scrollbar>
      <div class="card" v-loading="drawerLoading">
        <div class="header">
          <CardTitle :title="'货品信息'" />
          <div class="btn" v-if="drawerType === 'add'">
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
              <el-form scroll-to-error :model="form" :rules="formRules" ref="formRef" label-width="80">
                <el-form-item label="货品编码" prop="productCode">
                  <el-select-v2 filterable clearable v-model="form.productCode" value-key="productCode"
                    :options="options" @change="(val: any) => codeChange(val, index)" />
                </el-form-item>
                <el-form-item label="二开原因" prop="secondaryDevReason">
                  <s-text-area v-model="form.secondaryDevReason" maxlength="500" show-word-limit :rows="4" />
                </el-form-item>
                <el-form-item label="选供专员" prop="chosenSupplierStaffId">
                  <SWSelectPeople v-model:modelValue="form.chosenSupplierStaffId" :isEdit="true" :multiple="true"
                    placeholder="请选择选供专员" :deptCode="'NEW_PRODUCT_DEPT_SUPPLY'" />
                </el-form-item>
                <el-form-item label="销量预估" prop="salesForecast">
                  <transfer :upLoad-data="{ code: 'SALES_FORECAST' }" :width="335" v-model="form.salesForecast"
                    :limit="5" is-all />
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>

    <template #footer>
      <el-button @click="reset">关闭</el-button>
      <el-button @click="submit" :loading="drawerLoading" type="primary" class="mr20px"
        v-if="drawerType !== 'show'">提交</el-button>
    </template>
  </SWDrawer>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import SWSelectPeople from '@/views/OA/factory/components/selectPeople.vue'
import CardTitle from '@/views/OA/factory/components/cardTitle.vue'
import * as factoryDevelopApi from '@/api/oa/factory/develop'
import { useProductCodeList } from '@/views/OA/factory/hooks'
import delSvg from '@/assets/svgs/del.svg'
import request from '@/config/axios'
import { cloneDeep } from 'lodash-es'

const { productCodeList, getProductCodes } = useProductCodeList()

const message = useMessage()
const drawerVisible = ref(false)
const drawerTitle = ref('')
const drawerLoading = ref(false)
const drawerType = ref('')

const open = async (type: string, id: string, obj: any) => {
  drawerVisible.value = true
  drawerType.value = type
  drawerTitle.value = type === 'add' ? '新增' : '编辑'
  drawerLoading.value = true
  await getProductCodes()
  if (id) {
    try {
      const {
        id,
        productCode,
        series,
        category,
        categoryName,
        secondaryDevReason,
        chosenSupplierStaffList,
        salesForecast
      } = obj
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
          chosenSupplierStaffId: chosenSupplierStaffList.map((user: any) => ({
            userId: user.userId,
            name: user.name,
            avatarOrigin: user.avatarOrigin
          })),
          salesForecast
        }
      ]
      // const data = await factoryDevelopApi.getDetailsById(id)
      // console.log(data)
      // if (data) {
      //   formParams.value = data

      // }
    } finally {
      drawerLoading.value = false
    }
  }
  drawerLoading.value = false
}

// 表单校验
const formRules = reactive({
  productCode: [{ required: true, message: '请选择货品编码', trigger: ['blur', 'change'] }],
  secondaryDevReason: [{ required: true, message: '请填写二开原因', trigger: ['blur', 'change'] }],
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
    id: undefined,
    productCode: null as any,
    secondaryDevReason: '',
    chosenSupplierStaffId: [] as any,
    salesForecast: null as any
  }
])
const formRef = ref()

// list 操作
const addList = () => {
  infoCardList.value.push({
    id: undefined,
    productCode: null as any,
    secondaryDevReason: '',
    chosenSupplierStaffId: [] as any,
    salesForecast: null as any
  })
}
const handleListDel = (index) => {
  infoCardList.value.splice(index, 1)
}

const submit = async () => {
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
      chosenSupplierStaffId: info.chosenSupplierStaffId.map((li: any) => li.userId).join(','),
      salesForecast: info.salesForecast
    }
  })
  try {
    if (drawerType.value === 'add') await factoryDevelopApi.addDevTask(dataList)
    else await factoryDevelopApi.updateDevTask(dataList[0])
    message.success('保存成功')
    reset()
    emits('success')
  } finally {
    drawerLoading.value = false
  }
}
const reset = async () => {
  infoCardList.value = [
    {
      id: undefined,
      productCode: null as any,
      secondaryDevReason: '',
      chosenSupplierStaffId: [] as any,
      salesForecast: null as any
    }
  ]
  await Promise.all(formRef.value?.map((formRef) => formRef?.resetFields()))
  drawerVisible.value = false
}
const emits = defineEmits(['success'])
defineExpose({ open })
</script>

<style lang="less" scoped>
@import '@/views/OA/factory/style/card.scss';
</style>
