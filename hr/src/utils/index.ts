import { cloneDeep, toNumber } from 'lodash-es'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import { DICT_TYPE, getDictLabel } from '@/utils/dict'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { usePermissionStore } from '@/store/modules/permission'
import { resetRouter } from '@/router'
import { deleteUserCache } from '@/hooks/web/useCache'
import { removeToken } from '@/utils/auth'
import router from '@/router';

const message = useMessage() // 消息弹窗

const tagsViewStore = useTagsViewStore()
const permissionStore = usePermissionStore()

export const linkPage = async (name: string, target: string | null = 'path', fun: Function = () => { }) => {
  await router.isReady();
  const routes = router.getRoutes();
  const tar: any = routes.find((rs: any) => rs.name === name);
  console.log(tar, routes);
  // console.log(tar, target ? (tar && tar[target] ? tar[target] : null) : (tar || {}));
  // return target ? (tar && tar[target] ? tar[target] : null) : (tar || {});
};

export const treeToArray = (tree: any, ids: string = 'id', childName: string = 'children') => {
  return tree.reduce((res: any, item: any) => {
    let target: any = cloneDeep({ ...item });
    target.children = target[childName]?.length ? target[childName] : [];
    target.id = target[ids] || '';
    target.parentId = target.parentId || '';
    const child: any = target?.children?.length ? target.children.map((chl: any) => {
      let obj: any = cloneDeep({ ...chl });
      obj.children = obj[childName]?.length ? obj[childName] : [];
      obj.id = obj[ids] || '';
      obj.parentId = item[ids] || '';
      return { ...obj };
    }) : [];
    return res.concat(
      { ...target },
      item[childName]?.length ? treeToArray(child, ids, childName) : []
    );
  }, []);
}

export const redrawTree = (nodes: Array<any>, value: any = null, pName: string = 'parentId', name: string = 'id') => {
  const arr: any = [];
  nodes.forEach((item: any) => {
    const index: number = arr.findIndex((ats: any) => ats[name] === item[name])
    if (item[pName] === value && index === -1) {
      const children = redrawTree(nodes, item[name], pName, name);
      if (children.length) {
        item.children = children;
      }
      arr.push(item);
    }
  });
  return arr;
};

export const getInfoLength = (value: string, size: string = '14px', name: string = 'span') => {
  let length: number = 0;
  let el: any = document.createElement(name);
  el.innerHTML = value;
  el.style = `position: absolute;z-index: -999999;font-size:${size}`;
  document.body.appendChild(el);
  length = Number(window.getComputedStyle(el).width.replaceAll('px', ''));
  el.remove();
  return length;
};

export const getvirtualLength = (
  list: Array<any>,
  name: string = 'name',
  unitName: string = 'unit',
  length: number = 130
) => {
  const lenNums: any = [length];
  list.forEach(li => {
    let sum = 0,
      strList: any = [];
    li.parameterList.forEach((pas: any) => {
      if (!isNaN(pas) && pas !== null && Number(pas) > sum) {
        sum = Number(pas);
      } else if (isNaN(pas)) {
        !!(pas?.length || 0) && strList.push(pas);
      }
    });
    let el: any = document.createElement('span');
    el.innerHTML = `${li[name]}：${sum}${li[unitName] ? '(' + li[unitName] + ')' : ''}`;
    el.style = 'position: absolute;z-index: -999999;';
    document.body.appendChild(el);
    lenNums.push(
      Number(window.getComputedStyle(el).width.replaceAll('px', ''))
    );
    el.remove();
    strList.forEach((si: any) => {
      let el: any = document.createElement('span');
      el.innerHTML = `${li[name]}：${si}${li[unitName] ? '(' + li[unitName] + ')' : ''}`;
      el.style = 'position: absolute;z-index: -999999;';
      document.body.appendChild(el);
      lenNums.push(
        Number(window.getComputedStyle(el).width.replaceAll('px', ''))
      );
      el.remove();
    });
  });
  const max = lenNums.sort((a: any, b: any) => {
    return Number(a) - Number(b);
  });
  return `${Math.ceil(max[max.length - 1]) + 35}px`;
};

export const isNumber = (value: any, precision: number = 0, regs: RegExp = /^[0-9]*[1-9][0-9]*$/, numRegs: RegExp = /^-?\d+(\.\d+)?$/, isCludedZero: boolean = true) => {
  let success: boolean = true;
  if (numRegs.test(String(Number(value || 0)))) {
    const nums: any = String(Number(value || 0)).split('.');
    const char: any = ['', null, undefined].includes(value) ? '' : String(value).charAt(0);
    if (regs.test(nums[0]) || (isCludedZero && nums[0] === '0' && char === '0' && Number(value) > 0)) {
      if (!!nums[1] && Number(nums[1] || 0) !== 0 && ((nums[1]?.length || 0) > precision)) {
        success = false;
      }
    } else {
      success = false;
    }
  } else {
    success = false;
  }
  return success;
};

export const filterObject = (obj: Object, fun: Function) => {
  Object.keys(obj).forEach((key: any) => {
    fun(key, obj[key]);
  });
};

export const formatterLabel = (list: any, value: string, name: string = 'label') => {
  const tar: any = list.find((li: any) => value === li.value);
  return tar[name] || ''
}

export const setImageInfo = (list: Array<any>, valueName: string = 'url', pointName: string = 'name') => {
  let str: string = '';
  if (list && list?.length) {
    str = list.map((ms: any) => `${ms[valueName]}?name=${ms[pointName]}`).join(',');
  }
  return str;
}

export const backImageInfo = (url: string | null, valueName: string = 'url', pointName: string = 'name') => {
  let arr: Array<any> = [];
  if (url && url?.length) {
    arr = url.split(',').map((item) => {
      const array = item.split('?name=');
      const obj: any = {};
      obj[valueName] = array[0];
      obj[pointName] = array[1];
      return obj;
    });
  }
  return arr;
}

export const menus = (menu: Array<any>) => {
  let list: Array<any> = [];
  menu?.forEach((ms: any) => {
    list.push(ms);
    if (ms?.children?.length) {
      list = [...list, ...menus(ms.children)];
    }
  });
  return list;
}

export const formatterValue = (row: any, name: string, value: string) => {
  return (row as any)[name] || value
}

export const consistency = (data: any, buckData: any, fun: Function) => {
  if (JSON.stringify(data) !== JSON.stringify(buckData)) {
    ElMessageBox.confirm('当前页面存在内容未保存，继续取消将清空已填写内容，是否继续取消？', '', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    }).then(() => {
      fun()
    }).catch(() => { })
  } else {
    fun()
  }
}

export const dataDetection = (
  list: Array<any>,
  name: string,
  msg: string,
  fun?: Function | null,
  pointer: string = 'index',
  tips?: Function
) => {
  let success: boolean = true
  list?.length &&
    list.some((li: any, index: number) => {
      const funBol: boolean = fun ? fun(li, index) : !li[name] || Number(li[name]) === 0
      if (funBol) {
        success = false
        const message: string = tips && tips(li) ? tips(li) : msg
        ElMessage({
          type: 'warning',
          message: message.replaceAll(
            `{${pointer}}`,
            pointer === 'index' ? String(index + 1) : li[pointer]
          ),
        })
        return true
      } else {
        return false
      }
    })
  return success
}

/**
 *
 * @param component 需要注册的组件
 * @param alias 组件别名
 * @returns any
 */
export const withInstall = <T>(component: T, alias?: string) => {
  const comp = component as any
  comp.install = (app: any) => {
    app.component(comp.name || comp.displayName, component)
    if (alias) {
      app.config.globalProperties[alias] = component
    }
  }
  return component as T & Plugin
}

/**
 * @param str 需要转下划线的驼峰字符串
 * @returns 字符串下划线
 */
export const humpToUnderline = (str: string): string => {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

/**
 * @param str 需要转驼峰的下划线字符串
 * @returns 字符串驼峰
 */
export const underlineToHump = (str: string): string => {
  if (!str) return ''
  return str.replace(/\-(\w)/g, (_, letter: string) => {
    return letter.toUpperCase()
  })
}

/**
 * 驼峰转横杠
 */
export const humpToDash = (str: string): string => {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

export const setCssVar = (prop: string, val: any, dom = document.documentElement) => {
  dom.style.setProperty(prop, val)
}

/**
 * 查找数组对象的某个下标
 * @param {Array} ary 查找的数组
 * @param {Functon} fn 判断的方法
 */
// eslint-disable-next-line
export const findIndex = <T = Recordable>(ary: Array<T>, fn: Fn): number => {
  if (ary.findIndex) {
    return ary.findIndex(fn)
  }
  let index = -1
  ary.some((item: T, i: number, ary: Array<T>) => {
    const ret: T = fn(item, i, ary)
    if (ret) {
      index = i
      return ret
    }
  })
  return index
}

export const trim = (str: string) => {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

/**
 * @param {Date | number | string} time 需要转换的时间
 * @param {String} fmt 需要转换的格式 如 yyyy-MM-dd、yyyy-MM-dd HH:mm:ss
 */
export function formatTime(time: Date | number | string, fmt: string) {
  if (!time) return ''
  else {
    const date = new Date(time)
    const o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'H+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      S: date.getMilliseconds()
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (const k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
        )
      }
    }
    return fmt
  }
}

/**
 * 生成随机字符串
 */
export function toAnyString() {
  const str: string = 'xxxxx-xxxxx-4xxxx-yxxxx-xxxxx'.replace(/[xy]/g, (c: string) => {
    const r: number = (Math.random() * 16) | 0
    const v: number = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString()
  })
  return str
}

/**
 * 首字母大写
 */
export function firstUpperCase(str: string) {
  return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
}

export const generateUUID = () => {
  if (typeof crypto === 'object') {
    if (typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID()
    }
    if (typeof crypto.getRandomValues === 'function' && typeof Uint8Array === 'function') {
      const callback = (c: any) => {
        const num = Number(c)
        return (num ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (num / 4)))).toString(
          16
        )
      }
      return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, callback)
    }
  }
  let timestamp = new Date().getTime()
  let performanceNow =
    (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let random = Math.random() * 16
    if (timestamp > 0) {
      random = (timestamp + random) % 16 | 0
      timestamp = Math.floor(timestamp / 16)
    } else {
      random = (performanceNow + random) % 16 | 0
      performanceNow = Math.floor(performanceNow / 16)
    }
    return (c === 'x' ? random : (random & 0x3) | 0x8).toString(16)
  })
}

/**
 * element plus 的文件大小 Formatter 实现
 *
 * @param row 行数据
 * @param column 字段
 * @param cellValue 字段值
 */
// @ts-ignore
export const fileSizeFormatter = (row, column, cellValue) => {
  const fileSize = cellValue
  const unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const srcSize = parseFloat(fileSize)
  const index = Math.floor(Math.log(srcSize) / Math.log(1024))
  const size = srcSize / Math.pow(1024, index)
  const sizeStr = size.toFixed(2) //保留的小数位数
  return sizeStr + ' ' + unitArr[index]
}

/**
 * 将值复制到目标对象，且以目标对象属性为准，例：target: {a:1} source:{a:2,b:3} 结果为：{a:2}
 * @param target 目标对象
 * @param source 源对象
 */
export const copyValueToTarget = (target: any, source: any) => {
  const newObj = Object.assign({}, target, source)
  // 删除多余属性
  Object.keys(newObj).forEach((key) => {
    // 如果不是target中的属性则删除
    if (Object.keys(target).indexOf(key) === -1) {
      delete newObj[key]
    }
  })
  // 更新目标对象值
  Object.assign(target, newObj)
}

/**
 * 获取链接的参数值
 * @param key 参数键名
 * @param urlStr 链接地址，默认为当前浏览器的地址
 */
export const getUrlValue = (key: string, urlStr: string = location.href): string => {
  if (!urlStr || !key) return ''
  const url = new URL(decodeURIComponent(urlStr))
  return url.searchParams.get(key) ?? ''
}

/**
 * 获取链接的参数值（值类型）
 * @param key 参数键名
 * @param urlStr 链接地址，默认为当前浏览器的地址
 */
export const getUrlNumberValue = (key: string, urlStr: string = location.href): number => {
  return toNumber(getUrlValue(key, urlStr))
}

/**
 * 构建排序字段
 * @param prop 字段名称
 * @param order 顺序
 */
export const buildSortingField = ({ prop, order }) => {
  return { field: prop, order: order === 'ascending' ? 'asc' : 'desc' }
}

// ========== NumberUtils 数字方法 ==========

/**
 * 数组求和
 *
 * @param values 数字数组
 * @return 求和结果，默认为 0
 */
export const getSumValue = (values: number[]): number => {
  return values.reduce((prev, curr) => {
    const value = Number(curr)
    if (!Number.isNaN(value)) {
      return prev + curr
    } else {
      return prev
    }
  }, 0)
}

// ========== 通用金额方法 ==========

/**
 * 将一个整数转换为分数保留两位小数
 * @param num
 */
export const formatToFraction = (num: number | string | undefined): string => {
  if (typeof num === 'undefined') return '0.00'
  const parsedNumber = typeof num === 'string' ? parseFloat(num) : num
  return (parsedNumber / 100.0).toFixed(2)
}

/**
 * 将一个数转换为 1.00 这样
 * 数据呈现的时候使用
 *
 * @param num 整数
 */
// TODO @芋艿：看看怎么融合掉
export const floatToFixed2 = (num: number | string | undefined): string => {
  let str = '0.00'
  if (typeof num === 'undefined') {
    return str
  }
  const f = formatToFraction(num)
  const decimalPart = f.toString().split('.')[1]
  const len = decimalPart ? decimalPart.length : 0
  switch (len) {
    case 0:
      str = f.toString() + '.00'
      break
    case 1:
      str = f.toString() + '0'
      break
    case 2:
      str = f.toString()
      break
  }
  return str
}

/**
 * 将一个分数转换为整数
 * @param num
 */
// TODO @芋艿：看看怎么融合掉
export const convertToInteger = (num: number | string | undefined): number => {
  if (typeof num === 'undefined') return 0
  const parsedNumber = typeof num === 'string' ? parseFloat(num) : num
  // TODO 分转元后还有小数则四舍五入
  return Math.round(parsedNumber * 100)
}

/**
 * 元转分
 */
export const yuanToFen = (amount: string | number): number => {
  return convertToInteger(amount)
}

/**
 * 分转元
 */
export const fenToYuan = (price: string | number): string => {
  return formatToFraction(price)
}

/**
 * 计算环比
 *
 * @param value 当前数值
 * @param reference 对比数值
 */
export const calculateRelativeRate = (value?: number, reference?: number) => {
  // 防止除0
  if (!reference) return 0

  return ((100 * ((value || 0) - reference)) / reference).toFixed(0)
}

// 统一的数字单位格式化（万/亿），保留两位小数并去掉末尾无效0
export const formatNumberWithUnit = (
  input: string | number,
  options: { inputUnit?: 'fen' | 'yuan' } = {}
): string => {
  const numRaw = Number(input)
  if (!Number.isFinite(numRaw)) return String(input)
  const num = options.inputUnit === 'fen' ? numRaw / 100 : numRaw
  const abs = Math.abs(num)
  const toTrimmed = (v: number) => v.toFixed(2).replace(/\.?0+$/, '')
  if (abs >= 1e8) return `${toTrimmed(num / 1e8)}亿`
  if (abs >= 1e4) return `${toTrimmed(num / 1e4)}万`
  return String(num)
}

// 范围格式化并统一单位（例如：7500,10000 => 0.75万~1万）
export const formatRangeWithUnifiedUnit = (
  value?: string | number,
  options: { inputUnit?: 'fen' | 'yuan' } = {}
): string => {
  if (value === undefined || value === null || value === '') return '-'
  const parts = String(value)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  // 单值场景
  if (parts.length !== 2) return formatNumberWithUnit(value as string | number, options)

  const [aRaw, bRaw] = parts
  const aNumRaw = Number(aRaw)
  const bNumRaw = Number(bRaw)
  if (!Number.isFinite(aNumRaw) || !Number.isFinite(bNumRaw)) return `${aRaw}~${bRaw}`

  const aNum = options.inputUnit === 'fen' ? aNumRaw / 100 : aNumRaw
  const bNum = options.inputUnit === 'fen' ? bNumRaw / 100 : bNumRaw

  const maxAbs = Math.max(Math.abs(aNum), Math.abs(bNum))
  const toTrimmed = (v: number) => v.toFixed(2).replace(/\.?0+$/, '')

  // 选择统一单位：优先亿，其次万，否则原始
  if (maxAbs >= 1e8) {
    return `${toTrimmed(aNum / 1e8)}亿~${toTrimmed(bNum / 1e8)}亿`
  }
  if (maxAbs >= 1e4) {
    return `${toTrimmed(aNum / 1e4)}万~${toTrimmed(bNum / 1e4)}万`
  }
  return `${toTrimmed(aNum)}~${toTrimmed(bNum)}`.replace(/\.0+~/g, '~').replace(/\.0+$/g, '')
}

// 百分比范围格式化（0.3,0.35 => 30%~35%），单值也支持
export const formatPercentRange = (value?: string | number) => {
  if (value === undefined || value === null || value === '') return '-'
  const toPct = (v: string | number) => {
    const num = Number(v)
    return Number.isFinite(num) ? `${(num * 100).toFixed(0)}%` : String(v)
  }
  const parts = String(value)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  if (parts.length === 2) return `${toPct(parts[0])}~${toPct(parts[1])}`
  return toPct(value)
}

// ========== ERP 专属方法 ==========

const ERP_COUNT_DIGIT = 3
const ERP_PRICE_DIGIT = 2

/**
 * 【ERP】格式化 Input 数字
 *
 * 例如说：库存数量
 *
 * @param num 数量
 * @return 格式化后的数量
 */
export const erpNumberFormatter = (num: number | string | undefined, digit: number) => {
  if (num === null) {
    return ''
  }
  if (typeof num === 'string') {
    num = parseFloat(num)
  }
  // 如果非 number，则直接返回空串
  if (num && isNaN(num)) {
    return ''
  }
  return num?.toFixed(digit)
}

/**
 * 【ERP】格式化数量，保留三位小数
 *
 * 例如说：库存数量
 *
 * @param num 数量
 * @return 格式化后的数量
 */
export const erpCountInputFormatter = (num: number | string | undefined) => {
  return erpNumberFormatter(num, ERP_COUNT_DIGIT)
}

// noinspection JSCommentMatchesSignature
/**
 * 【ERP】格式化数量，保留三位小数
 *
 * @param cellValue 数量
 * @return 格式化后的数量
 */
export const erpCountTableColumnFormatter = (_, __, cellValue: any, ___) => {
  return erpNumberFormatter(cellValue, ERP_COUNT_DIGIT)
}

/**
 * 【ERP】格式化金额，保留二位小数
 *
 * 例如说：库存数量
 *
 * @param num 数量
 * @return 格式化后的数量
 */
export const erpPriceInputFormatter = (num: number | string | undefined) => {
  return erpNumberFormatter(num, ERP_PRICE_DIGIT)
}

// noinspection JSCommentMatchesSignature
/**
 * 【ERP】格式化金额，保留二位小数
 *
 * @param cellValue 数量
 * @return 格式化后的数量
 */
export const erpPriceTableColumnFormatter = (_, __, cellValue: any, ___) => {
  return erpNumberFormatter(cellValue, ERP_PRICE_DIGIT)
}

/**
 * 【ERP】价格计算，四舍五入保留两位小数
 *
 * @param price 价格
 * @param count 数量
 * @return 总价格。如果有任一为空，则返回 undefined
 */
export const erpPriceMultiply = (price: number, count: number) => {
  if (price == null || count == null) {
    return undefined
  }
  return parseFloat((price * count).toFixed(ERP_PRICE_DIGIT))
}
export const getImgUrlById = (id) => {
  // return import.meta.env.ENV == 'production'
  //   ? `https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/goodsImg/${id}.png`
  //   : `https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/test/goodsImg/${id}.png`
  return `https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/goodsImg/${id}.png`
}

// 获取店铺Icon
export const getStoreIcon = (store) => {
  if (!store) {
    return ''
  }
  if (['swTaobao', 'TaoBao', 'Taobao'].includes(store)) {
    return new URL('@/assets/imgs/store/store_swTaobao.png', import.meta.url).href
  } else if (['swTmall', 'Tmall'].includes(store)) {
    return new URL('@/assets/imgs/store/store_swTmall.png', import.meta.url).href
  } else if (store.indexOf('swDouyin', 'Douyin') != -1) {
    return new URL('@/assets/imgs/common/logo/douyin.png', import.meta.url).href
  } else if (store.indexOf('swPdd', 'Pdd') != -1) {
    return new URL('@/assets/imgs/common/logo/pdd.png', import.meta.url).href
  } else {
    return ''
  }
}

// 根据店铺获取渠道
export const getChannelByStore = (store) => {
  if (!store) {
    return 'TaoBao'
  }
  if (store === 'swTaobao') {
    return 'TaoBao'
  } else if (store === 'swTmall') {
    return 'Tmall'
  } else if (store === 'swDouyin') {
    return 'Douyin'
  } else if (store === 'swPdd') {
    return 'Pdd'
  }
  return 'TaoBao'
}
// 店铺商品跳转链接
export const getUrlByTypeAndId = (platformId, goodsId, isReturn = false) => {
  let url
  switch (platformId) {
    // 拼多多
    case 'Pdd':
      url = `https://yangkeduo.com/goods.html?goods_id=${goodsId}`
      break
    // 抖音
    case 'Douyin':
      url = `https://haohuo.jinritemai.com/ecommerce/trade/detail/index.html?id=${goodsId}&origin_type=604`
      break
    // 淘宝
    case 'TaoBao':
      url = `https://item.taobao.com/item.htm?id=${goodsId}`
      break
    // 天猫
    case 'Tmall':
      url = `https://detail.tmall.com/item.htm?id=${goodsId}`
      break
    default:
      // 默认淘宝
      url = `https://item.taobao.com/item.htm?id=${goodsId}`
      return
  }
  if (!isReturn) {
    window.open(url)
  } else {
    return url
  }
}

import logo_all from '@/assets/imgs/common/logo/all_channel.svg'
import logo_pdd from '@/assets/imgs/common/logo/pdd.png'
import logo_douyin from '@/assets/imgs/common/logo/douyin.png'
import logo_taobao from '@/assets/imgs/common/logo/taobao.png'
import logo_tmall from '@/assets/imgs/common/logo/tmall.png'
import logo_xhs from '@/assets/imgs/common/logo/xhs.png'
import logo_kuaishou from '@/assets/imgs/common/logo/kuaishou.png'
import logo_wph from '@/assets/imgs/common/logo/wph.png'
import logo_dewu from '@/assets/imgs/common/logo/dewu.png'
import logo_wxxd from '@/assets/imgs/common/logo/wxxd.png'
import logo_youzan from '@/assets/imgs/common/logo/youzan.png'
import logo_jingdong from '@/assets/imgs/common/logo/jingdong.png'

// 展示店铺平台logo
export const getImageUrl = (platformId) => {
  const imageUrls = {
    ALL: logo_all,
    Pdd: logo_pdd,
    Douyin: logo_douyin,
    TaoBao: logo_taobao,
    Tmall: logo_tmall,
    XHS: logo_xhs,
    KuaiShou: logo_kuaishou,
    VIP: logo_wph,
    Dewu: logo_dewu,
    WeiXinStore: logo_wxxd,
    Youzan: logo_youzan,
    JD: logo_jingdong,
    SecretWorld: logo_all,
  }

  return imageUrls[platformId] || ''
}
// 通过名称获取logo
export function getImgUrlByChannel(channel: string) {
  const imageUrls = {
    拼多多: logo_pdd,
    抖音: logo_douyin,
    淘宝: logo_taobao,
    天猫: logo_tmall,
    小红书: logo_xhs,
    快手: logo_kuaishou,
    唯品会: logo_wph,
    得物: logo_dewu,
    微信小店: logo_wxxd,
    有赞: logo_youzan,
    京东: logo_jingdong
  }

  return imageUrls[channel] || ''
}
// 通过渠道id 获取渠道中文名称
export function getChannelNameById(channel: string) {
  const channelMap = {
    Pdd: '拼多多',
    Douyin: '抖音',
    TaoBao: '淘宝',
    Tmall: '天猫',
    XHS: '小红书',
    KuaiShou: '快手',
    VIP: '唯品会',
    Dewu: '得物',
    WeiXinStore: '微信小店',
    Youzan: '有赞',
    JD: '京东'
  }
  return channelMap[channel] || ''
}
export const hasPermiJs = (permissionFlag) => {
  const { wsCache } = useCache()
  const all_permission = '*:*:*'
  const cacheUser = wsCache.get(CACHE_KEY.USER)
  let permissions: string[] = []
  if (cacheUser) {
    permissions = cacheUser.permissions
  }
  const hasPermissions = permissions.some((permission: string) => {
    return all_permission === permission || permissionFlag.includes(permission)
  })
  return hasPermissions
}

//是否拥有权限
export const hasPermissionsJs = (permissionList: any) => {
  const { wsCache } = useCache()
  const cacheUser = wsCache.get(CACHE_KEY.USER)
  let permissions: string[] = []
  if (cacheUser) {
    permissions = cacheUser.permissions
  }
  let isHasPerm = false
  permissionList.forEach((item: any) => {
    if (permissions && permissions.includes(item)) {
      isHasPerm = true
    }
  })
  return isHasPerm
}

// 获取公司名称
export const getCompanyName = (company: string) => {
  if (company) {
    if (company === 'ALL' || company === 'all') {
      return '全部'
    } else {
      return getDictLabel(DICT_TYPE.SYSTEM_PARAM_DYNAMIC_COMPANY, company)
    }
  }
  return ''
}

// 权限列表
export function getPermission() {
  const { wsCache } = useCache()
  const cacheUser = wsCache.get(CACHE_KEY.USER)
  let permissions: string[] = []
  if (cacheUser) {
    permissions = cacheUser.permissions
  }

  return permissions
}

// 去除字符串收尾空格
export const strTrimSpace = (str: string) => {
  if (!str) {
    return ''
  }
  return str.trim()
}

// 是否是纯空格
export const strIsOnlySpaces = (str: string) => {
  if (!str) {
    return false
  }
  return /^ *$/.test(str)
}

// 字符串去除某个字符
export const strRemoveChar = (str: string, char: string) => {
  if (str && char) {
    const result = str.replace(new RegExp(char, 'g'), '')
    return result
  }
  return str || ''
}

// 关闭当前选中的标签
export const closeCurrentTag = (currentRoute, push) => {
  for (const v of unref(tagsViewStore.visitedViews)) {
    if (v.path === unref(currentRoute).path) {
      if (v?.meta?.affix) return
      tagsViewStore.delView(v)
      if (v.path === unref(currentRoute).path) {
        toLastView(currentRoute, push)
      }
      break
    }
  }
}

export const toPrevView = (currentRoute, push) => {
  tagsViewStore.delView(currentRoute.value);
  const preView = tagsViewStore.getVisitedViews[tagsViewStore.getVisitedViews.length - 1];
  if (preView?.path && preView?.path !== '/otr/otr/index') {
    push(preView?.path);
  } else {
    push('/admin/index');
  }
}

// 跳转到最后一个
export const toLastView = (currentRoute, push) => {
  const visitedViews = tagsViewStore.getVisitedViews
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    if (latestView.path.startsWith('/admin/')) {
      push(latestView)
    } else {
      push('/admin/index')
    }
  } else {
    if (
      unref(currentRoute).path === permissionStore.getAddRouters[0].path ||
      unref(currentRoute).path === permissionStore.getAddRouters[0].redirect
    ) {
      const { name } = unref(currentRoute)
      if (name) {
        tagsViewStore.addView(unref(currentRoute))
      }
      return
    }
    // TODO: You can set another route
    push('/admin/index')
  }
}

//上传图片处理token解析失败的情况
export const handleUploadFileRequest = (res) => {
  if (res && typeof res === 'object' && !Array.isArray(res)) {
    if (res.code === 600 || (res.message && res.message === '无效的刷新令牌')) {
      resetRouter() // 重置静态路由表
      deleteUserCache() // 删除用户缓存
      removeToken()
      // 干掉token后再走一次路由让它过router.beforeEach的校验
      window.location.href = window.location.href
      return false
    }
  }
  return true
}

// 根据文件名称获取对应的图标
import fileExcelIcon from '@/assets/svgs/common/file_excel.svg'
import filePdfIcon from '@/assets/svgs/common/file_pdf.svg'
import fileDocIcon from '@/assets/svgs/common/file_doc.svg'

export const getFileIcon = (fileName: string) => {
  if (fileName) {
    if (fileName.toLowerCase().includes('.xls')) {
      return fileExcelIcon
    } else if (fileName.toLowerCase().includes('.pdf')) {
      return filePdfIcon
    } else {
      return fileDocIcon
    }
  }

}

// 处理字符串过长的显示问题
export function truncateStringSubstring(str: string, preNum: number, afterNum: number) {
  if (str.length <= (preNum + afterNum)) {
    return str;
  }
  const start = str.substring(0, preNum); // 获取前n个字符
  const end = str.substring(str.length - afterNum); // 获取后n个字符
  return start + '...' + end;
}
