<!--
 * @Date: 2025-01-03 16:22:21
-->
<template>
  <div>
    <el-form :inline="true" :model="formInline" ref="queryFormRef" label-width="100px">
      <div class="flex-row form-wapper">
        <div style="flex-wrap: wrap; flex: 1" class="flex-row">
          <el-form-item label="企划名称:" prop="planName">
            <el-input
              v-model="formInline.planName"
              placeholder="请输入企划名称"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="企划类型:" prop="planType">
            <el-select
              v-model="formInline.planType"
              placeholder="请选择企划类型"
              style="width: 200px"
            >
              <el-option label="计划" value="0" />
              <el-option label="临时" value="1" />
            </el-select>
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
          <el-form-item label="提交人:" prop="submitUserIdList">
            <div style="width: 200px">
              <SWSelectPeople
                :isEdit="true"
                :multiple="false"
                v-model:modelValue="formInline.submitUserIdList"
                type="operate"
                :getSearchList="remoteMethod"
                @save-select-people="saveSelectPeople(formInline, 'submitUserId')"
              />
              <!--    -->
            </div>
          </el-form-item>

          <el-form-item label="年度:" prop="planYear" v-if="showMore">
            <div>
              <el-date-picker
                style="width: 200px"
                v-model="formInline.planYear"
                type="year"
                :value-format="'YYYY'"
                :placeholder="'请选择年份'"
              />
            </div>
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
                :value-format="'YYYY-MM-DD'"
                placeholder="请选择计划上架日期"
              /> -->
            </div>
          </el-form-item>
        </div>

        <div class="flex-row" style="width: 200px">
          <el-button style="margin-left: auto" @click="onSubmit" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="resetForm" class="commonResetBtn" style="margin-left: 0px">
            重置
          </el-button>
          <el-button type="primary" @click="add">新增</el-button>
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
import SWSelectPeople from '@/views/OA/new/develop/components/SWSelectPeople.vue'
import { cloneDeep } from 'lodash-es'

import { useDicList } from '@/views/OA/new/designGallery/hooks.js'

const route = useRoute()
const planName = route.query.planName

const { dicList } = useDicList()
const listDic = ref([])

watch(dicList, (newVal) => {
  // @ts-ignore
  listDic.value = newVal || []
})

const showMore = ref(true)

const handleShowMore = () => {
  showMore.value = !showMore.value
}

const formInline = ref({
  planName: undefined,
  storeCode: undefined,
  submitUserId: undefined,
  planYear: undefined,
  planListDate: undefined,
  submitUserIdList: undefined,
  planType: undefined
})
const emit = defineEmits(['reset', 'search', 'add'])

const timeRef = ref()

const onSubmit = () => {
  const formatValue: any = timeRef.value?.formatValue
  let data: any = cloneDeep({ ...formInline.value })
  if (formatValue?.length) {
    data = {
      ...data,
      planListStartDate: formatValue[0],
      planListEndDate: formatValue[1],
      submitUserIdList: undefined
    }
  } else {
    data = { ...data, planListStartDate: null, planListEndDate: null, submitUserIdList: undefined }
  }
  delete data.planListDate

  emit('search', data)
}

const add = () => {
  emit('add')
}

const resetForm = () => {
  formInline.value = {
    planName: undefined,
    storeCode: undefined,
    submitUserId: undefined,
    planYear: undefined,
    planListDate: undefined,
    submitUserIdList: undefined,
    planType: undefined
  }
  emit('reset')
}

const personList = ref<any>([])

const openIds = ref('')
const remoteMethod = async (value) => {
  if (!openIds.value) {
    openIds.value = await SystemConstantApi.getSystemConstantConfigbyCode(
      'NEW_PRODUCT_QH_PERSONNEL'
    )
  }
  if (personList.value.length > 0) {
    return personList.value || []
  }
  const data = await CommonApi.getPersonByOpenId(openIds.value)
  personList.value = data || []
  return data || []
}

const saveSelectPeople = async (row, fieldCode) => {
  row[fieldCode] = undefined
  row[`${fieldCode}`] =
    row[`${fieldCode}List`] && row[`${fieldCode}List`].map((item) => item.userId).join(',')

  onSubmit()
}
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
