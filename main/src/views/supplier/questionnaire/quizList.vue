<template>
  <div class="wrapper overflow-y-scroll" v-loading="loading">
    <!-- 问卷内容 -->
    <div class="content">
      <div class="flex h-96px justify-center bg-#EAF0FF">
        <div class="flex column items-center mt-14px color-#1E47AB">
          <span class="font-size-32px lh-45px fw-600">供应商考核问卷</span>
          <span class="lh-20px font-size-14px fe-400">
            <!-- 考核时间：{{ `${queryParams.startTime} ~ ${queryParams.endTime}` }} -->
             考核期：{{ queryParams.period }}
          </span>
        </div>
        <div class="flex justify-center items-center ml-13px">
          <img :src="logo" class="w82px h-82px" />
        </div>
      </div>

      <special-table
        :data="tableData"
        :options="quizListOptions"
        :btns-options="btnsOptions"
        border
        :pick-up="false"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import logo from '@/assets/imgs/supplier/questionnaireLogo.png'
import { getQuizListApi } from '@/api/supplier/questionnaire'
import specialTable from '@/views/supplier/components/table.vue'
import { quizListOptions } from './options'
import { AuditBtn } from '../changeAudit/option'
import { toReactive } from '@vueuse/core'
import dayjs from 'dayjs'
const router = useRouter()
const route = useRoute()
const tableData = ref<any[]>([])
const loading = ref(false)
const queryParams = reactive({
  // startTime: route.query.startTime,
  // endTime: route.query.endTime
  period:route.query.period as string
})

const btnsOptions = computed(() =>
  tableData.value.map(() => {
    const btns = [new AuditBtn('评分', handleScore, {})]

    return toReactive(btns)
  })
)

function handleScore(row) {
  router.push({
    name: 'SupplierQuestionnaire',
    query: {
      quizId: row.quizId,
      period: queryParams.period
    }
  })
}

async function getList() {
  loading.value = true
  try {
    const res = await getQuizListApi(queryParams)
    if (!res) return
    tableData.value = res
  } catch (error) {
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  getList()
})
</script>

<style lang="less" scoped>
@import url(../index.scss);
@import url(./index.scss);

.title {
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-weight: 400;
  &::before {
    display: none;
  }
}

.assessTime {
  font-size: 14px !important;
  color: #1e47ab;
}

:deep(.el-table__body-wrapper .el-scrollbar__view) {
  max-height: calc(100vh - 200px);
}
</style>
