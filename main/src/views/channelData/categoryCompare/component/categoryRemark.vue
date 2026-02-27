<template>
  <div class="categoryRemark">
    <div class="header">
      <div class="header-date">{{ showDate() }}</div>
      <div class="header-title">备注（各类目/单品）</div>
    </div>
    <div class="content">
      <div
        class="item"
        v-for="(value, index) in list"
        :key="index"
        :class="{
          item2: index === 1,
          item3: index === 2,
          item4: index === 3,
          item5: index === 4,
          item6: index === 5
        }"
      >
        <div class="item-title" :style="{ color: value.categoryColor }">{{ value.category }}</div>
        <div class="item-right">
          <div class="item-right-top">
            <div class="item-right-top-title">昨日复盘</div>
            <div class="row-center">
              <img
              class="item-right-top-edit"
              src="@/assets/imgs/channelData/categoryCompare/edit.png"
              @click="editClick(value)"
              />
              <div class="item-right-top-editTitle" @click="editClick(value)">编辑</div>
            </div>
          </div>
          <div class="item-right-content">
            <div
              v-if="value.yesterdayReview"
              class="item-right-content-editContent"
              v-html="getTestHtml(value.yesterdayReview)"
            ></div>
            <div v-else class="item-right-content-empty"> </div>
          </div>
          <div class="item-right-top-title" style="margin-top: 20px; margin-bottom: 10px"
            >今日操作</div
          >
          <div class="item-right-content" style="margin-bottom: 20px">
            <div
              v-if="value.todayOperation"
              class="item-right-content-editContent"
              v-html="getTestHtml(value.todayOperation)"
            ></div>
            <div v-else class="item-right-content-empty"> </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

import * as ChannelDataApi from '@/api/channelData'

const props = defineProps({
  type: propTypes.string.def('search'), // 类型 search 搜索流量 total 付费总和 sale 销售额
  store: propTypes.string.def('swTaobao') // 店铺类型 swTaobao 淘宝 swTmall 天猫
})

const getTestHtml = (html: string) => {
  if (html) {
    return html.replaceAll('<p>', `<p  style=\"display:flex;flex-wrap: wrap;\">`)
  } else {
    return ''
  }
}

const list = ref([
  {
    id: '',
    category: '女士内裤',
    categoryColor: '#08769A',
    code: 'WOMANPANTS_CATEGORY_GROUP',
    yesterdayReview: '',
    todayOperation: ''
  },
  {
    id: '',
    category: '男士内裤',
    categoryColor: '#168801',
    code: 'MANPANTS_CATEGORY_GROUP',
    yesterdayReview: '',
    todayOperation: ''
  },
  {
    id: '',
    category: '内衣',
    categoryColor: '#687B06',
    code: 'UNDERWEAR_CATEGORY_GROUP',
    yesterdayReview: '',
    todayOperation: ''
  },
  {
    id: '',
    category: '袜子',
    categoryColor: '#A38516',
    code: 'SOCKS_CATEGORY_GROUP',
    yesterdayReview: '',
    todayOperation: ''
  },
  {
    id: '',
    category: '胸贴',
    categoryColor: '#35508D',
    code: 'PASTIES_CATEGORY_GROUP',
    yesterdayReview: '',
    todayOperation: ''
  },
  {
    id: '',
    category: '季节品',
    categoryColor: '#80265A',
    code: 'SEASONAL_CATEGORY_GROUP',
    yesterdayReview: '',
    todayOperation: ''
  }
])
const editClick = (value) => {
  emit('editClick', value, currentDate.value)
}

const currentDate = ref('')
const showDate = () => {
  const arr = currentDate.value.split('-')
  if (arr.length > 2) {
    return `${arr[1]}月${arr[2]}日`
  } else {
    return ''
  }
}
const getCurrentDateNextDay = (date, day = 0, format = '{y}-{m}-{d}') => {
  if (date) {
    date = date.match(/\d+/g).join('-') // 格式为2022年09月19日处理
    const nDate = new Date(date)
    nDate.setDate(nDate.getDate() + day)

    const formatObj = {
      y: nDate.getFullYear(),
      m: nDate.getMonth() + 1,
      d: nDate.getDate()
    }
    return format.replace(/{([ymd])+}/g, (result, key) => {
      const value = formatObj[key]
      return value.toString().padStart(2, '0')
    })
  } else {
    return date || ''
  }
}
const getList = async (date) => {
  currentDate.value = getCurrentDateNextDay(date)
  const typeMap = {
    swTaobao: '1',
    swTmall: '2'
  }

  const type = typeMap[props.store] || '1'
  // //1:淘宝 2.天猫 3.拼多多
  const data = await ChannelDataApi.categoryDataRemarksQueryByDate({
    date: currentDate.value,
    type
  }).catch(() => {})
  if (data) {
    list.value.forEach((item) => {
      const remarkData = getRemarkData(item.code, data)
      if (remarkData) {
        item.id = remarkData.id
        item.todayOperation = remarkData.todayOperation || ''
        item.yesterdayReview = remarkData.yesterdayReview || ''
      }
    })
  }
}

const getRemarkData = (code, list) => {
  let data
  list.forEach((item) => {
    if (item.category === code) {
      data = item
    }
  })
  return data
}

const emit = defineEmits(['editClick']) // 定义 success 事件，用于操作成功后的回调
defineExpose({ getList }) // 提供 open 方法，用于打开弹窗
</script>

<style lang="scss" scoped>
.categoryRemark {
  .header {
    width: 100%;
    height: 65px;
    background: #f5f9ff;
    border-radius: 20px 20px 0px 0px;
    border: 1px solid #e3edff;
    font-size: 20px;
    color: #333333;
    line-height: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    &-date {
      padding-left: 22px;
    }
    &-title {
      padding-left: 218px;
    }
  }
  .content {
    .item {
      background-repeat: no-repeat;
      background-image: url('@/assets/imgs/channelData/categoryCompare/edit_bg_1.png');
      width: 100%;
      // min-height: 218px;
      margin-bottom: 20px;
      display: flex;
      flex-direction: row;
      // align-items: center;
      &-title {
        width: 170px;
        padding-left: 34px;
        font-weight: 500;
        font-size: 16px;
        line-height: calc(100%);
        margin-top: auto;
        margin-bottom: auto;
      }
      &-right {
        width: calc(100% - 234px);
        &-top {
          display: flex;
          flex-direction: row;
          height: 54px;
          align-items: center;
          justify-content: space-between;

          &-title {
            font-weight: 500;
            font-size: 16px;
            color: #333333;
            line-height: 22px;
            cursor: pointer;
          }
          &-edit {
            margin-left: auto;
            width: 16px;
            height: 16px;
            cursor: pointer;
          }
          &-editTitle {
            cursor: pointer;
            padding-left: 10px;
            font-weight: 400;
            font-size: 14px;
            color: #0064ff;
            line-height: 20px;
            margin-right: 30px;
          }
        }
        &-content {
          &-empty {
            width: 100%;
            height: 100px;
            background: #ffffff;
            border-radius: 10px;
            border: 1px solid #edeef3;
          }
          &-editContent {
            width: 100%;
            font-weight: 400;
            font-size: 14px;
            color: #333333;
            line-height: 20px;
          }
        }
      }
    }
    .item2 {
      background-image: url('@/assets/imgs/channelData/categoryCompare/edit_bg_2.png');
    }
    .item3 {
      background-image: url('@/assets/imgs/channelData/categoryCompare/edit_bg_3.png');
    }
    .item4 {
      background-image: url('@/assets/imgs/channelData/categoryCompare/edit_bg_4.png');
    }
    .item5 {
      background-image: url('@/assets/imgs/channelData/categoryCompare/edit_bg_5.png');
    }
    .item6 {
      background-image: url('@/assets/imgs/channelData/categoryCompare/edit_bg_6.png');
    }
  }
}
</style>
<style scoped>
:deep(p) {
  margin: 0px !important;
  padding: 0px !important;
}
</style>
