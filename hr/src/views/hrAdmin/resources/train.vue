<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="78px">
          <el-form-item label="姓名" prop="name">
            <el-input class="searchFormItemWidth" v-model="queryParams.name" placeholder="请输入姓名" clearable
              @clear="handleQuery" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="转正状态" prop="applicationStatus">
            <el-select class="searchFormItemWidth" v-model="queryParams.applicationStatus" placeholder="请选择转正状态"
              clearable @change="handleQuery" @clear="handleQuery">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.FEISHU_APPLICATION_STATUS, true)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="员工状态" prop="status">
            <el-select class="searchFormItemWidth" v-model="queryParams.status" placeholder="请选择员工状态" clearable
              @change="handleQuery" @clear="handleQuery">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.FEISHU_STATUS, true)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="部门" prop="deptId">
            <Menuitem v-model="queryParams.deptId" @change="handleSearch" />
          </el-form-item>
          <el-form-item label="HR" prop="hrName" v-show="showMore">
            <el-select popper-class="eloption" :popper-append-to-body="true" v-model="selectHrId" placeholder="请选择人员"
              class="searchFormItemWidth" @change="handleSelectChange" filterable clearable default-first-option>
              <template #label v-if="selectHrId">
                <div class="itemValue">
                  <img class="avatorLogo" :src="selectHrInfo.avatarOrigin" alt="" />
                  <span class="itemDesc">{{ selectHrInfo.name }} </span>
                </div>
              </template>
              <el-option v-for="dict in HrList" :key="dict.userId" :label="dict.name" :value="dict.userId">
                <div class="item">
                  <div class="left-wapper">
                    <img class="img" :src="dict.avatarOrigin" alt="" />
                    <div class="info">
                      <span class="text name">{{ dict.name }}</span>
                      <span class="text desc">{{ dict.departmentName || '--' }}</span>
                    </div>
                  </div>
                </div>
              </el-option>
            </el-select>
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
    <div class="more">
      <div class="mid"> </div>
      <div class="more-text-wapper" @click="handleShowMore">
        <span class="more-text"> {{ showMore ? '收起更多' : '展开更多' }} </span>
        <img src="@/assets/imgs/oa/showClose.png" class="icon" v-if="showMore" />
        <img src="@/assets/imgs/oa/showMore.png" class="icon" v-else />
      </div>
      <div class="mid"> </div>
    </div>
  </ContentWrap>

  <ContentWrap>
    <div class="table-content" style="min-width: 1200px; overflow-x: scroll">
      <!-- 表头tab栏 -->
      <div style="margin-bottom: 20px">
        <SWTabs :currentTab="currentTab" @tabs-change="tabsChange" :numberObj="numberObj" />
      </div>

      <!-- <div class="box">
        <div style="display: inline-block; margin-right: 20px">
          <div ref="boxAll" class="boxAll" @click="selectList(0)">全部</div>
        </div>

        <div ref="boxRz" class="boxRz" @click="selectList(1)">导师带领计划(未填写)(0)</div>
        <div class="tip_train1">
          <el-popover effect="light" trigger="hover" placement="top" width="auto">
            <template #default>
              <div>入职一周未填写导师带领计划的员工</div>
            </template>
            <template #reference>
              <img src="@/assets/imgs/train/slices/tip_train.png" alt="" />
            </template>
          </el-popover>
        </div>

        <div ref="boxRz3" class="boxRz" @click="selectList(3)">入职一月调研问卷(未填写)(0)</div>
        <div class="tip_train1">
          <el-popover effect="light" trigger="hover" placement="top" width="auto">
            <template #default>
              <div>入职一月未填写调研问卷的员工</div>
            </template>
            <template #reference>
              <img src="@/assets/imgs/train/slices/tip_train.png" alt="" />
            </template>
          </el-popover>
        </div>

        <div ref="boxRz2" class="boxRz" @click="selectList(2)">待转正员工(0)</div>
        <div class="tip_train1">
          <el-popover effect="light" trigger="hover" placement="top" width="auto">
            <template #default>
              <div>一个月内即将转正的员工</div>
            </template>
            <template #reference>
              <img src="@/assets/imgs/train/slices/tip_train.png" alt="" />
            </template>
          </el-popover>
        </div>
      </div> -->
      <div style="min-width: 1200px">
        <!-- 表头 -->
        <div class="header-wapper" style="min-width: 1200px">
          <div class="header-wapper-item w80">姓名</div>
          <div class="header-wapper-item w150">手机号码</div>
          <div class="header-wapper-item w120">入职时间</div>
          <div class="header-wapper-item w120">转正日期</div>
          <div class="header-wapper-item w120">转正状态</div>
          <div class="header-wapper-item w120">员工状态</div>
          <div class="header-wapper-item w120">部门</div>
          <div class="header-wapper-item w120">企业</div>
          <div class="header-wapper-item w100">HR</div>
          <div class="header-wapper-item w100">导师带领计划</div>
          <div class="header-wapper-item w100">调研数据</div>
          <div class="header-wapper-item" style="min-width: 200px; flex: 1">操作</div>
        </div>
        <!-- 内容 -->
        <div style="min-width: 1200px">
          <div>
            <div class="flex-cloun" style="margin-top: 50px; padding-bottom: 100px; box-sizing: border-box"
              v-if="list?.length === 0">
              <img class="empty-table" src="@/assets/imgs/promotion/empty.png" alt="" />
              <span style="margin-top: 16px">暂无数据</span>
            </div>
          </div>
          <div class="content-row" v-for="item in list" :key="item.id" style="min-width: 1200px">
            <div class="content-row-item w80">{{ item.name }}</div>
            <div class="content-row-item w150">{{ item?.mobile }}</div>
            <div class="content-row-item w120">{{ item?.hireDate }}</div>
            <div class="content-row-item w120">{{ item?.conversionDate }}</div>
            <div class="content-row-item w120" :class="formatApplicationStatus(item)">{{
              getDictLabel(DICT_TYPE.FEISHU_APPLICATION_STATUS, item.applicationStatus) || '--'
            }}</div>
            <div class="content-row-item w120">{{
              getDictLabel(DICT_TYPE.FEISHU_STATUS, item.status) || '--'
            }}</div>
            <div class="content-row-item w120">{{ item.dept || '--' }}</div>
            <div class="content-row-item w120">{{
              getDictLabel(DICT_TYPE.SYSTEM_PARAM_COMPANY_DICT, item.company) || '--'
            }}</div>
            <div class="content-row-item w100" style="height: 60px;">
              <el-popover :content="item.hr" placement="top" effect="dark" :disabled="!(item?.hr?.length > 6)">
                <template #reference>
                  <div class="txt_hidden">{{ item.hr }}</div>
                </template>
              </el-popover>
            </div>
            <!-- 导师带领计划 -->
            <div class="content-row-item w100">
              <div v-if="item.newEmployeeLedId" class="row-center" @click="seeDetail(item.id, 0, item.name)">
                <div class="operateText">查看</div>
                <img class="operateSeeIcon" src="@/assets/imgs/common/operate_see.png" />
              </div>
              <div v-else class="operateText">无</div>
            </div>
            <!-- 调研数据 -->
            <div class="content-row-item w100">
              <div v-if="item.newEmployeeSurveyId" class="row-center" @click="seeDetail(item.id, 1, item.name)">
                <div class="operateText">查看</div>
                <img class="operateSeeIcon" src="@/assets/imgs/common/operate_see.png" />
              </div>
              <div v-else class="operateText">无</div>
            </div>
            <!-- 操作 -->
            <div class="content-row-item" style="min-width: 200px; flex: 1">
              <div class="flex-row" style="display: flex; flex-direction: row; justify-content: center">
                <div class="row-center flex-row" @click="seeDetail(item.id, 2, item.newEmployeeLedId)">
                  <img class="operateSeeIcon2" src="@/assets/imgs/slices/slices2x.png" />
                  <div class="operateText">带领计划上传</div>
                </div>
                <div class="operateText" @click="addRemark(item)">员工备注</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <el-table
        :header-cell-style="appStore.headerCellStyle"
        v-loading="loading"
        :data="list"
        :stripe="true"
        :show-overflow-tooltip="true"
        row-class-name="commonTableRow"
        class="SWCommonTable"
        v-horizontal-scroll="'always'"
      >
        <el-table-column label="姓名" prop="name" min-width="160" />
        <el-table-column label="手机号码" prop="mobile" min-width="160" />
        <el-table-column label="入职时间" prop="hireDate" min-width="160" />
        <el-table-column label="转正日期" prop="conversionDate" min-width="160" />
        <el-table-column label="转正状态" prop="applicationStatus" min-width="160">
          <template #default="scope">
            <div>{{
              getDictLabel(DICT_TYPE.FEISHU_APPLICATION_STATUS, scope.row.applicationStatus) || '--'
            }}</div>
          </template>
        </el-table-column>

        <el-table-column label="员工状态" prop="status" min-width="160">
          <template #default="scope">
            <div>{{ getDictLabel(DICT_TYPE.FEISHU_STATUS, scope.row.status) || '--' }}</div>
          </template>
        </el-table-column>

        <el-table-column label="部门" prop="dept" min-width="160">
          <template #default="scope">
            <div>{{ scope.row.dept || '--' }}</div>
          </template>
        </el-table-column>

        <el-table-column label="企业" prop="company" min-width="160">
          <template #default="scope">
            <div>{{
              getDictLabel(DICT_TYPE.SYSTEM_PARAM_COMPANY_DICT, scope.row.company) || '--'
            }}</div>
          </template>
        </el-table-column>
        <el-table-column label="HR" prop="hr" min-width="160" />
        <el-table-column fixed="right" width="110" label="导师带领计划">
          <template #default="scope">
            <div
              v-if="scope.row.newEmployeeLedId"
              class="row-center"
              @click="seeDetail(scope.row.id, 0, scope.row.name)"
            >
              <div class="operateText">查看</div>
              <img class="operateSeeIcon" src="@/assets/imgs/common/operate_see.png" />
            </div>
            <div v-else class="operateText">无</div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="110" label="调研数据">
          <template #default="scope">
            <div
              v-if="scope.row.newEmployeeSurveyId"
              class="row-center"
              @click="seeDetail(scope.row.id, 1, scope.row.name)"
            >
              <div class="operateText">查看</div>
              <img class="operateSeeIcon" src="@/assets/imgs/common/operate_see.png" />
            </div>
            <div v-else class="operateText">无</div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="200" label="操作">
          <template #default="scope">
            <div class="flex-row">
              <div
                class="row-center"
                @click="seeDetail(scope.row.id, 2, scope.row.newEmployeeLedId)"
              >
                <img class="operateSeeIcon2" src="@/assets/imgs/slices/slices2x.png" />
                <div class="operateText">带领计划上传</div>
              </div>
              <div class="operateText" @click="addRemark(scope.row)">员工备注</div>
            </div>
          </template>
        </el-table-column>
      </el-table> -->
    </div>

    <!-- 分页 -->
    <Pagination v-if="total > 0" style="margin-right: 25px" :total="total" v-model:page="queryParams.page"
      v-model:limit="queryParams.size" @pagination="getList" />
    <!-- 查看导师弹窗 -->
    <trainDialog ref="trainDialogRef" :list="daoshiList" />
    <!-- 新增 -->
    <trainUploadDialog ref="trainUploadDialogRef" :list="uploadList" :userId="userId"
      :newEmployeeLedId="newEmployeeLedId" @get-list="getList" />
    <!-- 调研数据 -->
    <SearchDialog ref="SearchDialogRef" />

    <!-- 新增员工备注 -->
    <RemarkDialog ref="remarkDialog" @success="handleSuccess" />
  </ContentWrap>
</template>
<script lang="ts" setup>
import {
  newEmployeeOnboard,
  newEmployeeOnboardQryList,
  newEmployeeOnboardSurvey
} from '@/api/hrAdmin/train/index'
import * as CommonApi from '@/api/common'
import { useAppStore } from '@/store/modules/app'
import { DICT_TYPE, getDictLabel, getIntDictOptions } from '@/utils/dict'
import SWTabs from '../resources/components/SWTabs.vue'
import Menuitem from './components/Menuitem.vue'
import RemarkDialog from './components/remarkDialog.vue'
import SearchDialog from './components/searchTrain.vue'
import trainDialog from './components/trainDialog.vue'
import trainUploadDialog from './components/trainUploadDialog.vue'
import * as SystemConstantApi from '@/api/system/systemConstant'
const appStore = useAppStore()
const loading = ref(false) // 列表的加载中
const list = ref()
const total = ref(0) // 列表的总页数
// const boxAll = ref(null)
// const boxRz = ref(null)
// const boxRz2 = ref(null)
// const boxRz3 = ref(null)
const daoshiList = ref([])
const uploadList = ref([])
const userId = ref('')
const newEmployeeLedId = ref('')
const queryParams = ref({
  page: 1,
  size: 10,
  name: '',
  applicationStatus: '',
  status: '2',
  deptId: '',
  hrName: '',
  type: ''
})

const formatApplicationStatus = (item) => {
  const label = getDictLabel(DICT_TYPE.FEISHU_APPLICATION_STATUS, item.applicationStatus)
  return {
    wait: label === '待转正',
    waited: label === '转正',
    weizhi: label === '未知'
  }
}

const currentTab = ref('')
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

const handleSuccess = () => {
  getList()
}
const numberObj = ref({
  '1': 0,
  '2': 0,
  '3': 0
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const res = await newEmployeeOnboardQryList(queryParams.value).catch(() => { })
    numberObj.value['1'] = res[1] || 0
    numberObj.value['2'] = res[2] || 0
    numberObj.value['3'] = res[3] || 0
    list.value = res?.list?.records || []
    total.value = res?.list?.total
  } finally {
    loading.value = false
  }
}

const queryFormRef = ref() // 搜索的表单

const showMore = ref(true)

const handleShowMore = () => {
  showMore.value = !showMore.value
}
// 获取一级部门下拉

// 搜索
const handleSearch = (value) => {
  queryParams.value.page = 1
  if (value) {
    queryParams.value.deptId = value[value.length - 1]
  }
  getList()
}

const tabsChange = (value) => {
  currentTab.value = value
  queryParams.value.type = value
  getList()
}

// 切换tab栏
// const selectList = (index) => {
//   // 先将所有元素的 class 设置为 boxRz
//   boxAll.value.className = 'boxRz'
//   boxRz.value.className = 'boxRz'
//   boxRz2.value.className = 'boxRz'
//   boxRz3.value.className = 'boxRz'

//   // 根据点击的 index 设置对应的 class 为 boxAll
//   if (index === 0) {
//     boxAll.value.className = 'boxAll'
//     queryParams.value.type = ''
//     getList()
//   } else if (index === 1) {
//     boxRz.value.className = 'boxAll'
//     queryParams.value.type = '1'
//     getList()
//   } else if (index === 2) {
//     boxRz2.value.className = 'boxAll'
//     queryParams.value.type = '2'
//     getList()
//   } else if (index === 3) {
//     boxRz3.value.className = 'boxAll'
//     queryParams.value.type = '3'
//     getList()
//   }
// }

const remarkDialog = ref()
const addRemark = (row) => {
  console.log('员工备注', row)
  const params = {
    id: row.id,
    newEmployeeLedId: row.newEmployeeLedId
  }
  remarkDialog.value.open(params)
}

const trainDialogRef = ref(null) // 获取子组件的引用
const trainUploadDialogRef = ref(null)
const SearchDialogRef = ref(null)
// 查看弹窗
const seeDetail = (id, index, falg) => {
  if (index === 0) {
    newEmployeeOnboard(id).then((res) => {
      trainDialogRef.value.openDialog() // 调用子组件的方法
      trainDialogRef.value.nameChange(falg)
      trainDialogRef.value.listChange(res.fileUrl)
      trainDialogRef.value.textAreaChange(res.notes)
    })
  } else if (index === 1) {
    newEmployeeOnboardSurvey(id).then((res) => {
      SearchDialogRef.value.listChange(JSON.parse(res.surveyData))
      SearchDialogRef.value.openDialog()
      console.log(falg, 'falg')
      SearchDialogRef.value.nameChange(falg)
    })
  } else if (index === 2) {
    newEmployeeLedId.value = ''
    userId.value = id
    uploadList.value = []
    trainUploadDialogRef.value.openDialog()
    if (falg) {
      newEmployeeLedId.value = falg
      newEmployeeOnboard(id).then((res) => {
        uploadList.value = res.fileUrl.split(',')
        trainUploadDialogRef.value.listGive(uploadList.value, res.notes)
      })
    }
  }
}

// 获取hr的下拉列表
const HrList = ref([])
const selectHrId = ref('')
const selectHrInfo = ref({})
const openIds = ref('')
const getHrlist = async () => {
  openIds.value = await SystemConstantApi.getSystemConstantConfigbyCode('HR_DEPT').catch((e) => { })

  const data = await CommonApi.getPersonByOpenId(openIds.value).catch(() => { })
  HrList.value = data || []
}
// 选择HR
const handleSelectChange = () => {
  selectHrInfo.value = {}
  queryParams.value.hrName = ''
  if (selectHrId.value) {
    const foundHr = HrList.value.find((item) => item.userId === selectHrId.value)
    if (foundHr) {
      selectHrInfo.value = foundHr
      queryParams.value.hrName = foundHr.name
    }
  }
  handleQuery()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  queryParams.value.status = '2'
  selectHrId.value = '' //清空hr已选择值
  handleQuery()
}

onMounted(() => {
  getList()
  getHrlist()
})
</script>
<style lang="scss" scoped>
.more {
  display: flex;
  justify-content: center;
  align-items: center;
  // margin-top: 10px;
  justify-content: space-around;

  .mid {
    flex: 1;
    height: 1px;
    background: #ebeef5;
  }

  .more-text-wapper {
    display: flex;
    align-items: center;
    margin: 0 20px;

    .more-text {
      cursor: pointer;
      font-weight: 400;
      font-size: 12px;
      color: #333333;
      margin-right: 6px;
    }

    .icon {
      width: 8px;
      height: 6px;
      cursor: pointer;
    }
  }
}

.operateText {
  margin-right: 10px;
  line-height: 60px;
  text-align: center;
}

.box {
  display: flex;
  // width: 426px;
  height: 29px;
  margin-left: 21px;
  margin-bottom: 19px;

  .boxAll {
    // width: 56px;
    height: 20px;
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 500;
    font-size: 14px;
    color: #0064ff;
    line-height: 20px;
    text-align: left;
    font-style: normal;
    padding: 10px;
    padding-right: 0;
    padding-left: 0;
    border-bottom: 2px solid #0064ff;
    cursor: pointer;
    text-align: center;
  }

  .boxRz {
    // width: 56px;
    height: 20px;
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #666666;
    line-height: 20px;
    text-align: left;
    font-style: normal;
    padding: 10px;
    cursor: pointer;
    text-align: center;
    padding-right: 0;
    padding-left: 0;
  }
}

.operateSeeIcon2 {
  width: 12px;
  height: 12px;
  margin-right: 4px;
  cursor: pointer;
}

.tip_train1 {
  display: inline-block;
  padding-top: 10px;
  margin-right: 20px;

  img {
    width: 12px;
    height: 12px;
    margin-left: 4px;
  }
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.table-content {
  background: linear-gradient(rgba(250, 252, 255, 0.19) 0%,
      rgba(242, 247, 255, 0.78) 37%,
      #ebf2ff 100%);
  // background: red;
  border-radius: 10px;
}

.header-wapper {
  display: flex;
  flex-direction: row;
  height: 52px;
  background: #dfebff;
  border-radius: 4px;
  line-height: 52px;

  .header-wapper-item {
    // flex: 1;
    text-align: center;
    font-weight: 400;
    font-size: 14px;
    color: #666666;
    font-style: normal;
  }
}

.content-row {
  margin-top: 16px;
  display: flex;
  flex-direction: row;
  height: 60px;
  line-height: 60px;
  background: #ffffff;
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);
  border-radius: 4px;
  align-items: center;

  .content-row-item {
    // flex: 1;
    text-align: center;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
    font-style: normal;
  }
}

.w60 {
  width: 60px;
}

.w80 {
  width: 80px;
}

.w100 {
  width: 100px;
}

.w120 {
  width: 120px;
}

.w150 {
  width: 150px;
}

.w200 {
  width: 200px;
}

.wait {
  width: 62px;
  height: 22px;
  line-height: 22px;
  background: #fee7cd;
  border-radius: 11px;
  margin: 0 30px;
}

.waited {
  width: 62px;
  height: 22px;
  line-height: 22px;
  background: #95e599;
  border-radius: 11px;
  margin: 0 30px;
}

.weizhi {
  width: 62px;
  height: 22px;
  line-height: 22px;
  background: #e3e4ed;
  border-radius: 11px;
  margin: 0 30px;
}

.flex-cloun {
  display: flex;
  flex-direction: column;
  align-items: center;
}

// 选择hr
.eloption .el-select-dropdown__wrap .el-select-dropdown__item {
  height: 50px !important;
}

.itemValue {
  display: flex;
  align-items: center;
  height: 26px;
  background: #cad6f8;
  border-radius: 13px;
  padding: 1px 6px;
  width: min-content;
  box-sizing: border-box;

  .itemDesc {
    font-size: 14px;
    color: #333333;
    margin-left: 6px;
    margin-right: 6px;
  }

  .avatorLogo {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }

  .itemClose {
    cursor: pointer;
    width: 6px;
    height: 6px;
  }
}

.item {
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 7px;
  box-sizing: border-box;
  width: 100px;

  .left-wapper {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }

  .info {
    display: flex;
    flex-direction: column;
    margin-left: 14px;

    .text {
      height: 20px;
      line-height: 20px;
    }

    .name {
      font-size: 14px;
      color: #333333;
    }

    .desc {
      font-size: 12px;
      color: #999999;
    }
  }
}

.txt_hidden {
  display: inline-block;
  width: 100px;
  height: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
