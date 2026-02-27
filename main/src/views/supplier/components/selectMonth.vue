<template>
  <el-popover
    trigger="click"
    :width="280"
    @after-leave="handleAfterLeave"
    @before-enter="handleBeforeEnter"
  >
    <template #reference>
      <div @mouseenter="showClear = true" @mouseleave="showClear = false">
        <el-input-tag
          ref="inputRef"
          v-model="initValue"
          readonly
          :clearable="clearable"
          :placeholder="placeholder"
          @focus="inputRef?.blur()"
          @change="(value) => emit('change', value)"
        >
          <template #prefix>
            <el-icon><Calendar /></el-icon>
          </template>
          <template #tag="{ value, index }">
            <el-tag
              v-if="index < 1"
              :closable="clearable || initValue!.length > 1"
              type="info"
              @close="handleCloseTag(index)"
              >{{ value }}</el-tag
            >
            <el-tooltip v-else-if="index === 1" effect="light">
              <el-tag type="info">+{{ initValue!.length - 1 }}</el-tag>
              <span>+{{ initValue!.length - 1 }}</span>
              <template #content>
                <div class="othersTag">
                  <el-tag
                    v-for="(tag, i) in initValue?.toSpliced(0, 1)"
                    :key="tag"
                    closable
                    type="info"
                    @close="handleCloseOtherTag(i)"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
              </template>
            </el-tooltip>
          </template>

          <template #suffix>
            <el-button v-if="showClear && clearable" link @click.stop="handleClear">
              <el-icon color="#999"><CircleClose /></el-icon>
            </el-button>
          </template>
        </el-input-tag>
      </div>
    </template>

    <div v-if="showMonth">
      <div class="year-part">
        <el-button link @click="handleClickPreBtn">
          <el-icon><DArrowLeft /></el-icon>
        </el-button>

        <el-button link @click="showMonth = false">{{ currentYear }}</el-button>

        <el-button link @click="handleClickNextBtn">
          <el-icon><DArrowRight /></el-icon>
        </el-button>
      </div>
      <el-divider />
      <div>
        <el-row>
          <el-col
            v-for="item in MONTHS"
            :key="item.value"
            :span="8"
            class="!flex items-center justify-center"
          >
            <el-button
              :text="!initValue?.includes(formateMonth(`${currentYear}年${item.value}`))"
              :type="
                initValue?.includes(formateMonth(`${currentYear}年${item.value}`))
                  ? 'primary'
                  : 'info'
              "
              round
              class="mt-6px"
              :style="{
                cursor:
                  initValue?.length === 1 &&
                  !props.clearable &&
                  initValue?.includes(formateMonth(`${currentYear}年${item.value}`))
                    ? 'not-allowed'
                    : 'pointer'
              }"
              @click="handleClickMonth(item.value)"
            >
              {{ item.label }}
            </el-button>
          </el-col>
        </el-row>
      </div>
    </div>

    <div v-else>
      <div class="year-part">
        <el-button link @click="handleClickPreBtnRange">
          <el-icon><DArrowLeft /></el-icon>
        </el-button>

        <el-button link @click="showMonth = false">{{ currentYearRange }}</el-button>

        <el-button link @click="handleClickNextBtnRange">
          <el-icon><DArrowRight /></el-icon>
        </el-button>
      </div>
      <el-divider />

      <div>
        <el-row>
          <el-col
            v-for="item in Years"
            :key="item"
            :span="8"
            class="!flex items-center justify-center"
          >
            <el-button text round @click="handleClickYear(item)" class="mt-6px">
              {{ item }}
            </el-button>
          </el-col>
        </el-row>
      </div>
    </div>
  </el-popover>
</template>
<script lang="ts" setup>
import { formatDate } from '@/utils/formatTime'
import { InputTagInstance } from 'element-plus'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    clearable?: boolean
    valueFormate?: string
  }>(),
  {
    clearable: true,
    valueFormate: 'YYYY年MM月'
  }
)

const emit = defineEmits<{
  (e: 'update:model-value', value: any): void
  (e: 'change', value: any): void
}>()

const inputRef = ref<InputTagInstance>()

const MONTHS = [
  { label: '一月', value: '1月' },
  { label: '二月', value: '2月' },
  { label: '三月', value: '3月' },
  { label: '四月', value: '4月' },
  { label: '五月', value: '5月' },
  { label: '六月', value: '6月' },
  { label: '七月', value: '7月' },
  { label: '八月', value: '8月' },
  { label: '九月', value: '9月' },
  { label: '十月', value: '10月' },
  { label: '十一月', value: '11月' },
  { label: '十二月', value: '12月' }
]

const Years = computed(() => {
  const targetYear = currentYear.value
  const start = Math.floor(targetYear / 10) * 10
  let end = Math.ceil(targetYear / 10) * 10
  if (start === end) end = start + 10

  return Array.from({ length: end - start }, (_, index) => start + index)
})

const showClear = ref(true)
const showMonth = ref(true)

const currentYear = ref(new Date().getFullYear())
const currentYearRange = computed(
  () => `${Years.value?.[0]} ~ ${Years.value?.[Years.value.length - 1]}`
)

const initValue = computed({
  get: () => props.modelValue?.split(',') || undefined,
  set: (val) => {
    const value =
      val && val.length
        ? val
            .map((ele) => {
              const date = ele.replace(/^(\d{4})\S+(\d{2})\S+/, '$1-$2')
              const res = formatDate(new Date(date), props.valueFormate)
              return res
            })
            ?.join(',')
        : undefined
    emit('update:model-value', value)
    emit('change', value)
  }
})

function formateMonth(val: string) {
  const date = val.replace(/年/, '-').replace(/月/, '')
  return formatDate(new Date(date), props.valueFormate)
}

function handleClickMonth(value: string) {
  const v = formateMonth(`${currentYear.value}年${value}`)
  if (initValue.value?.includes(v)) {
    if (initValue.value.length === 1 && !props.clearable) return
    initValue.value = initValue.value.filter((ele) => ele !== v)
  } else {
    const newValues = initValue.value ? [...new Set([...initValue.value, v])] : [v]
    newValues.sort((a, b) => {
      const parseDate = (dateStr: string) => {
        const match = dateStr.match(/^(\d{4})\D+(\d{1,2})/)
        if (!match) return { year: 0, month: 0 }
        return {
          year: Number(match[1]),
          month: Number(match[2])
        }
      }

      const { year: yearA, month: monthA } = parseDate(a)
      const { year: yearB, month: monthB } = parseDate(b)

      if (yearA !== yearB) {
        return yearA - yearB
      }

      return monthA - monthB
    })

    initValue.value = newValues
  }
}

function handleClickYear(year) {
  currentYear.value = year
  showMonth.value = true
}

function handleCloseOtherTag(index: number) {
  if (!initValue.value) return
  const v = initValue.value
  v?.splice(index + 1, 1)
  initValue.value = [...v]
}

function handleCloseTag(index: number) {
  if (!initValue.value) return
  const v = initValue.value
  v?.splice(index, 1)
  initValue.value = [...v]
}

function handleClickPreBtn() {
  const preYear = new Date().setFullYear(currentYear.value - 1)
  currentYear.value = new Date(preYear).getFullYear()
}

function handleClickPreBtnRange() {
  const preYear = new Date().setFullYear(currentYear.value - 10)
  currentYear.value = new Date(preYear).getFullYear()
}

function handleClickNextBtn() {
  const preYear = new Date().setFullYear(currentYear.value + 1)
  currentYear.value = new Date(preYear).getFullYear()
}

function handleClickNextBtnRange() {
  const preYear = new Date().setFullYear(currentYear.value + 10)
  currentYear.value = new Date(preYear).getFullYear()
}

function handleClear() {
  initValue.value = []
}

function handleAfterLeave() {
  currentYear.value = new Date().getFullYear()
}

function handleBeforeEnter() {
  const months = props.modelValue?.split(',')

  if (months) {
    const lastMonth = months[months.length - 1]
    const date = lastMonth.replace(/年/, '-').replace(/月/, '')
    currentYear.value = new Date(date).getFullYear()
  }
}
</script>
<style lang="less" scoped>
:deep(.el-input-tag__inner) {
  flex-wrap: nowrap;
  & > .el-tag {
    padding: 0;
  }
}

:deep(.el-input-tag__inner) {
  .el-tag {
    &:nth-of-type(n + 3) {
      display: none;
    }

    &:nth-of-type(3) {
      padding-right: 9px;
      .el-tag__close {
        display: none;
      }
    }
  }
}

.othersTag {
  display: flex;
  flex-wrap: wrap;
  .el-tag {
    margin-right: 6px;
  }
}

.year-part {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .el-button {
    font-size: 16px;
    font-weight: 500;
    color: #606266;
  }
}

.el-divider {
  margin-top: 12px;
  margin-bottom: 12px;
}

:deep(.el-input-tag__suffix) {
  position: relative;

  .el-button {
    position: absolute;
    left: -10px;
  }
}
</style>
