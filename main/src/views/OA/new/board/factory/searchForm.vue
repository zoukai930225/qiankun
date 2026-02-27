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
            <el-form-item label="货品编码" prop="productCode">
              <el-input
                class="!w220px"
                v-model="queryParams.productCode"
                placeholder="请输入货品编码"
                clearable
                @keydown.enter="handleQuery"
                @change="handleQuery"
              />
            </el-form-item>
            <el-form-item label="系列" prop="series">
              <el-input
                class="!w220px"
                v-model="queryParams.series"
                placeholder="请输入系列"
                clearable
                @keydown.enter="handleQuery"
                @change="handleQuery"
              />
            </el-form-item>
            <el-form-item label="品类" prop="categoryName">
              <el-input
                class="!w220px"
                v-model="queryParams.categoryName"
                placeholder="请输入品类"
                clearable
                @keydown.enter="handleQuery"
                @change="handleQuery"
              />
            </el-form-item>
            <el-form-item label="采购人员" prop="purchaseUserId">
              <SWSelectPeople
                :isEdit="true"
                :multiple="false"
                v-model:modelValue="queryParams.purchaseUserId"
                type="operate"
                placeholder="请选择选供专员"
                :deptCode="'NEW_DEPT_PURCHASE'"
                style="width: 220px !important"
                @selectChange="handleQuery"
              />
            </el-form-item>
            <el-form-item label="选供专员" prop="chosenSupplierStaffId" v-if="isExpand">
              <SWSelectPeople
                :isEdit="true"
                :multiple="false"
                v-model:modelValue="queryParams.chosenSupplierStaffId"
                type="operate"
                placeholder="请选择选供专员"
                :deptCode="'NEW_PRODUCT_DEPT_SUPPLY'"
                style="width: 220px !important"
                @selectChange="handleQuery"
              />
            </el-form-item>
            <el-form-item label="版师" prop="patternMakerId" v-if="isExpand">
              <SWSelectPeople
                :isEdit="true"
                :multiple="false"
                v-model:modelValue="queryParams.patternMakerId"
                type="operate"
                placeholder="请选择版师"
                :deptCode="'NEW_PRODUCT_DEPT_DEVELOP'"
                style="width: 220px !important"
                @selectChange="handleQuery"
              />
            </el-form-item>
            <!-- <el-form-item label="设计师/买手" prop="designerId" class="longLabel" v-if="isExpand">
              <SWSelectPeople  :isEdit="true" :multiple="false" v-model:modelValue="queryParams.designerId"
                type="operate" placeholder="请选择设计师/买手" :deptCode="'NEW_PRODUCT_DEPT_DEVELOP'"
                style="width: 220px !important;"  @selectChange="handleQuery"/>
            </el-form-item> -->
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
import SWSelectPeople from '@/views/OA/factory/components/selectPeople.vue'
import { propTypes } from '@/utils/propTypes'

const props = defineProps({
  selectTab: propTypes.number.def(3)
})
const isExpand = ref(false)
const queryParams = ref<any>({
  categoryName: undefined,
  productCode: undefined,
  series: undefined,
  chosenSupplierStaffId: undefined,
  designerId: undefined,
  patternMakerId: undefined,
  purchaseUserId: undefined
})

const queryFormRef = ref() // 搜索的表单

/** 搜索按钮操作 */
const handleQuery = () => {
  onSubmit()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  queryParams.value = {
    categoryName: undefined,
    productCode: undefined,
    series: undefined,
    chosenSupplierStaffId: undefined,
    designerId: undefined,
    patternMakerId: undefined,
    purchaseUserId: undefined
  }
  handleQuery()
}

const timeRef = ref()

const onSubmit = () => {
  const params = { ...queryParams.value }
  params.designerId = params.designerId?.map((item: any) => item.userId).join(',')
  params.patternMakerId = params.patternMakerId?.map((item: any) => item.userId).join(',')
  params.chosenSupplierStaffId = params.chosenSupplierStaffId
    ?.map((item: any) => item.userId)
    .join(',')
  params.purchaseUserId = params.purchaseUserId?.map((item: any) => item.userId).join(',')

  emit('handleSearch', params)
}

const fullScreenClick = () => {
  window.open(
    `${window.location.origin}/bigScreen/newGoodProgressBoard?isBigScreen=1&planTemplate=${props.selectTab}`
  )
}

const emit = defineEmits(['handleSearch'])
</script>
<style lang="scss" scoped>
.goodFilter {
  margin: 0 16px;
  padding-bottom: 10px;
  padding-left: 0px;
  margin-top: 0px;
  flex-direction: row;
  border-radius: 4px;
  background: #ffffff;
  .commonTopFilterWrap {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

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
:deep(.el-form-item--default .el-form-item__label) {
  text-align: right;
}
.longLabel {
  :deep(.el-form-item__label) {
    line-height: 16px;
  }
}

:deep(.el-form--inline .el-form-item) {
  margin: 0 10px 10px 0;
}

.g-query-divider {
  .el-button :hover {
    color: var(--el-color-primary);
  }
}

:deep(){
  .el-divider--horizontal {
    margin: 10px 0 15px 0 !important;
  }
}
</style>
