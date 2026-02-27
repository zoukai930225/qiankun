<template>
  <div class="drawer-wrapper">
    <el-drawer v-model="isShow" :with-header="false" :wrapper-closable="true" class="drawer">
      <div>
        <div class="drawerTitle">
          <div>查看</div>
          <div @click="emit('handleClose')">
            <el-icon>
              <CloseBold />
            </el-icon>
          </div>
        </div>
      </div>
      <el-form label-position="right" label-width="110px" :model="formData">
        <el-form-item label="渠道">
          <el-input v-model="formData.channelName" readonly />
        </el-form-item>
        <el-form-item label="店铺">
          <el-input v-model="formData.storeName" readonly />
        </el-form-item>
        <el-form-item label="商品ID">
          <el-input v-model="formData.goodsId" readonly />
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="formData.goodsName" readonly />
        </el-form-item>
        <el-form-item label="计划名称">
          <el-input v-model="formData.planName" readonly />
        </el-form-item>
        <el-form-item label="营销场景">
          <el-input v-model="formData.marketingScene" readonly />
        </el-form-item>
        <el-form-item label="运营人员">
          <el-input v-model="formData.operateName" readonly />
        </el-form-item>
        <el-form-item label="责任人">
          <el-input v-model="formData.directorName" readonly />
        </el-form-item>
        <el-form-item label="处理人">
          <el-input v-model="formData.processPerson" readonly />
        </el-form-item>
        <el-form-item label="处理时间">
          <el-input v-model="formData.groundingTime" readonly />
        </el-form-item>
        <el-form-item label="处理说明">
          <s-text-area :autosize="{ minRows: 5 }" v-model="formData.operationRemark" readonly />
        </el-form-item>
        <el-form-item v-if="fileName" label="附件">
          <el-link :underline="false" type="primary" @click="downloadByUrl2(formData.attachmentUrl, fileName)">{{
            fileName }}</el-link>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { downloadByUrl2 } from '@/utils/download'
import { ElForm, ElFormItem, ElInput } from 'element-plus'

const props = defineProps<{
  visible: boolean
  detail: any
}>()
const emit = defineEmits(['handleClose'])

const formData = computed({
  get: () => {
    console.log(props.detail)

    return props.detail
  },
  set: (val) => console.log(val)
})

const isShow = computed({
  get: () => {
    return props.visible
  },
  set: () => {
    emit('handleClose')
  }
})
const fileName = computed(() => {
  if (formData.value.attachmentUrl) {
    const url = new URL(formData.value.attachmentUrl)
    const params = new URLSearchParams(url.search)
    return params.get('attname')
  } else {
    return ''
  }
})
</script>
<style lang="less" scoped>
// 尺码范围
:deep(.el-tag, .el-tag.el-tag--primary) {
  background-color: #fae8d066;
  border-radius: 15px;
}

:deep(.el-upload-list__item) {
  width: 110px;
  height: 110px;
}

:deep(.el-upload-list--text) {
  display: flex;
}

:deep(.el-upload--picture-card) {
  width: 110px;
  height: 110px;
  border: none;
}

// 修改表单label的行高
:deep(.longlabel .el-form-item--default .el-form-item__label) {
  line-height: 1.5;
}

// 修改备注的文本框背景
:deep(.el-textarea__inner),
:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  background-color: #f8f8f9 !important;
  box-shadow: none !important;
}

:deep(.el-drawer) {
  border-top-left-radius: 16px !important;
  border-bottom-left-radius: 16px !important;
  overflow: hidden !important;
}

// 背景
:deep(.el-drawer__body) {
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;
}

.drawer-wrapper {
  overflow: hidden;
  border-radius: 16px;
}

.drawerTitle {
  font-size: 14px;
  display: flex;
  color: #333333;
  font-weight: 600;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin: 0 0 18px 0;
}

.drawerContent {
  width: 100%;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  margin-bottom: 12px;

  &-title {
    margin: 0 0 18px 0;
    display: flex;
    align-items: center;
    font-size: 14px;
  }

  .drawerContent-title-icon {
    width: 3px;
    height: 10px;
    background: #0064ff;
    margin-right: 6px;
  }

  .tips {
    margin: 0 0 16px 80px;
    color: #2693f8;
    font-size: 14px;

    &-important {
      color: #eb3737;
    }

    img {
      width: 12px;
    }
  }

  &-disabledInput {
    width: 340px;
    padding: 0 16px;
    min-height: 32px;
    box-sizing: border-box;
    background-image: url(@/assets/imgs/common/input_disabled.png);
    background-repeat: no-repeat;
  }

  .disabledInput_cover {
    background-image: url(@/assets/imgs/common/input_disabled_cover.png);
    width: 100%;
  }

  .disabledInput_remark {
    background-image: url(@/assets/imgs/common/input_disabled_remark.png);
    width: 100%;
    min-height: 92px;
  }
}

.drawerFooter {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}

:deep(.el-link__inner) {
  padding-left: 11px;
}
</style>
