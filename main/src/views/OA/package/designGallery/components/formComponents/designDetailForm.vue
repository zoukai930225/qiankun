<!--
 * @Date: 2025-02-11 18:11:15
-->
<template>
  <div class="plan-detail">
    <div v-if="!openType">
      <FormTitle title="设计图" :is-show-expand="true" :is-expand="designIsExpand"
        @expand-click="designIsExpand = !designIsExpand" />
      <div v-show="designIsExpand">
        <div v-for="(item, index) in localForm.designList" :key="index"
          style="width: 879px; background: #f0f6fd; border-radius: 4px; margin-bottom: 10px">
          <div class="picListAdd">
            <uploadImg :onlyUploadImg="true" v-model:modelValue="imageList" :disabled="openType === 'view'" />
          </div>

          <el-form :model="item" label-width="60px" :inline="true">
            <el-form-item label="备注">
              <s-text-area v-model="item.remark" style="width: 760px" :rows="3" />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <div v-if="openType">
      <FormTitle title="设计图" />
      <div class="picLists" v-if="openType !== 'view'">
        <uploadImg :onlyUploadImg="true" v-model:modelValue="imageList" />
      </div>
      <preview-image v-else :url="viewUrl" class="picList" :preview-src-list="imageList.map((ims: any) => ims.url)"
        :scale="0.8" />
      <el-form :model="localForm" label-width="auto" :inline="true">
        <el-form-item label="备注">
          <s-text-area v-model="localForm.remark" style="width: 500px" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import PreviewImage from "@/components/common/image/preview.vue";
import STextArea from "@/components/common/input/s-textarea.vue";
import uploadImg from '@/components/SWUoloadFile/index.vue'
import FormTitle from './formTitle.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  openType: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:modelValue', 'uploadStatus'])

const localForm = ref({ ...props.modelValue })
if (!props.openType) {
  localForm.value.designList = [
    {
      productPicture: [],
      remark: ''
    }
  ]
}

const imageList = ref<any>([]), viewUrl = ref<any>('');

watch(
  () => imageList,
  (newForm) => {
    console.log('newForm', newForm.value)
    console.log(props.openType);
    if (newForm.value?.length > 0) {
      localForm.value.productPicture = newForm.value
    } else {
      localForm.value.productPicture = []
    }
  },
  { deep: true }
)

let isInternalUpdate = false

//设计图是否展开
const designIsExpand = ref(true)

const formatOnePic = (urls: any[]) => {
  const list: any = urls.filter((us: any) => us.url).map((us: any) => `${us.url.split(',')[0]}`);
  return list?.length ? list[0] : 'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/newProduct/default_design.png';
}

watch(
  () => props.modelValue,
  (newForm) => {
    if (!isInternalUpdate) {
      if (props.openType) {
        localForm.value = { ...newForm }
        imageList.value = props.openType === 'view' ? (
          localForm.value.productPicture?.length ? localForm.value.productPicture : [{ url: 'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/newProduct/default_design.png' }]
        ) : (localForm.value.productPicture?.length?.length ? localForm.value.productPicture : [{ url: 'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/newProduct/default_design.png' }]);
        viewUrl.value = formatOnePic(localForm.value.productPicture ? localForm.value.productPicture : []);
      } else {
        if (!localForm.value.designList) {
          localForm.value.designList = [
            {
              productPicture: [],
              remark: ''
            }
          ]
        }
      }
    }
    isInternalUpdate = false
  },
  { deep: true, immediate: true }
)

watch(
  localForm,
  (newLocalForm) => {
    isInternalUpdate = true
    emit('update:modelValue', newLocalForm)
  },
  { deep: true }
)
</script>

<style lang="scss" scoped>
.plan-detail {
  width: 100%;
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-sizing: border-box;
  margin-bottom: 20px;
}

.shenhe-detail {
  width: 100%;
  border-radius: 4px;
  background: rgba(240, 246, 253, 0.8);
  padding: 15px 10px;
  box-sizing: border-box;
  margin-bottom: 16px;
}

.disableValue {
  width: 100%;
  height: 32px;
  background: url('@/assets/imgs/oa/disbaleBg.png') no-repeat;
  background-size: 100% 100%;
  line-height: 32px;
  padding: 0 16px;
  box-sizing: border-box;
}

.disableValue1 {
  width: 100%;
  height: 32px;
  background: url('@/assets/imgs/oa/disbaleBg1.png') no-repeat;
  background-size: 100% 100%;
  line-height: 32px;
  padding: 0 16px;
  box-sizing: border-box;
}

:deep(.el-upload--picture-card) {
  width: 146px;
  height: 146px;
  border: none;
}

.picLists {
  margin-bottom: 16px;
  margin-left: 40px;
}

.picList {
  margin-bottom: 16px;
  margin-left: 40px;
  width: 40px;
  height: 40px;
}

.picListAdd {
  margin-bottom: 16px;
  padding-top: 34px;
  margin-left: 40px;
}

.clickAddDesignPhoto {
  margin-left: auto;
  margin-right: auto;
  cursor: pointer;
  margin-top: 14px;
  width: 157px;
  height: 36px;
  border-radius: 4px;
  border: 1px solid #0064ff;
  display: flex;
  flex-direction: row;
  align-items: center;

  img {
    margin-left: 20px;
    margin-right: 10px;
    width: 10px;
    height: 10px;
  }

  &-text {
    font-size: 14px;
    color: #0064ff;
    line-height: 20px;
  }
}
</style>
