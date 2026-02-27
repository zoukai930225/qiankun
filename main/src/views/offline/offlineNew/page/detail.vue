<template>
  <div class="detail-content" v-loading="loading">
    <desc-table
      title="基本信息"
      :list="basicList"
      :data="(dataValue as any).baseInfoDetail || {}"
      showExpand
    ></desc-table>
    <desc-table
      title="打版"
      :list="dbList"
      :data="(dataValue as any).patternMakeDetail || {}"
      showExpand
    ></desc-table>
    <desc-table
      title="样衣"
      :list="yyList"
      :data="(dataValue as any).sampleDetail || {}"
      showExpand
    ></desc-table>
    <desc-table
      title="齐色样"
      :list="qsyList"
      :data="(dataValue as any).colorSampleConfirmDetail || {}"
      showExpand
    ></desc-table>
    <desc-table
      title="工艺包"
      :list="gybList"
      :data="(dataValue as any).techPackageDetail || {}"
      showExpand
    ></desc-table>
    <desc-table
      title="生产报价"
      :list="scbjList"
      :data="(dataValue as any).productQuotationDetail || {}"
      showExpand
    ></desc-table>
    <desc-table
      title="产前批版"
      :list="cqpbList"
      :data="(dataValue as any).preProductionDetail || {}"
      showExpand
    ></desc-table>
  </div>
</template>

<script lang="ts" setup>
import descTable from '../components/descTable.vue'
import { FormDescription, FormDescriptionItem } from '@/components/Descriptions'
import request from '@/config/axios'
const route = useRoute()
const baseInfoId = route?.params?.id || ''
const basicList = [
  // [
  {
    fieldName: '品名',
    fieldValue: '',
    fieldKey: 'productName'
  },
  {
    fieldName: '样衣款号',
    fieldValue: '',
    fieldKey: 'sampleGarmentStyleNumber'
  },
  {
    fieldName: '规格码',
    fieldValue: '',
    fieldKey: 'specSizeCode'
  },
  {
    fieldName: '货品编码',
    fieldValue: '',
    fieldKey: 'productCode'
  },
  {
    fieldName: '款式图',
    fieldValue: '',
    fieldKey: 'styleChart',
    span: 4
  },
  {
    fieldName: '合格证品名',
    fieldValue: '',
    fieldKey: 'certificateProductName'
  },
  {
    fieldName: '品类',
    fieldValue: '',
    fieldKey: 'categoryName'
  },
  {
    fieldName: '面料成分',
    fieldValue: '',
    fieldKey: 'fabricComposition'
  },
  {
    fieldName: '面料规格',
    fieldValue: '',
    fieldKey: 'fabricSpecification'
  },
  {
    fieldName: '面料供应商',
    fieldValue: '',
    fieldKey: 'fabricSupplierName'
  },
  {
    fieldName: '预计上新日期',
    fieldValue: '',
    fieldKey: 'estimatedLaunchDate'
  },
  {
    fieldName: '执行标准',
    fieldValue: '',
    fieldKey: 'executionStandards',
    dictCode: 'EXECUTION_STANDARDS'
  },
  {
    fieldName: '安全类别',
    fieldValue: '',
    fieldKey: 'securityCategory',
    dictCode: 'SECURITY_CATEGORY'
  },
  {
    fieldName: '规格名称',
    fieldValue: '',
    fieldKey: 'specName',
    span: 4
  }
]

const dbList = [
  {
    fieldName: '版师',
    fieldValue: '',
    fieldKey: 'patternMakers',
    labelBg: 'red'
  },
  {
    fieldName: '分配时间',
    fieldValue: '',
    fieldKey: 'distributeDate',
    span: 3
  },
  {
    fieldName: '版本明细',
    fieldValue: '',
    fieldKey: 'offlineNpPatternConfirmDetailList',
    span: 4
  }
]

const yyList = [
  {
    fieldName: '样工',
    fieldValue: '',
    fieldKey: 'sampleWorkers',
    labelBg: 'red'
  },
  {
    fieldName: '分配时间',
    fieldValue: '',
    fieldKey: 'distributeDate',
    span: 3
  },
  {
    fieldName: '版本明细',
    fieldValue: '',
    fieldKey: 'offlineNpSampleConfirmDetailList',
    span: 4
  },
  {
    fieldName: '审核结果',
    fieldValue: '',
    fieldKey: 'auditRecords',
    span: 4
  }
]

const qsyList = [
  {
    fieldName: '确认时间',
    fieldValue: '',
    fieldKey: 'confirmDate',
    span: 4
  },

  {
    fieldName: '备注',
    fieldValue: '',
    fieldKey: 'remark',
    span: 4
  },
  {
    fieldName: '附件',
    fieldValue: '',
    fieldKey: 'attachmentUrl',
    span: 4
  }
]

const gybList = [
  {
    fieldName: '纸样',
    fieldValue: '',
    fieldKey: 'paperAttachmentUrl',
    span: 4
  },
  {
    fieldName: '纸样备注',
    fieldValue: '',
    fieldKey: 'paperRemark',
    span: 4
  },
  {
    fieldName: '工艺单',
    fieldValue: '',
    fieldKey: 'technicalAttachmentUrl',
    span: 4
  },
  {
    fieldName: '工艺单备注',
    fieldValue: '',
    fieldKey: 'technicalRemark',
    span: 4
  }
]

const scbjList = [
  {
    fieldName: '供应商',
    fieldValue: '',
    fieldKey: 'supplierName',
    span: 2
  },
  {
    fieldName: '工厂接单日期',
    fieldValue: '',
    fieldKey: 'factoryReceivingDate'
  },
  {
    fieldName: '首单日期',
    fieldValue: '',
    fieldKey: 'firstOrderDate'
  },
  {
    fieldName: '报价单',
    fieldValue: '',
    fieldKey: 'quotation',
    span: 4
  },
  {
    fieldName: '规格',
    fieldValue: '',
    fieldKey: 'skuDetails',
    span: 4
  }
]

const cqpbList = [
  {
    fieldName: '产前样上传时间',
    fieldValue: '',
    fieldKey: 'prenatalSampleConfirmDate',
    span: 4
  },

  {
    fieldName: '产前样报告',
    fieldValue: '',
    fieldKey: 'prenatalSampleAttachmentUrl',
    span: 4
  },

  {
    fieldName: '产前样备注',
    fieldValue: '',
    fieldKey: 'prenatalSampleRemark',
    span: 4
  },

  {
    fieldName: '首八件上传时间',
    fieldValue: '',
    fieldKey: 'firstEightConfirmDate',
    span: 4
  },

  {
    fieldName: '首八件报告',
    fieldValue: '',
    fieldKey: 'firstEightAttachmentUrl',
    span: 4
  },

  {
    fieldName: '首八件备注',
    fieldValue: '',
    fieldKey: 'firstEightRemark',
    span: 4
  }
]

const dataValue = ref({}),
  loading = ref(false)
const detail = async (id) => {
  try {
    loading.value = true
    const res = await request.get({ url: `/api/offline/np/base/detail/${id}`, params: {} })
    if (res) {
      dataValue.value = res
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!baseInfoId) return
  detail(baseInfoId)
})
</script>

<style lang="scss" scoped>
.detail-content {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 0 20px 20px 20px;
  min-width: 1150px;
}
</style>
