<template>
  <div class="drawer-wrapper">
    <el-drawer
      v-model="drawerVisible"
      :with-header="false"
      :wrapper-closable="true"
      class="drawer"
      size="968"
      @close="handleClose"
    >
      <div>
        <div class="drawerTitle"
          ><div>{{ drawerTitle }}</div
          ><div @click="drawerVisible = false"
            ><el-icon><CloseBold /></el-icon
          ></div>
        </div>
      </div>
      <el-form
        class="dialogForm"
        ref="formRef"
        v-loading="formLoading"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <div class="drawerContent">
          <el-form-item label="九宫格名称" prop="gridName">
            <el-input
              class="dialogFormItemWidth"
              v-model="formData.gridName"
              placeholder="请输入"
              :style="{ width: formType === 'update' ? ' 80%' : ' 95.5%' }"
            />
            <div class="sudokuSet-btn" @click="setSudoku(formData.id)" v-if="formType === 'update'">
              <el-icon><Edit /></el-icon>
              设置九宫格
            </div>
          </el-form-item>
          <el-row :gutter="10">
            <el-col :span="13">
              <el-form-item label="X轴名称" prop="xnameAxis" style="width: 100%" required>
                <el-input
                  class="dialogFormItemWidth"
                  v-model="formData.xnameAxis"
                  placeholder="请输入"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="" label-width="0" prop="xnameAxisKey" style="width: 100%">
                <el-select
                  class="dialogFormItemWidth"
                  v-model="formData.xnameAxisKey"
                  placeholder="请选择"
                  clearable
                  style="width: 100%"
                  @change="handleDimensionChange('X')"
                >
                  <el-option
                    v-for="dict in filteredOptionsX"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="7">
              <el-form-item label="" label-width="0" prop="xnameAxisValue" style="width: 100%">
                <el-input
                  class="dialogFormItemWidth"
                  v-model="formData.xnameAxisValue"
                  placeholder="请输入"
                  style="width: 100%"
                  type="number"
                  :min="0"
                />
              </el-form-item>
            </el-col>
            <el-col :span="1">%</el-col> -->
          </el-row>
          <!-- Y轴 -->
          <el-row :gutter="10">
            <el-col :span="13">
              <el-form-item label="Y轴名称" prop="ynameAxis" style="width: 100%" required>
                <el-input
                  class="dialogFormItemWidth"
                  v-model="formData.ynameAxis"
                  placeholder="请输入"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="" label-width="0" prop="ynameAxisKey" style="width: 100%">
                <el-select
                  class="dialogFormItemWidth"
                  v-model="formData.ynameAxisKey"
                  placeholder="请选择"
                  clearable
                  style="width: 100%"
                  @change="handleDimensionChange('Y')"
                >
                  <el-option
                    v-for="dict in filteredOptionsY"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="7">
              <el-form-item label="" label-width="0" prop="ynameAxisValue" style="width: 100%">
                <el-input
                  class="dialogFormItemWidth"
                  v-model="formData.ynameAxisValue"
                  placeholder="请输入"
                  style="width: 100%"
                  type="number"
                  :min="0"
                />
              </el-form-item>
            </el-col>
            <el-col :span="1">%</el-col> -->
          </el-row>
          <el-form-item label="加分项应用" prop="bonusApplication">
            <el-select
              class="dialogFormItemWidth"
              v-model="formData.bonusApplication"
              placeholder="请选择"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="dict in optionList"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="drawerContent">
          <div class="drawerContent-title">
            <div class="drawerContent-title-icon"></div><div>等级定义</div>
            <div>
              <img src="@/assets/imgs/otr/sudokuSet/add_tip.png" alt="" class="add-tip" />
              <span style="font-size: 12px">大于等于最小值小于最大值</span>
            </div>
          </div>
          <div class="drawerContent-content">
            <div>
              <div class="level-title">低</div>
              <el-row :gutter="10">
                <el-col :span="14">
                  <el-form-item
                    :label="
                      formData.xnameAxisKey
                        ? getDictLabel(DICT_TYPE.OTR_PROGRAM_DIMENSION, formData.xnameAxisKey)
                        : '维度1'
                    "
                    prop="dimension1Value1"
                    label-width="60px"
                    required
                  >
                    <el-input
                      class="dialogFormItemWidth"
                      v-model="formData.dimension1Value1"
                      placeholder="请输入"
                      style="width: 100%"
                      type="number"
                      :readonly="true"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="" prop="dimension1Value2" label-width="0">
                    <el-input
                      class="dialogFormItemWidth"
                      v-model="formData.dimension1Value2"
                      placeholder="请输入"
                      style="width: 100%"
                      type="number"
                      :min="0"
                      oninput="if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="14">
                  <el-form-item
                    :label="
                      formData.ynameAxisKey
                        ? getDictLabel(DICT_TYPE.OTR_PROGRAM_DIMENSION, formData.ynameAxisKey)
                        : '维度2'
                    "
                    label-width="60px"
                    required
                    prop="dimension2Value1"
                  >
                    <el-input
                      class="dialogFormItemWidth"
                      v-model="formData.dimension2Value1"
                      placeholder="请输入"
                      style="width: 100%"
                      type="number"
                      :readonly="true"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="" prop="dimension2Value2" label-width="0">
                    <el-input
                      class="dialogFormItemWidth"
                      v-model="formData.dimension2Value2"
                      placeholder="请输入"
                      style="width: 100%"
                      type="number"
                      :min="0"
                      oninput="if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div>
              <div class="level-title">中</div>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="" label-width="20px" prop="dimension1Value3">
                    <el-input
                      class="dialogFormItemWidth"
                      v-model="formData.dimension1Value3"
                      placeholder="请输入"
                      style="width: 100%"
                      type="number"
                      :min="formData.dimension1Value2"
                      :max="formData.dimension1Value2"
                      oninput="if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="" label-width="0" prop="dimension1Value4">
                    <el-input
                      class="dialogFormItemWidth"
                      v-model="formData.dimension1Value4"
                      placeholder="请输入"
                      style="width: 100%"
                      type="number"
                      :min="0"
                      oninput="if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="" label-width="20px" prop="dimension2Value3">
                    <el-input
                      class="dialogFormItemWidth"
                      v-model="formData.dimension2Value3"
                      placeholder="请输入"
                      style="width: 100%"
                      type="number"
                      :min="formData.dimension2Value2"
                      :max="formData.dimension2Value2"
                      oninput="if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="" label-width="0" prop="dimension2Value4">
                    <el-input
                      class="dialogFormItemWidth"
                      v-model="formData.dimension2Value4"
                      placeholder="请输入"
                      style="width: 100%"
                      type="number"
                      :min="0"
                      oninput="if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div>
              <div class="level-title">高</div>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="" label-width="20px" prop="dimension1Value5">
                    <el-input
                      class="dialogFormItemWidth"
                      v-model="formData.dimension1Value5"
                      placeholder="请输入"
                      style="width: 100%"
                      type="number"
                      :min="formData.dimension1Value4"
                      :max="formData.dimension1Value4"
                      oninput="if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="" label-width="0" prop="dimension1Value6">
                    <el-input
                      class="dialogFormItemWidth"
                      v-model="formData.dimension1Value6"
                      placeholder="请输入"
                      style="width: 100%"
                      type="number"
                      :min="0"
                      oninput="if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="" label-width="20px" prop="dimension2Value5">
                    <el-input
                      class="dialogFormItemWidth"
                      v-model="formData.dimension2Value5"
                      placeholder="请输入"
                      style="width: 100%"
                      type="number"
                      :min="formData.dimension2Value4"
                      :max="formData.dimension2Value4"
                      oninput="if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="" label-width="0" prop="dimension2Value6">
                    <el-input
                      class="dialogFormItemWidth"
                      v-model="formData.dimension2Value6"
                      placeholder="请输入"
                      style="width: 100%"
                      type="number"
                      :min="0"
                      oninput="if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </el-form>
      <div class="drawerFooter" v-if="formType == 'create' || formType == 'update'">
        <el-button @click="drawerVisible = false">取 消</el-button>
        <el-button :disabled="formLoading" type="primary" @click="submitForm">
          {{ formType === 'create' ? '保 存' : '提 交' }}</el-button
        >
      </div>
    </el-drawer>
    <set-sudoku-dialog ref="setSudokuDialogRef" />
  </div>
</template>
<script lang="ts" setup>
defineOptions({ name: 'AddForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
import * as sudokuSetApi from '@/api/otr/sudokuSet'
import { debounce } from 'lodash-es'
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import setSudokuDialog from './setSudokuDialog.vue'
const drawerVisible = ref(false) // 弹窗的是否展示
const drawerTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formRef = ref() // 表单 Ref
const formData = ref({
  id: undefined,
  gridName: '', // 九宫格名称
  xnameAxis: '', // X轴名称
  xnameAxisKey: '', // X轴维度
  xnameAxisValue: '', // X轴值
  ynameAxis: '', // Y轴名称
  ynameAxisKey: '', // Y轴维度
  ynameAxisValue: '', // Y轴值
  bonusApplication: '', // 加分项应用
  dimension1Value1: '0', // 维度1值1
  dimension1Value2: '', // 维度1值2
  dimension1Value3: '', // 维度1值3
  dimension1Value4: '', // 维度1值4
  dimension1Value5: '', // 维度1值5
  dimension1Value6: '', // 维度1值6

  dimension2Value1: '0', // 维度2值1
  dimension2Value2: '', // 维度2值2
  dimension2Value3: '', // 维度2值3
  dimension2Value4: '', // 维度2值4
  dimension2Value5: '', // 维度2值5
  dimension2Value6: '' // 维度2值6
})

// 设置九宫格详情
const setSudokuDialogRef = ref()
const setSudoku = (id: string) => {
  if (setSudokuDialogRef.value) {
    setSudokuDialogRef.value.open(id)
  }
}

function validateSorted(dimension, rule, value, callback) {
  const keys = [
    `${dimension}Value1`,
    `${dimension}Value2`,
    `${dimension}Value3`,
    `${dimension}Value4`,
    `${dimension}Value5`,
    `${dimension}Value6`
  ]

  // 获取对应维度的值
  const values = keys.map((key) => formData.value[key])

  // 过滤掉空值
  const filteredValues = values.filter((val) => val !== '')

  // 检查过滤后的值是否按从小到大排序且没有重复的值
  const isSortedAndUnique = filteredValues.every((val, i, arr) => {
    // 检查当前值是否大于前一个值
    const isSorted = i === 0 || parseFloat(val) >= parseFloat(arr[i - 1])

    return isSorted
  })

  //  `${dimension}Value3`和 `${dimension}Value4`,以及 `${dimension}Value5`和 `${dimension}Value6`这两对数据不可以相等，如果相等返回false
  // 检查指定的元素对是否相等

  const isPairUnique =
    parseFloat(formData.value[`${dimension}Value3`]) !==
      parseFloat(formData.value[`${dimension}Value4`]) &&
    parseFloat(formData.value[`${dimension}Value5`]) !==
      parseFloat(formData.value[`${dimension}Value6`])

  console.log('3', parseFloat(formData.value[`${dimension}Value3`]))
  console.log('4', parseFloat(formData.value[`${dimension}Value4`]))
  console.log('5', parseFloat(formData.value[`${dimension}Value5`]))
  console.log('6', parseFloat(formData.value[`${dimension}Value6`]))
  if (!isSortedAndUnique || !isPairUnique) {
    callback(new Error(`请按从小到大排列`))
  } else {
    callback()
  }
}

// 校验规则
const formRules = reactive({
  gridName: [{ required: true, message: '请输入九宫格名称', trigger: 'blur' }],
  xnameAxis: [{ required: true, message: '请输入X轴名称', trigger: 'blur' }],
  xnameAxisKey: [{ required: true, message: '请选择X轴维度', trigger: 'blur' }],
  xnameAxisValue: [{ required: true, message: '请输入X轴维度值', trigger: 'blur' }],
  ynameAxis: [{ required: true, message: '请输入Y轴名称', trigger: 'blur' }],
  ynameAxisKey: [{ required: true, message: '请选择Y轴维度', trigger: 'blur' }],
  ynameAxisValue: [{ required: true, message: '请输入Y轴维度值', trigger: 'blur' }],

  dimension1Value1: [
    { required: true, message: '请输入维度1值1', trigger: 'blur' },
    {
      validator: (rule, value, callback) => validateSorted('dimension1', rule, value, callback),
      trigger: 'blur'
    }
  ],
  dimension1Value2: [
    { required: true, message: '请输入维度1值2', trigger: 'blur' },
    {
      validator: (rule, value, callback) => validateSorted('dimension1', rule, value, callback),
      trigger: 'blur'
    }
  ],
  dimension1Value3: [
    { required: true, message: '请输入维度1值3', trigger: 'blur' },
    {
      validator: (rule, value, callback) => validateSorted('dimension1', rule, value, callback),
      trigger: 'blur'
    }
  ],
  dimension1Value4: [
    { required: true, message: '请输入维度1值4', trigger: 'blur' },
    {
      validator: (rule, value, callback) => validateSorted('dimension1', rule, value, callback),
      trigger: 'blur'
    }
  ],
  dimension1Value5: [
    { required: true, message: '请输入维度1值5', trigger: 'blur' },
    {
      validator: (rule, value, callback) => validateSorted('dimension1', rule, value, callback),
      trigger: 'blur'
    }
  ],
  dimension1Value6: [
    { required: true, message: '请输入维度1值6', trigger: 'blur' },
    {
      validator: (rule, value, callback) => validateSorted('dimension1', rule, value, callback),
      trigger: 'blur'
    }
  ],

  dimension2Value1: [
    { required: true, message: '请输入维度2值1', trigger: 'blur' },
    {
      validator: (rule, value, callback) => validateSorted('dimension2', rule, value, callback),
      trigger: 'blur'
    }
  ],
  dimension2Value2: [
    { required: true, message: '请输入维度2值2', trigger: 'blur' },
    {
      validator: (rule, value, callback) => validateSorted('dimension2', rule, value, callback),
      trigger: 'blur'
    }
  ],
  dimension2Value3: [
    { required: true, message: '请输入维度2值3', trigger: 'blur' },
    {
      validator: (rule, value, callback) => validateSorted('dimension2', rule, value, callback),
      trigger: 'blur'
    }
  ],
  dimension2Value4: [
    { required: true, message: '请输入维度2值4', trigger: 'blur' },
    {
      validator: (rule, value, callback) => validateSorted('dimension2', rule, value, callback),
      trigger: 'blur'
    }
  ],
  dimension2Value5: [
    { required: true, message: '请输入维度2值5', trigger: 'blur' },
    {
      validator: (rule, value, callback) => validateSorted('dimension2', rule, value, callback),
      trigger: 'blur'
    }
  ],
  dimension2Value6: [
    { required: true, message: '请输入维度2值6', trigger: 'blur' },
    {
      validator: (rule, value, callback) => validateSorted('dimension2', rule, value, callback),
      trigger: 'blur'
    }
  ]
})

/** 打开弹窗 */
const open = async (type: string, id?: string) => {
  drawerVisible.value = true
  drawerTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 获取维度选项
  filteredOptionsX.value = dimensionAllOptions.value
  filteredOptionsY.value = dimensionAllOptions.value

  // 编辑时，设置数据
  if (id) {
    formLoading.value = true
    try {
      const data = await sudokuSetApi.getSudokuSetDetail(id)

      formData.value = {
        ...data
      }
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = debounce(async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    formData.value.bonusApplication = formData.value.bonusApplication
      ? formData.value.bonusApplication
      : ''
    const data = {
      ...formData.value
    }

    // 将维度值转换为数字类型
    const dimensions = ['dimension1Value', 'dimension2Value']
    dimensions.forEach((dimension) => {
      for (let i = 1; i <= 6; i++) {
        const key = `${dimension}${i}`
        const value = data[key]
        // 转换为数字，如果是空字符串或无效数字，则转换为0
        data[key] = value === '' ? 0 : Number(value)
      }
    })

    console.log('提交的数据：', data)
    if (formType.value === 'create') {
      data.id = undefined
      // 新增时需要返回九宫格id
      let sudokuId = await sudokuSetApi.saveSudokuSet(data)
      // 打开设置九宫格弹窗
      setSudoku(sudokuId)
      message.success(t('common.createSuccess'))
    } else {
      await sudokuSetApi.updateSudokuSet(data)
      message.success(t('common.updateSuccess'))
    }
    drawerVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}, 200)

/** 重置表单 */
const resetForm = () => {
  formRef.value?.resetFields()
  formData.value = {
    id: undefined,
    gridName: '',
    xnameAxis: '',
    xnameAxisKey: '',
    xnameAxisValue: '',
    ynameAxis: '',
    ynameAxisKey: '',
    ynameAxisValue: '',
    bonusApplication: '',
    dimension1Value1: '0',
    dimension1Value2: '',
    dimension1Value3: '',
    dimension1Value4: '',
    dimension1Value5: '',
    dimension1Value6: '',
    dimension2Value1: '0',
    dimension2Value2: '',
    dimension2Value3: '',
    dimension2Value4: '',
    dimension2Value5: '',
    dimension2Value6: ''
  }
}

// 加分项选项
interface OptionItem {
  label: string
  value: string
}
const optionList = ref<OptionItem[]>([
  { label: 'X轴', value: '1' },
  { label: 'Y轴', value: '2' }
])

// 获取维度选项
const dimensionAllOptions = computed(() => getIntDictOptions(DICT_TYPE.OTR_PROGRAM_DIMENSION, true))
const filteredOptionsX = ref([{}])
const filteredOptionsY = ref([{}])
watch(
  () => formData.value.xnameAxisKey,
  (newVal) => {
    handleDimensionChange('X', newVal)
  }
)

watch(
  () => formData.value.ynameAxisKey,
  (newVal) => {
    handleDimensionChange('Y', newVal)
  }
)
const handleDimensionChange = (changedDimension, selectedValue) => {
  if (changedDimension === 'X') {
    filteredOptionsY.value = dimensionAllOptions.value.filter(
      (option) => option.value !== selectedValue
    )
  } else {
    filteredOptionsX.value = dimensionAllOptions.value.filter(
      (option) => option.value !== selectedValue
    )
  }
}

const handleClose = () => {
  // 关闭弹窗时，刷新列表页
  emit('success')
}
</script>

<style>
/* 隐藏 el-date-picker 的图标 */
.activitySet-icon-disabled .el-input__prefix-inner {
  display: none;
}
</style>
<style lang="scss" scoped>
// 修改多选框的背景色
:deep(.el-tag, .el-tag.el-tag--primary) {
  background-color: #bfc9d266;
  border-radius: 15px;
}

// 修改备注的文本框背景
:deep(.el-textarea__inner),
:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  background-color: #f8f8f9 !important;
  box-shadow: none !important;
}

:deep(.el-drawer__body){
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;
}
:deep(.el-drawer){
  border-top-left-radius: 16px !important;
  border-bottom-left-radius: 16px !important;
  overflow: hidden !important;
}

// 修改弹窗的标题样式
.drawerTitle {
  font-size: 14px;
  display: flex;
  color: #333333;
  font-weight: 600;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin: 0 0 18px 0;
}

.drawerContent {
  width: 100%;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  margin-bottom: 12px;
  .sudokuSet-btn {
    width: 111px;
    height: 32px;
    border-radius: 4px;
    border: 1px solid #0064ff;
    text-align: center;
    color: #0064ff;
    font-size: 14px;
    margin-left: 10px;
    cursor: pointer;
  }
  &-title {
    margin: 0 0 18px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 14px;
  }
  .drawerContent-title-icon {
    width: 3px;
    height: 10px;
    background: #0064ff;
    margin-right: 6px;
  }
  .add-tip {
    width: 12px;
    margin: 0 4px 0 20px;
    vertical-align: middle;
  }
  // 等级定义
  .drawerContent-content {
    display: flex;
    .level-title {
      text-align: center;
      margin-bottom: 12px;
      color: #333333;
      font-size: 14px;
      font-weight: 600;
    }
  }
}

.drawerFooter {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}
</style>
