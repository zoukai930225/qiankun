<!--
 * @Date: 2025-07-29 14:10:37
 基本资料信息
-->
<template>
  <div class="info-table">
    <div class="table-row" v-for="(row, index) in tableData" :key="index" :class="getRowClass(row)">
      <div v-for="(item, itemIndex) in row" :key="itemIndex" class="table-cell" :class="{
        'label-cell': item.isLabel,
        'value-cell': !item.isLabel,
        'merged-cell': item.merged
      }" :style="item.bgColor ? { backgroundColor: item.bgColor } : {}">
        <div class="cell-content">
          <div v-if="item.props == 'category'">
            {{ item.text }}
          </div>
          <!-- 企业负责人 -->
          <div v-else-if="item.props == 'isStock'" class="user-info-wapper">
            {{ item.text == '0' ? '否' : item.text == '1' ? '是' : '' }}
          </div>
          <!-- 颜色 -->
          <div v-else-if="item.props == 'color'">
            <div class="color-wapper">
              <div class="item" v-for="(color, colorIndex) in formatColor(item.text)" :key="colorIndex">
                <!-- <img :src="color.url" alt="" class="img" /> -->
                 <el-image class="img" :src="color.url" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2"
                  :preview-src-list="[color.url]" show-progress :initial-index="4" fit="contain" />
                <span class="name">{{ color.name }}</span>
              </div>
            </div>
          </div>
          <!-- 使用季节 -->
          <div v-else-if="item.props == 'useSeason'">
            <span v-for="(option, optionIndex) in SEASON_OPTIONS" :key="optionIndex">
              <span v-for="(it, index) in item?.text && JSON.parse(item?.text)" :key="it">
                <span v-if="option.value == it">{{ `${optionIndex === 0 || index === 0?'': '，'}${option.label}` }} </span>
              </span>
            </span>
          </div>
          <!-- 适用性别 -->
          <div v-else-if="item.props == 'applyGender'">
            <span v-for="(option, optionIndex) in GENDER_OPTIONS" :key="optionIndex">
              <span v-for="(it, index) in item?.text && JSON.parse(item?.text)" :key="it">
                <span v-if="option.value == it">{{ `${optionIndex === 0 || index === 0 ?'': '，'}${option.label}` }}</span>
              </span>
            </span>
          </div>
          <!-- 使用对象 useTarget -->
          <div v-else-if="item.props == 'useTarget'">
            <span v-for="(option, optionIndex) in USE_TARGET_OPTIONS" :key="optionIndex">
              <span v-for="(it,index) in item?.text && JSON.parse(item?.text)" :key="it">
                <span v-if="option.value == it">{{ `${optionIndex === 0 || index === 0?'': '，'}${option.label}` }}</span>
              </span>
            </span>
          </div>
          <!-- 尺码 -->
          <div v-else-if="item.props == 'size'">
            {{ item.text && JSON.parse(item.text).join(',') }}
          </div>

           <!-- 卖点/功能 -->
          <!-- <div v-else-if="item.props == 'salePointRemark'">
            <div v-if="item.text" style="display: flex;flex-wrap: wrap;">
              <div v-for="txt in item.text.split('&#&')">
                <div style="background-color: #f4f6fa;padding: 3px 10px;margin: 3px;border-radius: 4px;color: #333;">{{ txt }}</div>
              </div>
            </div>
          </div> -->

          <!-- 默认文本内容 -->
          <template v-else>
            {{ item.text }}
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { useCategoryList } from './hooks'
const { categoryList } = useCategoryList()
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'

const props = defineProps({
  data: {
    type: Object as PropType<any>,
    default: () => ({})
  },
  reviewDetail: {
    type: Object as PropType<any>,
    default: () => ({})
  }
})

const formatColor = (color: []) => {
  if (!color) return []

  return JSON.parse(color).map((item) => ({
    name: item.split('_')[0], // 提取颜色名称
    url: item.split('_')[1] // 提取颜色值
  }))
}

const formatCategory = (code) => {
  const item = categoryList.value.find((item) => item.code === code)
  return item ? item.name : ''
}

const SEASON_OPTIONS = getIntDictOptions(DICT_TYPE.NP_USE_SEASON, true)
const GENDER_OPTIONS = getIntDictOptions(DICT_TYPE.NP_APPLY_GENDER, true)
const USE_TARGET_OPTIONS = getIntDictOptions(DICT_TYPE.NP_USE_TARGET, true)

onMounted(() => {
  // 如果需要在组件挂载时执行某些操作，可以在这里添加
  console.log('Basic Information component mounted with data:', SEASON_OPTIONS)
})

// 根据数据生成表格结构
const tableData = computed(() => {
  const data = props.data
  const firstCategory = data.category ? data.category?.split('-')[0] : ''
  let temp: any = []
  // 品类：女生内裤 008-
  if(firstCategory === '008') {
    temp = [[
      { text: '腰型', isLabel: true },
      { text: getDictLabel(DICT_TYPE.NP_WOMANPANTS_YX,data.womanpantsYx || ''), isLabel: false },
      { text: '版型', isLabel: true },
      { text: getDictLabel(DICT_TYPE.NP_WOMANPANTS_BX,data.womanpantsBx || ''), isLabel: false },
      { text: '风格', isLabel: true },
      { text: getDictLabel(DICT_TYPE.NP_WOMANPANTS_FG,data.womanpantsFg || ''), isLabel: false },
    ]
    ]
  }
  // 品类：男士内裤 007
  if(firstCategory === '007') {
     temp = [[
       { text: '版型', isLabel: true },
       { text: getDictLabel(DICT_TYPE.NP_MANPANTS_BX, data.womanpantsBx || ''), isLabel: false },
       { text: '风格', isLabel: true },
       { text: getDictLabel(DICT_TYPE.NP_MANPANTS_FG, data.womanpantsFg || ''), isLabel: false },
     ]
    ]
  }
  // 品类：内衣 010
  if(firstCategory === '010') {
     temp = [
      [
        { text: '商品分类', isLabel: true },
        { text: getDictLabel(DICT_TYPE.NP_UNDERWEAR_CATEGORY, data.productCategory || ''), isLabel: false },
        { text: '杯型', isLabel: true },
        { text: getDictLabel(DICT_TYPE.NP_UNDERWEAR_BX, data.braBx || ''), isLabel: false },
        { text: '风格', isLabel: true },
        { text: getDictLabel(DICT_TYPE.NP_BRA_FG, data.braFg || ''), isLabel: false },
      ], [
        { text: '款式', isLabel: true },
        { text: getDictLabel(DICT_TYPE.NP_UNDERWEAR_KS,data.underwearKs || ''), isLabel: false },
        { text: '功能', isLabel: true },
        { text: getDictLabel(DICT_TYPE.NP_BRA_GN,data.braGn || ''), isLabel: false },
      ]
    ]
  }
  // 品类：袜子 009
  if(firstCategory === '009') {
     temp = [[
       { text: '版型', isLabel: true },
       { text: getDictLabel(DICT_TYPE.NP_SOCKS_BX,data.socksBx || ''), isLabel: false },
       { text: '风格', isLabel: true },
       { text: getDictLabel(DICT_TYPE.NP_SOCKS_FG,data.socksFg || ''), isLabel: false },
       { text: '袜号', isLabel: true },
       { text: getDictLabel(DICT_TYPE.NP_SOCKS_SIZE,data.sockSize || ''), isLabel: false },
     ]
    ]
  }

   // 品类：吊带背心 001
  if(firstCategory === '001') {
    temp = [[
      { text: '版型', isLabel: true },
      { text: getDictLabel(DICT_TYPE.NP_SUSPENDERS_BX,data.suspendersBx || ''), isLabel: false },
      { text: '杯型', isLabel: true },
      { text: getDictLabel(DICT_TYPE.NP_SUSPENDERS_BD,data.suspendersBd || ''), isLabel: false },
      { text: '领型', isLabel: true },
      { text: getDictLabel(DICT_TYPE.NP_SUSPENDERS_LX,data.suspendersLx || ''), isLabel: false },
    ],[
      { text: '风格', isLabel: true },
      { text: getDictLabel(DICT_TYPE.NP_SUSPENDERS_FG,data.suspendersFg || ''), isLabel: false,  merged: true, colspan: 5 },
    ]
    ]
  }

  // 品类：季节品 
  if(!['001','005','007','008','009','010','011'].includes(firstCategory)) {
     temp = [[
      { text: '类别', isLabel: true },
      { text: getDictLabel(DICT_TYPE.NP_SEASONAL_LB,data.seasonalLb || ''), isLabel: false },
      { text: '风格', isLabel: true },
      { text: getDictLabel(DICT_TYPE.NP_SEASONAL_FG,data.seasonalFg || ''), isLabel: false },
     ]
    ]
  }

  // 品类：胸贴 011
  if(firstCategory === '011') {
    temp = [[
      { text: '杯型', isLabel: true },
      { text: getDictLabel(DICT_TYPE.NP_PASTIES_BX,data.pastiesBx || ''), isLabel: false },
      { text: '厚度', isLabel: true },
      { text: getDictLabel(DICT_TYPE.NP_PASTIES_HD,data.pastiesHd || ''), isLabel: false },
      { text: '功能', isLabel: true },
      { text: getDictLabel(DICT_TYPE.NP_PASTIES_GN,data.pastiesGn || ''), isLabel: false },
  ]
    ]
  }

  // 品类：家居服 005
  if(firstCategory === '005') {
     temp = [[
      { text: '季节', isLabel: true },
      { text: getDictLabel(DICT_TYPE.NP_JJF_JJ,data.homeWearJj || ''), isLabel: false },
      { text: '款式', isLabel: true },
      { text: getDictLabel(DICT_TYPE.NP_JJF_KS,data.homeWearKs || ''), isLabel: false },
      { text: '厚度', isLabel: true },
      { text: getDictLabel(DICT_TYPE.NP_JJF_HD,data.homeWearHd || ''), isLabel: false },
    ]
    ]
  }
  return [
    [ { text: '产品名称', isLabel: true },
      { text: data.productName || '', isLabel: false },
      { text: '建议产品编码', isLabel: true },
      { text: data.recommendProductCode || '', isLabel: false, merged: true, colspan: 3 },
    ],
    [
       { text: '使用季节', isLabel: true },
      { text: data.useSeason || '', isLabel: false, props: 'useSeason'},
      { text: '适用性别', isLabel: true },
      { text: data.applyGender || '', isLabel: false, props: 'applyGender' },
      { text: '使用对象', isLabel: true },
      { text: data.useTarget || '', isLabel: false, props: 'useTarget' }
    ],
    ...temp,
    [
      { text: '尺码', isLabel: true },
      { text: data.size || '', isLabel: false, props: 'size' },
      { text: '新品建档时间', isLabel: true },
      { text: data.establishTime || '', isLabel: false , merged: true, colspan: 3},
    ],
    [
      // { text: '是否现货', isLabel: true },
      // { text: data.isStock || '', isLabel: false, props: 'isStock' },
      { text: '货品编码', isLabel: true },
      {
        text: data.productCode || '',
        props: 'productCode',
        isLabel: false,
      },
      
    ],
    // [
    //   { text: '卖点/功能', isLabel: true },
    //   {
    //     text: data.salePointRemark || '',
    //     isLabel: false,
    //     merged: true,
    //     colspan: 5, // 标记合并5个单元格
    //     props: 'salePointRemark'
    //   }
    // ],
    [
      { text: '颜色', isLabel: true },
      {
        text: data.color || '',
        isLabel: false,
        merged: true,
        colspan: 5, // 标记合并5个单元格
        props: 'color'
      }
    ]
  ]
})

// 添加这个方法
const getRowClass = (row) => {
  const mergedCell = row.find((item) => item.merged && item.colspan)

  if (mergedCell) {
    if (mergedCell.colspan == 3) {
      return 'row-colspan-3'
    } else if (mergedCell.colspan == 5) {
      return 'row-colspan-5'
    }
  }

  return 'row-default'
}
</script>

<style lang="scss" scoped>
.info-table {
  width: 100%;
  border: 1px solid #e5e5e5;
  background: #ffffff;

  .table-row {
    display: grid;
    border-bottom: 1px solid #e5e5e5;

    &:last-child {
      border-bottom: none;
    }

    &.row-default {
      grid-template-columns: 120px 1fr 120px 1fr 120px 1fr;
    }

    &.row-colspan-3 {
      // grid-template-columns: 120px 1fr 120px 3.1fr;
      grid-template-columns: 120px 1fr 120px 2fr 120px;

      .table-cell:nth-child(4) {
        grid-column: 4 / 6; // 让第4个单元格跨越第4列和第5列
      }
    }

    &.row-colspan-5 {
      grid-template-columns: 120px 1fr;
    }

    .table-cell {
      min-height: 40px;
      border-right: 1px solid #e5e5e5;
      display: flex;
      align-items: center;

      &:last-child {
        border-right: none;
      }

      &.label-cell {
        background: #f4f6fa;

        .cell-content {
          color: #666666;
          font-size: 14px;
        }
      }

      &.value-cell {
        background: #ffffff;

        .cell-content {
          color: #333333;
          font-size: 14px;
        }
      }

      // 合并单元格处理
      &.merged-cell {
        border-right: none;
      }

      .cell-content {
        padding: 8px 12px;
        width: 100%;
        word-break: break-all;
        line-height: 1.4;
      }
    }
  }
}

// 响应式处理
@media (max-width: 768px) {
  .info-table {
    .table-row {
      display: flex;
      flex-direction: column;

      .table-cell {
        border-right: none;
        border-bottom: 1px solid #e5e5e5;

        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
}

.user-info-wapper {
  display: flex;
  flex-wrap: wrap;

  .user-info {
    display: flex;
    flex-direction: row;

    .name {
      color: #3d3d3d;
      font-size: 14px;
    }

    .avator {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      margin-right: 4px;
    }
  }
}

.color-wapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  .item {
    width: 98px;
    height: 98px;
    border-radius: 10px;
    background: #f7f7f7;
    box-sizing: border-box;
    border: 1px solid #e5e5e5;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 10px;

    .img {
      width: 82px;
      height: 68px;
      margin: 4px 0;
    }

    .name {
      color: #333333;
      font-size: 10px;
    }
  }
}
</style>
