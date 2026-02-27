<script lang="tsx">
import { ElTable, ElTableColumn } from 'element-plus'
import { defineComponent, PropType, ref, computed, unref, watch, onMounted, Teleport } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { setIndex } from './helper'
import { getSlot } from '@/utils/tsxHelper'
import type { TableProps } from './types'
import { set, pickBy, isEmpty, isObject, isArray } from 'lodash-es'
import { TableColumn, TableSetPropsType, TableSlotDefault } from './table'
import Pagination from './SPagination.vue'
import { useAppStore } from '@/store/modules/app'
import emptyImage from '@/assets/imgs/empty/empty1.png'
import { nextFrameTick } from '@/utils/util'
import { cellValue } from './util'

export default defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  name: 'STable',
  props: {
    /** 是否显示多选列 */
    selection: propTypes.bool.def(false),
    /** 是否所有的超出隐藏，优先级低于column中的showOverflowTooltip */
    showOverflowTooltip: propTypes.bool.def(true),
    /** 是否显示分页 */
    showPagination: propTypes.bool.def(true),
    /** 分页器配置项 */
    paginationOptions: propTypes.object.def({}),
    /** 分页参数名称映射 默认page和size */
    paginationMap: propTypes.object.def({
      pageNum: 'page', // 页码
      pageSize: 'size' // 每页条数
    }),
    /** 初始页码 */
    initialPage: propTypes.number.def(1),
    /** 初始每页条数 */
    initialPageSize: propTypes.number.def(10),
    /** 表格列配置 */
    columns: {
      type: Array as PropType<TableColumn[]>,
      default: () => []
    },
    /** 是否显示展开行 */
    expand: propTypes.bool.def(false),
    /** 数据获取函数 */
    fetch: propTypes.func,
    /** 数据获取参数 */
    fetchParams: propTypes.object.def({}),
    /** 数据获取后的处理函数 */
    afterFetch: propTypes.func,
    /** 直接传入的表格数据 */
    data: {
      type: Array as PropType<any[]>,
      default: () => []
    },
    /** 多选是否保留选中数据（需指定 row-key） */
    reserveSelection: propTypes.bool.def(false),
    /** 是否叠加索引 */
    reserveIndex: propTypes.bool.def(false),
    /** 表格内容对齐方式 */
    align: propTypes.string
      .validate((v: string) => ['left', 'center', 'right'].includes(v))
      .def('center'),
    /** 表头对齐方式 */
    headerAlign: propTypes.string
      .validate((v: string) => ['left', 'center', 'right'].includes(v))
      .def('center'),
    /** 是否显示加载状态 */
    showLoading: propTypes.bool.def(true),
    /** 是否自动加载数据 */
    autoLoad: propTypes.bool.def(true),
    sortMultiple: propTypes.bool.def(false),
    /** 排序是否具有排他性（仅允许一个字段排序，结合 sortMultiple 使用） */
    sortExclusive: propTypes.bool.def(false),
    sortChange: propTypes.func.def(() => {}),
    paginationTeleport: propTypes.string.def(''),
    loading: propTypes.bool.def(false)
  },
  emits: ['register', 'pagination-change'],
  setup(props, { attrs, slots, emit, expose }) {
    const elTableRef = ref<ComponentRef<typeof ElTable>>()
    const loading = ref(false)
    const appStore = useAppStore()

    /**
     * @description 组件挂载时注册表格实例并获取初始数据
     */
    onMounted(async () => {
      const tableRef = unref(elTableRef)
      emit('register', tableRef?.$parent, elTableRef.value)

      // 渲染时根据列配置的 defaultSort 初始化多列排序的高亮状态（仅设置状态，不触发事件）
      if (props.sortMultiple) {
        resetHeaderSortToDefault()
      }
      if (props.autoLoad) {
        fetchData()
      }
    })

    const tableData = ref<Array<any>>([])

    const tablePagination = ref({
      currentPage: props.initialPage,
      pageSize: props.initialPageSize,
      total: 0
    })

    /**
     * @description 多列排序状态（仅用于自定义表头排序时记录顺序与高亮）
     */
    const headerSortStates = ref<Array<{ prop: string; order: 'ascending' | 'descending' }>>([])

    function getHeaderOrder(prop: string): 'ascending' | 'descending' | null {
      const found = headerSortStates.value.find((s) => s.prop === prop)
      return found ? found.order : null
    }

    function setHeaderSort(prop: string, order: 'ascending' | 'descending' | null) {
      // 排他或单列排序时，先清空再处理，避免对已清空的数组使用旧索引
      if (!props.sortMultiple || props.sortExclusive) {
        headerSortStates.value = []
      }
      // 重新计算索引（可能在上面被清空）
      const idx = headerSortStates.value.findIndex((s) => s.prop === prop)

      if (!order) {
        if (idx > -1) headerSortStates.value.splice(idx, 1)
      } else if (idx > -1) {
        headerSortStates.value[idx].order = order
      } else {
        headerSortStates.value.push({ prop, order })
      }

      // 触发对外排序事件
      props.sortChange?.({
        column: undefined,
        prop,
        order,
        sorts: headerSortStates.value.slice()
      })
    }

    /**
     * @description 重置多列排序为列定义的 defaultSort 状态（不触发 sortChange）
     */
    function resetHeaderSortToDefault() {
      if (!props.sortMultiple) {
        headerSortStates.value = []
        return
      }
      const flatten = (cols: TableColumn[] = []): TableColumn[] => {
        const acc: TableColumn[] = []
        for (const c of cols) {
          acc.push(c)
          if (c.children && c.children.length) acc.push(...flatten(c.children))
        }
        return acc
      }
      const allColumns = flatten(props.columns || [])
      const initialStates: Array<{ prop: string; order: 'ascending' | 'descending' }> = []
      for (const col of allColumns) {
        const dir = (col as any).defaultSort
        if (dir === 'asc' || dir === 'desc') {
          initialStates.push({
            prop: col.prop,
            order: dir === 'asc' ? 'ascending' : 'descending'
          })
        }
      }
      headerSortStates.value =
        props.sortExclusive && initialStates.length ? [initialStates[0]] : initialStates
    }

    /**
     * @description 获取表格数据
     * @returns {Promise<void>}
     */
    async function fetchData() {
      if (props.fetch) {
        try {
          if (props.showLoading) {
            loading.value = true
            await nextFrameTick()
          }
          const { pageNum, pageSize } = props.paginationMap || {
            pageNum: 'page',
            pageSize: 'size'
          }
          const params = {
            ...pickBy(props.fetchParams, (value) => {
              // 过滤 null, undefined, 空字符串
              if (value === null || value === undefined || value === '') {
                return false
              }
              // 过滤空数组
              if (isArray(value) && value.length === 0) {
                return false
              }
              // 过滤空对象 (但保留 Date 等其他对象类型)
              if (
                isObject(value) &&
                !isArray(value) &&
                !(value instanceof Date) &&
                isEmpty(value)
              ) {
                return false
              }
              return true
            })
          }
          params[pageNum] = tablePagination.value.currentPage
          params[pageSize] = tablePagination.value.pageSize

          console.log('fetch params 请求参数', params)

          const fetchFunc = props.fetch
          // if (typeof fetchFunc === 'function' && fetchFunc.length === 0) {
          //   const result = fetchFunc
          //   if (typeof result === 'function') {
          //     fetchFunc = result
          //   }
          // }

          // 调用函数获取数据
          const response = typeof fetchFunc === 'function' ? await fetchFunc(params) : {}

          // 处理不同的API响应格式
          let records: any[] = []
          let total = 0

          if (response.records && response.total !== undefined) {
            // 直接 records/total 格式
            records = Array.isArray(response.records) ? response.records : []
            total = response.total || 0
          } else if (response.code === 200 && response.data) {
            // 带有 code/data 包装的旧格式
            if (response.data.records) {
              records = Array.isArray(response.data.records) ? response.data.records : []
              total = response.data.total || 0
            } else if (Array.isArray(response.data)) {
              // data 中直接是数组
              records = response.data
              total = response.data.length
            } else {
              records = []
              total = 0
            }
          } else {
            // 兜底处理
            records = []
            total = 0
          }

          // 如果有 afterFetch 处理函数，对 records 进行处理
          if (props.afterFetch && typeof props.afterFetch === 'function') {
            records = props.afterFetch(records) || records
          }

          tableData.value = records
          tablePagination.value.total = total

          // 数据获取后发出分页变化事件
          emitPaginationChange()
        } catch (error) {
          console.error('获取表格数据失败:', error)
          tableData.value = []
          tablePagination.value.total = 0
        } finally {
          if (props.showLoading) loading.value = false
        }
      }
    }

    /**
     * @description 触发分页变化事件
     */
    function emitPaginationChange() {
      emit('pagination-change', {
        page: tablePagination.value.currentPage,
        pageSize: tablePagination.value.pageSize,
        total: tablePagination.value.total
      })
    }

    /**
     * @description 刷新表格数据
     * @param {boolean} resetPagination 是否重置分页参数
     */
    function refresh(resetPagination: boolean = false) {
      // 重置分页参数到初始值
      if (resetPagination) {
        tablePagination.value.currentPage = props.initialPage
        // tablePagination.value.pageSize = props.initialPageSize
      }
      fetchData()
    }

    /**
     * @description 监听数据源变化，更新表格
     */
    watch(
      () => props.data,
      (newData) => {
        if (newData && newData.length > 0) {
          // 设置分页总数
          const fullData = Array.isArray(newData) ? newData : []
          tablePagination.value.total = fullData.length

          if (props.showPagination) {
            // 计算当前页的起始和结束索引
            const startIndex =
              (tablePagination.value.currentPage - 1) * tablePagination.value.pageSize
            const endIndex = Math.min(startIndex + tablePagination.value.pageSize, fullData.length)

            // 设置当前页的数据
            tableData.value = fullData.slice(startIndex, endIndex)
          } else {
            // 如果禁用分页，显示所有数据
            tableData.value = fullData
          }

          // 数据更新后触发分页变化事件
          emitPaginationChange()
        } else {
          tableData.value = []
          tablePagination.value.total = 0
        }
      },
      { immediate: true, deep: true }
    )

    // /**
    //  * @description 监听请求参数变化，重新获取数据
    //  */
    // watch(
    //   () => props.fetchParams,
    //   () => {
    //     fetchData()
    //   },
    //   { deep: true }
    // )

    /**
     * @description 监听初始分页参数变化
     */
    watch(
      () => [props.initialPage, props.initialPageSize],
      ([newPage, newPageSize]) => {
        // 只有当值实际发生变化时才更新
        if (tablePagination.value.currentPage !== newPage) {
          tablePagination.value.currentPage = newPage
        }
        if (tablePagination.value.pageSize !== newPageSize) {
          tablePagination.value.pageSize = newPageSize
        }
      }
    )

    /**
     * @description 处理分页变化
     * @param {object} val 分页参数
     * @param {number} val.page 页码
     * @param {number} val.limit 每页条数
     */
    function handlePagination(val: { page: number; limit: number }) {
      tablePagination.value.currentPage = val.page
      tablePagination.value.pageSize = val.limit

      if (props.fetch) {
        fetchData()
      } else if (props.data && props.data.length > 0) {
        // 处理本地数据分页
        const fullData = Array.isArray(props.data) ? props.data : []
        const startIndex = (val.page - 1) * val.limit
        const endIndex = Math.min(startIndex + val.limit, fullData.length)
        tableData.value = fullData.slice(startIndex, endIndex)

        // 触发分页变化事件
        emitPaginationChange()
      }
    }

    // 外部传入的props
    const outsideProps = ref<TableProps>({})

    const mergeProps = ref<TableProps>({})

    /**
     * @description 获取合并后的属性
     */
    const getProps = computed(() => {
      const propsObj = { ...props }
      Object.assign(propsObj, unref(mergeProps))
      return propsObj
    })

    /**
     * @description 设置表格属性
     * @param {TableProps} props 表格属性
     */
    const setProps = (props: TableProps = {}) => {
      mergeProps.value = Object.assign(unref(mergeProps), props)
      outsideProps.value = props
    }

    /**
     * @description 设置列属性
     * @param {TableSetPropsType[]} columnProps 列属性配置数组
     * @param {TableColumn[]} columnsChildren 子列数组
     */
    const setColumn = (columnProps: TableSetPropsType[], columnsChildren?: TableColumn[]) => {
      const { columns } = unref(getProps)
      for (const v of columnsChildren || columns) {
        for (const item of columnProps) {
          if (v.prop === item.prop) {
            set(v, item.path, item.value)
          } else if (v.children?.length) {
            setColumn(columnProps, v.children)
          }
        }
      }
    }

    const selections = ref<Recordable[]>([])

    /**
     * @description 处理选择变化
     * @param {Recordable[]} selection 选中的行数据
     */
    // const selectionChange = (selection: Recordable[]) => {
    //   selections.value = selection
    //   emit('selection-change', selection)
    // }

    /**
     * @description 设置加载状态
     * @param {boolean} value 加载状态值
     */
    async function setLoading(value: boolean) {
      loading.value = value
      if (value) {
        await nextFrameTick()
      }
    }

    /**
     * @description 暴露组件方法和属性
     */
    expose({
      setProps,
      setColumn,
      selections,
      refresh,
      setLoading,
      getPagination: () => tablePagination.value,
      setPagination: (page: number, pageSize: number) => {
        tablePagination.value.currentPage = page
        tablePagination.value.pageSize = pageSize
        if (props.fetch || (props.data && props.data.length > 0)) {
          handlePagination({ page, limit: pageSize })
        }
      },
      // 手动重置排序为列定义的 defaultSort
      resetSortToDefault: resetHeaderSortToDefault,
      getTableRef: () => elTableRef.value
    })

    /**
     * @description 分页配置计算属性
     */
    const pagination = computed(() => {
      return Object.assign(
        {
          small: false,
          background: true,
          pagerCount: document.body.clientWidth < 992 ? 5 : 7,
          layout: 'total, sizes, prev, pager, next, jumper',
          disabled: false,
          hideOnSinglePage: false,
          pageSizes: [10, 20, 25, 30, 50, 100],
          total: tablePagination.value.total
        },
        tablePagination.value,
        unref(getProps).paginationOptions
      )
    })

    /**
     * @description 计算绑定的属性值
     */
    const getBindValue = computed(() => {
      const bindValue: Recordable = { border: false, ...attrs, ...props }
      delete bindValue.columns
      delete bindValue.data
      return bindValue
    })

    /**
     * @description 默认空状态渲染（支持外部 #empty 覆盖）
     */
    const renderEmpty = () => {
      const slotContent = getSlot(slots, 'empty')
      if (slotContent) return slotContent
      return (
        <div class="flex flex-col items-center justify-center mt-100px mb-100px">
          <img class="h-188px" src={emptyImage} alt="empty" />
          <span class="text-#909399 text-14px">暂无相关内容</span>
        </div>
      )
    }

    const renderHeader = (v: TableColumn) => {
      // 如果配置了 customRenderHeader，优先使用
      if (v.customRenderHeader) {
        return v.customRenderHeader()
      }

      // 如果配置了排序且启用了多列排序，渲染排序表头
      if (v.sortable && props.sortMultiple) {
        const current = getHeaderOrder(v.prop)
        return (
          <div
            class="swtable-header-sort cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              const next =
                current === 'ascending'
                  ? 'descending'
                  : current === 'descending'
                    ? null
                    : 'ascending'
              setHeaderSort(v.prop, next as any)
            }}
          >
            <span class="lh-23px">{getSlot(slots, `${v.prop}-header`) || v.label}</span>
            <div class="flex flex-col items-center justify-center relative cursor-pointer h-14px w-24px mt-2px">
              <i class={['sort-caret ascending', current === 'ascending' ? 'active' : '']}></i>
              <i class={['sort-caret descending', current === 'descending' ? 'active' : '']}></i>
            </div>
          </div>
        )
      }

      return getSlot(slots, `${v.prop}-header`) || v.label
    }

    /**
     * @description 渲染表格选择列
     * @returns {VNode | undefined} 表格选择列
     */
    const renderTableSelection = (column: TableColumn) => {
      return (
        <ElTableColumn
          type="selection"
          {...column}
          reserveSelection={column.reserveSelection || props.reserveSelection}
          align={column.align}
          headerAlign={column.headerAlign}
          width="50"
        ></ElTableColumn>
      )
    }

    /**
     * @description 渲染表格展开行
     * @returns {VNode | undefined} 表格展开行
     */
    const renderTableExpand = () => {
      const { align, headerAlign, expand } = unref(getProps)
      return expand ? (
        <ElTableColumn type="expand" align={align} headerAlign={headerAlign}>
          {{
            // @ts-ignore
            default: (data: TableSlotDefault) => getSlot(slots, 'expand', data)
          }}
        </ElTableColumn>
      ) : undefined
    }

    /**
     * @description 渲染树形表格列
     * @param {TableColumn[]} columnsChildren 列配置
     * @returns {VNode[]} 表格列节点
     */
    const rnderTreeTableColumn = (columnsChildren: TableColumn[]) => {
      const { align, headerAlign, showOverflowTooltip } = unref(getProps)
      return columnsChildren.map((v) => {
        const props = { ...v }
        if (props.children) delete props.children
        // 多列排序启用时，不把 sortable 传给 ElTableColumn，避免内置排序干扰
        if (unref(getProps).sortMultiple && (props as any).sortable) {
          delete (props as any).sortable
        }
        return (
          <ElTableColumn
            showOverflowTooltip={showOverflowTooltip}
            align={align}
            headerAlign={headerAlign}
            {...props}
            prop={v.prop}
          >
            {{
              default: (data: TableSlotDefault) => {
                if (v.children && v.children.length) {
                  return rnderTableColumn(v.children)
                }

                const slotContent = getSlot(slots, v.prop, data)
                if (slotContent) return slotContent

                let customContent
                if (v?.customRender) {
                  customContent = v.customRender({
                    row: data.row,
                    column: data.column,
                    index: data.$index,
                    value: data.row[v.prop]
                  })

                  {
                    /* if (!isEmptyContent(customContent)) {
                    return customContent
                  } */
                  }
                  return customContent
                }
                if (v.type === 'index') {
                  const { reserveIndex } = unref(getProps)
                  return setIndex(
                    reserveIndex,
                    data.$index,
                    tablePagination.value.pageSize,
                    tablePagination.value.currentPage
                  )
                }
                {
                  return cellValue(data.row[v.prop])
                }
              },
              // @ts-ignore
              header: () => renderHeader(v)
            }}
          </ElTableColumn>
        )
      })
    }

    /**
     * @description 渲染表格列
     * @param {TableColumn[]} columnsChildren 子列配置
     * @returns {VNode[]} 表格列节点
     */
    const rnderTableColumn = (columnsChildren?: TableColumn[]) => {
      const { columns, reserveIndex, align, headerAlign, showOverflowTooltip } = unref(getProps)
      return [...[renderTableExpand()]].concat(
        (columnsChildren || columns).map((v) => {
          // 自动生成序号列
          if (v.type === 'index') {
            return (
              <ElTableColumn
                type="index"
                index={
                  v.index
                    ? v.index
                    : (index) =>
                        setIndex(
                          reserveIndex,
                          index,
                          tablePagination.value.pageSize,
                          tablePagination.value.currentPage
                        )
                }
                align={v.align || align}
                headerAlign={v.headerAlign || headerAlign}
                label={v.label}
                width="65px"
              ></ElTableColumn>
            )
          } else if (v.type === 'selection') {
            return renderTableSelection(v)
          } else {
            const props = { ...v }
            if (props.children) delete props.children
            // 多列排序启用时，不把 sortable 传给 ElTableColumn，避免内置排序干扰
            if (unref(getProps).sortMultiple && (props as any).sortable) {
              delete (props as any).sortable
            }
            return (
              <ElTableColumn
                showOverflowTooltip={showOverflowTooltip}
                align={align}
                headerAlign={headerAlign}
                {...props}
                prop={v.prop}
              >
                {{
                  default: (data: TableSlotDefault) => {
                    if (v.children && v.children.length) {
                      return rnderTreeTableColumn(v.children)
                    }
                    let customContent
                    if (v?.customRender) {
                      customContent = v.customRender({
                        row: data.row,
                        column: data.column,
                        index: data.$index,
                        value: data.row[v.prop]
                      })

                      {
                        /* if (!isEmptyContent(customContent)) {
                        return customContent
                      } */
                      }
                      return customContent
                    }

                    const slotContent = getSlot(slots, v.prop, data)
                    if (slotContent) return slotContent

                    {
                      /* // 对于 index 类型的列，不应该执行到这里，但为了健壮性添加检查
                    if (v.type === 'index') {
                      return data.$index !== undefined ? data.$index + 1 : '-'
                    } */
                    }

                    {
                      return cellValue(data.row[v.prop])
                    }
                  },
                  // @ts-ignore
                  header: () => renderHeader(v)
                }}
              </ElTableColumn>
            )
          }
        })
      )
    }

    /**
     * @description 渲染分页器
     * @returns {VNode} 渲染节点
     */
    const renderPagination = () => {
      return (
        <Pagination
          class="s-pagination"
          v-model:limit={tablePagination.value.pageSize}
          v-model:page={tablePagination.value.currentPage}
          onPagination={handlePagination}
          {...pagination.value}
        ></Pagination>
      )
    }

    /**
     * @description 获取行类名
     * @returns {string} 行类名
     */
    const getRowClassName = () => {
      if (typeof getBindValue.value.rowClassName === 'function') {
        return `${getBindValue.value.rowClassName()} commonTableRow`
      } else if (typeof getBindValue.value.rowClassName === 'string') {
        return `${getBindValue.value.rowClassName} commonTableRow`
      }
      return 'commonTableRow'
    }

    /**
     * @description 获取表头单元格样式
     * @returns {object} 表头样式
     */
    const getHeaderCellStyle = () => {
      if (typeof getBindValue.value.headerCellStyle === 'function') {
        return { ...appStore.headerCellStyle, ...getBindValue.value.headerCellStyle() }
      } else if (
        Object.prototype.toString.call(getBindValue.value.headerCellStyle) === '[object Object]'
      ) {
        return { ...appStore.headerCellStyle, ...getBindValue.value.headerCellStyle }
      }
      return { ...appStore.headerCellStyle }
    }

    /**
     * @description 渲染表格组件
     * @returns {VNode} 渲染节点
     */
    return () => (
      <div v-loading={loading.value || props.loading} class="h-full s-table-container">
        <ElTable
          // @ts-ignore
          ref={elTableRef}
          v-horizontal-scroll="always"
          data={tableData.value}
          height="100%"
          class="SWCommonTable s-table mb-15px"
          header-cell-style={getHeaderCellStyle}
          row-class-name={getRowClassName}
          {...unref(getBindValue)}
          {...Object.fromEntries(Object.entries(attrs).filter(([key]) => key.startsWith('on')))}
        >
          {{
            default: () => rnderTableColumn(),
            // @ts-ignore
            append: () => getSlot(slots, 'append'),
            // @ts-ignore
            empty: renderEmpty
          }}
        </ElTable>
        {unref(getProps).showPagination && tablePagination.value.total > 0 ? (
          unref(getProps).paginationTeleport ? (
            <Teleport to={unref(getProps).paginationTeleport}>
              <Pagination
                class="s-pagination"
                v-model:limit={tablePagination.value.pageSize}
                v-model:page={tablePagination.value.currentPage}
                onPagination={handlePagination}
                {...pagination.value}
              ></Pagination>
            </Teleport>
          ) : (
            <Pagination
              class="s-pagination"
              v-model:limit={tablePagination.value.pageSize}
              v-model:page={tablePagination.value.currentPage}
              onPagination={handlePagination}
              {...pagination.value}
            ></Pagination>
          )
        ) : undefined}
      </div>
    )
  }
})
</script>
<style lang="scss" scoped>
:deep(.el-table) {
  --el-table-border: 1px solid #e5e5e5;
  th.el-table__cell {
    padding: 6px 0;
  }
  .el-table__cell {
    padding: 16px 0;
  }
  .actions {
    display: flex;
    align-items: center;
    justify-content: center;
    // gap: 8px;

    .el-button {
      padding: unset;
    }

    &.left {
      justify-content: flex-start;
      gap: 16px;
    }
  }
  // // 确保空数据容器占满整个表格宽度
  .el-table__empty-block {
    right: 0;
    height: 480px !important;
  }

  .sw-table-row_warning {
    background-color: rgb(255, 232, 102) !important;
    --el-table-row-hover-bg-color: #fffbcc;
  }

  .el-popper {
    max-width: 500px !important;
    white-space: pre-wrap !important;
    text-align: left !important;
  }
}

///* 空数据居中样式 */
//.el-table__empty-block {
//  width: 100% !important;
//  display: flex !important;
//  justify-content: center !important;
//  align-items: center !important;
//}
//
//.el-table__empty-text {
//  text-align: center !important;
//}

:deep(.el-button.is-text) {
  padding: 8px 4px;
  margin-left: 0;
}

:deep(.el-button.is-link) {
  padding: 8px 4px;
  margin-left: 0;
}

.swtable-header-sort {
  display: inline-flex;
  align-items: center;
  .sort-caret.ascending.active {
    border-bottom-color: var(--el-color-primary);
  }
  .sort-caret.descending.active {
    border-top-color: var(--el-color-primary);
  }
}
</style>
