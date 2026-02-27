<template>
  <div class="card">
    <div class="header-top">
      <div class="tip"></div>
      <div class="title">基本信息</div>
    </div>
    <div class="card-body">
      <el-form :model="queryParams" label-width="70px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item prop="supplierParam" label="供应商信息" class="longLabel">
              <el-input
                v-model="queryParams.supplierParam"
                placeholder="请输入供应商信息"
                @keydown.enter="onSearch(queryParams)"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="chooseReason" label="选用原因">
              <el-input
                v-model="queryParams.chooseReason"
                placeholder="请输入选用原因"
                @keydown.enter="onSearch(queryParams)"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="operateUser" label="操作人">
              <LineStaffs
                v-model="queryParams.operateUser"
                multiple
                placeholder="请选择操作人"
                :tags="1"
                clearable
                @change="onSearch(queryParams)"
              ></LineStaffs>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="chooseTime" label="选用时间">
              <el-date-picker
                type="daterange"
                v-model="queryParams.chooseTime"
                startPlaceholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD"
                clearable
                range-separator="-"
                @change="onSearch(queryParams)"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <s-table
        ref="tableRef"
        border
        :columns="columns"
        :fetch="getList"
        :fetch-params="queryParams"
        row-key="id"
        pagination-teleport="#fabric-choose-record-footer"
      >
        <template #actions="{ row }">
          <lineAvatar
            :user="row"
            image="operateUserAvatarOrigin"
            name="operateUserName"
          ></lineAvatar>
        </template>
      </s-table>
      <!-- <template #footer> -->
      <div id="fabric-choose-record-footer"></div>
      <!-- </template> -->
    </div>
  </div>
</template>

<script lang="tsx" setup>
import request from '@/config/axios'
import type { TableColumn } from '@/components/SWTable/src/table'
import LineStaffs from '@/components/template/table/components/lineStaffs.vue'
import lineAvatar from '@/components/template/table/components/lineAvatar.vue'
const props = defineProps({
  id: {
    type: String,
    default: ''
  }
})
const getList = (params: any) => {
  const data = { ...params }
  delete data.chooseTime
  delete data.operateUser
  delete data.chooseTime
  return request.get({
    url: `/workflow-api/api/workflow/business/fabric/choose/pageList`,
    params: data
  })
}

const tableRef = ref()
const onSearch = async (val: any) => {
  const [chooseStartTime, chooseEndTime] = val?.chooseTime || []
  queryParams.value = {
    supplierParam: val?.supplierParam || '',
    fabricClassId: val?.fabricCategoryId || '',
    chooseReason: val?.chooseReason || '',
    chooseStartTime: chooseStartTime || '',
    chooseEndTime: chooseEndTime || '',
    chooseTime: val?.chooseTime || [],
    fabricCenterId: props.id,
    operateUser: val?.operateUser || [],
    operateUserId: val?.operateUser ? val?.operateUser.map((item: any) => item.userId).join() : ''
  }
  await nextTick()
  tableRef.value?.refresh?.(true)
}

const reset = () => {
  onSearch(null)
}

// 查询参数（按后端字段命名）
const queryParams = ref<any>({
  supplierParam: '',
  fabricCenterId: props.id,
  chooseReason: '',
  operateUserId: '',
  chooseStartTime: '',
  chooseEndTime: '',
  chooseTime: [],
  operateUser: []
})

// 表格列
const columns: TableColumn[] = [
  {
    prop: 'abbreviationCompany',
    label: '供应商简称',
    minWidth: 100,
    align: 'left',
    headerAlign: 'left'
  },
  {
    prop: 'fullCompany',
    label: '公司名称',
    minWidth: 185,
    align: 'left',
    headerAlign: 'left'
  },
  {
    prop: 'chooseReason',
    label: '选用原因',
    minWidth: 243,
    align: 'left',
    headerAlign: 'left'
  },
  {
    prop: 'chooseTime',
    label: '选用时间',
    width: 180,
    align: 'left',
    headerAlign: 'left',
    showOverflowTooltip: true
  },
  {
    prop: 'actions',
    label: '操作人',
    width: 100,
    align: 'left',
    headerAlign: 'left',
    showOverflowTooltip: true
  }
]
</script>

<style lang="scss" scoped>
:deep() {
  .el-form-item {
    margin: 0px 0px 18px 0;
  }
  .longLabel {
    .el-form-item__label {
      line-height: 16px;
    }
  }
}

.card {
  background-color: #ffffff;
  border-radius: 8px;
  .header-top {
    padding: 16px 20px;
    display: flex;
    align-items: center;
    border-bottom: solid #f0f0f0 1px;
    box-sizing: border-box;
    .tip {
      width: 3px;
      height: 10px;
      background-color: #0d84ff;
    }
    .title {
      font-size: 14px;
      margin-left: 6px;
      font-weight: 600;
    }
  }
  .card-body {
    padding: 20px;
  }
}
</style>
