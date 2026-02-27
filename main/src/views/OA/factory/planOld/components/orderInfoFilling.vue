<template>
  <el-dialog v-model="visible" append-to-body :show-close="false"
    :top="!listData || listData.length === 0 ? '30vh' : '15vh'" width="1009px" style="
      border-radius: 8px;
      transform: none;
      position: static;
      margin-top: var(--el-dialog-margin-top) !important;
      padding: 0;
    " :close-on-click-modal="false">
    <template #header>
      <div class="header">
        <div>SKU明细</div>
        <img src="@/assets/imgs/common/close.png" alt="" @click="visible = false" />
      </div>
    </template>
    <template #default>

      <div style="padding: 0 20px">
        <el-form label-width="85">
          <el-form-item label="SKU编码">
            <el-input v-model="txt" :placeholder="`请输入SKU编码`" clearable style="width: 240px" />
            <div style="margin-left: 20px">
              <el-button @click="handleQuery" class="commonSearchBtn">
                <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
                搜索
              </el-button>
              <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0px">
                重置
              </el-button>
            </div>
            <div style="position: absolute; right: 0">
              <el-button type="primary" plain @click="delAll" :disabled="!selectData?.length">批量移除</el-button>
              <el-button type="primary" @click="importData">数据导入</el-button>
              <el-button type="primary" @click="addTable">新增</el-button>
            </div>
          </el-form-item>
        </el-form>
        <el-table :header-cell-style="{ color: '#333', fontWeight: 500, backgroundColor: '#F2F6FC' }" :data="listData"
          show-overflow-tooltip max-height="50vh" style="width: 90vw" v-loading="loading" ref="tableRef" border>
          <el-table-column type="selection" width="46" align="center"></el-table-column>
          <el-table-column prop="sku" label="SKU编码" width="189"></el-table-column>
          <el-table-column prop="color" label="规格名称" sortable></el-table-column>
          <el-table-column prop="size" label="规格码" width="120"></el-table-column>
          <el-table-column label="下单量" width="198">
            <template #default="{ row }">
              <div class="row-center">
                <el-input v-model.trim="row.orderVolume" />
                <el-tooltip effect="dark" content="应用全部，当前页所有下单量设置为该值" placement="bottom">
                  <img style="width: 16px; height: 16px; margin-left: 7px; cursor: pointer"
                    @click="allSetOneValue(row.orderVolume, 'orderVolume')" src="@/assets/imgs/oa/all_add.svg" />
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="期望到货时间" width="198">
            <template #default="{ row }">
              <div class="row-center">
                <el-date-picker v-model="row.expectedArrivalTime" format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"></el-date-picker>
                <el-tooltip effect="dark" content="应用全部，当前页所有时间设置为该日期" placement="bottom">
                  <img style="width: 16px; height: 16px; margin-left: 7px; cursor: pointer"
                    @click="allSetOneValue(row.expectedArrivalTime, 'expectedArrivalTime')"
                    src="@/assets/imgs/oa/all_add.svg" />
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="98">
            <template #default="{ row }">
              <el-text type="danger" style="cursor: pointer;color: #EB3737;" @click="deleteData(row)">移除</el-text>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
    <template #footer>
      <div style="padding: 10px 20px; border-top: solid #f0f0f0 1px">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="save" :disabled="loading">确 定</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="skuVisible" append-to-body :show-close="false"
    :top="!skuListData || skuListData.length === 0 ? '30vh' : '15vh'" width="800" style="
      border-radius: 8px;
      transform: none;
      position: static;
      margin-top: var(--el-dialog-margin-top) !important;
      padding: 0;
    " :close-on-click-modal="false">
    <template #header>
      <div class="header">
        <div>选择商品</div>
        <img src="@/assets/imgs/common/close.png" alt="" @click="skuVisible = false" />
      </div>
    </template>
    <div style="padding: 0 20px">
      <el-form label-width="85">
        <el-form-item label="SKU编码">
          <el-input v-model="skutxt" :placeholder="`请输入SKU编码`" clearable style="width: 240px" />
          <div style="position: absolute; right: 0">
            <el-button @click="handleSkuQuery" class="commonSearchBtn">
              <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
              搜索
            </el-button>
            <el-button @click="resetSkuQuery" class="commonResetBtn" style="margin-left: 0px">
              重置
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <el-table :header-cell-style="{ color: '#333', fontWeight: 500, backgroundColor: '#F2F6FC' }" :data="skuListData"
        show-overflow-tooltip max-height="50vh" style="width: 90vw" v-loading="loading" ref="skuTableRef" border>
        <el-table-column type="selection" width="46" align="center"></el-table-column>
        <el-table-column prop="sku" label="SKU编码" width="189"></el-table-column>
        <el-table-column prop="color" label="规格名称"></el-table-column>
        <el-table-column prop="size" label="规格码" width="120"></el-table-column>
      </el-table>
    </div>
    <template #footer>
      <div style="padding: 10px 20px; border-top: solid #f0f0f0 1px">
        <el-button @click="skuVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveChoose">确 定</el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog v-model="importVisible" append-to-body :show-close="false" top="30vh" width="731" style="
      border-radius: 8px;
      transform: none;
      position: static;
      margin-top: var(--el-dialog-margin-top) !important;
      padding: 0;
    " :close-on-click-modal="false">
    <template #header>
      <div class="header">
        <div class="row-center">
          <div>数据导入</div>
          <div class="row-center">
            <img src="@/assets/imgs/common/warning_icon.png" style="width: 12px;height: 12px;margin-left: 16px;">
            <div style="font-size: 12px;color: #333333;margin-left: 10px;">下载最新模板进行数据导入,否则可能出现导入失败的情况</div>
          </div>
        </div>
        <img src="@/assets/imgs/common/close.png" alt="" @click="importVisible = false" />
      </div>
    </template>
    <div style="padding: 0 20px">
      <el-button type="primary" @click="downloadTemplate">导入模板下载</el-button>
      <!-- <el-form :model="importForm"> -->
      <!-- <transfer style="margin-top: 16px;" tip="仅允许导入xls、xlsx格式文件"></transfer> -->
      <!-- </el-form> -->
      <el-upload class="upload-demo" style="margin-top: 16px;" drag multiple accept=".xlsx,.xls"
        v-loading="uploadLoading" :limit="1" :http-request="handleHttpRequest" :show-file-list="false"
        :file-list="fileList">
        <template #default>
          <img src="@/assets/svgs/uploadIcon.svg" />
          <div style="margin-top: 12px;font-size: 14px;color: #3D3D3D;">将文件拖到此处，或点击上传</div>
          <div class="uploadBtn"
            style="margin-top: 21px;background: #E5E5E5;padding: 10px 0px;font-size: 14px;color: #333333;width: 88px;border-radius: 4px;">
            选择文件</div>
        </template>
        <template #tip>
          <div class="el-upload__tip" style="margin-top: 10px;font-size: 12px;color: #999999;">
            仅允许导入xls、xlsx格式文件
          </div>
        </template>
      </el-upload>
    </div>
    <template #footer>
      <div style="padding: 10px 20px; border-top: solid #f0f0f0 1px">
        <el-button @click="importVisible = false">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { cloneDeep } from 'lodash-es'
import { dataDetection, isNumber } from '@/utils'
import request from '@/config/axios'
// import {downloadFileStream} from '@/utils/file'
import download from '@/utils/download'
import { table } from 'console'
const message = useMessage()

const emits = defineEmits(['success'])

const props = defineProps({
  info: { type: Object, default: () => { } }
})

const visible = ref(false)
const skuVisible = ref(false)
const skuListData = ref([])
const skuTableData = ref([])
const skutxt = ref('')
const txt = ref('')
const loading = ref(false)
const tableData = ref([])
const tableRef = ref()
const skuTableRef = ref()
const selectData = computed(() => tableRef?.value?.getSelectionRows())
const listData = ref([])
const bukData = ref([])

const handleQuery = () => {
  listData.value = tableData.value.filter((ts: any) =>
    ts.sku.toLowerCase().includes(txt.value.toLowerCase())
  )
}

const resetQuery = () => {
  txt.value = ''
  handleQuery()
}

const deleteData = (item: any) => {
  tableData.value = tableData.value.filter((tbs: any) => tbs.sku !== item.sku)
  handleQuery()
}

const delAll = () => {
  const skus: any = selectData.value.map((si: any) => si.sku)
  tableData.value = tableData.value.filter((tbs: any) => !skus.includes(tbs.sku))
  handleQuery()
}

const save = () => {
  if (!tableData.value || tableData.value.length === 0) {
    ElMessage({
      type: 'warning',
      message: `未选择SKU`
    })
    return
  }
  if (checkValue()) {
    try {
      loading.value = true
      request
        .post({
          url: '/workflow-api/api/workflow/business/factorySecondary/supplierFlow/orderInfo/save',
          data: {
            fsTaskId: props?.info?.fsTaskId,
            supplierId: props?.info?.supplierId,
            dataList: tableData.value
          }
        })
        .then((res) => {
          visible.value = false
          emits('success')
        })
    } finally {
      loading.value = false
    }
  }
}

const numChange = (scope: any, value: any) => {
  const tar: any = cloneDeep({ ...scope.row })
  const index: number = tableData.value.findIndex((tbs: any) => tbs.sku === tar.sku)
  tableData.value.splice(index, 1, {
    ...tar,
    finishedProductCost: Number(
      Number(tar?.productCostExcludingTax || 0) + Number(tar?.packagingManpower || 0)
    ).toFixed(2) as any
  })
}

const checkValue = () => {
  let backList: Array<boolean> = [
    dataDetection(tableData.value, 'orderVolume', ``, (item: any) => {
      !isNumber(item.orderVolume, 0) &&
        ElMessage({
          type: 'warning',
          message: `${item.sku}的下单量只能是正整数!`
        })
      return !isNumber(item.orderVolume, 0)
    }),
    dataDetection(tableData.value, 'expectedArrivalTime', ``, (item: any) => {
      !item.expectedArrivalTime &&
        ElMessage({
          type: 'warning',
          message: `${item.sku}的期望到货时间不能为空!`
        })
      return !item.expectedArrivalTime
    })
  ]
  return !backList.includes(false)
}

const allSetOneValue = (val: string, key: string) => {
  tableData.value.map((item: any) => {
    item[key] = val
    return { ...item }
  })
}

const handleSkuQuery = () => {
  skuListData.value = skuTableData.value.filter((std: any) =>
    std.sku.toLowerCase().includes(skutxt.value.toLowerCase())
  )
}

const resetSkuQuery = () => {
  skutxt.value = ''
  handleSkuQuery()
}

const addTable = () => {
  request
    .get({
      url: `/workflow-api/api/workflow/business/factorySecondary/supplierFlow/orderInfo/${props.info.fsTaskId}/${props.info.supplierId}`
    })
    .then((res: any) => {
      // dataList.value = res?.records?.length ? res.records : []
      // tableData.value = []
      if (tableData.value && tableData.value.length > 0) {
        const selects = tableData.value.map((item: any) => item?.sku)
        skuTableData.value = res?.length ? res.filter((item: any) => !selects.includes(item?.sku)) : []
      } else {
        skuTableData.value = res?.length ? res : []
      }
      skuVisible.value = true
      handleSkuQuery()
      // dataItem.value = { ...props.info.supplierInfo }
    })
}

const saveChoose = () => {
  const skuSelectedList = skuTableRef?.value?.getSelectionRows() || []
  const arr = []
  skuSelectedList.map((item: any) => {
    if (!tableData.value.some((std: any) => std.sku === item.sku)) {
      arr.push(item)
    }
  })
  tableData.value = tableData.value.concat(arr)
  skuVisible.value = false
  handleQuery()
}

const numEdit = () => { }

const open = async () => {
  tableData.value = []
  if (props?.info?.orderInfo) {
    tableData.value = props?.info?.orderInfo
  }
  handleQuery()
  visible.value = true
}

const importVisible = ref(false)
const fileList = ref([])
const importData = () => {
  fileList.value = []
  importVisible.value = true
}

const downloadLoading = ref(false)
const downloadTemplate = () => {
  try {
    downloadLoading.value = true
    request
      .downloadPost({
        url: '/workflow-api/api/workflow/business/factorySecondary/supplierFlow/orderInfo/export',
        data: {
          fsTaskId: props?.info?.fsTaskId,
          supplierId: props?.info?.supplierId,
          dataList: tableData.value
        }
      }).then(res => {
        download.excel(res, '采购需求下单SKU明细')
      })
  } catch (e) {
    downloadLoading.value = false
  }
}

const uploadLoading = ref(false)
const handleHttpRequest = (options: any) => {
  if (uploadLoading.value) return
  const { file } = options
  const formData = new FormData()
  formData.append('file', file)
  formData.append('fsTaskId', props?.info?.fsTaskId)
  formData.append('supplierId', props?.info?.supplierId)
  uploadLoading.value = true
  request.upload({ url: '/workflow-api/api/workflow/business/factorySecondary/supplierFlow/orderInfo/import', data: formData }).then(res => {
    const {dataList, errorMessages} = res.data
    if(errorMessages && errorMessages.length > 0) {
      message.notifyError('数据异常，请检查文件数据')
      fileList.value = []
      return
    }
    if (dataList) {
      const originData: any = cloneDeep(tableData.value)
      dataList.forEach((dl: any) => {
        const _index = originData.findIndex((od: any) => od.sku === dl.sku)
        if (_index > -1) {
          originData.splice(_index, 1, dl)
        } else {
          originData.push(dl)
        }
      })
      fileList.value = []
      tableData.value = cloneDeep(originData)
      handleQuery()
      importVisible.value = false
    }
  }).finally(() => {
    uploadLoading.value = false
  })
}

defineExpose({ open })
</script>

<style style="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  padding: 16px 20px;
  border-bottom: solid #f0f0f0 1px;

  img {
    width: 14px;
    cursor: pointer;
  }
}

:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #e5e5e5 inset;
}

:deep(.el-button--primary) {
  &.is-plain {
    border-color: var(--el-color-primary);

    &.is-disabled {
      border-color: #D8DCE5;
      color: #666666;
    }
  }
}

:deep(.el-upload-dragger) {
  padding-top: 36px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
