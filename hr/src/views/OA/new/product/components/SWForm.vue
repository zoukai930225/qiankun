<!--
 * @Date: 2025-01-03 16:22:21
-->
<template>
  <div style="position: relative;">
    <el-form :inline="true" :model="formInline" label-width="70px">
      <div class="flex-row form-wapper" style="width: calc(100% - 88px)">
        <div style="flex-wrap: wrap; flex: 1" class="flex-row">
          <div v-for="(field, index) in fieldsWithSearchDisplay" :key="index">
            <el-form-item :label="`${field.name}`" label-width="70px" :class="field.name.length > 4 ? 'multiline-label-item' : ''">

              <!-- 计划上架月份-->
              <search-time ref="timeRef" v-if="field.code === 'planListDate'" v-model="formInline[field.code]"
                style="width: 230px" :placeholder="field.placeholder || '请选择计划上架日期'" :layout="'日,周,月'"
                @change="onSubmit" />

              <!-- 品类 -->
              <div v-if="field.type === 2 && field.code === 'category'">
                <CategorySelect @change="onSubmit" v-model="formInline[field.code]" style="width: 230px"/>
              </div>
              <component v-if="field.code !== 'planListDate' && field.code !== 'category'" style="width: 230px" :is="componentMap[field.type]"
                v-model="formInline[field.code]" :placeholder="field.placeholder || detaultPlaceholderMap[field.type]"
                :type="componentTypeMap[field.type]" :multiple="field.type === 3" value-format="YYYY-MM-DD" clearable
                :options="field.options" @change="onSubmit" @keydown.enter="inputEnterSubmit(field)">
                <!-- select -->
                <template v-if="field.type === 2 && field.code === 'category'">
                  <el-option v-for="option in categoryList" :key="option.code" :label="option.name"
                    :value="option.code" />
                </template>
                <template v-else-if="field.code === 'productGrade' || field.code === 'isCore'">
                  <el-option v-for="option in getIntDictOptions(DICT_TYPE.NP_PRODUCTGRADE, true)" :key="option.value"
                    :label="option.label" :value="option.value" />
                </template>
                <template v-else-if="field.code !== 'category' && (field.type === 2 || field.type === 3)">
                  <el-option v-for="option in field.options" :key="option.id" :label="option.label"
                    :value="option.code" />
                </template>
              </component>
            </el-form-item>
          </div>
        </div>
        <div style="position: absolute;top: 0; right: 0;">
          <div class="commonTopFilterWrap-search-container">
            <!-- <el-button @click="onSubmit" class="commonSearchBtn">
              <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
              搜索
            </el-button> -->
            <el-button @click="resetFrom" class="commonResetBtn">
              重置
            </el-button>
          </div>
        </div>
      </div>
    </el-form>

    <!-- <div class="more" v-if="filteredFields.length > 4">
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
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { cloneDeep } from 'lodash-es'
import SearchTime from "@/components/common/time/search.vue";
import CategorySelect from '@/views/OA/new/components/selectCategory.vue'

const route = useRoute()
const productNumber = route.query.productNumber

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

// 展示的查询字段列表
const filteredFields = ref<any>([]) // 筛选出来的字段列表
const fieldsWithSearchDisplay = computed(() => {
  filteredFields.value = props.fields.filter((field) => field.searchDisplay && field.state == 1)
  return showMore.value ? filteredFields.value : filteredFields.value.slice(0, 4)
})

const formInline = ref({})
const emit = defineEmits(['reset', 'search', 'add', 'add-more'])
const timeRef = ref()
const onSubmit = () => {
  let formatValue: any
  if (timeRef.value) {
    formatValue = timeRef.value[0]?.formatValue
  }
  let data: any = cloneDeep({ ...formInline.value });
  if (formatValue?.length) {
    data = { ...data, planListStartDate: formatValue[0], planListEndDate: formatValue[1] }
  } else {
    data = { ...data, planListStartDate: null, planListEndDate: null }
  }
  delete data.planListDate;
  emit('search', data)
}

const resetFrom = () => {
  formInline.value = {}
  emit('reset')
}

const setSearchProductNumberValue = (value) => {
  formInline.value['productNumber'] = value
}

if (productNumber) {
  formInline.value['productNumber'] = productNumber
}

const inputEnterSubmit = (field: any) => {
  const { type } = field
  if (type !== 0 && type !== 1) return
  onSubmit()
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

// .custom-store {
//   :deep(){
//     .el-input__wrapper {
//       box-sizing: border-box;
//       height: 35px !important;
//     }
//   }
// }

:deep(.el-select__wrapper) {
  height: 35px !important;
  box-sizing: border-box;
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
