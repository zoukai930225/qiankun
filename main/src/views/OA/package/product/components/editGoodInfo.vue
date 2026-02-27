<template>
  <div>
    <div class="form-wapper">
      <div class="form-wapper-header" v-if="!onShow">
        <div class="form-wapper-header-line"></div>
        <div class="form-wapper-header-title">基本信息</div>
      </div>
      <div class="form-wapper-form">
        <EditGoodCustomInfo ref="editGoodCustomInfoRef" :onShow="onShow" :forbidEdit="forbidEdit" :formWidth="formWidth"
          :formItemWidth="formItemWidth" :localForm="localForm" :categoryList="categoryList" />
        <el-form ref="formRef" :model="localForm" style="display: flex; flex-wrap: wrap">
          <div v-for="(field, index) in fields" :key="index">
            <el-form-item v-if="
              field.edit &&
              field.code !== 'color' &&
              field.code !== 'sizeChart' &&
              field.code !== 'component' &&
              field.code !== 'productCode'
            " :label="`${field.name}`" label-width="70px" :label-position="right"
              :required="(field.required == 1 && field.type != 6) || field.code === 'size'" :prop="field.code"
              :rules="getRules(field)" :style="{ width: formWidth }">
              <component v-if="
                field.type !== 8 &&
                field.code !== 'component' &&
                field.code !== 'componentSupply' &&
                field.code !== 'color' &&
                field.code !== 'sizeChart' &&
                !(onShow && componentMap[field.type] == 'el-select' && field.type === 3)
              " :style="{ width: formItemWidth }" :is="componentMap[field.type]" v-model="localForm[field.code]"
                :placeholder="handlePlaceholder(field.placeholder)" :type="componentTypeMap[field.type]"
                :multiple="field.type === 3" :value-format="field.type === 5 ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'"
                clearable filterable :options="field.options" :disabled="forbidEdit">
                <!-- select -->
                <template v-if="(field.type === 2 || field.type === 3) && field.options?.length">
                  <el-option v-for="option in field.options" :key="option.id" :label="option.value"
                    :value="option.code" />
                </template>

                <template v-if="(field.type === 2 || field.type === 3) && field.dictCode">
                  <el-option v-for="option in getDicList(field.dictCode)" :key="option.code" :label="option.shortName"
                    :value="option.code" />
                </template>

                <!-- 供应商名称下拉处理 -->
                <template v-if="(field.type === 2 || field.type === 3) && field.code === 'supplier'">
                  <el-option v-for="option in supplierOptions" :key="option.id" :label="option.supplierName"
                    :value="option.id" />
                </template>
              </component>

              <div v-if="onShow && componentMap[field.type] == 'el-select' && field.type === 3" class="selectView text1"
                :style="{ width: formWidth }">
                {{ showFunctionLables(localForm[field.code], getFieldOptionsList(field)) }}
              </div>

              <s-text-area v-if="field.code === 'componentSupply'" :disabled="forbidEdit"
                v-model="localForm.componentSupply" :placeholder="handlePlaceholder(field.placeholder || '请输入面料补充')"
                class="dialogFormItemWidth" style="width: 100%" :autosize="{ minRows: 4, maxRows: 4 }" />

              <div v-if="field.type === 8" :style="{ width: formItemWidth }">
                <SWSelectPeople :isEdit="true" v-model:modelValue="localForm[`${field.code}List`]"
                  :getSearchList="remoteMethod" @select-people-change="selectPeopleChange(field)" />
              </div>
            </el-form-item>
          </div>

          <div style="width: 100%">
            <!-- 面料成分 -->
            <el-form-item v-if="!isEditInfo" label="面料成分" prop="component" label-width="70px">
              <template #label>
                <span style="color: #f56c6c"> *</span>
                <span> 面料成分</span>
              </template>
              <FabricComposition :list="(localForm.component && localForm.component.split(',')) || []"
                :forbidEdit="forbidEdit" @delete-click="deleteFabricComposition" @add-click="addFabricComposition" />
            </el-form-item>
            <el-form-item v-if="!isEditInfo" label="尺码表" prop="sizeChart" label-width="70px">
              <template #label>
                <span>尺码表</span>
              </template>
              <SWuploadImg :uploadDisabled="forbidEdit" v-model:modelValue="localForm.sizeChart" />
            </el-form-item>
            <el-form-item v-if="!isEditInfo" label="水洗标识" prop="washLabel" label-width="70px">
              <template #label>
                <span>水洗标识</span>
              </template>
              <SWuploadImg :uploadDisabled="forbidEdit" v-model:modelValue="localForm.washLabel" />
            </el-form-item>
            <el-form-item v-if="!isEditInfo" label="烫唛照片" prop="tmPicture" label-width="70px">
              <template #label>
                <span>烫唛照片</span>
              </template>
              <SWuploadImg :uploadDisabled="forbidEdit" v-model:modelValue="localForm.tmPicture" />
            </el-form-item>
            <el-form-item label="货品编码" prop="productCode" label-width="70px" :required="true"
              :rules="[{ required: true, message: '请输入货品编码', trigger: 'blur' }]">
              <div :style="{ width: `${formRemarkWidth}` }" class="row-center">
                <el-input :disabled="forbidEdit" v-model="localForm.productCode" placeholder="请输入货品编码"
                  class="dialogFormItemWidth" :style="{ width: formItemWidth }" />
                <div v-if="
                  (designInfo && Number(designInfo.planType || '') === 2) ||
                  Number(designInfo.planType || '') === 3
                " style="padding-left: 10px; color: red; font-weight: 500">{{
                  getDictLabel(DICT_TYPE.NP_ENTERPRISE_PLANTYPE, designInfo.planType || '')
                }}品，原产品编码为：{{ localForm.oldGoodsNo }}</div>
              </div>
            </el-form-item>
            <el-form-item label="卖点备注" prop="salePointRemark" label-width="70px">
              <div :style="{ width: `${formRemarkWidth}` }">
                <s-text-area :disabled="forbidEdit" v-model="localForm.salePointRemark"
                  :placeholder="handlePlaceholder('卖点备注')" class="dialogFormItemWidth" style="width: 100%"
                  :autosize="{ minRows: 6, maxRows: 8 }" />
              </div>
            </el-form-item>
            <el-form-item label="颜色" prop="colorArr" label-width="70px" :required="true"
              :rules="[{ required: true, message: '请添加颜色', trigger: 'change' }]"
              v-if="(onShow && localForm.colorArr && localForm.colorArr.length > 0) || !onShow">
              <el-button v-if="!onShow" type="primary" :disabled="forbidEdit" @click="addColorDialog">
                <Icon class="mr-5px" icon="ep:plus" />
                添加颜色
              </el-button>
            </el-form-item>
            <div v-else style="height: 30px"></div>
            <div style="margin-left: 70px" :style="{
              marginTop: onShow ? '-40px' : '0px'
            }">
              <EditNodeColor :colorList="localForm.colorArr" :forbidEdit="forbidEdit" @delete-color="deleteColor" />
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <!-- 面料成分新增 -->
    <FabricCompositionDialog v-if="dialogVisible" v-model="dialogVisible" @confirm="handleConfirm" />
    <!-- 新增颜色弹框-->
    <AddGoodColorDialog v-if="colorDialogVisible" v-model="colorDialogVisible"
      @add-color-success="handleAddColorConfirm" />
  </div>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { useDictStoreWithOut } from '@/store/modules/dict'
import { getDictOptions, getDictLabel, DICT_TYPE } from '@/utils/dict'

import { useDicList } from '@/views/OA/new/designGallery/hooks.js'
import SWSelectPeople from '@/views/OA/new/develop/components/SWSelectPeople.vue'
import { defineProps } from 'vue'

import SWuploadImg from '@/views/OA/new/designGallery/components/SWuploadImg.vue'

import { componentMap, componentTypeMap } from '@/views/OA/new/designGallery/components/utils.js'

import FabricComposition from '@/views/OA/new/designGallery/components/formComponents/fabricComposition.vue'
import FabricCompositionDialog from '@/views/OA/new/designGallery/components/formComponents/fabricCompositionDialog.vue'
import AddGoodColorDialog from './addGoodColorDialog.vue'
import EditGoodCustomInfo from './editGoodCustomInfo.vue'
import EditNodeColor from './editNodeColor.vue'

import * as CommonApi from '@/api/common'
import { getBasicAttribute } from '@/api/oa/new/plan/index'
import * as SystemConstantApi from '@/api/system/systemConstant'

import {
  getDesignDetailById,
  getSupplierList,
  queryDesignProductColor,
  saveDesign,
  updateDesign
} from '@/api/oa/new/designGallery/index'
import { handleJSONParse } from '@/views/OA/new/product/utils.js'

const dictStore = useDictStoreWithOut()

const message = useMessage() // 消息弹窗

const props = defineProps({
  onShow: {
    type: Boolean,
    default: false
  },
  isEditInfo: {
    type: Boolean,
    default: false
  },
  forbidEdit: {
    type: Boolean,
    default: false
  },
  bgWidth: {
    type: Number,
    default: 0
  },
  designInfo: {
    type: Object,
    default() {
      return {}
    }
  }
})

const formRef = ref()
// 表单校验规则
const formRules = () => {
  const rules: any = {}
  fields.value.forEach((field) => {
    if (field.required || field.code === 'size') {
      const type = field.code
      let message = `${field.name}不能为空`
      if (field.code === 'size') {
        message = '请选择尺码'
      }
      rules[type] = [{ required: true, message: message, trigger: 'change' }]
    }
  })
  return rules
}

const getRules = (field) => {
  // size
  if (field.required || field.code === 'size') {
    const type = field.code
    return formRules()[type] || []
  }
  return []
}

const formWidth = computed(() => {
  if (props.onShow) {
    return `${(props.bgWidth - 230.0 - 30.0) / 3.0}px`
  } else {
    return '292px'
  }
})

const formItemWidth = computed(() => {
  if (props.onShow) {
    return `${(props.bgWidth - 230.0) / 3.0 - 90}px`
  } else {
    return ' 206px'
  }
})
const formRemarkWidth = computed(() => {
  if (props.onShow) {
    return `${props.bgWidth - 360.0}px`
  } else {
    return ' 792px'
  }
})

const handlePlaceholder = (placeholder: string) => {
  if (props.onShow) {
    return ''
  }
  return placeholder
}
const editGoodCustomInfoRef = ref()

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

const emit = defineEmits(['update:modelValue', 'confirm', 'close'])
const localForm = ref({})
const nodeData = ref({})

// 打开
const open = async (data: any) => {
  formRef.value?.clearValidate()
  if (data) {
    nodeData.value = { ...data }
    initConfigData()
    //商品资料填写
    const res = await getDesignDetailById(data.npDesignPictureGodownId) //回显详情
    if (res) {
      localForm.value = { ...res }
      if (localForm.value.color && localForm.value.color.length > 0) {
        localForm.value.color = handleJSONParse(localForm.value.color) || []
        // tempColor.value = colorArr
        let tempArr = []
        localForm.value.color.forEach((item) => {
          if (item.indexOf('_') === -1) {
            const arr = item.split(' ')
            arr.forEach((item1) => {
              if (item1) {
                tempArr.push(item1)
              }
            })
          } else {
            tempArr.push(item)
          }
        })
        localForm.value.color = [...tempArr]
        let colorArr = []
        localForm.value.color &&
          localForm.value.color.forEach((item) => {
            let arr = item.split('_')
            colorArr.push({
              name: arr && arr.length > 0 ? arr[0] : '',
              url: arr && arr.length > 1 ? arr[1] : ''
            })
          })
        localForm.value.colorArr = colorArr || []
      }
      if (localForm.value.braGn && localForm.value.braGn.length > 0) {
        localForm.value.braGn = handleJSONParse(localForm.value.braGn) || []
      }
      if (
        localForm.value.braGn &&
        !Array.isArray(localForm.value.braGn) &&
        localForm.value.braGn.length > 0
      ) {
        localForm.value.braGn = [localForm.value.braGn]
      }

      if (localForm.value.underwearGn && localForm.value.underwearGn.length > 0) {
        localForm.value.underwearGn = handleJSONParse(localForm.value.underwearGn) || []
      }
      if (
        localForm.value.underwearGn &&
        !Array.isArray(localForm.value.underwearGn) &&
        localForm.value.underwearGn.length > 0
      ) {
        localForm.value.underwearGn = [localForm.value.underwearGn]
      }

      // if (localForm.value.color) {
      //   const colorArr = JSON.parse(localForm.value.color) || []
      //   tempColor.value = colorArr
      // }
      if (localForm.value.size) {
        localForm.value.size = handleJSONParse(localForm.value.size) || []
      }

      if (localForm.value.applyGender) {
        localForm.value.applyGender = handleJSONParse(localForm.value.applyGender) || []
      }

      if (localForm.value.useTarget) {
        localForm.value.useTarget = handleJSONParse(localForm.value.useTarget) || []
      }

      if (localForm.value.useSeason) {
        localForm.value.useSeason = handleJSONParse(localForm.value.useSeason) || []
      }

      localForm.value.sizeChart = res.sizeChart
        ? res.sizeChart.split(',').map((item) => {
          return {
            url: item
          }
        })
        : [] //水洗标识

      // ;(localForm.value.size = localForm.value.size ? JSON.parse(localForm.value.size) : []), //尺寸
      localForm.value.washLabel = res.washLabel
        ? res.washLabel.split(',').map((item) => {
          return {
            url: item
          }
        })
        : [] //水洗标识

      localForm.value.tmPicture = res.tmPicture
        ? res.tmPicture.split(',').map((item) => {
          return {
            url: item
          }
        })
        : [] //烫唛照片

      editGoodCustomInfoRef.value?.updateLocalForm({ ...localForm.value })
    }
  } else {
    initConfigData()
  }
}
const initConfigData = async () => {
  await queryColorList()
  await getConfig()
  await getSupplierOptions()
  await getCategoryList()
}

const showFunctionLables = (labels, dictList) => {
  let arr = []
  dictList &&
    Array.isArray(dictList) &&
    dictList.forEach((item) => {
      if (labels && Array.isArray(labels) && labels.includes(item.code)) {
        arr.push(item.label)
      }
    })
  return arr.join(',') || '--'
}

const getFieldOptionsList = (field) => {
  if ((field.type === 2 || field.type === 3) && field.options?.length) {
    return field.options || []
  } else if ((field.type === 2 || field.type === 3) && field.dictCode) {
    return getDicList(field.dictCode)
  } else if ((field.type === 2 || field.type === 3) && field.code === 'supplier') {
    return supplierOptions.value
  }
  return []
}

// 颜色字典
const colorDict = ref({})
/**
 * 获取颜色列表
 */
const queryColorList = async () => {
  const data = await queryDesignProductColor().catch(() => { })
  colorDict.value = data || {}
  console.log('获取颜色列表', data)
}

const openIds = ref('')
const remoteMethod = async (value) => {
  if (!openIds.value) {
    openIds.value = await SystemConstantApi.getSystemConstantConfigbyCode(
      'NEW_PRODUCT_PERSONNEL'
    ).catch((e) => { })
  }

  const data = await CommonApi.getPersonByOpenId(openIds.value).catch(() => { })
  return data || []
}

// 更新选择的人
const selectPeopleChange = (field: any) => {
  const codeList = localForm.value[`${field.code}List`]
  if (codeList && codeList.length > 0) {
    const userIds = codeList.map((item) => item.userId) || []
    localForm.value[`${field.code}`] = userIds.join(',')
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

const colorDialogVisible = ref(false)

// 新增颜色弹框
const addColorDialog = () => {
  colorDialogVisible.value = true
}

// 颜色新增确认

const handleAddColorConfirm = (color) => {
  let colorArr = color && color.split('_')
  let colorInfo = { name: colorArr[0], url: colorArr[1] }
  let isExist = false
  if (!localForm.value.colorArr) {
    localForm.value.colorArr = []
  }
  localForm.value.colorArr.forEach((element) => {
    if (element.name === colorInfo.name) {
      element.url = colorInfo.url
      isExist = true
    }
  })
  if (!isExist) {
    localForm.value.colorArr.push(colorInfo)
  }
}

const deleteColor = (index) => {
  if (localForm.value.colorArr && index < localForm.value.colorArr.length) {
    localForm.value.colorArr.splice(index, 1)
  }
}

// 获取供应商名称下拉列表
const supplierOptions = ref([])
const getSupplierOptions = async () => {
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

const categoryList = ref<any[]>([])
const getCategoryList = async () => {
  const data = await CommonApi.getNPCategoryNameList().catch(() => { })
  if (data) {
    categoryList.value = data || []
  }
}

const productinformationFillingConfirm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  let washLabel = undefined
  if (localForm.value?.washLabel && typeof localForm.value?.washLabel === 'string') {
    washLabel = localForm.value?.washLabel || ''
  } else {
    // @ts-ignore
    if (localForm.value?.washLabel) {
      // @ts-ignore
      washLabel = localForm.value.washLabel
        // @ts-ignore
        .map((item) => {
          return item?.response?.data?.ossPath || item.url
        })
        .join(',')
    }
  }

  let sizeChart = undefined
  if (localForm.value?.sizeChart && typeof localForm.value?.sizeChart === 'string') {
    sizeChart = localForm.value?.sizeChart || ''
  } else {
    // @ts-ignore
    if (localForm.value?.sizeChart) {
      // @ts-ignore
      sizeChart = localForm.value.sizeChart
        // @ts-ignore
        .map((item) => {
          return item?.response?.data?.ossPath || item.url
        })
        .join(',')
    }
  }

  let tmPicture = undefined
  if (localForm.value?.tmPicture && typeof localForm.value?.tmPicture === 'string') {
    tmPicture = localForm.value?.tmPicture || ''
  } else {
    // @ts-ignore
    if (localForm.value?.tmPicture) {
      // @ts-ignore
      tmPicture = localForm.value.tmPicture
        // @ts-ignore
        .map((item) => {
          return item?.response?.data?.ossPath || item.url
        })
        .join(',')
    }
  }

  let productPicture = undefined
  // @ts-ignore
  if (localForm.value?.productPicture && typeof localForm.value?.productPicture === 'string') {
    productPicture = localForm.value?.productPicture || ''
  } else {
    if (localForm.value?.productPicture) {
      // @ts-ignore
      productPicture = localForm.value?.productPicture
        // @ts-ignore
        .map((item) => {
          return item?.response?.data?.ossPath || item.url
        })
        .join(',')
    }
  }

  let colors = []
  localForm.value.colorArr &&
    localForm.value.colorArr.forEach((item) => {
      colors.push(`${item.name}_${item.url || ''}`)
    })
  localForm.value.color = colors
  const customLocalForm = editGoodCustomInfoRef.value?.getLocalForm() || {}
  const data = {
    ...localForm.value,
    ...customLocalForm,
    nodeCode: 'ProductinformationFilling',
    sizeChart: sizeChart, //尺码表
    washLabel: washLabel, //水洗标识
    tmPicture: tmPicture, //烫唛照片
    productPicture: productPicture //
  }

  fields.value.forEach((item) => {
    // @ts-ignore
    if (item.type === 8) {
      // 人员选择
      const userIds =
        (data[`${item.code}List`] && data[`${item.code}List`].map((item1) => item1.userId)) || []
      data[`${item.code}`] = userIds.join(',')
    }
  })

  if (data && data.jsonData) {
    delete data.jsonData
  }

  if (data.packageMethod === '常规包装') {
    data.unRoutinePackagePicture = undefined
  }
  if (localForm.value.id) {
    await updateDesign(data)
    message.success('操作成功')
    emit('confirm')
  } else {
    await saveDesign(data)
    message.success('操作成功')
    emit('confirm')
  }
}

const fields = ref([]) // 配置列表

// 获取配置
const getConfig = async () => {
  const fieldConfig = dictStore.getDesignFields || []
  console.log('fieldConfig1111', fieldConfig)
  if (fieldConfig && fieldConfig.length > 0) {
    contactFields(fieldConfig)
    return
  }
  const params = {
    code: 'DesignGallery'
  }
  const res = await getBasicAttribute(params)
  contactFields(res)
}

const contactFields = (res: []) => {
  fields.value = []
  if (res && res.length > 0) {
    let extraList = [
      {
        name: '预计出货时间',
        code: 'expectSellTime',
        state: 1,
        type: 5,
        dictCode: null,
        defaultValue: null,
        maxLength: null,
        placeholder: '请选择预计出货时间',
        listDisplay: false,
        edit: true,
        required: false,
        searchDisplay: false,
        supportSort: false,
        supportFilter: false,
        options: null,
        moduleName: null
      },
      {
        name: '预计做货周期',
        code: 'expectMakeCycle',
        state: 1,
        type: 0,
        dictCode: null,
        defaultValue: null,
        maxLength: null,
        placeholder: '请填写预计做货周期',
        listDisplay: false,
        edit: true,
        required: false,
        searchDisplay: false,
        supportSort: false,
        supportFilter: false,
        options: null,
        moduleName: null
      }
    ]
    let handleList = []
    res.forEach((item) => {
      if (
        props.isEditInfo &&
        [
          'securityCategory',
          'materialRemark',
          'material',
          'executionStandards',
          'componentSupply',
          'component',
          'sizeChart',
          'washLabel',
          'tmPicture'
        ].includes(item.code)
      ) {
        // 安全类别 材料备注 功能  执行标准 面料补充 面料成分 尺码表 水洗标识 烫唛照片
      } else {
        handleList.push(item)
      }
    })
    fields.value = [...extraList, ...handleList] || []
  }
}

defineExpose({ open, productinformationFillingConfirm })
</script>

<style scoped lang="scss">
.form-wapper {
  width: calc(100%);
  display: flex;
  flex-wrap: wrap;

  &-header {
    height: 52px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 20px;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 16px;

    &-line {
      width: 3px;
      height: 10px;
      background: #0064ff;
    }

    &-title {
      padding-left: 6px;
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      letter-spacing: normal;
      color: #333333;
    }
  }

  &-form {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }
}
</style>

<style lang="scss" scoped>
:deep(.el-form-item__content) {
  align-items: start;
}

:deep(.el-select-group__title) {
  padding-left: 24px;
  font-size: 14px;
  font-weight: 500;
  line-height: 32px;
  color: #333333;
  height: 32px;
}

:deep(.el-select-group) {
  border: none !important;
  margin-bottom: 2px;
  padding-left: 4px;
  padding-right: 4px;
  border-bottom: 0.5px solid #ececec !important;
}

:deep(.el-form-item--default .el-form-item__label) {
  line-height: 20px;
  text-align: right;
  display: flex;
  align-items: center;
  padding-left: 0px;

  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  text-align: right;
  letter-spacing: normal;
  color: #666666;
}

:deep(.el-form-item__label) {
  padding-left: 0px;
  padding-right: 10px;
}

:deep(.el-upload--picture-card) {
  width: 98px;
  height: 98px;
}

:deep(.el-select__wrapper.is-disabled .el-select__selected-item) {
  color: #666666;
}

:deep(.el-input.is-disabled .el-input__inner) {
  color: #666666;
  -webkit-text-fill-color: #666666;
}

:deep(.el-textarea.is-disabled .el-textarea__inner) {
  color: #666666;
  -webkit-text-fill-color: #666666;
}

.selectView {
  border-radius: 4px;
  background: #f8f8f8;
  box-sizing: border-box;
  border: 1px solid #e5e5e5;
  font-size: 14px;
  color: #666666;
  margin-right: 10px;
  padding-left: 10px;
  padding-right: 10px;
}
</style>
