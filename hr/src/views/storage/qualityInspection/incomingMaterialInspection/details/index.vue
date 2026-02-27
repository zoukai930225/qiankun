<template>
  <scheme-details ref="detailsRef" name="IncomingMaterialInspection" :width="1000">
    <template #card>
      <FormContentLayout :layouts="layouts" class="incoming-material-inspection-details">
        <template #basicInfo>
          <FormDescription :column="3" label-width="110px">
            <FormDescriptionItem label="采购单号">
              {{ dataValue.purchaseNo || '-' }}
            </FormDescriptionItem>
            <FormDescriptionItem label="供应商">
              {{ dataValue.providerName || '-' }}
            </FormDescriptionItem>

            <FormDescriptionItem label="货品分类">
              {{ productClassMap[Number(dataValue.productClass)]?.label || '-' }}
            </FormDescriptionItem>

            <FormDescriptionItem label="采购量">
              {{ dataValue.num2 ?? '-' }}
            </FormDescriptionItem>
            <FormDescriptionItem label="跟单员">
              {{ dataValue.purchaserName || '-' }}
            </FormDescriptionItem>
            <FormDescriptionItem label="来货日期">
              {{ dataValue.checkTime || '-' }}
            </FormDescriptionItem>
          </FormDescription>
        </template>

        <template #goodsInfo>
          <scheme-table
            :name="goodsTableName"
            :show-screen="false"
            :is-operate="false"
            :is-selection="false"
            :is-index="true"
            border="border"
            size="small"
            :table-props="{ 'span-method': goodsSpanMethod }"
            :column="goodsColumns"
            :table-data="goodsList"
            :list-name="'货品信息'"
          />
        </template>

        <template #inspectInfo>
          <el-form
            ref="formRef"
            :model="dataValue"
            label-width="80px"
            class="inspect-form"
            :disabled="isView"
          >
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item label="验货QC" prop="inspectionQc">
                  <el-input v-model="dataValue.inspectionQc" placeholder="请输入" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="质检员" prop="inspectionUser">
                  <el-input v-model="dataValue.inspectionUser" placeholder="请输入" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="备注" prop="inspectionRemark">
              <s-textarea
                :disabled="isView"
                v-model="dataValue.inspectionRemark"
                :autosize="{ minRows: 2, maxRows: 4 }"
                placeholder="请输入备注"
              />
            </el-form-item>
          </el-form>
        </template>
      </FormContentLayout>
    </template>
    <template #button>
      <el-button @click="detailsRef?.close()" :disabled="loading">取消</el-button>
      <el-button
        v-if="isInspect"
        type="primary"
        @click="submitForm"
        :disabled="loading"
        :loading="loading"
      >
        提交
      </el-button>
    </template>
  </scheme-details>

  <InspectWindow ref="inspectWindowRef" @confirm="handleInspectConfirm" />
</template>

<script lang="tsx">
export default { name: 'IncomingMaterialInspectionDetails' }
</script>

<script lang="tsx" setup>
import { viewTypeCheck } from '@/components/template/config/index'
import { cloneDeep } from 'lodash-es'
import { DataItem } from '../page/config'
import FormContentLayout from '@/layout/components/ContentLayout'
import { FormDescription, FormDescriptionItem } from '@/components/Descriptions'
import { ElLink, ElTag } from 'element-plus'
import { PageItem } from '@/components/template/config/type'
import InspectWindow from './window.vue'
import { checkQuality, getBatchRangeText } from '../utils/aql'
import {
  getIncomingInspectionDetail,
  submitIncomingInspection
} from '@/api/storage/qualityInspection/incomingMaterialInspection'
import Tag from '@/components/common/tag/tag.vue' // 引入 Tag 组件

// 1. 修改 productClassMap，增加 type 定义
const productClassMap: Record<number, { label: string; type: 'success' | 'info' }> = {
  0: { label: '半成品', type: 'info' }, // 半成品 -> info
  1: { label: '成品', type: 'success' } // 成品 -> success
}

const emit = defineEmits<{
  (e: 'submitted'): void
}>()

const detailsRef = ref<any>(),
  formRef = ref(),
  dataValue = ref<DataItem>({ ...new DataItem() }),
  bukValue = ref<DataItem>({ ...new DataItem() }),
  viewType = ref<string>('view'),
  loading = ref<boolean>(false)

const title = computed(() => viewTypeCheck(viewType.value, [{ type: 'inspect', label: '检验' }]))

const message = useMessage()
const isView = computed(() => viewType.value === 'view')
const isInspect = computed(() => viewType.value === 'inspect')
const hasChecked = computed(() => dataValue.value.inspectionStatus !== 0)

const goodsTableName = 'IncomingMaterialInspectionGoods'

const layouts = computed(() => {
  const base: any[] = [
    { label: '基本信息', key: 'basicInfo' },
    {
      label: '货品信息',
      key: 'goodsInfo',
      right: () => <span class="goods-total">合计：{goodsTotal.value}</span>
    }
  ]
  if (hasChecked.value || isInspect.value) base.push({ label: '检验信息', key: 'inspectInfo' })
  return base
})

type GoodsRow = {
  detailId: string
  goodsNo: string
  goodsName: string
  specName: string
  specCode: string
  brandName: string
  barcode: string
  num2: number
  groupNum2?: number | string
  /** 同 goodsNo 汇总后的采购总数，用于 AQL/抽检数量 */
  _groupTotal?: number
  /** 单行结果（规格行），用于内部计算 */
  result?: '合格' | '不合格' | ''
  /** 分组结果（同 goodsNo 合并展示） */
  groupResult?: '合格' | '不合格' | ''
  _filled?: boolean
  _inspectData?: any
  _rowspan?: number
}

const goodsList = ref<GoodsRow[]>([])
const goodsTotal = computed(() => {
  return goodsList.value.reduce((sum, row) => sum + (Number(row.groupNum2) || 0), 0)
})

const goodsSpanMethod = ({
  row,
  column
}: {
  row: GoodsRow
  column: { property: string }
  rowIndex: number
  columnIndex: number
}) => {
  const mergeFields = ['goodsNo', 'groupNum2', 'groupResult', 'inspectAction']

  if (mergeFields.includes(column.property)) {
    const rowspan = Number(row?._rowspan || 0)
    return rowspan > 0 ? { rowspan, colspan: 1 } : { rowspan: 0, colspan: 0 }
  }
  return { rowspan: 1, colspan: 1 }
}

const resultTagMap: Record<'合格' | '不合格', { label: string; type: 'success' | 'danger' }> = {
  合格: { label: '合格', type: 'success' }, // 合格 -> success
  不合格: { label: '不合格', type: 'danger' } // 不合格 -> danger
}

const goodsColumns = computed(() => {
  const cols: any[] = [
    {
      field: 'goodsNo',
      title: '货品编号',
      minWidth: 110,
      isCustom: true,
      customRender: (row: GoodsRow) => (
        <ElLink
          underline={false}
          type="primary"
          onClick={() => inspectWindowRef.value?.open?.(row, 'view')}
        >
          {row.goodsNo || '-'}
        </ElLink>
      )
    },
    { field: 'goodsName', title: '货品名称', minWidth: 120, showOverflowTooltip: true },
    { field: 'specName', title: '规格名称', width: 110, showOverflowTooltip: true },
    { field: 'specCode', title: '规格码', width: 90 },
    { field: 'brandName', title: '品牌', width: 80 },
    { field: 'barcode', title: '条形码', width: 110 },
    { field: 'num2', title: '采购量', width: 90 },
    { field: 'groupNum2', title: '采购总数', width: 90 },
    {
      field: 'groupResult',
      title: '结果',
      width: 100,
      fixed: 'right',
      isCustom: true,
      customRender: (row: GoodsRow) => {
        if (!row.groupResult) return <span class="result-text">-</span>

        const conf = resultTagMap[row.groupResult]
        // 如果有配置则显示 Tag，否则显示文本
        return conf ? <Tag type={conf.type}>{conf.label}</Tag> : <span class="result-text">-</span>
      }
    }
  ]

  // 只有检验模式（点击“检验”按钮打开）才展示“操作列/填写/编辑”
  if (isInspect.value) {
    cols.push({
      field: 'inspectAction',
      title: '检验信息',
      width: 90,
      fixed: 'right',
      isCustom: true,
      customRender: (row: GoodsRow) => (
        <ElLink underline={false} type="primary" onClick={() => editGoods(row)}>
          {row._filled ? '编辑' : '填写'}
        </ElLink>
      )
    })
  }

  return cols
})

const refreshGroupResult = (goodsNo: string) => {
  const rows = goodsList.value.filter((r) => r.goodsNo === goodsNo)
  if (!rows.length) return

  // 有任一行不合格 => 分组不合格；全部填写完且都合格 => 分组合格；否则空
  const anyBad = rows.some((r) => r._filled && r._inspectData?.aql?.isQualified === false)
  const allFilled = rows.every((r) => r._filled && r._inspectData?.form)
  const groupResult: GoodsRow['groupResult'] = anyBad ? '不合格' : allFilled ? '合格' : ''

  // 只在分组首行（rowspan>0）显示，其他行留空
  rows.forEach((r) => (r.groupResult = ''))
  const first = rows.find((r) => Number(r._rowspan || 0) > 0) || rows[0]
  first.groupResult = groupResult
}

const buildGoodsListFromDetail = (detail: any) => {
  let raw: any[] = Array.isArray(detail?.details) ? detail.details : []

  // 排序确保合并单元格正确
  raw = raw.sort((a, b) => {
    const ga = String(a?.goodsNo || '')
    const gb = String(b?.goodsNo || '')
    return ga.localeCompare(gb)
  })

  const groups = new Map<string, { idxs: number[]; sum: number }>()
  const firstDefectsByGoodsNo = new Map<string, any[]>()

  // 分组计算总数
  raw.forEach((it, idx) => {
    const key = String(it?.goodsNo || '')
    const sumAdd = Number(it?.num2 || 0)
    if (!groups.has(key)) groups.set(key, { idxs: [], sum: 0 })
    const g = groups.get(key)!
    g.idxs.push(idx)
    g.sum += sumAdd

    if (!firstDefectsByGoodsNo.has(key) && Array.isArray(it?.details) && it.details.length) {
      firstDefectsByGoodsNo.set(key, it.details)
    }
  })

  const list: GoodsRow[] = raw.map((it) => {
    const goodsNo = String(it?.goodsNo || '')
    const g = groups.get(goodsNo)
    const groupTotal = Number(g?.sum ?? 0)

    const isQualifiedRaw = (it as any)?.isQualified
    const isQualifiedBool =
      isQualifiedRaw === 1 || isQualifiedRaw === '1' || isQualifiedRaw === true
        ? true
        : isQualifiedRaw === 0 || isQualifiedRaw === '0' || isQualifiedRaw === false
          ? false
          : undefined

    // 处理疵点列表
    const defectList = firstDefectsByGoodsNo.get(goodsNo) || []
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

    let form = null
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
      _rowspan: 0
    } as GoodsRow
  })

  // 计算 Rowspan
  const firstIndexByGoodsNo = new Map<string, number>()
  list.forEach((row, idx) => {
    if (!firstIndexByGoodsNo.has(row.goodsNo)) firstIndexByGoodsNo.set(row.goodsNo, idx)
  })
  firstIndexByGoodsNo.forEach((firstIdx, goodsNo) => {
    const g = groups.get(goodsNo)
    if (!g) return
    list[firstIdx].groupNum2 = g.sum
    list[firstIdx]._rowspan = g.idxs.length
  })

  goodsList.value = list
  Array.from(groups.keys()).forEach((goodsNo) => refreshGroupResult(goodsNo))
}

const goodsPage = ref<PageItem>({ ...new PageItem(), page: 1, size: 9999, total: 0 })
const goodsSearchData = ref<any>({})
const goodsStateInfo = ref<any>({})
const goodsLoading = ref<boolean>(false)

provide(`${goodsTableName}Form`, {
  searchData: goodsSearchData,
  page: goodsPage,
  loading: goodsLoading,
  stateInfo: goodsStateInfo,
  dataList: goodsList as any,
  selectRows: ref([]),
  setParamsData: () => ({}),
  onSearch: () => {},
  resetForm: () => {},
  viewDetails: () => {},
  onButtonClick: () => {},
  onCurrentChange: () => {},
  customTrigger: () => {},
  customSort: () => {}
})

const openView = (item: any = {}, type: string = 'view') => {
  detailsRef?.value?.openDrawer(
    async () => {
      viewType.value = type
      dataValue.value = { ...new DataItem(), ...item }
      if (item?.id) {
        const res = await getIncomingInspectionDetail(item.id)
        dataValue.value = { ...new DataItem(), ...res }
        buildGoodsListFromDetail(res)
      } else {
        goodsList.value = []
      }
      bukValue.value = cloneDeep({ ...dataValue.value })
    },
    () => {
      nextTick(() => {
        formRef?.value?.clearValidate()
      })
    }
  )
}

const editGoods = (row: GoodsRow) => {
  inspectWindowRef.value?.open?.(row)
}

const inspectWindowRef = ref<any>()

const handleInspectConfirm = (payload: { row: GoodsRow; data: any }) => {
  const targetGoodsNo = payload.row.goodsNo
  const targetRows = goodsList.value.filter((r) => r.goodsNo === targetGoodsNo)

  const defectQty = Number(payload?.data?.form?.defectQty) || 0
  const totalQty = Number(payload.row._groupTotal || payload.row.groupNum2 || payload.row.num2) || 0

  try {
    const res = checkQuality(totalQty, defectQty, 2.5)

    targetRows.forEach((row) => {
      row.result = res.isQualified ? '合格' : '不合格'
      row._filled = true
      row._inspectData = {
        ...payload.data,
        aql: res,
        batchRange: getBatchRangeText(totalQty),
        samplingQuantity: res.sampleSize // 确保为数字
      }
    })

    refreshGroupResult(targetGoodsNo)
  } catch (e) {
    console.error(e)
    targetRows.forEach((row) => {
      row.result = ''
    })
  }
}

const submitForm = async () => {
  loading.value = true
  try {
    if (viewType.value === 'view') return

    const inspectionQc = String(dataValue.value.inspectionQc || '').trim()
    const inspectionUser = String(dataValue.value.inspectionUser || '').trim()
    // if (!inspectionQc || !inspectionUser) {
    //   message.warning('请填写完整')
    //   return
    // }

    const rows = goodsList.value || []
    const notFilled = rows.some((r) => !r?._filled || !r?._inspectData?.form)
    if (rows.length > 0 && notFilled) {
      message.warning('请填写完整')
      return
    }

    const items = rows.map((r) => {
      const form = r._inspectData?.form || {}
      const aql = r._inspectData?.aql || {}
      const defects = Array.isArray(r._inspectData?.defects) ? r._inspectData.defects : []
      const isQualifiedBool =
        aql?.isQualified === true ? true : aql?.isQualified === false ? false : undefined

      // 核心修复：使用 ?? 运算符，防止 0 被转化为 1
      return {
        detailId: r.detailId,
        goodsNo: r.goodsNo,
        inspectionQuantity: Number(form.sampleQty) || 0,
        defectiveBatch: form.unQualifiedBatches ?? 0, // 允许提交 0
        defectiveQuantity: Number(form.defectQty) || 0,
        goodQuantity: Number(form.goodQty) || 0,
        handlingSolution: String(form.processPlan || ''),
        productType: String(form.goodsType || ''),
        arrivalBatch: form.arrivalBatches ?? 1, // 允许提交 0，虽然通常至少为1
        determineReason: String(form.judgeReason || ''),
        ac: Number(aql.ac) || 0,
        re: Number(aql.re) || 0,
        batchRange: String(r._inspectData?.batchRange || ''),
        samplingQuantity: Number(r._inspectData?.samplingQuantity) || 0, // 确保是整数
        // 是否合格（0：不合格；1：合格）
        isQualified: isQualifiedBool === true ? 1 : isQualifiedBool === false ? 0 : null,
        defects: defects.map((d: any) => ({
          defectType: String(d?.defectType || ''),
          defectQuantity: Number(d?.defectQuantity) || 0
        }))
      }
    })

    await submitIncomingInspection({
      id: dataValue.value.id,
      inspectionQc,
      inspectionUser,
      inspectionRemark: String(dataValue.value.inspectionRemark || ''),
      items
    })

    message.success('提交成功')
    bukValue.value = cloneDeep({ ...dataValue.value })
    emit('submitted')
    detailsRef?.value?.close()
  } catch {
    //
  } finally {
    loading.value = false
  }
}

defineExpose({ openView })

provide('IncomingMaterialInspectionDetails', { dataValue, bukValue, viewType, title, loading })
</script>

<style lang="scss" scoped>
@use './styles.scss';
</style>
