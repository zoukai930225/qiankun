<template>
  <div>
    <div class="audit-content" v-if="getLoadList.length">
      <div class="audit-content-item" v-for="(value, index) in getLoadList" :key="index">
        <div class="row">
          <div class="audit-time">{{ value.endTime }}</div>
          <div
            class="audit-timeLine"
            :class="{ 'audit-timeLineLast': index === getLoadList.length - 1 }"
          >
            <img class="audit-icon" v-if="value.approvalStatus === 1" :src="timeLine_pass" alt="" />
            <img
              class="audit-icon"
              v-if="value.approvalStatus === 0"
              :src="timeLine_nopass"
              alt=""
            />
          </div>

          <div class="flex column w-[calc(100%-200px)] mb-24px">
            <div class="title">
              <div class="audit-person">{{ value?.assigneePerson?.name }}</div>
              <div
                class="audit-status"
                :style="{
                  color: value.approvalStatus === 1 ? '#349B34' : '#EB3737'
                }"
              >
                {{
                  value.taskName +
                  (value.approvalStatus !== undefined && value.approvalStatus !== null
                    ? value.approvalStatus === 1
                      ? '通过'
                      : '不通过'
                    : '')
                }}
              </div>
              <div class="expandBtn" v-if="value.auditType !== 1 && value.approvalStatus !== '0'">
                <div class="line"></div>
                <div class="expand" @click="toggleExpand(index)">
                  <span>{{ value.isExpand ? '收起' : '展开' }}</span>
                  <img :src="value.isExpand ? arrowUp : arrowDown" />
                </div>
              </div>
            </div>
            <div class="audit-remark" v-if="value.isExpand">
              {{ value.comment || '无' }}
            </div>
            <div v-if="value.attachmentUrl" class="mt-5px flex column justify-start items-start">
              <div class="files-image" v-if="getFileList(value.attachmentUrl).length">
                <div
                  class="file-image"
                  v-for="item in getFileList(value.attachmentUrl)"
                  :key="item?.url"
                  @click="handleOpenFiles(item)"
                >
                  <el-image
                    :src="fileImage(item)"
                    fit="contain"
                    :style="{ width: '100px' }"
                    :preview-src-list="isImage(item?.name) ? previewList(value.attachmentUrl) : []"
                  />

                  <el-tooltip :content="item?.name">
                    <el-button link type="primary" class="!font-size-12px hidden mt-4px">
                      <span
                        :style="{
                          width: '100px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          'white-space': 'nowrap'
                        }"
                      >
                        {{ item.name }}
                      </span>
                    </el-button>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import timeLine_pass from '@/assets/imgs/supplier/timeLine_pass.svg'
import timeLine_nopass from '@/assets/imgs/supplier/timeLine_nopass.svg'
import arrowUp from '@/assets/imgs/supplier/arrowUp.svg'
import arrowDown from '@/assets/imgs/supplier/arrowDown.svg'
import { isExcel, isImage, isPDF, isPPT, isWord, microsoftOnlinePreviewUrl } from '@/utils/file'
// 引入文件类型图标
import fileExcel from '@/assets/imgs/excel.svg'
import filePdf from '@/assets/imgs/pdf.svg'
import fileDoc from '@/assets/imgs/doc.svg'
import filePpt from '@/assets/imgs/ppt.svg'

const props = defineProps({
  auditLogs: {
    type: Array as any,
    default: () => []
  }
})
const getLoadList = ref<any>([])

const previewList = (urls: string) =>
  getFileList(urls)
    .filter((file) => isImage(file?.name))
    .map((file) => file?.url)

watch(
  () => props.auditLogs,
  (val) => {
    getLoadList.value =
      val.map((item) => ({
        ...item,
        isExpand: true
      })) || []
  }
)

function getFileList(filesUrl: string) {
  if (!filesUrl) return []
  return filesUrl?.split(',').map((file) => {
    const [url, name] = file.split('?name=')
    return {
      url,
      name: name ?? url
    }
  })
}

const fileImage = ({ name, url }) => {
  if (isImage(name)) {
    return url
  }

  const ext = url?.split('.').pop()?.toLowerCase() || ''
  if (['xls', 'xlsx'].includes(ext)) return fileExcel
  if (['pdf'].includes(ext)) return filePdf
  if (['doc', 'docx'].includes(ext)) return fileDoc
  if (['ppt', 'pptx'].includes(ext)) return filePpt
}

function handleOpenFiles({ name, url }) {
  if (isPPT(name) || isExcel(name) || isWord(name)) {
    window.open(microsoftOnlinePreviewUrl(url), '_blank')
  } else if (isPDF(name)) {
    window.open(url, '_blank')
  }
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

.el-link {
  margin-top: 4px;
  font-size: 12px;

  :deep(.el-link__inner) {
    word-break: break-all;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
  }
}
</style>
