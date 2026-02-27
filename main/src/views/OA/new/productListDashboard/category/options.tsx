import Icon from '@/components/Icon/src/Icon.vue'
import { useDashboard } from '@/store/modules/oaNew'
import { getDictLabel } from '@/utils/dict'
import { ElImage, ElPopover, ElProgress, ElTooltip, ProgressFn } from 'element-plus'

const dashboard = useDashboard()
if (dashboard.categoryList.length === 0) {
  dashboard.getCategoryList()
}

const progressColor: ProgressFn = (percentage: number) => {
  switch (true) {
    case percentage < 100:
      return '#0064FF'
    case percentage === 100:
      return '#349B34'
    default:
      return ''
  }
}

function progress(key) {
  return (row, _, cellValue) => {
    function computePercentage(row, col) {
      const res =
        col !== '--' && row.goodsQuantityTotal !== '--'
          ? Number(((col || 0) / (row.goodsQuantityTotal || 1)) * 100)
          : 0
      return res > 100 ? 100 : res
    }

    function progressFormat(percentage: number) {
      return `${Math.floor(percentage * 100) / 100}%`
    }

    return (
      <ElTooltip content={`实际完成时间：${row[key] ?? 0}`} disabled={cellValue < 1}>
        <ElProgress
          class={`${cellValue >= 1 ? '!color-#349B34' : cellValue === 0 ? '!color-#619CFC' : '!color-#0064ff'}`}
          percentage={computePercentage(row, cellValue ?? 0)}
          format={progressFormat}
          color={progressColor}
        />
      </ElTooltip>
    )
  }
}

function expectOnShelfTime(row, _, value) {
  const time = `${row.isOnShelf === '1' ? `实际：${row.actualOnShelfTime ? row.actualOnShelfTime.substring(0, 10) : '-'}` : `预计：${row.expectOnShelfTime ? row.expectOnShelfTime : '-'}`}`
  if (row.isTimeout === 0) return time

  return (
    <div class="flex items-center">
      <span>{time}</span>
      {h(
        ElPopover,
        { popperStyle: 'border: 0; width: max-content' },
        {
          default: () => (
            <div class="max-h-400px overflow-auto">
              {row.expectOnShelfInfoList.map((ele) => (
                <div
                  style={`color: ${ele.type === '提前' ? '#349B34' : '#EB3737'}`}
                  class="font-size-14px"
                >
                  {getDictLabel(DICT_TYPE.NP_TEMPLETE_PHASE, ele.phase)}：{ele.nodeName}
                  <span class="ml-4px">
                    {ele.type}
                    {ele.day}天
                  </span>
                </div>
              ))}
            </div>
          ),
          reference: () => (
            <Icon icon="ep:warning-filled" color="#EB3737" class="ml-4px" size={15} />
          )
        }
      )}
    </div>
  )
}

export const tableOptions: TableOption = [
  { label: '企划名称', prop: 'planName', minWidth: 130, fixed: 'left' },
  {
    label: '品类',
    prop: 'completeCategoryName',
    minWidth: 80,
    // transform: (col) => dashboard.categoryList.find((ele) => ele.code === col)?.name || '--'
  },
  { label: '系列', prop: 'classCode', minWidth: 100, transform: (col) => col || '--' },
  {
    label: '类型',
    prop: 'productType',
    transform: (col) => (col === '0' ? '买手款' : '定制款'),
    minWidth: 100
  },
  {
    label: '货品编码',
    prop: 'productCode',
    minWidth: 100,
    formatter: (_, __, value) => (value ? <b class="font-500">{value}</b> : '--')
  },
  {
    label: '设计图',
    prop: 'productPicture',
    minWidth: 88,
    formatter:(_, __, value ) => {
      if(value) return <div class="flex p10px"><ElImage  src={value} preview-src-list={[value || '']} fit={'contain'} preview-teleported={true} style="width:36px;height: 36px;z-index:999"/></div>
      else return '-'
    }
  },
  {
    label: '当前节点',
    prop: 'currentNodeName',
    minWidth: 270,
    formatter: (__, _, value: string) => (
      <div class="flex">
        {value.split(',').map((ele) => (
          <div
            class={`mr-10px px-16px py-4px ${ele === '已结束' ? 'bg-#66666620 color-#666666' : 'bg-#B7EEF6 color-#03A3B6'} rounded-14px`}
          >
            {ele}
          </div>
        ))}
      </div>
    )
  },
  {
    label: '进度分析(当前节点)',
    prop: 'progressAnalysis',
    minWidth: 220,
  },
  { label: '当前负责人', prop: 'personInChargeList', minWidth: 150 },
  { label: '企划创建时间', prop: 'enterpriseCreateTime', minWidth: 170 },
  {
    label: '产品设计阶段',
    prop: 'productDesignPhaseProgress',
    // formatter: progress('productDesignPhaseFinishTime'),
    minWidth: 230,
    // showOverFlowTooltip: false
  },
  {
    label: '产品准备阶段',
    prop: 'productPreparePhaseProgress',
    minWidth: 230,
    // formatter: progress('productPreparePhaseFinishTime'),
    // showOverFlowTooltip: false
  },
  {
    label: '产品下单阶段',
    prop: 'productOrderPhaseProgress',
    minWidth: 230,
    // formatter: progress('productOrderPhaseFinishTime'),
    // showOverFlowTooltip: false
  },
  { label: '企划设定上架时间', prop: 'planListDate', minWidth: 140, formatter: (_item) => _item.planListDate || '-' },
  {
    label: '上架时间',
    prop: 'expectOnShelfTime',
    minWidth: 170,
    formatter: expectOnShelfTime
  },
  {
    label: '是否上架',
    prop: 'isOnShelf',
    minWidth: 130,
  },
  // {
  //   label: '实际上架时间',
  //   prop: 'actualOnShelfTime',
  //   minWidth: 150,
  //   transform: (col) => col || '--'
  // }
]
