<template>
  <el-dialog
    v-model="isShow"
    :width="650"
    overflow
    :append-to-body="true"
    class="dialog"
    :before-close="handleBeforeClose"
  >
    <template #header>
      <span>当日薪资</span>
    </template>
    <el-divider />
    <div class="mb20px" :style="{ color: '#333' }">当日薪资：{{ dailySalary }}</div>

    <div ref="contentRef" class="content">
      <div class="detail" v-for="(ele, index) in details" :key="index">
        <div class="item" v-for="item in getOptions(ele)" :key="item.value">
          <div class="label">{{ item.label }}</div>
          <div class="text" v-html="item.value"></div>
          <span v-if="item.isDeleted" :style="{ color: '#EB3737' }">（已删除）</span>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script lang="tsx" setup>
import { getDailySalary } from '@/api/storage/salary/examine'
import { useSalary } from '@/store/modules/storage'
import { getDictLabel } from '@/utils/dict'

const salary = useSalary()
const message = useMessage()

const props = defineProps<{
  id: string
}>()

const isShow = ref(false)

const details = ref<any>([])
const dailySalary = ref('')
const contentRef = ref()

function getOptions(item) {
  return [
    { label: '数据类型', value: item.type },
    { label: '分类名称', value: item.classificationName, isDeleted: item.isDeleted },
    { label: '计价明细', value: item.pricing },
    { label: '当日产量', value: item.quantity }
  ]
}

async function open() {
  try {
    await getDailySalaryList()
    renderScrollBar()
  } catch (error: any) {
    message.warning(error)
  }
}

async function getDailySalaryList() {
  try {
    const res = await getDailySalary({ id: props.id })

    if (!(res.currentRolesMask || res.otherRolesMasks)) {
      return message.warning('暂无当前人员的产量或工时记录，因此无法核算当日薪资！')
    }

    const detailList: any[] = []

    res.currentRolesMask &&
      res.currentRolesMask.detailVos &&
      detailList.push(
        ...res.currentRolesMask.detailVos.map((item) => {
          item.type = `本组数据（${getDictLabel(DICT_TYPE.ROLES_MASK, salary.currentRolesMask)}）`
          item.pricing = `
            <span>白班计价：(${item.dayPricing})、</span><span>夜班计价：(${item.nightPricing})、</span><span>跨工种价：(${item.crossWorkPricing})、</span><span>爆款计价：(${item.hotSellPricing || '--'})</span>
          `
          return item
        })
      )

    res.otherRolesMasks &&
      res.otherRolesMasks.forEach((item) => {
        item.detailVos &&
          detailList.push(
            ...item.detailVos.map((item) => {
              item.type = `跨组数据（${getDictLabel(DICT_TYPE.ROLES_MASK, item.rolesMask)}）`
              item.pricing = `
                <span>白班计价：(${item.dayPricing})、</span><span>夜班计价：(${item.nightPricing})、</span><span>跨工种价：(${item.crossWorkPricing})、</span><span>爆款计价：(${item.hotSellPricing || '--'})</span>
              `
              return item
            })
          )
      })

    details.value = detailList
    dailySalary.value = res.dailySalaryDetail
    isShow.value = true
  } catch (error) {}
}

function renderScrollBar() {
  nextTick(() => {
    if (!contentRef.value) return
    if (contentRef.value.scrollHeight > 500) {
      contentRef.value.classList.add('scroll')
    } else {
      contentRef.value.classList.remove('scroll')
    }
  })
}

function handleBeforeClose(done) {
  done()
  nextTick(() => {
    // details.value = []
    // dailySalary.value = ''
  })
}

defineExpose({ open })
</script>
<style lang="less" scoped>
.el-divider {
  width: calc(100% + 32px);
  margin: 0 -16px 16px;
}

.detail {
  margin-bottom: 16px;
  background: #f2f6fc;

  &:last-of-type {
    margin-bottom: 0;
  }

  .item {
    display: flex;
    align-items: center;
    padding: 10px 16px;
    .label {
      color: #666666;
    }
    .text {
      margin-left: 24px;
      color: #333;
    }
  }
}

.content {
  max-height: 500px;
  overflow-y: hidden;
}

.scroll {
  &::-webkit-scrollbar {
    // display: none;
    width: 5px; /* 垂直滚动条宽度 */
    height: 10px; /* 水平滚动条高度 */
  }

  /* 滚动条轨道 */
  &::-webkit-scrollbar-track {
    background-color: #f1f1f1;
    border-radius: 5px;
  }

  /* 滚动条滑块 */
  &::-webkit-scrollbar-thumb {
    background-color: #cacaca;
    border-radius: 5px;
  }

  /* 滚动条滑块悬停状态 */
  &::-webkit-scrollbar-thumb:hover {
    background-color: #e2e2e2;
  }

  /* 滚动条箭头 */
  &::-webkit-scrollbar-button {
    display: none; /* 隐藏箭头 */
  }

  &:hover {
    margin-right: -5px;
    overflow-y: scroll;

    &::-webkit-scrollbar-button {
      display: none;
    }
  }
}
</style>
