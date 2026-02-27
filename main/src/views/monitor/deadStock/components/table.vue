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
    :max-height="maxHeight || (lazy ? 640 : undefined)"
    :height="height"
    :row-key="rowKey"
    :span-method="spanMethod"
    :cell-class-name="cellClassName ?? CellClassName"
    :select-on-indeterminate="selectOnIndeterminate"
    :header-row-style="headerRowStyle"
    :cell-style="cellStyle"
    :row-style="rowStyle"
    :row-class-name="rowClassName"
    @select="(val, row) => emit('select', val, row)"
    @select-all="(val) => emit('select', val)"
    @scroll="handleScroll"
    @cell-click="handleCellClick"
    @filter-change="(filters) => emit('filter-change', filters)"
  >
    <el-table-column
      v-for="item in options"
      :key="item.prop"
      :label="item.label"
      :fixed="item.fixed"
      :align="item.align"
      :width="item.width"
      :min-width="item.minWidth"
      :type="item.type"
      :show-overflow-tooltip="
        item.showOverFlowTooltip === undefined ? showOverflowTooltip : item.showOverFlowTooltip
      "
      :tooltip-formatter="item.tooltipFormatter"
      :index="item?.indexMethod"
      :selectable="item.selectable"
    >
      <template #header="{ column }">
        <slot :name="`${item.prop}_header`" :column="column">
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
              v-if="
                (Object.keys(filterContent).includes(item.prop!) || item.filterKey) && data?.length
              "
              :show-arrow="false"
              :width="213"
              placement="bottom-start"
            >
              <el-input
                v-model="filterKeyWord[item.prop!]"
                clearable
                placeholder="请输入关键字"
                class="mb-6px"
                :suffix-icon="Search"
              />
              <el-checkbox-group
                v-if="filterList?.[item.filterKey ?? item.prop!]?.length"
                v-model="filterContent[item.filterKey ?? item.prop!]"
                class="max-h-240px overflow-y-auto overflow-x-hidden flex column"
              >
                <el-checkbox
                  v-for="ele in filterList[item.filterKey ?? item.prop!]"
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
              <template #reference>
                <div class="flex items-center">
                  <span>{{ column.label }}</span>
                  <el-icon
                    class="ml-4px"
                    :color="
                      filterContent[item.filterKey ?? item.prop!]?.length > 0 ? '#0064ff' : '#666'
                    "
                    ><Filter
                  /></el-icon>
                </div>
              </template>
            </el-popover>

            <!-- 如果没有标记可筛选，表头只展示label -->
            <span v-else>{{ column.label }}</span>
          </div>
        </slot>
      </template>
      <template v-if="item.type === 'default' || !item.type" #default="{ row, $index }">
        <!-- 当前列标记为可编辑，展示表单 -->
        <div class="canEdit" v-if="row && item.isForm">
          <el-form
            :model="row"
            :ref="`${item.prop}_${$index}`"
            :rules="rules"
            scroll-to-error
            hide-required-asterisk
          >
            <el-form-item
              :prop="item.prop"
              :rules="item.rules?.(row, $index, data)"
              class="formItemInTable"
            >
              <!-- 如果设置了label，展示label，最大长度6个字符，超长显示tooltip -->
              <el-tooltip
                v-if="item.formLabel"
                :content="item.formLabel?.(row)"
                :disabled="!computedTextLength(item.formLabel?.(row) ?? '', 6)"
              >
                <div class="form-item-label mr-8px">{{ item.formLabel?.(row) }}</div>
              </el-tooltip>
              <slot
                :name="item.slotName || item.prop"
                :row="row"
                :col="
                  item.transform
                    ? item.transform(row[item.prop as string], row, $index)
                    : row[item.prop as string]
                "
                :index="$index"
              >
              </slot>
            </el-form-item>
          </el-form>
        </div>

        <!-- 内容插槽 -->
        <slot
          v-else-if="!item.isForm"
          :name="item.slotName || item.prop"
          :row="row"
          :col="
            item.transform
              ? item.transform(row[item.prop as string], row, $index)
              : row[item.prop as string]
          "
          :index="$index"
        >
          <!-- 根据设置的列的transform，转化内容，不会影响原始数据 -->
          {{
            item.transform
              ? item.transform(row[item.prop as string], row, $index)
              : row[item.prop as string]
          }}
        </slot>
      </template>
    </el-table-column>
    <template #empty v-if="showEmpty">
      <img
        :style="{ width: emptySize, height: emptySize }"
        class="mt30px"
        src="@/assets/imgs/empty/empty1.png"
        alt=""
      />
      <div class="mb24px">暂无相关内容</div>
    </template>
  </el-table>
</template>
<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { useAppStore } from '@/store/modules/app'
import { handleCopyCode } from '@/utils/copyText'
import { FormInstance, FormRules, TableProps } from 'element-plus'
import html2canvas from 'html2canvas-plus'

const props = withDefaults(
  defineProps<
    TableProps<any> & {
      options: TableOption
      emptySize?: string
      downloadFileName?: string
      rowKey?: (row: any) => string
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
    }
  >(),
  {
    selectOnIndeterminate: true,
    showEmpty: true,
    showOverflowTooltip: true
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
  'change-filters'
])

const appStore = useAppStore()
const tableRef = ref()
const message = useMessage()

const lazyLength = ref(20)

const filterContent = computed({
  get: () => props.filters || [],
  set: (val) => {
    emit('update:filters', val)
    emit('change-filters', val)
  }
})

watch(
  () => filterContent.value,
  (val) => {
    emit('change-filters', val)
  },
  { deep: true }
)

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

const filterData = computed(() => {
  let data: any[] = [...props.data]
  if (!Object.values(filterContent.value).every((item) => item.length === 0)) {
    Object.entries(filterContent.value).forEach(([key, value]) => {
      if (value.length > 0) {
        data = data.filter((row) => value.includes(row[key]))
      }
    })
  }
  return data
})

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

const filterList = computed(() => {
  const res = Object.keys(filterContent.value).reduce(
    (result, key) => {
      const uniqueValues: string[] = [
        ...new Set(
          props.data
            .map((row) => row[key] as string)
            .filter((row) =>
              !!filterKeyWord.value[key] ? row.includes(filterKeyWord.value?.[key]) : true
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

async function exportable() {
  try {
    // 等待所有图片加载完成
    const images = tableRef.value.$el.querySelectorAll('img')
    await Promise.all(
      Array.from(images).map((img: any) => {
        if (img.complete) return Promise.resolve()
        return new Promise((resolve) => (img.onload = resolve))
      })
    )

    // 配置html2canvas以处理跨域图片
    const canvas = await html2canvas(tableRef.value.$el, {
      useCORS: true, // 允许加载跨域图片
      allowTaint: true, // 允许被污染的画布（跨域图片会污染画布）
      logging: false // 关闭日志输出
    })

    const img = canvas.toDataURL('image/png')
    const downloadLink = document.createElement('a')
    downloadLink.id = 'imgDownload'
    downloadLink.style.display = 'none'
    downloadLink.href = img
    downloadLink.download = props.downloadFileName!
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
    if (props.copyableCells.includes(column.rawColumnKey)) handleCopyCode(row[column.rawColumnKey])
  }
}

function CellClassName({ column }) {
  if (props.copyableCells?.includes(column.rawColumnKey)) return 'can-copy-cell'
  return ''
}

function getSelectionRows() {
  return tableRef.value.getSelectionRows()
}

// 获取表单
const instance = getCurrentInstance()
function getFormDOM(index: number, key: string) {
  const formRefName = `${key}_${index}`
  const form = instance?.refs[formRefName]
  if (form) {
    return form as FormInstance
  }
}

/** 清空校验 */
function clearValidate(keys?: string[], rowIndex?: number) {
  if (!props.rules) return
  const validateKeys = keys ? keys : Object.keys(props.rules)
  function clearItem(i: number) {
    return validateKeys.map(async (key) => {
      const formItem = getFormDOM(i, key)?.[0]
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
async function validateFileds(keys?: string[], rowIndex?: number) {
  // 如果当前存在筛选条件，直接清除筛选
  // if (props.filters) handleResetAllFilter()
  await nextTick()

  const validateKeys = keys ? keys : Object.keys(props.rules!)

  function validateItem(i: number) {
    return validateKeys.map(async (key) => {
      const formItem = getFormDOM(i, key)?.[0]
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
  return results.every((isValid) => isValid)
}

/**
 * 计算文本长度，并决定是否显示tooltip
 * @param text
 * @param maxLength
 */
function computedTextLength(text: string, maxLength: number) {
  const a = document.createElement('span')
  a.style.fontSize = '14px'
  a.innerHTML = text
  document.body.appendChild(a)
  const width = a.offsetWidth
  document.body.removeChild(a)
  return width > maxLength * 14
}

function handleResetCurrentFilter(key: string) {
  emit('update:loading', true)
  filterContent.value[key] = []
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
  nextTick(() => {
    emit('update:loading', false)
  })
}

const lazyLoading = ref(true)
function handleScroll(val) {
  emit('scroll', val)

  if (!props.lazy) return

  if (val.scrollTop % 1300 >= 0 && lazyLoading.value && lazyLength.value <= props.data.length) {
    lazyLoading.value = false
    lazyLength.value += 20

    const timer = setTimeout(() => {
      lazyLoading.value = true
      clearTimeout(timer)
    }, 100)
  }
}

const file = ref()
async function getFile() {
  try {
    // 获取表格中的所有图片元素
    const images = tableRef.value.$el.querySelectorAll('img')

    // 等待所有图片加载完成
    await Promise.all(
      Array.from(images).map((img: any) => {
        // 对跨域图片添加crossorigin属性
        if (img.src && !img.crossOrigin) {
          // 检查是否为跨域图片
          const isCrossOrigin = new URL(img.src).origin !== window.location.origin
          if (isCrossOrigin) {
            img.crossOrigin = 'anonymous'
          }
        }

        // 图片已加载完成则直接返回，否则等待加载完成
        if (img.complete) return Promise.resolve()
        return new Promise((resolve) => {
          img.onload = resolve
          // 处理图片加载失败的情况
          img.onerror = resolve
        })
      })
    )

    // 配置html2canvas以正确处理图片
    const canvas = await html2canvas(tableRef.value.$el, {
      useCORS: true, // 允许跨域图片
      allowTaint: true, // 允许被跨域图片污染的画布
      logging: false, // 关闭日志
      scale: window.devicePixelRatio, // 保持高清显示
      backgroundColor: null // 处理透明背景
    })

    const blob: any = await new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/png')
    })

    if (!blob) {
      throw new Error('无法将canvas转换为blob')
    }

    file.value = new File([blob], props.downloadFileName || 'table-export.png', {
      type: blob.type,
      lastModified: new Date().getTime()
    })

    return file.value
  } catch (error) {
    console.error('导出失败:', error)
    message.error('导出失败，请稍后重试')
    return null
  }
}

defineExpose({
  showTableData,
  filterData,
  toggleRowSelection,
  exportable,
  getSelectionRows,
  validateFileds,
  clearValidate,
  getFile
})
</script>
<style lang="less" scoped>
* {
  --el-checkbox-height: 24px;
}
:deep(.el-table__empty-text) {
  margin-right: 50px;
  line-height: 1;
}

:deep(.el-table) {
  z-index: 0;
}

.canEdit {
  display: flex;
  align-items: center;
  width: 100%;
  height: 64px;
  font-size: 14px;
  color: #333;
  line-height: 20px;

  :deep(.el-form-item) {
    transform: translateY(9px);

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
</style>
