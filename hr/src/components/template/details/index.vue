<template>
  <div class="page-details">
    <el-drawer v-model="visible" :wrapper-closable="true" :size="width" @closed="closed" :append-to-body="appendToBody"
      :before-close="handleBeforeClose" :show-close="false" destroy-on-close>
      <template #header="{ close }">
        <div class="header_txt"> {{ title }}</div>
        <el-icon @click="close" class="header_close">
          <CloseBold />
        </el-icon>
      </template>
      <template #default>
        <div class="contain_view">
          <el-card shadow="never" class="card_info">
            <el-scrollbar>
              <slot name="card" />
            </el-scrollbar>
          </el-card>
        </div>
      </template>
      <template #footer v-if="viewType !== 'view'">
        <div class="contain_btn">
          <slot name="button" />
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="tsx">
export default { name: 'SchemeDetails' }
</script>

<script lang="tsx" setup>
import { DetailProvideType } from '../config/type'
import { consistency } from '@/utils'

const visible = ref(false)

const props = defineProps({
  appendToBody: { type: Boolean, default: false },
  width: { type: Number, default: 600 },
  name: { type: String, default: '' },
  beforeClose: { type: Function, default: () => { } }
})

const { dataValue, bukValue, viewType, title } = inject(
  `${props.name}Details`
) as DetailProvideType

const emit = defineEmits<{
  (e: 'closed'): void
}>()

const openDrawer = async (preCall: Function = () => { }, callback: Function = () => { }) => {
  new Promise(async (resolve: Function) => {
    const loading = ElLoading.service({
      lock: true, text: '数据加载中...', background: 'rgba(0, 0, 0, 0.7)', closed: () => {
        visible.value = true
      }
    });
    await preCall()
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
  emit('closed')
}

const handleBeforeClose = (done) => {
  // 关闭窗口特殊处理
  props.beforeClose()
  if (viewType.value !== 'view') {
    consistency(dataValue.value, bukValue.value, () => {
      done()
    })
  } else {
    done()
  }
}

defineExpose({ openDrawer, close, closed })
</script>
<style lang="scss" scoped>
@use '@/styles/drawer.scss';

.header_txt {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.header_close {
  cursor: pointer;
  float: right;
}

.contain_btn {
  position: absolute;
  right: 20px;
}

:deep() {
  .el-drawer__header {
    margin: 0px;
    padding: 12px 20px;
    border-bottom: 1px solid #f0f0f0;
  }

  .el-drawer__body {
    padding: 15px !important;
    background-color: #f8f8f9 !important;
  }

  .el-form-item__label {
    color: #666 !important;
  }

  .el-radio__label {
    font-weight: 400;
  }

  .el-drawer__footer {
    position: relative;
    display: inline-flex;
    text-align: right;
    background: #fff;
    height: 32px;
    width: calc(100% - 40px);
    padding: 10px 20px;
  }
}

.card_info {
  border-radius: 10px;
  height: 100%;
  border: none;

  :deep() {
    .el-card__body {
      padding: 18px 20px !important;
      height: calc(100% - 32px);

      .el-form {
        .el-select {
          .el-select__wrapper.is-disabled {
            .el-select__suffix {
              display: none;
            }
          }
        }

        .el-cascader.is-disabled {
          .el-input__wrapper .el-input__suffix {
            display: none;
          }
        }
      }
    }
  }
}

.contain_view {
  height: 100%;

  :deep(.el-card__header) {
    padding: 10px;
  }
}

.drawer {
  .el-drawer__header {
    margin-bottom: 0;

    .el-drawer__title {
      font-size: 14px;
      color: #333333;
      line-height: 20px;
      font-style: normal;
    }
  }
}
</style>
