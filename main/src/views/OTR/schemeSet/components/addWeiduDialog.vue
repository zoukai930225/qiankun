<template>
  <div>
    <Dialog
      v-model="dialogVisible"
      :modal-append-to-body="false"
      :title="dialogTitle"
      width="468px"
    >
      <el-form
        class="dialogForm"
        ref="formRef"
        v-loading="formLoading"
        :model="formData"
        :rules="formRules"
        label-width="80px"
      >
        <el-form-item label="维度" prop="dimension">
          <el-select
            v-model="formData.dimension"
            placeholder="请选择维度"
            :disabled="isDisabled"
            earable
          >
            <el-option
              v-for="dict in dimensionList()"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="方式" prop="evaluationWay">
          <el-radio-group
            v-model="formData.evaluationWay"
            :disabled="!isEditEvaluationWay || isAddedDimension"
          >
            <el-radio :value="0">问卷</el-radio>
            <el-radio :value="1">导入</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="Number(formData.evaluationWay) === 0"
          label="分类"
          prop="classification"
        >
          <el-select
            v-model="formData.classification"
            multiple
            placeholder="请选择分类"
            :disabled="isDisabled"
            clearable
          >
            <el-option
              v-for="dict in getIntDictOptions(DICT_TYPE.OTR_PROGRAM_TYPE, true)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="Number(formData.evaluationWay) === 0" label="评价关系" prop="releation">
          <el-checkbox-group
            v-model="formData.releation"
            @change="releationSelect"
            :disabled="isDisabled"
          >
            <el-checkbox label="本人" value="本人" />
            <el-checkbox label="直接上级" value="直接上级" />
            <el-checkbox label="斜线上级" value="斜线上级" />
            <el-checkbox label="同事/下级" value="同事/下级" />
            <el-checkbox label="其他" value="其他" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-if="Number(formData.evaluationWay) === 0" label="权重设置" prop="weight">
          <div class="weightSet" v-for="(value, index) in formData.relationWeights" :key="index">
            <div class="weightSet-top">
              <div class="weightSet-top-title">{{
                releationValueDict[`${value.evaluationRelation}`]
              }}</div>
              <div class="weightSet-top-value">{{ value.weight }}%</div>
            </div>
            <el-slider
              v-model="value.weight"
              class="weightSet-slider"
              size="small"
              height="40"
              :disabled="isDisabled"
            />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="margin-right: 33px; padding-bottom: 20px" v-if="!isDisabled">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button></div
        >
      </template>
    </Dialog>
  </div>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

const message = useMessage() // 消息弹窗

const formRef = ref() // 表单 Ref
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const objectIndex = ref(0) // 对象索引
const itemIndex = ref(0) // 对象子项索引
const isEdit = ref(false) // 是否是编辑
const isDisabled = ref(false)
const addedDimension = ref<any>([])
const isAddedDimension = ref(false) // 判断当前对象是否已经了添加一个维度 控制一个为问卷另一个为导入 仅考虑新增
const isEditEvaluationWay = ref(true) // 编辑时不可以修改问卷方式
const dimensionDicts = ref(getIntDictOptions(DICT_TYPE.OTR_PROGRAM_DIMENSION, true))
const formData = ref({
  dimension: '',
  classification: [],
  evaluationWay: 0, //0 问卷 1 导入
  releation: [],
  relationWeights: [] as any
})

const formRules = reactive({
  dimension: [{ required: true, message: '请选择维度', trigger: 'blur' }],
  evaluationWay: [{ required: true, message: '请选择方式', trigger: 'blur' }],
  classification: [{ required: true, message: '请选择分类', trigger: 'blur' }],
  releation: [{ required: true, message: '请选择评价关系', trigger: 'blur' }]
})

/** 打开弹窗 */
const open = async (
  index: number,
  subIndex: number,
  data: any,
  dimensions: [],
  selectedEvaluationWay: number,
  disabled = false
) => {
  dialogVisible.value = false
  objectIndex.value = index
  itemIndex.value = index
  dialogVisible.value = true
  addedDimension.value = dimensions || []
  dialogTitle.value = '新增'
  isDisabled.value = disabled
  isAddedDimension.value = dimensions.length > 0
  if (data) {
    isEdit.value = true
    dialogTitle.value = isDisabled.value ? '查看' : '编辑'
    // 编辑页面不可以修改 问卷方式(导入/问卷)
    isEditEvaluationWay.value = false
    let releation = [] as any
    let classification = [] as any

    const relationWeights = [] as any

    data.relationWeights &&
      data.relationWeights.forEach((item) => {
        relationWeights.push({
          weight: Number(item.weight),
          evaluationRelation: item.evaluationRelation
        })
        releation.push(releationValueDict[`${item.evaluationRelation}`])
      })
    if (data.classification) {
      classification = data.classification.split(',') || []
    }
    formData.value = {
      dimension: data.dimension,
      classification: classification,
      evaluationWay: Number(data.evaluationWay || ''), //0 问卷 1 导入
      releation: releation || [],
      relationWeights: relationWeights
    }
  } else {
    // 新增
    let evaluationWay = 0
    if (selectedEvaluationWay === null) evaluationWay = 0
    if (selectedEvaluationWay === 0) evaluationWay = 1
    isEdit.value = false
    formData.value = {
      dimension: '',
      classification: [],
      evaluationWay, //0 问卷 1 导入
      releation: [],
      relationWeights: []
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const dimensionList = () => {
  let filterList = [] as any
  dimensionDicts.value.forEach((item) => {
    if (!addedDimension.value.includes(item.value)) {
      filterList.push(item)
    }
  })
  return filterList
}

const releationDict = {
  本人: '1',
  直接上级: '2',
  斜线上级: '3',
  '同事/下级': '4',
  其他: '5'
}

const releationValueDict = {
  '1': '本人',
  '2': '直接上级',
  '3': '斜线上级',
  '4': '同事/下级',
  '5': '其他'
}

const releationSelect = () => {
  let weightArr = [] as any
  formData.value.releation.forEach((item) => {
    weightArr.push({
      evaluationRelation: releationDict[`${item}`],
      weight: getReleationWeight(item)
    })
  })
  formData.value.relationWeights = weightArr
}
const getReleationWeight = (value) => {
  let weight = Math.floor(100 / formData.value.releation.length)
  // formData.value.relationWeights.forEach((item) => {
  //   if (releationValueDict[`${item.evaluationRelation}`] === value) {
  //     weight = item.weight
  //   }
  // })
  return weight
}

// 校验权重
const validReleateWeight = () => {
  if (Number(formData.value.evaluationWay) === 0) {
    let totalWeight = 0
    formData.value.relationWeights.forEach((item) => {
      totalWeight += item.weight
    })
    if (totalWeight === 100) {
      return true
    } else {
      message.warning('权重设置有误，总和必须为100%')
      return false
    }
  } else {
    return true
  }
}

const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  if (!validReleateWeight()) return
  const paramData = {
    dimension: formData.value.dimension,
    evaluationWay: `${formData.value.evaluationWay}`,
    classification: formData.value.classification.join(','),
    relationWeights: formData.value.relationWeights
  }
  if (isEdit.value) {
    emit('editWeiduSuccess', paramData, objectIndex.value, itemIndex.value)
  } else {
    emit('addWeiduSuccess', paramData, objectIndex.value)
  }
  dialogVisible.value = false
}

const emit = defineEmits(['addWeiduSuccess', 'editWeiduSuccess'])
</script>

<style lang="scss" scoped>
.weightSet {
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  width: calc(100%);

  &-top {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 14px;
    line-height: 20px;
    &-title {
      color: #666666;
    }
    &-value {
      margin-left: auto;
      padding-right: 15px;
      color: #333;
    }
  }
  &-slider {
    width: calc(100% - 15px);
  }
}
</style>

<style scoped>
:deep(.el-dialog) {
  padding: 0px;
  background: linear-gradient(226deg, #f2f3ff 0%, #ffffff 39%, #ffffff 87%, #f0f8ff 100%);
  box-shadow: 10px 10px 24px 0px rgba(0, 0, 0, 0.07);
}
:deep(.com-dialog .el-dialog__body) {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  max-height: 70vh;
}
:deep(.com-dialog .el-dialog__header) {
  border-bottom: none;
  font-weight: 500;
  font-size: 16px;
  color: #333333;
  line-height: 22px;
}
:deep(.CommonSearchForm) {
  border-bottom: none;
}
:deep(.el-radio__input.is-checked .el-radio__inner) {
  background: #0064ff;
}
:deep(.el-radio__input.is-checked + .el-radio__label) {
  color: #0064ff;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background: #0064ff;
}
:deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: #0064ff;
}
:deep(.el-slider__button) {
  width: 14px;
  height: 14px;
  border: 2px solid #0064ff;
}
:deep(.el-slider__bar) {
  background: #0064ff;
}
/* 定制滚动条整体样式 */
::-webkit-scrollbar {
  width: 0px;
  background: transparent !important;
  background-color: transparent !important;
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
  background: transparent !important;
  /* 设置滚动条轨道的背景色 */
}
</style>
