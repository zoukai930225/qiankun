<template>
  <div>
    <el-dialog
      ref="dialogRef"
      v-bind="{ ...attrs, ...props }"
      v-model="modelValue"
      :width="width"
      :before-close="handleBeforeClose"
      @open="open"
      class="SWDialog-background"
      :class="{
        'SWDialog-backgroundAudit': backgroundName === 'Audit',
        'SWDialog-backgroundLine': showTitleLine
      }"
      :style="{ 'border-radius': fullscreen ? 0 : '8px' }"
      :fullscreen="fullscreen"
      :append-to-body="true"
      :show-close="false"
      @closed="handleClosed"
    >
      <template #header="{}">
        <div class="flex justify-between">
          <div
            class="SWDialog-header"
            :class="{ 'SWDialog-headerAudit': backgroundName === 'Audit' }"
          >
            <img
              v-if="titleIcon"
              :src="titleIcon"
              class="header-icon"
              :style="{ width: titleIconWidth, height: titleIconHeight }"
            />
            <span style="font-size: 16px; font-weight: 500; color: #333333">{{ title }}</span>
            <img
              v-if="titleWarnIcon"
              :src="titleWarnIcon"
              class="header-warnIcon"
              :style="{ width: titleWarnIconWidth, height: titleWarnIconWidth }"
            />
            <span
              v-if="titleWarn"
              style="font-size: 14px; font-weight: 400"
              :style="{ color: titleWarnColor }"
              >{{ titleWarn }}</span
            >
          </div>

          <div class="flex items-start color-#666">
            <el-link
              v-if="showFullScreen"
              @click="fullscreen = !fullscreen"
              :underline="false"
              class="mr-12px"
            >
              <Icon :icon="fullscreen ? 'zmdi:fullscreen-exit' : 'zmdi:fullscreen'" :size="16" />
            </el-link>

            <el-link :underline="false" @click="dialogRef?.handleClose()">
              <el-icon :size="16"><Close /></el-icon>
            </el-link>
          </div>
        </div>
      </template>

      <slot></slot>
      <template #footer>
        <div class="SWDialog-footer" :class="{ 'SWDialog-footer1': showBottomLine }">
          <slot name="footer"></slot>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
export interface SwDialogInstance extends Partial<DialogInstance> {}
</script>

<script lang="ts" setup>
import { DialogInstance } from 'element-plus'
import { defineProps, computed, onMounted } from 'vue'
import { useAttrs } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  showTitleLine: {
    type: Boolean,
    default: false
  },
  showBottomLine: {
    type: Boolean,
    default: false
  },
  titleIcon: {
    type: Object,
    default: null
  },
  titleIconWidth: {
    type: String,
    default: '16px'
  },
  titleIconHeight: {
    type: String,
    default: '16px'
  },
  titleWarnIcon: {
    type: Object,
    default: null
  },
  titleWarnIconWidth: {
    type: String,
    default: '20px'
  },
  titleWarn: {
    type: String,
    default: ''
  },
  titleWarnColor: {
    type: String,
    default: '#EB3737'
  },
  width: {
    type: String,
    default: '560px'
  },
  modelValue: {
    type: Boolean,
    default: false
  },
  backgroundName: {
    // 默认为空 如果有进行扩展比如 Audit
    type: String,
    default: ''
  },
  beforeClose: {
    type: Function,
    default: null
  },
  showFullScreen: {
    type: Boolean,
    default: false
  }
})

const modelValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
const emit = defineEmits(['update:modelValue', 'open', 'close', 'closed'])

const attrs = useAttrs()
const dialogRef = ref()
const fullscreen = ref(false)

onMounted(() => {})

const open = () => {
  emit('open')
}
const handleBeforeClose = (done) => {
  if (props.beforeClose) {
    props.beforeClose(() => {
      emit('update:modelValue', false)
      emit('close')
      done()
    })
  } else {
    emit('update:modelValue', false)
    emit('close')
    done()
  }
}

function handleClosed() {
  emit('closed')
}

function handleClose() {
  emit('update:modelValue', false)
}

defineExpose({ handleClose, $el: () => dialogRef.value.$el })
</script>

<style scoped lang="scss">
.SWDialog-header {
  margin-top: 0px;
  display: flex;
  flex-direction: row;
  align-items: center;

  img {
    margin-right: 10px;
  }
}

.SWDialog-footer {
  padding-top: auto;
}

.SWDialog-footer1 {
  margin-left: -16px;
  width: calc(100% + 32px);
  border-top: 1px solid #eceaea;
}
</style>

<style lang="scss">
.SWDialog-background {
  background: #ffffff;

  .el-dialog {
    padding: 0px !important;
  }

  :deep(.el-dialog) {
    padding: 0px !important;
  }

  .el-dialog__header {
    margin-left: -16px;
    padding-left: 16px;
  }
}

.header-warnIcon {
  margin-left: 10px;
  margin-right: 6px;
}

.SWDialog-backgroundLine {
  .el-dialog__header {
    margin-left: -16px;
    margin-right: 16px;
    padding-left: 16px;
    padding-right: 16px;
    box-sizing: border-box;
    border-width: 0px 0px 1px 0px;
    border-style: solid;
    border-color: #f0f0f0;
    width: calc(100% + 32px);
  }
}

.SWDialog-backgroundAudit {
  background-image: url('@/assets/imgs/oa/oa_design_audit_bg.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>

<style lang="scss" scoped>
:deep(.el-dialog) {
  padding: 0px !important;
}

:deep(.el-dialog.is-fullscreen) {
  border-radius: 0 !important;
}
</style>
