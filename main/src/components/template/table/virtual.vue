<template>
  <div class="scheme-table" v-loading="loading" element-loading-text="数据加载中...,请稍后!">
    <div class="scheme-operate" v-if="isOperate">
      <el-form v-if="screen?.field" :inline="true" :model="searchData" class="scheme-operate-form">
        <el-form-item :label="screen.label">
          <el-checkbox-group v-model="searchData[screen.field]" @change="search">
            <el-badge v-for="item in screens" :value="stateInfo[item.value]" :max="max" :offset="[-22, 0]"
              color="#EB3737" :badge-style="{ height: '14px' }">
              <el-checkbox :value="item.value" :label="item.label" border />
            </el-badge>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span v-else class="list_name">{{ listName }}</span>
      <div class="scheme-operate-btn" v-if="!!btns?.length">
        <div v-for="(btn, index) in btns" :key="`btn_${btn.fun}_${index}`" class="table_btn"
          style="display: inline-block">
          <el-button v-if="btn.fun !== 'import' && !btn?.isCustom" :type="btn.type as any" :plain="btn?.plain || false"
            @click="btnClick(btn)" :disabled="btn?.disabled(btn) || false">
            {{ btn.txt }}
          </el-button>
          <el-upload v-if="btn.fun === 'import' && !!btn?.api" :action="uploadUrl(btn.api)" :show-file-list="false"
            :headers="uploadHeaders" :on-success="handleImportSuccess" :before-upload="() => (importBtnLoading = true)"
            :on-error="() => (importBtnLoading = false)" :disabled="importBtnLoading">
            <el-button> 导入 </el-button>
          </el-upload>
          <component v-if="!!btn.isCustom" :is="btn.customRender(btn)" />
        </div>
      </div>
    </div>
    <vxe-grid ref="tableRef" v-bind="gridOptions" class="grid_table">
      <template #custom_columns="{ row, column }">
        <component :is="getcolumnInfo(column).customRender(row, getcolumnInfo(column))" v-model="row[column.field]" />
      </template>
      <template #action="{ row }">
        <vxe-button v-for="(handle, index) in getRowHandles(row)" :key="`handle_${handle.fun}_${index}`" mode="text"
          :status="handle?.type || 'primary'" @click="handleClick(handle, row)">
          {{ handle.txt }}
        </vxe-button>
      </template>
      <template #empty>
        <img class="mt30px" src="@/assets/imgs/empty/empty1.png" alt="" />
        <div class="mb24px">暂无相关内容</div>
      </template>
    </vxe-grid>
    <el-pagination v-show="!!page?.total" class="pagination-page" ref="" v-model:current-page="page.page"
      v-model:page-size="page.size" :background="true" :page-sizes="page.sizes" :total="page.total" :pager-count="count"
      layout="total, sizes, prev, pager, next, jumper" @size-change="sizeChange" @current-change="currentChange" />
  </div>
</template>

<script lang="ts">
export default { name: 'SVTable' }
</script>

<script lang="ts" setup>
import { Column, FromProvideType, Screen, BtnItem } from '../config/type'
import { useRouteInfo } from '@/hooks/common/useRouteInfo'
import { useUserStore } from '@/store/modules/user'
import { cloneDeep, debounce } from 'lodash-es'
import { useCache } from '@/hooks/web/useCache'
import { getInfoLength } from '@/utils'
import download from '@/utils/download'
import request from '@/config/axios'
import router from '@/router'

const { getRouteInfo } = useRouteInfo()

const userStore = useUserStore(),
  { wsCache } = useCache(),
  message = useMessage()

const user: any = (userStore.user as any) || {},
  tableRef = ref(),
  importBtnLoading = ref(false)

const props = defineProps({
  screen: { type: Object, default: () => ({ ...new Screen() }) },
  handleColumn: { type: Array<any>, default: () => [] },
  tableData: { type: Array<any>, default: () => [] },
  btnList: { type: Array<any>, default: () => [] },
  column: { type: Array<any>, default: () => [] },
  isSelection: { type: Boolean, default: false },
  border: { type: String, default: 'border' },
  isOperate: { type: Boolean, default: true },
  listName: { type: String, default: '列表' },
  size: { type: String, default: 'small' },
  height: { type: Number, default: Infinity },
  isIndex: { type: Boolean, default: true },
  max: { type: Number, default: Infinity },
  pointer: { type: String, default: 'id' },
  name: { type: String, default: '' },
  mode: { type: String, default: '' },
  fieldKey: { type: String, default: 'id' }
})

const {
  page,
  searchData,
  stateInfo,
  loading,
  onSearch,
  setParamsData,
  viewDetails,
  onButtonClick
} = inject(`${props.name}Form`) as FromProvideType

const count = computed(() => (document.body.clientWidth < 992 ? 5 : 7))

const btns = computed(() =>
  cloneDeep([
    ...props.btnList
      .map((btn: any) => ({ ...new BtnItem(btn) }))
      .filter((bts: any) => !bts.display(bts))
  ])
)

const screens = computed(() =>
  props.screen?.options?.length
    ? cloneDeep([...props.screen.options.filter((sc: any) => !sc?.disabled)])
    : []
)

const selectRows = computed(() => tableRef?.value?.getCheckboxRecords())

const uploadHeaders = computed(() => ({
  token: wsCache.get('ACCESS_TOKEN') ? wsCache.get('ACCESS_TOKEN') : wsCache.get('ACCESS_TOKEN')
}));

const columnInfoMap = computed(() => {
  const map: Record<string, any> = {}
  props.column.forEach((col: any) => {
    const colInstance = { ...new Column(col) }
    if (colInstance.field) {
      map[colInstance.field] = colInstance
    }
  })
  return map
})

const getcolumnInfo = (col: any) => {
  return columnInfoMap.value[col.field] || { customRender: () => { } }
}

const handleColumnItems = computed(() =>
  props.handleColumn.map((hs: any) => ({ ...new BtnItem(hs) }))
)

const getRowHandles = (item: any) => {
  return handleColumnItems.value.filter((hs: any) => hs.reveal(item))
}

// const getcolumnInfo = (col: any) => {
//   const tar: any = columns.value.find((clu: any) => clu.field === col.field)
//   return tar && tar.field ? tar : { customRender: () => { } }
// }

const uploadUrl = (url: string) =>
  `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_API_URL}${url}`

const handleImportSuccess = (res: any) => {
  !!res?.success && message.success('导入成功')
  importBtnLoading.value = false
  onSearch()
}

const handleWidth = computed(() => {
  if (!props.tableData?.length || !props.handleColumn?.length) return 100

  const list = props.tableData
    .map((tbs: any) => {
      const btns = getRowHandles(tbs)
      const nums = btns
        .slice(0, 3)
        .map((trs: any) => Math.ceil(getInfoLength(trs.txt) + 15))
      if (btns.length > 3) nums.push(30)
      return nums.reduce((item: number, cur: number) => (cur += item), 0)
    })
    .sort((a: number, b: number) => a - b)

  return list[list.length - 1] + 30
})

const sizeChange = debounce((size: number) => {
  if (page.value.page * size > page.value.total) {
    if (page.value.page === 1) {
      page.value = { ...page.value, page: 1 }
      onSearch()
    } else {
      page.value = { ...page.value, page: 1 }
    }
  } else {
    onSearch()
  }
}, 500)

const currentChange = debounce(() => {
  onSearch()
}, 500)

const search = debounce(() => {
  onSearch()
}, 500)

const btnClick = (btn: any) => {
  if (btn.fun === 'export') {
    exportData(btn)
  } else if (btn.fun === 'add') {
    props.mode !== 'page' ? viewDetails('add') : tabView('add')
  } else {
    onButtonClick(btn)
  }
}

const handleClick = (btn: any, row: any) => {
  if (props.mode === 'page' && ['view', 'edit'].includes(btn.fun)) {
    tabView(btn.fun, row)
  } else {
    if (btn.fun === 'del') {
      delDataItem(btn, [row])
    } else {
      viewDetails(btn.fun, row, btn)
    }
  }
}

const delDataItem = (btn: BtnItem, list: Array<any>) => {
  message
    .confirm('请确认是否删除？')
    .then((res: any) => {
      if (res === 'confirm') {
        const loadingInstance = ElLoading.service({ lock: true, text: '数据删除中,请稍等...' })
        const dataParams: any =
          btn?.inputMethod === 'data'
            ? { url: btn.api, data: list }
            : { url: btn.api, params: list }
        !!btn?.method &&
          request[btn.method]({ ...dataParams })
            .then((rps: any) => {
              if (!!rps) {
                message.success('删除成功')
                onSearch()
              }
            })
            .finally(() => {
              loadingInstance.close()
            })
      }
    })
    .catch(() => { })
}

const tabView = (type: string, data: any = {}) => {
  let query: any = {}
  !!data[props.pointer] && (query.id = data[props.pointer])
  getRouteInfo(`${props.name}Details`) &&
    router.push({ path: getRouteInfo(`${props.name}Details`), query: { ...query, type } })
}

const exportData = async (btn: BtnItem) => {
  const loadingInstance = ElLoading.service({ lock: true, text: '文件导出中,请稍等...' })
  const dataParams: any =
    btn?.inputMethod === 'data'
      ? { url: btn.api, data: setParamsData(true) }
      : { url: btn.api, params: setParamsData(true) }
  !!btn?.method &&
    request[btn.method]({ ...dataParams })
      .then((res: any) => {
        res &&
          download.excel(
            res,
            `${btn?.exportName || `文件`}-${new Date().getTime()}-${user.realName}.xlsx`
          )
      })
      .finally(() => {
        loadingInstance.close()
      })
}

const resetVirtualScroll = debounce(() => {
  nextTick(() => {
    if (tableRef.value) {
      tableRef.value.refreshScroll()
      tableRef.value.setAllCheckboxRow(false)
    }
  })
}, 100)

const handleResize = debounce(() => {
  resetVirtualScroll()
}, 200)

watch(() => props.tableData, () => {
  resetVirtualScroll()
}, { immediate: true })

// 在窗口大小变化时重置
window.addEventListener('resize', handleResize)

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const columns = computed(() => {
  let defaultColumns: any = props.column.map((col: any) => {
    const colInstance = new Column(col)
    return {
      ...col,
      field: colInstance.field,
      title: colInstance.title,
      fixed: colInstance.fixed || null,
      align: colInstance.align || 'left',
      showOverflow: !colInstance.isCustom,
      sortable: !!colInstance.sort,
      width: colInstance.minWidth ? undefined : (colInstance.width || 120),
      minWidth: colInstance.minWidth || undefined
    }
  })

  if (props.isIndex) {
    defaultColumns.unshift({
      field: 'index',
      type: 'seq',
      width: 60,
      title: '序号',
      fixed: 'left',
      align: 'center'
    })
  }

  if (props.isSelection) {
    defaultColumns.unshift({
      field: 'checkbox',
      type: 'checkbox',
      width: 60,
      fixed: 'left',
      align: 'center'
    })
  }

  if (props?.handleColumn?.length) {
    defaultColumns.push({
      field: 'operation',
      title: '操作',
      width: handleWidth.value,
      fixed: 'right',
      slots: { default: 'action' }
    })
  }

  return defaultColumns
})

const gridOptions = computed(() => ({
  border: true,
  size: props.size,
  keyField: props.fieldKey,
  columnConfig: { resizable: true, useKey: true },
  rowConfig: {
    keyField: props.fieldKey,
    useKey: true,
    isHover: true
  },
  headerCellStyle: {
    backgroundColor: '#F2F6FC',
    color: '#666',
    fontWeight: '500',
    fontSize: '14px'
  },
  maxHeight: props.height,
  virtualYConfig: {
    enabled: true,
    gt: 0,
    oSize: 30,
    mode: 'wheel',
    immediate: true,
    scrollToTopOnChange: true
  },
  virtualXConfig: {
    enabled: true,
    gt: 0,
    oSize: 30,
    mode: 'wheel',
    immediate: true,
    scrollToLeftOnChange: true
  },
  animConfig: {
    createRow: false,
    removeRow: false
  },
  data: props.tableData,
  expandConfig: { mode: 'inside' },
  columns: columns.value.map((col: any) => {
    let line: any = {
      field: col.field,
      title: col.title,
      fixed: col?.fixed || null,
      align: col?.align || 'left',
      type: col?.type || null,
      showOverflow: !col?.isCustom,
      sortable: !!col?.sort,
      slots: col?.isCustom ? { default: 'custom_columns' } : col?.slots || {}
    }
    if (!!col?.minWidth) {
      line.minWidth = col.minWidth
    } else {
      line.width = col.width || 120
    }
    return line
  })
}))

defineExpose({ selectRows })
</script>

<style lang="scss" scoped>
@use './style.scss';

.scheme-table {
  .grid_table {
    :deep() {
      .vxe-cell--label {
        cursor: pointer !important;
      }

      .vxe-cell {
        padding: 6px 16px !important;
        font-size: 14px;
      }

      .vxe-table--render-default .vxe-cell--checkbox.is--checked,
      .vxe-table--render-default .vxe-cell--checkbox.is--checked .vxe-checkbox--icon,
      .vxe-table--render-default .vxe-cell--checkbox.is--indeterminate,
      .vxe-table--render-default .vxe-cell--checkbox.is--indeterminate .vxe-checkbox--icon {
        color: #0064ff;
      }

      .vxe-button--item {
        font-size: 14px;
      }

      .el-input-number {
        .el-input__inner {
          text-align: left;
        }
      }

      .vxe-table--column {
        vertical-align: middle;
      }

      .vxe-button.type--text.theme--danger {
        color: #eb3737;
      }
    }

    ::-webkit-scrollbar {
      width: 12px;
      height: 12px;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 4px;
    }
  }

  :deep() {
    .el-upload {
      display: inline-block;
    }
  }
}
</style>
