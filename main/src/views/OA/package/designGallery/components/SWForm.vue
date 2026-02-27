<!--
 * @Date: 2025-01-03 16:22:21
-->
<template>
  <div>
    <el-form :inline="true" :model="formInline" label-width="100px">
      <div class="flex-row form-wapper">
        <div style="flex-wrap: wrap" class="flex-row">
          <el-form-item label="店铺:" prop="storeCode">
            <StoreTreeCascader v-model="formInline.storeCode" style="width: 200px" />
          </el-form-item>

          <!-- 计划上架月份-->
          <el-form-item label="计划上架日期" prop="planListDate">
            <search-time ref="timeRef" v-model="formInline.planListDate" style="width: 200px" :placeholder="'请选择计划上架日期'"
              :layout="'日,周,月'" @change="onSubmit" />
            <!-- <el-date-picker
              v-model="formInline.planListDate"
              type="date"
              style="width: 200px"
              :value-format="'YYYY-MM-DD'"
              placeholder="请选择计划上架日期"
            /> -->
          </el-form-item>

          <el-form-item label="任务编号:" prop="taskCode">
            <el-input v-model="formInline.taskCode" placeholder="请输入任务编号" style="width: 200px" />
          </el-form-item>

          <el-form-item label="设计师/买手">
            <div style="width: 200px">
              <SWSelectPeople :isEdit="true" :multiple="false" v-model:modelValue="formInline[`designerList`]"
                type="operate" :getSearchList="remoteMethod"
                @save-select-people="saveSelectPeople(formInline, 'designer')" />
            </div>
          </el-form-item>

          <el-form-item label="产品编号:" prop="productNumber">
            <el-input v-model="formInline.productNumber" placeholder="请输入产品编号" style="width: 200px" />
          </el-form-item>
          <el-form-item label="系列:" prop="series">
            <el-input v-model="formInline.series" placeholder="请输入系列" style="width: 200px" />
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
            <el-button @click="add" type="primary">新增</el-button>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import * as CommonApi from '@/api/common'
import * as SystemConstantApi from '@/api/system/systemConstant'
import SearchTime from '@/components/common/time/search.vue'
import { getDictOptions } from '@/utils/dict'
import SWSelectPeople from '@/views/OA/new/develop/components/SWSelectPeople.vue'
import { cloneDeep } from 'lodash-es'
import { useDicList } from '../hooks.js'

const route = useRoute()
const productNumber = route.query.productNumber
const timeRef = ref()
const { dicList } = useDicList()
const listDic = ref([])

watch(dicList, (newVal) => {
  // @ts-ignore
  listDic.value = newVal || []
})

const getDicList = (dictCode) => {
  // @ts-ignore
  const item = listDic.value.filter((item) => item?.id == dictCode)
  //@ts-ignore
  const dictList = getDictOptions(item?.[0]?.code).filter((item) => item?.code != 'ALL')
  return dictList
}

const formInline = ref({
  taskCode: undefined,
  examineStatus: undefined,
  productNumber: undefined,
  series: undefined,
  storeCode: undefined,
  planListDate: []
})
const emit = defineEmits(['reset', 'search', 'add'])

const onSubmit = () => {
  const formatValue: any = timeRef.value?.formatValue
  let data: any = cloneDeep({ ...formInline.value })
  if (formatValue?.length) {
    data = {
      ...data,
      planListStartDate:
        formatValue[0] == 'Invalid Date' || !formatValue[0] ? undefined : formatValue[0],
      planListEndDate:
        formatValue[1] == 'Invalid Date' || !formatValue[1] ? undefined : formatValue[1],
      designerList: undefined
    }
  } else {
    data = { ...data, planListStartDate: null, planListEndDate: null, designerList: undefined }
  }
  delete data.planListDate

  emit('search', data)
}

const add = () => {
  emit('add')
}

const resetFrom = () => {
  formInline.value = {
    taskCode: undefined,
    examineStatus: undefined,
    productNumber: undefined,
    series: undefined,
    storeCode: undefined,
    planListDate: []
  }
  emit('reset')
}
// 设计师买手
const personList = ref<any>([])
const openIds = ref('')
const remoteMethod = async (value) => {
  if (!openIds.value) {
    openIds.value = await SystemConstantApi.getSystemConstantConfigbyCode(
      'NEW_PRODUCT_DEPT_DEVELOP'
    ).catch((e) => { })
  }
  if (personList.value.length > 0) {
    return personList.value || []
  }
  const data = await CommonApi.getPersonByOpenId(openIds.value).catch(() => { })
  personList.value = data || []
  return data || []
}

const saveSelectPeople = async (row, fieldCode) => {
  row[`${fieldCode}`] =
    row[`${fieldCode}List`] && row[`${fieldCode}List`].map((item) => item.userId).join(',')
  onSubmit()
}

const resetQuery = () => {
  formInline.value = {
    taskCode: undefined,
    examineStatus: undefined,
    productNumber: undefined,
    series: undefined,
    store: undefined,
    planListDate: undefined
  }
}

defineExpose({ resetQuery })

if (productNumber) {
  formInline.value['productNumber'] = productNumber
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
</style>
