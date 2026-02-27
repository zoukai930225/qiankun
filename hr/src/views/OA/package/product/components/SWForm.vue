<!--
 * @Date: 2025-01-03 16:22:21
-->
<template>
  <div>
    <el-form :inline="true" :model="formInline" label-width="100px">
      <div class="flex-row form-wapper">
        <div style="flex-wrap: wrap; flex: 1" class="flex-row">
          <el-form-item label="计划上架日期" prop="planListDate">
            <!-- 计划上架月份-->
            <search-time
              ref="timeRef"
              v-model="formInline.planListDate"
              style="width: 220px"
              placeholder="请选择计划上架日期"
              :layout="'日,周,月'"
              @change="onSubmit"
            />
          </el-form-item>
          <el-form-item label="企划类型:" prop="planType">
            <el-select
              v-model="formInline.planType"
              placeholder="请选择企划类型"
              style="width: 220px"
            >
              <el-option label="计划" value="0" />
              <el-option label="临时" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="企划名称:" prop="planName">
            <el-input
              v-model="formInline.planName"
              placeholder="请输入企划名称"
              style="width: 220px"
            />
          </el-form-item>
          <el-form-item label="系列:" prop="series">
            <el-input v-model="formInline.series" placeholder="请输入系列" style="width: 220px" />
          </el-form-item>
          <el-form-item label="货品编码:" prop="productCode" v-if="showMore">
            <el-input
              v-model="formInline.productCode"
              placeholder="请输入货品编码"
              style="width: 220px"
            />
          </el-form-item>
          <el-form-item label="任务编码:" prop="taskCode" v-if="showMore">
            <el-input
              v-model="formInline.taskCode"
              placeholder="请输入任务编码"
              style="width: 220px"
            />
          </el-form-item>
          <el-form-item label="产品编码:" prop="productNumber" v-if="showMore">
            <el-input
              v-model="formInline.productNumber"
              placeholder="请输入产品编码"
              style="width: 220px"
            />
          </el-form-item>
        </div>
        <div class="commonTopFilterWrap-search">
          <div class="commonTopFilterWrap-search-container">
            <el-button @click="onSubmit" class="commonSearchBtn">
              <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
              搜索
            </el-button>
            <el-button @click="resetFrom" class="commonResetBtn" style="margin-left: 0">
              重置
            </el-button>
          </div>
        </div>
      </div>
    </el-form>

    <div class="more">
      <div class="mid"> </div>
      <div class="more-text-wapper" @click="handleShowMore">
        <span class="more-text"> {{ showMore ? '收起更多' : '展开更多' }} </span>
        <img src="@/assets/imgs/oa/showClose.png" class="icon" v-if="showMore" alt="收起更多" />
        <img src="@/assets/imgs/oa/showMore.png" class="icon" v-else alt="展开更多" />
      </div>
      <div class="mid"> </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SearchTime from '@/components/common/time/search.vue'
import { cloneDeep } from 'lodash-es'
const route = useRoute()
const productNumber = route.query.productNumber

// 定义类型
interface Field {
  name: string
  code: string
  type: number
  placeholder: string
  options: any[]
  searchDisplay: boolean
  state: number
}

const showMore = ref(true)

const handleShowMore = () => {
  showMore.value = !showMore.value
}

const props = defineProps({
  fields: {
    type: Array as PropType<Field[]>,
    default: () => []
  }
})

const formInline = ref({
  planType: undefined,
  planListDate: undefined,
  planName: undefined,
  series: undefined,
  productNumber: undefined,
  taskCode: undefined,
  productCode: undefined
})
const emit = defineEmits(['reset', 'search', 'add'])
const timeRef = ref()
const onSubmit = () => {
  const formatValue: any = timeRef.value?.formatValue
  let data: any = cloneDeep({ ...formInline.value })
  if (formatValue?.length) {
    data = {
      ...data,
      planListStartDate: !formatValue[0] ? undefined : formatValue[0],
      planListEndDate: !formatValue[1] ? undefined : formatValue[1]
    }
  } else {
    data = { ...data, planListStartDate: undefined, planListEndDate: undefined }
  }
  delete data.planListDate

  console.log('搜索参数', data)
  emit('search', data)
}

const resetFrom = () => {
  formInline.value = {
    planType: undefined,
    planListDate: undefined,
    planName: undefined,
    series: undefined,
    productNumber: undefined,
    taskCode: undefined,
    productCode: undefined
  }
  emit('reset')
}

const setSearchProductNumberValue = (value) => {
  formInline.value['productNumber'] = value
}

if (productNumber) {
  // @ts-ignore
  formInline.value['productNumber'] = productNumber
}

const setSearchProductCode= (value) => {
  formInline.value['productCode'] = value
}

if (productNumber) {
  // @ts-ignore
  formInline.value['productNumber'] = productNumber
}

defineExpose({ setSearchProductNumberValue,setSearchProductCode })
</script>

<style lang="scss" scoped>
.flex-row {
  display: flex;
  flex-direction: row;
}

.more {
  display: flex;
  align-items: center;
  margin-top: 10px;
  justify-content: space-around;

  .mid {
    flex: 1;
    height: 1px;
    background: #ebeef5;
  }

  .more-text-wapper {
    display: flex;
    align-items: center;
    margin: 0 20px;

    .more-text {
      cursor: pointer;
      font-weight: 400;
      font-size: 12px;
      color: #333333;
      margin-right: 6px;
    }

    .icon {
      width: 8px;
      height: 6px;
      cursor: pointer;
    }
  }
}
</style>
