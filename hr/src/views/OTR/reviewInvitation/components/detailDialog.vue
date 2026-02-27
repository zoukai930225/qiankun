<template>
  <div>
    <Dialog
      :width="1300"
      v-model="dialogVisible"
      :modal-append-to-body="false"
      :title="dialogTitle"
    >
      <div class="search">
        <div class="commonTopFilterWrap-filter">
          <el-form ref="queryFormRef" :inline="true" label-width="80px" @submit.prevent>
            <el-form-item label="评价对象" prop="keyword">
              <el-input
                placeholder="请输入"
                clearable
                v-model="queryParams.keyword"
                @keyup.enter="getList"
                @clear="getList"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="table">
        <el-table
          :header-cell-style="appStore.headerCellStyle"
          :data="list"
          :show-overflow-tooltip="true"
          row-class-name="commonTableRow1"
          class="SWCommonTable"
          v-horizontal-scroll="'always'"
          max-height="580"
        >
          <el-table-column label="评价对象" prop="objectName">
            <template #default="{ row }">
              <otrUser :data="{ name: row.objectName, avatarOrigin: row.avatarOrigin }" />
            </template>
          </el-table-column>
          <el-table-column label="问卷名称" prop="surveyName" />
          <el-table-column label="题目名称" prop="questionName" />
          <el-table-column label="评价分数" prop="questionScore" />
          <el-table-column label="等级" prop="scoreLevel" />
        </el-table>
      </div>
    </Dialog>
  </div>
</template>
<script lang="ts" setup>
import { getQuerySurveyList, getQuerySurveyByAppraiseeList } from '@/api/otr/reviewInvitation/index'
import { useAppStore } from '@/store/modules/app'
import otrUser from '../../components/otrUser.vue'
const appStore = useAppStore()
const queryParams = ref({
  keyword: '',
  page: 1,
  size: 10,
  appraiseeId: undefined,
  evaluatorId: undefined,
  inventoryId: undefined
})
const list = ref()

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
/** 打开弹窗 */
const open = async (params) => {
  queryParams.value.keyword = ''
  list.value = []
  dialogVisible.value = true
  dialogTitle.value = '评价详情'
  if (params.evaluatorId) {
    queryParams.value.evaluatorId = params.evaluatorId
  }
  if (params.appraiseeId) {
    queryParams.value.appraiseeId = params.appraiseeId
  }
  queryParams.value.inventoryId = params.inventoryId

  getList()
}

const getList = async () => {
  if (queryParams.value.evaluatorId) {
    const res = await getQuerySurveyList(queryParams.value)
    list.value = res || []
  } else if (queryParams.value.appraiseeId) {
    const res = await getQuerySurveyByAppraiseeList(queryParams.value)
    list.value = res || []
  }
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
</script>

<style lang="scss" scoped>
.table {
  width: 100%;
  box-sizing: border-box;
}
</style>
