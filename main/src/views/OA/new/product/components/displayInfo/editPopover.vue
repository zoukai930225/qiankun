<template>
  <transition name="fade">
    <div class="edit-popover" v-if="visible">
      <div class="pop-title">
        <img src="@/assets/imgs/oa/product/displayInfo/edit.png" alt="" />
        {{ labelMap[keyCode] }}
      </div>
      <div class="pop-content">
        <div class="sub-title">
          {{ labelMap[keyCode] }}
        </div>

        <div v-if="keyCode === 'washLabel' || keyCode === 'tmPicture'">
          <el-form-item label="" prop="washLabel" v-if="keyCode === 'washLabel'">
            <!-- {{ designDetailView['washLabel'] }} -->
            <SWuploadImg v-model:modelValue="designDetailView.washLabel" />
          </el-form-item>
          <el-form-item label="" prop="tmPicture" v-if="keyCode === 'tmPicture'">
            <SWuploadImg v-model:modelValue="designDetailView.tmPicture" />
          </el-form-item>
        </div>
        <div v-else-if="keyCode === 'productCode'">
          <el-input v-model="designDetailView[keyCode]" placeholder="请输入" />
        </div>
        <div v-else-if="keyCode === 'isSyncWdt'">
          <el-select class="topHeader-search-store" v-model="designDetailView[keyCode]" placeholder="请选择" clearable>
            <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_WHETHER, true)" :key="dict.value"
              :label="dict.label" :value="dict.value" />
          </el-select>
        </div>
        <div v-else>
          <div v-for="(field, index) in filterField(keyCode)" :key="index">
            <!-- {{ field.dictCode }} -->
            <!-- {{ designDetailView[keyCode] }} -->
            <el-form :model="designDetailView" ref="formRef" @submit.prevent="handleSave">
              <el-form-item label="" :prop="field.code">
                <!--颜色 -->
                <div class="row dialogFormItemWidth" style="width: 350px" v-if="field.code === 'color'">
                  <el-select :style="{ width: '185px' }" v-model="designDetailView[field.code]" placeholder="请选择颜色"
                    multiple clearable>
                    <el-option-group v-for="group in Object.keys(colorDict)" :value="group" :key="group" :label="group">
                      <el-option v-for="item in colorDict[`${group}`]" :key="item.id" :label="item.name"
                        :value="item.name" />
                    </el-option-group>
                  </el-select>
                  <div style="margin-left: 10px; color: #409eff; cursor: pointer" @click="addColorDialog">新增</div>
                </div>
                <component v-if="
                  field.type !== 8 &&
                  field.code !== 'component' &&
                  field.code !== 'washLabel' &&
                  field.code !== 'tmPicture' &&
                  field.code !== 'color'
                " style="width: 250px" :is="componentMap[field.type]" v-model="designDetailView[field.code]"
                  :placeholder="field.placeholder" :type="componentTypeMap[field.type]" :multiple="field.type === 3"
                  :value-format="field.type === 5 ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'" clearable filterable
                  :options="field.options">
                  <!-- select -->
                  <template v-if="field.type === 2 || field.type === 3">
                    <div v-if="field.code === 'supplier'">
                      <el-option v-for="option in supplierOptions" :key="option.id" :label="option.supplierName"
                        :value="option.id" />
                    </div>
                    <div v-else>
                      <div v-if="field.options?.length">
                        <el-option v-for="option in field.options" :key="option.id" :label="option.value"
                          :value="option.code" />
                      </div>
                      <div v-else-if="field.dictCode">
                        <el-option v-for="option in getDicList(field.dictCode)" :key="option.code"
                          :label="option.shortName" :value="option.code" />
                      </div>
                    </div>
                  </template>
                </component>

                <!-- <el-select
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
                </el-select> -->

                <!-- 面料成分 -->
                <div v-if="field.code === 'component'" style="min-width: 250px; max-width: 250px">
                  <FabricComposition :list="(designDetailView.component && designDetailView.component.split(',')) || []
                    " @delete-click="deleteFabricComposition" @add-click="addFabricComposition" />
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>

      <div class="btn-group">
        <el-button class="btn" @click="handleClose">关闭</el-button>
        <el-button class="btn" type="primary" @click="handleSave" :loading="submitLoading">提交</el-button>
      </div>

      <!-- 面料成分新增 -->
      <FabricCompositionDialog v-if="dialogVisible" v-model="dialogVisible" @confirm="handleConfirm" />

      <!-- 新增颜色弹框-->
      <AddColorDialog v-if="colorDialogVisible" v-model="colorDialogVisible" :colorList="Object.keys(colorDict)"
        @confirm="queryColorList" />
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { componentMap, componentTypeMap } from '@/views/OA/new/designGallery/components/utils.js'

import { getDictOptions, DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import * as DictApi from '@/api/system/dict/dict.data'
import { defineProps } from 'vue'

import SWuploadImg from '@/views/OA/new/designGallery/components/SWuploadImg.vue'
import AddColorDialog from '../addColorDialog.vue'

import FabricComposition from '@/views/OA/new/designGallery/components/formComponents/fabricComposition.vue'
import FabricCompositionDialog from '@/views/OA/new/designGallery/components/formComponents/fabricCompositionDialog.vue'
import * as CommonApi from '@/api/common'
import * as SystemConstantApi from '@/api/system/systemConstant'
import { getBasicAttribute } from '@/api/oa/new/plan/index'
import { debounce, filter } from 'lodash-es'
import { sendFeiShuMessageForProduct } from '@/api/oa/new/develop'
import { getAccessToken } from '@/utils/auth'
const uploadHeaders = ref({ token: getAccessToken() }) // 上传 Header 头
const fileType = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const importUrl =
  import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL + '/api/ossInfo/upload'
import { createImageViewer } from '@/components/ImageViewer'
const submitLoading = ref(false) //按钮提交loading
import {
  getSupplierList,
  getDesignDetailById,
  updateDesign,
  saveDesign,
  queryDesignProductColor
} from '@/api/oa/new/designGallery/index'

import { set } from 'nprogress'

const message = useMessage() // 消息弹窗
const designDetailView = ref({})

const labelMap = {
  style: '风格',
  color: '颜色',
  size: '尺码',
  minimumOrder: '最低起订量',
  isStock: '是否现货',
  establishTime: '新品建档时间',
  excludingTaxPrice: '产品不含税价格',

  otherPrice: '其他费用',
  materialRemark: '材料备注',

  material: '材质/功能',
  securityCategory: '安全类别',
  executionStandards: '执行标准',
  washLabel: '水洗标识',
  tmPicture: '烫唛照片',
  component: '面料成分',

  supplier: '供应商选择',
  expectSellTime: '预计出货时间',
  expectMakeCycle: '预计做货周期',
  productCode: '货品编码',
  isSyncWdt: '是否同步旺店通'
}

const handleClose = () => {
  // console.log('关闭', typeof designDetailView.value.washLabel)
  visible.value = false
}

// 校验面料成分总和是否是100%
const validateComposition = (composition) => {
  const percentages = composition.match(/(\d+)%/g)

  const total = percentages.reduce((acc, percent) => {
    const number = parseInt(percent.replace('%', ''), 10)
    if (isNaN(number)) {
      return acc
    }
    return acc + number
  }, 0)

  if (total !== 100) {
    return message.error('面料成分总和不等于100%') // 直接返回错误信息，停止执行
  }
  return true
}

// 处理颜色 -提交的时候需要将code转成中文发给后端
const getShortNames = (newValue, colorOptions) => {
  let shortNames = []

  if (!newValue || newValue.length === 0 || newValue === '[]') return

  // 遍历newValue数组
  newValue.forEach((value) => {
    // 在colorOptions中寻找匹配的项
    // const match = colorOptions.find((option) => option.value === value)
    // 如果找到了匹配的项，将它的shortName添加到结果数组中
    // if (match) {
    //   shortNames.push(match.shortName)
    // }
    shortNames.push(value)
  })

  // 将所有找到的shortName拼接成一个字符串
  return shortNames.join(',')
}

// 提交保存
const handleSave = debounce(async () => {
  try {
    // 如果是面料成分，需要验证一下总和是否是100%
    if (keyCode.value === 'component') {
      const result = validateComposition(designDetailView.value?.component)
      if (!result) return
    }
    submitLoading.value = true

    let submitData = JSON.parse(JSON.stringify(designDetailView.value))

    let oldValue = designDetail.value[keyCode.value]
    let newValue = submitData[keyCode.value]
    let oldName = ''
    let newName = ''

    if (keyCode.value === 'washLabel') {
      let washLabel = undefined
      if (
        designDetailView.value?.washLabel &&
        typeof designDetailView.value?.washLabel === 'string'
      ) {
        washLabel = designDetailView.value?.washLabel || ''
      } else {
        // @ts-ignore
        if (designDetailView.value?.washLabel) {
          // console.log('打印照片', designDetailView.value.washLabel)
          // @ts-ignore
          washLabel = designDetailView.value.washLabel
            // @ts-ignore
            .map((item) => {
              return item?.response?.data?.ossPath || item.url
            })
            .join(',')
        }
      }
      newValue = washLabel

      newName = newValue
      oldName = oldValue
    } else if (keyCode.value === 'tmPicture') {
      let tmPicture = undefined
      if (
        designDetailView.value?.tmPicture &&
        typeof designDetailView.value?.tmPicture === 'string'
      ) {
        tmPicture = designDetailView.value?.tmPicture || ''
      } else {
        // @ts-ignore
        if (designDetailView.value?.tmPicture) {
          // @ts-ignore
          tmPicture = designDetailView.value.tmPicture
            // @ts-ignore
            .map((item) => {
              return item?.response?.data?.ossPath || item.url
            })
            .join(',')
        }
      }
      newValue = tmPicture

      newName = newValue
      oldName = oldValue
    }

    // 处理尺码和颜色 他们是多选 ，如果不处理的话返回的时候可能是'[]' ，会有问题
    else if (keyCode.value === 'color' || keyCode.value === 'size') {
      // 处理原数据
      if (oldValue && oldValue !== '' && oldValue !== '[]') {
        oldValue = JSON.parse(oldValue)
      } else {
        oldValue = []
      }

      // 处理颜色
      if (keyCode.value === 'color') {
        const field = filterField(keyCode.value)
        const colorOptions = getDicList(field[0].dictCode)

        // 处理新数据
        if (typeof newValue === 'string') {
          newValue = JSON.parse(newValue)
        }
        if (newValue && newValue.length > 0) {
          newName = getShortNames(newValue, colorOptions) || ''
        }
        // 处理旧数据
        if (oldValue && oldValue.length > 0) {
          oldName = getShortNames(oldValue, colorOptions) || ''
        }
      } else {
        if (newValue && newValue.length > 0) {
          newName = newValue.join(',')
        }
        // 处理旧数据
        if (oldValue && oldValue.length > 0) {
          oldName = oldValue.join(',')
        }
      }
    }

    // 处理走字典的字段，安全类别，执行标准，材质/功能，是否现货，是否同步旺店通
    else if (
      keyCode.value === 'material' ||
      keyCode.value === 'executionStandards' ||
      keyCode.value === 'securityCategory' ||
      keyCode.value === 'isStock' ||
      keyCode.value === 'isSyncWdt'
    ) {
      const field = filterField(keyCode.value)
      const items = getDicList(field[0].dictCode)

      if (oldValue && oldValue !== '') {
        const item = items.find((item) => item.code === oldValue)
        if (item) {
          oldName = item.shortName
        }
      }
      if (newValue && newValue !== '') {
        const item = items.find((item) => item.code === newValue)
        if (item) {
          newName = item.shortName
        }
      }
    }

    // 处理供应商
    else if (keyCode.value === 'supplier') {
      if (oldValue && oldValue !== '') {
        const item = props.supplierOptions.find((item) => item.id === oldValue)
        if (item) {
          oldName = item.supplierName
        }
      }
      if (newValue && newValue !== '') {
        const item = props.supplierOptions.find((item) => item.id === newValue)
        if (item) {
          newName = item.supplierName
        }
      }
    } else {
      oldName = oldValue || ''
      newName = newValue || ''
    }

    let data = {
      designPictureId: currentRowData.value.id,
      productNumber: currentRowData.value.productNumber,
      currentNode: currentRowData.value.nodeName,
      column: keyCode.value,
      columnName: labelMap[keyCode.value], //字段中文名
      newValue: newValue || '',
      oldValue: oldValue || '',
      oldName: oldName,
      newName: newName
    }
    console.log('提交数据', data)
    await sendFeiShuMessageForProduct(data)
    message.success('您的申请已发送,等待审批')
    visible.value = false
  } finally {
    submitLoading.value = false
  }
}, 200)

const props = defineProps({
  listDic: {
    type: Array as () => any[],
    default: () => {
      return []
    }
  },
  supplierOptions: {
    type: Array as () => any[],
    default: () => {
      return []
    }
  }
})

const getDicList = (dictCode) => {
  // @ts-ignore
  const item = props.listDic.filter((item) => item?.id == dictCode)
  // console.log('字典项', item)
  //@ts-ignore
  const dictList = getDictOptions(item?.[0]?.code).filter((item) => item?.code != 'ALL')
  // console.log('字典', dictList)
  return dictList
}

const dialogVisible = ref(false)
// 新增面料
const addFabricComposition = () => {
  dialogVisible.value = true
}

// 删除面料
const deleteFabricComposition = (index) => {
  const arr = designDetailView.value.component.split(',') || []
  let newArr = arr.filter((item, idx) => {
    return idx !== index
  })
  designDetailView.value.component = newArr.join(',')
}

// 面料新增确认
const handleConfirm = (data) => {
  if (designDetailView.value.component && data) {
    const arr = designDetailView.value.component.split(',') || []
    arr.push(data)
    designDetailView.value.component = arr.join(',')
  } else {
    designDetailView.value.component = data || ''
  }
}

const filterField = (field) => {
  return fields.value.filter((item) => item.code === field)
}
const visible = ref(false)
const keyCode = ref('')
const designDetail = ref({})
const fields = ref([])
const currentRowData = ref({})

// 打开弹窗
const open = (rowData, data, code, fieldsData) => {
  visible.value = true
  // getSupplierOptions()
  keyCode.value = code
  designDetail.value = data
  currentRowData.value = rowData
  fields.value = fieldsData
  designDetailView.value = JSON.parse(JSON.stringify(designDetail.value))

  console.log('颜色回显', designDetailView.value.color)

  // 尺码回显
  if (designDetailView.value.size) {
    designDetailView.value.size = JSON.parse(designDetailView.value.size) || []
  }

  // 颜色回显
  if (designDetailView.value.color) {
    designDetailView.value.color = JSON.parse(designDetailView.value.color) || []
    // tempColor.value = colorArr
  }

  // 水洗标识回显
  if (designDetailView.value.washLabel) {
    if (designDetailView.value.washLabel === '') return []
    // console.log('打包', designDetailView.value.washLabel)
    designDetailView.value.washLabel = designDetailView.value.washLabel.split(',').map((item) => {
      return {
        url: item
      }
    })
  }
  // 烫唛照片回显
  if (designDetailView.value.tmPicture) {
    if (designDetailView.value.tmPicture === '') return []
    designDetailView.value.tmPicture = designDetailView.value.tmPicture.split(',').map((item) => {
      return {
        url: item
      }
    })
  }
  if (code === 'color') {
    queryColorList()
  }
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

const colorDialogVisible = ref(false)

// 新增颜色弹框
const addColorDialog = () => {
  colorDialogVisible.value = true
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
/* 定义进入和离开的过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  background-color: #f8f8f9 !important;
  box-shadow: none !important;
}

.edit-popover {
  width: 248px;
  min-height: 162px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 12px;
  padding-bottom: 15px;
  position: absolute;
  bottom: 60px;
  left: 25px;
  z-index: 999999;
  box-shadow: 0px -2px 14px 1px rgba(0, 0, 0, 0.18);
  background-color: #fff;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid #fff;
  }

  .pop-title {
    height: 34px;
    line-height: 34px;
    font-size: 14px;
    background-image: url('@/assets/imgs/oa/product/displayInfo/edit-bg.png');
    background-size: 100% 100%;
    background-position: center;
    padding-left: 10px;
    box-sizing: border-box;
    font-weight: bold;

    img {
      margin-right: 3px;
    }
  }

  .pop-content {
    padding: 10px;
    height: 100%;
    box-sizing: border-box;
    max-height: 400px;
    overflow-y: auto;
    overflow-x: hidden;

    .sub-title {
      font-size: 12px;
      color: #666666;
      margin-bottom: 10px;
    }
  }

  .btn-group {
    display: flex;
    justify-content: flex-end;
    margin-right: 10px;

    .btn {
      border-radius: 16px;
    }
  }
}

:deep(.el-upload--picture-card) {
  width: 80px;
  height: 80px;
  border: none;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 80px;
  height: 80px;
}

:deep(.upload-img-wapper .upload-cus) {
  width: 80px;
  height: 80px;
}

:deep(.upload) {
  width: 80px;
  height: 80px;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);

  &:hover {
    border-color: var(--el-color-primary);
  }

  .el-upload {
    position: relative;
    width: 80px;
    height: 80px;

    .upload-empty {
      width: 80px;
      height: 80px;
    }

    .upload-handle {
      position: absolute;
      top: 0;
      right: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      cursor: pointer;
      background: rgb(0 0 0 / 60%);
      opacity: 0;
      box-sizing: border-box;
      text-align: center;

      .handle-icon {
        color: #fff;
      }
    }

    &:hover {
      .upload-handle {
        opacity: 1;
      }
    }
  }

  .upload-image {
    width: 80px;
    height: 80px;
  }
}
</style>
