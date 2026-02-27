<template>
  <div>
    <div class="form-wapper">
      <div class="form-wapper-header">
        <div class="form-wapper-header-line"></div>
        <div class="form-wapper-header-title">基本信息</div>
      </div>
      <div class="form-wapper-form editGoodInfoProductQualificatonForm" @click.stop.prevent="bgClick">
        <el-form ref="formRef" :model="localForm" style="display: flex; flex-wrap: wrap">
          <div style="width: 100%">
            <!-- 面料成分 -->
            <el-form-item label="面料成分" prop="component" label-width="100px" required
              :rules="[{ required: true, message: '请添加面料成分', trigger: 'blur' }]">
              <FabricComposition :list="(localForm.component && localForm.component.split(',')) || []"
                :forbidEdit="forbidEdit || onShow" @delete-click="deleteFabricComposition"
                @add-click="addFabricComposition" />
            </el-form-item>
          </div>
          <div v-for="(field, index) in fields" :key="index">
            <el-form-item v-if="
              field.edit &&
              field.code !== 'color' &&
              field.code !== 'sizeChart' &&
              field.code !== 'component'
            " :label="`${field.name}`" label-width="100px" :label-position="right"
              :required="field.required == 1 && field.type != 6" :prop="field.code" :rules="getRules(field)"
              :style="{ width: formWidth, marginRight: index % 2 === 0 ? '40px' : '0px' }">
              <component v-if="
                field.type !== 8 &&
                field.code !== 'component' &&
                field.code !== 'emptyExtra' &&
                field.code !== 'componentSupply' &&
                field.code !== 'color' &&
                field.code !== 'sizeChart' &&
                !(onShow && componentMap[field.type] == 'el-select' && field.type === 3)
              " :style="{ width: formItemWidth }" :is="componentMap[field.type]" v-model="localForm[field.code]"
                :placeholder="handlePlaceholder(field.placeholder)" :type="componentTypeMap[field.type]"
                :multiple="field.type === 3" :value-format="field.type === 5 ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'"
                clearable filterable :options="field.options" :disabled="forbidEdit || onShow">
                <!-- select -->
                <template v-if="(field.type === 2 || field.type === 3) && field.options?.length">
                  <el-option v-for="option in field.options" :key="option.id" :label="option.value"
                    :value="option.code" />
                </template>

                <template v-if="(field.type === 2 || field.type === 3) && field.dictCode">
                  <el-option v-for="option in getDicList(field.dictCode)" :key="option.code" :label="option.shortName"
                    :value="option.code" />
                </template>
              </component>

              <div v-if="onShow && componentMap[field.type] == 'el-select' && field.type === 3" class="selectView text1"
                :style="{ width: formWidth }">
                {{ showFunctionLables(localForm[field.code], getFieldOptionsList(field)) }}
              </div>
              <s-text-area v-if="field.code === 'componentSupply'" :disabled="forbidEdit || onShow"
                v-model="localForm.componentSupply" :placeholder="handlePlaceholder(field.placeholder || '请输入面料补充')"
                class="dialogFormItemWidth" style="width: 100%" :autosize="{ minRows: 4, maxRows: 4 }" />
            </el-form-item>
            <el-form-item v-if="field.code === 'materialRemark'" label="功能" prop="material" required
              :rules="[{ required: true, message: '请输入功能', trigger: 'blur' }]" label-width="100px">
              <el-input :disabled="forbidEdit || onShow" v-model="localForm.material" placeholder="请输入功能"
                class="dialogFormItemWidth" clearable style="width: 100%" />
            </el-form-item>
          </div>
          <el-form-item label="水洗标识" prop="washLabel" label-width="100px" required
            :rules="[{ required: true, message: '请上传水洗标识', trigger: 'blur' }]" style="margin-right: 40px">
            <template #label>
              <span>水洗标识</span>
            </template>
            <SWUploadFile style="width: 298px" ref="washLabelUploadFileRef" v-model:modelValue="localForm.washLabel"
              :width="298" :only-upload-img="true" :only-show="onShow" :disabled="forbidEdit"
              @uploadBgClick="uploadBgClick(0)" />
          </el-form-item>
          <el-form-item label="烫唛标识" prop="tmPicture" label-width="100px" required
            :rules="[{ required: true, message: '请上传烫唛标识', trigger: 'blur' }]">
            <template #label>
              <span>烫唛标识</span>
            </template>
            <SWUploadFile style="width: 298px" ref="tmPictureUploadFileRef" v-model:modelValue="localForm.tmPicture"
              :width="298" :only-show="onShow" :only-upload-img="true" :disabled="forbidEdit"
              @uploadBgClick="uploadBgClick(1)" />
          </el-form-item>
          <div v-if="onShow" style="
              background: #e5e5e5;
              height: 1px;
              width: calc(100%);
              margin-bottom: 15px;
              margin-top: -10px;
            "></div>
          <el-form-item label="工艺单" prop="workmanshipFile" label-width="100px" style="margin-right: 40px">
            <template #label>
              <span>工艺单</span>
            </template>
            <SWUploadFile style="width: 298px" ref="processSheetUploadFileRef"
              v-model:modelValue="localForm.workmanshipFile" :width="298" :only-show="onShow" :only-upload-img="true"
              :disabled="forbidEdit" @uploadBgClick="uploadBgClick(4)" />
          </el-form-item>
          <el-form-item label="尺码表" prop="sizeChart" label-width="100px" required
            :rules="[{ required: true, message: '请上传尺码表', trigger: 'blur' }]">
            <template #label>
              <span>尺码表</span>
            </template>
            <SWUploadFile style="width: 298px" ref="sizeChartUploadFileRef" v-model:modelValue="localForm.sizeChart"
              :width="298" :only-show="onShow" :only-upload-img="true" :disabled="forbidEdit"
              @uploadBgClick="uploadBgClick(2)" />
          </el-form-item>
          <div v-if="onShow" style="
              background: #e5e5e5;
              height: 1px;
              width: calc(100%);
              margin-bottom: 15px;
              margin-top: -10px;
            "></div>
          <el-form-item label="纸样" prop="paperSample" label-width="100px" style="margin-right: 40px" required
            :rules="[{ required: true, message: '请上传纸样', trigger: 'blur' }]">
            <template #label>
              <span>纸样</span>
            </template>
            <SWUploadFile style="width: 298px" ref="patternUploadFileRef" v-model:modelValue="localForm.paperSample"
              :width="298" :only-show="onShow" :disabled="forbidEdit" @uploadBgClick="uploadBgClick(5)" />
          </el-form-item>
          <el-form-item label="物料卡" prop="materialCard" label-width="100px" style="margin-right: 40px">
            <template #label>
              <span>物料卡</span>
            </template>
            <SWUploadFile style="width: 298px" ref="materialCardUploadFileRef"
              v-model:modelValue="localForm.materialCard" :width="298" :only-show="onShow" :disabled="forbidEdit"
              @uploadBgClick="uploadBgClick(6)" />
          </el-form-item>
          <el-form-item label="面料资质文件" prop="qualificationFile" label-width="100px">
            <template #label>
              <span>面料资质文件</span>
            </template>
            <SWUploadFile style="width: 298px" ref="zzFileUploadFileRef"
              v-model:modelValue="localForm.qualificationFile" :width="298" :only-show="onShow" :disabled="forbidEdit"
              @uploadBgClick="uploadBgClick(3)" />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 面料成分新增 -->
    <FabricCompositionDialog v-if="dialogVisible" v-model="dialogVisible" @confirm="handleConfirm" />
  </div>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { getDictOptions } from '@/utils/dict'

import SWSelectPeople from '@/views/OA/new/develop/components/SWSelectPeople.vue'
import { defineProps } from 'vue'
import { useDicList } from '@/views/OA/new/designGallery/hooks.js'
import { componentMap, componentTypeMap } from '@/views/OA/new/designGallery/components/utils.js'
import { useDictStoreWithOut } from '@/store/modules/dict'

import SWUploadFile from '@/components/SWUoloadFile/index.vue'

import FabricComposition from '@/views/OA/new/designGallery/components/formComponents/fabricComposition.vue'
import FabricCompositionDialog from '@/views/OA/new/designGallery/components/formComponents/fabricCompositionDialog.vue'

const dictStore = useDictStoreWithOut()

import * as CommonApi from '@/api/common'
import * as SystemConstantApi from '@/api/system/systemConstant'
import { getBasicAttribute } from '@/api/oa/new/plan/index'

import { handleJSONParse } from '@/views/OA/new/product/utils.js'
import {
  getDesignDetailById,
  updateDesign,
  saveDesign,
  queryDesignProductColor
} from '@/api/oa/new/designGallery/index'

const message = useMessage() // 消息弹窗

const props = defineProps({
  onShow: {
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
  }
})

// 表单校验规则
const formRules = computed(() => {
  const rules: any = {}
  fields.value.forEach((field) => {
    const type = field.code
    rules[type] = [{ required: true, message: `${field.name}不能为空`, trigger: 'blur' }]
  })
  return rules
})

const formWidth = computed(() => {
  return '400px'
})

const formItemWidth = computed(() => {
  return ' 310px'
})

const getRules = (field) => {
  const type = field.code
  return formRules.value[type] || []
}

const handlePlaceholder = (placeholder: string) => {
  return placeholder
}

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

      // 尺码
      if (localForm.value.sizeChart) {
        localForm.value.sizeChart = localForm.value.sizeChart.split(',').map((item) => {
          let array = item.split('?name=')
          return {
            name: array[1],
            url: array[0]
          }
        })
      }
      //水洗标识
      if (localForm.value.washLabel) {
        localForm.value.washLabel = localForm.value.washLabel.split(',').map((item) => {
          let array = item.split('?name=')
          return {
            name: array[1],
            url: array[0]
          }
        })
      }

      //烫唛照片
      if (localForm.value.tmPicture) {
        localForm.value.tmPicture = localForm.value.tmPicture.split(',').map((item) => {
          let array = item.split('?name=')
          return {
            name: array[1],
            url: array[0]
          }
        })
      }

      //资质文件
      if (localForm.value.qualificationFile) {
        localForm.value.qualificationFile = localForm.value.qualificationFile
          .split(',')
          .map((item) => {
            let array = item.split('?name=')
            return {
              name: array[1],
              url: array[0]
            }
          })
      }

      //工艺单
      if (localForm.value.workmanshipFile) {
        localForm.value.workmanshipFile = localForm.value.workmanshipFile.split(',').map((item) => {
          let array = item.split('?name=')
          return {
            name: array[1],
            url: array[0]
          }
        })
      }

      //纸样
      if (localForm.value.paperSample) {
        localForm.value.paperSample = localForm.value.paperSample.split(',').map((item) => {
          let array = item.split('?name=')
          return {
            name: array[1],
            url: array[0]
          }
        })
      }

      //物料卡
      if (localForm.value.materialCard) {
        localForm.value.materialCard = localForm.value.materialCard.split(',').map((item) => {
          let array = item.split('?name=')
          return {
            name: array[1],
            url: array[0]
          }
        })
      }
    }
    console.log('dsjfkl jl', localForm.value)
  } else {
    initConfigData()
  }
}
const initConfigData = async () => {
  await getConfig()
}

const washLabelUploadFileRef = ref()
const tmPictureUploadFileRef = ref()
const sizeChartUploadFileRef = ref()
const zzFileUploadFileRef = ref()
const processSheetUploadFileRef = ref()
const patternUploadFileRef = ref()
const materialCardUploadFileRef = ref()
const uploadBgClick = (index) => {
  if (index === 0) {
    cancelUploadSelect(1)
    cancelUploadSelect(2)
    cancelUploadSelect(3)
    cancelUploadSelect(4)
    cancelUploadSelect(5)
    cancelUploadSelect(6)
  } else if (index === 1) {
    cancelUploadSelect(0)
    cancelUploadSelect(2)
    cancelUploadSelect(3)
    cancelUploadSelect(4)
    cancelUploadSelect(5)
    cancelUploadSelect(6)
  } else if (index === 2) {
    cancelUploadSelect(0)
    cancelUploadSelect(1)
    cancelUploadSelect(3)
    cancelUploadSelect(4)
    cancelUploadSelect(5)
    cancelUploadSelect(6)
  } else if (index === 3) {
    cancelUploadSelect(0)
    cancelUploadSelect(1)
    cancelUploadSelect(2)
    cancelUploadSelect(4)
    cancelUploadSelect(5)
    cancelUploadSelect(6)
  } else if (index === 4) {
    cancelUploadSelect(0)
    cancelUploadSelect(1)
    cancelUploadSelect(2)
    cancelUploadSelect(3)
    cancelUploadSelect(5)
    cancelUploadSelect(6)
  } else if (index === 5) {
    cancelUploadSelect(0)
    cancelUploadSelect(1)
    cancelUploadSelect(2)
    cancelUploadSelect(3)
    cancelUploadSelect(4)
    cancelUploadSelect(6)
  } else if (index === 6) {
    cancelUploadSelect(0)
    cancelUploadSelect(1)
    cancelUploadSelect(2)
    cancelUploadSelect(3)
    cancelUploadSelect(4)
    cancelUploadSelect(5)
  }
}

const cancelUploadSelect = (index) => {
  if (index === 0) {
    washLabelUploadFileRef.value?.cancelUploadSelect()
  } else if (index === 1) {
    tmPictureUploadFileRef.value?.cancelUploadSelect()
  } else if (index === 2) {
    sizeChartUploadFileRef.value?.cancelUploadSelect()
  } else if (index === 3) {
    zzFileUploadFileRef.value?.cancelUploadSelect()
  } else if (index === 4) {
    processSheetUploadFileRef.value?.cancelUploadSelect()
  } else if (index === 5) {
    patternUploadFileRef.value?.cancelUploadSelect()
  } else if (index === 6) {
    materialCardUploadFileRef.value?.cancelUploadSelect()
  }
}

const bgClick = () => {
  washLabelUploadFileRef.value?.cancelUploadSelect()
  tmPictureUploadFileRef.value?.cancelUploadSelect()
  sizeChartUploadFileRef.value?.cancelUploadSelect()
  zzFileUploadFileRef.value?.cancelUploadSelect()
  processSheetUploadFileRef.value?.cancelUploadSelect()
  patternUploadFileRef.value?.cancelUploadSelect()
  materialCardUploadFileRef.value?.cancelUploadSelect()
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
  }
  return []
}

// 更新选择的

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
const formRef = ref()

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
    if (localForm.value.washLabel && localForm.value.washLabel.length > 0) {
      washLabel = localForm.value.washLabel
        .map((item) => {
          return item.url && item.url + '?name=' + item.name
        })
        .join(',')
    }
  }

  let sizeChart = undefined
  if (localForm.value?.sizeChart && typeof localForm.value?.sizeChart === 'string') {
    sizeChart = localForm.value?.sizeChart || ''
  } else {
    // @ts-ignore
    if (localForm.value.sizeChart && localForm.value.sizeChart.length > 0) {
      sizeChart = localForm.value.sizeChart
        .map((item) => {
          return item.url && item.url + '?name=' + item.name
        })
        .join(',')
    }
  }

  let tmPicture = undefined
  if (localForm.value?.tmPicture && typeof localForm.value?.tmPicture === 'string') {
    tmPicture = localForm.value?.tmPicture || ''
  } else {
    // @ts-ignore
    if (localForm.value?.tmPicture && localForm.value?.tmPicture.length > 0) {
      tmPicture = localForm.value.tmPicture
        .map((item) => {
          return item.url && item.url + '?name=' + item.name
        })
        .join(',')
    }
  }

  let qualificationFile = undefined
  if (
    localForm.value?.qualificationFile &&
    typeof localForm.value?.qualificationFile === 'string'
  ) {
    qualificationFile = localForm.value?.qualificationFile || ''
  } else {
    // @ts-ignore
    if (localForm.value?.qualificationFile && localForm.value?.qualificationFile.length > 0) {
      qualificationFile = localForm.value.qualificationFile
        .map((item) => {
          return item.url && item.url + '?name=' + item.name
        })
        .join(',')
    }
  }

  let workmanshipFile = undefined
  if (localForm.value?.workmanshipFile && typeof localForm.value?.workmanshipFile === 'string') {
    workmanshipFile = localForm.value?.workmanshipFile || ''
  } else {
    // @ts-ignore
    if (localForm.value?.workmanshipFile && localForm.value?.workmanshipFile.length > 0) {
      workmanshipFile = localForm.value.workmanshipFile
        .map((item) => {
          return item.url && item.url + '?name=' + item.name
        })
        .join(',')
    }
  }

  let paperSample = undefined
  if (localForm.value?.paperSample && typeof localForm.value?.paperSample === 'string') {
    paperSample = localForm.value?.paperSample || ''
  } else {
    // @ts-ignore
    if (localForm.value?.paperSample && localForm.value?.paperSample.length > 0) {
      paperSample = localForm.value.paperSample
        .map((item) => {
          return item.url && item.url + '?name=' + item.name
        })
        .join(',')
    }
  }

  let materialCard = undefined
  if (localForm.value?.materialCard && typeof localForm.value?.materialCard === 'string') {
    materialCard = localForm.value?.materialCard || ''
  } else {
    // @ts-ignore
    if (localForm.value?.materialCard && localForm.value?.materialCard.length > 0) {
      materialCard = localForm.value.materialCard
        .map((item) => {
          return item.url && item.url + '?name=' + item.name
        })
        .join(',')
    }
  }

  const data = {
    ...localForm.value,
    isCheckComponent: 1,
    sizeChart: sizeChart, //尺码表
    washLabel: washLabel, //水洗标识
    tmPicture: tmPicture, //烫唛照片
    qualificationFile: qualificationFile, // 纸质文件
    workmanshipFile: workmanshipFile, // 工艺文件
    paperSample: paperSample, // 纸样
    materialCard: materialCard // 物料卡
  }
  if (data && data.jsonData) {
    delete data.jsonData
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
const material = ref()
const contactFields = (res: []) => {
  fields.value = []
  if (res && res.length > 0) {
    let componentSupply = {}
    let materialRemark = {}
    // let material = {}
    let securityCategory = {}
    let executionStandards = {}

    res.forEach((item) => {
      if (item.code == 'componentSupply') {
        componentSupply = item
      } else if (item.code == 'materialRemark') {
        materialRemark = item
      } else if (item.code == 'material') {
        material.value = item
      } else if (item.code == 'securityCategory') {
        securityCategory = item
      } else if (item.code == 'executionStandards') {
        executionStandards = item
      }
    })
    fields.value = [componentSupply, materialRemark, securityCategory, executionStandards] || []
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
    width: calc(100%);
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

:deep(.el-form-item__label) {
  padding-left: 0px;
  padding-right: 10px;
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

<style lang="scss">
.editGoodInfoProductQualificatonForm {
  .el-form-item--default .el-form-item__label {
    line-height: 20px;
    text-align: right;
    display: flex;
    align-items: center;
    padding-left: 0px;

    font-size: 14px;
    font-weight: normal;
    line-height: normal;
    text-align: left;
    letter-spacing: normal;
    color: #666666;
  }
}
</style>
