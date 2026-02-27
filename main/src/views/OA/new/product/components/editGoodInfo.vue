<template>
  <div>
    <div class="form-wapper">
      <div class="form-wapper-header" v-if="!onShow" style="width: 100%;">
        <div class="form-wapper-header-line"></div>
        <div class="form-wapper-header-title">基本信息</div>
      </div>
      <div class="form-wapper-form" v-loading="loading">
        <EditGoodCustomInfo
          ref="editGoodCustomInfoRef"
          :onShow="onShow"
          :forbidEdit="forbidEdit && localForm.finishedErpNode"
          :formWidth="formWidth"
          :formItemWidth="formItemWidth"
          :localForm="localForm"
          :categoryList="categoryList"
        />
        <el-form ref="formRef" :model="localForm" style="display: flex; flex-wrap: wrap">
          <div v-for="(field, index) in fields" :key="index">
            <el-form-item
              v-if="
                field.edit &&
                field.code !== 'color' &&
                field.code !== 'sizeChart' &&
                field.code !== 'component' &&
                field.code !== 'productCode' &&
                field.code !== 'productName' &&
                field.code !== 'establishTime'
              "
              :label="`${field.name}`"
              label-width="80px"
              label-position="right"
              :required="(field.required == 1 && field.type != 6) || field.code === 'size'"
              :prop="field.code"
              :rules="getRules(field)"
              :style="{ width: formWidth }"
            >
              <component
                v-if="
                  field.type !== 8 &&
                  field.code !== 'component' &&
                  field.code !== 'componentSupply' &&
                  field.code !== 'color' &&
                  field.code !== 'sizeChart' &&
                  !(onShow && componentMap[field.type] == 'el-select' && field.type === 3)
                "
                :style="{ width: formItemWidth }"
                :is="componentMap[field.type]"
                v-model="localForm[field.code]"
                :placeholder="handlePlaceholder(field.placeholder)"
                :type="componentTypeMap[field.type]"
                :multiple="field.type === 3"
                :value-format="field.type === 5 ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'"
                clearable
                filterable
                :options="field.options"
                :disabled="forbidEdit && localForm.finishedErpNode"
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
                    :label="option.supplierName"
                    :value="option.id"
                  />
                </template>
              </component>

              <div
                v-if="onShow && componentMap[field.type] == 'el-select' && field.type === 3"
                class="selectView text1"
                :style="{ width: formWidth }"
              >
                {{ showFunctionLables(localForm[field.code], getFieldOptionsList(field)) }}
              </div>

              <s-text-area
                v-if="field.code === 'componentSupply'"
                :disabled="forbidEdit && localForm.finishedErpNode"
                v-model="localForm.componentSupply"
                :placeholder="handlePlaceholder(field.placeholder || '请输入面料补充')"
                class="dialogFormItemWidth"
                style="width: 100%"
                clearable
                :autosize="{ minRows: 4, maxRows: 4 }"
              />

              <div v-if="field.type === 8" :style="{ width: formItemWidth }">
                <SWSelectPeople
                  :isEdit="true"
                  v-model:modelValue="localForm[`${field.code}List`]"
                  :getSearchList="remoteMethod"
                  @select-people-change="selectPeopleChange(field)"
                />
              </div>
            </el-form-item>
          </div>

          <el-row style="width: calc(100% - 20px);">
            <!-- 面料成分 -->
            <el-form-item v-if="!isEditInfo" label="面料成分" prop="component" label-width="70px">
              <template #label>
                <span style="color: #f56c6c"> *</span>
                <span> 面料成分</span>
              </template>
              <FabricComposition
                :list="(localForm.component && localForm.component.split(',')) || []"
                :forbidEdit="forbidEdit && localForm.finishedErpNode"
                @delete-click="deleteFabricComposition"
                @add-click="addFabricComposition"
              />
            </el-form-item>
            <el-form-item v-if="!isEditInfo" label="尺码表" prop="sizeChart" label-width="70px">
              <template #label>
                <span>尺码表</span>
              </template>
              <SWuploadImg
                :uploadDisabled="forbidEdit && localForm.finishedErpNode"
                v-model:modelValue="localForm.sizeChart"
              />
            </el-form-item>
            <el-form-item v-if="!isEditInfo" label="水洗标识" prop="washLabel" label-width="70px">
              <template #label>
                <span>水洗标识</span>
              </template>
              <SWuploadImg
                :uploadDisabled="forbidEdit && localForm.finishedErpNode"
                v-model:modelValue="localForm.washLabel"
              />
            </el-form-item>
            <el-form-item v-if="!isEditInfo" label="烫唛照片" prop="tmPicture" label-width="70px">
              <template #label>
                <span>烫唛照片</span>
              </template>
              <SWuploadImg
                :uploadDisabled="forbidEdit && localForm.finishedErpNode"
                v-model:modelValue="localForm.tmPicture"
              />
            </el-form-item>
            <el-col :span="8">
              <!-- 新品建档时间 -->
              <el-form-item
                label="新品建档时间"
                prop="establishTime"
                label-width="80px"
                style="display: inline-flex"
              >
                <template #label>
                  <!-- <span style="color: #f56c6c"> *</span> -->
                  <span>新品建档时间</span>
                </template>
                <el-date-picker
                  :disabled="forbidEdit && localForm.finishedErpNode"
                  v-model="localForm.establishTime"
                  type="datetime"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  style="width: 206px"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="执行标准"
                prop="executionStandards"
                label-width="80px"
                :rules="[
                  { required: true, message: '请选择执行标准', trigger: ['blur', 'change'] }
                ]"
              >
                <template #label>
                  <span>执行标准</span>
                </template>
                <el-select
                  class="searchFormItemWidth"
                  v-model="localForm.executionStandards"
                  placeholder="请选择执行标准"
                  clearable
                  style="width: 206px"
                  :disabled="forbidEdit && localForm.finishedErpNode"
                >
                  <el-option
                    v-for="dict in getIntDictOptions('EXECUTION_STANDARDS', true)"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="安全类别"
                prop="securityCategory"
                label-width="80px"
                :rules="[
                  { required: true, message: '请选择安全类别', trigger: ['blur', 'change'] }
                ]"
              >
                <!-- <template #label>
                  <span>安全类别</span>
                </template> -->
                <el-select
                  class="searchFormItemWidth"
                  v-model="localForm.securityCategory"
                  placeholder="请选择安全类别"
                  clearable
                  style="width: 206px"
                  :disabled="forbidEdit && localForm.finishedErpNode"
                >
                  <el-option
                    v-for="dict in getIntDictOptions('SECURITY_CATEGORY', true)"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <!-- <el-form-item label="货品编码" prop="productCode" label-width="70px" :required="true"
              :rules="[{ required: true, message: '请输入货品编码', trigger: 'blur' }]">
              <div :style="{ width: `${formRemarkWidth}` }" class="row-center">
                <el-input :disabled="forbidEdit" v-model="localForm.productCode" :placeholder="localForm.suggestCode ? `推荐编码:${localForm.suggestCode}` : '请输入货品编码'
                  " class="dialogFormItemWidth" clearable :style="{ width: formItemWidth }" />
                <div v-if="
                  (designInfo && Number(designInfo.planProductType || '') === 2) ||
                  Number(designInfo.planProductType || '') === 3
                " style="padding-left: 10px; color: red; font-weight: 500">{{
                    getDictLabel(
                      DICT_TYPE.NP_ENTERPRISE_PRODUCTTYPE,
                      designInfo.planProductType || ''
                    )
                  }}品，原产品编码为：{{ localForm.oldGoodsNo }}</div>
              </div>
            </el-form-item> -->
            <el-form-item label="卖点/功能" prop="salePointRemark" label-width="80px">
              <div :style="{ width: `${formRemarkWidth}` }">
                <el-table
                  :data="localForm?.salePointRemarks"
                  border
                  :header-cell-style="{
                    height: '40px',
                    backgroundColor: '#F2F6FC',
                    color: '#666666'
                  }"
                >
                  <el-table-column
                    label="序号"
                    type="index"
                    width="60"
                    align="center"
                  ></el-table-column>
                  <el-table-column label="卖点">
                    <template #default="{ row }">
                      <STextArea
                        v-model="row.salePointRemark"
                        :rows="1"
                        :autosize="{ minRows: 1, maxRows: 3 }"
                        placeholder="请输入卖点/功能"
                        :disabled="forbidEdit && localForm.finishedErpNode"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    width="80"
                    align="center"
                    v-if="!(forbidEdit && localForm.finishedErpNode)"
                  >
                    <template #default="scope">
                      <el-button link type="danger" @click="delRemarkLine(scope.$index)"
                        >删除</el-button
                      >
                    </template>
                  </el-table-column>
                  <template #append v-if="!(forbidEdit && localForm.finishedErpNode)">
                    <div
                      style="
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 40px;
                      "
                    >
                      <el-button icon="Plus" link type="primary" @click="addRemarkLine">
                        添加
                      </el-button>
                    </div>
                  </template>
                </el-table>
              </div>
            </el-form-item>
          </el-row>
          <div style="width: 100%">
            <el-form-item
              label="颜色"
              prop="colorArr"
              label-width="70px"
              :required="true"
              :rules="[{ required: true, message: '请添加颜色', trigger: 'change' }]"
              v-if="(onShow && localForm.colorArr && localForm.colorArr.length > 0) || !onShow"
            >
              <el-button
                v-if="!onShow"
                type="primary"
                :disabled="forbidEdit && localForm.finishedErpNode"
                @click="addColorDialog"
              >
                <Icon class="mr-5px" icon="ep:plus" />
                添加颜色
              </el-button>
            </el-form-item>
            <div v-else style="height: 30px"></div>
            <div
              style="margin-left: 70px"
              :style="{
                marginTop: onShow ? '-40px' : '0px'
              }"
            >
              <EditNodeColor
                :colorList="localForm.colorArr"
                :forbidEdit="forbidEdit && localForm.finishedErpNode"
                @delete-color="deleteColor"
              />
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <!-- 面料成分新增 -->
    <FabricCompositionDialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      @confirm="handleConfirm"
    />
    <!-- 新增颜色弹框-->
    <AddGoodColorDialog
      v-if="colorDialogVisible"
      v-model="colorDialogVisible"
      @add-color-success="handleAddColorConfirm"
    />
  </div>
</template>

<script lang="ts" setup>
import STextArea from '@/components/common/input/s-textarea.vue'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { getDictOptions, getDictLabel, DICT_TYPE, getIntDictOptions } from '@/utils/dict'

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
import request from '@/config/axios'

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
      rules[type] = [{ required: true, message: message, trigger: 'blur' }]
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
const localForm = ref({
  executionStandards: null,
  securityCategory: null
})
const nodeData = ref({})

const loading = ref(false)
// 打开
const open = async (data: any) => {
  formRef.value?.clearValidate()
  if (data) {
    loading.value = true
    nodeData.value = { ...data }
    initConfigData()
    //商品资料填写
    const res = await getDesignDetailById(data.npDesignPictureGodownId) //回显详情
    if (res) {
      localForm.value = { ...res }
      // 卖点备注
      if (localForm.value.salePointRemark) {
        localForm.value['salePointRemarks'] = localForm.value.salePointRemark
          .split('&#&')
          .map((item: any) => {
            return { salePointRemark: item }
          })
      } else {
        localForm.value['salePointRemarks'] = [{ salePointRemark: '' }]
      }
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
    loading.value = false
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
  const data = await queryDesignProductColor().catch(() => {})
  colorDict.value = data || {}
  console.log('获取颜色列表', data)
}

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
  const data = await getSupplierList().catch(() => {})
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
  const data = await CommonApi.getNPCategoryNameList().catch(() => {})
  if (data) {
    categoryList.value = data || []
  }
}

const productinformationFillingConfirm = async (isTempSave = false) => {
  // 校验表单
  if (!isTempSave) {
    if (!formRef || !editGoodCustomInfoRef) return
    const valid = await formRef.value.validate()
    const valid2 = await editGoodCustomInfoRef.value.valueCheck()
    if (!valid || !valid2) return
  }

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

  if (localForm.value.salePointRemarks && localForm.value.salePointRemarks.length > 0) {
    localForm.value.salePointRemark = localForm.value.salePointRemarks
      .filter((item: any) => item.salePointRemark)
      .map((item: any) => item.salePointRemark)
      .join('&#&')
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
  delete data.salePointRemarks

  if (data.packageMethod === '常规包装') {
    data.unRoutinePackagePicture = undefined
  }
  if (localForm.value.id) {
    if (isTempSave) {
      data['submitStatus'] = 0
    } else {
      data['submitStatus'] = 1
    }
    await updateDesign(data)
    await request.post({
      url: '/api/np/prenatal/sample/saveSkuInfo',
      data: { designPictureGodownId: localForm.value?.id }
    })

    message.success('操作成功')
    emit('confirm')
  } else {
    if (isTempSave) {
      data.submitStatus = 0
    } else {
      data.submitStatus = 1
    }
    await saveDesign(data)
    await request.post({
      url: '/api/np/prenatal/sample/saveSkuInfo',
      data: { designPictureGodownId: localForm.value?.id }
    })

    message.success('操作成功')
    emit('confirm')
  }
}

const fields = ref([]) // 配置列表

// 获取配置
const getConfig = async () => {
  const fieldConfig = dictStore.getDesignFields || []
  console.log(fieldConfig, 9887999)
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
      // {
      //   name: '预计出货时间',
      //   code: 'expectSellTime',
      //   state: 1,
      //   type: 5,
      //   dictCode: null,
      //   defaultValue: null,
      //   maxLength: null,
      //   placeholder: '请选择预计出货时间',
      //   listDisplay: false,
      //   edit: true,
      //   required: false,
      //   searchDisplay: false,
      //   supportSort: false,
      //   supportFilter: false,
      //   options: null,
      //   moduleName: null
      // },
      // {
      //   name: '预计做货周期',
      //   code: 'expectMakeCycle',
      //   state: 1,
      //   type: 0,
      //   dictCode: null,
      //   defaultValue: null,
      //   maxLength: null,
      //   placeholder: '请填写预计做货周期',
      //   listDisplay: false,
      //   edit: true,
      //   required: false,
      //   searchDisplay: false,
      //   supportSort: false,
      //   supportFilter: false,
      //   options: null,
      //   moduleName: null
      // }
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

const addRemarkLine = () => {
  localForm.value.salePointRemarks.push({ salePointRemark: '' })
}

const delRemarkLine = (index: number) => {
  localForm.value.salePointRemarks.splice(index, 1)
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

// :deep(.el-form-item--default .el-form-item__label) {
//   line-height: 20px;
//   text-align: right;
//   display: flex;
//   align-items: center;
//   padding-left: 0px;

//   font-size: 14px;
//   font-weight: normal;
//   line-height: normal;
//   text-align: right;
//   letter-spacing: normal;
//   color: #666666;
// }
// :deep(.el-form-item) {
//   margin-right: 20px !important;
// }

:deep(.el-form-item__label) {
  // padding-left: 0px;
  padding-right: 12px !important;
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
