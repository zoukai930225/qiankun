<template>
  <div>
    <!-- 列表 -->
    <ContentWrap>
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="78px">
            <el-form-item label="关键字:" prop="keyWord">
              <el-input
                v-model.trim="queryParams.keyWord"
                placeholder="请输入班次名称或创建人"
                clearable
                @keydown.enter="
                  ($event) => {
                    $event.preventDefault()
                    handleQuery()
                  }
                "
                @clear="handleQuery"
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
            <el-button type="primary" :disabled="btnSwitch" :loading="btnSwitch" @click="onAdd">
              <el-icon class="mr7px" color="#fff"><Plus /></el-icon>
              新建班次
            </el-button>
          </div>
        </div>
      </div>

      <el-table
        :header-cell-style="appStore.headerCellStyle"
        v-loading="loading"
        :data="records"
        class="SWCommonTable"
        v-horizontal-scroll="'always'"
        show-overflow-tooltip
      >
        <el-table-column label="班次名称" min-width="100%" prop="shiftName" fixed="left" />
        <el-table-column label="班次类型" min-width="100%" prop="shiftTypeName" fixed="left" />
        <el-table-column
          label="考勤时间"
          min-width="200%"
          prop="specificationName"
          fixed="left"
          width="360"
        >
          <template #default="{ row }">
            <div
              v-for="(item, index) in row.shiftTimes"
              :key="index"
              class="time-tag"
              :class="{
                night: item.workEndTimeOffset || row.shiftTypeName === '夜班'
              }"
              >{{ shiftTimeStr(item) }}</div
            >
          </template>
        </el-table-column>
        <el-table-column label="创建人" min-width="100%" prop="createdName" />
        <el-table-column label="最后更新时间" min-width="200%" prop="updatedAt" />
        <el-table-column
          label="操作"
          min-width="150%"
          :width="160"
          prop="cpqInventory"
          fixed="right"
          align="center"
        >
          <template #default="{ row }">
            <el-button link type="primary" @click="onCopy(row)">复制</el-button>
            <el-button link type="primary" @click="onEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="onDelete(row)">删除</el-button>
          </template>
        </el-table-column>
        <template #empty>
          <img src="@/assets/imgs/empty/empty1.png" alt="" />
          <div>暂无相关内容</div>
        </template>
      </el-table>

      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </ContentWrap>
    <edit-drawer
      v-model:is-show="isShow"
      :drawer-type="drawerType"
      :id="drawerId"
      @submit-success="getList"
    />
  </div>
</template>
<script lang="ts" setup>
import { deleteShift, getShiftList } from '@/api/storage/attendance'
import { useAppStore } from '@/store/modules/app'
import EditDrawer from './components/editDrawer.vue'

defineOptions({ name: 'Shift' })

const appStore = useAppStore()
const loading = ref(false)
const records = ref<StorageAttendance.ShiftList[]>([])
const total = ref(0)
const queryFormRef = ref()
const btnSwitch = ref(false)
const isShow = ref(false)
const drawerType = ref()
const drawerId = ref('')
const message = useMessage()

// 搜索参数
const queryParams = ref<StorageAttendance.GetShiftListParams>({
  page: 1,
  pageSize: 10
})

// 搜索
async function handleQuery() {
  queryParams.value.page = 1
  getList()
}

// 重置
async function resetQuery() {
  queryFormRef.value.resetFields()
  getList()
}

// 获取列表
async function getList() {
  loading.value = true
  try {
    const res = await getShiftList(queryParams.value)

    records.value = res.records
    total.value = res.total
  } catch (error) {
  } finally {
    loading.value = false
  }
}

// 返回班次时间字符串
const shiftTimeStr = (item: StorageAttendance.ShiftTimeVo) =>
  item.workEndTimeOffset === 0
    ? `${item.workStartTime} - ${item.workEndTime}`
    : `${item.workStartTimeOffset ? '次日' : '当日'} ${item.workStartTime} - ${item.workEndTimeOffset ? '次日' : '当日'} ${item.workEndTime}`

// 新增
function onAdd() {
  drawerType.value = 'add'
  isShow.value = true
}

// 复制
function onCopy(row: StorageAttendance.ShiftList) {
  drawerType.value = 'copy'
  drawerId.value = row.id!
  isShow.value = true
}

// 编辑
function onEdit(row: StorageAttendance.ShiftList) {
  drawerType.value = 'edit'
  drawerId.value = row.id!
  isShow.value = true
}

// 删除
async function onDelete(row: StorageAttendance.ShiftList) {
  try {
    await message.confirm('确定删除这个班次吗？删除后将无法恢复！')
    const res = await deleteShift(row.id!)
    if (res.success) {
      message.success('删除成功')
      getList()
    }
  } catch (error) {}
}

onMounted(() => {
  getList()
})
</script>

<style scoped lang="less">
:deep(td.el-table__cell) {
  padding: 16px 0;
}
:deep(.cell) {
  display: flex;
  flex-wrap: wrap;

  .time-tag {
    display: flex;
    align-items: center;
    height: 29px;
    padding: 6px 10px;
    margin-right: 14px;
    font-size: 12px;
    color: #333;
    border-radius: 14.5px;
    background-color: #333;

    .morning {
      background: rgba(52, 155, 52, 0.1);
    }

    .noon {
      background-color: rgba(255, 169, 3, 0.1);
    }

    .afternoon {
      background-color: rgba(243, 120, 68, 0.1);
    }

    &:nth-of-type(n + 4) {
      margin-top: 12px;
    }

    &:nth-of-type(3n + 1) {
      .morning();
    }

    &:nth-of-type(3n + 2) {
      .noon();
    }

    &:nth-of-type(3n + 3) {
      .afternoon();
    }

    &.night {
      background-color: rgba(0, 100, 255, 0.1);
    }
  }
}
</style>
