<!--
 * @Date: 2025-01-03 16:22:21
-->
<template>
  <div style="position: relative">
    <!-- <div style="width: calc(100% - 88px)"> -->
    <el-form :inline="true" :model="formInline" label-width="70px">
      <div class="flex-row form-wapper" style="width: calc(100% - 88px)">
        <div style="flex-wrap: wrap; flex: 1" class="flex-row">
          <div v-for="(field, index) in fieldsWithSearchDisplay" :key="index">
            <el-form-item
              :label="`${field.name}`"
              v-if="shouldDisplayField(field, index)"
              :class="field.name.length > 4 ? 'multiline-label-item' : ''"
            >
              <!-- 店铺 -->
              <div v-if="field.type === 9" class="custom-store" style="width: 230px; height: 35px">
                <StoreTreeCascader v-model="formInline[field.code]" @change="onSubmit" />
              </div>
              <!-- 人员选择 -->
              <div style="width: 230px" v-if="field.type === 8">
                <SWSelectPeople
                  :isEdit="true"
                  :multiple="false"
                  v-model:modelValue="formInline[`${field.code}List`]"
                  type="operate"
                  :getSearchList="remoteMethodDesigner"
                  @save-select-people="saveSelectPeople(formInline, field.code)"
                />
              </div>
              <!-- 设计图截止时间:-->
              <div style="width: 230px" v-if="field.code === 'designPictureDeadline'">
                <el-date-picker
                  v-if="field.code === 'designPictureDeadline'"
                  v-model="formInline[field.code]"
                  type="daterange"
                  style="width: 210px; height: 35px"
                  :value-format="'YYYY-MM-DD'"
                  range-separator="-"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  :placeholder="field.placeholder || '请选择设计图截止时间'"
                  @change="onSubmit"
                />
              </div>

              <search-time
                ref="timeRef"
                v-if="field.code === 'planListDate'"
                v-model="formInline[field.code]"
                style="width: 230px"
                :placeholder="field.placeholder || '请选择计划上架日期'"
                :layout="'日,周,月'"
                @change="onSubmit"
              />

              <!-- 品类 -->
              <div v-if="field.type === 2 && field.code === 'category'">
                <CategorySelect
                  style="width: 230px"
                  @change="onSubmit"
                  v-model="formInline[field.code]"
                />
              </div>

              <component
                v-if="
                  (field.type !== 8 &&
                    field.type !== 9 &&
                    field.code !== 'planListDate' &&
                    field.code !== 'designPictureDeadline' &&
                    field.code !== 'category') ||
                  field.code === 'productGrade' ||
                  field.code === 'isCore'
                "
                style="width: 230px"
                :is="componentMap[field.type]"
                v-model="formInline[field.code]"
                :placeholder="field.placeholder || detaultPlaceholderMap[field.type]"
                :type="componentTypeMap[field.type]"
                :multiple="field.type === 3"
                value-format="YYYY-MM-DD"
                clearable
                :min="0"
                :options="field.options"
                @keydown.enter="inputEnterSubmit(field)"
                @change="onSubmit"
              >
                <!-- select -->
                <template v-if="field.type === 2 && field.code === 'category'">
                  <el-option
                    v-for="option in categoryList"
                    :key="option.code"
                    :label="option.name"
                    :value="option.code"
                  />
                </template>
                <template v-else-if="field.code === 'productGrade' || field.code === 'isCore'">
                  <el-option
                    v-for="option in getIntDictOptions(DICT_TYPE.NP_PRODUCTGRADE, true)"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </template>
                <template
                  v-else-if="
                    field.code !== 'category' &&
                    (field.type === 2 || field.type === 3) &&
                    field.dictCode
                  "
                >
                  <el-option
                    v-for="option in getDicList(field.dictCode)"
                    :key="option.code"
                    :label="option.shortName"
                    :value="option.code"
                  />
                </template>
                <template
                  v-else-if="
                    field.code !== 'category' &&
                    (field.type === 2 || field.type === 3) &&
                    field.options
                  "
                >
                  <el-option
                    v-for="option in field.options"
                    :key="option.id"
                    :label="option.value"
                    :value="option.code"
                  />
                </template>
              </component>
            </el-form-item>
          </div>
          <!-- 选供专员 -->
          <el-form-item label="选供专员">
            <div style="width: 230px" v-if="isShowSupplyChainChosen">
              <SWSelectPeople
                :isEdit="true"
                :multiple="false"
                v-model:modelValue="formInline.chosenSupplierStaffIdList"
                type="operate"
                :getSearchList="remoteMethodChosenSupplierStaffId"
                @save-select-people="saveSelectPeople(formInline, 'chosenSupplierStaffId')"
              />
            </div>
          </el-form-item>
        </div>

        <div class="flex-row" style="position: absolute; top: 0px; right: 0px">
          <!-- <el-button type="primary" @click="onSubmit">搜索</el-button>
            <el-button type="primary" @click="resetFrom">重置</el-button> -->
          <!-- <el-button style="margin-left: auto" @click="onSubmit" class="commonSearchBtn">
              <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
              搜索
            </el-button> -->
          <el-button @click="resetFrom" class="commonResetBtn" style="margin-left: 0px">
            重置
          </el-button>
          <!-- <el-button v-hasPermi="['oa:newDevelop:addCompetitive']" type="primary" @click="add"> -->
          <!-- <el-icon :size="16" color="#FFFFFF" style="margin-right: 6px; margin-left: -6px">
                <Plus />
              </el-icon> -->
          <!-- 竞品信息
            </el-button> -->
          <!-- <el-button
              v-hasPermi="['oa:newDevelop:uploadDesignImg']"
              type="primary"
              @click="uploadDesignImg"
            >
              上传设计图
            </el-button> -->
        </div>
      </div>
    </el-form>
    <!-- </div> -->

    <!-- <div class="more">
      <div class="mid"> </div>
      <div class="more-text-wapper" @click="handleShowMore">
        <span class="more-text"> {{ showMore ? '收起更多' : '展开更多' }} </span>
        <img src="@/assets/imgs/oa/showClose.png" class="icon" v-if="showMore" />
        <img src="@/assets/imgs/oa/showMore.png" class="icon" v-else />
      </div>
      <div class="mid"> </div>
    </div> -->
    <el-divider class="g-query-divider">
      <el-button link @click="handleShowMore"
        >{{ showMore ? '收起' : '展开' }}
        <el-icon class="el-icon--right">
          <component :is="!showMore ? 'ArrowDown' : 'ArrowUp'" />
        </el-icon>
      </el-button>
    </el-divider>
  </div>
</template>

<script lang="ts" setup>
import { componentMap, componentTypeMap } from '../utils.js'

import SWSelectPeople from './SWSelectPeople.vue'
import { DICT_TYPE, getDictOptions, getIntDictOptions } from '@/utils/dict'
import { cloneDeep } from 'lodash-es'
import SearchTime from '@/components/common/time/search.vue'

import * as CommonApi from '@/api/common'
import * as SystemConstantApi from '@/api/system/systemConstant'

import { useDicList } from '@/views/OA/new/designGallery/hooks.js'
import CategorySelect from '@/views/OA/new/components/selectCategory.vue'

const route = useRoute()

const { dicList } = useDicList()
const listDic = ref([])

watch(dicList, (newVal) => {
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

// 展开收起字段
const shouldDisplayField = (field, index) => {
  return (
    field.searchDisplay &&
    field.state == 1 &&
    ((!showMore.value && index < 3) || (showMore.value && index >= 0))
  )
}

const props = defineProps({
  fields: {
    type: Array as PropType<Field[]>,
    default: () => []
  },
  categoryList: {
    type: Array<any>,
    default: () => []
  },
  isShowSupplyChainChosen: {
    type: Boolean,
    default: false
  }
})

const inputEnterSubmit = (field: any) => {
  const { type } = field
  if (type !== 0 && type !== 1) return
  onSubmit()
}

const formInline = ref({})
const emit = defineEmits(['reset', 'search', 'add', 'uploadDesignImg'])
const timeRef = ref()
const onSubmit = () => {
  let formatValue: any
  if (timeRef.value) {
    formatValue = timeRef.value[0]?.formatValue
  }
  let data: any = cloneDeep({ ...formInline.value })
  if (formatValue?.length) {
    data = { ...data, planListStartDate: formatValue[0], planListEndDate: formatValue[1] }
  } else {
    data = { ...data, planListStartDate: null, planListEndDate: null }
  }
  delete data.planListDate
  emit('search', data)
}

const add = () => {
  emit('add')
}

const uploadDesignImg = () => {
  emit('uploadDesignImg')
}

const resetFrom = () => {
  formInline.value = {}
  emit('reset')
}

const setSearchPlanNameValue = (value) => {
  formInline.value.planName = value
}

const setSearchPlanCodeValue = (value) => {
  formInline.value.planCode = value
}

// 展示的查询字段列表
const filteredFields = ref<any>([]) // 筛选出来的字段列表
const fieldsWithSearchDisplay = computed(() => {
  filteredFields.value = props.fields.filter((field) => field.searchDisplay && field.state == 1)
  console.log('--', filteredFields.value)
  return showMore.value ? filteredFields.value : filteredFields.value.slice(0, 4)
})

const designerOpenIds = ref('')
const memberList = ref([])
// 获取设计师/买手-产研部门
const remoteMethodDesigner = async (value) => {
  if (memberList.value.length > 0) {
    return memberList.value
  }
  if (!designerOpenIds.value) {
    designerOpenIds.value = await SystemConstantApi.getSystemConstantConfigbyCode(
      'NEW_PRODUCT_DEPT_DEVELOP'
    ).catch((e) => {})
  }

  const data = await CommonApi.getPersonByOpenId(designerOpenIds.value).catch(() => {})
  memberList.value = data || []
  return data || []
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

const saveSelectPeople = async (row, fieldCode) => {
  row.editeCode = undefined
  row[`${fieldCode}`] =
    row[`${fieldCode}List`] && row[`${fieldCode}List`].map((item) => item.userId).join(',')
  onSubmit()
}

const planCode = route.query.planCode

if (planCode) {
  formInline.value['planCode'] = planCode
}

defineExpose({ setSearchPlanNameValue, setSearchPlanCodeValue })
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
    margin: 10px 0 10px 0 !important;
  }
}
</style>
