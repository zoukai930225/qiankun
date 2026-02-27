<template>
  <ContentWrap>
    <div class="mb-5px">
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form ref="queryFormRef" :inline="true" :model="queryParams" class="mb-5px" label-width="80">
            <el-form-item label="货品编码" prop="productCode">
              <el-input style="width: 200px;" v-model="queryParams.productCode" placeholder="请输入货品编码" clearable />
            </el-form-item>
            <el-form-item label="二开原因" prop="secondaryDevReason">
              <el-input style="width: 200px;" v-model="queryParams.secondaryDevReason" placeholder="请输入二开原因" clearable />
            </el-form-item>
            <el-form-item label="系列" prop="series">
              <el-input style="width: 200px;" v-model="queryParams.series" placeholder="请输入系列" clearable />
            </el-form-item>
            <el-form-item label="品类" prop="categoryName">
              <el-input style="width: 200px;" v-model="queryParams.categoryName" placeholder="请输入品类" clearable />
              <!-- <el-select
                class="!w220px"
                v-model="queryParams.category"
                placeholder="请选择品类"
                clearable
              >
              <el-option 
                v-for="cate in categoryList"
                :key="cate.code"
                :label="cate.name"
                :value="cate.code"
              />
              </el-select> -->
            </el-form-item>
            <el-form-item label="版师" prop="patternMakerId" v-if="isExpand">
              <SWSelectPeople :isEdit="true" :multiple="false" v-model:modelValue="queryParams.patternMakerId"
                type="operate" placeholder="请选择版师" :deptCode="'NEW_PRODUCT_DEPT_DEVELOP'"
                style="width: 240px !important;" />
            </el-form-item>
            <el-form-item label="设计师/买手" prop="designerId" v-if="isExpand" class="half">
              <SWSelectPeople :isEdit="true" :multiple="false" v-model:modelValue="queryParams.designerId"
                type="operate" placeholder="请选择设计师/买手" :deptCode="'NEW_PRODUCT_DEPT_DEVELOP'"
                style="width: 240px !important;" />
            </el-form-item>

            <el-form-item label="选供专员" prop="chosenSupplierStaffId" v-if="isExpand">
              <SWSelectPeople :isEdit="true" :multiple="false" v-model:modelValue="queryParams.chosenSupplierStaffId"
                type="operate" placeholder="请选择选供专员" :deptCode="'NEW_PRODUCT_DEPT_SUPPLY'"
                style="width: 240px !important;" />
            </el-form-item>

            <el-form-item label="更新时间" prop="handler" v-if="isExpand">
              <el-date-picker v-model="dateRange" type="daterange" value-format="YYYY-MM-DD" range-separator="-"
                start-placeholder="开始日期" end-placeholder="结束日期" @change="handleDateChange"
                style="width: 240px !important;" />
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
            <el-button type="primary" @click="openForm('add', '')" v-if="hasAddPermission">
              <Icon :size="14" icon="ep:plus" class="mr4px" />
              新增
            </el-button>
          </div>
          <SWFilterExpandAllNew :isExpand="isExpand" @expand-click="isExpand = !isExpand" />
        </div>
      </div>
    </div>

    <!-- 列表 -->
    <listTable :list="list" :loading="loading" @click-btn="handleClick" :id="ids" />
    <!-- 分页 -->
    <div class="pagination-wrapper">
      <Pagination :total="total" v-model:page="queryParams.page" v-model:limit="queryParams.size"
        @pagination="() => getList()" />
    </div>
  </ContentWrap>

  <!-- 新增编辑 -->
  <editDrawer ref="formRef" @success="() => getList()" />

  <!-- 匹配供应商  -->
  <supplierDrawer ref="supplierDrawerRef" @success="() => getList()" />

  <!-- 供应商信息 -->
  <supplierInfoDrawer ref="supplierInfoDrawerRef" @success="() => getList()" />

  <develop-progress ref="progressRef" />
  
  <!-- 审核 -->
  <AuditDialog v-model="dialogVisible" :selectItem="selectItem" @confirm="() => getList()"/>

  <!-- 回收 -->
   <RecycleDialog v-model="recycleDialogVisible" :selectItem="selectItem" @confirm="() => getList()"></RecycleDialog>
</template>

<script lang="ts" setup>
import DevelopProgress from "./components/progress.vue";
import * as factoryDevelopApi from '@/api/oa/factory/develop'
import listTable from './components/listTable.vue'
import editDrawer from './components/editDrawer.vue'
import supplierDrawer from './components/pickSupplierDrawer.vue'
import supplierInfoDrawer from './components/supplierInfoDrawer.vue'

import SWSelectPeople from '@/views/OA/factory/components/selectPeople.vue'
import { v4 as uuidv4 } from 'uuid';
import AuditDialog from './components/auditDialog.vue';
import RecycleDialog from './components/recycleDialog.vue';
// import { useCategoryList } from '@/views/OA/factory/hooks'
// const { categoryList, initSelectData } = useCategoryList()

const route = useRoute();

const message = useMessage()

import { useRole } from '@/hooks/common/useRole'

const { permissionList, roleList, getPermissionInfo, grabCheck } = useRole('工厂二开')
const hasAddPermission = computed(() => grabCheck('二开企划负责人'))

const loading = ref(false), ids = ref<string>(''); // 列表的加载中
const list = ref<any[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const isExpand = ref(false)

const queryParams = ref<any>({
  page: 1,
  size: 10
})
const dateRange = ref([])
const handleDateChange = (vals) => {
  if (vals && vals.length) {
    queryParams.value.startTime = vals[0]
    queryParams.value.endTime = vals[1]
  } else {
    queryParams.value.startTime = ''
    queryParams.value.endTime = ''
  }
  getList()
}


/** 操作 */
const formRef = ref()
const openForm = (type: string, id?: string, obj?: any) => {
  formRef.value?.open(type, id, obj)
}

const supplierDrawerRef = ref(), progressRef = ref();
const supplierInfoDrawerRef = ref()

const handleClick = async (type: string, id: any, obj?: any) => {
  if (type === 'edit') {
    openForm(type, id, obj)
  }

  if (type === 'delete') {
    await message.confirm('确认删除这条数据吗？')
    await factoryDevelopApi.deleteDevTask(id)
    message.success('删除成功！')
    getList()
  }

  // 匹配供应商
  if (type === 'supplier') {
    supplierDrawerRef.value?.open(type, id)
  }
  // 供应商信息
  if (type === 'supplierInfo') {
    supplierDrawerRef.value?.open(type, id)
    // supplierInfoDrawerRef.value?.open(type, id)
  }
  if (type === 'progress') {
    progressRef.value?.open(id)
  }

  if(type === 'audit') {
    dialogVisible.value = true
    selectItem.value = obj
  }

  // 回收
  if(type === 'recycle') {
    recycleDialogVisible.value = true
    selectItem.value = obj
  }
}
const queryFormRef = ref() // 搜索的表单
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  queryParams.value.chosenSupplierStaffId = []

  handleQuery()
}
// 处理参数
const handleParams = () => {
  const params = { ...queryParams.value }
  params.designerId = params.designerId?.map((item: any) => item.userId).join(',')
  params.patternMakerId = params.patternMakerId?.map((item: any) => item.userId).join(',')
  params.chosenSupplierStaffId = params.chosenSupplierStaffId?.map((item: any) => item.userId).join(',')
  return params
}
/** 查询列表 */
const getList = async (id: string = '') => {
  loading.value = true
  try {
    const params = id ? { ...handleParams(), fsTaskId: id } : handleParams()
    const data = await factoryDevelopApi.getDevTaskList(params);
    ids.value = uuidv4();
    list.value = (data?.records || []).map((ds: any) => ({ ...ds, webSupplierBtn: !!ds?.patternMakerList?.length && !!ds?.designerList?.length }));
    total.value = data?.total
  } finally {
    loading.value = false
  }
}

// 跳转带id查询
// const route = useRoute()
// if (route.query?.fsTaskId) {
//   const newUrl = window.location.href.replace(/\?.*$/, '')
//   history.replaceState({}, '', newUrl)
// };

/** 初始化 **/
onMounted(() => {
  getPermissionInfo(() => {
    if (route.query?.fsTaskId){
      queryParams.value.fsTaskId = route.query?.fsTaskId
      getList();
      delete queryParams.value.fsTaskId
    }else{
      getList();
    }
    
  })
})

if (route.query?.fsTaskId) {
  const newUrl = window.location.href.replace(/\?.*$/, '')
  history.replaceState({}, '', newUrl)
};

provide('factory_develop_handle', { permissionList, roleList, getList, grabCheck });

const dialogVisible = ref(false)
const selectItem = ref({})
const recycleDialogVisible = ref(false)

</script>

<style lang="scss" scoped>
:deep(.el-form--inline .el-form-item) {
  margin-right: 20px;

  .el-form-item__content {
    width: 200px;
  }
}

:deep(.el-button-group) {
  display: flex;
}

:deep(.el-select__wrapper) {
  background: #ffffff !important;
}

.half {
  :deep() {
    .el-form-item__label {
      line-height: 16px;
      text-align: right;
    }
  }
}
</style>
