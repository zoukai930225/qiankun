<template>
  <el-dialog v-model="dialogVisible" :width="1200" class="oadialog-background" :show-close="false">
    <template #header>
      <div class="my-header">
        <span>千川账号明细</span>
        <img
          src="@/assets/imgs/negativeReviewDashboard/close.svg"
          alt=""
          class="close-icon"
          @click="dialogVisible = false"
        />
      </div>
    </template>

    <div class="dialog-content" v-loading="loading">
      <div class="queryForm">
        <el-form inline>
          <el-form-item label="开始日期">
            <el-date-picker
              style="width: 200px"
              v-model="queryParams.beginDate"
              value-format="YYYY-MM-DD"
              type="date"
              placeholder="请选择开始时间"
              @change="handleChangeStartDate"
            />
          </el-form-item>
          <el-form-item label="结束日期">
            <el-date-picker
              style="width: 200px"
              v-model="queryParams.endDate"
              value-format="YYYY-MM-DD"
              type="date"
              placeholder="请选择结束时间"
              @change="handleChangeEndDate"
            />
          </el-form-item>
          <el-form-item>
            <el-button @click="handleQuery" class="commonSearchBtn">
              <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
              搜索
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <list-table :list="list" :total="total" :loading="loading" :isView="true" />
      <Pagination
        v-model:limit="queryParams.size"
        v-model:page="queryParams.page"
        :total="total"
        @pagination="getList"
      />
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
defineOptions({ name: 'AccountCostViewDialog' })
import * as QcApi from '@/api/qianchuan'
import listTable from '@/views/qianchuan/accountDetail/components/listTable.vue'
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false)
const loading = ref(false)
const total = ref(0)
const list = ref<any>([])
const queryParams = ref<any>({
  size: 10,
  page: 1,
  type: '',
  channel: '', // 渠道
  store: '', // 店铺
  account: '', // 千川账号
  beginDate: '', // 开始日期
  endDate: '' // 结束日期
})
const handleChangeStartDate = (val) => {
  if (!val) return
  const endDate = queryParams.value.endDate
  if (new Date(endDate).getTime() <= new Date(val).getTime() - 8.64e7) {
    queryParams.value.beginDate = ''
    return message.confirm('开始时间不能大于结束时间')
  } else {
    getList()
  }
}
const handleChangeEndDate = (val) => {
  if (!val) return
  const startDate = queryParams.value.beginDate
  if (new Date(val).getTime() <= new Date(startDate).getTime() - 8.64e7) {
    queryParams.value.endDate = ''
    return message.confirm('结束时间不能小于开始时间')
  } else {
    getList()
  }
}
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}
const getList = async () => {
  try {
    loading.value = true

    const params = { ...queryParams.value }
    const res = await QcApi.getQcAccountDetailList(params)
    list.value = res.records || []
    total.value = res.total || 0
  } finally {
    loading.value = false
  }
}

// 打开弹窗
const open = async (account: string, type: string) => {
  dialogVisible.value = true
  queryParams.value.account = account
  queryParams.value.type = type
  getList()
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<style scoped lang="scss">
.my-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .close-icon {
    width: 18px;
    height: 18px;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
}

.dialog-content {
  padding: 20px;
  padding-bottom: 60px;
}

.detail-form {
  :deep(.el-input__wrapper) {
    background-color: #f5f7fa;
    box-shadow: none;
  }

  :deep(.el-form-item__label) {
    font-weight: 500;
    color: #333;
  }
}
</style>

<style lang="scss">
.oadialog-background {
  border-radius: 20px;
  background-image: url('@/assets/imgs/oa/oa_design_audit_bg.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;

  .dialog-content {
    background: #ffffff;
    border-radius: 20px;
    margin: 0 auto;
    padding-top: 20px;
    box-sizing: border-box;
  }
}
</style>
