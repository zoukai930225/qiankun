<template>
  <ContentWrap>
    <div>
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form
            ref="queryFormRef"
            :inline="true"
            :model="queryParams"
            class="mb-5px"
            label-width="78px"
          >
            <el-form-item label="库位条码" prop="locationCode">
              <el-input
                v-model="queryParams.locationCode"
                class="searchFormItemWidth"
                :prefix-icon="Search"
                clearable
                placeholder="请输入库位条码"
                @keyup.enter="handleQuery"
                @clear="handleQuery"
              />
            </el-form-item>
            <el-form-item label="位置" prop="location">
              <el-input
                v-model="queryParams.location"
                class="searchFormItemWidth"
                :prefix-icon="Search"
                clearable
                placeholder="请输位置"
                @keyup.enter="handleQuery"
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
            <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0px">
              重置
            </el-button>
            <el-button @click="openDialog('add', '')" type="primary" :icon="Plus">
              新增库位
            </el-button>
            <el-button @click="exportData" type="primary"> 导出 </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 列表 -->
    <el-table
      :header-cell-style="appStore.headerCellStyle"
      v-loading="loading"
      :data="list"
      :show-overflow-tooltip="true"
      row-class-name="commonTableRow"
      class="SWCommonTable"
      v-horizontal-scroll="'always'"
    >
      <el-table-column label="库位条码" prop="locationCode" min-width="250">
        <template #default="scope">
          <div class="row">
            {{ scope.row.locationCode || '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="位置" prop="location" min-width="210">
        <template #default="scope">
          <div class="row">
            {{ scope.row.location || '--' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="最大容量" prop="maximumCapacity" min-width="120">
        <template #default="scope">
          {{ scope.row.maximumCapacity || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="图片" prop="image" min-width="200">
        <template #default="{ row }">
          <el-image
            v-if="row.image"
            style="width: 60px; height: 40px; z-index: 999"
            :src="row.image"
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :preview-teleported="true"
            :preview-src-list="[row.image]"
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column label="库位条形码" prop="image" min-width="240">
        <template #default="{ row }">
          <img :src="row.codeUrl" alt="" style="width: 180px" />
        </template>
      </el-table-column>

      <el-table-column label="操作按钮" :show-overflow-tooltip="false" fixed="right" width="180">
        <template #default="scope">
          <el-button type="primary" @click="openDialog('update', scope.row.id)" link>
            编辑
          </el-button>
          <el-button type="primary" @click="printBarCode(scope.row)" link> 打印库位条码 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination-wrapper">
      <Pagination
        :total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
  </ContentWrap>
  <!-- 表单抽屉 -->
  <EditDialog ref="dialogRef" @success="getList" />
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { Search, Plus } from '@element-plus/icons-vue'
import EditDialog from './components/editDialog.vue'
import * as LocationApi from '@/api/sample/storageLocationManage'
import download from '@/utils/download'
import { savebarCodeAsImage } from '@/views/newMedia/hooks/usePrint'
const appStore = useAppStore()

const message = useMessage() // 消息弹窗

const loading = ref(false) // 列表的加载中
const list = ref<any[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = ref({
  page: 1,
  pageSize: 10,
  locationCode: '',
  location: ''
})
const queryFormRef = ref() // 搜索的表单

/** 添加/修改操作 */
const dialogRef = ref()
const openDialog = (type: string, id?: string) => {
  if (dialogRef.value) {
    dialogRef.value.open(type, id)
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}
/** 打印条形码 */
const printBarCode = async (item: {}) => {
  await message.confirm('确认是否打印该库位条码？')
  savebarCodeAsImage(item, '库位条码')
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await LocationApi.getLocationList(queryParams.value).catch(() => {})
    if (data) {
      list.value = data.records
      total.value = data.total
    }
  } finally {
    loading.value = false
  }
}

// 导出
const exportData = async () => {
  const loadingInstance = ElLoading.service({ fullscreen: false, text: '数据导出中......' })
  try {
    const params = {
      locationCode: queryParams.value.locationCode,
      location: queryParams.value.location
    }
    const data = await LocationApi.exportLocationList(params)
    const fileName = `样品库位数据统计`
    download.excel(data, fileName)
    message.success('导出成功')
  } finally {
    loadingInstance.close()
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>

<style lang="less" scoped>
* {
  --el-color-primary: #0064ff;
  --el-color-danger: #f00;
}
</style>
