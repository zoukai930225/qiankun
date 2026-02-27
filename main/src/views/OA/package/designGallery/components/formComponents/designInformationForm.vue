<!--
 * @Date: 2025-02-11 18:11:15
-->
<template>
  <div class="plan-detail">
    <FormTitle title="产研信息" />
    <div class="flex-row form-wapper">
      <div v-for="(field, index) in fields" :key="index">
        <el-form-item
          v-if="field.edit"
          :label="`${field.name}:`"
          label-width="120px"
          :required="field.required == 1 && field.type != 6"
          :prop="field.code"
          :rules="getRules(field)"
          style="width: 410px"
        >
          <component
            v-if="field.type !== 8 && field.code !== 'component' && field.code !== 'color'"
            style="width: 250px"
            :is="componentMap[field.type]"
            v-model="localForm[field.code]"
            :placeholder="field.placeholder"
            :type="componentTypeMap[field.type]"
            :multiple="field.type === 3"
            :value-format="field.type === 5 ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'"
            clearable
            :options="field.options"
          >
            <!-- select -->
            <template v-if="(field.type === 2 || field.type === 3) && field.options?.length">
              <el-option
                v-for="option in field.options"
                :key="option.id"
                :label="option.value"
                :value="option.code"
              />
            </template>

            <template v-if="(field.type === 2 || field.type === 3) && field.dictCode">
              <el-option
                v-for="option in getDicList(field.dictCode)"
                :key="option.code"
                :label="option.shortName"
                :value="option.code"
              />
            </template>

            <!-- 供应商名称下拉处理 -->
            <template
              v-if="(field.type === 2 || field.type === 3) && field.code === 'supplier'"
            >
              <el-option
                v-for="option in supplierOptions"
                :key="option.id"
                :label="option.supplier"
                :value="option.id"
              />
            </template>
          </component>

          <el-select
            v-if="field.code === 'color'"
            v-model="tempColor"
            :placeholder="field.placeholder"
            multiple
            filterable
            clearable
            allow-create
            default-first-option
            :reserve-keyword="false"
            style="width: 250px"
            @change="(val) => handleInputChange(val, field)"
            @blur="handleInputBlur"
            @clear="handleClearColor"
          >
            <el-option
              v-for="option in getDicList(field.dictCode)"
              :key="option.code"
              :label="option.shortName"
              :value="option.code"
            />
          </el-select>

          <div v-if="field.type === 8" style="width: 250px">
            <SWSelectPeople
              :isEdit="true"
              v-model:modelValue="localForm[`${field.code}List`]"
              :getSearchList="remoteMethod"
              @select-people-change="selectPeopleChange(field)"
            />
          </div>
          <!-- 面料成分 -->
          <div v-if="field.code === 'component'" style="min-width: 250px; max-width: 250px">
            <FabricComposition
              :list="(localForm.component && localForm.component.split(',')) || []"
              @delete-click="deleteFabricComposition"
              @add-click="addFabricComposition"
            />
          </div>
        </el-form-item>
      </div>
    </div>
    <div style="width: 100%">
      <el-form-item label="水洗标识" prop="washLabel" label-width="120px">
        <template #label>
          <span>水洗标识</span>
        </template>
        <SWuploadImg v-model:modelValue="localForm.washLabel" />
      </el-form-item>
      <el-form-item label="烫唛照片" prop="tmPicture" label-width="120px">
        <template #label>
          <span>烫唛照片</span>
        </template>
        <SWuploadImg v-model:modelValue="localForm.tmPicture" />
      </el-form-item>
    </div>

    <!-- 面料成分新增 -->
    <FabricCompositionDialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      @confirm="handleConfirm"
    />
  </div>
</template>

<script lang="ts" setup>
import { getDictOptions } from '@/utils/dict'
import * as DictApi from '@/api/system/dict/dict.data'
import SWSelectPeople from '@/views/OA/new/develop/components/SWSelectPeople.vue'
import { defineProps } from 'vue'
import { useDicList } from '@/views/OA/new/designGallery/hooks.js'
import FormTitle from './formTitle.vue'
import SWuploadImg from '@/views/OA/new/designGallery/components/SWuploadImg.vue'

import { componentMap, componentTypeMap } from '@/views/OA/new/designGallery/components/utils.js'

import FabricComposition from '@/views/OA/new/designGallery/components/formComponents/fabricComposition.vue'
import FabricCompositionDialog from '@/views/OA/new/designGallery/components/formComponents/fabricCompositionDialog.vue'

import { getSupplierList } from '@/api/oa/new/designGallery/index'
import * as CommonApi from '@/api/common'
import * as SystemConstantApi from '@/api/system/systemConstant'

const { dicList } = useDicList()
const colorList = ref([])
const tempColor = ref([])
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

// filed.code是颜色
const pCode = ref('')
const handleInputChange = (value, field) => {
  const item = listDic.value.filter((item) => item?.id == field.dictCode)
  pCode.value = item[0].code
  colorList.value = value
  console.log('颜色', colorList.value)
}

const handleClearColor = () => {
  colorList.value = []
  tempColor.value = []
}
const handleInputBlur = async () => {
  // 当前的颜色选项
  const colorOptions = getDictOptions(pCode.value)
  // 创建一个新数组，过滤掉已有颜色
  const filteredColorList = colorList.value.filter(
    (color) => !colorOptions.some((option) => option.code === color)
  )
  console.log('失去焦点--', filteredColorList.length)
  // 如果无新增字段，不执行
  if (filteredColorList.length > 0) {
    // 保存用户自定义颜色
    let params = { PCoce: pCode.value, dictNames: filteredColorList.join(',') }
    await CommonApi.addDictItemBatch(params).catch(() => {})

    // 重新请求字典数据，拿到最新数据
    const newDictList = await DictApi.getDictDataItemList(pCode.value)

    // 将当前颜色选项中是中文的项，替换成对应的 code

    let newArr = tempColor.value.map((colorName) => {
      let foundItem = newDictList.find((item) => item.name === colorName)
      return foundItem ? foundItem.code : colorName
    })
    localForm.value.color = newArr
  } else {
    localForm.value.color = colorList.value
    console.log('失去焦点后', localForm.value.color)
  }
  emit('update:modelValue', localForm.value)
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
  required: number
  edit: boolean
  dictCode: string
}

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  fields: {
    type: Array as PropType<Field[]>,
    default: () => []
  }
})

// 表单校验规则
const formRules = computed(() => {
  const rules: any = {}
  props.fields.forEach((field) => {
    const type = field.code
    rules[type] = [{ required: true, message: `${field.name}不能为空`, trigger: 'blur' }]
  })
  return rules
})

const getRules = (field) => {
  const type = field.code
  return formRules.value[type] || []
}

const emit = defineEmits(['update:modelValue'])

const localForm = ref({ ...props.modelValue })

let isInternalUpdate = false

watch(
  () => props.modelValue,
  (newForm) => {
    if (!isInternalUpdate) {
      localForm.value = { ...newForm }
    }
    isInternalUpdate = false
  },
  { deep: true, immediate: true }
)

watch(
  localForm,
  (newLocalForm) => {
    isInternalUpdate = true

    if (
      newLocalForm.color &&
      newLocalForm.color.length > 0 &&
      typeof newLocalForm.color === 'string'
    ) {
      const colorArr = JSON.parse(newLocalForm.color) || []
      tempColor.value = colorArr
    }

    emit('update:modelValue', newLocalForm)
  },
  { deep: true }
)

const openIds = ref('')
const remoteMethod = async (value) => {
  if (!openIds.value) {
    openIds.value = await SystemConstantApi.getSystemConstantConfigbyCode(
      'NEW_PRODUCT_PERSONNEL'
    ).catch((e) => {})
  }

  const data = await CommonApi.getPersonByOpenId(openIds.value).catch(() => {})
  return data || []
}

// 更新选择的人
const selectPeopleChange = (field: any) => {
  const codeList = localForm.value[`${field.code}List`]
  if (codeList && codeList.length > 0) {
    const userIds = codeList.map((item) => item.userId) || []
    localForm.value[`${field.code}`] = userIds.join(',')
    emit('update:modelValue', localForm.value)
  }
}

const dialogVisible = ref(false)
// 新增面料
const addFabricComposition = () => {
  dialogVisible.value = true
}

// 删除面料
const deleteFabricComposition = (index) => {
  const arr = localForm.value.component.split(',') || []
  let newArr = arr.filter((item, idx) => {
    return idx !== index
  })
  localForm.value.component = newArr.join(',')
}

// 面料新增确认
const handleConfirm = (data) => {
  if (localForm.value.component && data) {
    const arr = localForm.value.component.split(',') || []
    arr.push(data)
    localForm.value.component = arr.join(',')
  } else {
    localForm.value.component = data || ''
  }
}
// 获取供应商名称下拉列表
const supplierOptions = ref([])
const getSupplierOptions = async () => {
  const data = await getSupplierList().catch(() => {})
  console.log('供应商', data)
  supplierOptions.value = data || []
}

onMounted(() => {
  getSupplierOptions()
})
</script>

<style scoped>
.plan-detail {
  width: 100%;
  min-height: 100px;
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-sizing: border-box;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.flex-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

:deep(.el-upload--picture-card) {
  width: 110px;
  height: 110px;
  border: none;
}
</style>
