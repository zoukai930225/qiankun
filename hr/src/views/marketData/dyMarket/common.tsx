
import GoodCard from './components/goodCard.vue'
import { formatRangeWithUnifiedUnit, formatPercentRange } from '@/utils'
import { ElTag } from 'element-plus'
export const senvenCloums = (shopFunc: (url: string) => void, formatFunc: (value: string | number) => string) => {
  return [
    {
      label: '统计日排名',
      prop: 'ranks',
      width: 120,
      align: 'center',
      fixed: 'left',
      sortable: true
    },
    {
      label: '商品',
      prop: 'goodsId',
      minWidth: 200,
      customRender: ({ row }: any) => {
        return (
          <div class="flex items-center">
            <el-popover placement="right" width={348} trigger="hover" showArrow={false} offset={20}>
              {{
                reference: () => (
                  <div class="mr-8px">
                    <img class="w-42px h-42px rounded-4px" src={row.imageUrl} />
                  </div>
                ),
                default: () => (
                  <GoodCard
                    good={{
                      materialName: row.name || '-',
                      materialId: row.goodsId,
                      goodsImage: row.imageUrl,
                      channel: row.channel || '',
                      shopUrl: row.productDetailH5Url
                    }}
                  />
                )
              }}
            </el-popover>
            <div
              class="text-#0064ff text-14px leading-20px truncate cursor-pointer max-w-240px"
              onClick={() => shopFunc(row.productDetailH5Url)}
              title={row.name || '-'}
            >
              {row.name || '-'}
            </div>
          </div>
        )
      }
    }, {
      label: '商品关键词',
      prop: 'keyPointList',
      minWidth: 220,
      headerAlign: 'left',
      align: 'left',
      customRender: ({ row }: any) => {
        const list: string[] = String(row.keyPointList || '')
          .split(/[，,、\s]+/)
          .map((s) => s.trim())
          .filter(Boolean)
        if (!list.length) return <span>-</span>
        return (
          <div class="flex gap-8px flex-wrap">
            {list.map((item, index) => (
              <ElTag key={index} color="#EFF2FB">
                <span style={{ color: '#717DDF' }}>{item}</span>
              </ElTag>
            ))}
          </div>
        )
      }
    }, {
      label: '店铺',
      prop: 'shopName',
      minWidth: 180,
      showOverflowTooltip: true,
      align: 'left',
      headerAlign: 'left',
      customRender: ({ row }: any) => {
        return (
          <div class="flex items-center cursor-pointer" onClick={() => shopFunc(row.shopUrl)}>
            {row.shopImage ? <img class="w-18px h-18px mr-8px" src={row.shopImage} /> : null}
            <div class="truncate flex-1">{row.shopTitle || row.shopName || '-'}</div>
          </div>
        )
      }
    },
    {
      label: '用户支付金额',
      prop: 'newPayCnt',
      minWidth: 160,
      align: 'center',
      customRender: ({ row }: any) => (
        <span>
          {formatFunc(
            formatRangeWithUnifiedUnit(row.newPayCnt, { inputUnit: 'fen' })
          )}
        </span>
      )
    },
    {
      label: '点击次数',
      prop: 'productClickCnt',
      minWidth: 150,
      align: 'center',
      customRender: ({ row }: any) => (
        <span>{formatFunc(formatRangeWithUnifiedUnit(row.productClickCnt))}</span>
      )
    },
    {
      label: '成交件数',
      prop: 'payComboCnt',
      minWidth: 150,
      align: 'center',
      customRender: ({ row }: any) => (
        <span>{formatFunc(formatRangeWithUnifiedUnit(row.payComboCnt))}</span>
      )
    },
    {
      label: '点击成交转换率',
      prop: 'productClickPayCntRatio',
      minWidth: 170,
      align: 'center',
      customRender: ({ row }: any) => <span>{formatPercentRange(row.productClickPayCntRatio)}</span>
    }
  ]
}