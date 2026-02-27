<template>
  <!-- 搜索工作栏 -->
  <ContentWrap>
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form
          ref="queryFormRef"
          :inline="true"
          :model="queryParams"
          class="-mb-15px"
          label-width="78px"
        >
          <el-form-item label="姓名:" prop="name">
            <el-input
              :prefix-icon="Search"
              class="searchFormItemWidth"
              v-model="queryParams.name"
              clearable
              placeholder="请输入姓名"
              @keyup.enter="handleQuery"
              @clear="handleQuery"
            />
          </el-form-item>
          <el-form-item label="部门:" prop="dept">
            <el-input
              :prefix-icon="Search"
              class="searchFormItemWidth"
              v-model="queryParams.dept"
              clearable
              placeholder="请输入部门"
              @keyup.enter="handleQuery"
              @clear="handleQuery"
            />
          </el-form-item>
          <el-form-item label="数据时间:" prop="dataMonth">
            <el-date-picker
              type="month"
              class="!w-200px"
              v-model="queryParams.dataMonth"
              value-format="YYYY-MM"
              placeholder="请选择月份"
              @change="handleQuery"
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
          <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0px">
            重置
          </el-button>
        </div>
      </div>
    </div>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <div class="row-center" style="margin-bottom: 16px">
      <el-button type="primary" @click="copyTargetAmount()" :loading="copyLoading">
        <el-icon style="margin-right: 5px"><CopyDocument /></el-icon>
        复制目标额
      </el-button>
      <!-- <div v-if="dataDate" class="dataDate">数据日期：{{ dataDate }}</div> -->
    </div>

    <el-table
      :header-cell-style="appStore.headerCellStyle"
      v-loading="loading"
      :data="list"
      :show-overflow-tooltip="true"
      @cell-mouse-enter="handleCellMouseEnter"
      @cell-mouse-leave="handleCellMouseLeave"
      row-class-name="commonTableRow1"
      class="SWCommonTable"
      v-horizontal-scroll="'always'"
    >
      <el-table-column label="姓名" prop="name" width="170" :show-overflow-tooltip="false" fixed>
        <template #default="scope">
          <div class="row-center" style="width: 170px">
            <div class="userNameAvatar">
              <div class="userNameAvatar-text">{{ shortName(scope.row.name) }}</div>
            </div>
            <div class="userName" style="width: 135px">{{ scope.row.name }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="部门"
        prop="dept"
        min-width="140"
        :show-overflow-tooltip="false"
        fixed
      >
        <template #default="scope">
          <div class="single-line" style="min-width: 140px">{{ scope.row.dept }}</div>
          <div
            v-if="mouseEnterRowId === scope.row.id"
            class="personalTarget"
            @click="editPersonalTarget(scope.row)"
            >个人目标</div
          >
        </template>
      </el-table-column>
      <el-table-column label="岗位" prop="post" min-width="140" fixed />
      <el-table-column label="责权商品数" prop="goodsCount" min-width="170" />
      <el-table-column label="责权店铺数" prop="storeCount" min-width="170" />
      <el-table-column label="销售额" prop="salesAmount" min-width="170" />
      <el-table-column label="退款金额" prop="refundAmount" min-width="170" />
      <el-table-column label="净销售额" prop="cleanSalesAmountReal" min-width="170" />
      <el-table-column label="净利润" prop="cleanSalesAmount" min-width="170" />
      <el-table-column label="目标净利超额" prop="excessNetProfit" min-width="170" />

      <el-table-column
        label="目标金额"
        prop="targetAmount"
        min-width="170"
        :show-overflow-tooltip="false"
      >
        <template #default="scope">
          <div
            style="width: 150px"
            @mouseover="handleMouseOver(scope.row)"
            @mouseout="saveTargetAmount(scope.row)"
          >
            <el-input
              v-show="scope.row.isEdit"
              v-model="scope.row.editTargetAmount"
              placeholder="请输入"
              class="row-input"
              @keyup.enter="saveTargetAmount(scope.row)"
              clearable
            />
            <div v-show="!scope.row.isEdit">
              {{ scope.row.targetAmount ? numberFormateShow(scope.row.targetAmount) : '--' }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="完成率" prop="completionRate" min-width="100">
        <template #default="scope">
          <div :style="{ color: completionRateColor(scope.row.completionRate) }">
            {{ completionRateFullStr(scope.row.completionRate) }}
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column fixed="right" width="70" label="操作">
        <template #default="scope">
          <el-button class="operate-btn-space" link type="primary" @click="edit(scope.row.id)">
            编辑
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <!-- 分页 -->
    <Pagination
      v-model:limit="queryParams.size"
      v-model:page="queryParams.page"
      :total="total"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <EditDrawer ref="formRef" @success="getList" />
  <TargetManageDrawer ref="targetRef" @success="getList" />
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { useAppStore } from '@/store/modules/app'
import * as BiBilityAuthorityApi from '@/api/biBilityAuthority'
import { numberFormateShow } from '@/utils/formatter'
import EditDrawer from './components/editDrawer.vue'
import TargetManageDrawer from './components/targetManageDrawer.vue'

const appStore = useAppStore()

defineOptions({ name: 'TeamPreview' })

const message = useMessage() // 消息弹窗

const loading = ref(true) // 列表的加载中
const copyLoading = ref(false) // 复制加载中
const total = ref(0) // 列表的总页数
const list = ref<any[]>([]) // 表格数据
const dataDate = ref('') //数据日期
const queryParams = reactive({
  page: 1,
  size: 10,
  name: '',
  dept: '',
  dataMonth: ''
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await BiBilityAuthorityApi.getBiResponsibilityAuthorityList(queryParams).catch(
      () => {
        loading.value = false
      }
    )
    if (data) {
      list.value = data.data || []
      total.value = data.total
    }
    if (list.value.length > 0) {
      list.value.forEach((item) => {
        item.isEdit = false
        item.editTargetAmount = item.targetAmount
      })
      dataDate.value = list.value[0].dataDate || ''
    } else {
      dataDate.value = ''
    }
    list.value.forEach((item) => {
      item.salesAmount = numberFormateShow(Math.round(item.salesAmount))
      item.refundAmount = numberFormateShow(Math.round(item.refundAmount))
      item.cleanSalesAmountReal = numberFormateShow(Math.round(item.cleanSalesAmountReal))
      item.cleanSalesAmount = numberFormateShow(Math.round(item.cleanSalesAmount))
      item.excessNetProfit = numberFormateShow(Math.round(item.excessNetProfit))
    })
  } finally {
    loading.value = false
  }
}

const shortName = (name) => {
  if (name.length > 2) {
    if (isChinese(name.substring(2, 3))) {
      return name.substring(1, 3)
    } else {
      return name.substring(0, 2)
    }
  } else {
    return name
  }
}

// 字符串是否中文
const isChinese = (str) => {
  var reg = /^[\u4E00-\u9FA5\uF900-\uFA2D]+$/
  return reg.test(str)
}

const completionRateFullStr = (completionRate) => {
  if (completionRate) {
    return `${completionRate}%`
  }
  return ''
}

const completionRateColor = (completionRate) => {
  if (completionRate && Number(completionRate) > 100) {
    return '#349B34'
  }
  return '#333'
}

const handleMouseOver = (row) => {
  row.isEdit = true
}

const mouseEnterRowId = ref('')

const handleCellMouseEnter = (row) => {
  mouseEnterRowId.value = row.id
}

const handleCellMouseLeave = () => {
  mouseEnterRowId.value = ''
}

const isSavingTargetAmount = ref(false)
const saveTargetAmount = async (row) => {
  if (isSavingTargetAmount.value) {
    return
  }
  if (row.editTargetAmount && row.editTargetAmount !== row.targetAmount) {
    isSavingTargetAmount.value = true
    try {
      await BiBilityAuthorityApi.biResponsibilityAuthoritySave({
        id: row.id,
        name: row.name,
        dept: row.deep,
        targetAmount: row.editTargetAmount
      }).catch(() => {
        message.success('编辑失败')
        row.editTargetAmount = row.targetAmount
        setTimeout(() => {
          isSavingTargetAmount.value = false
        }, 200)
      })
      row.targetAmount = row.editTargetAmount
      getList()
      setTimeout(() => {
        isSavingTargetAmount.value = false
      }, 200)
    } finally {
      row.isEdit = false
    }
  } else {
    row.editTargetAmount = row.targetAmount
    row.isEdit = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.page = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/**
 * 复制目标金额
 */
const copyTargetAmount = async () => {
  // 状态的二次确认
  await message.confirm('是否确认复制上个月的目前额为本月目标额')
  copyLoading.value = true
  await BiBilityAuthorityApi.biResponsibilityAuthorityCopy().catch(() => {
    copyLoading.value = false
  })
  copyLoading.value = false
  message.success('复制目标金额成功')
}

const formRef = ref()
const targetRef = ref()
// 编辑
const edit = (id) => {
  formRef.value.open(id)
}

// 编辑个人目标
const editPersonalTarget = (row) => {
  targetRef.value.open(row.id)
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.userNameAvatar {
  width: 28px;
  height: 28px;
  background: #0064ff;
  border-radius: 14px;
  &-text {
    font-size: 12px;
    color: #ffffff;
    line-height: 28px;
    text-align: center;
  }
}
.userName {
  padding-left: 10px;
  color: #333333;
  line-height: 22px;
}
.dataDate {
  padding-left: 20px;
  font-size: 14px;
  color: #333;
  line-height: 20px;
}
.row-input {
  width: 98px;
  height: 32px;
  background: #f2f6fc;
  border-radius: 4px;
  border: 1px solid #2f8df5;
  :deep(.el-input__wrapper) {
    box-shadow: none;
    height: auto;
  }
}

.personalTarget {
  cursor: pointer;
  width: 88px;
  height: 32px;
  background: #0064ff;
  border-radius: 4px;
  font-size: 12px;
  color: #ffffff;
  line-height: 32px;
  text-align: center;
  position: absolute;
  top: 14px;
}
</style>
