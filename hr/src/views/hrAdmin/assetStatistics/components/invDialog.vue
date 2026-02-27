<template>
  <div>
    <s-w-search-form labelWidth="70" class="rt_qi_search" :schema="searchSchema" :expand-threshold="4" show-expand
      expand-text="展开" collapse-text="收起" @search="handleQuery" @reset="resetQuery" ref="searchFormRef">
    </s-w-search-form>
    <el-table class="SWCommonTable" :data="list" width="100%" v-horizontal-scroll="'always'" v-loading="loading"
      row-class-name="commonTableRow" :header-cell-style="appStore.headerCellStyle" max-height="55vh">
      <el-table-column label="资产照片"
        :prop="type === 'kxzcs' || type === 'zgzcs' || type === 'zlzcs' ? 'images' : 'imageUrl'" width="120"
        show-overflow-tooltip>
        <template #default="{ row }">
          <el-image v-if="type === 'kxzcs' || type === 'zgzcs' || type === 'zlzcs'" :src="row.images
              ? row.images
              : 'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/fixedAssetPic/aca4b270-d3b3-490e-959d-39085f2155ed.png'
            " preview-teleported style="width: 36px; height: 36px; vertical-align: middle"
            :preview-src-list="row.images ? [row.images] : []"></el-image>
          <el-image v-else :src="row.imageUrl
              ? row.imageUrl
              : 'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/fixedAssetPic/aca4b270-d3b3-490e-959d-39085f2155ed.png'
            " preview-teleported style="width: 36px; height: 36px; vertical-align: middle"
            :preview-src-list="row.imageUrl ? [row.imageUrl] : []"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="品名" :prop="type === 'kxzcs' || type === 'zgzcs' || type === 'zlzcs' ? 'name' : 'pname'"
        min-width="170" show-overflow-tooltip
        :formatter="(row: any) => formatterValue(row, type === 'kxzcs' || type === 'zgzcs' || type === 'zlzcs' ? 'name' : 'pname', '-')" />
      <el-table-column label="编号" prop="number" min-width="140" show-overflow-tooltip
        :formatter="(row: any) => formatterValue(row, 'number', '-')" />
      <el-table-column label="区域" min-width="160" :prop="type === 'kxzcs' ? 'areaName' : 'area'" show-overflow-tooltip
        :formatter="(row: any) => formatterValue(row, type === 'kxzcs' || type === 'zgzcs' || type === 'zlzcs' ? 'areaName' : 'area', '-')" />
      <el-table-column label="资产类型" prop="zclx" min-width="120" show-overflow-tooltip>
        <template #default="{ row }">
          {{ formatterLabel(getIntDictOptions(DICT_TYPE.FIXED_ASSET_TYPE, true), row.zclx) }}
        </template>
      </el-table-column>
      <template v-if="type === 'kxzcs' || type === 'syzzcs' || type === 'yjyzcs' || type === 'dghzcs'">
        <el-table-column label="设备类型" width="100" prop="sblx" show-overflow-tooltip
          :formatter="(row: any) => row.sblx || '-'" />
      </template>
      <template v-if="
        type === 'kxzcs' ||
        type === 'syzzcs' ||
        type === 'yjyzcs' ||
        type === 'dghzcs' ||
        type === 'zlzcs'
      ">
        <el-table-column label="租赁公司" min-width="160" prop="zlgs" show-overflow-tooltip
          :formatter="(row: any) => formatterValue(row, 'zlgs', '-')" />
      </template>
      <el-table-column v-if="type === 'kxzcs'" label="库存" prop="kcsl" min-width="120" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.kcsl === -1 ? '无限库存' : row.kcsl ? `${row.yykcs}/${row.kcsl}` : '-' }}
        </template>
      </el-table-column>
      <template v-if="type === 'syzzcs' || type === 'yjyzcs' || type === 'dghzcs'">
        <el-table-column v-if="type === 'syzzcs'" label="申请类型" prop="sqlx" min-width="110" show-overflow-tooltip>
          <template #default="{ row }">
            <div class="flex items-center">
              <span
                :style="`display: inline-block;width: 8px;height: 8px;border-radius: 50%;background: ${getApplyTypeColor(row.sqlx)};margin-right: 10px`"></span>
              <span>{{
                formatterLabel(getIntDictOptions(DICT_TYPE.ASSET_DETAIL_APPLY_TYPE, true), row.sqlx)
                }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="type === 'yjyzcs' || type === 'dghzcs'" label="应归还时间" prop="yghsj" min-width="170"
          show-overflow-tooltip
          :formatter="(row: any) => row.yghsj ? formatTime(row.yghsj, 'yyyy-MM-dd HH:mm:ss') : '-'"></el-table-column>
        <el-table-column label="数量" prop="num" min-width="100" show-overflow-tooltip
          :formatter="(row: any) => formatterValue(row, 'num', '-')">
        </el-table-column>
      </template>
      <template v-if="
        type === 'syzzcs' ||
        type === 'yjyzcs' ||
        type === 'dghzcs' ||
        type === 'zgzcs' ||
        type === 'zlzcs'
      ">
        <el-table-column label="使用人" prop="userName" min-width="110" show-overflow-tooltip>
          <template #default="{ row }">
            <div class="flex items-center" v-if="type === 'syzzcs' || type === 'yjyzcs' || type === 'dghzcs'">
              <el-avatar v-if="row.userName" class="mr-4px" fit="cover" :size="18" :src="row.tx" />
              <div>{{ row.userName || '-' }}</div>
            </div>
            <div class="flex items-center" v-if="type === 'zgzcs' || type === 'zlzcs'">
              <el-avatar v-if="row.user" class="mr-4px" fit="cover" :size="18" :src="row.tx" />
              <div>{{ row.user || '-' }}</div>
            </div>
          </template>
        </el-table-column>
      </template>
      <template v-if="type === 'zgzcs' || type === 'zlzcs'">
        <el-table-column label="状态" prop="status" min-width="110" show-overflow-tooltip>
          <template #default="{ row }">
            <div v-if="row?.status" style="
                display: inline-block;
                font-size: 14px;
                padding: 4px 16px;
                text-align: center;
                border-radius: 158px;
                min-width: 74px;
              " :style="`background: ${row.status === '使用中'
                  ? 'rgba(52, 155, 52, 0.2)'
                  : row.status === '空闲中'
                    ? 'rgba(0, 100, 255, 0.2)'
                    : 'rgba(255, 0, 0, 0.2)'
                };color: ${row.status === '使用中' ? '#349B34' : row.status === '空闲中' ? '#0064FF' : '#FF0000'}`">
              {{ row.status }}
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </template>
      <template v-if="type === 'syzzcs' || type === 'yjyzcs' || type === 'dghzcs'">
        <el-table-column label="人员状态" prop="userStatus" min-width="120" show-overflow-tooltip>
          <template #default="{ row }">
            <div class="row-center">
              <div class="status-icon" :class="'status-icon-' + row.userStatus"></div>
              <div>{{
                row.userStatus
                  ? formatterLabel(getIntDictOptions(DICT_TYPE.FEISHU_STATUS), row.userStatus)
                  : '-'
              }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleDetail(row)">资产明细</el-button>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <div class="pagination">
      <Pagination :total="total" v-model:page="queryParams.page" v-model:limit="queryParams.size" @pagination="getList"
        style="position: absolute; right: 0; margin: 0" />
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { formatterValue, formatterLabel, formatTime } from '@/utils'
import { FormSchema } from '@/types/form'
import { useAppStore } from '@/store/modules/app'
import { getAssetPage, getAssetAreaAll } from '@/api/hrAdmin/asset'
import { getAssetDetailPage } from '@/api/hrAdmin/assetStatistics'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()

const company = computed(() => userStore?.user?.company)
interface ProvideType {
  closeAll: () => void
}

const { closeAll } = inject('assets_statistics_handle') as ProvideType

class SearchItem {
  name: string = ''
  number: string = ''
  area: string = ''
  zclx: string = ''
  user: string = ''
  userName: string = ''
  ryzt: string = ''
  userId: String = ''
  page: number = 1
  size: number = 10
  zlgs: string = ''
}

const router = useRouter()

const props = defineProps({
  type: {
    type: String,
    default: '1'
  }
})

const appStore = useAppStore()

const statusOptions = [
  { label: '使用中', value: '使用中' },
  { label: '空闲中', value: '空闲中' },
  { label: '报废', value: '报废' }
]

const loading = ref(false),
  list = ref([]),
  searchFormRef = ref(),
  total = ref(0)
const queryParams = ref({ ...new SearchItem() })

let searchSchema: Array<FormSchema> = [
  {
    field: 'name',
    label: '品名',
    component: 'Input',
    componentProps: {
      placeholder: '请输入品名',
      clearable: true,
      style: { width: '220px' },
      onChange: (val: any) => valueChange(val, 'name'),
      onkeydown: async (event: any) => {
        if ((event as any)?.key === 'Enter') {
          queryParams.value = { ...queryParams.value, name: searchFormRef.value?.formModel?.name }
          await nextTick()
          handleQuery()
        }
      }
    }
  },
  {
    field: 'number',
    label: '编号',
    component: 'Input',
    componentProps: {
      style: { width: '220px' },
      placeholder: '请输入编号',
      clearable: true,
      onChange: (val: any) => valueChange(val, 'number'),
      onkeydown: async (event: any) => {
        if ((event as any)?.key === 'Enter') {
          queryParams.value = {
            ...queryParams.value,
            number: searchFormRef.value?.formModel?.number
          }
          await nextTick()
          handleQuery()
        }
      }
    }
  },
  {
    field: 'area',
    label: '区域',
    component: 'Select',
    componentProps: {
      placeholder: '请选择区域',
      options: [],
      clearable: true,
      style: { width: '220px' },
      onChange: (val: any) => valueChange(val, 'area'),
      onkeydown: async (event: any) => {
        if ((event as any)?.key === 'Enter') {
          queryParams.value = { ...queryParams.value, area: searchFormRef.value?.formModel?.area }
          await nextTick()
          handleQuery()
        }
      }
    }
  }
]

if (
  props.type === 'syzzcs' ||
  props.type === 'yjyzcs' ||
  props.type === 'dghzcs' ||
  props.type === 'zgzcs' ||
  props.type === 'zlzcs'
) {
  searchSchema = searchSchema.concat([
    {
      field: 'zclx',
      label: '资产类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择资产类型',
        clearable: true,
        style: { width: '220px' },
        options: getIntDictOptions(DICT_TYPE.FIXED_ASSET_TYPE, true).filter(
          (item: any) => item.value !== '3'
        ),
        onChange: (val: any) => valueChange(val, 'zclx')
      }
    }
  ])
}

if (props.type === 'syzzcs' || props.type === 'yjyzcs' || props.type === 'dghzcs') {
  searchSchema = searchSchema.concat([
    {
      field: 'userName',
      label: '使用人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入使用人',
        clearable: true,
        style: { width: '220px' },
        onChange: (val: any) => valueChange(val, 'userName'),
        onkeydown: async (event: any) => {
          if ((event as any)?.key === 'Enter') {
            queryParams.value = {
              ...queryParams.value,
              userName: searchFormRef.value?.formModel?.userName
            }
            await nextTick()
            handleQuery()
          }
        }
      }
    }
  ])
}

if (props.type === 'zgzcs' || props.type === 'zlzcs') {
  searchSchema = searchSchema.concat([
    {
      field: 'user',
      label: '使用人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入使用人',
        clearable: true,
        style: { width: '220px' },
        onChange: (val: any) => valueChange(val, 'user'),
        onkeydown: async (event: any) => {
          if ((event as any)?.key === 'Enter') {
            queryParams.value = {
              ...queryParams.value,
              user: searchFormRef.value?.formModel?.user
            }
            await nextTick()
            handleQuery()
          }
        }
      }
    }
  ])
}

if (props.type === 'syzzcs' || props.type === 'yjyzcs' || props.type === 'dghzcs') {
  searchSchema = searchSchema.concat([
    {
      field: 'userStatus',
      label: '人员状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: getIntDictOptions(DICT_TYPE.FEISHU_STATUS, true),
        multiple: false,
        clearable: true,
        filterable: true,
        style: { width: '220px' },
        onChange: (val: any) => valueChange(val, 'userStatus')
      }
    }
  ])
}

if (
  props.type === 'kxzcs' ||
  props.type === 'syzzcs' ||
  props.type === 'yjyzcs' ||
  props.type === 'dghzcs'
) {
  searchSchema = searchSchema.concat([
    {
      field: 'sblx',
      label: '设备类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: [
          { label: '自购', value: '自购' },
          { label: '租赁', value: '租赁' }
        ],
        multiple: false,
        clearable: true,
        filterable: true,
        style: { width: '220px' },
        onChange: (val: any) => valueChange(val, 'sblx')
      }
    }
  ])
}

if (
  props.type === 'kxzcs' ||
  props.type === 'syzzcs' ||
  props.type === 'yjyzcs' ||
  props.type === 'dghzcs' ||
  props.type === 'zlzcs'
) {
  searchSchema = searchSchema.concat([
    {
      field: 'zlgs',
      label: '租赁公司',
      component: 'Input',
      componentProps: {
        placeholder: '请输入租赁公司',
        clearable: true,
        style: { width: '220px' },
        onChange: (val: any) => valueChange(val, 'zlgs'),
        onkeydown: async (event: any) => {
          if ((event as any)?.key === 'Enter') {
            queryParams.value = { ...queryParams.value, zlgs: searchFormRef.value?.formModel?.zlgs }
            await nextTick()
            handleQuery()
          }
        }
      }
    }
  ])
}

if (props.type === 'zgzcs' || props.type === 'zlzcs') {
  searchSchema = searchSchema.concat([
    {
      field: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: statusOptions,
        multiple: false,
        clearable: true,
        filterable: true,
        style: { width: '220px' },
        onChange: (val: any) => valueChange(val, 'status')
      }
    }
  ])
}

const valueChange = (val: any, name: string) => {
  if (queryParams.value[name] !== val) {
    queryParams.value[name] = val
    handleQuery()
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryParams.value = { ...new SearchItem() }
  // handleQuery()
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const apiFn =
      props.type === 'kxzcs' || props.type === 'zgzcs' || props.type === 'zlzcs'
        ? getAssetPage
        : getAssetDetailPage
    let query
    if (props.type === 'kxzcs' || props.type === 'zgzcs' || props.type === 'zlzcs') {
      query = {
        ...queryParams.value,
        zclx: props.type === 'kxzcs' ? '1' : queryParams.value['zclx'],
        status: props.type === 'kxzcs' ? '空闲中' : queryParams.value['status'],
        pageSize: queryParams.value.size,
        sblx:
          props.type === 'zgzcs'
            ? '自购'
            : props.type === 'zlzcs'
              ? '租赁'
              : queryParams.value['sblx']
      }
      const area = query['area']
      if (area) {
        query['areas'] = area ? [area] : []
      } else {
        if (company.value !== 'SecretWorld' && !area) {
          query['areas'] = areaOptions.value.map((item: any) => item.value)
        }
      }
      delete query['area']
      delete query['size']
    } else {
      query = {
        ...queryParams.value,
        pname: queryParams.value.name,
        status: props.type === 'syzzcs' ? '1' : props.type === 'dghzcs' ? '2' : '',
        sqlx: props.type === 'yjyzcs' ? '2' : ''
      }
      delete query.name
    }
    const res = await apiFn(query)
    if (props.type === 'kxzcs' || props.type === 'zgzcs' || props.type === 'zlzcs') {
      list.value = res && res.record && Array.isArray(res.record) ? res.record : []
    } else {
      list.value = res && res.records && Array.isArray(res.records) ? res.records : []
    }
    total.value = res.total || 0
  } finally {
    loading.value = false
  }
}

const handleDetail = (row) => {
  closeAll()
  router.push({
    name: 'AssetStatisticsDetailList',
    query: {
      userId: row.userId
    }
  })
}

const getApplyTypeColor = (value: any) => {
  const v = String(value)
  if (v === '1') return '#0064FF' // 领用
  if (v === '2') return '#DB6A0F' // 借用
  if (v === '3') return '#349B34' // 归还
  return '#C0C4CC'
}

const areaOptions = ref([])
const loadAreaOptions = async () => {
  try {
    const data = await getAssetAreaAll()
    const options = Array.isArray(data)
      ? data.map((it: any) => ({
        label: it?.qymc,
        value: it?.id,
        sszz: it?.sszz
      }))
      : []
    // 固定资产2.1优化
    if (company.value === 'SecretWorld') {
      areaOptions.value = options
    } else {
      areaOptions.value = options.filter((item: any) => item.sszz === company.value)
    }
    const schema = searchSchema.find((it) => it.field === 'area')
    if (schema && schema.componentProps) {
      schema.componentProps.options = areaOptions.value
      schema.componentProps = { ...schema.componentProps }
    }
    getList()
  } catch (e) { }
}

onMounted(() => {
  loadAreaOptions()
})
</script>

<style lang="scss" scoped>
.status-icon {
  width: 8px;
  height: 8px;
  border-radius: 10px;
  margin-right: 10px;

  &-1 {
    background-color: #0064ff;
  }

  &-2 {
    background-color: #349b34;
  }

  &-3 {
    background-color: #eb3737;
  }

  &-4 {
    background-color: #db6a0f;
  }

  &-5 {
    background-color: #999999;
  }
}

// :deep(.el-input) {
//   .el-input__warpper {
//     width: 220px !important;
//   }

// }

// :deep(.el-select) {
//   .el-input__warpper {
//     width: 220px !important;
//   }
// }

:deep(.el-form-item__label-wrap) {
  margin-left: 0 !important;
}

.pagination {
  margin-top: 10px;
  text-align: right;
  width: 100%;
  height: 35px;
  position: relative;
}
</style>
