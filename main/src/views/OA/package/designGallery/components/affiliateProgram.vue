<!--
 * @Date: 2025-02-11 17:22:22
-->
<template>
  <el-dialog v-model="visible" width="1200px" :before-close="close">
    <div>
      <div class="search">
        <el-form v-model="searchForm" inline ref="searchFormRef">
          <el-form-item prop="planName" label="企划名称">
            <el-input v-model="searchForm.planName" placeholder="请输入企划名称" clearable />
          </el-form-item>
          <el-form-item prop="taskCode" label="任务编号">
            <el-input v-model="searchForm.taskCode" placeholder="请输入任务编号" clearable />
          </el-form-item>
        </el-form>
        <div>
          <el-button @click="search" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="reset" class="commonResetBtn" style="margin-left: 0"> 重置 </el-button>
        </div>
      </div>

      <el-table
        class="SWCommonTable"
        :data="list"
        width="100%"
        height="100%"
        :show-overflow-tooltip="true"
        v-loading="loading"
        v-horizontal-scroll="'always'"
        row-class-name="commonTableRow"
        :header-cell-style="appStore.headerCellStyle"
      >
        <el-table-column width="70">
          <template #default="scope">
            <el-radio-group v-model="selectedRadio">
              <el-radio
                :key="scope.row.id"
                :value="scope.row.id"
                @change="handleRadioChange(scope.row)"
              />
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column property="taskCode" label="任务编号" :show-overflow-tooltip="false" />
        <el-table-column prop="planName" label="企划名称" />
        <el-table-column property="storeName" label="店铺" prop="storeName" />
        <el-table-column property="seriesCode" label="系列">
          <template #default="scope">
            <div class="row-center">
              {{ scope.row.seriesName }}
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        />
      </div>
    </div>
    <template #header="{}">
      <div class="my-header">
        <span>关联开发任务</span>
      </div>
    </template>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="confirmDialog" :disabled="!selectedRadio">提交</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { getDevelopList } from '@/api/oa/package/develop'
import { useAppStore } from '@/store/modules/app'
import { debounce } from 'lodash-es'
const appStore = useAppStore()

const list = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const visible = ref(false)

const selectedRadio = ref<number | null>(null)

const searchForm = reactive({
  planName: undefined,
  taskCode: undefined
})

const handleRadioChange = (row: any) => {
  selectedRadio.value = row.id
}

const open = () => {
  visible.value = true
  getList()
}

defineExpose({
  open
})

const search = () => {
  currentPage.value = 1
  getList()
}

const searchFormRef = ref()
const reset = () => {
  currentPage.value = 1
  searchForm.taskCode = undefined
  searchForm.planName = undefined
  selectedRadio.value = null
  getList()
}

const getList = async () => {
  loading.value = true
  const data = {
    page: currentPage.value,
    size: pageSize.value,
    ...searchForm
  }

  const res = await getDevelopList(data)
  list.value = res.records
  total.value = res.total
  loading.value = false
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  getList()
}

// 分页
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getList()
}

const emit = defineEmits(['update:modelValue', 'confirm'])

const close = () => {
  visible.value = false
}

const confirmDialog = debounce(async () => {
  emit('confirm', {
    taskId: selectedRadio.value //开发任务id
  })
  visible.value = false
  selectedRadio.value = null
}, 300)
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}

.my-header {
  display: flex;
  align-items: center;

  .shenhe-title {
    width: 14px;
    height: 16px;
    margin-right: 3px;
  }
}

.pagination {
  margin-top: 10px;
  display: flex;
  justify-content: end;
}

.search {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
