<template>
  <div class="drawer-wrapper">
    <el-drawer
      v-model="drawerVisible"
      :with-header="false"
      :wrapper-closable="true"
      class="drawer"
      size="968"
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
        label-width="110px"
      >
        <div class="drawerContent">
          <el-form-item label="标签类别" prop="tagCategory" required>
            <el-select
              class="dialogFormItemWidth"
              v-model="formData.tagCategory"
              placeholder="请选择标签类别"
              style="width: 100%"
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.TAG_CATEGORY_DATA, true)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否显示" prop="isShow" required>
            <el-switch
              style="--el-switch-on-color: #0064ff"
              v-model="formData.isShow"
              :active-value="'1'"
              :inactive-value="'0'"
            />
          </el-form-item>
          <el-form-item label="标签名称" prop="tagName" style="width: 100%" required>
            <el-input
              class="dialogFormItemWidth"
              v-model="formData.tagName"
              placeholder="填写标签名称"
              style="width: 100%"
            />
          </el-form-item>

          <el-form-item label="标签颜色" prop="tagColor" required>
            <el-select
              class="dialogFormItemWidth"
              v-model="formData.tagColor"
              placeholder="请选择"
              clearable
              style="width: 100px"
            >
              <template #label>
                <span class="status">
                  <span class="icon" :class="formatIconBg(formData.tagColor)"></span>
                </span>
              </template>
              <el-option
                v-for="dict in colorList"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              >
                <span class="status">
                  <span class="icon" :class="formatIconBg(dict.value)"></span>
                  <span> {{ dict.label }}</span>
                </span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="标签符号" prop="tagSymbol" required>
            <el-input
              class="dialogFormItemWidth"
              v-model="formData.tagSymbol"
              placeholder="请选择标签符号"
              style="width: 100%"
              readonly
            />
          </el-form-item>
          <el-form-item label="" prop="">
            <div
              v-for="item in tagSymbolList"
              :key="item.id"
              class="tagSymbolItem"
              @click="onSymbolClick(item)"
              :class="{ tagSymbolItem_selected: selectedSymbolIds.includes(item.id) }"
            >
              {{ item.symbol }}
            </div>
          </el-form-item>
          <el-form-item label="应用范围" prop="rangeUse">
            <el-input
              class="dialogFormItemWidth"
              v-model="formData.rangeUse"
              placeholder="请选择应用范围"
              style="width: 100%"
              @click="openStoreRange"
            />
            <!-- <StoreRangePlus
              multiple
              v-model="formData.rangeUse"
              value-type="shopName"
              width="100%"
              placeholder="请选择应用范围"
              :isSelectAll="true"
            /> -->
          </el-form-item>
        </div>
      </el-form>
      <div class="drawerFooter" v-if="formType == 'create' || formType == 'update'">
        <el-button @click="drawerVisible = false">取 消</el-button>
        <el-button :disabled="formLoading" type="primary" @click="submitForm">
          {{ formType === 'create' ? '保 存' : '提 交' }}</el-button
        >
      </div>
    </el-drawer>
    <StoreRange ref="storeRangeRef" @submit="onRangeUseSubmit" />
  </div>
</template>
<script lang="ts" setup>
defineOptions({ name: 'AddProdForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
import * as TagMngApi from '@/api/tagMng'
const drawerVisible = ref(false) // 弹窗的是否展示
const drawerTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改

import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'

const formData = ref({
  id: '',
  tagCategory: '',
  tagName: '',
  tagColor: '',
  tagSymbol: '',
  rangeUse: '',
  isShow: '1'
})
const formRules = reactive({
  tagCategory: [{ required: true, message: '请选择标签类别', trigger: 'blur' }],
  tagName: [
    { required: true, message: '请填写标签名称', trigger: 'blur' },
    { max: 20, message: '标签名称长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  tagColor: [{ required: true, message: '请选择标签颜色', trigger: 'blur' }],
  tagSymbol: [{ required: true, message: '请选择标签符号', trigger: 'change' }],
  rangeUse: [{ required: true, message: '请选择应用范围', trigger: 'change' }]
})

const formRef = ref() // 表单 Ref
/** 打开弹窗 */
const open = async (type: string, id?: string) => {
  drawerVisible.value = true
  drawerTitle.value = t('action.' + type)
  formType.value = type
  resetForm()

  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      const data = await TagMngApi.getTagById({ id: id })
      formData.value = data
      // 标签符号回显
      getSymbolDisplay(data.tagSymbol)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

// 标签符号回显
const getSymbolDisplay = (tagSymbol) => {
  const symbols = tagSymbol.split('')
  selectedSymbolIds.value = []
  selectedSymbols.value = []
  symbols.forEach((symbol) => {
    const foundSymbol = tagSymbolList.find((item) => item.symbol === symbol)
    if (foundSymbol) {
      selectedSymbolIds.value.push(foundSymbol.id)
      selectedSymbols.value.push(foundSymbol)
    }
  })
}

const openStoreRange = () => {
  storeRangeRef.value?.open(formData.value.rangeUse)
}

const onRangeUseSubmit = (val) => {
  console.log(val)
  if (val.currentIndex === 0) {
    // 选择全渠道
    formData.value.rangeUse = '全渠道'
  } else {
    if (val.checkList.length) {
      formData.value.rangeUse = val.checkList.map((item) => item.shopName).join(',')
    }
  }
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as any
    if (formType.value === 'create') {
      data.id = undefined
      await TagMngApi.addTag(data)
      message.success(t('common.createSuccess'))
    } else {
      await TagMngApi.updateTag(data)
      message.success(t('common.updateSuccess'))
    }
    drawerVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formRef.value?.resetFields()
  formData.value = {
    id: '',
    tagCategory: '',
    tagName: '',
    tagColor: '',
    tagSymbol: '',
    rangeUse: '',
    isShow: '1'
  }
  selectedSymbolIds.value = []
  selectedSymbols.value = []
}

const storeRangeRef = ref()
/** 标签颜色列表 */
//状态对应的 css 类名
// 1. 红色：#ee6570
// 2. 绿色：#61D692
// 3. 蓝色：#6EB6ED
// 4. 黄色：#F8CF19
// 5. 青色：#83d5cc
// 6. 品红：#e8b8e8
// 7. 橙色：#edbf8a
// 8. 紫色：#CE9CFF
// 9. 粉色：#F7939B
interface OptionItem {
  label: string
  value: string
}
const colorList: OptionItem[] = [
  { label: '红色', value: '#ee6570' },
  { label: '绿色', value: '#61D692' },
  { label: '蓝色', value: '#6EB6ED' },
  { label: '黄色', value: '#F8CF19' },
  { label: '青色', value: '#83d5cc' },
  { label: '品红', value: '#e8b8e8' },
  { label: '橙色', value: '#edbf8a' },
  { label: '紫色', value: '#CE9CFF' },
  { label: '粉色', value: '#F7939B' }
]
const formatIconBg = (value) => {
  const colorMap = {
    '#ee6570': 'color_red',
    '#61D692': 'color_green',
    '#6EB6ED': 'color_blue',
    '#F8CF19': 'color_yellow',
    '#83d5cc': 'color_cyan',
    '#e8b8e8': 'color_magenta',
    '#edbf8a': 'color_orange',
    '#CE9CFF': 'color_purple',
    '#F7939B': 'color_pink'
  }
  return colorMap[value] || 'ing'
}

/** 标签符号列表 */
const tagSymbolList = [
  { id: 1, symbol: 'A' },
  { id: 2, symbol: 'B' },
  { id: 3, symbol: 'C' },
  { id: 4, symbol: 'D' },
  { id: 5, symbol: 'E' },
  { id: 6, symbol: 'F' },
  { id: 7, symbol: 'G' },
  { id: 8, symbol: 'H' },
  { id: 9, symbol: 'I' },
  { id: 10, symbol: 'J' },
  { id: 11, symbol: 'K' },
  { id: 12, symbol: 'L' },
  { id: 13, symbol: 'M' },
  { id: 14, symbol: 'N' },
  { id: 15, symbol: 'O' },
  { id: 16, symbol: 'P' },
  { id: 17, symbol: 'Q' },
  { id: 18, symbol: 'R' },
  { id: 19, symbol: 'S' },
  { id: 20, symbol: 'T' },
  { id: 21, symbol: 'U' },
  { id: 22, symbol: 'V' },
  { id: 23, symbol: 'W' },
  { id: 24, symbol: 'X' },
  { id: 25, symbol: 'Y' },
  { id: 26, symbol: 'Z' },
  { id: 27, symbol: '0' },
  { id: 28, symbol: '1' },
  { id: 29, symbol: '2' },
  { id: 30, symbol: '3' },
  { id: 31, symbol: '4' },
  { id: 32, symbol: '5' },
  { id: 33, symbol: '6' },
  { id: 34, symbol: '7' },
  { id: 35, symbol: '8' },
  { id: 36, symbol: '9' }
]

const selectedSymbolIds = ref([]) // 用于存储已选择的符号的ID列表
const selectedSymbols = ref([]) // 用于存储已选择的符号对象列表

// 标签符号选择
const onSymbolClick = (symbol) => {
  // 点击的符号的id
  const symbolId = symbol.id
  // 检查当前符号是否已经被选中
  const index = selectedSymbolIds.value.indexOf(symbolId)
  if (index > -1) {
    // 如果已经选中，则取消选中
    selectedSymbolIds.value.splice(index, 1)
    selectedSymbols.value.splice(index, 1)
  } else {
    // 如果未选中，则添加到选中列表
    selectedSymbolIds.value.push(symbolId)
    selectedSymbols.value.push(symbol)
  }
  // 更新formData.tagSymbol为选中的符号字符串集合
  formData.value.tagSymbol = selectedSymbols.value.map((s) => s.symbol).join('')
  // console.log('选中的符号：', formData.value.tagSymbol)
}
</script>

<style lang="scss" scoped>
// 修改表单label的行高
:deep(.longlabel .el-form-item--default .el-form-item__label) {
  line-height: 1.5;
}
// 修改备注的文本框背景
:deep(.el-textarea__inner),
:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  background-color: #f8f8f9 !important;
  box-shadow: none !important;
}

:deep(.el-drawer){
  border-top-left-radius: 16px !important;
  border-bottom-left-radius: 16px !important;
  overflow: hidden !important;
}

// 背景颜色
:deep(.el-drawer__body){
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;
}
.drawer-wrapper {
  overflow: hidden;
  border-radius: 16px;
}

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
  padding: 20px 20px 20px 0;
  background-color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  margin-bottom: 12px;
}

.drawerFooter {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}

// 标签颜色
.status {
  border-radius: 12px;
  padding: 2px 8px;
  box-sizing: border-box;
  display: block;
  width: 100%;
  text-align: center;

  .icon {
    display: inline-block;
    width: 22px;
    height: 22px;
    border-radius: 4px;
    margin-right: 16px;
    vertical-align: middle;
  }
  .color_red {
    background-color: #ee6570;
  }
  .color_green {
    background-color: #61d692;
  }
  .color_blue {
    background-color: #6eb6ed;
  }
  .color_yellow {
    background-color: #f8cf19;
  }
  .color_cyan {
    background-color: #83d5cc;
  }
  .color_magenta {
    background-color: #e8b8e8;
  }
  .color_orange {
    background-color: #edbf8a;
  }
  .color_purple {
    background-color: #ce9cff;
  }
  .color_pink {
    background-color: #f7939b;
  }
}

// 标签符号
.tagSymbolItem {
  width: 25px;
  height: 25px;
  line-height: 25px;
  text-align: center;
  border-radius: 4px;
  background-color: #f8f8f9;
  margin: 0 10px 10px;
  font-weight: bold;
  cursor: pointer;
}
.tagSymbolItem_selected {
  color: #2693f8;
}
</style>
