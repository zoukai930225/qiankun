<template>
  <div>
    <el-drawer
      custom-class="linkDialogDrawer"
      v-model="dialogVisible"
      :title="dialogTitle"
      size="968"
    >
      <div class="linkDialogBg">
        <el-table
          :data="list"
          :header-cell-style="appStore.headerCellStyle"
          v-loading="loading"
          :stripe="true"
          :show-overflow-tooltip="true"
          row-class-name="commonTableRow2"
          class="linkTable SWCommonTable"
          v-horizontal-scroll="'always'"
        >
          <el-table-column label="资产照片" prop="images" min-width="277">
            <template #default="scope">
              <div class="row-center">
                <el-image
                  :src="scope.row.images ? scope.row.images : asset_default"
                  :preview-src-list="[scope.row.images]"
                  preview-teleported
                  style="width: 34px; height: 34px; vertical-align: middle"
                >
                  <template #error>
                    <div class="image-slot">
                      <img
                        src="https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/fixedAssetPic/aca4b270-d3b3-490e-959d-39085f2155ed.png"
                        alt=""
                        style="width: 34px; height: 34px; vertical-align: middle"
                      />
                    </div>
                  </template>
                </el-image>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="品名" prop="name" min-width="200" />
          <el-table-column
            label="编号"
            prop="number"
            min-width="200"
            :show-overflow-tooltip="false"
          >
            <template #default="scope">
              <div style="cursor: pointer" @click="handleCopy(scope.row.number)">
                {{ scope.row.number }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" min-width="90">
            <template #default="scope">
              <div class="row-center">
                <div class="row-center" @click="cancelLink(scope.row)">
                  <div class="operateText">取消关联</div>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="total" style="height: 70px; margin-right: 20px">
          <Pagination
            :total="total"
            v-model:page="linkQueryParams.page"
            v-model:limit="linkQueryParams.pageSize"
            @pagination="getList"
          />
        </div>
      </div>
      <div class="topTitle">查找设备</div>
      <div class="linkDialogBg">
        <div class="topFilter">
          <el-form ref="queryFormRef" :inline="true" :model="queryParams">
            <el-form-item label="品名" prop="name">
              <el-input
                style="width: 200px"
                class="searchFormItemWidth"
                v-model="queryParams.name"
                placeholder="请输入品名"
                clearable
                @keyup.enter="handleQuery"
                @clear="handleQuery"
              />
            </el-form-item>
            <el-form-item label="编号" prop="number">
              <el-input
                style="width: 200px"
                class="searchFormItemWidth"
                v-model="queryParams.number"
                placeholder="请输入编号"
                clearable
                @keyup.enter="handleQuery"
                @clear="handleQuery"
              />
            </el-form-item>

            <el-form-item>
              <el-button @click="handleQuery" class="commonSearchBtn">
                <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
                搜索
              </el-button>
              <el-button @click="resetQuery" class="commonResetBtn"> 重置 </el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table
          :data="deviceList"
          :header-cell-style="appStore.headerCellStyle"
          v-loading="deviceLoading"
          :stripe="true"
          :show-overflow-tooltip="true"
          row-class-name="commonTableRow2"
          class="linkTable SWCommonTable"
          v-horizontal-scroll="'always'"
        >
          <el-table-column label="资产照片" prop="images" min-width="277">
            <template #default="scope">
              <div class="row-center">
                <el-image
                  :src="scope.row.images ? scope.row.images : asset_default"
                  :preview-src-list="[scope.row.images]"
                  preview-teleported
                  style="width: 34px; height: 34px; vertical-align: middle"
                >
                  <template #error>
                    <div class="image-slot">
                      <img
                        src="https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/fixedAssetPic/aca4b270-d3b3-490e-959d-39085f2155ed.png"
                        alt=""
                        style="width: 34px; height: 34px; vertical-align: middle"
                      />
                    </div>
                  </template>
                </el-image>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="品名" prop="name" min-width="200" />
          <el-table-column
            label="编号"
            prop="number"
            min-width="200"
            :show-overflow-tooltip="false"
          >
            <template #default="scope">
              <div style="cursor: pointer" @click="handleCopy(scope.row.number)">
                {{ scope.row.number }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" min-width="90">
            <template #default="scope">
              <div class="row-center">
                <div class="row-center" @click="linkDevice(scope.row)">
                  <div class="operateText">关联</div>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="deviceTotal" style="height: 70px; margin-right: 20px">
          <Pagination
            :total="deviceTotal"
            v-model:page="queryParams.page"
            v-model:limit="queryParams.pageSize"
            @pagination="getDeviceList"
          />
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { copyText } from '@/utils/copyText'
import asset_default from '@/assets/imgs/asset_default.png'

import * as Asset from '@/api/hrAdmin/asset'

const appStore = useAppStore()

const fixedAssetId = ref('')
const loading = ref(false)
const total = ref(0) // 列表的总页数
const list = ref<any[]>([])

const deviceLoading = ref(false)
const deviceList = ref<any[]>([])
const deviceTotal = ref(10) // 列表的总页数

const queryFormRef = ref()

const linkQueryParams = ref({
  page: 1,
  pageSize: 10,
  fixedAssetId: ''
})
const queryParams = ref({
  fixedAssetId: '',
  page: 1,
  pageSize: 10,
  name: undefined, //品名
  number: undefined //编号
})

const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
// 搜索
const handleQuery = () => {
  queryParams.value.page = 1
  getDeviceList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryParams.value = {
    fixedAssetId: fixedAssetId.value,
    page: 1,
    pageSize: 10,
    name: undefined, //品名
    number: undefined //编号
  }
  queryFormRef.value.resetFields()
  handleQuery()
}
/** 打开弹窗 */
const open = async (id: string) => {
  dialogVisible.value = true
  dialogTitle.value = '关联设备'
  fixedAssetId.value = id
  linkQueryParams.value.fixedAssetId = id
  queryParams.value.fixedAssetId = id

  getDeviceList()
  getList()
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

// 获取列表
const getList = async () => {
  loading.value = true
  try {
    const data = await Asset.fixedAssetQueryBind(linkQueryParams.value).catch(() => {
      loading.value = false
    })
    list.value = data.records || []
    total.value = data.total
  } finally {
    loading.value = false
  }
}

// 获取设备列表
const getDeviceList = async () => {
  deviceLoading.value = true
  try {
    const data = await Asset.fixedAssetQueryUnBind(queryParams.value).catch(() => {
      deviceLoading.value = false
    })
    deviceList.value = data.records || []
    deviceTotal.value = data.total
  } finally {
    deviceLoading.value = false
  }
}

// 复制文本到剪贴板的函数
const handleCopy = async (text) => {
  await copyText(text)
}

const cancelLink = async (row) => {
  // const param = {  }
  await Asset.fixedAssetCancelBind([row.id])
  message.success('取消关联成功')
  getList()
  getDeviceList()
}

// 关联设备
const linkDevice = async (row) => {
  const param = {
    fixedAssetId: fixedAssetId.value,
    fixedAssetIds: [row.id]
  }
  await Asset.fixedAssetBind(param)
  message.success('关联成功')
  getList()
  getDeviceList()
}

const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
</script>

<style lang="scss" scoped>
.linkDialogDrawer {
}
.linkDialogBg {
  margin-top: -10px;
  background: #ffffff;
  border-radius: 8px;
  width: 928px;
  .linkTable {
    width: 898px;
    padding-top: 20px;
    margin-bottom: 10px;
    margin-left: 20px;
    margin-right: 10px;
  }
  .topFilter {
    padding-top: 20px;
    margin-left: 20px;
    margin-right: 10px;
    margin-bottom: -15px;
  }
}
.topTitle {
  padding-top: 10px;
  margin-bottom: 25px;
  font-weight: 500;
  font-size: 14px;
  color: #333333;
  line-height: 20px;
}
:deep(.el-drawer__body) {
  background: #f8f9fb;
  margin-top: -25px;
}
:deep(.el-drawer) {
  border-radius: 12px 0px 0px 0px;
  width: 100%;
  height: 100%;
  background: url('@/assets/imgs/common/drawer-bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  box-sizing: border-box;
}
:deep(.el-drawer__body) {
  width: 100%;
  height: 100%;
  background: url('@/assets/imgs/common/drawer-bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  box-sizing: border-box;
}

:deep(.el-drawer__title) {
  font-size: 14px;
  color: #333333;
  line-height: 20px;
  font-weight: 500;
}
:deep(.el-overlay) {
  z-index: 9999;
}
:deep(.el-table .el-table__cell) {
  padding-left: 10px;
}
</style>
