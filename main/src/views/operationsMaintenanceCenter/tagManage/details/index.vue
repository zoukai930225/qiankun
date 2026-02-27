<template>
  <scheme-details ref="detailsRef" name="TagManage" :width="968">
    <template #card>
      <div class="drawerContent">
        <el-form
          class="dialogForm"
          ref="formRef"
          v-loading="loading"
          :model="dataValue"
          :rules="formRules"
          label-width="110px"
          :disabled="isView"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="标签类别" prop="tagCategory" required>
                <el-select
                  class="dialogFormItemWidth"
                  v-model="dataValue.tagCategory"
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
            </el-col>
            <el-form-item label="是否显示" prop="isShow" required>
              <el-switch
                style="--el-switch-on-color: #0064ff"
                v-model="dataValue.isShow"
                :active-value="'1'"
                :inactive-value="'0'"
              />
            </el-form-item>
          </el-row>
          <el-form-item label="标签名称" prop="tagName" class="longlabel" required>
            <el-input
              class="dialogFormItemWidth"
              v-model="dataValue.tagName"
              placeholder="填写标签名称"
            />
          </el-form-item>

          <el-form-item label="标签颜色" prop="tagColor" required>
            <el-select
              class="dialogFormItemWidth"
              v-model="dataValue.tagColor"
              placeholder="请选择"
              clearable
              style="width: 160px"
            >
              <template #label>
                <span class="status">
                  <span class="icon" :class="formatIconBg(dataValue.tagColor)"></span>
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
                  <span>{{ dict.label }}</span>
                </span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="标签符号" prop="tagSymbol" required>
            <el-input
              class="dialogFormItemWidth"
              v-model="dataValue.tagSymbol"
              placeholder="请选择标签符号"
              readonly
            />
          </el-form-item>
          <el-form-item label="">
            <div class="tagSymbolList">
              <div
                v-for="item in tagSymbolList"
                :key="item.id"
                class="tagSymbolItem"
                :class="{ tagSymbolItem_selected: selectedSymbolIds.includes(item.id) }"
                @click="onSymbolClick(item)"
              >
                {{ item.symbol }}
              </div>
            </div>
          </el-form-item>

          <el-form-item label="应用范围" prop="rangeUse">
            <el-input
              class="dialogFormItemWidth"
              v-model="dataValue.rangeUse"
              placeholder="请选择应用范围"
              @click="openStoreRange"
              readonly
            />
          </el-form-item>
        </el-form>
      </div>
    </template>
    <template #button>
      <el-button @click="detailsRef?.close()">取 消</el-button>
      <el-button v-if="!isView" :disabled="loading" type="primary" @click="submitForm">
        {{ viewType === 'add' ? '保 存' : '提 交' }}
      </el-button>
    </template>
  </scheme-details>
  <StoreRange ref="storeRangeRef" @submit="onRangeUseSubmit" />
</template>

<script lang="tsx">
export default { name: 'TagManageDetails' }
</script>

<script lang="tsx" setup>
import { FromProvideType } from '@/components/template/config/type'
import { cloneDeep } from 'lodash-es'
import { DataItem } from '../page/config'
import * as TagMngApi from '@/api/tagMng'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { StoreRange } from '@/components/StoreRange'

const message = useMessage()
const { t } = useI18n()

const { onSearch } = inject(`TagManageForm`) as FromProvideType

const detailsRef = ref<any>(),
  formRef = ref(),
  dataValue = ref<DataItem>({ ...new DataItem(), isShow: '1' }),
  bukValue = ref<DataItem>({ ...new DataItem() }),
  viewType = ref<'add' | 'edit' | 'view'>('add'),
  loading = ref<boolean>(false)

const storeRangeRef = ref<any>()
const selectedSymbolIds = ref<Array<number>>([])
const selectedSymbols = ref<Array<{ id: number; symbol: string }>>([])

const isView = computed(() => viewType.value === 'view')
const title = computed(() =>
  viewType.value === 'add' ? '新增标签' : viewType.value === 'edit' ? '编辑标签' : '查看标签'
)

const formRules = reactive({
  tagCategory: [{ required: true, message: '请选择标签类别', trigger: 'change' }],
  tagName: [
    { required: true, message: '请填写标签名称', trigger: 'blur' },
    { max: 20, message: '标签名称长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  tagColor: [{ required: true, message: '请选择标签颜色', trigger: 'change' }],
  tagSymbol: [{ required: true, message: '请选择标签符号', trigger: 'change' }],
  rangeUse: [{ required: true, message: '请选择应用范围', trigger: 'change' }]
})

const colorList = [
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

const formatIconBg = (value: string) => {
  const colorMap: Record<string, string> = {
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
  return colorMap[value] || 'color_default'
}

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

const resetForm = () => {
  dataValue.value = { ...new DataItem(), isShow: '1' }
  selectedSymbolIds.value = []
  selectedSymbols.value = []
  formRef.value?.resetFields()
}

const getSymbolDisplay = (tagSymbol: string) => {
  selectedSymbolIds.value = []
  selectedSymbols.value = []
  if (!tagSymbol) return
  tagSymbol.split('').forEach((symbol) => {
    const found = tagSymbolList.find((item) => item.symbol === symbol)
    if (found) {
      selectedSymbolIds.value.push(found.id)
      selectedSymbols.value.push(found)
    }
  })
  dataValue.value.tagSymbol = selectedSymbols.value.map((item) => item.symbol).join('')
}

const openStoreRange = () => {
  if (isView.value) return
  storeRangeRef.value?.open(dataValue.value.rangeUse)
}

const onRangeUseSubmit = (val: any) => {
  if (val.currentIndex === 0) {
    dataValue.value.rangeUse = '全渠道'
  } else if (val.checkList.length) {
    dataValue.value.rangeUse = val.checkList.map((item: any) => item.shopName).join(',')
  } else {
    dataValue.value.rangeUse = ''
  }
}

const onSymbolClick = (symbol: { id: number; symbol: string }) => {
  if (isView.value) return
  const index = selectedSymbolIds.value.indexOf(symbol.id)
  if (index > -1) {
    selectedSymbolIds.value.splice(index, 1)
    selectedSymbols.value.splice(index, 1)
  } else {
    selectedSymbolIds.value.push(symbol.id)
    selectedSymbols.value.push(symbol)
  }
  dataValue.value.tagSymbol = selectedSymbols.value.map((s) => s.symbol).join('')
}

const fetchDetail = async (id: string) => {
  loading.value = true
  try {
    const data = await TagMngApi.getTagById({ id })
    if (data) {
      dataValue.value = { ...new DataItem(), ...data }
      getSymbolDisplay(data.tagSymbol || '')
    }
  } finally {
    loading.value = false
  }
}

const openView = (item: any = {}, type: string = 'add') => {
  detailsRef.value?.openDrawer(
    async () => {
      resetForm()
      viewType.value = (type as any) || 'add'
      if (type === 'add') {
        dataValue.value = { ...new DataItem(), isShow: '1' }
      } else if (item?.id) {
        await fetchDetail(item.id)
      } else {
        dataValue.value = { ...new DataItem(), ...item }
        getSymbolDisplay(item.tagSymbol || '')
      }
      bukValue.value = cloneDeep({ ...dataValue.value })
    },
    () => {
      nextTick(() => {
        formRef.value?.clearValidate()
      })
    }
  )
}

const submitForm = async () => {
  if (isView.value) return
  const valid = await formRef.value?.validate()
  if (!valid) return
  loading.value = true
  try {
    const payload: any = { ...dataValue.value }
    if (viewType.value === 'add') {
      payload.id = undefined
      await TagMngApi.addTag(payload)
      message.success(t('common.createSuccess'))
    } else {
      await TagMngApi.updateTag(payload)
      message.success(t('common.updateSuccess'))
    }
    bukValue.value = cloneDeep({ ...dataValue.value })
    detailsRef.value?.close()
    onSearch()
  } finally {
    loading.value = false
  }
}

defineExpose({ openView })

provide('TagManageDetails', { dataValue, bukValue, viewType, title })
</script>

<style lang="scss" scoped>
@use './styles.scss';

.drawerContent {
  width: 100%;
  padding: 20px 20px 20px 0;
  background-color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  margin-bottom: 12px;
}

.drawerRow {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.dialogFormItemWidth {
  width: 100%;
}

.status {
  display: flex;
  align-items: center;

  .icon {
    display: inline-block;
    width: 22px;
    height: 22px;
    border-radius: 4px;
    margin-right: 10px;
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

  .color_default {
    background-color: #f0f0f0;
  }
}

.tagSymbolList {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tagSymbolItem {
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  border-radius: 4px;
  background-color: #f8f8f9;
  font-weight: bold;
  cursor: pointer;
  user-select: none;
}

.tagSymbolItem_selected {
  color: #2693f8;
}

::deep(.el-textarea__inner),
::deep(.el-input__wrapper),
::deep(.el-select__wrapper) {
  background-color: #f8f8f9 !important;
  box-shadow: none !important;
}
</style>
