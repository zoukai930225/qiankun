<template>
  <div>
    <div class="audit-content" v-if="getLoadList.length">
      <div class="audit-content-item" v-for="(value, index) in getLoadList" :key="index">
        <div class="row">
          <div class="audit-time">{{ value.updatedAt }}</div>
          <div
            class="audit-timeLine"
            :class="{ 'audit-timeLineLast': index === getLoadList.length - 1 }"
          >
            <img class="audit-icon" :src="getSrc(value)" alt="" />
          </div>

          <div class="flex column w-[calc(100%-200px)] mb-24px">
            <div class="title">
              <div class="audit-person">{{ value.examinePersonName }}</div>
              <div
                class="audit-status"
                :style="{
                  color: getColor(value)
                }"
              >
                {{ getDesc(value.operateType, value.examineResult) }}
              </div>
              <div class="expandBtn" v-if="value.auditType !== 1 && value.approveStatus !== '0'">
                <div class="line"></div>
                <div class="expand" @click="toggleExpand(index)">
                  <span>{{ value.isExpand ? '收起' : '展开' }}</span>
                  <img :src="value.isExpand ? arrowUp : arrowDown" />
                </div>
              </div>
            </div>
            <div class="audit-remark" v-if="value.isExpand">
              {{ value.examineRemark || '无' }}
            </div>
            <div v-if="value.examineAttachmentUrl" class="mt-8px">
              <div v-for="item in getFileList(value.examineAttachmentUrl)" :key="item?.url">
                <el-link
                  :underline="false"
                  type="primary"
                  @click="downloadByUrl2(item?.url, item?.name)"
                >
                  {{ item?.name }}
                </el-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import timeLine_submit from '@/assets/imgs/supplier/timeLine_submit.svg'
import timeLine_pass from '@/assets/imgs/supplier/timeLine_pass.svg'
import timeLine_nopass from '@/assets/imgs/supplier/timeLine_nopass.svg'
import arrowUp from '@/assets/imgs/supplier/arrowUp.svg'
import arrowDown from '@/assets/imgs/supplier/arrowDown.svg'
import { downloadByUrl2 } from '@/utils/download'

const props = defineProps<{
  auditLogs: any[]
  timeKey?: string
  statusKey?: string
  personKey?: string
  commentKey?: string
  descKey?: string
  desc?: (status?: any, desc?: string) => string
  isSubmit?: (status: any) => boolean
  isPass?: (status: any) => boolean
  isNoPass?: (status: any) => boolean
  isRecall?: (status: any) => boolean
  isRemove?: (status: any) => boolean
}>()
const getLoadList = ref<any>([])

watch(
  () => props.auditLogs,
  (val) => {
    getLoadList.value = (
      val.map((item) => ({
        ...item,
        isExpand: true
      })) || []
    ).sort((a, b) => {
      return +new Date(a.updatedAt) - +new Date(b.updatedAt)
    })
  }
)

function getFileList(filesUrl: string) {
  return filesUrl?.split(',').map((file) => {
    const fileUrl = new URL(file)
    const url = file
    const name = fileUrl.searchParams.get('fileName') || file
    return {
      url,
      name: name
    }
  })
}

function getColor(value) {
  switch (true) {
    case value.operateType === 1:
      return '#666'
    case value.examineResult === 1:
      return '#349B34'
    case value.examineResult === 2:
      return '#EB3737'
    default:
      return ''
  }
}

function getSrc(value) {
  switch (true) {
    case value.operateType === 1:
      return timeLine_submit
    case value.examineResult === 1:
      return timeLine_pass
    case value.examineResult === 2:
      return timeLine_nopass
    default:
      return ''
  }
}

const types = {
  1: '提交',
  2: '图片重新上传',
  3: 'OA审核',
  4: '版师审核',
  5: '设计师审核'
}

function getDesc(type, result) {
  return `${types[type]}${result === 1 && type !== 1 ? '通过' : type !== 1 ? '拒绝' : ''}`
}

const toggleExpand = (index) => {
  getLoadList.value[index].isExpand = !getLoadList.value[index].isExpand
}
</script>

<style scoped lang="less">
.audit-content {
  box-sizing: border-box;
  width: 100%;
  height: 100%;

  .audit-time {
    font-size: 14px;
    width: 180px;
    color: #8c8e90;
  }

  .audit-timeLine {
    display: flex;
    width: 1px;
    height: auto;
    margin-right: 30px;
    background: #d8dce5;

    .audit-icon {
      margin-left: -10px;
      width: 22px;
      height: 22px;
    }
  }

  .audit-timeLineLast {
    background: transparent;
  }

  .title {
    display: flex;

    .audit-person {
      color: #333;
      font-size: 14px;
      font-weight: 600;
      min-width: 100px;
    }

    .audit-status {
      font-size: 14px;
      margin-left: 20px;
    }

    .expandBtn {
      margin-left: 20px;
      display: flex;
      align-items: center;

      .line {
        width: 1px;
        height: 10px;
        background: #e5e5e5;
      }

      .expand {
        margin-left: 14px;
        color: #0064ff;
        font-size: 14px;
        display: flex;
        align-items: center;
        cursor: pointer;

        &:hover {
          opacity: 0.8;
        }

        img {
          margin-left: 6px;
        }
      }
    }
  }

  .audit-remark {
    font-size: 12px;
    color: #242527;
    margin-top: 10px;
    width: 100%;
    padding: 10px;
    border-radius: 4px;
    background: #f4f4f4;
    word-break: break-all;
    white-space: normal;
    overflow-wrap: break-word;
  }
}

.audit-file {
  margin-left: 0;
  max-width: 500px;

  :deep(span) {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 1.2;
  }
}

.files-image {
  display: flex;
  flex: 1 !important;
  margin-top: 12px;
  max-width: 1500px;
  padding: 12px;
  overflow-x: scroll;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  max-width: 590px;

  &::-webkit-scrollbar {
    // display: none;
    height: 5px;
  }

  .file-image {
    display: flex;
    flex-direction: column;
    margin-left: 12px;

    &:first-of-type {
      margin-left: 0;
    }
  }
}

.el-image {
  width: 100px;
  height: 100px;
  img {
    width: 100px;
  }
}
</style>
