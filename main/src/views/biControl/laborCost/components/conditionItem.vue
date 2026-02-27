<template>
  <div style="width: 100%;">
    <div class="row-center" style="width: 100%;">
      <!-- 渠道选择 --->
      <el-select v-model="scopeName" placeholder="请选择" filterable style="width: 100px;flex-shrink: 0;"
        @change="handleScopeChange" :disabled="viewType === 'see'">
        <el-option v-for="item in scopeNameList" :key="item.value" :label="item.name" :value="item.value" />
      </el-select>
      <!---- 电商标准，选择类目时才有 ----->
      <el-select v-model="nameType" placeholder="请选择" filterable style="width: 150px;flex-shrink: 0;" class="ml10px"
        @change="handleNameTypeChange" v-show="scopeName === scopNames.category"
        :disabled="!scopeName || viewType === 'see'">
        <el-option v-for="item in categoryList" :key="item.value" :label="item.name" :value="item.value" />
      </el-select>
      <!----- 包含、不包含选项 ------>
      <el-select v-model="includeType" placeholder="请选择" filterable style="width: 100px;flex-shrink: 0;" class="ml10px"
        :disabled="isIncludeTypeDisabled">
        <el-option v-for="item in includeList" :key="item.value" :label="item.name" :value="item.value" />
      </el-select>
      <!----- 渠道多选 ------>
      <el-select class="ml10px" v-show="includeType && scopeName === scopNames.channel" :style="selectStyle"
        :class="{ 'show-error': showError && channelValue?.length === 0 }" v-model="channelValue" multiple collapse-tags
        clearable filterable @change="handleCahnnelChange" :disabled="viewType === 'see'">
        <el-option v-for="item in channelList" :key="item.value" :label="item.name" :value="item.value" /></el-select>
      <!----- 店铺多选 ------>
      <div :style="selectStyle" v-show="includeType && scopeName === scopNames.store" class="ml10px self-store"
        :class="{ 'show-error': showError && storeValue?.length === 0 }">
        <store-cascader v-model="storeValue" :show-all="false" @change="handleStoreChange"
          :cascaderProps="{ multiple: true, expandTrigger: 'click' }" :otherProps="{
            disabled: viewType === 'see',
          }" />
      </div>
      <!--- 类目 --->
      <el-input disabled :placeholder="getCategoryPlaceholder"
        v-show="(includeType && scopeName === scopNames.category) || !scopeName || !includeType" class="ml10px"
        :class="{ 'show-error': showError && !(scopeName === scopNames.category && includeType) }" />
      <!--- 部分货品编码 --->
      <el-input disabled placeholder="部分货品编码" v-show="includeType && scopeName === scopNames.product" class="ml10px" />
      <!---- 仓库 ---->
      <el-select class="ml10px" v-show="includeType && scopeName === scopNames.warehouse" :style="selectStyle"
        :class="{ 'show-error': showError && wareHouseValue?.length === 0 }" v-model="wareHouseValue" multiple
        collapse-tags clearable filterable @change="handleWareHouseChange" :disabled="viewType === 'see'">
        <el-option v-for="item in warehouseList" :key="item.code" :label="item.name" :value="item.name" /></el-select>
      <el-icon class="ml10px" style="cursor: pointer;" color="#999999" v-show="viewType !== 'see'"
        @click="handleDelete">
        <Delete />
      </el-icon>
    </div>
    <!------------ 类目选择 -------------->
    <div class="mt15px" v-show="scopeName === scopNames.category && includeType"
      :class="{ 'show-error': showError && (categroy?.length === 0 && standardCategory?.length === 0 && standardOldCategory?.length === 0) }">
      <!--- 电商类目 ---->
      <categoryCard @change-value="handleCategoryChange" v-model="categroy" ref="categoryCardRef"
        v-show="nameType == categoryNames.dianshang" />
      <!--- 标准类目 ---->
      <div v-show="nameType == categoryNames.standard" style="width: 100%;">
        <div style="color: #888;font-size: 14px;" class="mb10px">已选类目（{{ standardCategory?.length ?? 0 }}个）</div>
        <satndCategoryCascade ref="standardCategoryRef" @change="handleStandardCategoryChange" />
      </div>
      <!--- 旧标准类目 ---->
      <div v-show="nameType == categoryNames.oldstandard" style="width: 100%;">
        <div style="color: #888;font-size: 14px;" class="mb10px">已选类目（{{ standardOldCategory?.length ?? 0 }}个）</div>
        <standOldCategoryCascade ref="standardOldCategoryRef" @change="handleOldStandardCategoryChange" />
      </div>
    </div>
    <div class="mt15px product-box" v-show="scopeName === scopNames.product && includeType"
      :class="{ 'show-error': showError && !productNums }">
      <div style="color: #999;" class="mb10px">货品编码（{{ productNums }}/100）</div>
      <s-text-area v-model="productCode" :autosize="{ minRows: 4, maxRows: 6 }" style="width: 100%" show-word-limit
        @change="productCodeChange" :disabled="viewType === 'see'" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { scopNames, scopeNameList, includeList, categoryList, channelList, ConditionDTO, categoryNames } from '../selfconfig'
import categoryCard from './categoryCard.vue';
import STextArea from "@/components/common/input/s-textarea.vue";
import satndCategoryCascade from './satndCategoryCascade.vue';
import standOldCategoryCascade from './standOldCategoryCascade.vue';
import { cloneDeep } from 'lodash-es'
const { warehouseList, categoryListData } = inject(`LaborcostForm`) as any;
//总类型选择
const scopeName = defineModel<any>("scopeName")
//电商标准类型
const nameType = defineModel<any>("nameType")
const { viewType } = inject(`LaborcostDetails`) as any;
//是否包含
const includeType = defineModel<any>("includeType")
const props = defineProps({
  originValue: {
    type: Array as PropType<ConditionDTO[]>,
    required: true
  },
  originBackup: {
    type: [Object, null] as PropType<any>,
    default: null
  },
})
const showError = inject('showError')
const emit = defineEmits<{
  (e: 'change-value', value: ConditionDTO[], backup?: any): void,
  (e: 'name-value', value: string): void,
  (e: 'delete'): void,
}>()
//切换最前面类别时，清空所有条件
const handleScopeChange = (val: string) => {
  nameType.value = ""
  includeType.value = ""
  channelValue.value = [];
  storeValue.value = [];
  wareHouseValue.value = []
  productCode.value = ''
  categroy.value = []
  categoryVal[categoryNames.dianshang] = null
  categoryVal[categoryNames.standard] = null
  categoryVal[categoryNames.oldstandard] = null
  categoryEmitVal[categoryNames.dianshang] = null
  categoryEmitVal[categoryNames.standard] = null
  categoryEmitVal[categoryNames.oldstandard] = null
  standardCategory.value = []
  standardOldCategory.value = []
  emit('change-value', [], null)
  emit('name-value', val)
}

const isIncludeTypeDisabled = computed(() => {
  if (scopeName.value === scopNames.category) {
    return !nameType.value || viewType.value === 'see'
  }
  return !scopeName.value || viewType.value === 'see'
})

const selectStyle = computed(() => {
  if (scopeName.value === scopNames.category) {
    return 'width: calc(100% - 404px)'
  }
  return 'width: calc(100% - 244px)'
})

//渠道选择
const channelValue = ref<string[]>([]);
const handleCahnnelChange = (val: string[]) => {
  const attrs: ConditionDTO[] = [];
  val?.forEach((item) => {
    attrs.push({
      value: item
    })
  })
  emit('change-value', attrs)
}

//店铺选择
const storeValue = ref<string[]>([]);
const handleStoreChange = (val: string[]) => {
  const attrs: ConditionDTO[] = [];
  val?.forEach((item) => {
    if (Array.isArray(item) && item?.length > 1) {
      attrs.push({
        value: item[1]
      })
    }
  })
  emit('change-value', attrs)
}
//获取类目提示
const getCategoryPlaceholder = computed(() => {
  if (scopeName.value === scopNames.category) {
    return categoryList.findIndex(item => item.value === nameType.value) > -1 ? `部分${categoryList.find(item => item.value === nameType.value)?.name}` : ``
  } return ''
})

const wareHouseValue = ref<string[]>([]);
const handleWareHouseChange = (val: string[]) => {
  const attrs: ConditionDTO[] = [];
  val?.forEach((item) => {
    attrs.push({
      value: item
    })
  })
  emit('change-value', attrs)
}

const categroy = ref<any[]>([]);
const categoryCardRef = ref<any>();
const categoryVal: any = {
  [categoryNames.dianshang]: null,
  [categoryNames.oldstandard]: null,
  [categoryNames.standard]: null,
}

const categoryEmitVal: any = {
  [categoryNames.dianshang]: null,
  [categoryNames.oldstandard]: null,
  [categoryNames.standard]: null,
}
const standardCategoryRef = ref<any>();
const standardCategory = ref<any[]>([]);
//电商类目选择
const handleCategoryChange = (val: any[], backup: any, orginVal: any[]) => {
  let allValue: any = {}
  Object.keys(backup).forEach(key => {
    const currentChannelName = categoryListData.value.find(each => each.channelCode === key)?.channelName
    allValue[key] = {
      value: orginVal.filter(item => item[0] === currentChannelName),
      backup: backup[key]
    }
  })
  categoryVal[categoryNames.dianshang] = cloneDeep(allValue)
  categoryEmitVal[categoryNames.dianshang] = {
    val, backup
  }
  emit('change-value', val, backup)
}
//标准类目变化
const handleStandardCategoryChange = (val: any[], backup: any, all: any) => {
  categoryVal[categoryNames.standard] = cloneDeep(all)
  categoryEmitVal[categoryNames.standard] = {
    val, backup
  }
  const data: any[] = []
  val.map(item => {
    if (item?.length > 3) {
      data.push({
        primaryCategory: item[0],
        secondaryCategory: item[1],
        leafCategory: item[2],
        fourthCategory: item[3],
        categoryLevel: 4
      })
    } else if (item?.length > 2) {
      data.push({
        primaryCategory: item[0],
        secondaryCategory: item[1],
        leafCategory: item[2],
        categoryLevel: 3
      })
    } else if (item?.length > 1) {
      data.push({
        primaryCategory: item[0],
        secondaryCategory: item[1],
        categoryLevel: 2
      })
    } else if (item?.length > 0) {
      data.push({
        primaryCategory: item[0],
        categoryLevel: 1
      })
    }
  })
  standardCategory.value = cloneDeep(val)
  emit('change-value', data, backup)
}
const standardOldCategoryRef = ref<any>();
const standardOldCategory = ref<any[]>([]);
//旧标准类目变化
const handleOldStandardCategoryChange = (val: any[], backup: any, all: any) => {
  categoryVal[categoryNames.oldstandard] = cloneDeep(all)
  categoryEmitVal[categoryNames.oldstandard] = {
    val, backup
  }
  const data: any[] = []
  val.map(item => {
    if (item?.length > 3) {
      data.push({
        primaryCategory: item[0],
        secondaryCategory: item[1],
        leafCategory: item[2],
        fourthCategory: item[3],
        categoryLevel: 4
      })
    } else if (item?.length > 2) {
      data.push({
        primaryCategory: item[0],
        secondaryCategory: item[1],
        leafCategory: item[2],
        categoryLevel: 3
      })
    } else if (item?.length > 1) {
      data.push({
        primaryCategory: item[0],
        secondaryCategory: item[1],
        categoryLevel: 2
      })
    } else if (item?.length > 0) {
      data.push({
        primaryCategory: item[0],
        categoryLevel: 1
      })
    }
  })
  standardOldCategory.value = cloneDeep(val)
  emit('change-value', data, backup)
}
const handleNameTypeChange = (val: string) => {
  switch (val) {
    case categoryNames.dianshang:
      if (!categoryVal[categoryNames.dianshang]) {
        emit('change-value', [], null)
        return
      }
      if (categoryEmitVal[categoryNames.dianshang]) {
        emit('change-value', categoryEmitVal[categoryNames.dianshang].val, categoryEmitVal[categoryNames.dianshang].backup)
      }
      nextTick(() => {
        categoryCardRef.value?.setOriginValue(categoryVal[categoryNames.dianshang])
      })
      break
    case categoryNames.standard:
      if (!categoryVal[categoryNames.standard]) {
        emit('change-value', [], null)
        return
      }
      if (categoryEmitVal[categoryNames.standard]) {
        emit('change-value', categoryEmitVal[categoryNames.standard].val, categoryEmitVal[categoryNames.standard].backup)
      }
      standardCategory.value = cloneDeep(categoryEmitVal[categoryNames.standard].val)
      nextTick(() => {
        standardCategoryRef.value?.setOriginValue(categoryVal[categoryNames.standard])
      })
      break
    case categoryNames.oldstandard:
      if (!categoryVal[categoryNames.oldstandard]) {
        emit('change-value', [], null)
        return
      }
      if (categoryEmitVal[categoryNames.oldstandard]) {
        emit('change-value', categoryEmitVal[categoryNames.oldstandard].val, categoryEmitVal[categoryNames.oldstandard].backup)
      }
      standardOldCategory.value = cloneDeep(categoryEmitVal[categoryNames.oldstandard].val)
      nextTick(() => {
        standardOldCategoryRef.value?.setOriginValue(categoryVal[categoryNames.oldstandard])
      })
      break
  }
}

const handleDelete = () => {
  emit('delete')
}
//货品编码
const productCode = ref<string>("");
const productCodeChange = (val: string) => {
  const attrs: ConditionDTO[] = [];
  val.split('\n').forEach(item => {
    if (item) {
      attrs.push({
        value: item
      })
    }
  })
  emit('change-value', attrs)
}


const productNums = computed(() => productCode.value.split('\n').filter(item => !!item).length)
watch(() => props.originValue, (val: ConditionDTO[]) => {
  switch (scopeName.value) {
    case scopNames.channel:
      channelValue.value = val.map(item => item.value)
      break
    case scopNames.store:
      storeValue.value = val.map(item => item.value)
      break
    case scopNames.category:
      if (nameType.value === categoryNames.dianshang) {
        let allValue: any = {}
        let data: any = []
        val.map(item => {
          if (item.fourthCategory) {
            data.push([categoryListData.value.find(each => each.channelCode === item.value)?.channelName, item.primaryCategory, item.secondaryCategory, item.leafCategory, item.fourthCategory])
          } else if (item.leafCategory) {
            data.push([categoryListData.value.find(each => each.channelCode === item.value)?.channelName, item.primaryCategory, item.secondaryCategory, item.leafCategory])
          } else if (item.secondaryCategory) {
            data.push([categoryListData.value.find(each => each.channelCode === item.value)?.channelName, item.primaryCategory, item.secondaryCategory])
          } else if (item.primaryCategory) {
            data.push([categoryListData.value.find(each => each.channelCode === item.value)?.channelName, item.primaryCategory])
          }
        })
        categroy.value = data
        if (props.originBackup) {
          const backValue = JSON.parse(props.originBackup)
          Object.keys(backValue).forEach(key => {
            const currentChannelName = categoryListData.value.find(each => each.channelCode === key)?.channelName
            allValue[key] = {
              value: data.filter(item => item[0] === currentChannelName),
              backup: backValue[key]
            }
          })
          categoryVal[categoryNames.dianshang] = cloneDeep(allValue)
          categoryEmitVal[categoryNames.dianshang] = {
            val, backup: JSON.parse(props.originBackup)
          }
          nextTick(() => {
            categoryCardRef.value?.setOriginValue(allValue)
          })
        }
      } else if (nameType.value === categoryNames.standard) {
        let allValue: any = {}
        let data: any = []
        val.map(item => {
          if (item.fourthCategory) {
            data.push([item.primaryCategory, item.secondaryCategory, item.leafCategory, item.fourthCategory])
          } else if (item.leafCategory) {
            data.push([item.primaryCategory, item.secondaryCategory, item.leafCategory])
          } else if (item.secondaryCategory) {
            data.push([item.primaryCategory, item.secondaryCategory])
          } else if (item.primaryCategory) {
            data.push([item.primaryCategory])
          }
        })
        standardCategory.value = cloneDeep(data)
        allValue = {
          value: data,
          backup: props.originBackup ? JSON.parse(props.originBackup) : []
        }
        categoryVal[categoryNames.standard] = cloneDeep(allValue)
        categoryEmitVal[categoryNames.standard] = {
          val, backup: props.originBackup ? JSON.parse(props.originBackup) : []
        }
        nextTick(() => {
          standardCategoryRef.value?.setOriginValue(allValue)
        })

      } else {
        let allValue: any = {}
        let data: any = []
        val.map(item => {
          if (item.fourthCategory) {
            data.push([item.primaryCategory, item.secondaryCategory, item.leafCategory, item.fourthCategory])
          } else if (item.leafCategory) {
            data.push([item.primaryCategory, item.secondaryCategory, item.leafCategory])
          } else if (item.secondaryCategory) {
            data.push([item.primaryCategory, item.secondaryCategory])
          } else if (item.primaryCategory) {
            data.push([item.primaryCategory])
          }
        })
        standardOldCategory.value = cloneDeep(data)
        allValue = {
          value: data,
          backup: props.originBackup ? JSON.parse(props.originBackup) : []
        }
        categoryVal[categoryNames.oldstandard] = cloneDeep(allValue)
        categoryEmitVal[categoryNames.oldstandard] = {
          val, backup: props.originBackup ? JSON.parse(props.originBackup) : []
        }
        nextTick(() => {
          standardOldCategoryRef.value?.setOriginValue(allValue)
        })
      }
      break
    case scopNames.product:
      productCode.value = val.map(item => item.value).join('\n')
      break
    case scopNames.warehouse:
      wareHouseValue.value = val.map(item => item.value)
      break
  }
}, { once: true, immediate: true })

</script>
<style lang="scss" scoped>
.self-store {
  :deep(.el-tag.is-closable) {
    max-width: 100% !important;
  }
}

.product-box {
  background-color: rgb(248, 248, 248);
  padding: 15px;
  font-size: 14px;
}

.show-error {
  & {
    --el-disabled-border-color: red;
    --el-border-color: red;
  }

  :deep(.el-input__wrapper) {
    border: 1px solid red;
  }
}
</style>