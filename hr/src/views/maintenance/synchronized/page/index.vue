<template>
  <ex-screen ref="screenRef" v-loading="pageLoad">
    <el-tabs v-model="activeTabs" @tab-click="handleClick">
      <el-tab-pane v-for="chal in channels" :name="chal.code">
        <template #label>
          <span
            >{{ chal.label }}
            <span style="color: red">({{ chal?.count || 0 }})</span>
          </span>
        </template>
      </el-tab-pane>
    </el-tabs>
    <query-scheme :scheme="scheme" v-model="searchData" name="Synchronized" :show-expand="true" />
    <s-v-table
      :btn-list="btns"
      :handle-column="handleColumn"
      :screen="screen"
      name="Synchronized"
      :column="column"
      :field-key="'goodsId'"
      :table-data="dataValueList"
      :list-name="`待同步货品(共${dataValueList.length}条,已选择${selectRows.length}条)`"
      is-selection
      ref="tableRef"
      :height="cardHeight - 180"
    />
    <synchronized-set-value ref="valueRef" />
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'Synchronized' }
</script>

<script lang="tsx" setup>
import SVTable from '@/components/template/table/virtual.vue'
import SynchronizedSetValue from '../components/setValue.vue'
import { BtnItem } from '@/components/template/config/type'
import { usePage, SearchItem } from './config'
import { ElLoading } from 'element-plus'
import request from '@/config/axios'
import download from '@/utils/download'
import { categoryOps, seasonCategoryOps } from '@/views/maintenance/unsalable/page/options'
import ExcelJS from 'exceljs'
import dayjs from 'dayjs'

const channels = ref<Array<any>>([]),
  pageLoad = ref<boolean>(false),
  storeOptions = ref<any>([])

const tableRef = ref(),
  activeTabs = ref<string>(''),
  message = useMessage(),
  screenRef = ref(),
  valueRef = ref(),
  dataValueList = ref<Array<any>>([])

// 撤销同步状态
const revokeState = ref({
  lastSyncTime: 0,
  shouldStart: false
})

const selectRows = computed(() => tableRef?.value?.selectRows || [])

const cardHeight = computed(() => screenRef?.value?.height || 500)

const {
  dataList,
  page,
  loading,
  scheme,
  btns,
  searchData,
  column,
  screen,
  stateInfo,
  statistics,
  handleColumn,
  setRouterInfo
} = usePage({
  selectRows: toRef(selectRows, 'value'),
  storeOptions: toRef(storeOptions, 'value'),
  channels,
  activeTabs
})

// 渠道代码转标签（公共函数）
const getChannelLabel = (code: string): string => {
  const channelMap: Record<string, string> = {
    Pdd: '拼多多',
    Douyin: '抖音',
    TaoBao: '淘宝',
    Tmall: '天猫',
    XHS: '小红书',
    KuaiShou: '快手',
    VIP: '唯品会',
    Dewu: '得物',
    WeiXinStore: '微信小店',
    Youzan: '有赞',
    JD: '京东'
  }
  return channelMap[code] || code || '全渠道'
}

// 公共校验函数：校验单条数据的必填字段
const validateItemFields = (item: any, rowNum?: number): { valid: boolean; message?: string } => {
  const prefix = rowNum ? `第 ${rowNum} 行` : item.goodsName || '该货品'

  // 1. 成本不能为0
  if (!item.costs || item.costs === 0) {
    return {
      valid: false,
      message: `${prefix}的成本价不能为0!`
    }
  }

  // 2. 是否为滞销品不能为空
  if ([null, '', undefined].includes(item.isUnsalable)) {
    return {
      valid: false,
      message: `${prefix}的"是否为滞销品"字段为空，请完善后再${rowNum ? '导入' : '提交'}`
    }
  }

  // 3. 品类不能为空
  if ([null, '', undefined].includes(item.category)) {
    return {
      valid: false,
      message: `${prefix}的"品类"字段为空，请完善后再${rowNum ? '导入' : '提交'}`
    }
  }

  // 4. 季节分类不能为空
  if ([null, '', undefined].includes(item.seasonCategory)) {
    return {
      valid: false,
      message: `${prefix}的"季节分类"字段为空，请完善后再${rowNum ? '导入' : '提交'}`
    }
  }

  return { valid: true }
}

// 处理请求数据
const setParamsData = () => {
  return {}
}

// 查询
const onSearch = async () => {
  loading.value = true
  dataValueList.value = dataList.value
    .filter(
      (ds: any) =>
        ds.productName.includes(searchData.value.productName) &&
        ds.productNumber.includes(searchData.value.productNumber) &&
        ds.goodsId.includes(searchData.value.goodsId) &&
        (searchData.value?.store ? ds.store === searchData.value.store : true) &&
        (searchData.value?.isUnsalable !== '' &&
        searchData.value?.isUnsalable !== null &&
        searchData.value?.isUnsalable !== undefined
          ? ds.isUnsalable === searchData.value.isUnsalable
          : true) &&
        (searchData.value?.groundingTime
          ? dayjs(ds.groundingTime).valueOf() >=
              dayjs(searchData.value.groundingTime[0]).startOf('day').valueOf() &&
            dayjs(ds.groundingTime).valueOf() <=
              dayjs(searchData.value.groundingTime[1]).endOf('day').valueOf()
          : true)
    )
    .map((rs: any) => ({ ...rs }))
  loading.value = false
}

const initChannel = () => {
  pageLoad.value = true
  channels.value = []
  request
    .get({ url: `/api/opUnsalableGoods/getNotSyncGoods` })
    .then((res: any) => {
      if (res?.length) {
        res.forEach((rs: any) => {
          let obj: any = {
            label: getChannelLabel(rs.code),
            ...rs
          }
          channels.value.push(obj)
        })
        channels.value.forEach((rs: any) => {
          rs.data = rs.data.map((item: any) => ({ ...item, isUnsalable: item.isUnsalable || 0 }))
        })
        !activeTabs.value && (activeTabs.value = channels.value[0].code || '')
        getStoreOptions()
        searchInitData()
      }
    })
    .finally(() => {
      pageLoad.value = false
    })
}

const searchInitData = () => {
  const tar: any = channels.value.find((cl: any) => cl.code === activeTabs.value)
  dataList.value = (tar?.data || []).map((rs: any) => ({ ...rs, costs: Number(rs?.costs || 0) }))
  onSearch()
}

const getStoreOptions = () => {
  request
    .get({ url: `/api/store/list?page=1&size=999&channel=${activeTabs.value}` })
    .then((res: any) => {
      storeOptions.value = (res?.data || []).map((rs: any) => ({
        ...rs,
        label: rs.name,
        value: rs.code
      }))
    })
}

// 重置
const resetForm = () => {
  searchData.value = { ...new SearchItem() }
  onSearch()
}

// 按钮回调
const onButtonClick = (btn: BtnItem) => {
  if (btn.fun === 'batchDeletion') {
    handleDelete(selectRows.value)
  }
  if (btn.fun === 'set') {
    valueRef?.value?.openDialog()
  }
  if (btn.fun === 'goods') {
    setGoodsInfo()
  }
  if (btn.fun === 'exportDiy') {
    handleExport()
  }
  if (btn.fun === 'importDiy') {
    handleImport()
  }
}

const checkValue = () => {
  // 只校验筛选后的、标记为"是"的滞销品数据
  const syncData = dataValueList.value.filter((item: any) => item.isUnsalable === 1)

  if (syncData.length === 0) {
    ElMessage({
      type: 'warning',
      message: '没有需要同步的数据，请确保至少有一条"是否为滞销品"标记为"是"的数据'
    })
    return false
  }

  // 使用公共校验函数
  for (const item of syncData) {
    const result = validateItemFields(item)
    if (!result.valid) {
      ElMessage({
        type: 'warning',
        message: result.message
      })
      return false
    }
  }
  return true
}

const setGoodsInfo = () => {
  if (checkValue()) {
    // 只同步筛选后的、标记为"是"的滞销品数据
    const syncData = dataValueList.value.filter((item: any) => item.isUnsalable === 1)

    const loading = ElLoading.service({
      lock: true,
      text: '数据同步中,请稍后...',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    request
      .post({ url: `/api/opUnsalableGoods/syncGoods`, data: syncData })
      .then(() => {
        message.success(`同步成功！共同步 ${syncData.length} 条数据`)

        // 只保存同步时间到 localStorage（后端负责数据管理）
        const syncTime = Date.now()
        localStorage.setItem('synchronized_last_sync_time', syncTime.toString())

        // 更新撤销状态，触发按钮组件启动倒计时
        revokeState.value = {
          lastSyncTime: syncTime,
          shouldStart: true
        }

        // 重置 shouldStart 标志
        nextTick(() => {
          revokeState.value.shouldStart = false
        })

        dataList.value = []
        activeTabs.value = ''
        initChannel()
        // router.push({ path: getRouteInfo('Unsalable'), query: { operate: 'reLoad' } })
      })
      .finally(() => loading.close())
  }
}

const handleDelete = async (list: any[]) => {
  const ids: string = list.map((li: any) => li.goodsId).join(',')
  await message.confirm('移除后将无法手动重新添加,需等待下次数据同步才会恢复,是否确定移除?')
  loading.value = true
  request
    .post({ url: `/api/opUnsalableGoods/batchRemove`, data: list })
    .then(() => {
      message.success('删除成功')
      dataList.value = dataList.value.filter((ds: any) => !ids.includes(ds.goodsId))
      initChannel()
    })
    .finally(() => {
      loading.value = false
    })
}

const handleClick = async (tab) => {
  activeTabs.value = tab.props.name
  searchData.value = { ...new SearchItem() }
  getStoreOptions()
  searchInitData()
}

// 操作列回调
const viewDetails = (type: string, item?: any) => {
  if (type === 'delLine') {
    handleDelete([{ ...item }])
  }
}

// 撤销同步（由按钮组件通过 inject 调用）
const handleRevokeSync = async () => {
  try {
    await message.confirm('确定要撤销最近一次同步的数据吗？撤销后数据将恢复到同步前的状态。')

    const loading = ElLoading.service({
      lock: true,
      text: '撤销中,请稍后...',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    // 调用后端撤销接口（后端负责数据恢复）
    request
      .post({ url: `/api/opUnsalableGoods/revokeLastSyncRecord` })
      .then(() => {
        message.success('撤销成功')

        // 清理同步时间
        localStorage.removeItem('synchronized_last_sync_time')

        // 通知按钮组件停止倒计时
        revokeState.value = {
          lastSyncTime: 0,
          shouldStart: false
        }

        // 刷新列表
        activeTabs.value = ''
        initChannel()
      })
      .catch((error) => {
        console.error('撤销失败:', error)
        message.error('撤销失败，请重试')
      })
      .finally(() => loading.close())
  } catch (error) {
    // 用户取消操作
    console.log('用户取消撤销')
  }
}

// 导入功能（解析 Excel 文件）
const handleImport = () => {
  // 创建文件输入元素
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.xlsx,.xls'

  input.onchange = async (e: any) => {
    const file = e.target.files[0]
    if (!file) return

    const loadingInstance = ElLoading.service({
      lock: true,
      text: '数据导入中，请稍等...',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    try {
      // 动态导入 exceljs
      // @ts-ignore
      // const ExcelJS = await import('exceljs')

      // 创建工作簿并读取文件
      const workbook = new ExcelJS.Workbook()
      const arrayBuffer = await file.arrayBuffer()
      await workbook.xlsx.load(arrayBuffer)

      // 获取第一个工作表
      const worksheet = workbook.worksheets[0]
      if (!worksheet) {
        message.error('Excel 文件格式错误')
        loadingInstance.close()
        return
      }

      // 解析数据（从第3行开始，跳过提示行和表头行）
      const importData: any[] = []
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber >= 3) {
          // 从第3行开始是数据
          const cellValue = (cellNum: number): string => {
            const value = row.getCell(cellNum).value
            if (value === null || value === undefined) return ''
            return String(value)
          }

          const rowData = {
            productName: cellValue(1),
            productNumber: cellValue(2),
            goodsId: cellValue(3),
            channel: cellValue(4),
            storeName: cellValue(5),
            xl30: Number(row.getCell(6).value) || 0,
            costs: Number(row.getCell(7).value) || 0,
            isUnsalable: cellValue(8),
            category: cellValue(9),
            seasonCategory: cellValue(10)
          }
          // 只添加有商品ID的行（过滤空行）
          if (rowData.goodsId) {
            importData.push(rowData)
          }
        }
      })

      if (importData.length === 0) {
        message.warning('导入文件为空或格式不正确')
        loadingInstance.close()
        return
      }
      console.log(importData, 'importData')
      // 校验并更新数据
      const result = validateAndUpdateImportData(importData)

      if (!result.success) {
        message.error(result.message || '数据校验失败')
        loadingInstance.close()
        return
      }

      message.success(`导入成功！共更新 ${result.count || 0} 条数据`)
      onSearch() // 刷新列表
      loadingInstance.close()
    } catch (error: any) {
      console.error('导入失败:', error)
      message.error('导入失败：' + (error.message || '文件格式错误'))
      loadingInstance.close()
    }
  }

  input.click()
}

// 校验并更新导入的数据
const validateAndUpdateImportData = (
  importData: any[]
): { success: boolean; message?: string; count?: number } => {
  let updateCount = 0

  for (let i = 0; i < importData.length; i++) {
    const row = importData[i]
    const rowNum = i + 3 // Excel 中的实际行号

    // 1. 校验是否在当前列表中存在
    const existItem = dataList.value.find((item: any) => item.goodsId === row.goodsId)
    if (!existItem) {
      return {
        success: false,
        message: `导入数据异常：第 ${rowNum} 行的商品ID "${row.goodsId}" 在当前列表中不存在，请重新检查后再导入`
      }
    }

    // 2. 转换标签为代码值
    // 是否为滞销品：是→1，否→0
    const isUnsalableValue = row.isUnsalable === '是' ? 1 : row.isUnsalable === '否' ? 0 : null
    if (isUnsalableValue === null) {
      return {
        success: false,
        message: `第 ${rowNum} 行的"是否为滞销品"值无效，只能是"是"或"否"`
      }
    }

    // 品类：标签→数字
    const categoryValue = categoryOps.find((op) => op.label === row.category)?.value
    if (categoryValue === undefined) {
      return {
        success: false,
        message: `第 ${rowNum} 行的"品类"值"${row.category}"无效，请从下拉列表中选择`
      }
    }

    // 季节分类：标签→数字
    const seasonValue = seasonCategoryOps.find((op) => op.label === row.seasonCategory)?.value
    if (seasonValue === undefined) {
      return {
        success: false,
        message: `第 ${rowNum} 行的"季节分类"值"${row.seasonCategory}"无效，请从下拉列表中选择`
      }
    }

    // 3. 创建临时对象用于校验
    const tempItem = {
      ...existItem,
      isUnsalable: isUnsalableValue,
      category: categoryValue,
      seasonCategory: seasonValue,
      costs: row.costs || existItem.costs
    }

    // 4. 使用公共校验函数验证必填字段
    const validationResult = validateItemFields(tempItem, rowNum)
    if (!validationResult.valid) {
      return {
        success: false,
        message: validationResult.message
      }
    }

    // 5. 校验通过，更新数据
    existItem.isUnsalable = isUnsalableValue
    existItem.category = categoryValue
    existItem.seasonCategory = seasonValue
    existItem.costs = tempItem.costs

    updateCount++
  }

  return {
    success: true,
    count: updateCount
  }
}

// 导出功能（使用 exceljs 实现真正的下拉选择）
const handleExport = async () => {
  // 判断导出的数据：有勾选导出勾选的，没勾选导出全部
  const exportData = selectRows.value.length > 0 ? selectRows.value : dataValueList.value

  if (exportData.length === 0) {
    message.warning('没有可导出的数据')
    return
  }

  const loadingInstance = ElLoading.service({
    lock: true,
    text: '文件导出中，请稍等...',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  try {
    // 动态导入 exceljs
    // @ts-ignore
    // const ExcelJS = await import('exceljs')

    // 创建工作簿
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('待同步货品')

    // 将数字值转换为文本标签
    const getCategoryLabel = (val: any) => {
      return categoryOps.find((op) => op.value === val)?.label || ''
    }
    const getSeasonLabel = (val: any) => {
      return seasonCategoryOps.find((op) => op.value === val)?.label || ''
    }
    // 使用公共的渠道转换函数
    const formatChannel = (code: string) => getChannelLabel(code)

    // 第1行：添加提示信息（黄色背景）
    worksheet.mergeCells('A1:J1')
    const tipCell = worksheet.getCell('A1')

    // 设置富文本，标题加粗，1和2缩进两个字符（使用全角空格）
    tipCell.value = {
      richText: [
        {
          font: { name: '宋体', size: 12, bold: true, color: { argb: 'FFFF0000' } },
          text: '为避免数据丢失，请严格遵循以下要求：'
        },
        {
          font: { name: '宋体', size: 12, color: { argb: 'FFFF0000' } },
          text: '\n  1、必填字段：请确保"是否为滞销品"、"品类"和"季节分类"三项均已通过下拉菜单手动选择并填写；'
        },
        {
          font: { name: '宋体', size: 12, color: { argb: 'FFFF0000' } },
          text: '\n  2、禁止修改系统字段：请勿修改"货品名称"、"编码"、"商品ID"、"渠道"、"店铺"、"30天销量"系统自动生成或已有的字段。如无需某条货品数据，请直接删除整行，切勿保留空或重复内容'
        }
      ]
    }

    tipCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF00' } // 黄色背景
    }
    tipCell.alignment = {
      vertical: 'middle',
      horizontal: 'left',
      wrapText: true,
      indent: 1 // 设置整体缩进，模拟 padding-left
    }
    worksheet.getRow(1).height = 65 // 增加行高以容纳内边距效果

    // 第2行：表头（黄色背景）
    const headerRow = worksheet.getRow(2)
    const headers = [
      '货品名称',
      '编码',
      '商品ID',
      '渠道',
      '店铺',
      '30天销量',
      '成本',
      '是否为滞销品',
      '品类',
      '季节分类'
    ]

    headers.forEach((header, index) => {
      const cell = headerRow.getCell(index + 1)
      cell.value = header
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' } // 黄色背景
      }
      cell.font = {
        name: '宋体',
        bold: true,
        size: 11
      }
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    })

    // 设置表头行高
    headerRow.height = 30

    // 设置列宽
    worksheet.columns = [
      { key: 'productName', width: 25 },
      { key: 'productNumber', width: 15 },
      { key: 'goodsId', width: 20 },
      { key: 'channel', width: 12 },
      { key: 'storeName', width: 25 },
      { key: 'xl30', width: 12 },
      { key: 'costs', width: 12 },
      { key: 'isUnsalable', width: 15 },
      { key: 'category', width: 15 },
      { key: 'seasonCategory', width: 15 }
    ]

    // 定义下拉选项
    const isUnsalableOptions = ['是', '否']
    const categoryOptions = categoryOps.map((op) => op.label)
    const seasonOptions = seasonCategoryOps.map((op) => op.label)

    // 添加数据行并设置数据验证
    exportData.forEach((item: any, index: number) => {
      const rowIndex = index + 3 // 数据从第3行开始（第1行提示，第2行表头）

      // 添加行数据
      const row = worksheet.addRow({
        productName: item.productName || '',
        productNumber: item.productNumber || '',
        goodsId: item.goodsId || '',
        channel: formatChannel(item.channel),
        storeName: item.storeName || '',
        xl30: item.xl30 || 0,
        costs: item.costs || 0,
        isUnsalable: item.isUnsalable === 1 ? '是' : item.isUnsalable === 0 ? '否' : '',
        category: getCategoryLabel(item.category),
        seasonCategory: getSeasonLabel(item.seasonCategory)
      })

      // 设置边框
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
        cell.alignment = { vertical: 'middle', horizontal: 'left' }
      })

      // 第1列和第2列（货品名称、编码）设置浅灰色背景，标识为系统字段不可修改
      worksheet.getCell(`A${rowIndex}`).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF5F5F5' } // 浅灰色
      }
      worksheet.getCell(`B${rowIndex}`).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF5F5F5' } // 浅灰色
      }

      // 设置数据验证（下拉列表）
      // H列：是否为滞销品
      worksheet.getCell(`H${rowIndex}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [`"${isUnsalableOptions.join(',')}"`],
        showErrorMessage: true,
        errorStyle: 'error',
        errorTitle: '输入错误',
        error: '请从下拉列表中选择'
      }

      // I列：品类
      worksheet.getCell(`I${rowIndex}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [`"${categoryOptions.join(',')}"`],
        showErrorMessage: true,
        errorStyle: 'error',
        errorTitle: '输入错误',
        error: '请从下拉列表中选择'
      }

      // J列：季节分类
      worksheet.getCell(`J${rowIndex}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [`"${seasonOptions.join(',')}"`],
        showErrorMessage: true,
        errorStyle: 'error',
        errorTitle: '输入错误',
        error: '请从下拉列表中选择'
      }
    })

    // 生成 Excel 文件
    const buffer = await workbook.xlsx.writeBuffer()

    // 转换为 Blob
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })

    // 使用项目的 download 工具下载
    const fileName = `待同步货品_${activeTabs.value}_${new Date().getTime()}.xlsx`
    download.excel(blob, fileName)

    message.success('导出成功')
  } catch (error: any) {
    console.error('导出失败:', error)
    message.error('导出失败，请重试')
  } finally {
    loadingInstance.close()
  }
}

onMounted(() => {
  dataList.value = []
  initChannel()
})

setRouterInfo()

provide('SynchronizedForm', {
  searchData,
  dataList,
  selectRows,
  page,
  loading,
  stateInfo,
  statistics,
  setParamsData,
  resetForm,
  onSearch,
  onButtonClick,
  viewDetails,
  revokeState,
  handleRevokeSync
})
</script>
<style lang="scss" scoped>
@use './styles.scss';

:deep() {
  .el-icon .el-message__icon .el-message-icon--warning {
    fill: red !important;
  }
}
:deep() {
  .grid_table {
    // 滚动条整体
    ::-webkit-scrollbar {
      width: 8px !important; // 垂直滚动条宽度
      height: 8px !important; // 水平滚动条高度
    }

    // 滚动条轨道
    ::-webkit-scrollbar-track {
      background: transparent !important; // 轨道背景色
    }

    // 滚动条滑块
    ::-webkit-scrollbar-thumb {
      background: #c1c1c1 !important; // 滑块颜色
      border-radius: 4px !important;

      &:hover {
        background: #a8a8a8 !important; // 悬停时颜色
      }
    }
  }
}
</style>
