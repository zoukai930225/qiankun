<!--
 * @Date: 2025-01-03 16:22:21
-->
<template>
  <div>
    <ContentWrap>
      <SWForm ref="SWFormRef" :fields="configList" :categoryList="categoryList" @search="handleSearch"
        @reset="handleReset" @add="handleAdd" @separated-employee="handleSeparatedEmployee" />
    </ContentWrap>
    <ContentWrap>
      <SWTable ref="tableRef" :tableColumns="configList" :tableData="list" :total="total" :loading="loading"
        @edit="handleEdit" @see-detail="handleSeeDetail" @del="handleDel" @audit-success="auditSuccess"
        @update-progress="updateProgress" @page-change="handlePageChange" @sort-change="handleSortChange" />
    </ContentWrap>
    <!-- 新增选择弹框 -->
    <AddSelectDialog ref="addSelectDialogRef" v-model="dialogVisible" @confirm="handleAddSelectConfirm" />
    <!-- 新增 -->
    <AddDialog ref="addFormRef" :addType="addType" :fields="configList" @close="handleCloseDialog"
      @success="handleSuccess" />
    <SeparatedEmployeeDialog ref="separatedEmployeeRef" @confirm="getList" />
  </div>
</template>

<script lang="ts" setup>
import { deleteNpById, getBasicAttribute, getNpList } from '@/api/oa/new/plan/index'
import SWForm from './components/SWForm.vue'

import SWTable from './components/SWTable.vue'
import AddDialog from './components/addDialog.vue'
import AddSelectDialog from './components/addSelectDialog.vue'
import SeparatedEmployeeDialog from './components/separatedEmployeeDialog.vue'

import { useCategoryList } from '@/views/OA/new/product/hooks.js'
const { categoryList } = useCategoryList()

const route = useRoute()
const planName = route.query.planName || undefined

const message = useMessage() // 消息弹窗
defineOptions({ name: 'Plan' })
const list = ref([]) // 列表数据
const total = ref(0) // 总数
const configList = ref([]) // 配置列表
const form = ref({
  page: 1,
  size: 10,
  planName
})
const loading = ref(false)

const tableRef = ref()

const dialogVisible = ref(false)

const addType = ref('newGoods')
// 新增选择确定事件
const handleAddSelectConfirm = (val) => {
  addType.value = val
  addFormRef.value.open()
}

// 新增
const addFormRef = ref()
const handleAdd = () => {
  // dialogVisible.value = true
  addFormRef.value.open()
}

const handleCloseDialog = () => {
  addFormRef.value.close()
}

const separatedEmployeeRef = ref()
const handleSeparatedEmployee = () => {
  separatedEmployeeRef.value.open()
}

// 参数变化
const handleSearch = (val: any) => {
  form.value = Object.assign({ page: 1, size: form.value.size }, val)
  tableRef.value?.updateCurrentPage(1)
  if (!form.value.planListDate) {
    form.value.planListDate = undefined
  }
  getList()
}

const handleReset = () => {
  form.value = { page: 1, size: 10 }
  orderParam.value = { prop: '', custorOrder: null }
  tableRef.value?.updateCurrentPage(1)
  getList()
}

const handleEdit = (row: any) => {
  console.log('查看详情', row)
  addFormRef.value.open(row.id)
}

const handleSeeDetail = (row: any) => {
  addFormRef.value.open(row.id, true)
}

const handleDel = async (row: any) => {
  // 删除二次确认
  await message.confirm('确认删除吗？')
  await deleteNpById(row.id)
  message.success('删除成功')
  getList()
}

// 审核成功
const auditSuccess = () => {
  getList()
}

// 分页变化
const handlePageChange = (val: any) => {
  form.value.page = val.page
  form.value.size = val.size
  getList()
}

const orderParam = ref({
  prop: '',
  custorOrder: null
})

const handleSortChange = ({ prop, custorOrder }) => {
  orderParam.value = { prop, custorOrder }
  getList()
}

const warnConfig = {
  id: 0,
  name: '',
  listDisplay: true,
  state: 1,
  code: 'customWarn'
}

// 获取配置
const getConfig = async () => {
  const params = {
    code: 'Plan'
  }
  const res = await getBasicAttribute(params)
  configList.value = (res || []).filter((item) => item.state === 1)
  handleIsShowWarnInfo()
  console.log('configList', configList.value)
}

const handleIsShowWarnInfo = () => {
  if (list.value.length > 0 && configList.value.length > 0) {
    const isShowWarn = list.value.some((item) => item.newProgress === '1')
    if (configList.value[0].code === 'customWarn' && !isShowWarn) {
      configList.value.splice(0, 1)
    } else if (configList.value[0].code !== 'customWarn' && isShowWarn) {
      configList.value = [warnConfig, ...configList.value]
    }
  }
}

const updateProgress = (row) => {
  list.value.forEach((item) => {
    if (item.id === row.id) {
      item.newProgress = row.newProgress
    }
  })
  handleIsShowWarnInfo()
}

const handleSuccess = () => {
  form.value.page = 1
  getList()
}

const getList = async () => {
  try {
    loading.value = true
    form.value = Object.entries(form.value).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        acc[key] = value
      }
      return acc
    }, {}) as any
    var formData = new FormData()
    formData.append(
      'queryParam',
      JSON.stringify({
        ...form.value,
        page: undefined,
        size: undefined
      })
    )
    if (orderParam.value.custorOrder) {
      formData.append(
        'orderParam',
        JSON.stringify({
          [orderParam.value.prop]: orderParam.value.custorOrder
        })
      )
    }
    const res = await getNpList(form.value)

    loading.value = false
    list.value = res.records || []

    handleIsShowWarnInfo()
    total.value = res.total || 0
  } catch (error) {
    loading.value = false
  }
}

onMounted(async () => {
  await getConfig()
  getList()
})

onActivated(() => {
  handleRouteParam()
})

const SWFormRef = ref()
const handleRouteParam = () => {
  let planName1 = route.query.planName
  if (planName1) {
    form.value.planName = planName + ''
    SWFormRef.value.setSearchPlanNameValue(planName1)
    getList()
  }
}
if (planName) {
  const newUrl = window.location.href.replace(/\?.*$/, '') // 获取当前路径，并去除参数
  history.replaceState({}, '', newUrl)
}
</script>

<style lang="scss" scoped></style>
