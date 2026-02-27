<!--
 * @Date: 2024-06-06 10:13:37
-->
<template>
  <div>
    <ContentWrap>
      <el-form
        class="-mb-15px"
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="78px"
        @submit.prevent
      >
        <el-form-item label="企业" prop="company">
          <el-select
            style="width: 200px"
            class="dialogFormItemWidth"
            v-model="formData.company"
            placeholder="请选企业"
            clearable
          >
            <el-option
              v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_DYNAMIC_COMPANY)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门:" prop="departmentId">
          <el-select
            style="width: 200px"
            v-model="queryParams.departmentId"
            placeholder="请选择部门"
            clearable
          >
            <el-option
              v-for="dict in DepartmentOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="统计时间:" prop="createTime">
          <el-date-picker
            v-model="queryParams.createTime"
            value-format="YYYY-MM-DD"
            type="daterange"
            placeholder="请选择统计时间"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            class="!w-200px"
            @change="handleQuery"
          />
        </el-form-item>

        <el-form-item label="状态:" prop="zz">
          <el-select
            style="width: 200px"
            v-model="queryParams.jobFlag"
            placeholder="请选择状态"
            clearable
          >
            <el-option
              v-for="dict in employeeStatusDictionary"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="flex-row bottom-wapper">
        <div><span class="desc-number mt-40">总人数：135人</span></div>
        <div class="flex-column dashboard-content">
          <div>
            <div id="main" class="main"></div>
          </div>
          <div>
            <el-form-item label="状态:" prop="groupByField">
              <el-select
                style="width: 200px"
                v-model="queryParams.groupByField"
                placeholder="请选择状态"
                @change="groupFieldChange"
                clearable
              >
                <el-option
                  v-for="dict in groupField"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </div>
        </div>
      </div>
    </ContentWrap>
  </div>
</template>
<script lang="ts" setup>
import * as echarts from 'echarts'
defineOptions({ name: 'PeopleDashboard' })
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

import {
  getDashboardSource,
  getDashboardGroupField,
  getDepartment
} from '@/api/hrAdmin/peopleManagement/index'
import { employeeStatusDictionary } from '@/utils/common'

const formData = ref({
  pId: '0',
  id: undefined,
  parentName: '',
  name: '',
  company: ''
})

onMounted(() => {
  getDepartmentOption()
  initGroupField()
  getList()
  initecharts()
})

// 获取一级部门下拉
const DepartmentOptions = ref([{ label: undefined, value: '' }])
const getDepartmentOption = async () => {
  const res = await getDepartment()
  DepartmentOptions.value = res.map((item) => {
    return {
      label: item,
      value: item
    }
  })
}

const queryParams = reactive({
  departmentId: undefined, // 部门id
  name: undefined,
  createTime: undefined,
  groupByField: 'education', // 分组id
  jobFlag: undefined // 在职/离职
})

const groupField = ref()
// 获取人员看板分组字段
const initGroupField = async () => {
  const res = await getDashboardGroupField()
  groupField.value = Object.keys(res).map((key) => {
    return {
      label: res[key],
      value: key
    }
  })
  console.log(groupField.value, ' groupField.value ')
}

const getList = async () => {
  // const params = {
  //   groupByField: undefined,
  //   jobFlag: undefined, //在职状态 :0在职 1离职
  //   departmentId: undefined, //部门id
  //   startTime: undefined, //开始时间
  //   endTime: undefined //结束时间
  // }
  const res = await getDashboardSource(queryParams)
  console.log(res, 'getList')
}

const groupFieldChange = (value) => {
  console.log(value, '????')
}

const initecharts = () => {
  var chartDom = document.getElementById('main')
  var myChart = echarts.init(chartDom)
  var option
  option = {
    tooltip: {
      trigger: 'item'
    },
    // legend: {
    //   orient: 'horizontal',
    //   left: 20,
    //   bottom: 20
    // },
    series: [
      {
        name: '自定义名字',
        type: 'pie',
        radius: '50%',
        data: dataSource,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }

  option && myChart.setOption(option)
}

const handleQuery = () => {}

const dataSource = reactive([
  { value: 1048, name: 'Search Engine' },
  { value: 735, name: 'Direct' },
  { value: 580, name: 'Email' },
  { value: 484, name: 'Union Ads' },
  { value: 300, name: 'Video Ads' }
])
</script>

<style scoped>
.flex-column {
  display: flex;
  flex-direction: column;
}
.flex-row {
  display: flex;
  flex-direction: row;
}

.mt-40 {
  margin-top: 40px;
}

.flex-center {
  align-items: center;
}
.main {
  width: 500px;
  height: 500px;
}
.desc-number {
  padding: 10px 20px;
  background: #6fe8d8;
  border-radius: 20px;
  display: inline-block;
}
.dashboard-content {
  padding-left: 20px;
  align-items: center;
}

.bottom-wapper {
  margin-left: 10%;
}
</style>
