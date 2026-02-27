<template>
  <el-table
    class="SWCommonTable"
    v-horizontal-scroll="'always'"
    v-loading="loading"
    :show-overflow-tooltip="showOverflowTooltip"
    ref="tableRef"
    :border="border"
    :header-cell-style="appStore.headerCellStyle"
    :stripe="stripe"
    :data="filters ? showTableData : data"
    fit
    :max-height="maxHeight || (lazy ? 690 : undefined)"
    :height="height"
    :row-key="rowKey"
    :span-method="spanMethod"
    :cell-class-name="cellClassName ?? CellClassName"
    :select-on-indeterminate="selectOnIndeterminate"
    :header-row-style="headerRowStyle"
    :cell-style="cellStyle"
    :row-style="rowStyle"
    :row-class-name="rowClassName"
    :tooltip-options="{
      hideAfter: 300,
      popperClass: 'z-index-9999',
      placement: 'right'
    }"
    :show-summary="showSummary"
    :summary-method="summaryMethod"
    @select="(val, row) => emit('select', val, row)"
    @select-all="(val) => emit('select', val)"
    @scroll="handleScroll"
    @cell-click="handleCellClick"
    @filter-change="(filters) => emit('filter-change', filters)"
    @cell-mouse-enter="handleMouseEnter"
  >
    <el-table-column
      v-for="item in options"
      :key="item.prop"
      :label="item.label"
      :fixed="item.type === 'options' ? 'right' : item.fixed"
      :align="item.align"
      :width="item.type === 'options' ? optionsMinWidth : item.width"
      :min-width="item.minWidth"
      :type="item.type"
      :show-overflow-tooltip="
        (item.showOverFlowTooltip === undefined ? showOverflowTooltip : item.showOverFlowTooltip) &&
        !item.isForm &&
        item.type !== 'selection' &&
        item.type !== 'options'
      "
      :tooltip-formatter="item.tooltipFormatter"
      :index="item?.indexMethod"
      :selectable="item.selectable"
      :formatter="item.formatter"
      :prop="item?.prop"
    >
      <template #header="{ column }">
        <div class="flex items-center">
          <slot :name="`${item.slotName || item.prop}_header`" :column="column">
            <div
              class="flex items-center"
              :class="{
                'justify-end': item.align === 'right',
                'justify-center': item.align === 'center'
              }"
            >
              <!-- 当前列为必填列时，表头标记红的* -->
              <span v-if="item.required" class="mr-2px color-#EB3737">*</span>

              <!-- 如果当前列标记为可筛选，表头展示筛选下拉框 -->
              <el-popover
                trigger="click"
                v-if="Object.keys(filterContent)?.includes(item.prop!) || item.filterKey"
                :show-arrow="false"
                :width="213"
                placement="bottom-start"
                :disabled="!data?.length"
                :hide-after="0"
                :show-after="0"
                @after-leave="filterKeyWord[item.prop!] = ''"
              >
                <template
                  v-if="item.filterType === 'string' || item.filterType === undefined"
                  #default
                >
                  <el-input
                    v-model="filterKeyWord[item.filterKey! || item.prop!]"
                    clearable
                    placeholder="请输入关键字"
                    class="mb-6px"
                    :suffix-icon="Search"
                  />
                  <el-checkbox
                    v-model="checkAll![item.filterKey || item.prop!]"
                    v-if="filterList[item.filterKey! || item.prop!]?.length"
                    :indeterminate="isIndeterminate"
                    @change="(val) => handleCheckAllChange(val, item.filterKey ?? item.prop!)"
                  >
                    全选
                  </el-checkbox>
                  <el-checkbox-group
                    v-if="filterList?.[item.filterKey ?? item.prop!]?.length"
                    v-model="filterContent[item.filterKey ?? item.prop!]"
                    class="max-h-240px overflow-y-auto overflow-x-hidden flex column"
                  >
                    <el-checkbox
                      v-for="ele in filterList[item.filterKey ?? item.prop!].filter((ele) => !!ele)"
                      :key="ele"
                      :value="ele"
                      :label="ele"
                    />
                  </el-checkbox-group>
                  <span v-else>没有匹配的筛选项</span>
                  <el-divider :style="{ margin: '6px -12px', width: 'calc(100% + 24px)' }" />
                  <div class="flex">
                    <el-button
                      type="primary"
                      @click="handleResetCurrentFilter(item.filterKey ?? item.prop!)"
                    >
                      重置当前
                    </el-button>
                    <el-button @click="handleResetAllFilter"> 重置所有 </el-button>
                  </div>
                </template>
                <template v-else #default> </template>

                <template #reference>
                  <div class="flex items-center">
                    <span>{{ column.label }}</span>
                    <el-icon
                      class="ml-4px"
                      :color="
                        filterContent[item.filterKey ?? item.prop!]?.length > 0 ? '#0064ff' : '#666'
                      "
                    >
                      <Filter />
                    </el-icon>
                  </div>
                </template>
              </el-popover>

              <!-- 如果没有标记可筛选，表头只展示label -->
              <span v-else>
                {{ column.label }}

                <el-link
                  type="info"
                  v-if="item.type === 'options' && props.pickUp"
                  :underline="false"
                  @click="handleHideOptions"
                >
                  <Icon :icon="isHideOptions ? 'ep:arrow-left' : 'ep:arrow-right'" :size="14" />
                </el-link>
              </span>
            </div>
          </slot>
          <span v-if="item.headertip" class="flex items-center h-min ml-4px">
            <el-tooltip :content="item.headertip" placement="top">
              <Icon icon="bi:question-circle" :size="13" />
            </el-tooltip>
          </span>
        </div>
      </template>
      <template
        v-if="['default', 'expand', 'options']?.includes(item.type!) || !item.type"
        #default="{ row, $index, column }"
      >
        <!-- 当前列标记为可编辑，展示表单 -->
        <div
          class="canEdit"
          :class="{
            'justify-end': item.align === 'right',
            'justify-center': item.align === 'center'
          }"
          v-if="row && item.isForm"
        >
          <el-form
            :model="row"
            :ref="
              (ele: FormInstance) => {
                if (!formRefs[$index]) {
                  formRefs[$index] = {} as Record<string, FormInstance | null>
                }
                formRefs[$index][item.prop!] = ele ? (ele as FormInstance) : null
              }
            "
            :rules="rules"
            class="flex-1"
            hide-required-asterisk
            :show-message="false"
          >
            <el-form-item
              :prop="item.prop"
              :rules="item.rules?.(row, $index, data)"
              class="formItemInTable"
              :ref="
                (ele: FormItemInstance) => {
                  if (!formItemRefs[$index]) {
                    formItemRefs[$index] = {} as Record<string, FormItemInstance | null>
                  }
                  formItemRefs[$index][item.prop!] = ele ? (ele as FormItemInstance) : null
                }
              "
            >
              <!-- label不放在form的label中，因为form的label不能响应tooltip -->
              <div
                :style="{
                  width:
                    typeof item.formLabelWidth === 'number'
                      ? item.formLabelWidth + 'px'
                      : item.formLabelWidth
                }"
              >
                <sw-text-tooltip :content="item.formLabel?.(row)">
                  {{ item.formLabel?.(row) }}
                </sw-text-tooltip>
              </div>

              <el-popover
                :disabled="formItemRefs[$index]?.[item.prop!]?.validateState !== 'error'"
                :show-arrow="false"
                :offset="4"
                :popper-style="{
                  padding: '6px',
                  minWidth: '0',
                  width: `calc(${(item.width ?? item.minWidth ?? 150) + 'px'} - 24px)`
                }"
                :hide-after="0"
              >
                <template #reference>
                  <div class="flex w-100%">
                    <slot
                      :name="item.slotName || item.prop"
                      :row="row"
                      :col="
                        item.transform
                          ? item.transform(row[item.prop as string], row, $index)
                          : row[item.prop as string]
                      "
                      :column="column"
                      :index="$index"
                    >
                    </slot>
                  </div>
                </template>

                <span class="color-[--el-color-danger] font-size-12px">{{
                  formItemRefs[$index]?.[item.prop!]?.validateMessage
                }}</span>
              </el-popover>
            </el-form-item>
          </el-form>
        </div>

        <!-- 内容插槽 -->
        <slot
          v-else-if="!item.isForm && !item.formatter && item.type !== 'options'"
          :name="item.slotName || item.prop"
          :row="row"
          :col="
            item.transform
              ? item.transform(row[item.prop as string], row, $index)
              : row[item.prop as string]
          "
          :column="column"
          :index="$index"
        >
          <!-- 根据设置的列的transform，转化内容，不会影响原始数据 -->
          <div class="py10px text-ellipsis-single">
            {{
              item.transform
                ? item.transform(row[item.prop as string], row, $index)
                : row[item.prop as string]
            }}
          </div>
        </slot>

        <div
          v-else-if="item.type === 'options'"
          :ref="(ele) => (optionsRef[$index] = ele)"
          class="w-[max-content]"
        >
          <slot
            name="options"
            v-bind="{
              row,
              column,
              index: $index,
              col: item.transform
                ? item.transform(row[item.prop as string], row, $index)
                : row[item.prop as string],
              optionsBtnsNum
            }"
          >
            <s-w-table-btns
              :options="btnsOptions?.[$index] || []"
              :row="row"
              :can-loading-btn="loadingBtns"
              :row-index="$index"
              :staticBtnsNum="optionsBtnsNum"
            />
          </slot>
        </div>
      </template>
    </el-table-column>
    <template #empty v-if="showEmpty">
      <slot name="empty">
        <img
          :style="{ width: emptySize, height: emptySize }"
          class="mt30px"
          src="@/assets/imgs/empty/empty1.png"
          alt=""
        />
        <div class="mb24px">暂无相关内容</div>
      </slot>
    </template>
  </el-table>
</template>
<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { useAppStore } from '@/store/modules/app'
import { handleCopyCode } from '@/utils/copyText'
import { FormInstance, FormItemInstance, FormRules, TableProps } from 'element-plus/es'
import html2canvas from 'html2canvas-plus'
import { deepEqual } from '@/utils/common'

const props = withDefaults(
  defineProps<
    TableProps<any> & {
      options: TableOption
      emptySize?: string
      downloadFileName?: string
      rowKey?: string
      loading?: boolean
      showEmpty?: boolean
      copyableCells?: string[]
      rules?: FormRules
      /**所有的筛选条件 */
      filters?: {
        [key: string]: string[]
      }
      /**懒加载 */
      lazy?: boolean
      /* 操作列配置 */
      btnsOptions?: any[][]
      /* 操作列可loading的按钮名称 */
      loadingBtns?: string[]
      /**操作列静态按钮最多数量 */
      staticBtnsNum?: number
      /**是否显示操作列的展开收起按钮 */
      pickUp?: boolean
    }
  >(),
  {
    selectOnIndeterminate: true,
    showEmpty: true,
    showOverflowTooltip: true,
    staticBtnsNum: 3,
    pickUp: true,
    border: true
  }
)

const emit = defineEmits([
  'select',
  'cell-click',
  'scroll',
  'filter-change',
  'update:filters',
  'reset-span',
  'update:loading',
  'change-filters',
  'cell-mouse-enter'
])

const appStore = useAppStore()
const tableRef = ref()
const message = useMessage()

const lazyLength = ref(20)
const formRefs = ref<{ [k: string]: FormInstance | null }[]>([])
const formItemRefs = ref<{ [k: string]: FormItemInstance | null }[]>([])
const isIndeterminate = ref(false)
const checkAll = ref<Record<string, boolean>>()

const optionsRef = ref<any[]>([])
const optionsMinWidth = ref(0)
const getOptionsColumnWidthSwitch = ref(false)
const optionsBtnsNum = ref(3)

const isHideOptions = computed({
  get: () => optionsBtnsNum.value === 0,
  set: (val) => (optionsBtnsNum.value = val ? 0 : props.staticBtnsNum)
})

const handleCheckAllChange = (val, key: string) => {
  if (val) {
    filterContent.value[key] = filterList.value[key]
    isIndeterminate.value = false
  } else {
    filterContent.value[key] = []
    isIndeterminate.value = false
  }
}

/** 筛选条件集合 */
const filterContent = computed({
  get: () => props.filters || [],
  set: (val) => {
    emit('update:filters', val)
    emit('change-filters', val)
  }
})

watch(
  () => props.data,
  () => getOptionsColumnWidth(),
  {
    immediate: true
  }
)

watch(
  () => props.btnsOptions,
  () => getOptionsColumnWidth(),
  {
    deep: true
  }
)

watch(
  () => optionsBtnsNum.value,
  () => getOptionsColumnWidth()
)

/** 计算操作列的宽度 */
async function getOptionsColumnWidth() {
  if (getOptionsColumnWidthSwitch.value) return
  getOptionsColumnWidthSwitch.value = true
  // 如果没有操作列，不执行
  if (props.options.findIndex((ele) => ele.type === 'options') < 0) return
  await nextTick()
  const res = optionsRef.value.map((_, index) => {
    return optionsRef.value[index]?.offsetWidth
  })
  optionsMinWidth.value = Math.max(...res.filter((i) => !!i), 47) + 27
  getOptionsColumnWidthSwitch.value = false
}

watch(
  () => filterContent.value,
  (val) => {
    emit('change-filters', val)
  },
  { deep: true }
)

/** 表头筛选浮窗中的输入框的关键字集合 */
const filterKeyWord = ref(
  Object.fromEntries(Object.keys(props.filters ?? {}).map((key) => [key, '']))
)

/**
 * 根据筛选条件映射一个数据，可以根据筛选信息灵活变更数据
 */
const showTableData = computed(() => {
  emit('reset-span')
  let data: any[] = [...filterData.value]
  if (props.lazy) data = data.slice(0, lazyLength.value)
  return data
})

/** 筛选出的数据 */
const filterData = computed(() => {
  const { data } = props
  const filters = filterContent.value
  const hasActiveFilter = Object.values(filters).some((values) => values.length > 0)
  return hasActiveFilter
    ? data.filter(
        (row) =>
          row.key === 'sumRow' ||
          Object.entries(filters).every(
            ([key, values]) => values.length === 0 || values.includes(row[key])
          )
      )
    : [...data]
})

const currentData = computed(() => (props.filters ? showTableData.value : props.data))

watch(
  filterContent,
  () => {
    if (props.lazy) lazyLength.value = 10
    emit('update:loading', true)
    // 重置行合并规则
    nextTick(() => {
      clearValidate()
      emit('update:loading', false)
    })
  },
  {
    deep: true
  }
)

const canExpend = computed(() => props.options.some((ele) => ele.type === 'expand'))
watch(
  () => currentData.value,
  (val) => {
    if (val.length === 0 || !canExpend.value) return
    nextTick(() => {
      tableRef.value?.toggleRowExpansion(currentData.value?.[0], true)

      currentData.value.forEach((item, index) => {
        if (index === 0) return
        tableRef.value?.toggleRowExpansion(item, false)
      })
    })
  }
)

const filterList = computed(() => {
  const res = Object.keys(filterContent.value).reduce(
    (result, key) => {
      const uniqueValues: string[] = [
        ...new Set(
          props.data
            .map((row) => row[key] as string)
            .filter((row) =>
              !!filterKeyWord.value[key] ? row?.includes(filterKeyWord.value?.[key]) : true
            )
        )
      ] as string[]
      result[key] = uniqueValues
      return result
    },
    {} as Record<string, string[]>
  )
  return res
})

async function exportable(downloadFileName = props.downloadFileName) {
  try {
    const canvas = await html2canvas(tableRef.value.$el)
    const img = canvas.toDataURL('image/png')
    // 创建一个a标签模拟点击进行下载
    const downloadLink = document.createElement('a')
    downloadLink.id = 'imgDownload'
    downloadLink.style.display = 'none'
    downloadLink.href = img
    downloadLink.download = downloadFileName!
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  } catch (error) {
    message.error('导出失败')
  }
}

function toggleRowSelection(row: any, type: boolean) {
  nextTick(() => {
    tableRef.value?.toggleRowSelection(row, type)
  })
}

function handleCellClick(row: any, column: any, cell: HTMLTableCellElement, event: Event) {
  emit('cell-click', row, column, cell, event)

  if (props.copyableCells && props.copyableCells.length) {
    if (props.copyableCells?.includes(column.rawColumnKey)) handleCopyCode(row[column.rawColumnKey])
  }
}

function CellClassName({ column }) {
  if (props.copyableCells?.includes(column.rawColumnKey)) return 'can-copy-cell'
  return ''
}

function getSelectionRows() {
  return tableRef.value.getSelectionRows()
}

/** 清空校验 */
function clearValidate(keys?: string[], rowIndex?: number) {
  if (!props.rules) return
  const validateKeys = keys ? keys : Object.keys(props.rules)
  function clearItem(i: number) {
    return validateKeys.map(async (key) => {
      const formItem = formRefs.value[i]?.[key] as FormInstance
      if (!formItem) return
      formItem.clearValidate()
    })
  }
  if (rowIndex) {
    clearItem(rowIndex)
  } else {
    const validationPromises = props.data.flatMap((_, index) => {
      return clearItem(index)
    })
    Promise.all(validationPromises)
  }
}

/**校验某几项的所有行 */
async function validateFileds(keys?: string[], rowIndex?: number, excludeIndexs?: number[]) {
  // 如果当前存在筛选条件，直接清除筛选
  await nextTick()

  const validateKeys = keys ? keys : Object.keys(props.rules!)

  function validateItem(i: number) {
    return validateKeys.map(async (key) => {
      if (excludeIndexs && excludeIndexs?.includes(i)) {
        return true
      }
      const formItem = formRefs.value[i]?.[key]
      if (!formItem) return Promise.resolve(true)
      try {
        await formItem.validate()
        return true
      } catch {
        return false
      }
    })
  }

  const validationPromises =
    rowIndex === 0 || rowIndex
      ? validateItem(rowIndex)
      : props.data.flatMap((_, index) => {
          return validateItem(index)
        })

  const results = await Promise.all(validationPromises)
  if (results.every((isValid) => isValid)) {
    return true
  } else {
    throw new Error('校验错误')
  }
}

function handleResetCurrentFilter(key: string) {
  emit('update:loading', true)
  filterContent.value[key] = []
  filterKeyWord.value[key] = ''
  checkAll.value![key] = false
  nextTick(() => {
    emit('update:loading', false)
  })
}

function handleResetAllFilter() {
  emit('update:loading', true)
  Object.assign(
    filterContent.value,
    Object.fromEntries(Object.keys(filterContent.value).map((key) => [key, []]))
  )
  Object.assign(
    filterKeyWord.value,
    Object.fromEntries(Object.keys(filterKeyWord.value).map((key) => [key, '']))
  )
  Object.assign(
    checkAll.value!,
    Object.fromEntries(Object.keys(filterKeyWord.value).map((key) => [key, false]))
  )
  nextTick(() => {
    emit('update:loading', false)
  })
}

const lazyLoading = ref(true)
function handleScroll(val) {
  emit('scroll', val)

  if (!props.lazy) return

  if (val.scrollTop % 1380 >= 0 && lazyLoading.value && lazyLength.value <= props.data.length) {
    lazyLoading.value = false
    lazyLength.value += 20

    const timer = setTimeout(() => {
      lazyLoading.value = true
      clearTimeout(timer)
    }, 100)
  }
}

function toggleRowExpansion(row: any, expanded?: boolean) {
  tableRef.value?.toggleRowExpansion(row, expanded)
}

function handleMouseEnter(row: any, column: any, cell: HTMLTableCellElement, event: Event) {
  if (!canExpend.value) return

  tableRef.value?.toggleRowExpansion(row, true)

  currentData.value.forEach((item) => {
    if (deepEqual(item, row)) return
    tableRef.value?.toggleRowExpansion(item, false)
  })

  emit('cell-mouse-enter', row, column, cell, event)
}

function handleHideOptions() {
  isHideOptions.value = !isHideOptions.value
}

onMounted(() => {
  if (props.filters) {
    checkAll.value = Object.fromEntries(Object.keys(props.filters).map((key) => [key, false]))
  }

  optionsBtnsNum.value = props.staticBtnsNum
})

defineExpose({
  showTableData,
  filterData,
  toggleRowSelection,
  exportable,
  getSelectionRows,
  validateFileds,
  clearValidate,
  toggleRowExpansion
})
</script>
<style lang="less" scoped>
* {
  --el-checkbox-height: 24px;
}

:deep(.el-table__empty-text) {
  // margin-right: 50px;
  display: flex;
  align-items: center;
  flex-direction: column;
  line-height: 1;
}

:deep(.el-table) {
  z-index: 0;
}

.canEdit {
  display: flex;
  align-items: center;
  width: 100%;
  // height: 64px;
  font-size: 14px;
  color: #333;
  line-height: 20px;
  // padding: 8px 0;

  :deep(.el-form-item) {
    // transform: translateY(9px);
    margin-bottom: 0;

    .el-form-item__content {
      display: flex;
      flex-wrap: nowrap;
    }
  }
}

.form-item-label {
  width: 84px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.formItemInTable {
  label {
    margin-right: 0;
  }
}

:deep(.el-checkbox) {
  min-height: 24px;
}

:deep(.el-table__cell) {
  padding: 0;
}

:deep(.text-ellipsis-single) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.is-leaf) {
  .cell {
    line-height: 40px;
  }
}
</style>

<style lang="less">
.z-index-9999 {
  z-index: 9999 !important;
}
</style>
