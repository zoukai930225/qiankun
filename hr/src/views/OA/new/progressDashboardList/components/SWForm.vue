<!--
 * @Date: 2025-01-03 16:22:21
-->
<template>
  <div>
    <el-form :inline="true" :model="form" label-width="100px" class="commonTopFilterWrap">
      <div class="flex-row form-wapper">
        <div style="flex-wrap: wrap; flex: 1" class="flex-row">
          <el-form-item label="企划名称" prop="planName">
            <el-input
              v-model="form.planName"
              placeholder="请输入企划名称"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="店铺" prop="store">
            <StoreTreeCascader v-model="form.store" style="width: 200px" />
          </el-form-item>

          <el-form-item label="企划类型">
            <el-select
              class="dialogFormItemWidth"
              v-model="form.planType"
              placeholder="请选择"
              clearable
              style="width: 200px"
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.NP_ENTERPRISE_PLANTYPE, true)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="产品等级" prop="isCore">
            <el-select
              class="dialogFormItemWidth"
              v-model="form.isCore"
              placeholder="请选择"
              clearable
              style="width: 200px"
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.NP_PRODUCTGRADE, true)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="品类" prop="category" v-if="showMore">
            <el-select class="!w200px" v-model="form.category" placeholder="请选择品类" clearable>
              <el-option
                v-for="item in categoryList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="计划上架月份" v-if="showMore">
            <!-- 计划上架月份-->
            <search-time
              ref="timeRef"
              v-model="form.planListDate"
              style="width: 200px"
              :placeholder="'请选择计划上架日期'"
              :layout="'日,周,月'"
              @change="onSubmit"
            />
          </el-form-item>
          <el-form-item label="任务编号" v-if="showMore">
            <el-input
              v-model="form.planCode"
              placeholder="请输入任务编号"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="产品编号" v-if="showMore">
            <el-input
              v-model="form.productNumber"
              placeholder="请输入产品编号"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="货品编码" v-if="showMore">
            <el-input
              v-model="form.productCode"
              placeholder="请输入货品编码"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="设计师/买手" v-if="showMore">
            <div style="width: 200px">
              <SWSelectPeople
                :isEdit="true"
                :multiple="false"
                v-model:modelValue="form[`designerList`]"
                type="operate"
                :getSearchList="remoteMethod"
                @save-select-people="saveSelectPeople(form, 'designer')"
              />
            </div>
          </el-form-item>
          <el-form-item label="运营负责人" v-if="showMore">
            <div style="width: 200px">
              <SWSelectPeople
                :isEdit="true"
                :multiple="false"
                v-model:modelValue="form[`operateManageIdList`]"
                type="operate"
                :getSearchList="remoteMethod1"
                @save-select-people="saveSelectPeople(form, 'operateManageId')"
              />
            </div>
          </el-form-item>
          <el-form-item label="采购负责人" v-if="showMore">
            <div style="width: 200px">
              <SWSelectPeople
                :isEdit="true"
                :multiple="false"
                v-model:modelValue="form[`procurementManagerIdList`]"
                type="operate"
                :getSearchList="remoteMethod1"
                @save-select-people="saveSelectPeople(form, 'procurementManagerId')"
              />
            </div>
          </el-form-item>
          <el-form-item label="供应链开发" v-if="showMore">
            <div style="width: 200px">
              <SWSelectPeople
                :isEdit="true"
                :multiple="false"
                v-model:modelValue="form[`chosenSupplierStaffIdList`]"
                type="operate"
                :getSearchList="remoteMethodChosenSupplierStaffId"
                @save-select-people="saveSelectPeople(form, 'chosenSupplierStaffId')"
              />
            </div>
          </el-form-item>
        </div>
        <div class="commonTopFilterWrap-search">
          <div class="commonTopFilterWrap-search-container">
            <el-button @click="onSubmit" class="commonSearchBtn">
              <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
              搜索
            </el-button>
            <el-button @click="resetFrom" class="commonResetBtn" style="margin-left: 0">
              重置
            </el-button>
            <!-- 收起 展开 -->
            <div class="more">
              <div class="more-text-wapper" @click="handleShowMore">
                <span class="more-text"> {{ showMore ? '收起' : '展开' }} </span>
                <img src="@/assets/imgs/oa/showClose.png" class="icon" v-if="showMore" />
                <img src="@/assets/imgs/oa/showMore.png" class="icon" v-else />
              </div>
              <div class="mid"> </div>
            </div>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import * as CommonApi from '@/api/common'
import { goodsPersonalQueryTag } from '@/api/shop/index'
import * as SystemConstantApi from '@/api/system/systemConstant'
import SearchTime from '@/components/common/time/search.vue'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import SWSelectPeople from '@/views/OA/new/develop/components/SWSelectPeople.vue'
import { useCategoryList } from '@/views/OA/new/product/hooks.js'
const { categoryList } = useCategoryList()

const showMore = ref(true)
const productGradeList = ref()

const handleShowMore = () => {
  showMore.value = !showMore.value
}

const initBase = async () => {
  const params = {
    tagCategory: 'goods'
  }
  const res = await goodsPersonalQueryTag(params)
  productGradeList.value = res.records || []
}

const chosenSupplierStaffIdList = ref([])
const chosenSupplierStaffIdOpenIds = ref('')

// 选供专员
const remoteMethodChosenSupplierStaffId = async (value) => {
  if (chosenSupplierStaffIdList.value.length > 0) {
    return chosenSupplierStaffIdList.value
  }
  if (!chosenSupplierStaffIdOpenIds.value) {
    chosenSupplierStaffIdOpenIds.value = await SystemConstantApi.getSystemConstantConfigbyCode(
      'NEW_PRODUCT_DEPT_SUPPLY'
    ).catch((e) => {})
  }

  const data = await CommonApi.getPersonByOpenId(chosenSupplierStaffIdOpenIds.value).catch(() => {})
  chosenSupplierStaffIdList.value = data || []
  return data || []
}

const personList = ref<any>([])
const openIds = ref('')
const remoteMethod = async (value) => {
  if (!openIds.value) {
    openIds.value = await SystemConstantApi.getSystemConstantConfigbyCode(
      'NEW_PRODUCT_DEPT_DEVELOP'
    ).catch((e) => {})
  }
  if (personList.value.length > 0) {
    return personList.value || []
  }
  const data = await CommonApi.getPersonByOpenId(openIds.value).catch(() => {})
  personList.value = data || []
  return data || []
}

const saveSelectPeople = async (row, fieldCode) => {
  row[`${fieldCode}`] =
    row[`${fieldCode}List`] && row[`${fieldCode}List`].map((item) => item.userId).join(',')
  onSubmit()
}

const peopleList1 = ref([])
const remoteMethod1 = async (value) => {
  if (peopleList1.value.length > 0) {
    return peopleList1.value
  }

  const data = await CommonApi.getPersonByOpenId('1').catch(() => {})
  peopleList1.value = data || []
  return data || []
}

const form = ref({
  planName: undefined,
  store: undefined,
  planType: undefined,
  isCore: undefined,
  category: undefined,
  planListDate: undefined,
  planCode: undefined,
  productNumber: undefined,
  productCode: undefined,
  designer: undefined,
  operateManageId: undefined,
  procurementManagerId: undefined,
  chosenSupplierStaffId: undefined
})

onMounted(() => {
  initBase()
})

const emit = defineEmits(['reset', 'search'])
const timeRef = ref()
const onSubmit = () => {
  const formatValue: any = timeRef.value?.formatValue

  const data = Object.assign({}, form.value, {
    planListStartDate: formatValue?.length ? formatValue[0] : null,
    planListEndDate: formatValue?.length ? formatValue[1] : null,
    operateManageIdList: undefined,
    procurementManagerIdList: undefined,
    chosenSupplierStaffIdList: undefined,
    designerList: undefined,
    planListDate: undefined
  })
  emit('search', data)
}

const resetFrom = () => {
  form.value = {
    planName: undefined,
    store: undefined,
    planType: undefined,
    isCore: undefined,
    category: undefined,
    planListDate: undefined,
    planCode: undefined,
    productNumber: undefined,
    productCode: undefined,
    designer: undefined,
    operateManageId: undefined,
    procurementManagerId: undefined,
    chosenSupplierStaffId: undefined
  }
  emit('reset')
}

const setSearchProductNumberValue = (value) => {
  form.value['productNumber'] = value
}

defineExpose({ setSearchProductNumberValue })
</script>

<style lang="scss" scoped>
.flex-row {
  display: flex;
  flex-direction: row;
}

.more {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  justify-content: space-around;

  .mid {
    flex: 1;
    height: 1px;
    background: #ebeef5;
  }

  .more-text-wapper {
    display: flex;
    align-items: center;
    margin: 0 20px;

    .more-text {
      cursor: pointer;
      font-weight: 400;
      font-size: 14px;
      color: #0064ff;
      margin-right: 6px;
    }

    .icon {
      width: 8px;
      height: 6px;
      cursor: pointer;
    }
  }
}
:deep() {
  .el-select__wrapper {
    background: white !important;
  }
}
.commonTopFilterWrap-search-container {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}
</style>
