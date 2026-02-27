import LineAvatar from "@/components/template/table/components/lineAvatar.vue";
import { PageItem, Screen } from '@/components/template/config/type';
import dayjs from "dayjs";
import LineImage from "@/components/template/table/components/lineImage.vue";
import {  ElButton,  ElScrollbar, } from 'element-plus/es'
import SwTextTooltip from '@/components/SwTextTooltip/src/SwTextTooltip.vue'
import { handleCopyCode } from '@/utils/copyText'
import LineReveals from '@/components/template/table/components/lineReveals.vue'
import {ScrollSelect} from "@/components/ScrollSelect/index";
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { getInfoBySku2 } from '@/api/supplier/purchase'
import { checkPermi } from "@/utils/permission";

// 查询结构
export class SearchItem {
  // khzq: string = dayjs().add(-1, 'month').format('YYYY-MM');
};

// 表格数据结构
export class DataItem {
  id: string = '';
  goodsId: string = '' // 商品ID
  goodsName: string = ''; // 货品名称
  goodsNo: string = '' // 货品编码
  composition: string = ''// 面料成分
  className: string = '' // ERP货品分类
  alias: string = '' // 货品别名
  createTime: string = '' // 货品创建时间
  executionStandards: string = '' // 执行标准
  securityTechnologyCategory: string = '' // 安全技术类别
  category: string = '' // 类目
  level: string = '' // 商品等级
  productionCycle: string = '' // 生产周期
  sex: string = '' // 性别
  season: string = '' // 季节
  year: string = ''// 年份
  supplierIds: Array<string> = [] // 货品供应商
  userIds: Array<string> = [] // 跟单人员 
  outOfStock:number = 0 // 下架状态
  mainImgUrl: string = '' //商品图片
  iterateStyle: string = '' //原编码
  series: string = '' //系列
  goodsType: string = '' //类型
  productType: string = '' // 产品类型
  useObject: string = '' // 适用对象
  planTime: string = '' //企划时间
  labelPrice: string = '' // 标签价
  extraComposition: string = '' //补充成分
  skuNo: string = '' // SKU编码
  imgUrl: string = '' // 商品图片
  specName: string = '' // 规格名称
  specCode: string = '' // 规格编码
  craft: string = '' // 工艺
  material: string = '' // 材质
  barcode: string = '' // 主条码
  iterateCode: string = '' // 迭代码
  skuOutOfStock: number = 0 // 下架状态
  goodsCreateTime: string = '' // 货品创建时间
};

// 通用入参
export const usePage = (params: any = {}) => {

  const route = useRoute();

  // 外部组件入参
  const { userInfo } = params;

  // 模板必备变量(不可修改，按需追加，自行导出使用)
  const dataList = ref<Array<DataItem>>([]), stateInfo = ref<any>({}), statistics = ref<any>({});

  const searchData = ref<SearchItem>({ ...new SearchItem() }), loading = ref<boolean>(false), page = ref<PageItem>({ ...new PageItem() });

  // 查询配置(必配)
  const scheme = computed(() => ([
    { field: 'sku', 
      label: 'SKU编码' ,
      isCustom: true,
      customRender: (_item) => <ScrollSelect  api={getInfoBySku2} item-label-key="sku" item-value-key="sku" selectKey="sku" multiple={true} clearable />
    },{
      field: 'outOfStocks',
      label: '下架状态',
      component: 'Select',
      options: getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_WHETHER, true),
      componentProps: {
        multiple: true,
        clearable: true,
      }
    },
  ]));

  // 状态筛选(非必配)
  const screen = computed(() => ({
    // ...new Screen({
    //   field: 'sftb',
    //   label: '填报状态:',
    //   options: [{ label: '已填报', value: 1 }, { label: '未填报', value: 0 }],
    //   props: {}
    // })
  }));

  // 操作配置(非必配，默认新增fun为add，内部已处理直接打开对应抽屉)
  const btns = computed(() => ([
    // { fun: 'board', txt: '数据看板', disabled: () => !dataList?.value?.length },
    // { fun: 'seal', txt: '数据封版', disabled: () => !userInfo.value.isHrbp },
    // { fun: 'solution', txt: '数据解封', disabled: () => !userInfo.value.isManagement },
    // { fun: 'export', txt: '导出', type: 'primary', api: `/api/employeeMonthlyAssessment/exportList`, method: 'downloadPost', exportName: '月度考核' },
  ]));

  // 表格配置(非必配)
  const column = computed(() => ([
    { field: 'categoryDisplay', title: '类目', minWidth: 200, fixed: 'left' },
    { field: 'imgUrl', title: '图片', minWidth: 90, isCustom: true, customRender: (_item) => <LineImage urls={_item.imgUrl} /> },
    { field: 'goodsName', title: '货品名称', minWidth: 130 },
    { field: 'goodsNo', title: '货品编码', minWidth: 130,isCustom: true, customRender:(_item) => {
      const goodsNos = typeof _item.goodsNo === 'string' ? _item.goodsNo.replace(/、/, ',').split(',') : _item.goodsNo
      if (goodsNos?.length === 0) return <span>--</span>
      const dom = (
          <SwTextTooltip
            v-slots={{
              content: () => (
                <ElScrollbar class="overflow-auto light-scroll" max-height={120}>
                  {goodsNos?.map((item) => (
                    <div>
                      <ElButton
                        class={'copy-btn '}
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
              <ElButton class={'copy-btn'} link onClick={() => handleCopyCode(item)}>
                {item}
              </ElButton>
            ))}
          </SwTextTooltip>
        )
        return <div style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden">{dom}</div>
      }},
      { field: 'iterateStyle', title: '迭代款', minWidth: 130 },
      { field: 'skuNo', title: 'SKU编码', minWidth: 130, isCustom: true, customRender: (_item) => _item.skuNo? <ElButton class={'copy-btn text1'} link onClick={() => handleCopyCode(_item.skuNo)}>{_item.skuNo}</ElButton> : <span>--</span> },
      { field: 'iterateCode', title: '迭代码', minWidth: 130 },
      { field: 'specName', title: '规格名称', minWidth: 100 },
      { field: 'specCode', title: '规格码', minWidth: 100 },
      { field: 'skuOutOfStockDisplay', title: '下架状态', minWidth: 100 },
      { field: 'users', title: '跟单员', minWidth: 130, isCustom: true, customRender: (_item) => _item.users?.length ? <LineReveals optionsList={_item.users || []} noBg={true} optionParams={{ label: 'userName', value: 'userId',avatar: 'avatarOrigin' }}/> : <span>-</span> },
      { field: 'suppliersDisplay', title: '供应商', minWidth: 130 },
      { field: 'createTime', title: '创建时间', minWidth: 200 },
  ]));

  // 表格操作行(非必配，涉及抽屉编辑(edit)和详情(view)唯一且不可修改) 
  const handleColumn = computed(() => ([
    // { fun: 'view', txt: '详情' },
    { fun: 'edit', txt: '编辑',reveal: () => checkPermi(['ProductInfo:SKU:Edit']) },
    { fun: 'publish', txt: '上架', type: 'primary',reveal: (_item) => _item.skuOutOfStockDisplay === '下架款' && checkPermi(['ProductInfo:SKU:Publish']) },
    { fun: 'unpublish', txt: '下架', type: 'primary',reveal: (_item) => _item.skuOutOfStockDisplay === '上架款' && checkPermi(['ProductInfo:SKU:UnPublish']) },
  ]));

  const setRouterInfo = () => {
    let params: Object = {};
    const param: any = route.params;
    const query: any = route.query;
    Object.keys(param).forEach(key => {
      params[key] = param[key];
    });
    Object.keys(query).forEach(key => {
      params[key] = query[key];
    });
    if (Object.keys(params).length !== 0) {
      searchData.value = { ...searchData.value, ...params };
      const newUrl = window.location.href.replace(/\?.*$/, '');
      history.replaceState({}, '', newUrl)
    };
  };

  return { dataList, searchData, loading, page, scheme, btns, column, screen, stateInfo, statistics, handleColumn, setRouterInfo }
}

