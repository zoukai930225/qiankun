<!--
 * @Description: 舆情数据看板
-->
<template>
  <div class="board-section">
    <div class="section-title">
      <span>数据看板列表</span>
      <el-button type="primary" @click="exportData">
        <span>导出</span>
      </el-button>
    </div>
    <div v-if="showMoreButton" class="more-button-wrapper">
      <el-button link type="primary" @click="handleShowMore">
        <span>查看更多</span>
        <el-icon>
          <ArrowRight />
        </el-icon>
      </el-button>
    </div>
    <el-tabs v-model="activeTab" class="statistics-tabs" @tab-change="handleTabChange">
      <el-tab-pane label="平台统计" name="platform">
        <table-with-more
          :table-data="platformData"
          :display-limit="5"
          ref="platformTableWithMoreRef"
          dialog-title="平台统计"
        >
          <el-table-column prop="tjwd" label="发布平台" min-width="120" align="left">
            <template #default="{ row }">
              <div class="row-platform">
                <img v-if="getImageUrl(row.tjwdCode)" :src="getImageUrl(row.tjwdCode)" alt="" />
                <span>{{ row.tjwd || '-' }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="djsl" label="登记量" min-width="100" align="left" />
          <el-table-column prop="djzb" label="登记占比" min-width="100" align="left" />
          <el-table-column prop="stsl" label="删除量" min-width="100" align="left" />
          <el-table-column prop="stzb" label="删除占比" min-width="100" align="left" />
        </table-with-more>
      </el-tab-pane>
      <el-tab-pane label="产品类型统计" name="product">
        <table-with-more
          :table-data="productData"
          :display-limit="5"
          ref="productTableWithMoreRef"
          dialog-title="产品类型统计"
        >
          <el-table-column prop="tjwd" label="产品类型" min-width="120" align="left" />
          <el-table-column prop="djsl" label="登记量" min-width="100" align="left" />
          <el-table-column prop="djzb" label="登记占比" min-width="100" align="left" />
          <el-table-column prop="stsl" label="删除量" min-width="100" align="left" />
          <el-table-column prop="stzb" label="删除占比" min-width="100" align="left" />
        </table-with-more>
      </el-tab-pane>
      <el-tab-pane label="舆情类型统计" name="opinion">
        <table-with-more
          :table-data="opinionData"
          :display-limit="5"
          ref="opinionTableWithMoreRef"
          dialog-title="舆情类型统计"
        >
          <el-table-column prop="tjwd" label="舆情类型" min-width="120" align="left" />
          <el-table-column prop="djsl" label="登记量" min-width="100" align="left" />
          <el-table-column prop="djzb" label="登记占比" min-width="100" align="left" />
          <el-table-column prop="stsl" label="删除量" min-width="100" align="left" />
          <el-table-column prop="stzb" label="删除占比" min-width="100" align="left" />
        </table-with-more>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="tsx" setup>
// import request from '@/config/axios'
import TableWithMore from './TableWithMore.vue'
import ExcelJS from 'exceljs'
import { useMessage } from '@/hooks/web/useMessage'
import { ElLoading } from 'element-plus'
import download from '@/utils/download'
import { getImageUrl } from '@/views/customerService/publicOpinionRegistration/data/opinionTypes'
// const { selectedDay } = inject('opinionDataBoard') as { selectedDay: Ref<string> }
const message = useMessage()
const activeTab = ref('platform')

// 平台统计数据
const platformData = ref<any[]>([])

// 产品类型统计数据
const productData = ref<any[]>([])

// 舆情类型统计数据
const opinionData = ref<any[]>([])

// Tab切换
const handleTabChange = (_name: string) => {
  // Tab切换时可以做一些处理
}
const platformTableWithMoreRef = ref<InstanceType<typeof TableWithMore>>()
const productTableWithMoreRef = ref<InstanceType<typeof TableWithMore>>()
const opinionTableWithMoreRef = ref<InstanceType<typeof TableWithMore>>()
const showMoreButton = computed(() => {
  return (
    (activeTab.value === 'platform' && platformData.value.length > 5) ||
    (activeTab.value === 'product' && productData.value.length > 5) ||
    (activeTab.value === 'opinion' && opinionData.value.length > 5)
  )
})

const handleShowMore = () => {
  if (activeTab.value === 'platform') {
    platformTableWithMoreRef.value?.openDialog()
  } else if (activeTab.value === 'product') {
    productTableWithMoreRef.value?.openDialog()
  } else if (activeTab.value === 'opinion') {
    opinionTableWithMoreRef.value?.openDialog()
  }
}

// 导出 Excel
const exportData = async () => {
  // 检查是否有数据
  if (
    platformData.value.length === 0 &&
    productData.value.length === 0 &&
    opinionData.value.length === 0
  ) {
    message.warning('暂无数据可导出')
    return
  }

  const loadingInstance = ElLoading.service({
    lock: true,
    text: '文件导出中，请稍等...',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  try {
    // 创建工作簿
    const workbook = new ExcelJS.Workbook()
    const workbookData = [
      {
        title: '平台统计',
        data: platformData.value,
        columns1Title: '发布平台'
      },
      {
        title: '产品类型统计',
        data: productData.value,
        columns1Title: '产品类型'
      },
      {
        title: '舆情类型统计',
        data: opinionData.value,
        columns1Title: '舆情类型'
      }
    ]
    workbookData.forEach((item) => {
      const sheet = workbook.addWorksheet(item.title)
      sheet.columns = [
        { header: item.columns1Title, key: 'tjwd', width: 20 },
        { header: '登记量', key: 'djsl', width: 15 },
        { header: '登记占比', key: 'djzb', width: 15 },
        { header: '删除量', key: 'stsl', width: 15 },
        { header: '删除占比', key: 'stzb', width: 15 }
      ]
      item.data.forEach((item) => {
        sheet.addRow({
          tjwd: item.tjwd || '-',
          djsl: item.djsl || 0,
          djzb: item.djzb || '-',
          stsl: item.stsl || 0,
          stzb: item.stzb || '-'
        })
      })
      // 设置表头样式
      sheet.getRow(1).font = { bold: true, size: 12 }
      sheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE7E6E6' }
      }
      sheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' }

      // 设置数据行样式
      sheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          row.alignment = { vertical: 'middle', horizontal: 'center' }
          // 第一列左对齐
          row.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' }
        }
        // 添加边框
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
        })
      })
    })

    // 生成 Excel 文件
    const buffer = await workbook.xlsx.writeBuffer()

    // 转换为 Blob
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })

    const fileName = `舆情数据看板_${new Date().getTime()}.xlsx`
    download.excel(blob, fileName)

    message.success('导出成功')
  } catch (error: any) {
    console.error('导出失败:', error)
    message.error('导出失败：' + (error.message || '未知错误'))
  } finally {
    loadingInstance.close()
  }
}

// 获取数据
const getData = async (res) => {
  try {
    console.log(res, 'res3333333333333')
    platformData.value =
      res.pttj.map((item: any) => ({
        ...item,
        tjwd: item.tjwd || '-',
        djsl: item.djsl || 0,
        djzb: item.djzb || '-',
        stsl: item.stsl || 0,
        stzb: item.stzb || '-'
      })) || []
    productData.value =
      res.cplbtj.map((item: any) => ({
        ...item,
        tjwd: item.tjwd || '-',
        djsl: item.djsl || 0,
        djzb: item.djzb || '-',
        stsl: item.stsl || 0,
        stzb: item.stzb || '-'
      })) || []
    opinionData.value =
      res.yqltj.map((item: any) => ({
        ...item,
        tjwd: item.tjwd || '-',
        djsl: item.djsl || 0,
        djzb: item.djzb || '-',
        stsl: item.stsl || 0,
        stzb: item.stzb || '-'
      })) || []
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

defineExpose({ getData })
</script>

<style lang="scss" scoped>
@use '../style.scss';
.board-section {
  position: relative;
  .section-title {
    margin-bottom: 6px !important;
  }
  .more-button-wrapper {
    position: absolute;
    right: 20px;
    top: 70px;
    z-index: 1;
  }
  .statistics-tabs {
    :deep(.el-tabs__nav-wrap::after) {
      height: 1px;
    }
    :deep(.el-tabs__item) {
      font-size: 14px;
      color: #666;
    }
    :deep(.el-tabs__active-bar) {
      height: 2px;
    }
  }
  .row-platform {
    display: flex;
    align-items: center;
    gap: 4px;
    img {
      width: 20px;
      height: 20px;
    }
  }
}
</style>
