<template>
  <div ref="cardRef" style="height: 100%">
    <!-- <el-scrollbar> -->
    <div :class="[isDetail ? 'card' : 'card-add']" style="margin-bottom: 16px">
      <div
        :class="isDetail ? 'detail-header' : 'header'"
        style="display: flex; align-items: center; justify-content: space-between"
      >
        <CardTitle :title="'基本信息'" />
        <el-button link @click="isExpand = !isExpand" type="primary">
          <el-icon class="el-icon--right" style="padding-right: 4px">
            <component :is="!isExpand ? 'ArrowDown' : 'ArrowUp'" />
          </el-icon>
          {{ txt }}
        </el-button>
      </div>
      <div
        class="inner"
        :style="isDetail ? 'padding: 0 20px;border-top: 0;' : 'padding: 20px;border-top: solid #f0f0f0 1px;'"
        v-if="isExpand"
      >
        <form-description :column="2">
          <form-description-item label="品类">
            {{ model?.completeCategoryName || '-' }}
          </form-description-item>
          <form-description-item label="企划时间">
            {{ formatTime(model.planTime, 'yyyy-MM-dd HH:mm:ss') }}
          </form-description-item>
          <form-description-item label="面料名称">
            {{ model.fabricName || '-' }}
          </form-description-item>
          <form-description-item label="季度企划">
            {{ model.planQuarter || '-' }}
          </form-description-item>
          <form-description-item :span="2" label="分类">
            {{ render(model.fabricClassification) }}
          </form-description-item>
          <form-description-item :span="2" label="适用类型">
            {{ model.applicableType || '-' }}
          </form-description-item>
        </form-description>
      </div>
    </div>
    <div :class="[isDetail ? 'card' : 'card-body']">
      <div :class="isDetail ? 'detail-header new-padding' : 'header'">
        <CardTitle :title="'进度详情'" />
        <div class="btn">
          <el-select v-model="dataValue.inProgress" style="width: 100px" @change="getDataInfo">
            <el-option label="流程中" :value="true" />
            <el-option label="已淘汰" :value="false" />
          </el-select>
        </div>
      </div>
      <div :style="isDetail ? 'padding: 0px 18px 12px 20px;' : 'padding: 20px 19px 0 18px;'">
        <div
          v-loading="loading"
          :style="{
            // padding: '0px 0 12px 5px',
            // height: isDetail ? `calc(100vh - 441px)` : `calc(100vh - 405px)`
          }"
        >
          <div class="card_body" v-if="dataValue.list?.length !== 0">
            <progress-detail
              :isExpand="isExpand"
              :isDetail="isDetail"
              :list="dataValue.list"
              @refres-list="getDataInfo"
              @refres-data="refresData"
              :progressFinshed="progressFinshed"
            />
          </div>
          <div
            class="flex-column empty"
            :style="{
              padding: '12px 0 12px 5px',
              height: isDetail ? `calc(100vh - 441px)` : `calc(100vh - 405px)`
            }"
            v-else
          >
            <img class="empty-table" src="@/assets/imgs/promotion/empty.png" alt="" />
            <span style="color: #999999; font-size: 14px">暂无数据</span>
          </div>
        </div>
      </div>
    </div>
    <!-- </el-scrollbar> -->
  </div>
</template>

<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import { useFabricClassification } from '../hooks/useFabricClassification'
import progressDetail from './progressDetail.vue'
import * as fabricDevelopmentApi from '@/api/supplier/fabricManagement/fabricDevelopment'
import asyncWrapper from '@/utils/asyncWrapper'
import FormDescription from '@/components/Descriptions/src/FormDescription.vue'
import FormDescriptionItem from '@/components/Descriptions/src/FormDescriptionItem.vue'
const [initOptions, render] = useFabricClassification()
import { formatTime } from '@/utils'
const categoryOptions = getIntDictOptions(DICT_TYPE.FABRIC_CATEGORY, true)
const message = useMessage()

type propsType = {
  id: string
  detailData: object
  isDetail: boolean
}
const progressFinshed = ref(false)

const emit = defineEmits(['refresData'])

const props = defineProps<propsType>()
progressFinshed.value = (props?.detailData as any)?.currentNodeName === '已完成'
const model: any = ref({
  fabricClassification: '',
  planTime: '',
  fabricName: '',
  planQuarter: '',
  category: '',
  fabricId: '',
  applicableType: ''
})
const dataValue = ref<any>({ inProgress: true, list: [] })
const loading = ref(false)

const getFileList = (list) => {
  const list1 = list.fabricComponent ? list.fabricComponent.split(',') : []
  const list2 = list.fabricPrice ? list.fabricPrice.split(',') : []
  const list3 = list.reportFile ? list.reportFile.split(',') : []
  return [...list1, ...list2, ...list3]
}

const getDataInfo = async () => {
  loading.value = true
  const [data, error] = await asyncWrapper(
    fabricDevelopmentApi.progressList({
      fabricId: props.id,
      inProgress: dataValue.value.inProgress
    })
  )

  if (!error) {
    dataValue.value.list = data
    // dataValue.value.list.forEach((list) => {
    //   list.fabricSupplierAuditRecordList.forEach((subList) => {
    //     subList.fileList = []
    //     if (subList.flowStatus === 1) {
    //       subList.fileList = getFileList(list)
    //       subList.remark = list.reportContent
    //     } else {
    //       subList.fileList = subList.attachmentUrl ? subList.attachmentUrl.split(',') : []
    //     }
    //   })
    // })
  }
  loading.value = false
}

const beforCancel = () => {
  return true
}

const isExpand = ref(false)
const txt = computed(() => (isExpand.value ? '收起' : '展开'))

onMounted(async () => {
  initOptions()
  model.value = { ...props.detailData }
  getDataInfo()
})

const refresData = () => emit('refresData')

const submit = async () => {}

defineExpose({ submit, beforCancel })
</script>

<style scoped lang="scss">
@use '@/views/OA/factory/style/card.scss';

.card-add {
  // padding: 0 20px 20px 20px;
  background-color: #fff;
  border-radius: 10px;
  .header {
    padding: 16px 20px 16px 25px;
    box-sizing: border-box;
  }
}

.detail-header {
  width: 100%;
  padding: 16px 25px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &.new-padding {
    padding: 0 20px 16px 25px;
  }
}

.card-body {
  background-color: #fff;
  border-radius: 10px;
  .header {
    padding: 10px 20px 10px 25px;
    box-sizing: border-box;
    border-bottom: solid #f0f0f0 1px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.card_body {
  // padding: 0 20px;
  width: 100%;
  overflow-x: auto;
  display: inline-flex;

  .card_flex {
    width: 260px;
    margin-right: 20px;
  }
}

.el-form-item {
  margin: 0 10px 20px 0 !important;
}

.tips {
  display: inline-flex;
  margin-left: 18px;
  color: #eb3737;
  font-size: 14px;
  font-weight: 400;

  span {
    display: inline-block;
    padding-left: 5px;
  }
}

.empty {
  .empty-table {
    margin: 10px auto;
  }

  span {
    text-align: center;
  }
}
</style>
