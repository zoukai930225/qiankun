<!--
 * @Date: 2025-01-03 16:22:21
-->
<template>
  <div>
    <el-table
      class="SWCommonTable"
      :data="sortedTableData"
      width="100%"
      :show-overflow-tooltip="true"
      v-loading="loading"
      v-horizontal-scroll="'always'"
      row-class-name="commonTableRow"
      :header-cell-style="appStore.headerCellStyle"
      @sort-change="handleSortChange"
      @cell-click="handleCellClick"
    >
      <el-table-column label="" width="80">
        <template #default="scope">
          <div class="row-center" v-if="scope.row.isNewProgress == '1'">
            <div class="messageWarn">
              <div class="messageWarn-text">新进度！</div>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="planName" label="企划名称" sort-by="planName" sortable>
        <template #default="scope">
          <div class="row-center">
            <span class="linkColor" @click="routeHandle(scope.row.planName)">{{
              scope.row.planName
            }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="planType" label="企划类型" sort-by="planType" sortable>
        <template #default="scope">
          <div class="row-center">
            <PlanType :planType="scope.row.planType" />
          </div>
        </template>
      </el-table-column>

      <el-table-column label="店铺" sort-by="store" sortable prop="store">
        <template #default="scope">
          <span>{{ scope.row.storeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交人">
        <template #default="scope">
          <!-- 人员 -->
          <SWSelectPeople
            style="width: 100%"
            :isEdit="false"
            :multiple="true"
            v-if="scope.row.submitUserId"
            :member-list="handleJSONParse(scope.row)"
          />
          <div v-else>--</div>
        </template>
      </el-table-column>
      <el-table-column label="计划上架日期" prop="planListDate" sortable sort-by="planListDate">
        <template #default="scope">
          <!-- 时间格式化 -->
          <span>{{ scope.row.planListDate }}</span>
        </template>
      </el-table-column>

      <el-table-column label="企划时间">
        <template #default="scope">
          <span>{{ scope.row.planStartTime }}-{{ scope.row.planEndTime }}</span>
        </template>
      </el-table-column>

      <!-- 添加操作列 -->
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" :icon="View" @click="handleView(row)"> 详情 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter()
import { useAppStore } from '@/store/modules/app'
import PlanType from '@/views/OA/package/components/planType.vue'
import SWSelectPeople from '@/views/OA/package/develop/components/SWSelectPeople.vue'
import { View } from '@element-plus/icons-vue'
import { useCategoryList } from '../hooks.js'

import { updateDevelopManageProgress } from '@/api/oa/package/develop'

const appStore = useAppStore()
const { categoryList, initSelectData } = useCategoryList()
// 定义类型
interface Field {
  id: string
  listDisplay: boolean
  name: string
  code: string
  state: number
  type: number
  supportSort: boolean
}

const currentPage = ref(1)
const pageSize = ref(10)

const sortProp = ref('')
//@ts-ignore
const sortOrder = ref<'ascending' | 'descending'>('')
const handleSortChange = ({ prop, order }) => {
  console.log('排序事件11', prop, order)
  sortProp.value = prop
  sortOrder.value = order
  // 排序字段 1-顺序 2-倒叙 null-不排序
  const custorOrder = order == 'ascending' ? 1 : order == 'descending' ? 2 : null
  emit('sortChange', { prop, custorOrder })
}

const props = defineProps({
  tableData: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  total: {
    type: Number,
    default: 0
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const sortedTableData = ref<any[]>([])
watch(
  () => props.tableData,
  (newData) => {
    sortedTableData.value = [...newData]
  },
  { immediate: true }
)

const routeHandle = (planName) => {
  router.push({name: 'PackageDevelop',query: {
    planName
  }})
}

onMounted(() => {
  initSelectData()
})

const handleJSONParse = (row) => {
  return [
    {
      avatarOrigin: row.submitUserAvatarOrigin,
      userName: row.submitUserName,
      userId: row.submitUserId
    }
  ]
}

const emit = defineEmits(['pageChange', 'edit', 'seeDetail', 'del', 'sortChange', 'updateProgress'])

const handleView = (row: any) => {
  emit('seeDetail', row)
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  emit('pageChange', { page: currentPage.value, pageSize: val })
}

// 分页
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  emit('pageChange', { page: val, pageSize: pageSize.value })
}

// 更新当前页
const updateCurrentPage = (page: number) => {
  currentPage.value = page
}

// 处理点击列事件
const handleCellClick = async (row: any) => {
  if (Number(row.isNewProgress || 0) == 1) {
    // 有新提醒
    await updateDevelopManageProgress(row.id)
    emit('updateProgress', { id: row.id, isNewProgress: '0' })
  }
}

defineExpose({
  updateCurrentPage
})
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.linkColor {
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  color: #0064ff;
}

.tableValueStyle {
  font-weight: 400;
  font-size: 14px;
  color: #333333;
}

.is-sorted .cell {
  background-color: #f5f5f5;
}

.palnCountTable {
  :deep(.el-table__row) {
    // background: #f2f7ff;
    // border-radius: 7px;
  }

  :deep(.el-table__inner-wrapper:before) {
    // background: #fff !important;
  }

  // :deep(.el-table td.el-table__cell) {
  //   border-bottom: 8px solid red;
  // }
}

.messageWarn {
  font-weight: 500;
  font-size: 12px;
  color: #ffffff;
  line-height: 21px;
  height: 21px;
  background: #ff0000;
  border-radius: 100px 6px 0px 100px;

  &-text {
    padding-left: 5px;
    padding-right: 0px;
  }
}
</style>
