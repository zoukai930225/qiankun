<!--
 * @Date: 2025-01-03 16:22:21
-->
<template>
  <div>
    <el-form :inline="true" :model="formInline" ref="queryFormRef" label-width="100px">
      <div class="flex-row form-wapper">
        <div style="flex-wrap: wrap; flex: 1" class="flex-row">
          <el-form-item label="任务编号:" prop="taskCode">
            <el-input
              v-model="formInline.taskCode"
              placeholder="请输入任务编号"
              style="width: 200px"
            />
          </el-form-item>

          <el-form-item label="店铺:" prop="storeCode">
            <div style="width: 200px">
              <StoreRangePlus
                v-model="formInline.storeCode"
                value-type="storeCode"
                :placeholder="'请选择店铺'"
              />
            </div>
          </el-form-item>

          <el-form-item label="企划名称:" prop="planName">
            <el-input
              v-model="formInline.planName"
              placeholder="请输入企划名称"
              style="width: 200px"
            />
          </el-form-item>

          <el-form-item label="计划上架日期:" prop="planListDate" v-if="showMore">
            <div>
              <search-time
                ref="timeRef"
                v-model="formInline.planListDate"
                style="width: 200px"
                :placeholder="'请选择计划上架日期'"
                :layout="'日,周,月'"
                @change="onSubmit"
              />
              <!-- <el-date-picker
                style="width: 200px"
                v-model="formInline.planListDate"
                type="month"
                :value-format="'YYYY-MM'"
                placeholder="请选择计划上架月份"
              /> -->
            </div>
          </el-form-item>
          <el-form-item label="设计师/买手:" prop="designerIdList" v-if="showMore">
            <div>
              <SWSelectPeople
                style="width: 200px"
                :isEdit="true"
                :multiple="false"
                v-model:modelValue="formInline.designerIdList"
                type="operate"
                :getSearchList="remoteMethodDesigner"
                @save-select-people="saveSelectPeople(formInline, 'designerId')"
              />
            </div>
          </el-form-item>
        </div>

        <div class="flex-row" style="width: 240px">
          <el-button style="margin-left: auto" @click="onSubmit" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="resetForm" class="commonResetBtn" style="margin-left: 0px">
            重置
          </el-button>
        </div>
      </div>
    </el-form>

    <div class="more">
      <div class="mid"> </div>
      <div class="more-text-wapper" @click="handleShowMore">
        <span class="more-text"> {{ showMore ? '收起更多' : '展开更多' }} </span>
        <img src="@/assets/imgs/oa/showClose.png" class="icon" v-if="showMore" />
        <img src="@/assets/imgs/oa/showMore.png" class="icon" v-else />
      </div>
      <div class="mid"> </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as CommonApi from '@/api/common'
import * as SystemConstantApi from '@/api/system/systemConstant'
import SearchTime from '@/components/common/time/search.vue'
import SWSelectPeople from '@/views/OA/package/develop/components/SWSelectPeople.vue'
import { cloneDeep } from 'lodash-es'

const route = useRoute()

const showMore = ref(true)

const handleShowMore = () => {
  showMore.value = !showMore.value
}

const formInline = ref({
  taskCode: undefined,
  storeCode: undefined,
  planName: undefined,
  planListDate: undefined,
  designerIdList: undefined
})
const emit = defineEmits(['reset', 'search'])
const timeRef = ref()

const onSubmit = () => {
  const formatValue: any = timeRef.value?.formatValue
  let data: any = cloneDeep({ ...formInline.value })
  if (formatValue?.length) {
    data = {
      ...data,
      planListStartDate: formatValue[0],
      planListEndDate: formatValue[1]
    }
  } else {
    data = { ...data, planListStartDate: null, planListEndDate: null }
  }
  delete data.planListDate

  emit('search', data)
}

const resetForm = () => {
  formInline.value = {
    taskCode: undefined,
    storeCode: undefined,
    planName: undefined,
    planListDate: undefined,
    designerIdList: undefined
  }
  emit('reset')
}

const setSearchPlanNameValue = (value) => {
  formInline.value.planName = value
}

const setSearchTaskCodeValue = (value) => {
  formInline.value.taskCode = value
}

const designerOpenIds = ref('')
const memberList = ref([])
// 获取设计师/买手-产研部门
const remoteMethodDesigner = async (value) => {
  if (memberList.value.length > 0) {
    return memberList.value
  }
  console.log('d22222222')
  if (!designerOpenIds.value) {
    designerOpenIds.value = await SystemConstantApi.getSystemConstantConfigbyCode(
      'NEW_PRODUCT_DEPT_DEVELOP'
    )
  }

  const data = await CommonApi.getPersonByOpenId(designerOpenIds.value).catch(() => {})
  memberList.value = data || []
  return data || []
}

const saveSelectPeople = async (row, fieldCode) => {
  row[`${fieldCode}`] =
    row[`${fieldCode}List`] && row[`${fieldCode}List`].map((item) => item.userId).join(',')
  onSubmit()
}

const planCode = route.query.planCode

if (planCode) {
  formInline.value['planCode'] = planCode
}

defineExpose({ setSearchPlanNameValue, setSearchTaskCodeValue })
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
      font-size: 12px;
      color: #333333;
      margin-right: 6px;
    }

    .icon {
      width: 8px;
      height: 6px;
      cursor: pointer;
    }
  }
}

:deep(.el-select__wrapper) {
  background: #ffffff !important;
}
</style>
