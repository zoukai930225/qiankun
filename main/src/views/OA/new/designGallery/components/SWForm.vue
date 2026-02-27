<!--
 * @Date: 2025-01-03 16:22:21
-->
<template>
  <div style="position: relative;">
    <el-form :inline="true" :model="formInline" label-width="70px">
      <div class="flex-row form-wapper" style="width: calc(100% - 88px)">
        <div style="flex-wrap: wrap; flex: 1" class="flex-row">
          <div v-for="(field, index) in fieldsWithSearchDisplay" :key="index">
            <el-form-item :label="`${field.name}`" label-width="70px" v-if="shouldDisplayField(field, index)"  :class="field.name.length > 4 ? 'multiline-label-item' : ''">
              <!-- 店铺 -->

              <div v-if="field.type === 9" style="width: 230px" class="custom-store">
                <StoreTreeCascader v-model="formInline[field.code]" @change="onSubmit"/>
              </div>
              <!-- 人员选择 -->
              <div style="width: 230px" v-if="field.type === 8">
                <SWSelectPeople :isEdit="true" :multiple="false" v-model:modelValue="formInline[`${field.code}List`]"
                  type="operate" :getSearchList="remoteMethodDesigner"
                  @save-select-people="saveSelectPeople(formInline, field.code)" />
              </div>

              <!-- 计划上架月份-->
              <search-time ref="timeRef" v-if="field.code === 'planListDate'" v-model="formInline[field.code]"
                style="width: 230px" :placeholder="field.placeholder || '请选择计划上架日期'" :layout="'日,周,月'"
                @change="onSubmit" />

              <!-- 品类 -->
              <div v-if="field.type === 2 && field.code === 'category'">
                <CategorySelect style="width: 230px" @change="onSubmit" v-model="formInline[field.code]"/>
              </div>

              <component
                v-if="field.type !== 8 && field.type !== 9 && field.code !== 'planListDate' && field.code !== 'category'"
                style="width: 230px" :is="componentMap[field.type]" v-model="formInline[field.code]"
                :placeholder="field.placeholder || detaultPlaceholderMap[field.type]"
                :type="componentTypeMap[field.type]" :multiple="field.type === 3" value-format="YYYY-MM-DD" clearable
                :options="field.options" @change="onSubmit" @keydown.enter="inputEnterSubmit(field)">
                <template v-if="field.type === 2 && field.code === 'category'">
                  <el-option v-for="option in categoryList" :key="option.code" :label="option.name"
                    :value="option.code" />
                </template>
                <template v-else-if="field.code === 'productGrade' || field.code === 'isCore'">
                  <el-option v-for="option in getIntDictOptions(DICT_TYPE.NP_PRODUCTGRADE, true)" :key="option.value"
                    :label="option.label" :value="option.value" />
                </template>
                <!-- select -->
                <template v-else-if="
                  field.code !== 'category' &&
                  (field.type === 2 || field.type === 3) &&
                  field.options?.length
                ">
                  <el-option v-for="option in field.options" :key="option.id" :label="option.value"
                    :value="option.code" />
                </template>

                <template v-else-if="
                  field.code !== 'category' &&
                  (field.type === 2 || field.type === 3) &&
                  field.dictCode
                ">
                  <el-option v-for="option in getDicList(field.dictCode)" :key="option.code" :label="option.shortName"
                    :value="option.code" />
                </template>
              </component>
            </el-form-item>
          </div>
          <el-form-item label="供应商:">
            <el-select style="width: 230px" v-model="formInline.supplierId" placeholder="请选择供应商" clearable filterable @change="onSubmit">
              <el-option v-for="item in supplierOptions" :key="item.id" :label="item.supplierName" :value="item.id" />
            </el-select>
          </el-form-item>
        </div>
        <div style="position: absolute;top: 0px;right: 0px;">
          <!-- <div class="commonTopFilterWrap-search-container"> -->
            <!-- <el-button @click="onSubmit" class="commonSearchBtn">
              <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
              搜索
            </el-button> -->
            <el-button @click="resetFrom" class="commonResetBtn">
              重置
            </el-button>
            <!-- <el-button @click="add" type="primary">新增</el-button> -->
          <!-- </div> -->
        </div>
        <!-- <div class="flex-row" style="width: 200px">
          <el-button type="info" plain @click="onSubmit">搜索</el-button>
          <el-button @click="resetFrom">重置</el-button>
          <el-button @click="add" type="primary">新增</el-button>
        </div> -->
      </div>
      <el-divider class="g-query-divider">
       <el-button link @click="handleShowMore"
         >{{ showMore ? '收起' : '展开' }}
         <el-icon class="el-icon--right">
           <component :is="!showMore ? 'ArrowDown' : 'ArrowUp'" />
         </el-icon>
       </el-button>
     </el-divider>
    </el-form>

  </div>
</template>

<script lang="ts" setup>
import { getDictOptions, getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { cloneDeep } from 'lodash-es'
import SearchTime from "@/components/common/time/search.vue";
import { useDicList } from '../hooks.js'
import { componentMap, componentTypeMap } from './utils.js'
import SWSelectPeople from '@/views/OA/new/develop/components/SWSelectPeople.vue'
import * as CommonApi from '@/api/common'
import * as SystemConstantApi from '@/api/system/systemConstant'
import { getSupplierList } from '@/api/oa/new/designGallery/index'
const route = useRoute()
const productNumber = route.query.productNumber

import CategorySelect from '@/views/OA/new/components/selectCategory.vue'

const { dicList } = useDicList()
const listDic = ref([])

const supplierOptions = ref<any>([])
const getSupplierListReq = async () => {
  const data = await getSupplierList().catch(() => { })
  if (data && data.length > 0) {
    supplierOptions.value = []
    data.forEach((item) => {
      if (item) {
        supplierOptions.value.push(item)
      }
    })
  }
}
getSupplierListReq()

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
  dictCode: string
}

const showMore = ref(false)

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
  }
})

const formInline = ref<any>({})
const emit = defineEmits(['reset', 'search', 'add'])
const timeRef = ref()
const onSubmit = () => {
  let data: any = cloneDeep({ ...formInline.value });
  let formatValue: any
  if (timeRef.value) {
    formatValue = timeRef.value[0]?.formatValue
  }
  if (formatValue?.length) {
    data = { ...data, planListStartDate: formatValue[0], planListEndDate: formatValue[1] }
  } else {
    data = { ...data, planListStartDate: null, planListEndDate: null }
  }
  delete data.planListDate;
  emit('search', data)
}

const add = () => {
  emit('add')
}

const resetFrom = () => {
  formInline.value = {}
  emit('reset')
}

const resetQuery = () => {
  formInline.value = {}
}

const setSearchProductNumberValue = (value) => {
  formInline.value['productNumber'] = value
}

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
    ).catch((e) => { })
  }

  const data = await CommonApi.getPersonByOpenId(designerOpenIds.value).catch(() => { })
  memberList.value = data || []
  return data || []
}

const saveSelectPeople = async (row, fieldCode) => {
  row.editeCode = undefined
  row[`${fieldCode}`] =
    row[`${fieldCode}List`] && row[`${fieldCode}List`].map((item) => item.userId).join(',')
  onSubmit()
}

const inputEnterSubmit = (field: any) => {
  const { type } = field
  if (type !== 0 && type !== 1) return
  onSubmit()
}

// 展示的查询字段列表
const filteredFields = ref<any>([]) // 筛选出来的字段列表
const fieldsWithSearchDisplay = computed(() => {
  filteredFields.value = props.fields.filter((field) => field.searchDisplay && field.state == 1)
  console.log('--', filteredFields.value)
  return showMore.value ? filteredFields.value : filteredFields.value.slice(0, 4)
})

const handleShowMore = () => {
  showMore.value = !showMore.value
}

defineExpose({ resetQuery, setSearchProductNumberValue })

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
