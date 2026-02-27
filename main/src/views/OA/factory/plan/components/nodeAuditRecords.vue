<template>
  <div class="auditRecords" v-for="item in list" :key="item.id">
    <div class="title">
      <img :src="dot" />
      <span>{{ '审核人' }}</span>
    </div>
    <div class="infos">
      <div class="left">
        <div class="line"></div>
      </div>
      <div class="right">
        <div class="auditDetails">
          <div class="nodeName">{{ taskName }}</div>
          <div class="submitPerson">
            <commonUser :data="item.auditUserInfo" v-if="item.auditUserInfo" />
            <div class="status" :class="item.auditStatus === '1' ? 'pass' : 'reject'">{{ item.auditStatus === '1' ?
              '审核通过' : '审核拒绝' }}</div>
          </div>
          <div class="time">{{ item.updatedAt }}</div>
        </div>
        <div class="auditAttachment" v-if="item.attachmentUrl">
          <div class="attachLabel">附件:</div>
          <div class="fileList">
            <div class="file" v-for="(file, index) in splitImgOrFile(item.attachmentUrl)?.fileUrlList" :key="index"
              @click="downloadAttachFile(file)" style="width: 295px !important;">
              <Icon icon="ep:document" class="docIcon" />
              <div class="text1 fileName">{{ file.fileName }}</div>
            </div>
          </div>
        </div>
        <div class="auditRemarks" v-if="item.auditComment">
          <s-text-area readonly v-model="item.auditComment" />
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import dot from '@/assets/svgs/newProduct/dot.svg'
import { splitImgOrFile, downloadAttachFile } from "@/views/OA/factory/hooks"
import commonUser from '@/views/OA/factory/components/commonUser.vue'
const props = defineProps({
  list: {
    type: Array as any,
    default: () => []
  },
  taskName: {
    type: String,
    default: ''
  }
})

</script>

<style lang="scss" scoped>
.auditRecords {
  .title {
    display: flex;
    align-items: center;

    span {
      font-size: 14px;
      margin-left: 3px;
      color: #333;
      font-weight: 600;
    }
  }

  .infos {

    .right {
      margin-left: 6px;
      padding: 16px 0 16px 9px;
      border-left: 1px dashed rgb(0, 100, 255, .4);

      .auditDetails {
        width: 246px;
        height: 96px;
        box-sizing: border-box;
        background-image: url('@/assets/imgs/oa/product/proposedBg.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-evenly;
        padding-left: 10px;
        font-size: 14px;
        color: #333;

        .nodeName {
          padding: 4px;
          border-radius: 2px;
          width: fit-content;
          background: linear-gradient(270deg, #f4f6fa 0%, #d4e1f9 100%);
        }

        .submitPerson {
          display: flex;
          align-items: center;

          .status {
            font-size: 12px;
            padding: 4px 8px;
            border-radius: 10px;
            color: #666;
            background: rgba(112, 112, 112, 0.1);

            &.pass {
              color: #24BC29;
              background: rgba(36, 188, 41, 0.1);
            }

            &.reject {
              color: #FF2020;
              background: rgba(255, 32, 32, 0.1);
            }

            &.pending {
              color: #FF8C00;
              background: rgba(255, 140, 0, 0.1);
            }
          }

        }

        .time {}
      }

      .auditAttachment {
        margin-top: 16px;
        display: flex;
        font-size: 14px;

        .attachLabel {
          color: #666;
        }

        .fileList {
          width: calc(100% - 44px);
          margin-left: 6px;
          flex: 1;

          .file {
            display: flex;
            align-items: center;
            margin-bottom: 4px;
            cursor: pointer;

            .docIcon {
              color: #909399;
            }

            .fileName {
              color: #333;
              width: 86%;
            }

            &:hover {

              .docIcon,
              .fileName {
                color: #0064ff;
              }
            }
          }
        }
      }

      .auditRemarks {
        margin-top: 16px;
      }
    }

  }
}
</style>
