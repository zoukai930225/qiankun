<!--
 * @Date: 2024-08-05 09:37:19
 任务节点信息查看
-->
<template>
  <div class="review-item-wapper" v-if="list?.length">
    <div v-for="(item, index) in list" :key="index" class="review-item">
      <div :class="formatItem(item)" class="item">
        <BaseTitle
          :title="`${formatTitle(item)} ${formatSubtitle(item)}`"
          :recordType="item.type"
        />
        <div class="pd-15">
          <!-- 隐藏 -->
          <div class="content" v-if="item.isEdit == false">
            <!-- 人员 -->
            <div class="title" v-if="item?.operators?.length">人员</div>
            <div class="desc" v-if="item?.operators?.length">
              <div v-for="ite in item.operators" :key="ite.avatarOrigin" class="atator-wapper">
                <img :src="ite.avatarOrigin" alt="" class="people-atator" />
                <span class="review-value">{{ ite.operatorRealname }}</span>
              </div>
            </div>
            <!-- 任务完成时间 -->
            <div class="title" v-if="item.type == 2">任务完成时间</div>
            <div class="desc review-value" v-if="item.type == 2">{{
              formatTime(item?.expectedCompletionTime || item?.createdAt, 'yyyy-MM-dd') || ''
            }}</div>
            <!--计划完成时间  -->
            <div class="title" v-if="item.type == 1">计划完成时间</div>
            <div class="desc review-value" v-if="item.type == 1">{{
              formatTime(item?.expectedCompletionTime, 'yyyy-MM-dd') || ''
            }}</div>

            <!-- 审核人员 -->
            <div class="title" v-if="item?.auditors?.length">审核人员</div>
            <div class="desc" v-if="item?.auditors?.length">
              <div v-for="ite in item.auditors" :key="ite.operatorRealname" class="atator-wapper">
                <img :src="ite.avatarOrigin" alt="" class="people-atator" />
                <span class="review-value">{{ ite.operatorRealname }}</span>
              </div>
            </div>

            <!-- 评论 -->
            <div class="title" v-if="item.type != 1">备注</div>
            <div class="desc review-value">{{ item?.remark || '' }}</div>

            <!-- 附件 -->
            <div class="title" v-if="item.type == 2">附件</div>

            <!-- 附件中的附件 -->
            <div
              class="desc"
              v-if="item.type == 2"
              style="display: flex; flex-direction: row; align-items: center"
            >
              <div
                v-for="ite in formatFile(item)"
                :key="ite.fileName"
                style="display: flex; flex-direction: row; align-items: center; margin-right: 10px"
              >
                <img src="@/assets/imgs/team/file-other-type.png" alt="" class="type-icon" />
                <span
                  class="item-desc file-link"
                  @click="downloadByUrl(ite.ossPath, ite.fileName)"
                  >{{ ite.fileName }}</span
                >
              </div>
            </div>

            <!-- 附件中的图片 -->
            <div class="desc" v-if="item.type == 2" style="display: flex; flex-direction: row">
              <div v-for="(ite, idx) in formatImgFromFile(item)" :key="idx">
                <el-image
                  class="img-submit"
                  :src="ite.ossPath"
                  :preview-src-list="formatImgFromFilePre(item)"
                  v-if="ite.type != '1'"
                />
              </div>
            </div>

            <!-- 路径 -->
            <div class="title" v-if="item.type == 2">路径</div>
            <div class="desc" v-if="item.type == 2">
              <div class="lujing" v-for="ite in formatArr(item.annexes)" :key="ite.url">
                <img src="@/assets/imgs/team/lianjie.png" alt="" class="icon-img" />
                <span class="file-link" @click="openWindowByUrl(ite.url)">{{ ite.url }}</span>
                <span class="sub-title">备注：</span>
                <span>{{ ite.urlRemarks }}</span>
              </div>
            </div>
          </div>
          <div v-else>
            <DobuleEdit
              v-if="formatTitle(item) == '任务提交'"
              :detail="item"
              @success="handleSuccess"
              :index="index"
              @cancel="handleCancel"
              :currentSubType="currentSubType"
              :parentId="parentId"
            />
          </div>

          <div class="mid" :class="formatMidLineStyle(item)"></div>

          <div class="title"
            ><div class="info-wapper">
              <div class="flex-row" style="align-items: center">
                <img :src="item.createdAvatar" v-if="item.createdAvatar" class="avator" />
                <span>{{ item.createdRealname }}</span>
              </div>
              <div
                v-if="
                  formatTitle(item) == '任务提交' &&
                  !isFinished &&
                  userId == item.createdId &&
                  !item.isEdit
                "
                ><el-button size="small" type="primary" @click="handleEdit(index)">编辑</el-button>
              </div>
            </div>
            <span>{{ formatTime(item.createdAt, 'yyyy-MM-dd HH:mm:ss') }}</span></div
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user'
import { downloadByUrl } from '@/utils/download'
import { formatTime } from '@/utils/index'
import BaseTitle from './baseTitle.vue'
import { ImageType, openWindowByUrl } from './common'
import DobuleEdit from './dobuleEdit.vue'
const userStore = useUserStore()
defineOptions({ name: 'ReviewItem' })

const props = defineProps({
  detailList: {
    type: Array<any>,
    default: () => {
      return []
    }
  },
  detailNode: {
    type: Number,
    default: -1
  },
  isTemporary: {
    type: Boolean,
    default: false
  },
  currentSubType: {
    type: String,
    default: ''
  },
  isFinished: {
    type: Boolean,
    default: false
  },
  parentId: {
    type: String,
    default: ''
  }
})

// 是不是我的任务
const userId = computed(() => userStore.user.id || '')

const list = ref()
const handleEdit = (index) => {
  list.value[index].isEdit = true
}

watch(
  () => props.detailList,
  (newValue) => {
    list.value = newValue.map((item) => {
      return {
        ...item,
        isEdit: false
      }
    })
  },
  {
    deep: true,
    immediate: true
  }
)

// 附件提取文件
const formatFile = (item) => {
  return item.annexes.filter((item) => {
    if (item.type == 0 && !ImageType.includes(item.fileType)) {
      return item
    }
  })
}

// 附件提取图片
const formatImgFromFile = (item) => {
  return item.annexes.filter((item) => {
    if (item.type == 0 && ImageType.includes(item.fileType)) {
      return item
    }
  })
}

// 获取图片链接地址
const formatImgFromFilePre = (item) => {
  const arr = formatImgFromFile(item)
  return arr.map((item) => item.ossPath)
}

// 路径
const formatArr = (arr) => {
  if (!arr.length) return []
  return arr.filter((item) => {
    if (item.type == '1') {
      return item
    }
  })
}

const formatTitle = (item) => {
  const typeTitles = {
    1: '任务指派',
    2: '任务提交',
    3: '流程完成卡片',
    4: '任务暂停卡片',
    5: '评论卡片',
    6: '暂停取消卡片',
    7: '审核',
    8: '审核',
    10: '终止'
  }

  return typeTitles[item?.type] || ''
}

//展示节点信息 1、方案 2、拍摄 3/后期 4、页面 5\完成 6\终止
const formatSubtitle = (item) => {
  if (props.isTemporary && item.type != 7 && item.type != 8) return ''
  if (item.type == 7) return '(通过)'
  if (item.type == 8) return '(不通过)'
  const nodeDescriptions = {
    2: '(方案)',
    // 3: '(拍摄)',
    // 4: '(后期)',
    5: '(页面)',
    6: '(任务完成)'
  }

  if (props.currentSubType) {
    const index = props.currentSubType
    let desc = ''
    if (index == '2') {
      desc = '视频'
    } else if (index == '1') {
      desc = '静物'
    } else if (index == '0') {
      desc = '人像'
    }
    nodeDescriptions[3] = `(${desc}拍摄)`
    nodeDescriptions[4] = `(${desc}后期)`
  } else {
    nodeDescriptions[3] = '(拍摄)'
    nodeDescriptions[4] = '(后期)'
  }
  const description = nodeDescriptions[props.detailNode] || ''
  return description
}

const formatMidLineStyle = (item) => {
  const typeMidLineStyles = {
    1: 'mid2', // 任务指派
    2: 'mid5', // 任务提交
    3: 'mid3', // 完成卡片
    4: 'mid1', // 任务终止
    5: 'mid4' // 评论
  }
  return typeMidLineStyles[item.type] || ''
}

const formatItem = (item) => {
  const typeItemStyles = {
    1: 'item2', // 任务指派
    2: 'item5', // 任务提交
    3: 'item3', // 完成卡片
    4: 'item1', // 任务暂停
    5: 'item4', // 评论卡片
    6: 'item6', // 取消暂停卡片
    7: 'item7', // 审核通过
    8: 'item8', // 审核不通过
    10: 'item10' // 审核不通过
  }

  return typeItemStyles[item?.type] || ''
}

const emit = defineEmits(['success', 'cancel'])

const handleSuccess = () => {
  emit('success')
}

const handleCancel = (index) => {
  list.value[index].isEdit = false
}
</script>

<style scoped lang="scss">
.review-item-wapper {
  // margin: 0 20px;
  background: white;
  margin: 20px 0;
  .review-item {
    // padding: 10px 20px;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  .review-item:last-child {
    margin-bottom: 0;
  }
  .content {
    display: flex;
    flex-direction: column;
    .desc {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: wrap;
      font-size: 12px;
      color: #333;
      line-height: 20px;
      margin-bottom: 15px;
      font-weight: bold;
      .lujing {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-right: 16px;
      }
    }
  }

  .title {
    font-size: 12px;
    color: #999999;
    line-height: 20px;
    margin-bottom: 5px;
    display: flex;
    flex-direction: column;
  }

  .img {
    width: 110px;
    height: 110px;
    margin-bottom: 16px;
  }

  .mid {
    width: 100%;
    height: 1px;
    background: #e7edf7;
    margin: 0 0 15px 0;
  }
  .item1 {
    background: #fffafb;
    box-shadow: 0px 2px 13px 0px rgba(80, 0, 9, 0.23);
  }
  .mid1 {
    border-top: 1px solid #fce1e4;
  }
  .item2 {
    background: #fdfaf6;
    box-shadow: 0px 2px 13px 0px rgba(64, 35, 0, 0.23);
    border-radius: 0px 0px 4px 4px;
  }
  .mid2 {
    border-top: 1px solid #f0f0f0;
  }
  .item3 {
    background: #fbfcff;
    box-shadow: 0px 2px 11px 0px rgba(0, 44, 110, 0.3);
  }
  .mid3 {
    border-top: 1px solid #e6eaf8;
  }
  .item4 {
    background: #fbfcff;
    box-shadow: 0px 2px 11px 0px rgba(0, 44, 110, 0.3);
  }
  .mid4 {
    border-top: 1px solid #f7f2ec;
  }
  .item5 {
    background: #fbfcff;
    box-shadow: 0px 2px 11px 0px rgba(0, 44, 110, 0.3);
    border-radius: 0px 0px 4px 4px;
  }
  .item6 {
    background: #fbfcff;
    box-shadow: 0px 2px 11px 0px rgba(0, 44, 110, 0.3);
    border-radius: 0px 0px 4px 4px;
  }
  .item7 {
    background: #fbfffa;
    box-shadow: 0px 2px 13px 0px rgba(11, 46, 0, 0.23);
    border-radius: 0px 0px 4px 4px;
  }
  .item8 {
    background: #fffafb;
    border-radius: 0px 0px 4px 4px;
  }
  .item10 {
    background: #fbfcff;
    box-shadow: 0px 2px 11px 0px rgba(0, 44, 110, 0.3);
    border-radius: 0px 0px 4px 4px;
  }

  .mid5 {
    border-top: 1px solid #e7f5e3;
  }

  .item {
    border-radius: 0px 0px 4px 4px;

    .pd-15 {
      padding: 0 15px 15px 15px;
      box-sizing: border-box;
    }
  }
}

.review-item-wapper:first-child {
  margin-top: 0px;
}
.review-item-wapper:last-child {
  margin-bottom: 0px;
}

.avator {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-right: 10px;
}

.atator-wapper {
  padding: 2px 4px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 18px;
  .people-atator {
    width: 15px;
    height: 15px;
    margin-right: 6px;
    border-radius: 50%;
  }
}
.img-submit {
  width: 110px;
  height: 110px;
  border-radius: 10px;
  margin-right: 20px;
  margin-bottom: 10px;
}
.icon-img {
  width: 12px;
  height: 12px;
  margin-right: 12px;
}
.sub-title {
  font-size: 12px;
  color: #999999;
  margin-left: 20px;
}
.file-link {
  color: #0064ff;
  cursor: pointer;
}

.review-value {
  color: #333;
}
.flex-row {
  display: flex;
  flex-direction: row;
}
.info-wapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
