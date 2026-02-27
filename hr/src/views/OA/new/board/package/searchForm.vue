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
            <el-form-item label="企划名称">
                <el-input
                  style="width: 230px"
                  class="searchFormItemWidth"
                  v-model="queryParams.planName"
                  placeholder="请输入企划名称"
                  clearable
                  @keyup.enter="handleQuery"
                  @clear="handleQuery"
                  @change="handleQuery"
                />
            </el-form-item>
            <el-form-item label="计划上架日期" prop="planListDate" class="multiline-label-item" >
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
            <el-form-item label="设计师/买手" class="multiline-label-item" >
              <div style="width: 230px">
                <SWSelectPeople
                  :isEdit="true"
                  :multiple="false"
                  v-model:modelValue="queryParams[`designerIdList`]"
                  type="operate"
                  :getSearchList="remoteMethod"
                  @save-select-people="saveSelectPeople(queryParams, 'designerId')"
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
  </div>
</template>
<script lang="ts" setup>
import * as CommonApi from '@/api/common'
import * as SystemConstantApi from '@/api/system/systemConstant'
import SearchTime from '@/components/common/time/search.vue'
import { propTypes } from '@/utils/propTypes'
import SWSelectPeople from '@/views/OA/new/develop/components/SWSelectPeople.vue'
const props = defineProps({
  selectTab: propTypes.number.def(1),
  deptList: propTypes.array.def([])
})

const queryParams = ref({
  planListDate: undefined,
  planName: undefined,
  designerIdList: [],
  designerId: undefined
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
    planListDate: undefined,
    planName: undefined,
    designerIdList: [],
    designerId: undefined
  }
  handleQuery()
}

const timeRef = ref()

const onSubmit = () => {
  let data = { ...queryParams.value }
  data.designerIdList = []
  const formatValue: any = timeRef.value?.formatValue
  if (formatValue?.length) {
    data = { ...data, planListStartDate: formatValue[0], planListEndDate: formatValue[1] }
  } else {
    data = { ...data, planListStartDate: undefined, planListEndDate: undefined }
  }
  delete data.planListDate

  emit('handleSearh', data)
}

const resetQueryParams = () => {
  queryParams.value = {
    planListDate: undefined,
    planName: undefined,
    designerIdList: []
  }
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

:deep(.el-select__wrapper) {
  background: #ffffff !important;
}

:deep(.el-form--inline .el-form-item) {
  margin: 0 10px 10px 0;
}
</style>
