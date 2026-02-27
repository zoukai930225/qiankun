<template>
  <div>
    <el-drawer custom-class="addDrawer" v-model="drawerVisible" :before-close="handleBeforClose" @closed="handleClosed"
      :title="dialogTitle" size="968">
      <div v-loading="formLoading">
        <el-form class="dialogForm" ref="formRef" :model="formData" :rules="formRules" label-width="135px">
          <div class="drawerContent">
            <div class="drawerContent-title">
              <div class="drawerContent-title-icon"></div>
              <span>货品基本信息</span>
            </div>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="货品名称" prop="goodsName">
                  <el-input v-model.trim="formData.goodsName" placeholder="" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="货品编码" prop="goodsNo">
                  <el-input v-model.trim="formData.goodsNo" placeholder="" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="货品图片">
                  <el-image ref="fileRef" class="w-100px h-100px rounded-8px"
                    :src="formData.mainImgUrl ? formData.mainImgUrl : defaultImg"
                    :preview-src-list="formData.mainImgUrl ? [formData.mainImgUrl] : []" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="面料成分" prop="composition">
                  <s-text-area v-model.trim="formData.composition" placeholder="" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="补充成分" prop="extraComposition">
                  <s-text-area v-model.trim="formData.extraComposition" placeholder="" disabled />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="产品类型" prop="productType">
                  <el-select v-model="formData.productType" placeholder="请选择" disabled>
                    <el-option v-for="dict in getIntDictOptions(DICT_TYPE.NP_ENTERPRISE_PRODUCTTYPE, true)"
                      :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="原编码" prop="iterateStyle">
                  <el-input v-model="formData.iterateStyle" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="系列" prop="series">
                  <el-input v-model="formData.series" disabled />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="品类" prop="category">
                  <el-input :model-value="productInfoData.flattenCategory[formData.category] || formData.category
                    " disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商品等级" prop="level">
                  <el-select v-model="formData.level" placeholder="请选择" disabled>
                    <el-option v-for="dict in getIntDictOptions(DICT_TYPE.NP_PRODUCTGRADE, true)" :key="dict.value"
                      :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="类型" prop="goodsType">
                  <el-select v-model="formData.goodsType" placeholder="请选择" disabled>
                    <el-option v-for="dict in getIntDictOptions(DICT_TYPE.NP_DESIGN_PRODUCT_TYPE, true)"
                      :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="安全类别" prop="securityTechnologyCategory">
                  <el-select v-model="formData.securityTechnologyCategory" placeholder="请选择" disabled>
                    <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SECURITY_CATEGORY, true)" :key="dict.value"
                      :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="执行标准" prop="executionStandards">
                  <el-select v-model="formData.executionStandards" placeholder="请选择" disabled>
                    <el-option v-for="dict in getIntDictOptions(DICT_TYPE.EXECUTION_STANDARDS, true)" :key="dict.value"
                      :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="使用季节" prop="season">
                  <el-select v-model="season" multiple placeholder="请选择" disabled>
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
                  <el-input v-model="formData.planTime" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="货品创建时间" prop="goodsCreateTime">
                  <el-date-picker disabled v-model="formData.goodsCreateTime" type="datetime"
                    value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss" />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="跟单人员" prop="userIds">
                  <el-select disabled popper-class="eloption" :popper-append-to-body="true" v-model="formData.userIds"
                    placeholder="请选择" @change="handleSelectChange" filterable multiple clearable>
                    <template #tag>
                      <div class="label-wrapper" v-for="userId in formData.userIds" :key="userId">
                        <img class="avatorLogo" :src="getUserInfo(userId)?.avatarOrigin" alt="" />
                        <span class="name">{{ getUserInfo(userId)?.name }} </span>
                        <el-icon class="el-icon-close !cursor-pointer !color-#999" @click.stop="
                          formData.userIds = formData.userIds.filter((id) => id !== userId)
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
                  <el-select v-model="formData.supplierIds" filterable multiple collapse-tags
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
                  <el-input v-model.trim="formData.skuNo" placeholder="" disabled />
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="图片" prop="imgUrl">
                  <el-image ref="fileRef" class="w-100px h-100px rounded-8px"
                    :src="formData.imgUrl ? formData.imgUrl : defaultImg"
                    :preview-src-list="formData.imgUrl ? [formData.imgUrl] : []" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="颜色" prop="specName">
                  <el-select v-model="formData.specName" placeholder="请选择" disabled>
                    <el-option v-for="dict in getIntDictOptions(DICT_TYPE.NP_DESIGN_PRODUCT_COLOR, true)"
                      :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="尺码" prop="specCode">
                  <el-select v-model="formData.specCode" placeholder="请选择" disabled>
                    <el-option v-for="dict in getIntDictOptions(DICT_TYPE.NP_DESIGN_PRODUCT_SIZE, true)"
                      :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="工艺" prop="craft">
                  <el-input v-model="formData.craft" placeholder="" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="材质" prop="material">
                  <el-input v-model="formData.material" placeholder="" disabled />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="主条码" prop="barcode">
                  <el-input v-model.trim="formData.barcode" placeholder="" disabled />
                </el-form-item>
              </el-col>


              <el-col :span="12">
                <el-form-item label="创建时间" prop="createTime">
                  <el-date-picker disabled v-model="formData.createTime" type="datetime"
                    value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss" />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="号型" prop="prop3">
                  <el-input v-model.trim="formData.prop3" placeholder="" disabled />
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
                  <GoodsNoSelector :type="2" v-model:model-value="formData.iterateCode" :disabled="false"
                    :goodsNo="formData.iterateCode" :isFirstCall="isFirstCall" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="下架状态" prop="skuOutOfStock">
                  <el-select v-model="formData.skuOutOfStock" placeholder="请选择" clearable>
                    <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_WHETHER, true)" :key="dict.value"
                      :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>
      <div class="drawerFooter">
        <el-button :disabled="formLoading" type="primary" @click="submitForm"> 保 存</el-button>
        <el-button @click="drawerVisible = false">关 闭</el-button>
      </div>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
defineOptions({ name: 'AccountManageAddDrawer' })
import { productInfoStore } from '@/store/modules/productInfo'
const productInfoData = productInfoStore()
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as productInfoApi from '@/api/supplier/productInfo'
import GoodsNoSelector from '../../components/goodsNoSelector.vue'
const message = useMessage() // 消息弹窗
const drawerVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
import defaultImg from '@/assets/imgs/supplier/defaultImg.svg'
// import * as QcApi from '@/api/qianchuan'
import { nextTick } from 'vue'
import { cloneDeep } from 'lodash-es'
import { deepEqual } from '@/utils/common'

const formData = ref({
  skuId: '',
  goodsName: '', // 货品名称
  goodsNo: '', // 货品编码
  composition: '', // 成分
  className: '', // ERP货品分类
  alias: '', // 货品别名
  goodsCreateTime: '', // 货品创建时间
  executionStandards: '', // 执行标准
  securityTechnologyCategory: '', // 安全技术类别
  category: '', // 类目
  level: '', // 商品等级
  productionCycle: '', // 生产周期
  sex: '', // 性别
  season: '', // 季节
  year: '', // 年份
  supplierIds: [], // 货品供应商
  userIds: [], // 跟单人员
  imgUrl: '', // 商品图片
  iterateCode: '', // 迭代码 -提交
  skuOutOfStock: '0', // 下架状态 -提交
  skuNo: '', // 商家编码
  specName: '', // 规格名称
  specCode: '', // 规格码
  barcode: '', // 主条码
  createTime: '', // 创建时间
  goodsId: '', // 商品ID
  outOfStock: 0, // 下架状态
  iterateStyle: '', //原编码
  series: '', //系列
  goodsType: '', //类型
  productType: '', // 产品类型
  useObject: '', // 适用对象
  planTime: '', //企划时间
  labelPrice: '', // 标签价
  mainImgUrl: '', // 货品主图
  craft: '', // 工艺
  material: '', // 材质
  extraComposition: '', //补充成分
  prop3: ''
})
const oldFormData = ref<typeof formData.value>()

const formRef = ref() // 表单 Ref
const imgRef = ref()

const formRules = reactive({
  iterateCode: [{ required: true, message: '请输入迭代码', trigger: 'change' }],
  skuOutOfStock: [{ required: true, message: '请选择下架状态', trigger: 'change' }]
})

const season = computed({
  get: () => (formData.value.season ? formData.value.season.split(',') : undefined),
  set: (val) => {
    formData.value.season = val ? val.join(',') : ''
  }
})
const useObject = computed({
  get: () => (formData.value.useObject ? formData.value.useObject.split(',') : undefined),
  set: (val) => {
    formData.value.useObject = val ? val.join(',') : ''
  }
})
const sex = computed({
  get: () => (formData.value.sex ? formData.value.sex.split(',') : undefined),
  set: (val) => {
    formData.value.sex = val ? val.join(',') : ''
  }
})

/** 打开弹窗 */
const isFirstCall = ref(false) // 是否是第一次调用，避免重复请求
const open = async (skuId: string) => {
  drawerVisible.value = true
  dialogTitle.value = '编辑'

  // 重置表单
  resetForm()

  // 修改时，设置数据
  if (skuId) {
    formLoading.value = true
    try {
      const data = await productInfoApi.getSkuInfoById({ skuId: skuId })
      console.log('从API获取的原始数据:', data) // 添加日志查看原始数据

      if (data) {
        // 处理字段映射和默认值
        const formDataWithDefaults = {
          ...data,
          skuOutOfStock: data.skuOutOfStock ? String(data.skuOutOfStock) : '0',
          // 处理供应商字段映射：suppliers -> supplierIds
          supplierIds:
            data.suppliers && Array.isArray(data.suppliers)
              ? data.suppliers.map((item) => item.supplierId)
              : [],
          // 处理跟单人员字段映射：users -> userIds
          userIds:
            data.users && Array.isArray(data.users) ? data.users.map((item) => item.userId) : []
        }

        console.log('处理后的表单数据:', formDataWithDefaults) // 添加日志查看处理后的数据

        // 移除原始的suppliers和users字段，避免干扰
        delete formDataWithDefaults.suppliers
        delete formDataWithDefaults.users

        Object.assign(formData.value, formDataWithDefaults)

        console.log('最终的formData:', formData.value) // 添加日志查看最终的表单数据

        isFirstCall.value = true // 设置为第一次调用，确保货品编码可以正确被赋值

        // 为迭代码赋值：优先使用迭代款，如果迭代款未维护则使用货品编码
        // 只有在迭代码没有值的情况下才赋值
        // if (!formData.value.iterateCode) {
        //   if (formData.value.iterateStyle) {
        //     formData.value.iterateCode = formData.value.iterateStyle
        //   } else if (formData.value.goodsNo) {
        //     formData.value.iterateCode = formData.value.goodsNo
        //   }
        // }
        nextTick(() => {
          imgRef.value?.render()
        })
      }
    } finally {
      formLoading.value = false
      nextTick(() => {
        oldFormData.value = cloneDeep(formData.value)
      })
    }
  }
}

// 选择上传人

// 根据用户ID获取用户信息
const getUserInfo = (userId: string) => {
  return productInfoData.peopleList.find((person) => person.userId === userId)
}

// 选择人员
const handleSelectChange = (userIds) => {
  console.log('选择的用户ID:', userIds)
}

async function handleBeforClose(done: () => void) {
  if (deepEqual(oldFormData.value, formData.value)) return done()
  await message.confirm('当前页面还有未保存的数据，确认关闭吗？')
  isFirstCall.value = true // 重置第一次调用标志
  done()
}

// 关闭后
async function handleClosed() {
  resetForm()
  imgRef.value?.clear()
}

// 提交表单
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    await productInfoApi.updateSkuInfo(formData.value)
    message.success('修改成功')
    drawerVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = async () => {
  // 确保完全重置所有字段
  formData.value = {
    skuId: '',
    goodsName: '', // 货品名称
    goodsNo: '', // 货品编码
    composition: '', // 成分
    className: '', // ERP货品分类
    alias: '', // 货品别名
    goodsCreateTime: '', // 货品创建时间
    executionStandards: '', // 执行标准
    securityTechnologyCategory: '', // 安全技术类别
    category: '', // 类目
    level: '', // 商品等级
    productionCycle: '', // 生产周期
    sex: '', // 性别
    season: '', // 季节
    year: '', // 年份
    supplierIds: [], // 货品供应商
    userIds: [], // 跟单人员
    imgUrl: '', // 商品图片
    iterateCode: '', // 迭代码 -提交
    skuOutOfStock: '0', // 下架状态 -提交
    skuNo: '', // 商家编码
    specName: '', // 规格名称
    specCode: '', // 规格码
    barcode: '', // 主条码
    createTime: '', // 创建时间
    goodsId: '', // 商品ID
    outOfStock: 0, // 下架状态
    iterateStyle: '', //原编码
    series: '', //系列
    goodsType: '', //类型
    productType: '', // 产品类型
    useObject: '', // 适用对象
    planTime: '', //企划时间
    labelPrice: '', // 标签价
    mainImgUrl: '', // 货品主图
    craft: '',
    material: '',
    extraComposition: '', //补充成分
    prop3: ''
  }

  // 使用 nextTick 确保 DOM 更新后再重置表单验证
  await nextTick(() => {
    formRef.value?.resetFields()
  })
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
</script>

<style lang="less" scoped>
@import url('../../index.scss');

.drawerContent {
  width: 100%;
  padding: 16px 20px 1px 0;
  background-color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  margin-bottom: 16px;

  &-title {
    margin: 0 0 18px 25px;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 14px;
  }

  .drawerContent-title-icon {
    width: 3px;
    height: 10px;
    background: #0064ff;
    margin-right: 6px;
  }
}

.drawerFooter {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}

.dialogFormItemWidth {
  width: 100%;
}

:deep(.is-disabled .el-icon svg) {
  display: none;
}

:deep(.el-input__prefix) {
  display: none;
}

:deep(.el-drawer__header) {
  margin-bottom: 0px;
}

:deep(.el-drawer__title) {
  font-size: 14px;
  color: #333333;
  line-height: 20px;
  font-weight: 500;
}

:deep(.el-drawer) {
  border-radius: 12px 0px 0px 0px;
  width: 100%;
  height: 100%;
  background: url('@/assets/imgs/common/drawer-bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  box-sizing: border-box;
}

:deep(.el-cascader),
:deep(.el-date-editor) {
  width: 100%;
}
</style>
