<!--
 * @Date: 2024-08-05 09:37:19
搜索
-->
<template>
  <div>
    <el-form
      class="-mb-15px"
      :model="cusQueryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="78px"
      @submit.prevent
    >
      <el-form-item label="平台:" prop="storeChannel">
        <el-select
          style="width: 200px; height: 32px"
          v-model="cusQueryParams.storeChannel"
          placeholder="请选择平台"
          clearable
          @change="handleQuery"
          class="hook"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_CHANNEL, true)"
            :key="dict.value"
            :label="dict.shortName"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="店铺:" prop="store">
        <StoreRangePlus
          v-model="cusQueryParams.store"
          value-type="storeCode"
          width="100%"
          :placeholder="'请选择店铺'"
          :showAllChannels="false"
        />
      </el-form-item>

      <el-form-item label="品类:" prop="category">
        <el-select
          style="width: 200px; height: 32px"
          v-model="cusQueryParams.category"
          placeholder="请选择品类"
          clearable
          @change="handleQuery"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_VISUAL_CATEGORY, true)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="上架周期" prop="cycle">
        <el-select
          v-model="cusQueryParams.cycle"
          placeholder="请选择上架周期"
          clearable
          @change="handleQuery"
          style="width: 200px; height: 32px"
        >
          <el-option-group v-for="group in cycleList" :key="group?.name" :label="group?.name">
            <el-option
              v-for="dict in group?.children"
              :key="dict.code"
              :label="dict.name"
              :value="dict.code"
            />
          </el-option-group>
        </el-select>
      </el-form-item>

      <el-form-item label="需求类型:" prop="secondDemandType" v-if="!moreFlag">
        <el-select
          style="width: 200px; height: 32px"
          v-model="cusQueryParams.secondDemandType"
          placeholder="请选择需求类型"
          clearable
          @change="handleQuery"
          class="hook"
        >
          <el-option
            v-for="dict in demandTypeList"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="产品编码:" prop="goodsCode" v-if="!moreFlag">
        <el-input
          class="dialogFormItemWidth"
          style="width: 200px; height: 32px"
          v-model="cusQueryParams.goodsCode"
          @clear="handleQuery"
          @keyup.enter="handleQuery"
          placeholder="请输入产品编码"
          clearable
        />
      </el-form-item>

      <el-form-item label="任务状态:" prop="state" v-if="!moreFlag">
        <el-select
          style="width: 200px; height: 32px"
          v-model="cusQueryParams.state"
          placeholder="请选择任务状态"
          clearable
          @change="handleQuery"
        >
          <el-option
            v-for="item in statePositionOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span class="status">
              <span class="icon" :class="formatIconBg(item.value)"></span>
              <span> {{ item.label }}</span>
            </span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="紧急程度:" prop="urgencyLevel" v-if="!moreFlag">
        <el-select
          style="width: 200px; height: 32px"
          v-model="cusQueryParams.urgencyLevel"
          placeholder="请选择紧急程度"
          clearable
          @change="handleQuery"
        >
          <el-option
            v-for="item in urgencyLevelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="产品定位:" prop="goodsPosition" v-if="!moreFlag">
        <el-select
          style="width: 200px; height: 32px"
          v-model="cusQueryParams.goodsPosition"
          placeholder="请选择产品定位"
          clearable
          @change="handleQuery"
        >
          <el-option
            v-for="item in goodsPositionOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否参与:" prop="takePart" v-if="!moreFlag">
        <el-select
          style="width: 200px; height: 32px"
          v-model="cusQueryParams.takePart"
          placeholder="请选择是否参与"
          clearable
          @change="handleQuery"
        >
          <el-option
            v-for="item in takePartOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否承接:" prop="undertake" v-if="!moreFlag">
        <el-select
          style="width: 200px; height: 32px"
          v-model="cusQueryParams.undertake"
          placeholder="请选择是否承接"
          clearable
          @change="handleQuery"
        >
          <el-option
            v-for="item in undertakeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="ml-25px operate">
        <div class="flex-row">
          <div class="commonTopFilterWrap-search">
            <div class="commonTopFilterWrap-search-container">
              <el-button @click="handleQuery()" class="commonSearchBtn">
                <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
                搜索
              </el-button>
              <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0">
                重置
              </el-button>
            </div>
          </div>
          <!-- <el-button @click="handleQuery()" style="background: #eaeaea; width: 75px"
            ><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button
          >
          <el-button @click="resetQuery" style="width: 64px">重置</el-button> -->
          <span class="more-wapper" @click="moreFlag = !moreFlag"
            ><span>{{ moreFlag ? '展开' : '收起' }} </span
            ><img
              v-if="!moreFlag"
              src="@/assets/imgs/common/filter_expand_up.png"
              class="more-icon"
            /><img src="@/assets/imgs/team/more.png" v-if="moreFlag" class="more-icon" />
          </span>
          <el-button
            type="primary"
            v-hasPermi="['team:optimization:add']"
            @click="handleAdd(0)"
            style="width: 72px"
          >
            <el-icon class="mr-5px"><Plus /></el-icon>
            新建</el-button
          >

          <el-button
            type="primary"
            @click="batchOperations"
            v-hasPermi="['team:optimization:batchEditing']"
          >
            批量操作</el-button
          >
          <el-button type="primary" @click="batchAudit" v-hasPermi="['team:optimization:audit']">
            批量视觉审核</el-button
          >
          <el-button
            type="primary"
            @click="cleanAllSelect"
            v-hasPermi="['team:optimization:batchEditing']"
          >
            清空选择</el-button
          >
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { getListingCycle } from '@/api/team/index'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import {
  goodsPositionOptions,
  statePositionOptions,
  takePartOptions,
  undertakeOptions,
  urgencyLevelOptions
} from './common'
defineOptions({ name: 'SearchForm' })

const cusQueryParams = reactive({
  goodsCode: undefined,
  store: undefined,
  category: undefined,
  demandType: undefined,
  secondDemandType: undefined,
  urgencyLevel: undefined,
  goodsPosition: undefined,
  productCode: undefined, //编码待修改
  state: undefined,
  takePart: undefined, //员工参与 0-否 1-是
  undertake: undefined, //是否承接 1-已承接 2-已拒绝
  cycle: undefined, //上架周期
  storeChannel: undefined //店铺渠道
})

const moreFlag = ref(false) //搜索展开收起
const emit = defineEmits([
  'handleQuery',
  'addInfo',
  'batchOperations',
  'cleanAllSelect',
  'batchAudit'
])

const demandTypeList = ref()

// 上架周期
const cycleList = ref([])
const initBaseList = async () => {
  const res = await getListingCycle()
  cycleList.value = res || []
}

onMounted(() => {
  initBaseList()
  initTypeList()
})

const props = defineProps({
  currentTab: {
    type: String,
    default: ''
  }
})

const initTypeList = () => {
  demandTypeList.value = getIntDictOptions('newProduct', true)
}

watch(
  () => props.currentTab,
  (value) => {
    demandTypeList.value = getIntDictOptions(value, true)
    cusQueryParams.secondDemandType = undefined
  }
)

/** 搜索按钮操作 */
const handleQuery = (type?: number) => {
  emit('handleQuery', type)
}

// 重置按钮操作
const queryFormRef = ref()
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery(1)
}

const handleAdd = (type: number) => {
  emit('addInfo', type)
}

const batchOperations = () => {
  emit('batchOperations')
}

const batchAudit = () => {
  emit('batchAudit')
}

const cleanAllSelect = () => {
  emit('cleanAllSelect')
}

//状态对应的 css 类名
const formatIconBg = (value) => {
  const IconBgMap = {
    '-1': 'end', //视觉待审核
    0: 'end', //运营待审核
    1: 'ing', //进行中
    2: 'end', //暂停
    3: 'finish', //已完成
    4: 'stop', //已拒绝
    5: 'end' //终止
  }
  return IconBgMap[value]
}

defineExpose({ cusQueryParams })
</script>

<style scoped lang="scss">
.status {
  border-radius: 12px;
  padding: 2px 8px;
  box-sizing: border-box;
  display: block;
  width: 100%;
  text-align: center;

  .icon {
    display: inline-block;
    width: 5px;
    height: 5px;
    margin-right: 10px;
    border-radius: 50%;
    transform: translateY(-3px);
  }
  .finish {
    background: #34cd02;
  }
  .ing {
    background: #e99d40;
  }
  .end {
    background: #8d8b8b;
  }
  .stop {
    background: #f33c51;
  }
}

.operate {
  .more-wapper {
    width: 45px;
    cursor: pointer;
    margin-left: 16px;
    margin-right: 29px;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-weight: 400;
    font-size: 12px;
    color: #0064ff;
    .more-icon {
      width: 9px;
      height: 4px;
      margin-left: 7px;
    }
  }
}
.flex-row {
  display: flex;
  flex-direction: row;
}
</style>
