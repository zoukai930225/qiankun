<template>
  <div class="nodeLeftInfo">
    <CollapsibleFileList
      title="定品资料"
      :npDesignPictureGodownId="reviewDetail.npDesignPictureGodownId"
    >
      <el-button
        v-if="isShowConfirmProductDataExamineDownload"
        :loading="downloadIng"
        style="
          height: 32px;
          width: 100px;
          border-radius: 4px;
          background: #0064ff;
          border: none;
          font-size: 14px;
          font-weight: normal;
          line-height: 18px;
          letter-spacing: 0px;
          color: #ffffff;
        "
        @click="dpFileDownload"
      >
        <div class="row-center" style="margin-left: -12px">
          <img
            style="width: 14px; height: 14px; margin-right: 6px; margin-left: 12px"
            src="@/assets/imgs/fileDownload.svg"
          />
          定品资料
        </div>
      </el-button>
    </CollapsibleFileList>
    <CollapsibleFileList title="销售目标拆解" :list="salesTargetDismantling()" />
    <CollapsibleFileList title="产品参考图" :list="productDiagramReference()" />
    <CollapsibleFileList title="产品定价" :list="productPrice()" />
    <CollapsibleFileList title="市场分析" :list="marketAnalysis()" />
    <CollapsibleFileList title="需求分析" :list="demandAnalysis()" />
    <CollapsibleFileList title="包装图片" :list="unRoutinePackagePictureList()" />
    <CollapsibleFileList title="包装流程图" :list="packageProgressPictureList()" />
    <CollapsibleFileList title="风险评估报告" :list="riskAssessReportList()" />
    <CollapsibleFileList title="报价单" :list="quotationSheetList()" />
    <CollapsibleFileList title="洗唛标识" :list="washLabelList()" />
    <!-- <CollapsibleFileList title="烫唛标识" :list="tmPictureList()" /> -->
    <CollapsibleFileList title="工艺单" :list="workmanshipDataList()" />
    <CollapsibleFileList title="尺寸表" :list="sizeChartList()" />
    <CollapsibleFileList title="纸样" :list="paperSampleList()" />
    <CollapsibleFileList title="面料资质报告" :list="qualificationFileList()" />
    <CollapsibleFileList title="供需单" :list="supplyDocumentList()" />

    <!-- <FileItem title="销售目标拆解" :list="salesTargetDismantling()" /> -->
    <!-- <FileItem title="产品参考图" :list="productDiagramReference()" /> -->
    <!-- <FileItem title="产品定价" :list="productPrice()" /> -->
    <!-- <FileItem title="市场分析" :list="marketAnalysis()" /> -->
    <!-- <FileItem title="需求分析" :list="demandAnalysis()" /> -->

    <!-- <TextInfo title="卖点" :is-html="true" :content="reviewDetail.salePoint" />
    <TextInfo title="选品理由" :content="data.chooseReason" />
    <TextInfo title="货品编码" :content="data.productCode" />
    <TextInfo title="实际上架时间" :is-time="true" :content="data.actualShelfTime" />
    <TextInfo title="商品ID" :content="data.productId" />
    <TextInfo title="实际拍摄时间" :is-time="true" :content="data.shootTime" />
    <FileItem title="其他文件" :list="filterOtherFiles()" /> -->
  </div>
</template>

<script setup lang="ts">
import CollapsibleFileList from './collapsibleFileList.vue'
import { planProductInfoExport } from '@/api/oa/new/plan/index'
import download from '@/utils/download'
const props = defineProps({
  data: {
    type: Object as PropType<any>,
    default: () => ({})
  },
  isShowConfirmProductDataExamineDownload: {
    type: Boolean,
    default: false
  },
  reviewDetail: {
    type: Object as PropType<any>,
    default: () => ({})
  },
  otherFiles: {
    type: Array,
    default: () => []
  }
})

onMounted(() => {
  console.log(props.data, '!!!!!!')
  console.log(props.reviewDetail, '!!!!!!')
})
// 报价单
const quotationSheetList = () => {
  console.log('11111111', props.data.quotationSheet)
  if (props.data && props.data.quotationSheet) {
    return props.data.quotationSheet.split(',').map((item) => {
      return {
        url: item
      }
    })
  }
}

// 包装流程图
const packageProgressPictureList = () => {
  if (props.data && props.data.packageProgressPicture) {
    return props.data.packageProgressPicture.split(',').map((item) => {
      return {
        url: item
      }
    })
  }
}
// 包装图片
const unRoutinePackagePictureList = () => {
  if (props.data && props.data.unRoutinePackagePicture) {
    return props.data.unRoutinePackagePicture.split(',').map((item) => {
      return {
        url: item
      }
    })
  }
}

// 纸样
const paperSampleList = () => {
  if (props.data && props.data.paperSample) {
    return props.data.paperSample.split(',').map((item) => {
      return {
        url: item
      }
    })
  }
}

// 供需单
const supplyDocumentList = () => {
  console.log('55555', props.data.supplyDocument)
  if (props.data && props.data.supplyDocument) {
    return props.data.supplyDocument.split(',').map((item) => {
      return {
        url: item
      }
    })
  }
}

// 面料资质报告
const qualificationFileList = () => {
  if (props.data && props.data.qualificationFile) {
    return props.data.qualificationFile.split(',').map((item) => {
      return {
        url: item
      }
    })
  }
}

// 工艺单
const workmanshipDataList = () => {
  if (props.data && props.data.workmanshipFile) {
    return props.data.workmanshipFile.split(',').map((item) => {
      return {
        url: item
      }
    })
  }
}

// 风险评估报告
const riskAssessReportList = () => {
  if (props.data && props.data.riskAssessReport) {
    return props.data.riskAssessReport.split(',').map((item) => {
      return {
        url: item
      }
    })
  }
}

// 尺码表
const sizeChartList = () => {
  if (props.data && props.data.sizeChart) {
    return props.data.sizeChart.split(',').map((item) => {
      return {
        url: item
      }
    })
  }
}

// 烫唛标识
const tmPictureList = () => {
  if (props.data && props.data.tmPicture) {
    return props.data.tmPicture.split(',').map((item) => {
      return {
        url: item
      }
    })
  }
}

// 水洗标识
const washLabelList = () => {
  if (props.data && props.data.washLabel) {
    return props.data.washLabel.split(',').map((item) => {
      return {
        url: item
      }
    })
  }
}

const salesTargetDismantling = () => {
  if (props.reviewDetail && props.reviewDetail.salesTargetDismantling) {
    return (
      props.reviewDetail.salesTargetDismantling.split(',').map((item) => {
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
  if (props.reviewDetail && props.reviewDetail.productDiagramReference) {
    return (
      props.reviewDetail.productDiagramReference.split(',').map((item) => {
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
  if (props.reviewDetail && props.reviewDetail.productPrice) {
    return (
      props.reviewDetail.productPrice.split(',').map((item) => {
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
  if (props.reviewDetail && props.reviewDetail.marketAnalysis) {
    return (
      props.reviewDetail.marketAnalysis.split(',').map((item) => {
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
  if (props.reviewDetail && props.reviewDetail.demandAnalysis) {
    return (
      props.reviewDetail.demandAnalysis.split(',').map((item) => {
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

const filterOtherFiles = () => {
  let files = []
  props.otherFiles.forEach((item) => {
    if (!isExistMarketOrDemandFile(item.url)) {
      files.push(item)
    }
  })
  return files || []
}

const isExistMarketOrDemandFile = (url) => {
  let marketAnalysisList = marketAnalysis()
  let demandAnalysisList = demandAnalysis()
  let isExist = false
  marketAnalysisList.forEach((item) => {
    let ulr1 = item.url.split('?name=')[0]
    let ulr2 = url.split('?name=')[0]

    if (ulr1 === ulr2) {
      isExist = true
    }
  })
  demandAnalysisList.forEach((item) => {
    let ulr1 = item.url.split('?name=')[0]
    let ulr2 = url.split('?name=')[0]

    if (ulr1 === ulr2) {
      isExist = true
    }
  })
  return isExist
}

const downloadIng = ref(false)
// 定品资料下载
const dpFileDownload = async () => {
  try {
    downloadIng.value = true
    const data = await planProductInfoExport(props.reviewDetail.npDesignPictureGodownId).catch(
      (err: {}) => {
        console.log(err)
      }
    )
    if (data) {
      download.excel(data, '定品资料.xlsx')
    }
  } finally {
    downloadIng.value = false
  }
}
</script>

<style lang="scss" scoped>
.nodeLeftInfo {
  width: 229px;
}
</style>
