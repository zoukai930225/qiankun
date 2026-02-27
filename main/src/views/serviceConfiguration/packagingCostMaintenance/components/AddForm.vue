<!--
 * @Date: 2025-02-11 17:22:22
-->
<template>
  <SWDrawer v-model="dialogVisible" :title="formType === 'create' ? '新增' : '编辑'" @before-close="beforeClose"
    :show-befor-close="true">
    <div class="content" v-loading="drawerLoading">
      <el-form ref="formRef" :model="form" label-width="80" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="商家编码" prop="merchantCode" v-if="tabType === 'product'">
              <el-input v-model.trim="form.merchantCode" class="!w300px" placeholder="请输入商家编码"
                :disabled="formType !== 'create'" />
            </el-form-item>
            <el-form-item label="一级品类" prop="category" v-if="tabType === 'category'">
              <el-select class="!w300px" v-model="form.category" placeholder="请选择品类" @change="handleCategoryChange"
                :disabled="formType !== 'create'">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.STANDARD_CATEGORY, true)" :key="dict.code"
                  :label="dict.label" :value="dict.code" />
              </el-select>
            </el-form-item>
            <el-form-item label="二级品类" prop="subMerchantCode" v-if="tabType === 'category'">
              <el-select class="!w300px" v-model="form.subMerchantCode" placeholder="请选择品类"
                :disabled="formType !== 'create'">
                <el-option v-for="dict in twoLevelCategoryList" :key="dict.code" :label="dict.label"
                  :value="dict.code" />
              </el-select>
            </el-form-item>
            <el-form-item label="包装单价" prop="packagingUnitPrice">
              <el-input v-model="form.packagingUnitPrice" class="!w300px" placeholder="请输入包装单价" type="number"
                :min="0" />
            </el-form-item>
            <el-form-item label="开始日期" prop="beginDate">
              <el-date-picker v-model="form.beginDate" type="date" :clearable="false" v-if="formType === 'create'"
                placeholder="请选择" />
              <span v-else>{{ form.beginDate }}</span>
            </el-form-item>
            <el-form-item label="截止日期" prop="endDate">
              <el-date-picker v-model="form.endDate" type="date" :clearable="false" placeholder="请选择" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仓库" prop="warehouse">
              <el-select class="!w300px" v-model="form.warehouse" placeholder="请选择仓库" :disabled="formType !== 'create'"
                clearable filterable>
                <el-option v-for="dict in warehouseList" :key="dict.code" :label="dict.name" :value="dict.code" />
              </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="notes">
              <s-text-area v-model.trim="form.notes" class="!w300px" :rows="4" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="handleCloseDrawer">关闭</el-button>
      <el-button type="primary" @click="submitForm" :loading="formLoading">提交</el-button>
    </template>
  </SWDrawer>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import * as historicalPackagingPriceApi from '@/api/serviceConfiguration/historicalPackagingPrice'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { ref, reactive } from 'vue'
import { debounce } from 'lodash-es'
import dayjs from 'dayjs'
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false)
const formType = ref('') // 表单类型
const { t } = useI18n() // 国际化
import * as wdtWarehouseDetailApi from '@/api/supplier/warehouseInfo'
import { cloneDeep } from 'lodash-es'
import { consistency, dataDetection } from "@/utils";
const props = defineProps({
  tabType: {
    type: String,
    default: 'category'
  }
})
// 1: 商品 2: 品类
const tabTypeToFormType = {
  product: 1,
  category: 2
}
interface FormData {
  id?: number
  packageCostType: number
  merchantCode: string
  subMerchantCode?: string
  category?: string
  packagingUnitPrice: string
  notes: string,
  beginDate?: string,
  endDate?: string,
  warehouse?: string,
  status?: number,
}

const formRef = ref()
const form = ref<FormData>({
  id: undefined,
  packageCostType: tabTypeToFormType[props.tabType] || 2, // 表单类型
  merchantCode: '', // 商家编码
  subMerchantCode: '', // 二级品类编码
  category: '', // 品类
  packagingUnitPrice: '', // 包装单价
  notes: '',// 备注
  beginDate: dayjs().format('YYYY-MM-DD'),
  endDate: '2099-12-31',
  warehouse: '',//仓库
  status: 1 //状态
})

//店铺查询参数
const warehouseKey = ref('')
const times = ref([dayjs().format('YYYY-MM-DD'), '2099-12-31'])
//记录上次包装单价
let oldPackagingUnitPrice = 0;
// 置空
const resetForm = () => {
  form.value = {
    id: undefined,
    packageCostType: tabTypeToFormType[props.tabType] || 2,
    merchantCode: '',
    subMerchantCode: '', // 二级品类编码
    packagingUnitPrice: '',
    notes: '',
    category: '',
    beginDate: dayjs().format('YYYY-MM-DD'),
    endDate: '2099-12-31',
    warehouse: '',//仓库
    status: 1
  }
  formRef.value?.resetFields()
  times.value = [dayjs().format('YYYY-MM-DD'), '2099-12-31']
  warehouseKey.value = ''
  oldPackagingUnitPrice = 0
  formLoading.value = false
}
const drawerLoading = ref(false)
const hostoryData = ref<FormData>();//保存历史用于比较数据，进行提示
// 打开弹窗
const open = async (type: string, id: string) => {
  dialogVisible.value = true
  formType.value = type
  resetForm()
  getWarehouseList()
  hostoryData.value = cloneDeep(form.value)
  if (id) {
    try {
      drawerLoading.value = true
      const res = await historicalPackagingPriceApi.getDataById(id)
      Object.keys(form.value).forEach(key => {
        form.value[key] = res[key]
      })


      oldPackagingUnitPrice = Number(res.packagingUnitPrice)
      if (res.beginDate && res.endDate) {
        times.value = [res.beginDate, res.endDate]
      }
      // 如果是品类，回显品类名称
      if (form.value.packageCostType === 2) {
        form.value.category = form.value.merchantCode
        const categoryKey = `standard_category_${form.value.category.toLowerCase()}`
        // 获取二级品类列表
        twoLevelCategoryList.value = getIntDictOptions(categoryKey, true)

      }

      hostoryData.value = cloneDeep(form.value)
    } catch (err) {

    } finally {
      drawerLoading.value = false
    }
  }
}
const validateBeginDate = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('请选择开始日期！'))
  } else if (form.value.endDate && dayjs(value).isAfter(dayjs(form.value.endDate))) {
    callback(new Error("开始日期不能小于截止日期!"))
  } else {
    callback()
  }
}

const validateEndDate = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('请选择截止日期！'))
  } else if (form.value.beginDate && dayjs(value).isBefore(dayjs(form.value.beginDate))) {
    callback(new Error("截止日期不能大于开始日期!"))
  } else {
    callback()
  }
}
const rules = reactive({
  merchantCode: [
    { required: true, message: '请输入商家编码', trigger: 'blur', whitespace: true },
    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
  ],
  category: [{ required: true, message: '请选择品类', trigger: 'change' }],
  packagingUnitPrice: [
    { required: true, message: '请输入包装单价', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value <= 0) {
          callback(new Error('包装单价必须大于0'))
        } else if (!/^\d+(\.\d{0,2})?$/.test(value)) {
          callback(new Error('包装单价最多只能保留两位小数'))
        } else {
          callback()
        }
      }
    }
  ],
  beginDate: [{
    required: true,
    validator: validateBeginDate,
    trigger: 'change'
  }],
  endDate: [{
    required: true,
    validator: validateEndDate,
    trigger: 'change'
  }],
})

// 一级品类变化
const handleCategoryChange = () => {
  console.log('一级品类变化:', form.value.category)
  // 当选择一级品类时，清空二级品类
  if (form.value.packageCostType === 2) {
    form.value.subMerchantCode = ''
    twoLevelCategoryList.value = []
  }
  // 如果是品类，则查询二级品类列表
  if (form.value.packageCostType === 2 && form.value.category) {
    // 将form.value.category转小写，并且前面拼接上"standard_category_"
    const categoryKey = `standard_category_${form.value.category.toLowerCase()}`
    console.log('二级品类查询key:', categoryKey)
    // 获取二级品类列表
    twoLevelCategoryList.value = getIntDictOptions(categoryKey, true)
  }
}

// 二级品类列表
const twoLevelCategoryList = ref<any[]>([])

/** 提交表单 */

const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const formLoading = ref(false) // 表单提交loading

const submitForm = debounce(async () => {
  // 校验表单
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return

  try {
    const data = cloneDeep(form.value)
    data.beginDate = dayjs(data.beginDate).format('YYYY-MM-DD')
    data.endDate = dayjs(data.endDate).format('YYYY-MM-DD')

    // 提交请求
    formLoading.value = true
    // 如果是品类，则把category值赋值给merchantCode
    if (data.packageCostType === 2) {
      data.merchantCode = data.category ?? ''
    }
    // 删除category属性
    delete data.category
    // 删除subMerchantCode属性，如果是商品类型则不需要
    if (data.packageCostType === 1) {
      delete data.subMerchantCode
    }

    // // 在一级和二级品类列表里面匹配，将对应的label赋值给merchantCode和subMerchantCode
    // if (data.packageCostType === 2) {
    //   const categoryOption = getIntDictOptions(DICT_TYPE.STANDARD_CATEGORY, true)
    //     .find(item => item.code === data.merchantCode)

    //   if (categoryOption) {
    //     data.merchantCode = categoryOption.code
    //   }
    //   const subCategoryOption = twoLevelCategoryList.value.find(item => item.code === data.subMerchantCode)
    //   if (subCategoryOption) {
    //     data.subMerchantCode = subCategoryOption.code
    //   }
    // }
    console.log('提交的数据:', data);

    if (formType.value === 'create') {
      data.id = undefined
      await historicalPackagingPriceApi.addData(data)
      message.success(t('common.createSuccess'))
      dialogVisible.value = false
      // 发送操作成功的事件
      emit('success')
    } else {
      //如果开始日期早于当前操作日期，需把该条记录作废的同时自动新增一条记录
      if (oldPackagingUnitPrice !== Number(data.packagingUnitPrice) && dayjs(times.value[0]).isBefore(dayjs(dayjs(new Date()).format('YYYY-MM-DD')))) {
        await historicalPackagingPriceApi.deleteData(data.id)
        data.beginDate = dayjs().format('YYYY-MM-DD')
        data.endDate = '2099-12-31'
        data.id = undefined
        setTimeout(async () => {
          await historicalPackagingPriceApi.addData(data)
          message.success(t('common.updateSuccess'))
          dialogVisible.value = false
          // 发送操作成功的事件
          emit('success')
        }, 200)
      } else {
        await historicalPackagingPriceApi.updateData(data)
        message.success(t('common.updateSuccess'))
        dialogVisible.value = false
        // 发送操作成功的事件
        emit('success')
      }
    }
  } finally {
    setTimeout(() => {
      formLoading.value = false
    }, 1000)
  }
}, 200)
const warehouseList = ref([])
function getWarehouseList() {
  wdtWarehouseDetailApi.getwdtWarehouseListByParams({ warehouse: warehouseKey.value }).then(res => {
    warehouseList.value = res
  })
}
//禁止日期 - 编辑时进行
function disabledDateHandle(date) {
  return dayjs(date).isBefore(dayjs(form.value.beginDate))
}


const beforeClose = (done: Function) => {
  console.log("beforeClose")
  consistency(hostoryData.value, form.value, done)
};

const handleCloseDrawer = () => {
  beforeClose(() => {
    dialogVisible.value = false;
  });
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

</script>

<style scoped lang="scss">
.content {
  background-color: #fff;
  width: 100%;
  min-height: 100%;
  border-radius: 20px;
  padding: 20px;
}

.flex-row {
  display: flex;
  align-items: center;
}
</style>
