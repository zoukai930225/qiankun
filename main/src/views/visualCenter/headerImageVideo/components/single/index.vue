<template>
  <div class="table-container">
    <s-table
      ref="tableRef"
      show-loading
      :columns="columns"
      :fetch-params="fetchParams"
      :fetch="getSinglePage"
      :onSortChange="onSortChange"
      :auto-load="false"
      stripe
      height="550px"
    />
    <trend-line ref="trendLineRef" :select-options="columns.slice(2)" />
  </div>
</template>
<script lang="tsx" setup>
import { ref, nextTick, inject, ComputedRef } from 'vue'
import ImgView from './components/imgView.vue'
import Percent from './components/percent.vue'
import TrendLine from './components/trendLine.vue'
import { getSinglePage } from '@/api/visualCenter/headerImagevVideo'
import type { SearchParams } from '../type'
import { computed } from 'vue'

const searchParams = inject<ComputedRef<SearchParams>>('searchParams')

// 组合搜索参数和排序参数
const fetchParams = computed(() => {
  const params: any = { ...searchParams?.value }

  // 添加排序参数
  if (sortState.value.prop && sortState.value.order) {
    params.sortField = sortState.value.prop
    params.sortOrder = sortState.value.order === 'ascending' ? 'asc' : 'desc'
  }

  return params
})

const trendLineRef = ref()
const tableRef = ref()

// 排序状态
const sortState = ref({
  prop: '',
  order: ''
})

const openTrendDialog = (row) => {
  trendLineRef.value.open(row)
}

const onSortChange = async (sort) => {
  console.log('排序变化:', sort)

  sortState.value = {
    prop: sort.prop,
    order: sort.order || ''
  }

  await nextTick()
  // 重新获取数据
  if (tableRef.value) {
    tableRef.value.refresh(true)
  }
}

const columns = ref([
  {
    label: '内容标题',
    prop: 'content',
    minWidth: 350,
    showOverflowTooltip: false,
    fixed: 'left',
    customRender: ({ row }) => {
      return (
        <div class="flex items-center gap-10px text-left">
          <ImgView url={row.videoCoverUrl} />
          <div class="flex flex-col h-full title-content text-left items-start flex-1 w-0">
            <h3 title={row.contentTitle} class="text-14px font-noraml txt-ellipsis w-full">
              {row.contentTitle}
            </h3>
            <div class="txt-ellipsis text-12px text-color-['#666'] w-full">
              内容id：{row.contentId}
            </div>
            <el-button class="mt-0 mb-0" type="text" onClick={() => openTrendDialog(row)}>
              查看趋势图
            </el-button>
          </div>
        </div>
      )
    }
  },
  {
    label: '发布时间',
    prop: 'contentPublishTime',
    width: 180,
    sortable: true,
    align: 'left'
  },
  {
    label: '播放人数',
    prop: 'totalPlayUsers',
    width: 160,
    align: 'right',
    headerAlign: 'right',
    sortable: true,
    customRender: ({ row }) => {
      return (
        <div>
          <Percent percent={row.totalPlayUsers} trendPercent={row.totalPlayUsersCyclecrc} />
        </div>
      )
    }
  },
  {
    label: '播放次数',
    prop: 'playCount',
    width: 160,
    align: 'right',
    headerAlign: 'right',
    sortable: true,
    customRender: ({ row }) => {
      return (
        <div>
          <Percent percent={row.playCount} trendPercent={row.playCountCyclecrc} />
        </div>
      )
    }
  },
  {
    label: '完播率',
    prop: 'completionRate',
    width: 160,
    sortable: true,
    align: 'right',
    headerAlign: 'right',
    customRender: ({ row }) => {
      return (
        <div>
          <Percent percent={row.completionRate} trendPercent={row.completionRateCyclecrc} />
        </div>
      )
    }
  },
  {
    label: '人均停留时长(秒)',
    prop: 'avgWatchDurationSec',
    width: 180,
    align: 'right',
    headerAlign: 'right',
    sortable: true,
    customRender: ({ row }) => {
      return (
        <div>
          <Percent
            percent={row.avgWatchDurationSec}
            trendPercent={row.avgWatchDurationSecCyclecrc}
          />
        </div>
      )
    }
  },

  {
    label: '有效播放引导成交金额',
    prop: 'validPlayGmv',
    width: 200,
    align: 'right',
    headerAlign: 'right',
    sortable: true,
    customRender: ({ row }) => {
      return (
        <div>
          <Percent percent={row.validPlayGmv} trendPercent={row.validPlayGmvCyclecrc} />
        </div>
      )
    }
  },
  {
    label: '有效播放人数',
    prop: 'validPlayUsers',
    width: 160,
    align: 'right',
    headerAlign: 'right',
    sortable: true,
    customRender: ({ row }) => {
      return (
        <div>
          <Percent percent={row.validPlayUsers} trendPercent={row.validPlayUsersCyclecrc} />
        </div>
      )
    }
  },
  {
    label: '有效播放次数',
    prop: 'validPlayCount',
    width: 160,
    align: 'right',
    headerAlign: 'right',
    sortable: true,
    customRender: ({ row }) => {
      return (
        <div>
          <Percent percent={row.validPlayCount} trendPercent={row.validPlayCountCyclecrc} />
        </div>
      )
    }
  },
  {
    label: '有效播放率',
    prop: 'validPlayRate',
    width: 180,
    align: 'right',
    headerAlign: 'right',
    sortable: true,
    customRender: ({ row }) => {
      return (
        <div>
          <Percent percent={row.validPlayRate} trendPercent={row.validPlayRateCyclecrc} />
        </div>
      )
    }
  },
  {
    label: '完整播放人数',
    prop: 'completePlayUsers',
    width: 160,
    align: 'right',
    headerAlign: 'right',
    sortable: true,
    customRender: ({ row }) => {
      return (
        <div>
          <Percent percent={row.completePlayUsers} trendPercent={row.completePlayUsersCyclecrc} />
        </div>
      )
    }
  },
  {
    label: '完整播放次数',
    prop: 'completePlayCount',
    width: 180,
    align: 'right',
    headerAlign: 'right',
    sortable: true,
    customRender: ({ row }) => {
      return (
        <div>
          <Percent percent={row.completePlayCount} trendPercent={row.completePlayCountCyclecrc} />
        </div>
      )
    }
  },

  {
    label: '有效播放引导成交人数',
    prop: 'validPlayPaidUsers',
    width: 200,
    align: 'right',
    headerAlign: 'right',
    sortable: true,
    customRender: ({ row }) => {
      return (
        <div>
          <Percent percent={row.validPlayPaidUsers} trendPercent={row.validPlayPaidUsersCyclecrc} />
        </div>
      )
    }
  },
  // 有效播放引导成交件数
  {
    label: '有效播放引导成交件数',
    prop: 'validPlayPaidItems',
    width: 200,
    align: 'right',
    headerAlign: 'right',
    sortable: true,
    customRender: ({ row }) => {
      return (
        <div>
          <Percent percent={row.validPlayPaidItems} trendPercent={row.validPlayPaidItemsCyclecrc} />
        </div>
      )
    }
  }
])

function refresh() {
  if (tableRef.value) {
    resetSort()
    tableRef.value.refresh(true)
  }
  // 确保表头吸顶样式生效
  // nextTick(() => {
  //   const tableHeader = document.querySelector('.el-table__header-wrapper') as HTMLElement
  //   if (tableHeader) {
  //     tableHeader.style.position = 'sticky'
  //     tableHeader.style.top = '0'
  //     tableHeader.style.zIndex = '10'
  //     tableHeader.style.backgroundColor = '#fafafa'
  //   }
  // })
}

// 重置排序
function resetSort() {
  sortState.value = {
    prop: '',
    order: ''
  }
}

defineExpose({
  refresh
})
</script>
<style scoped lang="scss">
.table-container {
  height: 100%; // 设置容器高度，减去其他元素的高度
  overflow: auto;
  position: relative;

  // 确保表格在容器内正确显示
  :deep(.el-table) {
    height: 100%;
  }
}

:deep(.txt-ellipsis),
.txt-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.el-table) {
  .el-table__row .el-table__cell {
    padding: 12px 0;
  }

  .txt-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .title-content {
    .el-button {
      margin: 0;
      padding: 0;
    }
  }

  // 表头吸顶样式
  .el-table__header-wrapper {
    position: sticky !important;
    top: 0 !important;
    z-index: 10 !important;
    background: #fafafa !important;
  }

  // 确保表头在滚动时保持可见
  .el-table__header {
    background: #fafafa !important;
  }

  // 表头单元格样式
  .el-table__header th.el-table__cell {
    background: #fafafa !important;
    border-bottom: 1px solid #ebeef5 !important;
  }

  // 确保表格内容区域可以滚动
  .el-table__body-wrapper {
    overflow-y: auto;
    // max-height: calc(100vh - 432px); // 设置最大高度，为表头和其他元素留出空间
  }
}

// 全局样式确保表头吸顶
:deep(.SWCommonTable) {
  .el-table__header-wrapper {
    position: sticky !important;
    top: 0 !important;
    z-index: 10 !important;
  }
}
</style>
