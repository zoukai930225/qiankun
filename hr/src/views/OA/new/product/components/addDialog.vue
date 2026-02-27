<!--
 * @Date: 2024-12-05 13:54:45
-->
<template>
  <div>
    <el-drawer
      v-model="isVisible"
      :with-header="false"
      size="918"
      @close="reset"
      :append-to-body="true"
    >
      <div class="drawer-wapper">
        <div class="content-wapper">
          <div class="flex-row title-wapper">
            <div class="title">查看</div>
            <img
              src="@/assets/imgs/system/fieldManageConfig/close.png"
              class="close"
              @click="reset"
            />
          </div>
          <div>
            <!-- 企划信息 -->
            <PlanDetailForm :reviewDetail="reviewDetail" />
            <!-- 设计图 -->
            <DesignDetailForm v-model="designForm" />
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
} from '@/api/oa/new/designGallery/index'
import { getBasicAttribute } from '@/api/oa/new/plan/index'
import DesignDetailForm from './formComponents/designDetailForm.vue'
import PlanDetailForm from './formComponents/planDetailForm.vue'
const message = useMessage() // 消息弹窗
const isVisible = ref(false)

// 产品编码
const productCodeForm = ref({
  productCode: ''
})

// 设计图
const designForm = ref()

// 设计信息
const designInformationForm = ref({})

// 定义类型
interface Field {}
const props = defineProps({
  fields: {
    type: Array as PropType<Field[]>,
    default: () => []
  }
})

const currentId = ref() // 当前编辑的 id
const currentItem = ref() // 当前编辑的 item
const open = async (item?) => {
  isVisible.value = true
  currentItem.value = item
  productCodeForm.value = {
    productCode: ''
  }
  await getConfig() //配置文件
  getReviewDetail(item.developmentPlanId) //review 详情
  // 编辑
  if (item.id) {
    currentId.value = item.id
    const res = await getDesignDetailById(item.id) //回显详情
    console.log('resqq', res)

    designInformationForm.value = {
      ...res,
      color: res.color ? JSON.parse(res.color) : [], //颜色
      jsonData: res.jsonData ? JSON.parse(res.jsonData) : {},
      size: res.size ? JSON.parse(res.size) : {}, //尺寸
      washLabel: res.washLabel
        ? res.washLabel.split(',').map((item) => {
            return item
          })
        : [], //水洗标识
      tmPicture: res.tmPicture
        ? res.tmPicture.split(',').map((item) => {
            return item
          })
        : [] //烫唛照片
    } //设计信息
    productCodeForm.value = {
      //产品编码
      productCode: res.productCode
    }
    // 设计图片
    designForm.value = {
      ...res,
      productPicture: res.productPicture
        ? res.productPicture.split(',').map((item) => {
            return item
          })
        : [] //产品图片
    }

    designForm.value.examineInfos = JSON.parse(res.examineInfos)
  }
}

const configList = ref([]) // 配置列表
// 获取配置
const getConfig = async () => {
  const params = {
    code: 'DesignGallery'
  }
  const res = await getBasicAttribute(params)
  configList.value = res || []
}

const reviewDetail = ref() //预览信息
const getReviewDetail = async (id) => {
  const params = {
    devPlanId: id
  }
  const res = await getDesignBasicInfo(params)
  reviewDetail.value = res
  console.log('reviewDetail', reviewDetail.value)
}

const save = async () => {
  try {
    let washLabel = undefined
    // @ts-ignore
    if (designInformationForm.value.washLabel) {
      // @ts-ignore
      washLabel = designInformationForm.value.washLabel
        // @ts-ignore
        .map((item) => {
          return item?.response?.data?.ossPath || item.url
        })
        .join(',')
    }

    let tmPicture = undefined
    // @ts-ignore
    if (designInformationForm.value.tmPicture) {
      // @ts-ignore
      tmPicture = designInformationForm.value.tmPicture
        // @ts-ignore
        .map((item) => {
          return item?.response?.data?.ossPath || item.url
        })
        .join(',')
    }

    let productPicture = undefined
    // @ts-ignore
    if (designForm.value?.productPicture) {
      // @ts-ignore
      productPicture = designForm.value?.productPicture
        // @ts-ignore
        .map((item) => {
          return item?.response?.data?.ossPath || item.url
        })
        .join(',')
    }
    const data = {
      developmentPlanId: currentItem.value.devPlanId, //开发任务id
      enterprisePlanId: reviewDetail.value.npBusinessEnterprisePlanId, //企划id
      planCode: reviewDetail.value.planCode, //任务编号
      ...designInformationForm.value, //设计信息
      washLabel: washLabel, //水洗标识
      tmPicture: tmPicture, //烫唛照片
      ...designForm.value, //设计图
      productPicture: productPicture, //
      ...productCodeForm.value //编码
    }
    if (currentItem.value.id) {
      await updateDesign(data)
      message.success('操作成功')
      emit('success')
      reset()
    } else {
      await saveDesign(data)
      message.success('操作成功')
      emit('success')
      reset()
    }
  } catch (error) {
    console.log('error', error)
  }
}

const reset = () => {
  isVisible.value = false
  currentId.value = ''
  currentItem.value = {}
  reviewDetail.value = {}
  designInformationForm.value = {}
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
:deep(.el-drawer__body){
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
  background: #f6f6f6;
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
