<template>
  <div>
    <div class="form-wapper1">
      <div class="form-wapper1-header">
        <div class="form-wapper1-header-line"></div>
        <div class="form-wapper1-header-title">操作记录</div>
      </div>
    </div>
    <div class="audit-content" v-if="logsList && logsList.length > 0">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item
          v-for="(item, index) in logsList"
          :title="item.color"
          :icon="CaretRight"
          :name="index.toString()"
          :key="index"
        >
          <div class="audit-content-item" v-for="(ite, it) in item.children" :key="it">
            <div class="row">
              <div class="audit-time">{{ ite.createdAt }}</div>
              <div
                class="audit-timeLine"
                :class="{ 'audit-timeLineLast': it === item.children.length - 1 }"
              >
                <img
                  class="audit-icon"
                  v-if="ite.examineResult == '2'"
                  src="@/assets/imgs/oa/audit_fali.png"
                  alt=""
                />
                <img
                  class="audit-icon"
                  v-if="ite.examineResult == '1'"
                  src="@/assets/imgs/oa/audit_pass.png"
                  alt=""
                />
              </div>

              <div
                style="
                  display: flex;
                  flex-direction: column;
                  width: calc(100% - 168px);
                  margin-bottom: 20px;
                "
              >
                <div class="title-wapper">
                  <div class="flex-row avator-wapper" style="padding-bottom: 3px; margin-top: -1px">
                    <img :src="ite.avatarOrigin" alt="" class="avator" v-if="ite.avatarOrigin" />
                    <span class="name" v-if="ite.examinePersonName">{{
                      ite.examinePersonName
                    }}</span>
                  </div>
                  <div
                    class="audit-status"
                    :style="{ color: ite.examineResult == '1' ? '#349B34' : '#EB3737' }"
                  >
                    {{ ite.examineTitle }}
                  </div>
                </div>

                <div class="audit-remark">{{ ite.examineRemark }}</div>
                <!-- <div v-if="ite?.examineAttachmentUrl" class="audit-attachment">
                  <el-image
                    style="width: 54px; height: 54px; border-radius: 4px"
                    :src="ite?.examineAttachmentUrl"
                    :zoom-rate="1.2"
                    :max-scale="7"
                    :min-scale="0.2"
                    :preview-src-list="[ite?.examineAttachmentUrl]"
                    show-progress
                    :initial-index="4"
                    fit="cover"
                  />
                </div> -->
                <div v-if="ite?.examineAttachmentUrl" class="audit-attachment">
                  <!-- 分割字符串为数组 -->

                  <div class="img-wapper" v-if="ite.examineAttachmentUrl.imageUrls.length > 0">
                    <el-image
                      v-for="imgItem in ite.examineAttachmentUrl.imageUrls"
                      :key="imgItem.url"
                      style="width: 54px; height: 54px; border-radius: 4px; margin-right: 10px"
                      :src="imgItem.url"
                      :preview-src-list="[imgItem.url]"
                      show-progress
                      fit="cover"
                    />
                  </div>

                  <!-- 文件展示 -->
                  <div class="file-wapper" v-if="ite.examineAttachmentUrl.fileUrls.length > 0">
                    <div>附件：</div>
                    <div v-for="fileItem in ite.examineAttachmentUrl.fileUrls" :key="fileItem.url">
                      <div class="file-item" :key="index">
                        <span class="file-url" @click="download(fileItem.url, fileItem.name)">{{
                          fileItem.name || '未知文件'
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CaretRight } from '@element-plus/icons-vue'
import { defineProps } from 'vue'

const props = defineProps({
  onShow: {
    type: Boolean,
    default: false
  },
  logsList: {
    type: Array,
    default: () => []
  }
})

watch(
  () => props.logsList,
  (newLogsList) => {
    activeNames.value = ['0']
  }
)

const activeNames = ref(['0']) // 控制折叠面板的展开状态
const handleChange = (newActiveNames) => {
  console.log('折叠面板状态变化:', newActiveNames)
  activeNames.value = newActiveNames
}

const download = (url, name) => {
  // 单独打开窗口
  const downA = document.createElement('a')
  downA.href = url
  downA.download = name || ''
  downA.click()
  window.URL.revokeObjectURL(url)
}
</script>

<style scoped lang="scss">
.form-wapper1 {
  width: calc(100%);
  display: flex;
  &-header {
    height: 52px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 20px;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 16px;
    width: 100%;
    &-line {
      width: 3px;
      height: 10px;
      background: #0064ff;
    }
    &-title {
      padding-left: 6px;
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      letter-spacing: normal;
      color: #333333;
    }
  }
  &-form {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }
}
.audit-content {
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
  border-radius: 4px;
  background: #f8f8f9;
  box-sizing: border-box;

  /* 应用/边框 */
  border: 1px solid #e5e5e5;

  padding-left: 30px;
  padding-right: 20px;
  padding-top: 20px;
  .audit-time {
    font-size: 12px;
    width: 141px;

    color: #8c8e90;
  }
  .audit-timeLine {
    display: flex;
    width: 1px;
    height: auto;
    margin-right: 20px;
    background: #d8dce5;
    .audit-icon {
      margin-left: -7.5px;
      width: 16px;
      height: 16px;
    }
  }
  .audit-timeLineLast {
    background: transparent;
  }

  .audit-status {
    font-size: 14px;
    margin-top: -1px;
    padding-bottom: 3px;

    color: #349b34;
  }
  .audit-remark {
    font-size: 12px;

    color: #242527;
  }
  .audit-attachment {
  }
}

.exandMore {
  border-top: 1px solid #e5e5e5;
  height: 38px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: -30px;
  width: calc(100% + 52px);
  &-btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    height: 38px;
    &-text {
      margin-left: auto;
      font-size: 14px;
      line-height: 22px;
      text-align: center;
      color: #0059e8;
    }
    &-arrow {
      margin-left: 5px;
      margin-right: auto;
      width: 14px;
      height: 14px;
    }
  }
}
:deep(.el-collapse-item__header) {
  background: #f8f8f9;
}

:deep(.el-collapse-item__wrap) {
  background: #f8f8f9;
}
.audit-content-item {
  background: #f8f8f9;
}
.img-wapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.file-wapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  .file-url {
    font-size: 12px;
    cursor: pointer;
    /* 主题色/主色 */
    color: #0064ff;
  }
}
.title-wapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  .avator-wapper {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .avator {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    margin-right: 8px;
  }
  .name {
    min-width: 53px;
    font-size: 14px;
    color: #333333;
  }
}
</style>
