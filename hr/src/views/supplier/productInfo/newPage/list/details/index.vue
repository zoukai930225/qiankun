<template>
  <scheme-details ref="detailsRef" name="List" width="968">
    <template #card>
     <div v-loading="formLoading">
        <el-form class="dialogForm" ref="formRef" :model="dataValue" :rules="formRules" label-width="135px">
          <div class="drawerContent">
            <div class="drawerContent-title">
              <div class="drawerContent-title-icon"></div>
              <span>货品基本信息</span>
            </div>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="货品名称" prop="goodsName">
                  <el-input v-model.trim="dataValue.goodsName" placeholder="" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="货品编码" prop="goodsNo">
                  <el-input v-model.trim="dataValue.goodsNo" placeholder="" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="货品图片">
                  <el-image ref="fileRef" class="w-100px h-100px rounded-8px"
                    :src="dataValue.mainImgUrl ? dataValue.mainImgUrl : defaultImg"
                    :preview-src-list="dataValue.mainImgUrl ? [dataValue.mainImgUrl] : []" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="面料成分" prop="composition">
                  <s-text-area v-model.trim="dataValue.composition" placeholder="" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="补充成分" prop="extraComposition">
                  <s-text-area v-model.trim="dataValue.extraComposition" placeholder="" disabled />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="产品类型" prop="productType">
                  <el-select v-model="dataValue.productType" placeholder="请选择" disabled>
                    <el-option v-for="dict in getIntDictOptions(DICT_TYPE.NP_ENTERPRISE_PRODUCTTYPE, true)"
                      :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="原编码" prop="iterateStyle">
                  <el-input v-model="dataValue.iterateStyle" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="系列" prop="series">
                  <el-input v-model="dataValue.series" disabled />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="品类" prop="category">
                  <el-input :model-value="productInfoData.flattenCategory[dataValue.category] || dataValue.category
                    " disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商品等级" prop="level">
                  <el-select v-model="dataValue.level" placeholder="请选择" disabled>
                    <el-option v-for="dict in getIntDictOptions(DICT_TYPE.NP_PRODUCTGRADE, true)" :key="dict.value"
                      :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="类型" prop="goodsType">
                  <el-select v-model="dataValue.goodsType" placeholder="请选择" disabled>
                    <el-option v-for="dict in getIntDictOptions(DICT_TYPE.NP_DESIGN_PRODUCT_TYPE, true)"
                      :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="安全类别" prop="securityTechnologyCategory">
                  <el-select v-model="dataValue.securityTechnologyCategory" placeholder="请选择" disabled>
                    <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SECURITY_CATEGORY, true)" :key="dict.value"
                      :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="执行标准" prop="executionStandards">
                  <el-select v-model="dataValue.executionStandards" placeholder="请选择" disabled>
                    <el-option v-for="dict in getIntDictOptions(DICT_TYPE.EXECUTION_STANDARDS, true)" :key="dict.value"
                      :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="使用季节" prop="season">
                  <el-select v-model="dataValue.season" multiple placeholder="请选择" disabled>
                    <el-option v-for="dict in getIntDictOptions(DICT_TYPE.NP_USE_SEASON, true)" :key="dict.value"
                      :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="使用对象" prop="useObject">
                  <el-select v-model="useObject" multiple placeholder="请选择" disabled>
                    <el-option v-for="dict in getIntDictOptions(DICT_TYPE.NP_USE_TARGET, true)" :key="dict.value"
                      :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="适用性别" prop="sex">
                  <el-select multiple v-model="sex" placeholder="请选择" disabled>
                    <el-option v-for="dict in getIntDictOptions(DICT_TYPE.NP_APPLY_GENDER, true)" :key="dict.value"
                      :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="企划时间" prop="planTime">
                  <!-- <el-date-picker
                  disabled
                  v-model="formData.planTime"
                  type="datetime"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  format="YYYY-MM-DD HH:mm:ss"
                /> -->
                  <el-input v-model="dataValue.planTime" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="货品创建时间" prop="goodsCreateTime">
                  <el-date-picker style="width: 100%" disabled v-model="dataValue.goodsCreateTime" type="datetime"
                    value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss" />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="跟单人员" prop="userIds">
                  <el-select disabled popper-class="eloption" :popper-append-to-body="true" v-model="dataValue.userIds"
                    placeholder="请选择" @change="handleSelectChange" filterable multiple clearable>
                    <template #tag>
                      <div class="label-wrapper" v-for="userId in dataValue.userIds" :key="userId">
                        <img class="avatorLogo" :src="getUserInfo(userId)?.avatarOrigin" alt="" />
                        <span class="name">{{ getUserInfo(userId)?.name }} </span>
                        <el-icon class="el-icon-close !cursor-pointer !color-#999" @click.stop="
                          dataValue.userIds = dataValue.userIds.filter((id) => id !== userId)
                          ">
                          <Close />
                        </el-icon>
                      </div>
                    </template>
                    <el-option v-for="dict in productInfoData.peopleList" :key="dict.userId" :label="dict.name"
                      :value="dict.userId">
                      <div class="peopleOption">
                        <div class="left-wapper">
                          <img class="img" :src="dict.avatarOrigin" alt="" />
                          <div class="info">
                            <span class="text name">{{ dict.name }}</span>
                            <span class="text desc">{{ dict.departmentName || '--' }}</span>
                          </div>
                        </div>
                      </div>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <!-- <el-col :span="12">
              <el-form-item label="标签价" prop="labelPrice">
                <el-input v-model="formData.labelPrice" />
              </el-form-item>
            </el-col> -->

              <el-col :span="12">
                <el-form-item label="货品供应商" prop="supplierIds">
                  <el-select v-model="dataValue.supplierIds" filterable multiple collapse-tags
                    :collapse-tags-tooltip="true" placeholder="请选择" disabled>
                    <el-option v-for="dict in productInfoData.supplierList" :key="dict.id"
                      :label="dict.abbreviationCompany" :value="dict.id" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="drawerContent">
            <div class="drawerContent-title">
              <div class="drawerContent-title-icon"></div>
              <span>SKU信息</span>
            </div>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="SKU编码" prop="skuNo">
                  <el-input v-model.trim="dataValue.skuNo" placeholder="" disabled />
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="图片" prop="imgUrl">
                  <el-image ref="fileRef" class="w-100px h-100px rounded-8px"
                    :src="dataValue.imgUrl ? dataValue.imgUrl : defaultImg"
                    :preview-src-list="dataValue.imgUrl ? [dataValue.imgUrl] : []" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="颜色" prop="specName">
                  <el-select v-model="dataValue.specName" placeholder="请选择" disabled>
                    <el-option v-for="dict in getIntDictOptions(DICT_TYPE.NP_DESIGN_PRODUCT_COLOR, true)"
                      :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="尺码" prop="specCode">
                  <el-select v-model="dataValue.specCode" placeholder="请选择" disabled>
                    <el-option v-for="dict in getIntDictOptions(DICT_TYPE.NP_DESIGN_PRODUCT_SIZE, true)"
                      :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="工艺" prop="craft">
                  <el-input v-model="dataValue.craft" placeholder="" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="材质" prop="material">
                  <el-input v-model="dataValue.material" placeholder="" disabled />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="主条码" prop="barcode">
                  <el-input v-model.trim="dataValue.barcode" placeholder="" disabled />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="创建时间" prop="createTime">
                  <el-date-picker style="width: 100%" disabled v-model="dataValue.createTime" type="datetime"
                    value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="drawerContent">
            <div class="drawerContent-title">
              <div class="drawerContent-title-icon"></div>
              <span>供应链信息</span>
            </div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="迭代码" prop="iterateCode">
                  <GoodsNoSelector :type="2" v-model:model-value="dataValue.iterateCode" :disabled="false"
                    :goodsNo="dataValue.iterateCode" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="下架状态" prop="skuOutOfStock">
                  <el-select v-model="dataValue.skuOutOfStock" placeholder="请选择" clearable>
                    <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_WHETHER, true)" :key="dict.value"
                      :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>
    </template>
    <template #button>
      <div> 按钮操作区 </div>
      <el-button @click="detailsRef?.close()" :disabled="loading">取消</el-button>
        <el-button type="primary" @click="submitForm" :disabled="loading">提交</el-button>
    </template>
  </scheme-details>
</template>

<script lang="tsx">
export default { name: 'ListDetails' };
</script>

<script lang="tsx" setup>
import defaultImg from '@/assets/imgs/supplier/defaultImg.svg'
import GoodsNoSelector from '@/views/supplier/productInfo/components/goodsNoSelector.vue'
import { FromProvideType } from '@/components/template/config/type';
import { cloneDeep, debounce } from "lodash-es";
import { DataItem } from "../page/config";
import request from '@/config/axios';
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict';
import STextArea from "@/components/common/input/s-textarea.vue";
import { productInfoStore } from '@/store/modules/productInfo'
const productInfoData = productInfoStore()


const message = useMessage();

const { onSearch } = inject(`ListForm`) as FromProvideType;

const detailsRef = ref<any>(), formRef = ref(), dataValue = ref<DataItem>({ ...new DataItem() }), bukValue = ref<DataItem>({ ...new DataItem() }), viewType = ref<string>('view'), loading = ref<boolean>(false);
const formLoading = ref(false)

// const props = defineProps({
//   dicInfo: { type: Array<any>, default: () => [] },
// });

const title = computed(() => viewType.value === 'view' ? '详情' : '编辑');

// 弹出通用
const openView = (item: any = {}, type: string = 'view') => {
  // detailsRef openDrawer方法支持前/后置方法入参，无需操作抽屉显隐，内部已处理
  detailsRef?.value?.openDrawer(async () => {
    dataValue.value = { ...new DataItem(), ...item };
    if (item.skuId) {
      request.get({url: `/api/sc/goods/sku/getById?skuId=${item.skuId}`}).then((data: any) => {
        if (data) {
          // 处理字段映射和默认值
          const formDataWithDefaults = {
            ...Object.fromEntries(Object.entries(data).filter(([_, value]) => value)),
            outOfStock: data.outOfStock ?? 0,
            // 处理供应商字段映射：suppliers -> supplierIds
            supplierIds:
              data.suppliers && Array.isArray(data.suppliers)
                ? data.suppliers.map((item) => item.supplierId)
                : [],
            // 处理跟单人员字段映射：users -> userIds
            userIds:
              data.users && Array.isArray(data.users) ? data.users.map((item) => item.userId) : []
          }
          dataValue.value = { ...dataValue.value, ...data, ...formDataWithDefaults }
          bukValue.value = cloneDeep({ ...dataValue.value });
          
        }
      })
    }
    // bukValue为备份数据，用以处理已操作未保存数据校验，慎重！！！
    bukValue.value = cloneDeep({ ...dataValue.value });
    viewType.value = type;
  }, () => {
    nextTick(() => {
      formRef?.value?.clearValidate();
    });
  });
};

const season = computed({
  get: () => (dataValue.value.season ? dataValue.value.season.split(',') : undefined),
  set: (val) => {
    dataValue.value.season = val ? val.join(',') : ''
  }
})
const useObject = computed({
  get: () => (dataValue.value.useObject ? dataValue.value.useObject.split(',') : undefined),
  set: (val) => {
    dataValue.value.useObject = val ? val.join(',') : ''
  }
})
const sex = computed({
  get: () => (dataValue.value.sex ? dataValue.value.sex.split(',') : undefined),
  set: (val) => {
    dataValue.value.sex = val ? val.join(',') : ''
  }
})

// 根据用户ID获取用户信息
const getUserInfo = (userId: string) => {
  return productInfoData.peopleList.find((person) => person.userId === userId)
}

// 选择人员
const handleSelectChange = (userIds) => {
  console.log('选择的用户ID:', userIds)
}

const formRules = reactive({
  iterateCode: [{ required: true, message: '请输入迭代码', trigger: 'change' }],
  skuOutOfStock: [{ required: true, message: '请选择下架状态', trigger: 'change' }]
})


// 通用表单校验
const checkValue = async () => {
  return await formRef?.value?.validate((valid: boolean) => {
    return valid
  });
};

// 提交
const submitForm = async () => {
  const valid: boolean = await checkValue();
  valid && submit();
};

// 实际提交（防抖）
const submit = debounce(async () => {
  loading.value = true;
  request.post({ url: `/api/sc/goods/sku/update`, data: dataValue.value }).then(() => {
    message.success('操作成功');
    detailsRef?.value?.closed();
    onSearch();
  }).finally(() => {
    loading.value = false;
  });
}, 500);

defineExpose({ openView });

provide('ListDetails', { dataValue, bukValue, viewType, title });

/**************************************以上文件文件内容非必要不可删除，按需追加使用******************************************************* */

</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
