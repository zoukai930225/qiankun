<template>
  <div>
    <el-drawer
      custom-class="targetManageDrawer"
      v-model="dialogVisible"
      :title="dialogTitle"
      size="968"
    >
      <div class="editBg">
        <div style="height: 14px"></div>
        <div class="personalBg">
          <img class="personalBg-avatar" src="@/assets/imgs/avatar_logo.png" />
          <div class="personalBg-name">{{ formData.name }}</div>
          <div class="personalBg-dept">（{{ formData.dept }}）</div>
        </div>
        <div class="profitTarget">利润目标</div>
        <el-table
          class="targetManageTable"
          :header-cell-style="{
            backgroundColor: '#F2F6FC',
            color: '#666',
            fontSize: '14px',
            fontWeight: '400',
            height: '40px'
          }"
          v-loading="loading"
          :data="list"
          :show-overflow-tooltip="true"
          row-class-name="commonTableRow1"
        >
          <el-table-column label="时间" prop="months" min-width="154">
            <template #default="scope">
              <div class="targetNormalText" v-if="scope.row.isTotal">全年</div>
              <div class="targetNormalText" v-else>{{ scope.row.months }}月</div>
            </template>
          </el-table-column>
          <el-table-column
            :label="`${year}年利润目标`"
            prop="targetAmount"
            min-width="280"
            :show-overflow-tooltip="false"
          >
            <template #default="scope">
              <div v-if="scope.row.isTotal">
                <div class="targetFuture">
                  <div class="targetNormalText" style="padding-left: 15px">{{
                    formateTargetAmount(getFullYearTargetAmount())
                  }}</div>
                </div>
              </div>
              <div v-else>
                <div
                  class="row-center"
                  style="width: 280px"
                  @mouseover="handleMouseOver(scope.row)"
                  @mouseout="saveTargetAmount(scope.row)"
                >
                  <el-input
                    v-show="scope.row.isEdit"
                    v-model="scope.row.editTargetAmount"
                    placeholder="请输入"
                    class="targetInput"
                    @keyup.enter="saveTargetAmount(scope.row)"
                    @clear="clearTargetAmount(scope.row)"
                    clearable
                  />
                  <div v-if="scope.row.isEdit" class="inputUnit">万</div>
                  <div class="targetFuture" v-show="!scope.row.isEdit">
                    <div class="targetNormalText" style="padding-left: 15px">{{
                      formateTargetAmount(scope.row.targetAmount)
                    }}</div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="`${year}年利润`" prop="cleanSalesAmount" min-width="172">
            <template #default="scope">
              <div class="targetNormalText" v-if="scope.row.isTotal">{{
                formateTargetAmount(yearProfitTotal())
              }}</div>
              <div v-else class="targetNormalText">{{
                formateTargetAmount(scope.row.cleanSalesAmount)
              }}</div>
            </template>
          </el-table-column>
          <el-table-column label="与目标差值" prop="deltaValue" min-width="130">
            <template #default="scope">
              <div v-if="scope.row.isTotal" class="targetNormalText">{{
                targetDeltaValue(yearProfitTotal(), getFullYearTargetAmount())
              }}</div>
              <div v-else class="targetNormalText">{{
                targetDeltaValue(scope.row.cleanSalesAmount, scope.row.targetAmount)
              }}</div>
            </template>
          </el-table-column>
          <el-table-column label="目标达成率" prop="targetRate" min-width="100">
            <template #default="scope">
              <div
                v-if="scope.row.isTotal"
                class="targetNormalText"
                :style="{
                  color: completionRateColor(yearProfitTotal(), getFullYearTargetAmount())
                }"
                >{{ targetCompleteRaio(yearProfitTotal(), getFullYearTargetAmount()) }}</div
              >
              <div
                v-else
                class="targetNormalText"
                :style="{
                  color: completionRateColor(scope.row.cleanSalesAmount, scope.row.targetAmount)
                }"
                >{{ targetCompleteRaio(scope.row.cleanSalesAmount, scope.row.targetAmount) }}</div
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题

import * as BiBilityAuthorityApi from '@/api/biBilityAuthority'

const year = ref('')
const currentMonth = ref('')

const formData = ref({
  id: '',
  name: '',
  dept: '',
  targetAmount: ''
})

const list = ref<any[]>([]) // 表格数据
/** 打开弹窗 */
const open = async (id: string) => {
  dialogVisible.value = true
  dialogTitle.value = '目标管理'
  const data = await BiBilityAuthorityApi.biResponsibilityAuthorityInfo(id)
  if (data) {
    formData.value = data
    if (formData.value.dataMonth) {
      year.value = formData.value.dataMonth.split('-')[0] || ''
      currentMonth.value = formData.value.dataMonth.split('-')[1] || ''
    }
    getList()
  }
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const getList = async () => {
  const data = await BiBilityAuthorityApi.biResponsibilityGetPersonalGoals(formData.value.name)
  if (data) {
    list.value = data || []
    list.value.forEach((item) => {
      if (!item || Number(item.targetAmount) === 0) {
        item.targetAmount = ''
      } else {
        item.editTargetAmount = Number(item.targetAmount / 10000).toFixed(2)
      }
    })
    handleReqListData()
  }
}

const handleReqListData = () => {
  list.value.unshift({
    id: null,
    months: '全年',
    isTotal: true
  })
}

// 全年总目标
const getFullYearTargetAmount = () => {
  let totalTargetMount = 0
  list.value.forEach((item) => {
    if (!item.isTotal) {
      totalTargetMount += Number(item.targetAmount)
    }
  })
  return totalTargetMount
}

const yearProfitTotal = () => {
  let profitTotal = 0
  list.value.forEach((item) => {
    if (!item.isTotal) {
      profitTotal += Number(item.cleanSalesAmount)
    }
  })
  return profitTotal
}

// 格式化目标金额
const formateTargetAmount = (value) => {
  return value ? `${(value / 10000).toFixed(2)}万` : '0.00万'
}

const targetDeltaValue = (value1, value2) => {
  if (Number(value1) <= Number(value2)) {
    return `${formateTargetAmount(Number(value2) - Number(value1))}`
  } else {
    return `+${formateTargetAmount(Number(value1) - Number(value2))}`
  }
}

// 目标完成率 value 当前值 value2 目标值
const targetCompleteRaio = (value1, value2) => {
  if (Number(value2) === 0) {
    return '--'
  } else {
    return `${((Number(value1) / Number(value2)) * 100).toFixed(2)}%`
  }
}

const completionRateColor = (value1, value2) => {
  if (Number(value2) > 0 && Number(value1) > Number(value2)) {
    return '#EB3738'
  }
  return '#333'
}

const handleMouseOver = (row) => {
  console.log('大富科技螺蛳粉了；带客服')
  if (!isClearingTarget.value) {
    row.editTargetAmount = Number(row.targetAmount / 10000).toFixed(2)
  }
  row.isEdit = true
}

const isSavingTargetAmount = ref(false)
const saveTargetAmount = async (row) => {
  if (isSavingTargetAmount.value) {
    return
  }
  if (
    row.editTargetAmount &&
    row.editTargetAmount !== Number(row.targetAmount / 10000).toFixed(2)
  ) {
    isSavingTargetAmount.value = true
    try {
      await BiBilityAuthorityApi.biResponsibilitySavePersonalGoals([
        {
          id: row.id,
          name: row.name,
          dataMonth: row.dataMonth,
          targetAmount: row.editTargetAmount * 10000
        }
      ]).catch(() => {
        message.success('编辑失败')
        row.editTargetAmount = row.editTargetAmount * 10000
        setTimeout(() => {
          isSavingTargetAmount.value = false
        }, 200)
      })
      row.targetAmount = row.editTargetAmount * 10000
      getList()
      emit('success')
      setTimeout(() => {
        isSavingTargetAmount.value = false
      }, 200)
    } finally {
      row.isEdit = false
    }
  } else {
    row.editTargetAmount = Number(row.targetAmount / 10000).toFixed(2)
    row.isEdit = false
  }
}

const isClearingTarget = ref(false)
const clearTargetAmount = (row) => {
  isClearingTarget.value = true
  row.editTargetAmount = ''
  setTimeout(() => {
    isClearingTarget.value = false
  }, 100)
}
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
</script>

<style lang="scss" scoped>
.targetManageDrawer {
}
.editBg {
  margin-top: -20px;
  background: #ffffff;
  border-radius: 8px;
  .personalBg {
    margin-left: 20px;
    margin-right: 20px;
    width: 887px;
    height: 68px;
    background: url('@/assets/imgs/team/personal_target_bg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: row;
    align-items: center;
    &-avatar {
      margin-left: 20px;
      width: 36px;
      height: 36px;
    }
    &-name {
      padding-left: 14px;
      font-size: 14px;
      color: #333333;
      line-height: 22px;
    }
    &-dept {
      font-size: 12px;
      color: #666666;
      line-height: 22px;
    }
    .personalBg {
      padding-top: 14px;
      margin-left: 20px;
      margin-right: 20px;
      width: 887px;
      height: 68px;
      background: url('@/assets/imgs/team/personal_target_bg.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
  }
  .profitTarget {
    margin-left: 20px;
    margin-top: 15px;
    margin-bottom: 20px;
    width: 102px;
    height: 32px;
    background: #f2f6fc;
    border-radius: 2px;
    font-size: 14px;
    color: #0064ff;
    line-height: 32px;
    text-align: center;
  }
  .inputUnit {
    padding-left: 5px;
    font-size: 14px;
    color: #333333;
    line-height: 20px;
  }
  .targetManageTable {
    width: 888px;
    margin-left: 20px;
    margin-right: 20px;
  }

  .targetDisable {
    width: 182px;
    height: 33px;
    background: url('@/assets/imgs/team/target_input_disable.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .targetFuture {
    width: 182px;
    height: 32px;
    background: #f2f6fc;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .targetInput {
    width: 182px;
    height: 32px;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #2f8df5;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .targetNormalText {
    font-size: 14px;
    color: #333333;
    line-height: 20px;
  }
}
:deep(.el-drawer__body) {
  background: #f8f9fb;
}
:deep(.el-drawer) {
  background: linear-gradient(102deg, #ecf0f9 0%, #effdfd 100%);
  border-radius: 12px 0px 0px 0px;
}
:deep(.el-drawer__body) {
  background: linear-gradient(102deg, #ecf0f9 0%, #effdfd 100%);
}
:deep(.el-input__wrapper) {
  background: transparent;
  border-radius: 4px;
  box-shadow: none;
}
:deep(.el-table .cell) {
  margin-left: 5px;
}

:deep(.el-table) {
  --el-table-row-hover-bg-color: transparent;
}
</style>
