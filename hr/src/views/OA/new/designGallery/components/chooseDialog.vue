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
            <div class="detail-tip" v-if="designerName">{{ designerName }}</div>
          </div>
          <div class="deatil-bottom-wrapper">
            <div class="detail-content">
              <div class="detail-content-row">
                <div class="detail-content-row-item">
                  <div class="detail-content-row-item-label">品类</div>
                  <div class="detail-content-row-item-value">
                    {{
                      selectItem.completeCategoryName || '-'
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
      </ElScrollbar>

      <div class="dialog-footer" style="margin-top: 15px; margin-right: 10px">
        <div class="row-center">
          <el-radio-group :disabled="selectItem.chooseStatus === '2' || selectItem.chooseStatus === '4'"
            v-model="form.type" class="saleTimeHeader-radio" @change="radioChange">
            <el-radio label="1" size="large">选中</el-radio>
            <el-radio label="2" size="large">淘汰</el-radio>
          </el-radio-group>
          <!-- <el-button
          
            v-if="selectItem.chooseStatus == '2'"
            type="primary"
            style="margin-left: auto; margin-right: 0px"
            @click="cancelChoose"
            >取消选中</el-button
          > -->
        </div>
        <div class="row" style="margin-top: 15px">
          <div style="color: #ea8787; padding-right: 0px; margin-left: auto">*</div>
          <div style="color: #333; padding-right: 10px; width: 68px">{{ getResonLbl() }}:</div>
          <s-text-area :disabled="selectItem.chooseStatus === '2' || selectItem.chooseStatus === '4'"
            v-model="form.chooseReason" :placeholder="`请输入${getResonLbl()}`"
            style="width: calc(100% - 80px); margin-bottom: 15px" :autosize="{ minRows: 3, maxRows: 3 }" />
        </div>
        <!-- <div
          class="row"
          style="margin-top: -10px; color: #ea8787; font-size: 12px; margin-left: 85px"
        >
          请输入{{ getResonLbl() }}</div
        > -->

        <el-button @click="handleClose">关闭</el-button>
        <el-button v-if="selectItem.chooseStatus === '3'" type="primary" @click="confirmDialog" :loading="loading"
          :disabled="!form.type">保存</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { usePeopleList } from '../hooks'
import { getDesignBasicInfo } from '@/api/oa/new/designGallery/index'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: '选品'
  },
  width: {
    type: String,
    default: '745px'
  },
  designerName: {
    type: String,
    default: ''
  },
  selectItem: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  }
})
const form = reactive({
  type: '',
  chooseReason: ''
})
watch(
  () => props.selectItem,
  (newVal) => {
    if (!newVal) return
    // chooseStatus 选中状态 0 未选中 1选中 2已选中 3 样衣上传后待选中 4 淘汰 -->
    //  examineStatus 审核状态 2 通过 1拒绝
  },
  { deep: true, immediate: true }
)

const cancelChoose = () => {
  emit('cancelChoose', props.selectItem)
}

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel', 'cancelChoose'])

const visible = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newVal) => {
    visible.value = newVal
    resetForm()
    if (props.selectItem.chooseStatus === '2') {
      form.type = '1'
    } else if (props.selectItem.chooseStatus === '4') {
      form.type = '2'
    } else {
      form.type = ''
    }
    form.chooseReason = props.selectItem.chooseReason || ''
    if (props.selectItem.developmentPlanId) {
      getReviewDetail()
    }
  }
)

const handleClose = () => {
  form.type = ''
  form.chooseReason = ''
  emit('update:modelValue', false)
  emit('cancel')
}

const resetForm = () => {
  form.type = ''
  form.chooseReason = ''
  reviewDetail.value = {}
}

const radioChange = () => { }

const getResonLbl = () => {
  if (form.type === '2') {
    return '淘汰理由'
  } else {
    return '选品理由'
  }
}

/** 双击事件 */

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
  if (props.selectItem.chooseStatus === '3') {
    if (!form.chooseReason) {
      ElMessage.warning(`请填写${getResonLbl()}`)
      return
    }
    if (form.chooseReason) {
      form.chooseReason = form.chooseReason.replace(/\n/g, '')
    }
    emit('confirm', form)
  }
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
