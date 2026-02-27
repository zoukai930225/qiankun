<template>
  <div class="suppierLeft">
    <div class="row-center" style="margin-bottom: 20px">
      <div style="background: #0064ff; width: 3px; height: 10px"></div>
      <div
        style="
          font-size: 14px;
          font-weight: 600;
          line-height: 20px;
          color: #333333;
          padding-left: 6px;
        "
        >企划信息</div
      >
    </div>
    <TextInfo title="企划名称" :content="data && data.planName" />
    <TextInfo title="企划类型" :content="planType()" />
    <TextInfo title="店铺" :content="data && data.storeName" />
    <TextInfo
      title="企划时间"
      :is-time="true"
      :content="`${data?.planStartTime}-${data?.planEndTime}`"
    />
    <TextInfo title="计划下单日期" :is-time="true" :content="`${data?.planOrderDate}`" />
    <!-- 
    <TextInfo title="目标客群" :content="data && data.targetAudience" />
    <TextInfo title="竞品链接" :isLink="true" :content="data && data.competitionLink" />
    <TextInfo title="销售目标季度" :content="data && data.salesTargetQuarter" />
  
    <TextInfo title="预计拍摄日期" :is-time="true" :content="data && data.estimatedShootingDate" />

    <TextInfo title="大货到仓日期" :is-time="true" :content="data && data.goodsToWarehouseDate" />
    <TextInfo title="产品等级" :content="productLevel()" />

    <FileItem title="销售目标拆解" :list="salesTargetDismantling()" />
    <FileItem title="产品参考图" :list="productDiagramReference()" />
    <FileItem title="产品定价" :list="productPrice()" />

    <FileItem title="市场分析" :list="marketAnalysis()" />
    <FileItem title="需求分析" :list="demandAnalysis()" />
    <TextInfo title="风险点" :content="data && data.productRisk" />
    <TextInfo title="产品需求" :content="(data && data.remark) || '--'" /> -->
  </div>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getDictLabel } from '@/utils/dict'
import TextInfo from '@/views/OA/new/product/components/displayInfo/textInfo.vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  },
  categoryList: {
    type: Array,
    default: () => []
  }
})

const planType = () => {
  if (props.data) {
    return getDictLabel(DICT_TYPE.NP_ENTERPRISE_PLANTYPE, Number(props.data.planType || ''))
  }
  return '--'
}

const productLevel = () => {
  if (props.data) {
    if (props.data.isCore) {
      return getDictLabel(DICT_TYPE.NP_PRODUCTGRADE, props.data.isCore) || '--'
    }
  }
  return '--'
}

const salesTargetDismantling = () => {
  if (props.data && props.data.salesTargetDismantling) {
    return (
      props.data.salesTargetDismantling.split(',').map((item) => {
        let array = item.split('?name=')
        return {
          name: array[1],
          url: array[0]
        }
      }) || []
    )
  }
  return []
}

const productDiagramReference = () => {
  if (props.data && props.data.productDiagramReference) {
    return (
      props.data.productDiagramReference.split(',').map((item) => {
        let array = item.split('?name=')
        return {
          name: array[1],
          url: array[0]
        }
      }) || []
    )
  }
  return []
}

const productPrice = () => {
  if (props.data && props.data.productPrice) {
    return (
      props.data.productPrice.split(',').map((item) => {
        let array = item.split('?name=')
        return {
          name: array[1],
          url: array[0]
        }
      }) || []
    )
  }
  return []
}

const marketAnalysis = () => {
  if (props.data && props.data.marketAnalysis) {
    return (
      props.data.marketAnalysis.split(',').map((item) => {
        let array = item.split('?name=')
        return {
          name: array[1],
          url: array[0]
        }
      }) || []
    )
  }
  return []
}

const demandAnalysis = () => {
  if (props.data && props.data.demandAnalysis) {
    return (
      props.data.demandAnalysis.split(',').map((item) => {
        let array = item.split('?name=')
        return {
          name: array[1],
          url: array[0]
        }
      }) || []
    )
  }
  return []
}
</script>

<style lang="less" scoped>
.suppierLeft {
}
</style>
