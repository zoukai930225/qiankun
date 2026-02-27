<template>
  <div class="header-filter-container">
    <el-popover
      ref="popoverRef"
      trigger="click"
      :width="220"
      placement="bottom"
      :show-arrow="false"
      popper-class="table-filter-popper"
      @show="onShow"
      @hide="onHide"
    >
      <template #reference>
        <div class="header-trigger">
          <span class="header-title">{{ title }}</span>
          <span class="header-icon">
            <template v-if="sortStatus">
              <img
                v-if="sortStatus === 'asc'"
                class="tableHeaderIcon"
                src="@/assets/imgs/tableFilter/sort_asc_sel.svg"
              />
              <img
                v-else-if="sortStatus === 'desc'"
                class="tableHeaderIcon"
                src="@/assets/imgs/tableFilter/sort_desc_sel.svg"
              />
            </template>
            <img
              v-else-if="isFilterActive"
              class="tableHeaderIcon"
              src="@/assets/imgs/tableFilter/filter_sel.png"
            />
            <img
              v-else-if="isShowDialog"
              class="tableHeaderIcon"
              src="@/assets/imgs/tableFilter/add-on.svg"
            />
            <img v-else class="tableHeaderIcon" src="@/assets/imgs/tableFilter/add.svg" />
          </span>
        </div>
      </template>

      <div class="table-filter-content">
        <div class="section-block sort-section">
          <div class="section-header">
            <img class="headerIcon" src="@/assets/imgs/tableFilter/sort_icon.svg" />
            <span class="section-title">排序</span>
          </div>
          <div class="sort-options">
            <div
              class="sort-btn"
              :class="{ 'is-active': currentSort === 'asc' }"
              @click="handleSortClick('asc')"
              @mouseenter="hoverStatus.asc = true"
              @mouseleave="hoverStatus.asc = false"
            >
              <img
                v-if="currentSort === 'asc' || hoverStatus.asc"
                class="sort-btn-icon"
                src="@/assets/imgs/tableFilter/sort-asc-on.svg"
              />
              <img v-else class="sort-btn-icon" src="@/assets/imgs/tableFilter/sort-asc.svg" />
              <span :class="{ 'text-active': currentSort === 'asc' }">升序</span>
            </div>
            <div
              class="sort-btn"
              :class="{ 'is-active': currentSort === 'desc' }"
              @click="handleSortClick('desc')"
              @mouseenter="hoverStatus.desc = true"
              @mouseleave="hoverStatus.desc = false"
            >
              <img
                v-if="currentSort === 'desc' || hoverStatus.desc"
                class="sort-btn-icon"
                src="@/assets/imgs/tableFilter/sort-desc-on.svg"
              />
              <img v-else class="sort-btn-icon" src="@/assets/imgs/tableFilter/sort-desc.svg" />
              <span :class="{ 'text-active': currentSort === 'desc' }">降序</span>
            </div>
          </div>
        </div>

        <div class="section-block filter-section">
          <div class="section-header">
            <img class="headerIcon" src="@/assets/imgs/tableFilter/filter.svg" />
            <span class="section-title">筛选</span>
            <div v-if="filterType === 'range'" class="headerFilterTips">请输入数字范围</div>
          </div>

          <div class="filter-input-box">
            <slot
              name="filter"
              :value="tempFilterValue"
              :setValue="(val) => (tempFilterValue = val)"
            >
              <div v-if="filterType === 'range'" class="filter-multip">
                <el-input
                  class="filter-multip-input"
                  v-model="tempFilterValue.min"
                  placeholder="请输入"
                />
                <span class="filter-multip-split">-</span>
                <el-input
                  class="filter-multip-input"
                  v-model="tempFilterValue.max"
                  placeholder="请输入"
                />
              </div>
              <el-input v-else v-model="tempFilterValue" placeholder="请输入关键词" clearable />
            </slot>
          </div>
        </div>

        <div class="divider"></div>

        <div class="footer-actions">
          <el-button class="btn-cancel" @click="handleClear">清 除</el-button>
          <el-button class="btn-confirm" type="primary" @click="handleConfirm">确 定</el-button>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, toRefs, reactive } from 'vue'
import { ElMessage } from 'element-plus' // 1. 引入 ElMessage

const props = defineProps({
  title: { type: String, default: '' },
  sortStatus: { type: String, default: '' },
  filterValue: { type: [String, Number, Object], default: '' },
  filterType: { type: String, default: 'input' }
})

const emit = defineEmits(['update:sortStatus', 'update:filterValue', 'change'])
const { sortStatus, filterValue } = toRefs(props)

const popoverRef = ref()
const isShowDialog = ref(false)
const currentSort = ref<string>('')
const tempFilterValue = ref<any>('')
const hoverStatus = reactive({ asc: false, desc: false })

const isFilterActive = computed(() => {
  if (props.filterType === 'range') {
    return (
      (filterValue.value?.min !== '' && filterValue.value?.min != null) ||
      (filterValue.value?.max !== '' && filterValue.value?.max != null)
    )
  }
  return !!filterValue.value
})

const onShow = () => {
  isShowDialog.value = true
  currentSort.value = sortStatus.value || ''
  if (props.filterType === 'range') {
    tempFilterValue.value = {
      min: filterValue.value?.min ?? '',
      max: filterValue.value?.max ?? ''
    }
  } else {
    tempFilterValue.value = filterValue.value
  }
}

const onHide = () => {
  isShowDialog.value = false
}

// 2. 修改 handleSortClick：点击排序时也进行范围校验
const handleSortClick = (type: string) => {
  currentSort.value = currentSort.value === type ? '' : type

  if (props.filterType === 'range') {
    const min = Number(tempFilterValue.value.min)
    const max = Number(tempFilterValue.value.max)
    // 只有当两个值都存在且为有效数字时才比较
    if (
      tempFilterValue.value.min !== '' &&
      tempFilterValue.value.max !== '' &&
      !isNaN(min) &&
      !isNaN(max)
    ) {
      if (min > max) {
        ElMessage.warning('最小值不能大于最大值')
        return
      }
    }
  }

  emit('update:sortStatus', currentSort.value)
  emit('update:filterValue', tempFilterValue.value)
  emit('change', { sort: currentSort.value, filter: tempFilterValue.value })
  popoverRef.value?.hide()
}

const handleClear = () => {
  currentSort.value = ''
  tempFilterValue.value = props.filterType === 'range' ? { min: '', max: '' } : ''

  emit('update:sortStatus', '')
  emit('update:filterValue', tempFilterValue.value)
  emit('change', { sort: '', filter: tempFilterValue.value })
  popoverRef.value?.hide()
}

// 3. 修改 handleConfirm：添加警告提示
const handleConfirm = () => {
  if (props.filterType === 'range') {
    const min = Number(tempFilterValue.value.min)
    const max = Number(tempFilterValue.value.max)

    if (
      tempFilterValue.value.min !== '' &&
      tempFilterValue.value.max !== '' &&
      !isNaN(min) &&
      !isNaN(max)
    ) {
      if (min > max) {
        ElMessage.warning('最小值不能大于最大值')
        return
      }
    }
  }

  emit('update:sortStatus', currentSort.value)
  emit('update:filterValue', tempFilterValue.value)
  emit('change', { sort: currentSort.value, filter: tempFilterValue.value })
  popoverRef.value?.hide()
}
</script>

<style lang="scss">
.table-filter-popper.el-popover {
  padding: 0 !important;
  border-radius: 8px;
  box-shadow: 0px 0px 20px 2px rgba(0, 31, 72, 0.11);
  border: none;
  min-width: 220px !important;
}
</style>

<style scoped lang="scss">
.header-trigger {
  cursor: pointer;
  display: inline-flex;
  align-items: center; /* 关键：确保垂直居中 */
  justify-content: center;
  height: 23px; /* 固定高度与文本行高一致，防止撑开 */
  line-height: 1; /* 重置行高，防止图标偏移 */
  user-select: none;

  .header-title {
    font-weight: 500;
    font-size: 14px;
    color: #666;
    line-height: 23px; /* 显式设置行高 */
    display: inline-block;
  }

  .header-icon {
    display: inline-flex; /* 这里的容器也需要 flex */
    align-items: center; /* 图标内部垂直居中 */
    height: 100%;
    margin-left: 4px;

    .tableHeaderIcon {
      width: 13px;
      height: 13px;
      display: block; /* 防止 img 产生基线间隙 */
    }
  }
}

/* 保持其他样式不变 */
.table-filter-content {
  background: #ffffff;
  box-sizing: border-box;
  border-radius: 8px;
  padding: 10px 15px;

  .section-header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;

    .headerIcon {
      width: 14px;
      height: 12px;
    }

    .section-title {
      margin-left: 8px;
      font-weight: 500;
      font-size: 14px;
      color: #333333;
    }

    .headerFilterTips {
      flex: 1 0 auto;
      margin-left: 16px;
      padding: 0 5px;
      height: 24px;
      background: #f2f6fc;
      border-radius: 5px;
      font-size: 12px;
      color: #999999;
      line-height: 24px;
      text-align: center;
    }
  }

  .section-block {
    margin-bottom: 16px;
  }

  .sort-options {
    display: flex;
    justify-content: space-between;

    .sort-btn {
      cursor: pointer;
      width: 84px;
      height: 32px;
      background: #ffffff;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      display: flex;
      align-items: center;
      color: #666;
      font-size: 14px;
      text-align: center;
      justify-content: center;

      .sort-btn-icon {
        width: 14px;
        height: 13px;
        margin-right: 6px;
      }

      &:hover {
        border-color: #0064ff;
        color: #0064ff;
      }

      &.is-active {
        background: #e9f1ff;
        border-color: #0064ff;

        .text-active {
          color: #0064ff;
        }
      }
    }
  }

  .filter-input-box {
    margin-top: 8px;

    .filter-multip {
      display: flex;
      align-items: center;
      justify-content: space-between;

      &-input {
        width: 84px;
      }

      &-split {
        color: #dcdfe6;
        margin: 0 5px;
      }
    }
  }

  .divider {
    height: 1px;
    background: #f0f0f0;
    margin: 0 -15px 10px -15px;
  }

  .footer-actions {
    display: flex;
    justify-content: space-between;
    padding-top: 4px;

    .btn-cancel {
      width: 84px;
      height: 32px;
      border-radius: 4px;
      color: #606266;
    }

    .btn-confirm {
      width: 84px;
      height: 32px;
      border-radius: 4px;
    }
  }
}
</style>
