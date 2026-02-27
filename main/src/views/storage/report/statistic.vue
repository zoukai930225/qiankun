<template>
  <ContentWrap>
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form
          :model="queryParams"
          ref="queryFormRef"
          :inline="true"
          label-width="110px"
          :rules="rules"
        >
          <el-form-item label="日报日期:" prop="daterange">
            <el-date-picker
              v-model="queryParams.daterange"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              :disabled-date="disableDate"
              clearable
              @keydown="($event) => handleKeydown($event)"
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="commonTopFilterWrap-search">
        <div class="commonTopFilterWrap-search-container">
          <el-button @click="handleQuery" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0">
            重置
          </el-button>
          <el-button type="primary" @click="exportFile" :loading="btnSwitch"> 导出 </el-button>
        </div>
      </div>
    </div>

    <Cell
      v-for="(item, index) in allData"
      :key="index"
      :data="item.data"
      :title="item.typeName"
      :page-type="1"
      :border="true"
    />
  </ContentWrap>
</template>
<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { getDailyReportList, exportFile as exportTable } from '@/api/storage/report'
import download from '@/utils/download'

defineOptions({ name: 'StorageReportStatistic' })

const Cell = defineAsyncComponent(() => import('./components/cell.vue'))

const queryParams = reactive({
  beginDate: '',
  endDate: '',
  daterange: [] as any[] | undefined
})

const allData = ref<any[]>([])
const queryFormRef = ref()

const rules = {
  daterange: [
    {
      required: true,
      message: '请选择日期'
    }
  ]
}

watch(
  () => queryParams.daterange,
  (val) => {
    queryParams.beginDate = val?.[0] || undefined
    queryParams.endDate = val?.[1] || undefined
  }
)
// 日期禁用
function disableDate(date: any) {
  const currentDate = new Date()
  const currentDay = currentDate.getDate()
  currentDate.setDate(currentDay)

  return date > currentDate
}

// 搜索
async function handleQuery() {
  await queryFormRef.value.validate()
  getList()
}

// 重置
function resetQuery() {
  allData.value = []
  queryParams.daterange = []
}

// 导出文件
const message = useMessage()
const btnSwitch = ref(false)
async function exportFile() {
  await getList()

  if (!allData.value.length) {
    return message.warning('当前条件下无数据')
  }

  // 防抖
  if (btnSwitch.value === true) return
  btnSwitch.value = true
  setTimeout(() => {
    btnSwitch.value = false
  }, 2000)

  try {
    const params = cloneDeep(queryParams)
    delete params.daterange
    const res = await exportTable(params)
    if (res) {
      let fileName = ''
      if (params.beginDate === params.endDate) {
        fileName = params.beginDate + '日报统计明细.xlsx'
      } else {
        fileName = params.beginDate + '至' + params.endDate + '日报统计明细.xlsx'
      }
      console.log(res)

      download.excel(res, fileName)
    }
    if (res.success) {
      message.success('导出成功')
    }
  } catch (error) {}
}

// 获取列表
async function getList() {
  allData.value = []
  try {
    const params = cloneDeep(queryParams)
    delete params.daterange
    const res = await getDailyReportList(params)
    allData.value = res.data
    if (allData.value.length === 0) {
      message.warning('当前日期内无数据')
    }
  } catch (error) {}
}

// enter搜索
function handleKeydown(e) {
  if (e.key !== 'Enter') return
  getList()
}

onMounted(() => {
  allData.value = []
})
</script>
<style scoped lang="less">
:deep(.el-card) {
  margin-bottom: 24px;
}
</style>
