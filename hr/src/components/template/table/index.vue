<template>
  <div class="scheme-table" v-loading="loading" element-loading-text="数据加载中...,请稍后!">
    <template v-if="showScreen">
      <div class="scheme-operate" v-if="isOperate">
        <el-form v-if="screen?.field" :inline="true" :model="searchData" class="scheme-operate-form">
          <el-form-item :label="screen.label">
            <el-checkbox-group v-model="searchData[screen.field]" @change="search">
              <el-badge v-for="item in screens" :value="stateInfo[item.value]" :max="max" :offset="[-22, 0]"
                color="#EB3737" :badge-style="{ height: '14px' }">
                <el-checkbox :label="item.label" :value="item.value" border />
              </el-badge>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <span v-else class="list_name">{{ listName }}</span>
        <div class="scheme-operate-btn" v-if="!!btns?.length">
          <div v-for="(btn, index) in btns" :key="`btn_${btn.fun}_${index}`" class="table_btn"
            style="display: inline-block">
            <el-button v-if="btn.fun !== 'import' && !btn?.isCustom" :type="btn.type as any"
              :plain="btn?.plain || false" @click="btnClick(btn)" :disabled="btn?.disabled(btn) || false"
              :icon="btn?.icon || ''">
              {{ btn.txt }}
            </el-button>
            <el-upload v-if="btn.fun === 'import' && !!btn?.api" :action="uploadUrl(btn.api)" :show-file-list="false"
              :headers="uploadHeaders" :on-success="handleImportSuccess"
              :before-upload="() => (importBtnLoading = true)" :on-error="() => (importBtnLoading = false)"
              :disabled="importBtnLoading">
              <el-button> 导入 </el-button>
            </el-upload>
            <component v-if="!!btn.isCustom" :is="btn.customRender(btn)" />
          </div>
        </div>
      </div>
    </template>
    <el-table v-bind="tableProps" class="scheme-table" :border="border as any" :data="tableData" ref="tableRef"
      :size="size as any" :header-cell-style="{
        backgroundColor: '#F2F6FC',
        color: '#666',
        fontWeight: '500',
        fontSize: '14px'
      }" v-horizontal-scroll="'always'" :max-height="height" @current-change="handleCurrentChange"
      @sort-change="sortChange">
      <el-table-column v-if="isSelection" :selectable="tableProps?.selectable" type="selection" width="55" fixed="left"
        align="center" />
      <el-table-column v-if="isIndex" type="index" width="65" label="序号" fixed="left" align="center">
        <template #default="scope">
          <line-txt :txt="indexMethod(scope)" class="line-text" />
        </template>
      </el-table-column>
      <column-item v-for="(col, index) in columns" :key="`${col.field}_${index}`" :column="col" :name="props.name" />
      <el-table-column fixed="right" :width="handleWidth()" label="操作" v-if="handleColumn?.length && !!handleWidth()">
        <template #default="scope">
          <div style="display: inline-flex">
            <el-button v-for="(handle, index) in handles(scope.row).slice(0, 3)" :key="`handle_${handle.fun}_${index}`"
              :class="[!index ? 'handle_left' : '', 'handle_btn']" :type="(handle?.type || 'primary') as any" link
              @click="handleClick(handle, scope.row)">
              {{ handle.txt }}
            </el-button>
            <el-popover v-if="handles(scope.row).length > 3" placement="bottom" :popper-style="{ padding: '8px' }"
              teleported :width="popoverWidth(handles(scope.row).slice(3))">
              <template #reference>
                <img src="@/assets/svgs/moreBtn.svg" alt="" class="more_btn" />
              </template>
              <div style="padding: 5px 0; text-align: center" v-for="(handle, index) in handles(scope.row).slice(3)"
                :key="`hide_handle_${handle.fun}_${index}`">
                <el-button :type="(handle?.type || 'primary') as any" link @click="handleClick(handle, scope.row)">
                  {{ handle.txt }}
                </el-button>
              </div>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <img class="mt30px" src="@/assets/imgs/empty/empty1.png" alt="" />
        <div class="mb24px">暂无相关内容</div>
      </template>
    </el-table>
    <div class="pagination" style="color: #666 !important">
      <div class="pagination-tips">
        <slot name="statistics"></slot>
      </div>
      <el-pagination v-show="!!page?.total" class="pagination-page" ref="" v-model:current-page="page.page"
        v-model:page-size="page.size" :background="true" :page-sizes="page.sizes" :total="page.total"
        :pager-count="count" layout="total, sizes, prev, pager, next, jumper" @size-change="sizeChange"
        @current-change="currentChange" />
    </div>
  </div>
</template>

<script lang="ts">
export default { name: 'SchemeTable' }
</script>

<script lang="ts" setup>
import { Column, FromProvideType, Screen, BtnItem } from '../config/type'
import { useRouteInfo } from '@/hooks/common/useRouteInfo'
import { useUserStore } from '@/store/modules/user'
import ColumnItem from './components/columnItem'
import { cloneDeep, debounce } from 'lodash-es'
import { useCache } from '@/hooks/web/useCache'
import LineTxt from './components/lineTxt.vue'
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
  showScreen: { type: Boolean, default: true },
  screen: { type: Object, default: () => ({ ...new Screen() }) },
  handleColumn: { type: Array<any>, default: () => [] },
  tableData: { type: Array<any>, default: () => [] },
  btnList: { type: Array<any>, default: () => [] },
  column: { type: Array<any>, default: () => [] },
  tableProps: { type: Object, default: () => ({}) },
  sortRemote: { type: Boolean, default: false },
  isSelection: { type: Boolean, default: false },
  border: { type: String, default: 'border' },
  isOperate: { type: Boolean, default: true },
  listName: { type: String, default: '列表' },
  size: { type: String, default: 'default' },
  height: { type: Number, default: Infinity },
  isIndex: { type: Boolean, default: true },
  max: { type: Number, default: Infinity },
  pointer: { type: String, default: 'id' },
  name: { type: String, default: '' },
  mode: { type: String, default: '' },
})

const {
  page,
  searchData,
  stateInfo,
  loading,
  onSearch,
  setParamsData,
  viewDetails,
  onButtonClick,
  onCurrentChange,
  customSort
} = inject(`${props.name}Form`, { customSort: (item: any) => { } }) as FromProvideType

const count = computed(() => (document.body.clientWidth < 992 ? 5 : 7))

const columns = computed(() =>
  cloneDeep([...props.column.map((col: any) => ({ ...new Column(col) }))])
)

const btns = computed(() =>
  cloneDeep([
    ...props.btnList
      .map((btn: any) => ({ ...new BtnItem(btn) }))
      .filter((bts: any) => !bts.display(bts))
  ])
)

const screens = computed(() => props.screen?.options?.length ? cloneDeep([...props.screen.options.filter((sc: any) => !sc?.disabled)]) : []);

const selectRows = computed(() => tableRef?.value?.getSelectionRows());

const uploadHeaders = computed(() => ({
  token: wsCache.get('ACCESS_TOKEN') ? wsCache.get('ACCESS_TOKEN') : wsCache.get('ACCESS_TOKEN')
}));

const sortChange = (data: any) => {
  !!props?.sortRemote && customSort(data);
};

const uploadUrl = (url: string) =>
  `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_API_URL}${url}`

const handleImportSuccess = (res: any) => {
  !!res?.success && message.success('导入成功')
  importBtnLoading.value = false
  onSearch()
}

const handles = (item: any) => {
  return props.handleColumn
    .map((hs: any) => ({ ...new BtnItem(hs) }))
    .filter((hs: any) => hs.reveal(item))
}

const indexMethod = (scope: any) => {
  return String(
    (page?.value?.size as number) * ((page?.value?.page as number) - 1) + scope.$index + 1
  )
}

const handleWidth = () => {
  const list: any = props.tableData?.length
    ? props.tableData
      .map((tbs: any) => {
        const btns: any = handles(tbs)
        const nums: any = btns
          .slice(0, 3)
          .map((trs: any) => Math.ceil(getInfoLength(trs.txt) + 15))
        btns.length > 3 && nums.push(30)
        return nums.reduce((item: number, cur: number) => (cur += item), 0)
      })
      .sort((a: number, b: number) => a - b)
    : [45]
  return !!list[list.length - 1] ? (list[list.length - 1] + 30) : 0
}

const popoverWidth = (btns: any) => {
  const nums: any = btns
    .map((trs: any) => Math.ceil(getInfoLength(trs.txt)))
    .sort((a: number, b: number) => a - b)
  return nums[nums.length - 1] + 25
}

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
            ? { url: btn.api, data: btn?.isStreamline ? list.map((li: any) => li[btn?.material || 'id']) : list }
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

const handleCurrentChange = (row: any) => {
  if (!row) return
  onCurrentChange && onCurrentChange(row)
}

const setCurrentRow = (row: any) => {
  tableRef?.value?.setCurrentRow(row)
}

defineExpose({ selectRows, setCurrentRow })
</script>

<style lang="scss" scoped>
@use './style.scss';
</style>
