<template>
  <div class="dashboard topHeader">
    <div class="topHeader-title"
      >舟稳可视化数据看板
      <el-popover placement="top-start" title="颜色说明" :width="390" trigger="hover">
        <template #reference>
          <el-icon><QuestionFilled /></el-icon>
        </template>
        <div>
          <div class="d-flex">
            <p class="color-explain color-red-icon mr-2"></p>
            红色：表示有执行失败任务
          </div>
          <div class="d-flex">
            <p class="color-explain color-yellow-icon mr-2"></p>
            黄色：表示任务状态为告警
          </div>
          <div class="d-flex">
            <p class="color-explain color-green-icon mr-2"></p>
            绿色：表示任务执行抓取数据成功，且数据校验通过
          </div>
          <div class="d-flex">
            <p class="color-explain color-blue-icon mr-2"></p>
            蓝色：表示任务执行抓取数据成功，但数据校验未通过
          </div>
          <div class="d-flex">
            <p class="color-explain color-gray-icon mr-2"></p>
            灰色：表示任务未执行
          </div>
        </div>
      </el-popover>
    </div>
    <div class="topHeader-dateFilter" v-if="activeName === 'first'">
      <div class="topHeader-dateFilter-label">颜色筛选</div>
      <el-select
        class="dialogFormItemWidth"
        v-model="formData.boardColor"
        placeholder=""
        clearable
        style="width: 80px; margin-right: 10px; height: 32px"
        @change="emit('sendDateSelect', formData)"
        @clear="emit('sendDateSelect', formData)"
      >
        <template #label>
          <span class="status">
            <span class="icon" :class="formatIconBg(formData.boardColor)"></span>
          </span>
        </template>
        <el-option
          v-for="dict in colorList"
          :key="dict.value"
          :label="dict.label"
          :value="dict.label"
        >
          <span class="status">
            <span class="icon" :class="formatIconBg(dict.value)"></span>
            <span> {{ dict.label }}</span>
          </span>
        </el-option>
      </el-select>
      <div class="topHeader-dateFilter-label">负责人</div>
      <el-select
        v-model="formData.superintendent"
        placeholder="请选择"
        clearable
        filterable
        style="width: 200px; margin-right: 10px; height: 32px"
        @change="emit('sendDateSelect', formData)"
        @clear="emit('sendDateSelect', formData)"
      >
        <el-option
          v-for="dict in rpaDashboardData.resUserList"
          :key="dict.id"
          :label="dict.realName"
          :value="dict.id"
        />
      </el-select>
      <div class="topHeader-dateFilter-label">关键词</div>
      <el-input
        v-model="formData.keyword"
        placeholder="请输入任务名称"
        style="width: 200px; margin-right: 10px; height: 32px"
        @keyup.enter="emit('sendDateSelect', formData)"
        clearable
        @clear="emit('sendDateSelect', formData)"
      />
      <div class="topHeader-dateFilter-label">日期</div>
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="YYYY-MM-DD"
        @change="changeDate"
        :prefix-icon="Clock"
        style="width: 223px; margin-right: 20px; height: 32px"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, defineEmits } from 'vue'
import { Clock } from '@element-plus/icons-vue'
import { formatDate } from '@/utils/formatTime'
import { useRpaDashboardStore } from '@/store/modules/rpaDashboard'
const rpaDashboardData = useRpaDashboardStore()
const props = defineProps({
  activeName: {
    type: String,
    default: ''
  }
})
const formData = ref({
  startTime: undefined,
  endTime: undefined,
  keyword: undefined,
  superintendent: undefined
})

// 计算当天的日期
const getNowDate = () => {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
  return {
    startOfDay,
    endOfDay
  }
}

const { startOfDay, endOfDay } = getNowDate()
const dateRange = ref([formatDate(startOfDay, 'YYYY-MM-DD'), formatDate(endOfDay, 'YYYY-MM-DD')])

const emit = defineEmits(['sendDateSelect'])
const changeDate = (val) => {
  if (val && val.length === 2) {
    // startTime 设置为选择日期的 00:00:00
    const startOfDay = new Date(val[0])
    formData.value.startTime = formatDate(
      new Date(startOfDay.getFullYear(), startOfDay.getMonth(), startOfDay.getDate(), 0, 0, 0),
      'YYYY-MM-DD HH:mm:ss'
    )

    // endTime 设置为选择日期的 23:59:59
    const endOfDay = new Date(val[1])
    formData.value.endTime = formatDate(
      new Date(endOfDay.getFullYear(), endOfDay.getMonth(), endOfDay.getDate(), 23, 59, 59),
      'YYYY-MM-DD HH:mm:ss'
    )
  } else {
    // 如果没有选择日期，则清空 startTime 和 endTime
    formData.value.startTime = undefined
    formData.value.endTime = undefined
  }

  emit('sendDateSelect', formData.value)
}

interface OptionItem {
  label: string
  value: string
}
const colorList: OptionItem[] = [
  { label: '红色', value: '#E15A51' },
  { label: '黄色', value: '#EDB135' },
  { label: '绿色', value: '#1AAC2E' },
  { label: '蓝色', value: '#cce0ff' },
  { label: '灰色', value: '#999F9E' }
]
//状态对应的 css 类名
const formatIconBg = (value) => {
  const colorMap = {
    红色: 'color-red-icon',
    黄色: 'color-yellow-icon',
    绿色: 'color-green-icon',
    蓝色: 'color-blue-icon',
    灰色: 'color-gray-icon',
    '#E15A51': 'color-red-icon',
    '#EDB135': 'color-yellow-icon',
    '#1AAC2E': 'color-green-icon',
    '#999F9E': 'color-gray-icon',
    '#cce0ff': 'color-blue-icon'
  }

  return colorMap[value] || 'color-gray-icon'
}

onMounted(() => {
  const { startOfDay, endOfDay } = getNowDate()

  // 默认当天的日期，在传递给后端的时候需要加上时分秒
  formData.value.startTime = formatDate(startOfDay, 'YYYY-MM-DD HH:mm:ss')
  formData.value.endTime = formatDate(endOfDay, 'YYYY-MM-DD HH:mm:ss')

  // 触发父组件事件
  emit('sendDateSelect', formData.value)
})
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
    width: 22px;
    height: 22px;
    border-radius: 4px;
    margin-right: 10px;
    vertical-align: middle;
  }
  .color-red-icon {
    background: #e15a51;
  }
  .color-yellow-icon {
    background: #edb135;
  }
  .color-green-icon {
    background: #1aac2e;
  }
  .color-gray-icon {
    background: #999f9e;
  }
  .color-blue-icon {
    background: var(--el-color-primary);
  }
}
.topHeader {
  width: calc(100%);
  background: #fff;
  // padding: 11px 0;
  height: 54px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &-title {
    font-size: 16px;
    font-weight: bold;
    color: #333333;
    padding-left: 20px;
  }

  &-dateFilter {
    display: flex;
    align-items: center;
  }
  &-dateFilter-label {
    font-family: AlibabaPuHuiTi_2_55_Regular;
    font-size: 12px;
    color: #666666;
    line-height: 20px;
    text-align: center;
    margin-right: 11px;
  }
}
.d-flex {
  display: flex;
  align-items: center;
}
.color-explain {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.color-red-icon {
  background: #e15a51;
}
.color-yellow-icon {
  background: #edb135;
}
.color-green-icon {
  background: #1aac2e;
}
.color-gray-icon {
  background: #999f9e;
}
.color-blue-icon {
  background: var(--el-color-primary);
}
</style>

<style scoped>
:deep(.dashboard .el-input__wrapper) {
  background: #f3f4f7;
  box-shadow: none;
}
</style>
