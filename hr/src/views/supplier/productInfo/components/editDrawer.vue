<template>
  <div>
    <el-drawer
      custom-class="addDrawer"
      ref="drawerRef"
      v-model="drawerVisible"
      :title="dialogTitle"
      size="968"
      :before-close="handleBeforClose"
      @closed="handleClosed"
    >
      <div class="drawerContent" v-loading="formLoading">
        <div class="drawerContent-title">
          <div class="drawerContent-title-icon"></div>
          <span>货品基本信息</span>
        </div>

        <el-form
          class="dialogForm"
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="135px"
        >
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
              <el-form-item label="货品图片" prop="mainImgUrl">
                <update-img
                  ref="imgRef"
                  v-model:main-img-url="formData.mainImgUrl"
                  @change="handleChangeImg"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="面料成分" prop="composition">
                <s-text-area v-model.trim="formData.composition" placeholder="--" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="补充成分" prop="extraComposition">
                <s-text-area v-model.trim="formData.extraComposition" placeholder="--" disabled />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="产品类型" prop="productType">
                <el-select v-model="formData.productType" placeholder="请选择" disabled>
                  <el-option
                    v-for="dict in getIntDictOptions(DICT_TYPE.NP_ENTERPRISE_PRODUCTTYPE, true)"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="原编码" prop="iterateStyle ">
                <el-input v-model="formData.iterateStyle" disabled placeholder="--" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="系列" prop="series">
                <el-input v-model="formData.series" disabled placeholder="--" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="品类" prop="category">
                <el-cascader
                  v-model="category"
                  :options="productInfoData.categoryOptions"
                  :props="{ ...customProps, multiple: false, checkStrictly: true }"
                  placeholder="请选择货品品类"
                  collapse-tags
                  collapse-tags-tooltip
                  clearable
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item prop="className" label="ERP品类">
                <el-input :model-value="formData.className" disabled placeholder="--" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="商品等级" prop="level">
                <el-select v-model="formData.level" placeholder="--" disabled>
                  <el-option
                    v-for="dict in getIntDictOptions(DICT_TYPE.NP_PRODUCTGRADE, true)"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="类型" prop="goodsType">
                <el-select v-model="formData.goodsType" placeholder="--" disabled>
                  <el-option
                    v-for="dict in getIntDictOptions(DICT_TYPE.NP_DESIGN_PRODUCT_TYPE, true)"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="安全类别" prop="securityTechnologyCategory">
                <el-select v-model="formData.securityTechnologyCategory" placeholder="--" disabled>
                  <el-option
                    v-for="dict in getIntDictOptions(DICT_TYPE.SECURITY_CATEGORY, true)"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="执行标准" prop="executionStandards">
                <el-select v-model="formData.executionStandards" placeholder="--" disabled>
                  <el-option
                    v-for="dict in getIntDictOptions(DICT_TYPE.EXECUTION_STANDARDS, true)"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="使用季节" prop="season">
                <el-select v-model="season" multiple placeholder="" disabled>
                  <el-option
                    v-for="dict in getIntDictOptions(DICT_TYPE.NP_USE_SEASON, true)"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="使用对象" prop="useObject">
                <el-select v-model="useObject" multiple placeholder="" disabled>
                  <el-option
                    v-for="dict in getIntDictOptions(DICT_TYPE.NP_USE_TARGET, true)"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="适用性别" prop="sex">
                <el-select multiple v-model="sex" placeholder="" disabled>
                  <el-option
                    v-for="dict in getIntDictOptions(DICT_TYPE.NP_APPLY_GENDER, true)"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="企划时间" prop="planTime">
                <el-input v-model="formData.planTime" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="货品创建时间" prop="createTime">
                <el-date-picker
                  disabled
                  v-model="formData.createTime"
                  type="datetime"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  format="YYYY-MM-DD HH:mm:ss"
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="跟单人员" prop="userIds">
                <el-select
                  popper-class="eloption"
                  :popper-append-to-body="true"
                  v-model="formData.userIds"
                  placeholder="请选择"
                  @change="handleSelectChange"
                  filterable
                  multiple
                  clearable
                >
                  <template #tag>
                    <div class="label-wrapper" v-for="userId in formData.userIds" :key="userId">
                      <img class="avatorLogo" :src="getUserInfo(userId)?.avatarOrigin" alt="" />
                      <span class="name">{{ getUserInfo(userId)?.name }} </span>
                      <el-icon
                        class="el-icon-close !cursor-pointer !color-#999"
                        @click.stop="
                          formData.userIds = formData.userIds.filter((id) => id !== userId)
                        "
                      >
                        <Close />
                      </el-icon>
                    </div>
                  </template>
                  <el-option
                    v-for="dict in productInfoData.peopleList"
                    :key="dict.userId"
                    :label="dict.name"
                    :value="dict.userId"
                  >
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
                <el-select
                  disabled
                  v-model="formData.supplierIds"
                  filterable
                  multiple
                  collapse-tags
                  collapse-tags-tooltip
                  placeholder="请选择"
                >
                  <el-option
                    v-for="dict in productInfoData.supplierList"
                    :key="dict.id"
                    :label="dict.abbreviationCompany"
                    :value="dict.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="drawerFooter">
          <el-button :disabled="formLoading" type="primary" @click="submitForm"> 保 存</el-button>
          <el-button @click="drawerRef.handleClose">关 闭</el-button>
        </div>
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
const message = useMessage() // 消息弹窗
const drawerVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用

import { FormInstance, FormRules } from 'element-plus/es'
import { cloneDeep } from 'lodash-es'
import { deepEqual } from '@/utils/common'
import updateImg from './updateImg.vue'
import { customProps } from '../../supplierProduct/options'

const formData = ref<any>({
  goodsId: '', // 商品ID
  goodsName: '', // 货品名称
  goodsNo: '', // 货品编码
  composition: '', // 面料成分
  className: '', // ERP货品分类
  alias: '', // 货品别名
  createTime: '', // 货品创建时间
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
  outOfStock: 0, // 下架状态
  mainImgUrl: '', //商品图片
  iterateStyle: '', //原编码
  series: '', //系列
  goodsType: '', //类型
  productType: '', // 产品类型
  useObject: '', // 适用对象
  planTime: '', //企划时间
  labelPrice: '', // 标签价
  extraComposition: '' //补充成分
})
const oldFormData = ref<typeof formData.value>()
const drawerRef = ref()
const imgRef = ref()
const category = ref<any>()

const formRef = ref<FormInstance>() // 表单 Ref

const formRules = reactive<FormRules>({
  userIds: [{ required: true, message: '请选择跟单员' }]
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

function handleChangeImg() {
  formRef.value?.validateField('mainImgUrl')
}

/** 打开弹窗 */
const isFirstCall = ref(false) // 是否是第一次调用，避免重复请求
const open = async (goodsId: string) => {
  drawerVisible.value = true
  dialogTitle.value = '编辑'
  // 修改时，设置数据
  if (goodsId) {
    formLoading.value = true
    try {
      const data = await productInfoApi.getProductInfo({ goodsId: goodsId })
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
        // 移除原始的suppliers和users字段，避免干扰
        Object.assign(formData.value, formDataWithDefaults)
        isFirstCall.value = true // 设置为第一次调用，确保货品编码可以正确被赋值
        // 如果货品编码有值且迭代款为空，则将货品编码赋值给迭代款

        category.value = formData.value.category

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

// 根据用户ID获取用户信息
const getUserInfo = (userId: string) => {
  return productInfoData.peopleList.find((person) => person.userId === userId)
}

// 选择人员
const handleSelectChange = (userIds: string[]) => {
  userIds.splice(0, userIds.length - 1)
}

// 提交表单
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  await formRef.value?.validate()
  // 提交请求
  formLoading.value = true
  try {
    // 确保提交数据时字段正确
    const submitData = {
      ...formData.value,
      outOfStock: formData.value.outOfStock ?? 0,
      // 确保提交的是正确的字段名
      supplierIds: formData.value.supplierIds || [],
      userIds: formData.value.userIds || [],
      category:
        typeof category.value === 'string'
          ? formData.value.category
          : category.value?.length
            ? category.value?.[category.value?.length - 1]
            : ''
    }
    console.log('提交的数据', submitData)

    await productInfoApi.updateProductInfo(submitData)
    message.success('修改成功')
    drawerVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}

// 关闭前
async function handleBeforClose(done: () => void) {
  if (deepEqual(oldFormData.value, formData.value)) return done()
  await message.confirm('当前页面还有未保存的数据，确认关闭吗？')
  isFirstCall.value = true // 重置第一次调用标志
  formRef.value?.resetFields()
  done()
}

// 关闭后
function handleClosed() {
  formRef.value?.resetFields()
  formData.value = Object.fromEntries(
    Object.entries(formData.value).map(([key, _]) => [key, undefined])
  )
  imgRef.value?.clear()
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
</script>

<style lang="less" scoped>
@import url('../index.scss');

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
