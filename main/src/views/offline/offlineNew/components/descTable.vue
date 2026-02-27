<template>
  <div class="desc-list-content">
    <div class="title-content" v-if="title">
      <div class="line"></div>
      <div class="title">{{ title }}</div>
      <div v-if="showExpand" style="position: absolute; top: 0; right: 0px">
        <el-button type="primary" link @click="isExpand = !isExpand"
          >{{ txt }}
          <el-icon class="el-icon--right">
            <component :is="!isExpand ? 'ArrowDown' : 'ArrowUp'" />
          </el-icon>
        </el-button>
      </div>
    </div>
    <template v-if="isExpand">
      <FormDescription :column="4" label-width="136px">
        <FormDescriptionItem
          v-for="item in list"
          :label="(item as any).fieldName"
          :span="(item as any).span"
          :class="(item as any).labelBg ? (item as any).labelBg : ''"
        >
          <template v-if="['patternMakers', 'sampleWorkers'].includes((item as any).fieldKey)">
            <div style="display: flex; align-items: center; flex-wrap: wrap">
              <template
                v-if="data[(item as any).fieldKey] && data[(item as any).fieldKey].length > 0"
              >
                <line-avatars
                  :users="data[(item as any).fieldKey]"
                ></line-avatars>
              </template>
              <template v-else>-</template>
            </div>
          </template>
          <template v-else-if="['productType'].includes((item as any).fieldKey)">
            <line-tage
              v-if="data[(item as any).fieldKey]"
              :txt="
                getDictLabels(
                  getIntDictOptions((item as any).dictCode, true),
                  data[(item as any).fieldKey]
                )
              "
              color="#CD8200"
              background="#FFF4C8"
            ></line-tage>
            <template v-else>-</template>
          </template>
          <div v-else-if="['salePoint'].includes((item as any).fieldKey)">
            <template v-if="data[(item as any).fieldKey]">
              <div
                class="custom-cell"
                v-for="(sp, index) in getSalePoints(data[(item as any).fieldKey])"
                :key="index"
              >
                {{ `卖点${index + 1}、${sp}` }}
              </div>
            </template>
            <template v-else>-</template>
          </div>
          <div v-else-if="['salePoint'].includes((item as any).fieldKey)">
            <template v-if="data[(item as any).fieldKey]">
              <div
                class="custom-cell"
                v-for="(sp, index) in getSalePoints(data[(item as any).fieldKey])"
                :key="index"
              >
                {{ `卖点${index + 1}、${sp}` }}
              </div>
            </template>
            <template v-else>-</template>
          </div>
          <template v-else-if="['auditRecords'].includes((item as any).fieldKey)">
            <div
              v-if="data[(item as any).fieldKey] && data[(item as any).fieldKey].length > 0"
              class="audit-content"
              style="width: 100%"
            >
              <div class="audit-content-main">
                <div v-for="citem in data[(item as any).fieldKey]" class="audit-item">
                  <div class="time">{{ (citem as any).auditDate }}</div>
                  <div class="info-area">
                    <div class="top">
                      <img
                        v-if="(citem as any).auditResult === 2"
                        class="status-icon"
                        src="@/assets/svgs/develop/error.svg"
                      />
                      <img
                        v-if="(citem as any).auditResult === 1"
                        class="status-icon"
                        src="@/assets/svgs/develop/success.svg"
                      />
                      <line-avatar :user="(citem as any).auditUser"></line-avatar>
                      <div class="tip" :class="`tip_${(citem as any).auditResult}`">{{
                        (citem as any).auditResult === 1 ? '审核通过' : '审核拒绝'
                      }}</div>
                      <div class="tag" v-if="(citem as any)?.rollbackNodeCode"
                        >回退{{
                          citem?.rollbackNodeCode === 'patternConfirm' ? '打版确认' : '样衣确认'
                        }}</div
                      >
                    </div>
                    <div class="remark-content">
                      <div>{{ (citem as any).remark || '-' }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- <div v-if="data[(item as any).fieldKey].length > 3" class="show-more">
                <el-button type="primary" link @click="isAuditExpand = !isAuditExpand"
                  >{{ auditTxt }}
                  <el-icon class="el-icon--right">
                    <component :is="!isAuditExpand ? 'ArrowDown' : 'ArrowUp'" />
                  </el-icon>
                </el-button>
              </div> -->
            </div>
            <template v-else>-</template>
          </template>
          <div
            class="link-content"
            v-else-if="['competitionLink'].includes((item as any).fieldKey)"
          >
            <a
              v-if="data[(item as any).fieldKey]"
              :href="data[(item as any).fieldKey]"
              class="link"
              target="_blank"
              >{{ data[(item as any).fieldKey] }}</a
            >
            <template v-else>-</template>
          </div>
          <div class="flex" v-else-if="['colorPicture'].includes((item as any).fieldKey)">
            <div
              class="flex-wrap color-wapper"
              :style="
                data[(item as any).fieldKey] && data[(item as any).fieldKey].length > 0
                  ? 'margin-top: -10px'
                  : ''
              "
            >
              <template
                v-if="data[(item as any).fieldKey] && data[(item as any).fieldKey].length > 0"
              >
                <div
                  class="item"
                  v-for="(color, colorIndex) in formatColor(data[(item as any).fieldKey])"
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
          <div
            class="flex"
            style="width: 100%"
            v-else-if="
              [
                'styleChart',
                'paperAttachmentUrl',
                'technicalAttachmentUrl',
                'quotation',
                'prenatalSampleAttachmentUrl',
                'firstEightAttachmentUrl',
                'attachmentUrl'
              ].includes((item as any).fieldKey)
            "
          >
            <template
              v-if="data[(item as any).fieldKey] && data[(item as any).fieldKey].length > 0"
            >
              <fileContent :url="data[(item as any).fieldKey]"></fileContent>
            </template>
            <template v-else>-</template>
          </div>
          <div
            class="flex-wrap"
            v-else-if="['skuCode'].includes((item as any).fieldKey)"
            :style="data[(item as any).fieldKey] ? 'margin-top: -10px;' : ''"
          >
            <template v-if="data[(item as any).fieldKey]">
              <div class="sku" v-for="sku in data[(item as any).fieldKey].split(',')">{{
                sku
              }}</div>
            </template>
            <template v-else>-</template>
          </div>
          <template v-else-if="['skuDetails'].includes((item as any).fieldKey)">
            <div v-if="data[(item as any).fieldKey]" style="width: 100%">
              <div class="sku-table">
                <div class="list-header">
                  <div class="cell">规格名称</div>
                  <div class="cell">规格码</div>
                  <div class="cell">SKU编码</div>
                  <div class="cell">采购价</div>
                  <div class="cell">零售价</div>
                  <div class="cell">下单数量</div>
                </div>
                <div
                  class="list-row"
                  v-for="citem in data[(item as any).fieldKey]"
                  :key="(citem as any).sku"
                >
                  <div class="cell">{{ (citem as any).specName || '-' }}</div>
                  <div class="cell">{{ (citem as any).specSizeCode || '-' }}</div>
                  <div class="cell">{{ (citem as any).skuCode || '-' }}</div>
                  <div class="cell">{{
                    (citem as any).purchasePrice
                      ? Number((citem as any).purchasePrice || 0).toFixed(3)
                      : '-'
                  }}</div>
                  <div class="cell">{{
                    (citem as any).retailPrice
                      ? Number((citem as any).retailPrice || 0).toFixed(3)
                      : '-'
                  }}</div>
                  <div class="cell">{{ (citem as any).orderQuantity || '-' }}</div>
                </div>
              </div>
            </div>
            <template v-else>-</template>
          </template>
          <template
            v-else-if="
              ['offlineNpPatternConfirmDetailList', 'offlineNpSampleConfirmDetailList'].includes(
                (item as any).fieldKey
              )
            "
          >
            <div class="version-content" style="">
              <div class="list-row header" style="">
                <div class="cell" style="">版本</div>
                <div class="cell">确认时间</div>
                <div class="cell">备注</div>
                <div class="cell">附件</div>
              </div>
              <div
                class="list-row body"
                v-for="(citem, cindex) in data[(item as any).fieldKey]"
                :key="citem.serialNumber"
              >
                <div class="cell">{{ citem?.serialNumber || (cindex as number) + 1 }}版</div>
                <div class="cell">{{
                  citem?.confirmDate ? formatTime(citem?.confirmDate, 'yyyy-MM-dd HH:mm') : '-'
                }}</div>
                <div class="cell">{{ citem?.remark || '-' }}</div>
                <div class="cell">
                  <fileContent
                    v-if="citem?.attachmentUrl"
                    :url="citem?.attachmentUrl"
                  ></fileContent>
                  <span v-else>-</span>
                </div>
              </div>
            </div>
          </template>
          <div v-else>{{
            (item as any).dictCode
              ? getDictLabels(
                  getIntDictOptions((item as any).dictCode, true),
                  (item as any).fieldValue || data[(item as any).fieldKey]
                )
              : data[(item as any).fieldKey] || '-'
          }}</div>
        </FormDescriptionItem>
      </FormDescription>
    </template>
  </div>
</template>

<script setup lang="ts">
// import { getUrl } from '../util'
import lineAvatars from '@/components/template/table/components/lineAvatars.vue'
import lineTage from '@/components/template/table/components/lineTage.vue'
import { getIntDictOptions } from '@/utils/dict'
import fileContent from './fileContent.vue'
import BaseSmallImgAndFile from '@/views/OA/new/product/components/displayInfo/baseSmallImgAndFile.vue'
import { formatTime } from '@/utils'
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
  },
  showExpand: {
    type: Boolean,
    default: false
  }
})

const isExpand = ref(true)
const txt = computed(() => (isExpand.value ? '收起' : '展开'))
const isAuditExpand = ref(false)
const auditTxt = computed(() => (isAuditExpand.value ? '收起' : '展开'))
const getAuditList = (list: any) => {
  if (!list || list.length === 0) return []
  return !isAuditExpand.value ? list.slice(0, 3) : list
}

// oss图片链接压缩
const getUrl = (url: string) => {
  if (!url) return ''
  return `${url}${url.indexOf('?') > -1 ? '&' : '?'}x-oss-process=image/resize,p_40`
}

const formatColor = (color: string) => {
  if (!color) return []
  return color.split(',').map((item) => ({
    name: (item as any).split('_')[0], // 提取颜色名称
    url: (item as any).split('_')[1] // 提取颜色值
  }))
}

const formatUrl = (urls: string) => {
  if (!urls) return []
  return urls.split(',').map((item) => ({
    url: item
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
    position: relative;
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

.image-wapper {
  .item {
    width: 98px;
    height: 98px;
    border-radius: 10px;
    background: #f7f7f7;
    // box-sizing: border-box;
    // border: 1px solid #e5e5e5;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 10px;
    margin-top: 10px;
    // padding: 5px 8px 10px 8px;

    .img {
      width: 98px;
      height: 98px;
    }
  }
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
.audit-content {
  width: 100%;
  .audit-content-main {
    width: 100%;
    .audit-item {
      display: flex;
      &:last-child {
        .info-area {
          .remark-content {
            border-left: none;
            // padding-bottom: 0;
          }
        }
      }
      .time {
        font-size: 12px;
        color: #8c8e90;
        width: 150px;
        padding: 4px 20px 0px 4px;
        box-sizing: border-box;
        text-align: right;
      }
      .info-area {
        flex: 1;
        .top {
          display: flex;
          align-items: center;
          .status-icon {
            width: 16px;
            height: 16px;
            margin-right: 20px;
          }
          .tip {
            font-size: 14px;
            margin-left: 5px;
            color: #eb3737;
            &_1 {
              color: #5db300;
            }
          }
          .tag {
            margin-left: 10px;
            padding: 3px 6px;
            border-radius: 2px;
            background: rgba(235, 55, 55, 0.1);
            font-size: 10px;
            color: #eb3737;
          }
        }
        .remark-content {
          padding-left: 30px;
          border-left: solid #e5e5e5 1px;
          margin-left: 7px;
          padding-bottom: 20px;
          padding-top: 10px;
          font-size: 14px;
          color: #242527;
        }
      }
    }
  }
  .show-more {
    margin: 0 -10px;
    border-top: solid 1px #e5e5e5;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 8px;
    margin-bottom: -4px;
  }
}

.table-content {
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

.sku-table {
  margin: -12px -10px;
  .list-header {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    background-color: #f4f6fa;
    color: #666666;
    font-weight: 400;
    font-size: 14px;
    .cell {
      padding: 8px 11px;
      line-height: 23px;
      border-right: 1px solid #e5e5e5;
      &:last-child {
        border: 0;
      }
    }
  }
  .list-row {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    color: #333333;
    font-weight: 400;
    font-size: 14px;
    border-top: 1px solid #e5e5e5;
    .cell {
      padding: 8px 11px;
      line-height: 23px;
      border-right: 1px solid #e5e5e5;
      display: flex;
      align-items: center;
      &:last-child {
        border: 0;
      }
    }
  }
}

:deep() {
  .form-description-item {
    &.red {
      .form-desc-label {
        background-color: rgba(234, 0, 0, 0.1) !important;
      }
    }
  }
}

.version-content {
  margin: -12px -10px;
  width: calc(100% + 24px);
  .list-row {
    border-bottom: solid #e5e5e5 1px;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: 100px 160px 1fr 1fr;
    &:last-child {
      border-bottom: 0;
    }
    &.header {
      background: #f4f6fa;
    }
    .cell {
      padding: 12px 16px;
      border-right: solid #e5e5e5 1px;
      box-sizing: border-box;
      height: 100%;
      display: flex;
      align-items: center;
      word-break: break-all;
      &:last-child {
        border-right: 0;
      }
    }
  }
}
</style>
