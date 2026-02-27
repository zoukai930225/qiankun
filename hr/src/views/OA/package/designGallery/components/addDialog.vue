<!--
 * @Date: 2024-12-05 13:54:45
-->
<template>
  <div>
    <el-drawer
      v-model="isVisible"
      :with-header="false"
      size="968"
      @close="reset"
      :close-on-click-modal="false"
    >
      <div
        class="drawer-wapper"
        v-loading="currentUploadStatus"
        element-loading-text="设计图上传中，请稍候..."
      >
        <div
          class="content-wapper"
          v-loading="saveLoading"
          element-loading-text="正在保存,请稍候..."
        >
          <div class="flex-row title-wapper">
            <div class="title">{{ dialogTitle }}</div>
            <img
              src="@/assets/imgs/system/fieldManageConfig/close.png"
              class="close"
              @click="reset"
              alt="关闭"
            />
          </div>
          <div>
            <!-- 企划信息 -->
            <PlanDetailForm :reviewDetail="reviewDetail" />
            <!-- 设计图 -->
            <DesignDetailForm
              ref="designDetailFormRef"
              v-model="designForm"
              :openType="openType"
              @upload-status="getUploadStatus"
            />
          </div>

          <div class="btn-wapper">
            <el-button @click="reset">取消</el-button>
            <el-button type="primary" @click="save" v-if="openType != 'view'">保存</el-button>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import {
  getDesignBasicInfo,
  getDesignDetailById,
  saveDesign,
  updateDesign
} from '@/api/oa/package/designGallery/index'
import { debounce } from 'lodash-es'
import DesignDetailForm from './formComponents/designDetailForm.vue'
import PlanDetailForm from './formComponents/planDetailForm.vue'

const message = useMessage() // 消息弹窗
const isVisible = ref(false)

// 设计图
const designForm = ref()

// 定义类型
interface Field {}
const props = defineProps({
  fields: {
    type: Array as PropType<Field[]>,
    default: () => []
  }
})

const openType = ref('') // 打开类型 -edit 编辑 -view 查看
const dialogTitle = ref('')
const currentId = ref() // 当前编辑的 id
const currentItem = ref() // 当前编辑的 item

const open = async (item?, type?) => {
  designForm.value = {}
  reviewDetail.value = {}
  isVisible.value = true
  openType.value = type
  currentItem.value = item
  if (type === 'view') {
    dialogTitle.value = '详情'
  } else if (type === 'edit') {
    dialogTitle.value = '编辑'
  } else {
    dialogTitle.value = '新增'
  }

  // 编辑
  if (item.designGalleryId) {
    currentId.value = item.designGalleryId //当前编辑的id
    const res = await getDesignDetailById(item.designGalleryId) //回显详情
    reviewDetail.value = res || {} //企划详情
    reviewDetail.value.imageList = res.referencePicture
      ? res.referencePicture
          .split(',')
          .map((el) => ({ name: el?.split('?')[1]?.split('=')[1] || '', url: el }))
      : []
    // 设计图片
    designForm.value = {
      ...res,
      productPicture: res.productPictureUrl
        ? res.productPictureUrl.split(',').map((item) => {
            return {
              url: item
            }
          })
        : [], //产品图片
      remark: res.productPictureRemark
    }
  } else {
    getReviewDetail(item.taskId || item.devPlanId) //review 详情
  }
}

const reviewDetail = ref<any>() //预览信息
const getReviewDetail = async (id) => {
  const res = await getDesignBasicInfo(id)
  console.log('reviewDetail', res)
  reviewDetail.value = res || {}

  reviewDetail.value.imageList = res.referencePicture
    ? res.referencePicture
        .split(',')
        .map((el) => ({ name: el?.split('?')[1]?.split('=')[1] || '', url: el }))
    : []
}

const saveLoading = ref(false) // 保存 loading

const currentUploadStatus = ref(false) // 当前上传状态 true表示当前设计图在上传中
const getUploadStatus = (status) => {
  currentUploadStatus.value = status
}

const save = debounce(async () => {
  try {
    saveLoading.value = true
    let productPicture = undefined
    let remark = undefined
    // @ts-ignore
    if (designForm.value?.designList) {
      // @ts-ignore
      productPicture = designForm.value?.designList[0]?.productPicture
        // @ts-ignore
        .map((item) => {
          return item?.response?.data?.ossPath || item.url
        })
        .join(',')
      remark = designForm.value?.designList[0]?.remark
    }

    if (designForm.value?.productPicture) {
      // @ts-ignore
      productPicture = designForm.value?.productPicture
        // @ts-ignore
        .map((item) => {
          return item?.response?.data?.ossPath || item.url
        })
        .join(',')
      remark = designForm.value?.remark
    }

    if (currentItem.value.designGalleryId) {
      await updateDesign({
        designGalleryId: currentItem.value.designGalleryId,
        productPictureUrl: designForm.value?.productPicture
          // @ts-ignore
          .map((item) => {
            return item?.response?.data?.ossPath || item.url
          })
          .join(','),
        remark: designForm.value?.remark,
        isEditAgain: currentItem.value.disPlayEditorAgainButton
      })
      message.success('操作成功')
      emit('success')
      reset()
    } else {
      await saveDesign({
        enterprisePlanId: reviewDetail.value.enterprisePlanId, //企划id
        enterprisePlanDetailId: reviewDetail.value.enterprisePlanDetailId, //企划详情id
        developmentTaskId: reviewDetail.value.developmentTaskId, //开发任务id
        remark: remark,
        productPictureUrl: productPicture
      })
      message.success('操作成功')
      emit('success')
      reset()
    }
  } catch (error) {
    console.log('error', error)
  } finally {
    saveLoading.value = false
  }
}, 300)

const reset = () => {
  isVisible.value = false
  currentId.value = ''
  currentItem.value = {}
  reviewDetail.value = {}

  emit('close')
  designForm.value = {}
}

const emit = defineEmits(['cancle', 'success', 'close'])

const close = () => {
  reset()
  isVisible.value = false
}

defineExpose({ open, close })
</script>

<style lang="scss" scoped>
:deep(.el-drawer__body) {
  // background-image: url('@/assets/imgs/drawer_bg.png') !important;
  // background-size: cover !important;
  background: #f6f6f6;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  min-height: 100%;
  background: linear-gradient(102deg, #ecf0f9 0%, #effdfd 100%);
}

.drawer-wapper {
  min-width: 700px;
  // background: #f6f6f6;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  min-height: 100%;
  background: linear-gradient(102deg, #ecf0f9 0%, #effdfd 100%);
}

.title-wapper {
  justify-content: space-between;
  width: 100%;
  margin-bottom: 15px;

  .close {
    width: 23px;
    height: 23px;
    cursor: pointer;
  }

  .title {
    font-size: 14px;
    color: #333333;
    font-weight: 500;
  }
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.btn-wapper {
  display: flex;
  flex-direction: row;
  justify-content: end;
}
</style>
