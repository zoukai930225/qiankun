<!--
 * @Date: 2025-02-11 17:22:22
-->
<template>
  <el-dialog v-model="visible" :width="width" :show-close="false" :before-close="handleClose"
    class="oadialog-background" :close-on-click-modal="false">
    <template #header="{ }">
      <div class="my-header">
        <div>
          <img src="@/assets/imgs/oa/dayang_title.svg" class="shenhe-title" />
          <span>{{ title }}</span>
        </div>

        <img src="@/assets/imgs/negativeReviewDashboard/close.svg" alt="" style="cursor: pointer"
          @click="handleClose" />
      </div>
    </template>
    <div style="
        display: flex;
        flex-direction: column;
        overflow: auto;
        padding: 16px;
        border-radius: 20px;
        background: #ffffff;
      ">
      <ElScrollbar max-height="65vh">
        <!-- 详情展示 -->
        <div class="detail-container">
          <div class="detail-title">
            <div class="detail-planName">{{ reviewDetail.planName }}</div>
            <div class="detail-planTime">
              <img src="@/assets/imgs/oa/label_icon.png" style="margin-right: 5px" />
              {{ reviewDetail.planningTime }}
            </div>

            <div class="detail-tip">{{
              reviewDetail.productType == 0
                ? '买手款'
                : reviewDetail.productType == 1
                  ? '定制款'
                  : ''
            }}
            </div>
            <div class="detail-tip">{{ selectItem.designName }}</div>
          </div>
          <div class="deatil-bottom-wrapper">
            <div class="detail-content">
              <div class="detail-content-row">
                <div class="detail-content-row-item">
                  <div class="detail-content-row-item-label">品类</div>
                  <div class="detail-content-row-item-value">
                    {{
                      (selectItem.category &&
                        getNameByCode &&
                        getNameByCode[selectItem.category]) ||
                      ''
                    }}</div>
                </div>
                <div class="detail-content-row-item">
                  <div class="detail-content-row-item-label">系列</div>
                  <div class="detail-content-row-item-value">{{ selectItem.classCode }}</div>
                </div>
              </div>
              <div class="detail-content-row">
                <div class="detail-content-row-item">
                  <div class="detail-content-row-item-label">品类卖点</div>
                  <el-popover placement="bottom" :width="420" trigger="hover"
                    :disabled="getIsSalePointOverflow(reviewDetail.salePoint)">
                    <div class="salePointBg">
                      <ElScrollbar max-height="260px">
                        <div class="salePointBg-content" v-html="reviewDetail.salePoint"></div>
                      </ElScrollbar>
                    </div>
                    <template #reference>
                      <div class="detail-content-row-item-value" style="max-width: 420px">{{
                        getDisplaySalePoint(reviewDetail.salePoint)
                      }}</div>
                    </template>
                  </el-popover>
                </div>
              </div>
            </div>
            <div class="detail-img">
              <el-image :src="formatOnePic(selectItem.productPicture) ||
                'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/newProduct/default_design.png'
                " hide-on-click-modal preview-teleported :preview-src-list="[formatOnePic(selectItem.productPicture)]"
                class="productPicture" />
            </div>
          </div>
        </div>
        <div style="
            display: flex;
            flex-direction: column;

            background: #ffffff;
          ">
          <div v-for="(item, index) in form.list" :key="index" class="progressItem"
            :class="{ progressItem1: index === form.list.length - 1 }">
            <div v-if="item.Editable || item.sampleProgressContent" class="progressItem-time">{{
              item.sampleProgressTime
            }}</div>
            <div class="row-center">
              <div v-if="item.Editable || item.sampleProgressContent" class="progressItem-info">
                <el-input v-if="item.Editable" class="progressItem-info-edit" v-model="item.editSampleProgressContent"
                  placeholder="请输入进度信息" :autosize="{ minRows: 2, maxRows: 2 }">
                  <!-- @keyup.enter="saveEditInfo(item)"
              @blur="saveEditInfo(item)" -->
                  <template #suffix>
                    <div v-if="item.Editable" class="cursor_pointer"
                      style="display: flex; align-items: center; margin-left: 10px">
                      <img src="@/assets/imgs/sysConstantForm/edit_success.png" @click="saveEditInfo(item)" alt="提交" />
                      <div class="line"> | </div>
                      <img src="@/assets/imgs/sysConstantForm/edit_error.png" @click="item.Editable = false" alt="取消" />
                    </div>
                  </template>
                </el-input>
                <div v-else class="progressItem-info-text" @dblclick="handleDoubleClick(item)">{{
                  item.sampleProgressContent
                }}</div>
              </div>
              <div v-if="!isOnlyView() && (item.Editable || item.sampleProgressContent)" class="progressItem-delete"
                @click="deleteClick(item)" style="margin-left: auto; cursor: pointer; font-size: 14px; color: #eb3737">
                删除
              </div>
            </div>
          </div>
          <div v-if="form.list.length === 0" style="padding: 16px">暂无打样进度</div>
        </div>
      </ElScrollbar>

      <div class="dialog-footer" v-if="!isOnlyView()">
        <div class="row-center" style="margin-bottom: 10px; margin-top: 15px; cursor: pointer">
          <img src="@/assets/imgs/oa/add-fill.png" style="width: 14px; height: 14px; margin-right: 7px" />
          <div style="font-size: 14px; color: #0064ff">新进度填写（双击历史的进度文本可进行编辑）</div>
        </div>
        <s-text-area v-model="form.content" placeholder="请输入进度信息" style="width: 100%; margin-bottom: 15px"
          :autosize="{ minRows: 3, maxRows: 3 }" />
        <!-- <el-button @click="handleClose" :disabled="currentUploadStatus">取消</el-button> -->
        <el-button type="primary" :loading="currentUploadStatus" @click="confirmDialog"
          :disabled="currentUploadStatus || !form.content">提交</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import {
  getDesignBasicInfo,
  sampleProgressList,
  sampleProgressSave,
  sampleProgressUpdate,
  sampleProgressDelete
} from '@/api/oa/new/designGallery/index'
import { useCategoryConfig } from '@/views/OA/new/designGallery/hooks'
const { getNameByCode } = useCategoryConfig()
const message = useMessage() // 消息弹窗
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: '打样进度'
  },
  width: {
    type: String,
    default: '745px'
  },

  selectItem: {
    type: Object,
    default: () => ({})
  }
})
const form = reactive({
  content: '',
  list: []
})

watch(
  () => props.selectItem,
  (newVal) => {
    if (!newVal) return
  },
  { deep: true, immediate: true }
)

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const visible = ref(props.modelValue)
const currentUploadStatus = ref(false)

// 是否z只读
const isOnlyView = () => {
  if (
    props.selectItem &&
    (props.selectItem.chooseStatus === '2' || props.selectItem.chooseStatus === '4')
  ) {
    return true
  }
  return false
}

watch(
  () => props.modelValue,
  (newVal) => {
    visible.value = newVal
    resetForm()
    if (props.selectItem.developmentPlanId) {
      getReviewDetail()
    }

    getList()
  }
)

const handleClose = () => {
  form.content = ''
  form.list = []
  emit('update:modelValue', false)
  emit('cancel')
}

const resetForm = () => {
  form.content = ''
  form.list = []
  reviewDetail.value = {}
}

const getList = async () => {
  if (props.selectItem.id) {
    const data = await sampleProgressList({
      id: props.selectItem.id
    })
    if (data) {
      form.list = data || []
    }
  }
}

// 删除按钮点击
const deleteClick = async (item) => {
  // 删除二次确认
  await message.confirm('确认删除吗？')
  await sampleProgressDelete({
    id: props.selectItem.id,
    sampleProgressContent: item.sampleProgressContent,
    sampleProgressId: item.sampleProgressId
  })
  message.success('删除成功')
  getList()
}

/** 双击事件 */
const handleDoubleClick = (item) => {
  if (isOnlyView()) {
    return
  }
  item['Editable'] = true
  item.editSampleProgressContent = item.sampleProgressContent
}

/**
 * 保存
 */
const saveEditInfo = async (item) => {
  if (item.editSampleProgressContent) {
    item.editSampleProgressContent = item.editSampleProgressContent.replace(/\n/g, '')
  }
  await sampleProgressUpdate({
    id: props.selectItem.id,
    sampleProgressContent: item.editSampleProgressContent,
    sampleProgressId: item.sampleProgressId
  })
  item['Editable'] = false
  item.sampleProgressContent = item.editSampleProgressContent
}

// 获取设计图详情
const reviewDetail = ref({}) //预览信息
const getReviewDetail = async () => {
  const params = {
    devPlanId: props.selectItem.developmentPlanId
  }
  const res = await getDesignBasicInfo(params)
  reviewDetail.value = res
  console.log('reviewDetail', reviewDetail.value)
}

// 是否展示品类卖点
const getPlainText = (html) => {
  if (!html) return '【--】'
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html
  return (tempDiv.textContent || tempDiv.innerText || '').trim()
}

// 截断显示的方法
const getDisplaySalePoint = (salePoint) => {
  const plainText = getPlainText(salePoint)
  const maxLength = 96
  return plainText.length <= maxLength ? plainText : plainText.slice(0, maxLength) + '...'
}

// 是否溢出的方法
const getIsSalePointOverflow = (salePoint) => {
  const plainText = getPlainText(salePoint)
  const maxLength = 96
  return plainText.length < maxLength
}
// 显示第一张设计图
const formatOnePic = (url) => {
  if (url) {
    return url.split(',')[0]
  }
  return ''
}

const confirmDialog = async () => {
  console.log('id', props.selectItem.id)
  currentUploadStatus.value = true

  if (form.content) {
    form.content = form.content.replace(/\n/g, '')
  }

  await sampleProgressSave({
    id: props.selectItem.id,
    sampleProgressContent: form.content
  }).catch(() => {
    currentUploadStatus.value = false
  })
  currentUploadStatus.value = false
  form.content = ''
  getList()
  emit('confirm')
}
</script>

<style scoped lang="scss">
:deep(.textarea) {
  .el-textarea__inner {
    resize: none;
  }
}

.dialog-footer {
  text-align: right;
}

.my-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .shenhe-title {
    width: 14px;
    height: 14px;
    margin-right: 6px;
    vertical-align: middle;
    margin-top: -2px;
  }

  img {
    width: 16px;
    height: 16px;
  }
}

:deep(.el-upload--picture-card) {
  width: 146px;
  height: 146px;
  border: none;
}

.progressItem {
  padding-left: 16px;
  padding-right: 16px;
  border-bottom: 1px solid #e5e5e5;
  cursor: pointer;

  &-info {
    max-width: calc(100% - 50px);
    min-width: calc(100% - 50px);
    margin-top: 8px;
    margin-bottom: 16px;

    &-text {
      font-weight: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #333333;
    }

    &-edit {
      width: 542px;
    }
  }

  &-time {
    margin-top: 16px;
    font-size: 14px;
    font-weight: 600;
    line-height: normal;
    letter-spacing: normal;
    color: #333333;
  }
}

.progressItem1 {
  border-bottom: none;
}

// 分隔线
.line {
  color: #b3bac9;
  margin: 0 6px;
}

// 预览信息
.detail-container {
  width: 670px;
  border-radius: 10px;
  background: #f8f8f8;
  padding: 16px 20px;
  box-sizing: border-box;

  .detail-title {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 15px;
    box-sizing: border-box;

    &:before {
      content: '';
      width: 2.98px;
      height: 10px;
      background: #0064ff;
      margin-right: 10px;
    }

    .detail-planName {
      font-size: 14px;
      font-weight: bold;
      color: #333333;
      margin-right: 20px;
    }

    .detail-planTime {
      color: #666666;
      font-size: 14px;
      margin-right: 20px;
    }

    .detail-tip {
      padding: 0 10px;
      height: 21px;
      border-radius: 2px;
      background: rgba(253, 230, 176, 0.51);
      line-height: 21px;
      font-size: 10px;
      color: #c68b00;
      margin-right: 10px;
    }
  }

  .deatil-bottom-wrapper {
    display: flex;
    justify-content: space-between;

    .detail-content {
      width: 500px;

      &-row {
        display: flex;
        justify-content: space-between;
        margin: 10px 0;

        &-item {
          display: flex;
          flex: 1;
          font-size: 14px;
          margin-right: 5px;

          &-label {
            width: 56px;
            text-align: right;
            color: #666666;
          }

          &-value {
            color: #333333;
            max-width: 220px;
            margin-left: 10px;
          }
        }
      }

      .salePointBg {
        display: flex;
        flex-direction: column;
      }
    }

    .detail-img {
      margin-top: 10px;

      .productPicture {
        width: 100px;
        height: 100px;
      }
    }
  }
}
</style>

<style lang="scss">
.oadialog-background {
  border-radius: 20px;
  background-image: url('@/assets/imgs/oa/oa_design_audit_bg.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;

  .dialog-content {
    background: #ffffff;
    border-radius: 20px;
    margin: 0 auto;
    padding-top: 20px;
    box-sizing: border-box;
  }
}
</style>
