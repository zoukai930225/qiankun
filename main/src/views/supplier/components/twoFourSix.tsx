import {
  ElAvatar,
  ElButton,
  ElImage,
  ElProgress,
  ElScrollbar,
  ElTag,
  ElTooltip
} from 'element-plus/es'
import defaultImg from '@/assets/imgs/supplier/defaultImg.svg'
import DefaultAvatar from '@/assets/imgs/avatar_logo.png'
import { handleCopyCode } from '@/utils/copyText'
import { isImage } from '@/utils/file'
import SwTextTooltip from '@/components/SwTextTooltip/src/SwTextTooltip.vue'
import { h } from 'vue'
import { getImageUrl, getPermission } from '@/utils'
import { getDictLabel } from '@/utils/dict'

export function goodsNosFormatter(row, _, value) {
  if (row?.key && row?.key === 'sumRow') {
    return ''
  }

  if (!value && value !== 0) return '--'

  const goodsNos = typeof value === 'string' ? value.replace(/、/, ',').split(',') : value
  if (goodsNos?.length === 0) return '--'
  const dom = (
    <SwTextTooltip
      v-slots={{
        content: () => (
          <ElScrollbar class="overflow-auto light-scroll" max-height={120}>
            {goodsNos?.map((item) => (
              <div>
                <ElButton
                  class={'copy-btn btn-in-table__light'}
                  link
                  onClick={() => handleCopyCode(item)}
                >
                  {item}
                </ElButton>
              </div>
            ))}
          </ElScrollbar>
        )
      }}
      popperClass="w-[min-content] sw-text-tooltip"
      placement="right"
    >
      {goodsNos?.map((item) => (
        <ElButton class={'copy-btn btn-in-table__light'} link onClick={() => handleCopyCode(item)}>
          {item}
        </ElButton>
      ))}
    </SwTextTooltip>
  )
  return <div style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden">{dom}</div>
}

export function goodsNosTooltip({ row }) {
  if (row?.key && row?.key === 'sumRow') {
    return ''
  }
  row.goodsNos = row.goodsNos ? row.goodsNos : row.goodsCode
  const goodsNos =
    typeof row.goodsNos === 'string' ? row.goodsNos.replace(/、/g, ',').split(',') : row.goodsNos
  return (
    <div class="max-h-120px overflow-auto light-scroll">
      {goodsNos?.map((item) => (
        <div>
          <ElButton class={'copy-btn light'} link onClick={() => handleCopyCode(item)}>
            {item}
          </ElButton>
        </div>
      ))}
    </div>
  )
}

export function imgUrl(row, _, cellValue) {
  if (row?.key && row?.key === 'sumRow') {
    return ''
  }
  return h(
    ElImage,
    {
      src: cellValue || defaultImg,
      fit: 'contain',
      previewSrcList: isImage(cellValue) ? [cellValue] : [],
      previewTeleported: true,
      lazy: true,
      hideOnClickModal: true,
      class: '!flex items-center w-36px h-36px my-2px'
    },
    {
      error: () => h('img', { src: defaultImg, class: 'w-40px h-40px' })
    }
  )
}

export function person(row, _, cellValue) {
  if (row?.key && row?.key === 'sumRow') {
    return ''
  }

  if (typeof cellValue === 'string') {
    return (
      <div class="orderHandler">
        <div class="orderHandler-item">
          <ElAvatar class="mr8px el-avatar" size={18} src={DefaultAvatar} />
          <div class="name">{cellValue}</div>
        </div>
      </div>
    )
  }

  if (cellValue) {
    return (
      <div class="orderHandler">
        <div class="orderHandler-item">
          <ElAvatar
            class="mr8px el-avatar"
            size={18}
            src={cellValue?.avatarOrigin || DefaultAvatar}
          />
          <div class="name">{cellValue?.name}</div>
        </div>
      </div>
    )
  } else return '系统操作'
}

export function statusDom(statusOps: any[]) {
  return (row, _, cellValue) => {
    if (row?.key && row?.key === 'sumRow') {
      return ''
    }
    const col = statusOps.find((ele) => ele.value === cellValue)
    if (col) {
      const style = `color: ${col?.color};border: 0;`
      return (
        <ElTag round color={col?.bg} hit={false} effect="dark" style={style} disable-transitions>
          {col?.label}
        </ElTag>
      )
    } else {
      return '--'
    }
  }
}

export function finishGoodsQuantityTotalDom(sumKey: string) {
  function computePercentage(row, col) {
    const res =
      col !== '--' && row[sumKey] !== '--' ? Number(((col || 0) / (row[sumKey] || 1)) * 100) : 0
    return res > 100 ? 100 : res
  }

  function progressFormat(percentage: number) {
    return `${Math.floor(percentage * 100) / 100}%`
  }

  return (row, _, cellValue = 0) => {
    if (row?.key && row?.key === 'sumRow') {
      return ''
    }
    const percentage = computePercentage(row, cellValue ?? 0)

    return (
      <ElTooltip content={`已完成数量：${cellValue ?? 0}`} show-after={100}>
        <ElProgress percentage={percentage} format={progressFormat} />
      </ElTooltip>
    )
  }
}

export function copyBtn(row, __, cellValue) {
  if (row?.key && row?.key === 'sumRow') {
    return ''
  }
  return cellValue ? (
    <ElButton link class="copy-btn text1" onClick={() => handleCopyCode(cellValue)}>
      {cellValue}
    </ElButton>
  ) : (
    <span class="py-10px">--</span>
  )
}

export function persons(row, _, value) {
  if (row?.key && row?.key === 'sumRow') {
    return ''
  }
  if (value && value.length) {
    return (
      <div class="orderHandler">
        <div class="orderHandler-item">
          <ElAvatar class="avatar" size={18} src={value[0]?.avatarOrigin || DefaultAvatar}>
            {value[0].name || value[0].userName}
          </ElAvatar>
          <div class="name">{value[0].name || value[0].userName}</div>
        </div>

        <ElTooltip
          v-slots={{
            content: () => (
              <div class="orderHandler">
                {(value as any[])
                  .filter((_, index) => index > 0)
                  .map((item) => (
                    <div class="orderHandler-item in-tooltip">
                      <ElAvatar
                        class="avatar"
                        size={18}
                        src={item?.avatarOrigin || DefaultAvatar}
                      />
                      <div class="name" style="color: #fff ">
                        {item?.name || item.userName}
                      </div>
                    </div>
                  ))}
              </div>
            )
          }}
          showAfter={200}
        >
          {value.length > 1 ? (
            <ElTag type="info" size="small" class="ml-4px cursor-default">
              +{value.length - 1}
            </ElTag>
          ) : (
            ''
          )}
        </ElTooltip>
      </div>
    )
  } else {
    return '--'
  }
}

export function easyBtnGroup(btns: any[]) {
  const permissionList = getPermission()

  return (
    <div class="ml-12px flex">
      {btns
        .filter(
          (ele) =>
            (permissionList.includes(ele.permission) || !ele.permission) &&
            (ele.page === undefined || ele.page)
        )
        .map((options) =>
          options.component ? (
            options.component
          ) : (
            <ElButton
              type={options.type}
              onClick={options.onClick}
              loading={options.loading}
              plain={options?.plain}
            >
              {!options.loading ? (
                options?.icon ? (
                  <span class="mr-4px">{options?.icon}</span>
                ) : null
              ) : null}
              {options.label}
            </ElButton>
          )
        )}
    </div>
  )
}

export function fullPageLoading(text: string) {
  const loading = ElLoading.service({
    text
  })

  return loading
}

export function channel(__, _, value) {
  return (
    <div class="flex items-center">
      <img src={getImageUrl(value)} class="w-14px mr-6px" />
      <span>{getDictLabel(DICT_TYPE.SYSTEM_PARAM_CHANNEL, value)}</span>
    </div>
  )
}
