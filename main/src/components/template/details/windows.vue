<template>
  <div class="page-details" v-loading="loading">
    <el-dialog
      v-model="visible"
      :show-close="false"
      :width="width"
      :append-to-body="appendToBody"
      :align-center="align"
      :top="top"
      :before-close="handleBeforeClose"
      @closed="closed"
      destroy-on-close
    >
      <template #header="{ close }">
        <slot name="header" :close="close" :title="title">
          <div class="header_txt"> {{ title }}</div>
          <el-icon @click="close" class="header_close">
            <CloseBold />
          </el-icon>
        </slot>
      </template>
      <template #default>
        <slot name="card" />
      </template>
      <template #footer v-if="viewType !== 'view'">
        <div class="contain_btn">
          <slot name="button" />
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="tsx">
export default { name: 'SchemeDialog' }
</script>

<script lang="tsx" setup>
import { DetailProvideType } from '../config/type'
import { ElLoading } from 'element-plus'
import { consistency } from '@/utils'

const visible = ref(false)

const props = defineProps({
  appendToBody: { type: Boolean, default: false },
  align: { type: Boolean, default: true },
  width: { type: Number, default: 500 },
  top: { type: String, default: '15vh' },
  name: { type: String, default: '' }
})

const { dataValue, bukValue, viewType, title, loading } = inject(
  `${props.name}Details`
) as DetailProvideType

const openDialog = async (preCall: Function = () => {}, callback: Function = () => {}) => {
  new Promise(async (resolve: Function) => {
    const loading = ElLoading.service({
      lock: true,
      text: '数据加载中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    await preCall()
    visible.value = true
    loading.close()
    resolve(true)
  }).then((res: any) => {
    !!res &&
      setTimeout(() => {
        callback()
      }, 0)
  })
}

const close = () => {
  handleBeforeClose(() => {
    visible.value = false
  })
}

const closed = () => {
  visible.value = false
}

const handleBeforeClose = (done) => {
  if (viewType.value !== 'view') {
    console.log(dataValue.value, bukValue.value)
    consistency(dataValue.value, bukValue.value, () => {
      done()
    })
  } else {
    done()
  }
}

defineExpose({ openDialog, close, closed })
</script>
<style lang="scss" scoped>
.header_txt {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.header_close,
.header-close {
  cursor: pointer;
  position: absolute;
  right: 20px;
  top: 12px;
}

:deep() {
  .el-dialog {
    padding: 0;
  }

  .el-dialog__header {
    margin: 0px;
    position: relative;
    padding: 12px 20px;
    border-bottom: 1px solid #f0f0f0;
  }

  .el-dialog__body {
    padding: 15px !important;

    .el-form {
      .el-select {
        .el-select__wrapper.is-disabled {
          .el-select__suffix {
            display: none;
          }
        }
      }
    }
  }

  .el-form-item__label {
    color: #666 !important;
  }

  .el-radio__label {
    font-weight: 400;
  }

  .el-dialog__footer {
    border-top: 1px solid #f0f0f0;
    position: relative;
    text-align: right;
    // height: 52px;
    width: 100%;
    padding: 10px 20px;
  }
}
</style>
