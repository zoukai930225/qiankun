<template>
  <ContentWrap class="min-w-1300px" style="position: relative">
    <div style="width: calc(100% - 68px)">
      <el-form ref="formRef" :model="queryParams" label-width="70" inline>
        <el-form-item label="企划名称" prop="planName">
          <el-input style="width: 230px" v-model="queryParams.planName" clearable placeholder="请输入企划名称"
            @change="handleQuery" @keydown.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="图稿编号" prop="artworkNumber">
          <el-input style="width: 230px" v-model="queryParams.artworkNumber" clearable placeholder="请输入图稿编号"
            @keydown.enter="handleQuery" @change="handleQuery" />
        </el-form-item>
        <el-form-item label="货品编码" prop="productCode">
          <el-input style="width: 230px" v-model="queryParams.productCode" clearable placeholder="请输入货品编码"
            @keydown.enter="handleQuery" @change="handleQuery" />
        </el-form-item>
        <el-form-item label="品类" prop="category">
          <CategorySelect style="width: 230px" v-model="queryParams.category" @change="handleQuery" />
        </el-form-item>
        <el-form-item label="企划时间" prop="time" v-if="isExpand">
          <el-date-picker style="width: 210px" v-model="time" type="daterange" format="YYYY-MM-DD"
            value-format="YYYY-MM-DD" start-placeholder="开始时间" end-placeholder="结束时间" @change="handleQuery" clearable />
        </el-form-item>

        <!-- </el-col>
              <el-col :span="6"> -->

        <!-- </el-col>
              <el-col :span="6"> -->

        <!-- </el-col>
              <el-col :span="6"> -->
        <el-form-item label="当前负责人" prop="assigneeUserId" v-if="isExpand">
          <selectUserByDept style="width: 230px" v-model="queryParams.assigneeUserId" @change="handleQuery"
            :multiple="false" :show-avatar-lable="true" />
        </el-form-item>
        <!-- </el-col>
              <el-col :span="6"> -->

        <!-- </el-col>
              <el-col :span="6"> -->
        <el-form-item label="预计上架时间" prop="shelfTime" v-if="isExpand">
          <el-date-picker style="width: 210px" v-model="shelfTime" type="daterange" format="YYYY-MM-DD"
            value-format="YYYY-MM-DD" start-placeholder="开始时间" end-placeholder="结束时间" @change="handleQuery" />
        </el-form-item>
        <el-form-item label="是否上架" prop="isOnShelf" v-if="isExpand">
          <el-select v-model="queryParams.isOnShelf" placeholder="请选择是否上架" clearable @change="handleQuery"
            style="width: 230px">
            <el-option v-for="item in getIntDictOptions('np_isOnShelf', true)" :key="item.value" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <!-- </el-col> -->
        <!-- </el-row> -->
      </el-form>
    </div>
    <div style="position: absolute; right: 20px; top: 20px">
      <el-button @click="resetFrom" class="commonResetBtn">重置</el-button>
    </div>
    <el-divider class="g-query-divider">
      <el-button link @click="isExpand = !isExpand">{{ isExpand ? '收起' : '展开' }}
        <el-icon class="el-icon--right">
          <component :is="!isExpand ? 'ArrowDown' : 'ArrowUp'" />
        </el-icon>
      </el-button>
    </el-divider>
    <!-- <el-col :span="4" class="!flex justify-end !min-w-350px">
        <el-button @click="handleQuery" class="commonSearchBtn">
          <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
          搜索
        </el-button>
        
      </el-col> -->
    <!-- </el-row> -->

    <dashboard-part :data="dashboardData" @change="handleChangeCategory" />

    <special-table class="mt-30px" :data="tableData" :options="tableOptions" border :loading="loading"
      :cell-class-name="cellClassName">
      <template v-for="slotName in [
        'productDesignPhaseProgress',
        'productPreparePhaseProgress',
        'productOrderPhaseProgress'
      ]" :key="slotName" #[`${slotName}_header`]="{ column }">
        <div class="flex items-center">
          <span>{{ column.label }}</span>
          <el-tooltip :content="tooltipContent[slotName]">
            <Icon icon="fa:question-circle-o" color="#999" :size="14" class="ml2px" />
          </el-tooltip>
        </div>
      </template>

      <template #personInChargeList="{ row }">
        <div class="orderHandler" v-if="row?.personInChargeList && row?.personInChargeList[0]">
          <div class="orderHandler-item">
            <el-avatar class="avatar" :size="18" :src="row.personInChargeList[0]?.avatarOrigin">{{
              row.personInChargeList[0].name
            }}</el-avatar>
            <div class="name">{{ row.personInChargeList[0].name }}</div>
          </div>
          <el-tooltip v-if="row?.personInChargeList?.length > 1">
            <div class="more-order-handler !border-0">
              +{{ row?.personInChargeList.length - 1 }}
            </div>
            <template #content>
              <div class="orderHandler">
                <div class="orderHandler-item in-tooltip"
                  v-for="item in (row?.personInChargeList as any[]).filter((_, index) => index > 0)"
                  :key="item?.userId">
                  <el-avatar class="avatar" :size="18" :src="item?.avatarOrigin || DefaultAvatar" />
                  <div class="name" :style="{ color: '#fff' }">{{ item?.name }}</div>
                </div>
              </div>
            </template>
          </el-tooltip>
        </div>
        <div v-else class="flex items-center">
          <el-avatar :src="DefaultPerson" class="avatar" :size="18" />
          <span class="ml-8px">--</span>
        </div>
      </template>

      <template #progressAnalysis="{ row }">
        <template v-for="item in row.todoList" :key="item.id">
          <template v-if="item.delayDays && item.delayDays > 0">
            <div class="status-line">
              <img src="@/assets/svgs/common/icon_warn.svg" style="width: 16px; height: 16px" alt="" />
              <div>{{ `【${item.nodeName}】超期${item.delayDays || 0}天` }}</div>
            </div>
          </template>
          <template v-else>
            <div class="status-line">
              <img src="@/assets/svgs/common/icon_pass.svg" style="width: 16px; height: 16px;margin-right: 10px;"
                alt="" />
              <div>按计划进行</div>
            </div>
          </template>
        </template>
      </template>

      <template #productDesignPhaseProgress="{ row }">
        <!-- <transition name="expand" mode="out-in"> -->
        <el-tooltip :content="`实际完成时间：${row.productDesignPhaseFinishTime}`"
          :disabled="(row.productDesignPhaseProgress || 0) < 1">
          <progress-cell :customeKey="`productDesignPhaseProgress_${row.enterprisePlanId}`"
            :progress="row.productDesignPhaseProgress">
            <div>进度：</div>
            <div :style="`color: ${(row.productDesignPhaseProgress || 0) < 1 ? '#EB3737' : '#349B34'}`">{{
              Math.round((row.productDesignPhaseProgress || 0) * 100) + '%' }}</div>
            <div style="margin-left: 5px">耗时：</div>
            <div
              :style="`color: ${(row.productDesignPhaseCostDays || 0) > (row.productDesignPhaseExpectedDays || 0) ? '#EB3737' : ''}`">
              {{ row.productDesignPhaseCostDays || 0 }}</div>
            <div>/</div>
            <div>{{ (row.productDesignPhaseExpectedDays || 0) + '天' }}</div>
          </progress-cell>
        </el-tooltip>
        <!-- </transition> -->
      </template>

      <template #productPreparePhaseProgress="{ row }">
        <el-tooltip :content="`实际完成时间：${row.productPreparePhaseFinishTime}`"
          :disabled="(row.productPreparePhaseProgress || 0) < 1">
          <progress-cell :customeKey="`productPreparePhaseProgress_${row.enterprisePlanId}`"
            :progress="row.productPreparePhaseProgress">
            <div>进度：</div>
            <div :style="`color: ${(row.productPreparePhaseProgress || 0) < 1 ? '#EB3737' : '#349B34'}`">{{
              Math.round((row.productPreparePhaseProgress || 0) * 100) + '%' }}</div>
            <div style="margin-left: 5px">耗时：</div>
            <div
              :style="`color: ${(row.productPreparePhaseCostDays || 0) > (row.productPreparePhaseExpectedDays || 0) ? '#EB3737' : ''}`">
              {{ row.productPreparePhaseCostDays || 0 }}</div>
            <div>/</div>
            <div>{{ (row.productPreparePhaseExpectedDays || 0) + '天' }}</div>
          </progress-cell>
        </el-tooltip>
      </template>

      <template #productOrderPhaseProgress="{ row }">
        <el-tooltip :content="`实际完成时间：${row.productOrderPhaseFinishTime}`"
          :disabled="(row.productOrderPhaseProgress || 0) < 1">
          <progress-cell :customeKey="`productOrderPhaseProgress${row.enterprisePlanId}`"
            :progress="row.productOrderPhaseProgress">
            <div>进度：</div>
            <div :style="`color: ${(row.productOrderPhaseProgress || 0) < 1 ? '#EB3737' : '#349B34'}`">{{
              Math.round((row.productOrderPhaseProgress || 0) * 100) + '%' }}</div>
            <div style="margin-left: 5px">耗时：</div>
            <div
              :style="`color: ${(row.productOrderPhaseCostDays || 0) > (row.productOrderPhaseExpectedDays || 0) ? '#EB3737' : ''}`">
              {{ row.productOrderPhaseCostDays || 0 }}</div>
            <div>/</div>
            <div>{{ (row.productOrderPhaseExpectedDays || 0) + '天' }}</div>
          </progress-cell>
        </el-tooltip>
      </template>

      <template #isOnShelf="{ row }">
        <line-tage :txt="row.isOnShelf === '1' ? '已上架' : '未上架'" :color="row.isOnShelf === '1' ? '#349B34' : '#666666'"
          :background="row.isOnShelf === '1' ? 'rgba(52, 155, 52, .2)' : 'rgba(102, 102, 102, .2)'"></line-tage>
      </template>
    </special-table>

    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.page" v-model:limit="queryParams.size" @pagination="getList" />
  </ContentWrap>
</template>
<script lang="ts" setup>
import { FormInstance } from 'element-plus'
import dashboardPart from './components/dashboardPart.vue'
import specialTable from '@/views/supplier/components/table.vue'
import progressCell from './components/progressCell.vue'
import { tableOptions } from './options'
import {
  queryCategoryProgressApi,
  queryPhaseProgressListApi
} from '@/api/oa/new/productListDashboard'
import DefaultAvatar from '@/assets/imgs/avatar_logo.png'
import { formatDate } from '@/utils/formatTime'
import DefaultPerson from '@/assets/svgs/oa/defaultAvatar.svg'
import selectUserByDept from '@/components/common/user/selectUserByDept.vue'
import request from '@/config/axios'
import lineTage from '@/components/template/table/components/lineTage.vue'
import CategorySelect from '@/views/OA/new/components/selectCategory.vue'
import { getIntDictOptions } from '@/utils/dict'
const isExpand = ref(false)
defineOptions({ name: 'ProductListDashboardCatagory' })

const queryParams = reactive({
  page: 1,
  size: 10,
  category: '',
  // startTime: `${new Date().getFullYear()}-01-01`,
  startTime: '',
  endTime: '',
  // endTime: formatDate(new Date(), 'YYYY-MM-DD'),
  onShelfStartTime: '',
  onShelfEndTime: '',
  productCode: '',
  planName: '',
  assigneeUserId: '',
  artworkNumber: '',
  isOnShelf: ''
})
const formRef = ref<FormInstance>()
const tableData = ref([])
const total = ref(0)
const tooltipContent = {
  productDesignPhaseProgress: '从 企划创建 到 产品审核',
  productPreparePhaseProgress: '从 基本资料填写 到 运营信息填写',
  productOrderPhaseProgress: '从 采购需求 到 产前样结束'
}
const dashboardData = ref<any>()
const loading = ref(false)

const time = computed({
  get: () => [queryParams.startTime, queryParams.endTime],
  set: (val) => {
    queryParams.startTime = val ? val[0] : ''
    queryParams.endTime = val ? val[1] : ''
  }
})

const shelfTime = computed({
  get: () =>
    queryParams.onShelfStartTime && queryParams.onShelfEndTime
      ? [queryParams.onShelfStartTime, queryParams.onShelfEndTime]
      : [],
  set: (val) => {
    queryParams.onShelfStartTime = val ? val[0] : ''
    queryParams.onShelfEndTime = val ? val[1] : ''
  }
})

const cellClassName = ({ row, column }) => {
  if (row.isTimeout && column.label === '上架时间') {
    return 'bg-#eb373710'
  } else {
    return ''
  }
}

async function getList() {
  try {
    loading.value = true
    const res = await queryPhaseProgressListApi(queryParams)

    tableData.value = res.records
    total.value = res.total
  } catch (error) {
  } finally {
    loading.value = false
  }
}

async function handleQuery() {
  queryParams.page = 1
  getList()
  getDashBoardData()
}

function resetFrom() {
  Object.assign(
    queryParams,
    Object.fromEntries(Object.entries(queryParams).map(([key]) => [key, ''])),
    {
      page: 1,
      size: 10,
      // startTime: `${new Date().getFullYear()}-01-01`,
      // endTime: formatDate(new Date(), 'YYYY-MM-DD')
    }
  )
  randerMethod()
}

async function getDashBoardData() {
  try {
    const res = await request.post({
      url: '/api/np/plan/queryPhaseProgressStat',
      data: queryParams
    })
    dashboardData.value = [
      {
        categoryName: '上架率',
        type: 'percent',
        value: res.onShelfRate || 0,
        icon: 'sjl'
      },
      {
        categoryName: '在研产品总数',
        type: 'value',
        value: res.notOnShelfCount || 0,
        icon: 'zyzs'
      },
      {
        categoryName: '节点滞后产品数',
        type: 'value',
        value: res.delayingCount || 0,
        icon: 'zhcps'
      },
      {
        categoryName: '产品设计阶段产品数',
        type: 'value',
        value: res.productDesignPhaseCount || 0,
        icon: 'sjjdcps'
      },
      {
        categoryName: '产品准备阶段产品数',
        type: 'value',
        value: res.productPreparePhaseCount || 0,
        icon: 'zbjdcps'
      },
      {
        categoryName: '产品下单阶段产品数',
        type: 'value',
        value: res.productOrderPhaseCount || 0,
        icon: 'xdjdcps'
      }
    ]
    // const res = await queryCategoryProgressApi(queryParams)
  } catch (error) { }
}

const timer = ref<NodeJS.Timeout>()
function randerMethod() {
  if (timer.value) {
    clearTimeout(timer.value)
    timer.value = undefined
  }

  timer.value = setTimeout(() => {
    Promise.all([getList(), getDashBoardData()]).finally(() => {
      if (timer.value) clearTimeout(timer.value)
    })
  }, 500)
}

function handleChangeCategory(code) {
  queryParams.category = code
  handleQuery()
}

onBeforeMount(() => {
  randerMethod()
})

onActivated(() => {
  randerMethod()
})
</script>
<style lang="scss" scoped>
@import url('@/views/supplier/index.scss');

:deep(.cell) {
  .el-progress__text {
    // min-width: auto;
    color: inherit;
  }
}

:deep(.el-form--inline .el-form-item) {
  margin: 0 10px 10px 0;
}

.g-query-divider {
  .el-button :hover {
    color: var(--el-color-primary);
  }
}

:deep(.el-divider--horizontal) {
  margin: 10px 0 10px 0 !important;
}

.status-line {
  display: flex;
  align-items: center;
  margin-bottom: 5px;

  &:last-child {
    margin: 0;
  }
}
</style>
