<template>
  <div>
    <div class="goodFilter">
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form
            ref="queryFormRef"
            :inline="true"
            :model="queryParams"
            class="-mb-15px"
            label-width="70px"
            @submit.prevent
          >
          <el-form-item label="企划名称" prop="planName">
              <el-input
                style="width: 230px"
                class="searchFormItemWidth"
                v-model="queryParams.planName"
                placeholder="请输入企划名称"
                clearable
                @keyup.enter="handleQuery"
                 @change="handleQuery"
              />
            </el-form-item>
          <el-form-item label="图稿编号" prop="artworkNumber">
              <el-input
                style="width: 230px"
                v-model="queryParams.artworkNumber"
                clearable
                placeholder="请输入图稿编号"
                @keydown.enter="handleQuery"
                @change="handleQuery"
              />
            </el-form-item>
            <el-form-item label="货品编码" prop="productCode">
              <el-input
                style="width: 230px"
                v-model="queryParams.productCode"
                clearable
                placeholder="请输入货品编码"
                @keydown.enter="handleQuery"
                @change="handleQuery"
              />
            </el-form-item>
            <el-form-item label="品类" prop="categoryCode">
              <CategorySelect
                style="width: 230px"
                v-model="queryParams.categoryCode"
                @change="handleQuery"
              />
            </el-form-item>
            <el-form-item label="计划上架日期" prop="planListDate" class="multiline-label-item"  v-if="isExpand">
              <!-- 计划上架月份-->
              <search-time
                ref="timeRef"
                v-model="queryParams.planListDate"
                style="width: 230px"
                :placeholder="'请选择计划上架时间'"
                :layout="'日,周,月'"
                @change="onSubmit"
              />
            </el-form-item>

            <el-form-item label="产品等级" prop="isCore"  v-if="isExpand">
              <el-select
                style="width: 230px"
                v-model="queryParams.isCore"
                placeholder="请选择产品等级"
                clearable
                @change="handleQuery"
              >
                <el-option
                  v-for="option in getIntDictOptions(DICT_TYPE.NP_PRODUCTGRADE, true)"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
            <!-- 店铺 -->
            <el-form-item label="店铺" prop="store"  v-if="isExpand">
              <div style="width: 230px">
                <StoreTreeCascader v-model="queryParams.store" />
              </div>
            </el-form-item>

            <el-form-item label="部门" prop="departmentId"  v-if="isExpand">
              <el-select
                style="width: 230px"
                v-model="queryParams.departmentId"
                placeholder="请选择部门"
                clearable
                @change="handleQuery"
              >
                <el-option
                  v-for="item in deptList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="设计师/买手" class="multiline-label-item" v-if="isExpand">
              <div style="width: 230px">
                <SWSelectPeople
                  :isEdit="true"
                  :multiple="false"
                  v-model:modelValue="queryParams[`designerList`]"
                  type="operate"
                  :getSearchList="remoteMethod"
                  @save-select-people="saveSelectPeople(queryParams, 'designer')"
                />
              </div>
            </el-form-item>
            <el-form-item label="运营负责人" class="multiline-label-item" v-if="isExpand">
              <div style="width: 230px">
                <SWSelectPeople
                  :isEdit="true"
                  :multiple="false"
                  v-model:modelValue="queryParams[`operationManagerList`]"
                  type="operate"
                  :getSearchList="remoteMethod1"
                  @save-select-people="saveSelectPeople(queryParams, 'operationManager')"
                />
              </div>
            </el-form-item>
            <el-form-item label="采购负责人" class="multiline-label-item" v-if="isExpand">
              <div style="width: 230px">
                <SWSelectPeople
                  :isEdit="true"
                  :multiple="false"
                  v-model:modelValue="queryParams[`purchaseManagerList`]"
                  type="operate"
                  :getSearchList="remoteMethod1"
                  @save-select-people="saveSelectPeople(queryParams, 'purchaseManager')"
                />
              </div>
            </el-form-item>
            <el-form-item label="选供专员" v-if="isExpand">
              <div style="width: 230px">
                <SWSelectPeople
                  :isEdit="true"
                  :multiple="false"
                  v-model:modelValue="queryParams[`chosenSupplierStaffIdList`]"
                  type="operate"
                  :getSearchList="remoteMethod"
                  @save-select-people="saveSelectPeople(queryParams, 'chosenSupplierStaffId')"
                />
              </div>
            </el-form-item>
            
            
          </el-form>
        </div>
        <div class="commonTopFilterWrap-search">
          <div class="commonTopFilterWrap-search-container">
            <!-- <el-button @click="handleQuery" class="commonSearchBtn">
              <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
              搜索
            </el-button> -->
            <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0px">
              重置
            </el-button>
            <div class="fullScreenBg" @click="fullScreenClick">
              <el-icon style="margin-left: 12px; margin-right: 10px; width: 12px; height: 12px">
                <FullScreen />
              </el-icon>
              全屏
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="padding: 0 20px">
      <el-divider class="g-query-divider">
        <el-button link @click="isExpand = !isExpand"
          >{{ isExpand ? '收起' : '展开' }}
          <el-icon class="el-icon--right">
            <component :is="!isExpand ? 'ArrowDown' : 'ArrowUp'" />
          </el-icon>
        </el-button>
      </el-divider>
    </div>
  </div>
</template>
<script lang="ts" setup>
import * as CommonApi from '@/api/common'
import * as SystemConstantApi from '@/api/system/systemConstant'
import SearchTime from '@/components/common/time/search.vue'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { propTypes } from '@/utils/propTypes'
import CategorySelect from '@/views/OA/new/components/selectCategory.vue'
import SWSelectPeople from '@/views/OA/new/develop/components/SWSelectPeople.vue'
const props = defineProps({
  selectTab: propTypes.number.def(1),
  deptList: propTypes.array.def([])
})
const isExpand = ref(false)

const queryParams = ref({
  planCode: '',
  isCore: '',
  store: '',
  departmentId: '',
  productNumber: '',
  designer: '',
  designerList: [],
  operationManager: '',
  operationManagerList: [],
  purchaseManager: '',
  purchaseManagerList: [],
  chosenSupplierStaffId: '',
  chosenSupplierStaffIdList: [],
  planName: '',
  planListDate: '',
  artworkNumber: '',
  productCode: '',
  categoryCode: []
})

const queryFormRef = ref() // 搜索的表单

/** 搜索按钮操作 */
const handleQuery = () => {
  onSubmit()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  queryParams.value = {}
  handleQuery()
}

const timeRef = ref()

const onSubmit = () => {
  let data = { ...queryParams.value }
  data.designerList = undefined
  data.operationManagerList = undefined
  data.purchaseManagerList = undefined
  data.chosenSupplierStaffIdList = undefined

  const formatValue: any = timeRef.value?.formatValue

  if (formatValue?.length) {
    data = { ...data, planListStartDate: formatValue[0], planListEndDate: formatValue[1] }
  } else {
    data = { ...data, planListStartDate: null, planListEndDate: null }
  }
  delete data.planListDate

  emit('handleSearh', data)
}

const resetQueryParams = () => {
  queryParams.value = {}
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

const peopleList1 = ref([])
const remoteMethod1 = async (value) => {
  if (peopleList1.value.length > 0) {
    return peopleList1.value
  }

  const data = await CommonApi.getPersonByOpenId('1').catch(() => {})
  peopleList1.value = data || []
  return data || []
}

const saveSelectPeople = async (row, fieldCode) => {
  row[`${fieldCode}`] =
    row[`${fieldCode}List`] && row[`${fieldCode}List`].map((item) => item.userId).join(',')
  onSubmit()
}

const fullScreenClick = () => {
  window.open(
    `${window.location.origin}/bigScreen/newGoodProgressBoard?isBigScreen=1&planTemplate=${props.selectTab}`
  )
}

const emit = defineEmits(['handleSearh'])

defineExpose({ resetQueryParams })
</script>
<style lang="scss" scoped>
.goodFilter {
  margin: 0 16px;
  padding-bottom: 16px;
  padding-left: 0px;
  margin-top: 0px;
  display: flex;
  flex-direction: row;
  border-radius: 4px;
  background: #ffffff;

  .fullScreenBg {
    cursor: pointer;
    box-shadow: 0px 0px 8px 0px rgba(0, 50, 125, 0.2);
    border-radius: 16px;
    height: 32px;
    width: 80px;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 10px;
    font-size: 13px;

    color: #0064ff;
  }
}

:deep(.el-select__wrapper) {
  background: #ffffff !important;
}

.g-query-divider {
  .el-button :hover {
    color: var(--el-color-primary);
  }
}

.custom-store {
  :deep(){
    .el-input__wrapper {
      box-sizing: border-box;
      height: 35px !important;
    }
  }
}

:deep(.el-select__wrapper) {
  height: 35px !important;
}

:deep(.el-form--inline .el-form-item) {
  margin: 0 10px 10px 0;
}

:deep(){
  .el-divider--horizontal {
    margin: 5px 0 15px 0 !important;
  }
}
</style>
