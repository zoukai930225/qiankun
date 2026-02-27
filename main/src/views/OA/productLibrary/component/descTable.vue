<template>
  <div class="desc-list-content">
    <div class="title-content" v-if="title">
      <div class="line"></div>
      <div class="title">{{ title }}</div>
    </div>
    <div v-for="column in list" class="table-content">
      <div class="table-row" v-for="_index in Math.ceil(column.length / 4)">
        <div
          class="table-cell"
          v-for="(item, index) in column.slice((_index - 1) * 4, _index * 4)"
          :style="`width: ${(item.span || 1) * 25}%`"
        >
          <div class="table-cell_label">{{ item.fieldName }}</div>
          <div class="table-cell_value">
            <template
              v-if="
                [
                  'designHandlerList',
                  'operationHandlerList',
                  'planHandlerList',
                  'supplyHandlerList'
                ].includes(item.fieldKey)
              "
            >
              <div style="display: flex; align-items: center; flex-wrap: wrap">
                <template v-if="data[item.fieldKey] && data[item.fieldKey].length > 0">
                  <line-avatar
                    v-for="user in data[item.fieldKey]"
                    :user="getUser(user)"
                  ></line-avatar>
                </template>
                <template v-else>-</template>
              </div>
            </template>
            <template v-else-if="['productType'].includes(item.fieldKey)">
              <line-tage
                v-if="data[item.fieldKey]"
                :txt="getDictLabels(getIntDictOptions(item.dictCode, true), data[item.fieldKey])"
                color="#CD8200"
                background="#FFF4C8"
              ></line-tage>
              <template v-else>-</template>
            </template>
            <div v-else-if="['salePoint'].includes(item.fieldKey)">
              <template v-if="data[item.fieldKey]">
                <div
                  class="custom-cell"
                  v-for="(sp, index) in getSalePoints(data[item.fieldKey])"
                  :key="index"
                >
                  {{ `卖点${index + 1}、${sp}` }}
                </div>
              </template>
              <template v-else>-</template>
            </div>
            <div class="link-content" v-else-if="['competitionLink'].includes(item.fieldKey)">
              <a
                v-if="data[item.fieldKey]"
                :href="data[item.fieldKey]"
                class="link"
                target="_blank"
                >{{ data[item.fieldKey] }}</a
              >
              <template v-else>-</template>
            </div>
            <div class="flex" v-else-if="['colorPicture'].includes(item.fieldKey)">
              <div class="flex-wrap color-wapper" :style="data[item.fieldKey] && data[item.fieldKey].length > 0 ? 'margin-top: -10px': ''">
                <template v-if="data[item.fieldKey] && data[item.fieldKey].length > 0">
                  <div
                    class="item"
                    v-for="(color, colorIndex) in formatColor(data[item.fieldKey])"
                    :key="colorIndex"
                  >
                    <el-image
                      class="img"
                      :src="getUrl(color.url)"
                      :zoom-rate="1.2"
                      :max-scale="7"
                      :min-scale="0.2"
                      :preview-src-list="[color.url]"
                      show-progress
                      :initial-index="4"
                      fit="contain"
                      preview-teleported
                    />
                    <div class="name">{{ color.name }}</div>
                  </div>
                </template>
                <template v-else>-</template>
              </div>
            </div>
            <div class="flex-wrap" v-else-if="['skuCode'].includes(item.fieldKey)" :style="data[item.fieldKey] ? 'margin-top: -10px;' : ''">
              <template v-if="data[item.fieldKey]">
                <div class="sku" v-for="sku in data[item.fieldKey].split(',')">{{ sku }}</div>
              </template>
              <template v-else>-</template>
            </div>
            <div v-else>{{
              item.dictCode
                ? getDictLabels(
                    getIntDictOptions(item.dictCode, true),
                    item.fieldValue || data[item.fieldKey]
                  )
                : data[item.fieldKey] || '-'
            }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getUrl } from '../util'
import lineAvatar from '@/components/template/table/components/lineAvatar.vue'
import lineTage from '@/components/template/table/components/lineTage.vue'
import { getIntDictOptions } from '@/utils/dict'
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  list: {
    type: Array,
    default: () => []
  },
  data: {
    type: Object,
    default: () => {}
  }
})

const formatColor = (color: string) => {
  if (!color) return []
  return color.split(',').map((item) => ({
    name: item.split('_')[0], // 提取颜色名称
    url: item.split('_')[1] // 提取颜色值
  }))
}

const getSalePoints = (salePoint: string) => {
  if (!salePoint) return []
  return salePoint.split('&#&')
}

const getDictLabels = (dict: any[], value: string) => {
  if (!value) return '-'
  const arr: string[] = []
  const temp = value.split(',')
  temp.forEach((item: string) => {
    const obj = dict.find((dt: any) => dt.value === item)
    obj && arr.push(obj.label)
  })
  return arr.join() || '-'
}

const getUser = (user: any) => {
  if (!user.name) return {}
  const { name, avatarOrigin } = user
  return {
    name,
    avatarOrigin
  }
}
</script>

<style lang="scss" scoped>
.desc-list-content {
  padding-top: 16px;
  .flex {
    display: flex;
    align-items: center;
  }
  .title-content {
    display: flex;
    align-items: center;
    padding-bottom: 16px;
    .line {
      width: 3px;
      height: 12px;
      background: #0064ff;
      margin-right: 6px;
    }
    .title {
      font-size: 14px;
      font-weight: 500;
      color: #333333;
    }
  }
}

.custom-cell {
  margin: 0 -12px;
  padding: 12px 16px;
  border-bottom: solid #e5e5e5 1px;
  &:first-child {
    padding-top: 0;
  }
  &:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }
}

.flex-wrap {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  // margin-top: -10px;
}

.color-wapper {
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
    margin-top: 10px;
    padding: 5px 8px 10px 8px;

    .img {
      width: 82px;
      height: 64px;
      margin: 4px 0;
    }

    .name {
      padding: 1px 10px;
      background-color: #ffffff;
      border-radius: 10px;
      color: #333333;
      font-size: 10px;
      height: 16px;
      line-height: 16px;
    }
  }
}

.sku {
  padding: 6px 10px;
  font-size: 14px;
  color: #666666;
  background: #ebf0ff;
  margin-right: 10px;
  border-radius: 4px;
  margin-top: 10px;
  &:last-child {
    margin-right: 0;
  }
}

.link-content {
  width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  .link {
    color: var(--el-color-primary);
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}

:deep() {
  .el-descriptions__label {
    font-weight: normal !important;
    font-size: 14px;
    color: #666666;
    padding: 12px !important;
    box-sizing: border-box;
    background: #f4f6fa !important;
    vertical-align: middle;
    width: 136px !important;
  }
  .el-descriptions__content {
    padding: 12px !important;
    font-size: 14px !important;
    color: #3d3d3d !important;
    vertical-align: middle;
    word-break: break-all;
    // min-width: 266px;
    box-sizing: border-box;
  }
  .el-descriptions__cell {
    border-color: #e5e5e5 !important;
  }
  .el-descriptions {
    margin-top: -1px;
  }
  .user {
    margin-right: 10px;
    &:last-child {
      margin-right: 0;
    }
  }
}

.table-content {
  // display: flex;
  // flex-wrap: wrap;
  margin-top: -1px;
  border: solid #e5e5e5 1px;
  box-sizing: border-box;
  .table-row {
    width: 100%;
    display: flex;
    align-items: center;
    border-bottom: solid #e5e5e5 1px;
    box-sizing: border-box;
    height: 100%;
    background-color: #f4f6fa;
    &:last-child {
      border-bottom: 0;
    }
    .table-cell {
      display: flex;
      align-items: center;
      border-left: solid #e5e5e5 1px;
      box-sizing: border-box;
      height: 100%;
      &:first-child {
        border-left: 0;
      }
      .table-cell_label {
        min-width: 136px;
        width: 136px;
        padding: 12px;
        height: 100%;
        vertical-align: middle;
        box-sizing: border-box;
        line-height: 23px;
        box-sizing: border-box;
        font-weight: normal !important;
        font-size: 14px;
        color: #666666;
      }
      .table-cell_value {
        line-height: 23px;
        padding: 12px;
        flex: 1;
        background-color: #ffffff;
        border-left: solid #e5e5e5 1px;
        box-sizing: border-box;
        font-size: 14px !important;
        color: #3d3d3d !important;
        word-break: break-all;
      }
    }
  }
}
</style>
