import type { TableColumn } from '@/components/SWTable/src/table'
import { getImageUrl } from '@/utils'
import PlanType from '@/views/OA/new/components/planType.vue'
import { ElPopover, ElAvatar, ElImage, ElTag, ElLink } from 'element-plus'
import { DICT_TYPE, getDictLabel, getDictOptions } from '@/utils/dict'
import DefaultAvatar from '@/assets/svgs/defaultAvatar.svg'
import dayjs from 'dayjs'
// 测试0930-勿动
export function createDocumentationColumns(options: {
  getCategoryNameByCode: (code: string) => string | undefined
  onOpenDrawer?: (type: string, row: any) => void
}): TableColumn[] {
  const { getCategoryNameByCode, onOpenDrawer } = options

  const columns: TableColumn[] = [
    {
      prop: 'planStageGroup',
      label: '企划阶段',
      children: [
        { prop: 'planName', label: '企划名称', minWidth: 200, align: 'left', headerAlign: 'left' },
        {
          prop: 'planType',
          label: '企划类型',
          minWidth: 120,
          align: 'left',
          headerAlign: 'left',
          customRender: ({ row }) => (
            <div class="center flex">
              <PlanType planType={row?.planType} />
            </div>
          )
        },
        {
          prop: 'store',
          label: '店铺',
          minWidth: 200,
          showOverflowTooltip: false,
          align: 'left',
          headerAlign: 'left',
          customRender: ({ row }) => {
            const iconUrl = row?.channel ? getImageUrl(row.channel) : ''
            const hasIcon = !!iconUrl
            return (
              <div class="row-center">
                {hasIcon ? (
                  <img style="width: 14px; height: 14px; margin-right: 8px" src={iconUrl} alt="" />
                ) : null}
                <div
                  style={{
                    width: hasIcon ? 'calc(100% - 22px)' : '100%',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {row?.storeName || row?.store || '-'}
                </div>
              </div>
            )
          }
        },
        { prop: 'isCore', label: '产品等级', minWidth: 120, align: 'left', headerAlign: 'left' },
        {
          prop: 'planOrderDate',
          label: '计划下单日期',
          minWidth: 120,
          align: 'left',
          headerAlign: 'left'
        },
        {
          prop: 'planListDate',
          label: '计划上架日期',
          minWidth: 120,
          align: 'left',
          headerAlign: 'left'
        },
        {
          prop: 'remark',
          label: '迭代原因',
          minWidth: 140,
          showOverflowTooltip: false,
          align: 'left',
          headerAlign: 'left',
          customRender: ({ row }) => {
            const text = typeof row?.remark === 'string' ? row.remark : ''
            if (!text) {
              return <div>-</div>
            }
            return (
              <ElPopover class="box-item" placement="top" effect="dark">
                {{
                  default: () => <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>,
                  reference: () => <div class="ellipsis-content">{text}</div>
                }}
              </ElPopover>
            )
          }
        },
        {
          prop: 'category',
          label: '品类',
          minWidth: 120,
          align: 'left',
          headerAlign: 'left',
          customRender: ({ row }) => {
            const code = row?.category != null ? String(row.category) : ''
            // const display = row?.categoryName || getCategoryNameByCode(code) || row?.category || '-'
            const display = row?.completeCategoryName || '-'
            return <span>{display}</span>
          }
        },
        { prop: 'classCode', label: '系列', minWidth: 100, align: 'left', headerAlign: 'left' },
        {
          prop: 'productType',
          label: '类型',
          minWidth: 80,
          align: 'left',
          headerAlign: 'left',
          customRender: ({ row }) => (
            <span>
              {row?.productType == '0' ? '买手款' : row?.productType == '1' ? '定制款' : '-'}
            </span>
          )
        },
        {
          prop: 'salePoint',
          label: '卖点',
          minWidth: 150,
          showOverflowTooltip: false,
          align: 'left',
          headerAlign: 'left',
          customRender: ({ row }) => {
            if (!row?.salePoint) {
              return <div>-</div>
            }
            return (
              <ElPopover
                class="box-item"
                placement="top"
                effect="dark"
                dangerouslyUseHTMLString={true}
              >
                {{
                  default: () => <div innerHTML={row?.salePoint}></div>,
                  reference: () => <div class="ellipsis-content" innerHTML={row?.salePoint}></div>
                }}
              </ElPopover>
            )
          }
        }
      ]
    },
    {
      prop: 'sampleGroup',
      label: '打样',
      children: [
        {
          prop: 'patternMakerReply',
          label: '版师批复(试穿样)',
          minWidth: 170,
          align: 'left',
          headerAlign: 'left',
          customRender: ({ row }) => {
            const list = Array.isArray(row?.patternMakerReply) ? row.patternMakerReply : []
            if (!list.length) return <span>-</span>
            const statusText = (s: any) => (s === 4 ? '通过' : '-')
            return (
              <div class="flex flex-col items-start">
                {list.map((it: any, idx: number) => (
                  <div class="overflow-hidden text-ellipsis w-full" key={idx}>
                    {(it?.supplierName || '-') + '：' + statusText(it?.status)}
                  </div>
                ))}
              </div>
            )
          }
        },
        {
          prop: 'supplyReply',
          label: '供应链批复(报价核价)',
          minWidth: 180,
          headerAlign: 'left',
          align: 'left',
          customRender: ({ row }) => {
            const list = Array.isArray(row?.supplyReply) ? row.supplyReply : []
            if (!list.length) return <span>-</span>
            const statusText = (s: any) => (s === 4 ? '通过' : '-')
            return (
              <div class="flex flex-col items-start">
                {list.map((it: any, idx: number) => (
                  <div class="overflow-hidden text-ellipsis w-full" key={idx}>
                    {(it?.supplierName || '-') + '：' + statusText(it?.status)}
                  </div>
                ))}
              </div>
            )
          }
        },
        {
          prop: 'designerReply',
          label: '设计师批复(齐色样)',
          minWidth: 180,
          headerAlign: 'left',
          align: 'left',
          customRender: ({ row }) => {
            const list = Array.isArray(row?.designerReply) ? row.designerReply : []
            if (!list.length) return <span>-</span>
            const statusText = (s: any) => (s === 4 ? '通过' : '-')
            return (
              <div class="flex flex-col items-start">
                {list.map((it: any, idx: number) => (
                  <div class="overflow-hidden text-ellipsis w-full" key={idx}>
                    {(it?.supplierName || '-') + '：' + statusText(it?.status)}
                  </div>
                ))}
              </div>
            )
          }
        },
        {
          prop: 'qaReply',
          label: 'QA批复',
          minWidth: 180,
          headerAlign: 'left',
          align: 'left',
          customRender: ({ row }) => {
            const list = Array.isArray(row?.qaReply) ? row.qaReply : []
            if (!list.length) return <span>-</span>
            const statusText = (s: any) => (s === 4 ? '通过' : '-')
            return (
              <div class="flex flex-col items-start">
                {list.map((it: any, idx: number) => (
                  <div class="overflow-hidden text-ellipsis w-full" key={idx}>
                    {(it?.supplierName || '-') + '：' + statusText(it?.status)}
                  </div>
                ))}
              </div>
            )
          }
        }
      ]
    },
    {
      prop: 'supplyChainGroup',
      label: '供应链',
      children: [
        {
          prop: 'productCostExcludingTax',
          label: '产品成本(不含税)[元]',
          minWidth: 180,
          align: 'right',
          headerAlign: 'right'
        },
        {
          prop: 'finishedProductPrice',
          label: '产品出厂价(含包装人工费)',
          minWidth: 200,
          align: 'right',
          headerAlign: 'right'
        },
        {
          prop: 'packagingManpowerNew',
          label: '包装人工费',
          minWidth: 120,
          align: 'right',
          headerAlign: 'right'
        },
        {
          prop: 'packagingCostNew',
          label: '包材费用',
          minWidth: 120,
          align: 'right',
          headerAlign: 'right'
        },
        {
          prop: 'supplierPaymentMethod',
          label: '付款方式',
          minWidth: 120,
          align: 'left',
          headerAlign: 'left',
          customRender: ({ row }) => {
            const raw = row?.supplierPaymentMethod
            if (raw == null || raw === '') return <span>-</span>
            const value = String(raw) || ''
            const label = getDictLabel(DICT_TYPE.SUPPLIER_PAYMENT_METHOD, value)
            return <span>{label || '-'}</span>
          }
        }
      ]
    },
    {
      prop: 'rndGroup',
      label: '产研',
      children: [
        {
          prop: 'basicInfoCompleteTime',
          label: '日期',
          minWidth: 180,
          align: 'left',
          headerAlign: 'left'
        },
        {
          prop: 'operateManageName',
          label: '产品负责人',
          minWidth: 120,
          align: 'left',
          headerAlign: 'left',
          customRender: ({ row }) => {
            const listRaw = row?.operateManagerList
            const list = Array.isArray(listRaw) ? listRaw.filter(Boolean) : []
            if (list.length) {
              return (
                <div class="flex flex-col items-start">
                  {list.map((it: any, idx: number) => (
                    <div
                      class="flex items-center"
                      key={idx}
                      style={{ marginTop: idx > 0 ? '4px' : '' }}
                    >
                      <ElAvatar
                        size={18}
                        src={it?.avatarOrigin || DefaultAvatar}
                        style="margin-right: 6px"
                      />
                      <span class="overflow-hidden text-ellipsis">{it?.name || '-'}</span>
                    </div>
                  ))}
                </div>
              )
            } else {
              return <span>-</span>
            }
          }
        },
        {
          prop: 'style',
          label: '风格',
          minWidth: 120,
          align: 'left',
          headerAlign: 'left',
          customRender: ({ row }) => {
            const raw = row?.style
            const value = typeof raw === 'string' ? raw.trim() : ''
            if (!value) return <span>-</span>

            const dictTypes = [
              DICT_TYPE.NP_SEASONAL_FG,
              DICT_TYPE.NP_SUSPENDERS_FG,
              DICT_TYPE.NP_SOCKS_FG,
              DICT_TYPE.NP_BRA_FG,
              DICT_TYPE.NP_MANPANTS_FG,
              DICT_TYPE.NP_WOMANPANTS_FG
            ]

            const toLabel = (codeOrLabel: string): string => {
              for (const dt of dictTypes) {
                const byValue = getDictLabel(dt, codeOrLabel)
                if (byValue) return byValue
                const opts = getDictOptions(dt)
                const byCode = opts.find((o: any) => String(o.code) === String(codeOrLabel))
                if (byCode?.label) return byCode.label
              }
              return codeOrLabel
            }

            return (
              <ElTag effect="light" size="small">
                {toLabel(value)}
              </ElTag>
            )
          }
        },
        {
          prop: 'useSeason',
          label: '季节属性',
          minWidth: 120,
          align: 'left',
          headerAlign: 'left',
          customRender: ({ row }) => {
            const raw = row?.useSeason
            let list: string[] = []
            if (Array.isArray(raw)) {
              list = raw.filter(Boolean)
            } else if (typeof raw === 'string' && raw.trim()) {
              const str = raw.trim()
              if (str.startsWith('[') && str.endsWith(']')) {
                try {
                  const parsed = JSON.parse(str)
                  if (Array.isArray(parsed)) list = parsed.filter(Boolean)
                } catch {}
              }
              if (!list.length) {
                list = str
                  .split(',')
                  .map((s) => s.replace(/^\s*["']?|["']?\s*$/g, ''))
                  .filter(Boolean)
              }
            }
            if (!list.length) return <span>-</span>
            return (
              <div class="flex flex-wrap gap-4px">
                {list.map((code: string, idx: number) => {
                  const label = getDictLabel(DICT_TYPE.NP_USE_SEASON, code) || code
                  return (
                    <ElTag effect="light" size="small" key={idx}>
                      {label}
                    </ElTag>
                  )
                })}
              </div>
            )
          }
        },
        {
          prop: 'picture',
          label: '图片【产研】',
          minWidth: 130,
          align: 'left',
          headerAlign: 'left',
          customRender: ({ row }) => {
            const imgs = row?.picture || row?.pictures || []
            const list = Array.isArray(imgs) ? imgs.filter(Boolean) : imgs ? [imgs] : []
            const url = list[0]
            return url ? (
              <ElImage
                src={url}
                fit="cover"
                style="width: 48px; height: 48px; border-radius: 4px; vertical-align: middle"
                previewSrcList={list}
                previewTeleported={true}
              />
            ) : (
              <span>-</span>
            )
          }
        },

        {
          prop: 'productName',
          label: '商品名称',
          minWidth: 140,
          align: 'left',
          headerAlign: 'left'
        },
        {
          prop: 'supplierName',
          label: '供应商名称',
          minWidth: 140,
          align: 'left',
          headerAlign: 'left'
        },
        { prop: 'productCode', label: '编码', minWidth: 120, align: 'left', headerAlign: 'left' },
        {
          prop: 'color',
          label: '颜色',
          minWidth: 180,
          align: 'left',
          headerAlign: 'left',
          customRender: ({ row }) => {
            const text = typeof row?.color === 'string' ? row.color : ''
            if (!text) {
              return <div>-</div>
            }
            return (
              <ElPopover class="box-item" placement="top" effect="dark">
                {{
                  default: () => <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>,
                  reference: () => <div class="whitespace-pre-wrap">{text}</div>
                }}
              </ElPopover>
            )
          }
        },
        { prop: 'size', label: '尺码', minWidth: 100, align: 'left', headerAlign: 'left' },
        {
          prop: 'minimumOrder',
          label: '最低起订量',
          minWidth: 120,
          align: 'left',
          headerAlign: 'left'
        },
        {
          prop: 'designerName',
          label: '买手/设计师',
          minWidth: 140,
          align: 'left',
          headerAlign: 'left',
          customRender: ({ row }) => {
            const name = row?.designerName
            const avatar = row?.designerAvatar
            const displayName = typeof name === 'string' ? name.trim() : ''
            if (!displayName) return <span>-</span>
            return (
              <div class="flex items-center">
                <ElAvatar size={18} src={avatar || DefaultAvatar} style="margin-right: 6px" />
                <span>{displayName}</span>
              </div>
            )
          }
        },
        {
          prop: 'establishTime',
          label: '新品建档时间',
          minWidth: 180,
          align: 'left',
          headerAlign: 'left'
        },
        {
          prop: 'materialRemark',
          label: '材料备注',
          minWidth: 140,
          align: 'left',
          headerAlign: 'left'
        },
        { prop: 'component', label: '面料成分', minWidth: 180, align: 'left', headerAlign: 'left' },
        {
          prop: 'componentSupply',
          label: '面料补充',
          minWidth: 180,
          align: 'left',
          headerAlign: 'left'
        },
        {
          prop: 'washLabel',
          label: '水洗标识',
          minWidth: 120,
          align: 'left',
          headerAlign: 'left',
          customRender: ({ row }) => {
            const imgs = row?.washLabel || []
            const list = Array.isArray(imgs) ? imgs.filter(Boolean) : imgs ? [imgs] : []
            const url = list[0]
            return url ? (
              <ElImage
                src={url}
                fit="cover"
                style="width: 48px; height: 48px; border-radius: 4px; vertical-align: middle"
                previewSrcList={list}
                previewTeleported={true}
              />
            ) : (
              <span>-</span>
            )
          }
        },
        {
          prop: 'tmPicture',
          label: '烫唛照片',
          minWidth: 120,
          align: 'left',
          headerAlign: 'left',
          customRender: ({ row }) => {
            const imgs = row?.tmPicture || []
            const list = Array.isArray(imgs) ? imgs.filter(Boolean) : imgs ? [imgs] : []
            const url = list[0]
            return url ? (
              <ElImage
                src={url}
                fit="cover"
                style="width: 48px; height: 48px; border-radius: 4px; vertical-align: middle"
                previewSrcList={list}
                previewTeleported={true}
              />
            ) : (
              <span>-</span>
            )
          }
        },
        {
          prop: 'executionStandards',
          label: '执行标准',
          minWidth: 160,
          align: 'left',
          headerAlign: 'left'
        },
        {
          prop: 'securityCategory',
          label: '安全类别',
          minWidth: 160,
          align: 'left',
          headerAlign: 'left'
        },
        { prop: 'material', label: '材质/功能', minWidth: 140, align: 'left', headerAlign: 'left' }
      ]
    },
    {
      prop: 'qaGroup',
      label: 'QA',
      children: [
        {
          prop: 'qaNodeStatus',
          label: '信息审核',
          minWidth: 120,
          align: 'left',
          headerAlign: 'left',
          customRender: ({ row }) => {
            const raw = row?.qaNodeStatus
            const num =
              typeof raw === 'number' ? raw : typeof raw === 'string' ? Number(raw.trim()) : NaN
            const statusMap: Record<number, string> = {
              0: '未开始',
              1: '通过',
              2: '拒绝',
              3: '进行中'
            }
            const text = statusMap[num as 0 | 1 | 2 | 3] ?? '-'
            return <span>{text}</span>
          }
        }
      ]
    },
    {
      prop: 'operationGroup',
      label: '运营',
      children: [
        {
          prop: 'operationalInformation',
          label: '竞品信息',
          minWidth: 100,
          align: 'left',
          headerAlign: 'left',
          customRender: ({ row }) => (
            <ElLink type="primary" onClick={() => onOpenDrawer?.('operationalInformation', row)}>
              查看{`(${row?.competitiveCount ?? 0})`}
            </ElLink>
          )
        },
        {
          prop: 'packageMethod',
          label: '包装方式',
          minWidth: 120,
          align: 'left',
          headerAlign: 'left'
        },
        {
          prop: 'packageCode',
          label: '包装编码',
          minWidth: 120,
          align: 'left',
          headerAlign: 'left'
        },
        {
          prop: 'monthCount',
          label: '营销策略-预估月销量',
          minWidth: 180,
          align: 'right',
          headerAlign: 'right'
        },
        {
          prop: 'firstOrderQuantity',
          label: '首批下单量',
          minWidth: 140,
          align: 'right',
          headerAlign: 'right'
        },
        {
          prop: 'planShootTime',
          label: '拍摄时间',
          minWidth: 180,
          align: 'left',
          headerAlign: 'left',
          customRender: ({ row }) => {
            const value = row?.planShootTime
            if (!value) return <span>-</span>
            const text = dayjs(value).format('YYYY-MM-DD')
            return <span>{text}</span>
          }
        }
      ]
    },
    {
      prop: 'procurementInfoGroup',
      label: '采购信息',
      children: [
        {
          prop: 'bigGoodsOrderTime',
          label: '大货下单时间',
          minWidth: 180,
          align: 'left',
          headerAlign: 'left'
        },
        {
          prop: 'firstBatchWarehousingTime',
          label: '首批到仓时间',
          minWidth: 180,
          align: 'left',
          headerAlign: 'left'
        },
        {
          prop: 'beforeProduceSampleTime',
          label: '产前样时间',
          minWidth: 180,
          align: 'left',
          headerAlign: 'left'
        },
        {
          prop: 'expectListArrivalTime',
          label: '预计清单到货时间',
          minWidth: 180,
          align: 'left',
          headerAlign: 'left'
        },
        {
          prop: 'procurementManagerName',
          label: '采购负责人',
          minWidth: 140,
          align: 'left',
          headerAlign: 'left',
          customRender: ({ row }) => {
            const listRaw = row?.procurementManagerList
            const list = Array.isArray(listRaw) ? listRaw.filter(Boolean) : []
            if (list.length) {
              return (
                <div class="flex flex-col items-start">
                  {list.map((it: any, idx: number) => (
                    <div
                      class="flex items-center"
                      key={idx}
                      style={{ marginTop: idx > 0 ? '4px' : '' }}
                    >
                      <ElAvatar
                        size={18}
                        src={it?.avatarOrigin || DefaultAvatar}
                        style="margin-right: 6px"
                      />
                      <span class="overflow-hidden text-ellipsis">{it?.name || '-'}</span>
                    </div>
                  ))}
                </div>
              )
            }
            return <span>-</span>
          }
        }
      ]
    }
  ]

  return columns
}
