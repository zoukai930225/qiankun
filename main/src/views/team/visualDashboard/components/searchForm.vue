<!--
 * @Date: 2024-08-05 09:37:19
搜索
-->
<template>
  <div>
    <div class="form-wapper">
      <div>
        <el-form
          class="-mb-15px"
          :model="cusQueryParams"
          ref="queryFormRef"
          :inline="true"
          label-width="78px"
          @submit.prevent
        >
          <el-form-item label="日期:" prop="goodsCode">
            <el-date-picker
              v-model="cusQueryParams.date"
              type="daterange"
              style="width: 200px; height: 32px"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :disabled="true"
              :clearable="false"
            />
          </el-form-item>

          <el-form-item label="上架周期" prop="cycle">
            <el-cascader
              v-model="cusQueryParams.cycle"
              :options="cycleList"
              :props="cycleCascaderProps"
              style="width: 220px"
              :clearable="true"
            />
            <!-- <el-select
              v-model="cusQueryParams.cycle"
              placeholder="请选择上架周期"
              clearable
              style="width: 220px; height: 32px"
            >
              <el-option-group v-for="group in cycleList" :key="group?.name" :label="group?.name">
                <el-option
                  v-for="dict in group?.children"
                  :key="dict.code"
                  :label="dict.name"
                  :value="dict.code"
                />
              </el-option-group>
            </el-select> -->
          </el-form-item>

          <el-form-item label="流程节点" prop="queryProcessNodes">
            <el-cascader
              v-model="cusQueryParams.queryProcessNodes"
              :options="processNodesList"
              :props="cascaderProps"
              style="width: 220px"
              :clearable="true"
            />
            <!-- <el-select
              v-model="cusQueryParams.queryProcessNodes"
              placeholder="请选择流程节点"
              clearable
              style="width: 220px"
              multiple
            >
              <el-option-group
                v-for="group in processNodesList"
                :key="group?.name"
                :label="group?.name"
              >
                <el-option
                  v-for="dict in group?.children"
                  :key="dict.code"
                  :label="dict.name"
                  :value="dict.code"
                />
              </el-option-group>
            </el-select> -->
            <!-- <el-select
              style="width: 220px"
              v-model="cusQueryParams.queryProcessNodes"
              placeholder="请选择"
              multiple
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.VISUAL_PROCESS_NODE, true)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select> -->
          </el-form-item>

          <el-form-item label="平台:" prop="storeChannel">
            <el-select
              style="width: 220px; height: 32px"
              v-model="cusQueryParams.storeChannel"
              placeholder="请选择平台"
              clearable
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

          <el-form-item label="店铺:" prop="store" v-if="!moreFlag">
            <StoreRangePlus
              v-model="cusQueryParams.store"
              value-type="storeCode"
              width="220px"
              :showAllChannels="false"
              :placeholder="'请选择店铺'"
            />
          </el-form-item>

          <el-form-item label="品类:" prop="category" v-if="!moreFlag">
            <el-select
              style="width: 220px; height: 32px"
              v-model="cusQueryParams.category"
              placeholder="请选择品类"
              clearable
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_VISUAL_CATEGORY, true)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="需求类型:" prop="demandType" v-if="!moreFlag">
            <el-select
              style="width: 220px; height: 32px"
              v-model="cusQueryParams.demandType"
              placeholder="请选择需求类型"
              clearable
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
              style="width: 220px; height: 32px"
              v-model="cusQueryParams.goodsCode"
              @clear="handleQuery"
              @keyup.enter="handleQuery"
              placeholder="请输入产品编码"
              clearable
            />
          </el-form-item>

          <el-form-item label="人员分组:" prop="group" v-if="!moreFlag">
            <el-select
              style="width: 220px"
              v-model="cusQueryParams.group"
              placeholder="请选择人员分组"
              clearable
              multiple
            >
              <el-option
                v-for="dict in groupList"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="commonTopFilterWrap-search operate">
        <div class="commonTopFilterWrap-search-container flex-row">
          <el-button
            @click="handleExport"
            class="commonSearchBtn"
            :loading="btnLoading"
            v-hasPermi="['team:optimization:export']"
          >
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:download" />
            导出
          </el-button>
          <el-button @click="handleQuery" class="commonSearchBtn" :loading="btnLoading">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0">
            重置
          </el-button>
        </div>
        <div class="flex-row" style="margin-top: 10px">
          <span
            ><el-switch
              v-model="cusQueryParams.isSend"
              @change="handleSendChange(cusQueryParams.isSend)"
          /></span>
          <span class="desc">发送飞书消息</span></div
        >
      </div>
    </div>
    <SWFilterExpandAll
      :isExpand="!moreFlag"
      @expand-click="moreFlag = !moreFlag"
      style="margin-bottom: 15px"
    />
  </div>
</template>

<script lang="ts" setup>
import { getListingCycle, getProcessNodes, sendCalendarAssignedMessage } from '@/api/team/index'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

defineOptions({ name: 'SearchForm' })

const props = defineProps({
  currentTab: {
    type: String,
    default: ''
  },
  startTime: {
    type: String,
    default: ''
  },
  endTime: {
    type: String,
    default: ''
  },
  btnLoading: {
    type: Boolean,
    default: false
  }
})

const cascaderProps = {
  label: 'name',
  value: 'code',
  multiple: true,
  emitPath: false // 只返回选中节点的值（string），而不是完整路径数组
}

const cycleCascaderProps = {
  label: 'name',
  value: 'code',
  multiple: false,
  emitPath: false // 只返回选中节点的值（string），而不是完整路径数组
}

const groupList = ref([
  {
    label: '天猫设计组',
    value: '天猫设计组'
  },
  {
    label: '人像摄影组',
    value: '人像摄影组'
  },
  {
    label: '静物摄影组',
    value: '静物摄影组'
  },
  {
    label: '摄像组',
    value: '摄像组'
  },
  {
    label: '淘宝修图组',
    value: '淘宝修图组'
  },
  {
    label: '内裤组',
    value: '内裤组'
  },
  {
    label: '袜子组',
    value: '袜子组'
  },
  {
    label: '内衣组',
    value: '内衣组'
  },
  {
    label: '天猫推广设计组',
    value: '天猫推广设计组'
  },
  {
    label: '天猫修图组',
    value: '天猫修图组'
  },

  {
    label: '淘宝推广设计组',
    value: '淘宝推广设计组'
  }
])

const cusQueryParams = ref({
  goodsCode: undefined,
  store: undefined,
  category: undefined,
  demandType: undefined,
  urgencyLevel: undefined,
  goodsPosition: undefined,
  productCode: undefined, //编码待修改
  state: undefined,
  takePart: undefined, //员工参与 0-否 1-是
  undertake: undefined, //是否承接 1-已承接 2-已拒绝
  cycle: undefined, //上架周期
  storeChannel: undefined, //店铺渠道
  date: [], //开始时间结束时间
  group: [],
  queryProcessNodes: [],
  isSend: false
})

const handleSendChange = async (value) => {
  if (value) {
    // 发送飞书卡片
    await sendCalendarAssignedMessage()
  }
}

// 监听 cycle 变化 转化为开始日期和结束日期 并赋值给date
watch(
  () => cusQueryParams.value.cycle,
  (newVal: any) => {
    console.log('newVal', newVal)
    // 2024DecFourth 站换成日期格式为 2024年12月
    const year = newVal?.substring(0, 4)
    const monthStr = newVal?.substring(4, 7)
    const monthMap: { [key: string]: string } = {
      Jan: '01',
      Feb: '02',
      Mar: '03',
      Apr: '04',
      May: '05',
      Jun: '06',
      Jul: '07',
      Aug: '08',
      Sep: '09',
      Oct: '10',
      Nov: '11',
      Dec: '12'
    }
    const month = monthMap[monthStr]
    console.log('year, month', year, month)
    const midTime = `${year}年${month}月`
    console.log('midTime', midTime)

    if (newVal) {
      // 遍历 cycleList 找到对应name等于midTime的项 并且循环 children 找到code等于newVal的项  返回name的值 name格式为  10月第4周 21-26 或者 10月第5周 28-11/2  根据21-26 或者 28-11/2 生成开始日期和结束日期 给date赋值
      for (const group of cycleList.value) {
        if (group.name === midTime) {
          for (const child of group.children) {
            if (child.code === newVal) {
              const nameParts = child.name.split(' ')
              if (nameParts.length === 2) {
                const dateRange = nameParts[1]
                const dates = dateRange.split('-')
                if (dates.length === 2) {
                  const startDay = dates[0]
                  let endDay = dates[1]
                  let endMonth = Number(month)
                  // 处理跨月情况
                  if (endDay.includes('/')) {
                    const endParts = endDay.split('/')
                    endDay = endParts[1]
                    endMonth = endParts[0]
                  }
                  const startDate = new Date(
                    parseInt(year, 10),
                    Number(month) - 1,
                    parseInt(startDay, 10)
                  )
                  const endDate = new Date(parseInt(year, 10), endMonth - 1, parseInt(endDay, 10))
                  cusQueryParams.value.date = [startDate, endDate]
                  console.log('设置的日期范围', cusQueryParams.value.date)
                }
              }
            }
          }
        }
      }
    }
  }
)

const moreFlag = ref(false) //搜索展开收起
const emit = defineEmits(['handleQuery', 'handleReset', 'handleExport'])

const demandTypeList = ref([
  {
    label: '新品需求',
    value: 'newProduct'
  },
  {
    label: '优化需求',
    value: 'optimization'
  }
])

interface ChildItem {
  code: string
  name: string
}
// 上架周期
const cycleList = ref<ChildItem[]>([])
const initBaseList = async () => {
  const res = await getListingCycle()
  console.log('res上架周期', res)
  cycleList.value = res || []
}

onMounted(() => {
  initBaseList()
  initProcessNodes()
  nextTick(() => {
    //@ts-ignore

    cusQueryParams.value.date = [props.startTime, props.endTime]
  })
})

const processNodesList = ref([])
const initProcessNodes = async () => {
  const res = await getProcessNodes()
  console.log('res流程节点', res)
  processNodesList.value = res || []
}
watch(
  () => props.currentTab,
  (value) => {
    cusQueryParams.value.demandType = undefined
  }
)

/** 搜索按钮操作 */
const handleQuery = () => {
  emit('handleQuery', cusQueryParams.value)
}
const handleExport = () => {
  emit('handleExport', cusQueryParams.value)
}

// 重置按钮操作
const queryFormRef = ref()
const resetQuery = () => {
  //@ts-ignore
  cusQueryParams.value = {
    goodsCode: undefined,
    store: undefined,
    category: undefined,
    demandType: undefined,
    urgencyLevel: undefined,
    goodsPosition: undefined,
    productCode: undefined, //编码待修改
    state: undefined,
    takePart: undefined, //员工参与 0-否 1-是
    undertake: undefined, //是否承接 1-已承接 2-已拒绝
    cycle: undefined, //上架周期
    storeChannel: undefined, //店铺渠道
    //@ts-ignore
    date: [], //开始时间结束时间
    group: []
  }

  emit('handleReset', cusQueryParams.value)
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
    height: 32px;
    cursor: pointer;
    margin-left: 16px;
    display: flex;
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

.form-wapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
}

.el-form--inline .el-form-item {
  margin-right: 30px;
}

:deep(.el-select-group__title) {
  font-size: 14px; //
  color: #666666;
  font-weight: bold;
}

:deep(.el-select-dropdown__item) {
  font-size: 13px;
}

:deep(.el-input__wrapper) {
  height: auto;
}
.desc {
  font-size: 12px;
  color: #333333;
  margin-left: 4px;
}
.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.commonTopFilterWrap-search {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
</style>
