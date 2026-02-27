<!--
 * @Author: wangxifeng-ZJ3bu
 * @Date: 2026-01-22 10:12:41
 * @LastEditors: wangxifeng-ZJ3bu
 * @LastEditTime: 2026-02-03 11:59:54
-->
<template>
  <scheme-dialog
    ref="detailsRef"
    class="SupplierEvaluation"
    name="SupplierEvaluation"
    width="1200px"
  >
    <template #card>
      <div class="total">总计：{{ orderNum }}</div>
      <div class="table-cnt">
        <el-table border :data="tableData" :span-method="spanMethod">
          <el-table-column
            type="index"
            width="65"
            label="序号"
            fixed="left"
            align="center"
          ></el-table-column>
          <el-table-column
            v-for="item in SupplierEvaluationColumn"
            :key="item.field"
            :prop="item.field"
            :label="item.title"
          >
            <template #default="{ row }">
              <el-link
                v-if="item.field === 'goodsNo'"
                :underline="false"
                type="primary"
                @click="handleGoodsNoClick(row)"
                >{{ row[item.field] ?? '-' }}</el-link
              >
              <span
                v-else-if="item.field === 'isQualified'"
                :class="{ unqualified: row[item.field] == 0, qualified: true }"
              >
                <el-tag v-if="row[item.field] == 1" type="primary">合格</el-tag>
                <el-tag v-else-if="row[item.field] == 0" type="danger">不合格</el-tag>
                <span v-else>-</span>
              </span>
              <span v-else>{{ row[item.field] ?? '-' }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination" style="color: #666 !important">
          <el-pagination
            class="pagination-page"
            v-model:current-page="page.page"
            v-model:page-size="page.size"
            :background="true"
            :total="page.total"
            :page-sizes="[10, 20, 30, 40]"
            :disabled="loading"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </template>
    <template #button>
      <el-button @click="detailsRef?.close()" :disabled="loading">关闭</el-button>
      <!-- <el-button type="primary" @click="submitForm" :disabled="loading">提交</el-button> -->
    </template>
  </scheme-dialog>

  <!-- ✅ 放在 scheme-dialog 外部，避免 destroy-on-close 导致组件销毁 -->
  <InspectWindow ref="inspectWindowRef" />
</template>

<script lang="tsx">
export default { name: 'SupplierEvaluationDetails' }
</script>

<script lang="tsx" setup>
import { FromProvideType, PageItem } from '@/components/template/config/type'
import request from '@/config/axios'
import InspectWindow from '@/views/storage/qualityInspection/incomingMaterialInspection/details/window.vue'
const { searchData } = inject(`SupplierEvaluationForm`) as FromProvideType

const detailsRef = ref<any>(),
  formRef = ref(),
  viewType = ref<string>('view'),
  loading = ref<boolean>(false),
  tableData = ref<Array<any>>([]),
  page = ref<PageItem>({
    ...new PageItem()
  }),
  providerId = ref<string>(''),
  orderNum = ref<number>(0)

/**
 * 通用的单元格合并计算函数（支持多层级分组）
 * @param rowIndex 当前行索引
 * @param currentValue 当前单元格的值
 * @param field 要合并的字段名
 * @param groupFields 分组字段数组，按优先级从高到低排列
 * @returns 合并的行数
 */
const calculateRowSpan = (
  rowIndex: number,
  currentValue: any,
  field: string,
  groupFields?: string[]
): number => {
  let rowSpan = 1
  const dataLength = tableData.value.length
  const currentRow = tableData.value[rowIndex]

  for (let i = rowIndex + 1; i < dataLength; i++) {
    const nextRow = tableData.value[i]

    // 检查当前字段值是否相同
    const isSameValue = currentValue === nextRow[field]

    // 检查所有分组字段是否都相同
    let isSameGroup = true
    if (groupFields && groupFields.length > 0) {
      for (const groupField of groupFields) {
        if (currentRow[groupField] !== nextRow[groupField]) {
          isSameGroup = false
          break
        }
      }
    }

    if (isSameValue && isSameGroup) {
      rowSpan++
    } else {
      break
    }
  }

  return rowSpan
}

/**
 * 检查是否应该隐藏单元格（与上一行合并）
 * @param rowIndex 当前行索引
 * @param currentValue 当前单元格的值
 * @param field 要合并的字段名
 * @param groupFields 分组字段数组，按优先级从高到低排列
 * @returns 是否应该隐藏
 */
const shouldHideCell = (
  rowIndex: number,
  currentValue: any,
  field: string,
  groupFields?: string[]
): boolean => {
  if (rowIndex === 0) return false

  const currentRow = tableData.value[rowIndex]
  const prevRow = tableData.value[rowIndex - 1]

  // 检查当前字段值是否与上一行相同
  const isSameValue = prevRow[field] === currentValue

  // 检查所有分组字段是否都与上一行相同
  let isSameGroup = true
  if (groupFields && groupFields.length > 0) {
    for (const groupField of groupFields) {
      if (prevRow[groupField] !== currentRow[groupField]) {
        isSameGroup = false
        break
      }
    }
  }

  return isSameValue && isSameGroup
}

const spanMethod = ({ row, column, rowIndex }: any) => {
  const { property } = column
  const currentValue = row[property]

  // purchaseNo
  if (property === 'purchaseNo') {
    if (shouldHideCell(rowIndex, currentValue, property)) {
      return { rowspan: 0, colspan: 0 }
    }
    return {
      rowspan: calculateRowSpan(rowIndex, currentValue, property),
      colspan: 1
    }
  }

  // goodsNo（货品编号）列：在同一订单号下合并
  if (property === 'goodsNo') {
    if (shouldHideCell(rowIndex, currentValue, property, ['purchaseNo'])) {
      return { rowspan: 0, colspan: 0 }
    }
    return {
      rowspan: calculateRowSpan(rowIndex, currentValue, property, ['purchaseNo']),
      colspan: 1
    }
  }

  // groupNum2（采购总数）列：在同一订单号和货品编号下合并
  if (property === 'groupNum2') {
    const goodsNo = row.goodsNo
    if (shouldHideCell(rowIndex, goodsNo, 'goodsNo', ['purchaseNo'])) {
      return { rowspan: 0, colspan: 0 }
    }
    return {
      rowspan: calculateRowSpan(rowIndex, goodsNo, 'goodsNo', ['purchaseNo']),
      colspan: 1
    }
  }

  // isQualified（检验结果）列：在同一订单号和货品编号下合并
  if (property === 'isQualified') {
    if (shouldHideCell(rowIndex, currentValue, property, ['purchaseNo', 'goodsNo'])) {
      return { rowspan: 0, colspan: 0 }
    }
    return {
      rowspan: calculateRowSpan(rowIndex, currentValue, property, ['purchaseNo', 'goodsNo']),
      colspan: 1
    }
  }

  // 其他列：不合并
  return { rowspan: 1, colspan: 1 }
}
const SupplierEvaluationColumn = computed(() => [
  { field: 'purchaseNo', title: '采购单号' },
  { field: 'goodsNo', title: '货品编号' },
  { field: 'goodsName', title: '货品名称' },
  { field: 'specName', title: '规格名称' },
  { field: 'specCode', title: '规格码' },
  { field: 'barcode', title: '条形码' },
  { field: 'num', title: '采购量' },
  { field: 'groupNum2', title: '采购总数' },
  { field: 'inspectionTime', title: '检验日期' },
  { field: 'isQualified', title: '检验结果' }
])

// const props = defineProps({
//   dicInfo: { type: Array<any>, default: () => [] },
// });

const title = computed(() => '质检详情')

const getTableData = async () => {
  const { inspectionDate } = searchData.value
  const params: Record<string, any> = {
    inspectionTimeBegin: inspectionDate?.length ? inspectionDate[0] : '',
    inspectionTimeEnd: inspectionDate?.length ? inspectionDate[1] : '',
    providerId: providerId.value,
    page: page.value.page,
    size: page.value.size
  }
  loading.value = true
  await request
    .post({ url: `/api/whIncomingInspectionInfo/queryInspectionDetailByCondition`, data: params })
    .then((res: any) => {
      // 数据预处理：计算采购总量
      tableData.value = buildGoodsListFromDetail(res.records || [])
      page.value = { ...page.value, total: res.total }
    })
    .finally(() => {
      loading.value = false
    })
  await request
    .post({
      url: `/api/whIncomingInspectionInfo/queryInspectionDetailTotalNum2ByCondition`,
      data: params
    })
    .then((res: any) => {
      orderNum.value = res
    })
    .finally(() => {
      loading.value = false
    })
}
const handleSizeChange = (size: number) => {
  page.value.size = size
  getTableData()
}
const handleCurrentChange = (pageNo: number) => {
  page.value.page = pageNo
  getTableData()
}
// 弹出通用
const openView = (_item: any = {}, type: string = 'view') => {
  // detailsRef openDialog方法支持前/后置方法入参，无需操作抽屉显隐，内部已处理
  detailsRef?.value?.openDialog(
    async () => {
      viewType.value = type
      providerId.value = _item.providerId
      page.value = { ...new PageItem() }
      getTableData()
    },
    () => {
      nextTick(() => {
        formRef?.value?.clearValidate()
      })
    }
  )
}
const inspectWindowRef = ref<any>()
const handleGoodsNoClick = (row: any) => {
  inspectWindowRef.value?.open?.(row, 'view')
}
const buildGoodsListFromDetail = (detail: any) => {
  let raw: any[] = Array.isArray(detail) ? detail : []
  const groups = new Map<string, { idxs: number[]; sum: number }>()
  const firstDefectsByGoodsNo = new Map<string, any[]>()

  // 分组计算总数
  raw.forEach((it, idx) => {
    const key = String(it?.goodsNo + it?.purchaseNo || '')
    const sumAdd = Number(it?.num2 || 0)
    if (!groups.has(key)) groups.set(key, { idxs: [], sum: 0 })
    const g = groups.get(key)!
    g.idxs.push(idx)
    g.sum += sumAdd

    if (!firstDefectsByGoodsNo.has(key) && Array.isArray(it?.details) && it.details.length) {
      firstDefectsByGoodsNo.set(key, it.details)
    }
  })

  const list: any[] = raw.map((it) => {
    const goodsNo = String(it?.goodsNo || '')
    const purchaseNo = String(it?.purchaseNo || '')
    const g = groups.get(goodsNo + purchaseNo)
    const groupTotal = Number(g?.sum ?? 0)
    const isQualifiedRaw = (it as any)?.isQualified
    const isQualifiedBool =
      isQualifiedRaw === 1 || isQualifiedRaw === '1' || isQualifiedRaw === true
        ? true
        : isQualifiedRaw === 0 || isQualifiedRaw === '0' || isQualifiedRaw === false
          ? false
          : undefined

    // 处理疵点列表
    const defectList = firstDefectsByGoodsNo.get(goodsNo + purchaseNo) || []
    const defects = defectList.map((d: any) => ({
      defectType: String(d?.defectType ?? ''),
      defectQuantity: Number(d?.defectQuantity) || 0
    }))
    const defectMap = defects.reduce((acc: Record<string, number | null>, cur: any) => {
      if (!cur.defectType) return acc
      acc[cur.defectType] = Number(cur.defectQuantity) || 0
      return acc
    }, {})

    const hasSaved =
      it?.inspectionQuantity !== null &&
      it?.inspectionQuantity !== undefined &&
      it?.defectiveQuantity !== null &&
      it?.defectiveQuantity !== undefined

    let form: any = null
    if (hasSaved) {
      form = {
        sampleQty: Number(it?.inspectionQuantity) || 1,
        // 这里需要注意，后端返回 0 也是有效值
        unQualifiedBatches: it?.defectiveBatch ?? 1,
        defectQty:
          it?.defectiveQuantity === null || it?.defectiveQuantity === undefined
            ? null
            : Number(it?.defectiveQuantity),
        goodQty: Number(it?.goodQuantity) || 1,
        arrivalBatches: Number(it?.arrivalBatch) || 1,
        processPlan: String(it?.handlingSolution || ''),
        goodsType: String(it?.productType || ''),
        judgeReason: String(it?.determineReason || ''),
        defects: defectMap
      }
    }

    return {
      detailId: String(it?.id || ''),
      goodsNo,
      goodsName: String(it?.goodsName || ''),
      specName: String(it?.specName || ''),
      specCode: String(it?.specCode || ''),
      brandName: String(it?.brandName || ''),
      barcode: String(it?.barcode || ''),
      num2: Number(it?.num2 || 0),
      groupNum2: '',
      _groupTotal: groupTotal,
      result: isQualifiedBool === true ? '合格' : isQualifiedBool === false ? '不合格' : '',
      groupResult: '',
      _filled: Boolean(it?._filled) || Boolean(hasSaved),
      _inspectData: {
        form,
        defects,
        aql: {
          isQualified: isQualifiedBool,
          ac: it?.ac ?? 0,
          re: it?.re ?? 0,
          sampleSize: Number(it?.inspectionQuantity) || 0
        },
        batchRange: String(it?.batchRange || ''),
        samplingQuantity: Number(it?.samplingQuantity) || null // 强制转换为数字
      },
      _rowspan: 0,
      inspectionTime: String(it?.inspectionTime || ''),
      isQualified: it.isQualified,
      num: Number(it?.num || 0),
      purchaseNo: String(it?.purchaseNo || '')
    } as any
  })
  const firstIndexByGoodsNo = new Map<string, number>()
  list.forEach((row, idx) => {
    if (!firstIndexByGoodsNo.has(row.goodsNo + row.purchaseNo))
      firstIndexByGoodsNo.set(row.goodsNo + row.purchaseNo, idx)
  })
  firstIndexByGoodsNo.forEach((firstIdx, goodsNoPurchaseId) => {
    const g = groups.get(goodsNoPurchaseId)
    if (!g) return
    list[firstIdx].groupNum2 = g.sum
    list[firstIdx]._rowspan = g.idxs.length
  })
  console.log(list)
  return list
  // goodsList.value = list
  // Array.from(groups.keys()).forEach((goodsNo) => refreshGroupResult(goodsNo))
}
defineExpose({ openView })

provide('SupplierEvaluationDetails', { viewType, title })

/**************************************以上文件文件内容非必要不可删除，按需追加使用******************************************************* */
</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
