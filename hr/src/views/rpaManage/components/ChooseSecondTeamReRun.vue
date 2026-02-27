<template>
  <div>
    <!-- 列表弹窗 -->
    <el-dialog class="commomDialig chooseTeam" v-model="dialogVisible" destroy-on-close>
      <template #header>
        <div class="chooseTeam-title"> 选择二级梯队应用 </div>
      </template>
      <div>
        <el-table
          :data="tableData"
          height="348px"
          :header-cell-style="{ background: '#F2F6FC' }"
          @selection-change="handleSelectionChange"
          class="table-style SWCommonTable"
          v-horizontal-scroll="'always'"
          v-loading="loading"
          element-loading-text="数据加载中..."
          show-overflow-tooltip
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="应用名称" prop="name" />
          <el-table-column label="应用编码" prop="code">
            <template #default="scope">
              {{ scope.row.code || '--' }}
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="status">
            <template #default="scope">
              {{ scope.row.status == 0 ? '未执行' : scope.row.status == 1 ? '已执行' : '--' }}
            </template>
          </el-table-column>
        </el-table>
      </div>

      <template #footer>
        <!-- <el-button @click="updateStatusVisible = false">取消</el-button> -->
        <el-button type="primary" @click="updateStatus">修改状态</el-button>
      </template>
    </el-dialog>

    <!-- 修改状态弹窗 -->
    <el-dialog title="任务状态" v-model="updateStatusVisible" width="300">
      <!-- <div>修改为：</div> -->
      <el-select v-model="selectedStatus" placeholder="请选择" required>
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <template #footer>
        <el-button @click="updateStatusVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitStatus">确 定</el-button>
      </template>
    </el-dialog>
  </div>
  <!--  -->
</template>
<script setup lang="ts">
import { ref } from 'vue'
import * as rpaApi from '@/api/rpaManage'

const message = useMessage()
const dialogVisible = ref(false) // 列表弹窗是否可见
const updateStatusVisible = ref(false) // 修改状态弹窗
const tableData = ref([]) // 表格数据

// 应用id
const queryParams = ref({
  groupId: ''
})

/** 打开弹窗 */
const open = async (groupId: string) => {
  dialogVisible.value = true
  queryParams.value.groupId = groupId
  await getList()
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

// 获取数据
const loading = ref(false)
const getList = async () => {
  loading.value = true
  tableData.value = []
  try {
    const data = await rpaApi.getEchelonList(queryParams.value)
    tableData.value = data
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

// 选中的应用
const selectedData = ref([])
const handleSelectionChange = (val: any) => {
  selectedData.value = val
}

// 点击修改状态打开弹窗
const updateStatus = () => {
  if (selectedData.value.length === 0) {
    return message.warning('请选择需要修改的二级梯队应用')
  }
  updateStatusVisible.value = true
  selectedStatus.value = 0
}

const selectedStatus = ref(0)
const statusOptions = [
  { label: '未执行', value: 0 },
  { label: '已执行', value: 1 }
]

// 提交修改状态
const submitStatus = async () => {
  let submitData = {
    status: selectedStatus.value,
    groupIds: selectedData.value.map((item: any) => item.id)
  }
  try {
    await rpaApi.updateEchelonStatus(submitData)
    message.success('修改成功')
    updateStatusVisible.value = false
    await getList()
  } catch (error) {
    message.error('修改失败')
  }
}
</script>
<style lang="scss">
.chooseTeam {
  width: 960px;
  height: 536px;
  background: linear-gradient(
    226deg,
    #f2f3ff 0%,
    #ffffff 39%,
    #ffffff 88%,
    #e8f6fd 95%,
    #f0f8ff 100%
  );
  border-radius: 14px;
  box-shadow: 10px 10px 24px 0px rgba(0, 0, 0, 0.07);
}
</style>
<style lang="scss" scoped>
.chooseTeam-title {
  color: #333333;
  font-weight: 600;
}

// 表格
.table-style {
  width: 100%;
  background: transparent;
  margin-top: 20px;
}
// 表格变成透明背景
:deep(.el-table tr) {
  background: transparent;
}
/* 去掉table 最底部的线 */
:deep(.table-style .el-table__inner-wrapper::before) {
  background-color: transparent;
}
</style>
