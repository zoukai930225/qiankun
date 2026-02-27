<template>
  <div class="drawer-wrapper">
    <el-drawer
      v-model="isShow"
      class="drawer"
      ref="drawerRef"
      size="60%"
      :with-header="false"
      :wrapper-closable="true"
      :before-close="handleBeforClose"
    >
      <div>
        <div class="drawerTitle">
          <div>{{ drawerTitle }}</div>
          <div @click="drawerRef.handleClose">
            <el-icon><CloseBold /></el-icon>
          </div>
        </div>
      </div>
      <el-card shadow="never" class="mb4" v-loading="loading">
        <template #header>
          <div>基础信息配置</div>
        </template>
        <el-form
          :model="formData"
          label-width="97"
          ref="formRef"
          :rules="rules"
          :scroll-into-view-options="true"
        >
          <el-form-item prop="shiftName" label="班次名称">
            <el-input
              v-model.trim="formData.shiftName"
              placeholder="请输入班次名称"
              clearable
              :maxlength="50"
            />
          </el-form-item>
          <el-form-item prop="shiftType" label="班次类型">
            <el-select v-model="formData.shiftType" placeholder="请选择班次类型">
              <el-option :value="0" label="白班">白班</el-option>
              <el-option :value="1" label="夜班">夜班</el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card shadow="never" v-loading="loading">
        <template #header>
          <div class="mb5">班次规则配置</div>
          <div class="totalTime"
            >总工作时长：{{ `${formData.workHours} 小时 ${formData.workMinutes} 分钟` }}</div
          >
        </template>

        <!-- 规则卡片 -->
        <rule-cards
          ref="ruleCardsRef"
          v-model="formData.shiftRuleVos"
          @change-time="computeTotalTime"
        />

        <el-button type="primary" link class="mt5 mb5 ml5" @click="onPlus">
          <el-icon class="mr3.5"><Plus /></el-icon>添加规则
        </el-button>
      </el-card>
      <div class="footer mt5">
        <el-button class="ml4.5" type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </div>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
import { getShiftDetail, postShiftDetail } from '@/api/storage/attendance'
import RuleCards from './ruleCard.vue'
import { cloneDeep } from 'lodash-es'
import { deepEqual } from '@/utils/common'

const props = withDefaults(
  defineProps<{
    isShow: boolean
    /**
     * 抽屉类型
     */
    drawerType?: 'add' | 'edit' | 'check' | 'copy'
    /**
     * 抽屉自定义标题
     */
    title?: string
    /**
     * 班次id
     */
    id?: string
  }>(),
  {
    id: ''
  }
)

const emit = defineEmits(['update:isShow', 'submit-success'])

const message = useMessage()
const drawerRef = ref()
const ruleCardsRef = ref()
const formRef = ref()
const formData = ref<StorageAttendance.ShiftDetail>({
  shiftType: 0,
  shiftRuleVos: [],
  workHours: 0,
  workMinutes: 0
})
const rules = {
  shiftName: [
    {
      required: true,
      message: '请输入班次名称'
    }
  ]
}
const loading = ref(false)
const oldFormData = ref<any>() /// 用于在关闭抽屉时是否提示未保存数据，与formData一致不提示，不一致提示

const isShow = computed({
  get: () => props.isShow,
  set: (val) => {
    emit('update:isShow', val)
  }
})

const drawerTitle = computed(() => {
  if (props.title) return props.title

  let title = ''
  switch (props.drawerType) {
    case 'add':
      title = '新增班次'
      break
    case 'edit':
      title = '编辑班次'
      break
    case 'check':
      title = '查看班次'
      break
    case 'copy':
      title = '复制班次'
      break
    default:
      break
  }
  return title
})

watch(
  () => props.isShow,
  async (val) => {
    if (!val) return
    if (props.drawerType !== 'add') await getDetail()
    else {
      formData.value.shiftRuleVos.push(new ShiftRule())
      formData.value.shiftRuleVos[0].workStartTime = '08:30'
      formData.value.shiftRuleVos[0].workEndTime = '18:00'
      computeTotalTime()
    }

    oldFormData.value = cloneDeep(formData.value)
  }
)

async function computeTotalTime() {
  const val = formData.value.shiftRuleVos
  const mins = val.reduce((arr, cur) => {
    let startMins = cur.workStartTimeOffset! * 24 * 60 + tranformTime(cur.workStartTime!)!
    let endMins = cur.workEndTimeOffset! * 24 * 60 + tranformTime(cur.workEndTime!)!
    const res = arr + endMins - startMins
    return !Number.isNaN(res) && res > 0 ? res : arr
  }, 0)

  formData.value.workHours = Math.floor(mins / 60)
  formData.value.workMinutes = mins % 60
}
function tranformTime(time: string) {
  if (time) {
    const timeArr = time.split(':').map(Number)
    return timeArr[0] * 60 + timeArr[1]
  }
}

class ShiftRule {
  absentCheckIn = 30
  absentCheckOut = 30
  earlyLeaveThreshold = 0
  id = undefined
  lateThreshold = 0
  maxEarlyCheckIn = 30
  maxLateCheckOut = 30
  shiftName = ''
  workEndTime = ''
  workEndTimeOffset: 0 | 1 = 0
  workStartTime = ''
  workStartTimeOffset: 0 | 1 = 0
  ruleNumber = 0
  ruleName = ''
}

async function handleBeforClose(done: () => void) {
  if (!deepEqual(oldFormData.value, formData.value)) {
    await message.confirm('内容还没有保存，确定离开吗？')
  }

  formRef.value.resetFields()
  ruleCardsRef.value.resetFields()
  formData.value.shiftRuleVos = []
  done()
}

function onPlus() {
  formData.value.shiftRuleVos.push(new ShiftRule())
}

function onCancel() {
  drawerRef.value.handleClose()
}

async function onSubmit() {
  let allVlidateRes: boolean[] = []
  const cardForms = ruleCardsRef.value.getRulesForms()
  formRef.value
    .validateField()
    .then((res) => {
      allVlidateRes.push(res)
    })
    .finally(() => {
      cardForms.forEach(async (item) => {
        const validateRes = await item.validate()
        allVlidateRes.push(validateRes)

        if (allVlidateRes.length !== cardForms.length + 1) return

        // 这时候所有校验全部通过
        formData.value.shiftRuleVos.forEach((el, index) => {
          el.shiftName = formData.value.shiftName
          el.ruleNumber = index + 1
          el.ruleName = `规则${index + 1}`
        })
        try {
          const res = await postShiftDetail(formData.value)
          if (res.success) {
            message.success('保存成功')
            oldFormData.value = cloneDeep(formData.value)
            emit('submit-success')
            drawerRef.value.handleClose()
          }
        } catch (error) {}
      })
    })
}

async function getDetail() {
  loading.value = true
  try {
    const res = await getShiftDetail({ id: props.id })
    if (res) formData.value = res
    if (res && res.shiftRuleVos.length === 0) formData.value.shiftRuleVos.push(new ShiftRule())
    if (props.drawerType === 'copy') {
      formData.value.shiftName = ''
      delete formData.value.shiftId
      formData.value.shiftRuleVos.forEach((el) => {
        delete el.id
      })
    }
    computeTotalTime()
  } catch (error) {
  } finally {
    loading.value = false
  }
}
</script>
<style lang="less" scoped>
:deep(.el-drawer__body) {
  padding-left: 18px;
  padding-right: 18px;
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;

  .el-card {
    border-radius: 4px;
    font-size: 14px;
    line-height: 20px;
    & > .el-card__header {
      padding: 20px;
      border: 0;

      & > div {
        display: flex;
        align-items: center;
      }

      & > div:first-of-type::before {
        content: '';
        display: block;
        width: 3px;
        height: 10px;
        margin-right: 5px;
        background-color: rgba(0, 100, 255, 1);
      }

      & > div:nth-child(2)::before {
        content: '';
        display: block;
        width: 14px;
        height: 14px;
        margin-right: 12px;
        background: url('@/assets/imgs/storage/attendance-shift-totaltime.png');
        background-size: cover;
      }
    }

    & > .el-card__body {
      padding: 0 20px;
    }
  }
}

.drawerTitle {
  font-size: 14px;
  display: flex;
  color: #333333;
  font-weight: 600;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin: 0 0 18px 0;
}

.footer {
  display: flex;
  flex-direction: row-reverse;
}

.totalTime {
  position: relative;
  &.error {
    &::after {
      content: '总时长不能超过24小时';
      display: block;
      position: absolute;
      top: 100%;
      left: 110px;
      font-size: 12px;
      color: #f56c6c;
    }
  }
}

.el-input__inner {
  height: 32px;
  line-height: 32px;
}

:deep(.el-input__wrapper) {
  height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
