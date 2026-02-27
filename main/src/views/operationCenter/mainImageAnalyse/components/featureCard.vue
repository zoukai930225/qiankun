<template>
  <div class="wrapper">
    <div class="title">
      <div class="label">
        <div>{{ index + 1 }}</div>
      </div>
      <div class="btn" v-if="isEdit">
        <el-icon class="icon" color="#0064FF" @click="handleEdit" size="16">
          <Edit />
        </el-icon>
        <img src="@/assets/imgs/oa/mainImg/del.svg" alt="" @click="handleDel" />
      </div>
    </div>
    <el-form label-position="top" label-width="auto" :model="featuresParams" style="max-width: 387px" class="form">
      <el-form-item label="属性（款式，材质，工艺，参数）">
        <s-text-area v-model="featuresParams.attributeType" :readonly="true" :resize="'none'" :disabled="!isEdit" />
      </el-form-item>
      <el-form-item label="属性用处">
        <s-text-area v-model="featuresParams.attributeUse" :readonly="true" :resize="'none'" :disabled="!isEdit" />
      </el-form-item>
      <el-form-item label="用处的优势">
        <s-text-area v-model="featuresParams.advantage" :readonly="true" :resize="'none'" :disabled="!isEdit" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
const message = useMessage() // 消息弹窗

const props = defineProps({
  forms: {
    type: Object as any,
    default: () => { }
  },
  index: {
    type: Number,
    default: 0
  },
  isEdit: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['delete', 'update'])

const featuresParams: any = computed({
  get: () => {
    return props.forms || {}
  },
  set: (val: {}) => { }
})

const handleEdit = () => {
  emit('update', 'features', props.forms.id)
}
const handleDel = () => {
  emit('delete', props.forms.id, 'features')
}

onMounted(() => { })

onUnmounted(() => { })
</script>

<style scoped lang="scss">
.wrapper {
  width: 427px;
  height: 413px;
  background: #f8f8f9;
  border-radius: 4px;
  margin-bottom: 20px;

  .title {
    height: 30px;
    width: 100%;
    position: relative;

    .label {
      position: absolute;
      top: 0;
      left: 0;
      width: 20px;
      height: 16px;
      background: rgba(0, 100, 255, 0.28);
      border-radius: 4px 0px 4px 0px;
      display: flex;
      align-items: center;

      div {
        font-size: 10px;
        color: #fff;
        margin: 0 auto;
      }
    }

    .btn {
      position: absolute;
      top: 12px;
      right: 12px;
      display: flex;
      align-items: center;

      .icon {
        margin-right: 10px;
        cursor: pointer;

        &:hover {
          opacity: 0.8;
        }
      }

      img {
        cursor: pointer;

        &:hover {
          opacity: 0.8;
        }
      }
    }
  }

  &:nth-child(1) {
    .title {
      .label {
        background: #ff6634;
      }
    }
  }

  &:nth-child(2) {
    .title {
      .label {
        background: #2bcc3a;
      }
    }
  }

  &:nth-child(3) {
    .title {
      .label {
        background: #ffcb33;
      }
    }
  }

  &:nth-child(4) {
    .title {
      .label {
        background: #33c0fe;
      }
    }
  }

  &:nth-child(5) {
    .title {
      .label {
        background: #0064ff;
      }
    }
  }

  .form {
    padding: 0 19px 24px 18px;

    :deep(.el-textarea__inner) {
      background-color: #fff !important;
      box-shadow: none !important;
      width: 387px;
      height: 84px;
      border-radius: 5px;
    }

    :deep(.el-form-item) {
      margin-bottom: 0;
    }

    :deep(.el-form-item--label-top .el-form-item__label) {
      padding-left: 10px;
      margin-top: 6px;
      margin-bottom: 4px;
      color: #333;
      font-weight: 700;
    }
  }
}
</style>
