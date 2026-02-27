<!--
 * @Date: 2025-01-03 16:22:21
-->
<template>
  <div>
    <el-form :inline="true" :model="formInline">
      <div class="flex-row form-wapper">
        <div style="flex-wrap: wrap; flex: 1" class="flex-row">
          <div v-for="(field, index) in fieldsWithSearchDisplay" :key="index">
            <el-form-item :label="`${field.name}:`" label-width="110px" v-show="shouldDisplayField(field, index)">
              <!-- 店铺 -->

              <!-- <StoreRangePlus v-if="field.type === 9" v-model="formInline[field.code]"
                :placeholder="field.placeholder" /> -->
              <div v-if="field.type === 9" style="width: 200px">
                <StoreTreeCascader v-model="formInline[field.code]" />
              </div>

              <!-- 选择年 -->
              <el-date-picker v-if="field.code === 'year'" style="width: 200px" v-model="formInline[field.code]"
                type="year" :placeholder="field.placeholder || '请选择年份'" />
              <!-- 选择月 -->
              <el-select v-if="field.code === 'month'" style="width: 200px" v-model="formInline[field.code]" clearable
                :placeholder="field.placeholder || '请选择月份'">
                <el-option v-for="month in months" :key="month.value" :label="month.label" :value="month.value" />
              </el-select>

              <!-- 人员选择 -->
              <div style="width: 200px" v-if="field.type === 8">
                <SWSelectPeople :isEdit="true" :multiple="false" v-model:modelValue="formInline[`${field.code}List`]"
                  type="operate" :getSearchList="remoteMethod"
                  @save-select-people="saveSelectPeople(formInline, field.code)" />
              </div>
              <!-- 计划上架月份-->
              <search-time ref="timeRef" v-if="field.code === 'planListDate'" v-model="formInline[field.code]"
                style="width: 200px" :placeholder="field.placeholder || '请选择计划上架日期'" :layout="'日,周,月'"
                @change="onSubmit" />

              <!-- 品类 -->
              <div v-if="field.type === 2 && field.code === 'category'">
                <CategorySelect @change="onSubmit" v-model="formInline[field.code]" />
              </div>

              <component v-if="field.code !== 'planListDate' && field.code !== 'category'" style="width: 200px"
                :is="componentMap[field.type]" v-model="formInline[field.code]"
                :placeholder="field.placeholder || detaultPlaceholderMap[field.type]"
                :type="componentTypeMap[field.type]" :multiple="field.type === 3"
                :value-format="field.type === 5 ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'" clearable
                :options="field.options">
                <!-- select -->

                <template v-if="
                  (field.type === 2 && field.code !== 'category') ||
                  (field.type === 3 && field.options)
                ">
                  <el-option v-for="option in field.options" :key="option.id" :label="option.value"
                    :value="option.code" />
                </template>
                <template v-if="
                  ((field.type === 2 && field.code !== 'category') || field.type === 3) &&
                  field.dictCode
                ">
                  <el-option v-for="option in getDicList(field.dictCode)" :key="option.code" :label="option.shortName"
                    :value="option.code" />
                </template>

                <!-- select -->
                <!-- <template v-if="field.type === 2 && field.code === 'category'">
                  <el-option v-for="option in categoryList" :key="option.code" :label="option.name"
                    :value="option.code" />
                </template> -->
              </component>
            </el-form-item>
          </div>
        </div>

        <div class="flex-row" style="width: 335px">
          <el-button style="margin-left: auto" @click="onSubmit" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="resetFrom" class="commonResetBtn" style="margin-left: 0px">
            重置
          </el-button>
          <el-button v-hasPermi="['oa:newPlan:add']" type="primary" @click="add">新增</el-button>
          <el-button v-hasPermi="['oa:newPlan:separatedEmployee']" type="primary"
            @click="separatedEmployee">离职人员交接</el-button>
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
import { componentMap, componentTypeMap } from '../utils.js'

import * as CommonApi from '@/api/common'
import * as SystemConstantApi from '@/api/system/systemConstant'

import SWSelectPeople from '@/views/OA/new/develop/components/SWSelectPeople.vue'

import { getDictOptions } from '@/utils/dict'
import { useDicList } from '@/views/OA/new/designGallery/hooks.js'
import SearchTime from '@/components/common/time/search.vue'
import { cloneDeep } from 'lodash-es'

import CategorySelect from '@/views/OA/new/components/selectCategory.vue'

const route = useRoute()
const planName = route.query.planName

const { dicList } = useDicList()
const listDic = ref([])

const timeRef = ref()

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

// 定义类型
interface Field {
  name: string
  code: string
  type: number
  placeholder: string
  options: any[]
  searchDisplay: boolean
  state: number
}

const months = [
  { label: '1月', value: '1' },
  { label: '2月', value: '2' },
  { label: '3月', value: '3' },
  { label: '4月', value: '4' },
  { label: '5月', value: '5' },
  { label: '6月', value: '6' },
  { label: '7月', value: '7' },
  { label: '8月', value: '8' },
  { label: '9月', value: '9' },
  { label: '10月', value: '10' },
  { label: '11月', value: '11' },
  { label: '12月', value: '12' }
]

const showMore = ref(false)

const handleShowMore = () => {
  showMore.value = !showMore.value
}

const detaultPlaceholderMap = {
  0: '请输入',
  1: '请输入',
  2: '请选择',
  3: '请选择',
  4: '请选择',
  5: '请选择',
  6: ''
}

const fieldsWithSearchDisplay = computed(() => {
  return props.fields.filter((field) => field.searchDisplay && field.state == 1)
})
// 展开收起字段
const shouldDisplayField = (field, index) => {
  if (field.searchDisplay &&
    field.state == 1) {
    if (showMore.value) {
      return true
    } else {
      console.log("倒计时付款了就LK", index)
      if (index < 4) {
        return true
      } else {
        return false
      }
    }
  } else { return false }
}

const props = defineProps({
  fields: {
    type: Array as PropType<Field[]>,
    default: () => []
  },
  categoryList: {
    type: Array<any>,
    default: () => []
  }
})

const formInline = ref({})
const emit = defineEmits(['reset', 'search', 'add', 'separatedEmployee'])

const onSubmit = () => {
  let formatValue: any
  if (timeRef.value) {
    formatValue = timeRef.value[0]?.formatValue
  }
  let data: any = cloneDeep({ ...formInline.value })
  data.submitPersonList = null
  let formattedYear = ''
  let formattedMonth = ''
  let formattedDate = ''

  if (data.year && !data.month) {
    const year = new Date(data.year).getFullYear()
    formattedYear = `${year}年` // '2021年'
    data.year = formattedYear
  }

  if (data.month && !data.year) {
    formattedMonth = `${data.month}月` //'2月
    data.month = formattedMonth
  }
  if (data.year && data.month) {
    const year = new Date(data.year).getFullYear()
    formattedYear = `${year}年`
    formattedMonth = `${data.month}月`
    formattedDate = formattedYear + formattedMonth // '20212月'
    data.planningTime = formattedDate
    data.year = undefined
    data.month = undefined
  }
  if (formatValue?.length) {
    data = { ...data, planListStartDate: formatValue[0], planListEndDate: formatValue[1] }
  } else {
    data = { ...data, planListStartDate: null, planListEndDate: null }
  }
  delete data.planListDate

  console.log('提交搜索', data)
  emit('search', data)
}

const add = () => {
  emit('add')
}

const separatedEmployee = () => {
  emit('separatedEmployee')
}

const resetFrom = () => {
  timeRef.value[0]?.resetDate()
  formInline.value = {}
  emit('reset')
}

const personList = ref<any>([])

const openIds = ref('')
const remoteMethod = async (value) => {
  if (!openIds.value) {
    openIds.value = await SystemConstantApi.getSystemConstantConfigbyCode(
      'NEW_PRODUCT_QH_PERSONNEL'
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
  row.editeCode = undefined
  row[`${fieldCode}`] =
    row[`${fieldCode}List`] && row[`${fieldCode}List`].map((item) => item.userId).join(',')
  onSubmit()
}

const handleQuery = () => {
  onSubmit()
}

const setSearchPlanNameValue = (value) => {
  formInline.value['planName'] = value
}

if (planName) {
  formInline.value['planName'] = planName
}

defineExpose({ setSearchPlanNameValue })
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
