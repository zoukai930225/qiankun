<template>
  <content-wrap>
    <div class="flex justify-between items-center">
      <el-form v-model="formData" inline>
        <el-form-item label="日期">
          <el-date-picker
            value-format="YYYY-MM-DD"
            format="YYYY-MM-DD"
            v-model="formData.dataDate"
            type="date"
            placeholder="选择日期"
            :disabled-date="disabledDate"
            :clearable="false"
            @change="fetchData"
          />
        </el-form-item>
        <el-form-item label="店铺">
          <el-select
            filterable
            v-model="formData.store"
            placeholder="请选择店铺"
            @change="fetchData"
          >
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.nickName"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="flex items-center">
        <el-button @click="openSingleManageDialog">单品管理</el-button>
        <el-button type="primary" @click="exportImg" :loading="exportLoading">导出图片</el-button>
      </div>
    </div>
    <div class="single-daily-consumption-table">
      <div>
        <h3 class="title"
          >单品日消耗-{{ storeList.find((item) => item.code === formData.store)?.nickName }}（{{
            formData.dataDate
          }}）</h3
        >
        <s-table
          ref="tableRef"
          :columns="columns"
          :data="tableData"
          :header-cell-class-name="headerCellClassName"
          :cell-class-name="cellClassName"
          :show-pagination="false"
          show-loading
        />
      </div>
    </div>
    <single-manage ref="singleManageRef" />
  </content-wrap>
</template>

<script lang="tsx" setup>
import { STable } from '@/components/SWTable'
import { ref, onMounted, provide } from 'vue'
import dayjs from 'dayjs'
import { MultiTableExportUtil } from '@/utils/exportImg'
import SingleManage from './components/singleManage.vue'
import { getDouyinGoodsList, getLatestDate } from '@/api/channelData'
import { getQcAccountStoreByChannel } from '@/api/qianchuan'
import { Store } from './types/channelData'
import GoodCard from '@/components/common/goods/goodCard.vue'

const storeList = ref<Store[]>([
  // {
  //   id: 1,
  //   name: 'SecretWorld官方旗舰店',
  //   code: 'swDouyinOfficial'
  // },
  // {
  //   id: 2,
  //   name: 'SecretWorld服饰旗舰店',
  //   code: 'swDouyin'
  // },
  // {
  //   id: 3,
  //   name: 'SecretWorld服装旗舰店',
  //   code: 'swDouyinApparel'
  // }
])

// Define the interface for table data
interface TableDataItem {
  image: string
  goodsCode: string
  goodsGmv: string
  goodsCost: string
  goodsRoi: string
  carCost: string
  carRoi: string
  liveBroadCost: string
  liveBroadGmv: string
  liveBroadRoi: string
  daRenCost: string
  daRenGmv: string
  daRenRoi: string
}

const exportLoading = ref(false)
const lastDate = ref('')
const formData = ref({
  store: 'swDouyinOfficial',
  dataDate: '' // 默认前一天
})
const columns = ref([
  {
    prop: 'image',
    label: '商品主图',
    width: 110,
    align: 'center',
    customRender: ({ row }) => {
      return (
        <div class="goods-image-container">
          <el-popover placement="right" width={348} trigger="hover" showArrow={false} offset={20}>
            {{
              default: () => (
                <GoodCard
                  good={{
                    materialName: row.goodsName || row.goodsCode,
                    materialId: row.goodsId || row.goodsCode,
                    goodsImage: row.goodsImage,
                    channel: 'Douyin'
                  }}
                />
              ),
              reference: () => (
                <div class="goods-image-wrapper">
                  <img
                    src={row.goodsImage}
                    alt={row.goodsCode}
                    style="width: 80px; height: 80px; object-fit: contain; border-radius: 4px;"
                  />
                </div>
              )
            }}
          </el-popover>
        </div>
      )
    }
  },
  { prop: 'goodsCode', label: '编码', minWidth: 100, align: 'center', sortable: true },
  { prop: 'goodsGmv', label: '商品总GMV', width: 140, align: 'center', sortable: true },
  { prop: 'goodsCost', label: '商品总消耗', width: 120, align: 'center', sortable: true },
  { prop: 'goodsRoi', label: '商品总费比', width: 120, align: 'center', sortable: true },
  {
    prop: 'carCost',
    label: '自营（商品卡+挂车）消耗',
    width: 220,
    align: 'center',
    sortable: true
  },
  { prop: 'carGmv', label: '广告成交', width: 120, align: 'center', sortable: true },
  { prop: 'carRoi', label: '广告ROI', width: 120, align: 'center', sortable: true },
  {
    prop: 'liveBroadCost',
    label: '自营直播消耗（预估）',
    width: 210,
    align: 'center',
    sortable: true
  },
  { prop: 'liveBroadGmv', label: '广告成交', width: 120, align: 'center', sortable: true },
  { prop: 'liveBroadRoi', label: '广告ROI', width: 120, align: 'center', sortable: true },
  { prop: 'daRenCost', label: '达人消耗', width: 120, align: 'center', sortable: true },
  { prop: 'daRenGmv', label: '广告成交', width: 120, align: 'center', sortable: true },
  { prop: 'daRenRoi', label: '广告ROI', width: 120, align: 'center', sortable: true }
])

// Header cell class name function
const headerCellClassName = ({ columnIndex }: { columnIndex: number }) => {
  if (columnIndex <= 4) {
    return 'product-header'
  } else if (columnIndex >= 5 && columnIndex <= 7) {
    return 'ad-first-header'
  } else if (columnIndex >= 8 && columnIndex <= 10) {
    return 'ad-second-header'
  } else if (columnIndex >= 11) {
    return 'ad-third-header'
  }
  return ''
}

// Cell class name function with text color logic
const cellClassName = ({ columnIndex }: { columnIndex: number }) => {
  const classes: string[] = []

  // 背景色逻辑
  if (columnIndex <= 4) {
    classes.push('product-cell')
  } else if (columnIndex >= 5 && columnIndex <= 7) {
    classes.push('ad-first-cell')
  } else if (columnIndex >= 8 && columnIndex <= 10) {
    classes.push('ad-second-cell')
  } else if (columnIndex >= 11) {
    classes.push('ad-third-cell')
  }

  // 字体颜色逻辑
  // 蓝色: 3(商品总消耗), 5(自营消耗), 8(直播消耗), 11(达人消耗)
  if ([3, 5, 8, 11].includes(columnIndex)) {
    classes.push('cell-text-blue')
  }
  // 红色: 4(商品总费比), 7(广告ROI), 10(广告ROI), 13(广告ROI)
  if ([4, 7, 10, 13].includes(columnIndex)) {
    classes.push('cell-text-red')
  }

  return classes.join(' ')
}

async function getList() {
  try {
    tableRef.value.setLoading(true)
    if (!lastDate.value) {
      const latestDate = await getLatestDate()
      formData.value.dataDate = latestDate
      lastDate.value = latestDate
    }
    const data = await getDouyinGoodsList({
      dataDate: formData.value.dataDate,
      store: formData.value.store
    })
    if (Array.isArray(data)) {
      tableData.value = data
    } else {
      tableData.value = []
    }
  } catch (error) {
    tableData.value = []
  } finally {
    tableRef.value.setLoading(false)
  }
}

const tableRef = ref()
const tableData = ref<TableDataItem[]>([])

const fetchData = () => {
  // tableRef.value.refresh(true)
  getList()
}

const exportImg = async () => {
  if (exportLoading.value) return
  exportLoading.value = true

  // 使用了setTimeout创建宏任务，这样可以确保loading状态在开始执行图片导出之前能够被渲染出来。
  // 浏览器会先完成UI更新周期，然后再执行setTimeout中的回调函数。即使延迟为0，这也能让浏览器有机会完成DOM渲染。
  setTimeout(async () => {
    try {
      console.log('Exporting image for:', formData.value.dataDate, formData.value.store)
      const tableContainer = document.querySelector(
        '.single-daily-consumption-table'
      ) as HTMLElement
      if (!tableContainer) {
        console.error('找不到表格元素')
        exportLoading.value = false
        return
      }

      await MultiTableExportUtil.exportElements([tableContainer], {
        filename: `单品日消耗-${storeList.value.find((item) => item.code === formData.value.store)?.name}-${formData.value.dataDate}.png`,
        defaultWidths: [1200],
        extraWidth: 0 // 减少额外的宽度，避免出现边框
      })

      console.log('Export completed')
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      exportLoading.value = false
    }
  }, 0)
}

const singleManageRef = ref()

const openSingleManageDialog = () => {
  singleManageRef.value.open()
}

async function getStoreList() {
  const res = await getQcAccountStoreByChannel({
    channelCode: 'Douyin'
  })
  storeList.value = res
}

const disabledDate = (time: Date) => {
  if (!formData.value.dataDate) return false
  return dayjs(time).isAfter(dayjs(lastDate.value), 'day')
}

onMounted(() => {
  getStoreList()
  getList()
})

// 提供storeList给子组件
provide('storeList', storeList)
</script>

<style scoped lang="scss">
.single-daily-consumption-table {
  .title {
    font-size: 16px;
    line-height: 24px;
    color: #3d3d3d;
    font-weight: bold;
    margin-bottom: 16px;
  }
  // 确保导出时没有多余边框
  border: none !important;
  outline: none !important;
  padding: 16px 0;
  background-color: white;
  border-radius: 0;
}
:deep(.el-select) {
  width: 220px;
}

// 商品图片相关样式
:deep(.goods-image-container) {
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.goods-image-wrapper) {
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 4px;
}

:deep(.goods-detail-popover) {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

:deep(.goods-detail-image) {
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
}

:deep(.goods-detail-info) {
  .goods-name {
    font-size: 14px;
    line-height: 1.5;
    color: #303133;
    margin: 0;
  }
}

:deep(.s-table) {
  // 重置表格样式
  .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
    background-color: rgba(245, 247, 250, 0.6) !important;
  }

  .el-table__row--striped td.el-table__cell {
    background-color: rgba(250, 250, 250, 0.4) !important;
  }

  // 表头样式
  .el-table__header-wrapper {
    th.el-table__cell {
      height: 48px;
      font-weight: bold;
      color: #606266;
    }
  }

  // 表格单元格样式
  .el-table__row td {
    padding: 8px 0;
  }

  // 商品主图-商品总费比
  .product-header {
    background: linear-gradient(
      180deg,
      rgba(218, 245, 213, 0.33) 0%,
      rgba(255, 255, 255, 0.33) 100%
    ) !important;
  }

  // 自营（商品卡 挂车）消耗到第一个广告roi
  .ad-first-header {
    background: linear-gradient(
      180deg,
      rgba(216, 243, 252, 0.33) 0%,
      rgba(247, 253, 254, 0.33) 100%
    ) !important;
  }

  // 第二个到roi的背景色
  .ad-second-header {
    background: linear-gradient(
      180deg,
      rgba(185, 206, 253, 0.33) 0%,
      rgba(255, 255, 255, 0.33) 100%
    ) !important;
  }

  // 最后一个到roi的
  .ad-third-header {
    background: linear-gradient(
      180deg,
      rgba(254, 221, 240, 0.33) 0%,
      rgba(255, 255, 255, 0.33) 100%
    ) !important;
  }

  // 单元格背景色 - 使用更淡的背景
  .product-cell {
    background: linear-gradient(180deg, rgba(218, 245, 213, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%);
  }

  .ad-first-cell {
    background: linear-gradient(180deg, rgba(216, 243, 252, 0.1) 0%, rgba(247, 253, 254, 0.1) 100%);
  }

  .ad-second-cell {
    background: linear-gradient(180deg, rgba(185, 206, 253, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%);
  }

  .ad-third-cell {
    background: linear-gradient(180deg, rgba(254, 221, 240, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%);
  }

  // 字体颜色样式
  .cell-text-blue {
    color: var(--el-color-primary) !important;
  }

  .cell-text-red {
    color: #f56c6c !important;
  }
}

:deep(.el-form) {
  .el-form-item {
    margin-bottom: unset;
  }
}
</style>
